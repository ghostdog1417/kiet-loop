# MASTER PROMPT — KIET Loop

Use this document as the master build prompt for an AI coding tool or engineering team to build a startup-grade product called "KIET Loop" — a private verified campus marketplace and student network exclusive to KIET students.

---

## Product vision

Build a private verified campus marketplace + student network exclusively for KIET students.

Tagline:

> "The private marketplace and student network for KIET."

The platform should function as:

- OLX for KIET students
- Upwork for KIET student services
- LinkedIn/community network for KIET students
- Hostel / roommate / lost & found board
- Internship / gig board
- Club announcements platform

Only verified KIET students can join.

Verification via:

- KIET college email OTP
- student ID verification
- optional manual admin approval

This closed network creates:

- trust
- exclusivity
- safe transactions
- better quality listings
- strong campus network effects

---

## Tech stack

Frontend:

- React
- Next.js (latest App Router)
- Tailwind CSS
- Framer Motion
- Zustand / Redux Toolkit
- Axios
- Socket.IO client

Backend:

- Node.js
- Express.js
- Socket.IO server
- JWT auth
- bcrypt password hashing
- Cloudinary for uploads

Database:

- MongoDB Atlas

ORM:

- Mongoose

Payments:

- Razorpay integration

Notifications:

- email
- push notifications
- WhatsApp API integration

Hosting:

Frontend:

- Vercel

Backend:

- Amazon Web Services EC2 / ECS or Render

Database:

- MongoDB Atlas cloud

CDN:

- Cloudflare

Storage:

- AWS S3 / Cloudinary

CI/CD:

- GitHub Actions

Monitoring:

- Sentry
- LogRocket

Analytics:

- Mixpanel / PostHog

---

## App name

KIET Loop

Domain:

kietloop.in

or

loop.kiet.edu

---

## Core UX theme

Design:

premium modern student app

Feel:

mix of:

- Instagram
- LinkedIn
- Discord
- OLX
- Notion clean UI

Color palette:

Primary:

KIET blue

Accent:

electric cyan

Secondary:

white / dark slate

Modes:

- dark mode
- light mode

Responsive:

mobile first

PWA support

Installable app

Fast loading

SEO optimized

---

## Core modules

## 1) Authentication system

Build:

### Signup

Fields:

- full name
- roll number
- department
- year
- hostel/day scholar
- email
- phone
- password

Only allow:

KIET email domains.

Verification:

OTP.

Then activate account.

Features:

- forgot password
- JWT refresh tokens
- session management
- account suspension
- role permissions

Roles:

- student
- verified seller
- club admin
- moderator
- super admin

---

## 2) Student profile

Profile includes:

- name
- photo
- department
- year
- skills
- rating
- bio
- verified badge
- listings count
- completed transactions
- portfolio
- socials
- availability

Badges:

- verified student
- top seller
- trusted tutor
- KIET club lead
- freelancer pro

---

## 3) Marketplace

Categories:

### Academic

- textbooks
- notes
- lab coats
- calculators
- engineering kits

### Electronics

- laptops
- tablets
- headphones
- monitors
- accessories

### Mobility

- bicycle
- scooter
- helmets

### Hostel essentials

- mattress
- table
- chair
- cooler
- kettle
- induction
- shelves

### Lifestyle

- gym gear
- camera
- guitar
- shoes
- event passes

### Miscellaneous

- anything student useful

Listing features:

- title
- category
- subcategory
- description
- price
- negotiable toggle
- condition
- images
- short video
- seller profile
- tags
- availability
- pickup location
- reserve item
- sold toggle

Actions:

- like
- bookmark
- share
- report
- chat seller
- offer price
- buy now

Filters:

- price
- category
- department
- hostel
- newest
- popular
- verified seller

Search:

fast fuzzy search

recommendations:

AI based.

---

## 4) Student services marketplace

Sections:

- tutoring
- coding help
- web development
- UI/UX design
- poster making
- editing
- presentations
- assignment guidance
- project mentoring
- resume building
- placement prep
- mock interviews
- photography
- content writing

Each service page:

- portfolio
- reviews
- hourly pricing
- package pricing
- delivery timeline
- skill tags
- request quote

