import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  OPERATIONAL_METRICS,
  LIVE_TELEMETRY_SERIES,
  INITIAL_ALERTS,
  OFFSET_WELLS,
  FORMATION_ZONES,
  MITIGATION_RECORDS,
  DRILLASK_KNOWLEDGE_BASE,
  BACKTEST_RESULTS,
  INITIAL_AUDIT_LOG,
  MODEL_VERSIONS
} from './src/data/mockData.ts';
import { UserRole, UserPermission, UserAccount } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'drilldna-pilot-sandbox-super-secret-key-2026';

app.use(express.json());

// In-memory data stores
interface SeedUserRecord extends UserAccount {
  passwordHash: string;
}

// Pre-seeded accounts with secure bcrypt hashes (salt rounds = 10)
const SEEDED_USERS: SeedUserRecord[] = [
  {
    id: 'USR-001',
    email: 'viewer@drilldna.demo',
    passwordHash: bcrypt.hashSync('Viewer@2026', 10),
    name: 'Ananya Baruah',
    role: 'Viewer',
    department: 'External Audit / Pilot Evaluation',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 02:00:00 UTC',
    permissions: ['VIEW_INTELLIGENCE'],
    phone: '+91 94350 12001',
  },
  {
    id: 'USR-002',
    email: 'engineer@drilldna.demo',
    passwordHash: bcrypt.hashSync('Engineer@2026', 10),
    name: 'Debojit Sarma',
    role: 'Drilling Engineer',
    department: 'Rig OIL-04 / Operations Tour',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 02:15:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'ACKNOWLEDGE_OPERATIONAL_ALERT',
      'SUBMIT_ALERT_FEEDBACK',
      'RECORD_ACTION_OUTCOME',
      'EXPORT_HANDOVER_BRIEF',
      'ESCALATE_STANDARD_ALERT',
    ],
    phone: '+91 94350 12002',
  },
  {
    id: 'USR-003',
    email: 'mud@drilldna.demo',
    passwordHash: bcrypt.hashSync('Mud@2026', 10),
    name: 'Bhaben Gogoi',
    role: 'Mud Engineer',
    department: 'Barail Drilling Fluids Directorate',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 01:50:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'SUBMIT_ALERT_FEEDBACK',
      'RECORD_MUD_OBSERVATION',
    ],
    phone: '+91 94350 12003',
  },
  {
    id: 'USR-004',
    email: 'geology@drilldna.demo',
    passwordHash: bcrypt.hashSync('Geo@2026', 10),
    name: 'Dr. Rupali Hazarika',
    role: 'Geologist',
    department: 'Assam-Arakan Subsurface Geoscience',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 01:30:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'REVIEW_FORMATION_ALIASES',
    ],
    phone: '+91 94350 12004',
  },
  {
    id: 'USR-005',
    email: 'superintendent@drilldna.demo',
    passwordHash: bcrypt.hashSync('Super@2026', 10),
    name: 'Pranab Bordoloi',
    role: 'Drilling Superintendent',
    department: 'Duliajan Head Office Operations',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 02:10:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'ACKNOWLEDGE_OPERATIONAL_ALERT',
      'SUBMIT_ALERT_FEEDBACK',
      'RECORD_ACTION_OUTCOME',
      'EXPORT_HANDOVER_BRIEF',
      'ESCALATE_STANDARD_ALERT',
    ],
    phone: '+91 94350 12005',
  },
  {
    id: 'USR-006',
    email: 'wellcontrol@drilldna.demo',
    passwordHash: bcrypt.hashSync('Control@2026', 10),
    name: 'Kaushik Deka',
    role: 'Well-Control Supervisor',
    department: 'Emergency Response & Well Control Cell',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 02:05:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'CLOSE_WELL_CONTROL_ESCALATION',
    ],
    phone: '+91 94350 12006',
  },
  {
    id: 'USR-007',
    email: 'reviewer@drilldna.demo',
    passwordHash: bcrypt.hashSync('Reviewer@2026', 10),
    name: 'Maitreyee Das',
    role: 'Data / SME Reviewer',
    department: 'Historical Archive & Formation Memory Cell',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 01:15:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'REVIEW_EVIDENCE_EXTRACTS',
    ],
    phone: '+91 94350 12007',
  },
  {
    id: 'USR-008',
    email: 'admin@drilldna.demo',
    passwordHash: bcrypt.hashSync('Admin@2026', 10),
    name: 'Dr. Sanjib Kalita',
    role: 'Administrator',
    department: 'Industrial Systems & eRTMAC Technology',
    status: 'Active',
    createdAt: '2026-09-01 08:00:00 UTC',
    lastLogin: '2026-10-04 02:20:00 UTC',
    permissions: [
      'VIEW_INTELLIGENCE',
      'ACKNOWLEDGE_OPERATIONAL_ALERT',
      'SUBMIT_ALERT_FEEDBACK',
      'RECORD_ACTION_OUTCOME',
      'RECORD_MUD_OBSERVATION',
      'REVIEW_FORMATION_ALIASES',
      'ESCALATE_STANDARD_ALERT',
      'CLOSE_WELL_CONTROL_ESCALATION',
      'REVIEW_EVIDENCE_EXTRACTS',
      'EXPORT_HANDOVER_BRIEF',
      'MANAGE_USERS',
      'MANAGE_SYSTEM_CONFIG',
    ],
    phone: '+91 94350 12008',
  },
];

