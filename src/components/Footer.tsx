import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, Globe } from 'lucide-react';
import { SystemSettings } from '../types';

interface FooterProps {
  settings: SystemSettings;
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActiveTab }) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About HAIFOS */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                <img src="/haifos-logo.png" alt="HAIFOS" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-wide">{settings.orgName}</h4>
                <p className="text-xs text-brand-300 font-semibold uppercase tracking-wider">{settings.orgTagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              HAIFOS is a Section 8 non-profit organization founded by students and alumni from IIT Hyderabad, dedicated to bridging the digital divide across rural communities through digital literacy, AI awareness, and educational technology access.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Independent, Zero-Server-Storage Credential &amp; Attendance Registry</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Portals</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => { setActiveTab('verify'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('attendance'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  Check Student Attendance
                </button>
              </li>
              <li>
                <a
                  href={settings.orgWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-brand-400 transition-colors"
                >
                  Official Website <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Registry Support */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Registry Support</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{settings.orgEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{settings.orgPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{settings.orgAddress}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.orgName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with 100% Free Netlify + GitHub Architecture &bull; Dynamic Client Rendering
          </p>
        </div>
      </div>
    </footer>
  );
};
