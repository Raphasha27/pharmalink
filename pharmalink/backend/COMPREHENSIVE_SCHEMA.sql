-- PharmaLink Comprehensive Database Architecture (PostgreSQL)
-- Focused on South African Medical Compliance (POPIA + SAPC)

-- 1. SETUP & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'pharmacist', 'driver', 'platform_admin');
CREATE TYPE prescription_status AS ENUM ('pending_validation', 'validated', 'dispensed', 'expired', 'rejected');
CREATE TYPE order_status AS ENUM ('pending_payment', 'preparing', 'ready_for_pickup', 'in_transit', 'delivered', 'failed');
CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'verified', 'rejected');

-- 3. ENTITIES

-- Pharmacies Table
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sapc_license_number VARCHAR(100) UNIQUE NOT NULL, -- South African Pharmacy Council License
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50) NOT NULL, -- GP, WC, KZN, etc.
    postal_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    kyc_status kyc_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Unified Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    id_number VARCHAR(13) UNIQUE, -- SA ID Number for verification
    phone_number VARCHAR(20),
    pharmacy_id UUID REFERENCES pharmacies(id), -- Only for pharmacists
    hpcsa_number VARCHAR(50), -- Only for doctors
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Doctors Table (Profile details)
CREATE TABLE doctors (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    practice_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(255),
    digital_signature_hash TEXT -- Hash of the doctor's verified digital signature
);

-- Prescriptions Table (The Core Clinical Asset)
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID REFERENCES users(id), -- Can be NULL if patient uploads a physical script
    pharmacy_id UUID REFERENCES pharmacies(id),
    image_url TEXT, -- URL to S3/Storage for physical script photo
    ocr_raw_text TEXT, -- Raw text from AI OCR extraction
    medication_details JSONB NOT NULL, -- Array of objects: {medname, dosage, quantity, schedule}
    is_controlled_substance BOOLEAN DEFAULT FALSE, -- Schedule 5+
    is_repeat BOOLEAN DEFAULT FALSE,
    repeats_remaining INTEGER DEFAULT 0,
    status prescription_status DEFAULT 'pending_validation',
    issuing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    digital_signature TEXT, -- Proof of doctor issuing for e-scripts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table (Logistics/Financial Asset)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id),
    patient_id UUID NOT NULL REFERENCES users(id),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
    order_total DECIMAL(12,2) NOT NULL,
    medical_aid_amount DECIMAL(12,2) DEFAULT 0.00,
    patient_copayment DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, partially_paid
    paystack_reference VARCHAR(255),
    logistics_status order_status DEFAULT 'pending_payment',
    delivery_address_id UUID, -- To be linked to an addresses table
    is_cold_chain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries Table (The Physical Journey)
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    driver_id UUID REFERENCES users(id),
    pickup_time TIMESTAMP WITH TIME ZONE,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    biometric_verification_id TEXT, -- Reference to biometric verification session
    pod_signature_url TEXT, -- Proof of delivery signature image
    pod_photo_url TEXT, -- Photo taken at delivery
    temperature_breach BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Temperature Monitoring (IoT Time-Series)
CREATE TABLE temperature_metrics (
    id BIGSERIAL PRIMARY KEY,
    delivery_id UUID NOT NULL REFERENCES deliveries(id),
    temp_celsius DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (POPIA Requirement)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. UTILITY VIEWS
CREATE VIEW active_deliveries AS
SELECT d.*, o.is_cold_chain, p.name as pharmacy_name, u.first_name || ' ' || u.last_name as patient_name
FROM deliveries d
JOIN orders o ON d.order_id = o.id
JOIN pharmacies p ON o.pharmacy_id = p.id
JOIN users u ON o.patient_id = u.id
WHERE d.actual_delivery_time IS NULL;

-- 5. INDEXES
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_orders_status ON orders(logistics_status);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
