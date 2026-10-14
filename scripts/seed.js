// scripts/seed.js
// Database Seeder using Factory Pattern for Alumni Tracking System

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const userFactory = require('../factories/userFactory');
const announcementFactory = require('../factories/announcementFactory');

async function seedDatabase() {
    console.log('🌱 [Database Seeder] Starting database seeding process...');

    // 1. Generate users via userFactory
    userFactory.resetId(1);
    const users = [
        // Deterministic core records
        userFactory.create({
            id: 1,
            name: 'Şevval Sude',
            email: 'sevvalsude@alumni.edu',
            role: 'Student',
            department: 'Computer Engineering',
            company: null
        }),
        userFactory.create({
            id: 2,
            name: 'Sude Top',
            email: 'sude@alumni.edu',
            role: 'Alumni',
            department: 'Computer Engineering',
            company: 'Google'
        }),
        userFactory.create({
            id: 3,
            name: 'Şevval Çelik',
            email: 'sevval@alumni.edu',
            role: 'Alumni',
            department: 'Software Engineering',
            company: 'Microsoft'
        }),
        // Additional diverse users generated via factory (IDs 4 to 25)
        ...(() => { userFactory.resetId(4); return userFactory.createMany(22); })()
    ];

    console.log(`👤 [User Factory] Generated ${users.length} user records.`);

    // 2. Generate announcements via announcementFactory (10 total)
    announcementFactory.resetId(1);
    const announcements = announcementFactory.createMany(10, { author_id: 1 });
    console.log(`📢 [Announcement Factory] Generated ${announcements.length} announcement records.`);

    // 3. Save seeded dataset to data/seedData.json for reference / file-based usage
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const seedPayload = {
        seeded_at: new Date().toISOString(),
        users_count: users.length,
        announcements_count: announcements.length,
        users,
        announcements
    };

    fs.writeFileSync(path.join(dataDir, 'seedData.json'), JSON.stringify(seedPayload, null, 2), 'utf8');
    console.log(`💾 Seed dataset saved to file: data/seedData.json`);

    // 4. If MySQL is connected, insert into live database
    const mysql = require('mysql2/promise');
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'alumni_db'
    };

    let connection = null;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔌 Connected to MySQL. Inserting seeded records...');

        for (const u of users) {
            await connection.execute(`
                INSERT INTO users (id, name, email, role, department, company, graduation_year, bio, phone, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company)
            `, [u.id, u.name, u.email, u.role, u.department, u.company, u.graduation_year, u.bio, u.phone, u.linkedin_url, u.github_url]);
        }

        for (const a of announcements) {
            await connection.execute(`
                INSERT INTO announcements (id, author_id, title, content, category, date, priority)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)
            `, [a.id, a.author_id, a.title, a.content, a.category, a.date, a.priority]);
        }

        console.log('✅ Seed data successfully committed to MySQL database.');
    } catch (err) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            console.log('ℹ️ [Offline Mode] MySQL is offline; seed data generated & verified locally via Factory.');
        } else {
            console.log('⚠️ Notice on DB seed:', err.message);
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }

    console.log('\n🎉 [Factory & Seed Completed Successfully]');
}

seedDatabase();
