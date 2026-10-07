// routes/userRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Rotaları (Full CRUD View Layer)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 📖 1. [READ ALL] GET /users -> Tüm kullanıcıları listeleyen View
router.get('/', userController.getAll);

// ➕ 2. [CREATE] POST /users -> Formdan gelen yeni kullanıcıyı oluşturan rota
router.post('/', userController.create);

// ✏️ 3. [UPDATE VIEW] GET /users/:id/edit -> Kullanıcıyı düzenleme formunu gösteren View
router.get('/:id/edit', userController.editForm);

// ✏️ 4. [UPDATE ACTION] POST /users/:id/update -> Güncellenen veriyi işleyen rota
router.post('/:id/update', userController.update);

// 🗑️ 5. [DELETE ACTION] POST /users/:id/delete -> Kullanıcıyı silen rota
router.post('/:id/delete', userController.delete);

// 🔍 6. [READ ONE] GET /users/:id -> Tek bir kullanıcının detay View'ı
router.get('/:id', userController.getById);

module.exports = router;
