-- Run this in the Supabase SQL Editor to create the necessary tables and storage for StudyVault

-- 1. Create the Documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id text PRIMARY KEY,
    name text NOT NULL,
    "subjectId" text NOT NULL,
    "categoryId" text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" text NOT NULL,
    "uploadedAt" text NOT NULL,
    "updatedAt" text NOT NULL,
    unit text,
    topic text,
    tags text[],
    description text,
    favorite boolean DEFAULT false,
    "lastOpenedAt" text,
    "storagePath" text,
    progress integer,
    pages integer
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since this is a personal vault)
-- In a multi-user app, you would restrict this using auth.uid()
CREATE POLICY "Allow all access to documents" ON public.documents
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. Create the Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow all access to the bucket
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'documents');

CREATE POLICY "Allow public insert access" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public delete access" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'documents');

CREATE POLICY "Allow public update access" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'documents');
