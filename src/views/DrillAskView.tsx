import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DRILLASK_KNOWLEDGE_BASE } from '../data/mockData';
import { DrillAskResult } from '../types';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const DrillAskView: React.FC = () => {
  const { setIsEvidenceModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('Loss events in Barail below 2700 m TVD and what worked');
  const [selectedResult, setSelectedResult] = useState<DrillAskResult | null>(
    DRILLASK_KNOWLEDGE_BASE[0]
  );
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const sampleQueries = [
    'Loss events in Barail below 2700 m TVD and what worked',
    'What happened before historical mud losses?',
    'Cementing problems at the 9-5/8 inch shoe within 5 km',
    'Show comparable wells with rising torque',
  ];

  const handleSearch = (queryToSearch: string) => {
    setSearchQuery(queryToSearch);
    setHasSearched(true);

    const q = queryToSearch.toLowerCase().trim();
    // Search in knowledge base
    const match = DRILLASK_KNOWLEDGE_BASE.find(
      (item) =>
        item.query.toLowerCase().includes(q) ||
        q.includes(item.query.toLowerCase()) ||
        (q.includes('barail') && q.includes('loss') && item.id === 'ASK-01') ||
        (q.includes('before') && q.includes('loss') && item.id === 'ASK-02') ||
        (q.includes('shoe') && q.includes('cement') && item.id === 'ASK-03') ||
        (q.includes('torque') && item.id === 'ASK-04')
    );

    if (match) {
      setSelectedResult(match);
    } else {
      // Ungrounded query strictly returns No evidence found!
      setSelectedResult({
        id: 'NOT_FOUND',
        query: queryToSearch,
        shortAnswer: 'No evidence found.',
        supportingPoints: [
          'No historical Daily Drilling Report, tour log, or Well Completion Report in the current formation memory database corroborates this query.',
          'DRILLDNA strictly forbids generating unsupported advice without page-level document citations.'
        ],
        sourceDoc: 'N/A',
        sourcePage: 0,
        confidencePct: 0,
        dataTier: 'Tier 1',
        reviewStatus: 'No evidence found',
        comparableWell: 'None',
        found: false,
      });
    }
  };

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              DrillAsk
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Evidence-backed historical drilling knowledge search grounded exclusively in certified DDRs and WCRs
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#2F8F5B] bg-[#EEF9F2] px-3 py-1.5 rounded-lg border border-[#2F8F5B]/30 font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Strict Hallucination-Free Grounding</span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8FA1AC] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask a subsurface or historical question (e.g., mud loss events in Barail, casing shoe FIT...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg text-xs font-medium text-[#193040] focus:bg-white focus:border-[#1677B8] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-xs"
          >
            Search Evidence
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#667B89] text-[11px] font-medium">Example inquiries:</span>
          {sampleQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="px-2.5 py-1 bg-[#F5F8FA] hover:bg-[#EEF7FB] text-[#1677B8] border border-[#DDE6EA] hover:border-[#1677B8]/40 rounded-lg text-[11px] transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      {hasSearched && selectedResult && (
        <div className="space-y-4">
          {selectedResult.found ? (
            /* Grounded Answer Card */
            <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4 text-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#DDE6EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30 font-bold">
                      Grounded Evidence Match
                    </span>
                    <span className="text-[#667B89] text-[11px]">
                      Confidence: <strong className="text-[#12324A] font-mono-tabular">{selectedResult.confidencePct}%</strong>
                    </span>
                    <span>·</span>
                    <span className="text-[#667B89] text-[11px]">
                      Tier: <strong className="text-[#1677B8]">{selectedResult.dataTier}</strong>
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-[#12324A] mt-1.5">
                    Query: "{selectedResult.query}"
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#667B89] bg-[#F5F8FA] px-2.5 py-1 rounded border border-[#DDE6EA]">
                    Status: <strong className="text-[#12324A]">{selectedResult.reviewStatus}</strong>
                  </span>
                </div>
              </div>

              {/* Short Answer Summary Box */}
              <div className="p-4 bg-[#EEF7FB] border-l-4 border-[#1677B8] rounded-r-lg text-xs leading-relaxed text-[#193040] space-y-2">
                <div className="font-bold text-[#12324A] text-xs uppercase tracking-wider">
                  Operational Summary:
                </div>
                <p className="text-[#193040] font-medium leading-relaxed">
                  {selectedResult.shortAnswer}
                </p>
              </div>

              {/* Supporting Evidence Cards */}
              <div className="space-y-2 pt-2">
                <div className="font-bold text-[#12324A] text-xs">Documented Subsurface Points:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedResult.supportingPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#F8FAFC] border border-[#DDE6EA] rounded-lg text-[11px] leading-relaxed text-[#193040] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Citation Footer */}
              <div className="pt-3 border-t border-[#DDE6EA] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#667B89]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D38B22]" />
                  <span>Verified Source Document:</span>
                  <strong className="text-[#12324A]">{selectedResult.sourceDoc}</strong>
                  <span className="text-[#12324A]">Page {selectedResult.sourcePage}</span>
                </div>

                {selectedResult.sourceDoc.includes('OIL-X12') && (
                  <button
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="px-3 py-1 bg-white border border-[#DDE6EA] text-[#1677B8] hover:bg-[#F5F8FA] rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect DDR Page 14</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Ungrounded Query: No Evidence Found Safeguard */
            <div className="bg-[#FFF1F1] border border-[#C93C3C]/40 rounded-xl p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#C93C3C] text-white flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#C93C3C]">No evidence found.</h2>
              <p className="text-xs text-[#667B89] max-w-md mx-auto leading-relaxed">
                No verified Daily Drilling Report, Well Completion Report, or offset sensor pattern supports this query in the Lower Barail formation memory. DRILLDNA does not generate speculative advice.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleSearch(sampleQueries[0])}
                  className="px-4 py-1.5 bg-white border border-[#DDE6EA] text-[#12324A] hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  Return to Verified Sample Queries
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
