
export enum SubmissionStatus {
  PRIVATE = 'private',
  DRAFT_GENERATED = 'draft_generated',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export interface SubmissionMetadata {
  role?: string;
  institutionType?: string;
  region?: string;
  discipline?: string;
  timeWindow?: string;
}

export interface RawSubmission extends SubmissionMetadata {
  whatHappened: string;
  impact: string;
  improvement: string;
  consentPublish: boolean;
}

export interface AnonymizedDraft {
  publishTitle: string;
  publishSummary: string;
  publishStory: string;
  anonymisationNotes: string[];
  riskFlags: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface SubmissionRecord extends RawSubmission, AnonymizedDraft {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  publishedAt?: string;
  adminNotes?: string;
  sanitisedText?: string;
}