let usersStore: SeedUserRecord[] = [...SEEDED_USERS];
let activeAlerts = [...INITIAL_ALERTS];
let currentMetrics = { ...OPERATIONAL_METRICS };
let auditTrail = [...INITIAL_AUDIT_LOG];

// Failed login attempt tracking for basic rate limiting
const loginAttemptMap = new Map<string, { count: number; lastAttempt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = loginAttemptMap.get(key);
  if (!record) {
    loginAttemptMap.set(key, { count: 1, lastAttempt: now });
    return true;
  }
  if (now - record.lastAttempt > 60000) {
    // Reset after 60s
    loginAttemptMap.set(key, { count: 1, lastAttempt: now });
    return true;
  }
  if (record.count >= 5) {
    return false; // Rate limit exceeded (5 attempts per minute)
  }
  record.count += 1;
  record.lastAttempt = now;
  return true;
}

function clearRateLimit(key: string) {
  loginAttemptMap.delete(key);
}

// Audit logging helper
function recordAuditEntry(entry: {
  userName: string;
  userRole: UserRole;
  actionType: string;
  details: string;
  targetId?: string;
  objectType?: string;
  objectId?: string;
  oldState?: string;
  newState?: string;
  comment?: string;
}) {
  const newAudit = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    userName: entry.userName,
    userRole: entry.userRole,
    actionType: entry.actionType,
    details: entry.details,
    targetId: entry.targetId,
    objectType: entry.objectType,
    oldState: entry.oldState,
    newState: entry.newState,
    comment: entry.comment,
    modelVersion: 'v2.4.1-locked',
    dataTier: 'Tier 1' as const,
    hash: Math.random().toString(16).slice(2, 14),
  };
  auditTrail.unshift(newAudit);
  return newAudit;
}

// ==========================================
// AUTHENTICATION & RBAC MIDDLEWARES
// ==========================================

export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

