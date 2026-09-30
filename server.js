const express = require('express');
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
                <a href="/api/users" target="_blank">Kullanıcılar (JSON)</a>
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

// Örnek mezun/öğrenci verisi (In-Memory Array - Henüz veritabanı yok)
let mockUsers = [
    { id: 1, name: "Şevval Sude", role: "Student", department: "Computer Engineering" },
    { id: 2, name: "Sude", role: "Alumni", company: "Google" },
    { id: 3, name: "Şevval", role: "Alumni", company: "Microsoft" }
];

// URL/api/users (GET) -> Tüm kullanıcıları JSON formatında listeler
app.get('/api/users', (req, res) => {
    res.json(mockUsers);
});

// 🎯 YENİ GÖREV: POST /api/users (dont use any database yet)
// Yeni kullanıcıyı geçici olarak bellekteki mockUsers dizisine ekler
app.post('/api/users', (req, res) => {
    const { name, role, department, company } = req.body;

    // Basit doğrulama: İsim ve rol zorunlu olsun
    if (!name || !role) {
        return res.status(400).json({
            success: false,
            message: "Hata: 'name' ve 'role' alanları zorunludur!"
        });
    }

    // Yeni kullanıcı nesnesi oluştur
    const newUser = {
        id: mockUsers.length + 1,
        name,
        role,
        department: department || null,
        company: company || null
    };

    // Dizimize ekle (In-Memory)
    mockUsers.push(newUser);

    // 201 Created durum koduyla yanıt ver
    res.status(201).json({
        success: true,
        message: "Kullanıcı başarıyla eklendi!",
        user: newUser
    });
});


// URL/users -> Görsel HTML sayfası döner (Tarayıcıda kullanıcıların listelendiği sayfa)
app.get('/users', (req, res) => {
    const userListHtml = mockUsers
        .map(u => `<li><strong>${u.name}</strong> - ${u.role} (${u.department || u.company})</li>`)
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

// Sunucuyu 3000 portunda dinlemeye başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

