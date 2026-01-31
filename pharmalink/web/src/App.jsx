import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
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
  Package
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const navItems = {
    citizen: [
      { id: 'order', label: 'Order Meds', icon: ShoppingCart, color: 'indigo' },
      { id: 'track', label: 'Track Delivery', icon: MapPin, color: 'emerald' },
      { id: 'history', label: 'My Prescriptions', icon: History, color: 'blue' },
      { id: 'payment', label: 'Payment Methods', icon: CreditCard, color: 'amber' },
    ],
    pharmacist: [
      { id: 'inbox', label: 'Clinical Inbox', icon: Bell, color: 'amber' },
      { id: 'inventory', label: 'Inventory Control', icon: Package, color: 'emerald' },
      { id: 'verification', label: 'Biometric Audit', icon: ShieldCheck, color: 'indigo' },
    ],
    driver: [
      { id: 'mission', label: 'Active Mission', icon: Truck, color: 'blue' },
      { id: 'route', label: 'Route Map', icon: MapPin, color: 'emerald' },
    ],
    admin: [
      { id: 'hub', label: 'National Hub', icon: Activity, color: 'indigo' },
      { id: 'reports', label: 'Logistics Reports', icon: Package, color: 'amber' },
    ],
    tools: [
      { id: 'ai_diagnosis', label: 'AI Clinical Intel', icon: ShieldCheck, color: 'indigo' },
      { id: 'logistics_ai', label: 'Route Optimizer', icon: MapPin, color: 'emerald' },
      { id: 'drug_interaction', label: 'Drug Safety AI', icon: Activity, color: 'rose' },
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
    { id: 'tools', label: 'AI Intelligence', icon: Activity, desc: 'HF Toolbench' },
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

  const ScanningOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scan-overlay"
    >
      <div className="relative">
        <div className="scan-box">
          <div className="scan-corner corner-tl" />
          <div className="scan-corner corner-tr" />
          <div className="scan-corner corner-bl" />
          <div className="scan-corner corner-br" />
          <div className="scan-line" />
        </div>
      </div>
      <div className="mt-10 text-center space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Scanning Prescription</h3>
        <p className="text-slate-500 text-sm">Align script with the frame</p>
        <button 
          onClick={() => setIsScanning(false)}
          className="px-8 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (activePersona === 'citizen') setActiveSection('order');
      else if (activePersona === 'pharmacist') setActiveSection('inbox');
    }, 3000);
  };

  const [isUploading, setIsUploading] = useState(false);
  const handlePrescriptionUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert("✅ Prescription Digitally Certified. Redirecting to pharmacy matching...");
      setActiveSection('history');
    }, 2500);
  };

  const handleHandoff = () => {
    if(confirm("Confirm biometric handoff to patient?")) {
      alert("📦 Mission Accomplished. Inventory records updated.");
      setActiveSection(null);
    }
  };

  const handleSupportChat = () => {
    alert("💬 Connecting to Clinical Hub... You are position 1 in queue.");
  };

  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const handleAddPayment = () => {
    setIsAddingPayment(true);
    setTimeout(() => {
      setIsAddingPayment(false);
      alert("💳 Secondary Payment Protocol Authenticated.");
    }, 1500);
  };

  const [isNotificationActive, setIsNotificationActive] = useState(true);

  return (
    <div className="app-container">
      <div className="bg-mesh" />

      {/* Persistent Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-panel flex flex-col">
        {/* OLED Status Bar */}
        <div className="h-8 px-8 flex items-center justify-between border-b border-white/[0.03] bg-black/20">
          <div className="flex gap-4 items-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 flex items-center gap-1.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
              SYSTEM SECURE
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase">
             V2.4 • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="h-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(true)}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.button>
            <div 
              onClick={() => { setActivePersona('citizen'); setActiveSection(null); }}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Health Dispatch</h1>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none">Global Protocol v2.4</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsNotificationActive(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 relative hover:bg-white/10 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {isNotificationActive && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#030712]" />
              )}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setPersonaModalOpen(true)}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden hover:bg-white/10 transition-colors"
            >
              <User className="w-6 h-6 text-indigo-400" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content Feed */}
      <main className="feed-content">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-10 rounded-[3.5rem] bg-indigo-600 space-y-8 relative overflow-hidden shadow-2xl shadow-indigo-900/40 group"
        >
          <div className="glow" style={{ top: '-20%', right: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-3">
              <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.3em]">Operational Portal</p>
              <h3 className="text-4xl font-black leading-[1.1] text-white">Welcome back,<br />Zanele.</h3>
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                   <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                     {personaOptions.find(p => p.id === activePersona)?.label || 'Authorized'}
                   </p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-[2rem] border border-white/20">
               <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.section>

        {/* Dynamic Content View */}
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <motion.div 
               key="status-terminal"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-6"
            >
              <div className="p-10 rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Activity className="w-6 h-6 text-indigo-500/40" />
                </div>
                
                <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-600/20">
                  <ShieldCheck className="w-12 h-12 text-indigo-400" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Ending Healthcare Queues<br /><span className="text-indigo-400">Through Direct Delivery</span></h3>
                  <p className="text-slate-500 text-sm max-w-[400px] mx-auto leading-relaxed">
                    A national infrastructure project designed to reduce lines at public healthcare facilities. Clinics are for checkups; prescriptions are for home delivery.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMenuOpen(true)}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-colors"
                >
                  Launch Service Portal
                </motion.button>
              </div>

              {/* Mandate & Quick Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">National Mandate</p>
                  </div>
                  <h4 className="text-xl font-bold text-white">Queue Reduction Target</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Our mandate is to remove 2 million daily visits from outpatient clinics, freeing up clinical space for critical care and emergencies.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`section-${activePersona}-${activeSection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* CITIZEN VIEWS */}
              {activePersona === 'citizen' && (
                <>
                  {activeSection === 'order' && (
                    <Section title="Order Medicines" subtitle="Request Service" icon={ShoppingCart}>
                       <div className="p-10 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                          <div className={`w-24 h-24 ${isUploading ? 'bg-indigo-500/20' : 'bg-indigo-500/10'} rounded-full flex items-center justify-center mx-auto`}>
                             {isUploading ? <Clock className="w-12 h-12 text-indigo-400" /> : <Scan className="w-12 h-12 text-indigo-400" />}
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-2xl font-bold">{isUploading ? 'Verifying Script' : 'Upload Prescription'}</h4>
                             <p className="text-slate-500">{isUploading ? 'Validating registry integrity...' : 'Scan or upload your physical script to start'}</p>
                          </div>
                          <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePrescriptionUpload}
                            disabled={isUploading}
                            className={`w-full py-6 ${isUploading ? 'bg-slate-800 pointer-events-none' : 'bg-indigo-600'} rounded-3xl font-bold shadow-2xl transition-colors`}
                          >
                            {isUploading ? 'Processing...' : 'Select File'}
                          </motion.button>
                       </div>
                    </Section>
                  )}
                  {activeSection === 'track' && (
                    <Section title="Live Tracking" subtitle="Real-time Dispatch" icon={MapPin} accent="emerald">
                       <div className="space-y-6">
                        <div className="h-96 rounded-[3rem] overflow-hidden border border-white/5 relative">
                            <MapContainer center={INITIAL_DRIVER_COORDS} zoom={14} className="h-full w-full"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Marker position={driverPos} icon={L.divIcon({html: '<div class="text-4xl">🚚</div>', className: 'marker-icon'})} /><Marker position={PATIENT_COORDS} icon={L.divIcon({html: '<div class="text-3xl">🏠</div>', className: 'marker-icon'})} /></MapContainer>
                            <div className="absolute top-6 right-6 z-[1000] glass-card px-6 py-4 rounded-3xl"><p className="text-[10px] font-black text-emerald-500 uppercase">Estimated</p><p className="text-xl font-bold">14 Mins</p></div>
                        </div>
                       </div>
                    </Section>
                  )}
                  {activeSection === 'history' && (
                    <Section title="Prescriptions" subtitle="Integrity Audit" icon={History} accent="blue">
                      <div className="space-y-4">
                        {[{ name: "Metformin 500mg", batch: "BATCH-882", date: "12 Dec 2025" }, { name: "Amlodipine 5mg", batch: "BATCH-441", date: "15 Nov 2025" }].map((med, i) => (
                          <div key={i} className="p-6 glass-card rounded-3xl flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-400">{med.name[0]}</div><div><p className="font-bold text-lg">{med.name}</p><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{med.batch} • {med.date}</p></div></div><ChevronRight className="w-6 h-6 text-slate-700" /></div>
                        ))}
                      </div>
                    </Section>
                  )}
                  {activeSection === 'payment' && (
                    <Section title="Security Cloud" subtitle="Finance Audit" icon={CreditCard} accent="amber">
                       <div className="space-y-6">
                        <div className="p-8 rounded-[3rem] bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
                           <div className="relative z-10 flex flex-col justify-between h-40">
                              <CreditCard className="w-10 h-10 text-white/40" />
                              <div>
                                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Primary Wallet</p>
                                 <p className="text-2xl font-bold text-white tracking-[0.2em]">**** **** 4402</p>
                              </div>
                           </div>
                        </div>
                         <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddPayment}
                            className={`w-full py-6 glass-card rounded-3xl font-bold flex items-center justify-center gap-3 transition-opacity ${isAddingPayment ? 'opacity-50 pointer-events-none' : ''}`}
                         >
                            {isAddingPayment ? <Clock className="w-5 h-5 animate-spin" /> : <Bell className="w-5 h-5 text-amber-500" />}
                            {isAddingPayment ? 'Authenticating...' : 'Add Payment Method'}
                         </motion.button>
                       </div>
                    </Section>
                  )}
                </>
              )}

              {/* PHARMACIST VIEWS */}
              {activePersona === 'pharmacist' && (
                <>
                  {activeSection === 'inbox' && (
                    <Section title="Clinical Inbox" subtitle="Registry Audit" icon={Bell} accent="amber">
                      <div className="space-y-4">
                        {[{ id: 'SCR-9921', name: 'Zanele Khumalo', med: 'Metformin', accuracy: '98%' }].map((scr, i) => (
                           <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                              <div className="flex justify-between items-start">
                                 <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-white">{scr.name[0]}</div>
                                    <div className="text-white"><p className="font-bold">{scr.name}</p><p className="text-xs text-slate-500 font-mono">{scr.id}</p></div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-emerald-500 font-black uppercase">Accuracy</p>
                                    <p className="text-lg font-mono font-bold text-white">{scr.accuracy}</p>
                                 </div>
                              </div>
                              <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setVerifyingOrder(scr)} 
                                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm border border-white/5 transition-colors text-white"
                              >
                                Verify Clinical Integrity
                              </motion.button>
                           </div>
                        ))}
                      </div>
                    </Section>
                  )}
                  {activeSection === 'inventory' && (
                    <Section title="Inventory Control" subtitle="National Stock" icon={Package} accent="emerald">
                      <div className="grid grid-cols-2 gap-4">
                        {[{ label: 'Metformin', count: '1.2M' }, { label: 'Insulin', count: '150k' }].map((item, i) => (
                          <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{item.label}</p><p className="text-2xl font-bold text-white">{item.count}</p></div>
                        ))}
                      </div>
                    </Section>
                  )}
                  {activeSection === 'verification' && (
                    <Section title="Biometric Audit" subtitle="Compliance Ledger" icon={ShieldCheck} accent="indigo">
                      <div className="space-y-6">
                         <div className="p-8 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20 text-center space-y-4">
                            <ShieldCheck className="w-16 h-16 text-indigo-400 mx-auto" />
                            <h4 className="text-xl font-bold">Registry Integrity Active</h4>
                            <p className="text-sm text-slate-400">All scripts are cross-referenced with the DHA national biometric database.</p>
                         </div>
                         <div className="space-y-3">
                           {['Audit #882 - Clean', 'Audit #881 - Clean'].map((a, i) => (
                             <div key={i} className="p-4 glass-card rounded-2xl flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                               <span>{a}</span>
                               <span className="text-emerald-500 text-[10px]">Verified</span>
                             </div>
                           ))}
                         </div>
                      </div>
                    </Section>
                  )}
                </>
              )}

              {/* DRIVER VIEWS */}
              {activePersona === 'driver' && (
                <>
                  {activeSection === 'mission' && (
                    <Section title="Active Mission" subtitle="Vehicle ID: DH-X1" icon={Truck} accent="blue">
                      <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/5">
                         <div className="flex justify-between items-center text-white">
                            <div>
                               <p className="text-xs text-slate-500 font-bold uppercase">Recipient</p>
                               <h4 className="text-2xl font-bold">Zanele Khumalo</h4>
                            </div>
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                               <MapPin className="w-7 h-7 text-white" />
                            </div>
                         </div>
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleHandoff}
                            className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-colors text-sm uppercase tracking-widest"
                          >
                            Verify Handoff
                          </motion.button>
                      </div>
                    </Section>
                  )}
                </>
              )}

              {/* ADMIN VIEWS */}
              {activePersona === 'admin' && (
                <>
                  {activeSection === 'hub' && (
                    <Section title="National Hub" subtitle="Logistics Core" icon={Activity} accent="indigo">
                      <div className="grid gap-4">
                        {[{ label: 'Active Couriers', val: '1,042' }, { label: 'Queue Reduction', val: '24%' }].map((stat, i) => (
                          <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex justify-between items-center"><div><p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p><p className="text-3xl font-bold text-white">{stat.val}</p></div></div>
                        ))}
                      </div>
                    </Section>
                  )}
                  {activeSection === 'reports' && (
                    <Section title="Logistics Audit" subtitle="Performance Metrics" icon={Package} accent="amber">
                       <div className="space-y-4">
                          {[
                            { label: 'Delivery Time (Avg)', val: '18 min', trend: '-12%' },
                            { label: 'Patient Satisfaction', val: '99.2%', trend: '+4%' }
                          ].map((r, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-[2rem] flex justify-between items-center">
                               <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">{r.label}</p>
                                  <p className="text-2xl font-bold">{r.val}</p>
                                </div>
                               <div className={`px-3 py-1 rounded-full text-[10px] font-black ${r.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                  {r.trend}
                               </div>
                            </div>
                          ))}
                       </div>
                    </Section>
                  )}
                </>
              )}

              {/* AI TOOLS VIEWS */}
              {activePersona === 'tools' && (
                <>
                  {activeSection === 'ai_diagnosis' && (
                    <Section title="AI Clinical Intelligence" subtitle="Neural Framework" icon={ShieldCheck} accent="indigo">
                       <div className="space-y-6">
                          <div className="p-8 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20">
                             <h4 className="text-lg font-bold mb-4">Patient Risk Validation</h4>
                             <textarea 
                               placeholder="Paste clinical report (Symptoms, Dosage, History)..."
                               className="w-full h-40 bg-slate-950 border border-white/10 rounded-2xl p-6 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                             />
                             
                             {!aiResult && (
                               <motion.button 
                                 whileTap={{ scale: 0.98 }}
                                 disabled={isAnalyzing}
                                 className={`w-full py-5 mt-4 ${isAnalyzing ? 'bg-slate-800' : 'bg-indigo-600'} rounded-2xl font-bold flex items-center justify-center gap-3`}
                                 onClick={() => {
                                   setIsAnalyzing(true);
                                   setTimeout(() => {
                                      setAiResult({
                                        risk: 'Low-Moderate',
                                        score: '0.24',
                                        sentiment: 'Stable',
                                        protocol: 'B2-Standard'
                                      });
                                      setIsAnalyzing(false);
                                   }, 2500);
                                 }}
                               >
                                 {isAnalyzing ? (
                                   <>
                                     <Activity className="w-5 h-5 animate-pulse" />
                                     <span>Analyzing Neural Patterns...</span>
                                   </>
                                 ) : (
                                   <>
                                     <Scan className="w-5 h-5 text-indigo-200" />
                                     <span>Run Risk Validation</span>
                                   </>
                                 )}
                               </motion.button>
                             )}

                             {aiResult && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="mt-6 p-6 bg-slate-900 rounded-2xl border border-indigo-500/30 space-y-4"
                               >
                                  <div className="flex justify-between items-center">
                                     <p className="text-[10px] font-black text-indigo-400 uppercase">Analysis Complete</p>
                                     <button onClick={() => setAiResult(null)} className="text-[10px] text-slate-500 hover:text-white font-bold uppercase transition-colors">Clear Result</button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Risk Factor</p>
                                        <p className="text-xl font-black text-emerald-400">{aiResult.risk}</p>
                                     </div>
                                     <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Neural Score</p>
                                        <p className="text-xl font-black text-white">{aiResult.score}</p>
                                     </div>
                                  </div>
                                  <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/10">
                                     <p className="text-[10px] font-bold text-indigo-400 mb-1 italic">Suggested Protocol:</p>
                                     <p className="text-sm font-bold text-slate-300">"Validated for home delivery. No immediate clinical intervention required. Proceed with {aiResult.protocol}."</p>
                                  </div>
                               </motion.div>
                             )}
                          </div>
                          <div className="px-6 py-4 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5">
                             <Info className="w-5 h-5 text-slate-500" />
                             <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">This tool uses a fine-tuned Hugging Face transformer model to evaluate patient reports for risk flags before logistics authorization.</p>
                          </div>
                       </div>
                    </Section>
                  )}
                  {activeSection === 'logistics_ai' && (
                    <Section title="Predictive Logistics" subtitle="Neural Route Map" icon={MapPin} accent="emerald">
                       <div className="p-10 border border-emerald-500/10 rounded-[2.5rem] bg-emerald-500/5 space-y-4">
                          <div className="flex justify-between items-center text-white">
                             <p className="text-sm font-bold">Traffic Optimization</p>
                             <span className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black">94% EFFICIENCY</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[94%]" />
                          </div>
                          <p className="text-xs text-slate-500">Logistics AI is reducing patient wait times by an average of 12.4 minutes in high-density areas.</p>
                       </div>
                     </Section>
                   )}
                  {activeSection === 'drug_interaction' && (
                    <Section title="Drug Interaction AI" subtitle="Clinical Safety Protocol" icon={ShieldCheck} accent="rose">
                       <div className="p-8 border border-rose-500/10 rounded-[2.5rem] bg-rose-500/5 space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-white">
                             <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-rose-400 font-bold mb-1">DRUG A</p>
                                <p className="font-bold">Warfarin</p>
                             </div>
                             <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-rose-400 font-bold mb-1">DRUG B</p>
                                <p className="font-bold">Aspirin</p>
                             </div>
                          </div>
                          <div className="p-6 bg-rose-500/20 rounded-2xl border border-rose-500/30 flex items-center gap-4 text-rose-100">
                             <AlertCircle className="w-8 h-8 flex-shrink-0" />
                             <p className="text-xs font-medium italic">"High Risk: Concurrent use may significantly increase bleeding risk via synergistic anti-hemostatic activity."</p>
                          </div>
                       </div>
                    </Section>
                  )}
                </>
              )}
              <div className="h-32" />

                <motion.button
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setActiveSection(null)}
                 className="w-full py-6 mt-4 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 font-bold hover:bg-white/5 transition-colors"
               >
                 Back to Dashboard
               </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Hub - Universal bottom section */}
        <div onClick={handleSupportChat} className="cursor-pointer group">
          <Section title="Help & Support" subtitle="National Response" icon={HelpCircle}>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-6 group-hover:bg-white/10 transition-colors">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center transition-colors">
                    <Bell className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div>
                    <p className="font-bold group-hover:text-indigo-400 transition-colors">Live Clinical Chat</p>
                    <p className="text-xs text-slate-500">Average wait time: 2 mins</p>
                 </div>
                 <ChevronRight className="ml-auto w-6 h-6 text-slate-700 transition-colors opacity-40 group-hover:opacity-100" />
              </div>
          </Section>
        </div>
      </main>

      {/* Floating Action Navigation */}
       <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-4xl glass-panel h-20 rounded-[2.5rem] flex items-center justify-around px-8 shadow-2xl border border-white/10">
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveSection(null)} className={`p-4 rounded-2xl transition-colors ${!activeSection ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
           <ShoppingCart className="w-6 h-6" />
         </motion.button>
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActivePersona('tools')} className={`p-4 rounded-2xl transition-colors ${activePersona === 'tools' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
           <Activity className="w-6 h-6" />
         </motion.button>
         
         {/* Mobile Scan FAB Trigger */}
         <motion.button 
           whileTap={{ scale: 0.85 }}
           onClick={handleScan}
           className="w-16 h-16 -mt-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 border-4 border-[#030712] transition-transform"
         >
           <Scan className="w-8 h-8 text-white" />
         </motion.button>
 
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveSection('track')} className={`p-4 rounded-2xl transition-colors ${activeSection === 'track' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
            <Search className="w-6 h-6" />
         </motion.button>
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPersonaModalOpen(true)} className="p-4 rounded-2xl text-slate-500">
            <Menu className="w-6 h-6" />
         </motion.button>
       </nav>

      {/* Identity Switcher Bottom Sheet */}
      <AnimatePresence>
        {isPersonaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-3xl flex items-end sm:items-center justify-center px-4"
          >
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 rounded-[3.5rem] p-10 pb-14 space-y-10 border border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                   <h2 className="text-3xl font-black tracking-tight">Access Level</h2>
                   <p className="text-slate-500 text-sm font-medium">Verify credentials for secure handover.</p>
                 </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPersonaModalOpen(false)} 
                    className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center font-bold text-2xl hover:bg-white/10 transition-colors"
                  >
                    ×
                  </motion.button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {personaOptions.map(p => (
                  <motion.button 
                    key={p.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handlePersonaChange(p.id)}
                    className={`flex items-center gap-6 p-8 rounded-[2.5rem] transition-colors border group ${activePersona === p.id ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`p-5 rounded-[2rem] transition-colors ${activePersona === p.id ? 'bg-white/20' : 'bg-white/5'}`}>
                      <p.icon className={`w-8 h-8 ${activePersona === p.id ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                       <p className={`font-bold text-xl ${activePersona === p.id ? 'text-white' : 'text-slate-200'}`}>{p.label}</p>
                       <p className={`text-sm ${activePersona === p.id ? 'text-indigo-100/70' : 'text-slate-500'}`}>{p.desc}</p>
                    </div>
                    {activePersona === p.id && (
                       <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_15px_#fff]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal (Pharmacist) */}
      <AnimatePresence>
        {verifyingOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6">
             <div className="w-full max-w-xl glass-card rounded-[3.5rem] p-12 space-y-10 relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)]">
                <div className="glow" style={{ top: '-10%', right: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%)' }} />
                
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Biometric Audit Protocol 7</p>
                      </div>
                      <h3 className="text-4xl font-black text-white">Clinical Verification</h3>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4 relative z-10">
                   <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Patient Identity</p>
                      <p className="text-2xl font-bold text-white tracking-tight">{verifyingOrder.name}</p>
                   </div>
                   <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Prescribed Compound</p>
                      <p className="text-2xl font-bold text-indigo-400 tracking-tight">{verifyingOrder.med}</p>
                   </div>
                </div>

                 <div className="flex gap-4 relative z-10 pt-4">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVerifyingOrder(null)} 
                      className="flex-1 py-6 bg-white/5 rounded-3xl font-black text-sm uppercase tracking-widest text-slate-400 border border-white/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-colors"
                    >
                      Reject
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                         alert("✅ Registry Integrity Validated. Dispensing sequence initialized.");
                         setVerifyingOrder(null);
                      }} 
                      className="flex-1 py-6 bg-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest text-white shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-colors"
                    >
                      Authorize
                    </motion.button>
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScanning && <ScanningOverlay />}
      </AnimatePresence>
      {/* Navigation Sidebar Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm z-[600] bg-[#0d121f] border-r border-white/5 shadow-3xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white leading-none">Health</h2>
                    <h2 className="text-2xl font-black tracking-tight text-indigo-400">Dispatch</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-500"
                >
                  <LogOut className="w-6 h-6 rotate-180" />
                </button>
              </div>

              {/* Mandate Box */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 mb-8">
                <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">MANDATE:</p>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Delivering chronic medication to reduced hospital lines.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* 3-Step Clinical Protocol Bundle */}
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Clinical Protocol</p>
                    <h4 className="text-sm font-bold text-white">Service Bundle v2.0</h4>
                  </div>

                  <div className="space-y-2 relative">
                    <div className="absolute left-5 top-5 bottom-5 w-[1px] bg-white/10" />
                    
                    {[
                      { id: 'order', label: 'Order Meds', step: '01', icon: ShoppingCart, color: 'indigo' },
                      { id: 'track', label: 'Track Delivery', step: '02', icon: MapPin, color: 'emerald' },
                      { id: 'history', label: 'My Prescriptions', step: '03', icon: History, color: 'blue' }
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => { setActiveSection(item.id); setIsMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative z-10 ${activeSection === item.id ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] border transition-all ${activeSection === item.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                          {item.step}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-bold tracking-tight ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`}>{item.label}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Secure Protocol</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Tools */}
                <div className="space-y-2 pt-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 mb-2">Authorized Tools</p>
                  {[
                    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
                    { id: 'support', label: 'Clinical Support', icon: HelpCircle }
                  ].map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => tool.id === 'support' ? handleSupportChat() : setActiveSection(tool.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <tool.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-bold text-xs tracking-tight">{tool.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Access Authority</p>
                  {personaOptions.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => { handlePersonaChange(p.id); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${activePersona === p.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      <p.icon className="w-4 h-4" />
                      <span className="font-bold text-[10px] uppercase tracking-widest">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default App;
