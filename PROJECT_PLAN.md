# TRISMALINK - Web App Project Plan
## Shortlink URL + Listlink Display Platform

---

## 📋 RINGKASAN PROJECT
Platform web yang menggabungkan fungsi:
1. **URL Shortener** (seperti Bitly) - memendekkan URL panjang
2. **Link List Display** (seperti Linktree) - menampilkan kumpulan link dalam satu halaman

---

## 🎯 FITUR UTAMA

### 1. URL Shortener
- Memendekkan URL panjang menjadi short code
- Tracking klik dan analytics
- Custom alias untuk short URL
- Expiry date untuk link
- QR Code generation

### 2. Link List Display (Listlink)
- Halaman publik dengan multiple links
- Customizable theme dan layout
- Analytics per link
- Social media integration

---

## 🗂️ STRUKTUR PROJECT

```
TRISMALINK/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin components
│   │   │   ├── listlink/       # Public listlink components
│   │   │   └── common/         # Shared components
│   │   ├── pages/
│   │   │   ├── admin/          # Admin pages
│   │   │   └── public/         # Public pages
│   │   ├── services/           # API calls
│   │   ├── utils/              # Utilities
│   │   └── styles/             # CSS/styling
│   ├── package.json
│   └── vite.config.js / next.config.js
│
├── backend/
│   ├── api/                    # API endpoints
│   │   ├── auth/              # Authentication endpoints
│   │   ├── shortlinks/        # Shortlink endpoints
│   │   ├── lists/             # Listlink endpoints
│   │   └── analytics/         # Analytics endpoints
│   ├── config/                # Configuration files
│   │   ├── database.php       # Database connection
│   │   └── config.php         # App configuration
│   ├── models/                # Database models/classes
│   ├── middleware/            # Auth, validation, CORS
│   ├── utils/                 # Helper functions
│   ├── vendor/                # Composer dependencies
│   ├── composer.json          # PHP dependencies
│   ├── .htaccess              # Apache rewrite rules
│   └── index.php              # Main entry point
│
└── database/
    └── migrations/             # DB schema migrations
```

---

## 🎨 FRONTEND PLAN - TAMPILAN ADMIN

### **Admin Dashboard** (`/admin`)

#### A. **Authentication**
- **Login Page** (`/admin/login`)
  - Email/username input
  - Password input
  - Remember me checkbox
  - Login button
  - Link ke register (jika dibutuhkan)

- **Register Page** (`/admin/register`)
  - Username field
  - Email field
  - Password field
  - Confirm password field
  - Submit button

#### B. **Admin Dashboard Layout**
```
┌────────────────────────────────────────────┐
│  HEADER (Logo, User Menu, Logout)         │
├──────────┬─────────────────────────────────┤
│          │                                 │
│ SIDEBAR  │    MAIN CONTENT AREA           │
│          │                                 │
│ - Home   │    (Dynamic content based on   │
│ - Links  │     selected menu)             │
│ - Lists  │                                 │
│ - Stats  │                                 │
│ - Settings│                                │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

#### C. **Shortlink Management** (`/admin/links`)

**1. Link List View**
```
┌─────────────────────────────────────────────┐
│  📊 My Shortlinks                           │
│  [+ Create New Link]          [Search...]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Short: trisma.link/abc123             │ │
│  │ Original: https://example.com/very... │ │
│  │ Clicks: 1,234 | Created: 2 days ago   │ │
│  │ [Edit] [QR] [Copy] [Delete]           │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Short: trisma.link/promo2024          │ │
│  │ Original: https://shop.com/sale...    │ │
│  │ Clicks: 5,678 | Created: 1 week ago   │ │
│  │ [Edit] [QR] [Copy] [Delete]           │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

**2. Create/Edit Shortlink Modal**
```
┌─────────────────────────────────────────┐
│  Create New Shortlink          [X]      │
├─────────────────────────────────────────┤
│                                         │
│  Original URL *                         │
│  [https://example.com/very-long-url]    │
│                                         │
│  Custom Alias (optional)                │
│  [my-custom-link]                       │
│  Preview: trisma.link/my-custom-link    │
│                                         │
│  Expiry Date (optional)                 │
│  [📅 Select date]                       │
│                                         │
│  Description (optional)                 │
│  [Link description for tracking...]     │
│                                         │
│  Tags                                   │
│  [#marketing] [#social] [+ Add tag]     │
│                                         │
│           [Cancel]    [Create Link]     │
│                                         │
└─────────────────────────────────────────┘
```

