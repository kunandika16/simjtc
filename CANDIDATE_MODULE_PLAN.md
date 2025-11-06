# 📋 PLAN MODUL CANDIDATE - SIM P2TK Jawa Barat

## 🎯 Overview
Modul Candidate adalah sistem untuk pencari kerja/kandidat untuk mencari lowongan pekerjaan, melamar, dan melacak status aplikasi mereka.

---

## 📊 Fitur Utama yang Akan Dibangun

### 1. **Dashboard Candidate** 📈
**Priority: HIGH** | **Estimasi: 2-3 jam**

#### Komponen:
- **Statistics Cards**:
  - Total aplikasi yang dikirim
  - Aplikasi aktif (submitted, screening, interview)
  - Interview yang dijadwalkan
  - Offer yang diterima

- **Quick Actions**:
  - Button "Cari Lowongan"
  - Button "Lihat Semua Aplikasi"
  - Button "Edit Profil"

- **Recent Applications Widget**:
  - 5 aplikasi terbaru dengan status
  - Company name & job title
  - Tanggal apply
  - Status badge (color-coded)

- **Upcoming Interviews Widget**:
  - List interview yang akan datang
  - Tanggal & waktu
  - Lokasi/link meeting
  - Catatan dari employer

#### File yang Dibuat:
```
src/app/dashboard/candidate/page.tsx
```

---

### 2. **Job Search & Browse** 🔍
**Priority: HIGH** | **Estimasi: 3-4 jam**

#### Komponen:
- **Search Bar**:
  - Search by job title, company, atau keywords
  - Auto-complete suggestions
  - Search history

- **Advanced Filters**:
  - Location (city/province)
  - Employment type (fulltime, parttime, contract, internship)
  - Salary range
  - Category/industry
  - Remote/WFH option
  - Posted date (last 24h, week, month)

- **Sort Options**:
  - Most recent
  - Salary (high to low)
  - Most applications
  - Closing soon

- **Job Cards**:
  - Company logo
  - Job title & company name
  - Location & employment type
  - Salary range (if available)
  - Posted date
  - Quick apply button
  - Save/bookmark button

- **Pagination**:
  - Load more or page numbers
  - Show results count

#### File yang Dibuat:
```
src/app/dashboard/candidate/jobs/page.tsx
src/components/candidate/job-search-bar.tsx
src/components/candidate/job-filters.tsx
src/components/candidate/job-card.tsx
src/actions/job-search.actions.ts
```

---

### 3. **Job Detail & Apply** 📝
**Priority: HIGH** | **Estimasi: 2-3 jam**

#### Komponen:
- **Job Information Display**:
  - Full job description
  - Responsibilities
  - Requirements
  - Benefits
  - Salary range
  - Employment type
  - Location
  - Deadline
  - Company info

- **Application Form**:
  - Use profile data (auto-fill)
  - Cover letter textarea
  - Resume selection (dari profile atau upload baru)
  - Custom questions (jika ada screening questions)
  - Submit button with confirmation

- **Similar Jobs Section**:
  - 3-5 similar jobs
  - Based on category & location

#### File yang Dibuat:
```
src/app/dashboard/candidate/jobs/[id]/page.tsx
src/components/candidate/job-detail.tsx
src/components/candidate/application-form.tsx
src/actions/application.actions.ts
```

---

### 4. **My Applications** 📋
**Priority: HIGH** | **Estimasi: 2 jam**

#### Komponen:
- **Status Filter Tabs**:
  - All
  - Submitted (baru apply)
  - Screening (sedang diseleksi)
  - Interview (dijadwalkan interview)
  - Offer (dapat penawaran)
  - Rejected (ditolak)

- **Application Cards**:
  - Company & job title
  - Application date
  - Current status with badge
  - Interview info (jika ada)
  - Employer notes (jika ada)
  - Action buttons:
    - Lihat detail
    - Withdraw application (jika status submitted)

- **Timeline/History**:
  - Track perubahan status
  - Kapan disubmit, screening, interview, dll

#### File yang Dibuat:
```
src/app/dashboard/candidate/applications/page.tsx
src/app/dashboard/candidate/applications/[id]/page.tsx
src/components/candidate/application-card.tsx
src/components/candidate/application-timeline.tsx
```

---

### 5. **Profile Management** 👤
**Priority: MEDIUM** | **Estimasi: 2 jam**

#### Komponen:
- **View Profile**:
  - Display semua data yang sudah diisi saat onboarding
  - Personal info
  - Education
  - Skills
  - Experience
  - Documents

- **Edit Profile**:
  - Form untuk update semua data
  - Upload/replace documents
  - Update CV
  - Add/remove skills
  - Add/edit/delete experience

- **Profile Completeness Indicator**:
  - Progress bar
  - Checklist field yang belum diisi
  - Tips untuk improve profile

#### File yang Dibuat:
```
src/app/dashboard/candidate/profile/page.tsx
src/app/dashboard/candidate/profile/edit/page.tsx
src/components/candidate/profile-view.tsx
src/components/candidate/profile-edit-form.tsx
```

