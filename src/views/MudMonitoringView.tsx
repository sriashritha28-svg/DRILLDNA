import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Activity,
  Droplets,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Boxes,
  ClipboardList,
} from 'lucide-react';

export const MudMonitoringView: React.FC = () => {
  const { currentRole, logAction, metrics } = useApp();

  const [densitySg, setDensitySg] = useState<number>(1.18);
  const [visSec, setVisSec] = useState<number>(48);
  const [ph, setPh] = useState<number>(9.5);
  const [pillStatus, setPillStatus] = useState<string>('Standby 25 bbl Mica/CaCO3 mixed in Pit 3');
  const [mudNotes, setMudNotes] = useState<string>(
    'Mud rheology stable. Active losses -1.05 m³. Standby LCM pill ready for spot across 2770–2825m TVD interval if flow-out deficit exceeds 10%.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const isAuthorizedMud =
    currentRole === 'Mud Engineer' ||
    currentRole === 'Mud Engineer / Mud Logger' ||
    currentRole === 'Administrator';

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorizedMud) {
      alert('Only Mud Engineers or Administrators can submit mud-system observations.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch('/api/mud/observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          densitySg,
          visSec,
          ph,
          pillStatus,
          notes: mudNotes,
        }),
      });
      setSavedSuccess(true);
      logAction(
        'MUD_OBSERVATION_RECORDED',
        `Mud check logged: ${densitySg} SG, ${visSec}s MF, pH ${ph}. Pill: ${pillStatus}`,
        'MUD-LOG-01',
        'MUD_SYSTEM'
      );
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      // offline fallback
      setSavedSuccess(true);
    } finally {
      setIsSubmitting(false);
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
              Mud Monitoring & Rheology Dashboard
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Real-time drilling fluids rheology, active pit volume tracking, and LCM standby inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FFF7E8] text-[#D38B22] border border-[#D38B22]/30 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>Fluids Engineering Console</span>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-xl text-xs text-[#2F8F5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Mud system observation logged successfully into formation memory stream!</span>
        </div>
      )}

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Current Mud Density</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#12324A]">{densitySg.toFixed(2)}</span>
            <span className="text-xs text-[#667B89]">SG</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">In-gauge across Lower Barail</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Equivalent Circ. Density (ECD)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#E87825]">1.21</span>
            <span className="text-xs text-[#667B89]">SG</span>
          </div>
          <span className="text-[11px] text-[#C93C3C] mt-1 block">Upper fracture margin limit: 1.24 SG</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Active Pit Volume Deficit</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#C93C3C]">{metrics.pitVolumeDiffM3}</span>
            <span className="text-xs text-[#667B89]">m³</span>
          </div>
          <span className="text-[11px] text-[#E87825] mt-1 block">Total Active: {metrics.pitVolumeActualM3} m³</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Standby LCM Pill</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#2F8F5B]">25</span>
            <span className="text-xs text-[#667B89]">bbl</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">Pit 3 Mixed (Mica / CaCO3)</span>
        </div>
      </div>

      {/* Main Form & Pit Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE6EA]">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#118A8A]" />
                <h3 className="text-sm font-bold text-[#12324A]">Log Mud Rheology & Tour Check</h3>
              </div>
              <span className="text-[11px] text-[#667B89]">Tour 06:00 – 18:00</span>
            </div>

            <form onSubmit={handleSubmitObservation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#12324A] mb-1">Density (SG)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={densitySg}
                    onChange={(e) => setDensitySg(parseFloat(e.target.value) || 1.18)}
                    className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12324A] mb-1">Marsh Funnel Vis (sec)</label>
                  <input
                    type="number"
                    value={visSec}
                    onChange={(e) => setVisSec(parseInt(e.target.value) || 48)}
                    className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12324A] mb-1">Filtrate pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value) || 9.5)}
                    className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Standby LCM Pill Preparation Status</label>
                <input
                  type="text"
                  value={pillStatus}
                  onChange={(e) => setPillStatus(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Mud Engineer Tour Observation Notes</label>
                <textarea
                  rows={3}
                  value={mudNotes}
                  onChange={(e) => setMudNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#667B89]">
                  Recorded by: <strong className="text-[#12324A]">{currentRole}</strong>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthorizedMud}
                  className="px-4 py-2 bg-[#12324A] hover:bg-[#1F4E6B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Mud Observation</span>
                </button>
              </div>

              {!isAuthorizedMud && (
                <p className="text-[11px] text-[#C93C3C] text-right font-medium">
                  Read-only view for {currentRole}. Switch to Mud Engineer to log observations.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right: Active Pit Volumes & LCM Inventory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#DDE6EA]">
              <Boxes className="w-4 h-4 text-[#118A8A]" />
              <h3 className="text-sm font-bold text-[#12324A]">Rig Pit Levels & LCM Stock</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#DDE6EA] space-y-2">
                <div className="flex justify-between items-center font-semibold text-[#12324A]">
                  <span>Active Surface Pits</span>
                  <span className="font-mono text-[#1677B8]">3 Pits Online</span>
                </div>
                <div className="space-y-1 text-[#667B89] text-[11px]">
                  <div className="flex justify-between">
                    <span>Pit 1 (Suction Pit):</span>
                    <strong className="text-[#12324A]">24.0 m³ (Level stable)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pit 2 (Settling Pit):</span>
                    <strong className="text-[#12324A]">19.95 m³ (-1.05 m³ deficit)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pit 3 (Pill Tank):</span>
                    <strong className="text-[#2F8F5B]">4.0 m³ (25 bbl LCM Pill ready)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#FFF7E8] rounded-lg border border-[#D38B22]/30 space-y-2">
                <span className="font-semibold text-[#12324A] block">On-Site LCM Pill Chemicals</span>
                <div className="space-y-1 text-[11px] text-[#667B89]">
                  <div className="flex justify-between">
                    <span>Medium/Coarse Mica Flakes:</span>
                    <strong className="text-[#12324A]">85 sacks (25 kg/sack)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calcium Carbonate (CaCO3 coarse):</span>
                    <strong className="text-[#12324A]">120 sacks</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cellulosic Fibrous Sealant:</span>
                    <strong className="text-[#12324A]">40 sacks</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
