# PharmaLink: Strategic Blueprint (South Africa)

## 1. Executive Summary
PharmaLink is a high-level logistics and compliance engine designed to solve the "Last-Mile Pharmacy" problem in South Africa. It empowers independent pharmacies to compete with major chains by providing a secure, temperature-controlled, and POPIA-compliant medication delivery infrastructure.

## 2. Market Problem & Opportunity
*   **The Problem:** Elderly and chronic patients in SA (e.g., those on chronic medication for HIV, Diabetes, Hypertension) struggle with transport to pharmacies. Independent pharmacies lose 20-30% of revenue to mail-order giants.
*   **The Opportunity:** Provide a "Chain of Custody" delivery service that handles sensitive and cold-chain medications.

## 3. Revenue Model (ZAR)
*   **SaaS Subscription (Pharmacies):**
    *   **Tier 1 (Basic):** R3,500/month (Up to 100 deliveries).
    *   **Tier 2 (Pro):** R7,500/month (Unlimited deliveries + Inventory Sync).
*   **Delivery Fees (Patients):**
    *   **Standard Delivery:** R85 (Within 10km).
    *   **Cold-Chain Delivery:** R125 (Includes specialized IoT monitoring).
    *   **Urgent/Same-Day:** R180.
*   **Platform Commission:** R15 per delivery transaction.

## 4. Software Architecture
*   **Multi-tenant Backend:** Built with Node.js/NestJS + PostgreSQL.
*   **Pharmacy Dashboard:** Inventory management and order dispatch.
*   **Driver App:** Real-time routing and biometric verification.
*   **Patient App:** Tracking, ID vault, and pharmacist chat.

## 5. Technical Moat
*   **IoT Cold Chain:** Real-time Bluetooth temperature sensors in delivery bags.
*   **Biometric Verification:** Uses mobile FaceID/Fingerprint + SA ID scanning (via OCR) to ensure the right person receives Schedule 5+ substances.
*   **Route Optimization:** Dynamic batching of deliveries to reduce fuel costs (crucial for SA fuel price volatility).

## 6. Compliance (POPIA & Health Act)
*   **POPIA Compliance:** Data encryption at rest and in transit. No PII (Personally Identifiable Information) shared with drivers except necessary delivery details.
*   **SAPC Regulations:** Ensuring delivery protocols follow South African Pharmacy Council guidelines for medication handling.
