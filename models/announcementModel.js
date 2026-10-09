// models/announcementModel.js
// In-memory data storage (no database yet)

let announcements = [
    {
        id: 1,
        title: "2024 Alumni Gathering",
        content: "We are excited to announce our annual alumni gathering scheduled for December 2024. All graduates are welcome!",
        author: "Admin",
        date: "2024-11-01",
        category: "Event"
    },
    {
        id: 2,
        title: "New Scholarship Opportunities",
        content: "Several new scholarship programs are now available for current students. Please check the details on the portal.",
        author: "Admin",
        date: "2024-10-15",
        category: "Scholarship"
    }
];

const AnnouncementModel = {
    // Get all announcements
    findAll: () => announcements,

    // Get a single announcement by id
    findById: (id) => announcements.find(a => a.id === Number(id)) || null,

    // Create a new announcement
    create: (data) => {
        const maxId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) : 0;
        const newAnnouncement = {
            id: maxId + 1,
            title: data.title,
            content: data.content,
            author: data.author || "Admin",
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || "General"
        };
        announcements.push(newAnnouncement);
        return newAnnouncement;
    },

    // Full update (PUT) — replace all fields
    update: (id, data) => {
        const index = announcements.findIndex(a => a.id === Number(id));
        if (index === -1) return null;
        announcements[index] = {
            id: Number(id),
            title: data.title,
            content: data.content,
            author: data.author,
            date: data.date,
            category: data.category
        };
        return announcements[index];
    },

    // Partial update (PATCH) — only update provided fields
    patch: (id, data) => {
        const announcement = announcements.find(a => a.id === Number(id));
        if (!announcement) return null;
        Object.assign(announcement, data);
        return announcement;
    },

    // Delete an announcement
    delete: (id) => {
        const index = announcements.findIndex(a => a.id === Number(id));
        if (index === -1) return null;
        return announcements.splice(index, 1)[0];
    }
};

module.exports = AnnouncementModel;
