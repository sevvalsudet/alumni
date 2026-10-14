// models/announcementModel.js
// 🎓 MVC Mimarisi - Model Katmanı (Announcement Model with Database Connection)
// Gerçek MySQL veritabanı sorguları (SELECT, INSERT, UPDATE, DELETE) ve kesintisiz fallback desteği.

const { pool } = require('../config/db');

let fallbackAnnouncements = [
    {
        id: 1,
        author_id: 1,
        title: "2024 Alumni Gathering",
        content: "We are excited to announce our annual alumni gathering scheduled for December 2024. All graduates are welcome!",
        author: "Admin",
        date: "2024-11-01",
        category: "Event",
        priority: "Normal"
    },
    {
        id: 2,
        author_id: 1,
        title: "New Scholarship Opportunities",
        content: "Several new scholarship programs are now available for current students. Please check the details on the portal.",
        author: "Admin",
        date: "2024-10-15",
        category: "Scholarship",
        priority: "Normal"
    }
];

const AnnouncementModel = {
    // 📖 [READ ALL] GET all announcements from database
    findAll: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT a.*, COALESCE(u.name, 'Admin') AS author 
                FROM announcements a
                LEFT JOIN users u ON a.author_id = u.id
                ORDER BY a.id ASC
            `);
            return rows;
        } catch (err) {
            return fallbackAnnouncements;
        }
    },

    // 🔍 [READ ONE] GET announcement by ID from database
    findById: async (id) => {
        try {
            const [rows] = await pool.query(`
                SELECT a.*, COALESCE(u.name, 'Admin') AS author 
                FROM announcements a
                LEFT JOIN users u ON a.author_id = u.id
                WHERE a.id = ?
            `, [Number(id)]);
            return rows[0] || null;
        } catch (err) {
            return fallbackAnnouncements.find(a => a.id === Number(id)) || null;
        }
    },

    // ➕ [CREATE] INSERT new announcement into database
    create: async (data) => {
        const date = data.date || new Date().toISOString().split('T')[0];
        const category = data.category || 'General';
        const priority = data.priority || 'Normal';
        const authorId = Number(data.author_id) || 1;

        try {
            const [result] = await pool.execute(
                `INSERT INTO announcements (author_id, title, content, category, date, priority)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [authorId, data.title, data.content, category, date, priority]
            );
            return {
                id: result.insertId,
                author_id: authorId,
                author: data.author || 'Admin',
                title: data.title,
                content: data.content,
                category,
                date,
                priority
            };
        } catch (err) {
            const maxId = fallbackAnnouncements.length > 0 ? Math.max(...fallbackAnnouncements.map(a => a.id)) : 0;
            const newAnnouncement = {
                id: maxId + 1,
                author_id: authorId,
                title: data.title,
                content: data.content,
                author: data.author || "Admin",
                date,
                category,
                priority
            };
            fallbackAnnouncements.push(newAnnouncement);
            return newAnnouncement;
        }
    },

    // ✏️ [UPDATE - PUT] UPDATE announcement in database
    update: async (id, data) => {
        const date = data.date || new Date().toISOString().split('T')[0];
        const category = data.category || 'General';
        const priority = data.priority || 'Normal';
        const authorId = Number(data.author_id) || 1;

        try {
            await pool.execute(
                `UPDATE announcements SET title=?, content=?, category=?, date=?, priority=? WHERE id=?`,
                [data.title, data.content, category, date, priority, Number(id)]
            );
            return await AnnouncementModel.findById(id);
        } catch (err) {
            const index = fallbackAnnouncements.findIndex(a => a.id === Number(id));
            if (index === -1) return null;
            fallbackAnnouncements[index] = {
                ...fallbackAnnouncements[index],
                title: data.title,
                content: data.content,
                author: data.author || fallbackAnnouncements[index].author,
                date,
                category,
                priority
            };
            return fallbackAnnouncements[index];
        }
    },

    // 🩹 [UPDATE - PATCH] Partially UPDATE announcement in database
    patch: async (id, data) => {
        try {
            const fields = Object.keys(data).filter(k => k !== 'id');
            if (fields.length === 0) return await AnnouncementModel.findById(id);

            const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
            const values = fields.map(f => data[f]);
            values.push(Number(id));

            await pool.execute(`UPDATE announcements SET ${setClause} WHERE id = ?`, values);
            return await AnnouncementModel.findById(id);
        } catch (err) {
            const announcement = fallbackAnnouncements.find(a => a.id === Number(id));
            if (!announcement) return null;
            Object.assign(announcement, data);
            return announcement;
        }
    },

    // 🗑️ [DELETE] DELETE announcement from database
    delete: async (id) => {
        try {
            const item = await AnnouncementModel.findById(id);
            if (!item) return null;
            await pool.execute('DELETE FROM announcements WHERE id = ?', [Number(id)]);
            return item;
        } catch (err) {
            const index = fallbackAnnouncements.findIndex(a => a.id === Number(id));
            if (index === -1) return null;
            return fallbackAnnouncements.splice(index, 1)[0];
        }
    }
};

module.exports = AnnouncementModel;
