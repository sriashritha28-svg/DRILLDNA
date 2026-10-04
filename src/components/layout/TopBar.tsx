import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Activity,
  Radio,
  RefreshCw,
  BookOpen,
  UserCheck,
  ChevronDown,
  LogOut,
  Shield,
  User,
  Compass,
  Building2,
  Lock,
} from 'lucide-react';
import { SafetyStrip } from './SafetyStrip';

export const TopBar: React.FC = () => {
  const {
    metrics,
    currentUser,
    currentRole,
    setCurrentRole,
    simulator,
    resetDemoScenario,
    setIsDemoGuideModalOpen,
    logout,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFeedDelayed = simulator.feedDelaySec > 30;
  const currentTier = simulator.tierOverride;

  const roles: UserRole[] = [
    'Viewer',
    'Drilling Engineer',
    'Mud Engineer',
    'Geologist',
    'Drilling Superintendent',
    'Well-Control Supervisor',
    'Data / SME Reviewer',
    'Administrator',
  ];

  const isViewer =
    currentRole === 'Viewer' ||
    currentRole === 'Viewer / Judge' ||
    currentRole === 'Judge / Viewer';

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Administrator':
        return 'bg-[#12324A] text-white border-[#12324A]';
      case 'Drilling Engineer':
      case 'Drilling Engineer / Company Man':
        return 'bg-[#EEF9F2] text-[#2F8F5B] border-[#2F8F5B]/30';
      case 'Well-Control Supervisor':
        return 'bg-[#FFF1F1] text-[#C93C3C] border-[#C93C3C]/30';
      case 'Mud Engineer':
      case 'Mud Engineer / Mud Logger':
        return 'bg-[#FFF7E8] text-[#D38B22] border-[#D38B22]/30';
      case 'Geologist':
      case 'Geologist / Geoscientist':
        return 'bg-[#F2EFFE] text-[#6941C6] border-[#6941C6]/30';
      case 'Drilling Superintendent':
      case 'Drilling Superintendent / Office Planner':
        return 'bg-[#EEF7FB] text-[#12324A] border-[#12324A]/30';
      case 'Data / SME Reviewer':
        return 'bg-[#F0FDF4] text-[#15803D] border-[#15803D]/30';
      default:
        return 'bg-[#EEF7FB] text-[#1677B8] border-[#1677B8]/30';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#DDE6EA] shadow-2xs">
      {/* Public Viewer Notice Bar if in Viewer Mode */}
      {isViewer && (
        <div className="bg-[#EEF7FB] border-b border-[#1677B8]/20 px-4 py-1.5 text-[11px] text-[#1677B8] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677B8] animate-pulse" />
            <span className="font-semibold">
              Viewer mode — actions are simulated. Public viewers cannot modify integration settings or production adapters.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#1677B8]/30 font-bold">
            Read-Only Sandbox
          </span>
        </div>
      )}

      {/* Upper Telemetry Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Operational Metadata Cluster */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono-tabular">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[#667B89] font-normal">Active Well:</span>
            <span className="font-bold text-[#12324A] bg-[#EEF7FB] px-2 py-0.5 rounded border border-[#1677B8]/20">
              OIL-BRL-09
            </span>
          </div>

          <div className="flex items-center gap-1 font-sans">
            <span className="text-[#667B89]">Formation:</span>
            <span className="font-semibold text-[#193040]">{metrics.formation}</span>
            {simulator.provisionalAlias && (
              <span className="text-[10px] text-[#D9A300] bg-[#FFF7E8] px-1.5 rounded">Provisional</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#667B89]">TVD:</span>
            <span className="font-bold text-[#12324A]">{metrics.bitDepthTvdM.toFixed(1)} m</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#667B89]">MD:</span>
            <span className="font-semibold text-[#193040]">{metrics.bitDepthMdM.toFixed(1)} m</span>
          </div>

          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[#667B89]">Rig State:</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#2F8F5B] bg-[#EEF9F2] px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F5B] animate-pulse" />
              Drilling (8-1/2")
            </span>
          </div>

          <div className="flex items-center gap-1 font-sans">
            <span className="text-[#667B89]">Data Tier:</span>
            <span
              className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                currentTier === 'Tier 1'
                  ? 'text-[#1677B8] bg-[#EEF7FB]'
                  : 'text-[#E87825] bg-[#FFF7E8]'
              }`}
            >
              {currentTier}
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-sans text-[#8FA1AC]">
            <span>·</span>
            <span>Env: <strong className="text-[#12324A]">PILOT SANDBOX</strong></span>
            <span>·</span>
            <span>Integration: <strong className="text-[#118A8A]">eRTMAC Adapter</strong></span>
          </div>
        </div>

        {/* Right Stream Status and Controls */}
        <div className="flex items-center gap-2.5">
          {/* Stream Health Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${
              isFeedDelayed
                ? 'bg-[#FFF1F1] text-[#C93C3C] border-[#C93C3C]/30'
                : 'bg-[#EEF9F2] text-[#2F8F5B] border-[#2F8F5B]/30'
            }`}
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                isFeedDelayed ? 'text-[#C93C3C]' : 'text-[#2F8F5B] animate-pulse'
              }`}
            />
            <span className="font-medium">
              {isFeedDelayed
                ? `Delayed (${simulator.feedDelaySec}s)`
                : `Last update: ${metrics.streamFreshnessSec} sec ago`}
            </span>
          </div>

          {/* Quick Demo Script Button */}
          <button
            onClick={() => setIsDemoGuideModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#118A8A] bg-[#EEF7FB] border border-[#118A8A]/30 rounded hover:bg-[#118A8A]/10 transition-colors"
            title="Open 3-minute executive evaluation walkthrough guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Demo Script</span>
          </button>

          {/* Active Role Badge in Top Bar */}
          <span
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border ${getRoleBadgeStyle(
              currentRole
            )}`}
          >
            <Shield className="w-3 h-3" />
            <span>{currentRole}</span>
          </span>

          {/* Quick Role Switcher for Sandbox Testing */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1 text-xs bg-[#F5F8FA] border border-[#DDE6EA] px-2 py-1 rounded hover:border-[#1677B8]/40 transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-[#1677B8]" />
              <select
                aria-label="Simulate User Role"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent font-medium text-[#193040] focus:outline-hidden cursor-pointer"
                title="Switch role for pilot sandbox testing"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemoScenario}
            className="p-1 text-[#667B89] hover:text-[#12324A] hover:bg-slate-100 rounded transition-colors"
            title="Reset Scenario to baseline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile & Logout Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#12324A] text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#8FA1AC]" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#DDE6EA] rounded-xl shadow-lg p-3 text-xs text-[#193040] z-50 animate-in fade-in duration-100">
                <div className="pb-2.5 border-b border-[#DDE6EA]">
                  <div className="font-bold text-[#12324A] truncate">
                    {currentUser?.name || 'Debojit Sarma'}
                  </div>
                  <div className="text-[11px] text-[#667B89] truncate">
                    {currentUser?.email || 'engineer@drilldna.demo'}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeStyle(
                        currentRole
                      )}`}
                    >
                      {currentRole}
                    </span>
                  </div>
                </div>

                <div className="py-2 border-b border-[#DDE6EA]/60 space-y-1 text-[11px] text-[#667B89]">
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <strong className="text-[#12324A]">PILOT SANDBOX</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="truncate max-w-[120px] text-right">
                      {currentUser?.department || 'Operations'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-[#FFF1F1] hover:bg-[#FFF1F1]/80 text-[#C93C3C] border border-[#C93C3C]/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Safety Strip */}
      <SafetyStrip />
    </header>
  );
};
