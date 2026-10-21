// controllers/apiApplicationController.js
// 🎓 MVC - REST API Controller for Job Applications (JSON)

const ApplicationModel = require('../models/applicationModel');

const apiApplicationController = {
    // 📖 [DIRECT ROUTE: GET /api/applications] Tüm başvuruları JSON olarak getir (filtreleme destekler)
    getAll: async (req, res) => {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.job_id) filters.job_id = Number(req.query.job_id);
            if (req.query.user_id) filters.user_id = Number(req.query.user_id);

            const applications = await ApplicationModel.findAll(filters);
            res.json({
                success: true,
                count: applications.length,
                data: applications
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔍 [DIRECT ROUTE: GET /api/applications/:id] ID'ye göre tek başvuru detayını getir
    getById: async (req, res) => {
        try {
            const app = await ApplicationModel.findById(req.params.id);
            if (!app) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı başvuru bulunamadı!`
                });
            }
            res.json({ success: true, data: app });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ➕ [DIRECT ROUTE: POST /api/applications] Yeni başvuru oluştur
    create: async (req, res) => {
        try {
            const { job_id, user_id, resume_url, cover_letter, status } = req.body;
            if (!job_id || !user_id) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'job_id' ve 'user_id' alanları zorunludur!"
                });
            }

            const newApp = await ApplicationModel.create({
                job_id: Number(job_id),
                user_id: Number(user_id),
                resume_url,
                cover_letter,
                status: status || 'Pending'
            });

            res.status(201).json({
                success: true,
                message: "Başvuru başarıyla oluşturuldu!",
                data: newApp
            });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.message.includes('Duplicate')) {
                return res.status(409).json({
                    success: false,
                    message: "Hata: Bu kullanıcı bu ilana zaten başvurmuş (Duplicate application)!"
                });
            }
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ✏️ [DIRECT ROUTE: PUT /api/applications/:id] Başvuruyu tamamen güncelle
    update: async (req, res) => {
        try {
            const updated = await ApplicationModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı başvuru bulunamadı!`
                });
            }
            res.json({
                success: true,
                message: "Başvuru başarıyla güncellendi (PUT)!",
                data: updated
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🩹 [DIRECT ROUTE: PATCH /api/applications/:id] Başvuru durumunu/alanlarını kısmen güncelle
    patch: async (req, res) => {
        try {
            const app = await ApplicationModel.findById(req.params.id);
            if (!app) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı başvuru bulunamadı!`
                });
            }

            let result = null;
            if (req.body.status) {
                result = await ApplicationModel.updateStatus(req.params.id, req.body.status);
            } else {
                result = await ApplicationModel.update(req.params.id, { ...app, ...req.body });
            }

            res.json({
                success: true,
                message: "Başvuru kısmen güncellendi (PATCH)!",
                data: result
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🗑️ [DIRECT ROUTE: DELETE /api/applications/:id] Başvuruyu sil
    delete: async (req, res) => {
        try {
            const deleted = await ApplicationModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı başvuru bulunamadı!`
                });
            }
            res.json({
                success: true,
                message: "Başvuru başarıyla silindi!",
                data: deleted
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔗 [NESTED ROUTE: GET /api/jobs/:id/applications] Belirli iş ilanına yapılmış başvuruları getir
    getByJob: async (req, res) => {
        try {
            const jobId = req.params.jobId || req.params.id;
            const applications = await ApplicationModel.findByJob(jobId);
            res.json({
                success: true,
                job_id: Number(jobId),
                count: applications.length,
                data: applications
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔗 [NESTED ROUTE: POST /api/jobs/:id/applications] Belirli iş ilanına başvuru yap
    createForJob: async (req, res) => {
        try {
            const jobId = req.params.jobId || req.params.id;
            const { user_id, resume_url, cover_letter } = req.body;
            if (!user_id) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'user_id' zorunludur!"
                });
            }

            const newApp = await ApplicationModel.create({
                job_id: Number(jobId),
                user_id: Number(user_id),
                resume_url,
                cover_letter,
                status: 'Pending'
            });

            res.status(201).json({
                success: true,
                message: `İş ilanına (#${jobId}) başarıyla başvuruldu!`,
                data: newApp
            });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.message.includes('Duplicate')) {
                return res.status(409).json({
                    success: false,
                    message: "Hata: Bu ilana zaten başvuruldu!"
                });
            }
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔗 [NESTED ROUTE: GET /api/users/:id/applications] Belirli kullanıcının tüm başvurularını getir
    getByUser: async (req, res) => {
        try {
            const userId = req.params.userId || req.params.id;
            const applications = await ApplicationModel.findByUser(userId);
            res.json({
                success: true,
                user_id: Number(userId),
                count: applications.length,
                data: applications
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = apiApplicationController;
