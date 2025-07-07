const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('./db/database');
const validate = require('./validation');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email } = req.body;
    if (!validate(name, email)) {
        return res.status(400).send('Invalid input');
    }
    try {
        await pool.query('INSERT INTO submissions (name, email) VALUES (?, ?)', [name, email]);
        res.redirect('/submissions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving submission');
    }
});

app.get('/submissions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM submissions');
        const submissionsList = rows.map(row => `<li>${row.name} - ${row.email}</li>`).join('');

        const template = fs.readFileSync(path.join(__dirname, '../public/submissions.html'), 'utf-8');
        const html = template.replace('<!-- SUBMISSIONS_LIST -->', submissionsList);

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving submissions');
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = app;
