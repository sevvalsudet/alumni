-- ========================================================
-- Migration: 006_seed_job_postings.sql
-- Description: Seeds initial job postings into MySQL database
-- ========================================================

INSERT INTO job_postings (
    id, posted_by, title, company, location, employment_type, experience_level,
    salary, description, requirements, contact_email, application_url, application_deadline, is_active
) VALUES 
    (
        1, 2, 'Software Engineer - Cloud Systems', 'Google', 'Istanbul, TR / Remote',
        'Full-time', 'Mid-level', 125000.00,
        'Join our core infrastructure engineering team to design and deploy resilient cloud services.',
        '3+ years Node.js or Go, Docker, Kubernetes, distributed systems experience.',
        'sude@alumni.edu', 'https://careers.google.com', '2026-12-31', TRUE
    ),
    (
        2, 3, 'Junior Backend Developer', 'Microsoft', 'Remote',
        'Full-time', 'Entry-level', 85000.00,
        'Great opportunity for recent graduates to build scalable web applications with Node.js and SQL.',
        'Knowledge of JavaScript (ES6+), Express.js, relational databases, Git.',
        'sevval@alumni.edu', 'https://careers.microsoft.com', '2026-11-30', TRUE
    ),
    (
        3, 4, 'Senior Frontend Engineer (React & TypeScript)', 'Spotify', 'London, UK / Hybrid',
        'Full-time', 'Senior', 130000.00,
        'Deliver delightful audio experiences to millions of active listeners across desktop and web players.',
        '5+ years with modern JavaScript/TypeScript, React 18, Web Audio API, state management.',
        'kelvin.jacobson@spotify.com', 'https://www.spotifyjobs.com', '2026-12-15', TRUE
    ),
    (
        4, 5, 'Cloud Infrastructure & DevOps Engineer', 'Amazon', 'Istanbul, TR / Hybrid',
        'Full-time', 'Senior', 140000.00,
        'Manage high-availability AWS architectures, automate CI/CD pipelines, and optimize cloud infrastructure costs.',
        'Strong hands-on expertise with AWS, Terraform, Kubernetes, Linux sysadmin, and CI/CD tools.',
        'ena.stracke@amazon.com', 'https://amazon.jobs', '2026-11-20', TRUE
    ),
    (
        5, 7, 'Machine Learning & LLM Engineer', 'Amazon', 'Remote (EU & TR)',
        'Full-time', 'Senior', 155000.00,
        'Build and optimize large language model pipelines and intelligent recommendation systems at enterprise scale.',
        'Experience with Python, PyTorch, HuggingFace transformers, model quantization, and distributed training.',
        'rahul.mcdermott@amazon.com', 'https://amazon.jobs', '2026-12-30', TRUE
    ),
    (
        6, 9, 'Full Stack Web Developer', 'Netflix', 'Amsterdam, NL / Hybrid',
        'Full-time', 'Mid-level', 110000.00,
        'Develop internal developer tools, telemetry dashboards, and partner integration portals.',
        'Proficiency in React, Node.js, GraphQL, PostgreSQL, and Docker containerization.',
        'danny.weimann@netflix.com', 'https://jobs.netflix.com', '2026-12-01', TRUE
    ),
    (
        7, 11, 'Software Engineering Summer Intern', 'Amazon', 'Istanbul, TR / On-site',
        'Internship', 'Entry-level', 42000.00,
        'Paid summer internship for 3rd and 4th year undergraduate engineering students.',
        'Active student in Computer/Software Engineering. Solid understanding of OOP, data structures, and algorithms.',
        'internships@amazon.com', 'https://amazon.jobs/interns', '2026-11-15', TRUE
    ),
    (
        8, 12, 'Mobile Application Developer (Flutter / React Native)', 'Netflix', 'Remote',
        'Contract', 'Mid-level', 98000.00,
        'Build fluid cross-platform mobile apps for content creators and production crews worldwide.',
        'Experience with Flutter or React Native, RESTful APIs, offline caching, and responsive UI design.',
        'marquis.kohler@netflix.com', 'https://jobs.netflix.com', '2026-11-25', TRUE
    ),
    (
        9, 13, 'Data Platform & Analytics Engineer', 'Netflix', 'Remote',
        'Full-time', 'Mid-level', 115000.00,
        'Develop real-time data pipelines and analytics warehouses handling terabytes of daily event streams.',
        'Expertise in SQL, Python, Apache Kafka, Snowflake or BigQuery, and Apache Airflow.',
        'dewayne.spencer@netflix.com', 'https://jobs.netflix.com', '2026-12-20', TRUE
    ),
    (
        10, 17, 'Cybersecurity & Application Security Specialist', 'Meta', 'London, UK / Hybrid',
        'Full-time', 'Senior', 145000.00,
        'Lead code auditing, penetration testing, threat modeling, and secure software development practices.',
        'Knowledge of OWASP, vulnerability assessment tools, zero-trust architectures, and secure SDLC.',
        'jordan.rogahn@meta.com', 'https://metacareers.com', '2026-12-10', TRUE
    ),
    (
        11, 18, 'Frontend Developer (Vue / Nuxt.js)', 'Trendyol', 'Istanbul, TR / Hybrid',
        'Full-time', 'Mid-level', 92000.00,
        'Develop high-traffic e-commerce checkout and marketplace interfaces serving millions of customers daily.',
        'Strong skills in Vue.js, TypeScript, SSR, web vitals optimization, and testing with Jest/Cypress.',
        'alva.crona@trendyol.com', 'https://trendyol.com/careers', '2026-11-28', TRUE
    ),
    (
        12, 19, 'Site Reliability Engineer (SRE)', 'Google', 'Remote (TR)',
        'Full-time', 'Lead', 165000.00,
        'Ensure system uptime, incident response automation, capacity planning, and chaos engineering exercises.',
        'Extensive Linux internals experience, Kubernetes, Go or Python scripting, SLI/SLO metrics engineering.',
        'flossie.shields@google.com', 'https://careers.google.com', '2026-12-31', TRUE
    )
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    company = VALUES(company),
    location = VALUES(location),
    salary = VALUES(salary),
    description = VALUES(description);
