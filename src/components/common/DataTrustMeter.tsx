import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface DataTrustMeterProps {
  compact?: boolean;
}

export const DataTrustMeter: React.FC<DataTrustMeterProps> = ({ compact = false }) => {
  const { simulator, metrics } = useApp();

  const isDegraded =
    simulator.feedDelaySec > 30 ||
    simulator.sensorFaultTorque ||
    simulator.tierOverride !== 'Tier 1' ||
    simulator.provisionalAlias;

  const currentTier = simulator.tierOverride;
  const signalQuality = simulator.sensorFaultTorque
    ? 'Degraded (Torque Fault)'
    : simulator.feedDelaySec > 30
    ? 'Stale / Delayed'
    : 'Good (WITS 4s)';
  const evidenceCount = '14 Wells / 6 Intervals';
  const sourceConfidence = currentTier === 'Tier 1' ? '92% (High)' : '68% (Formation-level)';
  const reviewStatus = simulator.provisionalAlias ? 'Provisional' : 'SME review pending';
  const freshness = simulator.feedDelaySec > 30 ? `${simulator.feedDelaySec}s (Delayed)` : `${metrics.streamFreshnessSec}s`;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs bg-white border border-[#DDE6EA] rounded-lg px-3 py-2 text-[#667B89]">
        <div className="flex items-center gap-1.5 font-medium text-[#193040]">
          {isDegraded ? (
            <AlertTriangle className="w-3.5 h-3.5 text-[#E87825]" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-[#118A8A]" />
          )}
          <span>Data Trust:</span>
        </div>
        <div>
          Tier: <span className="font-semibold text-[#12324A]">{currentTier}</span>
        </div>
        <span>·</span>
        <div>
          Signal: <span className="font-semibold text-[#12324A]">{signalQuality}</span>
        </div>
        <span>·</span>
        <div>
          Freshness: <span className="font-semibold text-[#12324A]">{freshness}</span>
        </div>
        <span>·</span>
        <div>
          Review: <span className="font-semibold text-[#12324A]">{reviewStatus}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE6EA] mb-3">
        <div className="flex items-center gap-2">
          {isDegraded ? (
            <AlertTriangle className="w-4 h-4 text-[#E87825]" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#118A8A]" />
          )}
          <h3 className="text-sm font-semibold text-[#12324A]">Data Trust & Verification Meter</h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded font-medium ${
            isDegraded
              ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
              : 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
          }`}
        >
          {isDegraded ? 'Operating with Caveats' : 'Verified Evidence Chain'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Data Tier</div>
          <div className="font-bold text-[#12324A] text-sm">{currentTier}</div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">
            {currentTier === 'Tier 1' ? 'WITS + DDR page-level' : 'Offset formation aggregate'}
          </div>
        </div>

        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Signal Quality</div>
          <div
            className={`font-bold text-sm ${
              simulator.sensorFaultTorque || simulator.feedDelaySec > 30 ? 'text-[#C93C3C]' : 'text-[#2F8F5B]'
            }`}
          >
            {signalQuality}
          </div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">Zero null dropouts</div>
        </div>

        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Evidence Count</div>
          <div className="font-bold text-[#12324A] text-sm">{evidenceCount}</div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">3 loss intervals confirmed</div>
        </div>

        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Source Confidence</div>
          <div className="font-bold text-[#12324A] text-sm">{sourceConfidence}</div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">DDR_OIL-X12.pdf p.14</div>
        </div>

        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Review Status</div>
          <div
            className={`font-bold text-sm ${
              simulator.provisionalAlias ? 'text-[#D9A300]' : 'text-[#12324A]'
            }`}
          >
            {reviewStatus}
          </div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">
            {simulator.provisionalAlias ? 'Unreviewed alias' : 'Drilling superintendent'}
          </div>
        </div>

        <div className="bg-[#F5F8FA] p-2.5 rounded-lg border border-[#DDE6EA]/60">
          <div className="text-[#667B89] mb-1">Feed Freshness</div>
          <div
            className={`font-bold text-sm ${
              simulator.feedDelaySec > 30 ? 'text-[#C93C3C]' : 'text-[#1677B8]'
            }`}
          >
            {freshness}
          </div>
          <div className="text-[10px] text-[#8FA1AC] mt-0.5">eRTMAC telemetry link</div>
        </div>
      </div>
    </div>
  );
};
