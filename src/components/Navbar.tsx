import React, { useState } from 'react';
import { Award, CalendarCheck, Shield, Menu, X, CheckCircle, Sparkles } from 'lucide-react';
import { SystemSettings } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'verify' | 'attendance' | 'admin';
  setActiveTab: (tab: 'home' | 'verify' | 'attendance' | 'admin') => void;
  settings: SystemSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'verify', label: 'Verify Certificate', icon: Award, highlight: true },
    { id: 'attendance', label: 'Check Attendance', icon: CalendarCheck },
    { id: 'admin', label: 'Admin Portal', icon: Shield },
  ];

  const handleNavClick = (tabId: 'home' | 'verify' | 'attendance' | 'admin') => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.location.hash = tabId;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Org Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/haifos-logo.png" 
              alt="HAIFOS" 
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="hidden sm:block border-l border-gray-200 pl-3">
              <div className="text-base font-black text-[#0f2540] tracking-tight leading-none group-hover:text-brand-600 transition-colors uppercase">
                HAIFOS
              </div>
              <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-1">
                Academic &amp; Attendance Portal
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 text-sm font-black transition-colors rounded-full ${
                activeTab === 'home'
                  ? 'text-[#1a5487] bg-[#1a5487]/10'
                  : 'text-gray-700 hover:text-[#1a5487] hover:bg-[#1a5487]/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('attendance')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-black transition-colors rounded-full ${
                activeTab === 'attendance'
                  ? 'text-[#1a5487] bg-[#1a5487]/10'
                  : 'text-gray-700 hover:text-[#1a5487] hover:bg-[#1a5487]/5'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Check Attendance</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-black transition-colors rounded-full ${
                activeTab === 'admin'
                  ? 'text-[#1a5487] bg-[#1a5487]/10'
                  : 'text-gray-700 hover:text-[#1a5487] hover:bg-[#1a5487]/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>

            {/* Right Action Button styled like 'DONATE NOW' in haifos.org */}
            <button
              onClick={() => handleNavClick('verify')}
              className={`ml-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 ${
                activeTab === 'verify'
                  ? 'bg-[#12406a] text-white ring-2 ring-[#1a5487] ring-offset-2'
                  : 'bg-[#1a5487] hover:bg-[#12406a] text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Verify Certificate</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
