# 🇿🇦 PharmaLink | National Health Dispatch Infrastructure

<div align="center">

### **Ending Healthcare Queues Through Direct Medication Delivery**

[![Status](https://img.shields.io/badge/Status-Live%20Government%20Utility-success)](https://pharmalink-six.vercel.app)
[![Compliance](https://img.shields.io/badge/Compliance-POPIA%20%2B%20SAPC-blue)](COMPLIANCE_CHECKLIST.md)
[![Service](https://img.shields.io/badge/Service-Elderly%20%26%20Chronic%20Care-orange)](https://pharmalink-six.vercel.app)

**[🌐 Launch Secure Citizen Portal](https://pharmalink-six.vercel.app)**

</div>

---

## 📌 Our Mandate
PharmaLink is a government-initiative logistics engine designed to decouple medication dispensing from clinical checkups. By migrating chronic medication collection to a home-delivery model, we reduce national healthcare queues and prioritize the vulnerable.

### 🎯 Strategic Objectives
- **Queue Reduction:** Moving 2+ million monthly visits from physical clinics to the digital dispatch network.
- **Elderly Prioritization:** Door-to-door delivery for senior citizens (Pensioners) to ensure 0% default on chronic treatment.
- **Sector Synergy:** Providing logistics support for both Public Healthcare facilities and Private Hospital transport networks.
- **Direct Payment Integration:** Citizens can pay for specialized or non-subsidized medication directly via integrated banking apps.

---

## 🚀 Key Features

### 👴 Chronic Care Engine
Automated repeat prescription management for hypertension, diabetes, and other long-term conditions.

### ❄️ National Cold-Chain Fleet
IoT-monitored transport ensuring that sensitive medications (like Insulin) remain within clinical temperature bounds during transit.

### 🔐 Secure Citizen Profile
Every citizen has a unique medical profile accessible via biometric-secured login, tracking prescriptions from issuance to doorstep.

### 💳 Integrated Payments
Support for specialized medication purchases via Paystack, integrated with major SA banks (Capitec, FNB, Standard Bank, etc.).

---

## 🛠️ Development Assets (NHI Ready)
*   **[National DB Schema](./pharmalink/backend/COMPREHENSIVE_SCHEMA.sql)**: Optimized for 13-digit SA ID verification and Audit Logging.
*   **[System Architecture](./ARCHITECTURE.md)**: Logic for OCR prescription parsing and secure logistics.
*   **[Compliance Guide](./COMPLIANCE_CHECKLIST.md)**: SAPC and POPIA regulatory adherence.

---

## 🏎️ Local Infrastructure Setup

### **Option 1: Modern React Experience (Vite)**
The system now features a premium React + Framer Motion frontend for a cinematic healthcare experience.
```powershell
cd pharmalink/web
npm install
npm run dev
```
*Accessible at `http://localhost:5173`*

### **Option 2: Legacy / One-Click Launch**
```powershell
cd pharmalink
./START_PHARMALINK.ps1
```
*Accessible at `http://localhost:3000` or `index.html`*

---
*Developed for the National Health Insurance (NHI) digital transformation roadmap. 🇿🇦*