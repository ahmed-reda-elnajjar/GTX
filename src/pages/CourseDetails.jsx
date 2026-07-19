import React from "react";
import { motion } from "framer-motion";
import { themeColors } from "../config/theme";
import { SyllabusSection } from "./Courses";

export default function CourseDetailsView({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white">Course Details</h2>
          <button onClick={() => onBack && onBack()} className="text-sm font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300">Back</button>
        </div>
        <SyllabusSection />
      </div>
    </div>
  );
}
