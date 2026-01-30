const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

// Pharmacists only
router.get('/pending', authenticate, authorize('pharmacist'), orderController.getPendingOrders);
router.patch('/:orderId/accept', authenticate, authorize('pharmacist'), orderController.acceptOrder);
router.post('/:orderId/assign-driver', authenticate, authorize(['pharmacist', 'dispatcher']), orderController.assignDriver);

module.exports = router;
