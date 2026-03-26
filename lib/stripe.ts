import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PLANS = {
  monthly: {
    name: 'Monthly',
    price: 1999, // £19.99 in pence
    interval: 'month' as const,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    charity_min_percent: 10,
    pool_contribution: 500, // £5 per subscriber goes to pool
  },
  yearly: {
    name: 'Yearly',
    price: 19999, // £199.99 in pence (discounted)
    interval: 'year' as const,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    charity_min_percent: 10,
    pool_contribution: 5000,
  }
}
