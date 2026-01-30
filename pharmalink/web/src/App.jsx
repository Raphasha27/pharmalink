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
  ChevronDown,
  ShoppingCart,
  HelpCircle,
  Bell,
  Search,
  Scan,
  PackageCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Constants
const PHARMACY_COORDS = [-26.1076, 28.0567];
const PATIENT_COORDS = [-26.1200, 28.0700];
const INITIAL_DRIVER_COORDS = [-26.1150, 28.0600];

const App = () => {
  const [activePersona, setActivePersona] = useState('citizen');
  const [orderStatus, setOrderStatus] = useState('idle');
  const [driverPos, setDriverPos] = useState(INITIAL_DRIVER_COORDS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPersonaModalOpen, setPersonaModalOpen] = useState(false);
  const [verifyingOrder, setVerifyingOrder] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const personaOptions = [
    { id: 'citizen', label: 'Citizen View', icon: User, desc: 'Patient Logistics' },
    { id: 'pharmacist', label: 'Clinical Portal', icon: ShieldCheck, desc: 'Script Verification' },
    { id: 'driver', label: 'Transport Terminal', icon: Truck, desc: 'Live Dispatch' },
    { id: 'admin', label: 'Facility Admin', icon: Activity, desc: 'National Hub' },
  ];

  const handlePersonaChange = (id) => {
    setActivePersona(id);
    setPersonaModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section Component for scrolling feel
  const Section = ({ title, subtitle, icon: Icon, children, accent = "indigo" }) => (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="section-block glass-card space-y-6"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className={`text-${accent}-400 text-[10px] font-black uppercase tracking-[0.2em]`}>{subtitle}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className={`p-3 rounded-2xl bg-${accent}-500/10`}>
          <Icon className={`w-6 h-6 text-${accent}-400`} />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </motion.section>
  );

  return (
    <div className="app-container">
      <div className="bg-mesh" />

      {/* Persistent Header */}
      <header className="sticky top-0 z-[100] glass-panel px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#006643] to-[#004d32] rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none">NHI DISPATCH</h1>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">National Logistics Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 relative">
            <Bell className="w-5 h-5 text-slate-400" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#030712]" />
          </button>
          <button 
            onClick={() => setPersonaModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10 overflow-hidden active:scale-95 transition-all"
          >
            <User className="w-6 h-6 text-indigo-400" />
          </button>
        </div>
      </header>

      {/* Main Content Feed */}
      <main className="feed-content mt-8">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-[3rem] bg-indigo-600 space-y-6 relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-3xl font-black leading-tight">Welcome back,<br />Zanele.</h3>
            <p className="text-indigo-100/60 text-sm mt-2 font-medium">Identity: {personaOptions.find(p => p.id === activePersona).label}</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </motion.section>

        {/* Persona Specific Feed */}
        <AnimatePresence mode="wait">
          {activePersona === 'citizen' && (
            <motion.div key="citizen" className="space-y-6">
              <Section title="Medication Tracker" subtitle="Live Dispatch Feed" icon={Truck} accent="emerald">
                <div className="bg-white/5 rounded-3xl p-6 space-y-4 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">Order #DH-482</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">En-Route</span>
                  </div>
                  <div className="h-48 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner bg-slate-900">
                    <MapContainer center={INITIAL_DRIVER_COORDS} zoom={14} className="h-full w-full" zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={PATIENT_COORDS} icon={L.divIcon({html: '<div class="w-8 h-8 flex items-center justify-center text-xl">🏠</div>', className: 'marker-icon'})} />
                      <Marker position={driverPos} icon={L.divIcon({html: '<div class="w-10 h-10 flex items-center justify-center text-2xl animate-bounce">🚚</div>', className: 'marker-icon'})} />
                    </MapContainer>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Estimated Arrival</p>
                      <p className="text-xs text-emerald-400 font-mono">14 Mins • Sandton Central</p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="New Request" subtitle="Clinic Hub" icon={ShoppingCart}>
                 <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl hover:border-indigo-500/50 transition-all text-center space-y-4 group">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover:bg-indigo-500/10 transition-colors">
                      <ShoppingCart className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Upload Prescription</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, Photo or scan physical script</p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Start Dispensing Process</button>
                 </div>
              </Section>

              <Section title="Prescriptions" subtitle="Integrity Audit" icon={ShieldCheck} accent="emerald">
                <div className="space-y-3">
                   {[
                     { name: "Metformin 500mg", date: "12 Dec 2025", status: "Active" },
                     { name: "Amlodipine 5mg", date: "15 Nov 2025", status: "Refill Due" },
                   ].map((med, i) => (
                     <div key={i} className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold">{med.name[0]}</div>
                           <div>
                              <p className="font-bold">{med.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{med.date}</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                     </div>
                   ))}
                </div>
              </Section>
            </motion.div>
          )}

          {activePersona === 'pharmacist' && (
             <motion.div key="pharmacist" className="space-y-6">
                <Section title="Clinical Inbox" subtitle="Registry Audit" icon={Bell} accent="amber">
                   <div className="space-y-4">
                      {[
                        { id: 'SCR-9921', name: 'Zanele Khumalo', med: 'Metformin', accuracy: '98%' },
                        { id: 'SCR-9922', name: 'Peter Bosch', med: 'Amlodipine', accuracy: '94%' }
                      ].map((scr, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold">{scr.name[0]}</div>
                                 <div>
                                    <p className="font-bold">{scr.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{scr.id}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] text-emerald-500 font-black uppercase">Accuracy</p>
                                 <p className="text-lg font-mono font-bold">{scr.accuracy}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setVerifyingOrder(scr)}
                             className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm border border-white/5 transition-all"
                           >
                             Verify Clinical Integrity
                           </button>
                        </div>
                      ))}
                   </div>
                </Section>
                
                <Section title="Inventory Control" subtitle="National Stock" icon={PackageCheck} accent="emerald">
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Metformin', count: '1.2M', trend: '↑' },
                        { label: 'Insulin', count: '150k', trend: '↓' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
                           <p className="text-2xl font-bold">{item.count}</p>
                           <p className={`text-xs mt-1 ${item.trend === '↑' ? 'text-emerald-500' : 'text-red-500'}`}>{item.trend} Burn rate stable</p>
                        </div>
                      ))}
                   </div>
                </Section>
             </motion.div>
          )}

          {activePersona === 'driver' && (
            <motion.div key="driver" className="space-y-6">
               <Section title="Active Mission" subtitle="Vehicle ID: DH-X1" icon={Truck} accent="blue">
                  <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/5 overflow-hidden relative">
                     <div className="flex justify-between items-center relative z-10">
                        <div>
                           <p className="text-xs text-slate-500 font-bold uppercase">Current Recipient</p>
                           <h4 className="text-2xl font-bold">Zanele Khumalo</h4>
                        </div>
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                           <MapPin className="w-7 h-7 text-white" />
                        </div>
                     </div>
                     <div className="h-48 rounded-3xl overflow-hidden border border-white/5">
                        <MapContainer center={INITIAL_DRIVER_COORDS} zoom={14} className="h-full w-full" zoomControl={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        </MapContainer>
                     </div>
                     <button className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20">Verify Handoff Complete</button>
                  </div>
               </Section>
            </motion.div>
          )}

          {activePersona === 'admin' && (
            <motion.div key="admin" className="space-y-6">
               <Section title="National Hub" subtitle="NHI Logistics Core" icon={Activity} accent="amber">
                   <div className="grid gap-4">
                      {[
                        { label: 'Active Couriers', val: '1,042', icon: Truck },
                        { label: 'Queue Reduction', val: '24%', icon: Clock },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex justify-between items-center group">
                           <div>
                              <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                              <p className="text-3xl font-bold">{stat.val}</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">
                              <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                           </div>
                        </div>
                      ))}
                   </div>
               </Section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Hub - Universal bottom section */}
        <Section title="Help & Support" subtitle="National Response" icon={HelpCircle}>
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                 <Bell className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                 <p className="font-bold">Live Clinical Chat</p>
                 <p className="text-xs text-slate-500">Average wait time: 2 mins</p>
              </div>
              <ChevronRight className="ml-auto w-6 h-6 text-slate-700" />
           </div>
        </Section>
      </main>

      {/* Floating Action Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-lg glass-panel h-20 rounded-[2.5rem] flex items-center justify-around px-8 shadow-2xl border border-white/10">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`p-4 rounded-2xl transition-all ${activePersona === 'citizen' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button className="p-4 rounded-2xl text-slate-500">
          <History className="w-6 h-6" />
        </button>
        <div className="w-px h-8 bg-white/10" />
        <button className="p-4 rounded-2xl text-slate-500">
           <Search className="w-6 h-6" />
        </button>
        <button onClick={() => setPersonaModalOpen(true)} className="p-4 rounded-2xl text-slate-500">
           <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Identity Switcher Bottom Sheet */}
      <AnimatePresence>
        {isPersonaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-end"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-[#0f172a] rounded-t-[3rem] p-8 pb-12 space-y-8 border-t border-white/10"
            >
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold italic">Switch Identity</h2>
                 <button onClick={() => setPersonaModalOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-bold text-xl">×</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {personaOptions.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handlePersonaChange(p.id)}
                    className={`flex items-center gap-6 p-6 rounded-3xl transition-all border ${activePersona === p.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
                  >
                    <div className={`p-4 rounded-2xl ${activePersona === p.id ? 'bg-white/20' : 'bg-white/5'}`}>
                      <p.icon className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                       <p className="font-bold text-lg">{p.label}</p>
                       <p className={`text-xs ${activePersona === p.id ? 'text-indigo-100' : 'text-slate-500'}`}>{p.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto w-5 h-5 opacity-40" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal (Pharmacist) */}
      <AnimatePresence>
        {verifyingOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-slate-950/95 flex items-center justify-center p-6">
             <div className="w-full max-w-lg glass-card rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                <div className="glow" style={{ top: '-10%', right: '-10%', width: '100%', height: '100%' }} />
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Clinical AI Verification</p>
                      <h3 className="text-3xl font-bold">Verify Script</h3>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Patient</p>
                      <p className="text-xl font-bold">{verifyingOrder.name}</p>
                   </div>
                   <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Medication</p>
                      <p className="text-xl font-bold">{verifyingOrder.med}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setVerifyingOrder(null)} className="flex-1 py-5 bg-white/5 rounded-2xl font-bold text-slate-400">Reject</button>
                   <button onClick={() => {
                      alert("✅ Registry Integrity Validated. Dispensing sequence initialized.");
                      setVerifyingOrder(null);
                   }} className="flex-1 py-5 bg-indigo-600 rounded-2xl font-bold shadow-xl shadow-indigo-600/20">Confirm</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
