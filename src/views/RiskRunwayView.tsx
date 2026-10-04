import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import { DataTrustMeter } from '../components/common/DataTrustMeter';
import {
  Sliders,
  AlertTriangle,
  ShieldAlert,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
  Target,
  ArrowDown,
} from 'lucide-react';

export const RiskRunwayView: React.FC = () => {
  const { metrics, simulator, setActiveView, setIsEvidenceModalOpen } = useApp();
  const [selectedDepth, setSelectedDepth] = useState<number>(2787.7);

  const isTier1Unavailable = simulator.tierOverride !== 'Tier 1';

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Risk Runway
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Depth-aware look-ahead planning, formation boundaries, and historical event horizons
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-white border border-[#DDE6EA] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[#667B89]">Bit Depth:</span>
            <strong className="text-[#12324A] font-mono-tabular">2787.7 m TVD</strong>
            <span className="text-[#8FA1AC]">|</span>
            <span className="text-[#667B89] font-mono-tabular">2890.8 m MD</span>
          </div>
        </div>
      </div>

      {/* Tier 1 degradation notice if triggered */}
      {isTier1Unavailable && (
        <div className="p-3 bg-[#FFF7E8] border border-[#E87825]/40 rounded-xl text-xs text-[#E87825] flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Detailed fingerprint unavailable — formation-level evidence only.</span>
        </div>
      )}

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Interactive Visual Depth Track */}
        <div className="lg:col-span-5 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <h3 className="text-sm font-bold text-[#12324A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1677B8]" />
              <span>Wellbore Stratigraphic Track</span>
            </h3>
            <span className="text-[10px] font-mono text-[#667B89]">2500m – 3100m TVD</span>
          </div>

          {/* Visual Stratigraphic Column */}
          <div className="relative border border-[#DDE6EA] rounded-lg bg-[#F8FAFC] overflow-hidden p-2 text-xs select-none">
            {/* 2650m Casing Shoe Marker */}
            <div className="my-2 p-2 bg-[#EEF7FB] border border-[#1677B8]/40 rounded flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#12324A]" />
                <span className="font-bold text-[#12324A]">9-5/8" Casing Shoe Set Point</span>
              </div>
              <span className="font-mono-tabular font-bold text-[#1677B8]">2650.0 m TVD</span>
            </div>

            {/* Formation Top: Upper Barail Base / Lower Barail Top (2750m) */}
            <div className="border-t-2 border-dashed border-[#8FA1AC] my-2 pt-1 flex justify-between text-[10px] text-[#667B89]">
              <span className="font-semibold uppercase tracking-wider">Top Lower Barail Formation</span>
              <span className="font-mono-tabular">2750.0 m TVD</span>
            </div>

            {/* Watch Zone (2730–2770m) */}
            <div
              onClick={() => setSelectedDepth(2750)}
              className="p-2.5 my-1.5 bg-[#FFFDEB] border border-[#D9A300]/40 rounded hover:border-[#D9A300] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D9A300] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D9A300]" />
                  <span>Watch Zone (Transition Approach)</span>
                </span>
                <span className="font-mono-tabular text-[11px] text-[#667B89]">2730 – 2770 m</span>
              </div>
              <p className="text-[10px] text-[#667B89] mt-0.5">
                Approaching Lower Barail permeable sand member. Mud conditioning & LCM check.
              </p>
            </div>

            {/* Advisory / Mud-Loss Horizon (2770–2825m) */}
            <div className="p-3 my-2 bg-[#FFF7E8] border border-[#E87825]/40 rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E87825] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Advisory Zone (Historical Mud-Loss Horizon)</span>
                </span>
                <span className="font-mono-tabular text-[11px] font-bold text-[#E87825]">
                  2770 – 2825 m
                </span>
              </div>

              {/* Inner Alert Zone (2780–2810m) */}
              <div
                onClick={() => setSelectedDepth(2787.7)}
                className="p-2 bg-[#FFF1F1] border-2 border-[#C93C3C] rounded cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C93C3C] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#C93C3C] animate-ping" />
                    <span>Alert Zone (Active Live Precursor)</span>
                  </span>
                  <span className="font-mono-tabular text-[11px] font-bold text-[#C93C3C]">
                    2780 – 2810 m
                  </span>
                </div>

                {/* Current Bit Indicator */}
                <div className="bg-[#12324A] text-white p-2 rounded flex items-center justify-between font-mono-tabular text-xs font-bold shadow-xs">
                  <div className="flex items-center gap-1.5 font-sans">
                    <Target className="w-3.5 h-3.5 text-[#1677B8]" />
                    <span>Current Bit: OIL-BRL-09</span>
                  </div>
                  <span className="text-[#1677B8]">2787.7 m TVD</span>
                </div>
                <div className="text-[10px] text-[#C93C3C] font-semibold">
                  Inside window (+17.7m into sand). Flow-out −7.1%, torque +2.06 kNm.
                </div>
              </div>
            </div>

            {/* Formation Base: Lower Barail Base / Kopili Top (2940m) */}
            <div className="border-t-2 border-dashed border-[#8FA1AC] my-2 pt-1 flex justify-between text-[10px] text-[#667B89]">
              <span className="font-semibold uppercase tracking-wider">Top Kopili Shale Formation</span>
              <span className="font-mono-tabular">2940.0 m TVD</span>
            </div>

            {/* Upcoming Well-Control Watch Zone (2950–3050m) */}
            <div
              onClick={() => setSelectedDepth(2980)}
              className="p-2.5 my-1.5 bg-[#EEF7FB] border border-[#1677B8]/40 rounded hover:border-[#1677B8] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1677B8] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Future Well-Control Watch Zone</span>
                </span>
                <span className="font-mono-tabular text-[11px] text-[#667B89]">2950 – 3050 m</span>
              </div>
              <p className="text-[10px] text-[#667B89] mt-0.5">
                Overpressured Kopili gas shale horizon. Requires planned mud weight transition to 1.25 SG.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#8FA1AC] italic">
            “Depth context is advisory and not a guarantee.”
          </div>
        </div>

        {/* Right 7 Cols: Risk Horizons Table & Offset Event Density */}
        <div className="lg:col-span-7 space-y-4">
          {/* Risk Level Definitions Card */}
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Risk Horizon Hierarchy & Threshold Definitions
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Watch */}
              <div className="p-3 bg-[#FFFDEB] border-l-4 border-[#D9A300] rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D9A300]">1. Watch Level</span>
                  <span className="font-mono-tabular text-[11px] text-[#667B89]">Approach Window</span>
                </div>
                <p className="text-[#193040] text-[11px]">
                  <strong>Trigger:</strong> Approaching within 40m TVD of a documented historical event window. Telemetry is nominal; alerts drilling crew to stage mitigation resources.
                </p>
              </div>

              {/* Advisory */}
              <div className="p-3 bg-[#FFF7E8] border-l-4 border-[#E87825] rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E87825]">2. Advisory Level</span>
                  <span className="font-mono-tabular text-[11px] text-[#667B89]">Inside Window</span>
                </div>
                <p className="text-[#193040] text-[11px]">
                  <strong>Trigger:</strong> Bit position is inside a historical event window (e.g. 2770–2825m TVD in Lower Barail). Higher monitoring frequency and conservative drilling parameters.
                </p>
              </div>

              {/* Alert */}
              <div className="p-3 bg-[#FFF1F1] border-l-4 border-[#C93C3C] rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C93C3C]">3. Alert Level (Active Trigger)</span>
                  <span className="font-mono-tabular text-[11px] text-[#C93C3C] font-bold">ALT-2026-088</span>
                </div>
                <p className="text-[#193040] text-[11px]">
                  <strong>Trigger:</strong> Bit is inside historical window WITH valid, quality-checked live sensor divergence matching historical precursor fingerprint (&gt; 75% similarity).
                </p>
              </div>
            </div>
          </div>

          {/* Historical Event Density Across Offset Wells */}
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
              <div>
                <h3 className="font-bold text-[#12324A] text-sm">Comparable Offset Well Event Density</h3>
                <p className="text-xs text-[#667B89]">14 offset wells analysed · 6 comparable formation intervals</p>
              </div>
              <button
                onClick={() => setActiveView('nearby-map')}
                className="text-xs text-[#1677B8] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DDE6EA] text-[#667B89]">
                    <th className="py-2 font-medium">Well</th>
                    <th className="py-2 font-medium">Distance</th>
                    <th className="py-2 font-medium">Loss Depth</th>
                    <th className="py-2 font-medium">Event Severity</th>
                    <th className="py-2 font-medium">Mitigation</th>
                    <th className="py-2 font-medium">NPT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE6EA]/60 font-mono-tabular">
                  <tr className="hover:bg-[#F5F8FA]">
                    <td className="py-2 font-bold text-[#12324A]">OIL-X12</td>
                    <td className="py-2 text-[#667B89]">1.8 km NE</td>
                    <td className="py-2 font-semibold">2795.0 m</td>
                    <td className="py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF1F1] text-[#C93C3C] font-sans font-bold">
                        Severe Loss
                      </span>
                    </td>
                    <td className="py-2 font-sans text-[#193040]">Controlled ROP + LCM pill</td>
                    <td className="py-2 font-bold text-[#12324A]">6.5 h</td>
                  </tr>
                  <tr className="hover:bg-[#F5F8FA]">
                    <td className="py-2 font-bold text-[#12324A]">OIL-B02</td>
                    <td className="py-2 text-[#667B89]">2.4 km SW</td>
                    <td className="py-2 font-semibold">2788.0 m</td>
                    <td className="py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF7E8] text-[#E87825] font-sans font-semibold">
                        Partial Loss
                      </span>
                    </td>
                    <td className="py-2 font-sans text-[#193040]">Fiber-crosslinked pill</td>
                    <td className="py-2 font-bold text-[#12324A]">7.2 h</td>
                  </tr>
                  <tr className="hover:bg-[#F5F8FA]">
                    <td className="py-2 font-bold text-[#12324A]">OIL-X18</td>
                    <td className="py-2 text-[#667B89]">3.2 km E</td>
                    <td className="py-2 font-semibold">2810.0 m</td>
                    <td className="py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF7E8] text-[#E87825] font-sans font-semibold">
                        Partial Loss
                      </span>
                    </td>
                    <td className="py-2 font-sans text-[#193040]">Reduce ECD / flow rate</td>
                    <td className="py-2 font-bold text-[#12324A]">9.0 h</td>
                  </tr>
                  <tr className="hover:bg-[#F5F8FA]">
                    <td className="py-2 font-bold text-[#12324A]">OIL-X03</td>
                    <td className="py-2 text-[#667B89]">4.9 km N</td>
                    <td className="py-2 font-semibold">2805.0 m</td>
                    <td className="py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF1F1] text-[#C93C3C] font-sans font-bold">
                        Severe Loss
                      </span>
                    </td>
                    <td className="py-2 font-sans text-[#193040]">Cement plug</td>
                    <td className="py-2 font-bold text-[#12324A]">18.5 h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
