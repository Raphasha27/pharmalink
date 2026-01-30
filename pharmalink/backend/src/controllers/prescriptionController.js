const db = require('../config/db');

/**
 * Doctor Portal: Create a new digital script/package
 */
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, medicationDetails, isRefrigerated, isControlledSubstance, pharmacyId } = req.body;
        const doctorId = req.user.userId;

        // 1. Create the package record (as a prescription entry)
        const result = await db.query(
            `INSERT INTO packages (pharmacy_id, prescription_reference, is_refrigerated, is_controlled_substance, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [pharmacyId, medicationDetails, isRefrigerated, isControlledSubstance, 'pending_verification']
        );

        const packageId = result.rows[0].id;

        // 2. Logic: In production, we'd also link the doctor to this order
        // and notify the patient to complete payment.

        res.status(201).json({
            message: 'Digital script issued successfully',
            packageId,
            status: 'pending_verification'
        });
    } catch (error) {
        console.error('Prescription Error:', error);
        res.status(500).json({ error: 'Failed to issue digital script' });
    }
};

/**
 * Get all prescriptions for a specific patient (for the Patient View)
 */
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const result = await db.query(
            'SELECT * FROM packages WHERE pharmacy_id IN (SELECT id FROM pharmacies) AND status = $1',
            ['pending_verification']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};
