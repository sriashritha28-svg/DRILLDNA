import React from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import { Shield, Clock, UserCheck, Hash, CheckCircle2 } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLog } = useApp();

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Audit Log
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Immutable chronological audit trail of operator decisions, alert acknowledgments, and system events
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#2F8F5B] bg-[#EEF9F2] px-3 py-1.5 rounded-lg border border-[#2F8F5B]/30 font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Tamper-Resistant SHA-256 Ledger</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#F5F8FA] border-b border-[#DDE6EA] text-[#667B89]">
                <th className="p-3.5 font-semibold">Timestamp (UTC)</th>
                <th className="p-3.5 font-semibold">Operator / Role</th>
                <th className="p-3.5 font-semibold">Action Type</th>
                <th className="p-3.5 font-semibold">Operational Event Details</th>
                <th className="p-3.5 font-semibold">Target Ref</th>
                <th className="p-3.5 font-semibold">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE6EA]/60 font-mono-tabular">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3.5 text-[#667B89] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-[#12324A]">{log.userName}</div>
                    <div className="text-[10px] text-[#667B89] font-sans">{log.userRole}</div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        log.actionType.includes('ALERT')
                          ? 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                          : log.actionType.includes('ACKNOWLEDGE')
                          ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                          : 'bg-[#EEF7FB] text-[#1677B8] border border-[#1677B8]/30'
                      }`}
                    >
                      {log.actionType}
                    </span>
                  </td>

                  <td className="p-3.5 text-[#193040] font-sans max-w-md">
                    {log.details}
                  </td>

                  <td className="p-3.5 font-semibold text-[#12324A]">
                    {log.targetId || '—'}
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#8FA1AC]">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
