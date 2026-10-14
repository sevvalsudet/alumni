// config/db.js
// MySQL Database Connection Pool for Alumni Tracking System

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'alumni_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Helper function to test database connectivity
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully.');
        connection.release();
        return true;
    } catch (err) {
        console.warn(`⚠️ MySQL Connection Warning (${err.code || err.message}). Operating with database fallback.`);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
