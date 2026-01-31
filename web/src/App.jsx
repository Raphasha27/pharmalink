import React, { useState, useEffect } from 'react'
import { 
  Pill, 
  Truck, 
  MessageSquare, 
  Home, 
  PlusCircle, 
  User, 
  History,
  Activity,
  ChevronRight,
  Clock,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PrescriptionCard = ({ name, status, subtext, actionLabel, actionColor, onClick }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between space-x-4 mb-3"
  >
    <div className="space-y-1">
      <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
        {name} <span className="text-sm font-normal text-gray-400">({status})</span>
      </h4>
      <p className="text-gray-400 text-sm">{subtext}</p>
    </div>
    <button 
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-bold text-sm ${actionColor} text-white transition-opacity hover:opacity-90`}
    >
      {actionLabel}
    </button>
  </motion.div>
)

const OrderItem = ({ name, date, status, statusColor }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between mb-3"
  >
    <div className="space-y-1">
      <h4 className="font-bold text-gray-900">
        {name} <span className="text-sm font-normal text-gray-400">- Delivered {date}</span>
      </h4>
      <p className="text-gray-400 text-sm">Shipped</p>
    </div>
    <div className={`px-5 py-1.5 rounded-full ${statusColor} text-sm font-bold bg-opacity-20`}>
       {status}
    </div>
  </motion.div>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeView, setActiveView] = useState('dashboard');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Data State
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, oRes, mRes, phRes] = await Promise.all([
          fetch(`${API_BASE}/prescriptions`),
          fetch(`${API_BASE}/orders`),
          fetch(`${API_BASE}/messages`),
          fetch(`${API_BASE}/pharmacies`)
        ]);
        
        setPrescriptions(await pRes.json());
        setOrders(await oRes.json());
        setMessages(await mRes.json());
        setPharmacies(await phRes.json());
      } catch (err) {
        console.error("Clinical Data Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshPrescriptions = async () => {
    const res = await fetch(`${API_BASE}/prescriptions`);
    setPrescriptions(await res.json());
  };

  // View Components
  const DashboardView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      <div className="bg-pharma-green p-8 rounded-[3rem] text-white flex gap-6 items-center shadow-2xl shadow-green-100 relative overflow-hidden group">
         <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
         <ShieldCheck className="w-12 h-12 flex-shrink-0" />
         <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-80">National Health Protocol</p>
            <p className="text-lg font-bold leading-tight max-w-2xl">Your NHI coverage is active. All chronic refills and direct deliveries are 100% subsidized at this facility.</p>
         </div>
      </div>

      <h2 className="text-5xl font-black text-gray-900 leading-[1.1] md:max-w-xl mt-0 tracking-tight">
        Welcome to your <br />National Pharmacy Hub
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Your Prescriptions</h3>
          {prescriptions.filter(p => p.type === "Refill RX").map(p => (
            <PrescriptionCard 
              key={p.id}
              name={p.name} 
              status={p.status} 
              subtext={p.subtext}
              actionLabel={p.type}
              actionColor={p.color}
              onClick={() => setActiveView('refill')}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Software Status</h3>
          {prescriptions.filter(p => p.type === "Set Reminder").map(p => (
            <PrescriptionCard 
              key={p.id}
              name={p.name} 
              status={p.status} 
              subtext={p.subtext}
              actionLabel={p.type}
              actionColor={p.color}
              onClick={() => {
                alert(`Clinical Reminder Set: You will be notified 48 hours before your next dose of ${p.name} is due.`);
              }}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Live Order History</h3>
          {orders.map(o => (
            <OrderItem 
              key={o.id}
              name={o.name} 
              date={o.date} 
              status={o.status}
              statusColor={o.statusColor}
            />
          ))}
        </section>
      </div>
    </motion.div>
  );

  const RefillView = () => {
    const [status, setStatus] = useState('idle');

    const handleRequest = async (id) => {
      setStatus('requesting');
      try {
        const res = await fetch(`${API_BASE}/refill/${id}`, { method: 'POST' });
        if (res.ok) {
          setStatus('success');
          await refreshPrescriptions();
          setTimeout(() => setActiveView('tracking'), 4000);
        } else {
          alert("Refill limit reached for this protocol.");
          setStatus('idle');
        }
      } catch (err) {
        setStatus('idle');
      }
    };

    if (status === 'success') return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-6">
         <div className="w-24 h-24 bg-pharma-green rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
            <ShieldCheck className="w-12 h-12 text-white" />
         </div>
         <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900">Request Confirmed</h3>
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Dispatching your medication from Sandton Medical Hub now.</p>
         </div>
         <div className="flex gap-2">
            <div className="w-2 h-2 bg-pharma-green rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-pharma-green rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-pharma-green rounded-full animate-bounce [animation-delay:0.4s]" />
         </div>
      </motion.div>
    );

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900">Refill Hub</h2>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
            <Clock className="text-pharma-green w-6 h-6" />
            <div>
              <p className="font-bold text-gray-900 leading-tight">Fast-Track Refill</p>
              <p className="text-xs text-gray-500">Available for Active Protocols</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Prescription</p>
            {prescriptions.filter(p => p.type === "Refill RX").map((med) => (
              <button 
                key={med.id} 
                onClick={() => handleRequest(med.id)}
                disabled={status !== 'idle'}
                className="w-full text-left p-5 rounded-3xl border border-gray-100 hover:border-pharma-green transition-colors flex justify-between items-center group disabled:opacity-50"
              >
                <div>
                  <span className="font-bold text-gray-700 block">{med.name}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{med.refillsLeft} Refills Available</span>
                </div>
                <PlusCircle className="text-gray-300 group-hover:text-pharma-green w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const TrackingView = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">Live Delivery</h2>
      <div className="h-64 bg-gray-200 rounded-[2.5rem] relative overflow-hidden mb-6 flex items-center justify-center border-4 border-white shadow-inner">
         <div className="text-pharma-green font-black text-center">
            <Truck className="w-12 h-12 mx-auto mb-2 animate-bounce" />
            <p>Scanning Logistics Network...</p>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none" />
      </div>
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-6 h-6 rounded-full bg-pharma-green mt-1 flex-shrink-0" />
          <div>
            <p className="font-black text-gray-900">Dispatcher Assigned</p>
            <p className="text-sm text-gray-500">Route optimized for fuel efficiency</p>
          </div>
        </div>
        <div className="flex gap-4 items-start opacity-40">
          <div className="w-6 h-6 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
          <div>
            <p className="font-black text-gray-900">In Transit</p>
            <p className="text-sm text-gray-500">Dispatching from central hub</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const MessagesView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900">Messages</h2>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
           <div className="w-2 h-2 bg-pharma-green rounded-full pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {messages.map(( chat ) => (
          <div key={chat.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex gap-4 items-center">
             <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center font-black text-pharma-green">{chat.from[0]}</div>
             <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                   <p className="font-bold text-gray-900">{chat.from}</p>
                   <p className="text-[10px] text-gray-400 font-bold">{chat.time}</p>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{chat.msg}</p>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const PharmacyView = () => {
    const [search, setSearch] = useState('');
    const filtered = pharmacies.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900">National Pharmacy Network</h2>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-600 uppercase">Registry Live</span>
          </div>
        </div>
        <div className="relative max-w-2xl">
           <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search national medical hubs by city or name..." 
              className="w-full py-6 px-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 focus:outline-none focus:border-pharma-green font-bold text-base" 
           />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-0">
           {filtered.map((name, i) => (
             <motion.div 
               key={i} 
               whileHover={{ scale: 1.02 }}
               className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-pharma-green hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer"
             >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center font-black text-pharma-green text-xl">{name[0]}</div>
                   <p className="font-bold text-gray-800 text-lg leading-tight">{name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-pharma-green/10 flex items-center justify-center">
                   <ChevronRight className="w-5 h-5 text-pharma-green group-hover:translate-x-1 transition-transform" />
                </div>
             </motion.div>
           ))}
           {filtered.length === 0 && (
             <div className="col-span-full py-20 text-center opacity-40">
                <LayoutGrid className="w-16 h-16 mx-auto mb-4" />
                <p className="font-black text-xl italic tracking-widest uppercase">No clinical hubs detected</p>
             </div>
           )}
        </div>
      </motion.div>
    );
  };

  const ProfileView = () => {
    const [subView, setSubView] = useState('menu');

    if (subView === 'history') return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
         <button onClick={() => setSubView('menu')} className="text-xs font-bold text-pharma-green mb-6 flex items-center gap-2">← Back to Settings</button>
         <h3 className="text-2xl font-black text-gray-900 mb-6">Treatment History</h3>
         <div className="space-y-4">
            {['Dec 2025 - Routine Checkup', 'Oct 2025 - Prescription Issue', 'Aug 2025 - Lab Results'].map((log, i) => (
               <div key={i} className="p-6 bg-white rounded-[2rem] border border-gray-100">
                  <p className="font-bold text-gray-900">{log}</p>
                  <p className="text-xs text-gray-400 mt-1">Status: Archived</p>
               </div>
            ))}
         </div>
      </motion.div>
    );

    if (subView === 'verify') return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
         <button onClick={() => setSubView('menu')} className="text-xs font-bold text-pharma-green mb-6 flex items-center gap-2">← Back to Settings</button>
         <h3 className="text-2xl font-black text-gray-900 mb-6">Identity Verification</h3>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
               <ShieldCheck className="w-10 h-10 text-pharma-green" />
            </div>
            <div>
               <p className="font-bold text-gray-900 text-lg">Verified Account</p>
               <p className="text-sm text-gray-500">Your biometric and NHI data are successfully linked.</p>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-between text-xs font-bold text-gray-400">
               <span>NHI REGISTRY</span>
               <span className="text-pharma-green">LINKED</span>
            </div>
         </div>
      </motion.div>
    );

    if (subView === 'payment') return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
         <button onClick={() => setSubView('menu')} className="text-xs font-bold text-pharma-green mb-6 flex items-center gap-2">← Back to Settings</button>
         <h3 className="text-2xl font-black text-gray-900 mb-6">Payment Methods</h3>
         <div className="space-y-4">
            <div className="p-6 bg-pharma-accent text-white rounded-[2rem] shadow-xl shadow-green-900/10 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Primary Card</p>
                  <p className="font-bold text-lg leading-none mt-1">•••• 8821</p>
               </div>
               <CreditCard className="w-8 h-8 opacity-40" />
            </div>
            <button className="w-full p-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold text-sm hover:bg-gray-50 transition-colors">
               + Add New Method
            </button>
         </div>
      </motion.div>
    );

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex flex-col items-center">
           <div className="w-24 h-24 bg-pharma-green rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center mb-2">
              <User className="w-12 h-12 text-white" />
           </div>
           <h3 className="text-xl font-black text-gray-900 leading-tight">{user?.name || 'Authorized Member'}</h3>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">NHI Registry: #{user?.id || 'PENDING'}</p>
        </div>
        <div className="space-y-2">
           <button onClick={() => setSubView('verify')} className="w-full p-5 bg-white rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:border-pharma-green transition-all">
              <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-pharma-green transition-colors" />
              <span className="font-bold text-gray-700 text-sm">Identity Verification</span>
              <ChevronRight className="ml-auto w-4 h-4 text-gray-300" />
           </button>
           <button onClick={() => setSubView('history')} className="w-full p-5 bg-white rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:border-pharma-green transition-all">
              <History className="w-5 h-5 text-gray-400 group-hover:text-pharma-green transition-colors" />
              <span className="font-bold text-gray-700 text-sm">Treatment History</span>
              <ChevronRight className="ml-auto w-4 h-4 text-gray-300" />
           </button>
           <button onClick={() => setSubView('payment')} className="w-full p-5 bg-white rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:border-pharma-green transition-all">
              <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-pharma-green transition-colors" />
              <span className="font-bold text-gray-700 text-sm">Payment Methods</span>
              <ChevronRight className="ml-auto w-4 h-4 text-gray-300" />
           </button>
           <button 
             onClick={() => { setIsLoggedIn(false); setUser(null); setActiveView('dashboard'); }}
             className="w-full p-5 bg-red-50 rounded-[2rem] border border-red-100 flex items-center gap-6 group hover:bg-red-500 transition-all mt-4"
           >
              <Activity className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
              <span className="font-bold text-red-500 group-hover:text-white text-sm">Logout / End Session</span>
           </button>
        </div>
      </motion.div>
    );
  };

  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogin = (e) => {
      e.preventDefault();
      // Mock Authentication
      if (email === 'demo@pharmalink.com' && password === 'admin123') {
        setUser({ name: 'Zanele Khumalo', id: '882199', avatar: 'ZK' });
        setIsLoggedIn(true);
      } else {
        setIsError(true);
        setTimeout(() => setIsError(false), 2000);
      }
    };

    return (
      <div className="min-h-screen bg-pharma-accent flex items-center justify-center p-6 relative overflow-hidden">
        {/* Cinematic Background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pharma-green/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-pharma-green rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/20 mb-6">
              <Activity className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              PHARMA <span className="text-pharma-green">LINK</span>
            </h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Clinical Command Hub</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-4">Authorized ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@pharmalink.com"
                className="w-full py-5 px-8 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-pharma-green focus:bg-white/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-4">Secure Access Code</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-5 px-8 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-pharma-green focus:bg-white/10 transition-all"
              />
            </div>

            {isError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold text-center italic">
                Authentication failed. Invalid clinical credentials.
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-pharma-green text-white font-black rounded-full shadow-2xl shadow-green-500/20 hover:scale-[1.02] transition-transform active:scale-95 mt-4"
            >
              INITIALIZE PROTOCOL
            </button>
          </form>

          <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest mt-10">
            NHI Encrypted Access v2.04
          </p>
        </motion.div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginView />;

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans relative overflow-x-hidden">
      <div className="bg-[#f7f8fa] min-h-screen w-full max-w-[1600px] mx-auto">
        {/* Header & Command Center */}
        <header className={`px-8 md:px-12 pt-4 flex flex-col items-center sticky top-0 bg-[#f7f8fa]/80 backdrop-blur-xl z-[100] gap-4 ${activeView === 'dashboard' ? 'pb-4' : 'pb-2'}`}>
          <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-6">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveView('dashboard'); setActiveTab('home'); }}>
              <div className="w-10 h-10 bg-pharma-green rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <Activity className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-pharma-accent tracking-tighter uppercase flex items-center gap-1 leading-none">
                  PHARMA <span className="text-pharma-green">LINK</span>
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">BUSINESS PROTOCOL</p>
              </div>
            </div>

            {/* Top Navigation Hub */}
            <nav className="h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white flex items-center justify-around px-4 shadow-sm w-full md:w-[400px]">
              {[
                { id: 'home', icon: Home, view: 'dashboard' },
                { id: 'pharmacy', icon: PlusCircle, view: 'pharmacy' },
                { id: 'messages', icon: MessageSquare, view: 'messages' },
                { id: 'profile', icon: User, view: 'profile' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setActiveView(tab.view); }} 
                  className={`p-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'text-white bg-pharma-green shadow-lg shadow-green-200' : 'text-gray-300 hover:text-gray-400'}`}
                >
                  <tab.icon className="w-6 h-6" />
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions (Dashboard Only) */}
          {activeView === 'dashboard' && (
            <div className="w-full md:w-auto self-end">
              <div className="flex gap-4 justify-center md:justify-end">
                {[
                  { id: 'refill', icon: Pill, label: 'Refill' },
                  { id: 'tracking', icon: Truck, label: 'Track' },
                ].map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => setActiveView(action.id)} 
                    className="px-6 py-2 rounded-full border border-gray-100 bg-white flex items-center gap-2 group hover:bg-pharma-green hover:border-pharma-green transition-all shadow-sm"
                  >
                    <action.icon className="w-4 h-4 text-pharma-green group-hover:text-white" />
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Global Back Link (Non-Dashboard Views) */}
        {activeView !== 'dashboard' && (
          <div className="px-8 md:px-12 pt-4">
            <button 
              onClick={() => { setActiveView('dashboard'); setActiveTab('home'); }}
              className="px-6 py-3 bg-white rounded-full text-sm font-black text-pharma-green border border-gray-100 shadow-xl shadow-gray-200/20 flex items-center gap-3 transition-transform hover:-translate-x-1"
            >
              ← Back to Command Center
            </button>
          </div>
        )}

        {/* Dynamic Content */}
        <main className="px-8 md:px-12 pt-4 pb-20">
          {loading ? (
             <div className="flex items-center justify-center py-40">
                <div className="w-12 h-12 border-4 border-pharma-green border-t-transparent rounded-full animate-spin" />
             </div>
          ) : (
            <AnimatePresence mode="wait">
               {activeView === 'dashboard' && <DashboardView key="dash" />}
               {activeView === 'refill' && <RefillView key="refill" />}
               {activeView === 'tracking' && <TrackingView key="track" />}
               {activeView === 'messages' && <MessagesView key="msg" />}
               {activeView === 'pharmacy' && <PharmacyView key="pharm" />}
               {activeView === 'profile' && <ProfileView key="prof" />}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}

const CreditCard = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)
