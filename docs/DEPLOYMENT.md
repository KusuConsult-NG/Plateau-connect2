# Pre-Deployment Checklist for RideJos

Complete this checklist before deploying to your live server.

## ✅ 1. Environment Variables

### Required for Production

Create a `.env` file on your server with these variables:

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth (REQUIRED)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret-here"

# Google Maps (REQUIRED for maps functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Pusher - Real-time (REQUIRED for live notifications)
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"

# Paystack (REQUIRED for Nigerian payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_xxxxxxxxxxxxx"
PAYSTACK_SECRET_KEY="sk_live_xxxxxxxxxxxxx"

# Stripe (OPTIONAL - for international payments)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_xxxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET`.

---

## ✅ 2. Database Setup

### Option A: Supabase (Recommended - Free tier)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings → Database**
4. Copy **Connection String** (Transaction mode)
5. Update `DATABASE_URL` in your environment variables
6. **Important**: Change password mode from `[YOUR-PASSWORD]` to actual password

### Option B: Vercel Postgres

1. Go to your Vercel project
2. Navigate to **Storage** tab
3. Create **Postgres** database
4. Copy connection string to `DATABASE_URL`

### Option C: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string

### Run Migrations

After setting up database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify with Prisma Studio
npx prisma studio
```

---

## ✅ 3. Third-Party Services Setup

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create **API Key**
5. **Restrict API Key**:
   - Application restrictions: HTTP referrers
   - Add your domain: `https://your-domain.com/*`
6. Add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Cost**: $200/month free credit

### Pusher (Real-time)

1. Create account at [pusher.com](https://pusher.com)
2. Create **Channels** app
3. Select your region (closest to users)
4. Copy credentials:
   - App ID → `PUSHER_APP_ID`
   - Key → `NEXT_PUBLIC_PUSHER_KEY`
   - Secret → `PUSHER_SECRET`
   - Cluster → `PUSHER_CLUSTER`
5. In **App Settings**, add your domain to allowed origins

**Free Tier**: 100 concurrent connections, 200k messages/day

### Paystack (Primary Payment)

1. Create account at [paystack.com](https://paystack.com)
2. Complete business verification
3. Go to **Settings → API Keys & Webhooks**
4. Copy **Live Keys**:
   - Public Key → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - Secret Key → `PAYSTACK_SECRET_KEY`
5. Set up webhook:
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `charge.success`, `transfer.success`

### Stripe (Optional)

1. Create account at [stripe.com](https://stripe.com)
2. Complete business verification
3. Go to **Developers → API Keys**
4. Copy **Live Keys**
5. Set up webhook:
   - URL: `https://your-domain.com/api/payments/stripe-webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

---

## ✅ 4. Security Configuration

### Update Admin Invite Codes

**CRITICAL**: Remove hardcoded invite codes before production!

Edit `app/api/auth/admin-signup/route.ts`:

```typescript
// Option 1: Store in environment variable
const VALID_INVITE_CODES = process.env.ADMIN_INVITE_CODES?.split(',') || []

// Option 2: Move to database (recommended)
// Create InviteCode model in Prisma schema
```

Add to `.env`:
```bash
ADMIN_INVITE_CODES="CODE1,CODE2,CODE3"
```

### Enable HTTPS Only

Your hosting platform should handle this automatically, but verify:
- Force HTTPS redirects
- Set secure cookie flags
- Enable HSTS headers

### CORS Configuration

If you have a separate frontend, update `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        ],
      },
    ]
  },
}
```

---

## ✅ 5. Code Changes for Production

### Update API URLs

Check for any hardcoded `localhost` URLs:

```bash
# Search for localhost references
grep -r "localhost" app/ lib/ --exclude-dir=node_modules
```

### Remove Console Logs

```bash
# Find all console.log statements
grep -r "console.log" app/ lib/ --exclude-dir=node_modules
```

Consider replacing with proper logging:

```typescript
// Use only in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

### Update Site URLs

Edit `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: 'Plateau Connect - Ride-Hailing Platform',
  description: 'Reliable rides across Plateau State, Nigeria',
  metadataBase: new URL('https://your-domain.com'),
}
```

---

## ✅ 6. Build Verification

### Local Production Build

