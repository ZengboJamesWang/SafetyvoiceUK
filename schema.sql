
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(50) PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('private', 'draft_generated', 'approved', 'published', 'rejected') DEFAULT 'private',
    role VARCHAR(100),
    institutionType VARCHAR(100),
    region VARCHAR(100),
    discipline VARCHAR(100),
    timeWindow VARCHAR(100),
    whatHappened TEXT,
    impact TEXT,
    improvement TEXT,
    consentPublish BOOLEAN DEFAULT FALSE,
    publishTitle VARCHAR(255),
    publishSummary TEXT,
    publishStory TEXT,
    anonymisationNotes TEXT,
    riskFlags TEXT,
    confidence VARCHAR(20),
    publishedAt DATETIME NULL,
    adminNotes TEXT
);
