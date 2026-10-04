import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OffsetWell } from '../types';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  MapPin,
  Filter,
  Layers,
  ChevronRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Compass,
  Search,
} from 'lucide-react';

export const NearbyWellsView: React.FC = () => {
  const { offsetWells, setIsEvidenceModalOpen } = useApp();

  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(5);
  const [formationFilter, setFormationFilter] = useState<string>('All');
  const [eventFilter, setEventFilter] = useState<string>('All');
  const [selectedWell, setSelectedWell] = useState<OffsetWell | null>(
    offsetWells.find((w) => w.id === 'OIL-X12') || offsetWells[0]
  );

  // Filter wells
  const filteredWells = offsetWells.filter((well) => {
    if (well.id !== 'OIL-BRL-09' && well.distanceKm > selectedRadiusKm) return false;
    if (formationFilter !== 'All' && !well.formationMatch.toLowerCase().includes(formationFilter.toLowerCase())) return false;
    if (eventFilter === 'Mud Loss' && !well.eventType.includes('Mud Loss')) return false;
    if (eventFilter === 'Tight Hole' && well.eventType !== 'Tight Hole') return false;
    if (eventFilter === 'Well Control' && !well.eventType.includes('Kick')) return false;
    if (eventFilter === 'Normal' && well.eventType !== 'None (Normal)') return false;
    return true;
  });

  // Center coordinate is active well OIL-BRL-09 (27.3150, 95.3420)
  // Map dimensions: 800 x 500
  const centerLat = 27.3150;
  const centerLon = 95.3420;
  // 1 degree lat is ~111 km. At 10 km max radius, delta is ~0.1 degrees
  const scale = 3600; // pixels per degree
  const cx = 400;
  const cy = 250;

  const getX = (lon: number) => cx + (lon - centerLon) * scale;
  const getY = (lat: number) => cy - (lat - centerLat) * scale;

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Nearby Wells Map
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Upper Assam Basin · Spatial offset correlation & historical incident mapping (Barail South Block)
          </p>
        </div>

        <div className="text-xs font-mono text-[#8FA1AC] bg-white border border-[#DDE6EA] px-3 py-1.5 rounded-lg">
          Synthetic demonstration locations
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Radius selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#12324A]">Radius:</span>
            <div className="flex items-center gap-1 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg p-0.5">
              {[1, 3, 5, 10].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRadiusKm(r)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    selectedRadiusKm === r
                      ? 'bg-[#1677B8] text-white shadow-2xs'
                      : 'text-[#667B89] hover:text-[#12324A]'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Formation filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#12324A]">Formation:</span>
            <select
              aria-label="Filter by formation"
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="bg-white border border-[#DDE6EA] rounded-lg px-2.5 py-1 text-xs text-[#193040] focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Formations</option>
              <option value="Lower Barail">Lower Barail</option>
              <option value="Upper Barail">Upper Barail</option>
              <option value="Kopili">Kopili Shale</option>
            </select>
          </div>

          {/* Event filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#12324A]">Event:</span>
            <select
              aria-label="Filter by event"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-white border border-[#DDE6EA] rounded-lg px-2.5 py-1 text-xs text-[#193040] focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Events</option>
              <option value="Mud Loss">Mud Losses (Partial/Severe)</option>
              <option value="Tight Hole">Tight Hole</option>
              <option value="Well Control">Well Control Kicks</option>
              <option value="Normal">Normal (No Incident)</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#667B89]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1677B8]" />
            <span className="font-medium text-[#12324A]">Active Well</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C93C3C]" />
            <span>Severe Loss / Alert</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E87825]" />
            <span>Partial Loss / Advisory</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A300]" />
            <span>Tight Hole / Watch</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F8F5B]" />
            <span>Normal</span>
          </div>
        </div>
      </div>

      {/* Map & Drawer Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Light Industrial SVG Map */}
        <div className="lg:col-span-8 bg-white border border-[#DDE6EA] rounded-xl p-3 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="relative w-full h-[520px] bg-[#F4F7F9] border border-[#DDE6EA] rounded-lg overflow-hidden">
            <svg viewBox="0 0 800 500" className="w-full h-full select-none">
              {/* Soft Grid Lines for Geographic Coordinates */}
              <defs>
                <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#lightGrid)" />

              {/* Subdued Topographic / Basin Fault Trend (Dashed Gray) */}
              <path
                d="M 120 480 Q 380 280 720 40"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <text x="620" y="70" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">
                Barail South Anticlinal Fault Axis
              </text>

              {/* Concentric Radar Range Circles from Active Well */}
              {/* 10 km radius: 10km / 111km/deg * 3600 = ~324px */}
              {/* 5 km radius: ~162px */}
              {/* 3 km radius: ~97px */}
              {/* 1 km radius: ~32px */}
              <circle cx={cx} cy={cy} r="324" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
              <text x={cx + 328} y={cy + 4} fill="#8FA1AC" fontSize="9" fontFamily="sans-serif">10 km</text>

              <circle cx={cx} cy={cy} r="162" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
              <text x={cx + 166} y={cy + 4} fill="#8FA1AC" fontSize="9" fontFamily="sans-serif">5 km</text>

              <circle cx={cx} cy={cy} r="97" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
              <text x={cx + 101} y={cy + 4} fill="#8FA1AC" fontSize="9" fontFamily="sans-serif">3 km</text>

              <circle cx={cx} cy={cy} r="32" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
              <text x={cx + 35} y={cy + 4} fill="#8FA1AC" fontSize="9" fontFamily="sans-serif">1 km</text>

              {/* Active Radar Sweep Line */}
              <circle cx={cx} cy={cy} r="162" fill="rgba(22, 119, 184, 0.03)" />

              {/* Offset Wells */}
              {filteredWells.map((well) => {
                const wx = getX(well.lon);
                const wy = getY(well.lat);
                const isActive = well.id === 'OIL-BRL-09';
                const isSelected = selectedWell?.id === well.id;

                let color = '#2F8F5B';
                if (isActive) color = '#1677B8';
                else if (well.severity === 'Alert') color = '#C93C3C';
                else if (well.severity === 'Advisory') color = '#E87825';
                else if (well.severity === 'Watch') color = '#D9A300';

                return (
                  <g
                    key={well.id}
                    onClick={() => setSelectedWell(well)}
                    className="cursor-pointer transition-transform duration-100 hover:scale-110"
                  >
                    {/* Selected halo */}
                    {isSelected && (
                      <circle cx={wx} cy={wy} r="14" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
                    )}

                    {/* Active pulse */}
                    {isActive && (
                      <circle cx={wx} cy={wy} r="18" fill="rgba(22, 119, 184, 0.15)" />
                    )}

                    <circle cx={wx} cy={wy} r={isActive ? 8 : 6} fill={color} stroke="#FFFFFF" strokeWidth="2" />

                    <text
                      x={wx + 10}
                      y={wy + 4}
                      fill="#12324A"
                      fontSize={isActive ? 11 : 10}
                      fontWeight={isActive || isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {well.name.split(' ')[0]}
                      {well.id === 'OIL-X12' && ' (Precedent)'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Orientation Widget */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-2xs border border-[#DDE6EA] px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-2 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#118A8A]" />
              <span>N 27°18′54″ / E 95°20′31″</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Sliding Offset Details Drawer */}
        <div className="lg:col-span-4 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          {selectedWell ? (
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-[#DDE6EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#12324A]">{selectedWell.name}</h3>
                  </div>
                  <div className="text-[11px] text-[#667B89] mt-0.5">
                    {selectedWell.block} · Spud {selectedWell.spudYear} · TD {selectedWell.totalDepthM} m
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedWell.severity === 'Alert'
                      ? 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                      : selectedWell.severity === 'Advisory'
                      ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
                      : selectedWell.severity === 'Watch'
                      ? 'bg-[#FFFDEB] text-[#D9A300] border border-[#D9A300]/30'
                      : 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                  }`}
                >
                  {selectedWell.severity}
                </span>
              </div>

              {/* Data Table */}
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">Distance from OIL-BRL-09:</span>
                  <strong className="font-mono-tabular text-[#12324A]">{selectedWell.distanceKm} km</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">Formation match:</span>
                  <span className="font-medium text-[#193040]">{selectedWell.formationMatch}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">TVD depth overlap:</span>
                  <span className="text-[#193040] text-right max-w-xs">{selectedWell.tvdOverlap}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">Trajectory style:</span>
                  <span className="font-mono-tabular text-[#12324A]">{selectedWell.trajectory}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">Historical event type:</span>
                  <strong
                    className={
                      selectedWell.eventType.includes('Loss')
                        ? 'text-[#C93C3C]'
                        : selectedWell.eventType.includes('Kick')
                        ? 'text-[#E87825]'
                        : 'text-[#2F8F5B]'
                    }
                  >
                    {selectedWell.eventType}
                  </strong>
                </div>

                <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                  <span className="text-[#667B89]">Fingerprint similarity:</span>
                  <strong className="font-mono-tabular text-[#118A8A] text-sm">
                    {selectedWell.similarityScorePct}%
                  </strong>
                </div>
              </div>

              {/* Precursor & Mitigation details */}
              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-2 text-[11px]">
                <div>
                  <strong className="text-[#12324A]">Precursor documented:</strong>
                  <div className="text-[#667B89] mt-0.5">{selectedWell.historicalPrecursor}</div>
                </div>

                <div>
                  <strong className="text-[#12324A]">Mitigation applied:</strong>
                  <div className="text-[#193040] mt-0.5 font-medium">{selectedWell.mitigationApplied}</div>
                </div>

                <div>
                  <strong className="text-[#12324A]">Operational outcome:</strong>
                  <div className="text-[#667B89] mt-0.5">{selectedWell.outcome}</div>
                </div>
              </div>

              {/* Source Document Citation */}
              <div className="pt-2 border-t border-[#DDE6EA] flex items-center justify-between text-[11px]">
                <div className="text-[#667B89]">
                  Citation: <strong className="text-[#12324A]">{selectedWell.sourceDoc}</strong> p.{selectedWell.sourcePage}
                </div>
                {selectedWell.id === 'OIL-X12' && (
                  <button
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="text-[#1677B8] hover:underline font-semibold"
                  >
                    Inspect Page 14
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#667B89]">
              <MapPin className="w-8 h-8 text-[#8FA1AC] mx-auto mb-2" />
              <p>Click on any offset well on the map to review documented formation memory & mitigation history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
