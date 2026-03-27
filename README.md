<<<<<<< HEAD
# GolfGives — Golf Charity Subscription Platform

A full-stack Next.js application built as per the Digital Heroes PRD.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Deployment**: Vercel

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase (NEW account required)

1. Go to [supabase.com](https://supabase.com) and create a **brand new account**
2. Create a **new project** (choose any region, note your database password)
3. Go to **SQL Editor** in the Supabase dashboard
4. Copy the entire contents of `supabase-schema.sql` and run it
5. Go to **Project Settings → API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Set Up Stripe (NEW account required)

1. Go to [stripe.com](https://stripe.com) and create a **new account**
2. Go to **Developers → API Keys**:
   - Copy Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy Secret key → `STRIPE_SECRET_KEY`
3. Create subscription prices in Stripe Dashboard:
   - Go to **Products** → **Add Product**
   - Name: "GolfGives Monthly" → Add price: £19.99/month → Copy Price ID → `STRIPE_MONTHLY_PRICE_ID`
   - Name: "GolfGives Yearly" → Add price: £199.99/year → Copy Price ID → `STRIPE_YEARLY_PRICE_ID`

### Step 4: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with all your keys from Steps 2 and 3.

### Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 6: Create Admin User

1. Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Sign up with email: `admin@golfgives.com`, password: `Admin123!`
3. Go to Supabase SQL Editor and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@golfgives.com';
   ```
4. Log in — you'll be redirected to `/admin`

### Step 7: Set Up Stripe Webhook (for subscriptions to work)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Deploy to Vercel (NEW account required)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New account
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Add `NEXT_PUBLIC_APP_URL` = your Vercel deployment URL
6. Deploy!
7. After deploy, set up Stripe webhook for your live URL:
   - Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events to listen to: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Copy signing secret → Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

---

## Test Credentials

After setup:
- **Admin**: admin@golfgives.com / Admin123!
- **Test User**: Create via /auth/signup
- **Stripe test card**: 4242 4242 4242 4242, any future date, any CVC

---

## Features Implemented

### User Features
- ✅ Sign up / Login
- ✅ Subscription (Monthly/Yearly via Stripe)
- ✅ Charity selection at signup + adjustable % donation
- ✅ Score entry (1-45 Stableford, rolling last 5 logic)
- ✅ Score deletion
- ✅ View published draws + winning numbers
- ✅ View winnings history + payment status
- ✅ Cancel subscription
- ✅ Adjust charity percentage from settings

### Admin Features
- ✅ Overview dashboard with live stats
- ✅ User management (view/edit scores, toggle subscriptions)
- ✅ Draw system (random + algorithmic, simulation + publish)
- ✅ Prize pool auto-calculation (40/35/25 split)
- ✅ Jackpot rollover logic
- ✅ Charity management (add/edit/delete/feature)
- ✅ Winner verification (approve/reject/mark paid)
- ✅ Pending verification badge count

### Technical
- ✅ Supabase auth + RLS policies
- ✅ Stripe subscription lifecycle (webhooks)
- ✅ Mobile-responsive design
- ✅ JWT session via Supabase
- ✅ Draw engine (random + inverse-frequency algorithmic)
- ✅ Middleware-based route protection
- ✅ TypeScript throughout
=======
# Golf-Charity-Platform
>>>>>>> 7fcbdd6aec38f48475baba47172b3ab1c9775074
