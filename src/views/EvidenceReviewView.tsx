import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  FileCheck,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
  Copy,
  ChevronRight,
} from 'lucide-react';

interface EvidenceDoc {
  id: string;
  name: string;
  well: string;
  formation: string;
  pages: number;
  highlightPage: number;
  incidentType: string;
  date: string;
  smeStatus: string;
  summary: string;
}

export const EvidenceReviewView: React.FC = () => {
  const { setIsEvidenceModalOpen } = useApp();

  const documents: EvidenceDoc[] = [
    {
      id: 'DOC-01',
      name: 'Synthetic DDR_OIL-X12.pdf',
      well: 'OIL-X12',
      formation: 'Lower Barail',
      pages: 28,
      highlightPage: 14,
      incidentType: 'Severe Mud Loss',
      date: '14-Oct-2021',
      smeStatus: 'SME review pending',
      summary: 'Page 14: 9% flow drop and rising torque (+2.2 kNm) at 2795m TVD; mitigated via 25 bbl mica LCM pill in 6.5h NPT.',
    },
    {
      id: 'DOC-02',
      name: 'Synthetic DDR_OIL-X18.pdf',
      well: 'OIL-X18',
      formation: 'Lower Barail',
      pages: 24,
      highlightPage: 9,
      incidentType: 'Partial Mud Loss',
      date: '22-Aug-2020',
      smeStatus: 'SME verified',
      summary: 'Page 9: 8% flow-out deficit at 2810m TVD; reduced circulation rate from 620 to 480 gpm, full returns in 9.0h.',
    },
    {
      id: 'DOC-03',
      name: 'Synthetic DDR_OIL-X03.pdf',
      well: 'OIL-X03',
      formation: 'Lower Barail',
      pages: 36,
      highlightPage: 22,
      incidentType: 'Severe Mud Loss',
      date: '04-Feb-2018',
      smeStatus: 'SME review pending',
      summary: 'Page 22: Rapid total losses at 2805m TVD; balanced Class G cement plug spotted with 18.5h NPT.',
    },
    {
      id: 'DOC-04',
      name: 'Synthetic DDR_OIL-B02.pdf',
      well: 'OIL-B02',
      formation: 'Lower Barail',
      pages: 30,
      highlightPage: 19,
      incidentType: 'Partial Mud Loss',
      date: '18-Nov-2023',
      smeStatus: 'SME verified',
      summary: 'Page 19: Micro-fractured sand loss at 2788m TVD; fiber-reinforced cross-linked polymer pill pumped with 7.2h NPT.',
    },
  ];

  const [selectedDoc, setSelectedDoc] = useState<EvidenceDoc>(documents[0]);

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Evidence Review
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Audit-grade document archive of Daily Drilling Reports, Well Completion Reports, and tour logs
          </p>
        </div>

        <button
          onClick={() => setIsEvidenceModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[#118A8A]" />
          <span>Inspect DDR_OIL-X12.pdf Page 14</span>
        </button>
      </div>

      {/* 2-Column Document Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Document Index */}
        <div className="lg:col-span-5 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA] flex items-center justify-between">
            <span>Indexed Historical Reports</span>
            <span className="text-[10px] font-mono text-[#667B89]">4 Documents</span>
          </h3>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-[#1677B8] bg-[#EEF7FB] shadow-xs'
                      : 'border-[#DDE6EA] hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                      <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1677B8]' : 'text-[#8FA1AC]'}`} />
                      <span>{doc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#12324A] border border-[#DDE6EA]">
                      p.{doc.highlightPage}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-3 text-[11px] text-[#667B89]">
                    <span>Well: <strong className="text-[#12324A]">{doc.well}</strong></span>
                    <span>·</span>
                    <span>{doc.formation}</span>
                    <span>·</span>
                    <span>{doc.date}</span>
                  </div>

                  <p className="mt-1.5 text-[11px] text-[#193040] line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Document Page Review */}
        <div className="lg:col-span-7 bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-start justify-between pb-3 border-b border-[#DDE6EA]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#12324A]">{selectedDoc.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
                  Page {selectedDoc.highlightPage} of {selectedDoc.pages}
                </span>
              </div>
              <div className="text-[11px] text-[#667B89] mt-0.5">
                Well {selectedDoc.well} · Report Date: {selectedDoc.date} · Oil India Eastern Basin
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `${selectedDoc.name}, Page ${selectedDoc.highlightPage} (Oil India Limited): ${selectedDoc.summary}`
                );
              }}
              className="px-2.5 py-1 text-xs border border-[#DDE6EA] rounded hover:bg-slate-50 text-[#667B89] hover:text-[#12324A] flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Citation</span>
            </button>
          </div>

          {/* Document Content Simulation */}
          <div className="p-4 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg space-y-3 font-sans">
            <div className="flex justify-between border-b border-dashed border-[#DDE6EA] pb-2 text-[11px]">
              <div>
                <strong>OPERATIONAL INCIDENT LOG:</strong> {selectedDoc.incidentType}
              </div>
              <div className="font-mono text-[#667B89]">CERTIFIED TOUR SHEET EXTRACT</div>
            </div>

            <div className="p-3 bg-white border-l-4 border-[#D38B22] rounded-r text-[#193040] leading-relaxed text-[11px] space-y-2">
              <p>
                <strong>Tour Narrative:</strong> {selectedDoc.summary}
              </p>
              <p className="text-[#667B89]">
                Verified against digital surface sensor telemetry logs. Standpipe pressure, flow paddle returns, and mud pit levels corroborated by Tour Drilling Engineer.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#667B89] pt-1">
              <div>
                SME Review Status: <strong className="text-[#12324A]">{selectedDoc.smeStatus}</strong>
              </div>
              <div className="text-[#2F8F5B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cryptographically Hashed & Archived</span>
              </div>
            </div>
          </div>

          {/* Modal trigger */}
          {selectedDoc.id === 'DOC-01' && (
            <div className="pt-2">
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="w-full py-2 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#118A8A]" />
                <span>Open Full Certified OCR Modal Viewer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
