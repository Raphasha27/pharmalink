const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// Only doctors can create digital prescriptions
router.post('/', authenticate, authorize('doctor'), auditLog('ISSUE_DIGITAL_SCRIPT', 'PRESCRIPTION'), prescriptionController.createPrescription);

// Patients can upload a physical script photo
router.post('/upload', authenticate, authorize('patient'), auditLog('UPLOAD_PHYSICAL_SCRIPT', 'PRESCRIPTION'), prescriptionController.uploadManualScript);

// Patients can view their scripts
router.get('/my-scripts', authenticate, authorize('patient'), prescriptionController.getPatientPrescriptions);

module.exports = router;
