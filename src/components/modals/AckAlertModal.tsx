import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, ShieldAlert, BookOpen, X, AlertTriangle } from 'lucide-react';

export const AckAlertModal: React.FC = () => {
  const {
    isAckModalOpen,
    setIsAckModalOpen,
    activeAlert,
    activeAlertTimer,
    acknowledgeAlert,
    setIsSOPModalOpen,
  } = useApp();

  const [selectedAction, setSelectedAction] = useState<string>(
    'Controlled ROP reduction + high-viscosity LCM pill (Ranked: 75% success, 6.5h NPT)'
  );
  const [outcomeNotes, setOutcomeNotes] = useState<string>(
    'Discontinued drilling ahead at 2787.7m TVD. Rigged up to spot 25 bbl medium-coarse mica pill; monitoring active pit.'
  );

  if (!isAckModalOpen || !activeAlert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    acknowledgeAlert(activeAlert.id, selectedAction, outcomeNotes);
    setIsAckModalOpen(false);
  };

  const minutesRemaining = Math.floor(activeAlertTimer / 60);
  const secondsRemaining = activeAlertTimer % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DDE6EA] flex items-center justify-between bg-[#FFF1F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C93C3C] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#12324A]">Acknowledge Operational Alert</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#C93C3C] border border-[#C93C3C]/30 font-bold">
                  {activeAlert.id}
                </span>
              </div>
              <p className="text-xs text-[#667B89]">
                Well OIL-BRL-09 · Lower Barail at 2787.7 m TVD
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAckModalOpen(false)}
            className="p-1.5 text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* SLA Countdown Warning */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFF7E8] border border-[#D38B22]/30 text-[#D38B22]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#E87825]" />
              <span>SLA Acknowledgment Window:</span>
            </div>
            <div className="font-mono-tabular font-bold text-sm text-[#12324A]">
              {minutesRemaining}:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining} min remaining
            </div>
          </div>

          {/* Context Reminder */}
          <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
            <div className="font-semibold text-[#12324A]">Evidence Trigger:</div>
            <div className="text-[#667B89]">
              Flow-out is <strong>-7.1% below baseline</strong>, active pit volume declining by <strong>-1.05 m³</strong>, and torque increased by <strong>+2.06 kNm</strong>. Historical fingerprint similarity: <strong>88% to OIL-X12</strong>.
            </div>
          </div>

          {/* Action Taken Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#12324A] block">
              Mitigation Action Implemented / Initiated:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#DDE6EA] rounded-lg text-xs font-medium text-[#193040] focus:border-[#1677B8] focus:outline-hidden"
            >
              <option value="Controlled ROP reduction + high-viscosity LCM pill (Ranked: 75% success, 6.5h NPT)">
                Controlled ROP reduction + high-viscosity LCM pill (Ranked: 75% success, 6.5h NPT)
              </option>
              <option value="Reduce ECD / flow rate from 620 to 480 gpm (Ranked: 67% success, 9.0h NPT)">
                Reduce ECD / flow rate from 620 to 480 gpm (Ranked: 67% success, 9.0h NPT)
              </option>
              <option value="Fiber-reinforced cross-linked pill (Ranked: 80% success, 7.2h NPT)">
                Fiber-reinforced cross-linked pill (Ranked: 80% success, 7.2h NPT)
              </option>
              <option value="Condition mud system, verify LCM inventory & monitor flow returns">
                Condition mud system, verify LCM inventory & monitor flow returns
              </option>
              <option value="Pull off bottom to casing shoe & circulate clean">
                Pull off bottom to casing shoe & circulate clean
              </option>
              <option value="Custom operational measure (detailed below)">
                Custom operational measure (detailed below)
              </option>
            </select>
          </div>

          {/* Operational Notes / Outcome */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#12324A] block">
              Operational Notes & Observed Rig Response:
            </label>
            <textarea
              rows={3}
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#DDE6EA] rounded-lg text-xs text-[#193040] focus:border-[#1677B8] focus:outline-hidden"
              placeholder="Record initial mud check, flow check result, LCM pill mixing status..."
            />
          </div>

          {/* Advisory Notice */}
          <div className="text-[11px] text-[#667B89] bg-[#EEF7FB] p-2.5 rounded border border-[#1677B8]/20 flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#1677B8] shrink-0 mt-0.5" />
            <span>
              Advisory record only. This acknowledgment is cryptographically logged in the immutable audit trail with operator timestamp.
            </span>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-between border-t border-[#DDE6EA]">
            <button
              type="button"
              onClick={() => {
                setIsAckModalOpen(false);
                setIsSOPModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[#118A8A] hover:bg-[#EEF7FB] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Review Approved SOP</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAckModalOpen(false)}
                className="px-3.5 py-1.5 rounded text-xs font-medium border border-[#DDE6EA] text-[#667B89] hover:bg-[#F5F8FA] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-semibold bg-[#2F8F5B] text-white hover:bg-[#257549] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Acknowledgment & Log</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
