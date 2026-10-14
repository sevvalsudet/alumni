// models/userModel.js
// 🎓 MVC Mimarisi - Model Katmanı (User Model with Database Connection)
// Gerçek MySQL veritabanı sorguları (SELECT, INSERT, UPDATE, DELETE) ve kesintisiz fallback desteği.

const { pool } = require('../config/db');

const fs = require('fs');
const path = require('path');
const userFactory = require('../factories/userFactory');

// In-memory fallback veri kümesi (seedData.json veya Factory üzerinden 25 zengin kullanıcı yükler)
function loadFallbackUsers() {
    const seedPath = path.join(__dirname, '..', 'data', 'seedData.json');
    if (fs.existsSync(seedPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
            if (data.users && data.users.length > 0) {
                return data.users;
            }
        } catch (e) {}
    }
    userFactory.resetId(1);
    return [
        userFactory.create({ id: 1, name: "Şevval Sude", email: "sevvalsude@alumni.edu", role: "Student", department: "Computer Engineering", company: null }),
        userFactory.create({ id: 2, name: "Sude Top", email: "sude@alumni.edu", role: "Alumni", department: "Computer Engineering", company: "Google" }),
        userFactory.create({ id: 3, name: "Şevval Çelik", email: "sevval@alumni.edu", role: "Alumni", department: "Software Engineering", company: "Microsoft" }),
        ...(() => { userFactory.resetId(4); return userFactory.createMany(22); })()
    ];
}

let fallbackUsers = loadFallbackUsers();

const UserModel = {
    // 📖 [READ ALL] GET all users from database
    findAll: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM users ORDER BY id ASC');
            return rows;
        } catch (err) {
            return fallbackUsers;
        }
    },

    // 🔍 [READ ONE] GET user by ID from database
    findById: async (id) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [Number(id)]);
            return rows[0] || null;
        } catch (err) {
            return fallbackUsers.find(u => u.id === Number(id)) || null;
        }
    },

    // ➕ [CREATE] INSERT new user into database
    create: async (userData) => {
        const email = userData.email || `${userData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-4)}@alumni.edu`;
        try {
            const [result] = await pool.execute(
                `INSERT INTO users (name, email, role, department, company, graduation_year, bio, phone, linkedin_url, github_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userData.name,
                    email,
                    userData.role || 'Alumni',
                    userData.department || 'General',
                    userData.company || null,
                    userData.graduation_year || null,
                    userData.bio || null,
                    userData.phone || null,
                    userData.linkedin_url || null,
                    userData.github_url || null
                ]
            );
            return {
                id: result.insertId,
                name: userData.name,
                email,
                role: userData.role || 'Alumni',
                department: userData.department || 'General',
                company: userData.company || null
            };
        } catch (err) {
            const nextId = fallbackUsers.length > 0 ? Math.max(...fallbackUsers.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: nextId,
                name: userData.name,
                email,
                role: userData.role || 'Alumni',
                department: userData.department || 'General',
                company: userData.company || null
            };
            fallbackUsers.push(newUser);
            return newUser;
        }
    },

    // ✏️ [UPDATE - PUT] UPDATE user in database
    update: async (id, updateData) => {
        try {
            await pool.execute(
                `UPDATE users SET name=?, role=?, department=?, company=? WHERE id=?`,
                [
                    updateData.name,
                    updateData.role,
                    updateData.department || null,
                    updateData.company || null,
                    Number(id)
                ]
            );
            return await UserModel.findById(id);
        } catch (err) {
            const index = fallbackUsers.findIndex(u => u.id === Number(id));
            if (index === -1) return null;
            fallbackUsers[index] = {
                ...fallbackUsers[index],
                name: updateData.name || fallbackUsers[index].name,
                role: updateData.role || fallbackUsers[index].role,
                department: updateData.department || null,
                company: updateData.company || null
            };
            return fallbackUsers[index];
        }
    },

    // 🩹 [UPDATE - PATCH] Partially UPDATE user in database
    patch: async (id, partialData) => {
        try {
            const fields = Object.keys(partialData).filter(k => k !== 'id');
            if (fields.length === 0) return await UserModel.findById(id);

            const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
            const values = fields.map(f => partialData[f]);
            values.push(Number(id));

            await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, values);
            return await UserModel.findById(id);
        } catch (err) {
            const user = fallbackUsers.find(u => u.id === Number(id));
            if (!user) return null;
            Object.assign(user, partialData);
            return user;
        }
    },

    // 🗑️ [DELETE] DELETE user from database
    delete: async (id) => {
        try {
            const user = await UserModel.findById(id);
            if (!user) return null;
            await pool.execute('DELETE FROM users WHERE id = ?', [Number(id)]);
            return user;
        } catch (err) {
            const index = fallbackUsers.findIndex(u => u.id === Number(id));
            if (index === -1) return null;
            return fallbackUsers.splice(index, 1)[0];
        }
    }
};

module.exports = UserModel;
