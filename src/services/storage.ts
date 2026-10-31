import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Student, Course, Certificate, AttendanceRecord, SystemSettings, AdminProfile, AdminRole, AdminSession } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'haifos_students',
  COURSES: 'haifos_courses',
  CERTIFICATES: 'haifos_certificates',
  ATTENDANCE: 'haifos_attendance',
  SETTINGS: 'haifos_settings',
};

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Digital Literacy & Emerging AI Technologies',
    code: 'DL-AI',
    duration: '8 Weeks (60 Hours)',
    description: 'Foundational computer proficiency, internet navigation, digital security, and modern artificial intelligence tools for community empowerment.',
    instructor: 'Dr. K. Srinivas & IIT Hyderabad Mentors',
    totalSessions: 24,
  },
  {
    id: 'course-2',
    title: 'Full Stack Web Development & Cloud Systems',
    code: 'WEB-DEV',
    duration: '12 Weeks (100 Hours)',
    description: 'Comprehensive modern web development covering frontend (React/TypeScript), backend APIs, database management, and cloud deployment.',
    instructor: 'A. Raman & Tech Volunteer Council',
    totalSessions: 36,
  },
  {
    id: 'course-3',
    title: 'Python for Data Science & Rural Analytics',
    code: 'PY-DATA',
    duration: '10 Weeks (80 Hours)',
    description: 'Practical data science using Python, Pandas, data visualization, and applied community data modeling.',
    instructor: 'P. Mehra, M.Tech Data Science',
    totalSessions: 30,
  },
  {
    id: 'course-4',
    title: 'Community Digital Center Management & Leadership',
    code: 'RURAL-LEAD',
    duration: '6 Weeks (45 Hours)',
    description: 'Training rural youth leaders to operate and sustain community learning centers, digital services, and student workshops.',
    instructor: 'HAIFOS Program Directors',
    totalSessions: 18,
  },
];

const DEFAULT_SETTINGS: SystemSettings = {
  orgName: 'HAIFOS INNOVATIVE FORUM',
  orgTagline: 'Empowering Communities Through Digital Access & Innovation',
  orgEmail: 'info@haifos.org',
  orgPhone: '+91 7709963514',
  orgWebsite: 'https://www.haifos.org',
  orgAddress: 'IIT Hyderabad Incubator / Hyderabad & Regional Centers, India',
  directorName: 'Subhash Singh',
  directorTitle: 'Executive Director & Co-Founder',
  coordinatorName: 'Vivek Kumar',
  coordinatorTitle: 'Academic Director & IIT-H Alumnus',
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'std-1',
    enrollmentNumber: 'HF-2026-001',
    firstName: 'Rahul',
    lastName: 'Sharma',
    fullName: 'Rahul Sharma',
    dateOfBirth: '2002-04-15',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    courseId: 'course-2',
    courseName: 'Full Stack Web Development & Cloud Systems',
    batch: 'Batch 2026-Alpha',
    status: 'completed',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'std-2',
    enrollmentNumber: 'HF-2026-002',
    firstName: 'Priya',
    lastName: 'Patel',
    fullName: 'Priya Patel',
    dateOfBirth: '2003-08-22',
    email: 'priya.patel@example.com',
    phone: '+91 9876543211',
    courseId: 'course-1',
    courseName: 'Digital Literacy & Emerging AI Technologies',
    batch: 'Batch 2026-Alpha',
    status: 'completed',
    createdAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'std-3',
    enrollmentNumber: 'HF-2026-003',
    firstName: 'Amit',
    lastName: 'Verma',
    fullName: 'Amit Verma',
    dateOfBirth: '2001-11-05',
    email: 'amit.verma@example.com',
    phone: '+91 9876543212',
    courseId: 'course-3',
    courseName: 'Python for Data Science & Rural Analytics',
    batch: 'Batch 2026-Beta',
    status: 'active',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'std-4',
    enrollmentNumber: 'HF-2026-004',
    firstName: 'Sneha',
    lastName: 'Reddy',
    fullName: 'Sneha Reddy',
    dateOfBirth: '2004-01-30',
    email: 'sneha.reddy@example.com',
    phone: '+91 9876543213',
    courseId: 'course-1',
    courseName: 'Digital Literacy & Emerging AI Technologies',
    batch: 'Batch 2026-Alpha',
    status: 'active',
    createdAt: '2026-02-05T09:00:00Z',
  },
];

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: 'HF-2026-WEB-8192',
    studentId: 'std-1',
    enrollmentNumber: 'HF-2026-001',
    studentName: 'Rahul Sharma',
    lastName: 'Sharma',
    dateOfBirth: '2002-04-15',
    studentEmail: 'rahul.sharma@example.com',
    courseId: 'course-2',
    courseName: 'Full Stack Web Development & Cloud Systems',
    issueDate: '2026-03-20',
    completionDate: '2026-03-18',
    grade: 'Distinction (Grade A+)',
    status: 'issued',
    verificationHash: 'sha256-a9b8c7d6e5f4123890abc',
    emailSent: true,
    emailSentAt: '2026-03-20T10:15:00Z',
    issuedBy: 'HAIFOS Academic Registry',
    notes: 'Exemplary project performance in rural e-governance portal design.',
  },
  {
    id: 'HF-2026-DL-4731',
    studentId: 'std-2',
    enrollmentNumber: 'HF-2026-002',
    studentName: 'Priya Patel',
    lastName: 'Patel',
    dateOfBirth: '2003-08-22',
    studentEmail: 'priya.patel@example.com',
    courseId: 'course-1',
    courseName: 'Digital Literacy & Emerging AI Technologies',
    issueDate: '2026-03-15',
    completionDate: '2026-03-12',
    grade: 'Excellence (Grade A)',
    status: 'issued',
    verificationHash: 'sha256-f4e3d2c1b0a9876543210',
    emailSent: true,
    emailSentAt: '2026-03-15T11:30:00Z',
    issuedBy: 'HAIFOS Academic Registry',
    notes: 'Achieved 98% attendance and peer-training leadership.',
  },
];

