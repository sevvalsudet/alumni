// routes/userRoutes.js
// 🎓 MVC Mimarisi - Web Arayüzü Rotaları (View Layer)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 📖 GET /users -> Listing (Kullanıcıları listeleyen View katmanı)
router.get('/', userController.getAll);

// ➕ POST /users -> Creating (Formdan gelen veriyi oluşturan rota)
router.post('/', userController.create);

// 🔍 GET /users/:id -> Tek bir kullanıcının detay View'ı
router.get('/:id', userController.getById);

module.exports = router;
