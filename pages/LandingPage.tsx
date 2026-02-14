
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Safety Enforcement, Dignity, and EDI in UK University Laboratories
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto font-normal">
            SafetyVoice UK (safetyvoice.org.uk) provides a platform for laboratory users across UK Higher Education Institutions (HEIs) to share experiences regarding safety enforcement and its impact on work, wellbeing, and dignity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/submit" className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors shadow-lg">
              Submit an Experience
            </Link>
            <Link to="/published" className="bg-slate-800 text-white border border-slate-700 px-8 py-3 rounded-md font-semibold hover:bg-slate-700 transition-colors">
              Read Published Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-slate-600 leading-relaxed font-normal">
        <section>
          <p>
            Safety is essential in UK laboratory environments, and effective enforcement plays a critical role in protecting people, facilities, and research integrity. At the same time, the processes through which safety enforcement is implemented can have broader implications for laboratory users’ ability to work confidently, effectively, and safely.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Why this matters</h2>
          <p>
            Safety enforcement decisions are typically made with the intention of protecting individuals and ensuring compliance with institutional and regulatory requirements. However, enforcement processes operate within complex organisational structures, and the lived experiences of laboratory users may vary depending on communication, consistency, and transparency.
          </p>
          <p>
            When safety enforcement actions are implemented without clear explanation, documentation, or opportunity for dialogue, they may unintentionally affect users’ ability to perform their work or understand the rationale behind decisions. Over time, this can influence not only operational efficiency, but also users’ confidence in institutional processes.
          </p>
          <p>
            Providing a constructive, independent channel for anonymised reflection via SafetyVoice UK can help identify patterns and opportunities for improvement while maintaining strong safety standards.
          </p>
        </section>

        <section className="space-y-4 bg-slate-50 p-8 rounded-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Institutional context and unconscious bias</h2>
          <p>
            Safety is a fundamental priority in UK university operations. At the same time, organisational structures may unintentionally create imbalances in how safety enforcement is experienced. Leadership and safety personnel carry responsibility for risk management, and their decisions are often made under pressure and with incomplete information.
          </p>
          <p>
            This does not imply intentional unfairness. Rather, it reflects the reality that institutional systems can evolve in ways that prioritise compliance, while the lived experiences of laboratory users may receive less visibility. Understanding these experiences constructively can help strengthen both safety and fairness.
          </p>
          <p>
            This perspective aligns with broader Equality, Diversity, and Inclusion (EDI) principles, which recognise that fairness involves not only policy design, but also how policies are experienced in practice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Purpose of SafetyVoice UK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">1</div>
              <p>Providing a constructive channel for UK laboratory users to submit experiences related to safety enforcement.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">2</div>
              <p>Generating anonymised drafts using secure AI processing to protect contributor privacy.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">3</div>
              <p>Identifying common themes or patterns across UK institutions to improve safety culture.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">4</div>
              <p>Contributing to a more transparent, respectful, and effective safety environment for all.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
