import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount, UserRole, UserPermission } from '../types';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { token, currentUser, logAction, setActiveView } = useApp();

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isResetPassOpen, setIsResetPassOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Drilling Engineer' as UserRole,
    department: 'Eastern Basin Drilling Team',
    phone: '',
    password: '',
  });

  const [newPassword, setNewPassword] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('Drilling Engineer');

  const availableRoles: UserRole[] = [
    'Viewer',
    'Drilling Engineer',
    'Mud Engineer',
    'Geologist',
    'Drilling Superintendent',
    'Well-Control Supervisor',
    'Data / SME Reviewer',
    'Administrator',
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // offline / mock fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to create user', 'error');
        return;
      }

      showNotification(`User account created successfully for ${formData.name}`);
      setIsCreateOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'Drilling Engineer',
        department: 'Eastern Basin Drilling Team',
        phone: '',
        password: '',
      });
      fetchUsers();
    } catch {
      showNotification('Network error creating user', 'error');
    }
  };

  // Edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to update user', 'error');
        return;
      }

      showNotification(`User profile updated for ${formData.name}`);
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      showNotification('Network error updating user', 'error');
    }
  };

  // Change Role
  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to change role', 'error');
        return;
      }

      showNotification(`Role updated to ${newRole} for ${selectedUser.name}`);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      showNotification('Network error changing role', 'error');
    }
  };

  // Toggle Status (Activate / Deactivate)
  const handleToggleStatus = async (user: UserAccount) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to update status', 'error');
        return;
      }

      showNotification(`Account status for ${user.name} changed to ${nextStatus}`);
      fetchUsers();
    } catch {
      showNotification('Network error changing status', 'error');
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: selectedUser.id, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to reset password', 'error');
        return;
      }

      showNotification(`Password reset successfully for ${selectedUser.email}`);
      setIsResetPassOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch {
      showNotification('Network error resetting password', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (user: UserAccount) => {
    if (!confirm(`Are you sure you want to remove user "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to delete user', 'error');
        return;
      }

      showNotification(`User account ${user.email} removed.`);
      fetchUsers();
    } catch {
      showNotification('Network error deleting user', 'error');
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      u.role.toLowerCase().startsWith(selectedRoleFilter.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'ALL' || u.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Administration: Users & Roles (RBAC)
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Manage authenticated users, role boundaries, account statuses, and bcrypt credential resets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('audit')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE6EA] text-[#667B89] hover:text-[#12324A] rounded-lg text-xs font-semibold transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Audit History</span>
          </button>

          <button
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                role: 'Drilling Engineer',
                department: 'Eastern Basin Drilling Team',
                phone: '',
                password: '',
              });
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-[#EEF9F2] text-[#2F8F5B] border-[#2F8F5B]/30'
              : 'bg-[#FFF1F1] text-[#C93C3C] border-[#C93C3C]/30'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Safety Notice: Administrator Account Protection */}
      <div className="p-3 bg-[#EEF7FB] border border-[#1677B8]/30 rounded-xl text-xs text-[#193040] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#1677B8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#12324A]">RBAC Safety Invariant:</strong> The platform strictly prevents deactivating or deleting the final active Administrator account to guarantee supervisory governance continuity.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#8FA1AC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DDE6EA] rounded-lg text-xs"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#667B89]" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-white border border-[#DDE6EA] px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-white border border-[#DDE6EA] px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="p-1.5 text-[#667B89] hover:text-[#12324A] hover:bg-[#F5F8FA] rounded transition-colors"
          title="Refresh User List"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#F5F8FA] border-b border-[#DDE6EA] text-[#667B89]">
                <th className="p-3.5 font-semibold">User / Department</th>
                <th className="p-3.5 font-semibold">Email & Phone</th>
                <th className="p-3.5 font-semibold">Assigned Role</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Last Login</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE6EA]/60">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#12324A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#12324A] flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono px-1 rounded bg-[#EEF7FB] text-[#1677B8]">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#667B89]">{u.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#667B89]">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-[#8FA1AC]">{u.phone || '—'}</div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          u.role === 'Administrator'
                            ? 'bg-[#12324A] text-white border-[#12324A]'
                            : u.role === 'Drilling Engineer'
                            ? 'bg-[#EEF9F2] text-[#2F8F5B] border-[#2F8F5B]/30'
                            : u.role === 'Well-Control Supervisor'
                            ? 'bg-[#FFF1F1] text-[#C93C3C] border-[#C93C3C]/30'
                            : 'bg-[#EEF7FB] text-[#1677B8] border-[#1677B8]/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status === 'Active'
                            ? 'bg-[#EEF9F2] text-[#2F8F5B]'
                            : 'bg-[#FFF1F1] text-[#C93C3C]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'Active' ? 'bg-[#2F8F5B]' : 'bg-[#C93C3C]'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-[#667B89] text-[11px]">
                      {u.lastLogin || 'Never logged in'}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Change Role Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                            setIsRoleModalOpen(true);
                          }}
                          className="p-1 text-[#667B89] hover:text-[#12324A] hover:bg-slate-100 rounded transition-colors"
                          title="Change Role"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#1677B8]" />
                        </button>

                        {/* Edit User Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setFormData({
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              department: u.department,
                              phone: u.phone || '',
                              password: '',
                            });
                            setIsEditOpen(true);
                          }}
                          className="p-1 text-[#667B89] hover:text-[#12324A] hover:bg-slate-100 rounded transition-colors"
                          title="Edit User Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Reset Password Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setNewPassword('');
                            setIsResetPassOpen(true);
                          }}
                          className="p-1 text-[#667B89] hover:text-[#12324A] hover:bg-slate-100 rounded transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#D38B22]" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="p-1 text-[#667B89] hover:text-[#12324A] hover:bg-slate-100 rounded transition-colors"
                          title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1 text-[#C93C3C] hover:bg-[#FFF1F1] rounded transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12324A]">Create User Account</h3>
                <p className="text-xs text-[#667B89]">Provision new operator credentials with bcrypt hashing</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#8FA1AC] hover:text-[#12324A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bhaskar Jyoti Neog"
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. bjneog@drilldna.demo"
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs cursor-pointer font-medium"
                >
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Rig OIL-04 Operations"
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DDE6EA]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 border border-[#DDE6EA] text-[#667B89] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#12324A] text-white font-semibold rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12324A]">Edit User Profile</h3>
                <p className="text-xs text-[#667B89]">{selectedUser.email}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-[#8FA1AC] hover:text-[#12324A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DDE6EA]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3 py-1.5 border border-[#DDE6EA] text-[#667B89] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#12324A] text-white font-semibold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Role */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12324A]">Change User Role</h3>
                <p className="text-xs text-[#667B89]">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-[#8FA1AC] hover:text-[#12324A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangeRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#12324A] mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs cursor-pointer font-medium"
                >
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#DDE6EA] text-[11px] text-[#667B89]">
                Changing this role will immediately update the user's active permissions, default landing page, and audit access scope across all endpoints.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#DDE6EA]">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-3 py-1.5 border border-[#DDE6EA] text-[#667B89] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#12324A] text-white font-semibold rounded-lg"
                >
                  Confirm Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {isResetPassOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-[#DDE6EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12324A]">Reset Password</h3>
                <p className="text-xs text-[#667B89]">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <button onClick={() => setIsResetPassOpen(false)} className="text-[#8FA1AC] hover:text-[#12324A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#12324A] mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password (min 6 chars)"
                  className="w-full p-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-[#EEF9F2] text-[#2F8F5B] rounded-lg border border-[#2F8F5B]/30 text-[11px]">
                The new password will be hashed with bcrypt salt before persistence. Previous session tokens will be invalidated.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#DDE6EA]">
                <button
                  type="button"
                  onClick={() => setIsResetPassOpen(false)}
                  className="px-3 py-1.5 border border-[#DDE6EA] text-[#667B89] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#12324A] text-white font-semibold rounded-lg"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
