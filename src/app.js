const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('./db/database');
const validate = require('./validation');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Middleware for HTTP Basic Authentication
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required.');
    }

    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') {
        return res.status(401).send('Authentication required.');
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString();
    const [username, password] = decodedCredentials.split(':');

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('Invalid credentials.');
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/submit', async (req, res) => {
    const { type_id, email, message } = req.body;
    if (!validate(type_id, email, message)) {
        return res.status(400).send('Invalid input');
    }
    try {
        await pool.query('INSERT INTO tickets (type_id, email, message) VALUES (?, ?, ?)', [type_id, email, message]);
        res.redirect('/tickets');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving ticket');
    }
});

app.get('/tickets', basicAuth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT t.id, ty.name as type_name, t.email, t.message, t.created_at FROM tickets t JOIN types ty ON t.type_id = ty.id ORDER BY t.created_at DESC');
        const ticketsList = rows.map(row => `<li><strong>Type:</strong> ${row.type_name} - <strong>Email:</strong> ${row.email} - <strong>Message:</strong> ${row.message} - <strong>Date:</strong> ${row.created_at}</li>`).join('');

        const template = fs.readFileSync(path.join(__dirname, '../public/tickets.html'), 'utf-8');
        const html = template.replace('<!-- SUBMISSIONS_LIST -->', ticketsList);

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving tickets');
    }
});

app.get('/logout', (req, res) => {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authentication required"');
    res.status(401).send('Logged out. Please close your browser or clear credentials.');
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = app;