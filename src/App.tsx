/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Eye, 
  Lock, 
  ChevronRight, 
  Loader2, 
  Menu, 
  X, 
  ArrowUpRight,
  User,
  FileText,
  Map as MapIcon,
  Clock,
  AlertCircle,
  Fingerprint,
  Search,
  Hash,
  Activity,
  Shield,
  Layers
} from 'lucide-react';
import { generateHeroImage } from './services/gemini';

export default function App() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [subheadlineIndex, setSubheadlineIndex] = useState(0);
  const subheadlines = [
    "Every suspect has a secret.",
    "Only the truth ends it.",
    "Every clue tells a story.",
    "Some cases never stay buried.",
    "The truth hides in plain sight.",
    "Every alibi leaves a trace."
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSubheadlineIndex((prev) => (prev + 1) % subheadlines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function init() {
      const img = await generateHeroImage();
      if (img) {
        setBgImage(img);
      }
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-[#050505] text-ivory selection:bg-brass/30">
      {/* Global Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Background Layer: Atmospheric Depth */}
      <AnimatePresence>
        {bgImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 10, ease: "easeOut" }}
              src={bgImage}
              alt="Cinematic Mystery Background"
              className="h-full w-full object-cover opacity-30 grayscale animate-ambient-float"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/40 to-black/95" />
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" 
            />
            
            {/* Subtle Manor Silhouette / Fog */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-ambient-float" />
            
            {/* Blueprint Lines Overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none blueprint-grid" />
            
            {/* Fog Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="h-[0.5px] w-24 bg-brass/30 mb-8" />
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[9px] font-display tracking-[0.6em] uppercase text-brass/50"
            >
              Initializing Archives
            </motion.span>
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-24 transition-all duration-700 ease-[0.16,1,0.3,1] ${
        isScrolled ? 'py-6 bg-black/40 backdrop-blur-2xl border-b border-brass/10 shadow-2xl' : 'py-10 bg-transparent'
      }`}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="h-[0.5px] w-8 bg-brass transition-all duration-500 group-hover:w-12" />
          <span className="text-sm font-serif italic tracking-[0.3em] text-ivory group-hover:text-brass transition-colors duration-500">
            Red Thread
          </span>
        </motion.div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12 text-[9px] font-display tracking-[0.4em] uppercase text-ivory/60">
          <NavLink label="The Manor" />
          <NavLink label="Case Files" />
          <NavLink label="Evidence" />
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-brass/30 rounded-sm transition-all duration-500 text-brass tracking-[0.4em] flex items-center gap-2"
          >
            <Lock size={10} />
            Portal
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-brass/40"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {['The Manor', 'Case Files', 'Evidence', 'Portal'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ x: 10 }}
                className="text-[11px] font-display tracking-[0.5em] uppercase text-ivory/60 hover:text-brass transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="flex items-center justify-center gap-4 mb-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="h-[0.5px] bg-brass/40" 
            />
            <span className="text-[10px] font-display tracking-[0.6em] uppercase text-brass block">
              Archive Access Granted
            </span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="h-[0.5px] bg-brass/40" 
            />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic mb-4 tracking-tight leading-[1.1] text-ivory">
            Red Thread
          </h1>
          
          <div className="h-12 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={subheadlines[subheadlineIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl md:text-2xl font-serif italic text-gold-rich"
              >
                {subheadlines[subheadlineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-ivory/60 leading-relaxed font-light tracking-wide mb-12">
            The premium narrative mystery platform. Investigate with discipline. Accuse with conviction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-12 py-4 gold-button-gradient text-black rounded-sm font-medium transition-all tracking-widest text-[10px] uppercase flex items-center gap-2 shadow-2xl"
            >
              Begin Investigation
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border border-brass/30 bg-white/5 rounded-sm font-medium text-brass hover:text-ivory transition-all tracking-widest text-[10px] uppercase shadow-xl"
            >
              Enter Case File
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] uppercase tracking-[0.5em] text-brass/30">Scroll to Explore</span>
          <div className="h-12 w-[0.5px] bg-gradient-to-b from-brass/40 to-transparent" />
        </motion.div>
      </main>

      {/* Dashboard / Detective Board Section */}
      <section className="relative z-10 py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 mb-16"
          >
            <div className="h-[0.5px] w-12 bg-brass/40" />
            <span className="text-[9px] font-display tracking-[0.5em] uppercase text-brass/60">Active Investigation</span>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Main Case File - Large */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 dossier-card rounded-sm p-8 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="label-brass mb-2">Case File</div>
                  <h2 className="text-2xl font-serif italic text-ivory">The Ashford Conspiracy</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse-soft w-1.5 h-1.5 rounded-full bg-red-500/80" />
                  <span className="metadata-text">ACTIVE</span>
                </div>
              </div>
              
              <div className="gold-divider my-4" />
              
              <p className="text-ivory/50 text-sm leading-relaxed mb-6 font-light">
                "The ledger found in the library suggests a third party was involved in the transfer of assets. The ink is still fresh on the signatures that shouldn't exist. We need to cross-reference the handwriting with the Vance files."
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: User, label: "Suspects", value: "7" },
                  { icon: FileText, label: "Evidence", value: "23" },
                  { icon: MapIcon, label: "Locations", value: "4" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon size={16} className="text-brass/40 mx-auto mb-2" />
                    <div className="text-xl font-serif text-ivory">{value}</div>
                    <div className="metadata-text mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-brass/50 group-hover:text-brass transition-colors duration-500">
                <span className="text-[9px] font-display tracking-[0.4em] uppercase">Open Dossier</span>
                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-500" />
              </div>
            </motion.div>

            {/* Status Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="dossier-card rounded-sm p-6"
            >
              <div className="label-brass mb-4">Investigation Status</div>
              
              <div className="space-y-4">
                {[
                  { label: "Evidence Collected", value: 72, color: "bg-brass" },
                  { label: "Suspects Cleared", value: 43, color: "bg-ivory/30" },
                  { label: "Case Confidence", value: 61, color: "bg-brass/60" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="metadata-text">{label}</span>
                      <span className="metadata-text">{value}%</span>
                    </div>
                    <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="gold-divider my-6" />

              <div className="flex items-center gap-3">
                <Clock size={14} className="text-brass/40" />
                <span className="metadata-text">Last updated 2h ago</span>
              </div>
            </motion.div>

            {/* Suspect Cards Row */}
            {[
              { name: "E. Ashford", role: "Patriarch", status: "PRIME", monogram: "EA" },
              { name: "V. Crane", role: "Solicitor", status: "WATCH", monogram: "VC" },
              { name: "M. Holloway", role: "Housekeeper", status: "CLEAR", monogram: "MH" },
            ].map((suspect, i) => (
              <motion.div
                key={suspect.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="dossier-card rounded-sm p-5 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="monogram-circle w-10 h-10 rounded-sm flex-shrink-0">
                    <span className="text-sm">{suspect.monogram}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-serif text-ivory truncate">{suspect.name}</div>
                        <div className="metadata-text mt-0.5">{suspect.role}</div>
                      </div>
                      <span className={`text-[7px] font-display tracking-[0.3em] px-2 py-0.5 rounded-sm border flex-shrink-0 ${
                        suspect.status === 'PRIME' ? 'border-red-500/30 text-red-400/70' :
                        suspect.status === 'WATCH' ? 'border-brass/30 text-brass/70' :
                        'border-ivory/10 text-ivory/30'
                      }`}>{suspect.status}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Evidence Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 dossier-card rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="label-brass">Evidence Log</div>
                <Search size={14} className="text-brass/30" />
              </div>

              <div className="space-y-3">
                {[
                  { id: "EV-001", title: "Monogrammed Handkerchief", type: "Physical", location: "Library", time: "11:42 PM" },
                  { id: "EV-002", title: "Torn Letter Fragment", type: "Document", location: "Study", time: "11:51 PM" },
                  { id: "EV-003", title: "Modified Account Ledger", type: "Financial", location: "Safe", time: "12:03 AM" },
                  { id: "EV-004", title: "Overheard Conversation", type: "Testimony", location: "Corridor", time: "12:17 AM" },
                ].map((ev) => (
                  <div key={ev.id} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0 group cursor-pointer">
                    <span className="metadata-text w-16 flex-shrink-0 font-display">{ev.id}</span>
                    <span className="text-xs text-ivory/60 flex-1 group-hover:text-ivory transition-colors duration-300">{ev.title}</span>
                    <span className="metadata-text hidden md:block w-20 flex-shrink-0">{ev.type}</span>
                    <span className="metadata-text hidden md:block w-16 flex-shrink-0">{ev.location}</span>
                    <span className="metadata-text w-16 flex-shrink-0 text-right">{ev.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Intel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="dossier-card rounded-sm p-6"
            >
              <div className="label-brass mb-4">Quick Intel</div>
              <div className="space-y-3">
                {[
                  { icon: AlertCircle, text: "New witness emerged", time: "Now" },
                  { icon: Fingerprint, text: "Prints matched", time: "1h" },
                  { icon: Eye, text: "Alibi disputed", time: "3h" },
                  { icon: Hash, text: "Code deciphered", time: "5h" },
                ].map(({ icon: Icon, text, time }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={12} className="text-brass/40 flex-shrink-0" />
                    <span className="text-xs text-ivory/50 flex-1">{text}</span>
                    <span className="metadata-text">{time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 md:px-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 mb-16"
          >
            <div className="h-[0.5px] w-12 bg-brass/40" />
            <span className="text-[9px] font-display tracking-[0.5em] uppercase text-brass/60">The Experience</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: BookOpen,
                title: "Narrative Engine",
                description: "AI-woven stories that adapt to every deduction you make.",
              },
              {
                icon: Layers,
                title: "Evidence Layers",
                description: "Physical, digital, and testimonial clues woven into each case.",
              },
              {
                icon: Activity,
                title: "Live Case Feed",
                description: "Developments unfold in real time as the investigation deepens.",
              },
              {
                icon: Shield,
                title: "Sealed Archives",
                description: "Premium access to the most complex and prestigious cases.",
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="dossier-card rounded-sm p-6 group cursor-pointer"
              >
                <Icon size={18} className="text-brass/50 mb-4 group-hover:text-brass transition-colors duration-500" />
                <h3 className="text-sm font-serif italic text-ivory mb-2">{title}</h3>
                <p className="text-xs text-ivory/40 leading-relaxed font-light">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 text-center border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="h-[0.5px] w-12 bg-brass/20 mx-auto mb-12" />
          <h2 className="text-3xl md:text-5xl font-serif italic text-ivory mb-6 leading-tight">
            The truth is waiting.
          </h2>
          <p className="text-sm text-ivory/40 mb-12 font-light leading-relaxed">
            Every case is a carefully crafted world. Every clue, intentional. Every suspect, hiding something.
          </p>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group px-16 py-5 gold-button-gradient text-black rounded-sm font-medium transition-all tracking-widest text-[10px] uppercase inline-flex items-center gap-3 shadow-2xl"
          >
            Begin Your First Case
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 md:px-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-[0.5px] w-6 bg-brass/30" />
            <span className="text-xs font-serif italic text-ivory/30">Red Thread</span>
          </div>
          <div className="flex items-center gap-8 text-[8px] font-display tracking-[0.3em] uppercase text-ivory/20">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
          <span className="metadata-text">© 2025 Red Thread. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

function NavLink({ label }: { label: string }) {
  return (
    <motion.button
      whileHover={{ color: "#d4af37" }}
      className="transition-colors duration-300 hover:tracking-[0.5em] cursor-pointer"
    >
      {label}
    </motion.button>
  );
}

function DossierCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`dossier-card rounded-sm ${className}`}
    >
      {children}
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
}
