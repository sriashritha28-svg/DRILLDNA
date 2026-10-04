import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DataTrustMeter } from '../components/common/DataTrustMeter';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Bell,
  Play,
  RotateCcw,
  FileText,
  BookOpen,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Layers,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
  Compass,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    metrics,
    telemetry,
    activeAlert,
    activeAlertTimer,
    setActiveView,
    setIsAckModalOpen,
    setIsEvidenceModalOpen,
    setIsSOPModalOpen,
    startDemoScenario,
    resetDemoScenario,
    simulator,
  } = useApp();

  const [showHistoricalOverlay, setShowHistoricalOverlay] = useState<boolean>(true);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const minutesRemaining = Math.floor(activeAlertTimer / 60);
  const secondsRemaining = activeAlertTimer % 60;

  // Selected or latest telemetry point
  const currentPt =
    hoveredPointIndex !== null && telemetry[hoveredPointIndex]
      ? telemetry[hoveredPointIndex]
      : telemetry[telemetry.length - 1];

  return (
    <div className="space-y-5">
      {/* Degraded State Alerts if any */}
      <DegradedBanner />

      {/* A. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Operations Dashboard
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Live drilling context, historical evidence, and decision support
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startDemoScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#118A8A]" />
            <span>Start Demo</span>
          </button>

          <button
            onClick={resetDemoScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE6EA] text-[#667B89] hover:text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setActiveView('handover')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF7FB] border border-[#1677B8]/30 text-[#1677B8] hover:bg-[#1677B8]/10 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Handover Brief</span>
          </button>
        </div>
      </div>

      {/* B. Main Alert Panel: ALT-2026-088 */}
      {activeAlert && (
        <div className="bg-[#FFF1F1] border border-[#C93C3C]/40 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C93C3C] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-[#12324A]">Mud-loss precursor detected</h2>
                  <span className="text-[11px] font-bold px-2 py-0.2 rounded bg-[#C93C3C] text-white">
                    {activeAlert.severity}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-white text-[#C93C3C] border border-[#C93C3C]/30 font-semibold">
                    {activeAlert.id}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.2 rounded ${
                      activeAlert.status === 'Active'
                        ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
                        : activeAlert.status === 'Acknowledged'
                        ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                        : 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                    }`}
                  >
                    Status: {activeAlert.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#667B89]">
                  <div>
                    Raised: <span className="font-semibold text-[#193040]">{activeAlert.raisedTimeStr}</span>
                  </div>
                  <span>·</span>
                  <div>
                    Formation: <span className="font-semibold text-[#193040]">{activeAlert.formation}</span>
                  </div>
                  <span>·</span>
                  <div>
                    Bit TVD: <span className="font-semibold text-[#193040]">{metrics.bitDepthTvdM.toFixed(1)} m</span>
                  </div>
                  <span>·</span>
                  <div>
                    Rig State: <span className="font-semibold text-[#193040]">{activeAlert.rigState}</span>
                  </div>
                  <span>·</span>
                  <div>
                    Data Tier: <span className="font-semibold text-[#1677B8]">{activeAlert.dataTier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Timer Box */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#DDE6EA] text-xs shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#E87825]" />
              <span className="text-[#667B89]">Acknowledgment Window:</span>
              <span className="font-mono-tabular font-bold text-sm text-[#C93C3C]">
                {minutesRemaining}:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
              </span>
            </div>
          </div>

          {/* Exact Evidence Summary Quote */}
          <div className="p-3 bg-white/80 border-l-3 border-[#C93C3C] rounded-r-lg text-xs leading-relaxed text-[#193040] mb-3">
            “Lower Barail at 2787.7 m TVD is inside the historical mud-loss window of 2770–2825 m TVD. Flow-out is 7.1% below baseline, pit volume is declining, and torque is rising. The live pattern has 88% historical fingerprint similarity to OIL-X12’s documented pre-loss window.”
          </div>

          {/* Mandatory Fingerprint Similarity Note */}
          <div className="text-[11px] text-[#667B89] italic mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#8FA1AC] shrink-0" />
            <span>
              Historical Fingerprint Similarity describes resemblance to a comparable historical pre-event pattern. It is not a probability of incident.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#C93C3C]/20">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveView('replay')}
                className="px-3.5 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View Risk Replay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="px-3.5 py-1.5 bg-white border border-[#DDE6EA] text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#D38B22]" />
                <span>View Evidence (DDR Page 14)</span>
              </button>

              <button
                onClick={() => setIsSOPModalOpen(true)}
                className="px-3.5 py-1.5 bg-white border border-[#DDE6EA] text-[#118A8A] hover:bg-[#EEF7FB] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Approved SOP</span>
              </button>
            </div>

            <button
              onClick={() => setIsAckModalOpen(true)}
              className="px-4 py-1.5 bg-[#2F8F5B] text-white hover:bg-[#257549] rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* C. Operational Metric Cards (6 Compact Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Bit Depth */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#1677B8]/40 transition-colors">
          <div className="text-[11px] font-medium text-[#667B89]">Bit Depth</div>
          <div className="text-lg font-bold font-mono-tabular text-[#12324A] mt-1">
            2787.7 <span className="text-xs font-sans font-normal text-[#667B89]">m TVD</span>
          </div>
          <div className="text-[11px] font-mono-tabular text-[#667B89] mt-0.5">
            2890.8 m MD
          </div>
          <div className="mt-2 text-[10px] font-medium text-[#C93C3C] bg-[#FFF1F1] px-1.5 py-0.5 rounded border border-[#C93C3C]/20 truncate">
            Inside historical loss window
          </div>
        </div>

        {/* 2. Formation Context */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#1677B8]/40 transition-colors">
          <div className="text-[11px] font-medium text-[#667B89]">Formation Context</div>
          <div className="text-base font-bold text-[#12324A] mt-1 truncate">
            Lower Barail
          </div>
          <div className="text-[11px] font-mono-tabular text-[#667B89] mt-0.5">
            2770–2825 m TVD
          </div>
          <div className="mt-2 text-[10px] font-medium text-[#E87825] bg-[#FFF7E8] px-1.5 py-0.5 rounded border border-[#E87825]/20 truncate">
            3 of 6 comparable affected
          </div>
        </div>

        {/* 3. Flow-Out Returns */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#C93C3C]/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#667B89]">
            <span>Flow-out Returns</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#C93C3C]" />
          </div>
          <div className="text-lg font-bold font-mono-tabular text-[#C93C3C] mt-1">
            −7.1% <span className="text-xs font-sans font-normal text-[#667B89]">vs baseline</span>
          </div>
          <div className="text-[11px] font-mono-tabular text-[#667B89] mt-0.5">
            Actual: 92.9% returns
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#C93C3C] bg-[#FFF1F1] px-1.5 py-0.5 rounded border border-[#C93C3C]/20">
            Status: Worsening
          </div>
        </div>

        {/* 4. Surface Torque */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#E87825]/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#667B89]">
            <span>Surface Torque</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#E87825]" />
          </div>
          <div className="text-lg font-bold font-mono-tabular text-[#E87825] mt-1">
            +2.06 <span className="text-xs font-sans font-normal text-[#667B89]">kNm</span>
          </div>
          <div className="text-[11px] font-mono-tabular text-[#667B89] mt-0.5">
            Actual: 18.26 kNm
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#E87825] bg-[#FFF7E8] px-1.5 py-0.5 rounded border border-[#E87825]/20">
            Status: Rising
          </div>
        </div>

        {/* 5. Active Pit Volume */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#C93C3C]/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#667B89]">
            <span>Active Pit Volume</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#C93C3C]" />
          </div>
          <div className="text-lg font-bold font-mono-tabular text-[#C93C3C] mt-1">
            −1.05 <span className="text-xs font-sans font-normal text-[#667B89]">m³</span>
          </div>
          <div className="text-[11px] font-mono-tabular text-[#667B89] mt-0.5">
            Active: 43.95 m³
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#C93C3C] bg-[#FFF1F1] px-1.5 py-0.5 rounded border border-[#C93C3C]/20">
            Status: Declining
          </div>
        </div>

        {/* 6. Historical Fingerprint */}
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs hover:border-[#118A8A]/40 transition-colors">
          <div className="text-[11px] font-medium text-[#667B89]">Historical Fingerprint</div>
          <div className="text-lg font-bold font-mono-tabular text-[#118A8A] mt-1">
            88% <span className="text-xs font-sans font-normal text-[#667B89]">similarity</span>
          </div>
          <div className="text-[11px] font-sans font-medium text-[#12324A] mt-0.5">
            Precedent: OIL-X12
          </div>
          <div className="mt-2 text-[10px] font-medium text-[#1677B8] bg-[#EEF7FB] px-1.5 py-0.5 rounded border border-[#1677B8]/20 truncate">
            Tier 1 replay available
          </div>
        </div>
      </div>

      {/* D. Live Telemetry Section (Interactive Multi-Series Chart) */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#DDE6EA]">
          <div>
            <h3 className="text-sm font-bold text-[#12324A]">Real-time drilling telemetry</h3>
            <p className="text-xs text-[#667B89]">
              30-minute rolling window · Active well OIL-BRL-09 with precursor inception and historical precedent overlay
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#1677B8]" />
              <span className="text-[#193040]">Live OIL-BRL-09</span>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showHistoricalOverlay}
                onChange={(e) => setShowHistoricalOverlay(e.target.checked)}
                className="rounded border-[#DDE6EA] text-[#D38B22] focus:ring-0 cursor-pointer"
              />
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#D38B22]" />
              <span className="text-[#D38B22]">OIL-X12 Overlay</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#8FA1AC]" />
              <span className="text-[#667B89]">Baseline (100%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C93C3C]" />
              <span className="text-[#C93C3C]">Alert Marker (-6m)</span>
            </div>
          </div>
        </div>

        {/* Hover telemetry readout bar */}
        <div className="mb-2 px-3 py-1.5 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg text-xs flex flex-wrap items-center justify-between gap-2 font-mono-tabular">
          <div className="font-sans font-medium text-[#12324A]">
            Inspection: <strong>{currentPt.timestamp}</strong> ({currentPt.minutesAgo} min ago)
          </div>
          <div className="flex items-center gap-4">
            <div>
              Flow-out: <strong className="text-[#1677B8]">{currentPt.flowOutPct.toFixed(1)}%</strong>
              {showHistoricalOverlay && currentPt.historicalFlowOutPct && (
                <span className="text-[#D38B22] text-[11px] ml-1">
                  (Hist: {currentPt.historicalFlowOutPct.toFixed(1)}%)
                </span>
              )}
            </div>
            <div>
              Torque: <strong className="text-[#E87825]">{currentPt.torqueKNm.toFixed(2)} kNm</strong>
              {showHistoricalOverlay && currentPt.historicalTorqueKNm && (
                <span className="text-[#D38B22] text-[11px] ml-1">
                  (Hist: {currentPt.historicalTorqueKNm.toFixed(2)})
                </span>
              )}
            </div>
            <div>
              Pit Vol: <strong className="text-[#C93C3C]">{currentPt.pitVolumeM3.toFixed(2)} m³</strong>
            </div>
            <div>
              SPP: <strong className="text-[#118A8A]">{currentPt.sppBar.toFixed(1)} bar</strong>
            </div>
          </div>
        </div>

        {/* High-Resolution SVG Telemetry Visualization */}
        <div className="relative w-full h-64 bg-[#FAFCFD] border border-[#DDE6EA] rounded-lg p-2 overflow-hidden">
          <svg
            viewBox="0 0 1000 240"
            className="w-full h-full cursor-crosshair"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            {/* Grid Lines */}
            <line x1="50" y1="30" x2="960" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="80" x2="960" y2="80" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="130" x2="960" y2="130" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="180" x2="960" y2="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="210" x2="960" y2="210" stroke="#CBD5E1" strokeWidth="1" />

            {/* Baseline 100% Flow Line */}
            <line x1="50" y1="50" x2="960" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="55" y="44" fill="#64748B" fontSize="10" fontFamily="sans-serif">
              Baseline 100% Nominal Flow Returns
            </text>

            {/* Precursor Inception Marker (-20 min) */}
            {/* Index 5 is -20 min: x = 50 + (5 / 15) * 910 = 50 + 303.3 = 353 */}
            <line x1="353" y1="20" x2="353" y2="210" stroke="#D38B22" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="358" y="28" fill="#D38B22" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Precursor Inception (-20m)
            </text>

            {/* Alert Raised Marker (-6 min) */}
            {/* Index 12 is -6 min: x = 50 + (12 / 15) * 910 = 50 + 728 = 778 */}
            <line x1="778" y1="20" x2="778" y2="210" stroke="#C93C3C" strokeWidth="1.5" />
            <polygon points="778,16 774,24 782,24" fill="#C93C3C" />
            <text x="740" y="14" fill="#C93C3C" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              ALT-2026-088 (-6m)
            </text>

            {/* Live Current Time Marker (0 min / index 15) */}
            <line x1="960" y1="20" x2="960" y2="210" stroke="#1677B8" strokeWidth="2" />
            <circle cx="960" cy="180" r="4" fill="#1677B8" />

            {/* Historical Overlay Curve (Dashed Amber) for Flow Out */}
            {showHistoricalOverlay && (
              <path
                d={telemetry
                  .map((p, i) => {
                    const x = 50 + (i / (telemetry.length - 1)) * 910;
                    // flow goes from 100 to 90.8 -> y maps from 50 (100%) to 190 (90%)
                    const val = p.historicalFlowOutPct ?? p.flowOutPct;
                    const y = 50 + (100 - val) * 14;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#D38B22"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            )}

            {/* Live Flow Out Curve (Solid Blue) */}
            <path
              d={telemetry
                .map((p, i) => {
                  const x = 50 + (i / (telemetry.length - 1)) * 910;
                  const y = 50 + (100 - p.flowOutPct) * 14;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#1677B8"
              strokeWidth="2.5"
            />

            {/* Live Torque Curve (Orange-Amber) */}
            <path
              d={telemetry
                .map((p, i) => {
                  const x = 50 + (i / (telemetry.length - 1)) * 910;
                  // torque goes from 16 to 18.26 -> y maps from 190 (16kNm) to 90 (19kNm)
                  const y = 190 - (p.torqueKNm - 16) * 40;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#E87825"
              strokeWidth="1.5"
            />

            {/* Points & Hover Interaction Targets */}
            {telemetry.map((p, i) => {
              const x = 50 + (i / (telemetry.length - 1)) * 910;
              const yFlow = 50 + (100 - p.flowOutPct) * 14;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={yFlow}
                    r={hoveredPointIndex === i ? 5 : 2.5}
                    fill={hoveredPointIndex === i ? '#12324A' : '#1677B8'}
                  />
                  {/* Invisible broad hover hit area */}
                  <rect
                    x={x - 20}
                    y={0}
                    width={40}
                    height={230}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                  />
                </g>
              );
            })}

            {/* X-Axis Labels */}
            <text x="50" y="226" fill="#8FA1AC" fontSize="10" textAnchor="middle" fontFamily="sans-serif">-30m</text>
            <text x="353" y="226" fill="#8FA1AC" fontSize="10" textAnchor="middle" fontFamily="sans-serif">-20m</text>
            <text x="657" y="226" fill="#8FA1AC" fontSize="10" textAnchor="middle" fontFamily="sans-serif">-10m</text>
            <text x="960" y="226" fill="#1677B8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Live (0m)</text>
          </svg>
        </div>
      </div>

      {/* Middle Split: E. Why This Alert & F. Formation Risk DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* E. Why This Alert Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#118A8A]" />
              <h3 className="text-sm font-bold text-[#12324A]">Why this alert was raised</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
              5-Point Evidence Stack
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* 1. Depth context */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F5F8FA] border border-[#DDE6EA]/60">
              <span className="w-5 h-5 rounded-full bg-[#12324A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-[#12324A]">Depth context:</strong>{' '}
                <span className="text-[#193040]">
                  Bit at 2787.7 m TVD is inside the Lower Barail historical loss window of 2770–2825 m TVD (17.7 m into permeable sand facies).
                </span>
              </div>
            </div>

            {/* 2. Comparable evidence */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F5F8FA] border border-[#DDE6EA]/60">
              <span className="w-5 h-5 rounded-full bg-[#12324A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-[#12324A]">Comparable evidence:</strong>{' '}
                <span className="text-[#193040]">
                  3 of 6 comparable historical intervals in the Barail South block experienced partial or severe mud losses.
                </span>
              </div>
            </div>

            {/* 3. Live evidence */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FFF1F1] border border-[#C93C3C]/30">
              <span className="w-5 h-5 rounded-full bg-[#C93C3C] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-[#C93C3C]">Live sensor evidence:</strong>{' '}
                <span className="text-[#193040]">
                  Flow-out returns <strong>−7.1%</strong> below baseline; active pit volume declining by <strong>−1.05 m³</strong>; torque <strong>+2.06 kNm</strong>; rig state: drilling.
                </span>
              </div>
            </div>

            {/* 4. Historical match */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FFF7E8] border border-[#D38B22]/30">
              <span className="w-5 h-5 rounded-full bg-[#D38B22] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-[#D38B22]">Historical precedent match:</strong>{' '}
                <span className="text-[#193040]">
                  OIL-X12 showed a 9% flow-out decline with rising torque over ~20 minutes prior to severe loss escalation (88% similarity score).
                </span>
              </div>
            </div>

            {/* 5. Trust */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#EEF9F2] border border-[#2F8F5B]/30">
              <span className="w-5 h-5 rounded-full bg-[#2F8F5B] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                5
              </span>
              <div>
                <strong className="text-[#2F8F5B]">Data trust & provenance:</strong>{' '}
                <span className="text-[#193040]">
                  Tier 1 synthetic stream; data quality good; source: Synthetic DDR_OIL-X12.pdf p.14; SME review pending.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 text-xs">
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="text-[#1677B8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View source evidence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('nearby-map')}
              className="text-[#118A8A] hover:underline font-semibold"
            >
              Open comparable cases (14 wells)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('models')}
              className="text-[#667B89] hover:underline"
            >
              View calculation weights
            </button>
          </div>
        </div>

        {/* F. Formation Risk DNA (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#118A8A]" />
                <h3 className="text-sm font-bold text-[#12324A]">Formation Risk DNA</h3>
              </div>
              <span className="text-[10px] font-semibold text-[#118A8A] bg-[#EEF7FB] px-2 py-0.5 rounded border border-[#118A8A]/20">
                Historical pattern match detected
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Canonical formation:</span>
                <strong className="text-[#12324A]">{metrics.formation}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Historical wells analysed:</span>
                <span className="font-mono-tabular font-bold text-[#12324A]">14 wells</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Comparable intervals:</span>
                <span className="font-mono-tabular font-bold text-[#12324A]">6 intervals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Historical loss events:</span>
                <strong className="text-[#C93C3C] font-mono-tabular">3 of 6 (50%)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Risk depth window:</span>
                <span className="font-mono-tabular font-semibold text-[#12324A]">2770–2825 m TVD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Typical precursor signature:</span>
                <span className="font-medium text-[#E87825]">9% flow drop + torque</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Current live change:</span>
                <strong className="font-mono-tabular text-[#C93C3C]">−7.1% flow decline</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/50">
                <span className="text-[#667B89]">Formation alias status:</span>
                <span className={simulator.provisionalAlias ? 'text-[#D9A300] font-bold' : 'text-[#2F8F5B] font-medium'}>
                  {simulator.provisionalAlias ? 'Provisional' : 'Reviewed'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667B89]">Evidence status:</span>
                <span className="text-[#667B89]">Synthetic, SME review pending</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE6EA] mt-2">
            <button
              onClick={() => setActiveView('formation-memory')}
              className="w-full py-1.5 bg-[#EEF7FB] hover:bg-[#118A8A] hover:text-white text-[#118A8A] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Formation Memory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Split: G. Risk Runway Preview & H. Mitigation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* G. Risk Runway Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA] mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1677B8]" />
                <h3 className="text-sm font-bold text-[#12324A]">Risk Runway depth preview</h3>
              </div>
              <button
                onClick={() => setActiveView('runway')}
                className="text-xs text-[#1677B8] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Full Runway</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Depth track strip */}
              <div className="bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg p-3 space-y-2">
                {/* 9-5/8" casing shoe */}
                <div className="flex items-center justify-between text-[11px] text-[#667B89]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#12324A]" />
                    <span>9-5/8" Casing Shoe</span>
                  </span>
                  <span className="font-mono-tabular font-medium">2650.0 m TVD</span>
                </div>

                {/* Watch Zone */}
                <div className="flex items-center justify-between text-[11px] bg-[#FFF7E8] text-[#D9A300] px-2 py-1 rounded">
                  <span>Watch Zone (Formation Transition)</span>
                  <span className="font-mono-tabular">2730–2770 m TVD</span>
                </div>

                {/* Advisory / Mud Loss Zone */}
                <div className="flex items-center justify-between text-[11px] bg-[#FFF1F1] text-[#C93C3C] px-2 py-1 rounded border border-[#C93C3C]/30 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Historical Loss Window</span>
                  </div>
                  <span className="font-mono-tabular">2770–2825 m TVD</span>
                </div>

                {/* Current Bit Depth Indicator */}
                <div className="flex items-center justify-between bg-[#12324A] text-white px-2.5 py-1.5 rounded text-xs font-bold font-mono-tabular shadow-2xs">
                  <div className="flex items-center gap-1.5 font-sans font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#1677B8] animate-ping" />
                    <span>Current Bit Position</span>
                  </div>
                  <span>2787.7 m TVD</span>
                </div>

                {/* Future Well Control Watch Zone */}
                <div className="flex items-center justify-between text-[11px] bg-[#EEF7FB] text-[#1677B8] px-2 py-1 rounded">
                  <span>Future Well-Control Watch (Kopili Gas)</span>
                  <span className="font-mono-tabular">2950–3050 m TVD</span>
                </div>
              </div>

              <div className="text-[11px] text-[#8FA1AC] italic">
                “Depth context is advisory and not a guarantee.”
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE6EA] mt-2">
            <button
              onClick={() => setActiveView('runway')}
              className="w-full py-1.5 bg-white border border-[#DDE6EA] hover:bg-[#F5F8FA] text-[#12324A] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Full Risk Runway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* H. Mitigation Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA] mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2F8F5B]" />
                <h3 className="text-sm font-bold text-[#12324A]">
                  Historically observed responses — review before action
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30">
                Ranked Option
              </span>
            </div>

            <div className="bg-[#FFF7E8] border border-[#D38B22]/30 rounded-lg p-3 space-y-2 mb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-[#12324A] text-xs">
                  Controlled ROP reduction + high-viscosity LCM pill
                </div>
                <span className="text-[10px] font-mono font-bold text-[#D38B22] bg-white px-2 py-0.5 rounded border border-[#D38B22]/20 shrink-0">
                  75% Success (3/4)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#667B89]">
                <div>
                  Mean NPT: <strong className="text-[#12324A]">6.5 hours</strong>
                </div>
                <div>
                  Status: <strong className="text-[#D38B22]">SME review pending</strong>
                </div>
                <div className="col-span-2">
                  Source: <strong className="text-[#12324A]">Synthetic DDR_OIL-X12.pdf p.14</strong>
                </div>
              </div>
            </div>

            {/* Mandatory Safety Text */}
            <div className="text-[11px] text-[#667B89] bg-[#F5F8FA] p-2.5 rounded border border-[#DDE6EA] leading-relaxed">
              <strong>Mandatory Safety Rule:</strong> Ranked from outcomes in comparable historical cases. Review the approved SOP and apply drilling-engineer judgement before action.
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE6EA] mt-2 flex items-center justify-between">
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="text-xs text-[#1677B8] hover:underline font-semibold"
            >
              Verify DDR Page 14
            </button>
            <button
              onClick={() => setActiveView('mitigations')}
              className="py-1.5 px-3 bg-[#12324A] hover:bg-[#1F4E6B] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <span>All Mitigations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Data Trust Meter Footer Block */}
      <DataTrustMeter />
    </div>
  );
};
