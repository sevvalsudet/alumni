-- ========================================================
-- Migration: 005_create_applications_table.sql
-- Description: Creates the applications table based on ddd.md
-- ========================================================

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    resume_url VARCHAR(255) NULL,
    cover_letter TEXT NULL,
    status ENUM('Pending', 'Reviewed', 'Interviewing', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id) REFERENCES job_postings(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uk_applications_user_job
        UNIQUE (user_id, job_id)
);

-- Indexing for fast lookups by job, applicant, and review status
CREATE INDEX idx_applications_job_id ON applications (job_id);
CREATE INDEX idx_applications_user_id ON applications (user_id);
CREATE INDEX idx_applications_status ON applications (status);
