/**
 * PharmaLink IoT Simulator (BLE Temperature & GPS)
 * This script simulates an IoT-enabled delivery bag sending data to the backend via MQTT or HTTP.
 */

const axios = require('axios');

const API_ENDPOINT = 'http://localhost:3000/api/deliveries';
const DELIVERY_ID = 'PL-8822'; // Simulating the critical package from our dashboard

// Configuration for refrigerated meds (2°C - 8°C)
const MIN_TEMP = 2.0;
const MAX_TEMP = 8.0;

let currentTemp = 3.5;
let latitude = -25.7479; // Pretoria/Joburg area
let longitude = 28.2293;

/**
 * Simulates temperature fluctuations and potential "Cold Chain Breach"
 */
function simulateIoTData() {
    // Small random movements
    latitude += (Math.random() - 0.5) * 0.001;
    longitude += (Math.random() - 0.5) * 0.001;

    // Temperature drift (90% chance of stability, 10% chance of spike)
    if (Math.random() > 0.9) {
        currentTemp += (Math.random() * 2.0); // Simulate a sun exposure spike
    } else {
        currentTemp += (Math.random() - 0.5) * 0.2; // Normal fluctuation
    }

    const payload = {
        delivery_id: DELIVERY_ID,
        status: currentTemp > MAX_TEMP ? 'CRITICAL' : 'IN_TRANSIT',
        temperature: parseFloat(currentTemp.toFixed(2)),
        location: {
            lat: latitude,
            lng: longitude
        },
        timestamp: new Date().toISOString()
    };

    console.log(`[IoT Sensor] Sending Data: ${payload.temperature}°C | Lat: ${payload.location.lat.toFixed(4)}`);

    // In a real scenario, this would post to a specific IoT Ingress point
    axios.patch(`${API_ENDPOINT}/${DELIVERY_ID}/status`, payload)
        .then(() => {
            if (currentTemp > MAX_TEMP) {
                console.error(`!!! COLD CHAIN BREACH DETECTED: ${currentTemp.toFixed(2)}°C !!!`);
            }
        })
        .catch(err => {
            console.error('[IoT Error] Connection to secure hub lost:', err.message);
        });
}

// Start simulating every 5 seconds
console.log('PharmaLink IoT Simulator Started...');
console.log(`Monitoring Delivery: ${DELIVERY_ID}`);
setInterval(simulateIoTData, 5000);
