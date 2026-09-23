const express = require('express');
const app = express();
const PORT = 3000;


// ① GET /ok 

app.get('/ok', (req, res) => {
    res.send('ok');
});

// ② GET /hello
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

// ③ GET /hello/{name}

app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name}!`);
});

// ④ GET /sum/{number1}/{number2} 
// example: http://localhost:3000/sum/5/10 -> Ekranda 15 yazar
app.get('/sum/:number1/:number2', (req, res) => {
    const num1 = Number(req.params.number1);
    const num2 = Number(req.params.number2);
    const result = num1 + num2;
    res.send(`Sonuç: ${result}`);
});

// ⑤ GET / ->  (temporary one main page)
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
                <a href="/about">Hakkımızda (About)</a> | 
                <a href="/hello">Hello</a> | 
                <a href="/hello/sevval">Kişisel Selamlama</a> | 
                <a href="/sum/10/25">Toplama Testi (10 + 25)</a>
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

// Sunucuyu 3000 portunda dinlemeye başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
