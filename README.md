# KIET Loop - Monorepo scaffold

This repository holds the scaffold for the KIET Loop product (frontend and backend).

Structure:

- frontend/ - Next.js + Tailwind app (App Router)
- backend/ - Express + Socket.IO API
- MASTER_PROMPT_KIET_LOOP.md - master build prompt for teams and AI builders

Quick run (local development with docker-compose):

```bash
docker-compose up --build
```

Run locally without Docker (requires Node 20+).

Frontend:

```bash
cd frontend
npm ci
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```

Backend:

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Seed admin user:

```bash
cd backend
SEED_ADMIN_EMAIL=admin@kiet.edu SEED_ADMIN_PASS=adminpass node seed/createSampleData.js
```

CI:

See .github/workflows/ci.yml for a basic workflow that installs dependencies and builds frontend.

---

## Features implemented

### Authentication and Verification

- Signup with KIET email validation (OTP-based)
- Login with JWT tokens
- Refresh token flow
- Password reset flow scaffolding
- Role-based access control fields

### Marketplace

- Create and read listings with filters and search
- Listing categories (academic, electronics, mobility, hostel essentials, lifestyle)
- Seller profile references with rating support

### Student Services

- Service provider marketplace (tutoring, coding help, design, and more)
- Hourly and package pricing fields
- Portfolio and reviews support

### Chat System

- Real-time Socket.IO integration
- Message persistence with unread tracking

### Payments (Razorpay)

- Payment order and verification route scaffolding
- Payment history model and route support

### Admin Dashboard

- User and report management route scaffolding
- Listing moderation endpoints
- Analytics endpoints
- Frontend route at /admin/dashboard

### Database Models

- User, OTPVerification, RefreshToken
- Listing, Service, ServiceBooking, Review
- Chat, Message, Notification
- Payment, Report, Analytics, Subscription
- Event, Club, Post, LostAndFound, Roommate, Internship, Referral

### Infrastructure

- Docker containers for frontend and backend
- Docker compose with MongoDB for local setup
- MongoDB Atlas for cloud deployments
- GitHub Actions CI workflows
- Environment-based configuration

---

## Environment variables

Create a .env file in backend/:

```env
PORT=5000
# Local MongoDB
# MONGO_URI=mongodb://localhost:27017/kietloop

# MongoDB Atlas
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kietloop?retryWrites=true&w=majority

JWT_SECRET=your-secure-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
CLOUDINARY_URL=optional-cloudinary-url
SMTP_HOST=optional-smtp-host
SMTP_PORT=587
SMTP_USER=optional-email-user
SMTP_PASS=optional-email-pass
SMTP_FROM=no-reply@kietloop.in
```

For frontend, set in .env.local:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### MongoDB Atlas setup

1. Create a cluster in MongoDB Atlas.
2. Create a database user and copy the connection string from Atlas.
3. Replace `<username>`, `<password>`, and `<cluster>` in `MONGO_URI`.
4. Add your IP address to the Atlas Network Access list, or use `0.0.0.0/0` for initial testing.
5. Restart the backend after updating `backend/.env`.

---

## Running tests

```bash
cd backend
npm test
```

---

## Deployment

See .github/workflows/docker-build-push.yml for automated Docker builds and pushes.

- Frontend -> Vercel
- Backend -> AWS ECS or Render (Docker container)
- Database -> MongoDB Atlas
- Cache -> Redis Cloud (not yet integrated)
- CDN -> Cloudflare
