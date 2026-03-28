import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Safety Policies: Implementation, Enforcement, and Dignity in Research Environments
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed font-normal mb-10">
              SafetyVoice UK is a platform primarily serving UK Higher Education Institutions — and open to any research organisation, laboratory, or technical workplace — to share anonymised experiences of safety policy implementation or enforcement and its impact on work, wellbeing, and dignity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.hash = '/submit'} 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 transition shadow-xl shadow-slate-200"
              >
                Submit an Experience
              </button>
              <button 
                onClick={() => window.location.hash = '/published'} 
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
              >
                Read Published Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed font-normal mb-8">
              Safety is essential across UK Higher Education and the wider research sector. Effective enforcement plays a critical role in protecting people, facilities, and research integrity. At the same time, the <strong>processes through which safety policies are applied</strong> can have broader implications for laboratory users’ ability to work confidently, effectively, and safely.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Why this matters</h2>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              Decisions regarding <strong>safety oversight</strong> are typically made with the intention of protecting individuals and ensuring compliance with institutional and regulatory requirements. However, these processes operate within complex organisational structures, and the lived experiences of laboratory users may vary depending on communication, consistency, and transparency.
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-8">
              When <strong>compliance measures</strong> are carried out without clear explanation, documentation, or opportunity for dialogue, they may unintentionally affect users’ ability to perform their work or understand the rationale behind decisions. Over time, this can influence not only operational efficiency, but also users’ confidence in institutional processes.
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-8">
              Providing a constructive, independent channel for anonymised reflection via SafetyVoice UK can help identify patterns and opportunities for improvement across UK HEIs and beyond.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Institutional context and unconscious bias</h2>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              Safety is a fundamental priority in UK universities and across the broader research and technical sector. At the same time, organisational structures may unintentionally create imbalances in how <strong>safety governance</strong> is experienced. Leadership and safety personnel carry responsibility for risk management, and their decisions are often made under pressure and with incomplete information.
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              This does not imply intentional unfairness. Rather, it reflects the reality that institutional systems can evolve in ways that prioritise compliance, while the lived experiences of laboratory users may receive less visibility. Understanding these experiences constructively can help strengthen both safety and fairness.
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-12">
              This perspective aligns with broader Equality, Diversity, and Inclusion (EDI) principles, which recognise that fairness involves not only policy design, but also how policies are experienced in practice.
            </p>
          </div>

          {/* Purpose Steps */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">1</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Channel for Reflection</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Providing a constructive channel primarily for UK HEI laboratory users — and any research or technical professional — to submit experiences related to safety policy application.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">2</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">AI Anonymisation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Generating anonymised drafts using secure AI processing to protect contributor privacy and ensure institutional neutrality.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">3</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Thematic Analysis</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Identifying common themes and patterns across UK institutions and the wider research sector to improve safety culture.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">4</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Safety Culture</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Contributing to a more transparent, respectful, and effective safety environment for all stakeholders.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
