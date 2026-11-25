// routes/announcementRoutes.js
// Web HTML Rotaları — /announcements prefix'i ile kullanılır
// NOT: HTML formlar sadece GET ve POST destekler, bu yüzden
//      update ve delete için POST kullanıyoruz (/update ve /delete ile)

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// GET  /announcements           → Tüm duyuruları listele + oluşturma formu
router.get('/', announcementController.getAll);

// POST /announcements           → Yeni duyuru oluştur (Sadece Admin)
router.post('/', requireAuth, requireAdmin, announcementController.create);

// GET  /announcements/:id/edit  → Düzenleme formunu göster (Sadece Admin)
router.get('/:id/edit', requireAuth, requireAdmin, announcementController.editForm);

// POST /announcements/:id/update → Düzenleme formundan güncelle (Sadece Admin)
router.post('/:id/update', requireAuth, requireAdmin, announcementController.update);

// POST /announcements/:id/delete → Duyuruyu sil (Sadece Admin)
router.post('/:id/delete', requireAuth, requireAdmin, announcementController.delete);

// GET  /announcements/:id       → Duyuru detay sayfası (en sona koy, diğerleriyle çakışmasın)
router.get('/:id', announcementController.getById);

module.exports = router;
