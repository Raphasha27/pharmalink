const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Health Check
router.get('/health-check', (req, res) => res.json({ status: 'active', timestamp: new Date() }));

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
