import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PILOT_READINESS_ROWS } from '../data/mockData';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Server,
  Lock,
  Database,
  Radio,
  FileText,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const PilotReadinessView: React.FC = () => {
  const { setActiveView } = useApp();

  const [checkedInputs, setCheckedInputs] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const toggleCheck = (idx: number) => {
    setCheckedInputs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const pilotInputsList = [
    'Approved DDR and WCR PDFs for target pilot asset block (minimum 10-15 historical wells)',
    'Formation tops with canonical names, stratigraphic aliases, and depth datums (MSL)',
    'Directional surveys with true vertical depth (TVD), measured depth (MD), inclination, and azimuth',
    'Historical event logs with exact event start time, depth, severity, and event type classification',
    'Well trajectories and offset-well metadata for spatial proximity cross-correlation',
    'Casing design, cementing records, mud program, and reservoir pressure envelopes',
    'eRTMAC / mud-logging digital sensor archives (WITS / WITSML 1-sec to 5-sec streams) where available',
    'SME annotations and validation sign-offs for historical precursor windows',
    'Approved Standard Operating Procedure (SOP) references and field escalation role matrix',
    'Hosting, access-control, data-retention, and cybersecurity governance clearances',
  ];

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Pilot Readiness and Data Onboarding
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Formal technical readiness matrix, required Oil India pilot inputs, and enterprise integration boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('data-onboarding')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#12324A] text-white hover:bg-[#1F4E6B] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open Data Onboarding Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#118A8A]" />
          </button>
        </div>
      </div>

      {/* Status Notice Banner */}
      <div className="p-4 bg-[#EEF7FB] border border-[#1677B8]/30 rounded-xl text-xs text-[#193040] leading-relaxed flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1677B8] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#12324A] text-sm">Pilot-Ready Technical Evaluation Matrix</strong>
            <p className="text-[#667B89]">
              The DRILLDNA platform core algorithms, telemetry ingestion layer, and formation memory cross-correlation engines are validated in the Pilot Sandbox. Formal field pilot deployment requires approved Oil India Ltd historical data onboarding and network access clearance.
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono-tabular shrink-0">
          <span className="text-[#667B89]">Pilot Milestone:</span>{' '}
          <strong className="text-[#2F8F5B]">Phase 1 Deployment Gate</strong>
        </div>
      </div>

      {/* Capability Readiness Matrix Table */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#DDE6EA] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#12324A] text-sm">Capability Readiness Matrix</h3>
            <p className="text-xs text-[#667B89]">12 Core Functional Modules for Pilot Deployment</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30 font-bold">
            9 Ready · 3 Clearance Needed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#F5F8FA] border-b border-[#DDE6EA] text-[#667B89]">
                <th className="p-3.5 font-semibold">Capability</th>
                <th className="p-3.5 font-semibold">Current Sandbox Capability</th>
                <th className="p-3.5 font-semibold">Sandbox Status</th>
                <th className="p-3.5 font-semibold">Required OIL Pilot Input</th>
                <th className="p-3.5 font-semibold">Pilot Owner</th>
                <th className="p-3.5 font-semibold">Readiness State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE6EA]/60">
              {PILOT_READINESS_ROWS.map((row) => (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3.5 font-bold text-[#12324A] whitespace-nowrap">
                    {row.capability}
                  </td>
                  <td className="p-3.5 text-[#193040] max-w-xs text-[11px]">
                    {row.currentCapability}
                  </td>
                  <td className="p-3.5 text-[#667B89] text-[11px]">
                    {row.sandboxStatus}
                  </td>
                  <td className="p-3.5 text-[#12324A] font-medium text-[11px] max-w-xs">
                    {row.requiredOilInput}
                  </td>
                  <td className="p-3.5 text-[#667B89] text-[11px] whitespace-nowrap">
                    {row.pilotOwner}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        row.readinessState === 'Ready for Pilot Ingestion'
                          ? 'bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30'
                          : row.readinessState === 'Clearance Needed'
                          ? 'bg-[#FFF7E8] text-[#E87825] border border-[#E87825]/30'
                          : 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                      }`}
                    >
                      {row.readinessState}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split: Required Pilot Inputs Checklist & Deployment Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 Cols: Required Pilot Inputs Checklist */}
        <div className="lg:col-span-6 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
            <h3 className="font-bold text-[#12324A] text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1677B8]" />
              <span>Required Pilot Inputs Checklist</span>
            </h3>
            <span className="text-[10px] font-mono text-[#667B89]">10 Prerequisites</span>
          </div>

          <p className="text-xs text-[#667B89]">
            The following documentation and data streams are required from Oil India Limited to initiate live field asset onboarding:
          </p>

          <div className="space-y-2">
            {pilotInputsList.map((item, idx) => {
              const isChecked = !!checkedInputs[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                    isChecked
                      ? 'bg-[#EEF9F2]/50 border-[#2F8F5B]/30 text-[#193040]'
                      : 'bg-white border-[#DDE6EA] text-[#667B89] hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5 rounded border-[#CBD5E1] text-[#2F8F5B] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 text-[11px] leading-relaxed">
                    <span className="font-semibold text-[#12324A] mr-1">{idx + 1}.</span>
                    <span>{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Deployment & Integration Governance */}
        <div className="lg:col-span-6 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
              <h3 className="font-bold text-[#12324A] text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-[#118A8A]" />
                <span>Deployment and Integration Governance</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold">
                Enterprise Spec
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
                <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#1677B8]" />
                  <span>1. Hosting & Infrastructure</span>
                </div>
                <p className="text-[11px] text-[#667B89] leading-relaxed">
                  Oil India on-premises data center (Duliajan / Guwahati) or approved India-resident MeitY-certified private cloud VPC. Air-gapped deployment capable.
                </p>
              </div>

              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
                <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#118A8A]" />
                  <span>2. Rig Integration & eRTMAC Protocol</span>
                </div>
                <p className="text-[11px] text-[#667B89] leading-relaxed">
                  Read-only adapter consuming standard WITSML 1.4/2.0, MQTT broker, OPC-UA, or secure REST streaming telemetry. Zero disruption to existing rig systems.
                </p>
              </div>

              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
                <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2F8F5B]" />
                  <span>3. Security, RBAC & Provenance</span>
                </div>
                <p className="text-[11px] text-[#667B89] leading-relaxed">
                  Strict Role-Based Access Control, TLS 1.3 in-transit encryption, AES-256 at rest, immutable SHA-256 audit logging, and certified page-level document citations.
                </p>
              </div>

              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] space-y-1">
                <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#D38B22]" />
                  <span>4. Data Sovereignty & AI Policy</span>
                </div>
                <p className="text-[11px] text-[#667B89] leading-relaxed">
                  All DDR documents, formation memory vector indexes, and model weights remain inside Oil India controlled environments. No public LLM API calls are required for production inference.
                </p>
              </div>

              <div className="p-3 bg-[#FFF1F1] rounded-lg border border-[#C93C3C]/30 space-y-1">
                <div className="font-bold text-[#C93C3C] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>5. Non-Negotiable Safety Boundary: No Rig Control Path</span>
                </div>
                <p className="text-[11px] text-[#193040] leading-relaxed">
                  Zero write or command transmission pathways exist from DRILLDNA to drawworks, mud pumps, top drive, or BOP equipment. Advisory decision support only.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE6EA] flex justify-between items-center">
            <span className="text-[11px] text-[#667B89]">Review complete for Pilot Scope</span>
            <button
              onClick={() => setActiveView('data-onboarding')}
              className="px-3.5 py-1.5 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Proceed to Data Onboarding</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
