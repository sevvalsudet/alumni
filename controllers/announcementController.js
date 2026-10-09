// controllers/announcementController.js
// Web Controller — EJS view render eder (Tarayıcı arayüzü için)

const AnnouncementModel = require('../models/announcementModel');

const announcementController = {

    // GET /announcements → Tüm duyuruları listele + oluşturma formu
    getAll: (req, res) => {
        const announcements = AnnouncementModel.findAll();
        res.render('announcements', { announcements });
    },

    // GET /announcements/:id → Duyuru detay sayfası
    getById: (req, res) => {
        const announcement = AnnouncementModel.findById(req.params.id);
        if (!announcement) {
            return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
        }
        res.render('announcementDetail', { announcement });
    },

    // POST /announcements → Yeni duyuru oluştur (form submit)
    create: (req, res) => {
        const { title, content, author, date, category } = req.body;
        if (!title || !content) {
            return res.status(400).send('<h1>Error: title and content are required!</h1><a href="/announcements">← Back</a>');
        }
        AnnouncementModel.create({ title, content, author, date, category });
        res.redirect('/announcements');
    },

    // GET /announcements/:id/edit → Düzenleme formunu göster
    editForm: (req, res) => {
        const announcement = AnnouncementModel.findById(req.params.id);
        if (!announcement) {
            return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
        }
        res.render('announcementEdit', { announcement });
    },

    // POST /announcements/:id/update → Düzenleme formundan gelen veriyi kaydet
    update: (req, res) => {
        const { title, content, author, date, category } = req.body;
        const updated = AnnouncementModel.update(req.params.id, { title, content, author, date, category });
        if (!updated) {
            return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
        }
        res.redirect('/announcements');
    },

    // POST /announcements/:id/delete → Duyuruyu sil
    delete: (req, res) => {
        AnnouncementModel.delete(req.params.id);
        res.redirect('/announcements');
    }
};

module.exports = announcementController;
