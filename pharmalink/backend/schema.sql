-- PharmaLink Database Schema (PostgreSQL)
-- Supports Multi-tenancy, Real-time Tracking, and Compliance Logging

-- Enable PostGIS for location-based services if needed
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Pharmacies (Tenants)
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Pharmacy Staff, Drivers, Patients)
CREATE TYPE user_role AS ENUM ('pharmacist', 'dispatcher', 'driver', 'patient', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL,
    pharmacy_id UUID REFERENCES pharmacies(id), -- NULL for patients or platform admins
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory/Packages
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
    prescription_reference VARCHAR(100),
    is_refrigerated BOOLEAN DEFAULT FALSE,
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, picked_up, in_transit, delivered, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Deliveries
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id),
    driver_id UUID REFERENCES users(id),
    patient_id UUID NOT NULL REFERENCES users(id),
    delivery_address TEXT NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    temperature_min DECIMAL(5,2),
    temperature_max DECIMAL(5,2),
    biometric_verification_ref TEXT, -- Reference to biometric proof hash
    delivery_fee DECIMAL(10,2), -- In ZAR
    currency VARCHAR(3) DEFAULT 'ZAR',
    status VARCHAR(50) DEFAULT 'assigned'
);

-- 5. Real-time Temperature Logs (IoT Data)
CREATE TABLE temperature_logs (
    id BIGSERIAL PRIMARY KEY,
    delivery_id UUID NOT NULL REFERENCES deliveries(id),
    temperature DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Driver Location Logs (Time Series)
CREATE TABLE driver_locations (
    id BIGSERIAL PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES users(id),
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_packages_pharmacy ON packages(pharmacy_id);
CREATE INDEX idx_temp_logs_delivery ON temperature_logs(delivery_id);
