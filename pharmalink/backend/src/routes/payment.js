const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Patients initialize payment
router.post('/initialize', authenticate, paymentController.initializePayment);

// Paystack sends webhooks here
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
