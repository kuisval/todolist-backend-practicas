const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'todolist.db'));

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT    NOT NULL UNIQUE,
    password  TEXT,
    google_id TEXT    UNIQUE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    text      TEXT    NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    due_date  TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;