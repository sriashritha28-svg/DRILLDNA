import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Printer,
  Download,
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const SectionHandoverView: React.FC = () => {
  const { metrics, currentRole, setIsEvidenceModalOpen } = useApp();
  const [engineerNotes, setEngineerNotes] = useState<string>(
    'Active bit at 2787.7m TVD inside Lower Barail loss zone. Alert ALT-2026-088 acknowledged. Standby LCM pill mixed in Pit 3 (25 bbl mica/CaCO3). Maintain ECD <= 1.21 SG.'
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Generate clean downloadable file to avoid window.open iframe restrictions
    const content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>OIL_INDIA_DRILLDNA_Handover_OIL-BRL-09</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #193040; background: #fff; }
      h1 { color: #12324A; font-size: 20px; border-bottom: 2px solid #12324A; padding-bottom: 8px; }
      .meta { display: flex; gap: 20px; font-size: 13px; color: #667B89; margin-bottom: 20px; }
      .box { border: 1px solid #DDE6EA; padding: 14px; margin-bottom: 14px; border-radius: 6px; background: #F8FAFC; }
      .box h3 { margin-top: 0; font-size: 14px; color: #12324A; }
      .advisory { font-size: 11px; color: #8FA1AC; margin-top: 30px; border-top: 1px solid #DDE6EA; padding-top: 10px; }
    </style>
  </head>
  <body>
    <h1>OIL INDIA LIMITED — DRILLDNA SECTION HANDOVER DOSSIER</h1>
    <div class="meta">
      <span><strong>Well:</strong> OIL-BRL-09</span>
      <span><strong>Date:</strong> 04-Oct-2026</span>
      <span><strong>Tour:</strong> 06:00–18:00 (Day Tour)</span>
      <span><strong>Rig:</strong> OIL-RIG-04</span>
    </div>
    <div class="box">
      <h3>Active Operational Depth & Stratigraphy</h3>
      <p>Current Bit TVD: 2787.7 m | Current MD: 2890.8 m | Formation: Lower Barail</p>
      <p>Casing Shoe: 9-5/8" at 2650.0 m TVD | Hole Size: 8-1/2"</p>
      <p>Risk Horizon: Currently inside 2770–2825 m TVD historical mud-loss window.</p>
    </div>
    <div class="box">
      <h3>Historically Observed Mitigation (OIL-X12 Precedent)</h3>
      <p>Controlled ROP reduction + 25 bbl high-viscosity LCM pill (75% success rate, 6.5h typical NPT).</p>
      <p>Standby LCM pill mixed in Pit 3. Annular ECD limit: 1.21 SG.</p>
    </div>
    <div class="box">
      <h3>Engineer Tour Notes</h3>
      <p>${engineerNotes}</p>
    </div>
    <div class="advisory">
      <strong>SAFETY NOTICE:</strong> DRILLDNA is an advisory, read-only decision-support platform. It does not send control commands to rig equipment. The drilling engineer on tour remains the final operational decision-maker.
    </div>
  </body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OIL_INDIA_DRILLDNA_Handover_OIL-BRL-09.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="no-print">
        <DegradedBanner />
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA] no-print">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Section Handover Brief
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Operational shift handover dossier & look-ahead hazard summary (OIL-BRL-09 8-1/2" Section)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#DDE6EA] text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Print Brief</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#118A8A]" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Formal 1-Page Handover Document Card */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-6 shadow-xs max-w-4xl mx-auto space-y-4 print-page font-sans text-xs">
        {/* Document Header */}
        <div className="border-b-2 border-[#12324A] pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-[#12324A] tracking-tight">
                OIL INDIA LIMITED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
                DRILLDNA HANDOVER BRIEF
              </span>
            </div>
            <div className="text-[11px] text-[#667B89] mt-0.5">
              Eastern Basin Operations · Drilling Engineering Directorate · Form SHB-09
            </div>
          </div>

          <div className="text-right font-mono-tabular text-xs space-y-0.5">
            <div>Well: <strong className="text-[#12324A] text-sm">OIL-BRL-09</strong></div>
            <div className="text-[#667B89]">Handover Tour: <strong>06:00 – 18:00 (Day Tour)</strong></div>
            <div className="text-[#667B89]">Generated: <strong>2026-10-04 10:48 UTC</strong></div>
          </div>
        </div>

        {/* Section 1: Active Well Depth & Current State */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F5F8FA] p-3 rounded-lg border border-[#DDE6EA] font-mono-tabular">
          <div>
            <div className="text-[#667B89] text-[10px]">Current Bit TVD</div>
            <div className="font-bold text-[#12324A] text-sm">2787.7 m</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[10px]">Current Bit MD</div>
            <div className="font-bold text-[#12324A] text-sm">2890.8 m</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[10px]">Hole Section</div>
            <div className="font-bold text-[#12324A] text-sm">8-1/2" Directional</div>
          </div>
          <div>
            <div className="text-[#667B89] text-[10px]">Active Mud Density</div>
            <div className="font-bold text-[#1677B8] text-sm">1.18 SG (KCl-Pol)</div>
          </div>
        </div>

        {/* Section 2: Stratigraphy & Geological Event Windows */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#12324A] text-xs uppercase tracking-wider border-b border-[#DDE6EA] pb-1">
            1. Stratigraphic Horizon & Documented Event Windows
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 bg-white border border-[#DDE6EA] rounded-lg space-y-1">
              <div className="font-bold text-[#12324A]">Upper Barail Formation</div>
              <div className="text-[11px] font-mono-tabular text-[#667B89]">2450.0 – 2750.0 m TVD</div>
              <div className="text-[11px] text-[#2F8F5B]">Drilled cleanly. 9-5/8" casing set @ 2650m TVD.</div>
            </div>

            <div className="p-2.5 bg-[#FFF1F1] border border-[#C93C3C]/30 rounded-lg space-y-1">
              <div className="font-bold text-[#C93C3C]">Lower Barail (Active Section)</div>
              <div className="text-[11px] font-mono-tabular text-[#12324A] font-bold">2750.0 – 2940.0 m TVD</div>
              <div className="text-[11px] text-[#C93C3C] font-semibold">
                Loss window: 2770–2825m TVD. Active alert ALT-2026-088.
              </div>
            </div>

            <div className="p-2.5 bg-[#EEF7FB] border border-[#1677B8]/30 rounded-lg space-y-1">
              <div className="font-bold text-[#1677B8]">Kopili Shale (Look-Ahead)</div>
              <div className="text-[11px] font-mono-tabular text-[#667B89]">2940.0 – 3200.0 m TVD</div>
              <div className="text-[11px] text-[#1677B8]">
                Well-control watch: 2950–3050m TVD (gas streaks).
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Mitigations Based on Historical Evidence */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#12324A] text-xs uppercase tracking-wider border-b border-[#DDE6EA] pb-1">
            2. Primary Ranked Mitigation Precedents
          </h3>
          <div className="p-3 bg-[#FFF7E8] border border-[#D38B22]/30 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#12324A]">
              <span>Controlled ROP reduction + high-viscosity LCM pill</span>
              <span className="font-mono-tabular text-[#D38B22]">75% Success (3 of 4 cases)</span>
            </div>
            <p className="text-[11px] text-[#193040] leading-relaxed">
              Based on OIL-X12 precedent (DDR Page 14): spot 25 bbl medium-coarse mica + calcium carbonate pill across 2770–2825m TVD. Soak for 3–4 hours inside casing shoe at 2650m TVD. Average NPT: 6.5 hours.
            </p>
          </div>
        </div>

        {/* Section 4: Evidence Gaps & Operational Constraints */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#12324A] text-xs uppercase tracking-wider border-b border-[#DDE6EA] pb-1">
            3. Documented Evidence Gaps & Rig Watchpoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 bg-[#F5F8FA] border border-[#DDE6EA] rounded space-y-1">
              <strong>Subsurface Evidence Gap:</strong>
              <p className="text-[#667B89]">
                Fracture network permeability in the south-west block is provisional; 2 offset wells (OIL-B02, OIL-X12) showed varying natural fracture apertures.
              </p>
            </div>

            <div className="p-2.5 bg-[#F5F8FA] border border-[#DDE6EA] rounded space-y-1">
              <strong>Rig Equipment & Well-Control Watch:</strong>
              <p className="text-[#667B89]">
                Ensure trip tank volume sensors are zeroed prior to any wiper trip. Standby kill mud volume: 180 bbl (1.25 SG).
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Outgoing Tour Engineer Instructions (Editable) */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#12324A] text-xs uppercase tracking-wider block">
            4. Outgoing Tour Engineer Handover Instructions:
          </label>
          <textarea
            rows={3}
            value={engineerNotes}
            onChange={(e) => setEngineerNotes(e.target.value)}
            className="w-full p-2.5 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg text-xs text-[#193040] focus:bg-white focus:border-[#1677B8] focus:outline-hidden"
          />
        </div>

        {/* Governance & Signatures */}
        <div className="pt-4 border-t-2 border-[#12324A] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <div className="text-[#667B89]">Outgoing Tour Drilling Engineer:</div>
            <strong className="text-[#12324A]">Debojit Sarma (Signed)</strong>
          </div>

          <div>
            <div className="text-[#667B89]">Incoming Tour Drilling Engineer:</div>
            <div className="font-medium text-[#193040] border-b border-dashed border-[#8FA1AC] w-36">
              &nbsp;
            </div>
          </div>

          <div className="text-right text-[11px] text-[#667B89]">
            <div>Model: <strong className="text-[#12324A]">Barail-FP v1.4</strong> (FP-BRL-v1.4.2)</div>
            <div>Tier 1 Synthetic Sensor Stream Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
