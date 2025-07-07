const pool = require('../../src/db/database');

describe('Database Insertion', () => {
    beforeAll(async () => {
        await pool.query('DELETE FROM submissions');
    });

    test('should insert a new submission', async () => {
        const [result] = await pool.query('INSERT INTO submissions (name, email) VALUES (?, ?)', ['test', 'test@test.com']);
        expect(result.affectedRows).toBe(1);
    });
});