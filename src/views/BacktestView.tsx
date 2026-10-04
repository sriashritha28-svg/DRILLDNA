import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BACKTEST_RESULTS } from '../data/mockData';
import { BacktestResult, DataTier } from '../types';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  FileText,
  TrendingUp,
  Shield,
  Layers,
  BarChart2,
  Info,
} from 'lucide-react';

export const BacktestView: React.FC = () => {
  const [selectedWellId, setSelectedWellId] = useState<string>('OIL-X12');
  const [selectedTier, setSelectedTier] = useState<DataTier>('Tier 1');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [scrubPosition, setScrubPosition] = useState<number>(100);

  const selectedWellData =
    BACKTEST_RESULTS.find((w) => w.wellId === selectedWellId) || BACKTEST_RESULTS[0];

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Validation Sandbox
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Retrospective evaluation on held-out synthetic wells · Lead-time comparison vs static threshold alarms
          </p>
        </div>

        {/* Mandatory Label */}
        <div className="px-3.5 py-1.5 bg-[#FFF7E8] border border-[#D38B22]/40 rounded-lg text-xs font-semibold text-[#D38B22] shadow-2xs">
          Synthetic demonstration result — not a field-performance claim.
        </div>
      </div>

      {/* Methodology & Scope Explanation Banner */}
      <div className="p-3.5 bg-white border border-[#DDE6EA] rounded-xl text-xs text-[#667B89] leading-relaxed flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-[#1677B8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#12324A]">Evaluation Disclaimer:</strong> These values are generated from the synthetic dataset and demonstrate the evaluation workflow. They are not Oil India field-performance claims.
        </div>
      </div>

      {/* Validation Controls Panel */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Held-Out Well Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#12324A]">Held-Out Well:</span>
            <div className="flex items-center gap-1 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg p-0.5">
              {BACKTEST_RESULTS.map((w) => (
                <button
                  key={w.wellId}
                  onClick={() => setSelectedWellId(w.wellId)}
                  className={`px-3 py-1 rounded font-bold transition-colors ${
                    selectedWellId === w.wellId
                      ? 'bg-[#12324A] text-white shadow-2xs'
                      : 'text-[#667B89] hover:text-[#12324A]'
                  }`}
                >
                  {w.wellId}
                </button>
              ))}
            </div>
          </div>

          {/* Tier Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#12324A]">Evaluation Tier:</span>
            <div className="flex items-center gap-1 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg p-0.5">
              {(['Tier 1', 'Tier 2', 'Tier 3'] as DataTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    selectedTier === t
                      ? 'bg-[#1677B8] text-white shadow-2xs'
                      : 'text-[#667B89] hover:text-[#12324A]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-3.5 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#118A8A]" />
            <span>{isSimulating ? 'Pause Replay' : 'Run Backtest Replay'}</span>
          </button>

          <button
            onClick={() => setScrubPosition(100)}
            className="p-1.5 bg-white border border-[#DDE6EA] text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-slate-50 transition-colors"
            title="Reset position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Head-to-Head Comparison: DRILLDNA vs Threshold Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* DRILLDNA Performance Card */}
        <div className="bg-white border-2 border-[#1677B8]/40 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1677B8]" />
              <h3 className="text-sm font-bold text-[#12324A]">DRILLDNA Multi-Sensor Precursor Alert</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8]">
              Pattern Similarity Model
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#EEF7FB] rounded-lg border border-[#1677B8]/20">
              <div className="text-[#667B89]">Average Alert Lead Time</div>
              <div className="text-xl font-bold font-mono-tabular text-[#1677B8] mt-1">
                {selectedWellData.drilldnaAlertLeadTimeMin.toFixed(1)} <span className="text-xs font-normal">minutes</span>
              </div>
              <div className="text-[10px] text-[#2F8F5B] font-semibold mt-0.5">+16.3 min operational buffer</div>
            </div>

            <div className="p-3 bg-[#EEF9F2] rounded-lg border border-[#2F8F5B]/20">
              <div className="text-[#667B89]">Precision / Recall</div>
              <div className="text-xl font-bold font-mono-tabular text-[#2F8F5B] mt-1">
                {selectedWellData.precisionPct}% / {selectedWellData.recallPct}%
              </div>
              <div className="text-[10px] text-[#2F8F5B] font-semibold mt-0.5">PR-AUC: {selectedWellData.prAuc}</div>
            </div>

            <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA]">
              <div className="text-[#667B89]">False Alerts / Drilling Hour</div>
              <div className="text-lg font-bold font-mono-tabular text-[#12324A] mt-1">
                {selectedWellData.falseAlertsPerHourDrilldna}
              </div>
              <div className="text-[10px] text-[#2F8F5B] font-semibold mt-0.5">91.8% reduction vs threshold</div>
            </div>

            <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA]">
              <div className="text-[#667B89]">Historical Evidence Link</div>
              <div className="text-sm font-bold text-[#12324A] mt-1">
                Page-Level Verified
              </div>
              <div className="text-[10px] text-[#667B89] mt-0.5">{selectedWellData.evidenceAvailability}</div>
            </div>
          </div>
        </div>

        {/* Conventional Threshold-Only Baseline Card */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8FA1AC]" />
              <h3 className="text-sm font-bold text-[#667B89]">Conventional Static Threshold Alarms</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Flow &gt; 10% / Pit &gt; 1.5 m³
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FFF1F1] rounded-lg border border-[#C93C3C]/20">
              <div className="text-[#667B89]">Average Alert Lead Time</div>
              <div className="text-xl font-bold font-mono-tabular text-[#C93C3C] mt-1">
                {selectedWellData.baselineThresholdLeadTimeMin.toFixed(1)} <span className="text-xs font-normal">minutes</span>
              </div>
              <div className="text-[10px] text-[#C93C3C] font-semibold mt-0.5">Reactionary post-loss trigger</div>
            </div>

            <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA]">
              <div className="text-[#667B89]">Precision / Recall</div>
              <div className="text-xl font-bold font-mono-tabular text-[#667B89] mt-1">
                46.1% / 64.0%
              </div>
              <div className="text-[10px] text-[#8FA1AC] mt-0.5">PR-AUC: 0.52</div>
            </div>

            <div className="p-3 bg-[#FFF7E8] rounded-lg border border-[#E87825]/20">
              <div className="text-[#667B89]">False Alerts / Drilling Hour</div>
              <div className="text-lg font-bold font-mono-tabular text-[#E87825] mt-1">
                {selectedWellData.falseAlertsPerHourBaseline}
              </div>
              <div className="text-[10px] text-[#E87825] mt-0.5">Triggered by pipe connection surges</div>
            </div>

            <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA]">
              <div className="text-[#667B89]">Context & Precedents</div>
              <div className="text-sm font-bold text-[#8FA1AC] mt-1">
                None (Stateless)
              </div>
              <div className="text-[10px] text-[#8FA1AC] mt-0.5">Zero historical memory cross-check</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Time Timeline Graphic */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="font-bold text-[#12324A] text-sm">Lead Time & Escalation Horizon Comparison</h3>
        <div className="p-4 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg space-y-4">
          <div className="relative pt-6 pb-2">
            {/* Horizontal timeline bar */}
            <div className="h-2 bg-[#CBD5E1] rounded-full w-full relative">
              {/* Precursor start (-20 min) */}
              <div className="absolute left-[15%] -top-2 flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-[#D38B22] border-2 border-white shadow-xs" />
                <span className="text-[10px] font-bold text-[#D38B22] mt-1">Precursor Inception (-20m)</span>
              </div>

              {/* DRILLDNA Alert (-18.4 min) */}
              <div className="absolute left-[22%] -top-3 flex flex-col items-center">
                <span className="w-5 h-5 rounded-full bg-[#1677B8] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                  ★
                </span>
                <span className="text-[11px] font-bold text-[#1677B8] mt-1">DRILLDNA Alert (-18.4m)</span>
              </div>

              {/* Threshold Alarm (-2.1 min) */}
              <div className="absolute left-[90%] -top-2 flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-[#8FA1AC] border-2 border-white shadow-xs" />
                <span className="text-[10px] font-bold text-[#8FA1AC] mt-1">Threshold (-2.1m)</span>
              </div>

              {/* Severe Loss Event (0 min) */}
              <div className="absolute right-0 -top-2 flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-[#C93C3C] border-2 border-white shadow-xs" />
                <span className="text-[10px] font-bold text-[#C93C3C] mt-1">Loss Point (0m)</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#667B89] leading-relaxed pt-3">
            <strong>Key Operational Benefit:</strong> The 16.3-minute lead-time advantage provides the tour drilling engineer sufficient time to slow rotary, perform a controlled flow check, and stage an LCM pill prior to large-scale fracture propagation.
          </div>
        </div>
      </div>

      {/* Pilot Acceptance Targets Card */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#DDE6EA]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#118A8A]" />
            <h3 className="font-bold text-[#12324A] text-sm">Pilot Acceptance Targets</h3>
          </div>
          <span className="text-[11px] font-mono font-medium text-[#8FA1AC]">
            OIL Field Trial Qualification Thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
            <div className="text-[#667B89]">Extraction F1 Benchmark</div>
            <div className="font-bold text-[#12324A] text-base font-mono-tabular">≥ 0.80</div>
            <div className="text-[10px] text-[#8FA1AC]">Against held-out, SME-reviewed tour documents</div>
          </div>

          <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
            <div className="text-[#667B89]">Median Loss Alert Lead Time</div>
            <div className="font-bold text-[#1677B8] text-base font-mono-tabular">≥ 10 minutes</div>
            <div className="text-[10px] text-[#8FA1AC]">Lead time prior to irreversible fracture propagation</div>
          </div>

          <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
            <div className="text-[#667B89]">False Alert Burden Limit</div>
            <div className="font-bold text-[#2F8F5B] text-base font-mono-tabular">≤ 0.1 / drill-hr</div>
            <div className="text-[10px] text-[#8FA1AC]">Per risk type after connection cooldown</div>
          </div>

          <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
            <div className="text-[#667B89]">Engineer-Rated Relevance</div>
            <div className="font-bold text-[#118A8A] text-base font-mono-tabular">≥ 80%</div>
            <div className="text-[10px] text-[#8FA1AC]">Confirmed by tour engineers on shift</div>
          </div>
        </div>

        <div className="p-3 bg-[#FFF7E8] border border-[#D38B22]/30 rounded-lg text-[11px] text-[#D38B22] flex items-center justify-between">
          <span>
            <strong>Governance Clause:</strong> Model must demonstrate statistically superior PR-AUC and lower false-alert burden than a threshold-only rule across the pilot block.
          </span>
          <span className="font-semibold text-right shrink-0 ml-4">
            Targets to be agreed with OIL before pilot; not current field-performance claims.
          </span>
        </div>
      </div>
    </div>
  );
};
