// controllers/apiAnnouncementController.js
// REST API Controller — JSON döndürür (Postman / frontend için, async database desteğiyle)

const AnnouncementModel = require('../models/announcementModel');

const apiAnnouncementController = {

    // GET /api/announcements → Tüm duyuruları JSON olarak listele
    getAll: async (req, res) => {
        try {
            const announcements = await AnnouncementModel.findAll();
            res.json({
                success: true,
                count: announcements.length,
                data: announcements
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // GET /api/announcements/:id → Belirli bir duyuruyu getir
    getById: async (req, res) => {
        try {
            const announcement = await AnnouncementModel.findById(req.params.id);
            if (!announcement) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            res.json({ success: true, data: announcement });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // POST /api/announcements → Yeni duyuru oluştur
    create: async (req, res) => {
        try {
            const { title, content, author, date, category } = req.body;
            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'title and content are required'
                });
            }
            const newAnnouncement = await AnnouncementModel.create({ title, content, author, date, category });
            res.status(201).json({ success: true, data: newAnnouncement });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // PUT /api/announcements/:id → Duyuruyu tamamen güncelle (Full Update)
    update: async (req, res) => {
        try {
            const { title, content, author, date, category } = req.body;
            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'title and content are required'
                });
            }
            const updated = await AnnouncementModel.update(req.params.id, { title, content, author, date, category });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            res.json({ success: true, data: updated });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // PATCH /api/announcements/:id → Duyuruyu kısmen güncelle (Partial Update)
    patch: async (req, res) => {
        try {
            const patched = await AnnouncementModel.patch(req.params.id, req.body);
            if (!patched) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            res.json({ success: true, data: patched });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // DELETE /api/announcements/:id → Duyuruyu sil
    delete: async (req, res) => {
        try {
            const deleted = await AnnouncementModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            res.json({ success: true, message: 'Announcement deleted', data: deleted });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = apiAnnouncementController;
