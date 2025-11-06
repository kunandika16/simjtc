# Menjalankan Migration

## Masalah yang Ditemukan
Tabel `candidate_profiles` di database tidak memiliki kolom yang diperlukan oleh form:
- `nik`
- `full_name`
- `birth_place`
- `birth_date`
- `phone`
- `institution`
- `diploma_url`
- `ktp_url`
- `certificate_urls`

## Solusi
Migration file sudah dibuat di: `supabase/migrations/20250106000004_add_candidate_fields.sql`

## Cara Menjalankan

### Option 1: Via Supabase Dashboard (Tercepat)
1. Buka https://supabase.com/dashboard/project/xhczueopyopbthkqaqvv/sql/new
2. Copy paste isi file `supabase/migrations/20250106000004_add_candidate_fields.sql`
3. Klik **Run**
4. Selesai!

### Option 2: Via Supabase CLI
```bash
# Link project (jika belum)
npx supabase link --project-ref xhczueopyopbthkqaqvv

# Push migration
npx supabase db push
```

## Testing Setelah Migration
Setelah migration berhasil dijalankan:
1. Refresh halaman onboarding
2. Coba isi form data pribadi
3. Submit form
4. Data seharusnya berhasil disimpan
