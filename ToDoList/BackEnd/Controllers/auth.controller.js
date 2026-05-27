const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../database');

const register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  if (password.length < 4)
    return res.status(400).json({ error: 'Contraseña mínimo 4 caracteres' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'El usuario ya existe' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password) VALUES (?, ?)'
  ).run(username, hashedPassword);

  const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, username });
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !user.password)
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
};

const googleCallback = (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`http://localhost:5173?token=${token}&username=${req.user.username}`);
};

module.exports = { register, login, googleCallback };