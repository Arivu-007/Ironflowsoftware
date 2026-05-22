import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// INLINE CUSTOM GEOMETRIC SVG ICONS (Ensures compile safety & zero-dependency)
// ============================================================================

const Icons = {
  Logo: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#logo-grad)" />
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
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  WifiOff: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.5" />
      <path d="M5 12.5a10.94 10.94 0 0 1 5.17-2.69" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  Activity: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Database: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
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
  Terminal: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Settings: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
  )
};

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

interface AssetLog {
  id: string;
  tagId: string;
  assetClass: string;
  signalStrength: number;
  status: 'active' | 'warning' | 'calibrated';
  timestamp: string;
}

const INITIAL_LOGS: AssetLog[] = [
  { id: '1', tagId: 'RFID-TX-904', assetClass: 'Drill Pipe Stand #4B', signalStrength: -68, status: 'active', timestamp: '17:24:02' },
  { id: '2', tagId: 'RFID-VAL-882', assetClass: 'Blowout Preventer A-1', signalStrength: -72, status: 'calibrated', timestamp: '17:24:11' },
  { id: '3', tagId: 'RFID-SMC-101', assetClass: 'Subsea Control Valve B', signalStrength: -89, status: 'warning', timestamp: '17:24:35' },
  { id: '4', tagId: 'RFID-PUMP-50', assetClass: 'Mud Pump Reciprocator', signalStrength: -61, status: 'active', timestamp: '17:24:58' }
];

const API_PLAYGROUND_ROUTES = [
  {
    method: 'GET',
    path: '/v1/assets/rig-04',
    description: 'Fetch all high-value assets deployed on Rig-04.',
    response: {
      status: 'success',
      node_id: 'permian-edge-04',
      uptime: '99.9994%',
      assets: [
        { id: 'rig04-dp-4b', class: 'Drill Pipe Stand', rfid_hex: '0x9FF8E4', pressure_psi: 320, calibration_days_left: 14 },
        { id: 'rig04-val-a1', class: 'Blowout Preventer', rfid_hex: '0x3AC112', pressure_psi: 2900, calibration_days_left: 184 }
      ]
    }
  },
  {
    method: 'POST',
    path: '/v1/scans/sync',
    description: 'Sync local queued offline scans with central energy hub.',
    response: {
      sync_status: 'committed',
      records_synced: 142,
      sqlite_wal_flushed: true,
      central_latency_ms: 18,
      conflicts_resolved: 0
    }
  },
  {
    method: 'GET',
    path: '/v1/telemetry/health',
    description: 'Inspect edge hardware power, RFID beam strength, and RSSI threshold.',
    response: {
      antenna_status: 'operational',
      power_source: 'poe_802_3at',
      tx_power_dbm: 30.0,
      attenuation: '0dB',
      rssi_cutoff: -90,
      temperature_celsius: 42.8
    }
  }
];

