const db = require('../config/db');
const ocrService = require('../services/ocrService');
const identityService = require('../services/identityService');

/**
 * Doctor Portal: Create a new digital script/package
 */
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, medicationDetails, isRefrigerated, isControlledSubstance, pharmacyId } = req.body;
        const doctorId = req.user.userId;

        // --- Interaction Check (Advanced Requirement) ---
        const meds = medicationDetails.map(m => m.name.toLowerCase());
        let interactionWarning = null;
        
        if (meds.includes('warfarin') && meds.includes('aspirin')) {
            interactionWarning = "CRITICAL: Potential interaction between Warfarin and Aspirin detected (Increased bleeding risk).";
        }

        const result = await db.query(
            `INSERT INTO packages (pharmacy_id, prescription_reference, is_refrigerated, is_controlled_substance, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [pharmacyId, JSON.stringify({ ...medicationDetails, interactionWarning }), isRefrigerated, isControlledSubstance, 'pending_verification']
        );

        res.status(201).json({
            message: 'Digital script issued successfully',
            packageId: result.rows[0].id,
            warning: interactionWarning,
            status: 'pending_verification'
        });
    } catch (error) {
        console.error('Prescription Error:', error);
        res.status(500).json({ error: 'Failed to issue digital script' });
    }
};

/**
 * Patient View: Upload a physical script (Triggers OCR)
 */
exports.uploadManualScript = async (req, res) => {
    try {
        const { imageUrl, pharmacyId } = req.body;
        const patientId = req.user.userId;

        // 1. Log the intent
        const pkgResult = await db.query(
            'INSERT INTO packages (pharmacy_id, status) VALUES ($1, $2) RETURNING id',
            [pharmacyId, 'ocr_processing']
        );
        const packageId = pkgResult.rows[0].id;

        // 2. Trigger OCR Simulation (Async but we wait for demo)
        const extractedData = await ocrService.extractMedicationData(imageUrl);

        // 3. Verify Patient ID
        const idCheck = await identityService.verifySAID(extractedData.idNumber);

        // 4. Update Package with extracted data
        await db.query(
            'UPDATE packages SET prescription_reference = $1, status = $2 WHERE id = $3',
            [JSON.stringify(extractedData), 'pending_verification', packageId]
        );

        res.json({
            success: true,
            packageId,
            extractedData,
            identity: idCheck,
            warning: extractedData.confidenceScore < 0.9 ? 'Manual review required: High uncertainty' : null
        });
    } catch (error) {
        console.error('Manual Upload Error:', error);
        res.status(500).json({ error: 'OCR processing failed' });
    }
};

/**
 * Get all prescriptions for a specific patient
 */
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const result = await db.query(
            'SELECT * FROM packages WHERE status != $1 ORDER BY created_at DESC',
            ['delivered']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};
