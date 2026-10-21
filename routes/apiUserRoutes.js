// routes/apiUserRoutes.js
// 🎓 MVC Mimarisi - RESTful API Rotaları (JSON)

const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/apiUserController');

// GET /api/users -> Tüm kullanıcıları JSON olarak listele
router.get('/', ApiUserController.getAll);

// GET /api/users/:id -> Belirli bir kullanıcıyı JSON olarak getir
router.get('/:id', ApiUserController.getById);

// POST /api/users -> Yeni kullanıcı ekle
router.post('/', ApiUserController.create);

// PUT /api/users/:id -> Kullanıcıyı tamamen güncelle
router.put('/:id', ApiUserController.update);

// PATCH /api/users/:id -> Kullanıcıyı kısmen güncelle
router.patch('/:id', ApiUserController.patch);

// DELETE /api/users/:id -> Kullanıcıyı sil
router.delete('/:id', ApiUserController.delete);

// ==========================================
// 🔗 NESTED ROTALAR (İÇ İÇE GEÇMİŞ ROTALAR)
// ==========================================

const UserModel = require('../models/userModel');
const apiJobPostingController = require('../controllers/apiJobPostingController');
const AnnouncementModel = require('../models/announcementModel');

// 💼 [NESTED M:N] GET /api/users/:id/jobs -> User (m) <--- application ---> (n) Job-Postings
// 🎓 Tahtadaki Mantık: User ile Job-Postings doğrudan bağlı DEĞİLDİR, application üzerinden bağlıdır.
router.get('/:id/jobs', async (req, res) => {
    try {
        const jobs = await UserModel.getAppliedJobs(req.params.id);
        res.json({
            success: true,
            user_id: Number(req.params.id),
            relationship: "m:n through application",
            count: jobs.length,
            data: jobs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 💼 [NESTED] GET /api/users/:id/posted-jobs -> Kullanıcının yayınladığı ilanlar
router.get('/:id/posted-jobs', apiJobPostingController.getByUser);
router.post('/:id/posted-jobs', apiJobPostingController.createForUser);

// 📢 [NESTED] GET /api/users/:id/announcements -> Belirli bir kullanıcının yazdığı duyuruları listele
router.get('/:id/announcements', async (req, res) => {
    try {
        const announcements = await AnnouncementModel.findByAuthor(req.params.id);
        res.json({
            success: true,
            user_id: Number(req.params.id),
            count: announcements.length,
            data: announcements
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 📝 [NESTED] GET /api/users/:id/applications -> Belirli bir kullanıcının yaptığı başvuruları listele
const apiApplicationController = require('../controllers/apiApplicationController');
router.get('/:id/applications', apiApplicationController.getByUser);

module.exports = router;
