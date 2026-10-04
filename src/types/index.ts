export type UserRole = 
  | 'Viewer'
  | 'Viewer / Judge'
  | 'Judge / Viewer'
  | 'Drilling Engineer'
  | 'Drilling Engineer / Company Man'
  | 'Mud Engineer'
  | 'Mud Engineer / Mud Logger'
  | 'Geologist'
  | 'Geologist / Geoscientist'
  | 'Drilling Superintendent'
  | 'Drilling Superintendent / Office Planner'
  | 'Drilling Supervisor'
  | 'Office Superintendent'
  | 'Well-Control Supervisor'
  | 'Data / SME Reviewer'
  | 'Administrator';

export type UserPermission =
  | 'VIEW_INTELLIGENCE'
  | 'ACKNOWLEDGE_OPERATIONAL_ALERT'
  | 'SUBMIT_ALERT_FEEDBACK'
  | 'RECORD_ACTION_OUTCOME'
  | 'RECORD_MUD_OBSERVATION'
  | 'REVIEW_FORMATION_ALIASES'
  | 'ESCALATE_STANDARD_ALERT'
  | 'CLOSE_WELL_CONTROL_ESCALATION'
  | 'REVIEW_EVIDENCE_EXTRACTS'
  | 'EXPORT_HANDOVER_BRIEF'
  | 'MANAGE_USERS'
  | 'MANAGE_SYSTEM_CONFIG';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  permissions: UserPermission[];
  phone?: string;
}

export type RigState = 'Drilling' | 'Tripping' | 'Circulating' | 'Connection' | 'Standby';

export type DataTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type AlertSeverity = 'Watch' | 'Advisory' | 'Alert' | 'Critical';

export type AlertStatus = 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved';

export type AlertFeedback = 'Relevant' | 'Partially Relevant' | 'False Positive' | 'Pending';

export interface TelemetryPoint {
  timestamp: string; // ISO or MM:SS
  minutesAgo: number;
  flowOutPct: number; // % returns vs baseline (100% nominal)
  torqueKNm: number; // kNm surface torque
  pitVolumeM3: number; // m³ active volume
  sppBar: number; // standpipe pressure in bar
  ropMhr: number; // rate of penetration
  wobKN: number; // weight on bit
  historicalFlowOutPct?: number; // OIL-X12 overlay
  historicalTorqueKNm?: number;
  historicalPitVolumeM3?: number;
  historicalSppBar?: number;
}

export interface OperationalMetrics {
  bitDepthTvdM: number;
  bitDepthMdM: number;
  formation: string;
  formationLossWindowTvd: [number, number];
  affectedIntervalsRatio: string; // '3 of 6'
  flowOutDiffPct: number; // -7.1
  flowOutActualPct: number; // 92.9
  torqueDiffKNm: number; // +2.06
  torqueActualKNm: number; // 18.26
  pitVolumeDiffM3: number; // -1.05
  pitVolumeActualM3: number; // 43.95
  fingerprintSimilarityPct: number; // 88
  comparableWell: string; // 'OIL-X12'
  precursorDurationMin: number; // 20
  streamFreshnessSec: number; // 4
  streamQuality: 'Good' | 'Fair' | 'Degraded';
}

export interface AlertItem {
  id: string; // 'ALT-DEMO-088'
  title: string;
  severity: AlertSeverity;
  eventType: string; // 'Mud loss'
  wellId: string;
  formation: string;
  depthTvdM: number;
  depthMdM: number;
  rigState: RigState;
  dataTier: DataTier;
  raisedTimeStr: string;
  raisedMinutesAgo: number;
  status: AlertStatus;
  feedback: AlertFeedback;
  actionTaken?: string;
  outcome?: string;
  ackDeadlineSec: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalatedTo?: string;
  escalatedAt?: string;
  sourceDoc: string;
  sourcePage: number;
  evidenceSummary: string;
  fingerprintSimilarity: number;
  comparableWell: string;
}

