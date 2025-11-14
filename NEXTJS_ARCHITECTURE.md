# TRISMALINK - Next.js Fullstack Architecture (Railway Deployment)

## 🎯 TECH STACK UPDATE

### **Frontend + Backend: Next.js 14+ (App Router)**
- Next.js 14 dengan App Router
- React Server Components
- API Routes (Backend)
- Server Actions
- Prisma ORM (Database)
- NextAuth.js (Authentication)
- TailwindCSS (Styling)
- Vercel/Railway Deployment

---

## 📁 PROJECT STRUCTURE

```
TRISMALINK/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx              # Admin dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard home
│   │   ├── links/
│   │   │   ├── page.tsx            # Shortlinks list
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── lists/
│   │   │   ├── page.tsx            # Listlink list
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts        # NextAuth configuration
│   │   ├── shortlinks/
│   │   │   ├── route.ts            # GET all, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts        # GET, PUT, DELETE
│   │   │       ├── qr/
│   │   │       │   └── route.ts
│   │   │       └── stats/
│   │   │           └── route.ts
│   │   ├── lists/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── items/
│   │   │           └── route.ts
│   │   └── analytics/
│   │       └── route.ts
│   ├── @[username]/
│   │   └── page.tsx                # Public listlink display
│   ├── [shortcode]/
│   │   └── page.tsx                # Shortlink redirect
│   └── layout.tsx                  # Root layout
├── components/
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── LinkCard.tsx
│   │   ├── LinkForm.tsx
│   │   ├── ListForm.tsx
│   │   ├── LivePreview.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── listlink/
│   │   ├── ListlinkDisplay.tsx
│   │   ├── LinkButton.tsx
│   │   └── ThemeCustomizer.tsx
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   └── common/
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── prisma.ts                   # Prisma client
│   ├── auth.ts                     # NextAuth config
│   ├── utils.ts                    # Utility functions
│   ├── validations.ts              # Zod schemas
│   └── shortcode.ts                # Shortcode generator
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── .env.local
├── .env.example
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🗄️ PRISMA SCHEMA

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Railway provides PostgreSQL
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  shortlinks Shortlink[]
  linkLists  LinkList[]

  @@index([username])
  @@index([email])
}

model Shortlink {
  id          String    @id @default(cuid())
  userId      String
  shortCode   String    @unique
  originalUrl String    @db.Text
  customAlias String?   @unique
  description String?   @db.Text
  tags        String[]
  expiresAt   DateTime?
  clicks      Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  analytics ClickAnalytics[]

  @@index([shortCode])
  @@index([customAlias])
  @@index([userId])
}

model LinkList {
  id              String   @id @default(cuid())
  userId          String
  title           String
  slug            String   @unique
  description     String?  @db.Text
  profileImageUrl String?

  // Customization
  theme           String   @default("light")
  backgroundType  String   @default("solid")
  backgroundValue String?
  buttonStyle     String   @default("rounded")
  buttonColor     String   @default("#000000")
  textColor       String   @default("#ffffff")
  fontFamily      String   @default("Inter")
  layout          String   @default("center")
  customCss       String?  @db.Text

  views     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items ListItem[]

  @@index([slug])
  @@index([userId])
}

model ListItem {
  id         String   @id @default(cuid())
  listId     String
  title      String
  url        String   @db.Text
  icon       String?
  order      Int
  clicks     Int      @default(0)
  isVisible  Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  list      LinkList         @relation(fields: [listId], references: [id], onDelete: Cascade)
  analytics ClickAnalytics[]

  @@index([listId])
  @@index([order])
}

model ClickAnalytics {
  id           String    @id @default(cuid())
  shortlinkId  String?
  listItemId   String?
  ipAddress    String
  userAgent    String    @db.Text
  referrer     String?   @db.Text
  country      String?
  city         String?
  clickedAt    DateTime  @default(now())

  shortlink Shortlink? @relation(fields: [shortlinkId], references: [id], onDelete: Cascade)
  listItem  ListItem?  @relation(fields: [listItemId], references: [id], onDelete: Cascade)

  @@index([shortlinkId])
  @@index([listItemId])
  @@index([clickedAt])
}
```

