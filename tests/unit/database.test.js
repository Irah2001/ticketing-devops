const pool = require('../../src/db/database');

describe('Database Insertion', () => {
    beforeAll(async () => {
        await pool.query('DELETE FROM tickets');
    });

    test('should insert a new ticket', async () => {
        const [result] = await pool.query('INSERT INTO tickets (type_id, email, message) VALUES (?, ?, ?)', [1, 'test@test.com', 'This is a test message.']);
        expect(result.affectedRows).toBe(1);
    });
});