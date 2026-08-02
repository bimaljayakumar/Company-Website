import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    token,
    secondsRemaining,
    isUnlocked,
    isLoggedIn,
    lockoutTimeLeft,
    loginAdmin,
    addAuditLog
  } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Immediate redirect for unauthorized direct URL access
  useEffect(() => {
    if (!isUnlocked && !isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isUnlocked, isLoggedIn, navigate]);

  // If already logged in, go directly to admin dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Handle silent timer expiration
  useEffect(() => {
    if (token && secondsRemaining <= 0 && !isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [token, secondsRemaining, isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || lockoutTimeLeft > 0) return;

    // Honeypot bot protection check
    if (honeypot.trim() !== '') {
      addAuditLog("BOT_ATTEMPT_DETECTED", "Automated bot submission caught by security honeypot.", "FAILED");
      setErrorMsg("Security Verification Failed.");
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Artificial delay to prevent timing side-channel attacks
    setTimeout(() => {
      const res = loginAdmin(username, password);
      setIsSubmitting(false);

      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  // If direct URL access attempted without secret token, do not render message card, redirect immediately
  if (!isUnlocked && !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-paper flex items-center justify-center p-4 selection:bg-primary selection:text-ink font-sans relative overflow-hidden">
      
      {/* 1st Video Background (Hero Background) */}
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

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 pointer-events-none z-0" />

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Glassmorphism Login Card */}
      <div className="max-w-md w-full bg-panel/85 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative z-10">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-panel-light border border-white/20 text-primary flex items-center justify-center mx-auto mb-3 shadow-xl">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-jakarta text-2xl font-black text-paper tracking-tight">
            Admin Portal Access
          </h2>
          <p className="font-sans text-xs text-slate mt-1">
            High-End Security Authentication System
          </p>
        </div>

        {/* Lockout Notice */}
        {lockoutTimeLeft > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-400 text-center">
            Security Lockout Active! Try again in {lockoutTimeLeft}s.
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-400 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          {/* Invisible Security Honeypot Input for Bot Detection */}
          <input
            type="text"
            name="b_hp_security"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="block font-mono text-xs text-slate mb-1">Admin Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                disabled={lockoutTimeLeft > 0 || isSubmitting}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-slate mb-1">Admin Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockoutTimeLeft > 0 || isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 disabled:opacity-50"
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

          <button
            type="submit"
            disabled={lockoutTimeLeft > 0 || isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-primary text-ink font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Security Token...</span>
              </>
            ) : (
              <span>Authenticate & Access Dashboard</span>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end text-slate font-mono text-[11px]">
          <button
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
