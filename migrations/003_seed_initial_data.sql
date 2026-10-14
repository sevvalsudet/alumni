-- ========================================================
-- Migration: 003_seed_initial_data.sql
-- Description: Seeds initial users and announcements into MySQL
-- ========================================================

-- Insert initial users
INSERT INTO users (id, name, email, role, department, company)
VALUES 
    (1, 'Şevval Sude', 'sevvalsude@alumni.edu', 'Student', 'Computer Engineering', NULL),
    (2, 'Sude', 'sude@alumni.edu', 'Alumni', 'Computer Engineering', 'Google'),
    (3, 'Şevval', 'sevval@alumni.edu', 'Alumni', 'Software Engineering', 'Microsoft')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert initial announcements
INSERT INTO announcements (id, author_id, title, content, category, date, priority)
VALUES 
    (1, 1, '2024 Alumni Gathering', 'We are excited to announce our annual alumni gathering scheduled for December 2024. All graduates are welcome!', 'Event', '2024-11-01', 'Normal'),
    (2, 1, 'New Scholarship Opportunities', 'Several new scholarship programs are now available for current students. Please check the details on the portal.', 'Scholarship', '2024-10-15', 'Normal')
ON DUPLICATE KEY UPDATE title=VALUES(title);
