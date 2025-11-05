\# 🧭 Project Overview – Sistem Informasi Penyaluran \& Pelatihan Tenaga Kerja Jawa Barat



\## 📌 Deskripsi Singkat

Sistem ini merupakan platform digital untuk mendukung peningkatan kualitas dan penyaluran tenaga kerja di Jawa Barat, diinisiasi oleh \*\*Departemen P2TK Bidang Ketenagakerjaan PKS Jawa Barat\*\*.



Proyek terdiri dari dua komponen utama:

1\. \*\*Landing Page (Publik)\*\* – menampilkan informasi program, berita, pelatihan, dan lowongan.

2\. \*\*Sistem Informasi (Internal/Admin)\*\* – untuk pengelolaan lowongan kerja, pelatihan, artikel, dan monitoring data tenaga kerja.



---



\## 🎯 Tujuan Utama

\- Menyediakan \*\*portal informasi\*\* yang kredibel dan profesional.  

\- Memudahkan \*\*pengelolaan lowongan kerja \& pelatihan\*\* oleh admin.  

\- Meningkatkan \*\*transparansi dan kolaborasi\*\* antara LPK, BLK, dan industri.  

\- Mempersiapkan fondasi sistem yang \*\*scalable\*\* ke arah multi-role portal.



---



\## ⚙️ Tech Stack



| Layer | Tools / Framework | Catatan |

|-------|--------------------|----------|

| \*\*Frontend\*\* | \[Next.js 15 (App Router, TS)](https://nextjs.org/) | Modern React + Server Components |

| \*\*UI System\*\* | \[TailwindCSS](https://tailwindcss.com/) + \[shadcn/ui](https://ui.shadcn.com/) | Clean, accessible, modular |

| \*\*Animation\*\* | \[Framer Motion](https://www.framer.com/motion/) | Smooth interaction \& reveal animation |

| \*\*Backend (as a Service)\*\* | \[Supabase](https://supabase.com/) | Auth, Database, Storage, RLS |

| \*\*Auth Provider\*\* | Supabase Auth (Email, Google) | OAuth2 compliant |

| \*\*Deployment\*\* | Local → Vercel / Self Hosting | Ready for production migration |

| \*\*Version Control\*\* | Git (main/dev branches) | CI/CD optional |

| \*\*Docs \& Agent Context\*\* | Markdown + Warp.dev AI agent | Maintain dev consistency |



---



\## 🧩 Struktur Modul (MVP)



\### 1. Auth \& Profile

\- Login / Register via Email atau Google.

\- Onboarding berdasarkan tipe user:

&nbsp; - \*\*Kandidat:\*\* isi profil + generate CV.

&nbsp; - \*\*Mitra BLK:\*\* isi profil lembaga.

&nbsp; - \*\*Perusahaan:\*\* isi profil perusahaan.

\- Forgot password + update profil.



\### 2. Lowongan Kerja

\- Admin-only CRUD (judul, kategori, lokasi, deskripsi, deadline).

\- Publik hanya bisa melihat daftar dan diarahkan ke sumber eksternal.

\- Tracking klik untuk statistik KPI.



\### 3. Pelatihan

\- Admin CRUD program \& kelas pelatihan.

\- User publik bisa melihat \& mendaftar.

\- Status pendaftaran: pending → accepted → completed.



\### 4. Artikel \& Publikasi

\- Admin CRUD artikel dan kategori.

\- Halaman publik: `/articles`, `/articles/\[slug]`.

\- SEO + metadata otomatis.



\### 5. Dashboard KPI (Basic)

\- Ringkasan statistik:

&nbsp; - Total lowongan aktif

&nbsp; - Total klik / pelamar

&nbsp; - Total program \& peserta

\- Filter by tanggal / kategori.



---



\## 🧱 Struktur Folder

/app # Next.js app router

/components # UI reusable components

/lib # Supabase client, utils

/styles # Tailwind globals

/public # Static assets (logo, favicon, images)

/supabase # SQL migrations \& policies

/docs # Documentation (this file, tech notes)



yaml

Copy code



---



\## 🧭 Milestone (4 Minggu Efektif)



| Tahap | Deskripsi | Durasi |

|--------|------------|---------|

| 1️⃣ Setup \& Integrasi Supabase | Next.js + Supabase + shadcn init | 2 hari |

| 2️⃣ Schema \& RLS | Tabel: users, jobs, trainings, articles, enrollments | 3 hari |

| 3️⃣ Auth \& Role Guard | Email/Google login, onboarding | 3 hari |

| 4️⃣ CRUD Admin (Jobs \& Articles) | Admin CMS \& form input | 4 hari |

| 5️⃣ Training Module | Pendaftaran \& approval dasar | 4 hari |

| 6️⃣ Dashboard KPI | Statistik dasar dari tabel | 2 hari |

| 7️⃣ QA + UI Polish + Deploy | SEO, performance, domain setup | 3 hari |



---



\## 🗂️ Deliverables

\- Source code (Next.js + Supabase)

\- `.env.example` lengkap

\- Database schema \& RLS SQL script

\- UI design guideline (Tailwind + Shadcn)

\- Panduan Admin (PDF)

\- Warp Agent reference (markdown ini)



---



\## 🧠 Agent Instruction (Context untuk Warp.dev)

> Semua perintah dan automation yang dijalankan agent harus \*\*selaras dengan file ini\*\*.  

> Jangan ubah struktur stack, library utama, atau skema database tanpa konfirmasi eksplisit.  

> Jika menemukan dependency usang atau versi konflik, prioritaskan solusi \*\*kompatibel\*\* dengan Next.js 15, Supabase v2, dan Node ≥ 20.19.  

> Gunakan penamaan folder dan komponen sesuai konvensi di atas.



---



\## 🔒 Environment Variables (Template)

```env

NEXT\_PUBLIC\_SUPABASE\_URL=

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY=

NEXT\_PUBLIC\_SITE\_URL=http://localhost:3000

🚀 Deployment Notes

Staging: Vercel (auto build via GitHub)



Production: bisa dipindahkan ke VPS (Node + Nginx)



Backup: Supabase automated daily backups



Monitoring: Supabase logs + optional Sentry integration



📞 Kontak \& Maintainer

Project Owner: Departemen P2TK Bidnaker PKS Jabar



Developer: Andika Rian Ansari



Version: v1.0.0-mvp



Created: Oktober 2025



Repository: private (Warp.dev workspace)



