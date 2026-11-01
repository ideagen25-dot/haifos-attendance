import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { Certificate, SystemSettings } from '../types';

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

  // Official verification URL on credentials.haifos.org
  const verificationUrl = `https://credentials.haifos.org/?id=${encodeURIComponent(certificate.id)}`;

  useEffect(() => {
    // Generate high-resolution QR Code pointing to credentials.haifos.org
    QRCode.toDataURL(verificationUrl, {
      width: 180,
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
        scale: 2.5, // 300 DPI executive print resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HAIFOS_Internship_Letter_${certificate.id}.pdf`);
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
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `HAIFOS_Internship_Letter_${certificate.id}.png`;
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
    const certName = encodeURIComponent(certificate.courseName + ' Internship');
    const certUrl = encodeURIComponent(verificationUrl);
    const certId = encodeURIComponent(certificate.id);
    const issueYear = new Date(certificate.issueDate || Date.now()).getFullYear();
    const issueMonth = new Date(certificate.issueDate || Date.now()).getMonth() + 1;

    const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${certId}`;
    window.open(linkedinUrl, '_blank');
  };

  // Helper date formatting
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const issueDateFormatted = formatDate(certificate.issueDate) || 'November 01, 2026';

  const calcStartDate = () => {
    if (certificate.startDate) return formatDate(certificate.startDate);
    const end = new Date(certificate.completionDate || certificate.issueDate || Date.now());
    const start = new Date(end.getTime() - 45 * 24 * 60 * 60 * 1000);
    return start.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calcEndDate = () => {
    if (certificate.endDate) return formatDate(certificate.endDate);
    return formatDate(certificate.completionDate || certificate.issueDate) || 'November 01, 2026';
  };

  const studentName = certificate.studentName || 'Student Name';
  const collegeName = certificate.collegeName || 'Indian Institute of Technology';
  const orgName = settings.orgName || 'HAIFOS INNOVATIVE FORUM';
  const role = certificate.role || (certificate.courseName.toLowerCase().includes('intern') ? certificate.courseName : `${certificate.courseName} Intern`);
  const startDate = calcStartDate();
  const endDate = calcEndDate();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Actions Toolbar */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-800 text-xs font-semibold rounded-full border border-brand-200">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
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
              {copiedLink ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors disabled:opacity-50"
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

      {/* FORMAL LETTERHEAD CERTIFICATE CANVAS (A4 Portrait Format) */}
      <div className="w-full overflow-x-auto flex justify-center pb-8">
        <div
          id="certificate-to-print"
          ref={certRef}
          className="relative bg-white text-gray-900 shadow-2xl overflow-hidden print:shadow-none font-sans"
          style={{
            width: '820px',
            minWidth: '820px',
            minHeight: '1160px',
            boxSizing: 'border-box',
            padding: '48px 56px 36px 56px',
            position: 'relative',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Subtle Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
            <img 
              src="/certificate-assets/company-logo.png" 
              alt="" 
              className="w-[480px] object-contain grayscale" 
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[1076px]">
            
            {/* ======================================================== */}
            {/* LETTERHEAD HEADER: COMPANY LOGO, MCA DETAILS, ACCREDITATIONS */}
            {/* ======================================================== */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-4">
                
                {/* Left: Organization Logo & Official Registration Info */}
                <div className="flex items-start gap-4">
                  <img 
                    src="/certificate-assets/company-logo.png" 
                    alt="HAIFOS Logo" 
                    className="h-16 w-auto object-contain flex-shrink-0" 
                    crossOrigin="anonymous" 
                  />
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-[#1a5487] font-serif uppercase leading-tight">
                      {orgName}
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                      Section 8 Non-Profit Organization &bull; MCA Govt. of India
                    </p>
                    <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600 font-medium leading-tight">
                      <p>
                        <span className="font-bold text-slate-800">CIN no:</span>{' '}
                        <span className="font-mono text-slate-900 font-semibold">U88900BR2023NPL065423</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span className="font-bold text-slate-800">Reg no:</span>{' '}
                        <span className="font-mono text-slate-900 font-semibold">065423</span>
                      </p>
                      <p>
                        <span className="font-bold text-slate-800">Website:</span>{' '}
                        <span className="text-[#1a5487] font-semibold">haifos.org</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span className="font-bold text-slate-800">Email:</span>{' '}
                        <span>info@haifos.org</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: MSME & ISO Accreditations */}
                <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                  <div className="flex flex-col items-center">
                    <img 
                      src="/certificate-assets/msme-logo.png" 
                      alt="MSME Registered" 
                      className="h-12 w-auto object-contain" 
                      crossOrigin="anonymous" 
                    />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                      MSME Govt. of India
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img 
                      src="/certificate-assets/iso-logo.png" 
                      alt="ISO 9001:2015 Certified" 
                      className="h-12 w-auto object-contain" 
                      crossOrigin="anonymous" 
                    />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                      ISO 9001:2015
                    </span>
                  </div>
                </div>

              </div>

              {/* Decorative Executive Double Divider */}
              <div className="w-full">
                <div className="h-[3px] bg-[#1a5487] w-full"></div>
                <div className="h-[1px] bg-[#D4AF37] w-full mt-[1.5px]"></div>
              </div>

              {/* Reference & Date Strip */}
              <div className="flex items-center justify-between py-3 text-xs text-slate-600 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">Certificate ID: </span>
                  <span className="font-mono font-bold text-[#1a5487] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {certificate.id}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Date: </span>
                  <span className="text-slate-800">{issueDateFormatted}</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* FORMAL LETTER CONTENT */}
            {/* ======================================================== */}
            <div className="py-5 space-y-6">
              
              {/* Formal Document Title & Centered Salutation */}
              <div className="text-center pt-1 pb-1 space-y-2.5">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 font-serif underline decoration-2 underline-offset-8 decoration-[#1a5487]">
                  CERTIFICATE OF INTERNSHIP COMPLETION
                </h2>
                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-900 pt-1 font-serif">
                  TO WHOM IT MAY CONCERN
                </p>
              </div>

              {/* Paragraph 1 - Clean Uniform Typography (Normal Text) */}
              <p className="text-[14px] text-slate-800 leading-[2.1] text-justify font-normal">
                This letter serves to formally certify that {studentName}, a student of {collegeName}, has successfully completed a professional internship with {orgName} in the role of {role}. {studentName} has been an intern with us from {startDate} to {endDate}.
              </p>

              {/* Paragraph 2 - Clean Uniform Typography (Normal Text) */}
              <p className="text-[14px] text-slate-800 leading-[2.1] text-justify font-normal">
                During this tenure with our organization, {studentName} displayed a commendable level of dedication and professionalism. They were actively involved in the tasks and responsibilities assigned, demonstrating a strong willingness to learn.
              </p>

              {/* Paragraph 3 - Clean Uniform Typography (Normal Text) */}
              <p className="text-[14px] text-slate-800 leading-[2.1] text-justify font-normal">
                We are pleased to state that all assigned work was performed satisfactorily. We wish {studentName} all the very best in future academic endeavors and professional pursuits.
              </p>

              {/* Valediction */}
              <div className="pt-3">
                <p className="text-sm text-slate-800 font-medium">Sincerely,</p>
                <p className="text-xs uppercase font-bold tracking-wider text-[#1a5487] mt-0.5">
                  For {orgName}
                </p>
              </div>

            </div>

            {/* ======================================================== */}
            {/* EXECUTIVE SIGNATORIES & REALISTIC OFFICIAL STAMP */}
            {/* ======================================================== */}
            <div className="pt-2">
              <div className="flex items-end justify-between px-4 pb-6">
                
                {/* Signatory 1: Arvind Kumar, Founder & CEO */}
                <div className="flex flex-col items-start w-56">
                  <div className="h-16 flex items-end mb-1">
                    <img 
                      src="/certificate-assets/sig-arvind.png" 
                      alt="Signature Arvind Kumar" 
                      className="h-14 w-auto object-contain" 
                      crossOrigin="anonymous" 
                    />
                  </div>
                  <div className="w-52 h-[1.5px] bg-slate-400 mb-1.5"></div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">Arvind Kumar</h4>
                  <p className="text-xs font-semibold text-[#1a5487] leading-tight">Founder &amp; CEO</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{orgName}</p>
                </div>

                {/* Center: Authentic Realistic Organization Seal Stamp (No wording underneath) */}
                <div className="flex flex-col items-center justify-center pb-1">
                  <img 
                    src="/certificate-assets/stamp.png" 
                    alt="Official Organization Stamp" 
                    className="w-32 h-32 object-contain drop-shadow-sm rotate-[-3deg]" 
                    style={{ mixBlendMode: 'multiply' }}
                    crossOrigin="anonymous" 
                  />
                </div>

                {/* Signatory 2: Abhimanyu Kumar, Internship Program Manager */}
                <div className="flex flex-col items-end w-56 text-right">
                  <div className="h-16 flex items-end mb-1">
                    <img 
                      src="/certificate-assets/sig-abhimanyu.png" 
                      alt="Signature Abhimanyu Kumar" 
                      className="h-14 w-auto object-contain" 
                      crossOrigin="anonymous" 
                    />
                  </div>
                  <div className="w-52 h-[1.5px] bg-slate-400 mb-1.5"></div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">Abhimanyu Kumar</h4>
                  <p className="text-xs font-semibold text-[#1a5487] leading-tight">Internship Program Manager</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{orgName}</p>
                </div>

              </div>

              {/* ======================================================== */}
              {/* FOOTER STRIP WITH SCANNER (QR) ANCHORED AT BOTTOM-RIGHT */}
              {/* ======================================================== */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-4">
                
                {/* Left: Office Address, Contacts & Explicit Verification Notice */}
                <div className="space-y-1 text-[10px] text-slate-500 flex-1">
                  <p>
                    <strong className="text-slate-700">Reg. Office:</strong>{' '}
                    <span>C/O Jitendra Mandal, H.No - 157, Basudeopur, Munger, Bihar (IN)</span>
                  </p>
                  <p>
                    <strong className="text-slate-700">Contact:</strong>{' '}
                    <span>+91 7709963514</span>
                    <span className="mx-2 text-slate-300">&bull;</span>
                    <span>info@haifos.org</span>
                    <span className="mx-2 text-slate-300">&bull;</span>
                    <span className="text-[#1a5487] font-semibold">www.haifos.org</span>
                  </p>
                  <p className="text-[10px] text-[#1a5487] font-semibold pt-0.5">
                    To verify this certificate, visit{' '}
                    <a 
                      href="https://credentials.haifos.org/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline font-bold text-brand-700 hover:text-brand-900"
                    >
                      https://credentials.haifos.org/
                    </a>
                  </p>
                </div>

                {/* Right: Verification Scanner (QR) with credentials.haifos.org link */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-2 rounded-xl flex-shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-black text-[#1a5487] tracking-wider">
                      Verify Credential
                    </span>
                    <span className="block text-[8px] text-slate-600 font-semibold">
                      credentials.haifos.org
                    </span>
                    <span className="block text-[8px] font-mono font-bold text-slate-700">
                      ID: {certificate.id}
                    </span>
                  </div>
                  <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Verify QR Code" className="w-14 h-14" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-[8px] text-slate-400">
                        QR
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
