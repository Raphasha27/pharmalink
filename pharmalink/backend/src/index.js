const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const prescriptionRoutes = require('./routes/prescription');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const deliveryRoutes = require('./routes/delivery');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// --- Initialized Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/inventory', inventoryRoutes);

// --- Real-time Logic ---
io.on('connection', (socket) => {
    console.log('Secure link established:', socket.id);

    socket.on('join-delivery', (deliveryId) => {
        socket.join(`delivery-${deliveryId}`);
    });

    socket.on('disconnect', () => {
        console.log('Secure link closed');
    });
});

// Broadcast helper for controllers
app.set('socketio', io);

// --- Server Start ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('====================================');
    console.log(` PHARMALINK BACKEND ENGINE ACTIVE `);
    console.log(` PORT: ${PORT} | ENV: Week 1 MVP `);
    console.log('====================================');
});
