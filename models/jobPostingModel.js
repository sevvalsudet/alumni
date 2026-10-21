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
        salary: 120000.00,
        description: "Join our core infrastructure engineering team to design and deploy resilient cloud services.",
        requirements: "3+ years Node.js or Go, Docker, Kubernetes, distributed systems experience.",
        contact_email: "sude@alumni.edu",
        application_url: "https://careers.google.com",
        application_deadline: "2026-12-31",
        is_active: true,
        created_at: new Date().toISOString(),
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

    // 👤 [RELATIONSHIP: BelongsTo] Bu ilanı yayınlayan kullanıcıyı getir (posted_by -> users.id)
    getPoster: async (jobId) => {
        const job = await JobPostingModel.findById(jobId);
        if (!job) return null;
        const UserModel = require('./userModel');
        return await UserModel.findById(job.posted_by);
    },

    // 📋 [RELATIONSHIP: HasMany Inversion] Belirli bir kullanıcının yayınladığı tüm ilanları getir
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

    // 📝 [RELATIONSHIP: HasMany] Bu ilana yapılmış tüm başvuruları getir (1:N)
    getApplications: async (jobId) => {
        const ApplicationModel = require('./applicationModel');
        return await ApplicationModel.findByJob(jobId);
    }
};

module.exports = JobPostingModel;
