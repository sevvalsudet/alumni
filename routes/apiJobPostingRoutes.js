// routes/apiJobPostingRoutes.js
// 🎓 MVC Mimarisi - RESTful API Direct Rotaları (/api/jobs)

const express = require('express');
const router = express.Router();
const apiJobPostingController = require('../controllers/apiJobPostingController');
const { requireAuth, requireAlumniOrAdmin } = require('../middlewares/authMiddleware');

// 📖 [DIRECT] GET /api/jobs -> Tüm iş ilanlarını JSON olarak listele (filtreler: is_active, employment_type, experience_level)
router.get('/', apiJobPostingController.getAll);

// 🔍 [DIRECT] GET /api/jobs/:id -> Belirli bir iş ilanını JSON olarak getir
router.get('/:id', apiJobPostingController.getById);

// ➕ [DIRECT] POST /api/jobs -> Yeni iş ilanı ekle (Sadece Alumni ve Admin)
router.post('/', requireAuth, requireAlumniOrAdmin, apiJobPostingController.create);

// ✏️ [DIRECT] PUT /api/jobs/:id -> İlanı tamamen güncelle (Sadece Alumni ve Admin)
router.put('/:id', requireAuth, requireAlumniOrAdmin, apiJobPostingController.update);

// 🩹 [DIRECT] PATCH /api/jobs/:id -> İlanı kısmen güncelle (Sadece Alumni ve Admin)
router.patch('/:id', requireAuth, requireAlumniOrAdmin, apiJobPostingController.patch);

// 🗑️ [DIRECT] DELETE /api/jobs/:id -> İlanı sil (Sadece Alumni ve Admin)
router.delete('/:id', requireAuth, requireAlumniOrAdmin, apiJobPostingController.delete);

// ==========================================
// 🔗 NESTED ROTALAR (İÇ İÇE GEÇMİŞ ROTALAR)
// ==========================================

const apiApplicationController = require('../controllers/apiApplicationController');

// 📝 [NESTED] GET /api/jobs/:id/applications -> Belirli bir iş ilanına yapılan başvuruları listele
router.get('/:id/applications', apiApplicationController.getByJob);

// 📝 [NESTED] POST /api/jobs/:id/applications -> Belirli bir iş ilanına yeni başvuru yap
router.post('/:id/applications', apiApplicationController.createForJob);

// 👤 [NESTED M:N] GET /api/jobs/:id/users -> Job-Postings (n) <--- application ---> (m) User
// 🎓 Tahtadaki Mantık: İlan ile Başvuran Kullanıcılar doğrudan bağlı değildir, application üzerinden bağlıdır.
const JobPostingModel = require('../models/jobPostingModel');
router.get('/:id/users', async (req, res) => {
    try {
        const applicants = await JobPostingModel.getApplicants(req.params.id);
        res.json({
            success: true,
            job_id: Number(req.params.id),
            relationship: "n:m through application",
            count: applicants.length,
            data: applicants
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
