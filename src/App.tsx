import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { SimulatorControlDock } from './components/simulator/SimulatorControlDock';
import { EvidenceModal } from './components/modals/EvidenceModal';
import { AckAlertModal } from './components/modals/AckAlertModal';
import { SOPModal } from './components/modals/SOPModal';
import { DemoGuideModal } from './components/modals/DemoGuideModal';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { AlertCenterView } from './views/AlertCenterView';
import { RiskRunwayView } from './views/RiskRunwayView';
import { RiskReplayView } from './views/RiskReplayView';
import { FormationMemoryView } from './views/FormationMemoryView';
import { NearbyWellsView } from './views/NearbyWellsView';
import { MitigationHistoryView } from './views/MitigationHistoryView';
import { DrillAskView } from './views/DrillAskView';
import { BacktestView } from './views/BacktestView';
import { SectionHandoverView } from './views/SectionHandoverView';
import { PilotReadinessView } from './views/PilotReadinessView';
import { DataOnboardingView } from './views/DataOnboardingView';
import { EvidenceReviewView } from './views/EvidenceReviewView';
import { AuditLogView } from './views/AuditLogView';
import { ModelVersionsView } from './views/ModelVersionsView';
import { WellControlView } from './views/WellControlView';
import { MudMonitoringView } from './views/MudMonitoringView';
import { OfficeOverviewView } from './views/OfficeOverviewView';
import { AdminOverviewView } from './views/AdminOverviewView';
import { AdminUsersView } from './views/AdminUsersView';

const AppContent: React.FC = () => {
  const { activeView, isAuthenticated } = useApp();

  // If user is not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <DemoGuideModal />
      </>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'runway':
        return <RiskRunwayView />;
      case 'replay':
        return <RiskReplayView />;
      case 'formation-memory':
        return <FormationMemoryView />;
      case 'nearby-map':
        return <NearbyWellsView />;
      case 'mitigations':
        return <MitigationHistoryView />;
      case 'drillask':
        return <DrillAskView />;
      case 'backtest':
        return <BacktestView />;
      case 'handover':
        return <SectionHandoverView />;
      case 'pilot-readiness':
        return <PilotReadinessView />;
      case 'data-onboarding':
        return <DataOnboardingView />;
      case 'evidence':
        return <EvidenceReviewView />;
      case 'audit':
        return <AuditLogView />;
      case 'models':
        return <ModelVersionsView />;
      case 'well-control':
        return <WellControlView />;
      case 'mud-monitoring':
        return <MudMonitoringView />;
      case 'office-overview':
        return <OfficeOverviewView />;
      case 'admin-overview':
        return <AdminOverviewView />;
      case 'admin-users':
        return <AdminUsersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F8FA] text-[#193040]">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Telemetry & Safety Bar */}
        <TopBar />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Floating Simulator Controls Dock for Degraded State Testing */}
      <SimulatorControlDock />

      {/* Interactive Global Modals */}
      <EvidenceModal />
      <AckAlertModal />
      <SOPModal />
      <DemoGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
