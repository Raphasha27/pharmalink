# 🏥 PharmaLink: Clinical Logistics & Compliance Engine

<div align="center">

### **Revolutionizing Medication Delivery in South Africa 🇿🇦**

[![Status](https://img.shields.io/badge/Status-Live%20MVP-success)](https://raphasha27.github.io/pharmalink/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![South Africa](https://img.shields.io/badge/Built%20for-South%20Africa-green)](https://github.com/Raphasha27/pharmalink)

</div>

---

## 📌 Overview

**PharmaLink** is a specialized HealthTech platform that bridges the "Last-Mile" compliance gap in medication delivery. Built for the South African healthcare ecosystem, it ensures that Schedule 5+ medications are delivered with full **SAPC** regulatory compliance and **POPIA** data protection.

### 🔴 The Problem
- **Compliance Gaps:** Standard couriers can't provide verified temperature logs or biometric Proof of Delivery for controlled substances
- **Fragmented Workflow:** Doctors, Pharmacies, and Drivers operate in silos
- **Payment Friction:** No integrated Medical Aid billing or co-payment handling

### 🟢 The Solution
A unified engine connecting clinical scripts directly to patients' doorsteps:

| **Persona** | **Function** |
|-------------|--------------|
| 👨‍⚕️ **Doctor Portal** | Digital script issuance with secure hashing |
| 🏥 **Pharmacy Command Center** | Multi-tenant order fulfillment & driver dispatch |
| 🚗 **Driver Mobile Terminal** | IoT cold-chain monitoring + biometric handoff |
| 🏠 **Patient Marketplace** | One-click ordering with ZAR payments |

---

## 🚀 Key Features

### 🔐 Biometric Chain of Custody
Mobile FaceID/TouchID integration ensures Schedule 6+ substances reach verified recipients only.

### ❄️ IoT Cold-Chain Monitoring
Real-time telemetry tracks bag temperatures (2°C - 8°C). Breaches trigger instant WebSocket alerts to pharmacies.

### 💳 ZAR Financial Engine
- **Medical Aid Billing:** EDI switching for Discovery, GEMS, Bonitas, Momentum
- **Paystack Integration:** Deep-linking to SA banking apps (Capitec, FNB, ABSA, Nedbank)

### 📦 Inventory Management
Live stock tracking with expiry alerts and low-stock notifications for chronic medications.

---

## 🛠️ Tech Stack

```
Frontend:    HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
Backend:     Node.js, Express, Socket.io
Database:    PostgreSQL (Time-series optimized)
Security:    JWT, RBAC, SHA-256 Hashing
Compliance:  POPIA, SAPC GPP Standards
```

---

## 💻 Quick Start

### **Option 1: One-Click Launch (Windows)**
```powershell
cd pharmalink
./START_PHARMALINK.ps1
```

**What this does:**
- ✅ Starts backend API on `http://localhost:3000`
- ✅ Opens dashboard in your default browser
- ✅ Keeps both services running simultaneously

### **Option 2: Manual Setup**
```bash
# 1. Install dependencies
cd pharmalink/backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Start backend
npm start

# 4. Open frontend
start ../index.html
```

---

## 📈 Development Roadmap

| **Phase** | **Milestone** | **Status** |
|-----------|---------------|------------|
| Week 1 | Core Infrastructure & RBAC | ✅ Complete |
| Week 2 | Clinical & Pharmacy Integration | ✅ Complete |
| Week 3 | ZAR Monetization & Banking | ✅ Complete |
| Week 4 | Real-time GPS & IoT Simulation | ✅ Complete |
| Week 5 | Biometric Security Hardening | ✅ Complete |
| Week 6 | UAT & Production Launch | 🟡 In Progress |

---

## 📚 Documentation

| **Document** | **Description** |
|--------------|-----------------|
| [Security Policy](pharmalink/docs/SECURITY_POLICY.md) | POPIA compliance framework |
| [Business Strategy](pharmalink/docs/STRATEGY.md) | Market positioning & revenue model |
| [Medical Aid Billing](pharmalink/docs/MEDICAL_AID_BILLING.md) | EDI integration guide (MediSwitch) |
| [Database Setup](pharmalink/docs/LIVE_DATABASE_SETUP.md) | PostgreSQL cloud deployment |

---

## 🎯 Use Cases

1. **Chronic Medication Delivery**
   - Patient orders monthly diabetes medication via app
   - Medical Aid covers 90%, patient pays R85 co-payment
   - Driver tracks cold-chain compliance for insulin delivery

2. **Controlled Substance Handling**
   - Doctor issues digital script for Schedule 6 opioid
   - Pharmacy verifies prescription authenticity
   - Biometric verification required at delivery (no signature = no handoff)

3. **Emergency Script Fulfillment**
   - Patient uploads photo of paper script
   - Pharmacy validates and dispatches within 2 hours
   - Real-time tracking with 12-minute ETA updates

---

## 🎓 Author

**Raphasha** - *Lead HealthTech Architect*  
Building compliant, patient-first solutions for South African healthcare.

📧 Contact: [GitHub Profile](https://github.com/Raphasha27)

---

## 📜 License

Proprietary © 2026 PharmaLink. All rights reserved.

---

<div align="center">

**🇿🇦 Proudly South African 🇿🇦**

*Transforming medication delivery, one script at a time.*

---

**[View Live Demo](https://raphasha27.github.io/pharmalink/)** • **[Report Issues](https://github.com/Raphasha27/pharmalink/issues)**

</div>