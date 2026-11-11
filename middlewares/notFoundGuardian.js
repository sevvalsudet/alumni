// middlewares/notFoundGuardian.js
// 🛡️ 404 Guardian Middleware
// Uygulama rotaları arasında eşleşmeyen tüm istekleri en sonda yakalar.
// API / JSON istekleri için yapılandırılmış JSON döner, tarayıcı istekleri için 404 görünümünü render eder.

const notFoundGuardian = (req, res, next) => {
    // İstek zaten /404 rotasında ise döngüye girmeden 404 görünümünü render et
    if (req.path === '/404') {
        return res.status(404).render('404', {
            url: req.query.from || req.originalUrl,
            method: req.query.method || req.method
        });
    }

    const isApiRequest = req.originalUrl.startsWith('/api/') || 
                         req.xhr || 
                         (req.headers.accept && req.headers.accept.includes('application/json'));

    // 1. API İstekleri: Doğrudan JSON 404 döner (REST standartı)
    if (isApiRequest) {
        return res.status(404).json({
            success: false,
            error: "Not Found",
            message: `🛡️ 404 Guardian: Aradığınız API rotası bulunamadı -> [${req.method}] ${req.originalUrl}`,
            statusCode: 404,
            timestamp: new Date().toISOString()
        });
    }

    // 2. Geçersiz Web İstekleri: Genel /404 sayfasına yönlendir (Redirect invalid request)
    const redirectUrl = `/404?from=${encodeURIComponent(req.originalUrl)}&method=${encodeURIComponent(req.method)}`;
    res.redirect(redirectUrl);
};

module.exports = notFoundGuardian;
