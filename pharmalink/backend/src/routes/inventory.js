const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('pharmacist'), inventoryController.getInventory);
router.patch('/update', authenticate, authorize('pharmacist'), inventoryController.updateStock);

module.exports = router;
