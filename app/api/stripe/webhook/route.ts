import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { user_id, plan } = session.metadata!

      // Get subscription from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string)
      const periodEnd = new Date(stripeSub.current_period_end * 1000).toISOString()

      // Get user's charity preference from profile metadata
      const { data: authUser } = await supabase.auth.admin.getUserById(user_id)
      const metadata = authUser?.user?.user_metadata || {}

      // Upsert subscription
      await supabase.from('subscriptions').upsert({
        user_id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan,
        status: 'active',
        charity_id: metadata.charity_id || null,
        charity_percentage: metadata.charity_percentage || 10,
        current_period_end: periodEnd,
      }, { onConflict: 'user_id' })

      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (!invoice.subscription) break

      const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const periodEnd = new Date(stripeSub.current_period_end * 1000).toISOString()

      await supabase.from('subscriptions')
        .update({ status: 'active', current_period_end: periodEnd })
        .eq('stripe_subscription_id', invoice.subscription as string)
      break
    }

    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const obj = event.data.object as any
      const subId = obj.subscription || obj.id
      if (subId) {
        await supabase.from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
