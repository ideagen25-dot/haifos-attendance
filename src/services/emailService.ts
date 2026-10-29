import { Certificate, SystemSettings } from '../types';
import { storage } from './storage';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  gmailComposeUrl: string;
  mailToUrl: string;
  emailSubject: string;
  emailBodyText: string;
  emailHtml: string;
}

export function getVerificationUrl(certificateId: string, dob?: string): string {
  const origin = window.location.origin;
  const params = new URLSearchParams();
  params.set('id', certificateId);
  if (dob) {
    params.set('dob', dob);
  }
  return `${origin}/#verify?${params.toString()}`;
}

export function generateCertificateEmailText(
  certificate: Certificate,
  settings: SystemSettings,
  verificationUrl: string
): string {
  return `Dear ${certificate.studentName},

Congratulations! We are delighted to inform you that your official Certificate of Completion has been successfully issued by ${settings.orgName}.

--------------------------------------------------
CREDENTIAL DETAILS
--------------------------------------------------
Student Name:     ${certificate.studentName}
Enrollment ID:    ${certificate.enrollmentNumber}
Certificate ID:   ${certificate.id}
Program/Course:   ${certificate.courseName}
Performance:      ${certificate.grade}
Issue Date:       ${certificate.issueDate}

--------------------------------------------------
VIEW & DOWNLOAD YOUR CERTIFICATE
--------------------------------------------------
Click the official link below to view, verify, and download your high-resolution Certificate (PDF/PNG):
${verificationUrl}

(You can also add this credential directly to your LinkedIn profile Licenses & Certifications from the portal).

Best regards,
Academic Registry
${settings.orgName}
${settings.orgWebsite} | ${settings.orgEmail}
Phone: ${settings.orgPhone}
`;
}

export function generateCertificateEmailHtml(
  certificate: Certificate,
  settings: SystemSettings,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Certificate of Completion</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f5; margin: 0; padding: 20px; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #0c603a 0%, #084429 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; }
    .lead { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
    .cert-card { background: #f0f7f2; border: 1.5px dashed #0c603a; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
    .cert-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
    .cert-row:last-child { margin-bottom: 0; }
    .cert-label { color: #6b7280; font-weight: 500; }
    .cert-value { color: #111827; font-weight: 700; text-align: right; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #0c603a; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 50px; }
    .footer { background: #f9fafb; padding: 24px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    .footer a { color: #0c603a; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${settings.orgName}</h1>
      <p>Official Academic Credential Registry</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${certificate.studentName},</div>
      <p class="lead">
        Congratulations! Your official <strong>Certificate of Completion</strong> for <strong>${certificate.courseName}</strong> has been issued.
      </p>

      <div class="cert-card">
        <div class="cert-row">
          <span class="cert-label">Student Name:</span>
          <span class="cert-value">${certificate.studentName}</span>
        </div>
        <div class="cert-row">
          <span class="cert-label">Certificate ID:</span>
          <span class="cert-value" style="color: #0c603a;">${certificate.id}</span>
        </div>
        <div class="cert-row">
          <span class="cert-label">Enrollment ID:</span>
          <span class="cert-value">${certificate.enrollmentNumber}</span>
        </div>
        <div class="cert-row">
          <span class="cert-label">Performance:</span>
          <span class="cert-value">${certificate.grade}</span>
        </div>
        <div class="cert-row">
          <span class="cert-label">Issue Date:</span>
          <span class="cert-value">${certificate.issueDate}</span>
        </div>
      </div>

      <div class="btn-container">
        <a href="${verificationUrl}" class="btn" target="_blank">
          View & Download Certificate &rarr;
        </a>
      </div>
    </div>
    <div class="footer">
      <p>${settings.orgName} &bull; <a href="${settings.orgWebsite}">${settings.orgWebsite}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1-Click Direct Email Dispatch:
 * Opens the admin's email client (Gmail Web or default mail application)
 * with the student's email, subject, and formatted template pre-filled!
 * The admin only has to click "Send".
 */
export function openDirectEmailClient(
  certificate: Certificate,
  settings: SystemSettings
): EmailDispatchResult {
  const verificationUrl = getVerificationUrl(certificate.id, certificate.dateOfBirth);
  const emailSubject = `Congratulations ${certificate.studentName}! Your Certificate of Completion [ID: ${certificate.id}]`;
  const emailBodyText = generateCertificateEmailText(certificate, settings, verificationUrl);
  const emailHtml = generateCertificateEmailHtml(certificate, settings, verificationUrl);

  // 1. Gmail Web Direct Link (opens Gmail compose in a new tab)
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(certificate.studentEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyText)}`;

  // 2. Standard mailto protocol (opens Outlook / Apple Mail / default app)
  const mailToUrl = `mailto:${encodeURIComponent(certificate.studentEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyText)}`;

  // Mark as dispatched in the local registry
  storage.updateCertificateEmailStatus(certificate.id, true);

  return {
    success: true,
    message: `Email template prepared for ${certificate.studentEmail}. Opening your email client to send!`,
    gmailComposeUrl,
    mailToUrl,
    emailSubject,
    emailBodyText,
    emailHtml,
  };
}
