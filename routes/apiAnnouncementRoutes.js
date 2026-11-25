// routes/apiAnnouncementRoutes.js
// REST API Rotaları — /api/announcements prefix'i ile kullanılır

const express = require('express');
const router = express.Router();
const apiAnnouncementController = require('../controllers/apiAnnouncementController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// GET    /api/announcements       → Tüm duyuruları listele
router.get('/', apiAnnouncementController.getAll);

// GET    /api/announcements/:id   → Belirli duyuruyu getir
router.get('/:id', apiAnnouncementController.getById);

// POST   /api/announcements       → Yeni duyuru oluştur (Sadece Admin)
router.post('/', requireAuth, requireAdmin, apiAnnouncementController.create);

// PUT    /api/announcements/:id   → Duyuruyu tamamen güncelle (Sadece Admin)
router.put('/:id', requireAuth, requireAdmin, apiAnnouncementController.update);

// PATCH  /api/announcements/:id   → Duyuruyu kısmen güncelle (Sadece Admin)
router.patch('/:id', requireAuth, requireAdmin, apiAnnouncementController.patch);

// DELETE /api/announcements/:id   → Duyuruyu sil (Sadece Admin)
router.delete('/:id', requireAuth, requireAdmin, apiAnnouncementController.delete);

module.exports = router;
