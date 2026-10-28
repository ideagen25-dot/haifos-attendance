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
            <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13.78l-7-3.18v4.94C5 19.34 8.13 21 12 21s7-1.66 7-3.46v-4.94l-7 3.18z"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-black text-gray-950 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                HAIFOS
              </div>
              <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-1">
                Academic &amp; Attendance Portal
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.id === 'verify') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-brand-600/30'
                        : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gray-100 text-brand-700 font-extrabold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
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
