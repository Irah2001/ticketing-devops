const pool = require('../src/db/database');

const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type_id INT NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (type_id) REFERENCES types(id)
            );
        `);
        console.log('Tables \'types\' and \'tickets\' created or already exist.');
    } finally {
        connection.release();
    }
};

const insertTypes = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            INSERT IGNORE INTO types (id, name) VALUES
            (1, 'bug'),
            (2, 'question'),
            (3, 'suggestion');
        `);
        console.log('Inserted initial types with specific IDs.');
    } finally {
        connection.release();
    }
};

const seed = async () => {
    try {
        await createTables();
        await insertTypes();
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        pool.end();
    }
};

if (require.main === module) {
    seed();
}

module.exports = seed;