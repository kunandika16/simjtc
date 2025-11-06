# Supabase Database Setup

## 📋 Migrations Overview

Project ini menggunakan 3 migration files untuk setup database:

1. **`20250106000001_initial_schema.sql`** - Database schema lengkap
2. **`20250106000002_rls_policies.sql`** - Row Level Security policies
3. **`20250106000003_storage_setup.sql`** - Storage buckets & policies

## 🚀 Cara Menjalankan Migrations

### Opsi 1: Via Supabase Dashboard (Recommended)

1. Buka Supabase Dashboard di https://supabase.com/dashboard
2. Pilih project Anda: `xhczueopyopbthkqaqvv`
3. Ke menu **SQL Editor**
4. Copy-paste isi dari setiap file migration **sesuai urutan**:
   - Jalankan `20250106000001_initial_schema.sql` terlebih dahulu
   - Kemudian `20250106000002_rls_policies.sql`
   - Terakhir `20250106000003_storage_setup.sql`
5. Klik **Run** untuk execute setiap script

### Opsi 2: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project
supabase link --project-ref xhczueopyopbthkqaqvv

# Run migrations
supabase db push
```

## 📊 Database Schema Structure

### Auth Module
- `profiles` - User profiles (extends auth.users)
- `candidate_profiles` - Candidate-specific data
- `candidate_experiences` - Work history
- `documents` - Uploaded documents

### Employer Module
- `employers` - Company/employer profiles
- `jobs` - Job listings
- `applications` - Job applications

### Institution Module
- `institutions` - Training institution profiles
- `training_programs` - Training programs
- `training_classes` - Training batches/classes
- `enrollments` - Training enrollments
- `certificates` - Digital certificates

## 🔐 Row Level Security (RLS)

Semua tabel sudah dilengkapi dengan RLS policies:

- **Candidate**: Hanya bisa akses data sendiri
- **Employer**: Bisa akses job & applicants milik sendiri
- **Institution**: Bisa akses program & enrollments milik sendiri
- **Admin**: Full access ke semua data

## 📦 Storage Buckets

Bucket yang tersedia:

| Bucket | Public/Private | Deskripsi |
|--------|---------------|-----------|
| `avatars` | Public | User profile pictures |
| `documents` | Private | KTP, Ijazah, Sertifikat |
| `cvs` | Private | CV files |
| `certificates` | Public | Digital certificates (for verification) |
| `company-logos` | Public | Company/employer logos |
| `institution-photos` | Public | Institution photos |

## 🔄 Updating Database Types

Setelah menjalankan migrations, generate TypeScript types:

```bash
# Via Supabase CLI
supabase gen types typescript --project-id xhczueopyopbthkqaqvv > src/types/database.types.ts
```

Atau manual via Dashboard:
1. Ke **API Docs** > **Tables and Views**
2. Copy generated TypeScript types
3. Paste ke `src/types/database.types.ts`

## ⚠️ Important Notes

1. **Jangan jalankan migration dua kali** - SQL akan error jika table sudah ada
2. **Backup data** sebelum menjalankan migration di production
3. **Test di local** atau development environment dulu
4. **Periksa RLS policies** setelah deployment untuk memastikan security

## 🧪 Testing Database

Setelah migration, test koneksi:

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Test query
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(1)

console.log({ data, error })
```

## 📞 Troubleshooting

### Error: "relation already exists"
Migration sudah pernah dijalankan. Skip atau drop tables dulu (hati-hati!).

### Error: "permission denied"
Pastikan menggunakan service_role key untuk admin operations.

### RLS blocking queries
Check RLS policies atau gunakan service_role client untuk admin operations.

## 🔗 Resources

- [Supabase SQL Editor](https://supabase.com/dashboard/project/xhczueopyopbthkqaqvv/sql)
- [Supabase Storage](https://supabase.com/dashboard/project/xhczueopyopbthkqaqvv/storage/buckets)
- [Database Documentation](https://supabase.com/docs/guides/database)
