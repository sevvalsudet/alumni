require('dotenv').config();
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/userRoutes');
const apiUserRoutes = require('./routes/apiUserRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const apiAnnouncementRoutes = require('./routes/apiAnnouncementRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const apiJobPostingRoutes = require('./routes/apiJobPostingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const apiApplicationRoutes = require('./routes/apiApplicationRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// 🎓 MVC Mimarisi - View Katmanı (EJS View Engine) Ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gelen JSON ve HTML Form verilerini (body) okuyabilmek için middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// ⑤ GET / -> Ana Sayfa (Main Dashboard)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alumni Tracking System - Ana Sayfa</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333; padding: 40px 20px; }
                .container { max-width: 950px; margin: 0 auto; }
                header { text-align: center; margin-bottom: 30px; }
                h1 { color: #2c3e50; font-size: 32px; margin-bottom: 8px; }
                p.subtitle { color: #7f8c8d; font-size: 16px; }
                .nav-bar { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 30px; background: white; padding: 12px 18px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .nav-bar a { color: #555; text-decoration: none; font-size: 14px; font-weight: 600; padding: 6px 14px; border-radius: 6px; transition: all 0.2s; }
                .nav-bar a:hover { background: #f0f4f8; color: #3498db; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 20px; }
                .module-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); text-align: center; text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .module-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
                .card-users { border-top: 4px solid #3498db; }
                .card-announcements { border-top: 4px solid #e74c3c; }
                .card-jobs { border-top: 4px solid #27ae60; }
                .card-apps { border-top: 4px solid #8e44ad; }
                .card-docs { border-top: 4px solid #f39c12; }
                .module-icon { font-size: 36px; margin-bottom: 12px; }
                .module-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 6px; }
                .module-desc { font-size: 13px; color: #64748b; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🎓 Alumni Tracking System</h1>
                    <p class="subtitle">Mezun ve Öğrenci Takip, İlan ve Başvuru Platformu</p>
                </header>
                <div class="nav-bar">
                    <a href="/users">👥 Kullanıcılar</a>
                    <a href="/announcements">📢 Duyurular</a>
                    <a href="/jobs">💼 İş İlanları</a>
                    <a href="/applications">📝 Başvurular</a>
                    <a href="/api/swagger" target="_blank" style="color: #27ae60;">📖 Swagger UI</a>
                    <a href="/about">ℹ️ Hakkımızda</a>
                </div>
                <div class="grid">
                    <a href="/users" class="module-card card-users">
                        <div class="module-icon">👥</div>
                        <div class="module-title">Kullanıcılar</div>
                        <div class="module-desc">Mezun ve öğrenci profillerini listeleyin, ekleyin ve yönetin.</div>
                    </a>
                    <a href="/announcements" class="module-card card-announcements">
                        <div class="module-icon">📢</div>
                        <div class="module-title">Duyurular</div>
                        <div class="module-desc">Üniversite ve kariyer duyurularını takip edin.</div>
                    </a>
                    <a href="/jobs" class="module-card card-jobs">
                        <div class="module-icon">💼</div>
                        <div class="module-title">İş İlanları</div>
                        <div class="module-desc">Kariyer fırsatlarını inceleyin ve yeni ilanlar yayınlayın.</div>
                    </a>
                    <a href="/applications" class="module-card card-apps">
                        <div class="module-icon">📝</div>
                        <div class="module-title">Başvurular</div>
                        <div class="module-desc">Adayların başvurularını ve süreç durumlarını inceleyin.</div>
                    </a>
                    <a href="/api/swagger" target="_blank" class="module-card card-docs">
                        <div class="module-icon">📖</div>
                        <div class="module-title">REST API</div>
                        <div class="module-desc">Swagger UI interaktif API dokümantasyonu ve testleri.</div>
                    </a>
                </div>
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

// ==========================================
// 💡 MVC ROUTER KATMANI (MODÜLER ROTALAR)
// ==========================================

// 🌐 1. Web UI Rotaları (HTML Views) -> routes/userRoutes.js
app.use('/users', userRoutes);

// ⚡ 2. RESTful API Rotaları (JSON) -> routes/apiUserRoutes.js
app.use('/api/users', apiUserRoutes);

// 📢 3. Announcements Web UI Rotaları (HTML Views) -> routes/announcementRoutes.js
app.use('/announcements', announcementRoutes);

// ⚡ 4. Announcements RESTful API Rotaları (JSON) -> routes/apiAnnouncementRoutes.js
app.use('/api/announcements', apiAnnouncementRoutes);

// 💼 5. Job Postings Web UI Rotaları (Direct) -> routes/jobPostingRoutes.js
app.use('/jobs', jobPostingRoutes);

// ⚡ 6. Job Postings RESTful API Rotaları (Direct) -> routes/apiJobPostingRoutes.js
app.use('/api/jobs', apiJobPostingRoutes);

// 📝 7. Applications Web UI Rotaları (Direct) -> routes/applicationRoutes.js
app.use('/applications', applicationRoutes);

// ⚡ 8. Applications RESTful API Rotaları (Direct) -> routes/apiApplicationRoutes.js
app.use('/api/applications', apiApplicationRoutes);



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
        },
        "/api/announcements": {
            get: {
                summary: "Tüm Duyuruları Listele (List All Announcements)",
                description: "Sistemde kayıtlı tüm duyuruları döner.",
                responses: {
                    "200": { description: "Duyuru listesi başarıyla getirildi" }
                }
            },
            post: {
                summary: "Yeni Duyuru Ekle (Create Announcement)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "content"],
                                properties: {
                                    title: { type: "string", example: "Yıllık Mezunlar Buluşması" },
                                    content: { type: "string", example: "2024 yılı mezun buluşması Aralık ayında yapılacaktır." },
                                    author: { type: "string", example: "Admin" },
                                    date: { type: "string", example: "2024-12-01" },
                                    category: { type: "string", example: "Event" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Duyuru başarıyla oluşturuldu" },
                    "400": { description: "Eksik parametre hatası" }
                }
            }
        },
        "/api/announcements/{id}": {
            get: {
                summary: "Belirli Duyuruyu Getir (Get Announcement by ID)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                responses: {
                    "200": { description: "Duyuru bulundu" },
                    "404": { description: "Duyuru bulunamadı" }
                }
            },
            put: {
                summary: "Duyuruyu Tamamen Güncelle (Full Update - PUT)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string", example: "Güncellenen Duyuru" },
                                    content: { type: "string", example: "Güncel içerik..." },
                                    author: { type: "string", example: "Admin" },
                                    date: { type: "string", example: "2024-12-15" },
                                    category: { type: "string", example: "General" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Duyuru güncellendi" },
                    "404": { description: "Duyuru bulunamadı" }
                }
            },
            patch: {
                summary: "Duyuruyu Kısmen Güncelle (Partial Update - PATCH)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    category: { type: "string", example: "Career" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Duyuru kısmen güncellendi" },
                    "404": { description: "Duyuru bulunamadı" }
                }
            },
            delete: {
                summary: "Duyuruyu Sil (Delete Announcement)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                responses: {
                    "200": { description: "Duyuru başarıyla silindi" },
                    "404": { description: "Duyuru bulunamadı" }
                }
            }
        },
        "/api/applications": {
            get: {
                summary: "Tüm Başvuruları Listele (List All Applications)",
                description: "Sistemde kayıtlı tüm iş başvurularını döner.",
                responses: {
                    "200": { description: "Başvuru listesi başarıyla getirildi" }
                }
            },
            post: {
                summary: "Yeni Başvuru Oluştur (Create Application)",
                description: "Bir iş ilanına yeni bir başvuru kaydeder.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["job_id", "user_id"],
                                properties: {
                                    job_id: { type: "integer", example: 1 },
                                    user_id: { type: "integer", example: 2 },
                                    resume_url: { type: "string", example: "https://example.com/cv.pdf" },
                                    cover_letter: { type: "string", example: "Pozisyona başvurmaktan heyecan duyuyorum." },
                                    status: { type: "string", example: "Pending" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Başvuru başarıyla oluşturuldu" },
                    "400": { description: "Eksik parametre hatası" }
                }
            }
        },
        "/api/applications/{id}": {
            get: {
                summary: "Belirli Başvuruyu Getir (Get Application by ID)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                responses: {
                    "200": { description: "Başvuru bulundu" },
                    "404": { description: "Başvuru bulunamadı" }
                }
            },
            patch: {
                summary: "Başvuru Durumunu Güncelle (Update Status - PATCH)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "Interviewing" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Başvuru güncellendi" },
                    "404": { description: "Başvuru bulunamadı" }
                }
            },
            delete: {
                summary: "Başvuruyu Sil (Delete Application)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }
                ],
                responses: {
                    "200": { description: "Başvuru başarıyla silindi" },
                    "404": { description: "Başvuru bulunamadı" }
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


