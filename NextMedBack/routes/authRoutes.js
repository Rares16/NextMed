const express = require('express');
const router = express.Router();
const { login } = require('../controller/authController');

// Login route
router.post('/login', login);

module.exports = router;
