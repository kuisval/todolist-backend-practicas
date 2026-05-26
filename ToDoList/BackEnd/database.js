const Database = require('better-sqlite3');
const path = require('path');

// El archivo .db se crea automáticamente en la carpeta BackEnd
const db = new Database(path.join(__dirname, 'todolist.db'));

// Activar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    text      TEXT    NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
