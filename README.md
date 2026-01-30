# PharmaLink: AI-Driven Clinical Logistics & Compliance Engine 🇿🇦

![PharmaLink Header](https://raw.githubusercontent.com/Raphasha27/Management-System/main/pharmalink_preview.png)

## 📌 Case Study: Revolutionizing Medication Delivery in South Africa

**PharmaLink** is a specialized, multi-persona HealthTech platform designed to solve the "Last-Mile" compliance gap in medication delivery. In the South African context, delivering Schedule 5+ medications requires more than just a courier; it requires a "Chain of Custody" that satisfies **SAPC (SA Pharmacy Council)** regulations and **POPIA** data privacy standards.

### 🔴 The Problem
*   **Compliance Gaps:** Standard couriers cannot provide the verified temperature logs or biometric "Proof of Delivery" (PoD) required for high-schedule drugs.
*   **Fragmented Workflow:** Doctors, Pharmacies, and Drivers operate in silos, leading to delivery delays for critical chronic medication.
*   **Payment Friction:** Lack of integrated Medical Aid billing and co-payment handling results in abandoned orders.

### 🟢 The PharmaLink Solution
A unified engine that connects the clinical script directly to the patient's doorstep with 4 synchronized personas:
1.  **Doctor Portal:** Digital script issuance with secure clinical hashing.
2.  **Pharmacy Command Center:** Multi-tenant order intake and automated driver dispatching.
3.  **Driver Mobile Terminal:** Real-time IoT cold-chain monitoring (2°C - 8°C) and biometric hand-off.
4.  **Patient Marketplace:** One-click ordering, real-time tracking, and integrated **ZAR Paystack** payments.

---

## 🚀 Key Technical Features

### 🔐 1. Biometric Chain of Custody
Integrates mobile FaceID/TouchID hashing to ensure that Schedule 6+ substances are only handed over to the verified recipient. No more lost or stolen scripts.

### ❄️ 2. IoT Cold-Chain Monitoring
A real-time telemetry engine tracks bag temperatures during transit. If the temperature exceeds 8°C, an automated `COLD_CHAIN_BREACH` alert is broadcast via WebSockets to the pharmacy dashboard.

### 💳 3. ZAR Financial Engine
*   **Medical Aid Billing:** Simulated EDI switching (Discovery, GEMS, etc.) for real-time claim adjudication.
*   **Paystack Integration:** Optimized for South African banking apps (Capitec, FNB, ABSA) via deep-linking and Instant EFT.

---

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3 (Glassmorphism), Vanilla JS.
*   **Backend:** Node.js, Express, Socket.io (Real-time broadcasting).
*   **Persistence:** PostgreSQL (Optimized for time-series logistics data).
*   **Security:** JWT (Role-Based Access Control), SHA-256 Hashing for Biometrics.

---

## 📈 Roadmap (6-Week MVP)
*   **Week 1:** Core Infra & RBAC (Completed)
*   **Week 2:** Clinical & Pharmacy Integration (Completed)
*   **Week 3:** Monetization & Bank Scan (Completed)
*   **Week 4:** Real-time GPS & IoT Simulation (Completed)
*   **Week 5:** Biometric Security Hardening (Completed)
*   **Week 6:** UAT & Production Launch (In Progress)

---

## 💻 Local Setup & Deployment

```bash
# Clone the repository
git clone https://github.com/Raphasha27/PharmaLink-Core.git

# Install Backend Dependencies
cd pharmalink/backend
npm install

# Start the Engine
npm start
```

Open `index.html` to view the **Master Control Dashboard** locally.

---

## 🎓 Author
**Raphasha** - *Lead HealthTech Architect*
Built with a focus on South African Regulatory Compliance (SAPC / POPIA).