// controllers/userController.js
// 🎓 MVC - Web UI Controller Katmanı (userController)
// Tarayıcıdan erişilen görsel sayfalar (HTML) için CRUD ve listeleme işlemlerini yönetir.

const UserModel = require('../models/userModel');

const userController = {
    // 📖 [READ - ALL] GET /users -> Tüm kullanıcıları listeleyen web sayfası
    getAll: (req, res) => {
        const users = UserModel.findAll();
        const userListHtml = users
            .map(u => `<li><strong>${u.name}</strong> - ${u.role} (${u.department || u.company || 'Belirtilmedi'}) <a href="/users/${u.id}">[Detay]</a></li>`)
            .join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <title>Users - Alumni System</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; background-color: #f4f6f9; }
                    h1 { color: #2c3e50; }
                    ul { line-height: 2.2; font-size: 16px; }
                    a { color: #3498db; text-decoration: none; font-weight: bold; }
                    .badge { background: #27ae60; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>👥 Kullanıcı Listesi <span class="badge">userController.getAll</span></h1>
                <p>Bu sayfa <strong>userController</strong> tarafından Model katmanından veriler çekilerek HTML olarak render edilmiştir.</p>
                <ul>${userListHtml}</ul>
                <p><small>Aynı veriyi JSON olarak almak için API Controller'a gidin: <a href="/api/users" target="_blank">/api/users</a></small></p>
                <br>
                <a href="/">← Ana Sayfaya Dön</a>
            </body>
            </html>
        `);
    },

    // 🔍 [READ - ONE] GET /users/:id -> Tek bir kullanıcının detay web sayfası
    getById: (req, res) => {
        const user = UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send(`
                <h1>404 - Kullanıcı Bulunamadı</h1>
                <p>${req.params.id} ID numaralı kullanıcı sistemde kayıtlı değil.</p>
                <a href="/users">← Kullanıcı Listesine Dön</a>
            `);
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <title>${user.name} - Kullanıcı Detayı</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; background-color: #f4f6f9; }
                    .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 450px; }
                    h2 { color: #2c3e50; margin-top: 0; }
                    p { margin: 10px 0; color: #555; font-size: 16px; }
                    a { color: #3498db; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>👤 ${user.name}</h2>
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Rol:</strong> ${user.role}</p>
                    <p><strong>Bölüm:</strong> ${user.department || 'Belirtilmedi'}</p>
                    <p><strong>Şirket:</strong> ${user.company || 'Belirtilmedi'}</p>
                    <hr>
                    <a href="/users">← Tüm Kullanıcılara Dön</a>
                </div>
            </body>
            </html>
        `);
    },

    // ➕ [CREATE] Web arayüzünden kullanıcı ekleme
    create: (req, res) => {
        UserModel.create(req.body);
        res.redirect('/users');
    },

    // ✏️ [UPDATE] Web arayüzünden kullanıcı güncelleme
    update: (req, res) => {
        UserModel.update(req.params.id, req.body);
        res.redirect('/users/' + req.params.id);
    },

    // 🗑️ [DELETE] Web arayüzünden kullanıcı silme
    delete: (req, res) => {
        UserModel.delete(req.params.id);
        res.redirect('/users');
    }
};

module.exports = userController;
