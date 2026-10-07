// controllers/userController.js
// 🎓 MVC - Web UI Controller Katmanı (userController)
// Tüm CRUD işlemlerini EJS View şablonları ile yönetir.

const UserModel = require('../models/userModel');

const userController = {
    // 📖 1. [READ ALL] GET /users -> Tüm kullanıcıları listeleyen View (users.ejs)
    getAll: (req, res) => {
        const users = UserModel.findAll();
        res.render('users', { users });
    },

    // 🔍 2. [READ ONE] GET /users/:id -> Tek bir kullanıcının detay View'ı (userDetail.ejs)
    getById: (req, res) => {
        const user = UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send(`
                <h1>404 - Kullanıcı Bulunamadı</h1>
                <p>${req.params.id} ID numaralı kullanıcı bulunamadı.</p>
                <a href="/users">← Kullanıcı Listesine Dön</a>
            `);
        }
        res.render('userDetail', { user });
    },

    // ➕ 3. [CREATE] POST /users -> Formdan gelen yeni kullanıcıyı kaydeder ve listeye yönlendirir
    create: (req, res) => {
        const { name, role, department, company } = req.body;
        if (name && role) {
            UserModel.create({ name, role, department, company });
        }
        res.redirect('/users');
    },

    // ✏️ 4. [UPDATE FORM] GET /users/:id/edit -> Kullanıcıyı düzenleme View'ını gösterir (userEdit.ejs)
    editForm: (req, res) => {
        const user = UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send(`
                <h1>404 - Kullanıcı Bulunamadı</h1>
                <p>${req.params.id} ID numaralı kullanıcı bulunamadı.</p>
                <a href="/users">← Kullanıcı Listesine Dön</a>
            `);
        }
        res.render('userEdit', { user });
    },

    // ✏️ 5. [UPDATE ACTION] POST /users/:id/update -> Güncellenen verileri kaydeder ve listeye yönlendirir
    update: (req, res) => {
        const { name, role, department, company } = req.body;
        UserModel.update(req.params.id, { name, role, department, company });
        res.redirect('/users');
    },

    // 🗑️ 6. [DELETE ACTION] POST /users/:id/delete -> Kullanıcıyı siler ve listeye yönlendirir
    delete: (req, res) => {
        UserModel.delete(req.params.id);
        res.redirect('/users');
    }
};

module.exports = userController;
