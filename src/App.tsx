import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { SystemSettings } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VerificationPage } from './pages/VerificationPage';
import { AttendancePage } from './pages/AttendancePage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'verify' | 'attendance' | 'admin'>('home');
  const [settings, setSettings] = useState<SystemSettings>(() => storage.getSettings());

  useEffect(() => {
    // Sync active tab with URL Hash (e.g. #verify, #attendance, #admin)
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#verify')) {
        setActiveTab('verify');
      } else if (hash.startsWith('#attendance')) {
        setActiveTab('attendance');
      } else if (hash.startsWith('#admin')) {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    const updated = storage.saveSettings(newSettings);
    setSettings(updated);
  };

  const handleTabChange = (tab: 'home' | 'verify' | 'attendance' | 'admin') => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={handleTabChange}
            settings={settings}
          />
        )}

        {activeTab === 'verify' && (
          <VerificationPage
            settings={settings}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendancePage
            settings={settings}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            setActiveTab={handleTabChange}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        setActiveTab={handleTabChange}
      />
    </div>
  );
}

export default App;
