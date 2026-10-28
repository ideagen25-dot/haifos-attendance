import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  Settings,
  Plus,
  Send,
  Eye,
  CheckCircle2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Mail,
  Shield,
  Key,
  ExternalLink,
  Copy,
  Check,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { Student, Course, Certificate, AttendanceRecord, SystemSettings } from '../types';
import { storage } from '../services/storage';
import { sendAutomatedCertificateEmail, getVerificationUrl } from '../services/emailService';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { CertificateTemplate } from '../components/CertificateTemplate';

interface AdminPageProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ settings, onUpdateSettings, setActiveTab }) => {
  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('haifos_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'students' | 'certificates' | 'attendance' | 'settings'>('students');

  // Core Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Search & Filter
  const [searchStudentText, setSearchStudentText] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  // Modal States
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isIssueCertOpen, setIsIssueCertOpen] = useState<boolean>(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [emailPreviewCert, setEmailPreviewCert] = useState<Certificate | null>(null);

  // Status Alerts
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Add Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    courseId: '',
    batch: 'Batch 2026-Alpha',
    enrollmentNumber: '',
    status: 'active' as Student['status'],
  });

  // Issue Certificate Form State
  const [issueCertForm, setIssueCertForm] = useState({
    studentId: '',
    courseId: '',
    grade: 'Distinction (Grade A+)',
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    notes: 'Successfully fulfilled all academic and project requirements.',
  });

  // Daily Attendance Post State
  const [attendanceCourseId, setAttendanceCourseId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceTopic, setAttendanceTopic] = useState<string>('Daily Lecture & Lab Practical');
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(settings);

  // Load data on mount or refresh
  const refreshAllData = () => {
    setStudents(storage.getStudents());
    const loadedCourses = storage.getCourses();
    setCourses(loadedCourses);
    setCertificates(storage.getCertificates());
    setAttendanceRecords(storage.getAttendance());

    if (!attendanceCourseId && loadedCourses.length > 0) {
      setAttendanceCourseId(loadedCourses[0].id);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update attendance map when course or students change
  useEffect(() => {
    if (!attendanceCourseId) return;
    const enrolled = students.filter(s => s.courseId === attendanceCourseId);
    const initialMap: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    enrolled.forEach(s => {
      initialMap[s.id] = 'present';
    });
    setStudentAttendanceMap(initialMap);
  }, [attendanceCourseId, students]);

  // Auth handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.adminPassword || passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('haifos_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Password. (Default is: admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('haifos_admin_auth');
  };

  // Helper for flash messages
  const notifySuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  // --- Handlers: Students ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === newStudentForm.courseId);
    if (!course) {
      alert('Please select a valid course');
      return;
    }

    const autoEnrollment = newStudentForm.enrollmentNumber || `HF-2026-${String(students.length + 1).padStart(3, '0')}`;

    const created = storage.addStudent({
      firstName: newStudentForm.firstName,
      lastName: newStudentForm.lastName,
      dateOfBirth: newStudentForm.dateOfBirth,
      email: newStudentForm.email,
      phone: newStudentForm.phone || '+91 0000000000',
      courseId: course.id,
      courseName: course.title,
      batch: newStudentForm.batch,
      enrollmentNumber: autoEnrollment,
      status: newStudentForm.status,
    });

    refreshAllData();
    setIsAddStudentOpen(false);
    notifySuccess(`Student ${created.fullName} (${created.enrollmentNumber}) successfully registered!`);

    // Reset form
    setNewStudentForm({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      courseId: courses[0]?.id || '',
      batch: 'Batch 2026-Alpha',
      enrollmentNumber: '',
      status: 'active',
    });
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}"?`)) {
      storage.deleteStudent(id);
      refreshAllData();
      notifySuccess(`Student record removed.`);
    }
  };

  // --- Handlers: Certificate Issuance & Automated Email ---
  const handleOpenIssueModal = (student?: Student) => {
    if (student) {
      setIssueCertForm({
        studentId: student.id,
        courseId: student.courseId,
        grade: 'Distinction (Grade A+)',
        completionDate: new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        notes: 'Successfully fulfilled all academic and practical training milestones.',
      });
    } else if (students.length > 0) {
      setIssueCertForm({
        studentId: students[0].id,
        courseId: students[0].courseId,
        grade: 'Distinction (Grade A+)',
        completionDate: new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        notes: 'Successfully fulfilled all academic and practical training milestones.',
      });
    }
    setIsIssueCertOpen(true);
  };

  const handleIssueAndSendCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);

    try {
      // 1. Generate & Issue certificate in registry
      const newCert = storage.issueCertificate({
        studentId: issueCertForm.studentId,
        courseId: issueCertForm.courseId,
        grade: issueCertForm.grade,
        completionDate: issueCertForm.completionDate,
        issueDate: issueCertForm.issueDate,
        notes: issueCertForm.notes,
      });

      // 2. Automated dispatch email to the student
      const sendResult = await sendAutomatedCertificateEmail(newCert, settings);

      refreshAllData();
      setIsIssueCertOpen(false);
      setIsSendingEmail(false);

      notifySuccess(
        `Certificate ${newCert.id} generated! ${sendResult.message}`
      );

      // Offer email preview
      setEmailPreviewCert(newCert);
    } catch (err: unknown) {
      setIsSendingEmail(false);
      alert('Error issuing certificate: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSendEmailForExisting = async (cert: Certificate) => {
    setIsSendingEmail(true);
    const result = await sendAutomatedCertificateEmail(cert, settings);
    setIsSendingEmail(false);
    refreshAllData();
    notifySuccess(result.message);
  };

  // --- Handlers: Daily Attendance Posting ---
  const handleSaveAttendance = () => {
    const enrolled = students.filter(s => s.courseId === attendanceCourseId);
    if (enrolled.length === 0) {
      alert('No enrolled students in this course to mark attendance.');
      return;
    }

    const recordsToSave = enrolled.map(s => ({
      studentId: s.id,
      enrollmentNumber: s.enrollmentNumber,
      status: studentAttendanceMap[s.id] || 'present',
    }));

    storage.postDailyAttendance({
      courseId: attendanceCourseId,
      date: attendanceDate,
      records: recordsToSave,
      topicCovered: attendanceTopic,
      markedBy: 'Admin / Faculty',
    });

    refreshAllData();
    notifySuccess(`Daily Attendance successfully logged for ${enrolled.length} students on ${attendanceDate}!`);
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const enrolled = students.filter(s => s.courseId === attendanceCourseId);
    const updated: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    enrolled.forEach(s => {
      updated[s.id] = status;
    });
    setStudentAttendanceMap(updated);
  };

  // --- Handlers: Settings & Data Management ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    notifySuccess('System settings & configuration updated successfully!');
  };

  const handleExportData = () => {
    const json = storage.exportAllDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HAIFOS_Portal_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notifySuccess('All student, certificate, and attendance data exported to JSON!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.importDataJson(content)) {
        refreshAllData();
        notifySuccess('Data successfully restored from JSON backup!');
      } else {
        alert('Failed to parse backup JSON file. Please ensure it is a valid HAIFOS backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to factory defaults? (This will restore initial sample records)')) {
      storage.resetToDefaultData();
      refreshAllData();
      notifySuccess('Reset to initial sample data completed.');
    }
  };

  // --- Filtered Students ---
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchStudentText.toLowerCase()) ||
      s.enrollmentNumber.toLowerCase().includes(searchStudentText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudentText.toLowerCase());

    const matchesCourse = filterCourse === 'all' || s.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8 text-brand-600" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-950">HAIFOS Admin Portal</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter Administrator PIN or Password to access certificate generation and attendance management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Admin Password / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin password (default: admin)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  autoFocus
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <Key className="w-4 h-4" />
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-brand-600/20 transition-all"
            >
              Unlock Admin Portal &rarr;
            </button>
          </form>

          <p className="text-[11px] text-gray-400">
            Default credentials for testing: <strong className="text-gray-700">admin</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-800 text-[10px] font-black rounded-full uppercase tracking-wider">
              Faculty / Admin Access
            </span>
            <span className="text-xs text-gray-500 font-mono">100% Free Tier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            Admin Command Center
          </h1>
          <p className="text-xs text-gray-500">
            Add student profiles, approve certificates with automated email delivery, and post daily attendance logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAllData}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors border border-red-200"
          >
            Lock / Logout
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 text-sm shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Students Enrolled</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mt-2">{students.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Across {courses.length} courses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certificates Issued</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 mt-2">{certificates.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Zero server file storage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attendance Logs</span>
            <CalendarCheck className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mt-2">{attendanceRecords.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Logged sessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hosting Cost</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-black rounded-md">FREE</span>
          </div>
          <div className="text-3xl font-black text-brand-700 mt-2">$0.00</div>
          <div className="text-[11px] text-gray-400 mt-1">Netlify + GitHub ready</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setAdminTab('students')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'students'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Student Profiles ({students.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('certificates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'certificates'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>2. Certificate Issuance &amp; Email ({certificates.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('attendance')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'attendance'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>3. Post Daily Attendance</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'settings'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>4. Settings &amp; Deployment</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: STUDENTS MANAGEMENT */}
      {/* ======================================================== */}
      {adminTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search & Course Filter */}
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search students by name, enrollment no, or email..."
                  value={searchStudentText}
                  onChange={(e) => setSearchStudentText(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>

              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code}</option>
                ))}
              </select>
            </div>

            {/* Add Student Button */}
            <button
              onClick={() => {
                setNewStudentForm(prev => ({ ...prev, courseId: courses[0]?.id || '' }));
                setIsAddStudentOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student Profile</span>
            </button>

          </div>

          {/* Students Roster Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Enrollment ID</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Course Program</th>
                    <th className="px-6 py-4">Date of Birth</th>
                    <th className="px-6 py-4">Contact Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        No students match your query. Click "Add Student Profile" to register a new student.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const hasCert = certificates.some(c => c.studentId === s.id || c.enrollmentNumber === s.enrollmentNumber);
                      return (
                        <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                            {s.enrollmentNumber}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                            {s.fullName}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium">
                            <span className="block">{s.courseName}</span>
                            <span className="text-[10px] text-gray-400">{s.batch}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-600 whitespace-nowrap">
                            {s.dateOfBirth}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {s.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                              s.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => handleOpenIssueModal(s)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg border border-brand-200 transition-colors"
                              title="Generate Certificate & Send Email"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{hasCert ? 'Re-Issue / Send' : 'Generate Cert'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.fullName)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: CERTIFICATES ISSUANCE & AUTOMATED EMAIL */}
      {/* ======================================================== */}
      {adminTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Certificate Registry &amp; Automated Delivery</h3>
              <p className="text-xs text-gray-500">
                Certificates are rendered dynamically on demand from record metadata (0 server storage).
              </p>
            </div>

            <button
              onClick={() => handleOpenIssueModal()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Generate &amp; Approve New Certificate</span>
            </button>
          </div>

          {/* Certificates Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Certificate ID</th>
                    <th className="px-6 py-4">Student &amp; Enrollment</th>
                    <th className="px-6 py-4">Course Program</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Automated Email</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        No certificates issued yet. Click "Generate &amp; Approve New Certificate".
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-brand-700 whitespace-nowrap">
                          {cert.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{cert.studentName}</div>
                          <div className="text-[10px] text-gray-400 font-mono">No: {cert.enrollmentNumber} &bull; {cert.studentEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {cert.courseName}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600 whitespace-nowrap">
                          {cert.issueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold">
                            {cert.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cert.emailSent ? (
                            <span className="inline-flex items-center gap-1 text-green-700 font-bold text-[11px]">
                              <CheckCheck className="w-3.5 h-3.5 text-green-600" /> Dispatched
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => setPreviewCert(cert)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors"
                            title="View Dynamic Live Certificate"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => setEmailPreviewCert(cert)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition-colors"
                            title="Preview / Send Automated Email Template"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: POST DAILY ATTENDANCE */}
      {/* ======================================================== */}
      {adminTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            
            <div>
              <h3 className="text-base font-black text-gray-900">Post Daily Attendance Session</h3>
              <p className="text-xs text-gray-500">
                Select course and date to load student roster, toggle statuses, and save attendance in one click.
              </p>
            </div>

            {/* Attendance Session Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              {/* Select Course */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Course / Batch
                </label>
                <select
                  value={attendanceCourseId}
                  onChange={(e) => setAttendanceCourseId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Session Date
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              {/* Topic / Note */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Topic / Lesson Covered
                </label>
                <input
                  type="text"
                  placeholder="e.g. Module 3: Hands-on Practical Lab"
                  value={attendanceTopic}
                  onChange={(e) => setAttendanceTopic(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition-colors"
                >
                  Mark All Absent
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAttendance}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Daily Attendance</span>
              </button>
            </div>

            {/* Student Attendance Marking Roster */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Enrollment No</th>
                    <th className="px-6 py-3.5 text-right">Status Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.filter(s => s.courseId === attendanceCourseId).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                        No students enrolled in this course yet. Add students in Tab 1 first.
                      </td>
                    </tr>
                  ) : (
                    students
                      .filter(s => s.courseId === attendanceCourseId)
                      .map((s) => {
                        const currentStatus = studentAttendanceMap[s.id] || 'present';
                        return (
                          <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-6 py-3.5 font-bold text-gray-900">
                              {s.fullName}
                            </td>
                            <td className="px-6 py-3.5 font-mono text-gray-500">
                              {s.enrollmentNumber}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                {(['present', 'late', 'absent', 'excused'] as const).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStudentAttendanceMap(prev => ({ ...prev, [s.id]: status }))}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                                      currentStatus === status
                                        ? status === 'present'
                                          ? 'bg-green-600 text-white shadow-sm'
                                          : status === 'late'
                                          ? 'bg-amber-500 text-white shadow-sm'
                                          : status === 'absent'
                                          ? 'bg-red-600 text-white shadow-sm'
                                          : 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: SETTINGS & DEPLOYMENT */}
      {/* ======================================================== */}
      {adminTab === 'settings' && (
        <div className="space-y-8">
          
          {/* Zero-Cost Deployment Guide Card */}
          <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-500/30 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider border border-brand-400/30">
                100% Free Hosting &bull; Netlify + GitHub
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Zero-Cost Independent Deployment Guide
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              This system is fully architected for continuous zero-cost hosting.
              The standard certificate is dynamically generated in the student's browser on-the-fly, meaning 
              <strong> 0 MB of file storage</strong> is ever needed on the server!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="font-bold text-emerald-300 mb-1">Step 1: Push to GitHub</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Initialize git and push this folder to your free GitHub account repository.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="font-bold text-emerald-300 mb-1">Step 2: Connect to Netlify</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Sign in to Netlify (Free tier). Click "Add new site" &rarr; "Import an existing project from GitHub".
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="font-bold text-emerald-300 mb-1">Step 3: Instant Deploy ($0)</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Netlify reads <code>netlify.toml</code>, runs <code>npm run build</code>, and deploys your custom domain for $0.00!
                </p>
              </div>
            </div>
          </div>

          {/* System Settings Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-4">Organization &amp; Registry Customization</h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.orgName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Official Website
                  </label>
                  <input
                    type="text"
                    value={settingsForm.orgWebsite}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgWebsite: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.orgEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.orgPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgPhone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Signatory Director Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.directorName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, directorName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Admin Password / PIN
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Free EmailJS Integration Settings */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Automated Free EmailJS Dispatch (Optional)
                  </h4>
                  <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    200 Free Emails / Month
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">
                  To send automated emails directly from the browser without needing a backend server, sign up for a free EmailJS account and enter your keys below. (The app will also generate 1-click mail client links automatically).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      EmailJS Service ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. service_xxxx"
                      value={settingsForm.emailJsServiceId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailJsServiceId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      EmailJS Template ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. template_xxxx"
                      value={settingsForm.emailJsTemplateId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailJsTemplateId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      EmailJS Public Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. user_xxxx"
                      value={settingsForm.emailJsPublicKey || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailJsPublicKey: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Free Supabase Cloud Database Settings */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Supabase Cloud PostgreSQL Database (Multi-Device Live Sync)
                    </h4>
                    {storage.isCloudConnected() ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> LIVE CLOUD CONNECTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                        LOCAL / OFFLINE MODE
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    100% Free Forever
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">
                  Connect your free Supabase database so when Admin posts attendance or issues certificates from one device, any student on any smartphone or computer in the world sees the updates live!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={settingsForm.supabaseUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseUrl: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Supabase Anon (Public) Key
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={settingsForm.supabaseAnonKey || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await storage.testSupabaseConnection();
                      if (res.success) {
                        notifySuccess(res.message);
                      } else {
                        alert(res.message);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 transition-colors"
                  >
                    Test Cloud Connection
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Upload all current local students, certificates, and attendance logs to your Supabase cloud database?')) {
                        const res = await storage.syncAllToSupabase();
                        if (res.success) {
                          notifySuccess(res.message);
                        } else {
                          alert(res.message);
                        }
                      }
                    }}
                    className="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 transition-colors"
                  >
                    Sync All Local Data to Supabase (1-Click)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>

          {/* Backup & Restore Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-gray-900">Database Backup &amp; Migration</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Export all records as a single portable JSON file or restore from a previous backup.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                title="Restore default sample data"
              >
                Reset Defaults
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD STUDENT PROFILE */}
      {/* ======================================================== */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-100 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Add Student User Profile</h3>
                  <p className="text-xs text-gray-500">Register new student into the credential registry</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul"
                    value={newStudentForm.firstName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, firstName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={newStudentForm.lastName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, lastName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newStudentForm.dateOfBirth}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, dateOfBirth: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Enrollment No (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`HF-2026-${String(students.length + 1).padStart(3, '0')}`}
                    value={newStudentForm.enrollmentNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, enrollmentNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Student Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com (used for automated certificate email)"
                  value={newStudentForm.email}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Enrolled Course Program <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newStudentForm.courseId}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, courseId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-brand-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.batch}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, batch: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 ..."
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Register Student Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: GENERATE & APPROVE CERTIFICATE */}
      {/* ======================================================== */}
      {isIssueCertOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-100 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Approve &amp; Generate Certificate</h3>
                  <p className="text-xs text-gray-500">Standard generation &bull; Automated student email dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setIsIssueCertOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleIssueAndSendCertificate} className="space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Select Student
                </label>
                <select
                  value={issueCertForm.studentId}
                  onChange={(e) => {
                    const st = students.find(s => s.id === e.target.value);
                    setIssueCertForm(prev => ({
                      ...prev,
                      studentId: e.target.value,
                      courseId: st ? st.courseId : prev.courseId,
                    }));
                  }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-semibold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.enrollmentNumber}) &bull; {s.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Course */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Course Program
                </label>
                <select
                  value={issueCertForm.courseId}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, courseId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Achievement / Grade
                </label>
                <select
                  value={issueCertForm.grade}
                  onChange={(e) => setIssueCertForm({ ...issueCertForm, grade: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900"
                >
                  <option value="Distinction (Grade A+)">Distinction (Grade A+)</option>
                  <option value="Excellence (Grade A)">Excellence (Grade A)</option>
                  <option value="Completed with Honors">Completed with Honors</option>
                  <option value="Successfully Completed">Successfully Completed</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={issueCertForm.completionDate}
                    onChange={(e) => setIssueCertForm({ ...issueCertForm, completionDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueCertForm.issueDate}
                    onChange={(e) => setIssueCertForm({ ...issueCertForm, issueDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Completely Automated:</strong> Upon clicking approve, a unique Certificate ID is created and the standardized HTML certificate email will be immediately sent to the student!
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsIssueCertOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingEmail ? 'Generating & Sending...' : 'Approve & Send Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIVE DYNAMIC CERTIFICATE PREVIEW */}
      {/* ======================================================== */}
      {previewCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-6 border border-gray-200 space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Dynamic Certificate Preview &bull; {previewCert.id}</h3>
                <p className="text-[11px] text-gray-500">Rendered on-the-fly &bull; Zero server storage</p>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="text-gray-500 hover:text-gray-900 font-bold px-3 py-1 bg-gray-100 rounded-lg text-xs"
              >
                Close Preview
              </button>
            </div>

            <CertificateTemplate certificate={previewCert} settings={settings} />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EMAIL TEMPLATE PREVIEW */}
      {/* ======================================================== */}
      {emailPreviewCert && (
        <EmailPreviewModal
          certificate={emailPreviewCert}
          settings={settings}
          isOpen={!!emailPreviewCert}
          onClose={() => setEmailPreviewCert(null)}
          onSendAutomated={() => handleSendEmailForExisting(emailPreviewCert)}
          isSending={isSendingEmail}
        />
      )}

    </div>
  );
};