function getUserFromToken(req: Request): UserAccount | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = usersStore.find((u) => u.id === decoded.id && u.status === 'Active');
    if (!user) return null;
    const { passwordHash: _, ...userSafe } = user;
    return userSafe;
  } catch {
    return null;
  }
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthenticated. Valid Bearer token required.' });
  }
  req.user = user;
  next();
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    // Check if user role matches or is Administrator
    const isAllowed =
      req.user.role === 'Administrator' ||
      allowedRoles.some(
        (role) =>
          req.user?.role === role ||
          req.user?.role.toLowerCase().startsWith(role.toLowerCase().split('/')[0].trim())
      );

    if (!isAllowed) {
      return res.status(403).json({
        error: `Forbidden: Action requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
    }
    next();
  };
}

function requirePermission(permission: UserPermission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    if (req.user.role === 'Administrator' || req.user.permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({
      error: `Forbidden: User lacks required permission: ${permission}`,
    });
  };
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'client';
  const rateLimitKey = `${clientIp}:${email || ''}`;

  if (!checkRateLimit(rateLimitKey)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please wait 60 seconds before trying again.',
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.status !== 'Active') {
    return res.status(403).json({
      error: `Account is currently ${user.status}. Please contact an Administrator.`,
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Clear rate limit on success
  clearRateLimit(rateLimitKey);

  // Update lastLogin
  user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  // Generate JWT access token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  const { passwordHash: _, ...safeUser } = user;

  recordAuditEntry({
    userName: user.name,
    userRole: user.role,
    actionType: 'USER_LOGIN',
    details: `User ${user.email} authenticated successfully. Session initiated.`,
    objectType: 'SESSION',
    objectId: user.id,
    newState: 'Authenticated',
  });

  res.json({
    status: 'success',
    token,
    user: safeUser,
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const user = getUserFromToken(req);
  if (user) {
    recordAuditEntry({
      userName: user.name,
      userRole: user.role,
      actionType: 'USER_LOGOUT',
      details: `User ${user.email} signed out securely. Session terminated.`,
      objectType: 'SESSION',
      objectId: user.id,
      newState: 'Logged Out',
    });
  }
  res.json({ status: 'success', message: 'You have been signed out securely.' });
});

// GET /api/auth/user
app.get('/api/auth/user', (req: AuthenticatedRequest, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) {
    // Return default viewer for unauthenticated read-only inspection if needed, or 401
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  res.json({
    ...user,
    operator: 'Oil India Limited',
    environment: 'PILOT SANDBOX',
  });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req: AuthenticatedRequest, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Cannot refresh: invalid or expired token.' });
  }
  const newToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ status: 'success', token: newToken, user });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }
  const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (user) {
    recordAuditEntry({
      userName: user.name,
      userRole: user.role,
      actionType: 'PASSWORD_RESET_REQUESTED',
      details: `Password reset requested for account ${email}`,
      objectType: 'USER',
      objectId: user.id,
    });
  }
  // Always return friendly response to prevent email enumeration
  res.json({
    status: 'success',
    message: 'If the account exists in Pilot Sandbox, a temporary reset link has been dispatched to the administrator log.',
    demoNotice: 'In Pilot Sandbox, use the seed credentials on the login screen or reset via Admin.',
  });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req: AuthenticatedRequest, res: Response) => {
  const { userId, newPassword } = req.body;
  const actor = getUserFromToken(req);

  // Require admin or self
  if (!actor) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  if (actor.role !== 'Administrator' && actor.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to change this password.' });
  }

  const targetUser = usersStore.find((u) => u.id === userId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  targetUser.passwordHash = bcrypt.hashSync(newPassword, 10);

  recordAuditEntry({
    userName: actor.name,
    userRole: actor.role,
    actionType: 'PASSWORD_RESET',
    details: `Password reset successfully for ${targetUser.email}`,
    objectType: 'USER',
    objectId: targetUser.id,
  });

  res.json({ status: 'success', message: 'Password has been updated successfully.' });
});

// Legacy role route for quick simulation mode if needed
app.post('/api/auth/role', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.body;
  if (req.user && role) {
    const user = usersStore.find((u) => u.id === req.user?.id);
    if (user && req.user.role === 'Administrator') {
      user.role = role;
      recordAuditEntry({
        userName: req.user.name,
        userRole: req.user.role,
        actionType: 'ROLE_SWITCHED',
        details: `Administrator simulated role change to ${role}`,
        objectType: 'USER',
        objectId: user.id,
      });
      return res.json({ role: user.role, status: 'success' });
    }
  }
  res.json({ status: 'success' });
});

// ==========================================
// ADMIN USER MANAGEMENT ROUTES
// ==========================================

// GET /api/admin/users
app.get('/api/admin/users', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const safeUsers = usersStore.map(({ passwordHash: _, ...u }) => u);
  res.json({
    totalUsers: safeUsers.length,
    users: safeUsers,
  });
});

// POST /api/admin/users
app.post('/api/admin/users', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const { email, name, role, department, password, permissions, phone } = req.body;

  if (!email || !name || !role || !password) {
    return res.status(400).json({ error: 'Email, name, role, and password are required.' });
  }

  const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: 'A user account with this email already exists.' });
  }

  const defaultPermissions: UserPermission[] = permissions || (
    role === 'Administrator'
      ? ['VIEW_INTELLIGENCE', 'ACKNOWLEDGE_OPERATIONAL_ALERT', 'SUBMIT_ALERT_FEEDBACK', 'RECORD_ACTION_OUTCOME', 'RECORD_MUD_OBSERVATION', 'REVIEW_FORMATION_ALIASES', 'ESCALATE_STANDARD_ALERT', 'CLOSE_WELL_CONTROL_ESCALATION', 'REVIEW_EVIDENCE_EXTRACTS', 'EXPORT_HANDOVER_BRIEF', 'MANAGE_USERS', 'MANAGE_SYSTEM_CONFIG']
      : role === 'Drilling Engineer'
      ? ['VIEW_INTELLIGENCE', 'ACKNOWLEDGE_OPERATIONAL_ALERT', 'SUBMIT_ALERT_FEEDBACK', 'RECORD_ACTION_OUTCOME', 'EXPORT_HANDOVER_BRIEF', 'ESCALATE_STANDARD_ALERT']
      : role === 'Mud Engineer'
      ? ['VIEW_INTELLIGENCE', 'SUBMIT_ALERT_FEEDBACK', 'RECORD_MUD_OBSERVATION']
      : role === 'Geologist'
      ? ['VIEW_INTELLIGENCE', 'REVIEW_FORMATION_ALIASES']
      : role === 'Well-Control Supervisor'
      ? ['VIEW_INTELLIGENCE', 'CLOSE_WELL_CONTROL_ESCALATION']
      : role === 'Data / SME Reviewer'
      ? ['VIEW_INTELLIGENCE', 'REVIEW_EVIDENCE_EXTRACTS']
      : ['VIEW_INTELLIGENCE']
  );

  const newUser: SeedUserRecord = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    email: email.trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    name: name.trim(),
    role: role as UserRole,
    department: department || 'Eastern Basin Asset Team',
    status: 'Active',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    permissions: defaultPermissions,
    phone: phone || '',
  };

  usersStore.push(newUser);

  recordAuditEntry({
    userName: req.user!.name,
    userRole: req.user!.role,
    actionType: 'ADMIN_CREATE_USER',
    details: `Created new user ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
    objectType: 'USER',
    objectId: newUser.id,
    newState: 'Active',
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ status: 'success', user: safeUser });
});

