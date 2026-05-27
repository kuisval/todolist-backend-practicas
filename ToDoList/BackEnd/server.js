require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const db           = require('./database');
const authRoutes   = require('./routes/auth.routes');
const taskRoutes   = require('./routes/task.routes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware global ───────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Google ─────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'http://localhost:3001/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(profile.id);

    if (!user) {
      const username = profile.displayName.replace(/\s+/g, '_').toLowerCase();
      const result   = db.prepare(
        'INSERT INTO users (username, google_id) VALUES (?, ?)'
      ).run(username, profile.id);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done)   => done(null, user.id));
passport.deserializeUser((id, done)   => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  done(null, user);
});

// ─── Rutas ───────────────────────────────
app.use('/auth',  authRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(` Servidor en http://localhost:${PORT}`);
  console.log(`   POST   /auth/register`);
  console.log(`   POST   /auth/login`);
  console.log(`   GET    /auth/google`);
  console.log(`   GET    /tasks`);
  console.log(`   POST   /tasks`);
  console.log(`   PUT    /tasks/:id`);
  console.log(`   DELETE /tasks/:id`);
});