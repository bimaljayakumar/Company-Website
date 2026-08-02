import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { addMessage } = useSiteData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    addMessage({ name, email, subject, message });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-panel border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-black/50 text-slate hover:text-paper hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
                // CONTACT US
              </span>
              <h3 className="font-jakarta text-2xl font-black text-paper mt-1">
                Start a Conversation
              </h3>
              <p className="font-sans text-xs text-slate mt-1">
                Send us a message and our lead engineering architect will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-jakarta font-black text-xl text-paper">Message Sent!</h4>
                <p className="font-sans text-xs text-slate max-w-xs">
                  Thank you for reaching out. We have received your inquiry.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Web Development Inquiry"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate mb-1">Project Details / Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project requirements..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-paper focus:outline-none focus:border-primary transition-colors placeholder:text-slate/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-sm hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
