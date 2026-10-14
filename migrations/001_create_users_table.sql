-- ========================================================
-- Migration: 001_create_users_table.sql
-- Description: Creates the users table based on ddd.md
-- ========================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('Admin', 'Alumni', 'Student') NOT NULL DEFAULT 'Alumni',
    department VARCHAR(100) NOT NULL,
    company VARCHAR(150) NULL,
    graduation_year SMALLINT NULL,
    bio TEXT NULL,
    phone VARCHAR(20) NULL,
    linkedin_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
