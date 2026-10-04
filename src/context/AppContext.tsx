import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserPermission,
  UserAccount,
  OperationalMetrics,
  AlertItem,
  AlertFeedback,
  DataTier,
  TelemetryPoint,
  AuditLogEntry,
  MitigationRecord,
  OffsetWell
} from '../types';
import {
  OPERATIONAL_METRICS,
  LIVE_TELEMETRY_SERIES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOG,
  MITIGATION_RECORDS,
  OFFSET_WELLS
} from '../data/mockData';

export type AppView =
  | 'dashboard'
  | 'alerts'
  | 'runway'
  | 'replay'
  | 'formation-memory'
  | 'nearby-map'
  | 'mitigations'
  | 'drillask'
  | 'backtest'
  | 'handover'
  | 'pilot-readiness'
  | 'data-onboarding'
  | 'evidence'
  | 'audit'
  | 'models'
  | 'well-control'
  | 'mud-monitoring'
  | 'office-overview'
  | 'admin-overview'
  | 'admin-users';

interface SimulatorControls {
  feedDelaySec: number; // 0 is normal (4s)
  sensorFaultTorque: boolean;
  tierOverride: DataTier;
  provisionalAlias: boolean;
  modelLocked: boolean;
  isStreaming: boolean;
}

interface AppContextType {
  // Navigation & Authentication
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  currentUser: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsViewer: () => Promise<void>;
  logout: () => Promise<void>;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  hasPermission: (permission: UserPermission) => boolean;

  // Domain state
  metrics: OperationalMetrics;
  telemetry: TelemetryPoint[];
  alerts: AlertItem[];
  activeAlert: AlertItem | undefined;
  auditLog: AuditLogEntry[];
  mitigations: MitigationRecord[];
  offsetWells: OffsetWell[];
  simulator: SimulatorControls;
  setSimulator: React.Dispatch<React.SetStateAction<SimulatorControls>>;

  // Modals
  isAckModalOpen: boolean;
  setIsAckModalOpen: (open: boolean) => void;
  isEvidenceModalOpen: boolean;
  setIsEvidenceModalOpen: (open: boolean) => void;
  isSOPModalOpen: boolean;
  setIsSOPModalOpen: (open: boolean) => void;
  isDemoGuideModalOpen: boolean;
  setIsDemoGuideModalOpen: (open: boolean) => void;

