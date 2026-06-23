import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Send, Map } from "lucide-react";
import { themeColors } from "../config/theme";

function JobDetailsView({ job, onBack, onApply, isAdminPreview = false }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!job) return null;
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in zoom-in duration-300">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-[#9966ff] transition-colors text-sm">
        <ArrowLeft size={17} /> {isAdminPreview ? "Back to Admin Dashboard" : "Back to Jobs"}
      </button>

      {/* Header */}
      <div
        className="rounded-[2.5rem] overflow-hidden mb-8 relative"
        style={{ background: `linear-gradient(135deg, #5522bb, ${themeColors.accentPurple} 60%, #7744cc)` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 75% 15%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
        <div className="relative px-5 py-7 sm:px-10 sm:py-10 md:px-14 md:py-12">
          <span className="inline-block bg-black/25 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6 border border-white/20">
            {job.language} English Level Specialization
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{job.title}</h1>
          <div className="flex items-center gap-2 text-white/65 font-bold text-base">
            <Briefcase size={17} />
            <span>{job.company}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-7">
        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-xl" style={{ backgroundColor: themeColors.glassFormBg }}>
            <div className="px-6 py-4 border-b border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Job Overview</p>
            </div>
            <div className="divide-y divide-white/5">
              <div className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: themeColors.accentPurple }}>
                  <MapPin size={12} /> Location
                </div>
                <p className="text-white font-bold text-sm leading-snug">{job.location}</p>
                {job.locationLink && (
                  <motion.a
                    href={job.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                    style={{ backgroundColor: `${themeColors.accentPurple}20`, color: themeColors.accentPurple, border: `1px solid ${themeColors.accentPurple}45` }}
                    animate={{ boxShadow: ["0 0 8px rgba(153,102,255,0.15)", "0 0 18px rgba(153,102,255,0.55)", "0 0 8px rgba(153,102,255,0.15)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Map size={13} /> View on Map
                  </motion.a>
                )}
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-green-500 mb-2">
                  <DollarSign size={12} /> Salary
                </div>
                <p className="text-green-400 font-black text-sm leading-snug">{job.salary}</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: themeColors.accentPurple }}>
                  <Briefcase size={12} /> Experience
                </div>
                <p className="text-white font-bold text-sm">{job.experience}</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#44aaff] mb-2">
                  <Clock size={12} /> Shift
                </div>
                <p className="text-white font-bold text-sm leading-snug">{job.shift}</p>
              </div>
            </div>
          </div>

          {!isAdminPreview && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onApply}
              className="w-full text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity border border-white/10 relative overflow-hidden shadow-xl"
              animate={{
                backgroundColor: [themeColors.applyBtn, "#4a9dfc", themeColors.applyBtn],
                boxShadow: [
                  "0 8px 25px rgba(50,150,255,0.3)",
                  "0 8px 45px rgba(50,150,255,0.7), 0 0 15px rgba(255,255,255,0.25)",
                  "0 8px 25px rgba(50,150,255,0.3)"
                ]
              }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            >
              <Send size={22} /> Apply Now
            </motion.button>
          )}
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-left">
          <div className="rounded-[1.75rem] border border-white/5 backdrop-blur-md overflow-hidden shadow-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
            <div className="px-7 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: themeColors.accentPurple }} />
              <h3 className="text-lg font-black text-white">Job Description</h3>
            </div>
            <div className="px-7 py-6">
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line font-medium">{job.description}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/5 backdrop-blur-md overflow-hidden shadow-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
            <div className="px-7 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-1 h-5 bg-[#44aaff] rounded-full" />
              <h3 className="text-lg font-black text-white">Requirements</h3>
            </div>
            <div className="px-7 py-6">
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line font-medium">{job.requirements}</p>
            </div>
          </div>

          {job.benefits && (
            <div className="rounded-[1.75rem] border border-white/5 backdrop-blur-md overflow-hidden shadow-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
              <div className="px-7 py-5 border-b border-white/5 flex items-center gap-3">
                <div className="w-1 h-5 bg-green-400 rounded-full" />
                <h3 className="text-lg font-black text-white">Benefits</h3>
              </div>
              <div className="px-7 py-6">
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line font-medium">{job.benefits}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsView;