function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = [
    '2026-03-02', '2026-03-04', '2026-03-06', '2026-03-09',
    '2026-03-11', '2026-03-13', '2026-03-16', '2026-03-18',
    '2026-03-20', '2026-03-23', '2026-03-25', '2026-03-27'
  ];

  const students = [
    { id: 'std-1', enrollmentNumber: 'HF-2026-001', courseId: 'course-2' },
    { id: 'std-2', enrollmentNumber: 'HF-2026-002', courseId: 'course-1' },
    { id: 'std-3', enrollmentNumber: 'HF-2026-003', courseId: 'course-3' },
    { id: 'std-4', enrollmentNumber: 'HF-2026-004', courseId: 'course-1' },
  ];

  dates.forEach((date, dateIndex) => {
    students.forEach((student) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      if ((dateIndex === 3 && student.id === 'std-1') || (dateIndex === 7 && student.id === 'std-3')) {
        status = 'absent';
      } else if (dateIndex === 5 && student.id === 'std-4') {
        status = 'late';
      }

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        enrollmentNumber: student.enrollmentNumber,
        courseId: student.courseId,
        date,
        status,
        topicCovered: `Module Session #${dateIndex + 1}: Hands-on Practical Lab`,
        markedBy: 'Lead Instructor',
        createdAt: `${date}T09:30:00Z`,
      });
    });
  });

  return records;
}

class StorageService {
  private supabaseClient: SupabaseClient | null = null;

  constructor() {
    this.initSupabase();
    // Auto-fetch latest cloud records in background if Supabase is configured
    this.fetchCloudDataInBackground();
  }

  // Initialize Supabase client if keys are present (either from settings or .env)
  public initSupabase(): SupabaseClient | null {
    const settings = this.getSettings();
    const url = settings.supabaseUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const key = settings.supabaseAnonKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    if (url && key && url.startsWith('http')) {
      try {
        this.supabaseClient = createClient(url, key);
        return this.supabaseClient;
      } catch (err) {
        console.warn('Supabase initialization failed:', err);
      }
    }
    this.supabaseClient = null;
    return null;
  }

  public getSupabaseClient(): SupabaseClient | null {
    if (!this.supabaseClient) {
      return this.initSupabase();
    }
    return this.supabaseClient;
  }

