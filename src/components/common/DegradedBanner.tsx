import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';

export const DegradedBanner: React.FC = () => {
  const { simulator, setSimulator } = useApp();

  const notices: { id: string; type: 'warning' | 'error' | 'info'; text: string; action?: () => void; actionLabel?: string }[] = [];

  if (simulator.feedDelaySec > 30) {
    notices.push({
      id: 'feed-delay',
      type: 'error',
      text: `Live feed delayed. Last data received: ${simulator.feedDelaySec}s ago. Live alert evaluation paused.`,
      action: () => setSimulator((prev) => ({ ...prev, feedDelaySec: 0 })),
      actionLabel: 'Restore Live Stream'
    });
  }

  if (simulator.sensorFaultTorque) {
    notices.push({
      id: 'sensor-fault',
      type: 'warning',
      text: 'Signal unreliable. Surface torque parameter is excluded from fingerprint matching.',
      action: () => setSimulator((prev) => ({ ...prev, sensorFaultTorque: false })),
      actionLabel: 'Clear Fault'
    });
  }

  if (simulator.tierOverride !== 'Tier 1') {
    notices.push({
      id: 'tier-degraded',
      type: 'warning',
      text: 'Detailed fingerprint unavailable — formation-level evidence only.',
      action: () => setSimulator((prev) => ({ ...prev, tierOverride: 'Tier 1' })),
      actionLabel: 'Restore Tier 1'
    });
  }

  if (simulator.provisionalAlias) {
    notices.push({
      id: 'provisional-alias',
      type: 'info',
      text: 'Formation match: provisional. Lower Barail sand alias awaiting SME geological verification.',
      action: () => setSimulator((prev) => ({ ...prev, provisionalAlias: false })),
      actionLabel: 'Confirm Canonical'
    });
  }

  if (!simulator.modelLocked) {
    notices.push({
      id: 'model-lock',
      type: 'info',
      text: 'Active well remains on current model version until engineer acceptance.',
      action: () => setSimulator((prev) => ({ ...prev, modelLocked: true })),
      actionLabel: 'Re-lock Model'
    });
  }

  if (notices.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-medium ${
            notice.type === 'error'
              ? 'bg-[#FFF1F1] border-[#C93C3C]/40 text-[#C93C3C]'
              : notice.type === 'warning'
              ? 'bg-[#FFF7E8] border-[#E87825]/40 text-[#E87825]'
              : 'bg-[#EEF7FB] border-[#1677B8]/40 text-[#1677B8]'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : notice.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>

          {notice.action && (
            <button
              onClick={notice.action}
              className="ml-4 px-2.5 py-1 bg-white border border-current rounded shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{notice.actionLabel}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
