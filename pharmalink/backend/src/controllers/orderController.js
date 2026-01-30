const db = require('../config/db');

/**
 * Pharmacy: Get all pending orders for the pharmacy
 */
exports.getPendingOrders = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacyId;
        const result = await db.query(
            'SELECT * FROM packages WHERE pharmacy_id = $1 AND status = $2',
            [pharmacyId, 'pending_verification']
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch pending orders' });
    }
};

/**
 * Pharmacy: Accept order and move to packaging/dispatch
 */
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const pharmacyId = req.user.pharmacyId;

        const result = await db.query(
            'UPDATE packages SET status = $1 WHERE id = $2 AND pharmacy_id = $3 RETURNING *',
            ['processing', orderId, pharmacyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found or unauthorized' });
        }

        // Notify patient via Socket.io (handled in index.js via app.get('socketio'))
        const io = req.app.get('socketio');
        io.emit(`delivery-${orderId}`, { status: 'processing', message: 'Your pharmacist is preparing your medication.' });

        res.json({ message: 'Order accepted', order: result.rows[0] });
    } catch (error) {
        console.error('Accept Order Error:', error);
        res.status(500).json({ error: 'Failed to accept order' });
    }
};

/**
 * Pharmacy: Assign driver to the order
 */
exports.assignDriver = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { driverId } = req.body;
        const pharmacyId = req.user.pharmacyId;

        // 1. Create delivery record
        const deliveryResult = await db.query(
            `INSERT INTO deliveries (package_id, driver_id, status, scheduled_time) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`,
            [orderId, driverId, 'assigned']
        );

        // 2. Update package status
        await db.query(
            'UPDATE packages SET status = $1 WHERE id = $2 AND pharmacy_id = $3',
            ['out_for_delivery', orderId, pharmacyId]
        );

        const io = req.app.get('socketio');
        io.emit(`delivery-${orderId}`, { status: 'out_for_delivery', driverId });

        res.json({ message: 'Driver assigned', deliveryId: deliveryResult.rows[0].id });
    } catch (error) {
        console.error('Assign Driver Error:', error);
        res.status(500).json({ error: 'Failed to assign driver' });
    }
};
