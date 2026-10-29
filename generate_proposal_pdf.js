import { jsPDF } from 'jspdf';
import fs from 'fs';

function buildProposalPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const COLOR_PRIMARY = [12, 96, 58]; // #0c603a (HAIFOS Green)
  const COLOR_PRIMARY_DARK = [8, 68, 41];
  const COLOR_GOLD = [212, 175, 55]; // #D4AF37
  const COLOR_TEXT_DARK = [25, 30, 36];
  const COLOR_TEXT_MUTED = [100, 116, 139];
  const COLOR_BG_LIGHT = [248, 250, 249];
  const COLOR_BORDER = [226, 232, 240];

  function addHeader(pageNum, totalPages) {
    // Top banner bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Thin gold strip
    doc.setFillColor(...COLOR_GOLD);
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text('HAIFOS INNOVATIVE FORUM &bull; TECHNICAL PROPOSAL & COMMERCIAL QUOTE', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text('CONFIDENTIAL &bull; ₹10,000 INR ALL-INCLUSIVE', pageWidth - margin, 14, { align: 'right' });

    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, 16, pageWidth - margin, 16);
  }

  function addFooter(pageNum, totalPages) {
    const y = pageHeight - 12;
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, y - 3, pageWidth - margin, y - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text('100% Free-Tier Architecture ($0 Server Cost) | Dynamic Certificate & Attendance Portal', margin, y + 2);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, y + 2, { align: 'right' });

    // Bottom strip
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');
  }

  // ==========================================
  // PAGE 1: COVER & EXECUTIVE SUMMARY
  // ==========================================
  addHeader(1, 4);

  let yPos = 26;

  // Badge
  doc.setFillColor(234, 242, 234);
  doc.roundedRect(margin, yPos, 62, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('PROJECT PROPOSAL & QUOTATION', margin + 3, yPos + 4.8);

  yPos += 13;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLOR_TEXT_DARK);
  doc.text('Digital Certificate Verification &', margin, yPos);
  yPos += 8.5;
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('Student Attendance Portal', margin, yPos);

  yPos += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text('Independent, Turnkey Web Application with Zero Monthly Cloud Hosting Costs', margin, yPos);

  yPos += 10;

  // Metadata Card (Project Specs)
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'FD');

  const col1 = margin + 6;
  const col2 = margin + (contentWidth / 2) + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text('CLIENT / ORGANIZATION:', col1, yPos + 8);
  doc.text('PREPARED FOR:', col1, yPos + 16);
  doc.text('RECURRING SERVER COST:', col1, yPos + 24);

  doc.text('TOTAL PROJECT COST:', col2, yPos + 8);
  doc.text('DELIVERY TIMELINE:', col2, yPos + 16);
  doc.text('ARCHITECTURE TYPE:', col2, yPos + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT_DARK);
  doc.text('HAIFOS Innovative Forum / Partner Organization', col1 + 44, yPos + 8);
  doc.text('Executive Management & Training Leadership', col1 + 44, yPos + 16);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('₹0 / Month Forever ($0 Free Tier)', col1 + 44, yPos + 24);

  doc.setTextColor(180, 83, 9); // Amber
  doc.setFontSize(11);
  doc.text('₹10,000 INR (All-Inclusive Fixed)', col2 + 40, yPos + 8);

  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT_DARK);
  doc.text('3 to 5 Business Days', col2 + 40, yPos + 16);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('100% Free-Tier (Netlify + Supabase)', col2 + 40, yPos + 24);

  yPos += 42;

  // Section: Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('1. Executive Summary', margin, yPos);

  yPos += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_TEXT_DARK);

  const execSummary = [
    'This proposal outlines the end-to-end development, testing, deployment, and handover of a dedicated digital web portal engineered specifically for HAIFOS educational initiatives and community training centers.',
    '',
    'Traditional certificate management and attendance tracking platforms present significant bottlenecks: they either require expensive monthly software-as-a-service (SaaS) subscriptions, expensive cloud file storage for storing heavy PDF files, or laborious manual email distribution.',
    '',
    'Our solution completely re-engineers this model by delivering a custom-built, production-grade portal that achieves 100% Zero Recurring Hosting Costs. Standardized certificates are generated dynamically on-the-fly directly in the browser from database metadata, requiring zero server disk storage. Furthermore, certificate email delivery is seamlessly integrated with a 1-click dispatch directly from your official email client (Gmail / Desktop Mail), eliminating third-party email API fees and delivery failures.'
  ];

  let textY = yPos;
  execSummary.forEach(p => {
    if (p === '') {
      textY += 3;
    } else {
      const lines = doc.splitTextToSize(p, contentWidth);
      doc.text(lines, margin, textY);
      textY += lines.length * 4.6;
    }
  });

  yPos = textY + 5;

  // Key Pillars (3 Cards)
  const cardW = (contentWidth - 8) / 3;
  const cardH = 34;

  const pillars = [
    {
      title: 'Dynamic Verification',
      sub: 'Zero File Storage',
      desc: 'Certificates render live on demand. Authentic QR code & verification seal. Instant PDF/PNG download.',
    },
    {
      title: 'Daily Attendance',
      sub: 'Transparent Registry',
      desc: '1-click daily batch marking. Cumulative attendance % calculation with certificate eligibility status.',
    },
    {
      title: '1-Click Direct Email',
      sub: 'Zero API Charges',
      desc: 'Admin clicks send; pre-filled email template opens in Gmail/mail client. Click send and done.',
    },
  ];

  pillars.forEach((p, i) => {
    const x = margin + i * (cardW + 4);
    doc.setFillColor(...COLOR_BG_LIGHT);
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, yPos, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(p.title, x + 4, yPos + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_GOLD);
    doc.text(p.sub.toUpperCase(), x + 4, yPos + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(...COLOR_TEXT_DARK);
    const pLines = doc.splitTextToSize(p.desc, cardW - 8);
    doc.text(pLines, x + 4, yPos + 17);
  });

  addFooter(1, 4);

  // ==========================================
  // PAGE 2: ZERO-COST ARCHITECTURE BLUEPRINT
  // ==========================================
  doc.addPage();
  addHeader(2, 4);

  yPos = 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('2. How the System Operates 100% Free Tier ($0 Recurring Cost)', margin, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text('Every layer of the application is designed to stay permanently within high-generosity free tiers without compromising enterprise speed or security.', margin, yPos);

  yPos += 8;

  // Table of 4 Free Tier Infrastructure Layers
  const layers = [
    {
      layer: '1. Frontend Hosting & CDN',
      provider: 'Netlify (Free Tier)',
      limits: '100 GB Monthly Bandwidth &bull; Automated Continuous Git Deployments &bull; Free Global SSL',
      whyFree: 'Pure client-side Single Page Application (SPA). Zero backend compute cost. Deployed straight from GitHub.'
    },
    {
      layer: '2. Cloud Database & Sync',
      provider: 'Supabase PostgreSQL (Free Tier)',
      limits: '500 MB Database &bull; 50,000 Monthly Active Users &bull; Instant REST API with Row-Level Security',
      whyFree: 'Only structured text rows (name, date, status, cert ID) are stored. 500 MB holds over 300,000+ student records.'
    },
    {
      layer: '3. Certificate Generation Engine',
      provider: 'Client-Side HTML5 Canvas / jsPDF',
      limits: 'Unlimited Certificate Generations &bull; Zero Server Disk Usage &bull; Zero Cloud Storage Fees',
      whyFree: 'The server NEVER stores static PDF or image files! The certificate re-generates dynamically in the user browser.'
    },
    {
      layer: '4. Student Email Dispatch',
      provider: 'Direct 1-Click Mail Client Integration',
      limits: 'Unlimited Emails &bull; Sends from your own official Gmail / Outlook / Corporate Address',
      whyFree: 'No third-party email API subscriptions (e.g. SendGrid/Mailgun) required. Pre-fills message ready for 1-click send.'
    }
  ];

  layers.forEach((l, i) => {
    doc.setFillColor(...COLOR_BG_LIGHT);
    doc.setDrawColor(...COLOR_BORDER);
    doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

    // Left indicator bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(margin, yPos, 3, 24, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text(l.layer, margin + 7, yPos + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(`Provider: ${l.provider}`, pageWidth - margin - 5, yPos + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(`Capacity: ${l.limits}`, margin + 7, yPos + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_DARK);
    const whyLines = doc.splitTextToSize(`Cost Advantage: ${l.whyFree}`, contentWidth - 14);
    doc.text(whyLines, margin + 7, yPos + 17);

    yPos += 27;
  });

  yPos += 3;

  // Comparison Box: Traditional vs Our Proposed Solution
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('Financial Comparison Over 3 Years:', margin, yPos);

  yPos += 6;

  // Comparison Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, yPos, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_DARK);
  doc.text('EXPENSE CATEGORY', margin + 4, yPos + 4.8);
  doc.text('TRADITIONAL LMS / SAAS SYSTEM', margin + 65, yPos + 4.8);
  doc.text('OUR PROPOSED SOLUTION', margin + 125, yPos + 4.8);

  yPos += 7;

  const comparisons = [
    ['Cloud Server & Storage (AWS/DigitalOcean)', '₹1,500 – ₹3,000 / month', '₹0.00 / month (Netlify)'],
    ['Transactional Email Subscriptions', '₹800 – ₹1,500 / month', '₹0.00 / month (1-Click Direct)'],
    ['Database Maintenance & S3 File Storage', '₹1,000 / month', '₹0.00 / month (Supabase 500MB)'],
    ['3-Year Total Infrastructure Cost', '₹1,18,800+ INR', '₹0.00 INR (100% Free Forever)'],
  ];

  comparisons.forEach((row, idx) => {
    const isTotal = idx === comparisons.length - 1;
    doc.setFillColor(isTotal ? 234 : 255, isTotal ? 242 : 255, isTotal ? 234 : 255);
    doc.rect(margin, yPos, contentWidth, 7, 'F');
    doc.setDrawColor(...COLOR_BORDER);
    doc.line(margin, yPos + 7, pageWidth - margin, yPos + 7);

    doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(isTotal ? COLOR_PRIMARY[0] : COLOR_TEXT_DARK[0], isTotal ? COLOR_PRIMARY[1] : COLOR_TEXT_DARK[1], isTotal ? COLOR_PRIMARY[2] : COLOR_TEXT_DARK[2]);
    doc.text(row[0], margin + 4, yPos + 4.8);

    doc.setTextColor(isTotal ? 185 : COLOR_TEXT_MUTED[0], isTotal ? 28 : COLOR_TEXT_MUTED[1], isTotal ? 28 : COLOR_TEXT_MUTED[2]);
    doc.text(row[1], margin + 65, yPos + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(row[2], margin + 125, yPos + 4.8);

    yPos += 7;
  });

  addFooter(2, 4);

  // ==========================================
  // PAGE 3: FEATURE SPECIFICATIONS & SCOPE
  // ==========================================
  doc.addPage();
  addHeader(3, 4);

  yPos = 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('3. Detailed Functional Modules & Deliverables', margin, yPos);

  yPos += 8;

  const modules = [
    {
      title: 'Module 1: Public Dynamic Certificate Verification Portal',
      points: [
        '3-Point Security Verification: Requires Course Selection + Certificate ID + (Date of Birth OR Last Name).',
        'Standardized HAIFOS Certificate Design: Features ornate gold border, Section 8 insignia, and academic serif typography.',
        'Live Dynamic QR Code: Real-time QR generated via qrcode library linking directly to the public verification URL.',
        'Zero-Storage Vector Export: High-definition PDF and PNG download buttons generated client-side in seconds.',
        'Professional Social Sharing: Direct "Add to LinkedIn" credential button and 1-click URL copy feature.'
      ]
    },
    {
      title: 'Module 2: Daily Attendance Management & Student Tracking',
      points: [
        'Daily Session Logger: Admin selects date and course to automatically load enrolled students.',
        '1-Click Batch Marking: Quick "Mark All Present" button alongside individual toggles (Present, Late, Absent, Excused).',
        'Student Attendance Query: Students search by Enrollment Number, Cert ID, or Email to view their attendance record.',
        'Visual Percentage Gauge: Instant eligibility badge (>= 75% Eligible for Certificate, < 75% Warning/Defaulter).',
        'Chronological Session History: Table listing date, topics covered, and instructor verification stamp.'
      ]
    },
    {
      title: 'Module 3: Admin Command Center & Security Controls',
      points: [
        'Password-Protected Access: Configurable administrator PIN/password to safeguard sensitive student data.',
        'Student User Management: Add, edit, filter, search, and delete student profiles with unique enrollment numbers.',
        'Single-Click Certificate Generation: Select student and course to instantly mint an authenticated Certificate ID.',
        'Dual-Mode Reliability: Built-in local offline demo database + 1-click cloud sync to Supabase PostgreSQL.',
        'One-Click JSON Backup & Restore: Complete database export and import to safeguard data at all times.'
      ]
    },
    {
      title: 'Module 4: 1-Click Direct Email Dispatch (Zero API Cost)',
      points: [
        'Zero-Friction Workflow: Clicking "Send Certificate Email" prepares a personalized, branded email template.',
        'Opens in Your Email Client: Automatically opens Gmail Web or your default desktop mail app with 1 click.',
        'Pre-Filled Fields: Student email, subject line, congratulations message, and direct verification link are pre-loaded.',
        'Effortless Review: The admin simply reviews the message on their own screen and clicks "Send" — completely free.'
      ]
    }
  ];

  modules.forEach(m => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(m.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(...COLOR_TEXT_DARK);

    m.points.forEach(pt => {
      doc.setFillColor(...COLOR_GOLD);
      doc.circle(margin + 2, yPos - 1, 1, 'F');
      const lines = doc.splitTextToSize(pt, contentWidth - 8);
      doc.text(lines, margin + 6, yPos);
      yPos += lines.length * 4.2;
    });

    yPos += 4;
  });

  addFooter(3, 4);

  // ==========================================
  // PAGE 4: COMMERCIAL QUOTATION & HANDOVER
  // ==========================================
  doc.addPage();
  addHeader(4, 4);

  yPos = 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('4. Commercial Quotation & Milestone Breakdown', margin, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text('Fixed, transparent pricing with complete end-to-end testing, deployment, and zero hidden costs.', margin, yPos);

  yPos += 8;

  // Quotation Table Header
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ITEM #', margin + 4, yPos + 5.5);
  doc.text('DELIVERABLE DESCRIPTION', margin + 22, yPos + 5.5);
  doc.text('TIMELINE', margin + 120, yPos + 5.5);
  doc.text('AMOUNT (INR)', pageWidth - margin - 4, yPos + 5.5, { align: 'right' });

  yPos += 8;

  const quoteItems = [
    {
      no: '1.0',
      title: 'Portal Frontend & Brand System',
      desc: 'Responsive web interface styled to HAIFOS brand, Cinzel academic typography, dual core tabs.',
      days: 'Day 1',
      cost: '₹ 3,500'
    },
    {
      no: '2.0',
      title: 'Dynamic Certificate & QR Verification Engine',
      desc: 'Zero-storage live generation, 3-point credential validation, high-res PDF & PNG vector export.',
      days: 'Day 2',
      cost: '₹ 2,500'
    },
    {
      no: '3.0',
      title: 'Daily Attendance System & 1-Click Emailing',
      desc: 'Batch attendance logger, student percentage calculation, 1-click Gmail/mail client template dispatch.',
      days: 'Day 3',
      cost: '₹ 2,000'
    },
    {
      no: '4.0',
      title: 'Supabase Cloud Database & RLS Security',
      desc: 'PostgreSQL schema setup, multi-device live synchronization, Row-Level Security policies.',
      days: 'Day 4',
      cost: '₹ 1,000'
    },
    {
      no: '5.0',
      title: 'Netlify Production Deployment & Handover',
      desc: 'Continuous Git build setup, custom domain SSL linking, cross-device testing & admin guide.',
      days: 'Day 5',
      cost: '₹ 1,000'
    },
  ];

  quoteItems.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 249);
    doc.rect(margin, yPos, contentWidth, 12, 'F');
    doc.setDrawColor(...COLOR_BORDER);
    doc.line(margin, yPos + 12, pageWidth - margin, yPos + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text(item.no, margin + 4, yPos + 5);

    doc.text(item.title, margin + 22, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(item.desc, margin + 22, yPos + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text(item.days, margin + 120, yPos + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(item.cost, pageWidth - margin - 4, yPos + 6, { align: 'right' });

    yPos += 12;
  });

  // Total Summary Row
  doc.setFillColor(234, 242, 234);
  doc.rect(margin, yPos, contentWidth, 12, 'F');
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 12, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text('TOTAL FIXED PROJECT COST:', margin + 6, yPos + 7.5);

  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  doc.text('₹ 10,000 INR', pageWidth - margin - 6, yPos + 7.5, { align: 'right' });

  yPos += 18;

  // Commercial Terms & Handover Checklist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('Payment Terms & Delivery Commitment:', margin, yPos);

  yPos += 5;

  const terms = [
    'Fixed Cost Commitment: Total payable is strictly ₹10,000 INR. No extra or surprise charges.',
    'Recurring Hosting Cost: ₹0.00 / Month Forever (runs on 100% Free Tiers of Netlify and Supabase).',
    'Payment Structure: 50% Advance upon project kickoff (₹5,000) &bull; 50% upon final live deployment (₹5,000).',
    'Warranty & Bug Support: Includes 14 Days of free post-launch support and live admin training session.',
    'Complete Ownership: Full Git repository source code and database ownership transferred to your organization.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_DARK);
  terms.forEach(t => {
    doc.setFillColor(...COLOR_PRIMARY);
    doc.circle(margin + 2, yPos - 1, 0.8, 'F');
    const lines = doc.splitTextToSize(t, contentWidth - 8);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 4.2;
  });

  yPos += 8;

  // Sign-off Box
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

  const half = contentWidth / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text('ACCEPTED & APPROVED BY (CLIENT):', margin + 4, yPos + 6);
  doc.text('SERVICE PROVIDER / LEAD DEVELOPER:', margin + half + 4, yPos + 6);

  doc.setDrawColor(...COLOR_TEXT_MUTED);
  doc.setLineWidth(0.3);
  doc.line(margin + 4, yPos + 18, margin + half - 10, yPos + 18);
  doc.line(margin + half + 4, yPos + 18, pageWidth - margin - 4, yPos + 18);

  doc.setFontSize(7.5);
  doc.text('Signature & Official Seal &bull; Date', margin + 4, yPos + 21.5);
  doc.text('Full Stack Solution Lead &bull; Date', margin + half + 4, yPos + 21.5);

  addFooter(4, 4);

  // Save PDF to file
  const pdfBytes = doc.output('arraybuffer');
  const outputPath = 'HAIFOS_Portal_Proposal_10K_INR.pdf';
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log(`Successfully generated proposal PDF: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
}

buildProposalPDF();
