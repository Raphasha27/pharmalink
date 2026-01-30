const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authenticate, authorize } = require('../middleware/auth');

// Drivers only: Get their tasks
router.get('/my-tasks', authenticate, authorize('driver'), deliveryController.getMyTasks);

// Drivers only: Update delivery status and location
router.patch('/:id/status', authenticate, authorize('driver'), deliveryController.updateDeliveryStatus);

// Drivers only: Finalize delivery with biometric PoD
router.post('/:id/verify-biometric', authenticate, authorize('driver'), deliveryController.verifyBiometric);

module.exports = router;