---

## 🔧 CONFIGURATION FILES

### `.env.example`

```env
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# App
APP_URL="http://localhost:3000"
NODE_ENV="development"

# File Upload (if using external storage)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Analytics (optional)
NEXT_PUBLIC_GA_ID=""
```

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'api.qrserver.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### `package.json`

```json
{
  "name": "trismalink",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.1",
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.14.6",
    "axios": "^1.6.2",
    "qrcode": "^1.5.3",
    "recharts": "^2.10.3",
    "react-hook-form": "^7.49.2",
    "react-color": "^2.19.3",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5.3.3",
    "prisma": "^5.7.1",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
}
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 💻 CORE IMPLEMENTATION

### `lib/prisma.ts` - Prisma Client

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### `lib/auth.ts` - NextAuth Configuration

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### `lib/shortcode.ts` - Shortcode Generator

```typescript
import { prisma } from './prisma'

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export async function generateShortCode(length: number = 6): Promise<string> {
  let code = ''
  let exists = true

  while (exists) {
    code = ''
    for (let i = 0; i < length; i++) {
      code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
    }

    const existing = await prisma.shortlink.findFirst({
      where: {
        OR: [
          { shortCode: code },
          { customAlias: code }
        ]
      }
    })

    exists = !!existing
  }

  return code
}

export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9-_]{4,20}$/.test(code)
}
```

### `lib/validations.ts` - Zod Schemas

```typescript
import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const shortlinkSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().min(4).max(100).regex(/^[a-zA-Z0-9-_]+$/).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
})

export const listlinkSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(3).max(100).regex(/^[a-zA-Z0-9-_]+$/),
  description: z.string().max(500).optional(),
  theme: z.enum(['light', 'dark', 'custom']).default('light'),
  backgroundType: z.enum(['solid', 'gradient', 'image']).default('solid'),
  backgroundValue: z.string().optional(),
  buttonStyle: z.string().default('rounded'),
  buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#ffffff'),
  fontFamily: z.string().default('Inter'),
  layout: z.enum(['center', 'left', 'right']).default('center'),
})

export const listItemSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.string().url(),
  icon: z.string().optional(),
  order: z.number().int().min(0),
})
```

---

## 🔌 API ROUTES EXAMPLES

### `app/api/shortlinks/route.ts` - Create & List Shortlinks

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { shortlinkSchema } from '@/lib/validations'
import { generateShortCode } from '@/lib/shortcode'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const shortlinks = await prisma.shortlink.findMany({
    where: {
      userId: session.user.id,
      isActive: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(shortlinks)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = shortlinkSchema.parse(body)

    let shortCode = validated.customAlias

    if (!shortCode) {
      shortCode = await generateShortCode()
    } else {
      // Check if custom alias exists
      const existing = await prisma.shortlink.findFirst({
        where: {
          OR: [
            { shortCode },
            { customAlias: shortCode }
          ]
        }
      })

      if (existing) {
        return NextResponse.json({ error: 'Alias already exists' }, { status: 400 })
      }
    }

    const shortlink = await prisma.shortlink.create({
      data: {
        userId: session.user.id,
        shortCode,
        originalUrl: validated.originalUrl,
        customAlias: validated.customAlias,
        description: validated.description,
        tags: validated.tags || [],
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      }
    })

    return NextResponse.json(shortlink, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### `app/[shortcode]/page.tsx` - Shortlink Redirect

```typescript
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export default async function ShortlinkRedirect({
  params,
}: {
  params: { shortcode: string }
}) {
  const shortlink = await prisma.shortlink.findFirst({
    where: {
      OR: [
        { shortCode: params.shortcode },
        { customAlias: params.shortcode }
      ],
      isActive: true
    }
  })

  if (!shortlink) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Link Not Found</h1>
          <p className="text-gray-600">The link you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Check expiry
  if (shortlink.expiresAt && new Date(shortlink.expiresAt) < new Date()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Link Expired</h1>
          <p className="text-gray-600">This link has expired.</p>
        </div>
      </div>
    )
  }

  // Track click (async)
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || ''
  const referrer = headersList.get('referer') || null

  await prisma.$transaction([
    prisma.shortlink.update({
      where: { id: shortlink.id },
      data: { clicks: { increment: 1 } }
    }),
    prisma.clickAnalytics.create({
      data: {
        shortlinkId: shortlink.id,
        ipAddress: ip,
        userAgent,
        referrer,
      }
    })
  ])

  // Redirect to original URL
  redirect(shortlink.originalUrl)
}
```

### `app/@[username]/page.tsx` - Public Listlink Display

```typescript
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ListlinkDisplay from '@/components/listlink/ListlinkDisplay'

