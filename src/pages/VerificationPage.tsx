import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Search, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, RotateCcw, Calendar, User, BookOpen } from 'lucide-react';
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
  const [dobOrLastName, setDobOrLastName] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [relatedCerts, setRelatedCerts] = useState<Certificate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        const urlDob = params.get('dob') || params.get('lastName');
        const urlCourse = params.get('courseId') || 'all';

        if (urlId) {
          setCertificateId(urlId);
          if (urlDob) setDobOrLastName(urlDob);
          if (urlCourse) setSelectedCourseId(urlCourse);

          // Auto-verify if credentials are in the URL
          if (urlDob) {
            executeVerification(urlCourse, urlId, urlDob);
          }
        }
      }
    };

    handleUrlParams();
    window.addEventListener('hashchange', handleUrlParams);
    return () => window.removeEventListener('hashchange', handleUrlParams);
  }, []);

  const executeVerification = (courseId: string, certId: string, queryDobOrLastName: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setVerifiedCert(null);
    setRelatedCerts([]);

    setTimeout(() => {
      const result = storage.verifyCertificate(courseId, certId, queryDobOrLastName);

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
            colors: ['#0c603a', '#D4AF37', '#16a34a', '#EAF2EA'],
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setErrorMessage(result.message);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setErrorMessage('Please enter a Certificate ID.');
      return;
    }
    if (!dobOrLastName.trim()) {
      setErrorMessage('Please enter the Student Date of Birth (YYYY-MM-DD) or Last Name.');
      return;
    }
    executeVerification(selectedCourseId, certificateId, dobOrLastName);
  };

  // Demo auto-fill helper for quick review/testing
  const handleLoadSample = (sampleType: 'rahul' | 'priya') => {
    if (sampleType === 'rahul') {
      setSelectedCourseId('course-2');
      setCertificateId('HF-2026-WEB-8192');
      setDobOrLastName('Sharma');
      executeVerification('course-2', 'HF-2026-WEB-8192', 'Sharma');
    } else {
      setSelectedCourseId('course-1');
      setCertificateId('HF-2026-DL-4731');
      setDobOrLastName('2003-08-22');
      executeVerification('course-1', 'HF-2026-DL-4731', '2003-08-22');
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setDobOrLastName('');
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

          {/* Row 2: Certificate ID & DOB / Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Certificate ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. Certificate ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. HF-2026-WEB-8192"
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

            {/* DOB or Last Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                3. Date of Birth OR Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 2002-04-15 or Sharma"
                  value={dobOrLastName}
                  onChange={(e) => setDobOrLastName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-600">Quick Test:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('rahul')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
              >
                Sample 1 (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('priya')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
              >
                Sample 2 (Priya)
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {verifiedCert && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Clear results"
                >
                  <RotateCcw className="w-4 h-4" />
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
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 flex-shrink-0">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                      Official Record Confirmed
                    </span>
                    <span className="text-xs text-emerald-800 font-mono font-semibold">
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

              <div className="text-center sm:text-right text-xs text-gray-600 font-mono border-t sm:border-t-0 sm:border-l border-emerald-200 pt-3 sm:pt-0 sm:pl-6">
                <div>Registry ID: <strong>{verifiedCert.id}</strong></div>
                <div className="text-[11px] text-gray-500 mt-0.5">Enrollment: {verifiedCert.enrollmentNumber}</div>
                <div className="text-[10px] text-emerald-700 mt-1 font-bold">Zero-Storage Live Re-generation</div>
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
