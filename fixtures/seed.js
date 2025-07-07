const pool = require('../src/db/database');

const createTable = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL
            );
        `);
        console.log('Table \'submissions\' created or already exists.');
    } finally {
        connection.release();
    }
};

const insertData = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            INSERT INTO submissions (name, email) VALUES ('Alice', 'alice@example.com');
        `);
        console.log('Inserted initial data.');
    } finally {
        connection.release();
    }
};

const seed = async () => {
    try {
        await createTable();
        await insertData();
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
