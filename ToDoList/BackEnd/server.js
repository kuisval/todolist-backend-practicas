require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const session  = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const db       = require('./database');

const app    = express();
const PORT   = 3001;
const SECRET = process.env.JWT_SECRET;

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({ secret: SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Google Strategy ───────────
passport.use(new GoogleStrategy(
  {
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL:  'http://localhost:3001/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // Buscar si ya existe el usuario con ese google_id
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(profile.id);

    if (!user) {
      // Crear usuario nuevo con el nombre de Google
      const username = profile.displayName.replace(/\s+/g, '_').toLowerCase();
      const result = db.prepare(
        'INSERT INTO users (username, google_id) VALUES (?, ?)'
      ).run(username, profile.id);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  done(null, user);
});

// ─── Middleware JWT ──────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// ─── Auth normal ────────────────────────
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  if (password.length < 4) return res.status(400).json({ error: 'Contraseña mínimo 4 caracteres' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'El usuario ya existe' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
  const token = jwt.sign({ userId: result.lastInsertRowid }, SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, username });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !user.password) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
});

// ─── Auth Google ─────────────────────────
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
  (req, res) => {
    // Generar JWT igual que en login normal
    const token = jwt.sign({ userId: req.user.id }, SECRET, { expiresIn: '7d' });
    // Redirigir al frontend con el token en la URL
    res.redirect(`http://localhost:5173?token=${token}&username=${req.user.username}`);
  }
);

// ─── Tasks ───────────────────────────────
app.get('/tasks', authMiddleware, (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.userId);
  res.json(tasks.map(t => ({ ...t, completed: t.completed === 1 })));
});

// POST /tasks
app.post('/tasks', authMiddleware, (req, res) => {
  const { text, due_date } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Texto requerido' });

  const result = db.prepare(
    'INSERT INTO tasks (user_id, text, due_date) VALUES (?, ?, ?)'
  ).run(req.userId, text.trim(), due_date || null);

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...newTask, completed: false });
});

// PUT /tasks/:id
app.put('/tasks/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  const { text, completed, due_date } = req.body;
  if (text !== undefined) db.prepare('UPDATE tasks SET text = ? WHERE id = ?').run(text.trim(), id);
  if (completed !== undefined) db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  if (due_date !== undefined) db.prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(due_date, id);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json({ ...updated, completed: updated.completed === 1 });
});

app.delete('/tasks/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ message: 'Tarea eliminada' });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));