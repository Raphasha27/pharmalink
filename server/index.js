const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mock Database
let prescriptions = [
  { id: 1, name: "Insulin", status: "Active", subtext: "Inshe (Active)", type: "Refill RX", color: "bg-pharma-green", refillsLeft: 12 },
  { id: 2, name: "Lisinopril", status: "Due Soon", subtext: "Ron-Station", type: "Set Reminder", color: "bg-amber-400", refillsLeft: 3 },
  { id: 3, name: "Metformin", status: "Active", subtext: "Glucophage", type: "Refill RX", color: "bg-pharma-green", refillsLeft: 5 }
];

let orders = [
  { id: 101, name: "Antibiotics", date: "Jan 29", status: "Shipped", statusColor: "text-emerald-500 bg-emerald-100" },
  { id: 102, name: "Vitamin C", date: "Jan 15", status: "Delivered", statusColor: "text-blue-500 bg-blue-100" }
];

let messages = [
  { id: 1, from: 'Dr. Smith', msg: 'Your Insulin protocol has been updated.', time: '10:42 AM' },
  { id: 2, from: 'PharmaLink Hub', msg: 'Refill BATCH-882 is ready for dispatch.', time: 'Yesterday' },
  { id: 3, from: 'Clinic Admin', msg: 'Please confirm your NHI registration details.', time: 'Monday' }
];

let pharmacies = [
  { id: 1, name: 'Rosebank Medical Hub' },
  { id: 2, name: 'Sandton Clinic Pharmacy' },
  { id: 3, name: 'Cape Town Express Dispensary' },
  { id: 4, name: 'Durban North Health' },
  { id: 5, name: 'Pretoria State Dispensary' }
];

// Endpoints
app.get('/api/prescriptions', (req, res) => res.json(prescriptions));

app.get('/api/orders', (req, res) => res.json(orders));

app.get('/api/messages', (req, res) => res.json(messages));

app.get('/api/pharmacies', (req, res) => res.json(pharmacies));

app.post('/api/refill/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const prescription = prescriptions.find(p => p.id === id);
  if (prescription && prescription.refillsLeft > 0) {
    prescription.refillsLeft -= 1;
    res.json({ success: true, message: `Refill requested for ${prescription.name}`, remaining: prescription.refillsLeft });
  } else {
    res.status(400).json({ success: false, message: "No refills left or invalid prescription" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mock PharmaLink Backend running at http://localhost:${PORT}`);
});
