import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// INLINE CUSTOM GEOMETRIC SVG ICONS (Ensures compile safety & zero-dependency)
// ============================================================================

const Icons = {
  Logo: () => (
    <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gear-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1D37" />
          <stop offset="100%" stopColor="#1E3B8B" />
        </linearGradient>
        <linearGradient id="wave-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FA8F00" />
          <stop offset="100%" stopColor="#F96D00" />
        </linearGradient>
      </defs>
      {/* Outer Gear */}
      <circle cx="50" cy="50" r="30" stroke="url(#gear-blue)" strokeWidth="10" />
      {/* Gear teeth */}
      <path d="M50 5v12M50 83v12M5 50h12M83 50h12M18.2 18.2l8.5 8.5M73.3 73.3l8.5 8.5M18.2 81.8l8.5-8.5M73.3 26.7l8.5-8.5" stroke="url(#gear-blue)" strokeWidth="8" strokeLinecap="round" />
      {/* Inner Wave/Flow Circle */}
      <circle cx="50" cy="50" r="18" fill="white" />
      <path d="M38 52c3-4 6-4 9 0s6 4 9 0 6-4 9 0" stroke="url(#wave-orange)" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 45c3-4 6-4 9 0s6 4 9 0 6-4 9 0" stroke="url(#wave-orange)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  Asset: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="none" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  ),
  Wrench: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Chart: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M3 20h18" />
    </svg>
  ),
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  RFID: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Refresh: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  ),
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  WifiOff: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.5" />
      <path d="M5 12.5a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  Terminal: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Cpu: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  Server: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Globe: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
};

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

interface AssetWorkOrder {
  id: string;
  orderNumber: string;
  assetName: string;
  type: 'Preventive' | 'Corrective' | 'Safety';
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  timestamp: string;
}

const INITIAL_WORK_ORDERS: AssetWorkOrder[] = [
  { id: '1', orderNumber: 'WO-2940', assetName: 'Subsea Blowout Preventer A-1', type: 'Preventive', status: 'In Progress', priority: 'Critical', assignedTo: 'M. Harris (SRE)', timestamp: '10:42' },
  { id: '2', orderNumber: 'WO-2941', assetName: 'Mud Pump Reciprocator #4B', type: 'Corrective', status: 'Open', priority: 'High', assignedTo: 'T. Vance (Tech)', timestamp: '11:15' },
  { id: '3', orderNumber: 'WO-2942', assetName: 'Main Power Gen Generator B', type: 'Preventive', status: 'Closed', priority: 'Medium', assignedTo: 'R. Patel (SRE)', timestamp: '09:00' },
  { id: '4', orderNumber: 'WO-2943', assetName: 'ATEX Telemetry Antenna Deck', type: 'Safety', status: 'Open', priority: 'High', assignedTo: 'J. Doe (Safety)', timestamp: '11:38' }
];

const API_PLAYGROUND_ROUTES = [
  {
    method: 'GET',
    path: '/v1/assets/summary',
    description: 'Fetch complete asset health metrics, locations, and documentation status.',
    response: {
      status: 'success',
      node_id: 'gulf-production-core',
      tracked_assets: 1402,
      critical_assets: 38,
      average_health_index: '98.6%',
      unscheduled_downtime_hours: 0,
      active_preventive_schedules: 24
    }
  },
  {
    method: 'POST',
    path: '/v1/work-orders/dispatch',
    description: 'Create, prioritize, and dispatch an automated preventive work order to field teams.',
    response: {
      action: 'dispatched',
      work_order: 'WO-2944',
      status: 'Open',
      assigned_team: 'Offshore Maintenance Delta',
      due_timestamp: '2026-05-22T20:00:00Z',
      compliance_checked: true,
      sqlite_wal_committed: true
    }
  },
  {
    method: 'GET',
    path: '/v1/reports/insights',
    description: 'Retrieve real-time dashboards on downtime analysis, cost-reductions, and compliance.',
    response: {
      period: 'last_30_days',
      downtime_costs_saved_usd: 84600,
      compliance_rate: '100%',
      resolved_issues: 142,
      average_resolution_time_mins: 42.5
    }
  }
];