export default async function PublicListlink({
  params,
}: {
  params: { username: string }
}) {
  const username = params.username.replace('@', '')

  const linkList = await prisma.linkList.findFirst({
    where: {
      slug: username,
      isActive: true
    },
    include: {
      items: {
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      },
      user: {
        select: {
          username: true
        }
      }
    }
  })

  if (!linkList) {
    notFound()
  }

  // Increment views (async)
  await prisma.linkList.update({
    where: { id: linkList.id },
    data: { views: { increment: 1 } }
  })

  return <ListlinkDisplay linkList={linkList} />
}
```

---

## 🚀 RAILWAY DEPLOYMENT

### Setup Railway Project

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Initialize Project:**
```bash
railway init
```

4. **Add PostgreSQL:**
```bash
railway add --plugin postgresql
```

5. **Set Environment Variables:**
```bash
railway variables set NEXTAUTH_SECRET="your-secret-key"
railway variables set NEXTAUTH_URL="https://your-app.railway.app"
```

6. **Deploy:**
```bash
railway up
```

### `railway.json` Configuration

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Automatic Deployment (GitHub Integration)

1. Push code to GitHub
2. Connect Railway to GitHub repository
3. Auto-deploy on push to main branch

```yaml
# .github/workflows/deploy.yml (optional)
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
```

---

## 📋 MIGRATION FROM PHP TO NEXT.JS

### Advantages:
✅ **Unified Stack** - Frontend + Backend in one codebase
✅ **TypeScript** - Type safety throughout
✅ **Prisma ORM** - Modern database abstraction
✅ **Server Components** - Better performance
✅ **API Routes** - Built-in backend API
✅ **Easy Deployment** - Railway auto-deploy
✅ **Better DX** - Hot reload, better tooling
✅ **Scalable** - Easy to scale on Railway

### Disadvantages:
❌ **Cost** - Railway free tier limited (not free forever like InfinityFree)
❌ **Learning Curve** - Need to learn Next.js if new

### Railway Free Tier:
- $5 credit per month (free)
- Enough for ~500 hours runtime
- PostgreSQL included
- 1GB RAM
- 1 vCPU

---

## ✅ NEXT STEPS

1. **Initialize Project:**
```bash
npx create-next-app@latest trismalink --typescript --tailwind --app
cd trismalink
npm install @prisma/client next-auth bcryptjs zod
npm install -D prisma @types/bcryptjs
```

2. **Setup Prisma:**
```bash
npx prisma init
# Edit prisma/schema.prisma
npx prisma generate
npx prisma migrate dev --name init
```

3. **Setup NextAuth:**
```bash
# Create app/api/auth/[...nextauth]/route.ts
```

4. **Build Components:**
```bash
# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card
```

5. **Deploy to Railway:**
```bash
railway login
railway init
railway add --plugin postgresql
railway up
```

---

**Next.js Fullstack Architecture Ready! 🚀**