export interface PilotReadinessRow {
  id: string;
  capability: string;
  currentCapability: string;
  sandboxStatus: string;
  requiredOilInput: string;
  pilotOwner: string;
  readinessState: 'Ready for Pilot Ingestion' | 'Clearance Needed' | 'Calibration Required';
}

export interface OnboardingUploadRecord {
  id: string;
  category: 'Historical Reports' | 'Formations & Surveys' | 'Event Records' | 'Trajectories' | 'Well Construction';
  fileName: string;
  recordsCount: number;
  uploadDate: string;
  parsedStatus: 'Validated' | 'Pending Review' | 'Schema Error';
  confidence: number;
  notes: string;
}

export interface MitigationRecord {
  id: string;
  action: string;
  eventType: string;
  comparableCasesCount: number; // must be >= 3 to be 'Ranked'
  successfulCasesCount: number;
  successRatePct: number;
  meanNptHours: number;
  recurrenceRatePct: number;
  sourceDoc: string;
  sourcePage: number;
  reviewStatus: 'SME review pending' | 'SME verified' | 'Provisional';
  displayState: 'Ranked' | 'Insufficient evidence';
  notes: string;
}

export interface OffsetWell {
  id: string;
  name: string;
  block: string;
  lat: number;
  lon: number;
  distanceKm: number;
  spudYear: number;
  totalDepthM: number;
  formationMatch: string;
  tvdOverlap: string;
  trajectory: 'Vertical' | 'Directional' | 'S-Type' | 'Horizontal';
  eventType: 'Severe Mud Loss' | 'Partial Mud Loss' | 'Well Control Kick' | 'Tight Hole' | 'None (Normal)';
  severity: 'Alert' | 'Advisory' | 'Watch' | 'Nominal';
  historicalPrecursor: string;
  mitigationApplied: string;
  outcome: string;
  sourceDoc: string;
  sourcePage: number;
  similarityScorePct: number;
}

export interface FormationZone {
  canonicalName: string;
  topTvdM: number;
  baseTvdM: number;
  lithology: string;
  lossRiskWindow?: [number, number];
  porePressureGg: number;
  fractureGradientGg: number;
  casingShoeDepthM?: number;
  casingShoeSize?: string;
  watchZone?: [number, number];
  advisoryZone?: [number, number];
  alertZone?: [number, number];
  upcomingWatch?: {
    name: string;
    depthRange: [number, number];
    description: string;
  };
}

export interface DrillAskResult {
  id: string;
  query: string;
  shortAnswer: string;
  supportingPoints: string[];
  sourceDoc: string;
  sourcePage: number;
  confidencePct: number;
  dataTier: DataTier;
  reviewStatus: string;
  comparableWell: string;
  historicalSuccessRate?: string;
  found: boolean;
}

export interface BacktestResult {
  wellId: string;
  wellName: string;
  formation: string;
  lossDepthTvdM: number;
  syntheticEventMarkerMin: number;
  drilldnaAlertLeadTimeMin: number; // 18.4 min
  baselineThresholdLeadTimeMin: number; // 2.1 min
  precisionPct: number; // 89.2
  recallPct: number; // 92.5
  prAuc: number; // 0.91
  falseAlertsPerHourDrilldna: number; // 0.04
  falseAlertsPerHourBaseline: number; // 0.49
  evidenceAvailability: string;
  dataTier: DataTier;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  actionType: string;
  details: string;
  targetId?: string;
  objectType?: string;
  objectId?: string;
  oldState?: string;
  newState?: string;
  comment?: string;
  modelVersion?: string;
  dataTier?: DataTier;
  hash: string;
}

export interface ModelVersionInfo {
  versionId: string;
  formationName: string;
  releaseDate: string;
  fingerprintVersion: string;
  status: 'Active (Locked for OIL-BRL-09)' | 'Staging' | 'Archived';
  prAuc: number;
  trainingIntervalsCount: number;
  offsetWellsCount: number;
  featureWeights: {
    flowOutReturns: number;
    surfaceTorque: number;
    activePitVolume: number;
    sppPressure: number;
  };
  notes: string;
}
