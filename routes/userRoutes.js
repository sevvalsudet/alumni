// routes/userRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Rotaları (Full CRUD View Layer)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin, requireSelfOrAdmin } = require('../middlewares/authMiddleware');

// 📖 1. [READ ALL] GET /users -> Tüm kullanıcıları listeleyen View
router.get('/', userController.getAll);

// ➕ 2. [CREATE] POST /users -> Formdan gelen yeni kullanıcıyı oluşturan rota
router.post('/', userController.create);

// ✏️ 3. [UPDATE VIEW] GET /users/:id/edit -> Kullanıcıyı düzenleme formunu gösteren View (Kendi profili veya Admin)
router.get('/:id/edit', requireAuth, requireSelfOrAdmin('id'), userController.editForm);

// ✏️ 4. [UPDATE ACTION] POST /users/:id/update -> Güncellenen veriyi işleyen rota (Kendi profili veya Admin)
router.post('/:id/update', requireAuth, requireSelfOrAdmin('id'), userController.update);

// 🗑️ 5. [DELETE ACTION] POST /users/:id/delete -> Kullanıcıyı silen rota (Sadece Admin)
router.post('/:id/delete', requireAuth, requireAdmin, userController.delete);

// 🔗 [NESTED VIEW] GET /users/:id/jobs -> Kullanıcının yayınladığı iş ilanlarını gösteren View
const jobPostingController = require('../controllers/jobPostingController');
router.get('/:id/jobs', jobPostingController.getUserJobs);

// 🔗 [NESTED VIEW] GET /users/:id/applications -> Kullanıcının yaptığı iş başvurularını gösteren View (Kendi başvuruları veya Admin)
const applicationController = require('../controllers/applicationController');
router.get('/:id/applications', requireAuth, requireSelfOrAdmin('id'), applicationController.getUserApplications);

// 🔍 6. [READ ONE] GET /users/:id -> Tek bir kullanıcının detay View'ı
router.get('/:id', userController.getById);

module.exports = router;
