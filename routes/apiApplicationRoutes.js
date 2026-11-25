// routes/apiApplicationRoutes.js
// 🎓 MVC Mimarisi - RESTful API Direct Rotaları (/api/applications)

const express = require('express');
const router = express.Router();
const apiApplicationController = require('../controllers/apiApplicationController');
const { requireAuth, requireAlumniOrAdmin } = require('../middlewares/authMiddleware');

// 📖 [DIRECT] GET /api/applications -> Tüm başvuruları JSON olarak listele (filtreler: status, job_id, user_id)
router.get('/', apiApplicationController.getAll);

// 🔍 [DIRECT] GET /api/applications/:id -> Belirli bir başvuruyu JSON olarak getir
router.get('/:id', apiApplicationController.getById);

// ➕ [DIRECT] POST /api/applications -> Yeni başvuru oluştur (Oturum zorunlu)
router.post('/', requireAuth, apiApplicationController.create);

// ✏️ [DIRECT] PUT /api/applications/:id -> Başvuruyu tamamen güncelle (Sadece Alumni ve Admin)
router.put('/:id', requireAuth, requireAlumniOrAdmin, apiApplicationController.update);

// 🩹 [DIRECT] PATCH /api/applications/:id -> Başvuruyu kısmen güncelle (Sadece Alumni ve Admin)
router.patch('/:id', requireAuth, requireAlumniOrAdmin, apiApplicationController.patch);

// 🗑️ [DIRECT] DELETE /api/applications/:id -> Başvuruyu sil (Oturum zorunlu)
router.delete('/:id', requireAuth, apiApplicationController.delete);

module.exports = router;
