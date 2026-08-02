import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, User, Briefcase, Wrench, Layers, MessageSquare, Shield, ExternalLink,
  LogOut, Save, Plus, Trash2, CheckCircle, CheckCircle2, RefreshCw, Download, Upload, Eye, EyeOff, ShieldAlert, ShieldCheck,
  Cloud
} from 'lucide-react';
import { useSiteData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { uploadToCloudinary, getCloudinaryConfig } from '../../utils/cloudinary';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    updateSection,
    addArrayItem,
    updateArrayItem,
    deleteArrayItem,
    deleteMessage,
    resetToDefaults,
    setAsPermanentDefaults,
    resetToFactoryDefaults,
    hasPermanentDefaults,
    importDataJSON
  } = useSiteData();

  const {
    isLoggedIn,
    logoutAdmin,
    auditLogs,
    updateCredentialsWithOldPassword,
    updateRecoveryEmails,
    getAdminUsername,
    getAdminEmails,
    requestEmailChangeOTP,
    verifyEmailChangeOTP,
    addAuditLog
  } = useAdminAuth();

  const adminEmails = getAdminEmails();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'founder' | 'mentors' | 'projects' | 'services' | 'process' | 'testimonials' | 'cta' | 'messages' | 'security'
  >('hero');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');

  // Media & Cloudinary Upload State
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(data.cloudinary?.cloudName || '');
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(data.cloudinary?.uploadPreset || '');

  // Founder & Hero State
  const [founderImage, setFounderImage] = useState(data.founder.image || '');
  const [heroVideoUrl, setHeroVideoUrl] = useState(data.hero.videoUrl || '/hero-background.mp4');
  const [heroVideoOpacity, setHeroVideoOpacity] = useState(data.hero.videoOpacity ?? 20);

  useEffect(() => {
    if (data.founder.image !== undefined) setFounderImage(data.founder.image);
    if (data.hero.videoUrl) setHeroVideoUrl(data.hero.videoUrl);
    if (data.hero.videoOpacity !== undefined) setHeroVideoOpacity(data.hero.videoOpacity);
    if (data.cloudinary?.cloudName !== undefined) setCloudinaryCloudName(data.cloudinary.cloudName);
    if (data.cloudinary?.uploadPreset !== undefined) setCloudinaryUploadPreset(data.cloudinary.uploadPreset);
  }, [data.founder.image, data.hero.videoUrl, data.hero.videoOpacity, data.cloudinary]);

  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    successMessage: string = 'File uploaded successfully!'
  ) => {
    const config = getCloudinaryConfig({
      cloudName: cloudinaryCloudName || data.cloudinary?.cloudName,
      uploadPreset: cloudinaryUploadPreset || data.cloudinary?.uploadPreset,
    });

    if (config.cloudName && config.uploadPreset) {
      setIsUploadingMedia(true);
      setUploadProgressText(`Uploading ${file.name} to Cloudinary...`);
      try {
        const url = await uploadToCloudinary(file, config);
        onSuccess(url);
        showToast(`Uploaded to Cloudinary CDN & saved!`, false);
      } catch (err: any) {
        console.error(err);
        showToast(`Cloudinary Upload Failed: ${err.message}`, false);
      } finally {
        setIsUploadingMedia(false);
        setUploadProgressText('');
      }
    } else {
      if (file.size > 8 * 1024 * 1024) {
        showToast('File > 8MB. Configure Cloudinary Cloud Name & Upload Preset in Settings for CDN video/photo hosting.', false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onSuccess(evt.target.result as string);
          showToast(`${successMessage} (Tip: Configure Cloudinary in settings to host files on high-speed CDN)`, false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFounderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (url) => {
        setFounderImage(url);
        updateSection('founder', { image: url });
      }, 'Founder image loaded!');
    }
  };

  // Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(getAdminUsername());
  const [primaryEmail, setPrimaryEmail] = useState(adminEmails.primaryEmail);
  const [secondaryEmail, setSecondaryEmail] = useState(adminEmails.secondaryEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCredPassword, setShowCredPassword] = useState(false);

  // Email Change OTP Guard State
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpNotice, setEmailOtpNotice] = useState<string | null>(null);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New Password and Confirm Password do not match!', false);
      return;
    }

    const res = updateCredentialsWithOldPassword(currentPassword, newUsername, newPassword);
    if (res.success) {
      showToast(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      showToast(res.message, false);
    }
  };

  const handleUpdateEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await requestEmailChangeOTP();
    if (res.success) {
      setEmailOtpNotice('[SECURITY GUARD]: 6-Digit Verification OTP code sent directly to your registered email inbox.');
      setShowEmailOtpModal(true);
    }
  };

  const handleConfirmEmailOtpUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailOtpError(null);

    if (verifyEmailChangeOTP(emailOtpCode)) {
      if (updateRecoveryEmails(primaryEmail, secondaryEmail)) {
        setShowEmailOtpModal(false);
        showToast('Security Authorized! Dual Recovery Emails updated successfully!');
        setEmailOtpCode('');
      } else {
        setEmailOtpError('Failed to save updated recovery emails.');
      }
    } else {
      setEmailOtpError('Invalid 6-Digit Security OTP Code! Email change blocked.');
    }
  };

  // Protect Dashboard: if not logged in, immediately redirect to home page (/) without rendering any page
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const showToast = (msg: string, autoReload = true) => {
    setToastMsg(msg);
    if (autoReload) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSaveHero = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const opacityVal = parseInt(formData.get('videoOpacity') as string, 10);
    updateSection('hero', {
      eyebrow: formData.get('eyebrow') as string,
      headlineWord1: formData.get('headlineWord1') as string,
      headlineWord2: formData.get('headlineWord2') as string,
      headlineWord3: formData.get('headlineWord3') as string,
      headlineWord4: formData.get('headlineWord4') as string,
      videoUrl: (formData.get('videoUrl') as string) || heroVideoUrl,
      videoOpacity: isNaN(opacityVal) ? heroVideoOpacity : opacityVal,
      glowingTarget: (formData.get('glowingTarget') as any) || 'NEXT',
      glowingWords: {
        word1: formData.get('glowWord1') === 'on',
        word2: formData.get('glowWord2') === 'on',
        word3: formData.get('glowWord3') === 'on',
        word4: formData.get('glowWord4') === 'on',
        build: formData.get('glowWord1') === 'on',
        whats: formData.get('glowWord3') === 'on',
        next: formData.get('glowWord4') === 'on',
      },
      description: formData.get('description') as string,
      pillars: [
        formData.get('pillar1') as string || 'Transparent Pricing',
        formData.get('pillar2') as string || 'Agile & Adaptive',
        formData.get('pillar3') as string || 'Products That Last',
      ],
      primaryCtaText: formData.get('primaryCtaText') as string,
      primaryCtaLink: formData.get('primaryCtaLink') as string,
      secondaryCtaText: formData.get('secondaryCtaText') as string,
      secondaryCtaLink: formData.get('secondaryCtaLink') as string,
      note: formData.get('note') as string,
      metrics: [
        { value: formData.get('metric1Val') as string || '40+', label: formData.get('metric1Label') as string || 'Shipped Products' },
        { value: formData.get('metric2Val') as string || '98%', label: formData.get('metric2Label') as string || 'Retention Rate' },
        { value: formData.get('metric3Val') as string || '6 Wk', label: formData.get('metric3Label') as string || 'Products That Last' },
      ],
    });
    addAuditLog('UPDATE_HERO', 'Hero section content, pillars & metrics updated.');
    showToast('Hero Section updated successfully!');
  };

  const handleSaveAbout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSection('about', {
      ...data.about,
      eyebrow: formData.get('aboutEyebrow') as string,
      description: formData.get('aboutDescription') as string,
      stats: [
        {
          id: 'stat-1',
          tag: formData.get('stat1Tag') as string || '// TOTAL DELIVERED',
          value: formData.get('stat1Val') as string || '40+',
          targetNum: parseInt(formData.get('stat1Target') as string || '40', 10),
          suffix: formData.get('stat1Suffix') as string || '+',
          description: formData.get('stat1Desc') as string || 'High-impact web apps, platforms & site-builder engines shipped worldwide.',
        },
        {
          id: 'stat-2',
          tag: formData.get('stat2Tag') as string || '// CLIENT SATISFACTION',
          value: formData.get('stat2Val') as string || '98%',
          targetNum: parseInt(formData.get('stat2Target') as string || '98', 10),
          suffix: formData.get('stat2Suffix') as string || '%',
          description: formData.get('stat2Desc') as string || 'Long-term partners who rely on DO Company for enterprise engineering.',
        },
        {
          id: 'stat-3',
          tag: formData.get('stat3Tag') as string || '// SPEED TO MARKET',
          value: formData.get('stat3Val') as string || '6 Wk',
          targetNum: parseInt(formData.get('stat3Target') as string || '6', 10),
          suffix: formData.get('stat3Suffix') as string || ' Wk',
          description: formData.get('stat3Desc') as string || 'Average timeframe from specs sign-off to live production deployment.',
        },
      ],
    });
    addAuditLog('UPDATE_ABOUT', 'About section stats & philosophy updated.');
    showToast('About Section updated successfully!');
  };

  const handleSaveFounder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSection('founder', {
      eyebrow: formData.get('eyebrow') as string,
      headline: formData.get('headline') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      tagline: formData.get('tagline') as string,
      quote: formData.get('quote') as string,
      bio: formData.get('bio') as string,
      image: founderImage || (formData.get('image') as string),
      github: formData.get('github') as string,
      linkedin: formData.get('linkedin') as string,
      twitter: formData.get('twitter') as string,
      contributionNote: formData.get('contributionNote') as string,
    });
    addAuditLog('UPDATE_FOUNDER', 'Founder section content updated.');
    showToast('Founder Section updated successfully!');
  };

  const handleSaveCtaFooter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSection('cta', {
      eyebrow: (formData.get('ctaEyebrow') as string) || "// WHAT'S NEXT",
      title: formData.get('ctaTitle') as string,
      subtitle: formData.get('ctaSubtitle') as string,
      email: formData.get('ctaEmail') as string,
      phone: formData.get('ctaPhone') as string,
      buttonText: formData.get('ctaButtonText') as string,
    });
    updateSection('footer', {
      companyName: formData.get('companyName') as string,
      description: formData.get('footerDesc') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: formData.get('addressLine2') as string,
      email: formData.get('footerEmail') as string,
      copyrightText: formData.get('copyrightText') as string,
      github: formData.get('github') as string,
      linkedin: formData.get('linkedin') as string,
      twitter: formData.get('twitter') as string,
    });
    addAuditLog('UPDATE_CTA_FOOTER', 'CTA Banner & Footer updated.');
    showToast('CTA & Footer updated successfully!');
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${Date.now()}.json`;
    a.click();
    showToast('Site data backup JSON downloaded.');
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (importDataJSON(jsonInput)) {
      showToast('Site data imported successfully!');
      setJsonInput('');
    } else {
      showToast('Import failed. Invalid JSON format.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-paper flex flex-col font-sans selection:bg-primary selection:text-ink relative overflow-hidden">
      
      {/* 2nd Background Video (Services Background Video) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0 mix-blend-screen"
        style={{ willChange: 'transform' }}
      >
        <source src="/services-background.mp4" type="video/mp4" />
      </video>

      {/* Dark Ambient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-ink font-jakarta font-bold text-xs py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-panel/90 border-b border-white/15 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-jakarta font-black text-base shadow-lg shadow-primary/20">
            DO
          </div>
          <div>
            <h1 className="font-jakarta font-black text-lg text-paper leading-none">
              Admin Control System
            </h1>
            <span className="font-mono text-xs text-primary">
              Authenticated as <strong className="text-paper">{getAdminUsername()}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-black/70 border border-white/15 text-slate hover:text-paper hover:border-primary transition-all font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Main Site</span>
          </button>
          <button
            onClick={() => {
              logoutAdmin();
              navigate('/');
            }}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Body - Full Width Optimized Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1700px] mx-auto relative z-10 p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 lg:w-80 bg-panel/80 border border-white/15 rounded-3xl p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto select-none backdrop-blur-xl shrink-0 h-fit">
          <button
            onClick={() => setActiveTab('hero')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'hero' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Hero & General</span>
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'founder' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Founder Section</span>
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'mentors' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mentors ({data.mentors.items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'projects' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Projects ({data.projects.items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'services' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services & Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('process')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'process' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Process & Steps</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'testimonials' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Testimonials</span>
          </button>

          <button
            onClick={() => setActiveTab('cta')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'cta' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>CTA & Footer</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'messages' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Inbox Messages</span>
            </div>
            {data.messages.length > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${activeTab === 'messages' ? 'bg-ink text-primary font-bold' : 'bg-primary text-ink font-bold'}`}>
                {data.messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'security' ? 'bg-primary text-ink font-bold shadow-lg shadow-primary/20' : 'text-slate hover:bg-white/5 hover:text-paper'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & System</span>
          </button>
        </aside>

        {/* Tab Panels Content Area - Full Width */}
        <main className="flex-1 w-full bg-panel/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          
          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Edit Hero Section</h2>
                <p className="font-sans text-xs text-slate mt-1">Manage hero text, headline words, and action buttons.</p>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-5 font-sans text-sm">
                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Status Eyebrow Badge</label>
                  <input
                    type="text"
                    name="eyebrow"
                    defaultValue={data.hero.eyebrow}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Headline Word 1</label>
                    <input
                      type="text"
                      name="headlineWord1"
                      defaultValue={data.hero.headlineWord1}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Headline Word 2</label>
                    <input
                      type="text"
                      name="headlineWord2"
                      defaultValue={data.hero.headlineWord2}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Headline Word 3</label>
                    <input
                      type="text"
                      name="headlineWord3"
                      defaultValue={data.hero.headlineWord3}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Headline Word 4</label>
                    <input
                      type="text"
                      name="headlineWord4"
                      defaultValue={data.hero.headlineWord4}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-black/60 border border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-xs text-primary font-bold uppercase tracking-wider">
                      // HEADLINE LED GLOWING LIGHT TARGET (4 TICK OPTIONS)
                    </label>
                    <span className="text-[10px] font-mono text-slate">Tick to light up word</span>
                  </div>
                  <p className="font-mono text-[10px] text-slate/80 leading-relaxed">
                    Tick the checkboxes below to select which of the 4 headline word areas light up with the shimmering LED dot matrix animation:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-black/80 border border-white/15 cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        name="glowWord1"
                        defaultChecked={data.hero.glowingWords?.word1 ?? data.hero.glowingWords?.build ?? false}
                        className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-panel accent-primary"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold text-paper block">Word 1 Light</span>
                        <span className="font-mono text-[10px] text-primary">"{data.hero.headlineWord1 || 'BUILD'}"</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-black/80 border border-white/15 cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        name="glowWord2"
                        defaultChecked={data.hero.glowingWords?.word2 ?? false}
                        className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-panel accent-primary"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold text-paper block">Word 2 Light</span>
                        <span className="font-mono text-[10px] text-slate">{data.hero.headlineWord2 ? `"${data.hero.headlineWord2}"` : '(Empty)'}</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-black/80 border border-white/15 cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        name="glowWord3"
                        defaultChecked={data.hero.glowingWords?.word3 ?? data.hero.glowingWords?.whats ?? false}
                        className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-panel accent-primary"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold text-paper block">Word 3 Light</span>
                        <span className="font-mono text-[10px] text-primary">"{data.hero.headlineWord3 || "WHAT'S"}"</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-black/80 border border-white/15 cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        name="glowWord4"
                        defaultChecked={data.hero.glowingWords?.word4 ?? data.hero.glowingWords?.next ?? true}
                        className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-panel accent-primary"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold text-paper block">Word 4 Light</span>
                        <span className="font-mono text-[10px] text-primary">"{data.hero.headlineWord4 || 'NEXT.'}"</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* HERO BACKGROUND VIDEO & OPACITY SETTINGS */}
                <div className="p-5 rounded-2xl bg-black/60 border border-primary/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// HERO BACKGROUND VIDEO & OPACITY</h4>
                      <p className="font-sans text-xs text-slate mt-0.5">Upload a background video or enter video URL, and adjust opacity from 0% to 100%.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-paper font-bold px-3 py-1 rounded-lg bg-panel border border-white/15">
                        Opacity: {heroVideoOpacity}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Video File Upload */}
                    <div className="space-y-2 font-sans text-xs">
                      <label className="block font-mono text-[10px] text-slate font-bold uppercase">Upload Video File</label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-mono text-xs font-bold w-full justify-center">
                        <Upload className="w-4 h-4" />
                        <span>Upload Video File...</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (url) => {
                                setHeroVideoUrl(url);
                                updateSection('hero', { videoUrl: url });
                              }, 'Hero Background Video loaded!');
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Video URL or Path */}
                    <div className="font-sans text-xs">
                      <label className="block font-mono text-[10px] text-slate font-bold uppercase mb-1">Or Edit Video URL / Path</label>
                      <input
                        type="text"
                        name="videoUrl"
                        value={heroVideoUrl}
                        onChange={(e) => {
                          setHeroVideoUrl(e.target.value);
                          updateSection('hero', { videoUrl: e.target.value });
                        }}
                        placeholder="https://... or /hero-background.mp4"
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="space-y-2 pt-2 border-t border-white/10 font-sans text-xs">
                    <div className="flex items-center justify-between">
                      <label className="block font-mono text-xs text-slate font-bold uppercase">
                        Video Opacity Level (0% - 100%)
                      </label>
                      <span className="font-mono text-xs text-primary font-bold">{heroVideoOpacity}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-slate">0%</span>
                      <input
                        type="range"
                        name="videoOpacity"
                        min="0"
                        max="100"
                        step="1"
                        value={heroVideoOpacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setHeroVideoOpacity(val);
                          updateSection('hero', { videoOpacity: val });
                        }}
                        className="w-full h-2 bg-panel rounded-lg appearance-none cursor-pointer accent-primary border border-white/15"
                      />
                      <span className="font-mono text-xs text-slate">100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Hero Sub-description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={data.hero.description}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Hero Pillars */}
                <div className="pt-2">
                  <label className="block font-mono text-xs text-primary font-bold uppercase tracking-wider mb-2">// HERO PILLARS BADGES</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Pillar 1</label>
                      <input
                        type="text"
                        name="pillar1"
                        defaultValue={data.hero.pillars[0] || 'Transparent Pricing'}
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Pillar 2</label>
                      <input
                        type="text"
                        name="pillar2"
                        defaultValue={data.hero.pillars[1] || 'Agile & Adaptive'}
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Pillar 3</label>
                      <input
                        type="text"
                        name="pillar3"
                        defaultValue={data.hero.pillars[2] || 'Products That Last'}
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      name="primaryCtaText"
                      defaultValue={data.hero.primaryCtaText}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      name="primaryCtaLink"
                      defaultValue={data.hero.primaryCtaLink}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Secondary CTA Button Text</label>
                    <input
                      type="text"
                      name="secondaryCtaText"
                      defaultValue={data.hero.secondaryCtaText}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      name="secondaryCtaLink"
                      defaultValue={data.hero.secondaryCtaLink}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Small Note Below Buttons</label>
                  <input
                    type="text"
                    name="note"
                    defaultValue={data.hero.note}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Hero Metrics */}
                <div className="pt-2">
                  <label className="block font-mono text-xs text-primary font-bold uppercase tracking-wider mb-2">// HERO QUICK METRICS</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-slate">Metric 1 (Value / Label)</label>
                      <input
                        type="text"
                        name="metric1Val"
                        defaultValue={data.hero.metrics[0]?.value || '40+'}
                        placeholder="e.g. 40+"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                      />
                      <input
                        type="text"
                        name="metric1Label"
                        defaultValue={data.hero.metrics[0]?.label || 'Shipped Products'}
                        placeholder="e.g. Shipped Products"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-slate focus:border-primary focus:outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-slate">Metric 2 (Value / Label)</label>
                      <input
                        type="text"
                        name="metric2Val"
                        defaultValue={data.hero.metrics[1]?.value || '98%'}
                        placeholder="e.g. 98%"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold text-primary"
                      />
                      <input
                        type="text"
                        name="metric2Label"
                        defaultValue={data.hero.metrics[1]?.label || 'Retention Rate'}
                        placeholder="e.g. Retention Rate"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-slate focus:border-primary focus:outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-slate">Metric 3 (Value / Label)</label>
                      <input
                        type="text"
                        name="metric3Val"
                        defaultValue={data.hero.metrics[2]?.value || '6 Wk'}
                        placeholder="e.g. 6 Wk"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                      />
                      <input
                        type="text"
                        name="metric3Label"
                        defaultValue={data.hero.metrics[2]?.label || 'Products That Last'}
                        placeholder="e.g. Products That Last"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-slate focus:border-primary focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Changes</span>
                </button>
              </form>

              {/* ABOUT & PHILOSOPHY SECTION EDITOR */}
              <hr className="border-white/10 my-8" />

              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Edit About & Philosophy Section</h2>
                <p className="font-sans text-xs text-slate mt-1">Manage main philosophy headline reveal text and the 3 key stat cards.</p>
              </div>

              <form onSubmit={handleSaveAbout} className="space-y-5 font-sans text-sm">
                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Section Tag/Eyebrow</label>
                  <input
                    type="text"
                    name="aboutEyebrow"
                    defaultValue={data.about.eyebrow}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Philosophy Statement Text (Reveals on scroll)</label>
                  <textarea
                    name="aboutDescription"
                    rows={3}
                    defaultValue={data.about.description}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <label className="block font-mono text-xs text-primary font-bold uppercase tracking-wider">// ABOUT STATS CARDS</label>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Stat Card 1 */}
                  <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-3">
                    <span className="font-mono text-xs text-primary font-bold">Stat Card 1</span>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Header Tag</label>
                      <input
                        type="text"
                        name="stat1Tag"
                        defaultValue={data.about.stats?.[0]?.tag || '// TOTAL DELIVERED'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Value Display</label>
                        <input
                          type="text"
                          name="stat1Val"
                          defaultValue={data.about.stats?.[0]?.value || '40+'}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Count Target</label>
                        <input
                          type="number"
                          name="stat1Target"
                          defaultValue={data.about.stats?.[0]?.targetNum || 40}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Description</label>
                      <textarea
                        name="stat1Desc"
                        rows={2}
                        defaultValue={data.about.stats?.[0]?.description || 'High-impact web apps, platforms & site-builder engines shipped worldwide.'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-3">
                    <span className="font-mono text-xs text-primary font-bold">Stat Card 2</span>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Header Tag</label>
                      <input
                        type="text"
                        name="stat2Tag"
                        defaultValue={data.about.stats?.[1]?.tag || '// CLIENT SATISFACTION'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Value Display</label>
                        <input
                          type="text"
                          name="stat2Val"
                          defaultValue={data.about.stats?.[1]?.value || '98%'}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold text-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Count Target</label>
                        <input
                          type="number"
                          name="stat2Target"
                          defaultValue={data.about.stats?.[1]?.targetNum || 98}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Description</label>
                      <textarea
                        name="stat2Desc"
                        rows={2}
                        defaultValue={data.about.stats?.[1]?.description || 'Long-term partners who rely on DO Company for enterprise engineering.'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-3">
                    <span className="font-mono text-xs text-primary font-bold">Stat Card 3</span>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Header Tag</label>
                      <input
                        type="text"
                        name="stat3Tag"
                        defaultValue={data.about.stats?.[2]?.tag || '// SPEED TO MARKET'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Value Display</label>
                        <input
                          type="text"
                          name="stat3Val"
                          defaultValue={data.about.stats?.[2]?.value || '6 Wk'}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Count Target</label>
                        <input
                          type="number"
                          name="stat3Target"
                          defaultValue={data.about.stats?.[2]?.targetNum || 6}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Description</label>
                      <textarea
                        name="stat3Desc"
                        rows={2}
                        defaultValue={data.about.stats?.[2]?.description || 'Average timeframe from specs sign-off to live production deployment.'}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About & Stats Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: FOUNDER */}
          {activeTab === 'founder' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Edit Founder Section</h2>
                <p className="font-sans text-xs text-slate mt-1">Update founder profile, image, quote, and social details.</p>
              </div>

              <form onSubmit={handleSaveFounder} className="space-y-5 font-sans text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Section Tag/Eyebrow</label>
                    <input
                      type="text"
                      name="eyebrow"
                      defaultValue={data.founder.eyebrow}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Headline Text</label>
                    <input
                      type="text"
                      name="headline"
                      defaultValue={data.founder.headline}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Founder Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={data.founder.name}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Title / Role</label>
                    <input
                      type="text"
                      name="role"
                      defaultValue={data.founder.role}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      defaultValue={data.founder.tagline}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-xs text-primary font-bold uppercase tracking-wider">
                      // FOUNDER PORTRAIT IMAGE
                    </label>
                    <span className="text-[10px] font-mono text-slate">Supports JPG, PNG, WEBP, SVG & Base64</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Local File Upload Section */}
                    <div className="md:col-span-6 flex flex-col gap-2">
                      <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:border-primary transition-all font-mono text-xs font-bold text-center">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFounderImageUpload}
                        />
                      </label>
                      <span className="text-[10px] font-mono text-slate/70 text-center">
                        Upload local image file directly from your computer
                      </span>
                    </div>

                    {/* Optional Image URL Input & Preview */}
                    <div className="md:col-span-6 flex flex-col gap-1">
                      <label className="block font-mono text-[10px] text-slate">Image URL (Optional)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          name="image"
                          value={founderImage}
                          onChange={(e) => setFounderImage(e.target.value)}
                          placeholder="https://... or upload image file"
                          className="flex-1 bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                        />
                        <div className="w-12 h-12 rounded-xl bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-sm shrink-0">
                          {data.founder.name ? data.founder.name.charAt(0) : 'D'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Featured Quote</label>
                  <textarea
                    name="quote"
                    rows={3}
                    defaultValue={data.founder.quote}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none resize-none italic"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Biography / Overview</label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={data.founder.bio}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">GitHub URL</label>
                    <input
                      type="text"
                      name="github"
                      defaultValue={data.founder.github}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      name="linkedin"
                      defaultValue={data.founder.linkedin}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Twitter/X URL</label>
                    <input
                      type="text"
                      name="twitter"
                      defaultValue={data.founder.twitter}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Contribution Note</label>
                  <input
                    type="text"
                    name="contributionNote"
                    defaultValue={data.founder.contributionNote}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Founder Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: MENTORS - Full Width Responsive Grid */}
          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-jakarta text-2xl font-black text-paper">Edit Mentors & Advisors</h2>
                  <p className="font-sans text-xs text-slate mt-1">Add, update, or remove mentors.</p>
                </div>
                <button
                  onClick={() => {
                    addArrayItem('mentors', 'items', {
                      name: 'New Mentor',
                      role: 'Advisor',
                      specialty: 'Engineering & Strategy',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
                      tag: 'Advisor'
                    });
                    showToast('New mentor added!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Mentor</span>
                </button>
              </div>

              {/* Mentors Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.mentors.eyebrow}
                      onChange={(e) => updateSection('mentors', { eyebrow: e.target.value })}
                      placeholder="// MENTORS & ADVISORS"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.mentors.title}
                      onChange={(e) => updateSection('mentors', { title: e.target.value })}
                      placeholder="Guided by industry veterans and seasoned architects."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {data.mentors.items.map((mentor) => (
                  <div key={mentor.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-lg shrink-0">
                          {mentor.name ? mentor.name.charAt(0) : 'M'}
                        </div>
                        <div>
                          <h4 className="font-jakarta font-bold text-base text-paper">{mentor.name}</h4>
                          <span className="font-mono text-xs text-primary">{mentor.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteArrayItem('mentors', 'items', mentor.id);
                          showToast('Mentor deleted.');
                        }}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Name</label>
                        <input
                          type="text"
                          value={mentor.name}
                          onChange={(e) => updateArrayItem('mentors', 'items', mentor.id, { name: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Role / Position</label>
                        <input
                          type="text"
                          value={mentor.role}
                          onChange={(e) => updateArrayItem('mentors', 'items', mentor.id, { role: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Specialty</label>
                        <input
                          type="text"
                          value={mentor.specialty}
                          onChange={(e) => updateArrayItem('mentors', 'items', mentor.id, { specialty: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={mentor.tag}
                          onChange={(e) => updateArrayItem('mentors', 'items', mentor.id, { tag: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-[10px] text-slate font-bold uppercase">
                          Mentor Portrait Image
                        </label>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-mono text-[11px] font-bold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File...</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  updateArrayItem('mentors', 'items', mentor.id, { image: url });
                                }, `Image loaded for ${mentor.name}!`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate/70 mb-1">Or edit Image URL (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={mentor.image}
                            onChange={(e) => updateArrayItem('mentors', 'items', mentor.id, { image: e.target.value })}
                            placeholder="https://... or upload local image file above"
                            className="flex-1 bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                          />
                          <div className="w-9 h-9 rounded-lg bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
                            {mentor.name ? mentor.name.charAt(0) : 'M'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROJECTS - Full Width Grid */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-jakarta text-2xl font-black text-paper">Edit Projects & Work Showcase</h2>
                  <p className="font-sans text-xs text-slate mt-1">Manage work showcase cards, categories, images, and descriptions.</p>
                </div>
                <button
                  onClick={() => {
                    addArrayItem('projects', 'items', {
                      title: 'New Featured Project',
                      category: 'Web App',
                      technologies: 'React, Node.js, TypeScript',
                      image: '/images/placeholder.webp',
                      description: 'Custom high-performance web platform engineered for scale.',
                      link: '#'
                    });
                    showToast('New project added!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.projects.eyebrow}
                      onChange={(e) => updateSection('projects', { eyebrow: e.target.value })}
                      placeholder="// SELECTED WORK"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.projects.title}
                      onChange={(e) => updateSection('projects', { title: e.target.value })}
                      placeholder="Recent projects we've designed, engineered, and shipped."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.projects.items.map((proj) => (
                  <div key={proj.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
                          PROJ
                        </div>
                        <div>
                          <h4 className="font-jakarta font-bold text-base text-paper">{proj.title}</h4>
                          <span className="font-mono text-xs text-primary">{proj.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteArrayItem('projects', 'items', proj.id);
                          showToast('Project deleted.');
                        }}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateArrayItem('projects', 'items', proj.id, { title: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => updateArrayItem('projects', 'items', proj.id, { category: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Year Badge / Tag</label>
                        <input
                          type="text"
                          value={proj.year || '2025'}
                          onChange={(e) => updateArrayItem('projects', 'items', proj.id, { year: e.target.value })}
                          placeholder="2025"
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Case Study Link / URL</label>
                        <input
                          type="text"
                          value={proj.link || '#contact'}
                          onChange={(e) => updateArrayItem('projects', 'items', proj.id, { link: e.target.value })}
                          placeholder="#contact or https://..."
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Technologies Stack</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateArrayItem('projects', 'items', proj.id, { technologies: e.target.value })}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-[10px] text-slate font-bold uppercase">
                          Project Showcase Image
                        </label>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-mono text-[11px] font-bold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File...</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  updateArrayItem('projects', 'items', proj.id, { image: url });
                                }, `Image loaded for ${proj.title}!`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate/70 mb-1">Or edit Image URL / Path (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={proj.image}
                            onChange={(e) => updateArrayItem('projects', 'items', proj.id, { image: e.target.value })}
                            placeholder="https://... or /images/... or upload image file"
                            className="flex-1 bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                          />
                          <div className="w-12 h-8 rounded-lg bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-[10px] shrink-0">
                            PROJ
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateArrayItem('projects', 'items', proj.id, { description: e.target.value })}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none font-sans text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-jakarta text-2xl font-black text-paper">Edit Services & Capabilities</h2>
                  <p className="font-sans text-xs text-slate mt-1">Manage core services offered and section heading.</p>
                </div>
                <button
                  onClick={() => {
                    addArrayItem('services', 'items', {
                      title: 'New Custom Service',
                      description: 'High-performance engineering solutions tailored for scalable enterprise growth.',
                      details: 'Complete end-to-end architecture, development, deployment, and long-term optimization.',
                      tools: ['React', 'TypeScript', 'Node.js', 'AWS']
                    });
                    showToast('New Service added successfully!', false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-ink font-bold text-xs flex items-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Services Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.services.eyebrow}
                      onChange={(e) => updateSection('services', { eyebrow: e.target.value })}
                      placeholder="// SERVICES"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.services.title}
                      onChange={(e) => updateSection('services', { title: e.target.value })}
                      placeholder="Engineering services built for speed, scale, and longevity."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2 pt-2 border-t border-white/10">
                    <label className="block font-mono text-[10px] text-slate font-bold uppercase">Services Background Video (URL or File Upload)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={data.services.videoUrl || ''}
                        onChange={(e) => updateSection('services', { videoUrl: e.target.value })}
                        placeholder="/services-background.mp4 or https://..."
                        className="flex-1 bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                      <label className="cursor-pointer px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-mono text-xs font-bold shrink-0 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (url) => {
                                updateSection('services', { videoUrl: url });
                              }, 'Services background video loaded!');
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Toolkit Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// TECH TOOLKIT SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.toolkit?.eyebrow || '// OUR TOOLKIT'}
                      onChange={(e) => updateSection('toolkit', { eyebrow: e.target.value })}
                      placeholder="// OUR TOOLKIT"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.toolkit?.title || 'Engineered with modern, battle-tested technologies.'}
                      onChange={(e) => updateSection('toolkit', { title: e.target.value })}
                      placeholder="Engineered with modern, battle-tested technologies."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.services.items.map((service) => (
                  <div key={service.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="font-jakarta font-bold text-lg text-paper">{service.title || 'Untitled Service'}</h4>
                      {data.services.items.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete service "${service.title}"?`)) {
                              deleteArrayItem('services', 'items', service.id);
                              showToast(`Deleted service "${service.title}".`, false);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateArrayItem('services', 'items', service.id, { title: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Short Description</label>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => updateArrayItem('services', 'items', service.id, { description: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Detailed Explanation</label>
                        <textarea
                          rows={3}
                          value={service.details}
                          onChange={(e) => updateArrayItem('services', 'items', service.id, { details: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Tools / Technologies (Comma separated)</label>
                        <input
                          type="text"
                          value={service.tools.join(', ')}
                          onChange={(e) =>
                            updateArrayItem('services', 'items', service.id, {
                              tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                            })
                          }
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-jakarta text-2xl font-black text-paper">Edit Engineering Process</h2>
                  <p className="font-sans text-xs text-slate mt-1">Add, update, or remove workflow steps.</p>
                </div>
                <button
                  onClick={() => {
                    const stepNum = String(data.process.steps.length + 1).padStart(2, '0');
                    addArrayItem('process', 'steps', {
                      number: stepNum,
                      title: 'New Process Stage',
                      description: 'Description of the new engineering process step.'
                    });
                    showToast('New process step added!', false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </button>
              </div>

              {/* Process Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.process.eyebrow}
                      onChange={(e) => updateSection('process', { eyebrow: e.target.value })}
                      placeholder="// PROCESS"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.process.title}
                      onChange={(e) => updateSection('process', { title: e.target.value })}
                      placeholder="How we turn ideas into production-ready software."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.process.steps.map((step) => (
                  <div key={step.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text"
                          value={step.number}
                          onChange={(e) => updateArrayItem('process', 'steps', step.id, { number: e.target.value })}
                          className="w-16 bg-black/80 border border-white/15 rounded-lg px-2 py-2 text-primary font-mono font-bold text-center text-sm"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateArrayItem('process', 'steps', step.id, { title: e.target.value })}
                          className="flex-1 bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-jakarta font-bold text-sm"
                        />
                      </div>
                      <button
                        onClick={() => {
                          deleteArrayItem('process', 'steps', step.id);
                          showToast('Process step deleted.', false);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => updateArrayItem('process', 'steps', step.id, { description: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none font-sans text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-jakarta text-2xl font-black text-paper">Edit Testimonials</h2>
                  <p className="font-sans text-xs text-slate mt-1">Manage client testimonials and author portraits.</p>
                </div>
                <button
                  onClick={() => {
                    addArrayItem('testimonials', 'items', {
                      quote: 'Outstanding work and technical expertise. Highly recommended!',
                      author: 'Alex Morgan',
                      role: 'VP Engineering',
                      company: 'NextGen Tech',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
                    });
                    showToast('New testimonial added!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {/* Testimonials Section Header Settings */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="font-jakarta text-lg font-bold text-paper border-b border-white/10 pb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">// SECTION HEADER</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={data.testimonials.eyebrow}
                      onChange={(e) => updateSection('testimonials', { eyebrow: e.target.value })}
                      placeholder="// CLIENT VERDICT"
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Headline Text / Sentence</label>
                    <input
                      type="text"
                      value={data.testimonials.title}
                      onChange={(e) => updateSection('testimonials', { title: e.target.value })}
                      placeholder="Trusted by founders and engineering leaders."
                      className="w-full bg-black/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.testimonials.items.map((test) => (
                  <div key={test.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-sm shrink-0">
                          {test.author ? test.author.charAt(0) : 'T'}
                        </div>
                        <div>
                          <h4 className="font-jakarta font-bold text-sm text-paper">{test.author}</h4>
                          <span className="font-mono text-xs text-primary">{test.role} {test.company ? `@ ${test.company}` : ''}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteArrayItem('testimonials', 'items', test.id);
                          showToast('Testimonial deleted.');
                        }}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate mb-1">Quote</label>
                      <textarea
                        rows={2}
                        value={test.quote}
                        onChange={(e) => updateArrayItem('testimonials', 'items', test.id, { quote: e.target.value })}
                        className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none resize-none font-sans text-xs italic"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Author Name</label>
                        <input
                          type="text"
                          value={test.author}
                          onChange={(e) => updateArrayItem('testimonials', 'items', test.id, { author: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Role</label>
                        <input
                          type="text"
                          value={test.role}
                          onChange={(e) => updateArrayItem('testimonials', 'items', test.id, { role: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate mb-1">Company</label>
                        <input
                          type="text"
                          value={test.company}
                          onChange={(e) => updateArrayItem('testimonials', 'items', test.id, { company: e.target.value })}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Author Portrait Image Upload */}
                    <div className="space-y-2 pt-2 border-t border-white/10 font-sans text-xs">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-[10px] text-slate font-bold uppercase">
                          Author Portrait Image
                        </label>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-mono text-[11px] font-bold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File...</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  updateArrayItem('testimonials', 'items', test.id, { image: url });
                                }, `Portrait image loaded for ${test.author}!`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate/70 mb-1">Or edit Image URL / Path (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={test.image}
                            onChange={(e) => updateArrayItem('testimonials', 'items', test.id, { image: e.target.value })}
                            placeholder="https://... or upload local image file above"
                            className="flex-1 bg-black/80 border border-white/15 rounded-lg px-3 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                          />
                          <div className="w-10 h-10 rounded-full bg-panel border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
                            {test.author ? test.author.charAt(0) : 'T'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CTA & FOOTER */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Edit CTA Banner & Footer</h2>
                <p className="font-sans text-xs text-slate mt-1">Manage global call-to-action and footer contact information.</p>
              </div>

              <form onSubmit={handleSaveCtaFooter} className="space-y-5 font-sans text-sm">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// CTA BANNER</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Section Tag / Eyebrow</label>
                    <input
                      type="text"
                      name="ctaEyebrow"
                      defaultValue={data.cta.eyebrow || "// WHAT'S NEXT"}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Banner Title</label>
                    <input
                      type="text"
                      name="ctaTitle"
                      defaultValue={data.cta.title}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Contact Phone Number</label>
                    <input
                      type="text"
                      name="ctaPhone"
                      defaultValue={data.cta.phone || "+1 (800) 450-BUILD"}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Contact Email</label>
                    <input
                      type="text"
                      name="ctaEmail"
                      defaultValue={data.cta.email || data.footer.email}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Button Text</label>
                    <input
                      type="text"
                      name="ctaButtonText"
                      defaultValue={data.cta.buttonText}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Banner Subtitle</label>
                  <input
                    type="text"
                    name="ctaSubtitle"
                    defaultValue={data.cta.subtitle}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                  />
                </div>

                <hr className="border-white/10 my-4" />
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// FOOTER INFO</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      defaultValue={data.footer.companyName}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Footer Email</label>
                    <input
                      type="text"
                      name="footerEmail"
                      defaultValue={data.footer.email}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Footer Description</label>
                  <textarea
                    name="footerDesc"
                    rows={2}
                    defaultValue={data.footer.description}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name="addressLine1"
                      defaultValue={data.footer.addressLine1}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      defaultValue={data.footer.addressLine2}
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Copyright Text (5 clicks triggers Admin)</label>
                  <input
                    type="text"
                    name="copyrightText"
                    defaultValue={data.footer.copyrightText}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save CTA & Footer Changes</span>
                </button>
              </form>

              {/* Footer Navigation Links Manager */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl mt-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-jakarta text-lg font-bold text-paper flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">// FOOTER NAVIGATION LINKS</span>
                    </h3>
                    <p className="font-sans text-xs text-slate mt-0.5">Manage link titles and section target anchors in the site footer.</p>
                  </div>
                  <button
                    onClick={() => {
                      const navs = data.footer.navLinks || [
                        { id: "nav-1", label: "Services", href: "#services" },
                        { id: "nav-2", label: "Selected Work", href: "#work" },
                        { id: "nav-3", label: "Engineering Process", href: "#process" },
                        { id: "nav-4", label: "Leadership", href: "#founder" },
                        { id: "nav-5", label: "Advisors", href: "#mentors" }
                      ];
                      const newNavs = [...navs, { id: `nav-${Date.now()}`, label: "New Link", href: "#" }];
                      updateSection('footer', { navLinks: newNavs });
                      showToast('New Footer Navigation Link added!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-jakarta font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data.footer.navLinks || [
                    { id: "nav-1", label: "Services", href: "#services" },
                    { id: "nav-2", label: "Selected Work", href: "#work" },
                    { id: "nav-3", label: "Engineering Process", href: "#process" },
                    { id: "nav-4", label: "Leadership", href: "#founder" },
                    { id: "nav-5", label: "Advisors", href: "#mentors" }
                  ]).map((item) => (
                    <div key={item.id} className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block font-mono text-[10px] text-slate mb-1">Label</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const navs = data.footer.navLinks || [];
                              const updated = navs.map((n) => n.id === item.id ? { ...n, label: e.target.value } : n);
                              updateSection('footer', { navLinks: updated });
                            }}
                            className="w-full bg-black/80 border border-white/15 rounded-lg px-2.5 py-1.5 text-paper focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] text-slate mb-1">URL / Anchor Href</label>
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const navs = data.footer.navLinks || [];
                              const updated = navs.map((n) => n.id === item.id ? { ...n, href: e.target.value } : n);
                              updateSection('footer', { navLinks: updated });
                            }}
                            className="w-full bg-black/80 border border-white/15 rounded-lg px-2.5 py-1.5 text-paper focus:border-primary focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const navs = data.footer.navLinks || [];
                          const filtered = navs.filter((n) => n.id !== item.id);
                          updateSection('footer', { navLinks: filtered });
                          showToast('Navigation link deleted.');
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Capabilities Manager */}
              <div className="bg-panel border border-white/15 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-jakarta text-lg font-bold text-paper flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">// FOOTER CAPABILITIES</span>
                    </h3>
                    <p className="font-sans text-xs text-slate mt-0.5">Manage capability tags listed in the footer column.</p>
                  </div>
                  <button
                    onClick={() => {
                      const caps = data.footer.capabilities || [
                        { id: "cap-1", label: "Full-Stack Web Dev" },
                        { id: "cap-2", label: "React Native Apps" },
                        { id: "cap-3", label: "No-Code Builder Tools" },
                        { id: "cap-4", label: "Microservice Architecture" },
                        { id: "cap-5", label: "Performance Auditing" }
                      ];
                      const newCaps = [...caps, { id: `cap-${Date.now()}`, label: "New Capability" }];
                      updateSection('footer', { capabilities: newCaps });
                      showToast('New Capability added!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-jakarta font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Capability</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(data.footer.capabilities || [
                    { id: "cap-1", label: "Full-Stack Web Dev" },
                    { id: "cap-2", label: "React Native Apps" },
                    { id: "cap-3", label: "No-Code Builder Tools" },
                    { id: "cap-4", label: "Microservice Architecture" },
                    { id: "cap-5", label: "Performance Auditing" }
                  ]).map((item) => (
                    <div key={item.id} className="bg-black/60 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                      <div className="flex-1 text-xs">
                        <label className="block font-mono text-[10px] text-slate mb-1">Capability Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const caps = data.footer.capabilities || [];
                            const updated = caps.map((c) => c.id === item.id ? { ...c, label: e.target.value } : c);
                            updateSection('footer', { capabilities: updated });
                          }}
                          className="w-full bg-black/80 border border-white/15 rounded-lg px-2.5 py-1.5 text-paper focus:border-primary focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const caps = data.footer.capabilities || [];
                          const filtered = caps.filter((c) => c.id !== item.id);
                          updateSection('footer', { capabilities: filtered });
                          showToast('Capability deleted.');
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES - Responsive Grid */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Inbox Messages</h2>
                <p className="font-sans text-xs text-slate mt-1">Inquiries submitted by site visitors.</p>
              </div>

              {data.messages.length === 0 ? (
                <div className="bg-black/60 border border-white/15 rounded-2xl p-12 text-center text-slate font-mono text-xs">
                  No messages in your inbox yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.messages.map((msg) => (
                    <div key={msg.id} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-jakarta font-bold text-base text-paper">{msg.name}</h4>
                            <span className="font-mono text-xs text-primary">&lt;{msg.email}&gt;</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate/70">{msg.date}</span>
                        </div>
                        <button
                          onClick={() => {
                            deleteMessage(msg.id);
                            showToast('Message deleted.');
                          }}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {msg.subject && (
                        <div className="font-mono text-xs text-paper font-semibold">
                          Subject: {msg.subject}
                        </div>
                      )}

                      <p className="bg-black/80 border border-white/10 rounded-xl p-3.5 font-sans text-xs text-slate leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SECURITY & SYSTEM */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-jakarta text-2xl font-black text-paper">Security & System Settings</h2>
                <p className="font-sans text-xs text-slate mt-1">Manage admin credentials, audit logs, and data backups.</p>
              </div>

              {/* Credential Update Form (Requires Current/Old Password) */}
              <form onSubmit={handleUpdateCreds} className="bg-black/60 border border-white/15 rounded-3xl p-6 space-y-4 font-sans text-sm">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// CHANGE ADMIN CREDENTIALS</h3>
                <p className="text-slate text-xs">Enter your current password to authorize changing your username or password.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-amber-400 font-bold mb-1">Current Admin Password *</label>
                    <div className="relative">
                      <input
                        type={showCredPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-black/80 border border-amber-500/40 rounded-xl pl-4 pr-10 py-3 text-paper focus:border-amber-400 focus:outline-none font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCredPassword(!showCredPassword)}
                        className="absolute right-3.5 top-3.5 text-slate hover:text-paper transition-colors focus:outline-none"
                      >
                        {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">New Admin Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">New Admin Password *</label>
                    <div className="relative">
                      <input
                        type={showCredPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full bg-black/80 border border-white/15 rounded-xl pl-4 pr-10 py-3 text-paper focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCredPassword(!showCredPassword)}
                        className="absolute right-3.5 top-3.5 text-slate hover:text-paper transition-colors focus:outline-none"
                      >
                        {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showCredPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-black/80 border border-white/15 rounded-xl pl-4 pr-10 py-3 text-paper focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Credentials</span>
                </button>
              </form>

              {/* Recovery Email Management Form (Requires OTP Verification Guard) */}
              <form onSubmit={handleUpdateEmails} className="bg-black/60 border border-white/15 rounded-3xl p-6 space-y-4 font-sans text-sm">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// RECOVERY EMAILS MANAGEMENT</h3>
                <p className="text-slate text-xs">Configure your primary and backup emergency recovery emails. Modifying these settings requires OTP verification.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Primary Recovery Email</label>
                    <input
                      type="email"
                      required
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                      placeholder="bimaljayakumar18@gmail.com"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">Secondary Recovery Email (Optional)</label>
                    <input
                      type="email"
                      value={secondaryEmail}
                      onChange={(e) => setSecondaryEmail(e.target.value)}
                      placeholder="admin.backup@gmail.com"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-panel-light border border-white/20 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <span>Update Recovery Emails (Requires Security OTP)</span>
                </button>
              </form>

              {/* CLOUDINARY MEDIA CDN SETTINGS */}
              <div className="bg-black/60 border border-primary/30 rounded-3xl p-6 space-y-4 font-sans text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// CLOUDINARY MEDIA CDN SETTINGS</h3>
                      <p className="font-sans text-xs text-slate mt-0.5">Upload photos and 4K videos permanently to Cloudinary CDN for instant worldwide streaming on Vercel.</p>
                    </div>
                  </div>
                  {getCloudinaryConfig({ cloudName: cloudinaryCloudName, uploadPreset: cloudinaryUploadPreset }).cloudName ? (
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cloudinary Active</span>
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      Not Configured
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-slate font-bold uppercase mb-1">Cloudinary Cloud Name</label>
                    <input
                      type="text"
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      placeholder="e.g. dxy123abc or from .env"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate font-bold uppercase mb-1">Unsigned Upload Preset</label>
                    <input
                      type="text"
                      value={cloudinaryUploadPreset}
                      onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                      placeholder="e.g. company_preset or ml_default"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      updateSection('cloudinary', {
                        cloudName: cloudinaryCloudName.trim(),
                        uploadPreset: cloudinaryUploadPreset.trim()
                      });
                      showToast('Cloudinary CDN settings saved permanently!', false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary text-ink font-mono text-xs font-bold flex items-center gap-2 cursor-pointer hover:scale-102 transition-all shadow-md shadow-primary/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Cloudinary Settings</span>
                  </button>
                </div>

                <div className="bg-panel-light/60 p-4 rounded-2xl border border-white/10 font-mono text-[11px] text-slate/90 space-y-1.5">
                  <p className="font-bold text-primary">// Free 60-Second Cloudinary Setup (100% Free 25GB Storage & Bandwidth):</p>
                  <p>1. Create a free account at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-primary underline">Cloudinary.com</a>.</p>
                  <p>2. Copy your <strong className="text-paper">Cloud Name</strong> from the dashboard & paste it above.</p>
                  <p>3. Go to Cloudinary Dashboard → Settings ⚙️ → Upload → Scroll down to <strong className="text-paper">Upload presets</strong> → Click <strong className="text-paper">Add upload preset</strong>.</p>
                  <p>4. Set Signing Mode to <strong className="text-emerald-400">Unsigned</strong> → Click Save → Copy Preset Name & paste it above!</p>
                </div>
              </div>

              {/* Data Management, Permanent Baseline & Restore */}
              <div className="bg-black/60 border border-white/15 rounded-3xl p-6 space-y-5 font-sans text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// PERMANENT BASELINE & DATA BACKUP</h3>
                    <p className="font-sans text-xs text-slate mt-1">Lock in all your current edits as permanent defaults or backup/restore site state.</p>
                  </div>
                  {hasPermanentDefaults && (
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Custom Permanent Defaults Locked</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Set Current Details as Permanent Defaults */}
                  <button
                    onClick={() => {
                      if (window.confirm("Lock all current site details (custom copy, uploaded images, video URLs, and project items) as your new Permanent Default baseline?")) {
                        setAsPermanentDefaults();
                        addAuditLog("PERMANENT_DEFAULTS_SAVED", "Saved current site state as Permanent Defaults baseline");
                        showToast("All current site details locked as Permanent Defaults!");
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-primary text-ink font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20 hover:scale-102"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Set Current Details as Permanent Defaults</span>
                  </button>

                  {/* Reset to Permanent Defaults */}
                  <button
                    onClick={() => {
                      if (window.confirm("Reset all site data back to your saved Permanent Defaults?")) {
                        resetToDefaults();
                        showToast("Site data reset to your saved Permanent Defaults.");
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-panel-light border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span>Reset to Permanent Defaults</span>
                  </button>

                  {/* Download Backup JSON */}
                  <button
                    onClick={handleExportData}
                    className="px-5 py-3 rounded-xl bg-panel-light border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-primary" />
                    <span>Download Backup JSON</span>
                  </button>

                  {/* Restore Factory Original Code Template */}
                  <button
                    onClick={() => {
                      if (window.confirm("WARNING: This will clear your custom Permanent Defaults and revert to the factory original code template. Proceed?")) {
                        resetToFactoryDefaults();
                        showToast("Site reset to factory original code template.");
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restore Factory Original</span>
                  </button>
                </div>

                {/* Import JSON */}
                <form onSubmit={handleImportData} className="pt-4 border-t border-white/10 space-y-3">
                  <label className="block font-mono text-xs text-slate">Import Backup JSON String</label>
                  <textarea
                    rows={3}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste JSON string here..."
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs resize-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-panel-light border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Import JSON Data</span>
                  </button>
                </form>
              </div>

              {/* Security Audit Logs */}
              <div className="bg-black/60 border border-white/15 rounded-3xl p-6 space-y-4">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// SECURITY AUDIT LOGS</h3>
                <div className="max-h-64 overflow-y-auto space-y-2 font-mono text-xs pr-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.status === 'SUCCESS' ? 'bg-emerald-400' : log.status === 'FAILED' ? 'bg-red-400' : 'bg-amber-400'
                          }`}
                        />
                        <span className="font-bold text-paper">{log.action}:</span>
                        <span className="text-slate">{log.details}</span>
                      </div>
                      <span className="text-slate/60 text-[10px] shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
      {/* SECURITY OTP GUARD MODAL FOR RECOVERY EMAIL CHANGES */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-panel border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-2">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-jakarta font-black text-xl text-paper">Security Verification Guard</h3>
              <p className="font-sans text-xs text-slate">
                To update your recovery email addresses, please enter the 6-Digit OTP sent to your current registered email ({adminEmails.primaryEmail}).
              </p>
            </div>

            {emailOtpNotice && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 font-mono text-xs text-primary text-center">
                {emailOtpNotice}
              </div>
            )}

            {emailOtpError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-400 text-center">
                {emailOtpError}
              </div>
            )}

            <form onSubmit={handleConfirmEmailOtpUpdate} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate mb-1">Enter 6-Digit Security OTP *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={emailOtpCode}
                  onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full bg-black/80 border border-primary/50 rounded-xl px-4 py-3 text-paper font-mono text-xs tracking-widest text-center focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailOtpModal(false);
                    setEmailOtpCode('');
                    setEmailOtpError(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-black/60 border border-white/15 text-slate hover:text-paper font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-500 text-paper font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-ink transition-all shadow-lg shadow-red-500/20"
                >
                  Authorize Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Upload Progress Overlay */}
      {isUploadingMedia && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[10000] flex flex-col items-center justify-center text-center p-6 select-none">
          <div className="w-16 h-16 rounded-2xl bg-panel border-2 border-primary flex items-center justify-center text-primary shadow-2xl shadow-primary/20 animate-bounce mb-4">
            <Cloud className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-jakarta font-black text-xl text-paper mb-2">Uploading to Cloudinary CDN...</h3>
          <p className="font-mono text-xs text-primary mb-4">{uploadProgressText}</p>
          <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
