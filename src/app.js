const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('./db/database');
const validate = require('./validation');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    if (req.cookies.session) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        res.cookie('session', 'authenticated', { httpOnly: true, maxAge: 3600000 });
        res.redirect('/tickets');
    } else {
        res.status(401).send('Invalid credentials.');
    }
});

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

app.get('/tickets', checkAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Number of tickets per page
    const offset = (page - 1) * limit;

    try {
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM tickets');
        const totalPages = Math.ceil(totalRows[0].count / limit);

        const [rows] = await pool.query('SELECT t.id, ty.name as type_name, t.email, t.message, t.created_at FROM tickets t JOIN types ty ON t.type_id = ty.id ORDER BY t.created_at DESC LIMIT ?, ?', [offset, limit]);
        const ticketsList = rows.map(row => `<tr><td>${row.type_name}</td><td>${row.email}</td><td>${row.message}</td><td>${row.created_at}</td><td><form action="/tickets/delete/${row.id}" method="POST"><button type="submit">Delete</button></form></td></tr>`).join('');

        let paginationLinks = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks += `<a href="/tickets?page=${i}" class="${i === page ? 'active' : ''}">${i}</a>`;
        }

        const template = fs.readFileSync(path.join(__dirname, '../public/tickets.html'), 'utf-8');
        let html = template.replace('<!-- SUBMISSIONS_LIST -->', ticketsList);
        html = html.replace('<!-- PAGINATION -->', paginationLinks);

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving tickets');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

app.post('/tickets/delete/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
        res.redirect('/tickets');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting ticket');
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = app;