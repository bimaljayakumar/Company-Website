import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Mail, User, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, Send, Key } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const EmergencyRecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    emergencyToken,
    secondsRemaining,
    resetPasswordWithEmergencyKey,
    sendEmailRecoveryOTP,
    resetPasswordWithEmailOTP,
    getAdminEmails,
    getAdminUsername
  } = useAdminAuth();

  const { primaryEmail } = getAdminEmails();

  const [recoveryMethod, setRecoveryMethod] = useState<'pin' | 'email'>('pin');

  // PIN Form State
  const [emergencyKey, setEmergencyKey] = useState('');
  const [newUsername, setNewUsername] = useState(getAdminUsername());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email Form State
  const [email, setEmail] = useState(primaryEmail);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Immediate redirect if emergency token is missing or expired
  useEffect(() => {
    if (!emergencyToken) {
      navigate('/', { replace: true });
    }
  }, [emergencyToken, navigate]);

  // Handle timer expiration
  useEffect(() => {
    if (emergencyToken && secondsRemaining <= 0) {
      navigate('/', { replace: true });
    }
  }, [emergencyToken, secondsRemaining, navigate]);

  if (!emergencyToken) {
    return null;
  }

  const handlePinResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg("New Password and Confirm Password do not match.");
      return;
    }

    const res = resetPasswordWithEmergencyKey(emergencyKey, newUsername, newPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setDemoOtpNotice(null);

    const res = await sendEmailRecoveryOTP(email);
    if (res.success) {
      setOtpSent(true);
      setSuccessMsg(res.message);
      setDemoOtpNotice('[SECURITY GUARD]: 6-Digit Recovery OTP code sent to your email inbox.');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleEmailResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg("New Password and Confirm Password do not match.");
      return;
    }

    const res = resetPasswordWithEmailOTP(email, otpCode, newUsername, newPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-paper flex items-center justify-center p-4 selection:bg-primary selection:text-ink font-sans relative overflow-hidden">
      
      {/* Hero Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0 mix-blend-screen"
        ref={(el) => { if (el) el.playbackRate = 0.8; }}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Glassmorphism Card */}
      <div className="max-w-md w-full bg-panel/85 border border-red-500/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-3 shadow-xl">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="font-mono text-xs text-red-400 font-bold tracking-widest uppercase block mb-1">
            // EMERGENCY RECOVERY GATEWAY
          </span>
          <h2 className="font-jakarta text-2xl font-black text-paper tracking-tight">
            Reset Admin Password
          </h2>
          <p className="font-sans text-xs text-slate mt-1">
            Select Master PIN or enter either Primary/Secondary Email to recover access.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setRecoveryMethod('pin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              recoveryMethod === 'pin' ? 'bg-primary text-ink font-bold shadow-md' : 'text-slate hover:text-paper'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Master PIN</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRecoveryMethod('email');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              recoveryMethod === 'email' ? 'bg-primary text-ink font-bold shadow-md' : 'text-slate hover:text-paper'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP</span>
          </button>
        </div>

        {/* Success Notice */}
        {successMsg && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Demo OTP Alert Box */}
        {demoOtpNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-primary/10 border border-primary/40 font-mono text-xs text-primary text-center animate-pulse">
            {demoOtpNotice}
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-400 text-center">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: MASTER PIN RECOVERY */}
        {recoveryMethod === 'pin' && (
          <form onSubmit={handlePinResetSubmit} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block font-mono text-xs text-slate mb-1">Step 1: Emergency Reset Key / PIN *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-primary absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={emergencyKey}
                  onChange={(e) => setEmergencyKey(e.target.value)}
                  placeholder="Enter Master Emergency Key"
                  className="w-full bg-black/70 border border-primary/40 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate mb-1">Step 2: Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New admin username"
                  className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate mb-1">New Admin Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate hover:text-paper transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-red-500 text-paper font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white hover:text-ink hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 mt-2 cursor-pointer"
            >
              Execute Password Reset & Restore
            </button>
          </form>
        )}

        {/* TAB 2: EMAIL OTP RECOVERY */}
        {recoveryMethod === 'email' && (
          <div className="space-y-4 font-sans text-sm">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Enter Primary or Secondary Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-primary absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Primary or Secondary Email"
                      className="w-full bg-black/70 border border-primary/40 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-ink font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send 6-Digit Reset OTP Code</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailResetSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Enter 6-Digit Email Security OTP *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-primary absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP code"
                      className="w-full bg-black/70 border border-primary/40 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 font-mono text-xs tracking-widest text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">New Admin Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="New admin username"
                      className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">New Admin Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate hover:text-paper transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="py-3 px-4 rounded-xl bg-black/60 border border-white/15 text-slate hover:text-paper text-xs font-mono"
                  >
                    Resend OTP
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-4 rounded-xl bg-red-500 text-paper font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white hover:text-ink hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 cursor-pointer"
                  >
                    Verify OTP & Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end text-slate font-mono text-[11px]">
          <button
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to main site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