#### D. **Listlink Management** (`/admin/lists`)

**1. Listlink Collection View**
```
┌─────────────────────────────────────────────┐
│  📑 My Link Lists                           │
│  [+ Create New List]          [Search...]   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 📱 My Social Links                    │ │
│  │ URL: trisma.link/@username            │ │
│  │ 5 links | 2,345 views                 │ │
│  │ Status: ✅ Active                      │ │
│  │ [Edit] [Customize] [View] [Share]     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🎨 Portfolio Links                    │ │
│  │ URL: trisma.link/@myportfolio         │ │
│  │ 8 links | 543 views                   │ │
│  │ Status: ✅ Active                      │ │
│  │ [Edit] [Customize] [View] [Share]     │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

**2. Create/Edit Listlink Page** (`/admin/lists/edit/:id`)

**Left Panel - Link Management**
```
┌─────────────────────────────────────┐
│  List Settings                      │
├─────────────────────────────────────┤
│  List Title *                       │
│  [My Social Links]                  │
│                                     │
│  Custom URL *                       │
│  trisma.link/[@username]            │
│                                     │
│  Description                        │
│  [My professional links...]         │
│                                     │
│  Profile Image                      │
│  [📷 Upload] [Remove]               │
│                                     │
├─────────────────────────────────────┤
│  Links in this List    [+ Add Link] │
├─────────────────────────────────────┤
│  ≡ Instagram                        │
│    https://instagram.com/user       │
│    [Edit] [Delete] [↑] [↓]          │
│                                     │
│  ≡ YouTube                          │
│    https://youtube.com/@channel     │
│    [Edit] [Delete] [↑] [↓]          │
│                                     │
│  ≡ Website                          │
│    https://mywebsite.com            │
│    [Edit] [Delete] [↑] [↓]          │
│                                     │
└─────────────────────────────────────┘
```

**Right Panel - Live Preview & Customization**
```
┌─────────────────────────────────────┐
│  🎨 Customize Appearance            │
├─────────────────────────────────────┤
│  Theme                              │
│  ○ Light  ● Dark  ○ Custom          │
│                                     │
│  Background                         │
│  ○ Solid Color [#hexcode]           │
│  ○ Gradient [Color1] [Color2]       │
│  ○ Image [Upload]                   │
│                                     │
│  Button Style                       │
│  [Rounded ▼]                        │
│  Button Color [#hexcode]            │
│  Text Color [#hexcode]              │
│                                     │
│  Font                               │
│  [Inter ▼]                          │
│                                     │
│  Layout                             │
│  ○ Centered  ○ Left  ○ Right        │
│                                     │
├─────────────────────────────────────┤
│         LIVE PREVIEW                │
├─────────────────────────────────────┤
│         ┌─────────────┐             │
│         │   [Photo]   │             │
│         │             │             │
│         │ @username   │             │
│         │ Description │             │
│         │             │             │
│         │ [Instagram] │             │
│         │ [YouTube]   │             │
│         │ [Website]   │             │
│         │             │             │
│         └─────────────┘             │
│                                     │
└─────────────────────────────────────┘
```

**Bottom Action Bar**
```
┌─────────────────────────────────────┐
│  [Cancel] [Save Draft] [Publish]    │
└─────────────────────────────────────┘
```

#### E. **Analytics Dashboard** (`/admin/analytics`)

```
┌─────────────────────────────────────────────┐
│  📊 Analytics Overview                      │
│  [Last 7 days ▼]                            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Total  │  │  Total  │  │ Active  │    │
│  │  Clicks │  │  Links  │  │  Lists  │    │
│  │ 12,345  │  │   156   │  │    12   │    │
│  └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│  📈 Click Trends                            │
│  [Graph visualization here]                 │
│                                             │
│  🔗 Top Performing Links                    │
│  1. trisma.link/promo2024 - 5,678 clicks   │
│  2. trisma.link/abc123 - 1,234 clicks      │
│  3. trisma.link/summer - 987 clicks        │
│                                             │
│  🌍 Geographic Distribution                 │
│  [Map or chart here]                        │
│                                             │
└─────────────────────────────────────────────┘
```

#### F. **Settings** (`/admin/settings`)

```
┌─────────────────────────────────────────┐
│  ⚙️ Account Settings                    │
├─────────────────────────────────────────┤
│                                         │
│  Profile Information                    │
│  Username: [username]                   │
│  Email: [email@example.com]             │
│  [Update Profile]                       │
│                                         │
│  Security                               │
│  Current Password: [••••••]             │
│  New Password: [••••••]                 │
│  Confirm Password: [••••••]             │
│  [Change Password]                      │
│                                         │
│  Custom Domain (Premium)                │
│  [your-domain.com]                      │
│  [Connect Domain]                       │
│                                         │
│  API Access                             │
│  API Key: [••••••••••••] [Show] [Copy]  │
│  [Generate New Key]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🌐 FRONTEND PLAN - TAMPILAN PUBLIC

### **Public Listlink Display** (`/@username` atau `/l/customurl`)

**Mobile-First Responsive Design**

```
┌─────────────────────────────────┐
│                                 │
│        [Profile Photo]          │
│                                 │
│         @username               │
│                                 │
│   Short bio/description here    │
│   that describes the page       │
│                                 │
│  ┌───────────────────────────┐  │
│  │     🔗 Link Title 1       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │     🎵 Link Title 2       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │     📱 Link Title 3       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │     💼 Link Title 4       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │     ✉️ Link Title 5       │  │
│  └───────────────────────────┘  │
│                                 │
│     Powered by TRISMALINK       │
│                                 │
└─────────────────────────────────┘
```

**Customization Features:**
- Background: solid color, gradient, atau image
- Button styles: rounded, square, pill-shaped
- Color schemes: dapat dikustomisasi penuh
- Font styles: berbagai pilihan font
- Layout: centered, left-align, right-align
- Animations: hover effects, transitions
- Social icons: display optional di bawah
- Custom CSS: untuk advanced users

### **Shortlink Redirect** (`/abc123`)
- Instant redirect ke original URL
- Track click sebelum redirect
- Loading indicator (jika perlu analytics)
- Error page jika link tidak ditemukan

---

## 🛠️ TECHNOLOGY STACK

### **Fullstack: Next.js 14+**
- Next.js 14+ with App Router
- React 18+ with Server Components
- TypeScript
- TailwindCSS (styling)
- Prisma ORM (database)
- NextAuth.js (authentication)
- React Hook Form (forms)
- Zod (validation)

### UI Components
- Shadcn/ui (component library)
- Lucide React (icons)
- Recharts (analytics charts)
- React Color (color picker)
- React DnD (drag & drop untuk link ordering)

### Database
- PostgreSQL (Railway)
- Prisma Client (ORM)

### Deployment & Services
- **Railway** (hosting + PostgreSQL)
- Cloudinary (optional image storage)
- QR Code API (external service)
- GitHub (version control & auto-deploy)

---

## 📊 DATABASE SCHEMA

### Users Table
```sql
users {
  id: UUID (PK)
  username: VARCHAR(50) UNIQUE
  email: VARCHAR(255) UNIQUE
  password: VARCHAR(255) (hashed)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Shortlinks Table
```sql
shortlinks {
  id: UUID (PK)
  user_id: UUID (FK -> users)
  short_code: VARCHAR(20) UNIQUE
  original_url: TEXT
  custom_alias: VARCHAR(100) UNIQUE (nullable)
  description: TEXT (nullable)
  tags: VARCHAR[] (nullable)
  expires_at: TIMESTAMP (nullable)
  clicks: INTEGER (default: 0)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  is_active: BOOLEAN (default: true)
}
```

### Link Lists Table
```sql
link_lists {
  id: UUID (PK)
  user_id: UUID (FK -> users)
  title: VARCHAR(255)
  slug: VARCHAR(100) UNIQUE
  description: TEXT (nullable)
  profile_image_url: TEXT (nullable)
  
  # Customization
  theme: VARCHAR(20) (default: 'light')
  background_type: VARCHAR(20) (solid/gradient/image)
  background_value: TEXT
  button_style: VARCHAR(20)
  button_color: VARCHAR(7)
  text_color: VARCHAR(7)
  font_family: VARCHAR(50)
  layout: VARCHAR(20)
  custom_css: TEXT (nullable)
  
  views: INTEGER (default: 0)
  is_active: BOOLEAN (default: true)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### List Items Table
```sql
list_items {
  id: UUID (PK)
  list_id: UUID (FK -> link_lists)
  title: VARCHAR(255)
  url: TEXT
  icon: VARCHAR(50) (nullable)
  order: INTEGER
  clicks: INTEGER (default: 0)
  is_visible: BOOLEAN (default: true)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Click Analytics Table
```sql
click_analytics {
  id: UUID (PK)
  shortlink_id: UUID (FK -> shortlinks) (nullable)
  list_item_id: UUID (FK -> list_items) (nullable)
  ip_address: VARCHAR(45)
  user_agent: TEXT
  referrer: TEXT (nullable)
  country: VARCHAR(100) (nullable)
  city: VARCHAR(100) (nullable)
  clicked_at: TIMESTAMP
}
```

---

## 🔐 AUTHENTICATION & SECURITY

### Authentication Flow
1. **JWT-based authentication**
   - Access token (short-lived: 15min)
   - Refresh token (long-lived: 7 days)
   - Secure HTTP-only cookies

2. **Protected Routes**
   - Admin dashboard: require authentication
   - Public pages: no authentication needed

3. **Rate Limiting**
   - Link creation: 100 per hour
   - API calls: 1000 per hour
   - Click tracking: unlimited (dengan cache)

### Security Measures
- Password hashing (bcrypt)
- CORS configuration
- XSS protection
- SQL injection prevention (parameterized queries)
- CSRF tokens
- Input validation & sanitization

---

## 📈 ANALYTICS & TRACKING

### Metrics to Track
**For Shortlinks:**
- Total clicks
- Unique clicks
- Click timeline (hourly/daily/weekly)
- Geographic distribution
- Referrer sources
- Device types (mobile/desktop)
- Browser types

**For Listlinks:**
- Total page views
- Individual link clicks
- Click-through rate per link
- Most popular links
- View duration
- Traffic sources

### Analytics Display
- Real-time dashboard
- Date range filters
- Export to CSV/PDF
- Visual charts and graphs
- Comparative analytics

---

## 🚀 DEVELOPMENT PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Setup project structure
- [ ] Initialize frontend (React/Next.js)
- [ ] Initialize backend (Node.js/Express)
- [ ] Setup database (PostgreSQL)
- [ ] Configure development environment
- [ ] Create basic UI components library

### Phase 2: Authentication (Week 2-3)
- [ ] Build user registration system
- [ ] Build login system
- [ ] Implement JWT authentication
- [ ] Create protected route middleware
- [ ] Build admin dashboard layout
- [ ] User profile management

### Phase 3: Shortlink Feature (Week 3-4)
- [ ] Create shortlink generation logic
- [ ] Build shortlink creation UI
- [ ] Implement shortlink list view
- [ ] Add edit/delete functionality
- [ ] Create redirect handler
- [ ] Add custom alias feature
- [ ] Implement QR code generation
- [ ] Basic click tracking

### Phase 4: Listlink Feature (Week 4-6)
- [ ] Create link list data structure
- [ ] Build list creation UI
- [ ] Implement link management (add/edit/delete/reorder)
- [ ] Create public listlink display page
- [ ] Add basic customization options
- [ ] Implement slug/username routing
- [ ] Profile image upload

### Phase 5: Customization (Week 6-7)
- [ ] Theme system (light/dark)
- [ ] Background customization (color/gradient/image)
- [ ] Button style options
- [ ] Color picker integration
- [ ] Font selection
- [ ] Layout options
- [ ] Live preview system
- [ ] Custom CSS support (advanced)

### Phase 6: Analytics (Week 7-8)
- [ ] Click tracking system
- [ ] Analytics data collection
- [ ] Analytics dashboard UI
- [ ] Charts and visualizations
- [ ] Geographic tracking
- [ ] Referrer tracking
- [ ] Export functionality

### Phase 7: Polish & Optimization (Week 8-9)
- [ ] Mobile responsive optimization
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Loading states
- [ ] Error handling
- [ ] Success/error notifications
- [ ] Form validations
- [ ] UX improvements

### Phase 8: Testing & Deployment (Week 9-10)
- [ ] Unit testing
- [ ] Integration testing
- [ ] E2E testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Deployment setup (Vercel/Netlify + Railway/Heroku)
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Launch! 🚀

---

## 🎨 UI/UX DESIGN PRINCIPLES

### Design System
- **Colors**: Primary, secondary, accent colors + dark mode variants
- **Typography**: Heading scales, body text, code blocks
- **Spacing**: Consistent 4px/8px grid system
- **Components**: Reusable button, input, card, modal components
- **Icons**: Consistent icon library (React Icons/Lucide)

### Responsive Breakpoints
```css
mobile: 320px - 640px
tablet: 641px - 1024px
desktop: 1025px+
```

### User Experience
- Instant feedback on actions
- Loading states for async operations
- Clear error messages
- Smooth transitions and animations
- Keyboard navigation support
- Accessibility (ARIA labels, semantic HTML)
- Tooltips for complex features
- Onboarding tour for new users

---

## 🔄 API ENDPOINTS

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Shortlinks
```
GET    /api/shortlinks              # Get all user's shortlinks
POST   /api/shortlinks              # Create new shortlink
GET    /api/shortlinks/:id          # Get specific shortlink
PUT    /api/shortlinks/:id          # Update shortlink
DELETE /api/shortlinks/:id          # Delete shortlink
GET    /api/shortlinks/:id/qrcode   # Get QR code
GET    /api/shortlinks/:id/stats    # Get shortlink analytics
```

### Link Lists
```
GET    /api/lists                   # Get all user's lists
POST   /api/lists                   # Create new list
GET    /api/lists/:id               # Get specific list
PUT    /api/lists/:id               # Update list
DELETE /api/lists/:id               # Delete list
POST   /api/lists/:id/items         # Add item to list
PUT    /api/lists/:id/items/:itemId # Update list item
DELETE /api/lists/:id/items/:itemId # Delete list item
PUT    /api/lists/:id/reorder       # Reorder list items
```

### Public Routes
```
GET    /:shortcode                  # Redirect shortlink
GET    /@:username                  # View public listlink
GET    /l/:slug                     # Alternative listlink route
POST   /api/track/click             # Track click event
```

### Analytics
```
GET    /api/analytics/overview      # Dashboard overview
GET    /api/analytics/shortlinks    # Shortlink analytics
GET    /api/analytics/lists         # Listlink analytics
GET    /api/analytics/export        # Export data
```

---

## 💡 FUTURE ENHANCEMENTS

### Premium Features
- Custom domains
- Advanced analytics
- A/B testing for links
- Team collaboration
- Branded links
- Link scheduling
- Bulk link import/export
- API access with higher limits
- Remove "Powered by" branding
- Priority support

### Additional Features
- Social media auto-posting
- Integration with Google Analytics
- Link retargeting pixels
- Email capture forms on listlink
- Payment gateway integration (for creator monetization)
- Link bundling (multiple links in one short URL)
- Password-protected links
- UTM parameter builder
- Link health checker (detect broken links)
- SEO preview generator

---

## 📝 NOTES

### Performance Considerations
- Implement caching for frequently accessed links
- Use CDN for static assets
- Optimize images (WebP format, lazy loading)
- Database indexing on slug, short_code fields
- Implement pagination for large lists
- Use Redis for rate limiting and session storage

### Scalability
- Horizontal scaling capability
- Load balancing
- Database replication
- Microservices architecture (future consideration)

### Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic/Datadog)
- Uptime monitoring
- Analytics tracking (Google Analytics)

---

## 🎯 SUCCESS METRICS

### MVP Goals
- [ ] User registration & authentication working
- [ ] Shortlink creation & redirect working
- [ ] Listlink page creation & display working
- [ ] Basic customization options functional
- [ ] Mobile responsive design
- [ ] Basic analytics tracking
- [ ] Production deployment

### Launch Targets
- 100 registered users in first month
- 1,000 shortlinks created
- 50 active listlink pages
- 10,000 total clicks tracked
- 99.9% uptime

---

## 📞 SUPPORT & DOCUMENTATION

### User Documentation
- Getting started guide
- Feature tutorials (video/text)
- FAQ section
- Customization guide
- API documentation (for premium users)

### Technical Documentation
- Setup instructions
- Architecture overview
- API reference
- Database schema
- Deployment guide
- Contributing guidelines

---

**END OF PLAN**

**Ready to build TRISMALINK! 🚀**