Commission:

10%

Admin configurable.

---

## 5) Community layer

Tabs:

### Lost & found

Example:

“Lost wallet in Block B”

---

### Roommate finder

Filters:

- budget
- location
- gender
- preferences

---

### Flatmate finder

Near KIET housing.

---

### Internship board

Post:

- internships
- campus ambassador roles
- freelance work
- startups hiring

---

### Club announcements

For:

- coding club
- robotics
- cultural fest
- hackathons
- sports

---

### Events

Calendar view.

Register inside app.

---

### Notes exchange

Upload:

PDFs / notes.

---

### Seniors help juniors

Mentorship system.

---

## 6) Chat system

Realtime.

Use Socket.IO.

Features:

- typing indicator
- online status
- read receipts
- media sharing
- voice note
- offer negotiation
- block user
- report user

Separate inboxes:

- marketplace
- services
- community

---

## 7) Ratings & trust engine

Rate:

- buyer
- seller
- service provider

Metrics:

- response speed
- delivery
- honesty
- quality

Trust score visible.

Fraud prevention:

- suspicious activity detection
- spam filter
- scam reports
- moderation dashboard

---

## 8) Payments

Integrate Razorpay.

Flows:

- listing boosts
- service payments
- escrow
- subscriptions

Escrow:

money held → released after completion.

---

## 9) Premium monetization

### Featured listing

₹49–499

### Pro seller

₹199/month

Benefits:

- analytics
- boosted visibility
- seller badge
- bulk listings

### Ads

Campus businesses:

- cafes
- PGs
- coaching
- bookstores
- food brands

### Commission

Services:

5–15%

---

## 10) Admin dashboard

Manage:

- users
- reports
- listings
- payments
- moderation
- analytics
- banners
- ads
- clubs
- announcements

Dashboard charts:

- DAU
- MAU
- revenue
- transactions
- active listings
- top sellers
- fraud alerts

RBAC enabled.

---

## Database architecture (MongoDB)

Collections:

users

profiles

listings

listingImages

categories

orders

payments

services

serviceBookings

reviews

chats

messages

notifications

clubs

posts

events

reports

subscriptions

analytics

adminLogs

OTPVerifications

sessions

Indexes:

optimize:

- search
- sorting
- user lookups
- recommendation queries

Use aggregation pipelines.

Use Redis caching layer.

---

## API architecture

REST + websocket.

Routes:

/auth

/users

/profile

/listings

/services

/orders

/payments

/chat

/community

/admin

/analytics

JWT protected.

Rate limiting.

Helmet security.

Input validation.

Sanitize inputs.

CSRF protection.

File validation.

---

## Cloud deployment architecture

Frontend:

Vercel

Backend:

AWS ECS containerized

Database:

MongoDB Atlas

Redis:

Redis Cloud

Media:

Cloudinary

CDN:

Cloudflare

DNS:

managed

SSL:

enabled

Auto scaling:

enabled

Dockerized:

yes

Environment:

dev

staging

production

Backups:

daily

Monitoring:

24/7

---

## AI features

Integrate:

recommendation engine.

Examples:

“You may need DBMS notes.”

“3 seniors selling laptops.”

“2 tutors available.”

“Best flatmate match.”

Spam detection.

Fraud detection.

Auto moderation.

Smart search.

---

## Launch strategy inside KIET

Phase 1:

target:

- hostels
- 1st year
- CS/IT branches

Campus ambassadors:

10

Referral:

invite friends → rewards.

Leaderboard gamification.

Credits:

Loop coins.

Redeem:

boost listings.

---

## Deliverables

Build:

complete full-stack production app

Include:

- frontend
- backend
- database schema
- admin panel
- responsive UI
- cloud deployment config
- Docker setup
- CI/CD pipeline
- security best practices
- scalable architecture
- clean modular codebase
- documentation
- seed scripts
- testing suite
- analytics hooks

---

## Final instruction

Build this as a real startup-grade SaaS product, not a college mini-project.

Prioritize:

speed + trust + clean UX + scalability + viral campus growth.

---

This prompt is detailed enough to hand to an AI builder or engineering team and start building KIET Loop immediately.

Saved to repository root for team use and automation.
