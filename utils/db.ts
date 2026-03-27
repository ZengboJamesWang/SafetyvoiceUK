
import { SubmissionRecord, SubmissionStatus } from '../types';

const DB_KEY = 'safetyvoice_db';
const SEED_VERSION = '3';
const SEED_VERSION_KEY = 'safetyvoice_seed_v';

// Initial seed data
const SEED_DATA: SubmissionRecord[] = [
  {
    id: 'seed-1',
    createdAt: new Date(Date.now() - 86400000 * 62).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'Postdoctoral Researcher',
    institutionType: 'Russell Group University',
    discipline: 'Chemistry',
    region: 'South East',
    timeWindow: '1–6 months ago',
    whatHappened: 'I returned to the lab after a weekend to find that a key piece of equipment — a rotary evaporator I had been using daily for three months — had vanished from the bench. There was no note, no email, no ticket raised. I immediately assumed it had been stolen, filed an incident report with security, and spent two days retracing where it could have gone. I contacted colleagues across the building and even alerted the departmental administrator. It turned out that the facilities team had removed it for a scheduled PAT test. The test took four working days. Nobody had informed me, the lab manager, or the PI. A simple email the day before would have saved significant stress and lost research time.',
    impact: 'Two days were lost to the theft investigation. A further four days of experiments were delayed waiting for the equipment to return. My PhD student, who depended on that step for their synthesis, missed a group meeting deadline. The stress of believing equipment worth over £8,000 had been stolen was significant, and trust in the facilities communication process dropped noticeably across the group.',
    improvement: 'Facilities teams should be required to leave a notice on or near removed equipment at minimum, and ideally send a 48-hour advance email to the lab contact. A shared digital calendar of planned interventions would allow researchers to plan around them rather than be blindsided.',
    consentPublish: true,
    publishTitle: 'Equipment Removed Without Notice Triggers False Theft Report',
    publishSummary: 'A researcher returned after the weekend to find a critical piece of lab equipment missing with no explanation, triggering a security incident report before discovering it had been taken for routine electrical testing.',
    publishStory: '### What happened\nA researcher returned to their laboratory after a weekend break to find that a key piece of equipment — used daily for a core synthesis step — had been removed from its assigned position. No note had been left, no email had been sent, and no maintenance ticket had been raised in the shared system. Believing the equipment had been stolen, the researcher filed a formal security incident report and spent two working days investigating its whereabouts. The equipment had in fact been removed by the facilities team for a scheduled portable appliance test, a routine procedure that took four working days to complete.\n\n### Impact\nThe false alarm consumed two full working days and caused significant stress. Dependent experimental work was delayed by four days, causing a PhD student in the same group to miss a progress deadline. Trust in the internal communication processes of the facilities department declined among the research group.\n\n### What would help\nFacilities teams should be required to leave a physical notice at the point of removal and send advance notification — ideally 48 hours prior — to the laboratory contact or principal investigator. A shared, searchable calendar of planned equipment interventions would allow researchers to reschedule around them rather than be blindsided by unexplained absences.',
    anonymisationNotes: ['Equipment type generalised to "rotary evaporator" — no brand or serial mentioned', 'Building and floor references removed', 'Researcher identity and group affiliation removed'],
    riskFlags: [],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 58).toISOString()
  },
  {
    id: 'seed-2',
    createdAt: new Date(Date.now() - 86400000 * 54).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'Research Fellow',
    institutionType: 'Russell Group University',
    discipline: 'Electronic Engineering',
    region: 'Wales',
    timeWindow: '1–6 months ago',
    whatHappened: 'A safety officer identified that a signed acknowledgement page from the laser safety logbook had not been returned to the department office. No written notice was issued. The equipment owner — who was contactable and working in the building that day — was not informed at any point before, during, or after the intervention. Three physical actions were carried out on the same day without any communication: the mains power cable to the laser system was cut, the wall-mounted safety interlock panel was removed entirely, and the laser housing was secured with a padlock. The equipment owner discovered all three actions only upon returning to the workbench and finding a handwritten note. At least two other laboratories in the same building operating class 3B and class 4 laser systems received no equivalent action despite comparable administrative circumstances.',
    impact: 'The laser system was offline for eleven working days while the power cable was replaced by an external contractor, a new interlock panel was requisitioned, and access to the padlock was arranged. A time-sensitive characterisation study for a funded project was delayed and a co-authored manuscript submission was postponed. The complete absence of prior communication — no email, no phone call, no written notice — meant the equipment owner had no opportunity to resolve a simple administrative matter before irreversible physical damage was done. Colleagues asked what had happened, creating a sense of public stigma. The experience left the researcher feeling that reporting the incident would lead to further disproportionate consequences.',
    improvement: 'No physical intervention on research equipment should take place without prior written notification to the equipment owner, regardless of the nature of the compliance issue. A simple email or written notice giving a short resolution window would have resolved this matter entirely without any disruption. Safety non-compliance should follow a graduated process: written notice, then dialogue, then proportionate escalation only if unresolved. Destructive actions such as cutting cables must require documented senior management approval. Enforcement must be applied consistently across all comparable facilities.',
    consentPublish: true,
    publishTitle: 'Triple-Lock Shutdown With No Notice to Equipment Owner: Cable Cut, Panel Removed, System Padlocked',
    publishSummary: 'A researcher\'s laser system was physically shut down through three simultaneous interventions — including a cut power cable — with no written notice issued and the equipment owner not informed at any stage, while neighbouring labs with equivalent systems were left untouched.',
    publishStory: '### What happened\nA safety officer identified an outstanding administrative item: a signed acknowledgement from a laser safety logbook had not been returned to the department office. No written notification was issued and the equipment owner — who was present and contactable in the building — was not informed at any point. Without any prior communication, three physical actions were carried out on the same day: the mains power cable to the laser system was cut, the wall-mounted safety interlock panel was removed entirely, and the laser housing was secured with a padlock. The equipment owner discovered all three actions upon returning to the workbench. At least two other laboratories in the same building operating class 3B and class 4 laser systems had no equivalent action taken against them despite comparable administrative circumstances.\n\n### Impact\nThe laser system was offline for eleven working days. A funded characterisation study was delayed and a co-authored manuscript submission was postponed. The complete absence of prior notice meant a straightforward administrative matter caused irreversible physical damage to equipment and significant research disruption. The visible nature of the intervention prompted questions from colleagues and generated a sense of public stigma. The researcher felt unable to raise the incident formally due to concern about further disproportionate response.\n\n### What would help\nNo physical intervention on research equipment should proceed without prior written notification to the equipment owner. A single email or written notice with a short resolution window would have resolved this matter without any disruption whatsoever. Safety non-compliance should be managed through a graduated process: written notice first, then dialogue, then proportionate escalation only if unresolved. Destructive actions such as cutting power cables must require documented approval from senior management. Enforcement must be applied consistently across all comparable facilities.',
    anonymisationNotes: ['Laser class described generically', 'Building and department location removed', 'Equipment owner identity and role generalised', 'Presence in building on the day retained as central to the lack-of-notification argument'],
    riskFlags: ['Possible differential enforcement — comparable labs not treated equivalently'],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 50).toISOString()
  },
  {
    id: 'seed-3',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'PhD Student',
    institutionType: 'Russell Group University',
    discipline: 'Chemistry',
    region: 'West Midlands',
    timeWindow: '6–12 months ago',
    whatHappened: 'A routine annual safety inspection was being carried out on our floor. Without any advance notice to the lab, an inspector switched off the main extract control for our fume hoods as part of a test. At that moment I had an active reflux running inside one of them — a multi-step synthesis I had been building towards for six weeks. The fume hood fan stopping caused the temperature inside to rise and the reaction atmosphere to change. By the time I noticed the airflow warning light and understood what was happening, the reaction had progressed to a point I could not safely reverse. The batch was lost. I later found out the inspector had been given a schedule of labs to inspect but had not been required to notify individual researchers before conducting live tests on extract systems.',
    impact: 'Six weeks of synthesis work was lost in under twenty minutes. The chemicals consumed had an estimated replacement cost of several hundred pounds from a grant-funded budget. I had to restart from an earlier intermediate, adding approximately three weeks to my experimental timeline. I was already behind schedule due to equipment downtime earlier in the year. My supervisor was understanding, but the pressure of the setback on my overall PhD timeline was significant.',
    improvement: 'Inspectors testing live ventilation systems in working laboratories must be required to confirm that no active experiments are running before conducting tests that interrupt airflow. A simple knock-and-confirm process, or a prior email the morning of the inspection, would prevent this entirely. Research laboratories are not empty offices — unannounced system tests in active environments carry real experimental and safety risk.',
    consentPublish: true,
    publishTitle: 'Unannounced Fume Hood Test Destroys Six Weeks of Synthesis Work',
    publishSummary: 'A safety inspector cut extract power to a laboratory fume hood during a routine test without checking whether active experiments were running, resulting in the loss of a six-week chemical synthesis.',
    publishStory: '### What happened\nDuring a routine safety inspection, an inspector disabled the extract ventilation system serving a laboratory\'s fume hoods as part of a live airflow test. No notification had been given to the researchers working in the space. A researcher had an active multi-step synthesis running under reflux inside one of the affected fume hoods at the time. The loss of airflow caused a change in reaction conditions. By the time the researcher identified the cause, the synthesis had been irreversibly compromised.\n\n### Impact\nSix weeks of preparatory synthesis work was lost. The cost of the consumed reagents was charged against a research grant budget. Restarting from an earlier intermediate added an estimated three weeks to the researcher\'s experimental programme, compounding an already delayed schedule and increasing pressure on the overall PhD timeline.\n\n### What would help\nInspectors conducting live tests on building systems — including ventilation, gas, electrical, and water — in active research spaces must be required to confirm that no time-sensitive or hazardous processes are in progress before proceeding. A brief verbal check or a same-day advance notice to the laboratory contact would be sufficient in most cases. Scheduling inspection activities outside of core working hours should be considered where active use is likely. Research environments are not comparable to unoccupied office spaces, and testing protocols should reflect this.',
    anonymisationNotes: ['Specific reaction chemistry and reagents removed', 'Floor and building location removed', 'Supervisor not identified'],
    riskFlags: [],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 41).toISOString()
  },
  {
    id: 'seed-4',
    createdAt: new Date(Date.now() - 86400000 * 36).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'PhD Student',
    institutionType: 'Post-92 University',
    discipline: 'Biology / Life Sciences',
    region: 'Scotland',
    timeWindow: '1–6 months ago',
    whatHappened: 'I was sitting at a desk in the data analysis bay adjacent to our wet laboratory — a separate, clearly defined write-up area with no chemical or biological hazards present — when a safety officer entered and stopped in front of me. In a loud voice, in front of four colleagues and two visiting students, they informed me that I was in violation of PPE policy for not wearing safety glasses. I explained that I was in the write-up area, not the laboratory. They responded that "the boundary is not always clear" and issued me a formal written warning on the spot. The same officer regularly passes through the main wet lab area without comment when the principal investigator — a full professor — is working without eye protection. I have observed this on multiple occasions and so have others in the group.',
    impact: 'The public nature of the interaction was deeply humiliating. I felt singled out and undermined in front of peers and visitors. I am in the first year of my PhD and the incident affected my confidence in the laboratory environment for several weeks. Two of my colleagues later told me they had witnessed the same officer ignoring identical behaviour from senior staff on multiple occasions. The incident created a culture of low-level resentment in our group towards safety enforcement, which is counterproductive to genuine safety culture.',
    improvement: 'PPE enforcement should be consistent regardless of the seniority or professional standing of the individual. If a boundary between write-up and laboratory space is genuinely ambiguous, the correct response is to clarify signage and zoning, not to issue a public reprimand. Formal warnings should not be issued as a first response — a quiet, private conversation is always preferable where there is no immediate danger. Safety culture is built on trust and consistency, not public shame.',
    consentPublish: true,
    publishTitle: 'Public PPE Reprimand in Write-Up Area; Senior Staff Ignored',
    publishSummary: 'A first-year PhD student received a formal public warning for not wearing safety glasses in a designated write-up area, while the same officer repeatedly overlooked identical behaviour from a senior professor in the adjacent wet laboratory.',
    publishStory: '### What happened\nA researcher working in a designated write-up area — a space with no chemical or biological hazards — was publicly challenged by a safety officer for not wearing safety eye protection. The reprimand was issued verbally and at volume in front of several colleagues and visiting students, followed immediately by a formal written warning. The researcher had not entered the laboratory space. The same safety officer was observed on multiple occasions by different members of the group passing through the active wet laboratory without comment when a senior academic was present and not wearing eye protection.\n\n### Impact\nThe public nature of the interaction caused significant distress to the researcher, who was in the early stage of their doctoral programme. Their confidence in the laboratory environment was affected for several weeks. The perceived inconsistency in enforcement — visible to the whole group — generated resentment and undermined the credibility of safety governance rather than reinforcing it.\n\n### What would help\nPPE policy must be applied consistently and without regard to seniority. Where zoning between write-up and laboratory space is genuinely unclear, the solution is improved signage and physical demarcation — not enforcement action against individuals. Formal warnings should never be a first response in the absence of immediate risk; a quiet, private conversation is almost always more effective and less damaging. Safety culture depends on perceived fairness. Selective enforcement does more harm than good.',
    anonymisationNotes: ['Institution and department removed', 'Seniority described generically', 'No identifying details of the safety officer retained'],
    riskFlags: ['Possible differential enforcement by seniority'],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 32).toISOString()
  },
  {
    id: 'seed-5',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'Technical Staff / Technician',
    institutionType: 'Russell Group University',
    discipline: 'Chemistry',
    region: 'North West',
    timeWindow: '6–12 months ago',
    whatHappened: 'A safety officer identified what they described as a potential electrical fault near the shared NMR spectrometer in our facility. Without contacting the instrument manager, the departmental safety lead, or any of the research groups with active samples in the instrument, they powered down the machine completely and placed an "out of service" notice on it. The fault turned out to be a cable tie that had melted slightly against a warm surface — a cosmetic issue with no functional risk. The spectrometer remained offline for nine days while the university\'s estates team formally assessed and cleared it. During this time, samples from four research groups — including two containing biomaterials collected from clinical donors — were lost because the field could not be maintained and the cryogen had not been topped up in preparation for a planned shutdown.',
    impact: 'The loss of clinically sourced samples was irreversible. Two groups had to formally notify their ethics committees of the sample loss. The nine-day shutdown delayed multiple groups\' work and affected two manuscript submissions. The instrument manager, who was available and contactable at the time, was not consulted before the shutdown. The decision to power down was made by someone without specialist training in NMR systems, which itself introduced additional risk during the unplanned shutdown.',
    improvement: 'Decisions to shut down specialist shared research infrastructure — particularly systems with in-progress samples or cryo-dependent components — must require consultation with a named instrument manager or technical lead before any action is taken. A rapid-response escalation protocol should be in place for genuine emergencies, but this should be clearly distinct from precautionary action for low-risk observations. Proportionality must be built into the decision-making process.',
    consentPublish: true,
    publishTitle: 'Unilateral NMR Shutdown Over Cable Tie Causes Loss of Clinical Samples',
    publishSummary: 'A safety officer powered down a shared NMR spectrometer without consulting the instrument manager, citing a minor surface marking on a cable tie. Nine days of downtime led to the irreversible loss of clinically donated samples across four research groups.',
    publishStory: '### What happened\nA safety officer identified a superficial marking on a cable tie near shared analytical instrumentation and classified it as a potential electrical fault. Without informing the instrument manager, the departmental safety lead, or any of the affected research groups, the instrument was powered down immediately and placed out of service. The cause was subsequently confirmed to be cosmetic and non-functional. The instrument remained offline for nine days pending a formal estates assessment. During this period, samples from multiple research groups — including irreplaceable materials collected from clinical donors — were lost due to the unplanned shutdown.\n\n### Impact\nThe loss of clinically sourced samples was permanent and required formal notification to the relevant ethics committees. Two manuscript submissions were delayed. The instrument manager, who was available and contactable at the time of the decision, was not consulted. The decision to shut down a specialist cryogenic system was made without the technical expertise required to do so safely, introducing additional risk in the process.\n\n### What would help\nShutdown decisions for specialist shared infrastructure — particularly cryogenic, biological containment, or high-value analytical systems — must require documented consultation with a named technical lead before action is taken, except in cases of immediate and serious danger. A clear distinction should exist between emergency shutdown protocols and precautionary responses to low-risk observations. Proportionality and reversibility must be explicit criteria in safety decision-making frameworks.',
    anonymisationNotes: ['Instrument type described generically as NMR', 'Department and building removed', 'Researcher group names removed', 'Clinical nature of samples retained as it is central to the impact narrative'],
    riskFlags: ['Loss of ethically approved clinical samples — may require separate institutional review'],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 24).toISOString()
  },
  {
    id: 'seed-6',
    createdAt: new Date(Date.now() - 86400000 * 19).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'PhD Student',
    institutionType: 'Post-92 University',
    discipline: 'Engineering',
    region: 'Yorkshire and the Humber',
    timeWindow: '1–6 months ago',
    whatHappened: 'I identified a faulty gas line connector in our workshop that I believed posed a genuine near-miss risk. Following the guidance in our safety handbook, I submitted a formal near-miss report through the departmental online system. Within 48 hours of submitting the report, my access card was deactivated. I received a brief automated email stating my access was "suspended pending a safety review." No one contacted me to explain what the review would involve, how long it would take, or what I needed to do. I heard nothing for six weeks. I was unable to access the equipment central to my third-year project. I eventually received access back after a meeting with my supervisor and the safety manager, but no explanation was ever given for the suspension or the delay. Other students and staff who had not submitted reports continued to access the workshop throughout.',
    impact: 'The six-week suspension effectively halted my experimental programme during a critical project phase. I lost access to equipment I needed for fabrication work that could not be substituted. My annual review, which had been scheduled during this period, had to be deferred. The experience made me deeply reluctant to submit any future safety reports. I have spoken to several peers who had heard about what happened to me and said they would not report a safety issue as a result. The chilling effect on near-miss reporting in my peer group was tangible.',
    improvement: 'Near-miss reporting must not — under any circumstances — result in access suspension for the reporter without clear, documented justification and an immediate personal communication. If a review of a reporter\'s own safety practices is warranted, it must be explained to them directly, with a defined timeline and clear criteria for resolution. The process must be transparent and not feel punitive. Institutions should actively monitor whether safety report submission correlates with access or employment changes for the reporter, as this is a significant indicator of a broken safety culture.',
    consentPublish: true,
    publishTitle: 'Near-Miss Report Filed; Lab Access Suspended 48 Hours Later',
    publishSummary: 'A researcher who submitted a formal near-miss safety report lost workshop access within two days, with no explanation provided for six weeks. The experience deterred others in the research group from reporting safety concerns.',
    publishStory: '### What happened\nA researcher identified a potentially hazardous fault in shared workshop equipment and submitted a formal near-miss report through their institution\'s safety system, as instructed by departmental guidance. Within 48 hours, their building access was suspended with a brief automated notification citing a "pending safety review." No further communication was received for six weeks. During this period, the researcher was unable to access the equipment central to their doctoral project. Other members of the group retained full access throughout. When access was eventually restored, no explanation was provided for either the suspension or its duration.\n\n### Impact\nThe suspension coincided with a critical phase of the researcher\'s experimental programme and required deferral of a scheduled annual progress review. The experience led the researcher to resolve not to submit future safety reports. Several peers, upon learning of the situation, stated they would not report safety concerns either. The resulting reduction in near-miss reporting represents a systemic risk to the laboratory environment beyond the immediate case.\n\n### What would help\nSubmitting a safety report must not result in access suspension or adverse consequences for the reporter without explicit documented justification and immediate personal communication. Where a review of an individual\'s own safety practices is warranted, this must be explained directly to them with a clear timeline and defined resolution criteria. Institutions should audit whether safety reporting correlates with any form of access restriction or employment impact for reporters — this is a foundational indicator of safety culture health.',
    anonymisationNotes: ['Equipment type described generically', 'Department and building removed', 'Academic year and specific project details removed'],
    riskFlags: ['Possible retaliatory response to safety reporting — EDI and whistleblowing policy implications'],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'seed-7',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'Research Fellow',
    institutionType: 'Independent Research Institute',
    discipline: 'Materials Science',
    region: 'East Midlands',
    timeWindow: '1–3 years ago',
    whatHappened: 'A label on a secondary chemical container in my storage area had faded to the point where it was partially illegible — the chemical name was still readable but the hazard pictograms had degraded. I acknowledged this when it was flagged during an inspection and indicated I would replace the label the same day. Instead of accepting this, the safety officer escalated the matter to my line manager and the departmental safety committee. The outcome was a requirement that I attend the Level 1 laboratory induction course — a half-day session designed for first-year undergraduates with no prior laboratory experience. The session was scheduled for the following week and was held in a room with approximately 25 first-year students. I was the only postdoctoral-level attendee. I have fifteen years of laboratory experience across three countries, hold a relevant professional qualification, and at the time was supervising two PhD students. Several of my students and first-year undergraduates who knew me were present.',
    impact: 'The professional humiliation of attending a first-year induction in a room of students I would encounter professionally — including some I was supervising — was significant and lasting. The incident was discussed within our department and I received comments from peers for some time afterwards. My confidence in engaging with the safety management system was severely damaged. I began to self-censor any acknowledgement of minor non-compliance in subsequent inspections, and I am aware that others in similar positions adopted the same approach. The response was entirely disproportionate to a degraded label on a container that was still identifiable.',
    improvement: 'Remediation for minor administrative non-compliance should be proportionate and private. A conversation, a written reminder, or at most a brief targeted briefing is appropriate for experienced staff. Mandatory attendance at introductory training designed for complete novices should never be used as a disciplinary measure for professionals. Disproportionate responses to minor infractions damage the credibility of the safety function and create a culture of concealment rather than transparency.',
    consentPublish: true,
    publishTitle: 'Senior Researcher Required to Attend First-Year Induction Over Faded Label',
    publishSummary: 'A research fellow with fifteen years of laboratory experience was required to attend a Level 1 undergraduate induction course — alongside students they supervised — after a chemical container label had faded during storage.',
    publishStory: '### What happened\nDuring a routine inspection, a safety officer identified a secondary chemical container whose hazard label had degraded to the point where the pictograms were partially illegible, though the chemical name remained readable. The researcher acknowledged the issue and offered to replace the label immediately. Rather than accepting this, the officer escalated to line management and the departmental safety committee. The resulting action required the researcher — a postdoctoral-level professional with fifteen years of experience across multiple institutions and a relevant professional qualification — to attend a Level 1 laboratory induction session. The session was designed for first-year undergraduates with no prior laboratory experience. It was held in a shared teaching space with approximately 25 first-year students, some of whom were supervised by the researcher.\n\n### Impact\nThe professional impact was significant and enduring. The researcher experienced a loss of professional standing within their department and received comments from peers for an extended period. Their willingness to acknowledge minor non-compliance in future inspections was severely reduced, and they are aware that colleagues in comparable positions adopted the same stance. The safety function\'s credibility — its ability to create an open, trust-based reporting culture — was damaged by the perceived disproportionality of the response.\n\n### What would help\nRemediation for minor administrative non-compliance must be proportionate to the risk presented and the experience of the individual. A private conversation or written reminder is appropriate in almost all such cases. Mandatory participation in introductory training designed for complete novices should not be deployed as a corrective measure for experienced professionals. Disproportionate responses, particularly those that carry a social cost, incentivise concealment over transparency and are antithetical to genuine safety culture.',
    anonymisationNotes: ['Institution type generalised', 'Number of years experience retained as relevant to proportionality argument', 'Country references removed', 'Professional qualification type removed', 'No identifying details of safety officer or line manager retained'],
    riskFlags: [],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

/**
 * PRODUCTION NOTE: 
 * In a real production environment on Hostinger, 
 * these methods would be replaced with `fetch('/api/...')` calls 
 * to the Express/Node.js backend which communicates with MariaDB.
 */
export const db = {
  getAll(): SubmissionRecord[] {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    if (storedVersion !== SEED_VERSION) {
      // Seed has been updated — preserve any real user submissions, replace seed records
      const existing: SubmissionRecord[] = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
      const userSubmissions = existing.filter(r => !r.id.startsWith('seed-'));
      const merged = [...SEED_DATA, ...userSubmissions];
      localStorage.setItem(DB_KEY, JSON.stringify(merged));
      localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      return merged;
    }
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(data);
  },

  getPublished(): SubmissionRecord[] {
    return this.getAll().filter(s => s.status === SubmissionStatus.PUBLISHED);
  },

  async save(record: Omit<SubmissionRecord, 'id' | 'createdAt'>): Promise<SubmissionRecord> {
    // 1. Save to Local for immediate UI feedback
    const all = this.getAll();
    const newRecord: SubmissionRecord = {
      ...record,
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    all.push(newRecord);
    localStorage.setItem(DB_KEY, JSON.stringify(all));

    // 2. Production Bridge: Attempt to send to MariaDB backend if available
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.draft) {
          const updatedRecord = { ...newRecord, ...result.draft, status: SubmissionStatus.DRAFT_GENERATED };
          const all = this.getAll();
          const index = all.findIndex(s => s.id === newRecord.id);
          if (index !== -1) {
            all[index] = updatedRecord;
            localStorage.setItem(DB_KEY, JSON.stringify(all));
            return updatedRecord;
          }
        }
      } else {
        console.warn('MariaDB Sync failed, kept in local storage.');
      }
    } catch (e) {
      console.log('Running in local-only mode.');
    }

    return newRecord;
  },

  updateStatus(id: string, status: SubmissionStatus): void {
    const all = this.getAll();
    const index = all.findIndex(s => s.id === id);
    if (index !== -1) {
      all[index].status = status;
      if (status === SubmissionStatus.PUBLISHED) {
        all[index].publishedAt = new Date().toISOString();
      }
      localStorage.setItem(DB_KEY, JSON.stringify(all));
      
      // Optional: Sync status update to MariaDB
      fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }).catch(() => {});
    }
  }
};
