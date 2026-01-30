# PharmaLink: SAPC Compliance & Medical Aid Billing Strategy

As a high-level developer, integrating with the South African healthcare financial ecosystem requires understanding **EDI (Electronic Data Interchange)** and **SAPC (South African Pharmacy Council)** physical delivery standards.

## 1. Medical Aid Billing Engine (Discovery, GEMS, Bonitas, etc.)

In South Africa, most pharmacy claims are processed in real-time via switches like **MediSwitch** or **Healthbridge**.

### Technical Integration Flow:
1.  **Patient Detail Collection:** Capture Main Member ID, Medical Aid Name, and Dependant Code.
2.  **Real-Time Claim Submission:**
    *   PharmaLink sends the script data to the Pharmacy Management System (PMS).
    *   The PMS submits to the Medical Aid via a secure SOAP/REST gateway.
3.  **The "Co-Payment" Bridge:**
    *   If the Medical Aid covers R450 of a R500 medication, PharmaLink automatically calculates the **R50 Co-payment**.
    *   This R50 is then requested via the **Paystack ZAR Gateway** we've built.

### Database Update ([`schema.sql`]):
```sql
ALTER TABLE users ADD COLUMN medical_aid_name VARCHAR(100);
ALTER TABLE users ADD COLUMN medical_aid_number VARCHAR(50);
ALTER TABLE users ADD COLUMN medical_aid_dependant_code VARCHAR(10);

CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES deliveries(id),
    claim_amount DECIMAL(10,2),
    medical_aid_paid DECIMAL(10,2),
    patient_co_payment DECIMAL(10,2),
    status VARCHAR(50), -- pending, paid, rejected
    auth_number VARCHAR(100)
);
```

## 2. SAPC Delivery Compliance (GPP Standards)

The SAPC's **Good Pharmacy Practice (GPP)** guidelines specify how medication must be handled during delivery.

### Technical Enforcement in PharmaLink:
*   **Cold Chain Validation:** SAPC requires heat-sensitive logic. Our **IoT Cold Chain** monitor (Week 4) provides the "Temperature Log" needed for SAPC audits.
*   **Pharmacist Counseling:** The SAPC requires that a pharmacist must be available for counseling.
    *   *Implementation:* We've added a **Pharmacist Chat/Call** button in the Patient tracking view.
*   **Chain of Record:** Every delivery must be signed for by the patient or an authorized person.
    *   *Implementation:* Our **Biometric PoD** (Phase 5) is the highest form of digital signature allowed under the Electronic Communications and Transactions Act.

### Schedule 6 & 7 Handling:
*   PharmaLink enforces a "Verified Driver Only" badge for S6/S7 medications, ensuring the courier has undergone specific background checks as per SAPC preference.

---

## 3. Implementation Roadmap Step (Week 2 Add-on)
1.  **Add Medical Aid Schema:** Execute the SQL snippet above.
2.  **Mock Claim Service:** I will create a `billingController.js` to simulate the MediSwitch response.
3.  **Co-payment UI:** Update the Patient View to show "Medical Aid Covered: RXXX" and "Payable: RXXX".
