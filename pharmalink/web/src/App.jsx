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
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default leaflet icons in React
import 'leaflet/dist/leaflet.css';

const PHARMACY_COORDS = [-26.1076, 28.0567]; // Sandton
const PATIENT_COORDS = [-26.1200, 28.0700]; // Nearby
const INITIAL_DRIVER_COORDS = [-26.1150, 28.0600];

const App = () => {
  const [activePersona, setActivePersona] = useState('citizen');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, ordered, en-route, delivered
  const [driverPos, setDriverPos] = useState(INITIAL_DRIVER_COORDS);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate driver movement when en-route
  useEffect(() => {
    if (orderStatus === 'en-route') {
      const interval = setInterval(() => {
        setDriverPos(prev => [prev[0] + 0.0001, prev[1] + 0.0001]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [orderStatus]);

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
    ]
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-slate-50 overflow-hidden">
      <div className="glow" style={{ top: '-10%', left: '-10%' }} />
      <div className="glow" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }} />

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-[#1e293b]/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
            🇿🇦
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg tracking-tight whitespace-nowrap"
            >
              NHI Dispatch
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems[activePersona === 'citizen' ? 'citizen' : 'admin'].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              {isSidebarOpen && (
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setActivePersona(activePersona === 'citizen' ? 'admin' : 'citizen')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-bold">Switch to {activePersona === 'citizen' ? 'Facility' : 'Citizen'}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {activePersona === 'citizen' ? 'Citizen Services' : 'National Facility Hub'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
              <span className="text-sm font-mono text-slate-400">
                {currentTime.toLocaleTimeString('en-ZA', { hour12: false })}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
               <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activePersona === 'citizen' ? (
              <motion.div 
                key="citizen-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                {/* Stats / Welcome */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">Good Evening, Citizen</h2>
                    <p className="text-slate-400">Your chronic medication is ready for dispatch.</p>
                  </div>
                  <button 
                    onClick={() => {
                        setOrderStatus('en-route');
                        alert("NHI: Order Confirmed. Dispatching from local facility...");
                    }}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    Confirm Home Delivery
                  </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Tracking */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-6 h-[500px] relative">
                      <div className="absolute top-10 left-10 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
                         <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-emerald-400" />
                            <div>
                               <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                               <p className="text-sm font-bold">{orderStatus === 'idle' ? 'Ready for Pickup' : 'En Route to Home'}</p>
                            </div>
                         </div>
                      </div>
                      
                      <MapContainer center={PHARMACY_COORDS} zoom={13} scrollWheelZoom={false} className="rounded-2xl overflow-hidden">
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={PHARMACY_COORDS} icon={L.divIcon({html: '🏥', className: 'map-icon', iconSize: [40, 40]})}>
                          <Popup>Local Health Facility</Popup>
                        </Marker>
                        <Marker position={PATIENT_COORDS} icon={L.divIcon({html: '🏠', className: 'map-icon', iconSize: [40, 40]})}>
                          <Popup>Your Residence</Popup>
                        </Marker>
                        {orderStatus === 'en-route' && (
                          <Marker position={driverPos} icon={L.divIcon({html: '🚚', className: 'map-icon', iconSize: [40, 40]})}>
                            <Popup>Health Transporter #04</Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>

                  {/* Right Column: Info */}
                  <div className="space-y-6">
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-indigo-400" />
                        <h3 className="font-bold text-lg">Next Refill</h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        Your Metformin supply is low. We have pre-approved a delivery for March 15th.
                      </p>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold">Active Prescription</h3>
                      <div className="space-y-3">
                        {['Metformin 500mg', 'Amlodipine 5mg'].map((med) => (
                          <div key={med} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-sm">{med}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="admin-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-8"
              >
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
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${i === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-400" />
                        National Logistics Infrastructure
                    </h2>
                    <div className="h-[400px] w-full bg-slate-900/50 rounded-2xl flex items-center justify-center border border-white/5 italic text-slate-500">
                        Admin Master Map showing all 9 provinces (Mock Infrastructure)
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Tailwind-like utilities in a style tag for simplicity in this turn */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        /* Direct Tailwind replacements for the JSX above */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-row { flex-direction: row; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .items-end { align-items: flex-end; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .p-8 { padding: 2rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .w-full { width: 100%; }
        .h-screen { height: 100vh; }
        .min-h-screen { min-height: 100vh; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-3xl { border-radius: 1.5rem; }
        .rounded-full { border-radius: 9999px; }
        .bg-white\/5 { background-color: rgba(255,255,255,0.05); }
        .border { border-width: 1px; }
        .border-r { border-right-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-white\/5 { border-color: rgba(255,255,255,0.05); }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-slate-300 { color: #cbd5e1; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-500 { color: #64748b; }
        .text-emerald-400 { color: #34d399; }
        .text-emerald-500 { color: #10b981; }
        .tracking-tight { letter-spacing: -0.025em; }
        .whitespace-nowrap { white-space: nowrap; }
        .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
        .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
      `}</style>
    </div>
  );
};

export default App;
