#  Panduan Deploy TRISMALINK

## Pilihan 1: Deploy ke Vercel (PALING MUDAH) 

### Langkah 1: Persiapan Database PostgreSQL

**Pilihan A - Menggunakan Vercel Postgres (Gratis untuk start):**
1. Buka https://vercel.com/dashboard
2. Buat akun/login
3. Klik "Storage" > "Create Database" > Pilih "Postgres"
4. Salin connection string yang diberikan

**Pilihan B - Menggunakan Supabase (Gratis & Mudah):**
1. Buka https://supabase.com
2. Buat akun baru
3. Buat project baru
4. Pergi ke Settings > Database
5. Salin "Connection String" (pilih yang "URI")

**Pilihan C - Menggunakan Neon (Gratis & Cepat):**
1. Buka https://neon.tech
2. Buat akun
3. Buat project
4. Salin connection string

### Langkah 2: Push Code ke GitHub

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Buat repository di GitHub, lalu:
git remote add origin https://github.com/username/trismalink.git
git branch -M main
git push -u origin main
```

### Langkah 3: Deploy ke Vercel

1. Buka https://vercel.com
2. Klik "Add New..." > "Project"
3. Import repository GitHub Anda
4. Tambahkan Environment Variables:
   - DATABASE_URL = connection string PostgreSQL Anda
   - NEXTAUTH_URL = akan otomatis terisi (misal: https://trismalink.vercel.app)
   - NEXTAUTH_SECRET = generate dengan command: `openssl rand -base64 32`
   - APP_URL = sama dengan NEXTAUTH_URL

5. Klik "Deploy"

### Langkah 4: Jalankan Migrasi Database

Setelah deploy sukses:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Jalankan migration
vercel env pull .env.production
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Atau langsung dari dashboard Vercel:
# Buka Settings > Functions > jalankan command di console
```

### Langkah 5: Update Database untuk Production

Karena saat ini menggunakan SQLite, Anda perlu update schema untuk PostgreSQL:

1. Edit prisma/schema.prisma:
```prisma
datasource db {
  provider = "postgresql"  // Ganti dari sqlite ke postgresql
  url      = env("DATABASE_URL")
}
```

2. Push changes:
```bash
git add .
git commit -m "Update to PostgreSQL"
git push
```

3. Vercel akan otomatis redeploy

---

## Pilihan 2: Deploy ke Railway (Alternatif Mudah) 

### Langkah 1: Persiapan

1. Buka https://railway.app
2. Login dengan GitHub
3. Klik "New Project" > "Deploy from GitHub repo"
4. Pilih repository TRISMALINK

### Langkah 2: Tambah Database

1. Klik "New" > "Database" > "PostgreSQL"
2. Railway akan generate connection string otomatis

### Langkah 3: Environment Variables

Tambahkan di Settings > Variables:
- DATABASE_URL (otomatis dari PostgreSQL)
- NEXTAUTH_URL = URL Railway Anda
- NEXTAUTH_SECRET = generate random string
- APP_URL = sama dengan NEXTAUTH_URL

### Langkah 4: Deploy

Railway akan otomatis build dan deploy!

---

## Pilihan 3: Deploy Manual ke VPS

### Persiapan Server (Ubuntu):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

### Setup Database:

```bash
sudo -u postgres psql
CREATE DATABASE trismalink;
CREATE USER trismalink_user WITH ENCRYPTED PASSWORD 'password_kuat_anda';
GRANT ALL PRIVILEGES ON DATABASE trismalink TO trismalink_user;
\q
```

### Deploy Aplikasi:

```bash
# Clone repository
git clone https://github.com/username/trismalink.git
cd trismalink

# Install dependencies
npm ci

# Setup environment
cp .env.example .env
nano .env  # Edit dengan nilai yang benar

# Update schema untuk PostgreSQL
# Edit prisma/schema.prisma: provider = "postgresql"

# Generate Prisma client
npx prisma generate

# Jalankan migrasi
npx prisma migrate deploy

# Build aplikasi
npm run build

# Start dengan PM2
pm2 start npm --name trismalink -- start
pm2 save
pm2 startup
```

### Setup Nginx:

```nginx
# /etc/nginx/sites-available/trismalink
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/trismalink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL (Gratis dengan Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com
```

---

##  Checklist Sebelum Deploy

- [ ] Ganti DATABASE_URL ke PostgreSQL
- [ ] Generate NEXTAUTH_SECRET yang kuat
- [ ] Update NEXTAUTH_URL dengan domain production
- [ ] Pastikan semua environment variables sudah diset
- [ ] Test build lokal: `npm run build`
- [ ] Commit semua perubahan ke Git
- [ ] Backup database development jika perlu

---

##  Generate NEXTAUTH_SECRET

**Di Windows PowerShell:**
```powershell
# Generate random base64 string
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Di Mac/Linux:**
```bash
openssl rand -base64 32
```

---

##  Verifikasi Deploy Sukses

Setelah deploy, cek:
1. Buka URL production Anda
2. Test register user baru
3. Test buat shortlink
4. Test buat link-in-bio
5. Cek /api/health untuk health check
6. Cek /api/docs untuk API documentation

---

##  Troubleshooting

**Build Error:**
- Pastikan prisma/schema.prisma sudah diupdate ke PostgreSQL
- Jalankan 
px prisma generate sebelum build
- Clear cache: m -rf .next node_modules && npm install

**Database Error:**
- Periksa format CONNECTION_URL benar
- Pastikan database sudah dibuat
- Jalankan migrasi: 
px prisma migrate deploy

**Error 500:**
- Cek environment variables sudah lengkap
- Cek logs di Vercel/Railway dashboard
- Pastikan NEXTAUTH_SECRET sudah diset

---

##  Selesai!

Aplikasi Anda sekarang sudah live! 

**URL Penting:**
- Homepage: https://your-domain.com
- Admin: https://your-domain.com/dashboard
- API Docs: https://your-domain.com/api/docs

**Tips:**
- Setup custom domain di Vercel (Settings > Domains)
- Monitor analytics di dashboard
- Backup database secara berkala
- Update dependencies secara rutin

Selamat! 