// controllers/jobPostingController.js
// 🎓 MVC - Web UI Controller for Job Postings (EJS Views)

const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');

const jobPostingController = {
    // 📖 [DIRECT ROUTE: GET /jobs] Tüm iş ilanlarını ve ekleme formunu göster
    getAll: async (req, res) => {
        try {
            const jobs = await JobPostingModel.findAll();
            const users = await UserModel.findAll();
            res.render('jobs', { jobs, users, selectedUser: null });
        } catch (err) {
            console.error('Error fetching jobs:', err);
            res.status(500).send('<h1>500 - İş ilanları yüklenirken hata oluştu</h1>');
        }
    },

    // 🔍 [DIRECT ROUTE: GET /jobs/:id] Tek bir iş ilanının detay sayfasını göster
    getById: async (req, res) => {
        try {
            const job = await JobPostingModel.findById(req.params.id);
            if (!job) {
                return res.status(404).send('<h1>404 - İş İlanı Bulunamadı</h1><a href="/jobs">← İlanlara Dön</a>');
            }
            const applicants = await JobPostingModel.getApplicants(req.params.id);
            const users = await UserModel.findAll();
            res.render('jobDetail', { job, applicants, users });
        } catch (err) {
            console.error('Error fetching job detail:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // ➕ [DIRECT ROUTE: POST /jobs] Yeni iş ilanı oluştur
    create: async (req, res) => {
        try {
            const { title, company, location, employment_type, experience_level, salary, description, requirements, contact_email, application_url, application_deadline, posted_by } = req.body;
            if (!title || !company || !location || !description) {
                return res.status(400).send('<h1>Hata: Zorunlu alanları doldurunuz!</h1><a href="/jobs">← Geri</a>');
            }
            await JobPostingModel.create({
                title, company, location, employment_type, experience_level,
                salary, description, requirements, contact_email, application_url,
                application_deadline, posted_by: Number(posted_by) || 1
            });
            res.redirect('/jobs');
        } catch (err) {
            console.error('Error creating job:', err);
            res.status(500).send('<h1>500 - İlan oluşturulamadı</h1>');
        }
    },

    // 🗑️ [DIRECT ROUTE: POST /jobs/:id/delete] İlanı sil
    delete: async (req, res) => {
        try {
            await JobPostingModel.delete(req.params.id);
            res.redirect('/jobs');
        } catch (err) {
            console.error('Error deleting job:', err);
            res.status(500).send('<h1>500 - İlan silinemedi</h1>');
        }
    },

    // 🔗 [NESTED ROUTE: GET /users/:id/jobs] Belirli bir kullanıcının ilanlarını listeleyen sayfa
    getUserJobs: async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send('<h1>404 - Kullanıcı Bulunamadı</h1><a href="/users">← Kullanıcılara Dön</a>');
            }
            const jobs = await JobPostingModel.findByUser(userId);
            const users = [user];
            res.render('jobs', { jobs, users, selectedUser: user });
        } catch (err) {
            console.error('Error fetching nested user jobs:', err);
            res.status(500).send('<h1>500 - Kullanıcı ilanları yüklenirken hata oluştu</h1>');
        }
    }
};

module.exports = jobPostingController;
