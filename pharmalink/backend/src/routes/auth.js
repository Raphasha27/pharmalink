const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auditLog = require('../middleware/audit');

// Public routes for onboarding
router.post('/register', auditLog('USER_REGISTER', 'USER'), authController.register);
router.post('/login', authController.login); // We log login success inside the controller or separate middleware

// Health check
router.get('/health-check', (req, res) => {
    res.json({ status: 'active', timestamp: new Date() });
});

module.exports = router;
