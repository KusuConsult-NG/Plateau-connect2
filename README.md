# Plateau Connect - Ride-Hailing Platform

A comprehensive ride-hailing platform for Jos, Plateau State, Nigeria, built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- 🚗 **Multi-Role System**: Admin, Driver, and Rider interfaces
- 📊 **Admin Dashboard**: Comprehensive ride management and analytics
- 🚕 **Driver Interface**: Real-time ride requests and earnings tracking
- 👥 **Rider Platform**: Easy ride booking with multiple vehicle types
- 💳 **Payment Integration**: Support for Paystack and Stripe
- 🗺️ **Map Integration**: Google Maps for location services
- ⚡ **Real-time Updates**: Pusher for instant notifications
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API
- **Real-time**: Pusher
- **Payments**: Paystack (primary) + Stripe (fallback)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Maps API key
- Pusher account (free tier available)
- Paystack account (for Nigerian market)
- Stripe account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Plateau-Connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
   - `NEXT_PUBLIC_PUSHER_KEY`, `PUSHER_APP_ID`, `PUSHER_SECRET`, `PUSHER_CLUSTER`: Pusher credentials
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`: Paystack credentials
   - (Optional) `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`: Stripe credentials

4. **Set up the database**
   ```bash
   # Create database migration
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   # Create initial ride types
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Plateau-Connect/
├── app/
│   ├── (admin)/          # Admin dashboard
│   ├── (auth)/           # Login/Signup pages
│   ├── (driver)/         # Driver interface
│   ├── (rider)/          # Rider dashboard
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable components
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client
│   ├── constants.ts     # App constants
│   ├── utils.ts         # Helper functions
│   └── pusher.ts        # Real-time config
├── prisma/
│   └── schema.prisma    # Database schema
└── types/               # TypeScript definitions
```

## User Roles & Access

### Admin
- **Access**: `/admin`
- **Registration**: `/admin/register` (requires invite code)
- **Features**:
  - View all users, rides, and payments
  - Manage ride requests
  - View analytics and metrics
  - User management

**Creating an Admin Account:**
1. Visit `/admin/register`
2. Enter a valid invite code (see below)
3. Complete the registration form
4. Login at `/login`

**Development Invite Codes:**
```
ADMIN-2024-PLATEAU
SUPER-ADMIN-KEY
PLATEAU-CONNECT-ADMIN
```

> **Note**: In production, implement database-backed invite codes with expiration dates.

### Driver
- **Access**: `/driver`
- **Features**:
  - Complete onboarding process
  - Receive real-time ride requests
  - Accept/decline rides
  - Track earnings
  - View ride history

### Rider
- **Access**: `/dashboard`
- **Features**:
  - Book rides with location search
  - Choose vehicle types (Economy, Standard, Premium, Keke)
  - Manage saved locations
  - View trip history
  - Manage payment methods

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (NextAuth)

### Rides
- `GET /api/rides` - List rides (filtered by role)
- `POST /api/rides` - Create new ride request
- `GET /api/rides/[id]` - Get ride details
- `PATCH /api/rides/[id]` - Update ride status
- `POST /api/rides/[id]/accept` - Driver accepts ride

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/methods` - Add payment method

## Database Schema

Key models:
- **User**: Multi-role user accounts
- **DriverProfile**: Extended driver information
- **Ride**: Ride requests and tracking
- **Payment**: Payment transactions
- **PaymentMethod**: Saved payment methods
- **SavedLocation**: User's saved addresses
- **RideType**: Available vehicle types and pricing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use one of these for production:
- **Supabase**: PostgreSQL with generous free tier
- **Vercel Postgres**: Integrated with Vercel
- **Railway**: PostgreSQL hosting
- **PlanetScale**: MySQL (requires schema changes)

## Payment Integration

### Paystack Setup (Nigerian Market)

1. Create account at [paystack.com](https://paystack.com)
2. Get API keys from Settings → API Keys & Webhooks
3. Add keys to environment variables
4. Implement webhook at `/api/payments/webhook` for transaction updates

### Stripe Setup (International)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Developers → API keys
3. Add keys to environment variables

## Map Integration

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
3. Create API key
4. Add billing information (required)
5. Restrict API key to your domain

**Alternative**: Use Mapbox for more generous free tier

## Real-time Features

### Pusher Setup

1. Create account at [pusher.com](https://pusher.com)
2. Create new Channels app
3. Copy credentials to environment variables
4. Free tier: 100 concurrent connections, 200k messages/day

Features using real-time:
- New ride notifications for drivers
- Ride status updates for riders
- Live location tracking (future)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database commands
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Create migration
npx prisma generate     # Regenerate client
```

## TODO/Future Enhancements

- [ ] Integrate Google Maps with live markers
- [ ] Implement actual Paystack/Stripe payment flows
- [ ] Add driver live location tracking
- [ ] Implement rider-driver chat
- [ ] Add push notifications
- [ ] Create admin analytics charts
- [ ] Add email notifications
- [ ] Implement surge pricing
- [ ] Add promo codes/discounts
- [ ] Create mobile app with React Native

## Support

For questions or issues:
- Check the `/dashboard/support` page
- Email: support@plateauconnect.com
- Phone: +234 XXX XXX XXXX

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ for Jos, Plateau State
