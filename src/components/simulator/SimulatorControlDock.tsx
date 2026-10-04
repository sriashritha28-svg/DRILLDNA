import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, ChevronUp, ChevronDown, RefreshCw, AlertTriangle, Radio, WifiOff, FileWarning, Layers } from 'lucide-react';

export const SimulatorControlDock: React.FC = () => {
  const { simulator, setSimulator, resetDemoScenario } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full no-print">
      <div className="bg-white rounded-xl shadow-lg border border-[#DDE6EA] overflow-hidden">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3.5 py-2.5 bg-[#12324A] text-white flex items-center justify-between hover:bg-[#1F4E6B] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-[#118A8A]" />
            <span>Simulator Control Dock</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 text-slate-200">
              Degraded State Testing
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Expandable Controls Panel */}
        {isOpen && (
          <div className="p-3.5 space-y-3 bg-[#F5F8FA] text-xs">
            <div className="text-[11px] text-[#667B89]">
              Toggle operational fault injections to verify DRILLDNA resilience and degraded state advisories:
            </div>

            <div className="space-y-2">
              {/* Feed Delay Toggle */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-[#DDE6EA]">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-3.5 h-3.5 text-[#E87825]" />
                  <span className="text-[#193040] font-medium">42s Feed Delay (eRTMAC)</span>
                </div>
                <button
                  onClick={() =>
                    setSimulator((prev) => ({
                      ...prev,
                      feedDelaySec: prev.feedDelaySec > 30 ? 0 : 42,
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    simulator.feedDelaySec > 30
                      ? 'bg-[#C93C3C] text-white'
                      : 'bg-slate-100 text-[#667B89] hover:bg-slate-200'
                  }`}
                >
                  {simulator.feedDelaySec > 30 ? 'Active' : 'Simulate'}
                </button>
              </div>

              {/* Torque Sensor Fault Toggle */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-[#DDE6EA]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#E87825]" />
                  <span className="text-[#193040] font-medium">Torque Sensor Fault</span>
                </div>
                <button
                  onClick={() =>
                    setSimulator((prev) => ({
                      ...prev,
                      sensorFaultTorque: !prev.sensorFaultTorque,
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    simulator.sensorFaultTorque
                      ? 'bg-[#E87825] text-white'
                      : 'bg-slate-100 text-[#667B89] hover:bg-slate-200'
                  }`}
                >
                  {simulator.sensorFaultTorque ? 'Faulted' : 'Normal'}
                </button>
              </div>

              {/* Data Tier Toggle */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-[#DDE6EA]">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#1677B8]" />
                  <span className="text-[#193040] font-medium">Data Tier Override</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['Tier 1', 'Tier 2', 'Tier 3'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSimulator((prev) => ({ ...prev, tierOverride: tier }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        simulator.tierOverride === tier
                          ? 'bg-[#1677B8] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provisional Alias Toggle */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-[#DDE6EA]">
                <div className="flex items-center gap-2">
                  <FileWarning className="w-3.5 h-3.5 text-[#D9A300]" />
                  <span className="text-[#193040] font-medium">Provisional Alias Match</span>
                </div>
                <button
                  onClick={() =>
                    setSimulator((prev) => ({
                      ...prev,
                      provisionalAlias: !prev.provisionalAlias,
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    simulator.provisionalAlias
                      ? 'bg-[#D9A300] text-white'
                      : 'bg-slate-100 text-[#667B89] hover:bg-slate-200'
                  }`}
                >
                  {simulator.provisionalAlias ? 'Provisional' : 'Reviewed'}
                </button>
              </div>

              {/* Mid-well Model Lock Toggle */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-[#DDE6EA]">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-[#118A8A]" />
                  <span className="text-[#193040] font-medium">Mid-Well Model Lock</span>
                </div>
                <button
                  onClick={() =>
                    setSimulator((prev) => ({
                      ...prev,
                      modelLocked: !prev.modelLocked,
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    !simulator.modelLocked
                      ? 'bg-[#1677B8] text-white'
                      : 'bg-[#2F8F5B] text-white'
                  }`}
                >
                  {simulator.modelLocked ? 'Locked' : 'Unlocked'}
                </button>
              </div>
            </div>

            {/* Reset All Button */}
            <button
              onClick={resetDemoScenario}
              className="w-full py-1.5 bg-white border border-[#DDE6EA] hover:bg-slate-50 text-[#12324A] font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All to Baseline</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
