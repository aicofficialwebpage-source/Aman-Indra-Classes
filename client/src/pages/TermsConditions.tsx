import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  const phone = '+91 91400 64194';
  const email = 'aicofficialwebpage@gmail.com';
  const address = 'Ratanlal Nagar Main Road, High Income Grade, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Kanpur, Uttar Pradesh – 208022';
  const website = 'https://amanindraclasses-official.vercel.app';

  useEffect(() => {
    document.title = 'Terms & Conditions - Aman Indra Classes';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-emerald-950 py-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-5 rounded-full mb-3">
            Institutional Agreement
          </span>
          <h1 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4 flex items-center justify-center gap-2">
            <FileText size={32} className="text-brand-accent stroke-[2]" />
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-8 md:p-12 shadow-sm text-slate-700 dark:text-slate-200 leading-relaxed text-xs md:text-sm flex flex-col gap-8 transition-colors duration-300">
          
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              1. Agreement & Acceptance
            </h2>
            <p>
              Welcome to Aman Indra Classes ("AIC", "we", "our", or "us").
            </p>
            <p>
              These Terms & Conditions govern the use of our website, admission inquiries, scholarship examinations, classroom programs, study materials, and educational services.
            </p>
            <p>
              By accessing our website, submitting inquiries, registering for examinations, or enrolling in any course offered by Aman Indra Classes, you agree to be bound by these Terms & Conditions.
            </p>
            <p>
              If you do not agree with any part of these terms, please discontinue use of our website and services.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              2. Admission & Enrollment
            </h2>
            <p>
              Enrollment in any course is subject to availability, eligibility requirements, and institute policies.
            </p>
            <p>
              Students and parents must provide accurate and complete information during registration and admission processes.
            </p>
            <p>
              The institute reserves the right to reject or cancel admissions where false, misleading, or incomplete information has been provided.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              3. Aman Indra Scholarship Test (AIST)
            </h2>
            <p>
              The Aman Indra Scholarship Test (AIST) is conducted to identify and reward deserving students.
            </p>
            <p>By participating:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>All information submitted must be accurate and genuine.</li>
              <li>Scholarship benefits are non-transferable.</li>
              <li>Scholarship amounts and fee concessions are determined solely by the institute.</li>
              <li>Examination rules must be strictly followed.</li>
              <li>Any form of cheating, impersonation, or misconduct may result in immediate disqualification.</li>
            </ul>
            <p className="mt-2">
              The institute reserves the right to modify examination schedules, eligibility criteria, and scholarship policies without prior notice.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              4. Academic Policies
            </h2>
            <p>To maintain academic standards:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Students are expected to attend classes regularly.</li>
              <li>Participation in tests, assessments, and academic activities may be mandatory.</li>
              <li>Students must follow instructions issued by faculty members and administrators.</li>
              <li>Academic progress may be monitored through periodic evaluations.</li>
            </ul>
            <p className="mt-2">
              Batch allocations, schedules, and academic groupings may be revised based on performance, administrative requirements, or academic planning.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              5. Student Conduct
            </h2>
            <p>Students are expected to maintain discipline and respectful behavior at all times.</p>
            <p>The following actions may result in disciplinary action, suspension, or termination:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Misconduct or disruptive behavior.</li>
              <li>Harassment of students, faculty, or staff.</li>
              <li>Damage to institute property.</li>
              <li>Use of unfair means during examinations.</li>
              <li>Activities that negatively affect the learning environment.</li>
            </ul>
            <p className="mt-2">
              Parents or guardians may be held responsible for damages caused by enrolled students.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              6. Study Material & Intellectual Property
            </h2>
            <p>All educational materials provided by Aman Indra Classes, including:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Notes</li>
              <li>Worksheets</li>
              <li>Test Papers</li>
              <li>Question Banks</li>
              <li>Study Modules</li>
              <li>Graphics</li>
              <li>Logos</li>
              <li>Website Content</li>
            </ul>
            <p className="mt-2">are the intellectual property of Aman Indra Classes.</p>
            <p>
              Students and users may not copy, reproduce, distribute, publish, upload, or commercially use such materials without prior written permission.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              7. Fees, Payments & Refunds
            </h2>
            <p>Course fees and payment schedules will be communicated during enrollment.</p>
            <p>Students and parents are responsible for timely payment of all applicable fees.</p>
            <p>Unless otherwise stated in writing by the institute:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Fees paid are generally non-refundable after commencement of classes.</li>
              <li>Fee concessions and scholarships are subject to eligibility requirements.</li>
              <li>Failure to pay fees may result in suspension of services or enrollment.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              8. Schedule Changes
            </h2>
            <p>The institute reserves the right to modify:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Class Timings</li>
              <li>Faculty Assignments</li>
              <li>Test Schedules</li>
              <li>Academic Calendars</li>
              <li>Batch Structures</li>
            </ul>
            <p className="mt-2">whenever necessary for academic or administrative reasons.</p>
            <p>Reasonable efforts will be made to communicate important changes in advance.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              9. Limitation of Liability
            </h2>
            <p>
              Aman Indra Classes provides educational guidance and academic support to help students achieve their goals.
            </p>
            <p>However, we do not guarantee:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Examination ranks</li>
              <li>Board results</li>
              <li>Competitive examination selections</li>
              <li>Admissions to any institution</li>
            </ul>
            <p className="mt-2">
              Academic success depends on the student's efforts, attendance, preparation, and performance.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              10. Website Usage
            </h2>
            <p>Users agree not to:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
              <li>Attempt unauthorized access to website systems.</li>
              <li>Upload malicious software or harmful content.</li>
              <li>Interfere with website functionality.</li>
              <li>Use the website for unlawful purposes.</li>
            </ul>
            <p className="mt-2">We reserve the right to restrict access to users who violate these terms.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              11. Governing Law
            </h2>
            <p>
              These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.
            </p>
            <p>
              Any dispute arising from the use of our services shall be subject to the jurisdiction of the competent courts located in Kanpur, Uttar Pradesh.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white border-b border-slate-100 dark:border-emerald-900/50 pb-2">
              12. Contact Information
            </h2>
            <p>For questions regarding these Terms & Conditions, please contact:</p>
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

export default TermsConditions;
