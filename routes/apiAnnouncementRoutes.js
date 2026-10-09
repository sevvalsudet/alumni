// routes/apiAnnouncementRoutes.js
// REST API Rotaları — /api/announcements prefix'i ile kullanılır

const express = require('express');
const router = express.Router();
const apiAnnouncementController = require('../controllers/apiAnnouncementController');

// GET    /api/announcements       → Tüm duyuruları listele
router.get('/', apiAnnouncementController.getAll);

// GET    /api/announcements/:id   → Belirli duyuruyu getir
router.get('/:id', apiAnnouncementController.getById);

// POST   /api/announcements       → Yeni duyuru oluştur
router.post('/', apiAnnouncementController.create);

// PUT    /api/announcements/:id   → Duyuruyu tamamen güncelle
router.put('/:id', apiAnnouncementController.update);

// PATCH  /api/announcements/:id   → Duyuruyu kısmen güncelle
router.patch('/:id', apiAnnouncementController.patch);

// DELETE /api/announcements/:id   → Duyuruyu sil
router.delete('/:id', apiAnnouncementController.delete);

module.exports = router;
