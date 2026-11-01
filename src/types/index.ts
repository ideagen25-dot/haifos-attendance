export interface Student {
  id: string;
  enrollmentNumber: string; // e.g. "HF-2026-001"
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  collegeName?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  batch: string; // e.g. "Batch 2026-A"
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  code: string; // e.g. "WEB-DEV", "AI-FOUND", "DIGITAL-LIT"
  duration: string;
  description: string;
  instructor: string;
  totalSessions: number;
}

export interface Certificate {
  id: string; // Certificate ID, e.g. "HF-2026-WEB-8842"
  studentId: string;
  enrollmentNumber: string;
  studentName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  studentEmail: string;
  courseId: string;
  courseName: string;
  collegeName?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  issueDate: string; // YYYY-MM-DD
  completionDate: string; // YYYY-MM-DD
  grade: string; // "Distinction", "Grade A+", "Excellent", "Completed"
  status: 'issued' | 'revoked';
  verificationHash: string;
  emailSent: boolean;
  emailSentAt?: string;
  issuedBy: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  enrollmentNumber: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'excused';
  topicCovered?: string;
  markedBy: string;
  createdAt: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminProfile {
  id: string; // references auth.users UUID
  username: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  profile: AdminProfile;
  token?: string;
}

export interface SystemSettings {
  orgName: string;
  orgTagline: string;
  orgEmail: string;
  orgPhone: string;
  orgWebsite: string;
  orgAddress: string;
  directorName: string;
  directorTitle: string;
  coordinatorName: string;
  coordinatorTitle: string;
  // Free EmailJS credentials
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
  // Supabase credentials for cloud database & auth
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
