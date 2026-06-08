import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Languages, MapPin, Search, Zap, ArrowLeft, DollarSign, CheckCircle } from "lucide-react";
import { themeColors, cardVariants, STARS } from "../config/theme";
import GTXLogo from "../components/GTXLogo";
import FeatureCard from "../components/FeatureCard";

function HomeView({ setView, onFastApply, jobs = [], currentUser = null, onViewDetails }) {
  const isPlaying = React.useRef(false);
  const hasPlayedOnce = React.useRef(false);

  const featuredJobs = jobs
    .filter(j => !j.isHidden)
    .filter(j => {
      if (!currentUser || currentUser.language === "all") return true;
      const userLang = currentUser.language?.toLowerCase().trim();
      const jobLang = j.language?.toLowerCase().trim();
      return jobLang && jobLang.includes(userLang);
    })
    .slice(0, 3);

  useEffect(() => {
    const playAudio = () => {
      if (isPlaying.current || hasPlayedOnce.current) return;
      const audio = new Audio(process.env.PUBLIC_URL + "/welcome.mp3");
      audio.volume = 0.7;
      audio.onplay  = () => { isPlaying.current = true; hasPlayedOnce.current = true; };
      audio.onended = () => { isPlaying.current = false; };
      audio.onerror = () => { isPlaying.current = false; };
      audio.play().catch(() => {});
    };
    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, []);

  return (
    <div className="space-y-14 text-center w-full">

      {/* ── Hero ── */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden w-screen border-b border-white/5"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-2rem",
          minHeight: "88vh",
          background: "radial-gradient(ellipse at 50% 0%, rgba(100,60,255,0.20) 0%, transparent 60%), radial-gradient(ellipse at 80% 85%, rgba(0,180,255,0.14) 0%, transparent 50%), radial-gradient(ellipse at 15% 70%, rgba(150,50,255,0.12) 0%, transparent 50%)",
        }}
      >
        {/* Star particles */}
        {STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top, opacity: 0.25 }}
            animate={{ opacity: [0.15, 0.75, 0.15], scale: [1, 1.6, 1] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Slow-rotating orbital rings (background accent) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="rounded-full border border-[#4466ff]/8"
            style={{ width: 700, height: 700, position: "absolute" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="rounded-full border border-[#9933ff]/8"
            style={{ width: 480, height: 480, position: "absolute" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="rounded-full border border-[#00ccff]/6"
            style={{ width: 300, height: 300, position: "absolute" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Glowing radial glow beneath the logo */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500, height: 500,
            top: "50%", left: "50%",
            transform: "translate(-50%, -58%)",
            background: "radial-gradient(circle, rgba(100,50,255,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Hero content ── */}
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-12 md:py-24 w-full max-w-4xl">

          {/* Large GTX Logo — constrained on mobile to prevent width overflow */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mb-6"
          >
            <GTXLogo className="h-16 sm:h-28 md:h-44 w-auto" />
          </motion.div>

          {/* Agency tagline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase mb-8 md:mb-10"
            style={{ color: themeColors.accentPink }}
          >
            An Agency Beyond Boundaries
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75 }}
            className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white max-w-4xl mb-4 md:mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            Find your next{" "}
            <span style={{ color: themeColors.accentPurple }}>Call Center</span>{" "}
            Job in Egypt
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="text-gray-400 text-sm sm:text-base md:text-lg font-medium mb-10 max-w-xl px-2"
          >
            Fast hiring · Top companies · Language-focused roles
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setView("jobs")}
              className="text-white w-full sm:w-auto justify-center px-8 py-4 sm:py-5 rounded-[2rem] font-bold text-lg sm:text-xl flex items-center gap-3 shadow-[0_10px_40px_rgba(153,102,255,0.45)] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeColors.accentPurple }}
            >
              Find Jobs <Search size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={onFastApply}
              className="bg-white/5 backdrop-blur-md text-white w-full sm:w-auto justify-center px-8 py-4 sm:py-5 rounded-[2rem] font-bold text-lg sm:text-xl border border-white/20 shadow-xl flex items-center gap-3 hover:bg-white/10 transition-colors"
            >
              Fast Apply <Zap size={20} className="text-[#44aaff] fill-[#44aaff]" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Recommended / Featured Jobs ── */}
      {featuredJobs.length > 0 && (
        <div className="px-4 pb-10 text-left">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {currentUser ? `Jobs For You` : "Latest Openings"}
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                {currentUser
                  ? `Matching your ${currentUser.language} preference`
                  : "Browse the newest opportunities"}
              </p>
            </div>
            <button
              onClick={() => setView("jobs")}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shrink-0"
              style={{ color: themeColors.accentPurple, backgroundColor: `${themeColors.accentPurple}15`, border: `1px solid ${themeColors.accentPurple}30` }}
            >
              View All <ArrowLeft size={15} className="rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="rounded-[2rem] border border-white/5 shadow-xl flex flex-col group backdrop-blur-md overflow-hidden cursor-pointer"
                style={{ backgroundColor: themeColors.glassCardBg }}
                onClick={() => onViewDetails(job)}
              >
                <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${themeColors.accentPurple}, #44aaff)` }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.accentPurple}18`, color: themeColors.accentPurple, border: `1px solid ${themeColors.accentPurple}35` }}>
                      {job.language}
                    </span>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wide mt-1">{job.company}</span>
                  </div>
                  <h3 className="text-base font-black mb-4 transition-colors text-white group-hover:text-[#9966ff] leading-snug flex-1">
                    {job.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <MapPin size={12} style={{ color: themeColors.accentPurple }} className="shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <DollarSign size={12} className="text-green-400 shrink-0" />
                      <span className="truncate">{job.salary}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold mt-auto" style={{ color: themeColors.accentPurple }}>
                    View Details <ArrowLeft size={13} className="rotate-180" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feature Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-2 relative z-20">
        <FeatureCard icon={<Languages size={32} />} title="Language Focus" desc="Jobs for English, German, & French speakers." />
        <FeatureCard icon={<CheckCircle size={32} />} title="Fast Hiring"    desc="Get hired within 48 hours." />
        <FeatureCard icon={<MapPin size={32} />}     title="Great Locations" desc="Maadi, Nasr City, New Cairo, & more." />
      </div>

    </div>
  );
}

export default HomeView;
