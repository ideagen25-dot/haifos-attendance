import React, { useState } from 'react';
import { CalendarCheck, Search, User, CheckCircle2, AlertTriangle, XCircle, Clock, BookOpen, RotateCcw, Award } from 'lucide-react';
import { Student, AttendanceRecord, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface AttendancePageProps {
  settings: SystemSettings;
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ settings, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
    statusBadge: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  } | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const executeSearch = (query: string) => {
    if (!query.trim()) {
      setErrorMessage('Please enter your Enrollment Number, Certificate ID, or Email.');
      return;
    }

    setErrorMessage('');
    const result = storage.getStudentAttendance(query);

    if (result.student) {
      setStudent(result.student);
      setAttendanceRecords(result.records);
      setStats(result.stats);
      setSearched(true);
    } else {
      setStudent(null);
      setAttendanceRecords([]);
      setStats(null);
      setSearched(true);
      setErrorMessage(`No student profile found matching "${query}". Please check your enrollment number or contact the administration.`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSample = (sampleNum: 'HF-2026-001' | 'HF-2026-002' | 'HF-2026-004') => {
    setSearchQuery(sampleNum);
    executeSearch(sampleNum);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStudent(null);
    setAttendanceRecords([]);
    setStats(null);
    setSearched(false);
    setErrorMessage('');
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Present
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Late
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Excused
          </span>
        );
      case 'absent':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Absent
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200">
          <CalendarCheck className="w-3.5 h-3.5 text-brand-600" />
          Transparent Student Attendance Registry
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
          Check Daily Attendance
        </h1>
        <p className="text-sm text-gray-600">
          Enter your Enrollment Number, Certificate ID, or Registered Email to view your cumulative attendance record and certificate eligibility.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Student Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Enrollment No (e.g. HF-2026-001) or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all uppercase placeholder:normal-case"
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-600">Quick Test:</span>
              <button
                type="button"
                onClick={() => handleSample('HF-2026-001')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
              >
                Rahul (92%)
              </button>
              <button
                type="button"
                onClick={() => handleSample('HF-2026-002')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
              >
                Priya (100%)
              </button>
              <button
                type="button"
                onClick={() => handleSample('HF-2026-004')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
              >
                Sneha (96%)
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {searched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Clear search"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-brand-600/20 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Attendance</span>
              </button>
            </div>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Not Found</p>
              <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Results */}
      {student && stats && (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 font-black text-2xl flex items-center justify-center border border-brand-200 flex-shrink-0">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <h3 className="text-2xl font-black text-gray-950">{student.fullName}</h3>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono font-bold rounded-md">
                    {student.enrollmentNumber}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {student.courseName} &bull; <span className="font-semibold text-gray-700">{student.batch}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{student.email} &bull; DOB: {student.dateOfBirth}</p>
              </div>
            </div>

            {/* Attendance Percentage Badge */}
            <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
                    stats.percentage >= 75
                      ? 'border-brand-600 text-brand-700 bg-brand-50'
                      : stats.percentage >= 60
                      ? 'border-amber-500 text-amber-700 bg-amber-50'
                      : 'border-red-500 text-red-700 bg-red-50'
                  }`}
                >
                  <span className="text-xl font-black">{stats.percentage}%</span>
                  <span className="text-[9px] uppercase font-bold tracking-tighter">Attendance</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Certification Eligibility
                </div>
                <div className="mt-1">
                  {stats.percentage >= 75 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Certificate
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" /> Min. 75% Required
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-1 font-medium">
                  {stats.present} attended of {stats.total} total sessions
                </div>
              </div>

            </div>

          </div>

          {/* Stats Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="text-2xl font-black text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Total Classes</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="text-2xl font-black text-green-600">{stats.present}</div>
              <div className="text-xs text-green-800 font-semibold uppercase tracking-wider mt-1">Present</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="text-2xl font-black text-amber-600">{stats.late}</div>
              <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider mt-1">Late Marked</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="text-2xl font-black text-red-600">{stats.absent}</div>
              <div className="text-xs text-red-800 font-semibold uppercase tracking-wider mt-1">Absent</div>
            </div>
          </div>

          {/* Daily Logs Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-gray-900">Daily Attendance Log</h4>
                <p className="text-xs text-gray-500 mt-0.5">Chronological record of dates and attendance status</p>
              </div>
              <span className="text-xs font-mono text-gray-400">{attendanceRecords.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3.5">Session Date</th>
                    <th className="px-6 py-3.5">Topic / Curriculum Covered</th>
                    <th className="px-6 py-3.5">Instructor Sign</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-xs text-gray-400">
                        No attendance sessions logged for this student yet.
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900 whitespace-nowrap">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-800">
                          {record.topicCovered || 'Regular Scheduled Lecture & Lab'}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                          {record.markedBy}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {getStatusBadge(record.status)}
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

    </div>
  );
};
