/**
 * PharmaLink UAT Test Suite
 * Simulates a full "Order to Delivery" journey across all 4 personas.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokens = {};
let orderId = null;
let deliveryId = null;

async function runUAT() {
    console.log('🚀 Starting PharmaLink UAT: Clinical Flow Test\n');

    try {
        // 1. DOCTOR: Issue Digital script
        console.log('[Step 1] Doctor Issuing Digital Script...');
        // Mocking token for simulation; in real test, we would call /auth/login
        const scriptRes = await axios.post(`${BASE_URL}/prescriptions`, {
            patientId: 'PAT-001',
            medicationDetails: 'Insulin Glargine - 100 units/mL',
            isRefrigerated: true,
            isControlledSubstance: false,
            pharmacyId: 'PHARM-SANDTON'
        }, { headers: { Authorization: 'Bearer MOCK_DOCTOR_TOKEN' } });

        orderId = scriptRes.data.packageId;
        console.log(`✅ Script Issued. Order ID: ${orderId}\n`);

        // 2. PATIENT: Initialize Payment
        console.log('[Step 2] Patient Initializing Paystack ZAR Payment...');
        const payRes = await axios.post(`${BASE_URL}/payments/initialize`, {
            orderId: orderId,
            amount: 85.00
        }, { headers: { Authorization: 'Bearer MOCK_PATIENT_TOKEN' } });

        console.log('✅ Payment Initialized. (Simulating Bank Scan Success)\n');

        // 3. PHARMACY: Accept & Dispatch
        console.log('[Step 3] Pharmacy Accepting Order & Assigning Driver...');
        await axios.patch(`${BASE_URL}/orders/${orderId}/accept`, {}, {
            headers: { Authorization: 'Bearer MOCK_PHARMACIST_TOKEN' }
        });

        const dispatchRes = await axios.post(`${BASE_URL}/orders/${orderId}/assign-driver`, {
            driverId: 'DRV-772'
        }, { headers: { Authorization: 'Bearer MOCK_PHARMACIST_TOKEN' } });

        deliveryId = dispatchRes.data.deliveryId;
        console.log(`✅ Order Dispatched. Delivery ID: ${deliveryId}\n`);

        // 4. DRIVER: Real-time GPS & Cold Chain Update
        console.log('[Step 4] Driver Syncing GPS & Temperature...');
        await axios.patch(`${BASE_URL}/deliveries/${deliveryId}/status`, {
            status: 'in_transit',
            temperature: 4.2,
            location: { lat: -26.1076, lng: 28.0567 }
        }, { headers: { Authorization: 'Bearer MOCK_DRIVER_TOKEN' } });
        console.log('✅ Driver Location Synced to Master Dashboard.\n');

        // 5. FINAL: Biometric Unlock
        console.log('[Step 5] Recipient Biometric Verification (FaceID Link)...');
        const finalRes = await axios.post(`${BASE_URL}/deliveries/${deliveryId}/verify-biometric`, {
            biometricHash: 'sha256_mock_recipient_biometric_data_verified_zar'
        }, { headers: { Authorization: 'Bearer MOCK_DRIVER_TOKEN' } });

        console.log(`🏆 UAT SUCCESS: ${finalRes.data.message}`);
        console.log(`🛡️ Audit Hash: ${finalRes.data.auditHash}\n`);

    } catch (error) {
        console.error('❌ UAT FAILED at step:', error.config?.url || 'Internal');
        console.error('Reason:', error.response?.data?.error || error.message);
    }
}

// In a real environment, run with node scripts/uat_test.js
console.log('--- PHARMALINK QUALITY ASSURANCE TERMINAL ---');
runUAT();
