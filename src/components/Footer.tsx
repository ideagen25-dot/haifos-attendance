import React from 'react';
import { SystemSettings } from '../types';

interface FooterProps {
  settings: SystemSettings;
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActiveTab }) => {
  return (
    <footer className="no-print relative bg-[#0F172A] text-white overflow-hidden py-16 lg:py-24 border-t border-slate-800">
      
      {/* Decorative Asymmetric Blobs matching HAIFOS official website */}
      <svg 
        viewBox="0 0 500 500" 
        className="absolute bottom-0 right-0 w-[40vw] max-w-lg text-[#38bdf8]/5 pointer-events-none select-none" 
        aria-hidden="true"
      >
        <path 
          d="M440,290Q408,380,325,415Q242,450,167,408Q92,366,62,280Q32,194,85,121Q138,48,224,36Q310,24,380,75Q450,126,440,290Z" 
          fill="currentColor" 
        />
      </svg>
      <svg 
        viewBox="0 0 600 500" 
        className="absolute top-0 left-0 w-[25vw] max-w-sm text-[#38bdf8]/5 pointer-events-none select-none" 
        aria-hidden="true"
      >
        <path 
          d="M412,87Q365,174,320,218Q275,262,214,309Q153,356,91,310Q29,264,47,185Q65,106,128,68Q191,30,266,14Q341,-2,394,43Q447,88,412,87Z" 
          fill="currentColor" 
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a 
              href="https://haifos.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mb-8 block"
            >
              <img
                src="/haifos-logo.png"
                alt="HAIFOS"
                className="object-contain h-16 sm:h-20 w-auto brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
              />
            </a>
            <p className="text-gray-400 text-sm leading-loose mb-10 max-w-xs">
              Empowering rural communities through digital access, foundational skills, and inclusive technology development.
            </p>
            <div className="flex gap-4">
              {[
                { 
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ), 
                  label: 'Instagram', 
                  href: 'https://www.instagram.com/forumhaifos023' 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ), 
                  label: 'Facebook', 
                  href: 'https://www.facebook.com/haifosforum' 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ), 
                  label: 'X (Twitter)', 
                  href: 'https://x.com/HAifosForeum' 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ), 
                  label: 'LinkedIn', 
                  href: 'https://www.linkedin.com/in/haifos-innovative-forum-1375342aa/' 
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#38bdf8]/20 hover:border-[#38bdf8]/40 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#38bdf8] mb-8 underline decoration-2 underline-offset-8 decoration-[#38bdf8]">
              Navigate
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: 'https://haifos.org/about' },
                { label: 'Our Programs', href: 'https://haifos.org/programs' },
                { label: 'Media Center', href: 'https://haifos.org/media' },
                { label: 'Get Involved', href: 'https://haifos.org/get-involved' },
                { label: 'Contact Us', href: 'https://haifos.org/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#38bdf8] mb-8 underline decoration-2 underline-offset-8 decoration-[#38bdf8]">
              Impact
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Donate Now', href: 'https://haifos.org/donate' },
                { label: 'Volunteer', href: 'https://haifos.org/get-involved#volunteer' },
                { label: 'Partner With Us', href: 'https://haifos.org/get-involved#partner' },
                { label: 'Interns & Performers', href: 'https://haifos.org/get-involved/interns' },
                { label: 'Research Units', href: 'https://haifos.org/programs#research' },
                { label: 'Rural Centers', href: 'https://haifos.org/programs#centers' },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#38bdf8] mb-8 underline decoration-2 underline-offset-8 decoration-[#38bdf8]">
              Get In Touch
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-4">
                <svg className="w-5 h-5 text-[#38bdf8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400 font-medium leading-relaxed">
                  C/O Jitendra Mandal, H.No - 157, Basudeopur, Munger, Bihar (IN)
                </span>
              </li>
              <li>
                <a href="mailto:info@haifos.org" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors font-medium">
                  <svg className="w-5 h-5 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@haifos.org
                </a>
              </li>
              <li>
                <a href="tel:+917709963514" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors font-medium">
                  <svg className="w-5 h-5 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 7709963514
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer Bar with portal actions and copyright */}
        <div className="border-t border-white/5 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
            © {new Date().getFullYear()} HAIFOS Innovative Forum. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button
              onClick={() => { setActiveTab('verify'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 hover:text-[#38bdf8] transition-colors"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => { setActiveTab('attendance'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 hover:text-[#38bdf8] transition-colors"
            >
              Check Attendance
            </button>
            <a 
              href="https://haifos.org/privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://haifos.org/terms" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
