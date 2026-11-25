// middlewares/authMiddleware.js
// 🎓 Oturum ve Kimlik Doğrulama Middleware'i

const { verifyAuthToken, COOKIE_NAME } = require('../controllers/authController');

// 1. Global Session Middleware: Her istekte oturum açmış kullanıcıyı bulur ve res.locals'a aktarır
function sessionMiddleware(req, res, next) {
    let token = null;

    // Cookie'den token oku
    if (req.cookies && req.cookies[COOKIE_NAME]) {
        token = req.cookies[COOKIE_NAME];
    }
    // Veya Authorization header'ından oku (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        const payload = verifyAuthToken(token);
        if (payload) {
            req.user = payload;
            res.locals.currentUser = payload;
        } else {
            req.user = null;
            res.locals.currentUser = null;
        }
    } else {
        req.user = null;
        res.locals.currentUser = null;
    }

    next();
}

// 2. Korumalı Sayfalar İçin Guard: Giriş yapmamışsa /login'e yönlendirir
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
}

module.exports = {
    sessionMiddleware,
    requireAuth
};
