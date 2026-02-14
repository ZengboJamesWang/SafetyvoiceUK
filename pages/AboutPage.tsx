
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">About SafetyVoice UK</h1>
      <div className="text-slate-600 font-normal space-y-6 leading-relaxed text-lg">
        <p>
          SafetyVoice UK (safetyvoice.org.uk) is an independent initiative focusing on the intersection of laboratory safety enforcement, researcher dignity, and Equality, Diversity, and Inclusion (EDI) across the UK Higher Education sector.
        </p>
        
        <div className="bg-slate-900 text-white p-8 rounded-3xl my-12 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Project Lifecycle & UK Governance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <p className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Active Research Phase</p>
              <p className="text-xl font-bold">01/02/2026 — 31/01/2029</p>
              <p className="text-slate-400 leading-snug">The platform actively monitors and documents safety culture dynamics over a three-year longitudinal study period.</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Data Preservation Period</p>
              <p className="text-xl font-bold">10-Year Secure Archive</p>
              <p className="text-slate-400 leading-snug text-xs italic">In compliance with UKRI Common Principles on Research Data, all records are preserved until 31/01/2039 for auditing and secondary analysis.</p>
            </div>
          </div>
        </div>

        <p>
          The project addresses a critical gap in UK research culture: the qualitative experience of safety management. While Technical Services and Estates departments maintain rigorous compliance, the interpersonal and institutional methods of enforcement often remain undocumented.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">HEI Regulatory Context</h2>
            <p className="text-base">We operate within the framework of the <strong>UUK Concordat to Support Research Integrity</strong>, ensuring that our documentation supports a healthy, safe, and professional environment for all UK laboratory personnel.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Regional Reach</h2>
            <p className="text-base">SafetyVoice UK covers all ITL1 regions (Scotland, Wales, NI, and the 9 English regions), providing a truly representative picture of the UK research landscape.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-16 pt-8 border-t border-slate-100">UK Research Governance Alignment</h2>
        <ul className="space-y-6 text-base">
          <li className="flex items-start gap-4">
            <div className="mt-1 bg-green-500 rounded-full p-1"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
            <span><strong>Data Management (RDM):</strong> Full adherence to institutional Research Data Management policies regarding long-term storage and accessibility.</span>
          </li>
          <li className="flex items-start gap-4">
            <div className="mt-1 bg-green-500 rounded-full p-1"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
            <span><strong>Ethical Anonymisation:</strong> Multi-layered redaction ensures compliance with the Data Protection Act 2018 (UK GDPR) while preserving the research value of the experiences.</span>
          </li>
          <li className="flex items-start gap-4">
            <div className="mt-1 bg-green-500 rounded-full p-1"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
            <span><strong>Dignity at Work:</strong> Supporting UK HEI policies on professional conduct and the psychological safety of research staff and students.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
