import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, X, Send } from 'lucide-react';
import { Certificate, SystemSettings } from '../types';
import { openDirectEmailClient } from '../services/emailService';

interface EmailPreviewModalProps {
  certificate: Certificate;
  settings: SystemSettings;
  isOpen: boolean;
  onClose: () => void;
  onDispatched?: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  certificate,
  settings,
  isOpen,
  onClose,
  onDispatched,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const result = openDirectEmailClient(certificate, settings);

  const handleCopyBody = () => {
    navigator.clipboard.writeText(result.emailBodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGmail = () => {
    window.open(result.gmailComposeUrl, '_blank');
    if (onDispatched) onDispatched();
  };

  const handleOpenMailApp = () => {
    window.location.href = result.mailToUrl;
    if (onDispatched) onDispatched();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brand-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-sky-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Send Certificate Email</h3>
              <p className="text-[11px] text-sky-100">Pre-filled in your email client &bull; 1-click send</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <span className="font-bold text-amber-800">Ready to Send:</span>
          <span>Clicking the button below will open your email with the student's address, subject, and certificate link pre-filled. Just review and click Send!</span>
        </div>

        {/* Email Metadata */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 text-xs space-y-1.5 font-mono">
          <div className="flex gap-2">
            <span className="text-gray-500 font-semibold w-16">To:</span>
            <span className="text-gray-900 font-bold">{certificate.studentName} &lt;{certificate.studentEmail}&gt;</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 font-semibold w-16">Subject:</span>
            <span className="text-gray-900 font-medium">{result.emailSubject}</span>
          </div>
        </div>

        {/* Message Preview */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-100">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed select-all">
            {result.emailBodyText}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyBody}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-brand-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Message' : 'Copy Message'}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenMailApp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Default Mail App</span>
            </button>

            <button
              onClick={handleOpenGmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in Gmail (1-Click) &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