// PATCH /api/admin/users/:id
app.patch('/api/admin/users/:id', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, department, phone, permissions } = req.body;

  const user = usersStore.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const oldState = JSON.stringify({ name: user.name, department: user.department, phone: user.phone });

  if (name) user.name = name.trim();
  if (department) user.department = department.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (permissions && Array.isArray(permissions)) user.permissions = permissions;

  const newState = JSON.stringify({ name: user.name, department: user.department, phone: user.phone });

  recordAuditEntry({
    userName: req.user!.name,
    userRole: req.user!.role,
    actionType: 'ADMIN_UPDATE_USER',
    details: `Updated profile details for user ${user.email}`,
    objectType: 'USER',
    objectId: user.id,
    oldState,
    newState,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ status: 'success', user: safeUser });
});

// PATCH /api/admin/users/:id/role
app.patch('/api/admin/users/:id/role', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role is required.' });
  }

  const user = usersStore.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent changing the role of the last active Administrator away from Administrator!
  if (user.role === 'Administrator' && role !== 'Administrator') {
    const activeAdmins = usersStore.filter((u) => u.role === 'Administrator' && u.status === 'Active');
    if (activeAdmins.length <= 1) {
      return res.status(400).json({
        error: 'Safety Restriction: Cannot change the role of the final active Administrator account.',
      });
    }
  }

  const oldRole = user.role;
  user.role = role as UserRole;

  recordAuditEntry({
    userName: req.user!.name,
    userRole: req.user!.role,
    actionType: 'ADMIN_CHANGE_ROLE',
    details: `Changed role of ${user.email} from ${oldRole} to ${role}`,
    objectType: 'USER',
    objectId: user.id,
    oldState: oldRole,
    newState: role,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ status: 'success', user: safeUser });
});

