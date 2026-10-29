import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Share2, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { Certificate, SystemSettings } from '../types';
import { getVerificationUrl } from '../services/emailService';

interface CertificateTemplateProps {
  certificate: Certificate;
  settings: SystemSettings;
  showActions?: boolean;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  settings,
  showActions = true,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const certRef = useRef<HTMLDivElement>(null);

  const verificationUrl = getVerificationUrl(certificate.id, certificate.dateOfBirth);

  useEffect(() => {
    // Dynamically generate QR Code on-the-fly (zero server storage)
    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#1a5487',
        light: '#ffffff',
      },
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  }, [verificationUrl]);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setIsExporting(true);

    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (retina 300dpi equivalent)
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HAIFOS_Certificate_${certificate.id}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Unable to generate PDF. You can also use the Print button to save as PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!certRef.current) return;
    setIsExporting(true);

    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `HAIFOS_Certificate_${certificate.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLinkedInShare = () => {
    const orgName = encodeURIComponent(settings.orgName);
    const certName = encodeURIComponent(certificate.courseName);
    const certUrl = encodeURIComponent(verificationUrl);
    const certId = encodeURIComponent(certificate.id);
    const issueYear = new Date(certificate.issueDate).getFullYear();
    const issueMonth = new Date(certificate.issueDate).getMonth() + 1;

    const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${certId}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Actions Toolbar */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 w-full max-w-5xl mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full border border-green-200">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Verified Authenticity
            </span>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline">
              ID: {certificate.id}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy public verification link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied Link!' : 'Copy Link'}
            </button>

            <button
              onClick={handleLinkedInShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0a66c2] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Add to LinkedIn
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              PNG
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* STANDARD DYNAMIC CERTIFICATE CANVAS (Standardized Template) */}
      <div className="w-full overflow-x-auto flex justify-center pb-6">
        <div
          id="certificate-to-print"
          ref={certRef}
          className="relative bg-white text-gray-900 shadow-2xl rounded-sm overflow-hidden border-[12px] border-[#1a5487] print:border-8 print:shadow-none"
          style={{
            width: '1000px',
            minWidth: '1000px',
            height: '700px',
            boxSizing: 'border-box',
          }}
        >
          {/* Inner Ornate Gold Border */}
          <div className="absolute inset-3 border-2 border-[#D4AF37] pointer-events-none z-10 flex flex-col justify-between p-2">
            {/* Corner flourishes */}
            <div className="flex justify-between w-full">
              <div className="w-8 h-8 border-t-4 border-l-4 border-[#1a5487]"></div>
              <div className="w-8 h-8 border-t-4 border-r-4 border-[#1a5487]"></div>
            </div>
            <div className="flex justify-between w-full">
              <div className="w-8 h-8 border-b-4 border-l-4 border-[#1a5487]"></div>
              <div className="w-8 h-8 border-b-4 border-r-4 border-[#1a5487]"></div>
            </div>
          </div>

          {/* Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none z-0">
            <img src="/haifos-logo.png" alt="" className="w-[450px] object-contain grayscale" />
          </div>

          {/* Certificate Content Container */}
          <div className="relative z-20 h-full flex flex-col justify-between px-16 py-10 text-center">
            
            {/* Header: Organization Emblem & Name */}
            <div>
              <div className="flex items-center justify-center gap-4 mb-2">
                <img 
                  src="/haifos-logo.png" 
                  alt="HAIFOS" 
                  className="h-16 w-auto object-contain" 
                  crossOrigin="anonymous" 
                />
                <div className="text-left border-l-2 border-gray-200 pl-3">
                  <h2 className="text-xl font-black tracking-widest text-[#1a5487] font-cert-title uppercase leading-tight">
                    {settings.orgName}
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">
                    Section 8 Non-Profit &bull; Founded by IIT Hyderabad Community
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="inline-block relative">
                  <h1 className="text-3xl font-extrabold tracking-wider text-gray-900 uppercase font-cert-title px-8 py-1">
                    Certificate of Excellence
                  </h1>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-full"></div>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#1a5487] font-bold mt-1">
                  Official Academic Credential
                </p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="my-2">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">
                This credential is proudly presented to
              </p>
              <h2 className="text-4xl font-bold font-cert-name tracking-wide border-b border-gray-200 pb-2 max-w-xl mx-auto text-[#0f2540]">
                {certificate.studentName}
              </h2>

              <div className="flex items-center justify-center gap-6 mt-2 text-xs text-gray-600 font-mono">
                <span>Enrollment No: <strong>{certificate.enrollmentNumber}</strong></span>
                <span>&bull;</span>
                <span>Certificate ID: <strong className="text-[#1a5487]">{certificate.id}</strong></span>
              </div>
            </div>

            {/* Course & Achievement Statement */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                for outstanding dedication and successfully completing all curriculum requirements, workshops, and practical assessments in
              </p>
              <h3 className="text-xl font-bold text-[#1a5487] my-1 font-serif">
                {certificate.courseName}
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                Awarded with distinction &amp; honor: <span className="font-bold text-gray-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-amber-900">{certificate.grade}</span>
              </p>
            </div>

            {/* Footer: Signatures, Seal, Dynamic QR */}
            <div className="grid grid-cols-3 items-end pt-4 border-t border-gray-100">
              
              {/* Left: Dynamic QR Code for On-the-Fly Verification */}
              <div className="flex flex-col items-center text-center">
                <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Verify QR Code" className="w-20 h-20" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">QR Loading</div>
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold mt-1">
                  Scan to Verify Authenticity
                </span>
                <span className="text-[8px] text-gray-400 font-mono">
                  {certificate.id}
                </span>
              </div>

              {/* Center: Official Golden Seal */}
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#D4AF37] bg-gradient-to-br from-[#FEF9E7] to-[#F9E79F] shadow-md p-1">
                  <div className="w-full h-full rounded-full border border-dashed border-[#B8860B] flex flex-col items-center justify-center text-center p-1">
                    <ShieldCheck className="w-6 h-6 text-[#1a5487] mb-0.5" />
                    <span className="text-[7px] uppercase font-black tracking-tighter text-[#7D6608] leading-tight">
                      HAIFOS VERIFIED
                    </span>
                    <span className="text-[6px] uppercase tracking-widest text-gray-600 font-bold">
                      OFFICIAL SEAL
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-600 mt-1 font-medium">
                  Issued: <strong>{certificate.issueDate}</strong>
                </div>
              </div>

              {/* Right: Authorized Digital Signatures */}
              <div className="flex flex-col items-center">
                <div className="h-10 flex items-end">
                  <div className="font-serif italic text-lg text-gray-800 tracking-wider font-semibold">
                    {settings.directorName}
                  </div>
                </div>
                <div className="w-48 h-0.5 bg-gray-400 my-1"></div>
                <div className="text-[11px] font-bold text-gray-800">{settings.directorName}</div>
                <div className="text-[9px] uppercase tracking-wider text-gray-500">{settings.directorTitle}</div>
                <div className="text-[8px] text-gray-400">{settings.orgName}</div>
              </div>

            </div>

            {/* Bottom Verification Hash Footnote */}
            <div className="pt-2 text-[8px] text-gray-400 flex justify-between items-center border-t border-gray-100 font-mono">
              <span>Security Hash: {certificate.verificationHash}</span>
              <span>Zero-Storage Dynamic Render &bull; haifos.org</span>
              <span>Registrar Signature ID: {certificate.id.replace('HF-', 'REG-')}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
