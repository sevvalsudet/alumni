// controllers/applicationController.js
// 🎓 MVC - Web UI Controller for Job Applications (EJS Views)

const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');

const applicationController = {
    // 📖 [DIRECT ROUTE: GET /applications] Tüm başvuruları ve filtreleme seçeneklerini listele
    getAll: async (req, res) => {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.job_id) filters.job_id = req.query.job_id;
            if (req.query.user_id) filters.user_id = req.query.user_id;

            const applications = await ApplicationModel.findAll(filters);
            const jobs = await JobPostingModel.findAll();
            const users = await UserModel.findAll();

            res.render('applications', {
                applications,
                jobs,
                users,
                filterType: null,
                filterTarget: null,
                selectedStatus: req.query.status || '',
                errorMessage: null
            });
        } catch (err) {
            console.error('Error fetching applications:', err);
            res.status(500).send('<h1>500 - Başvurular yüklenirken hata oluştu</h1>');
        }
    },

    // 🔍 [DIRECT ROUTE: GET /applications/:id] Tek bir başvurunun detay sayfasını göster
    getById: async (req, res) => {
        try {
            const application = await ApplicationModel.findById(req.params.id);
            if (!application) {
                return res.status(404).send('<h1>404 - Başvuru Bulunamadı</h1><a href="/applications">← Başvurulara Dön</a>');
            }
            res.render('applicationDetail', { application, message: null });
        } catch (err) {
            console.error('Error fetching application detail:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // ➕ [DIRECT ROUTE: POST /applications] Yeni başvuru oluştur (Formdan)
    create: async (req, res) => {
        try {
            const { job_id, user_id, resume_url, cover_letter } = req.body;
            if (!job_id || !user_id) {
                return res.status(400).send('<h1>Hata: İlan ve Başvuran seçimi zorunludur!</h1><a href="/applications">← Geri</a>');
            }

            await ApplicationModel.create({
                job_id: Number(job_id),
                user_id: Number(user_id),
                resume_url: resume_url || null,
                cover_letter: cover_letter || null,
                status: 'Pending'
            });

            // If referred from job page, redirect back there or to applications
            const referer = req.headers.referer;
            if (referer && referer.includes('/jobs/')) {
                return res.redirect(referer);
            }
            res.redirect('/applications');
        } catch (err) {
            console.error('Error creating application:', err);
            if (err.code === 'ER_DUP_ENTRY' || err.message.includes('Duplicate')) {
                return res.status(400).send('<h1>Hata: Bu ilana bu kullanıcı zaten başvuru yapmıştır!</h1><a href="/applications">← Geri Dön</a>');
            }
            res.status(500).send('<h1>500 - Başvuru gönderilemedi</h1>');
        }
    },

    // 🩹 [DIRECT ROUTE: POST /applications/:id/status] Başvuru durumunu güncelle
    updateStatus: async (req, res) => {
        try {
            const { status } = req.body;
            await ApplicationModel.updateStatus(req.params.id, status);
            res.redirect(`/applications/${req.params.id}`);
        } catch (err) {
            console.error('Error updating status:', err);
            res.status(500).send('<h1>500 - Durum güncellenemedi</h1>');
        }
    },

    // 🗑️ [DIRECT ROUTE: POST /applications/:id/delete] Başvuruyu sil
    delete: async (req, res) => {
        try {
            await ApplicationModel.delete(req.params.id);
            res.redirect('/applications');
        } catch (err) {
            console.error('Error deleting application:', err);
            res.status(500).send('<h1>500 - Başvuru silinemedi</h1>');
        }
    },

    // 🔗 [NESTED ROUTE: GET /jobs/:id/applications] Belirli iş ilanına gelen başvuruları göster
    getJobApplications: async (req, res) => {
        try {
            const jobId = Number(req.params.id);
            const job = await JobPostingModel.findById(jobId);
            if (!job) {
                return res.status(404).send('<h1>404 - İş İlanı Bulunamadı</h1><a href="/jobs">← İlanlara Dön</a>');
            }
            const applications = await ApplicationModel.findByJob(jobId);
            const users = await UserModel.findAll();
            res.render('applications', {
                applications,
                jobs: [job],
                users,
                filterType: 'job',
                filterTarget: job,
                selectedStatus: '',
                errorMessage: null
            });
        } catch (err) {
            console.error('Error fetching job applications:', err);
            res.status(500).send('<h1>500 - İlan başvuruları yüklenirken hata oluştu</h1>');
        }
    },

    // 🔗 [NESTED ROUTE: GET /users/:id/applications] Belirli bir kullanıcının yaptığı başvuruları göster
    getUserApplications: async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send('<h1>404 - Kullanıcı Bulunamadı</h1><a href="/users">← Kullanıcılara Dön</a>');
            }
            const applications = await ApplicationModel.findByUser(userId);
            const jobs = await JobPostingModel.findAll();
            res.render('applications', {
                applications,
                jobs,
                users: [user],
                filterType: 'user',
                filterTarget: user,
                selectedStatus: '',
                errorMessage: null
            });
        } catch (err) {
            console.error('Error fetching user applications:', err);
            res.status(500).send('<h1>500 - Kullanıcı başvuruları yüklenirken hata oluştu</h1>');
        }
    }
};

module.exports = applicationController;
