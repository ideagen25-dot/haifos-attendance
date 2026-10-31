-- ========================================================
-- HAIFOS PORTAL - SUPABASE POSTGRESQL FREE SCHEMA
-- Run this in the Supabase SQL Editor if you wish to connect
-- your cloud PostgreSQL database (100% Free tier).
-- ========================================================

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    duration TEXT,
    description TEXT,
    instructor TEXT,
    total_sessions INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    enrollment_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
    course_name TEXT NOT NULL,
    batch TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Certificates Table (Zero server file storage; only metadata stored!)
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY, -- Unique Certificate ID e.g. HF-2026-WEB-8192
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    enrollment_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    student_email TEXT NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    grade TEXT NOT NULL,
    status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
    verification_hash TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    issued_by TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    enrollment_number TEXT NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    topic_covered TEXT,
    marked_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted read & write for portal operations using Anon Key
CREATE POLICY "Allow public all on certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- 5. Administrator Profiles Table (Managed via Supabase Auth)
-- Stores role (SUPER_ADMIN vs ADMIN), username, status, etc.
-- Password management & hashing is handled 100% by Supabase Auth (auth.users).
-- ========================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_username ON public.admin_profiles(username);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

-- Enable Row Level Security (RLS) on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at timestamp on row updates
CREATE OR REPLACE FUNCTION update_admin_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER tr_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION update_admin_profile_timestamp();

-- RLS Policies for admin_profiles
-- 1. Read: Allow reading active profiles (needed for username login resolution and dashboard display)
CREATE POLICY "Allow read on admin_profiles" 
ON public.admin_profiles FOR SELECT USING (true);

-- 2. Insert: Allow inserting new administrator profile
CREATE POLICY "Allow insert on admin_profiles" 
ON public.admin_profiles FOR INSERT WITH CHECK (true);

-- 3. Update: Allow updating admin profile
CREATE POLICY "Allow update on admin_profiles" 
ON public.admin_profiles FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Delete: Allow delete on admin_profiles
CREATE POLICY "Allow delete on admin_profiles" 
ON public.admin_profiles FOR DELETE USING (true);
