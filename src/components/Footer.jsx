import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Facebook, Instagram, Video, Linkedin, Globe } from "lucide-react";
import { themeColors } from "../config/theme";
import GTXLogo from "./GTXLogo";

function Footer({ setView }) {
  return (
    <footer className="radial-footer py-16 mt-20 border-t border-white/5 backdrop-blur-xl" style={{ backgroundColor: themeColors.glassBg }}>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 font-bold text-white text-left">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center shadow-sm">
             <Mail size={26} style={{ color: themeColors.accentPurple, marginBottom: "8px" }}/>
             <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-black">Phone / WhatsApp</span>
             <p className="text-gray-200 break-all text-center">+20 10 65725431</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center shadow-sm">
             <Phone size={26} style={{ color: themeColors.accentPurple, marginBottom: "8px" }}/>
             <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-black">Phone / WhatsApp</span>
             <p className="text-gray-200">01507150999</p>
          </motion.div>
        </div>
        <div className="flex flex-col items-center md:items-end space-y-4">
           <div className="flex items-center gap-2 text-3xl font-black">
              <GTXLogo className="h-16 w-auto mb-2 drop-shadow-lg" />
           </div>
           <p className="text-gray-400 text-sm font-medium">By order of the GTX, we find the best jobs.</p>

           <div className="flex gap-4 text-gray-400">
             <motion.a whileHover={{ y:-5, color: "#1877F2" }}><Facebook size={22}/></motion.a>
             <motion.a  whileHover={{ y:-5, color: "#E4405F" }}><Instagram size={22}/></motion.a>
             <motion.a whileHover={{ y:-5, color: "#FFFFFF" }}><Video size={22}/></motion.a>
             <motion.a  whileHover={{ y:-5, color: "#0A66C2" }}><Linkedin size={22}/></motion.a>
             <motion.a href="https://wa.me/201507150999" target="_blank" whileHover={{ y:-5, color: "#25D366" }}><Globe size={22}/></motion.a>
           </div>

           <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-widest pt-4">
              <button onClick={() => setView("home")} className="hover:text-[#9966ff] transition-colors">Home</button>
              <button onClick={() => setView("jobs")} className="hover:text-[#9966ff] transition-colors">Jobs</button>
              <button onClick={() => setView("courses")} className="hover:text-[#9966ff] transition-colors">Courses</button>
              <button onClick={() => setView("admin")} className="hover:text-[#9966ff] transition-colors">Admin</button>
           </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