---

### 6. **Saved Jobs** 💾
**Priority: MEDIUM** | **Estimasi: 1-2 jam**

#### Komponen:
- **Bookmark System**:
  - Save/unsave jobs
  - Grid atau list view
  - Filter & sort saved jobs
  - Quick apply dari saved jobs

- **Collections** (Optional):
  - Organize saved jobs ke categories
  - "Interested", "Applied", "Follow-up", dll

#### File yang Dibuat:
```
src/app/dashboard/candidate/saved/page.tsx
src/components/candidate/saved-jobs-list.tsx
src/actions/saved-jobs.actions.ts
```

#### Database Changes Needed:
```sql
-- Table: saved_jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);
```

---

### 7. **Notifications** 🔔
**Priority: LOW** | **Estimasi: 2-3 jam**

#### Komponen:
- **Notification Center**:
  - Application status updates
  - Interview invitations
  - Offer letters
  - Job recommendations
  - Mark as read/unread
  - Delete notifications

- **Notification Badge**:
  - Unread count di navbar
  - Dropdown preview

#### File yang Dibuat:
```
src/app/dashboard/candidate/notifications/page.tsx
src/components/candidate/notification-bell.tsx
src/components/candidate/notification-list.tsx
src/actions/notifications.actions.ts
```

#### Database Changes Needed:
```sql
-- Table: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'application_update', 'interview', 'offer', etc
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🗂️ Struktur File yang Akan Dibuat

```
src/
├── app/
│   └── dashboard/
│       └── candidate/
│           ├── page.tsx                          # Dashboard utama
│           ├── jobs/
│           │   ├── page.tsx                      # Job search & browse
│           │   └── [id]/
│           │       └── page.tsx                  # Job detail & apply
│           ├── applications/
│           │   ├── page.tsx                      # List semua applications
│           │   └── [id]/
│           │       └── page.tsx                  # Application detail & timeline
│           ├── profile/
│           │   ├── page.tsx                      # View profile
│           │   └── edit/
│           │       └── page.tsx                  # Edit profile
│           ├── saved/
│           │   └── page.tsx                      # Saved jobs
│           └── notifications/
│               └── page.tsx                      # Notifications
│
├── components/
│   └── candidate/
│       ├── job-search-bar.tsx
│       ├── job-filters.tsx
│       ├── job-card.tsx
│       ├── job-detail.tsx
│       ├── application-form.tsx
│       ├── application-card.tsx
│       ├── application-timeline.tsx
│       ├── profile-view.tsx
│       ├── profile-edit-form.tsx
│       ├── saved-jobs-list.tsx
│       ├── notification-bell.tsx
│       └── notification-list.tsx
│
└── actions/
    ├── job-search.actions.ts
    ├── application.actions.ts
    ├── saved-jobs.actions.ts
    └── notifications.actions.ts
```

---

## 📝 Database Tables Required

### Existing Tables (Already Created):
- ✅ `profiles`
- ✅ `candidate_profiles`
- ✅ `candidate_experiences`
- ✅ `jobs`
- ✅ `applications`

### New Tables Needed:

#### 1. **saved_jobs** (untuk bookmark jobs)
```sql
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job ON saved_jobs(job_id);
```

#### 2. **notifications** (untuk notifikasi)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

## 🚀 Urutan Implementasi (Recommended)

### **Phase 1: Core Features** (HIGH Priority)
1. ✅ **Dashboard Candidate** - Overview & stats
2. ✅ **Job Search & Browse** - Cari lowongan
3. ✅ **Job Detail & Apply** - Apply ke lowongan
4. ✅ **My Applications** - Track status aplikasi

**Estimasi Total Phase 1: 9-12 jam**

### **Phase 2: Profile & Enhancement** (MEDIUM Priority)
5. 🔄 **Profile Management** - Edit profil & CV
6. 🔄 **Saved Jobs** - Bookmark lowongan

**Estimasi Total Phase 2: 3-4 jam**

### **Phase 3: Advanced Features** (LOW Priority)
7. 🔄 **Notifications** - Push notifications & alerts

**Estimasi Total Phase 3: 2-3 jam**

---

## 🎨 UI/UX Guidelines

### Design Principles:
1. **Mobile-First**: Responsive design untuk semua devices
2. **Clear CTAs**: Button apply & action buttons harus jelas
3. **Status Visibility**: Status aplikasi harus mudah dilihat (color-coded badges)
4. **Quick Access**: One-click apply untuk logged-in users
5. **Loading States**: Skeleton loaders untuk better UX

### Color Coding (Badges):
- **Submitted**: Gray/Secondary
- **Screening**: Blue/Info
- **Interview**: Purple/Primary
- **Offer**: Green/Success
- **Hired**: Green/Success (with check icon)
- **Rejected**: Red/Destructive

---

## 🔐 Security & Validation

### Candidate-Specific Rules:
1. Candidate hanya bisa apply ke job yang `status='published'`
2. Candidate hanya bisa lihat aplikasi mereka sendiri
3. Candidate tidak bisa apply 2x ke job yang sama
4. Candidate hanya bisa withdraw aplikasi dengan status `submitted`
5. Candidate bisa lihat profile employer yang memposting job
6. Candidate tidak bisa edit aplikasi setelah di-submit

### RLS Policies Already Exist:
- ✅ Candidates can view published jobs
- ✅ Candidates can apply to jobs
- ✅ Candidates can view own applications
- ✅ Candidates can update own applications (with restrictions)

---

## 📊 Data Flow Example

### Apply to Job Flow:
```
1. Candidate klik "Apply" di job detail
   ↓
