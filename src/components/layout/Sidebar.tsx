import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Bell,
  Sliders,
  History,
  Database,
  MapPin,
  ClipboardList,
  Search,
  CheckCircle2,
  FileText,
  FileCheck,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  HelpCircle,
  ExternalLink,
  Flame,
  Droplets,
  Building2,
  ShieldCheck,
  Users,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    alerts,
    currentUser,
    currentRole,
    setIsDemoGuideModalOpen,
    logout,
  } = useApp();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const activeAlertCount = alerts.filter((a) => a.status === 'Active').length;

  const isAdmin = currentRole === 'Administrator';
  const isMudEngineer =
    currentRole === 'Mud Engineer' ||
    currentRole === 'Mud Engineer / Mud Logger' ||
    isAdmin;
  const isSuperintendent =
    currentRole === 'Drilling Superintendent' ||
    currentRole === 'Drilling Superintendent / Office Planner' ||
    isAdmin;
  const isWellControl =
    currentRole === 'Well-Control Supervisor' || isSuperintendent || isAdmin;

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    visible?: boolean;
  }

  const navGroups: {
    title: string;
    items: NavItem[];
  }[] = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'alerts',
          label: 'Alert Center',
          icon: Bell,
          badge: activeAlertCount > 0 ? activeAlertCount : undefined,
          badgeColor: 'bg-[#C93C3C] text-white',
        },
        { id: 'runway', label: 'Risk Runway', icon: Sliders },
        { id: 'replay', label: 'Risk Replay', icon: History },
        {
          id: 'mud-monitoring',
          label: 'Mud Monitoring',
          icon: Droplets,
          visible: isMudEngineer,
        },
        {
          id: 'office-overview',
          label: 'Office Overview',
          icon: Building2,
          visible: isSuperintendent,
        },
        {
          id: 'well-control',
          label: 'Well-Control Watch',
          icon: Flame,
          badge: 'Specialist',
          badgeColor: 'bg-[#FFF1F1] text-[#C93C3C] border border-[#C93C3C]/30',
          visible: isWellControl,
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'formation-memory', label: 'Formation Memory', icon: Database },
        { id: 'nearby-map', label: 'Nearby Wells Map', icon: MapPin },
        { id: 'mitigations', label: 'Mitigation History', icon: ClipboardList },
        { id: 'drillask', label: 'DrillAsk', icon: Search },
      ],
    },
    {
      title: 'VALIDATION',
      items: [
        { id: 'backtest', label: 'Backtest Mode', icon: CheckCircle2 },
        { id: 'handover', label: 'Section Handover Brief', icon: FileText },
      ],
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'pilot-readiness', label: 'Pilot Readiness', icon: CheckCircle2 },
        { id: 'data-onboarding', label: 'Data Onboarding', icon: FileText },
        { id: 'evidence', label: 'Evidence Review', icon: FileCheck },
        { id: 'audit', label: 'Audit Log', icon: Shield },
        { id: 'models', label: 'Model Versions', icon: Layers },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'ADMINISTRATION',
            items: [
              { id: 'admin-overview' as AppView, label: 'Admin Overview', icon: ShieldCheck },
              { id: 'admin-users' as AppView, label: 'Users & Roles (RBAC)', icon: Users },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#DDE6EA] transition-all duration-200 z-20 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header Area */}
      <div className="p-4 border-b border-[#DDE6EA] flex items-center justify-between">
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-[#12324A]">
                DRILL<span className="text-[#118A8A]">DNA</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] border border-[#1677B8]/30">
                PILOT SANDBOX
              </span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[11px] text-[#667B89]">Formation Memory & Advisory</span>
              <span className="text-[10px] font-mono text-[#8FA1AC]">Pilot-Ready MVP</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto font-display font-extrabold text-base text-[#12324A]">
            D<span className="text-[#118A8A]">DNA</span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-[#8FA1AC] hover:text-[#12324A] hover:bg-[#F5F8FA] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.visible !== false);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#8FA1AC]">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-[#EEF7FB] text-[#12324A] font-semibold border-l-3 border-[#1677B8]'
                          : 'text-[#667B89] hover:text-[#193040] hover:bg-[#F5F8FA]'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#1677B8]' : 'text-[#667B89]'
                        }`}
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge !== undefined && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            item.badgeColor || 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Profile & Sign-out Bar */}
      <div className="p-3 border-t border-[#DDE6EA] bg-[#F5F8FA]/60">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#12324A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-[#193040] truncate">
                  {currentUser?.name || 'Debojit Sarma'}
                </div>
                <div className="text-[10px] text-[#667B89] truncate">{currentRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => setIsDemoGuideModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] text-[#118A8A] font-medium py-1.5 px-2 bg-white rounded border border-[#DDE6EA] hover:border-[#118A8A]/50 transition-colors"
                title="3-Minute Executive Demo Script"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Demo Script</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1 text-[11px] text-[#C93C3C] font-medium py-1.5 px-2 bg-white rounded border border-[#DDE6EA] hover:bg-[#FFF1F1] transition-colors"
                title="Sign out securely"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <button
              onClick={() => setIsDemoGuideModalOpen(true)}
              className="w-full flex justify-center py-1.5 text-[#118A8A] hover:bg-white rounded"
              title="3-Min Demo Script"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="w-full flex justify-center py-1.5 text-[#C93C3C] hover:bg-[#FFF1F1] rounded"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
