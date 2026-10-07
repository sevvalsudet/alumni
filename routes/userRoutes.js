// routes/userRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Rotaları (HTML)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users -> Tüm kullanıcıları listeleyen web sayfası
router.get('/', userController.getAll);

// GET /users/:id -> Tek bir kullanıcının detay web sayfası
router.get('/:id', userController.getById);

module.exports = router;
