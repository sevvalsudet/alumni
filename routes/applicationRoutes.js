// routes/applicationRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Direct Rotaları (/applications)

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, requireAlumniOrAdmin } = require('../middlewares/authMiddleware');

// 📖 [DIRECT] GET /applications -> Tüm başvuruları listeleyen View
router.get('/', applicationController.getAll);

// ➕ [DIRECT] POST /applications -> Formdan yeni başvuru ekleyen rota (Oturum zorunlu)
router.post('/', requireAuth, applicationController.create);

// 🔍 [DIRECT] GET /applications/:id -> Tek bir başvurunun detay View'ı
router.get('/:id', applicationController.getById);

// 🩹 [DIRECT] POST /applications/:id/status -> Başvuru durumunu güncelleyen rota (Alumni veya Admin)
router.post('/:id/status', requireAuth, requireAlumniOrAdmin, applicationController.updateStatus);

// 🗑️ [DIRECT] POST /applications/:id/delete -> Başvuruyu silen rota (Oturum zorunlu)
router.post('/:id/delete', requireAuth, applicationController.delete);

module.exports = router;
