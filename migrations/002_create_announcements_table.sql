-- ========================================================
-- Migration: 002_create_announcements_table.sql
-- Description: Creates the announcements table in MySQL
-- ========================================================

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('General', 'Event', 'Scholarship', 'Career', 'Academic') NOT NULL DEFAULT 'General',
    date DATE NOT NULL,
    priority ENUM('Low', 'Normal', 'High', 'Urgent') NOT NULL DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
