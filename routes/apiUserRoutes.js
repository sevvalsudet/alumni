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

module.exports = router;
