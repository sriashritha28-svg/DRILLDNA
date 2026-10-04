import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DataTrustMeter } from '../components/common/DataTrustMeter';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const RiskReplayView: React.FC = () => {
  const { telemetry, setIsEvidenceModalOpen, setActiveView } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [scrubIndex, setScrubIndex] = useState<number>(telemetry.length - 1);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScrubIndex((prev) => {
        if (prev >= telemetry.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, telemetry.length]);

  const currentPt = telemetry[scrubIndex] || telemetry[telemetry.length - 1];

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Risk Replay
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Compare the current live pattern with a comparable documented historical pre-event window
          </p>
        </div>

        <button
          onClick={() => setIsEvidenceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE6EA] text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[#D38B22]" />
          <span>View Source Evidence (DDR_OIL-X12.pdf p.14)</span>
        </button>
      </div>

      {/* Top Summary Card */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div>
            <div className="text-[#667B89] text-[11px]">Active Well</div>
            <div className="font-bold text-[#1677B8] text-sm font-mono-tabular">OIL-BRL-09</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Historical Precedent</div>
            <div className="font-bold text-[#D38B22] text-sm font-mono-tabular">OIL-X12</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Event Type</div>
            <div className="font-semibold text-[#C93C3C] text-sm">Mud loss</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Formation</div>
            <div className="font-semibold text-[#12324A] text-sm">Lower Barail</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Fingerprint Similarity</div>
            <div className="font-bold text-[#118A8A] text-sm font-mono-tabular">88%</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Precursor Window</div>
            <div className="font-semibold text-[#12324A] text-sm font-mono-tabular">~20 minutes</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Data Tier</div>
            <div className="font-semibold text-[#1677B8] text-sm">Tier 1 synthetic</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[11px]">Source Document</div>
            <div className="font-medium text-[#12324A] text-xs truncate" title="Synthetic DDR_OIL-X12.pdf p.14">
              DDR_OIL-X12 p.14
            </div>
          </div>
        </div>

        {/* Mandatory Note */}
        <div className="mt-3 pt-2 border-t border-[#DDE6EA] text-[11px] text-[#667B89] italic flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#8FA1AC] shrink-0" />
          <span>
            Historical Fingerprint Similarity is a match to a historical pattern, not the probability of an incident.
          </span>
        </div>
      </div>

      {/* Main Replay Workspace (2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Replay Controls & 4 Synchronized Charts */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setScrubIndex(0);
                }}
                className="p-1.5 bg-white border border-[#DDE6EA] text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-slate-50 transition-colors"
                title="Reset to start of replay"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg p-0.5 ml-2">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      playbackSpeed === spd
                        ? 'bg-[#1677B8] text-white'
                        : 'text-[#667B89] hover:text-[#12324A]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Scrub Slider */}
            <div className="flex-1 min-w-[200px] flex items-center gap-2 px-2">
              <span className="text-[11px] font-mono-tabular text-[#667B89] w-10 text-right">
                {currentPt.timestamp}
              </span>
              <input
                type="range"
                min="0"
                max={telemetry.length - 1}
                value={scrubIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setScrubIndex(Number(e.target.value));
                }}
                className="w-full accent-[#1677B8] cursor-pointer"
              />
              <span className="text-[11px] font-mono-tabular text-[#1677B8] font-bold w-12">
                {currentPt.minutesAgo === 0 ? 'Live (0m)' : `-${currentPt.minutesAgo}m`}
              </span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-[#193040] font-medium">
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                  className="rounded border-[#DDE6EA] text-[#D38B22] focus:ring-0 cursor-pointer"
                />
                <span className="text-[#D38B22]">OIL-X12 Overlay</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-[#193040] font-medium">
                <input
                  type="checkbox"
                  checked={showMarkers}
                  onChange={(e) => setShowMarkers(e.target.checked)}
                  className="rounded border-[#DDE6EA] text-[#C93C3C] focus:ring-0 cursor-pointer"
                />
                <span>Markers</span>
              </label>
            </div>
          </div>

          {/* Synchronized Replay Charts (4 Tiles) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Flow-Out Returns (%) */}
            <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-[#12324A]">1. Flow-Out Returns (%)</span>
                <span className="font-mono-tabular font-bold text-[#1677B8]">
                  {currentPt.flowOutPct.toFixed(1)}%
                  {showOverlay && currentPt.historicalFlowOutPct && (
                    <span className="text-[#D38B22] font-normal ml-1">
                      (Hist: {currentPt.historicalFlowOutPct.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="h-36 bg-[#FAFCFD] border border-[#DDE6EA] rounded-lg p-1 relative">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="20" y1="20" x2="380" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                  {showOverlay && (
                    <path
                      d={telemetry
                        .map((p, i) => {
                          const x = 20 + (i / (telemetry.length - 1)) * 360;
                          const val = p.historicalFlowOutPct ?? p.flowOutPct;
                          const y = 20 + (100 - val) * 7;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#D38B22"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}
                  <path
                    d={telemetry
                      .slice(0, scrubIndex + 1)
                      .map((p, i) => {
                        const x = 20 + (i / (telemetry.length - 1)) * 360;
                        const y = 20 + (100 - p.flowOutPct) * 7;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#1677B8"
                    strokeWidth="2"
                  />
                  {/* Synchronized scrub line */}
                  <line
                    x1={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y1="10"
                    x2={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y2="110"
                    stroke="#1677B8"
                    strokeWidth="1.5"
                  />
                  {showMarkers && (
                    <line x1="310" y1="10" x2="310" y2="110" stroke="#C93C3C" strokeWidth="1" strokeDasharray="2 2" />
                  )}
                </svg>
              </div>
            </div>

            {/* Chart 2: Surface Torque (kNm) */}
            <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-[#12324A]">2. Surface Torque (kNm)</span>
                <span className="font-mono-tabular font-bold text-[#E87825]">
                  {currentPt.torqueKNm.toFixed(2)} kNm
                  {showOverlay && currentPt.historicalTorqueKNm && (
                    <span className="text-[#D38B22] font-normal ml-1">
                      (Hist: {currentPt.historicalTorqueKNm.toFixed(2)})
                    </span>
                  )}
                </span>
              </div>
              <div className="h-36 bg-[#FAFCFD] border border-[#DDE6EA] rounded-lg p-1 relative">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="20" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                  {showOverlay && (
                    <path
                      d={telemetry
                        .map((p, i) => {
                          const x = 20 + (i / (telemetry.length - 1)) * 360;
                          const val = p.historicalTorqueKNm ?? p.torqueKNm;
                          const y = 95 - (val - 16) * 25;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#D38B22"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}
                  <path
                    d={telemetry
                      .slice(0, scrubIndex + 1)
                      .map((p, i) => {
                        const x = 20 + (i / (telemetry.length - 1)) * 360;
                        const y = 95 - (p.torqueKNm - 16) * 25;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#E87825"
                    strokeWidth="2"
                  />
                  <line
                    x1={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y1="10"
                    x2={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y2="110"
                    stroke="#1677B8"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Chart 3: Active Pit Volume (m³) */}
            <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-[#12324A]">3. Active Pit Volume (m³)</span>
                <span className="font-mono-tabular font-bold text-[#C93C3C]">
                  {currentPt.pitVolumeM3.toFixed(2)} m³
                  {showOverlay && currentPt.historicalPitVolumeM3 && (
                    <span className="text-[#D38B22] font-normal ml-1">
                      (Hist: {currentPt.historicalPitVolumeM3.toFixed(2)})
                    </span>
                  )}
                </span>
              </div>
              <div className="h-36 bg-[#FAFCFD] border border-[#DDE6EA] rounded-lg p-1 relative">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="20" y1="20" x2="380" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                  {showOverlay && (
                    <path
                      d={telemetry
                        .map((p, i) => {
                          const x = 20 + (i / (telemetry.length - 1)) * 360;
                          const val = p.historicalPitVolumeM3 ?? p.pitVolumeM3;
                          const y = 20 + (45.0 - val) * 45;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#D38B22"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}
                  <path
                    d={telemetry
                      .slice(0, scrubIndex + 1)
                      .map((p, i) => {
                        const x = 20 + (i / (telemetry.length - 1)) * 360;
                        const y = 20 + (45.0 - p.pitVolumeM3) * 45;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#C93C3C"
                    strokeWidth="2"
                  />
                  <line
                    x1={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y1="10"
                    x2={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y2="110"
                    stroke="#1677B8"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Chart 4: Standpipe Pressure / SPP (bar) */}
            <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-[#12324A]">4. Standpipe Pressure (bar)</span>
                <span className="font-mono-tabular font-bold text-[#118A8A]">
                  {currentPt.sppBar.toFixed(1)} bar
                  {showOverlay && currentPt.historicalSppBar && (
                    <span className="text-[#D38B22] font-normal ml-1">
                      (Hist: {currentPt.historicalSppBar.toFixed(1)})
                    </span>
                  )}
                </span>
              </div>
              <div className="h-36 bg-[#FAFCFD] border border-[#DDE6EA] rounded-lg p-1 relative">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="20" y1="20" x2="380" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                  {showOverlay && (
                    <path
                      d={telemetry
                        .map((p, i) => {
                          const x = 20 + (i / (telemetry.length - 1)) * 360;
                          const val = p.historicalSppBar ?? p.sppBar;
                          const y = 20 + (183 - val) * 8;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#D38B22"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}
                  <path
                    d={telemetry
                      .slice(0, scrubIndex + 1)
                      .map((p, i) => {
                        const x = 20 + (i / (telemetry.length - 1)) * 360;
                        const y = 20 + (183 - p.sppBar) * 8;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#118A8A"
                    strokeWidth="2"
                  />
                  <line
                    x1={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y1="10"
                    x2={20 + (scrubIndex / (telemetry.length - 1)) * 360}
                    y2="110"
                    stroke="#1677B8"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Analytical Explanation Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3.5 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA] flex items-center justify-between">
              <span>Comparative Analytical Breakdown</span>
              <span className="text-[10px] font-mono text-[#1677B8]">OIL-X12 vs OIL-BRL-09</span>
            </h3>

            {/* What Matched */}
            <div className="space-y-1">
              <div className="font-semibold text-[#2F8F5B] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>What matched (88% similarity)</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[#193040] text-[11px] leading-relaxed">
                <li>Flow-out decline rate: −7.1% vs −9.0% precursor drop.</li>
                <li>Surface torque growth: +2.06 kNm vs +2.20 kNm pack-off.</li>
                <li>Precursor lead time: exactly 20 minutes before loss point.</li>
                <li>Lithology: massive Lower Barail sandstone channel.</li>
              </ul>
            </div>

            {/* What Differs */}
            <div className="space-y-1 pt-2 border-t border-[#DDE6EA]">
              <div className="font-semibold text-[#E87825] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>What differs</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[#193040] text-[11px] leading-relaxed">
                <li>Pit loss gradient: −1.05 m³ in active well vs −1.30 m³ in OIL-X12.</li>
                <li>Mud weight: 1.18 SG KCl-Pol (active) vs 1.17 SG in 2021.</li>
                <li>SPP drop: milder in OIL-BRL-09 due to lower circulation rate.</li>
              </ul>
            </div>

            {/* Comparable Well Context */}
            <div className="space-y-1 pt-2 border-t border-[#DDE6EA]">
              <div className="font-semibold text-[#12324A]">Comparable Well Context</div>
              <p className="text-[#667B89] text-[11px] leading-relaxed">
                OIL-X12 was drilled in 2021, situated 1.8 km northeast in the same fault block. Encountered severe losses at 2795.0 m TVD; successfully resolved in 6.5 hours using a high-viscosity LCM pill.
              </p>
            </div>

            {/* Event Timeline */}
            <div className="space-y-1.5 pt-2 border-t border-[#DDE6EA]">
              <div className="font-semibold text-[#12324A]">Replay Event Timeline</div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-[#667B89]">
                  <span className="font-mono text-[#D38B22] font-semibold">-20 min:</span>
                  <span>Precursor inception (flow returns dip)</span>
                </div>
                <div className="flex items-center gap-2 text-[#667B89]">
                  <span className="font-mono text-[#E87825] font-semibold">-12 min:</span>
                  <span>Torque crosses +1.5 kNm threshold</span>
                </div>
                <div className="flex items-center gap-2 text-[#C93C3C] font-semibold">
                  <span className="font-mono">-06 min:</span>
                  <span>Alert ALT-2026-088 triggered</span>
                </div>
                <div className="flex items-center gap-2 text-[#1677B8] font-bold">
                  <span className="font-mono">Live:</span>
                  <span>Current bit position @ 2787.7m TVD</span>
                </div>
              </div>
            </div>

            {/* Source Evidence Link */}
            <div className="pt-2 border-t border-[#DDE6EA]">
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="w-full py-1.5 px-3 bg-[#EEF7FB] hover:bg-[#1677B8] hover:text-white text-[#1677B8] rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Inspect Synthetic DDR_OIL-X12.pdf p.14</span>
              </button>
            </div>
          </div>

          {/* Data Trust Meter */}
          <DataTrustMeter compact />
        </div>
      </div>
    </div>
  );
};
