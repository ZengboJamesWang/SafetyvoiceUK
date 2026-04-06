import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Safety Enforcement, EDI, and Professional Dignity
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed font-normal mb-10">
              SafetyVoice UK is an independent platform for laboratory users to <strong>raise their voice</strong> and document how enforcement processes can impact professional dignity and reveal EDI barriers. We help bridge the gap between technical compliance and an inclusive research culture.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.hash = '/submit'} 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 transition shadow-xl shadow-slate-200"
              >
                Share Your Experience
              </button>
              <button 
                onClick={() => window.location.hash = '/published'} 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
              >
                View Published Reports
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
              Safety is a fundamental priority across the research and technical sector. However, the processes through which policies are enforced are not always neutral. When enforcement actions are carried out without considering personal dignity or <strong>Equality, Diversity, and Inclusion (EDI)</strong>, they can unintentionally become barriers to research and professional growth.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Addressing the "Blind Spots"</h2>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              Decisions regarding safety oversight are typically made with the intention of protecting individuals. Yet, within complex organisational structures, <strong>unconscious bias</strong> can lead to disproportionate enforcement that marginalises certain staff and students. 
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-8">
              When interventions occur without clear explanation or opportunity for dialogue, they can damage a user’s professional standing and confidence. SafetyVoice UK provides a constructive channel to identify these patterns, ensuring that protecting the lab does not mean compromising the person.
            </p>

            {/* Critical Message Section */}
            <div className="my-16 p-8 bg-red-50 border-l-4 border-red-500 rounded-r-2xl">
              <h2 className="text-2xl font-bold text-red-900 mb-4">The Risk of Unchecked Enforcement</h2>
              <p className="text-red-800 leading-relaxed font-medium mb-4">
                Without robust protocols and clear mechanisms for laboratory users to raise their concerns, safety enforcement can unintentionally facilitate <strong>discriminatory practices</strong>.
              </p>
              <p className="text-red-700 text-sm leading-relaxed">
                In the absence of accountability, enforcement personnel may exercise their authority inconsistently—treating some staff with significantly more rigour than others under the guise of "safety." This lack of a proper voice mechanism allows EDI issues to grow undetected, as disproportionate treatment is often shielded from scrutiny by the technical nature of safety compliance.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Institutional Context and Safety Governance</h2>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              Leadership and safety personnel carry significant responsibility for risk management, often making decisions under immense pressure and a focus on preventing errors. In this high-stakes environment, a natural concern for safety can unintentionally mask <strong>unconscious bias</strong> in how rules are applied across different groups.
            </p>
            <p className="text-slate-600 leading-relaxed font-normal mb-6">
              By documenting these lived experiences constructively, we help institutions see beyond the "safety manual" to the actual impact on their workforce. This perspective is essential for genuine EDI, recognising that fairness involves not only the design of a policy, but how it is experienced in practice.
            </p>
          </div>

          {/* Purpose Steps */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">1</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Raising Your Voice</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Providing a secure channel for UK research and technical professionals to submit experiences where enforcement has impacted dignity or fairness.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">2</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Anonymised Advocacy</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Using Gemini 3 Flash to transform raw reports into professional, anonymised narratives that protect identities while highlighting systemic issues.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">3</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Identifying Bias</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Analysing themes to reveal where unconscious bias in leadership leads to inconsistent or disproportionate safety interventions.</p>
              </div>
            </div>
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-200/50 z-0">4</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cultural Change</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Advocating for a more transparent and respectful safety environment that aligns technical compliance with institutional EDI goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
