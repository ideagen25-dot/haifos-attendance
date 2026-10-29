import React from 'react';
import { Award, CalendarCheck, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, BookOpen, Users, FileCheck } from 'lucide-react';
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
                Building a digital verification ecosystem by empowering rural youth with authentic tamper-proof certificates, transparent daily attendance tracking, and 100% zero-storage architecture.
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

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-[#101828]">100%</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Automated Issuance</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#1a5487]">0 MB</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Server Storage ($0 Cost)</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#101828]">Free</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Netlify &amp; GitHub Ready</div>
                </div>
              </div>
            </div>

            {/* Right Card / Visual with Floating Badges styled like haifos.org */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Floating Regional Pill 1: TELANGANA */}
                <div className="absolute -top-3 left-8 bg-white border border-gray-100 shadow-md px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-[#101828] uppercase z-30 pointer-events-none">
                  TELANGANA
                </div>

                {/* Floating Regional Pill 2: BIHAR */}
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-white border border-gray-100 shadow-md px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-[#101828] uppercase z-30 pointer-events-none">
                  BIHAR
                </div>

                {/* Floating Bottom Pill: Join the Movement */}
                <div className="absolute -bottom-4 left-8 bg-white border border-gray-100 shadow-lg px-5 py-2 rounded-full text-xs font-black tracking-wider text-[#1a5487] flex items-center gap-2 z-30">
                  <div className="w-4 h-4 rounded-full bg-[#1a5487] text-white flex items-center justify-center text-[10px] font-black">+</div>
                  <span>Join the MOVEMENT</span>
                </div>

                {/* Floating Certificate Preview Snippet */}
                <div className="bg-white rounded-[32px] p-7 shadow-2xl border border-gray-100 relative z-20">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#edf1f5] text-[#1a5487] flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#101828] uppercase">Standard Dynamic Credential</div>
                        <div className="text-[11px] text-[#1a5487] font-semibold">Live On-the-Fly Generation</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-200">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>

                  <div className="bg-[#f0f6fb]/70 rounded-2xl p-4 border border-[#c5ddf0]/60 mb-5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Student:</span>
                      <span className="font-bold text-[#101828]">Rahul Sharma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Certificate ID:</span>
                      <span className="font-mono font-bold text-[#1a5487]">HF-2026-WEB-8192</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Course:</span>
                      <span className="font-medium text-gray-800">Full Stack Web Development</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attendance:</span>
                      <span className="font-bold text-brand-700">92% (Eligible)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('verify')}
                      className="w-full py-3 bg-[#1a5487] hover:bg-[#12406a] text-white rounded-xl text-xs font-bold transition-colors text-center shadow-md shadow-[#1a5487]/20"
                    >
                      Try Live Verification &rarr;
                    </button>
                  </div>
                </div>

                {/* Decorative Background Glows */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#bfd8c0]/40 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#c5ddf0]/50 rounded-full blur-2xl -z-10"></div>
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
                Simply select the Course Type, input the Certificate ID, and verify with Date of Birth or Last Name.
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
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Admin daily attendance posting with 1-click batch toggles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Student query by Enrollment Number, Certificate ID, or Email</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Live percentage indicators (Eligible vs Warning status)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('attendance')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <span>Launch Attendance Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Admin Feature Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3.5 py-1 bg-white/10 text-sky-200 text-xs font-bold rounded-full uppercase tracking-wider">
              Admin &amp; Faculty Command Center
            </span>
            <h3 className="text-3xl font-black tracking-tight text-white">
              Automated Student Onboarding, Approvals &amp; Email Dispatch
            </h3>
            <p className="text-sm text-sky-100 leading-relaxed">
              Add student profiles, approve certificates with a single click, and automatically email them the official certificate notification and direct verification link.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-900 hover:bg-brand-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Open Admin Portal (Default PIN: admin)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
