// controllers/apiJobPostingController.js
// 🎓 MVC - REST API Controller for Job Postings (JSON)

const JobPostingModel = require('../models/jobPostingModel');

const apiJobPostingController = {
    // 📖 [DIRECT ROUTE: GET /api/jobs] Tüm iş ilanlarını getir (filtreleme destekler)
    getAll: async (req, res) => {
        try {
            const filters = {};
            if (req.query.is_active !== undefined) {
                filters.is_active = req.query.is_active === 'true' || req.query.is_active === '1';
            }
            if (req.query.employment_type) {
                filters.employment_type = req.query.employment_type;
            }
            if (req.query.experience_level) {
                filters.experience_level = req.query.experience_level;
            }

            const jobs = await JobPostingModel.findAll(filters);
            res.json({
                success: true,
                count: jobs.length,
                data: jobs
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔍 [DIRECT ROUTE: GET /api/jobs/:id] ID'ye göre iş ilanı detayını getir
    getById: async (req, res) => {
        try {
            const job = await JobPostingModel.findById(req.params.id);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı iş ilanı bulunamadı!`
                });
            }
            res.json({ success: true, data: job });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ➕ [DIRECT ROUTE: POST /api/jobs] Yeni iş ilanı oluştur
    create: async (req, res) => {
        try {
            const { title, company, location, description } = req.body;
            if (!title || !company || !location || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'title', 'company', 'location' ve 'description' alanları zorunludur!"
                });
            }

            const newJob = await JobPostingModel.create(req.body);
            res.status(201).json({
                success: true,
                message: "İş ilanı başarıyla oluşturuldu!",
                data: newJob
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ✏️ [DIRECT ROUTE: PUT /api/jobs/:id] İlanı tamamen güncelle
    update: async (req, res) => {
        try {
            const { title, company, location, description } = req.body;
            if (!title || !company || !location || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'title', 'company', 'location' ve 'description' alanları zorunludur!"
                });
            }

            const updatedJob = await JobPostingModel.update(req.params.id, req.body);
            if (!updatedJob) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı iş ilanı bulunamadı!`
                });
            }
            res.json({
                success: true,
                message: "İş ilanı başarıyla güncellendi (PUT)!",
                data: updatedJob
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🩹 [DIRECT ROUTE: PATCH /api/jobs/:id] İlanı kısmen güncelle
    patch: async (req, res) => {
        try {
            const patchedJob = await JobPostingModel.patch(req.params.id, req.body);
            if (!patchedJob) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı iş ilanı bulunamadı!`
                });
            }
            res.json({
                success: true,
                message: "İş ilanı kısmen güncellendi (PATCH)!",
                data: patchedJob
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🗑️ [DIRECT ROUTE: DELETE /api/jobs/:id] İlanı sil
    delete: async (req, res) => {
        try {
            const deleted = await JobPostingModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı iş ilanı bulunamadı!`
                });
            }
            res.json({
                success: true,
                message: "İş ilanı başarıyla silindi!",
                data: deleted
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔗 [NESTED ROUTE: GET /api/users/:userId/jobs] Belirli kullanıcının iş ilanlarını getir
    getByUser: async (req, res) => {
        try {
            const userId = req.params.userId || req.params.id;
            const jobs = await JobPostingModel.findByUser(userId);
            res.json({
                success: true,
                user_id: Number(userId),
                count: jobs.length,
                data: jobs
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔗 [NESTED ROUTE: POST /api/users/:userId/jobs] Belirli kullanıcı adına iş ilanı oluştur
    createForUser: async (req, res) => {
        try {
            const userId = req.params.userId || req.params.id;
            const payload = { ...req.body, posted_by: Number(userId) };

            const { title, company, location, description } = payload;
            if (!title || !company || !location || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'title', 'company', 'location' ve 'description' alanları zorunludur!"
                });
            }

            const newJob = await JobPostingModel.create(payload);
            res.status(201).json({
                success: true,
                message: `Kullanıcı (#${userId}) adına iş ilanı başarıyla oluşturuldu!`,
                data: newJob
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = apiJobPostingController;