// PATCH /api/admin/users/:id/status
app.patch('/api/admin/users/:id/status', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Active, Inactive, or Suspended.' });
  }

  const user = usersStore.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent deactivating the last active Administrator account!
  if (user.role === 'Administrator' && status !== 'Active') {
    const activeAdmins = usersStore.filter((u) => u.role === 'Administrator' && u.status === 'Active');
    if (activeAdmins.length <= 1) {
      return res.status(400).json({
        error: 'Safety Restriction: Cannot deactivate the final active Administrator account.',
      });
    }
  }

  const oldStatus = user.status;
  user.status = status;

  recordAuditEntry({
    userName: req.user!.name,
    userRole: req.user!.role,
    actionType: 'ADMIN_CHANGE_STATUS',
    details: `Updated account status of ${user.email} to ${status}`,
    objectType: 'USER',
    objectId: user.id,
    oldState: oldStatus,
    newState: status,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ status: 'success', user: safeUser });
});

// DELETE /api/admin/users/:id
app.delete('/api/admin/users/:id', requireAuth, requireRole(['Administrator']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const user = usersStore.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent deleting the last active Administrator account!
  if (user.role === 'Administrator') {
    const activeAdmins = usersStore.filter((u) => u.role === 'Administrator' && u.status === 'Active');
    if (activeAdmins.length <= 1) {
      return res.status(400).json({
        error: 'Safety Restriction: Cannot delete the final active Administrator account.',
      });
    }
  }

  // Soft-delete: mark inactive or remove from store
  user.status = 'Inactive';
  usersStore = usersStore.filter((u) => u.id !== id);

  recordAuditEntry({
    userName: req.user!.name,
    userRole: req.user!.role,
    actionType: 'ADMIN_DELETE_USER',
    details: `Deleted user account ${user.email} (${user.name})`,
    objectType: 'USER',
    objectId: id,
    oldState: 'Active',
    newState: 'Deleted',
  });

  res.json({ status: 'success', message: `User ${user.email} has been removed.` });
});

// ==========================================
// WELLS & TELEMETRY ROUTES (READ-ONLY INTELLIGENCE)
// ==========================================
app.get('/api/wells', (req: Request, res: Response) => {
  res.json({
    activeWell: 'OIL-BRL-09',
    totalWellsAnalysed: 14,
    wells: OFFSET_WELLS,
  });
});

app.get('/api/wells/:id', (req: Request, res: Response) => {
  const well = OFFSET_WELLS.find((w) => w.id === req.params.id);
  if (!well) {
    return res.status(404).json({ error: 'Well not found' });
  }
  res.json(well);
});

