// controllers/apiAnnouncementController.js
// REST API Controller — JSON döndürür (Postman / frontend için)

const AnnouncementModel = require('../models/announcementModel');

const apiAnnouncementController = {

    // GET /api/announcements → Tüm duyuruları JSON olarak listele
    getAll: (req, res) => {
        const announcements = AnnouncementModel.findAll();
        res.json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    },

    // GET /api/announcements/:id → Belirli bir duyuruyu getir
    getById: (req, res) => {
        const announcement = AnnouncementModel.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        res.json({ success: true, data: announcement });
    },

    // POST /api/announcements → Yeni duyuru oluştur
    create: (req, res) => {
        const { title, content, author, date, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'title and content are required'
            });
        }
        const newAnnouncement = AnnouncementModel.create({ title, content, author, date, category });
        res.status(201).json({ success: true, data: newAnnouncement });
    },

    // PUT /api/announcements/:id → Duyuruyu tamamen güncelle (Full Update)
    update: (req, res) => {
        const { title, content, author, date, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'title and content are required'
            });
        }
        const updated = AnnouncementModel.update(req.params.id, { title, content, author, date, category });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        res.json({ success: true, data: updated });
    },

    // PATCH /api/announcements/:id → Duyuruyu kısmen güncelle (Partial Update)
    patch: (req, res) => {
        const patched = AnnouncementModel.patch(req.params.id, req.body);
        if (!patched) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        res.json({ success: true, data: patched });
    },

    // DELETE /api/announcements/:id → Duyuruyu sil
    delete: (req, res) => {
        const deleted = AnnouncementModel.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        res.json({ success: true, message: 'Announcement deleted', data: deleted });
    }
};

module.exports = apiAnnouncementController;
