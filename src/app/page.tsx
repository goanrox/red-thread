'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  User,
  Map as MapIcon,
  Fingerprint,
  Hash,
  Activity,
  Shield,
} from 'lucide-react';
import { generateHeroImage } from '@/lib/gemini';

export default function Page() {
  const router = useRouter();
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSubheadlineIndex((prev) => (prev + 1) % subheadlines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [subheadlines.length]);

  useEffect(() => {
    async function init() {
      const img = await generateHeroImage();
      if (img) setBgImage(img);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-[#141414] text-white selection:bg-red-600/30">
      <div className="grain-overlay" />

      <AnimatePresence>
        {bgImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4 }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 10 }}
              src={bgImage}
              alt=""
              className="h-full w-full object-cover opacity-20 grayscale animate-ambient-float"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/95 via-[#141414]/30 to-[#141414]/98" />
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]"
            />
            <div className="absolute inset-0 opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-ambient-float" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute"
          style={{
            background: "radial-gradient(ellipse, rgba(229, 9, 20, 0.05) 0%, transparent 65%)",
            width: "700px", height: "350px",
            bottom: "20%", left: "50%", transform: "translateX(-50%)",
          }}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#141414]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div className="h-[0.5px] w-24 bg-white/20 mb-8" />
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/40">
              Initializing Archives
            </motion.span>
          </motion.div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-24 transition-all duration-700 ${
        isScrolled ? 'py-6 bg-rgba(20,20,20,0.97) backdrop-blur-2xl border-b border-white/10 shadow-2xl' : 'py-10 bg-transparent'
      }`}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 1.2 }} className="flex items-center gap-3 group cursor-pointer">
          <div className="h-[0.5px] w-8 bg-[#E50914] transition-all duration-500 group-hover:w-12" />
          <span className="text-sm font-bold tracking-[0.3em] text-white group-hover:text-[#E50914] transition-colors">RED THREAD</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-12 text-[9px] font-bold tracking-[0.4em] uppercase text-white/60">
          <NavLink label="The Manor" href="/about" />
          <NavLink label="Case Files" href="/cases" />
          <NavLink label="Evidence" href="/cases/thornwood/evidence" />
          <motion.button onClick={() => router.push('/profile')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 border border-white/30 rounded-[4px] text-white tracking-[0.4em] flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
            <Lock size={10} /> Portal
          </motion.button>
        </div>

        <button className="md:hidden text-white/40" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.8 }} className="max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[0.5px] w-10 bg-white/20" />
            <span className="text-[9px] font-bold tracking-[0.65em] uppercase text-white/50">
              Season One · Case One
            </span>
            <div className="h-[0.5px] w-10 bg-white/20" />
          </div>

          {/* Title */}
          <h1
            className="font-bold mb-5 tracking-tight leading-[1.05]"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 9rem)",
              color: "#fff",
            }}
          >
            Red Thread
          </h1>

          {/* Cycling tagline */}
          <div className="h-10 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={subheadlines[subheadlineIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 1.0 }}
                className="text-lg md:text-2xl font-bold"
                style={{ color: "#e5e5e5" }}
              >
                {subheadlines[subheadlineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Body copy */}
          <p className="max-w-lg mx-auto text-sm text-white/45 leading-relaxed font-normal tracking-wide mb-14">
            The premium narrative mystery platform. Investigate with discipline. Accuse with conviction.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/cases">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group text-black rounded-[4px] font-bold tracking-[0.25em] text-[9px] uppercase flex items-center gap-2.5 shadow-2xl cursor-pointer px-10 py-4 bg-white hover:bg-white/90 transition-colors"
              >
                Begin Investigation
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-400" />
              </motion.div>
            </Link>
            <Link href="/cases/thornwood">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 border rounded-[4px] font-bold tracking-[0.25em] text-[9px] uppercase shadow-xl cursor-pointer transition-all duration-400"
                style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#e5e5e5" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(255,255,255,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "#e5e5e5";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Enter Case File
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[7px] uppercase tracking-[0.6em] text-white/20">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1 h-1 rotate-45 border-b border-r border-white/20" />
          </motion.div>
        </motion.div>
      </main>

      <section className="relative z-10 px-8 md:px-24 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32 relative">
            <SectionHeader label="01" title="Current Case" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }} className="lg:col-span-8 rounded-[4px] p-10 overflow-hidden bg-[#1a1a1a] border border-white/10">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold">Archive Reference: RT-882-B</span>
                        <div className="h-1 w-1 rounded-full bg-white/30" />
                        <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Classified Evidence</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white">The Blackwood Inheritance</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-1.5 border border-white/20 rounded-full bg-white/5">
                        <span className="text-[9px] uppercase tracking-widest text-white/70 font-bold flex items-center gap-2"><Activity size={10} /> Investigation Active</span>
                      </div>
                      <span className="text-[10px] text-white/50">Updated: 14:22 GMT</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <MetadataItem label="Location" value="Blackwood Manor" icon={<MapIcon size={10} />} />
                    <MetadataItem label="Lead Agent" value="E. Thorne" icon={<User size={10} />} />
                    <MetadataItem label="Access" value="Restricted" icon={<Shield size={10} />} />
                    <MetadataItem label="Surveillance" value="Active" icon={<Activity size={10} />} />
                  </div>
                  <div className="h-[0.5px] bg-white/10 mb-10" />
                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-[0.5px] bg-white/20" />
                        <p className="text-sm text-white/80 leading-relaxed font-normal tracking-wide mb-8 pl-6">
                          &ldquo;The ledger found in the library suggests a third party was involved in the transfer of assets. The ink is still fresh on the signatures that shouldn&apos;t exist.&rdquo;
                        </p>
                      </div>
                      <Link href="/cases/thornwood" className="text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors flex items-center gap-2 group font-bold">
                        Access Restricted Archives <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <div className="w-full md:w-64 flex flex-col gap-4">
                      <div className="w-full h-48 rounded-[4px] overflow-hidden border border-white/10 relative bg-[#0f0f0f] group shadow-lg">
                        <img src="https://picsum.photos/seed/ledger/400/300?grayscale" alt="Evidence" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-white/60 font-bold">Evidence ID: EV-204-X</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }} className="lg:col-span-4 flex flex-col gap-8">
                <div className="rounded-[4px] p-8 flex-1 relative overflow-hidden bg-[#1a1a1a] border border-white/10">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold">Evidence Archive</span>
                      <Hash size={10} className="text-white/20" />
                    </div>
                    <div className="space-y-6">
                      <EvidenceSnippet title="Evidence ID: EV-102-P" meta="Torn Photograph · Oct 12" thumb="https://picsum.photos/seed/photo/100/100?grayscale" />
                      <EvidenceSnippet title="Evidence ID: EV-104-K" meta="Brass Key #4 · Oct 14" thumb="https://picsum.photos/seed/key/100/100?grayscale" />
                    </div>
                    <Link href="/cases/thornwood/evidence" className="block w-full mt-10 py-3 border border-white/10 rounded-[4px] text-[8px] uppercase tracking-[0.4em] text-white/40 hover:text-white hover:bg-white/5 transition-all text-center">Access Full Archive</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="mb-32 relative">
            <SectionHeader label="02" title="Persons of Interest" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <SuspectCard initials="JB" name="Julian Blackwood" role="Primary heir" age="34" location="London" risk="High" dossierNo="RT-882-01" status="Surveillance Active" relation="Direct Beneficiary" href="/cases/thornwood/interrogate/julian-blackwood" />
              <SuspectCard initials="EV" name="Eleanor Vance" role="Archive access" age="29" location="Unknown" risk="Medium" dossierNo="RT-882-02" status="Location Unknown" relation="Key Witness" href="/cases/thornwood/interrogate/eleanor-vance" />
              <SuspectCard initials="AS" name="Arthur Sterling" role="Financial manager" age="62" location="Blackwood" risk="Low" dossierNo="RT-882-03" status="Under Review" relation="Asset Manager" href="/cases/thornwood/interrogate/arthur-sterling" />
              <SuspectCard initials="MT" name="Marcus Thorne" role="Security" age="45" location="Blackwood" risk="High" dossierNo="RT-882-04" status="Surveillance Active" relation="Security Clearance" href="/cases/thornwood/interrogate/marcus-thorne" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <SectionHeader label="03" title="Timeline of Events" />
              <div className="space-y-2 relative">
                <div className="absolute left-[58px] top-0 bottom-0 w-[0.5px] bg-white/10" />
                <TimelineItem time="22:14" date="15 OCT" event="Motion detected in North Gallery. Security logs bypassed." />
                <TimelineItem time="18:30" date="15 OCT" event="Interview with A. Sterling concluded. Testimony inconsistent." />
              </div>
            </div>
            <div className="lg:col-span-5">
              <SectionHeader label="04" title="Estate Map" />
              <div className="rounded-[4px] h-[420px] relative group overflow-hidden bg-[#1a1a1a] border border-white/10 shadow-2xl">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="h-4 w-4 bg-[#E50914] rounded-full relative z-10 border-2 border-white shadow-lg" />
                    <div className="h-8 w-8 bg-[#E50914] rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-20" />
                  </div>
                </div>
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-white/60 font-bold">Tactical Overlay v2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-10 right-10 flex items-center gap-4 z-30">
        <div className="relative h-1.5 w-1.5">
          <div className="absolute inset-0 bg-red-900 rounded-full opacity-40 animate-pulse" />
          <div className="absolute inset-0 bg-[#E50914] rounded-full scale-50" />
        </div>
        <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/20">Signal Active</span>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="fixed top-0 left-1/2 -translate-x-1/2 w-[0.5px] h-20 bg-gradient-to-b from-white/20 to-transparent z-20" />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[0.5px] h-20 bg-gradient-to-t from-white/20 to-transparent z-20" />

      <div className="fixed top-8 left-8 h-4 w-4 border-t border-l border-white/10 pointer-events-none z-20" />
      <div className="fixed top-8 right-8 h-4 w-4 border-t border-r border-white/10 pointer-events-none z-20" />
      <div className="fixed bottom-8 left-8 h-4 w-4 border-b border-l border-white/10 pointer-events-none z-20" />
      <div className="fixed bottom-8 right-8 h-4 w-4 border-b border-r border-white/10 pointer-events-none z-20" />
    </div>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <motion.span whileHover={{ y: -1 }} className="hover:text-[#E50914] transition-all duration-500 relative group inline-block cursor-pointer">
        {label}
        <motion.span initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.5 }} className="absolute -bottom-2 left-0 h-[0.5px] bg-[#E50914]" />
      </motion.span>
    </Link>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mb-16 relative">
      <div className="flex items-center gap-6 mb-4">
        <motion.span initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-[10px] font-bold tracking-[0.6em] text-[#E50914] block">{label}</motion.span>
        <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 0.2, duration: 1.5 }} className="h-[0.5px] flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
      </div>
      <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
    </motion.div>
  );
}

function MetadataItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><span className="text-white/60">{icon}</span><span className="text-[9px] uppercase tracking-widest text-white/60 font-bold">{label}</span></div>
      <span className="text-[11px] text-white/70 font-normal tracking-wide pl-5">{value}</span>
    </div>
  );
}

function EvidenceSnippet({ title, meta, thumb }: { title: string; meta: string; thumb?: string }) {
  return (
    <motion.div whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }} className="flex items-center gap-5 group cursor-pointer border-b border-white/10 pb-6 last:border-0 p-4 -mx-4 rounded-[4px] transition-all duration-500">
      {thumb && (
        <div className="h-20 w-20 rounded-[4px] overflow-hidden border border-white/20 flex-shrink-0 bg-[#0f0f0f] shadow-lg relative">
          <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.8 }} src={thumb} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors duration-500">{title}</span>
        <span className="text-white/50 text-[10px]">{meta}</span>
      </div>
      <ArrowUpRight size={16} className="text-white/30 group-hover:text-[#E50914] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
    </motion.div>
  );
}

function SuspectCard({ initials, name, role, age, location, risk, dossierNo, status, relation, href }: {
  initials: string; name: string; role: string; age: string; location: string;
  risk: string; dossierNo: string; status: string; relation: string; href: string;
}) {
  return (
    <Link href={href}>
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className="rounded-[4px] p-8 group overflow-hidden cursor-pointer bg-[#1a1a1a] border border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] uppercase tracking-widest text-white/40 font-mono">{dossierNo}</span>
            <div className="h-12 w-12 rounded-full bg-[#E50914]/20 text-white text-lg shadow-inner font-bold flex items-center justify-center border border-[#E50914]/30">{initials}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-2 py-0.5 border rounded-[4px] ${risk === 'High' ? 'border-red-600/30 text-red-500/60 bg-red-900/10' : 'border-white/20 text-white/40 bg-white/5'}`}>
              <span className="text-[7px] uppercase tracking-widest">{risk} Risk</span>
            </div>
            <span className="text-[7px] uppercase tracking-widest text-white/30">{status}</span>
          </div>
        </div>
        <div className="mb-8">
          <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold">{role}</span>
          <h4 className="text-2xl font-bold text-white group-hover:text-[#E50914] transition-colors duration-500 leading-tight">{name}</h4>
          <span className="text-[10px] uppercase tracking-widest text-white/50 mt-2 block font-bold opacity-60">{relation}</span>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col gap-1.5"><span className="text-[8px] uppercase tracking-widest text-white/60 font-bold">Age</span><span className="text-[11px] text-white/70">{age}</span></div>
          <div className="flex flex-col gap-1.5"><span className="text-[8px] uppercase tracking-widest text-white/60 font-bold">Location</span><span className="text-[11px] text-white/70">{location}</span></div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

function TimelineItem({ time, date, event }: { time: string; date: string; event: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex gap-8 p-6 rounded-[4px] transition-all duration-700 group relative border border-transparent hover:border-white/10 cursor-pointer"
    >
      <div className="flex flex-col items-end min-w-[60px] gap-1.5 z-10">
        <span className="text-[11px] text-[#E50914] font-bold font-mono">{time}</span>
        <span className="text-[9px] text-white/40 tracking-widest font-bold">{date}</span>
      </div>
      <div className="relative z-10 mt-2">
        <div className="h-2 w-2 rounded-full bg-white/30 group-hover:bg-[#E50914] transition-all duration-500 border border-[#1a1a1a] shadow-sm" />
      </div>
      <div className="flex-1 z-10"><p className="text-xs text-white/80 font-normal leading-relaxed">{event}</p></div>
    </motion.div>
  );
}
