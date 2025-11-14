# 🚀 TRISMALINK Deployment Guide

This guide will help you deploy TRISMALINK to production.

---

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use managed service)
- Git repository
- Domain name (optional but recommended)

---

## 🔧 Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Prepare Your Database

**Using Vercel Postgres:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Create Postgres database
vercel postgres create
```

**Using External PostgreSQL (e.g., Supabase, Railway, Neon):**
1. Create a PostgreSQL database
2. Get your connection string
3. Save it for later

### Step 2: Configure Environment Variables

1. Fork/Clone this repository to your GitHub account
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Step 3: Deploy

```bash
# One-time deploy
vercel

# Production deploy
vercel --prod
```

### Step 4: Run Database Migrations

```bash
# After first deploy
npx prisma migrate deploy
npx prisma db seed
```

---

## 🐳 Option 2: Deploy with Docker

### Step 1: Build Docker Image

```dockerfile
# Dockerfile (create this file)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Build and Run

```bash
# Build image
docker build -t trismalink .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="your-secret" \
  --name trismalink \
  trismalink
```

### Using Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/trismalink
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-here
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=trismalink
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

---

## ☁️ Option 3: Deploy to VPS (Ubuntu)

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Setup Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE trismalink;
CREATE USER trismalink_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE trismalink TO trismalink_user;
\q
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/trismalink.git
cd trismalink

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
npx prisma migrate deploy
npx prisma db seed

# Build application
npm run build

# Start with PM2
pm2 start npm --name "trismalink" -- start
pm2 save
pm2 startup
```

### Step 4: Setup Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/trismalink
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trismalink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔐 Security Checklist

- [ ] Generate strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Setup firewall (ufw or cloud firewall)
- [ ] Regular backups for database
- [ ] Keep dependencies updated
- [ ] Monitor error logs
- [ ] Setup rate limiting (Redis recommended for production)
- [ ] Use environment variables for all secrets

---

## 📊 Post-Deployment

### Monitor Application

```bash
# View logs (PM2)
pm2 logs trismalink

# Check status
pm2 status

# Monitor resources
pm2 monit
```

### Database Backups

```bash
# Backup database
pg_dump -U trismalink_user trismalink > backup_$(date +%Y%m%d).sql

# Restore database
psql -U trismalink_user trismalink < backup_20240101.sql
```

### Health Check

Visit: `https://yourdomain.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "database": { "status": "connected" },
  "uptime": 123456
}
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run migrations (if any)
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart trismalink
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply to production
npx prisma migrate deploy
```

---

## 🆘 Troubleshooting

### App won't start
- Check environment variables are set correctly
- Verify database connection string
- Check Node.js version (18+)
- Review logs: `pm2 logs` or `vercel logs`

### Database connection errors
- Verify PostgreSQL is running
- Check firewall allows database port (5432)
- Verify connection string format
- Check user permissions

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## 🎉 Success!

Your TRISMALINK application should now be live! 

**Test URLs:**
- Homepage: `https://yourdomain.com`
- API Docs: `https://yourdomain.com/api/docs`
- Health Check: `https://yourdomain.com/api/health`

**Next Steps:**
1. Create your account
2. Create your first shortlink
3. Set up your link-in-bio page
4. Share with the world! 🚀
