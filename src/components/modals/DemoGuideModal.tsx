import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { BookOpen, X, ArrowRight, Play, CheckCircle2, Shield } from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { isDemoGuideModalOpen, setIsDemoGuideModalOpen, setActiveView } = useApp();

  if (!isDemoGuideModalOpen) return null;

  const steps: { title: string; view: AppView; text: string; actionText: string }[] = [
    {
      title: '1. Operations Dashboard & Live Precursor Alert',
      view: 'dashboard',
      text: 'Examine active well OIL-BRL-09 at 2787.7 m TVD inside the Lower Barail loss window. Note the -7.1% flow drop, +2.06 kNm torque, and 88% fingerprint similarity to historical well OIL-X12.',
      actionText: 'View Dashboard'
    },
    {
      title: '2. Synchronized Risk Replay (Live vs OIL-X12)',
      view: 'replay',
      text: 'Open Risk Replay to see all 4 telemetry curves (Flow-out, Torque, Pit Volume, SPP) synchronized with historical precedent OIL-X12. Test Play/Pause and scrub controls.',
      actionText: 'Open Risk Replay'
    },
    {
      title: '3. Depth-Aware Risk Runway Planning',
      view: 'runway',
      text: 'Observe the geological depth track from 2500m to 3100m TVD, showing 9-5/8" casing shoe @ 2650m, the active alert zone (2780–2810m), and the upcoming Kopili Well-Control Watch.',
      actionText: 'View Risk Runway'
    },
    {
      title: '4. Nearby Wells Map & Spatial Context',
      view: 'nearby-map',
      text: 'Explore the 14 offset wells in Upper Assam Basin. Filter by 3 km radius or formation to review historical mud loss incidents in offset wells.',
      actionText: 'Explore Map'
    },
    {
      title: '5. Grounded DrillAsk Assistant (With Source Citations)',
      view: 'drillask',
      text: 'Try sample queries like "Loss events in Barail below 2700 m TVD". Verify that every claim links to page 14 of Synthetic DDR_OIL-X12.pdf, and ungrounded questions return "No evidence found."',
      actionText: 'Try DrillAsk'
    },
    {
      title: '6. Backtest Mode & Section Handover Brief',
      view: 'backtest',
      text: 'Validate DRILLDNA on held-out synthetic wells (18.4 min lead time vs 2.1 min threshold alarm). Switch to Section Handover Brief to review the printable shift handover.',
      actionText: 'Run Backtest'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DDE6EA] flex items-center justify-between bg-[#F5F8FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12324A] text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#118A8A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#12324A]">3-Minute Executive Demo Script</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
                  SIH26121 Walkthrough
                </span>
              </div>
              <p className="text-xs text-[#667B89]">
                Structured pitch flow for evaluating DRILLDNA decision-support capabilities
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDemoGuideModalOpen(false)}
            className="p-1.5 text-[#667B89] hover:text-[#12324A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Script Steps */}
        <div className="p-6 overflow-y-auto space-y-3.5 text-xs">
          <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-lg text-[#2F8F5B] text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              <strong>Advisory Demonstration:</strong> Follow these 6 steps to demonstrate how DRILLDNA prevents NPT by correlating live telemetry against historical formation memory.
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="p-3.5 bg-white border border-[#DDE6EA] rounded-lg hover:border-[#1677B8]/40 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-[#12324A] text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#12324A] text-white flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-[#667B89] leading-relaxed text-[11px]">{step.text}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveView(step.view);
                    setIsDemoGuideModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-[#EEF7FB] hover:bg-[#1677B8] hover:text-white text-[#1677B8] rounded font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#DDE6EA] bg-[#F5F8FA] flex items-center justify-between">
          <div className="text-[11px] text-[#667B89]">
            Target Well: <strong className="text-[#12324A]">OIL-BRL-09</strong> (Lower Barail)
          </div>
          <button
            onClick={() => setIsDemoGuideModalOpen(false)}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-[#12324A] text-white hover:bg-[#1F4E6B] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
