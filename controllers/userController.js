// controllers/userController.js
// 🎓 MVC - Web UI Controller Katmanı (userController)
// HTML View katmanını (EJS şablonlarını) render eder.

const UserModel = require('../models/userModel');

const userController = {
    // 📖 1. LISTING: GET /users -> users.ejs View şablonunu render eder
    getAll: (req, res) => {
        const users = UserModel.findAll();
        res.render('users', { users });
    },

    // 🔍 GET /users/:id -> userDetail.ejs View şablonunu render eder
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

    // ➕ 2. CREATING: POST /users -> Formdan gelen yeni kullanıcıyı kaydeder ve listeye yönlendirir
    create: (req, res) => {
        const { name, role, department, company } = req.body;
        if (name && role) {
            UserModel.create({ name, role, department, company });
        }
        // Kaydettikten sonra tekrar listing (GET /users) sayfasına yönlendir
        res.redirect('/users');
    },

    // ✏️ [UPDATE] Web üzerinden güncelleme
    update: (req, res) => {
        UserModel.update(req.params.id, req.body);
        res.redirect('/users/' + req.params.id);
    },

    // 🗑️ [DELETE] Web üzerinden silme
    delete: (req, res) => {
        UserModel.delete(req.params.id);
        res.redirect('/users');
    }
};

module.exports = userController;
