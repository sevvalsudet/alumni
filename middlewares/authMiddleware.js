// middlewares/authMiddleware.js
// 🎓 Kimlik Doğrulama ve Yetkilendirme (Authentication & RBAC Authorization) Middleware Katmanı
// Express.js ve DDD mimarisine uygun rol bazlı erişim denetimi (RBAC) sağlar.

const { verifyAuthToken, COOKIE_NAME } = require('../controllers/authController');

/**
 * Yardımcı Fonksiyon: İsteğin API / JSON isteği olup olmadığını tespit eder.
 */
function isApiRequest(req) {
    if (req.originalUrl && req.originalUrl.startsWith('/api/')) return true;
    if (req.xhr) return true;
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('application/json')) return true;
    return false;
}

/**
 * 1. Global Session Middleware
 * Her HTTP isteğinde çerezi (Cookie) veya Authorization Bearer başlığını inceler.
 * Geçerli bir imza varsa `req.user` ve `res.locals` nesnelerine kullanıcı bilgisini enjekte eder.
 */
function sessionMiddleware(req, res, next) {
    let token = null;

    // A) HTTP Cookie'den token oku
    if (req.cookies && req.cookies[COOKIE_NAME]) {
        token = req.cookies[COOKIE_NAME];
    }
    // B) Veya HTTP Authorization Header'ından oku (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        const payload = verifyAuthToken(token);
        if (payload) {
            req.user = payload;
            res.locals.currentUser = payload;
            res.locals.isAuthenticated = true;
            res.locals.isAdmin = payload.role === 'Admin';
            res.locals.isAlumni = payload.role === 'Alumni';
            res.locals.isStudent = payload.role === 'Student';
        } else {
            req.user = null;
            res.locals.currentUser = null;
            res.locals.isAuthenticated = false;
            res.locals.isAdmin = false;
            res.locals.isAlumni = false;
            res.locals.isStudent = false;
        }
    } else {
        req.user = null;
        res.locals.currentUser = null;
        res.locals.isAuthenticated = false;
        res.locals.isAdmin = false;
        res.locals.isAlumni = false;
        res.locals.isStudent = false;
    }

    next();
}

/**
 * 2. requireAuth Guard
 * Korunan sayfalara veya API uçlarına sadece oturum açmış kullanıcıların erişmesini garanti eder.
 * - API isteklerinde 401 Unauthorized JSON yanıtı döner.
 * - Web arayüzünde kullanıcıyı /login sayfasına (returnTo parametresi ile) yönlendirir.
 */
function requireAuth(req, res, next) {
    if (req.user) {
        return next();
    }

    if (isApiRequest(req)) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Authentication required. Please provide a valid session or Bearer token.'
        });
    }

    const returnTo = req.originalUrl || req.url;
    return res.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
}

/**
 * 3. requireGuest Guard
 * Giriş yapmış kullanıcıların /login ve /register gibi sayfalara tekrar girmesini engeller.
 * Zaten oturumu varsa profil sayfasına yönlendirir.
 */
function requireGuest(req, res, next) {
    if (!req.user) {
        return next();
    }

    if (isApiRequest(req)) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'You are already authenticated.'
        });
    }

    return res.redirect(`/users/${req.user.id}`);
}

/**
 * 4. requireRole(...allowedRoles)
 * Rol Bazlı Yetkilendirme (RBAC) Fabrika Fonksiyonu.
 * Kullanıcının rolü ('Admin', 'Alumni', 'Student') izin verilen listede değilse erişimi engeller.
 * - API isteklerinde 403 Forbidden JSON döner.
 * - Web isteklerinde özel 403.ejs hata sayfasını render eder.
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        // Oturum açılmamışsa önce kimlik doğrulama iste
        if (!req.user) {
            return requireAuth(req, res, next);
        }

        // Rolü kontrol et
        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        // Yetkisiz erişim durumu
        if (isApiRequest(req)) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: `Access denied. Requires one of [${allowedRoles.join(', ')}]. Your current role is '${req.user.role}'.`
            });
        }

        return res.status(403).render('403', {
            title: '403 • Access Forbidden • Alumni.io',
            requiredRoles: allowedRoles,
            userRole: req.user.role,
            path: req.originalUrl || req.url,
            method: req.method
        });
    };
}

/**
 * 5. requireSelfOrAdmin(idParamKey)
 * Bir kullanıcının yalnızca kendi profilini/kaynağını düzenleyebilmesini sağlar.
 * Ancak 'Admin' rolü tüm kaynakları düzenleyebilir.
 */
function requireSelfOrAdmin(idParamKey = 'id') {
    return (req, res, next) => {
        if (!req.user) {
            return requireAuth(req, res, next);
        }

        const targetId = req.params[idParamKey];
        const isSelf = String(req.user.id) === String(targetId);
        const isAdmin = req.user.role === 'Admin';

        if (isSelf || isAdmin) {
            return next();
        }

        if (isApiRequest(req)) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'You are only authorized to modify your own resources.'
            });
        }

        return res.status(403).render('403', {
            title: '403 • Access Forbidden • Alumni.io',
            requiredRoles: ['Admin (or Resource Owner)'],
            userRole: req.user.role,
            path: req.originalUrl || req.url,
            method: req.method
        });
    };
}

// 🎯 Hızlı Kısayollar (Semantic RBAC Aliases)
const requireAdmin = requireRole('Admin');
const requireAlumniOrAdmin = requireRole('Alumni', 'Admin');
const requireStudentOrAdmin = requireRole('Student', 'Admin');

module.exports = {
    sessionMiddleware,
    requireAuth,
    requireGuest,
    requireRole,
    requireAdmin,
    requireAlumniOrAdmin,
    requireStudentOrAdmin,
    requireSelfOrAdmin,
    isApiRequest
};