export default function LandingPage() {
  // --- Hero Interactive Terminal State ---
  const [liveLogs, setLiveLogs] = useState<AssetLog[]>(INITIAL_LOGS);
  const [isScanning, setIsScanning] = useState(true);
  const [tagCount, setTagCount] = useState(1402);
  const [signalGraph, setSignalGraph] = useState<number[]>([40, 52, 45, 60, 55, 70, 68, 85, 75, 92]);

  // --- Feature 1 (RFID Scanner slider) State ---
  const [rfidRange, setRfidRange] = useState<number>(18);
  const detectedCount = useMemo(() => {
    return Math.floor(rfidRange * 4.8 + 12);
  }, [rfidRange]);
  const signalRssi = useMemo(() => {
    return Math.min(-40, -100 + Math.floor(rfidRange * 2.8));
  }, [rfidRange]);

  // --- Feature 2 (Specialized calibration) State ---
  const [pressure, setPressure] = useState<number>(3250);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibratedAt, setCalibratedAt] = useState<string>('08:00');

  // --- Feature 3 (Offline Sync state) State ---
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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

  // Simulating live asset detection stream
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      const assetClasses = ['Drill Pipe Stand #4B', 'Blowout Preventer A-1', 'Subsea Control Valve B', 'Mud Pump Reciprocator', 'Tubing Joint E-7', 'Gate Valve SG-12'];
      const assetPrefixes = ['RFID-TX', 'RFID-VAL', 'RFID-SMC', 'RFID-PUMP', 'RFID-TUB', 'RFID-GATE'];
      const statuses: ('active' | 'calibrated' | 'warning')[] = ['active', 'calibrated', 'warning'];

      const randomIdx = Math.floor(Math.random() * assetClasses.length);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newLog: AssetLog = {
        id: Math.random().toString(),
        tagId: `${assetPrefixes[randomIdx]}-${Math.floor(Math.random() * 900 + 100)}`,
        assetClass: assetClasses[randomIdx],
        signalStrength: Math.floor(Math.random() * -40 - 50),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: timeStr
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 4)]);
      setTagCount(prev => prev + (Math.random() > 0.6 ? 1 : 0));

      setSignalGraph(prev => {
        const nextVal = Math.max(20, Math.min(100, prev[prev.length - 1] + Math.floor(Math.random() * 21 - 10)));
        return [...prev.slice(1), nextVal];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Simulating random noise/minor pressure swings in the telemetry gauge
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCalibrating) return;
      setPressure(prev => {
        const drift = Math.floor(Math.random() * 11 - 5);
        return Math.max(3200, Math.min(3300, prev + drift));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isCalibrating]);

  // Simulating Offline Sync buffering
  useEffect(() => {
    if (isOnline) return;
    const interval = setInterval(() => {
      setOfflineQueue(prev => prev + Math.floor(Math.random() * 2 + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const triggerCalibration = () => {
    setIsCalibrating(true);
    let count = 0;
    const interval = setInterval(() => {
      setPressure(prev => prev - 200);
      count++;
      if (count >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          setPressure(3250);
          const now = new Date();
          setCalibratedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
          setIsCalibrating(false);
        }, 1000);
      }
    }, 150);
  };

  const forceSync = () => {
    if (offlineQueue === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setOfflineQueue(0);
      setIsSyncing(false);
    }, 2000);
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
          HERO SECTION (High Utility, Premium Dashboard Layout)
          ============================================================================ */}
      <section className="relative pt-16 pb-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-sky-50 border border-sky-200/80 px-4 py-1.5 rounded-full text-xs font-mono text-electric w-fit shadow-sm">
              <span className="inline-block w-2.5 h-2.5 bg-electric rounded-full animate-pulse shadow-neon-teal" />
              <span className="font-bold uppercase tracking-wider">Zone 1 & 2 ATEX Certified</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-primary leading-tight">
              Precision Asset Management for <span className="text-electric bg-gradient-to-r from-blue-600 via-electric-indigo to-electric-blue bg-clip-text text-transparent">Field Engineers</span>
            </h1>

            <p className="text-slate-secondary text-base sm:text-lg leading-relaxed max-w-lg">
              Military-grade RFID hardware integration designed for deepwater offshore rigs and extreme remote environments. Built for SRE performance under low-bandwidth networks.
            </p>

            {/* SRE Key Metrics checklist */}
            <div className="grid grid-cols-2 gap-6 border-t border-b border-slate-200/80 py-6 my-2">
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Uptime Performance</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">99.999%</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Database Strategy</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">Offline-First WAL</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Antenna Beam Range</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">Up to 30m</div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-muted uppercase tracking-wider">Hardware Support</div>
                <div className="text-2xl font-display font-bold text-slate-primary tracking-tight">ATEX Zone 1</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#demo" 
                className="bg-gradient-to-r from-electric via-electric-indigo to-electric-blue text-white px-8 py-4 rounded text-sm font-display font-bold tracking-wider text-center transition-all duration-300 shadow-neon-teal-intense hover:-translate-y-0.5 active:scale-[0.98]"
              >
                TRY LIVE SIMULATOR
              </a>
              <a 
                href="#specs" 
                className="border border-slate-200 bg-white hover:border-slate-400 px-8 py-4 rounded text-sm font-display font-bold text-slate-secondary hover:text-slate-primary text-center transition-all duration-300 shadow-sm"
              >
                VIEW SPECS (1.2MB PDF)
              </a>
            </div>
          </div>

          {/* Hero Right: Live Telemetry Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl shadow-cyber-card relative overflow-hidden p-1.5 hover:shadow-neon-teal-intense transition-all duration-300">
              
              {/* Telemetry Header */}
              <div className="bg-slate-100/80 border border-slate-200/80 rounded-t-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full shadow-sm" />
                    <span className="w-3 h-3 bg-amber-400 rounded-full shadow-sm" />
                    <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm" />
                  </div>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <span className="font-mono text-xs font-bold text-slate-muted">RFID_GRID_CONTROLLER_V4.02</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsScanning(prev => !prev)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-colors ${
                      isScanning 
                        ? 'bg-sky-100 text-sky-700 border border-sky-200' 
                        : 'bg-slate-200 text-slate-600 border border-transparent'
                    }`}
                  >
                    {isScanning ? '● LIVE SCANNING' : 'PAUSED'}
                  </button>
                  <span className="text-[10px] font-mono text-slate-muted">RSSI_CUT: -90dBm</span>
                </div>
              </div>

              {/* Telemetry Main Interface */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left Side: Real-time scan log */}
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-4 relative h-[260px] overflow-hidden flex flex-col justify-between shadow-inner">
                  {/* Radar scanner grid glow line (Vibrant safety orange radar scan) */}
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-0.5 bg-safety-orange/50 animate-scan shadow-neon-orange pointer-events-none" />
                  )}
                  
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2 flex justify-between uppercase">
                      <span>Live RFID Log Feed</span>
                      <span className="text-safety-orange font-bold">{tagCount} Identified</span>
                    </div>

                    <div className="mt-2.5 space-y-2">
                      <AnimatePresence initial={false}>
                        {liveLogs.map((log) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[11px] font-mono flex items-center justify-between py-1 border-b border-slate-900 text-slate-200"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                log.status === 'active' ? 'bg-safety-orange animate-pulse' : log.status === 'calibrated' ? 'bg-emerald-400' : 'bg-amber-400'
                              }`} />
                              <span className="text-slate-600">[{log.timestamp}]</span>
                              <span className="text-white font-bold">{log.tagId}</span>
                              <span className="text-slate-400 truncate">{log.assetClass}</span>
                            </div>
                            <span className="text-sky-400 font-semibold pl-1 font-mono">{log.signalStrength}dBm</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Local Hardware diagnostics */}
                  <div className="border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>Power: PoE (48V)</span>
                    <span>T-Beam: 30dBm</span>
                    <span>Antennas: 4 active</span>
                  </div>
                </div>

                {/* Right Side: High-density data dials */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  
                  {/* Database Wallet Sync State */}
                  <div className="bg-white/70 border border-white/60 backdrop-blur-xl rounded-lg p-4 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-neon-teal hover:bg-white/90 transition-all duration-300">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-muted">
                      <span>Sqlite WAL Sync</span>
                      <Icons.Database className="w-4 h-4 text-sky-500 animate-pulse-subtle" />
                    </div>
                    <div className="my-1.5">
                      <div className="text-2xl font-display font-bold text-slate-primary">0 Queued</div>
                      <div className="text-[10px] font-mono text-slate-secondary">Local store committed.</div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 w-full" />
                    </div>
                  </div>

                  {/* Dynamic Tag Scan Density */}
                  <div className="bg-white/70 border border-white/60 backdrop-blur-xl rounded-lg p-4 flex flex-col justify-between h-[125px] shadow-sm hover:shadow-neon-teal hover:bg-white/90 transition-all duration-300">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-muted">
                      <span>Tag Pulse Density</span>
                      <Icons.Activity className="w-4 h-4 text-sky-500" />
                    </div>
                    
                    {/* Simulated live visual sparkline bars */}
                    <div className="h-10 flex items-end justify-between gap-1 mt-1 bg-slate-50 border border-slate-100 p-1.5 rounded">
                      {signalGraph.map((val, idx) => (
                        <div 
                          key={idx} 
                          className="w-full bg-sky-400/80 hover:bg-sky-500 rounded-t-sm transition-colors"
                          style={{ height: `${val}%` }}
                        />
                      ))}
                    </div>

                    <div className="text-[9px] font-mono text-slate-secondary flex justify-between items-center pt-1 border-t border-slate-100">
                      <span>Avg RSSI: -71dBm</span>
                      <span>Rate: 14.8/s</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
          FEATURES GRID (High-Density, Interactive Demonstrations)
          ============================================================================ */}
      <section id="features" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50">
        <div className="absolute inset-0 bg-cyber-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-electric-indigo uppercase">Operational Grid System</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary">
              Critical Capabilities Built for Harsh Deployments
            </p>
            <p className="text-slate-secondary text-base max-w-xl mx-auto">
              Our infrastructure is engineered specifically for low-performance networks and extreme conditions. Click or interact with any feature below to test its system logic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Real-time RFID Tracking */}
            <div className="border border-white/50 bg-white/80 backdrop-blur-xl hover:border-electric-indigo/40 hover:shadow-cyber-card transition-all duration-300 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-sky-50 text-sky-600 border border-sky-100 p-3 rounded-lg w-fit mb-5">
                  <Icons.RFID className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-primary mb-2">Real-time RFID Beam Tracking</h3>
                <p className="text-slate-secondary text-sm leading-relaxed mb-6">
                  Fine-tune antenna power dynamically from edge software modules. Target asset clusters ranging from close proximity up to 30 meters.
                </p>
              </div>

              {/* Interactive Signal Adjuster Demo */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg font-mono text-xs space-y-3 text-slate-300 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-[10px] text-slate-400 uppercase font-bold">
                  <span>Antenna Coverage Settings</span>
                  <span className="text-safety-orange">RSSI: {signalRssi}dBm</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Beam Range Radius</span>
                    <span className="text-white font-bold">{rfidRange} meters</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={rfidRange}
                    onChange={(e) => setRfidRange(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-safety-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[10px]">
                  <div>
                    <div className="text-slate-500">Est. Assets Identified</div>
                    <div className="text-white font-bold text-sm">{detectedCount} Units</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Power Consumption</div>
                    <div className="text-white font-bold text-sm">{Math.round(rfidRange * 0.9 + 2)} W</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Energy-Sector Specialized */}
            <div className="border border-white/50 bg-white/80 backdrop-blur-xl hover:border-electric-indigo/40 hover:shadow-cyber-card transition-all duration-300 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-sky-50 text-sky-600 border border-sky-100 p-3 rounded-lg w-fit mb-5">
                  <Icons.Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-primary mb-2">ATEX Zone 1 Specialized</h3>
                <p className="text-slate-secondary text-sm leading-relaxed mb-6">
                  Intrinsically safe hardware configurations designed to manage high-value high-pressure valves, drill pipe casing strings, and subsea assemblies.
                </p>
              </div>

              {/* Interactive Telemetry & Calibration Calibration Dial */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg font-mono text-xs space-y-3 text-slate-300 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-[10px] text-slate-400 uppercase font-bold">
                  <span>Zone 1 Flow Telemetry</span>
                  <span className="text-emerald-400">EX SAFETY OK</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono">VALVE_PRESSURE_A1</div>
                    <div className="text-base font-bold text-white">{pressure} PSI</div>
                  </div>
                  <button 
                    onClick={triggerCalibration}
                    disabled={isCalibrating}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase border border-safety-orange transition-colors ${
                      isCalibrating 
                        ? 'bg-slate-900 text-slate-500 border-transparent cursor-not-allowed' 
                        : 'bg-safety-orange/10 text-safety-orange hover:bg-safety-orange hover:text-white'
                    }`}
                  >
                    {isCalibrating ? 'CALIBRATING...' : 'CALIBRATE'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[10px]">
                  <div>
                    <div className="text-slate-500">Ex Temperature</div>
                    <div className="text-white font-bold text-sm">42.8°C</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last Calibration</div>
                    <div className="text-white font-bold text-sm">{calibratedAt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Offline-First Synchronization */}
            <div className="border border-white/50 bg-white/80 backdrop-blur-xl hover:border-electric-indigo/40 hover:shadow-cyber-card transition-all duration-300 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-sky-50 text-sky-600 border border-sky-100 p-3 rounded-lg w-fit mb-5">
                  <Icons.WifiOff className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-primary mb-2">Offline-First Synchronizer</h3>
                <p className="text-slate-secondary text-sm leading-relaxed mb-6">
                  Unstable offshore networks will never interrupt your scan streams. Log transactions into a local SQLite queue and flush immediately on system reconnection.
                </p>
              </div>

              {/* Interactive Sync Simulator */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg font-mono text-xs space-y-3 text-slate-300 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-[10px] text-slate-400 uppercase font-bold">
                  <span>Network Sync Pipeline</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    <span className={isOnline ? 'text-emerald-500' : 'text-red-500'}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">SQLite WAL buffer</span>
                    <div className="text-base font-bold text-white">{offlineQueue} Scans</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsOnline(!isOnline)}
                      className={`px-2 py-1.5 rounded text-[9px] font-bold border transition-colors ${
                        isOnline 
                          ? 'border-red-400/50 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white' 
                          : 'border-sky-500 bg-sky-950/20 text-sky-400 hover:bg-sky-600 hover:text-white'
                      }`}
                    >
                      {isOnline ? 'DISCONNECT' : 'RECONNECT'}
                    </button>

                    {!isOnline && (
                      <button
                        onClick={forceSync}
                        disabled={offlineQueue === 0 || isSyncing}
                        className={`px-2 py-1.5 rounded text-[9px] font-bold border border-safety-orange bg-safety-orange text-white hover:bg-safety-orange-hover transition-colors flex items-center space-x-1 ${
                          (offlineQueue === 0 || isSyncing) ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSyncing ? (
                          <Icons.Refresh className="w-3 h-3 animate-spin" />
                        ) : (
                          <span>SYNC ({offlineQueue})</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 leading-snug">
                  {isOnline 
                    ? "✓ Connected to satellite array. Committing scans instantaneously." 
                    : "⚠️ Connection interrupted. Transmissions writing to local SSD."}
                </div>
              </div>
            </div>

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
            <div className="inline-flex items-center space-x-2 bg-sky-50 border border-sky-200/80 px-4 py-1.5 rounded-full text-xs font-mono text-sky-600 font-bold w-fit shadow-sm">
              <Icons.Terminal className="w-4 h-4 text-sky-600" />
              <span>Developer-First Platform API</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary leading-tight">
              Modular Integration for Industrial IoT Pipelines
            </h2>

            <p className="text-slate-secondary text-sm sm:text-base leading-relaxed">
              IronFlow is developer-first. Query active rig telemetry, sync batches of offline RFID readings, or assess antenna beam configurations using simple, secure JSON API endpoints.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-sky-600 mt-1 shadow-sm">
                  <Icons.Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-primary">Full-featured Edge SDKs</h3>
                  <p className="text-slate-secondary text-sm">Pre-built endpoints for Golang, Rust, Python, and TypeScript, engineered with retry-with-backoff pipelines.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-sky-600 mt-1 shadow-sm">
                  <Icons.Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-primary">SCADA / PLC Seamless Bridging</h3>
                  <p className="text-slate-secondary text-sm">Pre-built OPC-UA and Modbus converters map physical RFID tags directly into enterprise assets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Interactive Playground Right */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl overflow-hidden shadow-cyber-card p-1.5">
              
              {/* Header */}
              <div className="bg-slate-100 border border-slate-200 rounded-t-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icons.Terminal className="w-4 h-4 text-sky-600" />
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
                          ? 'bg-sky-50 text-sky-600 border-sky-300 font-bold shadow-sm'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
                      }`}
                    >
                      <span className={`font-bold mr-1.5 ${
                        route.method === 'GET' ? 'text-emerald-600' : 'text-sky-600'
                      }`}>
                        {route.method}
                      </span>
                      {route.path}
                    </button>
                  ))}
                </div>

                {/* Route description */}
                <p className="text-slate-secondary font-mono text-[11px] bg-slate-50 px-3 py-2 border-l-2 border-sky-500 rounded">
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
          EDGE NODE LATENCY MONITOR SECTION (Competitor Alignment / Datadog style)
          ============================================================================ */}
      <section id="specs" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-electric-indigo uppercase">Distributed Operations</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-primary">Edge Node Telemetry Matrix</p>
            <p className="text-slate-secondary text-base max-w-xl mx-auto">
              Inspect latency routing parameters in real-time across active energy production fields. Tap the Network Storm simulator to test satellite backup routing protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Edge Map Visual Left */}
            <div className="lg:col-span-8 bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl p-6 shadow-cyber-card hover:shadow-neon-teal-intense transition-all duration-300 relative">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <Icons.Server className="w-4 h-4 text-sky-500" />
                  <span className="text-slate-primary font-bold">NODE_STREAM_ROUTING</span>
                </div>

                {/* Storm toggle */}
                <button
                  onClick={() => setStormActive(!stormActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all border ${
                    stormActive
                      ? 'bg-red-50 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {stormActive ? 'STORM SIMULATOR: ACTIVE (100% loss)' : 'SIMULATE SAT-STORM'}
                </button>
              </div>

              {/* Simple geometric network visual nodes */}
              <div className="relative h-[260px] bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-around p-4 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-grid-pattern bg-[size:15px_15px] opacity-20 pointer-events-none" />
                
                {/* Line connects node 1, 2, 3 to Central Cloud */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <line x1="16%" y1="65%" x2="50%" y2="40%" stroke="#334155" strokeWidth="2.5" strokeDasharray="5" />
                  <line x1="84%" y1="65%" x2="50%" y2="40%" stroke="#334155" strokeWidth="2.5" strokeDasharray="5" />
                  <line x1="50%" y1="85%" x2="50%" y2="40%" stroke="#334155" strokeWidth="2.5" strokeDasharray="5" />
                  
                  {/* Glowing data flow lines if normal, slower/red if storm */}
                  <line 
                    x1="16%" y1="65%" x2="50%" y2="40%" 
                    stroke={stormActive ? '#EF4444' : '#0EA5E9'} 
                    strokeWidth="2" 
                    strokeDasharray="8 20" 
                    className="animate-pulse-subtle" 
                  />
                  <line 
                    x1="84%" y1="65%" x2="50%" y2="40%" 
                    stroke={stormActive ? '#EF4444' : '#0EA5E9'} 
                    strokeWidth="2" 
                    strokeDasharray="8 20" 
                    className="animate-pulse-subtle" 
                  />
                </svg>

                {/* Node 1: Gulf of Mexico */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className={`p-3 rounded-full border mb-2 transition-all shadow-sm ${
                    stormActive ? 'bg-red-950/80 border-red-500 text-red-400 animate-bounce' : 'bg-slate-900 border-slate-800 text-sky-400'
                  }`}>
                    <Icons.Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">GULF_EDGE_RIG04</span>
                  <span className={`font-mono text-[10px] font-bold ${stormActive ? 'text-red-500' : 'text-sky-600'}`}>
                    {latencies.gulf}ms
                  </span>
                </div>

                {/* Main Node: Houston Central Hub */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className="p-4.5 rounded-full border border-sky-800 bg-sky-950 text-sky-400 mb-2 shadow-sm animate-pulse-subtle">
                    <Icons.Server className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">CENTRAL_HUB_TX</span>
                  <span className="font-mono text-[9px] text-slate-500">SYS_PRIMARY</span>
                </div>

                {/* Node 3: North Sea Satellite platform */}
                <div className="flex flex-col items-center z-10 text-center">
                  <div className={`p-3 rounded-full border mb-2 transition-all shadow-sm ${
                    stormActive ? 'bg-red-950/80 border-red-500 text-red-400 animate-bounce' : 'bg-slate-900 border-slate-800 text-sky-400'
                  }`}>
                    <Icons.Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-300">NORTH_SEA_SAT</span>
                  <span className={`font-mono text-[10px] font-bold ${stormActive ? 'text-red-500' : 'text-sky-600'}`}>
                    {latencies.northSea}ms
                  </span>
                </div>

              </div>
            </div>

            {/* Metrics Info cards Right */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Failover card info */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 font-mono text-xs shadow-sm">
                <div className="text-[10px] text-slate-muted font-bold uppercase mb-1.5">Backup Routing Strategy</div>
                <h3 className="text-slate-primary font-bold text-sm mb-2">Automated WAN Fallback</h3>
                <p className="text-slate-secondary text-[11px] leading-relaxed">
                  In case of satellite packet loss (simulated in the Sat-Storm), the edge array dynamically shifts caching mechanisms to localized SSD buffers, maintaining database integrity without throwing client-facing timeouts.
                </p>
              </div>

              {/* Hardware specifications list */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 font-mono text-xs shadow-sm">
                <div className="text-[10px] text-slate-muted font-bold uppercase mb-2">Edge System Tech Specs</div>
                <ul className="space-y-2 text-[11px]">
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">RFID Chipset:</span>
                    <span className="text-slate-primary font-semibold">Impinj Monza R6-P</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">Compliance:</span>
                    <span className="text-slate-primary font-semibold">EPCglobal Class 1 Gen 2</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-secondary">OS compatibility:</span>
                    <span className="text-slate-primary font-semibold">Linux (Embedded Build)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-secondary">Data Sync Protocol:</span>
                    <span className="text-slate-primary font-semibold">gRPC / TLS 1.3</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================================
          INTERACTIVE DEMO REQUEST FORM (HIGH-CONVERTING LEAD GEN)
          ============================================================================ */}
      <section id="demo" className="py-24 md:py-32 max-w-4xl mx-auto px-4">
        
        <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-xl p-8 sm:p-12 shadow-cyber-card relative overflow-hidden">
          
          <div className="absolute top-0 right-10 bg-sky-50 text-sky-600 border-b border-x border-sky-100 px-4 py-1.5 rounded-b font-mono text-[9px] font-bold tracking-wider uppercase">
            ATEX COMPLIANT SECURE FORM
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-primary">
              Request Free Demo Access
            </h2>
            <p className="text-slate-secondary text-base leading-relaxed">
              Get immediate login credentials to try our **interactive software simulator** online and download detailed RFID hardware specifications.
            </p>
          </div>

          {formStep === 'idle' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Address */}
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
                    placeholder="sre@energycorp.com"
                    className="bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-lg p-3 text-sm text-slate-primary focus:outline-none focus:ring-2 focus:ring-sky-100 font-mono shadow-sm transition-colors"
                  />
                </div>

                {/* Asset Volume range */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="volume" className="font-mono text-xs font-bold text-slate-secondary uppercase">
                    Estimated Tagged Assets
                  </label>
                  <select
                    id="volume"
                    value={assetVolume}
                    onChange={(e) => setAssetVolume(e.target.value)}
                    className="bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-lg p-3 text-sm text-slate-primary focus:outline-none focus:ring-2 focus:ring-sky-100 font-mono cursor-pointer shadow-sm transition-colors"
                  >
                    <option value="1k_10k">1,000 to 10,000 assets</option>
                    <option value="10k_100k">10,000 to 100,000 assets</option>
                    <option value="100k_plus">100,000+ assets</option>
                  </select>
                </div>
              </div>

              {/* Environment profile */}
              <div className="flex flex-col space-y-2">
                <label className="font-mono text-xs font-bold text-slate-secondary uppercase">
                  Deployment Environment Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'zone_1', name: 'ATEX Zone 1 (Hazardous)', desc: 'Gaseous / offshore rigs' },
                    { id: 'zone_2', name: 'ATEX Zone 2 (Nominal)', desc: 'Refineries / pipelines' },
                    { id: 'standard', name: 'Standard Logistics', desc: 'Central logistics yards' }
                  ].map((env) => (
                    <label
                      key={env.id}
                      onClick={() => setEnvironmentProfile(env.id)}
                      className={`border rounded-lg p-4 flex flex-col justify-between cursor-pointer font-mono transition-all shadow-sm ${
                        environmentProfile === env.id
                          ? 'border-electric bg-gradient-to-br from-blue-50 to-indigo-50/40 text-slate-primary font-semibold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:text-slate-700'
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
                  className="w-full bg-gradient-to-r from-electric via-electric-indigo to-electric-blue text-white hover:opacity-95 px-6 py-4.5 rounded-lg text-sm font-display font-bold tracking-widest transition-all duration-300 shadow-neon-teal-intense uppercase active:scale-[0.99]"
                >
                  GET FREE DEMO ACCESS
                </button>
              </div>

              <div className="text-center font-mono text-[10px] text-slate-secondary">
                🔒 Data encrypted in transit using SHA-256 standards. Zero commercial spam.
              </div>

            </form>
          )}

          {/* Animated State Machine Submission Steps */}
          {formStep !== 'idle' && (
            <div className="h-[250px] flex flex-col items-center justify-center font-mono text-xs space-y-4">
              
              {formStep === 'verifying' && (
                <div className="text-center space-y-3">
                  <Icons.Refresh className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
                  <p className="text-sky-600 font-bold">VERIFYING CORPORATE GATEWAY COMPLIANCE...</p>
                  <p className="text-[10px] text-slate-secondary">Reading domain authority MX record and zone DNS...</p>
                </div>
              )}

              {formStep === 'allocating' && (
                <div className="text-center space-y-3">
                  <Icons.Cpu className="w-8 h-8 text-electric-indigo animate-pulse mx-auto" />
                  <p className="text-electric-indigo font-bold">SETTING UP DEMO ACCOUNT...</p>
                  <p className="text-[10px] text-slate-secondary">Configuring secure access credentials for your domain...</p>
                </div>
              )}

              {formStep === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-300 flex items-center justify-center text-sky-600 mx-auto shadow-sm animate-bounce">
                    <Icons.Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-primary uppercase tracking-wider">Demo Access Granted!</h3>
                  <p className="text-slate-secondary text-sm max-w-md mx-auto leading-relaxed font-sans">
                    Account configured successfully. We have sent an email to <span className="text-slate-primary font-bold">{email}</span> containing your temporary login credentials, access link to the web simulator, and download package for the hardware specifications.
                  </p>
                  <button 
                    onClick={() => {
                      setEmail('');
                      setFormStep('idle');
                    }}
                    className="border border-slate-200 hover:border-slate-300 text-slate-secondary hover:text-slate-primary px-4 py-2 rounded-lg text-[10px]"
                  >
                    RESET FORM
                  </button>
                </motion.div>
              )}

            </div>
          )}

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
                <span className="font-display font-bold text-lg tracking-wider text-slate-primary">IronFlow Softwares</span>
              </div>
              <p className="text-slate-secondary text-center md:text-left mt-1">
                © {new Date().getFullYear()} IronFlow Software, Inc. All rights reserved. Deployed via Edge Core.
              </p>
            </div>

            {/* Industrial IoT & SRE Compliance Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                ATEX ZONE 1 & 2 COMPATIBLE
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                IECEX INTRINSIC SAFETY CERTIFIED
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                SOC2 TYPE II AUDITED
              </span>
              <span className="border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-lg text-slate-primary font-semibold shadow-sm">
                SHA-256 END-TO-END TLS
              </span>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
