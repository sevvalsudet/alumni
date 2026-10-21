// routes/applicationRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Direct Rotaları (/applications)

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// 📖 [DIRECT] GET /applications -> Tüm başvuruları listeleyen View
router.get('/', applicationController.getAll);

// ➕ [DIRECT] POST /applications -> Formdan yeni başvuru ekleyen rota
router.post('/', applicationController.create);

// 🔍 [DIRECT] GET /applications/:id -> Tek bir başvurunun detay View'ı
router.get('/:id', applicationController.getById);

// 🩹 [DIRECT] POST /applications/:id/status -> Başvuru durumunu güncelleyen rota
router.post('/:id/status', applicationController.updateStatus);

// 🗑️ [DIRECT] POST /applications/:id/delete -> Başvuruyu silen rota
router.post('/:id/delete', applicationController.delete);

module.exports = router;
