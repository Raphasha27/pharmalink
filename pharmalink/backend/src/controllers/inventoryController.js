const db = require('../config/db');

/**
 * Get inventory for the pharmacy
 */
exports.getInventory = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacyId;
        const result = await db.query(
            'SELECT * FROM inventory WHERE pharmacy_id = $1',
            [pharmacyId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

/**
 * Update stock level (e.g., after a delivery or new shipment)
 */
exports.updateStock = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const pharmacyId = req.user.pharmacyId;

        const result = await db.query(
            'UPDATE inventory SET quantity = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2 AND pharmacy_id = $3 RETURNING *',
            [quantity, itemId, pharmacyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Stock updated', item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
};
