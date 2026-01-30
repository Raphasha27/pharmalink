# PharmaLink Security & Compliance Policy (POPIA)

## 1. Introduction
This policy outlines the technical and organizational measures taken by PharmaLink to protect Personal Information (PI) and Special Personal Information (SPI) in accordance with the **Protection of Personal Information Act (POPIA)** of South Africa.

## 2. Infrastructure Security
*   **Encryption at Rest:** All databases (PostgreSQL) and file storage (S3/Azure Blob) must use AES-256 encryption.
*   **Encryption in Transit:** All communication between clients (apps) and servers must be encrypted via TLS 1.3 or higher.
*   **Network Security:** Use Virtual Private Clouds (VPCs) and Firewalls to restrict access to internal services.

## 3. Data Minimization & Access Control
*   **Role-Based Access Control (RBAC):** Users (Pharmacists, Drivers, Patients) can only access the minimum data required for their role.
*   **Driver Data Privacy:** Drivers see only the recipient's name, address, and special instructions. They do not have access to full medical histories or prescription details.
*   **Identity Verification:** Delivery of Schedule 5+ medications requires biometric authentication, which is verified against a secure hash, never stored as raw biometric data.

## 4. Cold Chain & Quality Control
*   **IoT Integrity:** Temperature data is signed by the device to prevent tampering.
*   **Audit Trails:** Every status change in the delivery lifecycle is logged with a timestamp and user ID for forensic auditing.

## 5. Breach Response
*   In the event of a data breach, PharmaLink will notify the **Information Regulator (South Africa)** and affected data subjects as soon as reasonably possible, as required by Section 22 of POPIA.

## 6. Patient Consent
*   The Patient App must include a clear "informed consent" mechanism where patients agree to have their medication delivered and their tracking data processed for the purpose of delivery.

## 7. Data Sovereignty
*   Whenever possible, data will be stored in South African data centers (e.g., AWS Cape Town Region or Azure Johannesburg/Cape Town) to comply with data sovereignty preferences, although POPIA permits cross-border transfer under specific conditions.
