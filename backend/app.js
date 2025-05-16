const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'todos.db');

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, done INTEGER)');
});

app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO todos (title, done) VALUES (?, ?)', [title, 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, done: 0 });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { title, done } = req.body;
  db.run('UPDATE todos SET title = ?, done = ? WHERE id = ?', [title, done, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, title, done });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  db.run('DELETE FROM todos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});