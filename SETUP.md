# Setup Guide - SIM P2TK Jawa Barat

## 📋 Prerequisites

- Node.js 18+ atau 20+
- npm atau pnpm
- Akun Supabase (sudah terkonfigurasi)
- Git

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd sim-p2tk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

File `.env.local` sudah dikonfigurasi dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xhczueopyopbthkqaqvv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Project

```
sim-p2tk/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (dashboard)/       # Dashboard routes (by role)
│   │   ├── (public)/          # Public routes (landing, jobs, trainings)
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── shared/           # Shared components
│   ├── lib/                   # Library utilities
│   │   ├── supabase/         # Supabase clients
│   │   ├── constants.ts      # App constants
│   │   └── validations/      # Zod schemas
│   ├── hooks/                 # React hooks
│   ├── actions/               # Server actions
│   ├── types/                 # TypeScript types
│   │   └── database.types.ts # Database types
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── .env.local                # Environment variables
├── components.json           # Shadcn UI config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🎨 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn UI** - Component library
- **Framer Motion** - Animations
- **Lucide Icons** - Icons

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (Email, OAuth, OTP)
  - Storage for files
  - Row Level Security (RLS)
- **Next.js Server Actions** - API endpoints

### Form & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Date & Utilities
- **date-fns** - Date formatting

## 🔐 Authentication Flow

Aplikasi menggunakan multi-role authentication:

1. **Candidate** (Lulusan/Mahasiswa)
2. **Institution** (BLK/LPK)
3. **Employer** (Perusahaan)
4. **Admin** (Administrator)

### Auth Methods
- Email + Password
- Google OAuth
- Phone + OTP (WhatsApp)

## 📊 Database Schema

Database akan dibuat dengan struktur:

### Auth Module
- `profiles` - User profiles
- `candidate_profiles` - Candidate-specific data
- `candidate_experiences` - Work experiences
- `documents` - Uploaded documents
- `institutions` - Institution profiles
- `employers` - Employer profiles

### Jobs Module
- `jobs` - Job listings
- `applications` - Job applications

### Training Module
- `training_programs` - Training programs
- `training_classes` - Training classes/batches
- `enrollments` - Training enrollments
- `certificates` - Digital certificates

## 🎨 Brand Colors

Sesuai dengan project overview:

- **Primary (Orange)**: `#F47B20`
- **White**: `#FFFFFF`
- **Black**: `#1E1E1E`

Colors sudah dikonfigurasi di `src/app/globals.css`

## 📝 Next Steps

1. ✅ Setup project & infrastruktur dasar
2. 🔄 Konfigurasi Supabase database schema
3. 🔄 Implementasi authentication system
4. 🔄 Buat onboarding wizards
5. 🔄 Implementasi job & training modules

## 🛠️ Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Add Shadcn UI component
npx shadcn@latest add <component-name>
```

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Overview](./projectoverview.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Private project for Jawa Barat Workforce Program
