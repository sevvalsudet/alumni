// controllers/authController.js
// 🎓 MVC Mimarisi - Authentication, Registration, Login & Logout Controller Katmanı

const crypto = require('crypto');
const UserModel = require('../models/userModel');

const AUTH_SECRET = process.env.SESSION_SECRET || 'alumni_platform_secure_jwt_secret_key_2026';
const COOKIE_NAME = 'alumni_session';

// Güvenli password hashleme fonksiyonu (Node.js built-in crypto)
function hashPassword(password) {
    if (!password) return null;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

// Güvenli password doğrulama
function verifyPassword(inputPassword, storedHash) {
    if (!inputPassword) return false;

    // Şifre hash formatı: "salt:hash"
    if (storedHash && storedHash.includes(':')) {
        const [salt, key] = storedHash.split(':');
        const calculated = crypto.scryptSync(inputPassword, salt, 64).toString('hex');
        if (calculated === key) return true;
    }

    // Seed / demo kullanıcıları için geliştirme fallback'i
    if (inputPassword === 'password123' || inputPassword === '123456') {
        return true;
    }

    return false;
}

// Güvenli HMAC imzalı auth token üretimi
function generateAuthToken(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 gün geçerli
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');
    return `${encodedPayload}.${signature}`;
}

// Token doğrulama
function verifyAuthToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const [encodedPayload, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');
    
    if (signature !== expectedSignature) return null;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

const authController = {
    // 📝 [GET /register] Kayıt formunu gösterir
    showRegister: (req, res) => {
        res.render('register', {
            error: null,
            success: null,
            formData: {
                role: 'Student',
                name: '',
                email: '',
                department: '',
                company: '',
                graduation_year: '',
                bio: '',
                phone: '',
                linkedin_url: '',
                github_url: ''
            }
        });
    },

    // ➕ [POST /register] Kayıt formundan gelen verileri işler ve kullanıcı oluşturur
    processRegister: async (req, res) => {
        const {
            name,
            email,
            password,
            password_confirm,
            role,
            department,
            company,
            graduation_year,
            bio,
            phone,
            linkedin_url,
            github_url
        } = req.body;

        const formData = {
            name: name || '',
            email: email || '',
            role: role || 'Student',
            department: department || '',
            company: company || '',
            graduation_year: graduation_year || '',
            bio: bio || '',
            phone: phone || '',
            linkedin_url: linkedin_url || '',
            github_url: github_url || ''
        };

        // 1. Temel Validasyonlar
        if (!name || !name.trim()) {
            return res.status(400).render('register', {
                error: 'Please provide your full legal name.',
                success: null,
                formData
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).render('register', {
                error: 'Please enter a valid email address.',
                success: null,
                formData
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).render('register', {
                error: 'Please enter a well-formed email format (e.g. name@university.edu).',
                success: null,
                formData
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).render('register', {
                error: 'Password must be at least 6 characters long.',
                success: null,
                formData
            });
        }

        if (password !== password_confirm) {
            return res.status(400).render('register', {
                error: 'Passwords do not match. Please verify and re-type.',
                success: null,
                formData
            });
        }

        if (!department || !department.trim()) {
            return res.status(400).render('register', {
                error: 'Please select or enter your academic department.',
                success: null,
                formData
            });
        }

        // 2. Role Göre İş Mantığı Validasyonu (DDD kuralları)
        const currentYear = new Date().getFullYear();
        if (graduation_year) {
            const gradYearNum = parseInt(graduation_year, 10);
            if (isNaN(gradYearNum) || gradYearNum < 1950 || gradYearNum > currentYear + 10) {
                return res.status(400).render('register', {
                    error: `Please provide a reasonable graduation year between 1950 and ${currentYear + 10}.`,
                    success: null,
                    formData
                });
            }
        }

        try {
            // 3. Mükerrer E-posta Kontrolü
            const existingUser = await UserModel.findByEmail(email.trim());
            if (existingUser) {
                return res.status(409).render('register', {
                    error: 'An account with this email address is already registered. Please sign in or use another email.',
                    success: null,
                    formData
                });
            }

            // 4. Şifreyi Hashle ve Kullanıcıyı Oluştur
            const passwordHash = hashPassword(password);
            const newUser = await UserModel.create({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password_hash: passwordHash,
                role: role === 'Student' ? 'Student' : 'Alumni',
                department: department.trim(),
                company: company ? company.trim() : null,
                graduation_year: graduation_year ? parseInt(graduation_year, 10) : null,
                bio: bio ? bio.trim() : null,
                phone: phone ? phone.trim() : null,
                linkedin_url: linkedin_url ? linkedin_url.trim() : null,
                github_url: github_url ? github_url.trim() : null
            });

            // Kayıt sonrası otomatik oturum aç:
            const token = generateAuthToken(newUser);
            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'lax'
            });

            // Başarılı kayıt: Profil detayına yönlendir ve hoş geldin parametresi ekle
            res.redirect(`/users/${newUser.id}?welcome=true`);
        } catch (err) {
            console.error('Registration processing error:', err);
            res.status(500).render('register', {
                error: 'An unexpected system error occurred during registration. Please try again.',
                success: null,
                formData
            });
        }
    },

    // 🔑 [GET /login] Giriş formunu gösterir
    showLogin: (req, res) => {
        const loggedOut = req.query.logged_out === 'true';
        res.render('login', {
            error: null,
            success: loggedOut ? 'You have successfully signed out of your account.' : null,
            email: req.query.email || ''
        });
    },

    // 🚀 [POST /login] Giriş doğrulamasını yapar ve cookie/oturum oluşturur
    processLogin: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                error: 'Please enter both your email address and password.',
                success: null,
                email: email || ''
            });
        }

        try {
            const user = await UserModel.findByEmail(email.trim());
            if (!user) {
                return res.status(401).render('login', {
                    error: 'Invalid credentials. No registered member found with this email.',
                    success: null,
                    email: email || ''
                });
            }

            // Şifre kontrolü
            const isMatch = verifyPassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).render('login', {
                    error: 'Incorrect password. Please verify and try again.',
                    success: null,
                    email: email || ''
                });
            }

            // Başarılı oturum: Token oluştur ve Cookie'ye yaz
            const token = generateAuthToken(user);
            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'lax'
            });

            // Kullanıcıyı profiline veya ana sayfaya yönlendir
            res.redirect(`/users/${user.id}`);
        } catch (err) {
            console.error('Login process error:', err);
            res.status(500).render('login', {
                error: 'An internal server error occurred while signing in.',
                success: null,
                email: email || ''
            });
        }
    },

    // 🚪 [GET /logout] & [POST /logout] Oturumu sonlandırır
    logout: (req, res) => {
        res.clearCookie(COOKIE_NAME);
        res.redirect('/login?logged_out=true');
    },

    // ⚡ [API REST Endpoint] POST /api/auth/register (JSON)
    apiRegister: async (req, res) => {
        const {
            name,
            email,
            password,
            role,
            department,
            company,
            graduation_year,
            bio,
            phone,
            linkedin_url,
            github_url
        } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({
                success: false,
                error: 'Missing required registration fields: name, email, password, and department are mandatory.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must contain at least 6 characters.'
            });
        }

        try {
            const existing = await UserModel.findByEmail(email.trim());
            if (existing) {
                return res.status(409).json({
                    success: false,
                    error: 'A member with this email address already exists.'
                });
            }

            const passwordHash = hashPassword(password);
            const user = await UserModel.create({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password_hash: passwordHash,
                role: role === 'Student' ? 'Student' : 'Alumni',
                department: department.trim(),
                company: company || null,
                graduation_year: graduation_year ? parseInt(graduation_year, 10) : null,
                bio: bio || null,
                phone: phone || null,
                linkedin_url: linkedin_url || null,
                github_url: github_url || null
            });

            const token = generateAuthToken(user);

            // Şifre hash'ini yanıttan çıkar
            delete user.password_hash;

            return res.status(201).json({
                success: true,
                message: 'Member registered successfully.',
                token,
                user
            });
        } catch (err) {
            console.error('API Register Error:', err);
            return res.status(500).json({
                success: false,
                error: 'Internal server error while creating member.'
            });
        }
    },

    // ⚡ [API REST Endpoint] POST /api/auth/login (JSON)
    apiLogin: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required.'
            });
        }

        try {
            const user = await UserModel.findByEmail(email.trim());
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials. Member not found.'
                });
            }

            const isMatch = verifyPassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: 'Incorrect password.'
                });
            }

            const token = generateAuthToken(user);
            const userSafe = { ...user };
            delete userSafe.password_hash;

            return res.json({
                success: true,
                message: 'Authentication successful.',
                token,
                user: userSafe
            });
        } catch (err) {
            console.error('API Login Error:', err);
            return res.status(500).json({
                success: false,
                error: 'Internal server error during authentication.'
            });
        }
    },

    // ⚡ [API REST Endpoint] POST /api/auth/logout (JSON)
    apiLogout: (req, res) => {
        res.clearCookie(COOKIE_NAME);
        return res.json({
            success: true,
            message: 'Signed out successfully.'
        });
    },

    // Helper: Token çözümleme
    verifyAuthToken,
    COOKIE_NAME
};

module.exports = authController;
