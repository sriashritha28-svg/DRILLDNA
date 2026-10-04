import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Users,
  KeyRound,
  AlertCircle,
  HelpCircle,
  X,
  Compass,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginAsViewer, setIsDemoGuideModalOpen, authMessage, setAuthMessage } = useApp();

  const [email, setEmail] = useState<string>('engineer@drilldna.demo');
  const [password, setPassword] = useState<string>('Engineer@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSubmitted, setForgotSubmitted] = useState<boolean>(false);

  const seededAccounts = [
    {
      role: 'Viewer / Judge',
      email: 'viewer@drilldna.demo',
      pass: 'Viewer@2026',
      badge: 'Read-Only',
      badgeColor: 'bg-[#EEF7FB] text-[#1677B8] border-[#1677B8]/30',
      desc: 'Evaluation & audit view with simulated actions',
      landing: 'Dashboard (Read-only)',
    },
    {
      role: 'Drilling Engineer',
      email: 'engineer@drilldna.demo',
      pass: 'Engineer@2026',
      badge: 'Tour Operator',
      badgeColor: 'bg-[#EEF9F2] text-[#2F8F5B] border-[#2F8F5B]/30',
      desc: 'Alert acknowledgement, ROP/LCM actions, handover brief',
      landing: 'Operations Dashboard',
    },
    {
      role: 'Mud Engineer',
      email: 'mud@drilldna.demo',
      pass: 'Mud@2026',
      badge: 'Fluids Cell',
      badgeColor: 'bg-[#FFF7E8] text-[#D38B22] border-[#D38B22]/30',
      desc: 'Mud rheology logging, pit volumes, standby pill status',
      landing: 'Mud Monitoring',
    },
    {
      role: 'Geologist',
      email: 'geology@drilldna.demo',
      pass: 'Geo@2026',
      badge: 'Subsurface',
      badgeColor: 'bg-[#F2EFFE] text-[#6941C6] border-[#6941C6]/30',
      desc: 'Formation memory, alias mappings, Barail stratigraphic tops',
      landing: 'Formation Memory',
    },
    {
      role: 'Drilling Superintendent',
      email: 'superintendent@drilldna.demo',
      pass: 'Super@2026',
      badge: 'Operations HQ',
      badgeColor: 'bg-[#EEF7FB] text-[#12324A] border-[#12324A]/30',
      desc: 'Office overview, escalation queue, compliance oversight',
      landing: 'Office Overview',
    },
    {
      role: 'Well-Control Supervisor',
      email: 'wellcontrol@drilldna.demo',
      pass: 'Control@2026',
      badge: 'Critical Watch',
      badgeColor: 'bg-[#FFF1F1] text-[#C93C3C] border-[#C93C3C]/30',
      desc: 'Kopili gas watch zone, specialist escalation protocols',
      landing: 'Well-Control Watch',
    },
    {
      role: 'Data / SME Reviewer',
      email: 'reviewer@drilldna.demo',
      pass: 'Reviewer@2026',
      badge: 'Quality SME',
      badgeColor: 'bg-[#F0FDF4] text-[#15803D] border-[#15803D]/30',
      desc: 'DDR/WCR evidence verification, extraction accuracy queue',
      landing: 'Evidence Review',
    },
    {
      role: 'Administrator',
      email: 'admin@drilldna.demo',
      pass: 'Admin@2026',
      badge: 'Super Admin',
      badgeColor: 'bg-[#12324A] text-white border-[#12324A]',
      desc: 'User management, RBAC, adapter switches, model locking',
      landing: 'Admin Overview',
    },
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setAuthMessage(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setIsLoading(true);
    setErrorMessage(null);
    setAuthMessage(null);

    login(targetEmail, targetPass).then((res) => {
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    })
      .then(() => setForgotSubmitted(true))
      .catch(() => setForgotSubmitted(true));
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F8FA] flex flex-col justify-between text-[#193040] selection:bg-[#118A8A]/20">
      {/* Top Header Strip */}
      <header className="w-full bg-white border-b border-[#DDE6EA] px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#12324A] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-2xs">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-[#12324A]">
                DRILL<span className="text-[#118A8A]">DNA</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF7FB] text-[#1677B8] font-bold border border-[#1677B8]/30">
                PILOT SANDBOX
              </span>
            </div>
            <div className="text-[11px] text-[#667B89]">Formation Memory & Advisory Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline text-[#667B89]">Oil India Limited SIH26121</span>
          <button
            onClick={() => setIsDemoGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE6EA] text-[#118A8A] font-medium rounded-lg hover:border-[#118A8A] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Guided Demo</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {/* Sign-out Message Banner if present */}
        {authMessage && (
          <div className="w-full max-w-md mb-6 p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-xl text-xs text-[#2F8F5B] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{authMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Left Column: Sign-in Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-[#DDE6EA] rounded-2xl shadow-xs p-6 md:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF7FB] text-[#1677B8] rounded text-xs font-semibold mb-3 border border-[#1677B8]/20">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Secure Pilot Access</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold font-display text-[#12324A] tracking-tight">
                  Sign in to DRILLDNA
                </h1>
                <p className="text-xs text-[#667B89] mt-1 italic">
                  “Replay the past. Protect the present. Predict the next risk.”
                </p>
                <p className="text-xs text-[#8FA1AC] mt-0.5">
                  Pilot Sandbox — Formation Memory & Advisory
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-[#FFF1F1] border border-[#C93C3C]/30 rounded-xl text-xs text-[#C93C3C] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12324A] mb-1.5">
                    Authorized Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8FA1AC] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@drilldna.demo"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDE6EA] rounded-lg text-xs font-sans text-[#193040] focus:border-[#1677B8] focus:ring-1 focus:ring-[#1677B8] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#12324A]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotSubmitted(false);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-[11px] text-[#118A8A] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8FA1AC] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-white border border-[#DDE6EA] rounded-lg text-xs font-sans text-[#193040] focus:border-[#1677B8] focus:ring-1 focus:ring-[#1677B8] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA1AC] hover:text-[#12324A]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#12324A] hover:bg-[#1F4E6B] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Platform</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={loginAsViewer}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#EEF7FB] hover:bg-[#1677B8]/10 text-[#1677B8] border border-[#1677B8]/30 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Continue as Viewer (Read-Only)</span>
                  </button>
                </div>
              </form>

              {/* Safety Strip Notice */}
              <div className="p-3 bg-[#F5F8FA] border border-[#DDE6EA] rounded-xl flex items-start gap-2 text-[11px] text-[#667B89] leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-[#D9A300] shrink-0 mt-0.5" />
                <div>
                  <strong>Read-only decision support.</strong> DRILLDNA does not control rig equipment. The drilling engineer remains the final operational decision-maker.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seeded Sandbox Accounts Panel */}
          <div className="lg:col-span-7 w-full space-y-4">
            <div className="bg-white border border-[#DDE6EA] rounded-2xl shadow-xs p-6 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DDE6EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#118A8A]" />
                    <h2 className="text-base font-bold text-[#12324A]">
                      Seeded Sandbox Accounts
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF7E8] text-[#D38B22] font-semibold border border-[#D38B22]/30">
                      Pilot Evaluation
                    </span>
                  </div>
                  <p className="text-xs text-[#667B89] mt-0.5">
                    Click any seeded role below for 1-click credential loading and direct role-landing test:
                  </p>
                </div>
              </div>

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {seededAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => handleQuickLogin(acc.email, acc.pass)}
                    className="p-3 bg-[#F8FAFC] hover:bg-[#EEF7FB] border border-[#DDE6EA] hover:border-[#1677B8]/40 rounded-xl transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-[#12324A] group-hover:text-[#1677B8] transition-colors">
                          {acc.role}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${acc.badgeColor}`}>
                          {acc.badge}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#667B89] truncate">
                        {acc.email}
                      </div>
                      <p className="text-[11px] text-[#8FA1AC] mt-1 leading-snug">
                        {acc.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#DDE6EA]/60 flex items-center justify-between text-[10px]">
                      <span className="text-[#667B89]">
                        Landing: <strong className="text-[#12324A]">{acc.landing}</strong>
                      </span>
                      <span className="text-[#118A8A] font-bold group-hover:underline flex items-center gap-0.5">
                        <span>1-Click Sign In</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDE6EA] flex items-center justify-between text-xs text-[#667B89]">
                <span>All accounts use bcrypt hashing with salted signatures</span>
                <span className="font-mono text-[10px]">JWT 8h Bearer Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#DDE6EA] px-6 py-3 text-xs text-[#8FA1AC] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2F8F5B]" />
          <span>Environment: <strong>PILOT SANDBOX</strong></span>
          <span>·</span>
          <span>Integration: <strong>eRTMAC Mock Adapter</strong></span>
          <span>·</span>
          <span>System Mode: <strong>Read-Only Advisory</strong></span>
        </div>
        <div>
          <span>Oil India Limited SIH26121 · DRILLDNA Platform</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-[#DDE6EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12324A]">Password Assistance</h3>
                <p className="text-xs text-[#667B89]">Pilot Sandbox Password Recovery</p>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#8FA1AC] hover:text-[#12324A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-xl text-xs text-[#2F8F5B] leading-relaxed">
                  A reset request has been logged in the Pilot Sandbox immutable audit trail. In sandbox mode, you can log in directly using the seeded password <strong>(e.g., Engineer@2026)</strong> or request an Administrator account reset.
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2 bg-[#12324A] text-white rounded-lg text-xs font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-[#667B89] leading-relaxed">
                  Enter your sandbox account email to request a reset link or inspect administrator logs:
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="engineer@drilldna.demo"
                  className="w-full px-3 py-2 bg-white border border-[#DDE6EA] rounded-lg text-xs"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#667B89]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#12324A] text-white text-xs font-semibold rounded-lg"
                  >
                    Send Reset Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
