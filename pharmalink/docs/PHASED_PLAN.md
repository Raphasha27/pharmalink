# PharmaLink: 4-6 Week MVP Execution Roadmap

## Phase 1: Core Infrastructure & Authentication (Week 1)
*   **Backend:** Set up NestJS/Express framework with PostgreSQL (Prisma/TypeORM).
*   **Auth:** Implement JWT-based authentication for 4 personas (Doctor, Pharmacist, Driver, Patient).
*   **Database:** Migrate `schema.sql` to live instance.
*   **Multi-tenancy:** Logic to isolate pharmacy data.
*   **Deliverable:** Functional API with sign-up/login and role-based access control (RBAC).

## Phase 2: Pharmacy & Doctor Portals (Week 2)
*   **Doctor Portal:** Digital script creation and submission API.
*   **Pharmacy Portal:** Order management dashboard, inventory sync (mocked for MVP).
*   **Integration:** Logic for Doctor-to-Pharmacy script transmission.
*   **Deliverable:** Doctors can issue scripts; Pharmacies can view and accept them.

## Phase 3: Payment & Patient Marketplace (Week 3)
*   **Payments:** Full Paystack/Yoco integration for ZAR transactions.
*   **Bank Scan:** Implementing the "Scan to Pay" deep-link logic for SA Banks.
*   **Patient App:** Product catalog and prescription upload flow.
*   **Deliverable:** Patients can pay for scripts via their banking apps.

## Phase 4: Driver App & Real-time Logistics (Week 4)
*   **Driver Mobile:** React Native scaffold with GPS tracking.
*   **WebSockets:** Real-time location and status updates using Socket.io.
*   **IoT Simulation:** Bag temperature monitoring logic.
*   **Deliverable:** Drivers can "pick up" orders and provide real-time tracking to patients.

## Phase 5: Chain of Custody & Biometrics (Week 5)
*   **Biometrics:** Implementation of biometric verification (mobile FaceID/TouchID hash).
*   **POPIA Hardening:** Data encryption audit and access log finalization.
*   **Route Optimization:** Basic batching algorithm for fuel efficiency.
*   **Deliverable:** Secure hand-off of Schedule 5+ medications.

## Phase 6: Testing & Soft Launch (Week 6)
*   **UAT:** Beta testing with 1 partner pharmacy and 2 drivers.
*   **Bug Squashing:** Performance tuning for real-time sockets.
*   **Deployment:** CI/CD setup for staging environment (AWS/Vercel).
*   **Deliverable:** Production-ready MVP for initial seed round or pilot.
