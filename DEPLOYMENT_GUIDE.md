# DEPLOYMENT GUIDE - KIET Loop

Production deployment ready to host on Vercel, AWS ECS or Render, and MongoDB Atlas.

## Frontend Deployment (Vercel)

Connect repository:

```bash
npm install -g vercel
vercel link
```

Environment variables (`.env.production`):

```env
NEXT_PUBLIC_API_URL=https://api.kietloop.in
```

Deploy:

```bash
vercel --prod
```

Custom domain is configured in the Vercel dashboard.

## Backend Deployment

### Option 1: AWS ECS

Build Docker image:

```bash
cd backend
docker build -t kiet-loop-backend:latest .
```

Push to ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
docker tag kiet-loop-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/kiet-loop-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/kiet-loop-backend:latest
```

ECS task definition requirements:

- Image: `YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/kiet-loop-backend:latest`
- Port: `5000`
- Memory: `512 MB`
- CPU: `256`

Create ECS service with ALB (Application Load Balancer).

Set environment variables in ECS task definition:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/kietloop?retryWrites=true&w=majority
JWT_SECRET=USE_STRONG_SECRET_KEY
RAZORPAY_KEY_ID=YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET
NODE_ENV=production
PORT=5000
```

### Option 2: Render

Connect GitHub repository and create a web service:

- Build command: `npm install`
- Start command: `npm start`

Set environment variables:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NODE_ENV=production
```

Enable auto-deploy on git push.

## Database (MongoDB Atlas)

- Create cluster at `mongodb.com`.
- Get connection string: `mongodb+srv://USER:PASS@cluster.mongodb.net/kietloop`.
- Enable IP whitelist: `0.0.0.0/0` for initial setup and restrict later.
- Enable automatic daily backups.

## CDN (Cloudflare)

- Add site to Cloudflare.
- Update nameservers at domain registrar.
- Enable caching for static assets.
- Enable SSL/TLS.

## Domain Setup

Purchase domain: `kietloop.in`

Update DNS records:

```txt
Frontend (Vercel)
CNAME: cname.vercel-dns.com

Backend (ECS/Render)
CNAME: your-alb-domain.elb.us-east-1.amazonaws.com
# or Render-assigned domain
```

## Monitoring and Logging

Install Sentry for backend error tracking:

```bash
npm install @sentry/node
```

```javascript
// In backend/src/index.js
const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })
app.use(Sentry.Handlers.errorHandler())
```

CloudWatch:

- Logs stream from ECS to CloudWatch.
- Set alarms for error rate spikes.

Install LogRocket for frontend session debugging:

```bash
npm install logrocket
```

```javascript
// In frontend/app/layout.jsx
import LogRocket from 'logrocket'
LogRocket.init('ORG/PROJECT')
```

## Performance Optimization

- Frontend: Next.js code splitting and image optimization.
- Backend: Add compression middleware and Redis caching.
- CDN: Cloudflare cache rules.
- Database: MongoDB indexes and pooling.

## Security Checklist

- [ ] HTTPS enabled everywhere
- [ ] Environment variables secured
- [ ] Rate limiting enabled (`express-rate-limit`)
- [ ] CORS restricted for production origins
- [ ] Input validation on all endpoints
- [ ] XSS protection via Helmet
- [ ] CSRF protection on sensitive forms
- [ ] Password hashing with bcrypt
- [ ] Strong JWT secret and rotation policy
- [ ] Regular security audit cadence
- [ ] DDoS protection via Cloudflare

## Scaling

Horizontal scaling:

- Run multiple ECS tasks behind ALB.
- Keep backend stateless.
- Use Redis for distributed cache and pub/sub.

Database scaling:

- MongoDB Atlas auto-scaling.
- Read replicas for analytics queries.
- Sharding for high growth.

CI/CD:

- GitHub Actions builds and deploys on push.

## Cost Estimation (Monthly)

- Vercel Frontend: $0-$20
- AWS ECS: $50-$200
- MongoDB Atlas: $10-$100
- Cloudflare: $0-$20
- Domain: $10-$15/year

Estimated total: ~$100-$300/month.

## Post-Deployment

Run seed command:

```bash
SEED_ADMIN_EMAIL=admin@kiet.edu SEED_ADMIN_PASS=STRONG_PASSWORD npm run seed
```

Then:

- Set up monitoring alerts.
- Configure backup verification.
- Run end-to-end validation.
- Enable analytics (Mixpanel or PostHog).

---

App is production-ready with these deployment and operational controls in place.
