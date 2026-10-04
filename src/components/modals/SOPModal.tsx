import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, X, CheckSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SOPModal: React.FC = () => {
  const { isSOPModalOpen, setIsSOPModalOpen, setIsAckModalOpen } = useApp();

  if (!isSOPModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DDE6EA] flex items-center justify-between bg-[#F5F8FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EEF7FB] border border-[#1677B8]/30 flex items-center justify-center text-[#1677B8]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#12324A]">Standard Operating Procedure</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  OIL-SOP-LWR-BRL-08
                </span>
              </div>
              <p className="text-xs text-[#667B89]">
                Partial Mud Loss Mitigation Protocol · Barail South Development Block
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSOPModalOpen(false)}
            className="p-1.5 text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SOP Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#193040] leading-relaxed">
          <div className="p-3 bg-[#EEF7FB] border border-[#1677B8]/30 rounded-lg text-[11px] text-[#1677B8]">
            <strong>Authorized Scope:</strong> For use by Rig Superintendent, Toolpusher, and Tour Drilling Engineer upon detection of flow-out returns drop &gt; 5% or active pit volume loss &gt; 0.5 m³ in Lower Barail (2750–2940m TVD).
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#12324A] text-sm flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-[#118A8A]" />
              <span>Mandatory Phase 1: Verification & Initial Action (0 – 15 Min)</span>
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#193040]">
              <li>
                <strong>Perform Flow Check:</strong> Stop rotary, pull bit 2.0 m off bottom, space out tool joint, and perform 5-minute static flow check on trip tank.
              </li>
              <li>
                <strong>Record Loss Rate:</strong> Determine static loss rate (bbl/hr or m³/hr) vs dynamic loss rate while circulating at reduced pump rate.
              </li>
              <li>
                <strong>Notify Drilling Superintendent:</strong> Alert base eRTMAC focal and Mud Engineer.
              </li>
            </ol>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#DDE6EA]">
            <h4 className="font-bold text-[#12324A] text-sm flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-[#118A8A]" />
              <span>Phase 2: Primary Ranked Treatment Protocol (OIL-X12 Precedent)</span>
            </h4>
            <div className="bg-[#FFF7E8] p-3 rounded-lg border border-[#D38B22]/30 space-y-2">
              <div className="font-semibold text-[#12324A]">
                Option A: Controlled ROP + High-Viscosity LCM Pill (75% Historical Success)
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#193040]">
                <li>Mix 25 bbl pill: base mud + 25 ppb medium/coarse mica + 15 ppb CaCO3 + 2 ppb fibrous cellulose.</li>
                <li>Spot pill across loss zone (2770–2825m TVD); leave 5 bbl inside drill string.</li>
                <li>Pull bit into 9-5/8" casing shoe at 2650m TVD; allow pill to soak for 3 to 4 hours.</li>
                <li>Circulate bottoms up gently at 250–350 gpm and observe pit level.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#DDE6EA]">
            <h4 className="font-bold text-[#12324A] text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C93C3C]" />
              <span>Well-Control Safeguards</span>
            </h4>
            <p className="text-[11px] text-[#667B89]">
              Never allow mud level to drop below surface in annulus. If fluid level drops into casing, immediately fill annulus with base mud through kill line and calculate hydrostatic deficit to avoid secondary kick from underlying Kopili formation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#DDE6EA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#2F8F5B]">
            <ShieldCheck className="w-4 h-4" />
            <span>SOP Approved by Oil India Drilling Directorate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSOPModalOpen(false);
                setIsAckModalOpen(true);
              }}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-[#12324A] text-white hover:bg-[#1F4E6B] transition-colors"
            >
              Return to Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
