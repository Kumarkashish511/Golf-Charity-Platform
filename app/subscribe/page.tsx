'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Heart, Loader2, Star } from 'lucide-react'

export default function SubscribePage() {
  const [selected, setSelected] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const plans = {
    monthly: { price: '£19.99', period: '/month', total: '£19.99/mo', saving: null, priceId: 'monthly' },
    yearly: { price: '£199.99', period: '/year', total: '£16.67/mo', saving: 'Save £39.89', priceId: 'yearly' },
  }

  const handleSubscribe = async () => {
  setLoading(true)
  try {
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: selected }),
    })
    
    const data = await res.json()
    console.log('Checkout response:', data)
    
    if (data.url) {
      window.location.href = data.url
    } else if (data.error === 'Unauthorized') {
      // Not logged in - redirect to login first
      window.location.href = '/auth/login'
    } else {
      alert('Error: ' + (data.error || 'Unknown error'))
      setLoading(false)
    }
  } catch (err) {
    console.error('Subscribe error:', err)
    alert('Network error - check console')
    setLoading(false)
  }
}

  const features = [
    'Monthly prize draw entries',
    'Stableford score tracking',
    'Charity contribution',
    'Winner verification system',
    'Full dashboard access',
    'Email notifications',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-dark-900 fill-dark-900" />
            </div>
            <span className="font-display text-xl font-bold text-white">GolfGives</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
          <p className="text-white/40">Both plans include everything. Yearly saves you more for charity.</p>
        </div>

        {/* Plan toggle */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {(['monthly', 'yearly'] as const).map(plan => (
            <button
              key={plan}
              onClick={() => setSelected(plan)}
              className={`glass rounded-2xl p-6 text-left transition-all duration-200 ${
                selected === plan ? 'border-brand-500/60 bg-brand-500/5' : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-white capitalize mb-1">{plan}</div>
                  {plans[plan].saving && (
                    <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                      {plans[plan].saving}
                    </span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${selected === plan ? 'border-brand-500 bg-brand-500' : 'border-white/20'}`}>
                  {selected === plan && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-dark-900 rounded-full" /></div>}
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{plans[plan].price}</div>
              <div className="text-white/40 text-sm">{plans[plan].period}</div>
              <div className="text-white/30 text-xs mt-1">{plans[plan].total}</div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-400" /> Everything included
          </div>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to payment...</>
          ) : (
            `Subscribe ${selected === 'monthly' ? '£19.99/month' : '£199.99/year'} →`
          )}
        </button>

        <p className="text-center text-xs text-white/20 mt-4">
          Secure payment via Stripe. Cancel any time. No hidden fees.
        </p>
      </div>
    </div>
  )
}
