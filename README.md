# 🏥 PharmaLink: Clinical Logistics & Compliance Engine

<div align="center">

![PharmaLink Banner](https://img.shields.io/badge/PharmaLink-2026-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20MVP-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**Revolutionizing Medication Delivery in South Africa 🇿🇦**

[Live Demo](#) • [Documentation](docs/) • [Case Study](#case-study)

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

1. 👨‍⚕️ **Doctor Portal** - Digital script issuance with secure hashing
2. 🏥 **Pharmacy Command Center** - Multi-tenant order fulfillment
3. 🚗 **Driver Mobile Terminal** - IoT cold-chain monitoring + biometric handoff
4. 🏠 **Patient Marketplace** - One-click ordering with ZAR payments

---

## 🚀 Key Features

### 🔐 Biometric Chain of Custody
Mobile FaceID/TouchID integration ensures Schedule 6+ substances reach verified recipients only.

### ❄️ IoT Cold-Chain Monitoring
Real-time telemetry tracks bag temperatures (2°C - 8°C). Breaches trigger instant WebSocket alerts.

### 💳 ZAR Financial Engine
- **Medical Aid Billing:** EDI switching for Discovery, GEMS, Bonitas
- **Paystack Integration:** Deep-linking to SA banking apps (Capitec, FNB, ABSA)

### 📦 Inventory Management
Live stock tracking with expiry alerts and low-stock notifications.

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3 (Glassmorphism)
- Vanilla JavaScript

**Backend**
- Node.js + Express
- Socket.io (Real-time updates)
- PostgreSQL
- JWT Authentication

**Security**
- Role-Based Access Control (RBAC)
- SHA-256 Biometric Hashing
- POPIA Compliance Framework

---

## 💻 Quick Start

### One-Click Launch (Windows)
```powershell
cd pharmalink
./START_PHARMALINK.ps1
```

This will:
1. ✅ Start backend API on `http://localhost:3000`
2. ✅ Open dashboard in your browser
3. ✅ Keep both services running

### Manual Setup
```bash
# Install dependencies
cd pharmalink/backend
npm install

# Start backend
npm start

# Open frontend
start ../index.html
```

---

## 📈 Development Roadmap

- ✅ **Week 1:** Core Infrastructure & RBAC
- ✅ **Week 2:** Clinical & Pharmacy Integration
- ✅ **Week 3:** ZAR Monetization & Bank Integration
- ✅ **Week 4:** Real-time GPS & IoT Simulation
- ✅ **Week 5:** Biometric Security Hardening
- ✅ **Week 6:** UAT & Production Launch

---

## 📄 Documentation

- [Security Policy](pharmalink/docs/SECURITY_POLICY.md) - POPIA compliance framework
- [Strategy](pharmalink/docs/STRATEGY.md) - Business model & market positioning
- [Medical Aid Billing](pharmalink/docs/MEDICAL_AID_BILLING.md) - EDI integration guide
- [Database Setup](pharmalink/docs/LIVE_DATABASE_SETUP.md) - PostgreSQL deployment

---

## 🎓 Author

**Raphasha** - *Lead HealthTech Architect*

Built with focus on South African regulatory compliance (SAPC / POPIA).

---

## 📜 License

Proprietary - All rights reserved © 2026 PharmaLink

---

<div align="center">

**🇿🇦 Proudly South African 🇿🇦**

*Transforming medication delivery, one script at a time.*

</div>