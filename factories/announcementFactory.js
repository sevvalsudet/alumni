// factories/announcementFactory.js
// Factory pattern for generating realistic Announcement entities

const { faker } = require('@faker-js/faker');

const CATEGORIES = ['General', 'Event', 'Scholarship', 'Career', 'Academic'];
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

const SAMPLE_TEMPLATES = [
    {
        title: "Annual Alumni Networking Summit",
        category: "Event",
        content: "Join us for an evening of networking, panel discussions, and reuniting with former classmates."
    },
    {
        title: "Tech Mentorship Program Applications Open",
        category: "Career",
        content: "Experienced graduates are inviting active students to apply for 1-on-1 career mentorship."
    },
    {
        title: "Graduate Fellowship Fund Announced",
        category: "Scholarship",
        content: "Applications are now open for the 2026 Academic Excellence Fellowship Program."
    },
    {
        title: "New AI & Cloud Computing Lab Opening",
        category: "Academic",
        content: "We are thrilled to unveil our cutting-edge AI and distributed computing research facility."
    },
    {
        title: "Campus Career Fair & On-site Interviews",
        category: "Career",
        content: "Top global tech organizations will conduct preliminary interviews with graduating seniors."
    }
];

let currentId = 1;

const announcementFactory = {
    // Generate single announcement entity definition
    definition: (overrides = {}) => {
        const template = faker.helpers.arrayElement(SAMPLE_TEMPLATES);
        const category = overrides.category || template.category;

        return {
            id: overrides.id !== undefined ? overrides.id : currentId++,
            author_id: overrides.author_id !== undefined ? overrides.author_id : 1,
            title: overrides.title || `${template.title} - ${faker.date.month()}`,
            content: overrides.content || `${template.content} ${faker.lorem.paragraph(2)}`,
            category,
            date: overrides.date || faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            priority: overrides.priority || faker.helpers.arrayElement(PRIORITIES),
            ...overrides
        };
    },

    // Create a single instance
    create: (overrides = {}) => {
        return announcementFactory.definition(overrides);
    },

    // Create multiple instances
    createMany: (count = 5, overrides = {}) => {
        return Array.from({ length: count }, () => announcementFactory.definition(overrides));
    },

    // Reset auto-increment counter
    resetId: (start = 1) => {
        currentId = start;
    }
};

module.exports = announcementFactory;
