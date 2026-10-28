import { Student, Course, Certificate, AttendanceRecord, SystemSettings } from '../types';

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
  adminPassword: 'admin', // default PIN / password
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

// Helper to generate seed attendance records
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
      // Create realistic attendance pattern (mostly present, occasional absent or late)
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
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
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
    return updated;
  }

  deleteStudent(id: string): boolean {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return true;
  }

  // --- Certificates ---
  // ZERO SERVER STORAGE: Only metadata is stored.
  // The actual certificate graphic/PDF is rendered dynamically on the fly!
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

    // Cryptographic-like verification signature hash
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
    // If certificate for this student and course already exists, replace or append
    const existingIndex = certificates.findIndex(c => c.id === certId);
    if (existingIndex >= 0) {
      certificates[existingIndex] = newCertificate;
    } else {
      certificates.push(newCertificate);
    }

    this.setItem(STORAGE_KEYS.CERTIFICATES, certificates);
    return newCertificate;
  }

  updateCertificateEmailStatus(certId: string, emailSent: boolean): void {
    const certificates = this.getCertificates();
    const index = certificates.findIndex(c => c.id === certId);
    if (index >= 0) {
      certificates[index].emailSent = emailSent;
      certificates[index].emailSentAt = new Date().toISOString();
      this.setItem(STORAGE_KEYS.CERTIFICATES, certificates);
    }
  }

  // Verification matching logic:
  // Requires: Course Type + Certificate ID + (Date of Birth OR Last Name)
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

    // Check course match if courseId is provided (or "all" / matching course)
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

    // Verify Date of Birth OR Last Name
    const query = dobOrLastName.trim().toLowerCase();
    const studentLastName = (cert.lastName || '').trim().toLowerCase();
    const certDob = (cert.dateOfBirth || '').trim().toLowerCase();

    // Support YYYY-MM-DD or DD/MM/YYYY or simple string compare
    const matchDob = certDob === query || certDob.replace(/-/g, '') === query.replace(/[^0-9]/g, '');
    const matchLastName = studentLastName === query;

    if (!matchDob && !matchLastName) {
      return {
        valid: false,
        message: `Certificate ID verified, but verification failed for the provided Date of Birth or Last Name. Please verify and re-enter.`,
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
      // Check if attendance already logged for this student and date
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
    return savedRecords;
  }

  // Student Attendance Query by Enrollment Number, Cert ID, or Email
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

    // Try finding student by enrollment number
    let student = students.find(s => s.enrollmentNumber.trim().toUpperCase() === clean);

    // If not found, try finding by email
    if (!student) {
      student = students.find(s => s.email.trim().toLowerCase() === query.trim().toLowerCase());
    }

    // If not found, try finding by Certificate ID
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

    // Weight late attendance as 0.5 or present
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

  // --- Export & Import (100% Free Backup & Restore) ---
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
