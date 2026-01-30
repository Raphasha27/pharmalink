import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hospital, 
  Truck, 
  User, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Menu,
  ChevronRight,
  LogOut,
  CreditCard,
  History,
  Info,
  ChevronDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PHARMACY_COORDS = [-26.1076, 28.0567];
const PATIENT_COORDS = [-26.1200, 28.0700];
const INITIAL_DRIVER_COORDS = [-26.1150, 28.0600];

const App = () => {
  const [activePersona, setActivePersona] = useState('citizen');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [orderStatus, setOrderStatus] = useState('idle');
  const [driverPos, setDriverPos] = useState(INITIAL_DRIVER_COORDS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adjudication, setAdjudication] = useState(null);
  const [isAdjudicating, setIsAdjudicating] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('Discovery Health');
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (orderStatus === 'en-route') {
      const interval = setInterval(() => {
        setDriverPos(prev => [prev[0] + 0.0001, prev[1] + 0.0001]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [orderStatus]);

  const handleAdjudication = async (scheme) => {
    if (scheme === 'Not on Medical Aid') {
        setAdjudication(null);
        return;
    }
    setSelectedScheme(scheme);
    setIsAdjudicating(true);
    try {
        const meds = [
            { name: "Metformin 500mg", price: 450.00 },
            { name: "Amlodipine 5mg", price: 180.00 }
        ];
        const response = await fetch('/api/orders/adjudicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schemeName: scheme, medications: meds })
        });
        const data = await response.json();
        setAdjudication(data);
    } catch (error) {
        console.error("Adjudication failed:", error);
    } finally {
        setIsAdjudicating(false);
    }
  };

  const handleSafeDrop = () => {
    setIsBiometricActive(true);
    setTimeout(() => {
        alert("🛡️ Biometric Identity Verified: Safe-Drop protocol authorized. Package released to secure location.");
        setOrderStatus('delivered');
        setIsBiometricActive(false);
    }, 2000);
  };

  const handleNavClick = (label) => {
    alert(`🔐 Accessing Secure Section: ${label}. \n\nIdentity verification via NHI Digital Profile in progress...`);
  };

  const navItems = {
    citizen: [
      { id: 'order', label: 'Order Medication', icon: Truck },
      { id: 'track', label: 'Live Tracking', icon: MapPin },
      { id: 'history', label: 'Medical History', icon: History },
      { id: 'payment', label: 'Payment Hub', icon: CreditCard },
    ],
    admin: [
      { id: 'fleet', label: 'Fleet Management', icon: Activity },
      { id: 'inventory', label: 'National Stock', icon: ShieldCheck },
      { id: 'reports', label: 'Queue Analytics', icon: Info },
      { id: 'compliance', label: 'Audit Logs', icon: ShieldCheck },
    ]
  };

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-50 overflow-hidden font-sans">
      <div className="glow" style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }} />
      <div className="glow" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }} />

      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-[#0f172a]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-lg tracking-tight whitespace-nowrap bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Health Dispatch
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems[activePersona === 'citizen' ? 'citizen' : 'admin'].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.label)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group relative overflow-hidden active:scale-95"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              {isSidebarOpen && (
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setActivePersona(activePersona === 'citizen' ? 'admin' : 'citizen')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors">
            <ShieldCheck className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-bold">Switch to {activePersona === 'citizen' ? 'Facility' : 'Citizen'}</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {activePersona === 'citizen' ? 'Citizen Services' : 'National Facility Hub'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
              <span className="text-sm font-mono text-slate-400">{currentTime.toLocaleTimeString('en-ZA', { hour12: false })}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
               <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activePersona === 'citizen' ? (
              <motion.div key="citizen-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">Good Evening, Citizen</h2>
                    <p className="text-slate-400">Your chronic medication is ready for dispatch.</p>
                  </div>
                  <button onClick={() => { setOrderStatus('en-route'); alert("NHI: Order Confirmed. Dispatching from local facility..."); }} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                    Confirm Home Delivery
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-6 h-[500px] relative">
                      <div className="absolute top-10 left-10 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl space-y-3 min-w-[200px]">
                         <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-emerald-400" />
                            <div>
                               <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                               <p className="text-sm font-bold">{orderStatus === 'idle' ? 'Ready for Pickup' : orderStatus === 'en-route' ? 'En Route to Home' : 'Package Delivered'}</p>
                            </div>
                         </div>
                         {orderStatus === 'en-route' && (
                            <button 
                                onClick={handleSafeDrop}
                                disabled={isBiometricActive}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isBiometricActive ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                                Authorization Safe-Drop
                            </button>
                         )}
                      </div>
                      
                      <MapContainer center={PHARMACY_COORDS} zoom={13} scrollWheelZoom={false} className="rounded-2xl overflow-hidden" style={{height:'100%'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={PHARMACY_COORDS} icon={L.divIcon({html: '🏥', className: 'map-icon', iconSize: [40, 40]})} />
                        <Marker position={PATIENT_COORDS} icon={L.divIcon({html: '🏠', className: 'map-icon', iconSize: [40, 40]})} />
                        {orderStatus === 'en-route' && (
                          <Marker position={driverPos} icon={L.divIcon({html: '🚚', className: 'map-icon', iconSize: [40, 40]})} />
                        )}
                      </MapContainer>
                    </div>

                    {/* Integrated Adjudication Section */}
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Medical Aid Benefit Check</h3>
                            <div className="relative">
                                <select 
                                    className="appearance-none bg-slate-800 border border-white/10 px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                    onChange={(e) => handleAdjudication(e.target.value)}
                                    value={selectedScheme}
                                >
                                    <option>Discovery Health</option>
                                    <option>GEMS</option>
                                    <option>Bonitas</option>
                                    <option>Momentum</option>
                                    <option>Not on Medical Aid</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {isAdjudicating ? (
                            <div className="flex flex-col items-center py-8">
                                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-sm text-slate-400">Contacting Health Switch...</p>
                            </div>
                        ) : adjudication ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Cost</p>
                                        <p className="text-xl font-bold">R{adjudication.summary.totalValue}</p>
                                    </div>
                                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10">
                                        <p className="text-xs text-emerald-500 uppercase font-bold mb-1">Benefit Paid</p>
                                        <p className="text-xl font-bold text-emerald-400">R{adjudication.summary.benefitPaid}</p>
                                    </div>
                                    <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/10">
                                        <p className="text-xs text-amber-500 uppercase font-bold mb-1">Co-Payment</p>
                                        <p className="text-xl font-bold text-amber-400">R{adjudication.summary.patientCoPayment}</p>
                                    </div>
                                    <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/10">
                                        <p className="text-xs text-indigo-500 uppercase font-bold mb-1">EDI Ref</p>
                                        <p className="text-xs font-mono mt-2">{adjudication.transactionId}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-500/20 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    <p className="text-sm font-medium">Claim Approved: {selectedScheme} has confirmed coverage for this order.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-slate-400 italic">Select a scheme to calculate your live co-payment.</p>
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-indigo-400" />
                        <h3 className="font-bold text-lg">Next Refill</h3>
                      </div>
                      <p className="text-sm text-slate-400">Your Metformin supply is low. We have pre-approved a delivery for March 15th.</p>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold">Active Prescription</h3>
                      <div className="space-y-3">
                        {adjudication ? adjudication.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-xs font-bold text-emerald-500">R{item.cost}</span>
                          </div>
                        )) : ['Metformin 500mg', 'Amlodipine 5mg'].map((med) => (
                           <div key={med} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                             <span className="text-sm">{med}</span>
                             <ShieldCheck className="w-4 h-4 text-emerald-500" />
                           </div>
                         ))}
                      </div>
                    </div>

                    <button 
                        onClick={() => {
                            if (!adjudication) {
                                alert("Please select a medical aid scheme and perform a benefit check first.");
                                return;
                            }
                            alert(`💳 Processing Co-payment of R${adjudication.summary.patientCoPayment} via Secure iEFT...`);
                            setTimeout(() => {
                                alert("✅ Payment Successful. Order transmitted to dispatch terminal.");
                                setOrderStatus('en-route');
                            }, 2000);
                        }} 
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
                    >
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="admin-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Queue Reduction', value: '14,204', trend: '↑ 24%' },
                        { label: 'Active Transporters', value: '42', trend: '● Live' },
                        { label: 'Stock Integrity', value: '99.4%', trend: 'Optimum' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#1e293b]/50 border border-white/5 p-6 rounded-3xl">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold">{stat.value}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${i === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-400" />
                        National Logistics Infrastructure
                    </h2>
                    <div className="h-[500px] w-full bg-slate-900/50 rounded-2xl relative overflow-hidden flex items-center justify-center">
                        <MapContainer center={[-26.2041, 28.0473]} zoom={10} className="w-full h-full">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[-26.1076, 28.0567]} icon={L.divIcon({html: '🏥', className: 'map-icon', iconSize: [30, 30]})} />
                            <Marker position={[-26.1800, 28.0300]} icon={L.divIcon({html: '🚚', className: 'map-icon', iconSize: [30, 30]})} />
                            <Marker position={[-26.2200, 28.0800]} icon={L.divIcon({html: '🚚', className: 'map-icon', iconSize: [30, 30]})} />
                        </MapContainer>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-row { flex-direction: row; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .items-end { align-items: flex-end; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .p-8 { padding: 2rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .pr-10 { padding-right: 2.5rem; }
        .w-5 { width: 1.25rem; }
        .h-5 { height: 1.25rem; }
        .w-full { width: 100%; }
        .h-screen { height: 100vh; }
        .min-h-screen { min-height: 100vh; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-3xl { border-radius: 1.5rem; }
        .bg-white\/5 { background-color: rgba(255,255,255,0.05); }
        .border { border-width: 1px; }
        .border-r { border-right-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-t { border-top-width: 1px; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-xl { font-size: 1.25rem; }
        .text-3xl { font-size: 1.875rem; }
        .font-bold { font-weight: 700; }
        .tracking-tight { letter-spacing: -0.025em; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
