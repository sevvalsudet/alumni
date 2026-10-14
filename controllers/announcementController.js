// controllers/announcementController.js
// Web Controller — EJS view render eder (Tarayıcı arayüzü için, async database desteğiyle)

const AnnouncementModel = require('../models/announcementModel');

const announcementController = {

    // GET /announcements → Tüm duyuruları listele + oluşturma formu
    getAll: async (req, res) => {
        try {
            const announcements = await AnnouncementModel.findAll();
            res.render('announcements', { announcements });
        } catch (err) {
            console.error('Error fetching announcements:', err);
            res.status(500).send('<h1>500 - Duyurular yüklenirken hata oluştu</h1>');
        }
    },

    // GET /announcements/:id → Duyuru detay sayfası
    getById: async (req, res) => {
        try {
            const announcement = await AnnouncementModel.findById(req.params.id);
            if (!announcement) {
                return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
            }
            res.render('announcementDetail', { announcement });
        } catch (err) {
            console.error('Error fetching announcement:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // POST /announcements → Yeni duyuru oluştur (form submit)
    create: async (req, res) => {
        try {
            const { title, content, author, date, category } = req.body;
            if (!title || !content) {
                return res.status(400).send('<h1>Error: title and content are required!</h1><a href="/announcements">← Back</a>');
            }
            await AnnouncementModel.create({ title, content, author, date, category });
            res.redirect('/announcements');
        } catch (err) {
            console.error('Error creating announcement:', err);
            res.status(500).send('<h1>500 - Duyuru oluşturulamadı</h1>');
        }
    },

    // GET /announcements/:id/edit → Düzenleme formunu göster
    editForm: async (req, res) => {
        try {
            const announcement = await AnnouncementModel.findById(req.params.id);
            if (!announcement) {
                return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
            }
            res.render('announcementEdit', { announcement });
        } catch (err) {
            console.error('Error fetching announcement for edit:', err);
            res.status(500).send('<h1>500 - Sunucu Hatası</h1>');
        }
    },

    // POST /announcements/:id/update → Düzenleme formundan gelen veriyi kaydet
    update: async (req, res) => {
        try {
            const { title, content, author, date, category } = req.body;
            const updated = await AnnouncementModel.update(req.params.id, { title, content, author, date, category });
            if (!updated) {
                return res.status(404).send('<h1>404 - Announcement not found</h1><a href="/announcements">← Back</a>');
            }
            res.redirect('/announcements');
        } catch (err) {
            console.error('Error updating announcement:', err);
            res.status(500).send('<h1>500 - Duyuru güncellenemedi</h1>');
        }
    },

    // POST /announcements/:id/delete → Duyuruyu sil
    delete: async (req, res) => {
        try {
            await AnnouncementModel.delete(req.params.id);
            res.redirect('/announcements');
        } catch (err) {
            console.error('Error deleting announcement:', err);
            res.status(500).send('<h1>500 - Duyuru silinemedi</h1>');
        }
    }
};

module.exports = announcementController;
