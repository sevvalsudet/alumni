// models/applicationModel.js
// 🎓 MVC Mimarisi - Model Katmanı (Application Model)
// Migration dosyasına (005_create_applications_table.sql) dayalı veri modeli ve ilişkileri (Relationships).

const { pool } = require('../config/db');

// In-memory fallback veri kümesi (DB bağlantısı olmadan veya çevrimdışıyken arayüzün kesintisiz çalışması için)
let fallbackApplications = [
    {
        id: 1,
        job_id: 1,
        job_title: "Software Engineer - Cloud Systems",
        job_company: "Google",
        user_id: 1,
        applicant_name: "Emre Yılmaz",
        applicant_email: "emre@alumni.edu",
        resume_url: "https://example.com/resumes/emre-yilmaz-cv.pdf",
        cover_letter: "I have 3+ years of experience with distributed systems and Go/Node.js. Passionate about cloud architectures and scalable infrastructures.",
        status: "Reviewed",
        applied_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
        id: 2,
        job_id: 2,
        job_title: "Junior Backend Developer",
        job_company: "Microsoft",
        user_id: 1,
        applicant_name: "Emre Yılmaz",
        applicant_email: "emre@alumni.edu",
        resume_url: "https://example.com/resumes/emre-yilmaz-cv.pdf",
        cover_letter: "Excited about modern backend architectures and API engineering. Eager to contribute to Microsoft cloud projects.",
        status: "Pending",
        applied_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
        id: 3,
        job_id: 1,
        job_title: "Software Engineer - Cloud Systems",
        job_company: "Google",
        user_id: 3,
        applicant_name: "Şevval Çelik",
        applicant_email: "sevval@alumni.edu",
        resume_url: "https://example.com/resumes/sevval-celik-cv.pdf",
        cover_letter: "Experienced in containerized services and high-throughput microservices. Keen to join the core team at Google.",
        status: "Interviewing",
        applied_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
    }
];