app.get('/api/wells/:id/telemetry/live', (req: Request, res: Response) => {
  res.json({
    wellId: 'OIL-BRL-09',
    bitDepthTvdM: currentMetrics.bitDepthTvdM,
    bitDepthMdM: currentMetrics.bitDepthMdM,
    formation: currentMetrics.formation,
    flowOutDiffPct: currentMetrics.flowOutDiffPct,
    flowOutActualPct: currentMetrics.flowOutActualPct,
    torqueDiffKNm: currentMetrics.torqueDiffKNm,
    torqueActualKNm: currentMetrics.torqueActualKNm,
    pitVolumeDiffM3: currentMetrics.pitVolumeDiffM3,
    pitVolumeActualM3: currentMetrics.pitVolumeActualM3,
    fingerprintSimilarityPct: currentMetrics.fingerprintSimilarityPct,
    comparableWell: currentMetrics.comparableWell,
    streamFreshnessSec: currentMetrics.streamFreshnessSec,
    streamQuality: currentMetrics.streamQuality,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/wells/:id/telemetry/history', (req: Request, res: Response) => {
  res.json({
    wellId: 'OIL-BRL-09',
    window: '30m rolling',
    series: LIVE_TELEMETRY_SERIES,
  });
});

// ==========================================
// RISK, REPLAY & RUNWAY ROUTES
// ==========================================
app.get('/api/risk-runway', (req: Request, res: Response) => {
  res.json({
    activeWell: 'OIL-BRL-09',
    currentTvdM: currentMetrics.bitDepthTvdM,
    currentMdM: currentMetrics.bitDepthMdM,
    stratigraphy: FORMATION_ZONES,
    casingShoeDepthM: 2650.0,
    lossWindow: [2770.0, 2825.0],
    watchZone: [2730.0, 2770.0],
    alertZone: [2780.0, 2810.0],
    lookAheadWatch: {
      formation: 'Kopili Shale',
      depthRange: [2950.0, 3050.0],
      risk: 'Overpressured gas kick potential (Specialist well-control escalation required)',
    },
  });
});

app.get('/api/risk-replay', (req: Request, res: Response) => {
  res.json({
    activeWell: 'OIL-BRL-09',
    historicalWell: 'OIL-X12',
    fingerprintSimilarityPct: 88,
    precursorDurationMin: 20,
    sourceDoc: 'Synthetic DDR_OIL-X12.pdf',
    sourcePage: 14,
    telemetryComparison: LIVE_TELEMETRY_SERIES,
  });
});

// ==========================================
// ALERTS & OPERATIONAL ACTIONS (RBAC ENFORCED)
// ==========================================
app.get('/api/alerts', (req: Request, res: Response) => {
  res.json({
    alerts: activeAlerts,
    activeCount: activeAlerts.filter((a) => a.status === 'Active').length,
  });
});

// Acknowledge standard operational alert
// Drilling Engineer & Drilling Superintendent & Admin only. Viewer / Mud / Geo forbidden.
app.post(
  '/api/alerts/:id/acknowledge',
  requireAuth,
  requireRole(['Drilling Engineer', 'Drilling Superintendent', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { actionTaken, outcome } = req.body;

    const alert = activeAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const oldStatus = alert.status;
    alert.status = 'Acknowledged';
    alert.actionTaken = actionTaken || 'Controlled ROP reduction + high-viscosity LCM pill';
    alert.outcome = outcome || 'Fluid circulation stabilized; monitoring pit volume';
    alert.acknowledgedBy = `${req.user!.name} (${req.user!.role})`;
    alert.acknowledgedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'ALERT_ACKNOWLEDGED',
      details: `Acknowledged operational alert ${id}. Action: ${alert.actionTaken}. Outcome: ${alert.outcome}`,
      targetId: id,
      objectType: 'ALERT',
      oldState: oldStatus,
      newState: 'Acknowledged',
      comment: alert.outcome,
    });

    res.json({ status: 'success', alert });
  }
);

// Submit alert feedback (Drilling Engineer, Mud Engineer, Superintendent, Admin)
app.post(
  '/api/alerts/:id/feedback',
  requireAuth,
  requireRole(['Drilling Engineer', 'Mud Engineer', 'Drilling Superintendent', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { feedback } = req.body;

    const alert = activeAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const oldFeedback = alert.feedback;
    alert.feedback = feedback;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'ALERT_FEEDBACK_RECORDED',
      details: `Feedback recorded for alert ${id}: ${feedback}`,
      targetId: id,
      objectType: 'ALERT',
      oldState: oldFeedback,
      newState: feedback,
    });

    res.json({ status: 'success', alert });
  }
);

