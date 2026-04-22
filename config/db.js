const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hexa_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(() => console.log('✅ Database Connected!'))
    .catch((err) => console.log('❌ DB Connection Error:', err));

module.exports = db;
