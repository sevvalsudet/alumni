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

// 🍪 [COOKIE PARSER & AUTH SESSION] Çerezleri okur ve oturum bilgilerini EJS görünümlerine aktarır
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const {
    sessionMiddleware,
    requireAuth,
    requireGuest,
    requireRole,
    requireAdmin,
    requireAlumniOrAdmin,
    requireStudentOrAdmin,
    requireSelfOrAdmin
} = require('./middlewares/authMiddleware');
app.use(sessionMiddleware);

// 📋 [LOGGER MIDDLEWARE] Terminale her isteğin logunu yazar (time, method, route, res. type, duration)
const logger = require('./middlewares/logger');
app.use(logger);


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
    res.render('index');
});

// ⑥ GET /about -> Hakkımızda Sayfası (About View)
app.get('/about', (req, res) => {
    res.render('about');
});

// 📝 Authentication, Registration & Session Rotaları (Web UI & REST API)
const authController = require('./controllers/authController');
app.get('/register', requireGuest, authController.showRegister);
app.post('/register', requireGuest, authController.processRegister);
app.get('/login', requireGuest, authController.showLogin);
app.post('/login', requireGuest, authController.processLogin);
app.get('/logout', authController.logout);
app.post('/logout', authController.logout);

// ⚡ REST API Auth Endpoints
app.post('/api/auth/register', authController.apiRegister);
app.post('/api/auth/login', authController.apiLogin);
app.post('/api/auth/logout', authController.apiLogout);

// ⑦ GET /api/health -> JSON formatında sunucu sağlık durumunu döner
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        message: "Alumni API is healthy and running",
        timestamp: new Date().toISOString()
    });
});

// 🛡️ [ALUMNI & ADMIN GOVERNANCE PANEL] Veri ve Rol Yönetim Paneli
const panelController = require('./controllers/panelController');
app.get('/panel', requireAuth, requireAdmin, panelController.showPanel);
app.post('/panel/users/:id/role', requireAuth, requireAdmin, panelController.updateUserRole);
app.post('/panel/users/:id/delete', requireAuth, requireAdmin, panelController.deleteUser);
app.post('/panel/jobs/:id/toggle', requireAuth, requireAdmin, panelController.toggleJobStatus);
app.post('/panel/jobs/:id/delete', requireAuth, requireAdmin, panelController.deleteJob);
app.post('/panel/applications/:id/status', requireAuth, requireAdmin, panelController.updateApplicationStatus);
app.post('/panel/applications/:id/delete', requireAuth, requireAdmin, panelController.deleteApplication);
app.post('/panel/announcements', requireAuth, requireAdmin, panelController.createAnnouncement);
app.post('/panel/announcements/:id/delete', requireAuth, requireAdmin, panelController.deleteAnnouncement);
app.get('/api/panel/stats', requireAuth, requireAdmin, panelController.apiStats);

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

// 🧪 [TEST ROUTE: 5xx Guardian Testi] Kasıtlı olarak 500 hatası fırlatan test rotaları
app.get('/api/trigger-error', (req, res, next) => {
    next(new Error("Test 500 Hatası: Veritabanı sorgusu zaman aşımına uğradı!"));
});
app.get('/trigger-error', (req, res, next) => {
    next(new Error("Test 500 Hatası: Beklenmeyen sistem arızası simüle edildi."));
});

// 🌐 [GENERIC 404 ROUTE] Genel 404 hata sayfası rotası
app.get('/404', (req, res) => {
    res.status(404).render('404', {
        url: req.query.from || req.originalUrl,
        method: req.query.method || 'GET'
    });
});

// 🛡️ [404 GUARDIAN MIDDLEWARE] Eşleşmeyen tüm rotaları yakalar (API için JSON, Web için /404'e redirect eder)
const notFoundGuardian = require('./middlewares/notFoundGuardian');
app.use(notFoundGuardian);

// 🛡️⚡ [5XX GUARDIAN MIDDLEWARE] Tüm sunucu/kodlama hatalarını yakalar (Crash önler, API için JSON 500, Web için 500.ejs döner)
const serverErrorGuardian = require('./middlewares/serverErrorGuardian');
app.use(serverErrorGuardian);

// Sunucuyu 3000 portunda dinlemeye başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`📖 Swagger Dokümantasyonu: http://localhost:${PORT}/api/swagger`);
});


