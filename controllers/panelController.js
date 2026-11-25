// controllers/panelController.js
// 🎓 Alumni & Admin Yönetim Paneli Controller Katmanı
// Sistem genelindeki kullanıcılar, roller, iş ilanları, başvurular ve duyuruları yönetir.

const UserModel = require('../models/userModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const AnnouncementModel = require('../models/announcementModel');

const panelController = {
    // 📊 [GET /panel] Ana Yönetim Dashboard Görünümü
    showPanel: async (req, res) => {
        try {
            const [users, jobs, applications, announcements] = await Promise.all([
                UserModel.findAll(),
                JobPostingModel.findAll(),
                ApplicationModel.findAll(),
                AnnouncementModel.findAll()
            ]);

            // Sistem İstatistikleri (Domain Analytics)
            const metrics = {
                totalUsers: users.length,
                studentsCount: users.filter(u => u.role === 'Student').length,
                alumniCount: users.filter(u => u.role === 'Alumni').length,
                adminsCount: users.filter(u => u.role === 'Admin').length,
                totalJobs: jobs.length,
                activeJobsCount: jobs.filter(j => j.is_active).length,
                totalApplications: applications.length,
                submittedApps: applications.filter(a => a.status === 'Submitted' || a.status === 'Pending').length,
                reviewApps: applications.filter(a => a.status === 'Reviewed' || a.status === 'In Review').length,
                interviewApps: applications.filter(a => a.status === 'Interviewing' || a.status === 'Interview').length,
                acceptedApps: applications.filter(a => a.status === 'Accepted').length,
                totalAnnouncements: announcements.length
            };

            // Flash bildirim mesajları
            const messageMap = {
                role_updated: 'User role successfully updated in RBAC registry.',
                user_deleted: 'User record removed from platform.',
                job_toggled: 'Job posting publication status toggled.',
                job_deleted: 'Job posting listing deleted successfully.',
                app_status_updated: 'Application recruitment stage updated.',
                app_deleted: 'Application record removed from pipeline.',
                announcement_created: 'Official institutional announcement published.',
                announcement_deleted: 'Announcement removed from newsroom.'
            };

            const alertMessage = req.query.msg && messageMap[req.query.msg] ? messageMap[req.query.msg] : null;

            res.render('panel', {
                title: 'Alumni Governance & Admin Panel • Alumni.io',
                active: 'panel',
                metrics,
                users,
                jobs,
                applications,
                announcements,
                alertMessage,
                tab: req.query.tab || 'overview'
            });
        } catch (err) {
            console.error('Error rendering admin panel:', err);
            res.status(500).render('500', { error: err });
        }
    },

    // 👤 [POST /panel/users/:id/role] Kullanıcı Rolünü Güncelle (RBAC Elevation / Demotion)
    updateUserRole: async (req, res) => {
        try {
            const userId = req.params.id;
            const { role } = req.body;

            const allowedRoles = ['Student', 'Alumni', 'Admin'];
            if (!allowedRoles.includes(role)) {
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(400).json({ success: false, error: 'Invalid role' });
                }
                return res.redirect('/panel?msg=invalid_role#users');
            }

            const updatedUser = await UserModel.patch(userId, { role });

            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, message: 'Role updated successfully', user: updatedUser });
            }

            res.redirect('/panel?msg=role_updated&tab=users#users');
        } catch (err) {
            console.error('Error updating user role:', err);
            res.status(500).send('Failed to update role');
        }
    },

    // 🗑️ [POST /panel/users/:id/delete] Kullanıcıyı Sistemden Sil
    deleteUser: async (req, res) => {
        try {
            const targetId = Number(req.params.id);

            // Kendini silmeyi engelle
            if (req.user && req.user.id === targetId) {
                return res.redirect('/panel?msg=cannot_delete_self&tab=users#users');
            }

            await UserModel.delete(targetId);

            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, message: 'User deleted' });
            }

            res.redirect('/panel?msg=user_deleted&tab=users#users');
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Failed to delete user');
        }
    },

    // 💼 [POST /panel/jobs/:id/toggle] İlan Aktif/Pasif Durumunu Değiştir
    toggleJobStatus: async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await JobPostingModel.findById(jobId);
            if (!job) {
                return res.redirect('/panel?tab=jobs#jobs');
            }

            const newStatus = !job.is_active;
            await JobPostingModel.patch(jobId, { is_active: newStatus });

            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, is_active: newStatus });
            }

            res.redirect('/panel?msg=job_toggled&tab=jobs#jobs');
        } catch (err) {
            console.error('Error toggling job status:', err);
            res.status(500).send('Failed to toggle job status');
        }
    },

    // 🗑️ [POST /panel/jobs/:id/delete] İlanı Sil
    deleteJob: async (req, res) => {
        try {
            await JobPostingModel.delete(req.params.id);
            res.redirect('/panel?msg=job_deleted&tab=jobs#jobs');
        } catch (err) {
            console.error('Error deleting job:', err);
            res.status(500).send('Failed to delete job');
        }
    },

    // 📝 [POST /panel/applications/:id/status] Başvuru Durumunu Güncelle
    updateApplicationStatus: async (req, res) => {
        try {
            const { status } = req.body;
            await ApplicationModel.updateStatus(req.params.id, status);

            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, status });
            }

            res.redirect('/panel?msg=app_status_updated&tab=applications#applications');
        } catch (err) {
            console.error('Error updating application status:', err);
            res.status(500).send('Failed to update application status');
        }
    },

    // 🗑️ [POST /panel/applications/:id/delete] Başvuruyu Sil
    deleteApplication: async (req, res) => {
        try {
            await ApplicationModel.delete(req.params.id);
            res.redirect('/panel?msg=app_deleted&tab=applications#applications');
        } catch (err) {
            console.error('Error deleting application:', err);
            res.status(500).send('Failed to delete application');
        }
    },

    // 📢 [POST /panel/announcements] Hızlı Duyuru Yayınla
    createAnnouncement: async (req, res) => {
        try {
            const { title, content, category, priority } = req.body;
            await AnnouncementModel.create({
                author_id: req.user ? req.user.id : 1,
                title: title.trim(),
                content: content.trim(),
                category: category || 'General',
                priority: priority || 'Normal',
                date: new Date().toISOString().split('T')[0]
            });
            res.redirect('/panel?msg=announcement_created&tab=announcements#announcements');
        } catch (err) {
            console.error('Error creating announcement from panel:', err);
            res.status(500).send('Failed to publish announcement');
        }
    },

    // 🗑️ [POST /panel/announcements/:id/delete] Duyuru Sil
    deleteAnnouncement: async (req, res) => {
        try {
            await AnnouncementModel.delete(req.params.id);
            res.redirect('/panel?msg=announcement_deleted&tab=announcements#announcements');
        } catch (err) {
            console.error('Error deleting announcement:', err);
            res.status(500).send('Failed to delete announcement');
        }
    },

    // ⚡ [API GET /api/panel/stats] JSON İstatistikleri
    apiStats: async (req, res) => {
        try {
            const [users, jobs, applications, announcements] = await Promise.all([
                UserModel.findAll(),
                JobPostingModel.findAll(),
                ApplicationModel.findAll(),
                AnnouncementModel.findAll()
            ]);

            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                stats: {
                    users: {
                        total: users.length,
                        students: users.filter(u => u.role === 'Student').length,
                        alumni: users.filter(u => u.role === 'Alumni').length,
                        admins: users.filter(u => u.role === 'Admin').length
                    },
                    jobs: {
                        total: jobs.length,
                        active: jobs.filter(j => j.is_active).length
                    },
                    applications: {
                        total: applications.length,
                        stages: {
                            pending: applications.filter(a => a.status === 'Pending' || a.status === 'Submitted').length,
                            reviewed: applications.filter(a => a.status === 'Reviewed').length,
                            interviewing: applications.filter(a => a.status === 'Interviewing').length,
                            accepted: applications.filter(a => a.status === 'Accepted').length
                        }
                    },
                    announcements: announcements.length
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};

module.exports = panelController;
