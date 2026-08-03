import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useSiteData } from '../context/DataContext';
import { MatrixTitle } from './MatrixTitle';

export const CTABanner: React.FC = () => {
  const { data, addMessage } = useSiteData();
  const { cta, footer } = data;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    addMessage({
      name: formData.name,
      email: formData.email,
      subject: `Project Request: ${formData.service || 'General Inquiry'}`,
      message: formData.message
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', service: '', message: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-black relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 shadow-2xl overflow-hidden animate-conic-glow">
          <div className="rounded-[22px] bg-panel p-8 sm:p-14 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>{cta.eyebrow || "// WHAT'S NEXT"}</span>
              </div>

              <MatrixTitle title={cta.title || "WHAT'S NEXT?"} />

              <p className="text-slate text-base sm:text-lg leading-relaxed">
                {cta.subtitle}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 w-full">
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{cta.email || footer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{cta.phone || (footer as any).phone || "+1 (800) 450-BUILD"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{footer.addressLine1}, {footer.addressLine2}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-panel-light border border-primary/40 text-center flex flex-col items-center gap-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-primary animate-bounce" />
                  <h3 className="font-jakarta font-black text-2xl text-paper">
                    Project Request Received!
                  </h3>
                  <p className="text-slate text-sm">
                    Thank you! Our lead technical architect will review your details and respond within 24 business hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 bg-black/60 p-6 sm:p-8 rounded-2xl border border-white/10">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">WORK EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">PROJECT TYPE</label>
                    <input
                      type="text"
                      placeholder="e.g. Website Development, Web App..."
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">PROJECT DETAILS</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly describe your goals, budget, or timelines..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton strength={15} className="w-full">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-sm tracking-wide hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>{cta.buttonText || "Send Project Request"}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
