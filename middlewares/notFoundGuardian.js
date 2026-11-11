// middlewares/notFoundGuardian.js
// 🛡️ 404 Guardian Middleware
// Uygulama rotaları arasında eşleşmeyen tüm istekleri en sonda yakalar.
// API / JSON istekleri için yapılandırılmış JSON döner, tarayıcı istekleri için 404 görünümünü render eder.

const notFoundGuardian = (req, res, next) => {
    const isApiRequest = req.originalUrl.startsWith('/api/') || 
                         req.xhr || 
                         (req.headers.accept && req.headers.accept.includes('application/json'));

    if (isApiRequest) {
        return res.status(404).json({
            success: false,
            error: "Not Found",
            message: `🛡️ 404 Guardian: Aradığınız API rotası bulunamadı -> [${req.method}] ${req.originalUrl}`,
            statusCode: 404,
            timestamp: new Date().toISOString()
        });
    }

    // Tarayıcı / HTML isteği ise 404 görünümünü render et
    res.status(404).render('404', {
        url: req.originalUrl,
        method: req.method
    });
};

module.exports = notFoundGuardian;
