import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, X, Send } from 'lucide-react';
import { Certificate, SystemSettings } from '../types';
import { generateCertificateEmailHtml, getVerificationUrl } from '../services/emailService';

interface EmailPreviewModalProps {
  certificate: Certificate;
  settings: SystemSettings;
  isOpen: boolean;
  onClose: () => void;
  onSendAutomated?: () => void;
  isSending?: boolean;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  certificate,
  settings,
  isOpen,
  onClose,
  onSendAutomated,
  isSending = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const verificationUrl = getVerificationUrl(certificate.id, certificate.dateOfBirth);
  const emailHtml = generateCertificateEmailHtml(certificate, settings, verificationUrl);
  const subject = `Congratulations ${certificate.studentName}! Your HAIFOS Certificate of Completion [ID: ${certificate.id}]`;
  const mailToUrl = `mailto:${encodeURIComponent(certificate.studentEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Dear ${certificate.studentName},\n\nCongratulations! Your official Certificate of Completion for "${certificate.courseName}" has been issued.\n\nCertificate ID: ${certificate.id}\nVerification Link: ${verificationUrl}\n\nBest regards,\n${settings.orgName}`
  )}`;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brand-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Automated Student Email Template</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 text-xs space-y-1.5 font-mono">
          <div className="flex gap-2">
            <span className="text-gray-500 font-semibold w-16">To:</span>
            <span className="text-gray-900 font-bold">{certificate.studentName} &lt;{certificate.studentEmail}&gt;</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 font-semibold w-16">From:</span>
            <span className="text-gray-700">{settings.orgName} &lt;{settings.orgEmail}&gt;</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 font-semibold w-16">Subject:</span>
            <span className="text-gray-900 font-medium">{subject}</span>
          </div>
        </div>

        {/* Email HTML Preview Frame */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-hidden">
            <iframe
              srcDoc={emailHtml}
              title="Email Template Preview"
              className="w-full h-[380px] border-0 rounded-lg"
            />
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'HTML Copied' : 'Copy HTML'}
            </button>
            <a
              href={mailToUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Mail App
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            {onSendAutomated && (
              <button
                onClick={onSendAutomated}
                disabled={isSending}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? 'Sending Automated Email...' : 'Send Automated Email Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