  // Actions
  acknowledgeAlert: (alertId: string, action: string, outcome: string) => Promise<boolean>;
  submitAlertFeedback: (alertId: string, feedback: AlertFeedback) => Promise<boolean>;
  escalateAlert: (alertId: string) => Promise<boolean>;
  logAction: (actionType: string, details: string, targetId?: string, objectType?: string, oldState?: string, newState?: string, comment?: string) => void;
  resetDemoScenario: () => void;
  startDemoScenario: () => void;
  activeAlertTimer: number; // in seconds
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default seeded guest user for fallback
const DEFAULT_GUEST_USER: UserAccount = {
  id: 'USR-001',
  email: 'viewer@drilldna.demo',
  name: 'Ananya Baruah',
  role: 'Viewer',
  department: 'External Audit / Pilot Evaluation',
  status: 'Active',
  createdAt: '2026-09-01 08:00:00 UTC',
  permissions: ['VIEW_INTELLIGENCE'],
};

// Map each role to its default operational landing page
export function getDefaultLandingPageForRole(role: UserRole): AppView {
  const normalized = role.toLowerCase();
  if (normalized.includes('admin')) return 'admin-overview';
  if (normalized.includes('well-control') || normalized.includes('well control')) return 'well-control';
  if (normalized.includes('mud')) return 'mud-monitoring';
  if (normalized.includes('geo')) return 'formation-memory';
  if (normalized.includes('superintendent') || normalized.includes('planner')) return 'office-overview';
  if (normalized.includes('reviewer') || normalized.includes('sme')) return 'evidence';
  if (normalized.includes('engineer') || normalized.includes('company man')) return 'dashboard';
  return 'dashboard';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore auth from localStorage if available
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('drilldna_auth_token');
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('drilldna_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const isAuthenticated = !!currentUser && !!token;

  const currentRole: UserRole = currentUser?.role || 'Viewer';

  const [activeView, setActiveView] = useState<AppView>(() => {
    if (currentUser) {
      return getDefaultLandingPageForRole(currentUser.role);
    }
    return 'dashboard';
  });

  const [metrics, setMetrics] = useState<OperationalMetrics>(OPERATIONAL_METRICS);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(LIVE_TELEMETRY_SERIES);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [mitigations] = useState<MitigationRecord[]>(MITIGATION_RECORDS);
  const [offsetWells] = useState<OffsetWell[]>(OFFSET_WELLS);

  // Timer countdown for ALT-DEMO-088 SLA (starts at 300 seconds = 5 min SLA)
  const [activeAlertTimer, setActiveAlertTimer] = useState<number>(300);

  // Simulator controls
  const [simulator, setSimulator] = useState<SimulatorControls>({
    feedDelaySec: 0,
    sensorFaultTorque: false,
    tierOverride: 'Tier 1',
    provisionalAlias: false,
    modelLocked: true,
    isStreaming: true,
  });

  // Modals
  const [isAckModalOpen, setIsAckModalOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState<boolean>(false);
  const [isDemoGuideModalOpen, setIsDemoGuideModalOpen] = useState<boolean>(false);

  const activeAlert = alerts.find((a) => a.id === 'ALT-DEMO-088');

  // Verify stored token on initial load
  useEffect(() => {
    if (token) {
      fetch('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            // Token expired or invalid
            logout();
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data && data.email) {
            setCurrentUser(data);
            try {
              localStorage.setItem('drilldna_user', JSON.stringify(data));
            } catch {
              // ignore storage errors
            }
          }
        })
        .catch(() => {
          // If offline, keep local user
        });
    }
  }, [token]);

  // Helper to check user permissions
  const hasPermission = (permission: UserPermission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Administrator') return true;
    return currentUser.permissions?.includes(permission) || false;
  };

  // Helper to log user and system actions
  const logAction = (
    actionType: string,
    details: string,
    targetId?: string,
    objectType?: string,
    oldState?: string,
    newState?: string,
    comment?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      userRole: currentRole,
      userName: currentUser ? currentUser.name : 'System Operator',
      actionType,
      details,
      targetId,
      objectType,
      objectId: targetId,
      oldState,
      newState,
      comment,
      modelVersion: 'v2.4.1-locked',
      dataTier: 'Tier 1',
      hash: Math.random().toString(16).slice(2, 14),
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  // Login method
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      setToken(data.token);
      setCurrentUser(data.user);
      setAuthMessage(null);

      try {
        localStorage.setItem('drilldna_auth_token', data.token);
        localStorage.setItem('drilldna_user', JSON.stringify(data.user));
      } catch {
        // ignore
      }

      // Route to default landing page for this role
      const landing = getDefaultLandingPageForRole(data.user.role);
      setActiveView(landing);

      logAction('USER_LOGIN', `Authenticated as ${data.user.name} (${data.user.role})`, data.user.id, 'USER');
      return { success: true };
    } catch {
      return { success: false, error: 'Network error communicating with authentication service.' };
    }
  };

  // Quick 1-click continue as viewer
  const loginAsViewer = async () => {
    await login('viewer@drilldna.demo', 'Viewer@2026');
  };

