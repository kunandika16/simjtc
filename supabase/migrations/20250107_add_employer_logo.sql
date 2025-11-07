-- Migration: Add logo_url to employers table and setup storage
-- Created: 2025-01-07
-- Description: Adds logo_url field to employers table and creates storage bucket for company logos

-- Add logo_url column to employers table
ALTER TABLE employers ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage bucket for company logos if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for company logos bucket
-- Allow authenticated users to upload their own company logos
CREATE POLICY "Employers can upload their company logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow employers to update their own logos
CREATE POLICY "Employers can update their company logo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow employers to delete their own logos
CREATE POLICY "Employers can delete their company logo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to company logos
CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Add comment to the new column
COMMENT ON COLUMN employers.logo_url IS 'URL to company logo stored in Supabase Storage';
