const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');

// Only doctors can create prescriptions
router.post('/', authenticate, authorize('doctor'), prescriptionController.createPrescription);

// Patients can view their pending scripts
router.get('/my-scripts', authenticate, authorize('patient'), prescriptionController.getPatientPrescriptions);

module.exports = router;
