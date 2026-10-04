import React from 'react';
import { useApp } from '../context/AppContext';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight,
  Shield,
  Layers,
  Users,
} from 'lucide-react';

export const OfficeOverviewView: React.FC = () => {
  const { setActiveView, alerts, offsetWells, metrics, setIsAckModalOpen } = useApp();

  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const acknowledgedAlerts = alerts.filter((a) => a.status === 'Acknowledged');
  const escalatedAlerts = alerts.filter((a) => a.status === 'Escalated');

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Drilling Superintendent & Office Overview
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Central operations oversight, multi-well status, escalation queue, and shift compliance metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EEF7FB] text-[#12324A] border border-[#12324A]/20 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Head Office Cell</span>
          </span>
        </div>
      </div>

      {/* High-Level Fleet KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Active Tour Rig</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono-tabular text-[#12324A]">OIL-BRL-09</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">Rig OIL-04 · 8-1/2" section</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Active Operational Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#C93C3C]">{activeAlerts.length}</span>
            <span className="text-xs text-[#667B89]">In loss window</span>
          </div>
          <span className="text-[11px] text-[#E87825] mt-1 block">SLA countdown active</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">Escalations Pending HQ</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#E87825]">{escalatedAlerts.length || 1}</span>
            <span className="text-xs text-[#667B89]">Watch review</span>
          </div>
          <span className="text-[11px] text-[#C93C3C] mt-1 block">Kopili overpressure lookahead</span>
        </div>

        <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-[#667B89] font-medium block">SLA Compliance Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-[#2F8F5B]">96.8%</span>
          </div>
          <span className="text-[11px] text-[#2F8F5B] mt-1 block">Average ack: 2.4 min (SLA &lt; 5m)</span>
        </div>
      </div>

      {/* Main Multi-Well Grid & Escalation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Active Escalations Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE6EA]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C93C3C]" />
                <h3 className="text-sm font-bold text-[#12324A]">Active Operational Alerts & Escalations</h3>
              </div>
              <button
                onClick={() => setActiveView('alerts')}
                className="text-xs text-[#118A8A] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Alert Center</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-[#F8FAFC] border border-[#DDE6EA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#12324A]">{alert.id}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          alert.severity === 'Alert'
                            ? 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30'
                            : 'bg-[#FFF7E8] text-[#D38B22] border border-[#D38B22]/30'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-[#8FA1AC]">{alert.wellId}</span>
                    </div>
                    <div className="font-semibold text-[#193040]">{alert.title}</div>
                    <div className="text-[11px] text-[#667B89]">
                      {alert.formation} at {alert.depthTvdM} m TVD · Status: <strong>{alert.status}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alert.status === 'Active' ? (
                      <button
                        onClick={() => setIsAckModalOpen(true)}
                        className="px-3 py-1.5 bg-[#12324A] text-white rounded-lg text-xs font-semibold hover:bg-[#1F4E6B] transition-colors"
                      >
                        Superintendent Ack
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#2F8F5B] font-semibold bg-[#EEF9F2] px-2.5 py-1 rounded">
                        ✓ {alert.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links for Office Planner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveView('handover')}
              className="bg-white border border-[#DDE6EA] hover:border-[#1677B8]/40 p-4 rounded-xl shadow-2xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-[#1677B8]" />
                <ArrowRight className="w-3.5 h-3.5 text-[#8FA1AC] group-hover:text-[#1677B8]" />
              </div>
              <h4 className="font-bold text-xs text-[#12324A] mt-2">Section Handover Dossier</h4>
              <p className="text-[11px] text-[#667B89] mt-0.5">
                Review and export shift handover brief for upcoming 8-1/2" casing seat.
              </p>
            </div>

            <div
              onClick={() => setActiveView('audit')}
              className="bg-white border border-[#DDE6EA] hover:border-[#1677B8]/40 p-4 rounded-xl shadow-2xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between">
                <Shield className="w-5 h-5 text-[#2F8F5B]" />
                <ArrowRight className="w-3.5 h-3.5 text-[#8FA1AC] group-hover:text-[#2F8F5B]" />
              </div>
              <h4 className="font-bold text-xs text-[#12324A] mt-2">Immutable Audit Ledger</h4>
              <p className="text-[11px] text-[#667B89] mt-0.5">
                Inspect operator timestamps, cryptographic hashes, and role switches.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Asset Fleet Wells Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#DDE6EA] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE6EA]">
              <h3 className="text-sm font-bold text-[#12324A]">Barail South Development Block Fleet</h3>
              <button
                onClick={() => setActiveView('nearby-map')}
                className="text-xs text-[#118A8A] font-semibold hover:underline"
              >
                Open Map
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {offsetWells.slice(0, 5).map((well) => (
                <div
                  key={well.id}
                  className="p-3 bg-[#F8FAFC] border border-[#DDE6EA] rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-[#12324A]">{well.name}</div>
                    <div className="text-[10px] text-[#667B89]">
                      Dist: {well.distanceKm} km · Spud: {well.spudYear} · Trajectory: {well.trajectory}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      well.eventType === 'None (Normal)'
                        ? 'bg-[#EEF9F2] text-[#2F8F5B]'
                        : well.severity === 'Alert'
                        ? 'bg-[#FFF1F1] text-[#C93C3C]'
                        : 'bg-[#FFF7E8] text-[#D38B22]'
                    }`}
                  >
                    {well.eventType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
