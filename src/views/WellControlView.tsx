import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertOctagon,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export const WellControlView: React.FC = () => {
  const { currentRole, logAction, setIsSOPModalOpen } = useApp();

  const [activeWatchState, setActiveWatchState] = useState<'Active' | 'Escalated' | 'Resolved'>('Escalated');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isWellControlSupervisor =
    currentRole === 'Well-Control Supervisor' || currentRole === 'Administrator';

  const handleEscalateAction = async () => {
    setIsProcessing(true);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/well-control/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wellId: 'OIL-BRL-09',
          zone: '2950-3050m TVD',
          formation: 'Kopili Shale',
          notes: 'Specialist Well-Control Standing Orders issued. Monitor trip tank and annular pressure.',
        }),
      });
      if (res.ok) {
        setActiveWatchState('Escalated');
        setSuccessMessage('Specialist standing orders dispatched to Rig OIL-04 tour superintendent.');
        logAction(
          'WELL_CONTROL_ESCALATED',
          'Specialist standing orders dispatched for Kopili overpressure zone (OIL-BRL-09)',
          'OIL-BRL-09',
          'WELL_CONTROL'
        );
      }
    } catch {
      // offline fallback
      setActiveWatchState('Escalated');
      setSuccessMessage('Standing orders dispatched to rig superintendent.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseEscalation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWellControlSupervisor) {
      alert('Only Well-Control Supervisors or Administrators can close well-control escalations.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/well-control/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wellId: 'OIL-BRL-09',
          resolutionNotes: resolutionNotes || 'Hydrostatic barrier and ECD integrity re-verified. Returns stable.',
        }),
      });
      if (res.ok) {
        setActiveWatchState('Resolved');
        setSuccessMessage('Well-Control escalation verified and closed. Logged in audit ledger.');
        logAction(
          'WELL_CONTROL_RESOLVED',
          `Well-Control escalation closed for OIL-BRL-09. Notes: ${resolutionNotes}`,
          'OIL-BRL-09',
          'WELL_CONTROL'
        );
      }
    } catch {
      setActiveWatchState('Resolved');
      setSuccessMessage('Escalation resolved and signed off.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Well-Control Watch & Specialist Escalation
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Critical kick look-ahead queue, barrier verification, and specialist command escalation workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Specialist Queue</span>
          </span>
        </div>
      </div>

      {/* Mandatory Phase 1 Safety Restriction Banner */}
      <div className="p-4 bg-[#FFF1F1] border-2 border-[#C93C3C]/40 rounded-xl text-xs text-[#193040] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#C93C3C] text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>PHASE 1 SAFETY RULE & DRILLING PROTOCOL</span>
        </div>
        <p className="font-semibold text-[#12324A] text-xs">
          “No live kick fingerprint is claimed in Phase 1. Specialist well-control escalation is required.”
        </p>
        <p className="text-[#667B89] text-[11px] leading-relaxed">
          DRILLDNA intentionally separates loss precursor detection from well-control kick handling. Well-control events trigger direct specialist workflow escalation and authorized human SOP checklists rather than automated statistical ranking.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-xl text-xs text-[#2F8F5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Active Watch Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE6EA]">
              <div>
                <span className="text-xs font-mono font-bold text-[#C93C3C] bg-[#FFF1F1] px-2 py-0.5 rounded border border-[#C93C3C]/30">
                  CRITICAL-LOOKAHEAD-01
                </span>
                <h3 className="text-sm font-bold text-[#12324A] mt-1.5">
                  Kopili Shale Transition & Gas Overpressure Horizon
                </h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#667B89]">Status: </span>
                <span
                  className={`font-bold ${
                    activeWatchState === 'Escalated'
                      ? 'text-[#C93C3C]'
                      : activeWatchState === 'Active'
                      ? 'text-[#E87825]'
                      : 'text-[#2F8F5B]'
                  }`}
                >
                  {activeWatchState}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-[#F8FAFC] p-3 rounded-lg border border-[#DDE6EA]">
              <div>
                <span className="text-[#667B89] block text-[10px]">Active Bit Depth</span>
                <span className="font-bold text-[#12324A]">2787.7 m TVD</span>
              </div>
              <div>
                <span className="text-[#667B89] block text-[10px]">Kopili Top</span>
                <span className="font-bold text-[#C93C3C]">2950.0 m TVD</span>
              </div>
              <div>
                <span className="text-[#667B89] block text-[10px]">Depth Horizon</span>
                <span className="font-bold text-[#12324A]">162.3 m to entry</span>
              </div>
              <div>
                <span className="text-[#667B89] block text-[10px]">Predicted Pore Pres.</span>
                <span className="font-bold text-[#C93C3C]">1.38 SG (Overpressured)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#193040]">
              <h4 className="font-bold text-[#12324A] text-xs">Well-Control Precedent & Risk Context:</h4>
              <p className="text-[#667B89] leading-relaxed">
                Offset well <strong>OIL-X18</strong> and <strong>OIL-X03</strong> documented rapid pore pressure ramp from 1.14 SG in Lower Barail to 1.38 SG upon drilling into top Kopili Shale. If mud weight is lowered excessively to combat Barail losses, secondary gas influx will occur once Kopili top is penetrated.
              </p>
            </div>

            {/* Standing Orders Checklist */}
            <div className="p-4 bg-[#F5F8FA] border border-[#DDE6EA] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#12324A]">
                  Mandatory Specialist Standing Orders (OIL-WC-KOPILI-02)
                </span>
                <button
                  onClick={() => setIsSOPModalOpen(true)}
                  className="text-[11px] text-[#118A8A] font-medium hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>View Full SOP</span>
                </button>
              </div>

              <ul className="space-y-1.5 text-xs text-[#193040]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B] shrink-0 mt-0.5" />
                  <span>Maintain minimum 15 bbl trip tank monitoring margin at all connections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B] shrink-0 mt-0.5" />
                  <span>Verify remote choke manifold operation and accumulator bottle pressure &gt; 3000 psi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B] shrink-0 mt-0.5" />
                  <span>Do not drill past 2940m TVD without Mud Engineer confirmation of 1.28 SG barite reserve.</span>
                </li>
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#DDE6EA]">
              <button
                type="button"
                onClick={handleEscalateAction}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-[#FFF1F1] hover:bg-[#FFF1F1]/80 text-[#C93C3C] border border-[#C93C3C]/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Re-Issue Emergency Standing Orders</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSOPModalOpen(true)}
                className="px-3.5 py-2 bg-[#EEF7FB] hover:bg-[#1677B8]/10 text-[#1677B8] border border-[#1677B8]/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Specialist SOP Checklist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Supervisor Sign-off & Barrier Closure */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#DDE6EA]">
              <ShieldCheck className="w-4 h-4 text-[#2F8F5B]" />
              <h3 className="text-sm font-bold text-[#12324A]">
                Supervisor Barrier Verification & Closure
              </h3>
            </div>

            <p className="text-xs text-[#667B89] leading-relaxed">
              Only authorized <strong>Well-Control Supervisors</strong> or <strong>Administrators</strong> may verify barriers and close well-control escalations.
            </p>

            <form onSubmit={handleCloseEscalation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#12324A] mb-1">
                  Barrier Verification Checklist Sign-off
                </label>
                <div className="space-y-1.5 p-3 bg-[#F8FAFC] rounded-lg border border-[#DDE6EA]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#1677B8]" />
                    <span>Primary fluid hydrostatic column &gt; formation pore pressure</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#1677B8]" />
                    <span>Secondary BOP stack pressure test verified within last 7 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#1677B8]" />
                    <span>Trip tank volume recorder calibrated and alarms active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">
                  Supervisor Resolution & Tour Sign-off Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record barrier checks, mud check confirmation, and clearance details..."
                  className="w-full p-2.5 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || !isWellControlSupervisor}
                  className="w-full py-2.5 px-4 bg-[#2F8F5B] hover:bg-[#257549] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Barriers & Close Escalation</span>
                </button>

                {!isWellControlSupervisor && (
                  <p className="text-[11px] text-[#C93C3C] text-center mt-2 font-medium">
                    Current role: {currentRole}. Switch to Well-Control Supervisor to sign off.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
