// factories/userFactory.js
// Factory pattern for generating realistic User entities

const { faker } = require('@faker-js/faker');

const DEPARTMENTS = [
    'Computer Engineering',
    'Software Engineering',
    'Industrial Engineering',
    'Electrical & Electronics Engineering',
    'Management Information Systems',
    'Mechanical Engineering'
];

const COMPANIES = [
    'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta',
    'Spotify', 'Tesla', 'Netflix', 'Trendyol', 'Getir'
];

const ROLES = ['Admin', 'Alumni', 'Student'];

let currentId = 1;

const userFactory = {
    // Generate single user entity definition
    definition: (overrides = {}) => {
        const role = overrides.role || faker.helpers.arrayElement(ROLES);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;
        const email = overrides.email || faker.internet.email({ firstName, lastName }).toLowerCase();

        return {
            id: overrides.id !== undefined ? overrides.id : currentId++,
            name: overrides.name || name,
            email,
            password_hash: overrides.password_hash || '$2b$10$hashedPasswordSamplePlaceholder12345',
            role,
            department: overrides.department || faker.helpers.arrayElement(DEPARTMENTS),
            company: role === 'Student' ? null : (overrides.company || faker.helpers.arrayElement(COMPANIES)),
            graduation_year: role === 'Student' ? null : (overrides.graduation_year || faker.number.int({ min: 2016, max: 2025 })),
            bio: overrides.bio || faker.person.bio(),
            phone: overrides.phone || faker.phone.number(),
            linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
            github_url: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            ...overrides
        };
    },

    // Create a single instance
    create: (overrides = {}) => {
        return userFactory.definition(overrides);
    },

    // Create multiple instances
    createMany: (count = 5, overrides = {}) => {
        return Array.from({ length: count }, () => userFactory.definition(overrides));
    },

    // Reset auto-increment counter
    resetId: (start = 1) => {
        currentId = start;
    }
};

module.exports = userFactory;