export default function LandingPage() {
  // --- Hero Interactive Terminal State ---
  const [workOrders, setWorkOrders] = useState<AssetWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [isSimulatingOrders, setIsSimulatingOrders] = useState(true);
  const [totalWorkOrders, setTotalWorkOrders] = useState(142);
  const [efficiencyGraph, setEfficiencyGraph] = useState<number[]>([85, 87, 86, 90, 89, 93, 92, 95, 96, 98]);

  // --- Core Interactive Tab/Pillar Selection State ---
  const [activePillar, setActivePillar] = useState<'asset' | 'work_order' | 'preventive' | 'reports'>('asset');

  // --- Feature 1 (Asset Tracking Simulator) State ---
  const [selectedAssetId, setSelectedAssetId] = useState<string>('BOP-01');
  const [qrScannedCount, setQrScannedCount] = useState<number>(458);

  // --- Feature 2 (Work Order Status Drag/Toggle Demo) State ---
  const [woStatusDemo, setWoStatusDemo] = useState<'Open' | 'In Progress' | 'Closed'>('In Progress');

  // --- Feature 3 (Preventive Schedule Alert) State ---
  const [pmIntervalDays, setPmIntervalDays] = useState<number>(30);
  const [isSchedulingAlert, setIsSchedulingAlert] = useState<boolean>(false);
  const [lastPmAlertTime, setLastPmAlertTime] = useState<string>('08:00');

  // --- Feature 4 (Interactive Cost/Downtime Calculator) State ---
  const [hourlyDowntimeCost, setHourlyDowntimeCost] = useState<number>(5000);
  const [downtimeHoursReduced, setDowntimeHoursReduced] = useState<number>(12);

  // --- API playground state ---
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);

  // --- Edge Node Latency State ---
  const [stormActive, setStormActive] = useState<boolean>(false);
  const latencies = useMemo(() => {
    return {
      gulf: stormActive ? 142 : 12,
      northSea: stormActive ? 785 : 184,
      permian: stormActive ? 210 : 45
    };
  }, [stormActive]);

  // --- Lead gen form state ---
  const [email, setEmail] = useState<string>('');
  const [assetVolume, setAssetVolume] = useState<string>('1k_10k');
  const [environmentProfile, setEnvironmentProfile] = useState<string>('zone_1');
  const [formStep, setFormStep] = useState<'idle' | 'verifying' | 'allocating' | 'success'>('idle');

  // ============================================================================
  // SIDE EFFECTS (Simulated background dashboard activity)
  // ============================================================================

  // Simulating live work order log & telemetry stream
  useEffect(() => {
    if (!isSimulatingOrders) return;
    const interval = setInterval(() => {
      const assetNames = ['Subsea Blowout Preventer A-1', 'Mud Pump Reciprocator #4B', 'Main Power Gen Generator B', 'ATEX Telemetry Antenna Deck', 'Gas Compressor Valve #2', 'Emergency Flare Igniter'];
      const types: ('Preventive' | 'Corrective' | 'Safety')[] = ['Preventive', 'Corrective', 'Safety'];
      const statuses: ('Open' | 'In Progress' | 'Closed')[] = ['Open', 'In Progress', 'Closed'];
      const priorities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
      const technicians = ['M. Harris (SRE)', 'T. Vance (Tech)', 'R. Patel (SRE)', 'J. Doe (Safety)', 'S. Clark (Tech)'];

      const randomIdx = Math.floor(Math.random() * assetNames.length);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newOrder: AssetWorkOrder = {
        id: Math.random().toString(),
        orderNumber: `WO-${Math.floor(Math.random() * 1000 + 2000)}`,
        assetName: assetNames[randomIdx],
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: technicians[Math.floor(Math.random() * technicians.length)],
        timestamp: timeStr
      };

      setWorkOrders(prev => [newOrder, ...prev.slice(0, 3)]);
      setTotalWorkOrders(prev => prev + 1);

      setEfficiencyGraph(prev => {
        const nextVal = Math.max(80, Math.min(100, prev[prev.length - 1] + Math.floor(Math.random() * 5 - 2)));
        return [...prev.slice(1), nextVal];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingOrders]);

  const triggerScheduleAlert = () => {
    setIsSchedulingAlert(true);
    setTimeout(() => {
      const now = new Date();
      setLastPmAlertTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setIsSchedulingAlert(false);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setFormStep('verifying');
    setTimeout(() => {
      setFormStep('allocating');
      setTimeout(() => {
        setFormStep('success');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-navy-darkest text-slate-primary font-sans selection:bg-electric selection:text-white overflow-x-hidden relative">
      
      {/* ============================================================================
          CYBERNETIC BACKGROUND ELEMENTS & VIBRANT AMBIENT GLOWS
          ============================================================================ */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:35px_35px] opacity-100 pointer-events-none" />
      
      {/* Glowing Ambient Light Orbs (Highly premium, expensive designer aesthetic) */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-electric-indigo/12 blur-[130px] pointer-events-none" />
      <div className="absolute top-[15%] -right-40 w-[550px] h-[550px] rounded-full bg-electric-blue/18 blur-[120px] pointer-events-none" />
      <div className="absolute top-[45%] left-[20%] w-[450px] h-[450px] rounded-full bg-safety-orange/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[650px] h-[650px] rounded-full bg-electric/12 blur-[140px] pointer-events-none" />

      {/* ============================================================================
          NAVBAR / SYSTEM STATUS BAR
          ============================================================================ */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icons.Logo />
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-primary">IronFlow</span>
              <span className="text-[9px] font-mono tracking-widest text-electric font-bold uppercase -mt-0.5">SOFTWARES</span>
            </div>
          </div>

          {/* SRE Operational Beacon */}
          <div className="hidden md:flex items-center space-x-6 bg-slate-50/80 border border-slate-200 px-4 py-2 rounded font-mono text-xs shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-muted">NODE_04_GULF:</span>
              <span className="text-emerald-600 font-bold">ONLINE</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="text-slate-secondary">
              LATENCY: <span className="text-slate-primary font-bold">12ms</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="text-slate-secondary">
              SYNC_WAL: <span className="text-slate-primary font-bold">CONNECTED</span>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <a href="#features" className="hidden sm:inline-block text-xs font-mono font-bold text-slate-secondary hover:text-electric transition-colors uppercase tracking-wider">Features</a>
            <a href="#specs" className="hidden sm:inline-block text-xs font-mono font-bold text-slate-secondary hover:text-electric transition-colors uppercase tracking-wider">Specs</a>
            <a href="#api" className="hidden sm:inline-block text-xs font-mono font-bold text-slate-secondary hover:text-electric transition-colors uppercase tracking-wider">API</a>
            <a 
              href="#demo" 
              className="bg-gradient-to-r from-electric via-electric-indigo to-electric-blue text-white px-5 py-2.5 rounded font-display font-bold text-xs tracking-wider transition-all duration-300 shadow-neon-teal-intense hover:-translate-y-0.5 active:scale-[0.98]"
            >
              TRY LIVE DEMO
            </a>
          </nav>
        </div>
      </header>

      {/* ============================================================================
          HERO SECTION (High Utility, Premium CMMS Dashboard Layout)
          ============================================================================ */}
      <section className="relative pt-16 pb-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200/80 px-4 py-1.5 rounded-full text-xs font-mono text-safety-orange w-fit shadow-sm">
              <span className="inline-block w-2.5 h-2.5 bg-safety-orange rounded-full animate-pulse shadow-neon-orange" />
              <span className="font-bold uppercase tracking-wider">Track. Maintain. Optimize.</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-primary leading-tight">
              Complete Maintenance & <span className="text-safety-orange bg-gradient-to-r from-orange-600 via-safety-orange to-amber-500 bg-clip-text text-transparent">Asset Management</span>
            </h1>
 
            <p className="text-slate-secondary text-base sm:text-lg leading-relaxed max-w-lg">
              IronFlow Softwares helps industrial and field service companies streamline maintenance, manage assets, and complete more work with less downtime—so your operations run stronger every day.
            </p>
 
            {/* SRE Key Metrics checklist */}
            <div className="grid grid-cols-2 gap-6 border-t border-b border-slate-200/80 py-6 my-2">
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Average Health Index</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">98.6%</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Unscheduled Downtime</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">0.0 Hours</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Active PM Schedules</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">24 Automated</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Database Security</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">Cloud-Secured</div>
              </div>
            </div>
 
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#features" 
                className="bg-gradient-to-r from-safety-orange via-orange-600 to-amber-500 text-white px-8 py-4 rounded text-sm font-display font-bold tracking-wider text-center transition-all duration-300 shadow-neon-orange-intense hover:-translate-y-0.5 active:scale-[0.98]"
              >
                EXPLORE CORE PILLARS
              </a>
              <a 
                href="#demo" 
                className="border border-slate-200 bg-white hover:border-slate-400 px-8 py-4 rounded text-sm font-display font-bold text-slate-secondary hover:text-slate-primary text-center transition-all duration-300 shadow-sm"
              >
                REQUEST FREE DEMO
              </a>
            </div>
          </div>
 
          {/* Hero Right: Live Telemetry CMMS Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl shadow-cyber-card relative overflow-hidden p-1.5 hover:shadow-neon-orange-intense transition-all duration-300">
              
              {/* Telemetry Header */}
              <div className="bg-slate-100/80 border border-slate-200/80 rounded-t-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full shadow-sm" />
                    <span className="w-3 h-3 bg-amber-400 rounded-full shadow-sm" />
                    <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm" />
                  </div>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <span className="font-mono text-xs font-bold text-slate-muted">IRONFLOW_CMMS_CORE_V5.12</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsSimulatingOrders(prev => !prev)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-colors ${
                      isSimulatingOrders 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-slate-200 text-slate-600 border border-transparent'
                    }`}
                  >
                    {isSimulatingOrders ? '● SIMULATION RUNNING' : 'PAUSED'}
                  </button>
                  <span className="text-[10px] font-mono text-slate-muted">SECURE_SYNC: OK</span>
                </div>
              </div>
 
              {/* Telemetry Main Interface */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left Side: Real-time scan log */}
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-4 relative h-[260px] overflow-hidden flex flex-col justify-between shadow-inner">
                  {isSimulatingOrders && (
                    <div className="absolute left-0 right-0 h-0.5 bg-safety-orange/40 animate-scan shadow-neon-orange pointer-events-none" />
                  )}
                  
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2 flex justify-between uppercase">
                      <span>Live Dispatch Feed</span>
                      <span className="text-safety-orange font-bold">{totalWorkOrders} Handled</span>
                    </div>
 
                    <div className="mt-2.5 space-y-2">
                      <AnimatePresence initial={false}>
                        {workOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[11px] font-mono flex items-center justify-between py-1 border-b border-slate-900 text-slate-200"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.status === 'Open' ? 'bg-amber-400' : order.status === 'In Progress' ? 'bg-safety-orange animate-pulse' : 'bg-emerald-400'
                              }`} />
                              <span className="text-slate-600">[{order.timestamp}]</span>
                              <span className="text-white font-bold">{order.orderNumber}</span>
                              <span className="text-slate-400 truncate">{order.assetName}</span>
                            </div>
                            <span className={`font-semibold pl-1 font-mono text-[9px] px-1 py-0.5 rounded ${
                              order.priority === 'Critical' ? 'bg-red-950 text-red-400 border border-red-500/20' : 'bg-slate-900 text-slate-400'
                            }`}>{order.priority}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Local Hardware diagnostics */}
                  <div className="border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>Cloud State: Secure SSL</span>
                    <span>Role Access: Delta Team</span>
                    <span>Nodes: 3 active</span>
                  </div>
                </div>
 
                {/* Right Side: High-density data dials */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  
                  {/* Database Wallet Sync State */}
                  <div className="bg-white/70 border border-white/60 backdrop-blur-xl rounded-lg p-4 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-neon-orange hover:bg-white/90 transition-all duration-300">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-muted">
                      <span>Asset Health Index</span>
                      <Icons.Asset className="w-4 h-4 text-safety-orange animate-pulse-subtle" />
                    </div>
                    <div className="my-1.5">
                      <div className="text-2xl font-display font-bold text-slate-primary">98.6%</div>
                      <div className="text-[10px] font-mono text-slate-secondary">No active critical failures.</div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-safety-orange w-[98.6%]" />
                    </div>
                  </div>
 
                  {/* Dynamic Tag Pulse Density / PM Compliance Uptime */}
                  <div className="bg-white/70 border border-white/60 backdrop-blur-xl rounded-lg p-4 flex flex-col justify-between h-[125px] shadow-sm hover:shadow-neon-orange hover:bg-white/90 transition-all duration-300">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-muted">
                      <span>Maintenance Compliance</span>
                      <Icons.Chart className="w-4 h-4 text-safety-orange" />
                    </div>
                    
                    {/* Simulated live visual sparkline bars */}
                    <div className="h-10 flex items-end justify-between gap-1 mt-1 bg-slate-50 border border-slate-100 p-1.5 rounded">
                      {efficiencyGraph.map((val, idx) => (
                        <div 
                           key={idx} 
                           className="w-full bg-orange-400/80 hover:bg-orange-500 rounded-t-sm transition-colors"
                           style={{ height: `${val}%` }}
                        />
                      ))}
                    </div>
 
                    <div className="text-[9px] font-mono text-slate-secondary flex justify-between items-center pt-1 border-t border-slate-100">
                      <span>Avg Compliance: 92%</span>
                      <span>Target Uptime: 99%</span>
                    </div>
                  </div>
 
                </div>
 
              </div>
 
            </div>
          </div>
 
        </div>
      </section>

      {/* ============================================================================
          FEATURES GRID (High-Density, Interactive Pillars & Live Software Simulators)
          ============================================================================ */}
      <section id="features" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50">
        <div className="absolute inset-0 bg-cyber-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-electric uppercase">Four Pillars of Control</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary">
              Complete Maintenance & Asset Management Suite
            </p>
            <p className="text-slate-secondary text-base max-w-xl mx-auto">
              Click on each operational pillar to explore its 7 core features, and test its system logic using the live simulator panel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: 4 Pillars Tabs Selector */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              <div className="flex flex-col space-y-3">
                {[
                  { id: 'asset', label: 'Asset Management', desc: 'Hierarchy, status & tracking', icon: Icons.Asset },
                  { id: 'work_order', label: 'Work Order Management', desc: 'Create, dispatch & track logs', icon: Icons.Wrench },
                  { id: 'preventive', label: 'Preventive Maintenance', desc: 'Automate compliance schedules', icon: Icons.Calendar },
                  { id: 'reports', label: 'Reports & Insights', desc: 'Cost analysis & ROI metrics', icon: Icons.Chart }
                ].map((pillar) => {
                  const PillarIcon = pillar.icon;
                  const isActive = activePillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => setActivePillar(pillar.id as any)}
                      className={`w-full text-left p-4.5 rounded-xl border transition-all duration-300 flex items-start space-x-4 shadow-sm ${
                        isActive
                          ? 'border-electric bg-white text-slate-primary shadow-neon-teal ring-1 ring-electric/10'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-secondary'
                      }`}
                    >
                      <div className={`p-3 rounded-lg border transition-colors ${
                        isActive ? 'bg-blue-50 border-blue-200 text-electric' : 'bg-slate-50 border-slate-100 text-slate-muted'
                      }`}>
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display font-bold text-sm block text-slate-primary">{pillar.label}</span>
                        <span className="text-[11px] text-slate-muted block mt-0.5 leading-normal">{pillar.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bullet Features aligned with flyer */}
              <div className="bg-white/80 border border-slate-200/80 rounded-xl p-6 shadow-sm">
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  {activePillar === 'asset' && 'Asset Management Capabilities'}
                  {activePillar === 'work_order' && 'Work Order Capabilities'}
                  {activePillar === 'preventive' && 'Preventive Maintenance Capabilities'}
                  {activePillar === 'reports' && 'Reports & Insights Capabilities'}
                </div>
                
                <ul className="space-y-3.5">
                  {/* Render exact 7 bullets based on selected activePillar */}
                  {activePillar === 'asset' && [
                    { t: 'Asset Tracking & Inventory', d: 'Auto-log field assets with absolute telemetry precision.' },
                    { t: 'Asset Hierarchy & Locations', d: 'Organize complex systems across parent-child structures and geofenced platforms.' },
                    { t: 'Asset History & Documentation', d: 'Maintain comprehensive immutable digital journals for each system.' },
                    { t: 'Warranty & Service Records', d: 'Track supplier terms, service history agreements, and coverage limits.' },
                    { t: 'QR Code / Barcode Scanning', d: 'Instantly verify asset details in the field using mobile device cameras.' },
                    { t: 'Custom Fields & Attributes', d: 'Tailor asset metadata schemas perfectly to fit specific industrial standards.' },
                    { t: 'Real-time Asset Status', d: 'Gain live operational insight into the physical health of active installations.' }
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                      <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded p-0.5 mt-0.5 shadow-sm">
                        <Icons.Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-primary font-bold">{bullet.t}</strong>
                        <span className="text-slate-secondary block text-[11px] mt-0.5">{bullet.d}</span>
                      </div>
                    </li>
                  ))}

                  {activePillar === 'work_order' && [
                    { t: 'Create, Assign & Prioritize', d: 'Instantly dispatch critical tickets to SREs and technicians in the field.' },
                    { t: 'Status Tracking (Open to Closed)', d: 'Track work progression in real-time with comprehensive status flows.' },
                    { t: 'Work History & Audit Trail', d: 'Retain complete history logs of all modifications for insurance and safety.' },
                    { t: 'Photos, Notes & Attachments', d: 'Attach pictures and site observations directly to work orders.' },
                    { t: 'Time Tracking & Labor Logs', d: 'Record worker hours and shift handovers to optimize resource allocation.' },
                    { t: 'Recurring & Preventive Work', d: 'Program repetitive tasks to occur automatically on calendar intervals.' },
                    { t: 'Mobile Access for Field Teams', d: 'Seamless responsive access optimized for high-risk offshore environments.' }
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                      <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded p-0.5 mt-0.5 shadow-sm">
                        <Icons.Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-primary font-bold">{bullet.t}</strong>
                        <span className="text-slate-secondary block text-[11px] mt-0.5">{bullet.d}</span>
                      </div>
                    </li>
                  ))}

                  {activePillar === 'preventive' && [
                    { t: 'PM Schedules & Automation', d: 'Automate compliance schedules to run on calendar or run-time triggers.' },
                    { t: 'Calendar & Due Date Alerts', d: 'Visual calendars and alerts warn of upcoming maintenance milestones.' },
                    { t: 'Auto-Generated Work Orders', d: 'Instantly create and assign tickets when preventive intervals are breached.' },
                    { t: 'Checklists & Procedures', d: 'Embed rigid step-by-step procedures to ensure safety compliance.' },
                    { t: 'Failure Tracking & Trending', d: 'Analyze fault logs over time to foresee and prevent catastrophic issues.' },
                    { t: 'Compliance & Safety Tracking', d: 'Ensure absolute alignment with regulatory standards and hazard protocols.' },
                    { t: 'Reduce Downtime & Costs', d: 'Drastically minimize operational disruption through proactive maintenance.' }
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                      <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded p-0.5 mt-0.5 shadow-sm">
                        <Icons.Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-primary font-bold">{bullet.t}</strong>
                        <span className="text-slate-secondary block text-[11px] mt-0.5">{bullet.d}</span>
                      </div>
                    </li>
                  ))}

                  {activePillar === 'reports' && [
                    { t: 'Real-time Dashboards', d: 'Visualize critical KPIs, active work streams, and asset health instantaneously.' },
                    { t: 'Work Order & Asset Reports', d: 'Export exhaustive reports on work order volumes, completions, and asset stats.' },
                    { t: 'PM Compliance Reports', d: 'Generate legal proof of compliance for safety audits and regulatory checks.' },
                    { t: 'Downtime & Cost Analysis', d: 'Uncover exactly how much downtime is costing your organization and how to fix it.' },
                    { t: 'Exportable Data & Analytics', d: 'Connect reports directly into power analytics systems (CSV, JSON, PDF).' },
                    { t: 'Custom Reports', d: 'Build custom reports tailored exactly to specialized industrial KPIs.' },
                    { t: 'Make Smarter Decisions', d: 'Harness predictive insights to prioritize capital expenditures correctly.' }
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                      <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded p-0.5 mt-0.5 shadow-sm">
                        <Icons.Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-primary font-bold">{bullet.t}</strong>
                        <span className="text-slate-secondary block text-[11px] mt-0.5">{bullet.d}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column: Live Interactive Simulator Panel */}
            <div className="lg:col-span-7 flex flex-col justify-stretch">
              <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl p-6 shadow-cyber-card flex flex-col justify-between h-full hover:shadow-neon-orange transition-all duration-300">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-safety-orange"></span>
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-primary uppercase">
                      {activePillar === 'asset' && 'Pillar 1: Interactive Asset Hub'}
                      {activePillar === 'work_order' && 'Pillar 2: Interactive Dispatch Board'}
                      {activePillar === 'preventive' && 'Pillar 3: PM Scheduler Simulator'}
                      {activePillar === 'reports' && 'Pillar 4: Real-time ROI & Uptime Calculator'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-muted uppercase tracking-wider">LIVE TELEMETRY VIEW</span>
                </div>

                {/* 1. ASSET MANAGEMENT SIMULATOR */}
                {activePillar === 'asset' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-secondary mb-4 leading-relaxed">
                        Tap on a high-value asset inside the telemetry queue to verify hierarchy tree logs, warranty files, and database records in real-time.
                      </p>
                      
                      {/* Asset record list */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        {[
                          { id: 'BOP-01', name: 'Subsea Blowout Preventer', loc: 'GOM Platform A', health: '98.6%', status: 'ACTIVE' },
                          { id: 'GEN-02', name: 'Power Generator B', loc: 'North Sea Deck', health: '100%', status: 'ACTIVE' },
                          { id: 'PMP-04', name: 'Mud Reciprocator #4B', loc: 'Permian Field', health: '92.4%', status: 'ACTIVE' }
                        ].map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => setSelectedAssetId(asset.id)}
                            className={`p-3.5 rounded-lg border text-left transition-all ${
                              selectedAssetId === asset.id
                                ? 'bg-orange-50/50 border-safety-orange shadow-sm font-semibold'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="font-mono text-[10px] block text-slate-muted font-bold">{asset.id}</span>
                            <span className="font-display text-xs text-slate-primary block truncate font-bold mt-0.5">{asset.name}</span>
                            <span className="font-mono text-[10px] text-emerald-600 block mt-1.5 font-bold">Health: {asset.health}</span>
                          </button>
                        ))}
                      </div>

                      {/* Expanded Asset Details */}
                      <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
                        <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>Hierarchy Record</span>
                          <span className="text-safety-orange">WARRANTY COMPLIANT</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div><span className="text-slate-500">Parent Facility:</span> <span className="text-white font-semibold">IronFlow Offshore Rig-04</span></div>
                          <div><span className="text-slate-500">Asset Location:</span> <span className="text-white font-semibold">{selectedAssetId === 'BOP-01' ? 'Sector 4A' : selectedAssetId === 'GEN-02' ? 'Engine Room' : 'Drilling Pod 2'}</span></div>
                          <div><span className="text-slate-500">Warranty Expires:</span> <span className="text-white font-semibold">2028-12-15</span></div>
                          <div><span className="text-slate-500">Service Coverage:</span> <span className="text-white font-semibold">Full Onsite SRE</span></div>
                        </div>
                        <div className="pt-2 border-t border-slate-900 text-[10px] flex items-center space-x-1.5">
                          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <span className="text-slate-400">Digital twin synchronization: Connected (SQLite sync OK)</span>
                        </div>
                      </div>
                    </div>

                    {/* QR SCAN BUTTON */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-slate-muted block">QR SCANNED TRANSACTION POOL</span>
                        <span className="text-base font-bold text-slate-primary font-mono">{qrScannedCount} mobile scans verified</span>
                      </div>
                      
                      <button
                        onClick={() => setQrScannedCount(prev => prev + 1)}
                        className="bg-gradient-to-r from-safety-orange to-orange-600 hover:opacity-95 text-white px-5 py-3 rounded-lg text-xs font-display font-bold tracking-wider transition-all duration-300 shadow-neon-orange flex items-center space-x-2 active:scale-[0.98]"
                      >
                        <Icons.Check className="w-4 h-4 text-white" />
                        <span>📷 SIMULATE FIELD QR SCAN</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. WORK ORDER DISPATCH BOARD */}
                {activePillar === 'work_order' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-secondary mb-4 leading-relaxed">
                        Track status flows from Open to Closed in real-time. Tap column cards to cycle this simulated Preventive Work Order (WO-2941) through technician workflows.
                      </p>

                      {/* Column Status cards */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {(['Open', 'In Progress', 'Closed'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => setWoStatusDemo(status)}
                            className={`p-3.5 rounded-lg border text-center transition-all ${
                              woStatusDemo === status
                                ? 'bg-orange-50/50 border-safety-orange shadow-sm font-semibold'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                status === 'Open' ? 'bg-amber-400' : status === 'In Progress' ? 'bg-safety-orange animate-pulse' : 'bg-emerald-400'
                              }`} />
                              <span className="font-display text-xs text-slate-primary font-bold">{status}</span>
                            </div>
                            <span className="text-[10px] text-slate-muted block mt-1">
                              {status === 'Open' ? '1 pending' : status === 'In Progress' ? 'Active now' : 'Archived'}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Work Order Details Card */}
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
                        <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>Work Ticket ID</span>
                          <span className="text-safety-orange">PRIORITY: HIGH</span>
                        </div>
                        <div className="text-[11px]"><span className="text-slate-500">Ticket Ref:</span> <span className="text-white font-bold">WO-2941</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">Job Scope:</span> <span className="text-white">Calibrate Mud Reciprocator Valve #4B</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">Assignee:</span> <span className="text-white">T. Vance (Senior Field Tech)</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">Time Log:</span> <span className="text-white">2 hours 45 mins logged</span></div>
                        
                        <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Status Flow: {woStatusDemo === 'Open' ? '📋 DISPATCHED TO MOBILE' : woStatusDemo === 'In Progress' ? '⚙️ REPAIR IN PROGRESS' : '✓ REPAIR AUDITED & SIGNED'}</span>
                          <span className="font-bold text-white">{woStatusDemo === 'Closed' ? '100% DONE' : 'WAITING'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cycle status controls */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-slate-muted block">AUDIT TRAIL COMPLIANCE</span>
                        <span className="text-xs text-slate-primary font-bold">Time card logged automatically</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          const nextStatus: Record<typeof woStatusDemo, typeof woStatusDemo> = {
                            'Open': 'In Progress',
                            'In Progress': 'Closed',
                            'Closed': 'Open'
                          };
                          setWoStatusDemo(nextStatus[woStatusDemo]);
                        }}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-3 rounded-lg text-xs font-display font-bold tracking-wider transition-all duration-300 flex items-center space-x-2 active:scale-[0.98]"
                      >
                        <Icons.Refresh className="w-4 h-4 text-white animate-spin-slow" />
                        <span>CYCLE WORK STATUS</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PREVENTIVE MAINTENANCE SCHEDULER */}
                {activePillar === 'preventive' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-secondary mb-4 leading-relaxed">
                        Set automated preventive intervals below. IronFlow automatically dispatches a secure work order and safety checklists as soon as the scheduled interval is reached.
                      </p>

                      {/* Slider Selector */}
                      <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 mb-4 shadow-inner">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-secondary font-semibold">Set Preventive Trigger Interval</span>
                          <span className="text-safety-orange font-bold font-mono">{pmIntervalDays} Days</span>
                        </div>
                        
                        <input
                          type="range"
                          min="7"
                          max="90"
                          value={pmIntervalDays}
                          onChange={(e) => setPmIntervalDays(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-safety-orange"
                        />
                        
                        <div className="flex justify-between text-[9px] font-mono text-slate-muted">
                          <span>7d (Critical)</span>
                          <span>30d (Monthly)</span>
                          <span>60d (Bi-Monthly)</span>
                          <span>90d (Quarterly)</span>
                        </div>
                      </div>

                      {/* Automated Work Order Output details */}
                      <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
                        <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>Auto-scheduler Status</span>
                          <span className="text-emerald-400">SCHEDULER RUNNING</span>
                        </div>
                        <div className="text-[11px]"><span className="text-slate-500">Next Auto WO:</span> <span className="text-white">Triggering in {pmIntervalDays} days automatically</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">Assigned Team:</span> <span className="text-white">Preventive Maintenance Delta</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">System Checklist:</span> <span className="text-white">ATEX Valve Leak Audit & Pressure Re-zero</span></div>
                        <div className="text-[11px]"><span className="text-slate-500">Last Dispatched Alert:</span> <span className="text-white font-bold">{lastPmAlertTime} (Today)</span></div>
                      </div>
                    </div>

                    {/* Automation Trigger Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-slate-muted block">COMPLIANCE CRON MONITOR</span>
                        <span className="text-xs text-slate-primary font-bold">Autogen state: Active & Validated</span>
                      </div>
                      
                      <button
                        onClick={triggerScheduleAlert}
                        disabled={isSchedulingAlert}
                        className="bg-gradient-to-r from-safety-orange to-orange-600 hover:opacity-95 disabled:opacity-60 text-white px-5 py-3 rounded-lg text-xs font-display font-bold tracking-wider transition-all duration-300 shadow-neon-orange flex items-center space-x-2 active:scale-[0.98]"
                      >
                        {isSchedulingAlert ? (
                          <>
                            <Icons.Refresh className="w-4 h-4 text-white animate-spin" />
                            <span>DISPATCHING WORK ORDER...</span>
                          </>
                        ) : (
                          <>
                            <Icons.Calendar className="w-4 h-4 text-white" />
                            <span>⚡ FORCE TRIGGER PREVENTIVE DISPATCH</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. REPORTS & INSIGHTS ROI CALCULATOR */}
                {activePillar === 'reports' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-secondary mb-4 leading-relaxed">
                        Uncover exactly how much your organization saves with IronFlow. Drag the sliders below to adjust your hourly downtime cost and yearly hours saved.
                      </p>

                      <div className="space-y-4 mb-4">
                        {/* Slider 1: Hourly Downtime Cost */}
                        <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 shadow-inner">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-secondary font-semibold">Hourly Downtime Cost</span>
                            <span className="text-slate-primary font-bold font-mono">${hourlyDowntimeCost.toLocaleString()}/hr</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="20000"
                            step="500"
                            value={hourlyDowntimeCost}
                            onChange={(e) => setHourlyDowntimeCost(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-electric"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-slate-muted">
                            <span>$1,000/hr</span>
                            <span>$10,000/hr</span>
                            <span>$20,000/hr</span>
                          </div>
                        </div>

                        {/* Slider 2: Hours Saved */}
                        <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 shadow-inner">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-secondary font-semibold">Downtime Reduced Per Year</span>
                            <span className="text-slate-primary font-bold font-mono">{downtimeHoursReduced} Hours</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={downtimeHoursReduced}
                            onChange={(e) => setDowntimeHoursReduced(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-electric"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-slate-muted">
                            <span>1 hr</span>
                            <span>25 hrs</span>
                            <span>50 hrs</span>
                          </div>
                        </div>
                      </div>

                      {/* ROI Result Readout */}
                      <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                          Calculated Financial Return on Investment
                        </div>
                        <div className="text-3xl font-display font-extrabold text-safety-orange tracking-tight my-1 shadow-neon-orange animate-pulse-subtle">
                          ${(hourlyDowntimeCost * downtimeHoursReduced).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          saved per year in unscheduled downtime losses.
                        </div>
                      </div>
                    </div>

                    {/* Footer for ROI */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-slate-muted block">PREDICTIVE ANALYTICS ENGINE</span>
                        <span className="text-xs text-emerald-600 font-bold font-mono">✓ PM Uptime compliance rate: 100%</span>
                      </div>
                      
                      <a
                        href="#demo"
                        className="bg-gradient-to-r from-electric to-electric-indigo hover:opacity-95 text-white px-5 py-3 rounded-lg text-xs font-display font-bold tracking-wider transition-all duration-300 shadow-neon-teal-intense uppercase text-center active:scale-[0.98]"
                      >
                        EXPORT FULL REPORT METRICS
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================================
          "BUILT FOR YOUR TEAM" BENEFITS SECTION (Brand Identity / Competitor Killer)
          ============================================================================ */}
      <section id="team" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-safety-orange uppercase">BUILT FOR YOUR TEAM</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary">
              Empower Field Teams, Engineers, and Managers
            </p>
            <p className="text-slate-secondary text-base max-w-xl mx-auto">
              IronFlow is crafted explicitly to handle complex, rugged environments without requiring months of training or painful integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Easy to Use on Any Device',
                desc: 'Responsive, tactile, mobile-first design built for smartphones, industrial tablets, or central desktop rigs.',
                icon: Icons.Logo
              },
              {
                title: 'Role-Based Access',
                desc: 'Configure fine-grained read/write security permissions easily for administrators, safety officers, and field technicians.',
                icon: Icons.Users
              },
              {
                title: 'Scalable as You Grow',
                desc: 'Efficient database structures easily handle fleets scaling from 1,000 up to 100,000+ active assets without performance degradation.',
                icon: Icons.Chart
              },
              {
                title: 'Secure & Cloud-Based',
                desc: 'End-to-end TLS 1.3 encryption, automatic SQLite data sync failover protection, and SOC2 certified database architectures.',
                icon: Icons.Shield
              }
            ].map((claim, idx) => {
              const ClaimIcon = claim.icon;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-electric/30 hover:shadow-neon-teal transition-all duration-300 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="bg-white text-electric border border-slate-200 p-3 rounded-lg w-fit shadow-sm">
                      <ClaimIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-primary">{claim.title}</h3>
                    <p className="text-slate-secondary text-xs leading-relaxed">{claim.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================================
          TECHNICAL ADVANTAGE / SRE API CONSOLE
          ============================================================================ */}
      <section id="api" className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* API copy Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-mono text-electric font-bold w-fit shadow-sm">
              <Icons.Terminal className="w-4 h-4 text-electric" />
              <span>Developer-First Platform API</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary leading-tight">
              Modular Integration for Industrial IoT Pipelines
            </h2>

            <p className="text-slate-secondary text-sm sm:text-base leading-relaxed">
              IronFlow is developer-first. Query active asset telemetry logs, sync work order flows, or pull compliance reports programmatically using clean, secure REST JSON API endpoints.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-electric mt-1 shadow-sm">
                  <Icons.Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-primary">Full-featured SDKs</h3>
                  <p className="text-slate-secondary text-xs">Pre-built endpoints for Golang, Rust, Python, and TypeScript, engineered with offline-first synchronization fallbacks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-electric mt-1 shadow-sm">
                  <Icons.Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-primary">SCADA / PLC Seamless Bridging</h3>
                  <p className="text-slate-secondary text-xs">Integrate hardware signals and geolocations seamlessly into central CMMS databases using secure gRPC channels.</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Interactive Playground Right */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-cyber-card p-1.5 hover:shadow-neon-teal transition-all duration-300">
              
              {/* Header */}
              <div className="bg-slate-100 border border-slate-200 rounded-t-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icons.Terminal className="w-4 h-4 text-electric" />
                  <span className="font-mono text-xs font-bold text-slate-primary">Interactive API Console</span>
                </div>
                <div className="text-[10px] font-mono text-slate-muted">REST API v1</div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                
                {/* Route selector buttons */}
                <div className="flex flex-wrap gap-2">
                  {API_PLAYGROUND_ROUTES.map((route, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRouteIdx(idx)}
                      className={`px-3.5 py-2 rounded-lg font-mono text-xs border transition-all ${
                        selectedRouteIdx === idx
                          ? 'bg-blue-50 text-electric border-blue-300 font-bold shadow-sm'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
                      }`}
                    >
                      <span className={`font-bold mr-1.5 ${
                        route.method === 'GET' ? 'text-emerald-600' : 'text-electric'
                      }`}>
                        {route.method}
                      </span>
                      {route.path}
                    </button>
                  ))}
                </div>

                {/* Route description */}
                <p className="text-slate-secondary font-mono text-[11px] bg-slate-50 px-3 py-2 border-l-2 border-electric rounded">
                  {API_PLAYGROUND_ROUTES[selectedRouteIdx].description}
                </p>

                {/* Code console */}
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 overflow-x-auto relative group shadow-inner">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-2 py-1 rounded">
                      CLICK TO COPY
                    </span>
                  </div>
                  
                  <pre className="text-xs font-mono text-sky-400 select-all leading-normal">
                    <code>
                      {JSON.stringify(API_PLAYGROUND_ROUTES[selectedRouteIdx].response, null, 2)}
                    </code>
                  </pre>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
          EDGE NODE LATENCY MONITOR SECTION (Specs & Sync Stats)
          ============================================================================ */}
      <section id="specs" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-electric uppercase">Distributed Operations</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary">Edge Sync & Latency Matrix</p>
            <p className="text-slate-secondary text-base max-w-xl mx-auto">
              Monitor active synchronization channels in real-time. Toggle the Sat-Storm simulator to test automated failover database security rules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Edge Map Visual Left */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-cyber-card hover:shadow-neon-teal transition-all duration-300 relative">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <Icons.Server className="w-4 h-4 text-electric" />
                  <span className="text-slate-primary font-bold">EDGE_DATABASE_SYNCRONIZER</span>
                </div>

                {/* Storm toggle */}
                <button
                  onClick={() => setStormActive(!stormActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all border ${
                    stormActive
                      ? 'bg-red-50 border-red-500 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {stormActive ? 'SAT-STORM ACTIVE (Simulating high latency)' : 'SIMULATE SAT-STORM'}
                </button>
              </div>

              {/* Simple geometric network visual nodes */}
              <div className="relative h-[260px] bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-around p-4 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-grid-pattern bg-[size:15px_15px] opacity-20 pointer-events-none" />
                
                {/* Line connects node 1, 2, 3 to Central Cloud */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <line x1="16%" y1="65%" x2="50%" y2="40%" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="5" />
                  <line x1="84%" y1="65%" x2="50%" y2="40%" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="5" />
                  
                  {/* Glowing data flow lines if normal, slower/red if storm */}
                  <line 
                    x1="16%" y1="65%" x2="50%" y2="40%" 
                    stroke={stormActive ? '#EF4444' : '#2563EB'} 
                    strokeWidth="2" 
                    strokeDasharray="8 20" 
                    className="animate-pulse-subtle" 
                  />
                  <line 
                    x1="84%" y1="65%" x2="50%" y2="40%" 
                    stroke={stormActive ? '#EF4444' : '#2563EB'} 
                    strokeWidth="2" 
                    strokeDasharray="8 20" 
                    className="animate-pulse-subtle" 
                  />
                </svg>

                {/* Node 1: Gulf of Mexico */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className={`p-3 rounded-full border mb-2 transition-all shadow-sm ${
                    stormActive ? 'bg-red-950/80 border-red-500 text-red-400 animate-bounce' : 'bg-slate-900 border-slate-800 text-electric'
                  }`}>
                    <Icons.Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">GULF_RIG04_NODE</span>
                  <span className={`font-mono text-[10px] font-bold ${stormActive ? 'text-red-500' : 'text-emerald-500'}`}>
                    {latencies.gulf}ms {stormActive ? '(Lagging)' : '(Excellent)'}
                  </span>
                </div>

                {/* Main Node: Houston Central Hub */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className="p-4.5 rounded-full border border-blue-800 bg-blue-950 text-sky-400 mb-2 shadow-sm animate-pulse-subtle">
                    <Icons.Server className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">CENTRAL_CLOUD_TX</span>
                  <span className="font-mono text-[9px] text-slate-500">SYS_PRIMARY_SECURE</span>
                </div>

                {/* Node 3: North Sea Satellite platform */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className={`p-3 rounded-full border mb-2 transition-all shadow-sm ${
                    stormActive ? 'bg-red-950/80 border-red-500 text-red-400 animate-bounce' : 'bg-slate-900 border-slate-800 text-electric'
                  }`}>
                    <Icons.Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">NORTH_SEA_RIG</span>
                  <span className={`font-mono text-[10px] font-bold ${stormActive ? 'text-red-500' : 'text-emerald-500'}`}>
                    {latencies.northSea}ms {stormActive ? '(Lagging)' : '(Excellent)'}
                  </span>
                </div>

              </div>
            </div>

            {/* Metrics Info cards Right */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Failover card info */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 font-mono text-xs shadow-sm">
                <div className="text-[10px] text-slate-muted font-bold uppercase mb-1.5">Failover Strategy</div>
                <h3 className="text-slate-primary font-bold text-sm mb-2">Automated WAN Fallback</h3>
                <p className="text-slate-secondary text-[11px] leading-relaxed">
                  In case of satellite packet drops, the database buffer writes locally to WAL SQLite cache before securely flushing transactions upon reconnection.
                </p>
              </div>

              {/* Hardware specifications list */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 font-mono text-xs shadow-sm">
                <div className="text-[10px] text-slate-muted font-bold uppercase mb-2">System Specs & Tech Standards</div>
                <ul className="space-y-2 text-[11px]">
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">Encryption:</span>
                    <span className="text-slate-primary font-semibold">End-to-End TLS 1.3 / AES-256</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">Sync Protocols:</span>
                    <span className="text-slate-primary font-semibold">gRPC / SQLite WAL Pipeline</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">Compliance:</span>
                    <span className="text-slate-primary font-semibold">ATEX Zone 1 & 2 Safe Software</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-secondary">Replication:</span>
                    <span className="text-slate-primary font-semibold">Tri-Region Real-time Cloud</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================================
          INTERACTIVE DEMO REQUEST FORM (CTA / BROCHURE ALIGNED)
          ============================================================================ */}
      <section id="demo" className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-cyber-card relative p-8 sm:p-12">
          
          <div className="absolute top-0 right-10 bg-orange-50 text-safety-orange border-b border-x border-orange-200 px-4 py-1.5 rounded-b font-mono text-[9px] font-bold tracking-wider uppercase">
            SECURE ACCESS SYSTEM
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: QR scanner mockup and contact card */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-electric uppercase tracking-widest block">GET THE PLATFORM</span>
                <h3 className="text-3xl font-display font-extrabold text-slate-primary leading-tight">
                  One System.<br />All Your Assets.<br /><span className="text-safety-orange">Total Control.</span>
                </h3>
                <p className="text-slate-secondary text-sm leading-relaxed">
                  See it in action. Request a free demo today to secure account credentials and custom team pricing estimates.
                </p>
              </div>

              {/* Styled SVG QR Code scanner card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center space-x-5 shadow-inner">
                <div className="bg-white border border-slate-300 p-2.5 rounded-lg shadow-sm relative group shrink-0">
                  {/* Glowing scan line across QR Code */}
                  <div className="absolute inset-x-2.5 top-2.5 h-0.5 bg-safety-orange/70 animate-scan shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  
                  {/* High fidelity reconstructed QR code SVG */}
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Quiet zone grid patterns representing a professional QR code */}
                    {/* Corners */}
                    <rect x="0" y="0" width="28" height="28" fill="#0F172A" />
                    <rect x="4" y="4" width="20" height="20" fill="white" />
                    <rect x="8" y="8" width="12" height="12" fill="#0F172A" />

                    <rect x="72" y="0" width="28" height="28" fill="#0F172A" />
                    <rect x="76" y="4" width="20" height="20" fill="white" />
                    <rect x="80" y="8" width="12" height="12" fill="#0F172A" />

                    <rect x="0" y="72" width="28" height="28" fill="#0F172A" />
                    <rect x="4" y="76" width="20" height="20" fill="white" />
                    <rect x="8" y="80" width="12" height="12" fill="#0F172A" />

                    {/* Small alignment pattern */}
                    <rect x="76" y="76" width="12" height="12" fill="#0F172A" />
                    <rect x="80" y="80" width="4" height="4" fill="white" />

                    {/* Fake Data Dots representation */}
                    <rect x="36" y="0" width="4" height="12" fill="#0F172A" />
                    <rect x="44" y="4" width="8" height="4" fill="#0F172A" />
                    <rect x="60" y="0" width="4" height="20" fill="#0F172A" />
                    <rect x="36" y="20" width="12" height="4" fill="#0F172A" />
                    <rect x="52" y="16" width="4" height="8" fill="#0F172A" />
                    <rect x="64" y="24" width="8" height="4" fill="#0F172A" />

                    <rect x="0" y="36" width="12" height="4" fill="#0F172A" />
                    <rect x="4" y="44" width="8" height="8" fill="#0F172A" />
                    <rect x="20" y="36" width="4" height="16" fill="#0F172A" />
                    <rect x="28" y="48" width="12" height="4" fill="#0F172A" />

                    <rect x="36" y="36" width="28" height="28" fill="#0F172A" />
                    <rect x="40" y="40" width="8" height="8" fill="white" />
                    <rect x="52" y="52" width="8" height="8" fill="white" />
                    
                    <rect x="0" y="60" width="8" height="4" fill="#0F172A" />
                    <rect x="12" y="64" width="8" height="4" fill="#0F172A" />
                    <rect x="24" y="60" width="4" height="12" fill="#0F172A" />

                    <rect x="68" y="36" width="4" height="12" fill="#0F172A" />
                    <rect x="76" y="44" width="8" height="4" fill="#0F172A" />
                    <rect x="88" y="36" width="12" height="4" fill="#0F172A" />
                    <rect x="80" y="52" width="4" height="16" fill="#0F172A" />
                    <rect x="92" y="48" width="4" height="20" fill="#0F172A" />

                    <rect x="36" y="72" width="4" height="20" fill="#0F172A" />
                    <rect x="48" y="76" width="12" height="4" fill="#0F172A" />
                    <rect x="44" y="88" width="16" height="4" fill="#0F172A" />
                    <rect x="68" y="72" width="4" height="16" fill="#0F172A" />
                  </svg>
                </div>
                
                <div className="font-mono">
                  <span className="text-[10px] text-slate-muted block">MOBILE FREE DEMO QUICK SCAN</span>
                  <span className="text-xs text-slate-primary block font-bold leading-relaxed mt-0.5">Scan with camera to secure instant credentials on mobile</span>
                </div>
              </div>

              {/* Official Brochure Contact Details */}
              <div className="border-t border-slate-100 pt-6 space-y-4 text-xs font-mono">
                <div className="flex items-center space-x-3 text-slate-secondary hover:text-electric transition-colors">
                  <div className="bg-blue-50 text-electric border border-blue-100 p-2 rounded shadow-sm">
                    <Icons.Phone className="w-4 h-4" />
                  </div>
                  <a href="tel:713-298-4529" className="font-bold font-mono">713-298-4529</a>
                </div>

                <div className="flex items-center space-x-3 text-slate-secondary hover:text-electric transition-colors">
                  <div className="bg-blue-50 text-electric border border-blue-100 p-2 rounded shadow-sm">
                    <Icons.Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:info@ironflowsoftwares.com" className="font-bold font-mono">info@ironflowsoftwares.com</a>
                </div>

                <div className="flex items-center space-x-3 text-slate-secondary hover:text-electric transition-colors">
                  <div className="bg-blue-50 text-electric border border-blue-100 p-2 rounded shadow-sm">
                    <Icons.Globe className="w-4 h-4" />
                  </div>
                  <a href="https://www.ironflowsoftwares.com" target="_blank" rel="noopener noreferrer" className="font-bold font-mono">www.ironflowsoftwares.com</a>
                </div>
              </div>

            </div>

            {/* Right Column: High Converting Form */}
            <div className="lg:col-span-7">
              {formStep === 'idle' && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="email" className="font-mono text-xs font-bold text-slate-secondary uppercase">
                        Work Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@energycorp.com"
                        className="bg-slate-50 border border-slate-200 focus:border-electric rounded-lg p-3 text-sm text-slate-primary focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono shadow-sm transition-colors"
                      />
                    </div>

                    {/* Asset Volume */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="volume" className="font-mono text-xs font-bold text-slate-secondary uppercase">
                        Estimated Assets Managed
                      </label>
                      <select
                        id="volume"
                        value={assetVolume}
                        onChange={(e) => setAssetVolume(e.target.value)}
                        className="bg-slate-50 border border-slate-200 focus:border-electric rounded-lg p-3 text-sm text-slate-primary focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono cursor-pointer shadow-sm transition-colors"
                      >
                        <option value="1k_10k">1,000 to 10,000 assets</option>
                        <option value="10k_100k">10,000 to 100,000 assets</option>
                        <option value="100k_plus">100,000+ assets</option>
                      </select>
                    </div>
                  </div>

                  {/* Core interest choice */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-xs font-bold text-slate-secondary uppercase">
                      Primary Software Need
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'asset_mgmt', name: 'Asset Management', desc: 'Tracking & barcodes' },
                        { id: 'wo_dispatch', name: 'Work Order Management', desc: 'Labor logs & ticket flow' },
                        { id: 'prev_maint', name: 'Preventive Calendar', desc: 'Auto-generation & compliance' }
                      ].map((env) => (
                        <label
                          key={env.id}
                          onClick={() => setEnvironmentProfile(env.id)}
                          className={`border rounded-lg p-4 flex flex-col justify-between cursor-pointer font-mono transition-all shadow-sm ${
                            environmentProfile === env.id
                              ? 'border-electric bg-blue-50/50 text-slate-primary font-bold'
                              : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-[11px] font-bold block">{env.name}</span>
                          <span className="text-[9px] text-slate-secondary block mt-1 leading-normal">{env.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-safety-orange to-orange-600 hover:opacity-95 text-white px-6 py-4.5 rounded-lg text-sm font-display font-bold tracking-widest transition-all duration-300 shadow-neon-orange uppercase active:scale-[0.99]"
                    >
                      REQUEST LIVE SOFTWARE ACCESS
                    </button>
                  </div>

                  <div className="text-center font-mono text-[9px] text-slate-muted">
                    🔒 SSL 256-bit safe transmission. Demo logins allocated instantly inside compliance policies.
                  </div>

                </form>
              )}

              {/* Submission animation step indicators */}
              {formStep !== 'idle' && (
                <div className="h-[300px] flex flex-col items-center justify-center font-mono text-xs space-y-4">
                  {formStep === 'verifying' && (
                    <div className="text-center space-y-3">
                      <Icons.Refresh className="w-8 h-8 text-electric animate-spin mx-auto" />
                      <p className="text-electric font-bold">VERIFYING CORPORATE SUITE AUTHORITY...</p>
                      <p className="text-[10px] text-slate-muted">Checking database schemas and allocation slots...</p>
                    </div>
                  )}

                  {formStep === 'allocating' && (
                    <div className="text-center space-y-3">
                      <Icons.Cpu className="w-8 h-8 text-safety-orange animate-pulse mx-auto" />
                      <p className="text-safety-orange font-bold">ALLOCATING PRIVATE SQL DEPLOYMENT...</p>
                      <p className="text-[10px] text-slate-muted">Configuring secure credentials for your asset volume...</p>
                    </div>
                  )}

                  {formStep === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm animate-bounce">
                        <Icons.Check className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-primary uppercase tracking-wider">Credentials Provisioned!</h3>
                      <p className="text-slate-secondary text-xs max-w-md mx-auto leading-relaxed font-sans">
                        Account configured successfully. We have dispatched login credentials and full CMMS software manual to <span className="text-slate-primary font-bold">{email}</span>. Check your inbox to begin tracking immediately.
                      </p>
                      <button 
                        onClick={() => {
                          setEmail('');
                          setFormStep('idle');
                        }}
                        className="border border-slate-200 hover:border-slate-300 text-slate-secondary hover:text-slate-primary px-4 py-2 rounded-lg text-[10px] transition-colors"
                      >
                        RESET SIMULATOR ACCESS
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </section>

      {/* ============================================================================
          FOOTER / SRE COMPLIANCE BADGES
          ============================================================================ */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 font-mono text-[10px] text-slate-secondary">
            
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center space-x-2">
                <Icons.Logo />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base tracking-tight text-slate-primary">IronFlow Softwares</span>
                  <span className="text-[9px] font-mono tracking-widest text-safety-orange font-bold uppercase -mt-0.5">Keep Everything Running.</span>
                </div>
              </div>
              <p className="text-slate-muted text-center md:text-left mt-1">
                © {new Date().getFullYear()} IronFlow Softwares. All rights reserved. Deployed via Edge Core Node.
              </p>
            </div>

            {/* Industrial IoT & SRE Compliance Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                ATEX ZONE 1 & 2 SAFE
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                E2E TLS 1.3 SECURED
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                SOC2 COMPLIANT
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                SQL WAL FAILOVER PROTECTION
              </span>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
