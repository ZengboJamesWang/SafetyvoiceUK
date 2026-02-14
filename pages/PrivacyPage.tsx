
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Privacy, Anonymisation & Data Management</h1>
      
      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200 mb-12 shadow-sm">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          10-Year UK Research Archival Policy
        </h2>
        <p className="text-sm text-amber-800 leading-relaxed font-medium">
          In strict accordance with <strong>UKRI (UK Research and Innovation)</strong> guidelines and <strong>UK HEI Research Data Management</strong> standards, all raw and processed project data from the 2026–2029 active phase will be <strong>archived and preserved for 10 years</strong> post-completion (until January 2039). This ensures data integrity, supports longitudinal audits, and complies with standard UK research funding requirements.
        </p>
      </div>

      <div className="space-y-12 text-slate-700 leading-relaxed">
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">UK GDPR & Data Protection Act 2018</h2>
          <p className="mb-4">
            The processing of personal data on this platform is conducted under the legal basis of "Public Interest" (Research purposes) as defined by UK GDPR. While we collect role and regional data to ensure statistical accuracy, your identity is never intentionally associated with published content.
          </p>
          <ul className="list-disc pl-6 space-y-3 font-normal text-sm">
            <li><strong>Right to Erasure:</strong> During the active project phase (2026–2029), you may request the deletion of your raw record by contacting the administrators with your unique submission ID.</li>
            <li><strong>Data Limitation:</strong> We only collect data necessary to understand the safety context (role, region, discipline).</li>
            <li><strong>Anonymisation by Design:</strong> Once a story is published, it is considered "fully anonymised" and no longer falls under the definition of Personal Data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">The SafetyVoice Anonymisation Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-slate-400 font-bold mb-2">Step 1</span>
              <h3 className="font-bold text-slate-900 mb-2">Local Redaction</h3>
              <p className="text-xs">Initial server-side regex scripts strip emails, phones, and common identifiers from the text immediately upon submission.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-slate-400 font-bold mb-2">Step 2</span>
              <h3 className="font-bold text-slate-900 mb-2">Gemini AI Rewriting</h3>
              <p className="text-xs">Advanced AI (Google Gemini) generates a third-person narrative, abstracting specific equipment and buildings into generic categories.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-slate-400 font-bold mb-2">Step 3</span>
              <h3 className="font-bold text-slate-900 mb-2">Expert Review</h3>
              <p className="text-xs">A human moderator reviews the AI draft to ensure zero residual risk of identification before manual publication.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Secure Storage & Disposal</h2>
          <p>
            Raw data is stored in a partitioned environment with strict access controls. Access is limited to the Principal Investigator and designated Lead Moderators. Following the 10-year archival period in 2039, all raw digital records will be permanently purged in accordance with institutional data destruction protocols.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
