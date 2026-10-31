# HAIFOS Portal - Certificate Verification & Attendance Management System

An independent, production-ready web application inspired by [haifos.org](https://www.haifos.org), purpose-built for **instant dynamic certificate verification** and **student attendance management**.

Designed specifically for **100% zero-cost hosting** on **Netlify + GitHub** with **zero server file storage** (standardized certificates are rendered dynamically on demand from record metadata).

---

## 🌟 Key Features

### 1. 🎓 Dynamic Certificate Verification (Student & Public)
- **3-Point Credential Check:**
  1. **Course Type:** Select specific course or all programs.
  2. **Certificate ID:** Unique ID (e.g. `HF-2026-WEB-8192`).
  3. **Verification Secret:** Student **Date of Birth** (`YYYY-MM-DD`) or **Last Name**.
- **Standardized Certificate Template:**
  - Official HAIFOS logo, header, and Section 8 non-profit insignia.
  - Ornate gold double border with classic academic styling (`Cinzel` font).
  - Recipient full name, enrollment number, and course details.
  - **Dynamic Live QR Code:** Scanning the QR code opens the exact live verification URL.
  - **Authorized Signatures:** Digital signatures of Executive Director and Coordinator.
  - **Official Hologram / Seal:** Authenticity badge and cryptographic verification hash.
- **Zero Server File Storage:**
  - **No PDF or image files are ever stored on the server disk**, keeping your hosting completely free!
  - If the enrollment number or certificate ID exists in the database, the system **dynamically re-generates** the certificate live.
  - 1-click **Download PDF** (generated in the user's browser using `jsPDF` + `html2canvas`).
  - 1-click **Download High-Res PNG** or **Print**.
  - 1-click **Add to LinkedIn** & **Copy Verification Link**.

---

### 2. 🛡️ Admin Portal & Completely Automated Emailing
- **Admin Security & Role Management:** Protected by Supabase Auth with bcrypt password hashing and Role-Based Access Control (Super Admin & Admin).
- **Add Student User Profile:**
  - First Name, Last Name, Date of Birth, Email, Phone, Course, Batch, and Enrollment Number.
- **Generate & Approve Certificate:**
  - Admin selects the student and course, sets grade and completion dates, and clicks **"Approve & Send Certificate"**.
  - Automatically generates a unique, standardized Certificate ID (e.g., `HF-2026-WEB-8842`).
- **Completely Automated Email Delivery:**
  - Automatically sends an official, branded HTML certificate email template to the student.
  - Email contains student details, course title, certificate ID, and direct 1-click verification & download link.
  - Supports **Free EmailJS** (200 free emails/month directly from frontend, zero server needed) and instant mail-client fallbacks.
  - Built-in **Email Template Preview Modal** to view and test emails anytime.

---

### 3. 📅 Student Attendance Registry
- **Student Attendance Check:**
  - Search by **Enrollment Number** (`HF-2026-001`), **Certificate ID**, or **Email**.
  - View overall **Attendance Percentage** circular gauge.
  - **Certification Eligibility Badge** (e.g. Green: ≥ 75% Eligible; Warning: < 75%).
  - Total Sessions, Present count, Late count, Absent count.
  - Detailed daily chronological session history table with curriculum topics and instructor sign-off.
- **Admin Daily Attendance Posting:**
  - Select course and date (defaults to today).
  - Loads enrolled student roster with toggle buttons (`Present`, `Late`, `Absent`, `Excused`).
  - 1-Click **"Mark All Present"** for lightning-fast daily submission.
  - Save to attendance registry with one click.

---

### 4. 💾 Data Persistence & Zero-Cost Architecture
- **Built-in LocalStorage / IndexedDB:** Pre-loaded with realistic sample data (Rahul Sharma, Priya Patel, Sneha Reddy, courses, attendance history). Works immediately out of the box with zero external database configuration!
- **Data Export & Import (JSON):** 1-Click full backup download and restore.
- **Optional Supabase Cloud PostgreSQL:** Includes `supabase_schema.sql` if you wish to connect a free Supabase cloud database.

---

## 🚀 100% Free Deployment to Netlify & GitHub

This application is optimized for Netlify's free tier ($0/month forever).

### Step 1: Initialize Git and Push to GitHub
Open your terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit of HAIFOS portal"
```

Create a new repository on [GitHub](https://github.com/new) (e.g., `haifos-portal`), and push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/haifos-portal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com/) (Free).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select **GitHub** and choose your `haifos-portal` repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy haifos-portal"**.
6. Your website will be live in ~60 seconds with a free `.netlify.app` domain and free SSL!

---

## 🧪 Quick Test Credentials

### Demo Students & Certificates:
| Student Name | Enrollment ID | Date of Birth | Course | Sample Certificate ID |
| :--- | :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `HF-2026-001` | `2002-04-15` | Full Stack Web Development | `HF-2026-WEB-8192` |
| **Priya Patel** | `HF-2026-002` | `2003-08-22` | Digital Literacy & AI | `HF-2026-DL-4731` |
| **Sneha Reddy** | `HF-2026-004` | `2004-01-30` | Digital Literacy & AI | Active Student (96% Attendance) |

### Admin Access:
- **Authentication:** Admin accounts are managed securely via Supabase Authentication. Default administrative credentials should be set up via environment variables or initial onboarding and never committed into version control.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```
