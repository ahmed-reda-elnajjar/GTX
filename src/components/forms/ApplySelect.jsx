import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ApplySelect({ label, icon, options, onChange, value, required = true }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.custom-select-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <div className={`space-y-2 text-left custom-select-container relative ${isOpen ? 'z-50' : 'z-10'} w-full`}>
      <label className="block text-xs font-black text-gray-400 uppercase mr-2 tracking-wide">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">{icon}</div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white/5 p-5 pr-14 rounded-3xl font-bold outline-none border transition-all text-left shadow-sm cursor-pointer ${isOpen ? 'border-[#9966ff] bg-white/10' : 'border-white/5 hover:bg-white/10'} ${!value ? 'text-gray-500' : 'text-white'}`}
        >
          {value || "Select Option"}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="absolute top-[105%] left-0 w-full rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10"
              style={{ backgroundColor: "var(--tc-dropdown-bg)" }}
            >
              <div className="max-h-60 overflow-y-auto">
                {options.map(o => (
                  <div
                    key={o}
                    onClick={() => { onChange(o); setIsOpen(false); }}
                    className={`p-4 font-bold cursor-pointer transition-colors border-b border-white/5 last:border-0 ${value === o ? 'bg-[#9966ff]/20 text-[#9966ff]' : 'text-white hover:bg-white/10'}`}
                  >
                    {o}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ApplySelect;
