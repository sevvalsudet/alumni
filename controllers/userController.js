// controllers/userController.js
// 🎓 MVC - Web UI Controller Katmanı (userController)
// Tüm CRUD işlemlerini async olarak veritabanı (MySQL) üzerinden EJS View şablonları ile yönetir.

const UserModel = require('../models/userModel');

const userController = {
    // 📖 1. [READ ALL] GET /users -> Tüm kullanıcıları listeleyen View (users.ejs)
    getAll: async (req, res) => {
        try {
            const users = await UserModel.findAll();
            res.render('users', { users });
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1><p>Kullanıcılar yüklenirken bir hata oluştu.</p>');
        }
    },

    // 🔍 2. [READ ONE] GET /users/:id -> Tek bir kullanıcının detay View'ı (userDetail.ejs)
    getById: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send(`
                    <h1>404 - Kullanıcı Bulunamadı</h1>
                    <p>${req.params.id} ID numaralı kullanıcı bulunamadı.</p>
                    <a href="/users">← Kullanıcı Listesine Dön</a>
                `);
            }
            res.render('userDetail', { user });
        } catch (err) {
            console.error('Error fetching user by id:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // ➕ 3. [CREATE] POST /users -> Formdan gelen yeni kullanıcıyı kaydeder ve listeye yönlendirir
    create: async (req, res) => {
        try {
            const { name, role, department, company } = req.body;
            if (name && role) {
                await UserModel.create({ name, role, department, company });
            }
            res.redirect('/users');
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).send('<h1>500 - Kullanıcı eklenirken hata oluştu</h1>');
        }
    },

    // ✏️ 4. [UPDATE FORM] GET /users/:id/edit -> Kullanıcıyı düzenleme View'ını gösterir (userEdit.ejs)
    editForm: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send(`
                    <h1>404 - Kullanıcı Bulunamadı</h1>
                    <p>${req.params.id} ID numaralı kullanıcı bulunamadı.</p>
                    <a href="/users">← Kullanıcı Listesine Dön</a>
                `);
            }
            res.render('userEdit', { user });
        } catch (err) {
            console.error('Error loading edit form:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // ✏️ 5. [UPDATE ACTION] POST /users/:id/update -> Güncellenen verileri kaydeder ve listeye yönlendirir
    update: async (req, res) => {
        try {
            const { name, role, department, company } = req.body;
            await UserModel.update(req.params.id, { name, role, department, company });
            res.redirect('/users');
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).send('<h1>500 - Kullanıcı güncellenirken hata oluştu</h1>');
        }
    },

    // 🗑️ 6. [DELETE ACTION] POST /users/:id/delete -> Kullanıcıyı siler ve listeye yönlendirir
    delete: async (req, res) => {
        try {
            await UserModel.delete(req.params.id);
            res.redirect('/users');
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('<h1>500 - Kullanıcı silinirken hata oluştu</h1>');
        }
    }
};

module.exports = userController;
