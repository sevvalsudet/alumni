// models/jobPostingModel.js
// 🎓 MVC Mimarisi - Model Katmanı (JobPosting Model)
// Migration dosyasına (004_create_job_postings_table.sql) dayalı veri modeli ve ilişkileri (Relationships).

const { pool } = require('../config/db');

// In-memory fallback veri kümesi (DB çevrimdışıyken arayüzün kesintisiz çalışması için)
let fallbackJobPostings = [
    {
        id: 1,
        posted_by: 2,
        posted_by_name: "Sude Top",
        title: "Software Engineer - Cloud Systems",
        company: "Google",
        location: "Istanbul, TR / Remote",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 125000.00,
        description: "Join our core infrastructure engineering team to design and deploy resilient cloud services.",
        requirements: "3+ years Node.js or Go, Docker, Kubernetes, distributed systems experience.",
        contact_email: "sude@alumni.edu",
        application_url: "https://careers.google.com",
        application_deadline: "2026-12-31",
        is_active: true,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        posted_by: 3,
        posted_by_name: "Şevval Çelik",
        title: "Junior Backend Developer",
        company: "Microsoft",
        location: "Remote",
        employment_type: "Full-time",
        experience_level: "Entry-level",
        salary: 85000.00,
        description: "Great opportunity for recent graduates to build scalable web applications with Node.js and SQL.",
        requirements: "Knowledge of JavaScript (ES6+), Express.js, relational databases, Git.",
        contact_email: "sevval@alumni.edu",
        application_url: "https://careers.microsoft.com",
        application_deadline: "2026-11-30",
        is_active: true,
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 3,
        posted_by: 4,
        posted_by_name: "Kelvin Jacobson",
        title: "Senior Frontend Engineer (React & TypeScript)",
        company: "Spotify",
        location: "London, UK / Hybrid",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 130000.00,
        description: "Deliver delightful audio experiences to millions of active listeners across desktop and web players.",
        requirements: "5+ years with modern JavaScript/TypeScript, React 18, Web Audio API, state management.",
        contact_email: "careers@spotify.com",
        application_url: "https://www.spotifyjobs.com",
        application_deadline: "2026-12-15",
        is_active: true,
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 4,
        posted_by: 5,
        posted_by_name: "Ena Stracke",
        title: "Cloud Infrastructure & DevOps Engineer",
        company: "Amazon",
        location: "Istanbul, TR / Hybrid",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 140000.00,
        description: "Manage high-availability AWS architectures, automate CI/CD pipelines, and optimize cloud infrastructure costs.",
        requirements: "Strong hands-on expertise with AWS, Terraform, Kubernetes, Linux sysadmin, and CI/CD tools.",
        contact_email: "careers@amazon.com",
        application_url: "https://amazon.jobs",
        application_deadline: "2026-11-20",
        is_active: true,
        created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 5,
        posted_by: 7,
        posted_by_name: "Rahul McDermott",
        title: "Machine Learning & LLM Engineer",
        company: "Amazon",
        location: "Remote (EU & TR)",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 155000.00,
        description: "Build and optimize large language model pipelines and intelligent recommendation systems at enterprise scale.",
        requirements: "Experience with Python, PyTorch, HuggingFace transformers, model quantization, and distributed training.",
        contact_email: "careers@amazon.com",
        application_url: "https://amazon.jobs",
        application_deadline: "2026-12-30",
        is_active: true,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 6,
        posted_by: 9,
        posted_by_name: "Danny Weimann",
        title: "Full Stack Web Developer",
        company: "Netflix",
        location: "Amsterdam, NL / Hybrid",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 110000.00,
        description: "Develop internal developer tools, telemetry dashboards, and partner integration portals.",
        requirements: "Proficiency in React, Node.js, GraphQL, PostgreSQL, and Docker containerization.",
        contact_email: "careers@netflix.com",
        application_url: "https://jobs.netflix.com",
        application_deadline: "2026-12-01",
        is_active: true,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 7,
        posted_by: 11,
        posted_by_name: "Virgil McGlynn",
        title: "Software Engineering Summer Intern",
        company: "Amazon",
        location: "Istanbul, TR / On-site",
        employment_type: "Internship",
        experience_level: "Entry-level",
        salary: 42000.00,
        description: "Paid summer internship for 3rd and 4th year undergraduate engineering students.",
        requirements: "Active student in Computer/Software Engineering. Solid understanding of OOP, data structures, and algorithms.",
        contact_email: "internships@amazon.com",
        application_url: "https://amazon.jobs/interns",
        application_deadline: "2026-11-15",
        is_active: true,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 8,
        posted_by: 12,
        posted_by_name: "Marquis Kohler",
        title: "Mobile Application Developer (Flutter / React Native)",
        company: "Netflix",
        location: "Remote",
        employment_type: "Contract",
        experience_level: "Mid-level",
        salary: 98000.00,
        description: "Build fluid cross-platform mobile apps for content creators and production crews worldwide.",
        requirements: "Experience with Flutter or React Native, RESTful APIs, offline caching, and responsive UI design.",
        contact_email: "careers@netflix.com",
        application_url: "https://jobs.netflix.com",
        application_deadline: "2026-11-25",
        is_active: true,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 9,
        posted_by: 13,
        posted_by_name: "Dewayne Spencer",
        title: "Data Platform & Analytics Engineer",
        company: "Netflix",
        location: "Remote",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 115000.00,
        description: "Develop real-time data pipelines and analytics warehouses handling terabytes of daily event streams.",
        requirements: "Expertise in SQL, Python, Apache Kafka, Snowflake or BigQuery, and Apache Airflow.",
        contact_email: "careers@netflix.com",
        application_url: "https://jobs.netflix.com",
        application_deadline: "2026-12-20",
        is_active: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 10,
        posted_by: 17,
        posted_by_name: "Jordan Rogahn",
        title: "Cybersecurity & Application Security Specialist",
        company: "Meta",
        location: "London, UK / Hybrid",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 145000.00,
        description: "Lead code auditing, penetration testing, threat modeling, and secure software development practices.",
        requirements: "Knowledge of OWASP, vulnerability assessment tools, zero-trust architectures, and secure SDLC.",
        contact_email: "careers@meta.com",
        application_url: "https://metacareers.com",
        application_deadline: "2026-12-10",
        is_active: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 11,
        posted_by: 18,
        posted_by_name: "Alva Crona",
        title: "Frontend Developer (Vue / Nuxt.js)",
        company: "Trendyol",
        location: "Istanbul, TR / Hybrid",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 92000.00,
        description: "Develop high-traffic e-commerce checkout and marketplace interfaces serving millions of customers daily.",
        requirements: "Strong skills in Vue.js, TypeScript, SSR, web vitals optimization, and testing with Jest/Cypress.",
        contact_email: "careers@trendyol.com",
        application_url: "https://trendyol.com/careers",
        application_deadline: "2026-11-28",
        is_active: true,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 12,
        posted_by: 19,
        posted_by_name: "Flossie Shields",
        title: "Site Reliability Engineer (SRE)",
        company: "Google",
        location: "Remote (TR)",
        employment_type: "Full-time",
        experience_level: "Lead",
        salary: 165000.00,
        description: "Ensure system uptime, incident response automation, capacity planning, and chaos engineering exercises.",
        requirements: "Extensive Linux internals experience, Kubernetes, Go or Python scripting, SLI/SLO metrics engineering.",
        contact_email: "careers@google.com",
        application_url: "https://careers.google.com",
        application_deadline: "2026-12-31",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

const JobPostingModel = {
    // ==========================================
    // 📖 CRUD METOTLARI
    // ==========================================

    // 📖 [READ ALL] Tüm aktif iş ilanlarını kullanıcı bilgisiyle (JOIN) getir
    findAll: async (filters = {}) => {
        try {
            let sql = `
                SELECT j.*, u.name AS posted_by_name, u.email AS posted_by_email, u.company AS posted_by_company
                FROM job_postings j
                INNER JOIN users u ON j.posted_by = u.id
                WHERE 1=1
            `;
            const params = [];

            if (filters.is_active !== undefined) {
                sql += ' AND j.is_active = ?';
                params.push(filters.is_active ? 1 : 0);
            }
            if (filters.employment_type) {
                sql += ' AND j.employment_type = ?';
                params.push(filters.employment_type);
            }
            if (filters.experience_level) {
                sql += ' AND j.experience_level = ?';
                params.push(filters.experience_level);
            }

            sql += ' ORDER BY j.created_at DESC';

            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (err) {
            let result = fallbackJobPostings;
            if (filters.is_active !== undefined) {
                result = result.filter(j => j.is_active === Boolean(filters.is_active));
            }
            if (filters.employment_type) {
                result = result.filter(j => j.employment_type === filters.employment_type);
            }
            return result;
        }
    },

    // 🔍 [READ ONE] ID'ye göre tek ilanı getir (İlişkili User bilgisiyle)
    findById: async (id) => {
        try {
            const sql = `
                SELECT j.*, u.name AS posted_by_name, u.email AS posted_by_email, u.company AS posted_by_company
                FROM job_postings j
                INNER JOIN users u ON j.posted_by = u.id
                WHERE j.id = ?
            `;
            const [rows] = await pool.query(sql, [Number(id)]);
            return rows[0] || null;
        } catch (err) {
            return fallbackJobPostings.find(j => j.id === Number(id)) || null;
        }
    },

    // ➕ [CREATE] Yeni iş ilanı oluştur
    create: async (data) => {
        const postedBy = Number(data.posted_by) || 1;
        const employmentType = data.employment_type || 'Full-time';
        const experienceLevel = data.experience_level || 'Entry-level';
        const isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;
        const salary = data.salary ? Number(data.salary) : null;

        try {
            const sql = `
                INSERT INTO job_postings (
                    posted_by, title, company, location, employment_type, experience_level,
                    salary, description, requirements, contact_email, application_url,
                    application_deadline, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.execute(sql, [
                postedBy,
                data.title,
                data.company,
                data.location,
                employmentType,
                experienceLevel,
                salary,
                data.description,
                data.requirements || null,
                data.contact_email || null,
                data.application_url || null,
                data.application_deadline || null,
                isActive ? 1 : 0
            ]);

            return await JobPostingModel.findById(result.insertId);
        } catch (err) {
            const maxId = fallbackJobPostings.length > 0 ? Math.max(...fallbackJobPostings.map(j => j.id)) : 0;
            const newJob = {
                id: maxId + 1,
                posted_by: postedBy,
                posted_by_name: data.posted_by_name || "Alumni Member",
                title: data.title,
                company: data.company,
                location: data.location,
                employment_type: employmentType,
                experience_level: experienceLevel,
                salary,
                description: data.description,
                requirements: data.requirements || null,
                contact_email: data.contact_email || null,
                application_url: data.application_url || null,
                application_deadline: data.application_deadline || null,
                is_active: isActive,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            fallbackJobPostings.unshift(newJob);
            return newJob;
        }
    },

    // ✏️ [UPDATE - PUT] İlanı tamamen güncelle
    update: async (id, data) => {
        try {
            const sql = `
                UPDATE job_postings SET
                    title = ?, company = ?, location = ?, employment_type = ?,
                    experience_level = ?, salary = ?, description = ?, requirements = ?,
                    contact_email = ?, application_url = ?, application_deadline = ?,
                    is_active = ?
                WHERE id = ?
            `;
            await pool.execute(sql, [
                data.title,
                data.company,
                data.location,
                data.employment_type || 'Full-time',
                data.experience_level || 'Entry-level',
                data.salary ? Number(data.salary) : null,
                data.description,
                data.requirements || null,
                data.contact_email || null,
                data.application_url || null,
                data.application_deadline || null,
                data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
                Number(id)
            ]);
            return await JobPostingModel.findById(id);
        } catch (err) {
            const index = fallbackJobPostings.findIndex(j => j.id === Number(id));
            if (index === -1) return null;
            fallbackJobPostings[index] = {
                ...fallbackJobPostings[index],
                ...data,
                id: Number(id),
                updated_at: new Date().toISOString()
            };
            return fallbackJobPostings[index];
        }
    },

    // 🩹 [UPDATE - PATCH] İlanı kısmen güncelle
    patch: async (id, partialData) => {
        try {
            const allowed = [
                'title', 'company', 'location', 'employment_type', 'experience_level',
                'salary', 'description', 'requirements', 'contact_email', 'application_url',
                'application_deadline', 'is_active'
            ];
            const fields = Object.keys(partialData).filter(k => allowed.includes(k));
            if (fields.length === 0) return await JobPostingModel.findById(id);

            const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
            const values = fields.map(f => f === 'is_active' ? (partialData[f] ? 1 : 0) : partialData[f]);
            values.push(Number(id));

            await pool.execute(`UPDATE job_postings SET ${setClause} WHERE id = ?`, values);
            return await JobPostingModel.findById(id);
        } catch (err) {
            const job = fallbackJobPostings.find(j => j.id === Number(id));
            if (!job) return null;
            Object.assign(job, partialData, { updated_at: new Date().toISOString() });
            return job;
        }
    },

    // 🗑️ [DELETE] İlanı sil
    delete: async (id) => {
        try {
            const job = await JobPostingModel.findById(id);
            if (!job) return null;
            await pool.execute('DELETE FROM job_postings WHERE id = ?', [Number(id)]);
            return job;
        } catch (err) {
            const index = fallbackJobPostings.findIndex(j => j.id === Number(id));
            if (index === -1) return null;
            return fallbackJobPostings.splice(index, 1)[0];
        }
    },

    // ==========================================
    // 🔗 MODEL İLİŞKİLERİ (RELATIONSHIPS)
    // ==========================================

    // 👤 [RELATIONSHIP: BelongsTo] Bu ilanı yayınlayan kullanıcıyı getir (posted_by -> users.id) [1:N]
    getPoster: async (jobId) => {
        const job = await JobPostingModel.findById(jobId);
        if (!job) return null;
        const UserModel = require('./userModel');
        return await UserModel.findById(job.posted_by);
    },

    // 📋 [RELATIONSHIP: HasMany via posted_by FK] Belirli bir kullanıcının YAYINLADIĞI tüm ilanları getir (1:N)
    findByUser: async (userId) => {
        try {
            const sql = `
                SELECT j.*, u.name AS posted_by_name, u.email AS posted_by_email
                FROM job_postings j
                INNER JOIN users u ON j.posted_by = u.id
                WHERE j.posted_by = ?
                ORDER BY j.created_at DESC
            `;
            const [rows] = await pool.query(sql, [Number(userId)]);
            return rows;
        } catch (err) {
            return fallbackJobPostings.filter(j => j.posted_by === Number(userId));
        }
    },

    // 📝 [RELATIONSHIP: HasMany] Bu ilana yapılmış tüm başvuruları getir (1:N via applications FK)
    getApplications: async (jobId) => {
        const ApplicationModel = require('./applicationModel');
        return await ApplicationModel.findByJob(jobId);
    },

    // 🔗 [RELATIONSHIP: BelongsToMany] Bu ilana BAŞVURAN kullanıcıları getir
    //    JobPosting (n) <--applications--> User (m)  [M:N — JUNCTION TABLE: applications]
    //    JobPosting → Users arasında DOĞRUDAN bağlantı YOK, applications üzerinden geçer.
    //    Eşdeğer Sequelize: JobPosting.findOne({ where: { id }, include: [{ model: User, through: Application }] })
    getApplicants: async (jobId) => {
        try {
            const sql = `
                SELECT 
                    u.id, u.name, u.email, u.role, u.department, u.company,
                    a.id AS application_id,
                    a.status AS application_status,
                    a.resume_url,
                    a.applied_at
                FROM users u
                INNER JOIN applications a ON u.id = a.user_id
                WHERE a.job_id = ?
                ORDER BY a.applied_at DESC
            `;
            const [rows] = await pool.query(sql, [Number(jobId)]);
            return rows;
        } catch (err) {
            // Offline fallback: go through applications in-memory
            const ApplicationModel = require('./applicationModel');
            const UserModel = require('./userModel');
            const jobApplications = await ApplicationModel.findByJob(jobId);
            const applicants = [];
            for (const app of jobApplications) {
                const user = await UserModel.findById(app.user_id);
                if (user) {
                    applicants.push({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        department: user.department,
                        company: user.company,
                        application_id: app.id,
                        application_status: app.status,
                        resume_url: app.resume_url,
                        applied_at: app.applied_at
                    });
                }
            }
            return applicants;
        }
    }
};

module.exports = JobPostingModel;
