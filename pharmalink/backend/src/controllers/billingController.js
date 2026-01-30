const db = require('../config/db');

/**
 * Simulate a Medical Aid Claim Submission via an EDI Switch (MediSwitch/Healthbridge)
 */
exports.submitClaim = async (req, res) => {
    try {
        const { orderId, medicalAidDetails } = req.body;

        // In a real SA scenario, we'd send an XML/JSON payload to a switch
        console.log(`[EDI] Submitting claim for Order ${orderId} to ${medicalAidDetails.name}...`);

        // Mocking a response where Medical Aid covers 90%
        const totalAmount = 1000.00; // ZAR
        const coveredAmount = 900.00;
        const coPayment = totalAmount - coveredAmount;

        const result = await db.query(
            `INSERT INTO claims (delivery_id, claim_amount, medical_aid_paid, patient_co_payment, status, auth_number)
             VALUES ((SELECT id FROM deliveries WHERE package_id = $1), $2, $3, $4, $5, $6) RETURNING *`,
            [orderId, totalAmount, coveredAmount, coPayment, 'approved', 'AUTH-' + Math.random().toString(36).substr(2, 9).toUpperCase()]
        );

        res.json({
            success: true,
            claim: result.rows[0],
            actions: coPayment > 0 ? 'CO_PAYMENT_REQUIRED' : 'FULLY_COVERED'
        });
    } catch (error) {
        console.error('Claim Submission Error:', error);
        res.status(500).json({ error: 'Failed to process medical aid claim' });
    }
};
