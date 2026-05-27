const express        = require('express');
const passport       = require('passport');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login',    AuthController.login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
  AuthController.googleCallback
);

module.exports = router;