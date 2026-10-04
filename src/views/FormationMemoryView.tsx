import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Database,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
  Shield,
  Search,
} from 'lucide-react';

export const FormationMemoryView: React.FC = () => {
  const { metrics, simulator, setSimulator, setIsEvidenceModalOpen, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'stratigraphy' | 'pore-pressure' | 'well-construction' | 'event-precedents'>('stratigraphy');

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Formation Memory
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Canonical geological memory, stratigraphic aliases, and documented subsurface precedents
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Provisional Alias Toggle to test degraded behavior */}
          <button
            onClick={() =>
              setSimulator((prev) => ({
                ...prev,
                provisionalAlias: !prev.provisionalAlias,
              }))
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              simulator.provisionalAlias
                ? 'bg-[#FFF7E8] text-[#D9A300] border-[#D9A300]/40'
                : 'bg-white text-[#667B89] border-[#DDE6EA] hover:bg-slate-50'
            }`}
          >
            <span>Alias: {simulator.provisionalAlias ? 'Provisional' : 'Verified'}</span>
          </button>

          <button
            onClick={() => setIsEvidenceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE6EA] text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#D38B22]" />
            <span>Open Source DDR</span>
          </button>
        </div>
      </div>

      {/* Primary Formation Header Card */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-[#DDE6EA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#118A8A]" />
              <h2 className="text-base font-bold text-[#12324A]">Lower Barail Formation (Canonical)</h2>
              {simulator.provisionalAlias ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFF7E8] text-[#D9A300] border border-[#D9A300]/30">
                  Formation match: provisional
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30">
                  SME Verified Canonical
                </span>
              )}
            </div>
            <p className="text-xs text-[#667B89] mt-1">
              Oligocene Barail Group · Fluvial-deltaic sandstone reservoirs interbedded with carbonaceous shales
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-tabular">
            <div className="bg-[#F5F8FA] p-2 rounded-lg border border-[#DDE6EA] text-right">
              <div className="text-[10px] text-[#667B89]">Formation Window</div>
              <div className="font-bold text-[#12324A]">2750.0 – 2940.0 m TVD</div>
            </div>
            <div className="bg-[#F5F8FA] p-2 rounded-lg border border-[#DDE6EA] text-right">
              <div className="text-[10px] text-[#667B89]">Loss Window</div>
              <div className="font-bold text-[#C93C3C]">2770.0 – 2825.0 m TVD</div>
            </div>
          </div>
        </div>

        {/* Stratigraphic Alias Mapping Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#12324A]">Alias mapping:</span>
          <span className="font-mono bg-[#F5F8FA] px-2 py-0.5 rounded border border-[#DDE6EA] text-[#193040]">
            Lwr Barail
          </span>
          <span className="font-mono bg-[#F5F8FA] px-2 py-0.5 rounded border border-[#DDE6EA] text-[#193040]">
            Barail Sand-4
          </span>
          <span className="font-mono bg-[#F5F8FA] px-2 py-0.5 rounded border border-[#DDE6EA] text-[#193040]">
            BRL-L
          </span>
          <span className="font-mono bg-[#F5F8FA] px-2 py-0.5 rounded border border-[#DDE6EA] text-[#193040]">
            Lower Sand Member (Digboi South)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDE6EA] text-xs font-medium">
        <button
          onClick={() => setActiveTab('stratigraphy')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'stratigraphy'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          Stratigraphy & Lithology
        </button>
        <button
          onClick={() => setActiveTab('pore-pressure')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'pore-pressure'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          Pore Pressure & Geomechanics
        </button>
        <button
          onClick={() => setActiveTab('well-construction')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'well-construction'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          Well Construction & Mud Program
        </button>
        <button
          onClick={() => setActiveTab('event-precedents')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'event-precedents'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          Historical Precedents & Mitigations
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'stratigraphy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Geological Properties & Boundaries
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Top Depth:</span>
                <strong className="font-mono-tabular text-[#12324A]">2750.0 m TVD</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Base Depth:</span>
                <strong className="font-mono-tabular text-[#12324A]">2940.0 m TVD</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Gross Interval Thickness:</span>
                <span className="font-mono-tabular font-medium text-[#12324A]">190.0 m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Datum Reference:</span>
                <span className="font-medium text-[#12324A]">Mean Sea Level (MSL)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Average Permeability:</span>
                <span className="font-mono-tabular font-medium text-[#12324A]">120 – 450 mD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Average Porosity:</span>
                <span className="font-mono-tabular font-medium text-[#12324A]">18.5%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667B89]">Lithological Description:</span>
                <span className="text-right text-[#193040] max-w-xs font-medium">
                  Massive fluvial sandstone with localized micro-fractures and carbonaceous shale
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Loss Window Vulnerability Profile
            </h3>
            <div className="p-3 bg-[#FFF7E8] border border-[#D38B22]/30 rounded-lg space-y-2">
              <div className="font-bold text-[#D38B22] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Loss Window: 2770.0 – 2825.0 m TVD</span>
              </div>
              <p className="text-[#193040] leading-relaxed text-[11px]">
                Corresponds to an unconfined channel-belt sand member exhibiting secondary natural micro-fracturing along the fault boundary. Fluid losses occur predominantly when equivalent circulating density (ECD) exceeds 1.21 SG.
              </p>
              <div className="pt-2 border-t border-[#D38B22]/20 flex justify-between font-mono-tabular text-[11px]">
                <span>Historical incidence rate:</span>
                <strong className="text-[#C93C3C]">3 of 6 intervals (50%)</strong>
              </div>
            </div>

            <div className="p-3 bg-[#EEF7FB] border border-[#1677B8]/20 rounded-lg space-y-1 text-[11px] text-[#1677B8]">
              <strong>Offset Well Correlation:</strong>
              <div>· OIL-X12: Loss encountered at 2795m TVD (88% similarity)</div>
              <div>· OIL-B02: Loss encountered at 2788m TVD (84% similarity)</div>
              <div>· OIL-X18: Loss encountered at 2810m TVD (82% similarity)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pore-pressure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Operating Mud Weight & Hydraulic Envelopes
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Pore Pressure Gradient:</span>
                <strong className="font-mono-tabular text-[#12324A]">1.16 SG EMW</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Active Mud Density:</span>
                <strong className="font-mono-tabular text-[#1677B8]">1.18 SG (KCl-Polymer)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Dynamic ECD @ Bit:</span>
                <strong className="font-mono-tabular text-[#E87825]">1.22 SG</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Fracture Breakdown Gradient:</span>
                <strong className="font-mono-tabular text-[#C93C3C]">1.74 SG EMW</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667B89]">Shoe Integrity Test (FIT):</span>
                <strong className="font-mono-tabular text-[#2F8F5B]">1.70 SG @ 2650m TVD</strong>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Geomechanical Drilling Risk Summary
            </h3>
            <p className="text-[#193040] leading-relaxed text-[11px]">
              The pressure margin between pore pressure (1.16 SG) and natural fracture opening pressure (~1.20 SG) is extremely narrow in the Lower Barail loss interval. Annular pressure spikes during drill pipe connections or surge pressures while tripping can induce fracture propagation.
            </p>
            <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] text-[11px] space-y-1">
              <div className="font-semibold text-[#12324A]">Hydraulic Recommendation:</div>
              <div className="text-[#667B89]">
                Limit annular circulation rate to 520 GPM to prevent dynamic ECD from crossing the 1.21 SG threshold.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'well-construction' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Casing & Cement Architecture
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Current Hole Section:</span>
                <strong className="text-[#12324A]">8-1/2" Hole</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Previous Casing Shoe:</span>
                <strong className="font-mono-tabular text-[#12324A]">9-5/8" @ 2650.0 m TVD</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Next Planned Casing:</span>
                <strong className="font-mono-tabular text-[#12324A]">7" Liner @ 2950.0 m TVD</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Cement Type:</span>
                <span className="text-[#193040]">Class G with silica flour</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667B89]">Cement Top:</span>
                <span className="font-mono-tabular text-[#12324A]">1900.0 m TVD (Inside 13-3/8")</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
              Active Drilling Fluid System Properties
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Fluid Type:</span>
                <strong className="text-[#12324A]">KCl-Polymer Water-Based Mud</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Plastic Viscosity (PV):</span>
                <span className="font-mono-tabular text-[#12324A]">18 cP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">Yield Point (YP):</span>
                <span className="font-mono-tabular text-[#12324A]">22 lb/100ft²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDE6EA]/60">
                <span className="text-[#667B89]">API Fluid Loss:</span>
                <span className="font-mono-tabular text-[#12324A]">&lt; 4.5 mL/30min</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667B89]">LCM Inventory on Standby:</span>
                <span className="font-medium text-[#2F8F5B]">150 sacks coarse mica + CaCO3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'event-precedents' && (
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <h3 className="font-bold text-[#12324A] text-sm">Documented Historical Precedents in Lower Barail</h3>
            <button
              onClick={() => setActiveView('mitigations')}
              className="text-xs text-[#1677B8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Full Mitigation Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 bg-[#FFF7E8] border border-[#D38B22]/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-[#12324A]">Key Matching Precedent: OIL-X12</strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#D38B22] border border-[#D38B22]/20 font-bold">
                88% Similarity
              </span>
            </div>
            <p className="text-[#193040] text-[11px] leading-relaxed">
              Encountered 9% flow drop with rising torque at 2795.0 m TVD. Successfully resolved using controlled ROP reduction and a 25 bbl high-viscosity mica pill with 6.5 hours total NPT.
            </p>
            <div className="pt-2 border-t border-[#D38B22]/20 flex justify-between text-[11px]">
              <span className="text-[#667B89]">Source: Synthetic DDR_OIL-X12.pdf p.14</span>
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="text-[#1677B8] hover:underline font-semibold"
              >
                Inspect DDR Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Version Governance Tag */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#667B89]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#118A8A]" />
          <span>Active Formation Fingerprint Model:</span>
          <strong className="text-[#12324A]">Barail-FP v1.4</strong>
          <span className="text-[10px] font-mono text-[#8FA1AC]">(FP-BRL-v1.4.2)</span>
        </div>
        <div className="text-[11px]">
          Status: <strong className="text-[#2F8F5B]">Locked for OIL-BRL-09</strong> (Mid-well model drift lock active)
        </div>
      </div>
    </div>
  );
};
