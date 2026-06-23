import React from "react";
import { motion } from "framer-motion";
import { Languages, MapPin, Briefcase, ArrowLeft, DollarSign, RotateCcw } from "lucide-react";
import { themeColors, cardVariants } from "../config/theme";

function JobsListView({ jobs, filters, setFilters, onViewDetails, hideFilters = false, locations = [], languages = [] }) {
  return (
    <div className="space-y-8">
      {!hideFilters && (
        <div className="p-4 sm:p-5 rounded-[1.75rem] border border-white/5 backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Selects: 2-col grid on mobile, inline on desktop */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 sm:items-center">
              <div className="relative">
                <Languages size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(p => ({...p, language: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 text-white pl-8 pr-2 py-3 rounded-xl font-bold outline-none cursor-pointer hover:bg-white/10 focus:border-[#9966ff] transition-all text-xs sm:text-sm"
                >
                  <option value="all" className="bg-gray-900">All Languages</option>
                  {languages.map(lang => <option key={lang} value={lang} className="bg-gray-900">{lang}</option>)}
                </select>
              </div>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(p => ({...p, location: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 text-white pl-8 pr-2 py-3 rounded-xl font-bold outline-none cursor-pointer hover:bg-white/10 focus:border-[#9966ff] transition-all text-xs sm:text-sm"
                >
                  <option value="all" className="bg-gray-900">All Locations</option>
                  {locations.map(loc => <option key={loc} value={loc} className="bg-gray-900">{loc}</option>)}
                </select>
              </div>
              {/* Reset — visible on sm+ inline with selects */}
              <button
                onClick={() => setFilters({ language: "all", location: "all" })}
                className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-[#44aaff] font-bold text-sm transition-colors px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
            {/* Mobile bottom row: Reset + count */}
            <div className="flex sm:hidden items-center justify-between">
              <button
                onClick={() => setFilters({ language: "all", location: "all" })}
                className="flex items-center gap-1.5 text-gray-400 font-bold text-sm transition-colors px-3 py-2 rounded-xl bg-white/5 border border-white/5"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs" style={{ backgroundColor: `${themeColors.accentPurple}20`, border: `1px solid ${themeColors.accentPurple}40`, color: themeColors.accentPurple }}>
                <Briefcase size={13} />
                {jobs.length} Jobs Available
              </div>
            </div>
            {/* Desktop count */}
            <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm" style={{ backgroundColor: `${themeColors.accentPurple}20`, border: `1px solid ${themeColors.accentPurple}40`, color: themeColors.accentPurple }}>
              <Briefcase size={15} />
              {jobs.length} Jobs Available
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="rounded-[2rem] border border-white/15 shadow-2xl flex flex-col group backdrop-blur-md overflow-hidden ring-1 ring-white/5 hover:border-[#9966ff]/40 transition-colors"
            style={{ backgroundColor: themeColors.glassCardBg, boxShadow: "0 10px 35px -8px rgba(0,0,0,0.65)" }}
          >
            <div className="h-[4px] w-full" style={{ background: `linear-gradient(90deg, ${themeColors.accentPurple}, #44aaff)` }} />
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.accentPurple}18`, color: themeColors.accentPurple, border: `1px solid ${themeColors.accentPurple}35` }}>
                  {job.language}
                </span>
              </div>

              <h2
                onClick={() => onViewDetails(job)}
                className="text-xl font-black uppercase tracking-wide mb-1.5 cursor-pointer transition-colors text-white group-hover:text-[#9966ff] leading-tight"
              >
                {job.company}
              </h2>
              <h3
                onClick={() => onViewDetails(job)}
                className="text-sm font-bold mb-5 cursor-pointer text-gray-400 leading-snug flex-1"
              >
                {job.title}
              </h3>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2.5 text-sm text-gray-200 font-semibold bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                  <MapPin size={14} style={{ color: themeColors.accentPurple }} className="shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200 font-semibold bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                  <DollarSign size={14} className="text-green-400 shrink-0" />
                  <span className="truncate">{job.salary}</span>
                </div>
              </div>

              <button
                onClick={() => onViewDetails(job)}
                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white text-sm hover:opacity-90 shadow-md"
                style={{ background: `linear-gradient(135deg, ${themeColors.accentPurple}, #7744ee)` }}
              >
                View Details <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default JobsListView;
