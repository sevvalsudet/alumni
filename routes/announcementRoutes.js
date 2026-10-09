// routes/announcementRoutes.js
// Web HTML Rotaları — /announcements prefix'i ile kullanılır
// NOT: HTML formlar sadece GET ve POST destekler, bu yüzden
//      update ve delete için POST kullanıyoruz (/update ve /delete ile)

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// GET  /announcements           → Tüm duyuruları listele + oluşturma formu
router.get('/', announcementController.getAll);

// POST /announcements           → Yeni duyuru oluştur (form submit)
router.post('/', announcementController.create);

// GET  /announcements/:id/edit  → Düzenleme formunu göster
router.get('/:id/edit', announcementController.editForm);

// POST /announcements/:id/update → Düzenleme formundan güncelle (HTML form PUT yapamaz)
router.post('/:id/update', announcementController.update);

// POST /announcements/:id/delete → Duyuruyu sil (HTML form DELETE yapamaz)
router.post('/:id/delete', announcementController.delete);

// GET  /announcements/:id       → Duyuru detay sayfası (en sona koy, diğerleriyle çakışmasın)
router.get('/:id', announcementController.getById);

module.exports = router;
