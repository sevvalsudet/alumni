// controllers/userController.js
// 🎓 MVC - Web UI Controller Katmanı (userController)
// Kullanıcı profili, rol bazlı kullanıcıya özel görünümler ve CRUD işlemlerini yönetir.

const UserModel = require('../models/userModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');

const userController = {
    // 📖 1. [READ ALL] GET /users -> Tüm kullanıcıları listeleyen View (users.ejs)
    getAll: async (req, res) => {
        try {
            const users = await UserModel.findAll();
            res.render('users', { users });
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // 🔍 2. [READ ONE] GET /users/:id -> Kullanıcıya özel detay & profil View'ı (userDetail.ejs)
    getById: async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).render('404', {
                    url: req.originalUrl,
                    method: 'GET'
                });
            }

            // Kullanıcıya özel verileri yükle (İş ilanları ve Başvurular)
            const [postedJobs, userApplications] = await Promise.all([
                JobPostingModel.findByUser(userId),
                ApplicationModel.findByUser(userId)
            ]);

            // Her ilana gelen başvuru sayısını ekle (Alumni/Admin için)
            const jobsWithCounts = await Promise.all(postedJobs.map(async (job) => {
                const applicants = await JobPostingModel.getApplicants(job.id);
                return {
                    ...job,
                    applicantCount: applicants.length
                };
            }));

            const welcome = req.query.welcome === 'true';
            const updated = req.query.updated === 'true';
            const isSelf = req.user && req.user.id === userId;
            const isAdmin = req.user && req.user.role === 'Admin';
            const canEdit = isSelf || isAdmin;

            res.render('userDetail', {
                user,
                postedJobs: jobsWithCounts,
                userApplications,
                welcome,
                updated,
                isSelf,
                isAdmin,
                canEdit
            });
        } catch (err) {
            console.error('Error fetching user profile:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // ➕ 3. [CREATE] POST /users -> Formdan gelen yeni kullanıcıyı kaydeder
    create: async (req, res) => {
        try {
            const { name, role, department, company } = req.body;
            if (name && role) {
                await UserModel.create({ name, role, department, company });
            }
            res.redirect('/users');
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // ✏️ 4. [UPDATE FORM] GET /users/:id/edit -> Kullanıcıyı düzenleme View'ını gösterir
    editForm: async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).render('404', {
                    url: req.originalUrl,
                    method: 'GET'
                });
            }

            const isSelf = req.user && req.user.id === userId;
            const isAdmin = req.user && req.user.role === 'Admin';

            res.render('userEdit', {
                user,
                isSelf,
                isAdmin
            });
        } catch (err) {
            console.error('Error loading edit form:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // ✏️ 5. [UPDATE ACTION] POST /users/:id/update -> Güncellenen verileri kaydeder
    update: async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const {
                name,
                role,
                department,
                company,
                graduation_year,
                bio,
                phone,
                linkedin_url,
                github_url
            } = req.body;

            const updateData = {
                name: name ? name.trim() : undefined,
                department: department ? department.trim() : null,
                company: company ? company.trim() : null,
                graduation_year: graduation_year ? Number(graduation_year) : null,
                bio: bio ? bio.trim() : null,
                phone: phone ? phone.trim() : null,
                linkedin_url: linkedin_url ? linkedin_url.trim() : null,
                github_url: github_url ? github_url.trim() : null
            };

            // DDD Kuralı: Sadece Admin rolü rolü değiştirebilir (Audit & Integrity Lock)
            if (req.user && req.user.role === 'Admin' && role) {
                updateData.role = role;
            }

            await UserModel.patch(userId, updateData);
            res.redirect(`/users/${userId}?updated=true`);
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // 🗑️ 6. [DELETE ACTION] POST /users/:id/delete -> Kullanıcıyı siler (Admin only)
    delete: async (req, res) => {
        try {
            const targetId = Number(req.params.id);
            if (req.user && req.user.id === targetId) {
                return res.status(400).send('You cannot delete your own account.');
            }
            await UserModel.delete(targetId);
            res.redirect('/users');
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).render('500', { error: err });
        }
    }
};

module.exports = userController;
