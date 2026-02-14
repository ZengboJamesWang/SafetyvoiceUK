
import { SubmissionRecord, SubmissionStatus } from '../types';

const DB_KEY = 'safetyvoice_db';

// Initial seed data
const SEED_DATA: SubmissionRecord[] = [
  {
    id: 'seed-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: SubmissionStatus.PUBLISHED,
    role: 'PhD Student',
    institutionType: 'Russell Group',
    discipline: 'Physics',
    region: 'North West',
    whatHappened: 'Safety officer cut the laser cooling tubes without warning.',
    impact: 'Flooded the table and ruined an expensive detector.',
    improvement: 'They should have asked the owner first.',
    consentPublish: true,
    publishTitle: 'Safety action causes lab flood',
    publishSummary: 'An intervention to cooling systems resulted in accidental damage to experimental equipment.',
    publishStory: '### What happened\nA safety intervention involved modifications to cooling lines without prior notification to the researchers.\n\n### Impact\nThis resulted in water damage to sensitive optical equipment and two weeks of downtime.\n\n### What would help\nEstablishing a mandatory "consultation phase" before utility lines are modified by facilities staff.',
    anonymisationNotes: ['Removed mention of laser brand', 'Generalized "safety officer"'],
    riskFlags: [],
    confidence: 'high',
    publishedAt: new Date(Date.now() - 86400000).toISOString()
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
      if (!response.ok) console.warn('MariaDB Sync failed, kept in local storage.');
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
