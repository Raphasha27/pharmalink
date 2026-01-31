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
  const [activeSection, setActiveSection] = useState(null);
  const [verifyingOrder, setVerifyingOrder] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const navItems = {
    citizen: [
      { id: 'order', label: 'Order Meds', icon: ShoppingCart, color: 'indigo' },
      { id: 'track', label: 'Track Delivery', icon: MapPin, color: 'emerald' },
      { id: 'history', label: 'My Prescriptions', icon: History, color: 'blue' },
      { id: 'payment', label: 'Payment Methods', icon: CreditCard, color: 'amber' },
    ],
    pharmacist: [
      { id: 'inbox', label: 'Clinical Inbox', icon: Bell, color: 'amber' },
      { id: 'inventory', label: 'Inventory Control', icon: PackageCheck, color: 'emerald' },
      { id: 'verification', label: 'Biometric Audit', icon: ShieldCheck, color: 'indigo' },
    ],
    driver: [
      { id: 'mission', label: 'Active Mission', icon: Truck, color: 'blue' },
      { id: 'route', label: 'Route Map', icon: MapPin, color: 'emerald' },
    ],
    admin: [
      { id: 'hub', label: 'National Hub', icon: Activity, color: 'indigo' },
      { id: 'reports', label: 'Logistics Reports', icon: PackageCheck, color: 'amber' },
    ]
  };

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
    setActiveSection(null);
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
          <div 
            onClick={() => setActiveSection(null)}
            className="w-12 h-12 bg-gradient-to-br from-[#006643] to-[#004d32] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 cursor-pointer active:scale-95 transition-all"
          >
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

        {/* Dynamic Content View */}
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <motion.div 
               key="landing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-6"
            >
              {/* Mandate Banner from Screenshot */}
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[12px] font-bold text-emerald-400/80 leading-relaxed uppercase tracking-wider">
                  <span className="text-emerald-400">MANDATE:</span> Delivering chronic medication to reduced hospital lines.
                </p>
              </div>

              {/* Navigation Blocks as requested */}
              <div className="flex flex-col gap-4">
                {navItems[activePersona].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                        setActiveSection(item.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full p-8 rounded-[2.5rem] glass-card flex items-center gap-8 group active:scale-[0.98] transition-all text-left relative overflow-hidden"
                  >
                    <div className={`p-5 rounded-2xl bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors`}>
                      <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{item.label}</h4>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Access Service</p>
                    </div>
                    <ChevronRight className="ml-auto w-6 h-6 text-slate-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Section Detail Views */}
              {activeSection === 'order' && (
                <Section title="Order Medicines" subtitle="Request Service" icon={ShoppingCart}>
                   <div className="p-10 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                      <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Scan className="w-12 h-12 text-indigo-400" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold">Upload Prescription</h4>
                        <p className="text-slate-500">Scan or upload your physical script to start</p>
                      </div>
                      <button className="w-full py-6 bg-indigo-600 rounded-3xl font-bold shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all">Select File</button>
                   </div>
                </Section>
              )}

              {activeSection === 'track' && (
                <Section title="Live Tracking" subtitle="Real-time Dispatch" icon={MapPin} accent="emerald">
                   <div className="space-y-6">
                    <div className="h-96 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative">
                        <MapContainer center={INITIAL_DRIVER_COORDS} zoom={14} className="h-full w-full">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={driverPos} icon={L.divIcon({html: '<div class="text-4xl">🚚</div>', className: 'marker-icon'})} />
                            <Marker position={PATIENT_COORDS} icon={L.divIcon({html: '<div class="text-3xl">🏠</div>', className: 'marker-icon'})} />
                        </MapContainer>
                        <div className="absolute top-6 right-6 z-[1000] glass-card px-6 py-4 rounded-3xl">
                            <p className="text-[10px] font-black text-emerald-500 uppercase">Estimated</p>
                            <p className="text-xl font-bold">14 Mins</p>
                        </div>
                    </div>
                    <div className="p-8 glass-card rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Delivery in Progress</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Sandton West, GP</p>
                        </div>
                    </div>
                   </div>
                </Section>
              )}

              {activeSection === 'history' && (
                <Section title="Prescriptions" subtitle="Integrity Audit" icon={History} accent="blue">
                   <div className="space-y-4">
                      {[
                        { name: "Metformin 500mg", batch: "BATCH-882", date: "12 Dec 2025" },
                        { name: "Amlodipine 5mg", batch: "BATCH-441", date: "15 Nov 2025" },
                        { name: "Insulin Glargine", batch: "BATCH-002", date: "02 Oct 2025" }
                      ].map((med, i) => (
                        <div key={i} className="p-6 glass-card rounded-3xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-400">{med.name[0]}</div>
                              <div>
                                 <p className="font-bold text-lg">{med.name}</p>
                                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{med.batch} • {med.date}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-6 h-6 text-slate-700" />
                        </div>
                      ))}
                   </div>
                </Section>
              )}

              {activeSection === 'payment' && (
                <Section title="Security Cloud" subtitle="Finance Audit" icon={CreditCard} accent="amber">
                   <div className="space-y-6">
                    <div className="p-8 rounded-[3rem] bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-900/40 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col justify-between h-40">
                            <CreditCard className="w-10 h-10 text-white/40" />
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Primary Wallet</p>
                                <p className="text-2xl font-bold text-white tracking-[0.2em]">**** **** 4402</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    </div>
                    <button className="w-full py-6 glass-card rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
                        < Bell className="w-5 h-5 text-amber-500" /> Add Payment Method
                    </button>
                   </div>
                </Section>
              )}

              <button 
                onClick={() => setActiveSection(null)}
                className="w-full py-6 mt-4 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 font-bold hover:bg-white/5 transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}

          {/* Persona Specific Views (Redirected from Launchpad) */}
          {activePersona === 'pharmacist' && activeSection && (
            <motion.div key="pharmacist-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {activeSection === 'inbox' && (
                <Section title="Clinical Inbox" subtitle="Registry Audit" icon={Bell} accent="amber">
                   <div className="space-y-4">
                      {[
                        { id: 'SCR-9921', name: 'Zanele Khumalo', med: 'Metformin', accuracy: '98%' },
                        { id: 'SCR-9922', name: 'Peter Bosch', med: 'Amlodipine', accuracy: '94%' }
                      ].map((scr, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-white">{scr.name[0]}</div>
                                 <div className="text-white">
                                    <p className="font-bold">{scr.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{scr.id}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] text-emerald-500 font-black uppercase">Accuracy</p>
                                 <p className="text-lg font-mono font-bold text-white">{scr.accuracy}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setVerifyingOrder(scr)}
                             className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm border border-white/5 transition-all text-white"
                           >
                             Verify Clinical Integrity
                           </button>
                        </div>
                      ))}
                   </div>
                </Section>
              )}

              {activeSection === 'inventory' && (
                <Section title="Inventory Control" subtitle="National Stock" icon={PackageCheck} accent="emerald">
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Metformin', count: '1.2M', trend: '↑' },
                        { label: 'Insulin', count: '150k', trend: '↓' },
                        { label: 'Amlodipine', count: '0.8M', trend: '↑' },
                        { label: 'Tenofovir', count: '2.4M', trend: '→' }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
                           <p className="text-2xl font-bold text-white">{item.count}</p>
                           <p className={`text-[10px] mt-1 ${item.trend === '↑' ? 'text-emerald-500' : item.trend === '↓' ? 'text-red-500' : 'text-slate-400'}`}>{item.trend} Burn rate stable</p>
                        </div>
                      ))}
                   </div>
                </Section>
              )}

              {activeSection === 'verification' && (
                 <Section title="Biometric Audit" subtitle="Registry Security" icon={ShieldCheck}>
                    <div className="p-10 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                      <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-4xl">👤</div>
                      <p className="text-slate-500">Scan pharmacist identity card to access restricted scripts.</p>
                      <button className="w-full py-5 bg-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-indigo-600/20">Initiate Scan</button>
                    </div>
                 </Section>
              )}

              <button onClick={() => setActiveSection(null)} className="w-full py-6 mt-4 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 font-bold hover:bg-white/5 transition-all">Back to Dashboard</button>
            </motion.div>
          )}

          {activePersona === 'driver' && activeSection && (
            <motion.div key="driver-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               {activeSection === 'mission' && (
                 <Section title="Active Mission" subtitle="Vehicle ID: DH-X1" icon={Truck} accent="blue">
                    <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/5 overflow-hidden relative">
                      <div className="flex justify-between items-center relative z-10 text-white">
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Current Recipient</p>
                            <h4 className="text-2xl font-bold">Zanele Khumalo</h4>
                          </div>
                          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <MapPin className="w-7 h-7 text-white" />
                          </div>
                      </div>
                      <div className="h-64 rounded-3xl overflow-hidden border border-white/5">
                          <MapContainer center={INITIAL_DRIVER_COORDS} zoom={14} className="h-full w-full" zoomControl={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                             <Marker position={driverPos} icon={L.divIcon({html: '<div class="text-3xl">🚚</div>', className: 'marker-icon'})} />
                          </MapContainer>
                      </div>
                      <button onClick={() => {
                        alert("Handoff sequence initiated. Verification required.");
                      }} className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Verify Handoff Complete</button>
                    </div>
                 </Section>
               )}

               {activeSection === 'route' && (
                 <Section title="Route Optimization" subtitle="Efficiency Hub" icon={MapPin} accent="emerald">
                    <div className="p-8 glass-card rounded-3xl space-y-4 text-white">
                       <div className="flex justify-between border-b border-white/5 pb-4">
                          <p className="text-slate-500">Next Stop</p>
                          <p className="font-bold">4.2km Away</p>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-4">
                          <p className="text-slate-500">Traffic Status</p>
                          <p className="text-emerald-500 font-bold">Clear</p>
                       </div>
                       <button className="w-full py-4 bg-white/5 rounded-2xl font-bold">Open Navigation</button>
                    </div>
                 </Section>
               )}

               <button onClick={() => setActiveSection(null)} className="w-full py-6 mt-4 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 font-bold hover:bg-white/5 transition-all">Back to Dashboard</button>
            </motion.div>
          )}

          {activePersona === 'admin' && activeSection && (
            <motion.div key="admin-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               {activeSection === 'hub' && (
                  <Section title="National Hub" subtitle="NHI Logistics Core" icon={Activity} accent="indigo">
                      <div className="grid gap-4">
                        {[
                          { label: 'Active Couriers', val: '1,042', icon: Truck },
                          { label: 'Queue Reduction', val: '24%', icon: Clock },
                          { label: 'Script Volume', val: '14.2k', icon: PackageCheck },
                          { label: 'Service Level', val: '99.2%', icon: ShieldCheck }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex justify-between items-center group">
                            <div>
                                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.val}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">
                                <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                  </Section>
               )}
               
               {activeSection === 'reports' && (
                  <Section title="Logistics Audit" subtitle="Transparency Hub" icon={PackageCheck} accent="amber">
                     <div className="p-10 border-2 border-dashed border-white/5 rounded-3xl text-center space-y-4">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-3xl">📊</div>
                        <p className="text-slate-500">Generating national distribution reports for the current cycle...</p>
                        <button className="w-full py-4 bg-amber-600 rounded-2xl font-bold text-white">Download PDF</button>
                     </div>
                  </Section>
               )}

               <button onClick={() => setActiveSection(null)} className="w-full py-6 mt-4 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 font-bold hover:bg-white/5 transition-all">Back to Dashboard</button>
            </motion.div>
          )}

          {/* Persona Specific Feed (Pharmacist, Driver, Admin) */}
          {activePersona !== 'citizen' && !activeSection && ( // Only show this if no specific section is active for non-citizen personas
            <motion.div key={activePersona} className="space-y-6">
               <Section title="System Access" subtitle="Registry Hub" icon={ShieldCheck}>
                  <div className="p-10 border-2 border-dashed border-white/5 rounded-3xl text-center">
                    <p className="text-slate-500">Access Restricted to {activePersona.toUpperCase()} credentials</p>
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
        <button onClick={() => setActiveSection(null)} className={`p-4 rounded-2xl transition-all ${!activeSection ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveSection('history')} className={`p-4 rounded-2xl transition-all ${activeSection === 'history' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
          <History className="w-6 h-6" />
        </button>
        <div className="w-px h-8 bg-white/10" />
        <button onClick={() => setActiveSection('track')} className={`p-4 rounded-2xl transition-all ${activeSection === 'track' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
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
