# B'Day Made With Love 💖🎂

A production-grade, multi-user birthday website creation platform built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

Create breathtaking, personalized birthday experiences featuring rich scrapbook pages, cinematic presentations, interactive surprise reveal locks, blowable cake candles, love flip-cards, heartfelt letters, timelines, and memory libraries.

---

## 🌟 Highlights

- **10 Curated Themes**: 6 tactile scrapbook themes (Pink Scrapbook, Lavender Dreams, Vintage Memory Journal, Romantic Letterbook, Playful Bestie, Botanical Garden) and 4 cinematic presentations (Midnight Magic, Golden Hour, Starlit Cinema, Minimalist Elegance).
- **7 Surprise Reveal Intro Styles**: Gift Box unboxing, Wax Sealed Letter, Hidden Polaroid, Ribbon Unwrap, Secret Door, Cinematic Reveal, and Simple Clean Intro.
- **Interactive Birthday Elements**:
  - 🎂 **Interactive Cake**: Clickable, blowing flame candles with real-time unlock callback.
  - 💌 **Heartfelt Letter**: Realistic paper stationery with handwriting font and auto-reveal unlock trigger.
  - 🃏 **Things I Love**: 3D perspective flip cards with custom icons and love notes.
  - 📜 **Our Story / Timeline**: Milestone journey markers with dates, locations, and photo attachments.
  - 📷 **Scrapbook Gallery**: Draggable, tilted Polaroid photo cards with customizable tape, stamps, and stickers.
  - 🎁 **Conditional Hidden Surprises**: Locked rewards unlocked exclusively after candles are blown out or letters read.
  - 🎵 **Music Player**: Floating and inline background music player with YouTube / Spotify / custom audio support.
  - 🎊 **Final Confetti Explosion**: Canvas-confetti bursts with customizable starfields and loving sendoffs.
- **Creator Studio**: 3-panel editor featuring an intuitive section manager, drag-and-drop reordering, instant live device preview (desktop, tablet, mobile), real-time slug validation, and one-click publishing.
- **Reusable Memory Library**: Centralized asset organizer to save and tag photos, videos, notes, audio clips, and reuse them across multiple birthday projects.
- **Production Supabase Integration**: Complete PostgreSQL schema, automated user profiles, Row Level Security (RLS) policies for complete multi-tenant privacy, and Storage buckets for media assets.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Supabase](https://supabase.com/) account or local Supabase instance

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd cpu

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_URL=http://localhost:5173
```

### 4. Database Setup
Execute the SQL migration scripts in your Supabase SQL Editor:
1. `supabase/migrations/20261021000001_initial_schema.sql` (Tables, Foreign Keys, Triggers)
2. `supabase/migrations/20261021000002_rls_and_storage.sql` (Row Level Security, Policies, Storage Buckets)

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Run the full automated test suite with Vitest:
```bash
# Run tests once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

---

## 📁 Architecture & Folder Structure

```
src/
├── components/          # Shared components (NotFoundPage, ProtectedRoute)
├── features/
│   ├── auth/            # AuthContext, SignIn, SignUp, ForgotPassword
│   ├── birthday/        # Public birthday experience (/birthday/:slug)
│   │   └── sections/    # 10 recipient-facing interactive components
│   ├── dashboard/       # Creator dashboard and project wizard
│   ├── editor/          # 3-panel studio, section editors, live preview
│   │   └── sections/    # Section configuration panels
│   ├── landing/         # Marketing landing page, style switcher, showcases
│   └── memories/        # Memory asset library with upload & filter
├── lib/
│   ├── supabase.ts      # Supabase client & storage helpers
│   ├── theme-registry.ts# 10 complete theme definitions & presets
│   ├── types.ts         # Full TypeScript database & UI model types
│   └── utils.ts         # Formatting, slug generators & validators
└── tests/               # Vitest test suites (utils, themes, auth, cake)
```

---

## 📄 License
MIT License. Made with ❤️ for unforgettable birthdays.
