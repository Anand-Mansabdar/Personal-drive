const express = require('express');
const router = express.Router();

const {body} = require('express-validator');
const {register, login, me, logout} = require('../controllers/auth.controller');

const auth = require('../middlewares/auth');

router.post('/register', [
  body('username').isLength({min: 4, max: 40}),
  body('email').isEmail(),
  body('password').isLength({min: 6}),
], register);


router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({min: 6})
], login);

router.get('me', auth, me);

router.post('/logout', auth, logout);

module.exports = router;