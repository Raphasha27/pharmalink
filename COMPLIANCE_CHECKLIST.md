# 🏥 PharmaLink | Compliance & Security Checklist (South Africa)

This document outlines the mandatory regulatory and security requirements for running a lawful Pharmacy Delivery platform in South Africa.

## 1. POPIA (Protection of Personal Information Act) Compliance
*   **Data Minimization**: Only collect ID numbers and medical history strictly necessary for dispensing.
*   **Informed Consent**: Explicit opt-in for patients before sharing data with Couriers or 3rd party labs.
*   **Security Safeguards**:
    *   [ ] Encryption at rest (AES-256) for all patient records.
    *   [ ] Encryption in transit (TLS 1.3) for all API communication.
    *   [ ] **Audit Logging**: Mandatory tracking of "Who accessed which patient's script and when" (See `audit_logs` table in schema).
*   **Data Sovereignty**: Ensure medical data is stored on servers physically located in South Africa (or jurisdictions with equivalent laws).

## 2. SAPC (South African Pharmacy Council) Rules
*   **Chain of Custody**: A licensed pharmacist must "release" every package. The system must record the Pharmacist's ID for every validated script.
*   **Cold Chain Management**:
    *   [ ] Temperature-sensitive items (e.g., Insulin) must remain between 2°C and 8°C.
    *   [ ] IoT logging must be immutable. If a breach occurs, the patient and pharmacy must be alerted immediately.
*   **Controlled Substances (Schedule 5, 6+)**:
    *   [ ] Mandatory **Biometric Verification** upon delivery (not just a signature).
    *   [ ] Physical ID check by the driver.

## 3. Financial & Payment Security
*   **PCI-DSS Compliance**: Do not store raw card numbers. Use Paystack or Ozow for tokenized payments.
*   **Medical Aid Integration**:
    *   [ ] Switch integration for real-time claim adjudication (e.g., MediSwitch or HealthBridge).
    *   [ ] Clear separation of "Medical Aid Benefit" and "Patient Co-payment" in the UI.

## 4. Technical Security Checklist
*   [ ] **JWT with Short Expiry**: Access tokens should expire in 15-60 minutes; use Refresh Tokens for sessions.
*   [ ] **MFA (Multi-Factor Authentication)**: Mandatory for Pharmacy Admins and Doctors.
*   [ ] **Database Row Level Security (RLS)**: Ensure a pharmacy can only see its own orders and patients.
*   [ ] **Rate Limiting**: Protect against brute-force attacks on the Login/Register endpoints.
*   [ ] **OCR Verification**: Any data extracted via AI OCR must be manually confirmed by a human pharmacist before dispensing.

## 5. Driver Onboarding (KYC)
*   [ ] Valid SA Driver's License check.
*   [ ] Criminal record background check (e.g., via HURU or similar).
*   [ ] Vehicle roadworthy verification.

---
*Created for the PharmaLink MVP Development Roadmap.*
