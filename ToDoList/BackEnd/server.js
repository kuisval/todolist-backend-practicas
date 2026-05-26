const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('./database');

const app    = express();
const PORT   = 3001;
const SECRET = 'mi_clave_secreta_jwt'; // En producción usar variable de entorno

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// MIDDLEWARE — verificar token JWT
// ─────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId; // guardamos el id del usuario en el request
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// ─────────────────────────────────────────
// AUTH — Register
// ─────────────────────────────────────────
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
  }

  // Verificar si el usuario ya existe
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);

  const token = jwt.sign({ userId: result.lastInsertRowid }, SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, username });
});

// ─────────────────────────────────────────
// AUTH — Login
// ─────────────────────────────────────────
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

  res.json({ token, username: user.username });
});

// ─────────────────────────────────────────
// TASKS — todas protegidas con authMiddleware
// ─────────────────────────────────────────

// GET /tasks — solo las tareas del usuario autenticado
app.get('/tasks', authMiddleware, (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.userId);
  // Convertir completed de 0/1 (SQLite) a false/true (JS)
  const parsed = tasks.map(t => ({ ...t, completed: t.completed === 1 }));
  res.json(parsed);
});

// POST /tasks — crear tarea para el usuario autenticado
app.post('/tasks', authMiddleware, (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'El texto de la tarea es requerido' });
  }

  const result = db.prepare('INSERT INTO tasks (user_id, text) VALUES (?, ?)').run(req.userId, text.trim());
  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({ ...newTask, completed: newTask.completed === 1 });
});

// PUT /tasks/:id — editar tarea (solo si pertenece al usuario)
app.put('/tasks/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { text, completed } = req.body;

  if (text !== undefined) {
    if (text.trim() === '') return res.status(400).json({ error: 'El texto no puede estar vacío' });
    db.prepare('UPDATE tasks SET text = ? WHERE id = ?').run(text.trim(), id);
  }

  if (completed !== undefined) {
    db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  }

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json({ ...updated, completed: updated.completed === 1 });
});

// DELETE /tasks/:id — eliminar tarea (solo si pertenece al usuario)
app.delete('/tasks/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ message: 'Tarea eliminada correctamente' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST   /auth/register`);
  console.log(`   POST   /auth/login`);
  console.log(`   GET    /tasks`);
  console.log(`   POST   /tasks`);
  console.log(`   PUT    /tasks/:id`);
  console.log(`   DELETE /tasks/:id`);
});
