// routes/jobPostingRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Direct Rotaları (/jobs)

const express = require('express');
const router = express.Router();
const jobPostingController = require('../controllers/jobPostingController');

// 📖 [DIRECT] GET /jobs -> Tüm iş ilanlarını listeleyen View
router.get('/', jobPostingController.getAll);

// ➕ [DIRECT] POST /jobs -> Yeni iş ilanı oluşturan rota
router.post('/', jobPostingController.create);

// 🗑️ [DIRECT] POST /jobs/:id/delete -> İş ilanını silen rota
router.post('/:id/delete', jobPostingController.delete);

// 🔍 [DIRECT] GET /jobs/:id -> Tek bir iş ilanının detay View'ı
router.get('/:id', jobPostingController.getById);

// ==========================================
// 🔗 NESTED ROTALAR (İÇ İÇE GEÇMİŞ ROTALAR)
// ==========================================

const applicationController = require('../controllers/applicationController');

// 📝 [NESTED] GET /jobs/:id/applications -> Bu ilana gelen başvuruları gösteren sayfa
router.get('/:id/applications', applicationController.getJobApplications);

module.exports = router;
