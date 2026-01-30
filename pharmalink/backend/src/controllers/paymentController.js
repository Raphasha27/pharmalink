const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/db');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Initialize a ZAR payment for a medication order
 */
exports.initializePayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const userEmail = req.user.email;

        // Paystack requires amount in cents
        const amountInCents = Math.round(parseFloat(amount) * 100);

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: userEmail,
                amount: amountInCents,
                currency: 'ZAR',
                metadata: {
                    order_id: orderId,
                    user_id: req.user.userId,
                    type: 'medication_delivery'
                },
                // Optional: Enable specific channels like EFT for SA Banks
                channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Paystack Init Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initialize ZAR payment' });
    }
};

/**
 * Handle Paystack Webhook (Verify and fulfillment)
 */
exports.handleWebhook = async (req, res) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Invalid Signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
        const orderId = event.data.metadata.order_id;

        try {
            // 1. Update order status in DB
            await db.query(
                'UPDATE packages SET status = $1 WHERE id = $2',
                ['paid', orderId]
            );

            // 2. Log transaction
            await db.query(
                'INSERT INTO deliveries (package_id, status, delivery_fee) VALUES ($1, $2, $3)',
                [orderId, 'paid', event.data.amount / 100]
            );

            // 3. Notify UI via Socket
            const io = req.app.get('socketio');
            io.emit(`delivery-${orderId}`, {
                status: 'paid',
                message: 'Payment confirmed. Starting Cold-Chain dispatch.'
            });

            console.log(`[PAYMENT] ZAR ${event.data.amount / 100} received for Order ${orderId}`);
        } catch (dbErr) {
            console.error('Webhook DB Error:', dbErr);
        }
    }

    res.sendStatus(200);
};
