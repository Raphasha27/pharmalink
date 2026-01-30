const db = require('../config/db');
const crypto = require('crypto');

/**
 * Driver: Update current location and delivery status
 * PATCH /api/deliveries/:id/status
 */
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, temperature, location } = req.body;
        const driverId = req.user.userId;

        // 1. Log the movement/status in the database
        await db.query(
            'UPDATE deliveries SET status = $1, temperature_max = GREATEST(temperature_max, $2) WHERE id = $3 AND driver_id = $4',
            [status, temperature, id, driverId]
        );

        // 2. Log location to time-series table
        if (location && location.lat && location.lng) {
            await db.query(
                'INSERT INTO driver_locations (driver_id, latitude, longitude) VALUES ($1, $2, $3)',
                [driverId, location.lat, location.lng]
            );
        }

        // 3. Real-time Broadcast via Socket.io
        const io = req.app.get('socketio');
        const updatePayload = {
            deliveryId: id,
            status,
            temperature,
            location,
            timestamp: new Date()
        };

        // Broadcast to specific patient and pharmacy console
        io.emit(`delivery-${id}`, updatePayload);
        io.emit('global-logistics-update', updatePayload);

        res.json({ success: true, message: 'Logistics data synchronized' });
    } catch (error) {
        console.error('Update Delivery Error:', error);
        res.status(500).json({ error: 'Failed to update courier status' });
    }
};

/**
 * Get active deliveries for the current driver
 */
exports.getMyTasks = async (req, res) => {
    try {
        const driverId = req.user.userId;
        const result = await db.query(
            'SELECT * FROM deliveries WHERE driver_id = $1 AND status != $2',
            [driverId, 'delivered']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch driver tasks' });
    }
};

/**
 * Finalize delivery with Biometric Verification
 * POST /api/deliveries/:id/verify-biometric
 */
exports.verifyBiometric = async (req, res) => {
    try {
        const { id } = req.params;
        const { biometricHash } = req.body; // Mocked hash from mobile FaceID/TouchID
        const driverId = req.user.userId;

        // 1. Verify that this driver is actually assigned to this delivery
        const check = await db.query('SELECT package_id FROM deliveries WHERE id = $1 AND driver_id = $2', [id, driverId]);
        if (check.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to verify this delivery' });
        }

        const packageId = check.rows[0].package_id;

        // 2. Mock Biometric Logic: In production, we compare this hash against 
        // a secure decentralized identity provider or the patient's ID vault.
        const isMatch = biometricHash && biometricHash.length > 20;

        if (!isMatch) {
            return res.status(400).json({ error: 'Biometric verification failed. Recipient identity mismatch.' });
        }

        // 3. Update Database to 'DELIVERED'
        await db.query('UPDATE deliveries SET status = $1, actual_delivery_time = CURRENT_TIMESTAMP WHERE id = $2', ['delivered', id]);
        await db.query('UPDATE packages SET status = $1 WHERE id = $2', ['delivered', packageId]);

        // 4. Broadcast the final success state
        const io = req.app.get('socketio');
        io.emit(`delivery-${id}`, { status: 'delivered', verified: true, deliveredAt: new Date() });

        res.json({
            success: true,
            message: 'Biometric Identitiy Verified. Package Unlocked and Delivered.',
            auditHash: crypto.createHash('sha256').update(id + biometricHash).digest('hex')
        });
    } catch (error) {
        console.error('Biometric Error:', error);
        res.status(500).json({ error: 'Verification system error' });
    }
};