// Escalate standard operational alert
app.post(
  '/api/alerts/:id/escalate',
  requireAuth,
  requireRole(['Drilling Engineer', 'Drilling Superintendent', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const alert = activeAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const oldStatus = alert.status;
    alert.status = 'Escalated';
    alert.escalatedTo = 'Drilling Supervisor / Office Cell';
    alert.escalatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'ALERT_ESCALATED',
      details: `Operational alert ${id} escalated to supervisory control`,
      targetId: id,
      objectType: 'ALERT',
      oldState: oldStatus,
      newState: 'Escalated',
    });

    res.json({ status: 'success', alert });
  }
);

// ==========================================
// WELL-CONTROL SPECIALIST ESCALATION ROUTES
// ==========================================
// Well-Control Supervisor & Administrator only
app.post(
  '/api/well-control/escalate',
  requireAuth,
  requireRole(['Well-Control Supervisor', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { wellId, zone, formation, notes } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'WELL_CONTROL_ESCALATION_TRIGGERED',
      details: `Critical well-control watch initiated for ${wellId} at ${formation} (${zone}). Specialist protocol activated.`,
      targetId: wellId,
      objectType: 'WELL_CONTROL',
      newState: 'Escalated to Specialist Cell',
      comment: notes || 'No live kick fingerprint is claimed in Phase 1. Specialist well-control escalation is required.',
    });

    res.json({
      status: 'success',
      message: 'Critical Well-Control escalation activated. Standing orders dispatched.',
      safetyNotice: 'Advisory protocol: No autonomous command sent. Drilling engineer remains final decision maker.',
    });
  }
);

app.post(
  '/api/well-control/close',
  requireAuth,
  requireRole(['Well-Control Supervisor', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { wellId, resolutionNotes } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'WELL_CONTROL_ESCALATION_CLOSED',
      details: `Specialist well-control escalation cleared and closed for ${wellId}.`,
      targetId: wellId,
      objectType: 'WELL_CONTROL',
      oldState: 'Active Watch',
      newState: 'Resolved / Closed',
      comment: resolutionNotes || 'Hydrostatic barrier and ECD integrity re-verified.',
    });

    res.json({ status: 'success', message: 'Well-Control escalation closed and logged in audit ledger.' });
  }
);

// ==========================================
// GEOLOGY & FORMATION ALIAS REVIEW
// ==========================================
// Geologist & Administrator only
app.post(
  '/api/formation/alias-review',
  requireAuth,
  requireRole(['Geologist', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { alias, canonicalName, status, notes } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'FORMATION_ALIAS_REVIEWED',
      details: `Geological review for alias "${alias}" -> canonical "${canonicalName}". Status: ${status}`,
      objectType: 'FORMATION_ALIAS',
      newState: status,
      comment: notes || 'Subsurface stratigraphy verified against Oil India Eastern Basin compendium.',
    });

    res.json({ status: 'success', message: `Formation alias mapping updated to ${status}` });
  }
);

// ==========================================
// MUD LOGGING OBSERVATION ROUTE
// ==========================================
// Mud Engineer & Administrator only
app.post(
  '/api/mud/observation',
  requireAuth,
  requireRole(['Mud Engineer', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { densitySg, visSec, ph, pillStatus, notes } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'MUD_OBSERVATION_RECORDED',
      details: `Mud rheology logged: Density ${densitySg} SG, Viscosity ${visSec}s, pH ${ph}. Pill: ${pillStatus}`,
      objectType: 'MUD_SYSTEM',
      newState: 'Updated',
      comment: notes || 'Standby 25 bbl mica/CaCO3 pill prepared in Pit 3.',
    });

    res.json({ status: 'success', message: 'Mud system parameters recorded into formation memory stream.' });
  }
);

