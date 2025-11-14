-- Script untuk membuat test job di database Supabase
-- Jalankan di Supabase SQL Editor

-- 1. Cari employer_id yang sudah ada (atau buat dummy employer dulu jika belum ada)
-- Jika belum ada employer, jalankan ini dulu:
-- INSERT INTO employers (user_id, company_name, industry, pic_name, pic_email, pic_phone, status)
-- VALUES (
--   (SELECT id FROM auth.users LIMIT 1), -- Ambil user pertama
--   'PT Tech Indonesia',
--   'Teknologi Informasi',
--   'John Doe',
--   'john@techindo.com',
--   '081234567890',
--   'approved'
-- );

-- 2. Insert test job
INSERT INTO jobs (
  title,
  slug,
  employer_id,
  created_by,
  description,
  responsibilities,
  requirements,
  benefits,
  location_city,
  location_country,
  is_remote,
  employment_type,
  category,
  salary_min,
  salary_max,
  currency,
  salary_negotiable,
  quota,
  deadline,
  status,
  published_at
)
VALUES (
  'Full Stack Developer',
  'full-stack-developer-' || EXTRACT(EPOCH FROM NOW())::bigint,
  (SELECT id FROM employers LIMIT 1), -- Ambil employer pertama
  (SELECT user_id FROM employers LIMIT 1), -- Ambil user dari employer
  '<p>Kami mencari Full Stack Developer yang berpengalaman untuk bergabung dengan tim kami. Anda akan bertanggung jawab untuk mengembangkan aplikasi web modern menggunakan teknologi terkini.</p>
   <p>Posisi ini cocok untuk Anda yang passionate terhadap teknologi dan ingin terus berkembang dalam karir sebagai software developer.</p>',
  '<ul>
    <li>Mengembangkan dan maintain aplikasi web</li>
    <li>Berkolaborasi dengan tim product dan design</li>
    <li>Menulis clean code dan dokumentasi</li>
    <li>Melakukan code review dan testing</li>
    <li>Troubleshooting dan bug fixing</li>
  </ul>',
  ARRAY[
    'Minimal 2 tahun pengalaman sebagai Full Stack Developer',
    'Menguasai React.js, Node.js, dan PostgreSQL',
    'Familiar dengan Git dan Agile methodology',
    'Kemampuan problem solving yang baik',
    'Dapat bekerja dalam tim maupun mandiri'
  ],
  '<ul>
    <li>Gaji kompetitif sesuai pengalaman</li>
    <li>Asuransi kesehatan</li>
    <li>Flexible working hours</li>
    <li>Work from home option</li>
    <li>Budget untuk training dan certification</li>
    <li>Team outing dan company trip</li>
  </ul>',
  'Bandung',
  'Indonesia',
  true, -- is_remote
  'fulltime',
  'IT & Software Development',
  8000000, -- salary_min
  15000000, -- salary_max
  'IDR',
  true, -- salary_negotiable
  5, -- quota
  (NOW() + INTERVAL '30 days')::date, -- deadline 30 hari dari sekarang
  'published',
  NOW()
);

-- 3. Insert beberapa test jobs lagi dengan variasi
INSERT INTO jobs (
  title,
  slug,
  employer_id,
  created_by,
  description,
  location_city,
  employment_type,
  category,
  salary_min,
  salary_max,
  deadline,
  status,
  published_at
)
VALUES
(
  'Frontend Developer',
  'frontend-developer-' || EXTRACT(EPOCH FROM NOW())::bigint,
  (SELECT id FROM employers LIMIT 1),
  (SELECT user_id FROM employers LIMIT 1),
  '<p>Mencari Frontend Developer untuk mengembangkan UI/UX aplikasi web yang menarik dan user-friendly.</p>',
  'Jakarta',
  'fulltime',
  'IT & Software Development',
  7000000,
  12000000,
  (NOW() + INTERVAL '25 days')::date,
  'published',
  NOW()
),
(
  'UI/UX Designer',
  'uiux-designer-' || EXTRACT(EPOCH FROM NOW())::bigint,
  (SELECT id FROM employers LIMIT 1),
  (SELECT user_id FROM employers LIMIT 1),
  '<p>Kami membutuhkan UI/UX Designer kreatif untuk merancang experience yang luar biasa bagi pengguna kami.</p>',
  'Bandung',
  'fulltime',
  'Design',
  6000000,
  10000000,
  (NOW() + INTERVAL '20 days')::date,
  'published',
  NOW()
),
(
  'Digital Marketing Specialist',
  'digital-marketing-specialist-' || EXTRACT(EPOCH FROM NOW())::bigint,
  (SELECT id FROM employers LIMIT 1),
  (SELECT user_id FROM employers LIMIT 1),
  '<p>Bergabunglah dengan tim marketing kami untuk mengembangkan strategi digital marketing yang efektif.</p>',
  'Jakarta',
  'fulltime',
  'Marketing',
  5000000,
  9000000,
  (NOW() + INTERVAL '15 days')::date,
  'published',
  NOW()
);

-- Tampilkan jobs yang baru dibuat
SELECT
  id,
  title,
  slug,
  status,
  published_at,
  deadline
FROM jobs
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 10;
