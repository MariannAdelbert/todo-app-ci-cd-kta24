const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'todos.db');

// CORS seaded
const corsOptions = {
  origin: ['http://localhost:3000', 'http://nnairam.me', 'https://nnairam.me'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Ühenda SQLite andmebaasiga
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Loo tabel, kui see ei eksisteeri
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);
});

// API ENDPOINTS

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET - Kõik to-do kirjed
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST - Lisa uus to-do
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run('INSERT INTO todos (title, done) VALUES (?, ?)', [title.trim(), 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title: title.trim(), done: 0 });
  });
});

// PUT - Uuenda to-do kirjet (done ja/või title)
app.put('/api/todos/:id', (req, res) => {
  const { title, done } = req.body;
  const id = req.params.id;

  // Varem salvestatud väärtuste toomine
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Todo not found' });

    const updatedTitle = title !== undefined ? title : row.title;
    const updatedDone = done !== undefined ? done : row.done;

    db.run('UPDATE todos SET title = ?, done = ? WHERE id = ?', [updatedTitle, updatedDone, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title: updatedTitle, done: updatedDone });
    });
  });
});

// DELETE - Kustuta to-do
app.delete('/api/todos/:id', (req, res) => {
  db.run('DELETE FROM todos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

// Production build serveerimine (nt Reacti build)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Serveri töö alustamine
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// SQLite ühenduse sulgemine protsessi lõpetamisel
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  db.close(() => {
    console.log('SQLite connection closed.');
    process.exit(0);
  });
});