// ==========================================
// EVIDENCE REVIEW & APPROVAL ROUTES
// ==========================================
// Data / SME Reviewer & Administrator only
app.post(
  '/api/evidence/:id/review',
  requireAuth,
  requireRole(['Data / SME Reviewer', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { decision, notes } = req.body; // 'Approved' | 'Rejected' | 'Correction Requested'

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'EVIDENCE_REVIEW_SUBMITTED',
      details: `SME Reviewer decision for extract ${id}: ${decision}`,
      targetId: id,
      objectType: 'EVIDENCE_DOCUMENT',
      newState: decision,
      comment: notes || 'Validated against primary tour sheet page 14.',
    });

    res.json({ status: 'success', message: `Evidence record ${id} status updated to ${decision}` });
  }
);

// ==========================================
// DATA ONBOARDING & ADAPTER ROUTES
// ==========================================
// Administrator only (or SME reviewer for document upload)
app.post(
  '/api/onboarding/upload',
  requireAuth,
  requireRole(['Data / SME Reviewer', 'Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { fileName, category, recordsCount } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'DATA_ONBOARDING_UPLOAD',
      details: `Uploaded & parsed ${fileName} in category ${category} (${recordsCount} records)`,
      objectType: 'ONBOARDING_DATASET',
      newState: 'Parsed & Staged',
    });

    res.json({ status: 'success', message: `File ${fileName} validated and staged for pilot ingestion.` });
  }
);

app.post(
  '/api/adapters/configure',
  requireAuth,
  requireRole(['Administrator']),
  (req: AuthenticatedRequest, res: Response) => {
    const { adapterType, endpoint, enabled } = req.body;

    recordAuditEntry({
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'ADAPTER_CONFIGURED',
      details: `Adapter ${adapterType} (${endpoint}) status changed to: ${enabled ? 'Connected' : 'Disconnected'}`,
      objectType: 'INTEGRATION_ADAPTER',
      newState: enabled ? 'Connected' : 'Disconnected',
    });

    res.json({ status: 'success', message: `Adapter ${adapterType} configuration updated.` });
  }
);

// ==========================================
// MITIGATIONS, DRILLASK & AUDIT
// ==========================================
app.get('/api/mitigations', (req: Request, res: Response) => {
  res.json({
    formation: 'Lower Barail',
    mitigations: MITIGATION_RECORDS,
  });
});

app.post('/api/drillask', (req: Request, res: Response) => {
  const { query } = req.body;
  const q = (query || '').toLowerCase().trim();

  const match = DRILLASK_KNOWLEDGE_BASE.find(
    (item) =>
      item.query.toLowerCase().includes(q) ||
      q.includes(item.query.toLowerCase()) ||
      (q.includes('barail') && q.includes('loss') && item.id === 'ASK-01') ||
      (q.includes('before') && q.includes('loss') && item.id === 'ASK-02') ||
      (q.includes('shoe') && q.includes('cement') && item.id === 'ASK-03') ||
      (q.includes('torque') && item.id === 'ASK-04')
  );

  if (match) {
    return res.json(match);
  }

  return res.json({
    id: 'NOT_FOUND',
    query,
    shortAnswer: 'No evidence found.',
    supportingPoints: [
      'No historical Daily Drilling Report or Well Completion Report supports this inquiry in current formation memory.',
      'DRILLDNA strictly forbids generating unsupported advice without page-level document citations.',
    ],
    sourceDoc: 'N/A',
    sourcePage: 0,
    confidencePct: 0,
    dataTier: 'Tier 1',
    reviewStatus: 'No evidence found',
    comparableWell: 'None',
    found: false,
  });
});

app.get('/api/backtest', (req: Request, res: Response) => {
  res.json({
    heldOutWells: BACKTEST_RESULTS,
    benchmarkSummary: {
      averageLeadTimeAdvantageMin: 16.3,
      precisionImprovementPct: 43.1,
      falseAlertReductionPct: 91.8,
    },
  });
});

app.get('/api/audit', (req: Request, res: Response) => {
  res.json({
    auditLog: auditTrail,
  });
});

app.get('/api/models', (req: Request, res: Response) => {
  res.json({
    models: MODEL_VERSIONS,
    activeModelLocked: true,
  });
});

// ==========================================
// VITE DEV SERVER OR STATIC PROD SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DRILLDNA RBAC Platform listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
