import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const SyntheticDataBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setShowInfo(!showInfo)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF7E8] border border-[#D38B22]/30 text-[#D38B22] rounded text-xs font-medium tracking-wide cursor-pointer hover:bg-[#FFF7E8]/80 transition-colors ${className}`}
        title="The DRILLDNA platform is ready for approved Oil India historical-data onboarding. The current seed records are synthetic because operational data requires OIL approval, governance clearance, and SME review before use."
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D38B22] shrink-0" />
        <span className="font-semibold">Pilot Sandbox — synthetic seed dataset</span>
        <Info className="w-3 h-3 text-[#D38B22] ml-0.5" />
      </div>

      {showInfo && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-80 p-3 bg-white border border-[#DDE6EA] rounded-xl shadow-lg text-xs text-[#193040] animate-in fade-in duration-100">
          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-[#DDE6EA]">
            <span className="font-bold text-[#12324A] text-xs">Pilot Readiness & Data Policy</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(false);
              }}
              className="text-[#8FA1AC] hover:text-[#12324A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#667B89] leading-relaxed">
            The DRILLDNA platform is ready for approved Oil India historical-data onboarding. The current seed records are synthetic because operational data requires OIL approval, governance clearance, and SME review before use.
          </p>
          <div className="mt-2 pt-2 border-t border-[#DDE6EA]/60 flex justify-between items-center text-[10px] text-[#8FA1AC]">
            <span>Environment: PILOT SANDBOX</span>
            <span>Integration: Mock Adapter</span>
          </div>
        </div>
      )}
    </div>
  );
};
