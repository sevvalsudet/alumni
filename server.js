const express = require('express');
const swaggerUi = require('swagger-ui-express');
const UserModel = require('./models/userModel');
const app = express();
const PORT = 3000;


// Gelen JSON istek gövdelerini (body) okuyabilmek için middleware
app.use(express.json());

// ==========================================
// 🎓 TAHTADAKİ 6 ROTA (ROUTES)
// ==========================================

// ① GET /ok -> Sunucunun çalıştığını test eden rota ("ok" döner)
// (Not: 5. maddede '/' ana sayfa yapıldığı için bu testi '/ok' olarak da yapabilirsiniz)
app.get('/ok', (req, res) => {
    res.send('ok');
});

// ② GET /hello -> Ekrana "Hello, World!" yazdırır
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

// ③ GET /hello/{name} -> Dinamik isim parametresi alır
// Örnek test: http://localhost:3000/hello/emre veya http://localhost:3000/hello/sevval
app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name}!`);
});

// ④ GET /sum/{number1}/{number2} -> URL'den gelen iki sayıyı toplar
// Örnek test: http://localhost:3000/sum/5/10 -> Ekranda 15 yazar
app.get('/sum/:number1/:number2', (req, res) => {
    const num1 = Number(req.params.number1);
    const num2 = Number(req.params.number2);
    const result = num1 + num2;
    res.send(`Sonuç: ${result}`);
});

// ⑤ GET / -> Geçici bir Ana Sayfa (temporary one main page)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>Alumni Tracking System - Ana Sayfa</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f6f9; }
                h1 { color: #2c3e50; }
                p { color: #7f8c8d; font-size: 18px; }
                .nav-links a { margin: 0 10px; color: #3498db; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🎓 Alumni Tracking System</h1>
            <p>Hoş Geldiniz! Bu projenin geçici ana sayfasıdır (Temporary Main Page).</p>
            <div class="nav-links">
                <a href="/about">Hakkımızda</a> | 
                <a href="/hello">Hello</a> | 
                <a href="/hello/sevval">Kişisel Selamlama</a> | 
                <a href="/sum/10/25">Toplama (10+25)</a> | 
                <a href="/api/health" target="_blank">Health (JSON)</a> | 
                <a href="/users">Kullanıcılar (HTML)</a> | 
                <a href="/api/users" target="_blank">Kullanıcılar (JSON)</a> | 
                <a href="/api/swagger" target="_blank" style="color: #27ae60;">📖 Swagger UI</a>
            </div>
        </body>
        </html>
    `);
});

// ⑥ GET /about -> Geçici bir Hakkımızda Sayfası (temp. about page)
app.get('/about', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>About - Alumni Tracking System</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f6f9; }
                h1 { color: #2c3e50; }
                p { color: #555; font-size: 18px; line-height: 1.6; }
                a { color: #3498db; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>ℹ️ Hakkımızda (About Page)</h1>
            <p>Bu proje mezun takip sistemi (Alumni Tracking System) için geliştirilmektedir.</p>
            <a href="/">← Ana Sayfaya Dön</a>
        </body>
        </html>
    `);
});

// ⑦ GET /api/health -> JSON formatında sunucu sağlık durumunu döner
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        message: "Alumni API is healthy and running",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// 💡 HOCANIN BAHSETTİĞİ MANTIK: URL/users vs URL/api/...
// ==========================================

// URL/api/users (GET) -> Tüm kullanıcıları JSON formatında listeler (Model: findAll)
app.get('/api/users', (req, res) => {
    res.json(UserModel.findAll());
});

// URL/api/users/:id (GET) -> Tek bir kullanıcıyı ID'ye göre getirir (Model: findById)
app.get('/api/users/:id', (req, res) => {
    const user = UserModel.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `Hata: ${req.params.id} ID numaralı kullanıcı bulunamadı!`
        });
    }

    res.json(user);
});

// 🎯 POST /api/users -> Yeni kullanıcı ekler (Model: create)
app.post('/api/users', (req, res) => {
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
});

// 🎯 PUT /api/users/:id -> Kullanıcıyı TAMAMEN güncelle (Model: update)
app.put('/api/users/:id', (req, res) => {
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
});

// 🎯 PATCH /api/users/:id -> Kullanıcıyı KISMEN güncelle (Model: patch)
app.patch('/api/users/:id', (req, res) => {
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
});

// 🎯 DELETE /api/users/:id -> Kullanıcıyı sistemden SİL (Model: delete)
app.delete('/api/users/:id', (req, res) => {
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
});




// URL/users -> Görsel HTML sayfası döner (Tarayıcıda kullanıcıların listelendiği sayfa)
app.get('/users', (req, res) => {
    const userListHtml = UserModel.findAll()
        .map(u => `<li><strong>${u.name}</strong> - ${u.role} (${u.department || u.company || 'Belirtilmedi'})</li>`)
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
                ul { line-height: 2; font-size: 16px; }
                a { color: #3498db; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>👥 Kullanıcı Listesi (Web Sayfası)</h1>
            <p>Bu sayfa <code>/users</code> rotasından HTML olarak dönmektedir.</p>
            <ul>${userListHtml}</ul>
            <p><small>Aynı veriyi JSON olarak almak için: <a href="/api/users" target="_blank">/api/users</a></small></p>
            <br>
            <a href="/">← Ana Sayfaya Dön</a>
        </body>
        </html>
    `);
});