const ApplicationModel = {
    // ==========================================
    // 📖 CRUD METOTLARI
    // ==========================================

    // 📖 [READ ALL] Tüm başvuruları ilişkili iş ilanı ve başvuran bilgisiyle (JOIN) getir
    findAll: async (filters = {}) => {
        try {
            let sql = `
                SELECT 
                    a.*,
                    j.title AS job_title,
                    j.company AS job_company,
                    j.location AS job_location,
                    u.name AS applicant_name,
                    u.email AS applicant_email,
                    u.department AS applicant_department
                FROM applications a
                INNER JOIN job_postings j ON a.job_id = j.id
                INNER JOIN users u ON a.user_id = u.id
                WHERE 1=1
            `;
            const params = [];

            if (filters.status) {
                sql += ' AND a.status = ?';
                params.push(filters.status);
            }
            if (filters.job_id) {
                sql += ' AND a.job_id = ?';
                params.push(Number(filters.job_id));
            }
            if (filters.user_id) {
                sql += ' AND a.user_id = ?';
                params.push(Number(filters.user_id));
            }

            sql += ' ORDER BY a.applied_at DESC';

            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (err) {
            let result = [...fallbackApplications];
            if (filters.status) {
                result = result.filter(a => a.status === filters.status);
            }
            if (filters.job_id) {
                result = result.filter(a => a.job_id === Number(filters.job_id));
            }
            if (filters.user_id) {
                result = result.filter(a => a.user_id === Number(filters.user_id));
            }
            return result;
        }
    },

    // 🔍 [READ ONE] ID'ye göre tek başvuruyu getir (İlişkili Job & User bilgisiyle)
    findById: async (id) => {
        try {
            const sql = `
                SELECT 
                    a.*,
                    j.title AS job_title,
                    j.company AS job_company,
                    j.location AS job_location,
                    j.employment_type AS job_employment_type,
                    u.name AS applicant_name,
                    u.email AS applicant_email,
                    u.department AS applicant_department,
                    u.company AS applicant_current_company
                FROM applications a
                INNER JOIN job_postings j ON a.job_id = j.id
                INNER JOIN users u ON a.user_id = u.id
                WHERE a.id = ?
            `;
            const [rows] = await pool.query(sql, [Number(id)]);
            return rows[0] || null;
        } catch (err) {
            return fallbackApplications.find(a => a.id === Number(id)) || null;
        }
    },

    // 📋 [READ BY JOB] Belirli bir iş ilanına yapılmış tüm başvuruları getir
    findByJob: async (jobId) => {
        return await ApplicationModel.findAll({ job_id: Number(jobId) });
    },

    // 📋 [READ BY USER] Belirli bir kullanıcının yaptığı tüm başvuruları getir
    findByUser: async (userId) => {
        return await ApplicationModel.findAll({ user_id: Number(userId) });
    },

    // ➕ [CREATE] Yeni başvuru oluştur
    create: async (data) => {
        const jobId = Number(data.job_id);
        const userId = Number(data.user_id);
        const resumeUrl = data.resume_url || null;
        const coverLetter = data.cover_letter || null;
        const status = data.status || 'Pending';

        try {
            const sql = `
                INSERT INTO applications (job_id, user_id, resume_url, cover_letter, status)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.execute(sql, [
                jobId,
                userId,
                resumeUrl,
                coverLetter,
                status
            ]);

            return await ApplicationModel.findById(result.insertId);
        } catch (err) {
            // Check for duplicate application in fallback
            const exists = fallbackApplications.some(a => a.job_id === jobId && a.user_id === userId);
            if (exists) {
                const dupErr = new Error("Duplicate entry: You have already applied for this job.");
                dupErr.code = 'ER_DUP_ENTRY';
                throw dupErr;
            }

            const JobPostingModel = require('./jobPostingModel');
            const UserModel = require('./userModel');
            const job = await JobPostingModel.findById(jobId);
            const user = await UserModel.findById(userId);

            const maxId = fallbackApplications.length > 0 ? Math.max(...fallbackApplications.map(a => a.id)) : 0;
            const newApp = {
                id: maxId + 1,
                job_id: jobId,
                job_title: job ? job.title : `Job #${jobId}`,
                job_company: job ? job.company : "Company",
                user_id: userId,
                applicant_name: user ? user.name : `User #${userId}`,
                applicant_email: user ? user.email : "",
                resume_url: resumeUrl,
                cover_letter: coverLetter,
                status: status,
                applied_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            fallbackApplications.unshift(newApp);
            return newApp;
        }
    },

    // ✏️ [UPDATE - PUT] Başvuruyu tamamen güncelle
    update: async (id, data) => {
        try {
            const sql = `
                UPDATE applications SET
                    resume_url = ?, cover_letter = ?, status = ?
                WHERE id = ?
            `;
            await pool.execute(sql, [
                data.resume_url || null,
                data.cover_letter || null,
                data.status || 'Pending',
                Number(id)
            ]);
            return await ApplicationModel.findById(id);
        } catch (err) {
            const index = fallbackApplications.findIndex(a => a.id === Number(id));
            if (index === -1) return null;
            fallbackApplications[index] = {
                ...fallbackApplications[index],
                ...data,
                id: Number(id),
                updated_at: new Date().toISOString()
            };
            return fallbackApplications[index];
        }
    },

    // 🩹 [UPDATE STATUS - PATCH] Başvuru durumunu güncelle
    updateStatus: async (id, status) => {
        try {
            await pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, Number(id)]);
            return await ApplicationModel.findById(id);
        } catch (err) {
            const app = fallbackApplications.find(a => a.id === Number(id));
            if (!app) return null;
            app.status = status;
            app.updated_at = new Date().toISOString();
            return app;
        }
    },

    // 🗑️ [DELETE] Başvuruyu sil
    delete: async (id) => {
        try {
            const app = await ApplicationModel.findById(id);
            if (!app) return null;
            await pool.execute('DELETE FROM applications WHERE id = ?', [Number(id)]);
            return app;
        } catch (err) {
            const index = fallbackApplications.findIndex(a => a.id === Number(id));
            if (index === -1) return null;
            return fallbackApplications.splice(index, 1)[0];
        }
    },

    // ==========================================
    // 🔗 MODEL İLİŞKİLERİ (RELATIONSHIPS)
    // ==========================================

    // 💼 [RELATIONSHIP: BelongsTo] Bu başvurunun yapıldığı iş ilanını getir (job_id -> job_postings.id)
    getJob: async (applicationId) => {
        const app = await ApplicationModel.findById(applicationId);
        if (!app) return null;
        const JobPostingModel = require('./jobPostingModel');
        return await JobPostingModel.findById(app.job_id);
    },

    // 👤 [RELATIONSHIP: BelongsTo] Bu başvuruyu yapan kullanıcıyı getir (user_id -> users.id)
    getApplicant: async (applicationId) => {
        const app = await ApplicationModel.findById(applicationId);
        if (!app) return null;
        const UserModel = require('./userModel');
        return await UserModel.findById(app.user_id);
    }
};

module.exports = ApplicationModel;