Test the production build locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` and test:
- ✅ Login/Signup works
- ✅ All pages load without errors
- ✅ Images display correctly
- ✅ No console errors

### Check Build Output

Look for warnings or errors:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

All should have ✓ checkmarks.

---

## ✅ 7. Deployment Platform Setup

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ridjos.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New → Project**
   - Import your GitHub repository
   - Framework: **Next.js** (auto-detected)

3. **Configure Environment Variables**:
   - Add all environment variables from step 1
   - Use **Production** environment for all

4. **Deploy**:
   - Click **Deploy**
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

5. **Add Custom Domain** (Optional):
   - Go to **Settings → Domains**
   - Add your domain
   - Update DNS records as instructed

### Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

### Netlify

1. Create account at [netlify.com](https://netlify.com)
2. New site from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables

---

## ✅ 8. Post-Deployment Verification

### Immediate Checks

After deployment, verify:

1. **Homepage loads**: Visit your domain
2. **Signup works**: Create a test rider account
3. **Login works**: Sign in with test account
4. **Database connected**: Check if data persists
5. **No errors**: Open browser console (F12) - should be clean

### Create Test Accounts

```bash
# 1. Create Admin Account
Visit: https://your-domain.com/admin/register
Code: [Your production invite code]

# 2. Create Driver Account  
Visit: https://your-domain.com/signup
Select: "Become a Driver"

# 3. Create Rider Account
Visit: https://your-domain.com/signup
Select: "Book Rides"
```

### Test Core Flows

- [ ] Admin can view dashboard
- [ ] Driver can complete onboarding
- [ ] Rider can view booking interface
- [ ] All navigation works
- [ ] Images and styles load correctly

---

## ✅ 9. Monitoring & Maintenance

### Set Up Error Tracking

Consider adding [Sentry](https://sentry.io):

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Database Backups

**Supabase**: Automatic daily backups (free tier)  
**Vercel Postgres**: Manual exports  
**Railway**: Automatic backups

### Monitor Performance

Use Vercel Analytics (free):
- Go to your project → Analytics
- Enable Web Analytics
- Monitor page load times and errors

---

## ✅ 10. Documentation

### Create Admin Guide

Document for your team:
- Admin invite code generation (when implemented)
- How to manage users
- How to handle ride disputes
- Payment reconciliation process

### User Support

Prepare:
- FAQ page
- Contact support email
- Driver onboarding guide
- Rider help documentation

---

## 🚨 Critical Security Reminders

Before going live:

- [ ] Change all default passwords
- [ ] Remove test/demo accounts
- [ ] Enable 2FA for admin accounts (future enhancement)
- [ ] Review all API permissions
- [ ] Test payment refund process
- [ ] Set up automated database backups
- [ ] Configure monitoring and alerts
- [ ] Review privacy policy and terms of service
- [ ] Ensure GDPR/data protection compliance

---

## 📋 Quick Deployment Checklist

```markdown
Pre-Deployment:
- [ ] All environment variables set
- [ ] Database created and migrated
- [ ] All third-party services configured
- [ ] Admin invite codes moved to secure storage
- [ ] Production build tested locally
- [ ] No console.log or debug code
- [ ] Custom domain DNS configured (optional)

During Deployment:
- [ ] Push code to GitHub
- [ ] Connect to Vercel/Railway/Netlify
- [ ] Add environment variables on platform
- [ ] Deploy and wait for build
- [ ] Verify deployment URL works

Post-Deployment:
- [ ] Test all signup flows
- [ ] Create test accounts
- [ ] Verify database persistence
- [ ] Check payment gateway connection
- [ ] Monitor for errors first 24 hours
- [ ] Set up automated backups
```

---

## 🆘 Common Deployment Issues

### Database Connection Failed
```
Error: P1001 - Can't reach database
```
**Fix**: Check `DATABASE_URL` format and database is accessible from your hosting platform.

### Environment Variables Not Loading
```
Error: process.env.NEXTAUTH_SECRET is undefined
```
**Fix**: 
1. Add variables in hosting platform (not just .env file)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Build Fails
```
Error: Module not found
```
**Fix**:
1. Run `npm install` locally
2. Commit `package-lock.json`
3. Ensure all imports use correct paths

### Images Not Loading
```
Error: Invalid src prop
```
**Fix**: Check `next.config.js` has correct image domains configured.

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to deploy?** Follow this checklist step by step, and your RideJos platform will be live and secure! 🚀
