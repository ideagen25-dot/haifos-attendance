import React from 'react';
import { Award, CalendarCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { SystemSettings } from '../types';

interface HomePageProps {
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
  settings: SystemSettings;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, settings }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section styled after HAIFOS aesthetic */}
      <section className="relative overflow-hidden bg-white pt-12 pb-20 border-b border-gray-100">
        {/* Soft Organic Background Shape */}
        <div className="absolute top-0 right-0 w-[55vw] h-full bg-[#f4f8f4]/90 rounded-bl-[120px] pointer-events-none -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#edf1f5] text-[#1a5487] text-xs font-black rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#1a5487]" />
                TECHNOLOGY FOR ALL &bull; HAIFOS PORTAL
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight leading-[1.08]">
                Building Digital Trust in <br />
                <span className="text-[#1a5487]">Credentials &amp; Attendance</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-normal">
                HAIFOS empowers educational institutions with smart digital solutions<br className="hidden sm:inline" /> for student management and academic operations.
              </p>

              {/* Action Buttons styled after haifos.org */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('verify')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1a5487] hover:bg-[#12406a] text-white font-bold text-sm rounded-lg shadow-lg shadow-[#1a5487]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Award className="w-4 h-4" />
                  <span>Verify a Certificate</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-transparent hover:bg-[#1a5487]/5 text-[#1a5487] font-bold text-sm rounded-lg border-2 border-[#1a5487] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Check Attendance</span>
                </button>
              </div>
            </div>

            {/* Right Column: Official HAIFOS Company Logo */}
            <div className="lg:col-span-5 flex items-center justify-center py-4 lg:py-0">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center p-4 sm:p-8">
                <img
                  src="/haifos-logo.png"
                  alt="HAIFOS - Academic & Attendance Portal"
                  className="w-full max-h-72 sm:max-h-80 lg:max-h-96 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Two Core Portals Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-brand-600 uppercase tracking-widest block mb-2">Dual Core Modules</span>
          <h2 className="text-3xl font-black text-gray-900">What would you like to do?</h2>
          <p className="text-sm text-gray-600 mt-2">
            Access the instant certificate verification registry or track student classroom attendance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Certificate Verification */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-premium hover:border-brand-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 mb-3">
                1. Certificate Verification Portal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Students, recruiters, and academic institutions can verify certificates issued by HAIFOS.
                Simply select the Course Type, input the Certificate ID, and verify with Date of Birth.
              </p>
              
              <ul className="space-y-2.5 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Standard authentic template dynamically rendered on-demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Instant PDF and PNG high-resolution export without server files</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Live QR Code linking directly to official verification url</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('verify')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-600/20"
            >
              <span>Launch Verification Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Student Attendance */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-premium hover:border-brand-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 mb-3">
                2. Student Attendance Portal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Track daily student attendance transparently. Students can check their attendance record,
                percentage, session breakdown, and eligibility for final course certification.
              </p>
              
              <ul className="space-y-2.5 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Real-time daily attendance updates and session history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Student query by Enrollment Number, Certificate ID, or Email</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Live percentage indicators (Eligible vs Warning status)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('attendance')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-600/20"
            >
              <span>Launch Attendance Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
