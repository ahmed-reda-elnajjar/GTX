import React, { useState } from "react";
import { Loader2, User, Mail, Phone, Send, CheckCircle, Upload, MessageCircle, Languages, Briefcase } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CLOUD_NAME, UPLOAD_PRESET } from "../config/cloudinary";
import { themeColors } from "../config/theme";
import ApplyField from "../components/forms/ApplyField";
import ApplySelect from "../components/forms/ApplySelect";

function LoginView({ onLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", whatsapp: "", language: "", experience: "", cvUrl: "" });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.language || !formData.experience) {
      alert("Please select Language and Experience / برجاء اختيار اللغة والخبرة");
      return;
    }

    setLoading(true);
    try {
       let uploadedCvUrl = formData.cvUrl;
       if (cvFile) {
        const cvData = new FormData();
        cvData.append("file", cvFile);
        cvData.append("upload_preset", UPLOAD_PRESET);
        cvData.append("cloud_name", CLOUD_NAME);
        cvData.append("resource_type", "auto");
        const cvRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: cvData });
        const cvJson = await cvRes.json();
        if (cvJson.error) throw new Error(cvJson.error.message);
        uploadedCvUrl = cvJson.secure_url;
      }

      const userData = { ...formData, cvUrl: uploadedCvUrl, joinedAt: serverTimestamp() };

      const tempId = "user_" + new Date().getTime();
      const userWithId = { ...userData, id: tempId };

      localStorage.setItem("egyptHireUser", JSON.stringify(userWithId));

      addDoc(collection(db, "users"), userData)
        .then(docRef => {
          userWithId.id = docRef.id;
          localStorage.setItem("egyptHireUser", JSON.stringify(userWithId));
        })
        .catch(err => console.log("Firebase Error:", err));

      onLogin(userWithId);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="p-10 rounded-[3rem] shadow-2xl border border-white/5 text-left backdrop-blur-xl" style={{ backgroundColor: themeColors.glassFormBg }}>
        <h2 className="text-4xl font-black mb-2 text-center" style={{ color: themeColors.accentPurple }}>Login / Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ApplyField label="Full Name" icon={<User size={18}/>} placeholder="Ahmed Mohamed" pattern="^[A-Za-z ؀-ۿ]+$" title="Please enter letters only (يرجى إدخال حروف فقط)" value={formData.name} onChange={v => setFormData({...formData, name: v})}/>
              <ApplyField label="Email" type="email" icon={<Mail size={18}/>} placeholder="ahmed@example.com" value={formData.email} onChange={v => setFormData({...formData, email: v})}/>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ApplyField label="Phone" type="tel" pattern="^[0-9]+$" title="Please enter numbers only (يرجى إدخال أرقام فقط)" icon={<Phone size={18}/>} placeholder="01xxxxxxxxx" value={formData.phone} onChange={v => setFormData({...formData, phone: v})}/>
              <ApplyField label="WhatsApp" type="tel" pattern="^[0-9]+$" title="Please enter numbers only (يرجى إدخال أرقام فقط)" icon={<MessageCircle size={18}/>} placeholder="01xxxxxxxxx" value={formData.whatsapp} onChange={v => setFormData({...formData, whatsapp: v})}/>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ApplySelect label="Language" icon={<Languages size={18}/>} value={formData.language} options={["English", "German", "French", "Italian", "Spanish", "Danish"]} onChange={v => setFormData({...formData, language: v})} />
             <ApplySelect label="Experience" icon={<Briefcase size={18}/>} value={formData.experience} options={["No Experience", "Less than 1 year", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]} onChange={v => setFormData({...formData, experience: v})} />
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-black text-gray-400 uppercase mx-2 tracking-wide">CV Link (Optional)</label>
             <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-white/5 p-4 rounded-2xl font-bold outline-none border border-white/5 focus:border-[#9966ff] transition-all text-sm shadow-sm text-white placeholder:text-gray-500"
                  onChange={e => setFormData({...formData, cvUrl: e.target.value})}
                />
                <div className="relative">
                   <input type="file" id="cv-quick" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} />
                   <label htmlFor="cv-quick" className={`h-full px-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all border border-white/10 ${cvFile ? 'bg-[#44aaff]/20 text-[#44aaff] border-[#44aaff]/50' : 'bg-white/5 text-[#9966ff] hover:bg-white/10'}`}>
                      {cvFile ? <CheckCircle size={20}/> : <Upload size={20}/>}
                   </label>
                </div>
             </div>
           </div>

           <button disabled={loading} className="w-full text-gray-900 py-4 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>
             {loading ? <Loader2 className="animate-spin"/> : <><Send size={20} /> Submit</>}
           </button>
        </form>
      </div>
    </div>
  );
}

export default LoginView;
