// middlewares/serverErrorGuardian.js
// 🛡️ 5xx Guardian Middleware (Global Error Handling Middleware)
// Express'in 4 parametreli (err, req, res, next) hata yakalama mekanizmasıdır.
// Sunucunun çökmesini (crash) önler, API isteklerine JSON 500, tarayıcı isteklerine 500.ejs sayfası döner.
// Hataları terminale basmanın yanı sıra kalıcı olarak logs/error.logs dosyasına yazar.

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const errorLogFile = path.join(logsDir, 'error.logs');

// logs klasörünün varlığını garantiye al
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const serverErrorGuardian = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const timestamp = now.toISOString();

    // 1. Terminale hatayı yazdır
    console.error(`💥 [5xx Guardian] Hata Yakalandı: ${req.method} ${req.originalUrl} (${statusCode})`);
    console.error(err.stack || err.message || err);

    // 2. logs/error.logs dosyasına kalıcı olarak kaydet
    const logRow = `time ${time} method ${req.method} route ${req.originalUrl} res. type ${statusCode} error: ${err.message || 'Unknown error'}\n[${timestamp}] Stack: ${err.stack || 'No stack trace'}\n----------------------------------------\n`;
    
    fs.appendFile(errorLogFile, logRow, (fileErr) => {
        if (fileErr) {
            console.error('⚠️ [5xx Guardian] logs/error.logs dosyasına yazılamadı:', fileErr);
        }
    });

    const isApiRequest = req.originalUrl.startsWith('/api/') || 
                         req.xhr || 
                         (req.headers.accept && req.headers.accept.includes('application/json'));

    // API İstekleri için yapılandırılmış JSON döner
    if (isApiRequest) {
        return res.status(statusCode).json({
            success: false,
            error: "Internal Server Error",
            message: `🛡️ 5xx Guardian: Sunucu tarafında beklenmeyen bir hata oluştu -> ${err.message || 'Bilinmeyen sistem hatası'}`,
            statusCode: statusCode,
            timestamp: timestamp
        });
    }

    // Tarayıcı / Web istekleri için 500 sayfasını render eder
    res.status(statusCode).render('500', {
        url: req.originalUrl,
        method: req.method,
        errorMessage: err.message || "Internal Server Error"
    });
};

module.exports = serverErrorGuardian;
