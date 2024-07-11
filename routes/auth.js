const express = require('express');
const { register, login,findUserByUsername } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/:username', authenticate, findUserByUsername);

module.exports = router;