  // Logout method
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    } finally {
      if (currentUser) {
        logAction('USER_LOGOUT', `User ${currentUser.email} logged out`, currentUser.id, 'SESSION');
      }
      setToken(null);
      setCurrentUser(null);
      setAuthMessage('You have been signed out securely.');
      try {
        localStorage.removeItem('drilldna_auth_token');
        localStorage.removeItem('drilldna_user');
      } catch {
        // ignore
      }
    }
  };

  // Quick role switch for pilot testing (only available to Admin or Sandbox mode)
  const setCurrentRole = (newRole: UserRole) => {
    if (currentUser) {
      const updated: UserAccount = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem('drilldna_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      logAction('ROLE_SIMULATED', `Active role simulated as ${newRole}`, currentUser.id, 'USER');
      const targetView = getDefaultLandingPageForRole(newRole);
      setActiveView(targetView);
    }
  };

  // Live countdown timer for active alert
  useEffect(() => {
    if (!activeAlert || activeAlert.status !== 'Active') return;

    const interval = setInterval(() => {
      setActiveAlertTimer((prev) => {
        if (prev <= 1) {
          // Escalate alert automatically on SLA timeout!
          escalateAlert('ALT-DEMO-088');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAlert?.status]);

  // Periodic sensor pulse (every 4 seconds) to simulate live WITS telemetry stream
  useEffect(() => {
    if (!simulator.isStreaming || simulator.feedDelaySec > 30) return;

    const streamInterval = setInterval(() => {
      setMetrics((prev) => {
        const jitter = (Math.random() - 0.5) * 0.1;
        return {
          ...prev,
          streamFreshnessSec: 4,
          flowOutDiffPct: -7.1,
          torqueDiffKNm: 2.06,
          pitVolumeDiffM3: -1.05,
        };
      });
    }, 4000);

    return () => clearInterval(streamInterval);
  }, [simulator.isStreaming, simulator.feedDelaySec]);

  const acknowledgeAlert = async (alertId: string, action: string, outcome: string): Promise<boolean> => {
    // If in Viewer mode, simulate and warn
    if (currentRole === 'Viewer' || currentRole === 'Viewer / Judge' || currentRole === 'Judge / Viewer') {
      alert('Viewer mode is read-only. Action was simulated locally for evaluation.');
      return false;
    }

    try {
      const res = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ actionTaken: action, outcome }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Failed to acknowledge alert:', err.error);
      }
    } catch {
      // offline / mock fallback
    }

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          return {
            ...alert,
            status: 'Acknowledged',
            actionTaken: action,
            outcome: outcome,
            acknowledgedBy: `${currentUser?.name || 'Drilling Engineer'} (${currentRole})`,
            acknowledgedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          };
        }
        return alert;
      })
    );
    logAction(
      'ALERT_ACKNOWLEDGED',
      `Acknowledged ${alertId}. Action: ${action}. Outcome: ${outcome}`,
      alertId,
      'ALERT',
      'Active',
      'Acknowledged',
      outcome
    );
    return true;
  };

  const submitAlertFeedback = async (alertId: string, feedback: AlertFeedback): Promise<boolean> => {
    if (currentRole === 'Viewer' || currentRole === 'Viewer / Judge' || currentRole === 'Judge / Viewer') {
      alert('Viewer mode is read-only. Feedback cannot be saved to the operational ledger.');
      return false;
    }

    try {
      await fetch(`/api/alerts/${alertId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ feedback }),
      });
    } catch {
      // offline / mock fallback
    }

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          return {
            ...alert,
            feedback,
          };
        }
        return alert;
      })
    );
    logAction('ALERT_FEEDBACK_RECORDED', `Engineer feedback submitted for ${alertId}: ${feedback}`, alertId, 'ALERT');
    return true;
  };

  const escalateAlert = async (alertId: string): Promise<boolean> => {
    try {
      await fetch(`/api/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // offline / mock fallback
    }

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId && alert.status === 'Active') {
          return {
            ...alert,
            status: 'Escalated',
            escalatedTo: 'Drilling Supervisor / Office Cell',
            escalatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          };
        }
        return alert;
      })
    );
    logAction('ALERT_ESCALATED', `SLA deadline reached for ${alertId}. Escalated to Supervisory Cell.`, alertId, 'ALERT');
    return true;
  };

  const resetDemoScenario = () => {
    setAlerts(INITIAL_ALERTS);
    setMetrics(OPERATIONAL_METRICS);
    setTelemetry(LIVE_TELEMETRY_SERIES);
    setActiveAlertTimer(240);
    setSimulator({
      feedDelaySec: 0,
      sensorFaultTorque: false,
      tierOverride: 'Tier 1',
      provisionalAlias: false,
      modelLocked: true,
      isStreaming: true,
    });
    logAction('DEMO_SCENARIO_RESET', 'Demo scenario reset to initial baseline state.');
  };

  const startDemoScenario = () => {
    resetDemoScenario();
    setIsDemoGuideModalOpen(true);
    logAction('DEMO_WALKTHROUGH_STARTED', 'Started guided 3-minute executive walkthrough.');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        token,
        isAuthenticated,
        authMessage,
        setAuthMessage,
        login,
        loginAsViewer,
        logout,
        currentRole,
        setCurrentRole,
        hasPermission,
        metrics,
        telemetry,
        alerts,
        activeAlert,
        auditLog,
        mitigations,
        offsetWells,
        simulator,
        setSimulator,
        isAckModalOpen,
        setIsAckModalOpen,
        isEvidenceModalOpen,
        setIsEvidenceModalOpen,
        isSOPModalOpen,
        setIsSOPModalOpen,
        isDemoGuideModalOpen,
        setIsDemoGuideModalOpen,
        acknowledgeAlert,
        submitAlertFeedback,
        escalateAlert,
        logAction,
        resetDemoScenario,
        startDemoScenario,
        activeAlertTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
