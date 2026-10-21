// controllers/apiUserController.js
// 🎓 MVC - API Controller Katmanı (ApiUserController)
// RESTful API rotaları için JSON formatında yanıtlar döner ve veritabanı CRUD işlemlerini yönetir.

const UserModel = require('../models/userModel');

const ApiUserController = {
    // 📖 [READ - ALL] GET /api/users
    getAll: async (req, res) => {
        try {
            const users = await UserModel.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🔍 [READ - ONE] GET /api/users/:id
    // 🎓 Tahtadaki Mantık: GET /api/users/1 -> User.find(1, { include: 'jobs' })
    getById: async (req, res) => {
        try {
            const includeJobs = req.query.include === 'jobs' || req.query.include === 'job-postings';
            const user = await UserModel.findById(req.params.id, {
                include: includeJobs ? 'jobs' : undefined
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
                });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ➕ [CREATE] POST /api/users
    create: async (req, res) => {
        try {
            const { name, role } = req.body;
            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Hata: 'name' ve 'role' alanları zorunludur!"
                });
            }
            const newUser = await UserModel.create(req.body);
            res.status(201).json({
                success: true,
                message: "Kullanıcı başarıyla eklendi!",
                user: newUser
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ✏️ [UPDATE - PUT] PUT /api/users/:id (Tam Güncelleme)
    update: async (req, res) => {
        try {
            const updatedUser = await UserModel.update(req.params.id, req.body);
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
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🩹 [UPDATE - PATCH] PATCH /api/users/:id (Kısmi Güncelleme)
    patch: async (req, res) => {
        try {
            const patchedUser = await UserModel.patch(req.params.id, req.body);
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
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🗑️ [DELETE] DELETE /api/users/:id
    delete: async (req, res) => {
        try {
            const deletedUser = await UserModel.delete(req.params.id);
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
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = ApiUserController;
