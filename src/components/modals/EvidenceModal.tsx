import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, X, CheckCircle2, Copy, ExternalLink, Download } from 'lucide-react';

export const EvidenceModal: React.FC = () => {
  const { isEvidenceModalOpen, setIsEvidenceModalOpen } = useApp();

  if (!isEvidenceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DDE6EA] flex items-center justify-between bg-[#F5F8FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF7E8] border border-[#D38B22]/30 flex items-center justify-center text-[#D38B22]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#12324A]">Synthetic DDR_OIL-X12.pdf</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  Page 14
                </span>
                <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-[#FFF7E8] text-[#D38B22] border border-[#D38B22]/30">
                  Synthetic Evidence Document
                </span>
              </div>
              <p className="text-xs text-[#667B89]">
                Oil India Limited · Daily Drilling Report & Tour Log Archive
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="p-1.5 text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Document Sheet Simulation */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1 font-sans text-xs">
          {/* Document Header Box */}
          <div className="bg-white border border-[#DDE6EA] rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex justify-between items-start border-b border-dashed border-[#DDE6EA] pb-3">
              <div>
                <div className="font-bold text-[#12324A] text-sm tracking-tight">OIL INDIA LIMITED</div>
                <div className="text-[11px] text-[#667B89]">EASTERN BASIN OPERATIONS — DULIAJAN</div>
                <div className="text-[10px] text-[#8FA1AC]">DAILY DRILLING & TOUR REPORT (FORM DDR-4)</div>
              </div>
              <div className="text-right font-mono-tabular text-[11px]">
                <div><span className="text-[#667B89]">Well No:</span> <strong className="text-[#12324A]">OIL-X12</strong></div>
                <div><span className="text-[#667B89]">Report Date:</span> 14-Oct-2021</div>
                <div><span className="text-[#667B89]">Tour:</span> 06:00 – 18:00 (Day Tour)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-[#F5F8FA] p-2.5 rounded">
              <div><span className="text-[#667B89]">Formation:</span> <strong className="text-[#12324A]">Lower Barail</strong></div>
              <div><span className="text-[#667B89]">Bit TVD:</span> <strong className="text-[#12324A]">2795.0 m</strong></div>
              <div><span className="text-[#667B89]">Mud Weight:</span> 1.18 SG KCl-Pol</div>
              <div><span className="text-[#667B89]">Flow Rate:</span> 610 GPM</div>
            </div>

            {/* Document Highlighted Passage */}
            <div className="space-y-1.5 pt-2">
              <div className="font-semibold text-[#12324A] flex items-center justify-between">
                <span>09:20 – 16:30 Tour Incident Log:</span>
                <span className="text-[10px] text-[#118A8A] font-medium bg-[#EEF7FB] px-2 py-0.5 rounded">
                  Match for Active Well Precursor
                </span>
              </div>
              <div className="p-3.5 bg-[#FFF7E8] border-l-4 border-[#D38B22] rounded-r text-[#193040] leading-relaxed text-xs space-y-2">
                <p>
                  <strong>09:20 to 09:40:</strong> While drilling 8-1/2" hole at <strong>2795.0 m TVD</strong> in <strong>Lower Barail massive sandstone</strong>, sensor logs recorded gradual <strong>flow-out returns decline from 100% to 91% (~9% deficit)</strong> accompanied by <strong>surface torque increase from 16.2 to 18.8 kNm</strong> over a 20-minute interval. Active pit volume showed steady drop (-0.95 m³).
                </p>
                <p>
                  <strong>09:40 Escalation & Mitigation:</strong> Partial mud losses escalated to 25 bbl/hr. Drilling discontinued immediately. Controlled ROP to 0 m/hr, pulled bit 3 stands off bottom, and pumped <strong>25 bbl high-viscosity LCM pill (mica coarse/medium blend + 15 ppb calcium carbonate)</strong>. Displaced with 1.18 SG mud at reduced rate (350 gpm).
                </p>
                <p>
                  <strong>16:10 Post-Mitigation Result:</strong> Circulation regained at 15:50. Mud weight conditioned, full 100% returns verified on flow paddle. Total Non-Productive Time: <strong>6.5 hours</strong>. Resumed drilling ahead at 16:30.
                </p>
              </div>
            </div>

            {/* Document Verification & SME Review Stamp */}
            <div className="pt-3 border-t border-[#DDE6EA] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#2F8F5B]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Geological & Drilling Data Integrity: Verified vs Tour Log Sheet</span>
              </div>
              <div className="text-[#667B89]">
                Reviewed By: <strong className="text-[#12324A]">A. K. Hazarika (Chief Superintendent)</strong>
              </div>
            </div>
          </div>

          {/* Metadata & Governance Stack */}
          <div className="bg-white border border-[#DDE6EA] rounded-lg p-3 text-[11px] space-y-1 text-[#667B89]">
            <div className="font-semibold text-[#12324A] text-xs">DRILLDNA Evidence Index Reference:</div>
            <div>· Evidence ID: <span className="font-mono text-[#12324A]">EV-OIL-X12-DDR14</span></div>
            <div>· Cross-correlation fingerprint: <span className="font-mono text-[#1677B8] font-bold">FP-BRL-2795 (88% similarity)</span></div>
            <div>· OCR Hash: <span className="font-mono text-[#8FA1AC]">7c8f49a3e210dc89</span> · Indexed: 2026-08-15</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#DDE6EA] bg-white flex items-center justify-between">
          <div className="text-[11px] text-[#667B89]">
            Linked to alert <strong className="text-[#12324A]">ALT-2026-088</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  'Synthetic DDR_OIL-X12.pdf, Page 14 (Oil India Limited): Lower Barail 2795m TVD 9% flow drop with rising torque; mitigated in 6.5h NPT via high-viscosity LCM pill.'
                );
              }}
              className="px-3 py-1.5 rounded text-xs font-medium border border-[#DDE6EA] text-[#193040] hover:bg-[#F5F8FA] transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#667B89]" />
              <span>Copy Citation</span>
            </button>
            <button
              onClick={() => setIsEvidenceModalOpen(false)}
              className="px-4 py-1.5 rounded text-xs font-medium bg-[#12324A] text-white hover:bg-[#1F4E6B] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
