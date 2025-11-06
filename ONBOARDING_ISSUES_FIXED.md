# Onboarding Issues & Fixes - Summary

## Masalah yang Ditemukan

### 1. Step 1: Data Pribadi ✅ FIXED
**Masalah:** Kolom database tidak sesuai dengan form
- Tabel `candidate_profiles` tidak punya kolom: `nik`, `full_name`, `birth_place`, `birth_date`, `phone`
- **Fix:** Migration `20250106000004_add_candidate_fields.sql` menambahkan kolom-kolom ini

### 2. Step 2: Pendidikan ❌ MASIH ERROR
**Masalah:** ENUM mismatch
- Database ENUM `education_level` punya nilai: `'SMA', 'SMK', 'D3', 'D4', 'S1', 'S2', 'S3'` (UPPERCASE, tidak ada SMP, D1, D2)
- Form mengirim: `'smp', 'sma', 'smk', 'd1', 'd2', 'd3', 'd4', 's1', 's2', 's3'` (lowercase, ada SMP, D1, D2)
- Kolom `institution` tidak ada di schema asli
- **Fix:**
  - Migration `20250106000004_add_candidate_fields.sql` menambahkan kolom `institution`
  - Migration `20250106000005_fix_education_enum.sql` menambahkan nilai lowercase ke ENUM

### 3. Step 3: Pengalaman & Skill
**Masalah potensial:** Nama kolom di database
- Database schema asli: `candidate_experiences.user_id` dan `candidate_experiences.company`
- Code menggunakan: `candidate_id` dan `company_name`
- **Fix:** Migration `20250106000004_add_candidate_fields.sql` rename kolom dan update RLS policies

### 4. Step 4: Dokumen
**Masalah:** Kolom tidak ada
- Kolom `ktp_url`, `diploma_url`, `certificate_urls` tidak ada di schema asli
- **Fix:** Migration `20250106000004_add_candidate_fields.sql` menambahkan kolom-kolom ini

### 5. Step 5: CV Generation
**Status:** OK - Feature ini hanya preview, belum ada actual generation

## Migration Files yang Harus Dijalankan

### Migration 1: `20250106000004_add_candidate_fields.sql`
Menambahkan:
- Kolom `nik`, `full_name`, `birth_place`, `birth_date`, `phone` untuk Step 1
- Kolom `institution` untuk Step 2
- Kolom `diploma_url`, `ktp_url`, `certificate_urls` untuk Step 4
- Rename `user_id` → `candidate_id` di `candidate_experiences`
- Rename `company` → `company_name` di `candidate_experiences`
- Update RLS policies

### Migration 2: `20250106000005_fix_education_enum.sql`
Menambahkan nilai lowercase ke ENUM `education_level`:
- Menambahkan: `'smp', 'sma', 'smk', 'd1', 'd2', 'd3', 'd4', 's1', 's2', 's3'`
- Nilai lama (uppercase) tetap ada untuk backward compatibility

## Cara Menjalankan Migrations

### Via Supabase Dashboard (Recommended)
1. Buka: https://supabase.com/dashboard/project/xhczueopyopbthkqaqvv/sql/new

2. **Jalankan Migration 1** (Copy-paste file `20250106000004_add_candidate_fields.sql`)
   - Klik **Run**
   - Tunggu sampai success

3. **Jalankan Migration 2** (Copy-paste file `20250106000005_fix_education_enum.sql`)
   - Klik **Run**
   - Tunggu sampai success

## Testing Checklist

Setelah migration dijalankan, test semua langkah onboarding:

- [ ] **Step 1: Data Pribadi**
  - [ ] Isi NIK (16 digit)
  - [ ] Isi Nama Lengkap
  - [ ] Isi Tempat Lahir
  - [ ] Pilih Tanggal Lahir
  - [ ] Pilih Jenis Kelamin
  - [ ] Isi Alamat
  - [ ] Isi Nomor Telepon
  - [ ] Klik "Simpan & Lanjut" → harus berhasil

- [ ] **Step 2: Pendidikan**
  - [ ] Pilih Jenjang Pendidikan (SMP/SMA/SMK/D1-D4/S1-S3)
  - [ ] Isi Nama Institusi
  - [ ] Isi Jurusan
  - [ ] Isi Tahun Lulus
  - [ ] Isi IPK (opsional)
  - [ ] Klik "Simpan & Lanjut" → harus berhasil

- [ ] **Step 3: Pengalaman & Skill**
  - [ ] Tambah minimal 1 skill
  - [ ] (Opsional) Tambah pengalaman kerja
  - [ ] Klik "Simpan & Lanjut" → harus berhasil

- [ ] **Step 4: Dokumen**
  - [ ] (Opsional) Upload KTP
  - [ ] (Opsional) Upload Ijazah
  - [ ] (Opsional) Upload Sertifikat
  - [ ] Klik "Simpan & Lanjut" → harus berhasil

- [ ] **Step 5: Generate CV**
  - [ ] Preview data muncul dengan benar
  - [ ] Pilih template
  - [ ] Klik "Selesai" → redirect ke dashboard
  - [ ] Profile `onboarding_completed` = true

## Schema Database Final

### Table: `candidate_profiles`
```sql
- user_id (UUID, PK, FK to auth.users)
- nik (TEXT) -- Step 1
- full_name (TEXT) -- Step 1
- birth_place (TEXT) -- Step 1
- birth_date (DATE) -- Step 1
- gender (TEXT) -- Step 1
- address (TEXT) -- Step 1
- phone (TEXT) -- Step 1
- education_level (education_level ENUM) -- Step 2
- institution (TEXT) -- Step 2
- major (TEXT) -- Step 2
- graduation_year (INTEGER) -- Step 2
- gpa (NUMERIC(3,2)) -- Step 2
- skills (TEXT[]) -- Step 3
- ktp_url (TEXT) -- Step 4
- diploma_url (TEXT) -- Step 4
- certificate_urls (TEXT[]) -- Step 4
- cv_url (TEXT) -- Step 5 (future)
... (fields lain dari schema asli)
```

### Table: `candidate_experiences`
```sql
- id (UUID, PK)
- candidate_id (UUID, FK to auth.users) -- renamed from user_id
- company_name (TEXT) -- renamed from company
- position (TEXT)
- start_date (DATE)
- end_date (DATE, nullable)
- is_current (BOOLEAN)
- description (TEXT, nullable)
- created_at (TIMESTAMPTZ)
```

### ENUM: `education_level`
Nilai yang bisa digunakan (lowercase - sesuai form):
- `'smp'`
- `'sma'`
- `'smk'`
- `'d1'`
- `'d2'`
- `'d3'`
- `'d4'`
- `'s1'`
- `'s2'`
- `'s3'`

## Notes
- Migration 1 sudah pernah dijalankan tapi ada error karena RLS policy
- Migration 1 sudah diperbaiki dan siap dijalankan ulang
- Migration 2 adalah fix baru untuk ENUM education_level
