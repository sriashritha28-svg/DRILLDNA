import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SafetyStrip: React.FC = () => {
  return (
    <div className="bg-[#12324A] text-[#F5F8FA] border-b border-[#1F4E6B] px-4 py-1.5 text-xs flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-3.5 h-3.5 text-[#D9A300] shrink-0" />
        <span className="font-medium text-slate-100">
          Advisory and read-only system. DRILLDNA does not send control commands to rig equipment. Final action remains with the drilling engineer.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-300">
        <span>eRTMAC Beside Integration</span>
        <span>·</span>
        <span className="text-[#2F8F5B] font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F5B]" /> Read-Only Link Active
        </span>
      </div>
    </div>
  );
};
