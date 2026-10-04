import React from 'react';
import { useApp } from '../context/AppContext';
import { MODEL_VERSIONS } from '../data/mockData';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Layers,
  Shield,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Sliders,
  BarChart2,
} from 'lucide-react';

export const ModelVersionsView: React.FC = () => {
  const { simulator, setSimulator } = useApp();

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Model Versions & Governance
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Formation Fingerprint ML model registry, calibration weights, and mid-well locking governance
          </p>
        </div>

        {/* Mid-Well Lock Status */}
        <div className="flex items-center gap-2 bg-white border border-[#DDE6EA] px-3.5 py-1.5 rounded-lg text-xs">
          {simulator.modelLocked ? (
            <Lock className="w-3.5 h-3.5 text-[#2F8F5B]" />
          ) : (
            <Unlock className="w-3.5 h-3.5 text-[#E87825]" />
          )}
          <span className="text-[#667B89]">Mid-Well Drift Lock:</span>
          <span className={`font-bold ${simulator.modelLocked ? 'text-[#2F8F5B]' : 'text-[#E87825]'}`}>
            {simulator.modelLocked ? 'Locked for OIL-BRL-09' : 'Unlocked (Awaiting Acceptance)'}
          </span>
        </div>
      </div>

      {/* Mid-Well Lock Rule Banner */}
      <div className="p-3.5 bg-[#EEF7FB] border border-[#1677B8]/30 rounded-xl text-xs text-[#193040] leading-relaxed flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#1677B8] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#12324A]">Regulatory Integrity Rule:</strong> Active well remains on current model version until engineer acceptance. Model upgrades cannot automatically alter ongoing advisory evaluations without formal engineer sign-off.
          </div>
        </div>

        <button
          onClick={() =>
            setSimulator((prev) => ({ ...prev, modelLocked: !prev.modelLocked }))
          }
          className="px-3 py-1 bg-white border border-[#1677B8]/40 hover:bg-slate-50 text-[#1677B8] rounded text-xs font-semibold shrink-0 transition-colors"
        >
          {simulator.modelLocked ? 'Simulate Model Drift' : 'Accept & Lock Model'}
        </button>
      </div>

      {/* Active Model Feature Weights Card */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE6EA]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#12324A]">Barail-FP v1.4 (Active Deployment)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30 font-bold">
                PR-AUC: 0.91
              </span>
            </div>
            <p className="text-xs text-[#667B89] mt-0.5">
              Fingerprint: FP-BRL-v1.4.2 · Calibrated across 14 offset wells in Upper Assam Basin
            </p>
          </div>

          <div className="text-right text-xs font-mono-tabular">
            <span className="text-[#667B89]">Training Set:</span>{' '}
            <strong className="text-[#12324A]">28 historical intervals</strong>
          </div>
        </div>

        {/* Feature Weight Progress Bars */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-[#12324A]">Precursor Feature Weights in Fingerprint Similarity:</div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#193040]">1. Flow-Out Returns Deficit Rate</span>
                <span className="font-mono-tabular font-bold text-[#1677B8]">35% Weight</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1677B8] rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#193040]">2. Surface Torque Chatter & Pack-off Gradient</span>
                <span className="font-mono-tabular font-bold text-[#E87825]">28% Weight</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E87825] rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#193040]">3. Active Mud Pit Volume Depletion Rate</span>
                <span className="font-mono-tabular font-bold text-[#C93C3C]">22% Weight</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#C93C3C] rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#193040]">4. Standpipe Pressure (SPP) Differential</span>
                <span className="font-mono-tabular font-bold text-[#118A8A]">15% Weight</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#118A8A] rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Registry Table */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#DDE6EA]">
          <h3 className="font-bold text-[#12324A] text-sm">Formation Fingerprint Model Registry</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#F5F8FA] border-b border-[#DDE6EA] text-[#667B89]">
                <th className="p-3.5 font-semibold">Model Version</th>
                <th className="p-3.5 font-semibold">Target Formation</th>
                <th className="p-3.5 font-semibold">Release Date</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Validation PR-AUC</th>
                <th className="p-3.5 font-semibold">Training Cohort</th>
                <th className="p-3.5 font-semibold">Governance Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE6EA]/60 font-mono-tabular">
              {MODEL_VERSIONS.map((m) => (
                <tr key={m.versionId} className="hover:bg-[#F8FAFC]">
                  <td className="p-3.5 font-bold text-[#12324A]">
                    {m.versionId}
                  </td>

                  <td className="p-3.5 font-sans text-[#193040]">
                    {m.formationName}
                  </td>

                  <td className="p-3.5 text-[#667B89]">
                    {m.releaseDate}
                  </td>

                  <td className="p-3.5 font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.status.includes('Active')
                          ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                          : m.status === 'Staging'
                          ? 'bg-[#EEF7FB] text-[#1677B8] border border-[#1677B8]/30'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-[#12324A]">
                    {m.prAuc}
                  </td>

                  <td className="p-3.5 text-[#667B89]">
                    {m.trainingIntervalsCount} intervals ({m.offsetWellsCount} wells)
                  </td>

                  <td className="p-3.5 font-sans text-[#667B89] max-w-xs text-[11px]">
                    {m.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
