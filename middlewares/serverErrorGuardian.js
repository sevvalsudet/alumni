// middlewares/serverErrorGuardian.js
// 🛡️ 5xx Guardian Middleware (Global Error Handling Middleware)
// Express'in 4 parametreli (err, req, res, next) hata yakalama mekanizmasıdır.
// Sunucunun çökmesini (crash) önler, API isteklerine JSON 500, tarayıcı isteklerine 500.ejs sayfası döner.

const serverErrorGuardian = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;

    // Terminale hatayı yazdır
    console.error(`💥 [5xx Guardian] Hata Yakalandı: ${req.method} ${req.originalUrl} (${statusCode})`);
    console.error(err.stack || err.message || err);

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
            timestamp: new Date().toISOString()
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
