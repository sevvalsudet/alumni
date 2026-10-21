// routes/apiApplicationRoutes.js
// 🎓 MVC Mimarisi - RESTful API Direct Rotaları (/api/applications)

const express = require('express');
const router = express.Router();
const apiApplicationController = require('../controllers/apiApplicationController');

// 📖 [DIRECT] GET /api/applications -> Tüm başvuruları JSON olarak listele (filtreler: status, job_id, user_id)
router.get('/', apiApplicationController.getAll);

// 🔍 [DIRECT] GET /api/applications/:id -> Belirli bir başvuruyu JSON olarak getir
router.get('/:id', apiApplicationController.getById);

// ➕ [DIRECT] POST /api/applications -> Yeni başvuru oluştur
router.post('/', apiApplicationController.create);

// ✏️ [DIRECT] PUT /api/applications/:id -> Başvuruyu tamamen güncelle
router.put('/:id', apiApplicationController.update);

// 🩹 [DIRECT] PATCH /api/applications/:id -> Başvuruyu kısmen güncelle (özellikle status)
router.patch('/:id', apiApplicationController.patch);

// 🗑️ [DIRECT] DELETE /api/applications/:id -> Başvuruyu sil
router.delete('/:id', apiApplicationController.delete);

module.exports = router;
