const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// Medical Aid Adjudication (Pre-payment check)
router.post('/adjudicate', authenticate, auditLog('MEDICAL_AID_CLAIM_CHECK', 'ORDER'), orderController.checkBenefits);

// Pharmacist Portal: View pending orders
router.get('/pending', authenticate, authorize('pharmacy'), orderController.getPendingOrders);
router.patch('/:orderId/accept', authenticate, authorize('pharmacist'), orderController.acceptOrder);
router.post('/:orderId/assign-driver', authenticate, authorize(['pharmacist', 'dispatcher']), orderController.assignDriver);

module.exports = router;