  // --- Admin Authentication & User Management (Supabase Driven) ---
  public async checkAdminSetupStatus(): Promise<{
    isConfigured: boolean;
    tableExists: boolean;
    hasSuperAdmin: boolean;
    adminCount: number;
    error?: string;
  }> {
    const client = this.getSupabaseClient();
    if (!client) {
      return { isConfigured: false, tableExists: false, hasSuperAdmin: false, adminCount: 0 };
    }

    try {
      const { data, count, error } = await client
        .from('admin_profiles')
        .select('id, role', { count: 'exact', head: false });

      if (error) {
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('not exist')) {
          return {
            isConfigured: true,
            tableExists: false,
            hasSuperAdmin: false,
            adminCount: 0,
            error: 'Table "admin_profiles" not found. Please run the SQL schema migration in your Supabase SQL editor.',
          };
        }
        return { isConfigured: true, tableExists: false, hasSuperAdmin: false, adminCount: 0, error: error.message };
      }

      const totalCount = count ?? (data?.length || 0);
      const hasSuper = (data || []).some((p: any) => p.role === 'SUPER_ADMIN');

      return {
        isConfigured: true,
        tableExists: true,
        hasSuperAdmin: hasSuper,
        adminCount: totalCount,
      };
    } catch (e: any) {
      return { isConfigured: true, tableExists: false, hasSuperAdmin: false, adminCount: 0, error: e.message };
    }
  }

  public async initializeSuperAdmin(params: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; session?: AdminSession; message: string }> {
    const client = this.getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase client is not configured.' };
    }

    const cleanUsername = params.username.trim().toLowerCase();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanFullName = params.fullName.trim();

    try {
      // Passwords managed exclusively by Supabase Auth (bcrypt hashed)
      const { data: authData, error: authError } = await client.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: cleanFullName,
            username: cleanUsername,
            role: 'SUPER_ADMIN',
          },
        },
      });

      if (authError) {
        return { success: false, message: `Supabase Auth error: ${authError.message}` };
      }

      const userId = authData.user?.id;
      if (!userId) {
        return { success: false, message: 'Failed to create Supabase Auth user identity.' };
      }

      const profile: AdminProfile = {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        fullName: cleanFullName,
        role: 'SUPER_ADMIN',
        isActive: true,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { error: profileError } = await client.from('admin_profiles').upsert({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        full_name: profile.fullName,
        role: profile.role,
        is_active: profile.isActive,
        created_by: profile.createdBy,
        created_at: profile.createdAt,
        updated_at: profile.updatedAt,
      });

      if (profileError) {
        return { success: false, message: `Error creating admin profile: ${profileError.message}` };
      }

      const session: AdminSession = {
        user: { id: userId, email: cleanEmail },
        profile,
        token: authData.session?.access_token,
      };

      sessionStorage.setItem('haifos_admin_session', JSON.stringify(session));
      return { success: true, session, message: 'Primary Super Admin account successfully initialized!' };
    } catch (e: any) {
      return { success: false, message: `Initialization failed: ${e.message}` };
    }
  }

  public async loginAdmin(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; session?: AdminSession; message: string }> {
    const client = this.getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase is not configured. Please enter your project credentials.' };
    }

    const cleanInput = identifier.trim().toLowerCase();

    try {
      let emailToAuth = cleanInput;

      // If user entered username instead of email, resolve email from admin_profiles
      if (!cleanInput.includes('@')) {
        const { data: userProfile, error: lookupErr } = await client
          .from('admin_profiles')
          .select('email, is_active')
          .ilike('username', cleanInput)
          .maybeSingle();

        if (lookupErr || !userProfile) {
          return { success: false, message: 'Invalid credentials. Please verify your username or password.' };
        }

        if (!userProfile.is_active) {
          return { success: false, message: 'Your administrator account has been deactivated. Please contact a Super Admin.' };
        }

        emailToAuth = userProfile.email;
      }

      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email: emailToAuth,
        password,
      });

      if (authError || !authData.user) {
        return { success: false, message: 'Invalid credentials. Please verify your email/username and password.' };
      }

      const { data: profileRow, error: profileErr } = await client
        .from('admin_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileErr || !profileRow) {
        await client.auth.signOut();
        return {
          success: false,
          message: 'Authenticated, but no matching administrator profile was found. Access is restricted to authorized admins.',
        };
      }

      if (!profileRow.is_active) {
        await client.auth.signOut();
        return {
          success: false,
          message: 'Your administrator account has been deactivated. Please contact a Super Admin.',
        };
      }

      const profile: AdminProfile = {
        id: profileRow.id,
        username: profileRow.username,
        email: profileRow.email,
        fullName: profileRow.full_name,
        role: profileRow.role as AdminRole,
        isActive: profileRow.is_active,
        createdBy: profileRow.created_by,
        createdAt: profileRow.created_at,
        updatedAt: profileRow.updated_at,
      };

      const session: AdminSession = {
        user: { id: authData.user.id, email: authData.user.email || profile.email },
        profile,
        token: authData.session?.access_token,
      };

      sessionStorage.setItem('haifos_admin_session', JSON.stringify(session));
      return { success: true, session, message: 'Logged in successfully.' };
    } catch (e: any) {
      return { success: false, message: `Login failed: ${e.message}` };
    }
  }

  public async logoutAdmin(): Promise<void> {
    const client = this.getSupabaseClient();
    sessionStorage.removeItem('haifos_admin_session');
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut warning:', err);
      }
    }
  }

  public async getCurrentAdminSession(): Promise<AdminSession | null> {
    const cached = sessionStorage.getItem('haifos_admin_session');
    let sessionObj: AdminSession | null = null;
    if (cached) {
      try {
        sessionObj = JSON.parse(cached);
      } catch {
        sessionObj = null;
      }
    }

    const client = this.getSupabaseClient();
    if (!client) {
      return sessionObj;
    }

    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('haifos_admin_session');
        return null;
      }

      const { data: profileRow } = await client
        .from('admin_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profileRow || !profileRow.is_active) {
        await client.auth.signOut();
        sessionStorage.removeItem('haifos_admin_session');
        return null;
      }

      const profile: AdminProfile = {
        id: profileRow.id,
        username: profileRow.username,
        email: profileRow.email,
        fullName: profileRow.full_name,
        role: profileRow.role as AdminRole,
        isActive: profileRow.is_active,
        createdBy: profileRow.created_by,
        createdAt: profileRow.created_at,
        updatedAt: profileRow.updated_at,
      };

      const updatedSession: AdminSession = {
        user: { id: session.user.id, email: session.user.email || profile.email },
        profile,
        token: session.access_token,
      };

      sessionStorage.setItem('haifos_admin_session', JSON.stringify(updatedSession));
      return updatedSession;
    } catch {
      return sessionObj;
    }
  }

  public async getAdminProfiles(): Promise<AdminProfile[]> {
    const client = this.getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        username: row.username,
        email: row.email,
        fullName: row.full_name,
        role: row.role as AdminRole,
        isActive: row.is_active,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (e) {
      console.error('Failed to fetch admin profiles:', e);
      return [];
    }
  }

  public async createAdminUser(
    params: {
      fullName: string;
      username: string;
      email: string;
      password: string;
      role: AdminRole;
    },
    currentAdmin: AdminProfile
  ): Promise<{ success: boolean; message: string; profile?: AdminProfile }> {
    if (currentAdmin.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'Permission denied: Only Super Admins can create administrator accounts.' };
    }

    const settings = this.getSettings();
    const url = settings.supabaseUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const anonKey = settings.supabaseAnonKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    if (!url || !anonKey) {
      return { success: false, message: 'Supabase credentials are not configured.' };
    }

    const cleanUsername = params.username.trim().toLowerCase();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanFullName = params.fullName.trim();

    try {
      // 1. Attempt secure Netlify Function endpoint if available
      try {
        const response = await fetch('/api/admin-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-user',
            fullName: cleanFullName,
            username: cleanUsername,
            email: cleanEmail,
            password: params.password,
            role: params.role,
            createdBy: currentAdmin.id,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            return {
              success: true,
              message: `Administrator "${cleanFullName}" (${params.role}) successfully created!`,
              profile: resData.profile,
            };
          }
        }
      } catch {
        // Fall back to direct isolated client registration
      }

      // 2. Direct isolated client creation (avoids overwriting current admin session)
      const isolatedClient = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: authData, error: authError } = await isolatedClient.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: cleanFullName,
            username: cleanUsername,
            role: params.role,
          },
        },
      });

      if (authError || !authData.user) {
        return { success: false, message: `Failed to create auth identity: ${authError?.message || 'Unknown error'}` };
      }

      const client = this.getSupabaseClient();
      if (!client) {
        return { success: false, message: 'Database client unavailable.' };
      }

      const newProfile: AdminProfile = {
        id: authData.user.id,
        username: cleanUsername,
        email: cleanEmail,
        fullName: cleanFullName,
        role: params.role,
        isActive: true,
        createdBy: currentAdmin.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { error: insertErr } = await client.from('admin_profiles').insert({
        id: newProfile.id,
        username: newProfile.username,
        email: newProfile.email,
        full_name: newProfile.fullName,
        role: newProfile.role,
        is_active: newProfile.isActive,
        created_by: newProfile.createdBy,
        created_at: newProfile.createdAt,
        updated_at: newProfile.updatedAt,
      });

      if (insertErr) {
        return { success: false, message: `User registered in Auth, but profile insert failed: ${insertErr.message}` };
      }

      return {
        success: true,
        message: `Administrator "${cleanFullName}" (${params.role}) successfully created!`,
        profile: newProfile,
      };
    } catch (e: any) {
      return { success: false, message: `Error creating administrator: ${e.message}` };
    }
  }

  public async updateAdminProfile(
    targetAdminId: string,
    updates: Partial<{ fullName: string; role: AdminRole; isActive: boolean }>,
    currentAdmin: AdminProfile
  ): Promise<{ success: boolean; message: string }> {
    if (currentAdmin.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'Permission denied: Only Super Admins can modify administrator profiles.' };
    }

    if (targetAdminId === currentAdmin.id && updates.isActive === false) {
      return { success: false, message: 'Security restriction: You cannot deactivate your own account.' };
    }

    const client = this.getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase client not initialized.' };

    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.fullName !== undefined) payload.full_name = updates.fullName.trim();
      if (updates.role !== undefined) payload.role = updates.role;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;

      const { error } = await client
        .from('admin_profiles')
        .update(payload)
        .eq('id', targetAdminId);

      if (error) {
        return { success: false, message: `Update failed: ${error.message}` };
      }

      return { success: true, message: 'Administrator profile updated successfully.' };
    } catch (e: any) {
      return { success: false, message: `Update failed: ${e.message}` };
    }
  }

  public async resetAdminPassword(email: string): Promise<{ success: boolean; message: string }> {
    const client = this.getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase client not initialized.' };

    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin + '/#admin',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: `Password reset instructions sent to ${email}.` };
    } catch (e: any) {
      return { success: false, message: `Password reset failed: ${e.message}` };
    }
  }

  public async deleteAdminProfile(
    targetAdminId: string,
    currentAdmin: AdminProfile
  ): Promise<{ success: boolean; message: string }> {
    if (currentAdmin.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'Permission denied: Only Super Admins can delete administrator accounts.' };
    }

    if (targetAdminId === currentAdmin.id) {
      return { success: false, message: 'Security restriction: You cannot delete your own account.' };
    }

    const client = this.getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase client not initialized.' };

    try {
      const { error } = await client
        .from('admin_profiles')
        .delete()
        .eq('id', targetAdminId);

      if (error) {
        return { success: false, message: `Failed to delete administrator: ${error.message}` };
      }

      return { success: true, message: 'Administrator account deleted successfully.' };
    } catch (e: any) {
      return { success: false, message: `Failed to delete administrator: ${e.message}` };
    }
  }

  public isCloudConnected(): boolean {
    return !!this.supabaseClient;
  }

  public async testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
    const client = this.initSupabase();
    if (!client) {
      return { success: false, message: 'Please enter a valid Supabase Project URL and Anon Key.' };
    }
    try {
      const { data, error } = await client.from('courses').select('id').limit(1);
      if (error) {
        return { success: false, message: `Connection error: ${error.message}. Please check your SQL schema setup.` };
      }
      return { success: true, message: 'Successfully connected to Supabase Cloud Database!' };
    } catch (e: any) {
      return { success: false, message: `Connection failed: ${e.message}` };
    }
  }

  private async fetchCloudDataInBackground() {
    if (!this.supabaseClient) return;

    try {
      // 1. Fetch Students
      const { data: cloudStudents } = await this.supabaseClient.from('students').select('*');
      if (cloudStudents && cloudStudents.length > 0) {
        const formatted: Student[] = cloudStudents.map(cs => ({
          id: cs.id,
          enrollmentNumber: cs.enrollment_number,
          firstName: cs.first_name,
          lastName: cs.last_name,
          fullName: cs.full_name,
          dateOfBirth: cs.date_of_birth,
          email: cs.email,
          phone: cs.phone,
          courseId: cs.course_id,
          courseName: cs.course_name,
          batch: cs.batch,
          status: cs.status,
          createdAt: cs.created_at,
        }));
        this.setItem(STORAGE_KEYS.STUDENTS, formatted);
      }

      // 2. Fetch Certificates
      const { data: cloudCerts } = await this.supabaseClient.from('certificates').select('*');
      if (cloudCerts && cloudCerts.length > 0) {
        const formatted: Certificate[] = cloudCerts.map(cc => ({
          id: cc.id,
          studentId: cc.student_id,
          enrollmentNumber: cc.enrollment_number,
          studentName: cc.student_name,
          lastName: cc.last_name,
          dateOfBirth: cc.date_of_birth,
          studentEmail: cc.student_email,
          courseId: cc.course_id,
          courseName: cc.course_name,
          issueDate: cc.issue_date,
          completionDate: cc.completion_date,
          grade: cc.grade,
          status: cc.status,
          verificationHash: cc.verification_hash,
          emailSent: cc.email_sent,
          emailSentAt: cc.email_sent_at,
          issuedBy: cc.issued_by,
          notes: cc.notes,
        }));
        this.setItem(STORAGE_KEYS.CERTIFICATES, formatted);
      }

      // 3. Fetch Attendance
      const { data: cloudAtt } = await this.supabaseClient.from('attendance').select('*');
      if (cloudAtt && cloudAtt.length > 0) {
        const formatted: AttendanceRecord[] = cloudAtt.map(ca => ({
          id: ca.id,
          studentId: ca.student_id,
          enrollmentNumber: ca.enrollment_number,
          courseId: ca.course_id,
          date: ca.date,
          status: ca.status,
          topicCovered: ca.topic_covered,
          markedBy: ca.marked_by,
          createdAt: ca.created_at,
        }));
        this.setItem(STORAGE_KEYS.ATTENDANCE, formatted);
      }
    } catch (err) {
      console.warn('Background Supabase sync skipped:', err);
    }
  }

  // Sync all local demo data to Supabase in one click
  public async syncAllToSupabase(): Promise<{ success: boolean; message: string }> {
    const client = this.initSupabase();
    if (!client) {
      return { success: false, message: 'Supabase client not initialized.' };
    }

    try {
      // Upsert Courses
      const courses = this.getCourses().map(c => ({
        id: c.id,
        title: c.title,
        code: c.code,
        duration: c.duration,
        description: c.description,
        instructor: c.instructor,
        total_sessions: c.totalSessions,
      }));
      await client.from('courses').upsert(courses);

      // Upsert Students
      const students = this.getStudents().map(s => ({
        id: s.id,
        enrollment_number: s.enrollmentNumber,
        first_name: s.firstName,
        last_name: s.lastName,
        full_name: s.fullName,
        date_of_birth: s.dateOfBirth,
        email: s.email,
        phone: s.phone,
        course_id: s.courseId,
        course_name: s.courseName,
        batch: s.batch,
        status: s.status,
      }));
      await client.from('students').upsert(students);

      // Upsert Certificates
      const certificates = this.getCertificates().map(c => ({
        id: c.id,
        student_id: c.studentId,
        enrollment_number: c.enrollmentNumber,
        student_name: c.studentName,
        last_name: c.lastName,
        date_of_birth: c.dateOfBirth,
        student_email: c.studentEmail,
        course_id: c.courseId,
        course_name: c.courseName,
        issue_date: c.issueDate,
        completion_date: c.completionDate,
        grade: c.grade,
        status: c.status,
        verification_hash: c.verificationHash,
        email_sent: c.emailSent,
        email_sent_at: c.emailSentAt,
        issued_by: c.issuedBy,
        notes: c.notes,
      }));
      await client.from('certificates').upsert(certificates);

      // Upsert Attendance
      const attendance = this.getAttendance().map(a => ({
        id: a.id,
        student_id: a.studentId,
        enrollment_number: a.enrollmentNumber,
        course_id: a.courseId,
        date: a.date,
        status: a.status,
        topic_covered: a.topicCovered,
        marked_by: a.markedBy,
      }));
      await client.from('attendance').upsert(attendance);

      return { success: true, message: 'All student, certificate, and attendance records successfully uploaded to Supabase!' };
    } catch (e: any) {
      return { success: false, message: `Sync error: ${e.message}` };
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage [${key}]:`, e);
    }
  }

  // --- Settings ---
  getSettings(): SystemSettings {
    const settings = this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if ((settings as any).adminPassword) {
      delete (settings as any).adminPassword;
      this.setItem(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  }

  saveSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    this.initSupabase();
    return updated;
  }

  // --- Courses ---
  getCourses(): Course[] {
    return this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
  }

  addCourse(course: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
    };
    courses.push(newCourse);
    this.setItem(STORAGE_KEYS.COURSES, courses);

    if (this.supabaseClient) {
      this.supabaseClient.from('courses').insert({
        id: newCourse.id,
        title: newCourse.title,
        code: newCourse.code,
        duration: newCourse.duration,
        description: newCourse.description,
        instructor: newCourse.instructor,
        total_sessions: newCourse.totalSessions,
      }).then();
    }

    return newCourse;
  }

  // --- Students ---
  getStudents(): Student[] {
    return this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  }

  getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  getStudentByEnrollment(enrollmentNumber: string): Student | undefined {
    const cleanNum = enrollmentNumber.trim().toUpperCase();
    return this.getStudents().find(s => s.enrollmentNumber.trim().toUpperCase() === cleanNum);
  }

  addStudent(studentData: Omit<Student, 'id' | 'fullName' | 'createdAt'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      fullName: `${studentData.firstName.trim()} ${studentData.lastName.trim()}`,
      createdAt: new Date().toISOString(),
    };
    students.push(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    // Sync to Supabase in real-time
    if (this.supabaseClient) {
      this.supabaseClient.from('students').insert({
        id: newStudent.id,
        enrollment_number: newStudent.enrollmentNumber,
        first_name: newStudent.firstName,
        last_name: newStudent.lastName,
        full_name: newStudent.fullName,
        date_of_birth: newStudent.dateOfBirth,
        email: newStudent.email,
        phone: newStudent.phone,
        course_id: newStudent.courseId,
        course_name: newStudent.courseName,
        batch: newStudent.batch,
        status: newStudent.status,
      }).then();
    }

    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const current = students[index];
    const updated: Student = {
      ...current,
      ...updates,
      fullName: updates.firstName || updates.lastName 
        ? `${(updates.firstName || current.firstName).trim()} ${(updates.lastName || current.lastName).trim()}` 
        : current.fullName,
    };
    students[index] = updated;
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    if (this.supabaseClient) {
      this.supabaseClient.from('students').update({
        first_name: updated.firstName,
        last_name: updated.lastName,
        full_name: updated.fullName,
        date_of_birth: updated.dateOfBirth,
        email: updated.email,
        phone: updated.phone,
        status: updated.status,
      }).eq('id', id).then();
    }

    return updated;
  }

  deleteStudent(id: string): boolean {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    if (this.supabaseClient) {
      this.supabaseClient.from('students').delete().eq('id', id).then();
    }
    return true;
  }

  // --- Certificates ---
  // ZERO SERVER STORAGE: Only metadata is stored.
  getCertificates(): Certificate[] {
    return this.getItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
  }

  getCertificateById(id: string): Certificate | undefined {
    const clean = id.trim().toUpperCase();
    return this.getCertificates().find(c => c.id.trim().toUpperCase() === clean);
  }

  getCertificatesByEnrollment(enrollmentNumber: string): Certificate[] {
    const clean = enrollmentNumber.trim().toUpperCase();
    return this.getCertificates().filter(c => c.enrollmentNumber.trim().toUpperCase() === clean);
  }

  generateCertificateId(courseCode: string): string {
    const year = new Date().getFullYear();
    const cleanCode = courseCode.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `HF-${year}-${cleanCode}-${randomHex}`;
  }

  issueCertificate(params: {
    studentId: string;
    courseId: string;
    grade?: string;
    completionDate?: string;
    issueDate?: string;
    notes?: string;
    customCertId?: string;
  }): Certificate {
    const student = this.getStudentById(params.studentId);
    if (!student) throw new Error('Student not found');

    const course = this.getCourses().find(c => c.id === params.courseId);
    if (!course) throw new Error('Course not found');

    const certId = params.customCertId || this.generateCertificateId(course.code);
    const today = new Date().toISOString().split('T')[0];

    const payload = `${certId}|${student.enrollmentNumber}|${student.fullName}|${course.title}|${params.issueDate || today}`;
    const mockHash = 'sha256-' + btoa(payload).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24).toLowerCase();

    const newCertificate: Certificate = {
      id: certId,
      studentId: student.id,
      enrollmentNumber: student.enrollmentNumber,
      studentName: student.fullName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      studentEmail: student.email,
      courseId: course.id,
      courseName: course.title,
      issueDate: params.issueDate || today,
      completionDate: params.completionDate || today,
      grade: params.grade || 'Completed with Distinction',
      status: 'issued',
      verificationHash: mockHash,
      emailSent: false,
      issuedBy: 'HAIFOS Academic Registry',
      notes: params.notes || 'Successfully fulfilled all academic and practical training milestones.',
    };

    const certificates = this.getCertificates();
    const existingIndex = certificates.findIndex(c => c.id === certId);
    if (existingIndex >= 0) {
      certificates[existingIndex] = newCertificate;
    } else {
      certificates.push(newCertificate);
    }

    this.setItem(STORAGE_KEYS.CERTIFICATES, certificates);

    // Sync to Supabase in real-time
    if (this.supabaseClient) {
      this.supabaseClient.from('certificates').upsert({
        id: newCertificate.id,
        student_id: newCertificate.studentId,
        enrollment_number: newCertificate.enrollmentNumber,
        student_name: newCertificate.studentName,
        last_name: newCertificate.lastName,
        date_of_birth: newCertificate.dateOfBirth,
        student_email: newCertificate.studentEmail,
        course_id: newCertificate.courseId,
        course_name: newCertificate.courseName,
        issue_date: newCertificate.issueDate,
        completion_date: newCertificate.completionDate,
        grade: newCertificate.grade,
        status: newCertificate.status,
        verification_hash: newCertificate.verificationHash,
        email_sent: newCertificate.emailSent,
        issued_by: newCertificate.issuedBy,
        notes: newCertificate.notes,
      }).then();
    }

    return newCertificate;
  }

  updateCertificateEmailStatus(certId: string, emailSent: boolean): void {
    const certificates = this.getCertificates();
    const index = certificates.findIndex(c => c.id === certId);
    if (index >= 0) {
      certificates[index].emailSent = emailSent;
      certificates[index].emailSentAt = new Date().toISOString();
      this.setItem(STORAGE_KEYS.CERTIFICATES, certificates);

      if (this.supabaseClient) {
        this.supabaseClient.from('certificates').update({
          email_sent: emailSent,
          email_sent_at: certificates[index].emailSentAt,
        }).eq('id', certId).then();
      }
    }
  }

  // Verification matching logic:
  verifyCertificate(courseId: string, certificateId: string, dobOrLastName: string): {
    valid: boolean;
    certificate?: Certificate;
    message: string;
  } {
    const cleanCertId = certificateId.trim().toUpperCase();
    const cert = this.getCertificates().find(c => c.id.trim().toUpperCase() === cleanCertId);

    if (!cert) {
      return {
        valid: false,
        message: `No certificate found with ID "${certificateId}". Please verify the ID on your credential document.`,
      };
    }

    if (courseId && courseId !== 'all' && cert.courseId !== courseId) {
      return {
        valid: false,
        message: `Certificate ID exists, but does not match the selected Course Type. Please select the correct course.`,
      };
    }

    if (cert.status !== 'issued') {
      return {
        valid: false,
        message: `This certificate has been marked as ${cert.status.toUpperCase()} by the institution.`,
      };
    }

    const query = dobOrLastName.trim().toLowerCase();
    const studentLastName = (cert.lastName || '').trim().toLowerCase();
    const certDob = (cert.dateOfBirth || '').trim().toLowerCase();

    // Support both ISO YYYY-MM-DD and DD-MM-YYYY formats:
    let normalizedQueryDob = query;
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(query)) {
      const [d, m, y] = query.split(/[-/]/);
      normalizedQueryDob = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    const matchDob =
      certDob === query ||
      certDob === normalizedQueryDob ||
      certDob.replace(/-/g, '') === query.replace(/[^0-9]/g, '');
    const matchLastName = studentLastName === query;

    if (!matchDob && !matchLastName) {
      return {
        valid: false,
        message: `Certificate ID verified, but verification failed for the provided Date of Birth. Please check the date and try again.`,
      };
    }

    return {
      valid: true,
      certificate: cert,
      message: `Official Certificate successfully verified by HAIFOS Academic Registry.`,
    };
  }

  // --- Attendance ---
  getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
  }

  postDailyAttendance(params: {
    courseId: string;
    date: string;
    records: { studentId: string; enrollmentNumber: string; status: 'present' | 'absent' | 'late' | 'excused' }[];
    topicCovered?: string;
    markedBy?: string;
  }): AttendanceRecord[] {
    const allAttendance = this.getAttendance();
    const savedRecords: AttendanceRecord[] = [];

    params.records.forEach(r => {
      const recordId = `att-${r.studentId}-${params.date}`;
      const existingIdx = allAttendance.findIndex(a => a.studentId === r.studentId && a.date === params.date);

      const newRecord: AttendanceRecord = {
        id: recordId,
        studentId: r.studentId,
        enrollmentNumber: r.enrollmentNumber,
        courseId: params.courseId,
        date: params.date,
        status: r.status,
        topicCovered: params.topicCovered || 'Daily Course Lecture & Lab Session',
        markedBy: params.markedBy || 'Admin Instructor',
        createdAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        allAttendance[existingIdx] = newRecord;
      } else {
        allAttendance.push(newRecord);
      }
      savedRecords.push(newRecord);
    });

    this.setItem(STORAGE_KEYS.ATTENDANCE, allAttendance);

    // Sync to Supabase in real-time
    if (this.supabaseClient) {
      const rows = savedRecords.map(s => ({
        id: s.id,
        student_id: s.studentId,
        enrollment_number: s.enrollmentNumber,
        course_id: s.courseId,
        date: s.date,
        status: s.status,
        topic_covered: s.topicCovered,
        marked_by: s.markedBy,
      }));
      this.supabaseClient.from('attendance').upsert(rows).then();
    }

    return savedRecords;
  }

  getStudentAttendance(query: string): {
    student?: Student;
    records: AttendanceRecord[];
    stats: {
      total: number;
      present: number;
      absent: number;
      late: number;
      excused: number;
      percentage: number;
      statusBadge: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
    };
  } {
    const clean = query.trim().toUpperCase();
    const students = this.getStudents();
    const certs = this.getCertificates();

    let student = students.find(s => s.enrollmentNumber.trim().toUpperCase() === clean);

    if (!student) {
      student = students.find(s => s.email.trim().toLowerCase() === query.trim().toLowerCase());
    }

    if (!student) {
      const matchingCert = certs.find(c => c.id.trim().toUpperCase() === clean);
      if (matchingCert) {
        student = students.find(s => s.id === matchingCert.studentId || s.enrollmentNumber === matchingCert.enrollmentNumber);
      }
    }

    if (!student) {
      return {
        records: [],
        stats: { total: 0, present: 0, absent: 0, late: 0, excused: 0, percentage: 0, statusBadge: 'CRITICAL' },
      };
    }

    const allAttendance = this.getAttendance();
    const studentRecords = allAttendance
      .filter(a => a.studentId === student!.id || a.enrollmentNumber.trim().toUpperCase() === student!.enrollmentNumber.trim().toUpperCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const excused = studentRecords.filter(r => r.status === 'excused').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;

    const effectiveAttended = present + (late * 0.75) + excused;
    const percentage = total > 0 ? Math.round((effectiveAttended / total) * 100) : 100;

    let statusBadge: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' = 'EXCELLENT';
    if (percentage >= 85) statusBadge = 'EXCELLENT';
    else if (percentage >= 75) statusBadge = 'GOOD';
    else if (percentage >= 60) statusBadge = 'WARNING';
    else statusBadge = 'CRITICAL';

    return {
      student,
      records: studentRecords,
      stats: {
        total,
        present,
        absent,
        late,
        excused,
        percentage,
        statusBadge,
      },
    };
  }

  // --- Export & Import ---
  exportAllDataJson(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      courses: this.getCourses(),
      students: this.getStudents(),
      certificates: this.getCertificates(),
      attendance: this.getAttendance(),
    };
    return JSON.stringify(data, null, 2);
  }

  importDataJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) this.setItem(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (parsed.courses) this.setItem(STORAGE_KEYS.COURSES, parsed.courses);
      if (parsed.students) this.setItem(STORAGE_KEYS.STUDENTS, parsed.students);
      if (parsed.certificates) this.setItem(STORAGE_KEYS.CERTIFICATES, parsed.certificates);
      if (parsed.attendance) this.setItem(STORAGE_KEYS.ATTENDANCE, parsed.attendance);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }

  resetToDefaultData(): void {
    this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.setItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    this.setItem(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    this.setItem(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
    this.setItem(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
  }
}

export const storage = new StorageService();
