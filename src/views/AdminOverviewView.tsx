import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  ShieldCheck,
  Users,
  Layers,
  Radio,
  Lock,
  Unlock,
  Server,
  Activity,
  ArrowRight,
  Database,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminOverviewView: React.FC = () => {
  const { setActiveView, simulator, setSimulator, logAction } = useApp();

  const [adapterStatus, setAdapterStatus] = useState<boolean>(true);
  const [toggleNotice, setToggleNotice] = useState<string | null>(null);

  const toggleAdapter = async () => {
    const nextState = !adapterStatus;
    setAdapterStatus(nextState);
    setToggleNotice(`eRTMAC Adapter ${nextState ? 'Connected' : 'Paused / Standby'}`);
    logAction('ADAPTER_STATUS_CHANGED', `Admin toggled eRTMAC adapter to ${nextState ? 'Connected' : 'Paused'}`, 'ADAPTER-01', 'INTEGRATION_ADAPTER');
    setTimeout(() => setToggleNotice(null), 3000);
  };

  const toggleModelLock = () => {
    const nextLock = !simulator.modelLocked;
    setSimulator((prev) => ({ ...prev, modelLocked: nextLock }));
    logAction(
      'MODEL_LOCK_TOGGLED',
      `Admin toggled mid-well model drift lock to ${nextLock ? 'Locked' : 'Unlocked'}`,
      'MODEL-v2.4.1',
      'MODEL_REGISTRY'
    );
  };

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Administrator Platform Overview
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            System administration, RBAC access control, adapter connectivity, and model governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#12324A] text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2F8F5B]" />
            <span>Full System Administrator Access</span>
          </span>
        </div>
      </div>

      {toggleNotice && (
        <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-xl text-xs text-[#2F8F5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toggleNotice}</span>
        </div>
      )}

      {/* System Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">RBAC Security Layer</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#2F8F5B]">JWT Active</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">8 Seeded Pilot Roles</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">eRTMAC Adapter</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${adapterStatus ? 'text-[#2F8F5B]' : 'text-[#E87825]'}`}>
              {adapterStatus ? 'Connected' : 'Standby'}
            </span>
          </div>
          <span className="text-[11px] text-[#667B89] mt-1 block">WITSML v1.4 / Mock Stream</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Mid-Well Drift Lock</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${simulator.modelLocked ? 'text-[#2F8F5B]' : 'text-[#E87825]'}`}>
              {simulator.modelLocked ? 'Locked' : 'Unlocked'}
            </span>
          </div>
          <span className="text-[11px] text-[#667B89] mt-1 block">Model v2.4.1 Barail Fingerprint</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Audit Trail Ledger</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#1677B8]">SHA-256</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">Tamper-Resistant Log</span>
        </div>
      </div>

      {/* Main Admin Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Users & Roles */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#EEF7FB] text-[#1677B8] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12324A]">Users & Roles Management</h3>
            <p className="text-xs text-[#667B89] mt-1 leading-relaxed">
              Create, update, activate/deactivate user accounts, change RBAC assignments, and reset credentials.
            </p>
          </div>
          <button
            onClick={() => setActiveView('admin-users')}
            className="w-full py-2 px-3 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage Users & Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Adapter Controls */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF7E8] text-[#D38B22] flex items-center justify-center mb-3">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12324A]">eRTMAC Adapter Connectivity</h3>
            <p className="text-xs text-[#667B89] mt-1 leading-relaxed">
              Toggle live feed ingestion adapter between Mock Connected and Degraded Standby states.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={toggleAdapter}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                adapterStatus
                  ? 'bg-white text-[#C93C3C] border-[#C93C3C]/30 hover:bg-[#FFF1F1]'
                  : 'bg-[#2F8F5B] text-white border-[#2F8F5B] hover:bg-[#257549]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{adapterStatus ? 'Pause Live Adapter Stream' : 'Resume Live Adapter Stream'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Model Version & Drift Locking */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#F2EFFE] text-[#6941C6] flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12324A]">Model Registry & Drift Governance</h3>
            <p className="text-xs text-[#667B89] mt-1 leading-relaxed">
              Enforce regulatory integrity rule preventing automated model parameter drift mid-well.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={toggleModelLock}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                simulator.modelLocked
                  ? 'bg-[#EEF7FB] text-[#1677B8] border-[#1677B8]/30 hover:bg-[#1677B8]/10'
                  : 'bg-[#12324A] text-white border-[#12324A]'
              }`}
            >
              {simulator.modelLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{simulator.modelLocked ? 'Unlock Model Calibration' : 'Lock Model for Well OIL-BRL-09'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
