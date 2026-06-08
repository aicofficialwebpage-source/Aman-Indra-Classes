import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const phone = '+91 91400 64194';
  const email = 'aicofficialwebpage@gmail.com';
  const address = 'Ratanlal Nagar Main Road, High Income Grade, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Kanpur, Uttar Pradesh – 208022';
  const website = 'https://amanindraclasses-official.vercel.app';

  useEffect(() => {
    document.title = 'Privacy Policy - Aman Indra Classes';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-emerald-950 py-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-5 rounded-full mb-3">
            Legal & Compliance
          </span>
          <h1 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4 flex items-center justify-center gap-2">
            <Shield size={32} className="text-brand-accent stroke-[2]" />
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-8 md:p-12 shadow-sm text-slate-700 dark:text-slate-200 leading-relaxed text-xs md:text-sm flex flex-col gap-8 transition-colors duration-300">
          
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to Aman Indra Classes ("AIC", "we", "our", or "us"). We are committed to protecting the privacy and security of students, parents, visitors, and users of our website.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, and protect information when you visit our website, submit admission or counseling inquiries, register for scholarship examinations, or otherwise interact with our educational services.
            </p>
            <p>
              By using our website, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              2. Information We Collect
            </h2>
            
            <h3 className="font-bold text-brand-dark dark:text-white mt-2">Admission & Counseling Information</h3>
            <p>When you submit an inquiry or counseling form, we may collect:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Student's Name</li>
              <li>Parent's/Guardian's Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>School Name</li>
              <li>Current Class</li>
              <li>Interested Course or Program</li>
              <li>Any additional information voluntarily provided by you</li>
            </ul>

            <h3 className="font-bold text-brand-dark dark:text-white mt-4">Scholarship Registration Information</h3>
            <p>When registering for the Aman Indra Scholarship Test (AIST), we may collect:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Student's Name</li>
              <li>Parent's/Guardian's Name</li>
              <li>Contact Number</li>
              <li>Class Studying In</li>
              <li>Previous Academic Performance</li>
              <li>Board Information</li>
              <li>Examination Preferences</li>
              <li>Other information required for registration and evaluation</li>
            </ul>

            <h3 className="font-bold text-brand-dark dark:text-white mt-4">Technical Information</h3>
            <p>When you visit our website, certain information may be collected automatically, including:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>IP Address</li>
              <li>Browser Type</li>
              <li>Device Information</li>
              <li>Operating System</li>
              <li>Date and Time of Visit</li>
              <li>Website Usage Statistics</li>
            </ul>
            <p>This information helps us maintain website security and improve user experience.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              3. How We Use Your Information
            </h2>
            <p>We may use the information collected for the following purposes:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>To respond to admission and counseling inquiries.</li>
              <li>To process scholarship registrations and examinations.</li>
              <li>To communicate important academic updates.</li>
              <li>To provide information about courses, batches, examinations, and events.</li>
              <li>To maintain student records and administrative processes.</li>
              <li>To improve our website and services.</li>
              <li>To ensure website security and prevent misuse.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              4. Information Sharing
            </h2>
            <p>We respect your privacy and do not sell, rent, or trade personal information to third parties.</p>
            <p>Information may be shared only:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>When required by law or legal authorities.</li>
              <li>To protect the rights, safety, and security of Aman Indra Classes.</li>
              <li>With authorized personnel who require access for academic or administrative purposes.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              5. Data Security
            </h2>
            <p>
              We implement reasonable technical and organizational measures to protect personal information from unauthorized access, disclosure, alteration, or destruction.
            </p>
            <p>
              While we strive to use commercially acceptable means to safeguard information, no method of electronic transmission or storage can be guaranteed to be completely secure.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              6. Data Retention
            </h2>
            <p>
              We retain personal information only for as long as necessary to fulfill educational, administrative, legal, and operational requirements.
            </p>
            <p>Information may be securely deleted when it is no longer required.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              7. Your Rights
            </h2>
            <p>You may contact us to:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Review the information you have submitted.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of information where applicable.</li>
              <li>Opt out of non-essential communications.</li>
            </ul>
            <p>Requests will be reviewed and handled in accordance with applicable laws.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites or social media platforms. We are not responsible for the privacy practices or content of those external websites.
            </p>
            <p>Users should review the privacy policies of any third-party sites they visit.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              9. Changes to this Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated revision date.
            </p>
            <p>Continued use of the website after updates constitutes acceptance of the revised policy.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              10. Contact Us
            </h2>
            <p>For questions regarding this Privacy Policy or your personal information, please contact:</p>
            <div className="bg-slate-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-800/20 mt-2 flex flex-col gap-1.5 text-xs md:text-sm">
              <span className="font-extrabold text-brand-dark dark:text-white text-base">Aman Indra Classes</span>
              <span><strong>Address:</strong> {address}</span>
              <span><strong>Phone:</strong> {phone}</span>
              <span><strong>Email:</strong> <a href={`mailto:${email}`} className="text-brand-accent hover:underline">{email}</a></span>
              <span><strong>Website:</strong> <a href={website} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">{website.replace(/^https?:\/\//, '')}</a></span>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
