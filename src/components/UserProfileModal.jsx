import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Phone, Languages, Briefcase, FileText, Edit3, Save, LogOut, MessageCircle } from "lucide-react";
import { themeColors } from "../config/theme";
import AdminField from "./forms/AdminField";
import ApplySelect from "./forms/ApplySelect";

function UserProfileModal({ user, onClose, onLogout, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    phone: user.phone,
    whatsapp: user.whatsapp || "",
    email: user.email,
    language: user.language,
    experience: user.experience
  });

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative backdrop-blur-2xl border border-white/10"
        style={{ backgroundColor: themeColors.glassCardBg }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>

        <div className="p-8 text-center bg-white/5 border-b border-white/10">
           <div className="w-24 h-24 bg-white/10 text-[#9966ff] rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-lg border-2 border-white/20">
              {user.name.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-2xl font-black text-white">{isEditing ? "Edit Profile" : user.name}</h2>
           {!isEditing && <p className="text-gray-400 font-bold">{user.email}</p>}
        </div>

        <div className="p-8 space-y-6 text-left">
           {isEditing ? (
             <div className="space-y-4">
                <AdminField label="Full Name" value={editForm.name} onChange={(v) => setEditForm({...editForm, name: v})} placeholder="Name" />
                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Phone" value={editForm.phone} onChange={(v) => setEditForm({...editForm, phone: v})} placeholder="Phone" />
                  <AdminField label="WhatsApp" value={editForm.whatsapp} onChange={(v) => setEditForm({...editForm, whatsapp: v})} placeholder="WhatsApp" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <ApplySelect label="Language" icon={<Languages size={18}/>} value={editForm.language} onChange={(e) => setEditForm({...editForm, language: e})} options={["English", "German", "French", "Italian", "Spanish", "Danish"]} />
                   <ApplySelect label="Experience" icon={<Briefcase size={18}/>} value={editForm.experience} onChange={(e) => setEditForm({...editForm, experience: e})} options={["No Experience", "Less than 1 year", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]} />
                </div>
                <button onClick={handleSave} className="w-full bg-green-500/20 text-green-400 border border-green-500/50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-500 hover:text-gray-900 transition-all">
                   <Save size={18}/> Save Changes
                </button>
             </div>
           ) : (
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                   <span className="font-bold text-white">{user.phone}</span>
                   <span className="text-gray-400 text-sm"><Phone size={16} className="inline mx-1"/> Phone</span>
                </div>
                {user.whatsapp && (
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                     <span className="font-bold text-white">{user.whatsapp}</span>
                     <span className="text-green-400 text-sm"><MessageCircle size={16} className="inline mx-1"/> WhatsApp</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                   <span className="font-bold text-white">{user.language}</span>
                   <span className="text-gray-400 text-sm"><Languages size={16} className="inline mx-1"/> Language</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                   <span className="font-bold text-white">{user.experience}</span>
                   <span className="text-gray-400 text-sm"><Briefcase size={16} className="inline mx-1"/> Experience</span>
                </div>

                {user.cvUrl && (
                   <a href={user.cvUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-gray-900 font-bold p-4 rounded-2xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>
                      <FileText size={18}/> View CV
                   </a>
                )}

                <button onClick={() => setIsEditing(true)} className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                   <Edit3 size={18}/> Edit Profile
                </button>
             </div>
           )}

           <div className="border-t border-white/10 pt-6 mt-4">
              <button onClick={onLogout} className="w-full text-red-400 bg-red-500/10 border border-red-500/20 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                 <LogOut size={18}/> Logout
              </button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserProfileModal;