2. System cek: sudah apply belum?
   ↓
3. Show application form (pre-filled dari profile)
   ↓
4. Candidate isi cover letter & custom questions
   ↓
5. Submit application
   ↓
6. Insert ke table `applications` dengan status='submitted'
   ↓
7. Increment `applications_count` di table `jobs`
   ↓
8. Redirect ke "My Applications" dengan success toast
   ↓
9. (Optional) Send notification ke employer
```

---

## 🧪 Testing Checklist

### Per Feature Testing:
- [ ] Dashboard: Stats calculation correct
- [ ] Job Search: Filter & search work properly
- [ ] Job Detail: All info displayed correctly
- [ ] Apply: Can't apply twice to same job
- [ ] Applications: Status updates reflected correctly
- [ ] Profile: All fields editable & saveable
- [ ] Saved Jobs: Can save/unsave jobs
- [ ] Notifications: Receive & mark as read

### Edge Cases:
- [ ] Job deleted setelah di-save
- [ ] Employer delete job setelah candidate apply
- [ ] Multiple tabs: apply di 2 tabs simultaneously
- [ ] Very long job description (pagination/scroll)
- [ ] No search results found
- [ ] No applications yet (empty state)

---

## 🎯 Success Metrics

### KPIs to Track:
1. **Application Rate**: % candidates yang apply setelah view job
2. **Time to Apply**: Average waktu dari view to submit
3. **Profile Completeness**: % candidates dengan profile lengkap
4. **Search Effectiveness**: % successful searches (found results)
5. **Interview Acceptance**: % candidates yang datang ke interview

---

## 📞 Integration Points

### With Employer Module:
- Employer update application status → Candidate sees update
- Employer schedule interview → Candidate gets notification
- Employer send offer → Candidate can accept/reject

### With Admin Module (Future):
- Admin can view all candidates
- Admin can moderate applications
- Admin can generate reports

---

## 🔧 Technical Stack

### Frontend:
- ✅ Next.js 15 (App Router)
- ✅ React Server Components
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ shadcn/ui components
- ✅ React Hook Form + Zod validation

### Backend:
- ✅ Supabase (Database + Auth)
- ✅ Server Actions
- ✅ Row Level Security (RLS)

### State Management:
- Server State: React Server Components
- Client State: React useState/useReducer
- Form State: React Hook Form

---

## 📅 Timeline Estimate

| Phase | Features | Hours | Days (4h/day) |
|-------|----------|-------|---------------|
| Phase 1 | Core (Dashboard, Search, Apply, Applications) | 9-12h | 2-3 days |
| Phase 2 | Profile & Saved | 3-4h | 1 day |
| Phase 3 | Notifications | 2-3h | 1 day |
| **TOTAL** | **All Features** | **14-19h** | **4-5 days** |

---

## ✅ Ready to Start?

### Prerequisites Checklist:
- [x] Employer module completed
- [x] Database schema created
- [x] RLS policies configured
- [x] Onboarding candidate completed
- [x] Auth system working
- [ ] Create `saved_jobs` table (migration)
- [ ] Create `notifications` table (migration)

### Start with Phase 1:
```bash
# 1. Create dashboard
src/app/dashboard/candidate/page.tsx

# 2. Create job search
src/app/dashboard/candidate/jobs/page.tsx

# 3. Create job detail & apply
src/app/dashboard/candidate/jobs/[id]/page.tsx

# 4. Create applications tracking
src/app/dashboard/candidate/applications/page.tsx
```

---

## 🙋 Decisions Made:

1. ✅ **Job Recommendation**: Manual filter saja (no AI/ML)
2. ✅ **Chat System**: TIDAK perlu (no chat dengan employer)
3. ✅ **Email Notifications**: Menggunakan **Resend** (3,000 emails/month GRATIS)
4. ✅ **Resume Builder**: Upload PDF saja (no built-in CV builder)
5. ✅ **Application Limit**: No limit (kandidat bebas apply ke berapa pun job)
6. ✅ **Implementation**: Per fitur (step by step), NOT all at once

### Email Setup (Resend - FREE):
```bash
npm install resend
# Free tier: 3,000 emails/month
# Features:
# - Application status updates
# - Interview invitations
# - Offer notifications
# - Job recommendations (weekly digest)
```

---

**Status**: Ready for implementation ✅
**Next Step**: Mulai dari Fitur #1 - Dashboard Candidate
**Approach**: Build per fitur, test, then move to next
