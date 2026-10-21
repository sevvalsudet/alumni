// routes/apiJobPostingRoutes.js
// 🎓 MVC Mimarisi - RESTful API Direct Rotaları (/api/jobs)

const express = require('express');
const router = express.Router();
const apiJobPostingController = require('../controllers/apiJobPostingController');

// 📖 [DIRECT] GET /api/jobs -> Tüm iş ilanlarını JSON olarak listele (filtreler: is_active, employment_type, experience_level)
router.get('/', apiJobPostingController.getAll);

// 🔍 [DIRECT] GET /api/jobs/:id -> Belirli bir iş ilanını JSON olarak getir
router.get('/:id', apiJobPostingController.getById);

// ➕ [DIRECT] POST /api/jobs -> Yeni iş ilanı ekle
router.post('/', apiJobPostingController.create);

// ✏️ [DIRECT] PUT /api/jobs/:id -> İlanı tamamen güncelle
router.put('/:id', apiJobPostingController.update);

// 🩹 [DIRECT] PATCH /api/jobs/:id -> İlanı kısmen güncelle
router.patch('/:id', apiJobPostingController.patch);

// 🗑️ [DIRECT] DELETE /api/jobs/:id -> İlanı sil
router.delete('/:id', apiJobPostingController.delete);

// ==========================================
// 🔗 NESTED ROTALAR (İÇ İÇE GEÇMİŞ ROTALAR)
// ==========================================

const apiApplicationController = require('../controllers/apiApplicationController');

// 📝 [NESTED] GET /api/jobs/:id/applications -> Belirli bir iş ilanına yapılan başvuruları listele
router.get('/:id/applications', apiApplicationController.getByJob);

// 📝 [NESTED] POST /api/jobs/:id/applications -> Belirli bir iş ilanına yeni başvuru yap
router.post('/:id/applications', apiApplicationController.createForJob);

module.exports = router;
