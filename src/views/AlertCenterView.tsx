import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertItem, AlertFeedback } from '../types';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  FileText,
  History,
  ShieldAlert,
  UserCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const {
    alerts,
    activeAlertTimer,
    submitAlertFeedback,
    escalateAlert,
    setIsAckModalOpen,
    setIsEvidenceModalOpen,
    setActiveView,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  const minutesRemaining = Math.floor(activeAlertTimer / 60);
  const secondsRemaining = activeAlertTimer % 60;

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Alert Center & Escalation Workflow
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Operational alerts, strict SLA acknowledgement governance, and engineer verification feedback
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#667B89] font-medium mr-1">Filter:</span>
          {['All', 'Active', 'Acknowledged', 'Escalated', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-[#12324A] text-white shadow-2xs'
                  : 'bg-white border border-[#DDE6EA] text-[#667B89] hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Queue */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isActive = alert.status === 'Active';
          const isEscalated = alert.status === 'Escalated';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                isActive
                  ? 'border-[#C93C3C]/50 bg-[#FFF1F1]/30'
                  : isEscalated
                  ? 'border-[#E87825]/50 bg-[#FFF7E8]/20'
                  : 'border-[#DDE6EA]'
              }`}
            >
              {/* Alert Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#DDE6EA]">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.severity === 'Alert'
                        ? 'bg-[#C93C3C] text-white shadow-xs'
                        : alert.severity === 'Advisory'
                        ? 'bg-[#E87825] text-white'
                        : 'bg-[#D9A300] text-white'
                    }`}
                  >
                    <Bell className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#12324A]">{alert.title}</h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#12324A] border border-[#DDE6EA] font-semibold">
                        {alert.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                          alert.severity === 'Alert'
                            ? 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                            : alert.severity === 'Advisory'
                            ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
                            : 'bg-[#FFFDEB] text-[#D9A300] border border-[#D9A300]/30'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#667B89]">
                      <div>Well: <strong className="text-[#12324A] font-mono-tabular">{alert.wellId}</strong></div>
                      <span>·</span>
                      <div>Formation: <strong className="text-[#12324A]">{alert.formation}</strong></div>
                      <span>·</span>
                      <div>Depth: <strong className="text-[#12324A] font-mono-tabular">{alert.depthTvdM} m TVD</strong></div>
                      <span>·</span>
                      <div>Raised: <span>{alert.raisedTimeStr}</span></div>
                    </div>
                  </div>
                </div>

                {/* Right Status & SLA badge */}
                <div className="flex flex-wrap items-center gap-2">
                  {isActive && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#C93C3C]/30 rounded-lg text-xs font-mono-tabular text-[#C93C3C] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        SLA: {minutesRemaining}:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
                      </span>
                    </div>
                  )}

                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                      alert.status === 'Active'
                        ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
                        : alert.status === 'Acknowledged'
                        ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                        : alert.status === 'Escalated'
                        ? 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Alert Body */}
              <div className="py-3 space-y-2 text-xs">
                <div className="p-3 bg-[#F5F8FA] border border-[#DDE6EA] rounded-lg text-[#193040] leading-relaxed">
                  {alert.evidenceSummary}
                </div>

                {/* Comparable Fingerprint match tag */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-2.5 rounded-lg border border-[#DDE6EA]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[#667B89]">Historical match:</span>
                    <strong className="text-[#12324A]">{alert.comparableWell}</strong>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
                      {alert.fingerprintSimilarity}% Fingerprint Similarity
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#667B89]">
                    <span>Source document:</span>
                    <strong className="text-[#12324A]">{alert.sourceDoc} p.{alert.sourcePage}</strong>
                  </div>
                </div>

                {/* Operator Actions Recorded if Acknowledged */}
                {alert.actionTaken && (
                  <div className="p-2.5 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-[#2F8F5B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged Action Recorded:</span>
                    </div>
                    <div className="text-[#193040]"><strong>Action:</strong> {alert.actionTaken}</div>
                    {alert.outcome && (
                      <div className="text-[#667B89]"><strong>Outcome:</strong> {alert.outcome}</div>
                    )}
                    <div className="text-[10px] text-[#667B89] pt-1">
                      By: {alert.acknowledgedBy} · Time: {alert.acknowledgedAt}
                    </div>
                  </div>
                )}

                {/* Escalation notice if Escalated */}
                {alert.status === 'Escalated' && (
                  <div className="p-2.5 bg-[#FFF1F1] border border-[#C93C3C]/30 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-[#C93C3C] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalated to Drilling Supervisor:</span>
                    </div>
                    <div className="text-[#193040]">
                      Overdue acknowledgment threshold reached. Escalated to: <strong>{alert.escalatedTo}</strong> at {alert.escalatedAt}.
                    </div>
                  </div>
                )}
              </div>

              {/* Alert Actions & Feedback Row */}
              <div className="pt-3 border-t border-[#DDE6EA] flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Left: Feedback Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-[#667B89] font-medium text-[11px]">Engineer Feedback:</span>
                  {(['Relevant', 'Partially Relevant', 'False Positive'] as AlertFeedback[]).map((fb) => (
                    <button
                      key={fb}
                      onClick={() => submitAlertFeedback(alert.id, fb)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        alert.feedback === fb
                          ? 'bg-[#12324A] text-white shadow-2xs'
                          : 'bg-white border border-[#DDE6EA] text-[#667B89] hover:bg-slate-50'
                      }`}
                    >
                      {fb}
                    </button>
                  ))}
                </div>

                {/* Right: Operational Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('replay')}
                    className="px-3 py-1.5 rounded-lg border border-[#DDE6EA] text-[#12324A] hover:bg-[#F5F8FA] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-[#1677B8]" />
                    <span>View Replay</span>
                  </button>

                  <button
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-[#DDE6EA] text-[#12324A] hover:bg-[#F5F8FA] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D38B22]" />
                    <span>View Source Evidence</span>
                  </button>

                  {isActive && (
                    <button
                      onClick={() => setIsAckModalOpen(true)}
                      className="px-4 py-1.5 rounded-lg bg-[#2F8F5B] text-white hover:bg-[#257549] font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {isActive && (
                    <button
                      onClick={() => escalateAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#FFF1F1] border border-[#C93C3C]/30 text-[#C93C3C] hover:bg-[#C93C3C] hover:text-white font-semibold transition-colors"
                      title="Manually escalate alert to supervisor"
                    >
                      <span>Escalate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
