import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Search, ShieldCheck, AlertCircle, CheckCircle2, RotateCcw, Calendar, BookOpen } from 'lucide-react';
import { Course, Certificate, SystemSettings } from '../types';
import { storage } from '../services/storage';
import { CertificateTemplate } from '../components/CertificateTemplate';

interface VerificationPageProps {
  settings: SystemSettings;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ settings }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [certificateId, setCertificateId] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [relatedCerts, setRelatedCerts] = useState<Certificate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const dateInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];

  // Helper to format ISO YYYY-MM-DD into display format DD-MM-YYYY
  const formatDisplayDob = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}-${m}-${y}`;
    }
    return isoDate;
  };

  useEffect(() => {
    const loadedCourses = storage.getCourses();
    setCourses(loadedCourses);

    // Check if URL contains query params from email or QR code
    const handleUrlParams = () => {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const queryString = hash.slice(queryIdx + 1);
        const params = new URLSearchParams(queryString);
        const urlId = params.get('id');
        const urlDob = params.get('dob') || params.get('dateOfBirth') || params.get('lastName');
        const urlCourse = params.get('courseId') || 'all';

        if (urlId) {
          setCertificateId(urlId);
          if (urlCourse) setSelectedCourseId(urlCourse);

          if (urlDob) {
            let parsedDob = urlDob;
            if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(urlDob)) {
              const [d, m, y] = urlDob.split(/[-/]/);
              parsedDob = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            }
            setDateOfBirth(parsedDob);
            executeVerification(urlCourse, urlId, parsedDob);
          }
        }
      }
    };

    handleUrlParams();
    window.addEventListener('hashchange', handleUrlParams);
    return () => window.removeEventListener('hashchange', handleUrlParams);
  }, []);

  const executeVerification = async (courseId: string, certId: string, queryDob: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setVerifiedCert(null);
    setRelatedCerts([]);

    try {
      const result = await storage.verifyCertificate(courseId, certId, queryDob);

      if (result.valid && result.certificate) {
        setVerifiedCert(result.certificate);
        
        // Find other certificates for this student enrollment (if any)
        const allStudentCerts = storage.getCertificatesByEnrollment(result.certificate.enrollmentNumber);
        setRelatedCerts(allStudentCerts.filter(c => c.id !== result.certificate!.id));

        // Celebratory confetti effect
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1a5487', '#12406a', '#D4AF37', '#eaf2ea', '#f99c00'],
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setErrorMessage('Please enter a Certificate ID.');
      return;
    }
    if (!dateOfBirth) {
      setErrorMessage('Please select the Student Date of Birth.');
      return;
    }
    if (dateOfBirth > today) {
      setErrorMessage('Date of Birth cannot be in the future.');
      return;
    }
    executeVerification(selectedCourseId, certificateId, dateOfBirth);
  };

  const handleReset = () => {
    setCertificateId('');
    setDateOfBirth('');
    setSelectedCourseId('all');
    setVerifiedCert(null);
    setRelatedCerts([]);
    setErrorMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Official Credential Verification System
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
          Verify HAIFOS Certificate
        </h1>
        <p className="text-sm text-gray-600">
          Instant public verification for all official certificates issued by {settings.orgName}. 
          Rendered dynamically on-the-fly with 100% cryptographic authenticity.
        </p>
      </div>

      {/* Verification Search Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Row 1: Course Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              1. Select Course Type
            </label>
            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">-- All Courses / Any Program --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Row 2: Certificate ID & Date of Birth Calendar Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Certificate ID or Enrollment Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. Certificate ID or Enrollment Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. HF-2026-WEB-8192 or 12345"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Date of Birth with Calendar Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                3. Date of Birth <span className="text-red-500">*</span>
              </label>
              <div 
                onClick={() => {
                  if (dateInputRef.current) {
                    try {
                      dateInputRef.current.showPicker();
                    } catch {
                      dateInputRef.current.focus();
                    }
                  }
                }}
                className="relative cursor-pointer group"
              >
                {/* Formatted visible text field displaying DD-MM-YYYY */}
                <input
                  type="text"
                  readOnly
                  placeholder="DD-MM-YYYY"
                  value={formatDisplayDob(dateOfBirth)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 group-hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all cursor-pointer font-mono"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-600">
                  <Calendar className="w-4 h-4" />
                </div>

                {/* Actual HTML date input with calendar picker & max=today */}
                <input
                  ref={dateInputRef}
                  type="date"
                  max={today}
                  value={dateOfBirth}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && val > today) {
                      setErrorMessage('Date of Birth cannot be in the future.');
                      return;
                    }
                    setDateOfBirth(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onClick={(e) => {
                    try {
                      (e.currentTarget as HTMLInputElement).showPicker();
                    } catch {
                      // fallback
                    }
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  tabIndex={-1}
                  aria-label="Select Date of Birth"
                />
              </div>
            </div>

          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            {verifiedCert && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                title="Clear results"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Form</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Verification Unsuccessful</p>
              <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
              <p className="text-[11px] text-gray-600 mt-2">
                Need help? Contact the HAIFOS Academic Registry at{' '}
                <a href={`mailto:${settings.orgEmail}`} className="underline font-semibold text-brand-700">
                  {settings.orgEmail}
                </a>{' '}
                or call {settings.orgPhone}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verification Success Section & Dynamic Certificate */}
      {verifiedCert && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Verified Official Badge Banner */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand-50 via-sky-50 to-blue-50 border-2 border-brand-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 flex-shrink-0">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-brand-600 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                      Official Record Confirmed
                    </span>
                    <span className="text-xs text-brand-800 font-mono font-semibold">
                      Status: {verifiedCert.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                    Certificate Successfully Validated
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Issued to <strong>{verifiedCert.studentName}</strong> for completing{' '}
                    <strong>{verifiedCert.courseName}</strong> on {verifiedCert.issueDate}.
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right text-xs text-gray-600 font-mono border-t sm:border-t-0 sm:border-l border-brand-200 pt-3 sm:pt-0 sm:pl-6">
                <div>Registry ID: <strong>{verifiedCert.id}</strong></div>
                <div className="text-[11px] text-gray-500 mt-0.5">Enrollment: {verifiedCert.enrollmentNumber}</div>
                <div className="text-[10px] text-brand-700 mt-1 font-bold">Zero-Storage Live Re-generation</div>
              </div>

            </div>
          </div>

          {/* Live Standard Certificate Render */}
          <div className="max-w-6xl mx-auto">
            <CertificateTemplate certificate={verifiedCert} settings={settings} />
          </div>

          {/* If Student has Multiple Certificates (Dynamic re-generation for all certificates of enrollment) */}
          {relatedCerts.length > 0 && (
            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                Other Certificates Issued to this Enrollment ({verifiedCert.enrollmentNumber})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedCerts.map((otherCert) => (
                  <div
                    key={otherCert.id}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between hover:border-brand-300 transition-all"
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-900">{otherCert.courseName}</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">ID: {otherCert.id} &bull; {otherCert.issueDate}</div>
                    </div>
                    <button
                      onClick={() => setVerifiedCert(otherCert)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      View &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
