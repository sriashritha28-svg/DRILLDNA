import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Shield,
  Clock,
  BookOpen,
} from 'lucide-react';

export const MitigationHistoryView: React.FC = () => {
  const { mitigations, setIsEvidenceModalOpen, setIsSOPModalOpen } = useApp();

  const [filterState, setFilterState] = useState<string>('All');

  const filteredMitigations = mitigations.filter((m) => {
    if (filterState === 'All') return true;
    if (filterState === 'Ranked') return m.displayState === 'Ranked';
    if (filterState === 'Insufficient') return m.displayState === 'Insufficient evidence';
    return true;
  });

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Mitigation History
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Historically observed responses — review before action (Barail Formation precedents)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSOPModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF7FB] border border-[#1677B8]/30 text-[#1677B8] hover:bg-[#1677B8]/10 rounded-lg text-xs font-semibold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Approved SOP</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice Banner */}
      <div className="p-3.5 bg-[#FFF7E8] border border-[#D38B22]/40 rounded-xl text-xs text-[#193040] leading-relaxed flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-[#D38B22] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#12324A]">Mandatory Safety Rule:</strong> Ranked from outcomes in comparable historical cases. Review the approved SOP and apply drilling-engineer judgement before action.
          <div className="text-[11px] text-[#667B89] mt-0.5">
            Criterion: An operational action is classified as <strong>Ranked</strong> only when backed by at least 3 comparable historical cases. Actions with &lt; 3 cases remain designated as <strong>Insufficient evidence</strong>.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#667B89] font-medium mr-1">Display State:</span>
        {['All', 'Ranked', 'Insufficient'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterState(st)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterState === st
                ? 'bg-[#12324A] text-white shadow-2xs'
                : 'bg-white border border-[#DDE6EA] text-[#667B89] hover:bg-slate-50'
            }`}
          >
            {st === 'Insufficient' ? 'Insufficient Evidence' : st}
          </button>
        ))}
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F5F8FA] border-b border-[#DDE6EA] text-[#667B89]">
                <th className="p-3.5 font-semibold">Mitigation Action</th>
                <th className="p-3.5 font-semibold">Event Type</th>
                <th className="p-3.5 font-semibold">Comparable Cases</th>
                <th className="p-3.5 font-semibold">Success Rate</th>
                <th className="p-3.5 font-semibold">Mean NPT</th>
                <th className="p-3.5 font-semibold">Recurrence</th>
                <th className="p-3.5 font-semibold">Source Document</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE6EA]/60 font-sans">
              {filteredMitigations.map((item) => {
                const isRanked = item.displayState === 'Ranked';
                return (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 font-bold text-[#12324A] max-w-xs">
                      <div>{item.action}</div>
                      <div className="text-[11px] text-[#667B89] font-normal mt-0.5 line-clamp-1">
                        {item.notes}
                      </div>
                    </td>

                    <td className="p-3.5 text-[#667B89]">{item.eventType}</td>

                    <td className="p-3.5 font-mono-tabular font-bold text-[#12324A]">
                      {item.successfulCasesCount}/{item.comparableCasesCount} cases
                    </td>

                    <td className="p-3.5 font-mono-tabular">
                      <span
                        className={`font-bold ${
                          item.successRatePct >= 75
                            ? 'text-[#2F8F5B]'
                            : item.successRatePct >= 50
                            ? 'text-[#E87825]'
                            : 'text-[#C93C3C]'
                        }`}
                      >
                        {item.successRatePct}%
                      </span>
                    </td>

                    <td className="p-3.5 font-mono-tabular font-bold text-[#12324A]">
                      {item.meanNptHours.toFixed(1)} h
                    </td>

                    <td className="p-3.5 font-mono-tabular text-[#667B89]">
                      {item.recurrenceRatePct}%
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono-tabular text-[11px]">
                        <span className="font-semibold text-[#12324A]">{item.sourceDoc}</span>
                        <span className="text-[#667B89]">p.{item.sourcePage}</span>
                      </div>
                      {item.id === 'MIT-01' && (
                        <button
                          onClick={() => setIsEvidenceModalOpen(true)}
                          className="text-[#1677B8] hover:underline text-[10px] font-semibold mt-0.5 block"
                        >
                          Inspect DDR Page 14
                        </button>
                      )}
                    </td>

                    <td className="p-3.5 text-[11px]">
                      <span className={item.reviewStatus === 'SME verified' ? 'text-[#2F8F5B] font-medium' : 'text-[#D38B22] font-medium'}>
                        {item.reviewStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isRanked
                            ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                            : 'bg-[#FFF7E8] text-[#D9A300] border border-[#D9A300]/30'
                        }`}
                      >
                        {item.displayState}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
