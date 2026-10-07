// controllers/apiUserController.js
// 🎓 MVC - API Controller Katmanı (ApiUserController)
// RESTful API rotaları için JSON formatında yanıtlar döner ve CRUD işlemlerini yönetir.

const UserModel = require('../models/userModel');

const ApiUserController = {
    // 📖 [READ - ALL] GET /api/users
    getAll: (req, res) => {
        const users = UserModel.findAll();
        res.json(users);
    },

    // 🔍 [READ - ONE] GET /api/users/:id
    getById: (req, res) => {
        const user = UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
            });
        }
        res.json(user);
    },

    // ➕ [CREATE] POST /api/users
    create: (req, res) => {
        const { name, role } = req.body;
        if (!name || !role) {
            return res.status(400).json({
                success: false,
                message: "Hata: 'name' ve 'role' alanları zorunludur!"
            });
        }
        const newUser = UserModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "Kullanıcı başarıyla eklendi!",
            user: newUser
        });
    },

    // ✏️ [UPDATE - PUT] PUT /api/users/:id (Tam Güncelleme)
    update: (req, res) => {
        const updatedUser = UserModel.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
            });
        }
        res.json({
            success: true,
            message: `${req.params.id} ID'li kullanıcı başarıyla güncellendi (PUT)!`,
            user: updatedUser
        });
    },

    // 🩹 [UPDATE - PATCH] PATCH /api/users/:id (Kısmi Güncelleme)
    patch: (req, res) => {
        const patchedUser = UserModel.patch(req.params.id, req.body);
        if (!patchedUser) {
            return res.status(404).json({
                success: false,
                message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
            });
        }
        res.json({
            success: true,
            message: `${req.params.id} ID'li kullanıcı kısmen güncellendi (PATCH)!`,
            user: patchedUser
        });
    },

    // 🗑️ [DELETE] DELETE /api/users/:id
    delete: (req, res) => {
        const deletedUser = UserModel.delete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
            });
        }
        res.json({
            success: true,
            message: `${req.params.id} ID numaralı kullanıcı başarıyla silindi!`,
            deletedUser
        });
    }
};

module.exports = ApiUserController;
