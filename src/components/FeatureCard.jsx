import React from "react";
import { motion } from "framer-motion";
import { themeColors } from "../config/theme";

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(196,141,255,0.15)" }}
      className="p-10 rounded-[3rem] shadow-2xl border border-white/5 flex flex-col items-center text-center backdrop-blur-sm"
      style={{ backgroundColor: themeColors.glassCardBg }}
    >
      <div className="w-16 h-16 bg-white/5 text-[#9966ff] rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">{icon}</div>
      <h3 className="text-2xl font-bold mb-4" style={{ color: themeColors.accentPurple }}>{title}</h3>
      <p className="text-gray-300 font-medium">{desc}</p>
    </motion.div>
  );
}

export default FeatureCard;