// ==========================================
// 📖 SWAGGER / OPENAPI DOKÜMANTASYONU (GET /api/swagger)
// ==========================================
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "🎓 Alumni Tracking System API",
        version: "1.0.0",
        description: "Alumni Tracking projesi için interaktif RESTful API dokümantasyonu."
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Yerel Geliştirme Sunucusu (Local Server)"
        }
    ],
    paths: {
        "/api/health": {
            get: {
                summary: "Sunucu Sağlık Kontrolü (Health Check)",
                description: "Sunucunun ayakta olup olmadığını JSON olarak döner.",
                responses: {
                    "200": {
                        description: "Sunucu sağlıklı çalışıyor"
                    }
                }
            }
        },
        "/api/users": {
            get: {
                summary: "Tüm Kullanıcıları Listele (List All Users)",
                description: "Sistemde kayıtlı tüm mezun ve öğrencileri döner.",
                responses: {
                    "200": {
                        description: "Kullanıcı listesi başarıyla getirildi"
                    }
                }
            },
            post: {
                summary: "Yeni Kullanıcı Ekle (Create User)",
                description: "Sisteme yeni bir mezun veya öğrenci ekler.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "role"],
                                properties: {
                                    name: { type: "string", example: "Büşra Çelik" },
                                    role: { type: "string", example: "Alumni" },
                                    department: { type: "string", example: "Software Engineering" },
                                    company: { type: "string", example: "Amazon" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Kullanıcı başarıyla oluşturuldu"
                    },
                    "400": {
                        description: "Eksik parametre hatası"
                    }
                }
            }
        },
        "/api/users/{id}": {
            get: {
                summary: "Belirli Kullanıcıyı Getir (Get User by ID)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        example: 1
                    }
                ],
                responses: {
                    "200": { description: "Kullanıcı bulundu" },
                    "404": { description: "Kullanıcı bulunamadı" }
                }
            },
            put: {
                summary: "Kullanıcıyı Tamamen Güncelle (Full Update - PUT)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        example: 1
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string", example: "Şevval Sude Top" },
                                    role: { type: "string", example: "Senior Engineer" },
                                    department: { type: "string", example: "Computer Engineering" },
                                    company: { type: "string", example: "Google" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Kullanıcı güncellendi" },
                    "404": { description: "Kullanıcı bulunamadı" }
                }
            },
            patch: {
                summary: "Kullanıcıyı Kısmen Güncelle (Partial Update - PATCH)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        example: 2
                    }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    company: { type: "string", example: "Apple" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Kullanıcı kısmen güncellendi" },
                    "404": { description: "Kullanıcı bulunamadı" }
                }
            },
            delete: {
                summary: "Kullanıcıyı Sil (Delete User)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        example: 2
                    }
                ],
                responses: {
                    "200": { description: "Kullanıcı başarıyla silindi" },
                    "404": { description: "Kullanıcı bulunamadı" }
                }
            }
        }
    }
};

// Swagger Arayüzü: /api/swagger ve /api/docs üzerinden erişilebilir
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Swagger JSON verisi: /api/swagger.json
app.get('/api/swagger.json', (req, res) => {
    res.json(swaggerDocument);
});

// Sunucuyu 3000 portunda dinlemeye başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`📖 Swagger Dokümantasyonu: http://localhost:${PORT}/api/swagger`);
});


