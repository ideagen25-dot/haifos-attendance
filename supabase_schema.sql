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

-- Public Read Policies (Allow students & public to verify certificates & check attendance)
CREATE POLICY "Allow public read on certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read on attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public read on students" ON public.students FOR SELECT USING (true);
