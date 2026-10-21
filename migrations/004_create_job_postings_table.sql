-- ========================================================
-- Migration: 004_create_job_postings_table.sql
-- Description: Creates the job_postings table based on ddd.md
-- ========================================================

CREATE TABLE IF NOT EXISTS job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    posted_by INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote') NOT NULL DEFAULT 'Full-time',
    experience_level ENUM('Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive') NOT NULL DEFAULT 'Entry-level',
    salary DECIMAL(10, 2) NULL,
    description TEXT NOT NULL,
    requirements TEXT NULL,
    contact_email VARCHAR(150) NULL,
    application_url VARCHAR(255) NULL,
    application_deadline DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_postings_posted_by
        FOREIGN KEY (posted_by) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Indexing for active listing queries and user submissions
CREATE INDEX idx_job_postings_active_deadline ON job_postings (is_active, application_deadline);
CREATE INDEX idx_job_postings_posted_by ON job_postings (posted_by);
