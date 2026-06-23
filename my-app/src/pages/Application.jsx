import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, CheckCircle, Mic, StopCircle, Trash2, User, Phone, MessageCircle, Users, GraduationCap, Briefcase, Calendar, Mail, FileText, Upload } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CLOUD_NAME, UPLOAD_PRESET } from "../config/cloudinary";
import { themeColors } from "../config/theme";
import ApplyField from "../components/forms/ApplyField";
import ApplySelect from "../components/forms/ApplySelect";

function ApplicationPage({ job, onBack, user }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = React.useRef(null);
  const audioChunks = React.useRef([]);
  const timerRef = React.useRef(null);

  const [isRecording2, setIsRecording2] = useState(false);
  const [audioUrl2, setAudioUrl2] = useState(null);
  const [recordingTime2, setRecordingTime2] = useState(0);
  const mediaRecorder2 = React.useRef(null);
  const audioChunks2 = React.useRef([]);
  const timerRef2 = React.useRef(null);

  const [cvFile, setCvFile] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    email: user?.email || "",
    nationalId: "",
    age: "",
    gender: "",
    education: "",
    experience: user?.experience || "",
    hrRecruiterName: "",
    cvUrl: ""
  });

  const scriptUrl = "https://script.google.com/macros/s/AKfycbyFMRbyZSjyp8pXTymYBm2zhw_uoEhbXUEvm4CbxE7o9Fxs2Nf-3aovgry-Qa-DDHf8/exec";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        clearInterval(timerRef.current);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 119) { stopRecording(); return 120; }
          return prev + 1;
        });
      }, 1000);
    } catch (err) { alert("Mic required"); }
  };
  const stopRecording = () => { if(mediaRecorder.current) mediaRecorder.current.stop(); setIsRecording(false); };

  const startRecording2 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder2.current = new MediaRecorder(stream);
      audioChunks2.current = [];
      mediaRecorder2.current.ondataavailable = (e) => audioChunks2.current.push(e.data);

      mediaRecorder2.current.onstop = () => {
        const audioBlob = new Blob(audioChunks2.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl2(url);
        clearInterval(timerRef2.current);
      };

      mediaRecorder2.current.start();
      setIsRecording2(true);
      setRecordingTime2(0);

      timerRef2.current = setInterval(() => {
        setRecordingTime2((prev) => {
          if (prev >= 119) { stopRecording2(); return 120; }
          return prev + 1;
        });
      }, 1000);
    } catch (err) { alert("Mic required"); }
  };
  const stopRecording2 = () => { if(mediaRecorder2.current) mediaRecorder2.current.stop(); setIsRecording(false); };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.gender || !formData.education || !formData.experience || !audioUrl) {
      alert("Missing Data / تأكد من إدخال جميع البيانات الأساسية والصوت الأول");
      return;
    }

    // التحقق الديناميكي من الحقول الإجبارية
    if (job.requireAge && !formData.age) { alert("Age is required for this job."); return; }
    if (job.requireEmail && !formData.email) { alert("Email is required for this job."); return; }
    if (job.requireNationalId && !formData.nationalId) { alert("National ID is required for this job."); return; }
    if (job.requireCv && !cvFile && !formData.cvUrl && !user?.cvUrl) { alert("CV is required for this job."); return; }

    if (job.requiresSecondRecord && !audioUrl2) {
      alert("Please record the second audio as required by the job.");
      return;
    }

    setLoading(true);
    try {
      let publicAudioUrl = "";
      let publicAudioUrl2 = "";
      let publicCvUrl = user?.cvUrl || formData.cvUrl || "";

      // 1. رفع الصوت الأول
      if (audioUrl) {
        const audioBlob = await fetch(audioUrl).then(r => r.blob());
        const data = new FormData();
        data.append("file", audioBlob);
        data.append("upload_preset", UPLOAD_PRESET);
        data.append("cloud_name", CLOUD_NAME);
        data.append("resource_type", "video");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: data });
        const file = await res.json();
        publicAudioUrl = file.secure_url;
      }

      // 2. رفع الصوت الثاني (اختياري حسب الوظيفة)
      if (audioUrl2) {
        const audioBlob2 = await fetch(audioUrl2).then(r => r.blob());
        const data2 = new FormData();
        data2.append("file", audioBlob2);
        data2.append("upload_preset", UPLOAD_PRESET);
        data2.append("cloud_name", CLOUD_NAME);
        data2.append("resource_type", "video");
        const res2 = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: data2 });
        const file2 = await res2.json();
        publicAudioUrl2 = file2.secure_url;
      }

      // 3. رفع ملف الـ CV
      if (cvFile) {
        const cvData = new FormData();
        cvData.append("file", cvFile);
        cvData.append("upload_preset", UPLOAD_PRESET);
        cvData.append("cloud_name", CLOUD_NAME);
        cvData.append("resource_type", "auto");
        const cvRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: cvData });
        const cvJson = await cvRes.json();
        publicCvUrl = cvJson.secure_url;
      }

      let combinedAudioForSheet = publicAudioUrl;
      if (publicAudioUrl2) {
        combinedAudioForSheet = `[Record 1]: ${publicAudioUrl} \n\n[Record 2]: ${publicAudioUrl2}`;
      }

      const sheetData = new FormData();
      sheetData.append('name', formData.name);
      sheetData.append('phone', formData.phone);
      sheetData.append('age', formData.age || "N/A");
      sheetData.append('education', formData.education);
      sheetData.append('gender', formData.gender);
      sheetData.append('experience', formData.experience);
      sheetData.append('jobTitle', job.title);
      sheetData.append('company', job.company);
      sheetData.append('cvUrl', publicCvUrl);
      sheetData.append('audioUrl', combinedAudioForSheet);
      sheetData.append('hrRecruiterName', formData.hrRecruiterName);
      sheetData.append('email', formData.email || "N/A");
      sheetData.append('nationalId', formData.nationalId || "N/A");
      sheetData.append('qaStatus', 'New');

      fetch(scriptUrl, { method: 'POST', body: sheetData, mode: 'no-cors' }).catch(e => console.error(e));

      const emailData = {
        service_id: 'service_danc0or',
        template_id: 'template_95u7884',
        user_id: 'dyEaKTlzW6EAKxNjd',
        template_params: {
          'candidate_name': formData.name,
          'job_title': job.title,
          'candidate_phone': formData.phone,
          'experience': formData.experience
        }
      };

      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(emailData),
        headers: { 'Content-Type': 'application/json' }
      }).catch((err) => console.error("EmailJS Error:", err));

      // 4. حفظ البيانات في Firebase بـ englishLevel "Not Rated"
      await addDoc(collection(db, "applications"), {
        ...formData,
        jobTitle: job.title,
        jobId: job.id,
        audioUrl: publicAudioUrl,
        audioUrl2: publicAudioUrl2,
        cvUrl: publicCvUrl,
        status: "New",
        englishLevel: "Not Rated",
        appliedAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  if (success) return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-20 text-center rounded-[3rem] shadow-xl p-12 max-w-lg mx-auto border border-white/5 backdrop-blur-md" style={{ backgroundColor: themeColors.glassFormBg }}>
      <CheckCircle size={60} className="text-green-400 mx-auto mb-6 drop-shadow-md"/>
      <h2 className="text-3xl font-black mb-4 text-white">Application Sent Successfully!</h2>
      <button onClick={() => window.location.reload()} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.applyBtn }}>Back to Home</button>
    </motion.div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in slide-in-from-bottom-6 px-4">
      <button onClick={onBack} className="mb-6 font-bold text-gray-400 flex items-center gap-2 hover:text-white transition-all">
        <ArrowLeft size={18} /> Back to Search
      </button>
      <div className="rounded-[3rem] shadow-2xl p-8 md:p-12 border border-white/5 text-left backdrop-blur-md" style={{ backgroundColor: themeColors.glassFormBg }}>
        <h2 className="text-3xl font-black mb-12 text-center" style={{ color: themeColors.accentPurple }}>Apply for this Job</h2>

        <form onSubmit={handleApply} className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ApplyField label="Full Name" icon={<User size={20}/>} placeholder="Ahmed Mohamed" value={formData.name} pattern="^[A-Za-z ؀-ۿ]+$" title="Letters only" onChange={v => setFormData({...formData, name: v})}/>
              <ApplyField label="Phone" icon={<Phone size={20}/>} placeholder="01xxxxxxxxx" value={formData.phone} type="tel" pattern="^[0-9]+$" title="Numbers only" onChange={v => setFormData({...formData, phone: v})}/>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ApplyField label="WhatsApp" icon={<MessageCircle size={20}/>} placeholder="01xxxxxxxxx" value={formData.whatsapp} type="tel" pattern="^[0-9]+$" onChange={v => setFormData({...formData, whatsapp: v})}/>
              <ApplySelect label="Gender" icon={<Users size={20}/>} value={formData.gender} options={["Male", "Female"]} onChange={v => setFormData({...formData, gender: v})} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ApplySelect label="Education" icon={<GraduationCap size={20}/>} value={formData.education} options={["Student", "Graduate", "Drop-out", "Gap Year"]} onChange={v => setFormData({...formData, education: v})} />
              <ApplySelect label="Experience" icon={<Briefcase size={20}/>} value={formData.experience} options={["No Experience", "Less than 1 year", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]} onChange={v => setFormData({...formData, experience: v})} />
           </div>

           {/* 1. الحقول الديناميكية (تظهر فقط لو الإدمن فعلها) */}
           {(job?.requireAge || job?.requireEmail || job?.requireNationalId) && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {job?.requireAge && (
                  <ApplyField label="Age" icon={<Calendar size={20}/>} placeholder="e.g. 25" value={formData.age} type="number" onChange={v => setFormData({...formData, age: v})} required={true}/>
                )}
                {job?.requireEmail && (
                  <ApplyField label="Email" type="email" icon={<Mail size={20}/>} placeholder="ahmed@example.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} required={true} />
                )}
                {job?.requireNationalId && (
                  <ApplyField label="National ID" type="text" pattern="^[0-9]{14}$" title="Must be exactly 14 digits" icon={<FileText size={20}/>} placeholder="2990101..." value={formData.nationalId} onChange={v => setFormData({...formData, nationalId: v})} required={true} />
                )}
             </div>
           )}

           {/* 2. حقل الـ CV (يظهر فقط لو الإدمن فعله) */}
           {job?.requireCv && (
             <div className="space-y-4 text-left w-full bg-white/5 p-6 rounded-3xl border border-white/5">
                <label className="block text-xs font-black text-gray-400 uppercase mr-2 tracking-wide">CV (Link or File) <span className="text-red-400">* Required</span></label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <input type="text" placeholder="CV Link" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-[#9966ff] text-white text-sm transition-all" value={formData.cvUrl} onChange={e => setFormData({...formData, cvUrl: e.target.value})}/>
                  <span className="text-gray-500 text-xs font-bold">OR</span>
                  <div className="relative w-full md:w-auto">
                     <input type="file" id="cv-upload-app" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} className="hidden"/>
                     <label htmlFor="cv-upload-app" className={`w-full md:w-48 py-4 px-5 rounded-2xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all border ${cvFile ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                        {cvFile ? <><CheckCircle size={18} className="mr-2"/> Selected</> : <><Upload size={18} className="mr-2"/> Upload File</>}
                     </label>
                  </div>
                </div>
             </div>
           )}

           {/* 3. اسم الـ HR (اختياري دائماً) */}
           <div className="space-y-2 text-left w-full">
              <label className="block text-xs font-black text-gray-400 uppercase mr-2 tracking-wide">HR Recruiter Name (Optional)</label>
              <div className="relative">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"><User size={20}/></div>
                <input type="text" value={formData.hrRecruiterName} placeholder="e.g. Sara Ahmed" className="w-full bg-white/5 p-5 pr-14 rounded-3xl font-bold outline-none border border-white/5 focus:bg-white/10 focus:border-[#9966ff] transition-all text-left shadow-sm text-white placeholder:text-gray-500" onChange={e => setFormData({...formData, hrRecruiterName: e.target.value})} />
              </div>
            </div>

           {/* 4. التسجيل الصوتي */}
           <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center space-y-6">
            <label className="text-lg font-black block text-[#44aaff]">{job.recordOneLabel || "Introduce yourself in English..."}</label>
            <div className="flex flex-col items-center gap-6">
              {!audioUrl ? (
                <>
                  {isRecording && <div className="text-3xl font-black text-red-500 animate-pulse font-mono">{formatTime(recordingTime)}</div>}
                  <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#9966ff]'}`}>
                    {isRecording ? <StopCircle size={40}/> : <Mic size={40}/>}
                  </button>
                </>
              ) : (
                <div className="w-full space-y-4 animate-in fade-in">
                  <audio src={audioUrl} controls className="w-full invert opacity-90" />
                  <button type="button" onClick={()=>{setAudioUrl(null); setRecordingTime(0);}} className="text-red-400 text-sm font-bold underline flex items-center gap-1 mx-auto"><Trash2 size={16}/> Reset</button>
                </div>
              )}
            </div>
          </div>

          {job.requiresSecondRecord && (
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center space-y-6">
              <label className="text-lg font-black block text-green-400">{job.recordTwoLabel || "Second record required..."}</label>
              <div className="flex flex-col items-center gap-6">
                {!audioUrl2 ? (
                  <>
                    {isRecording2 && <div className="text-3xl font-black text-red-500 animate-pulse font-mono">{formatTime(recordingTime2)}</div>}
                    <button type="button" onClick={isRecording2 ? stopRecording2 : startRecording2} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording2 ? 'bg-red-500 text-white animate-pulse' : 'bg-[#4ade80]'}`}>
                      {isRecording2 ? <StopCircle size={40}/> : <Mic size={40}/>}
                    </button>
                  </>
                ) : (
                  <div className="w-full space-y-4 animate-in fade-in">
                    <audio src={audioUrl2} controls className="w-full invert opacity-90" />
                    <button type="button" onClick={()=>{setAudioUrl2(null); setRecordingTime2(0);}} className="text-red-400 text-sm font-bold underline flex items-center gap-1 mx-auto"><Trash2 size={16}/> Reset</button>
                  </div>
                )}
              </div>
            </div>
          )}

           {/* 5. زرار الإرسال النهائي اللامع والكبير */}
           <motion.button
             whileTap={{ scale: 0.95 }}
             type="submit"
             disabled={loading}
             className="w-full text-white py-6 rounded-[2rem] font-bold text-3xl flex justify-center items-center gap-4 hover:opacity-90 transition-opacity disabled:bg-gray-700 relative overflow-hidden mt-10"
             animate={{
               backgroundColor: ["#1a6fff", "#4499ff", "#1a6fff"],
               boxShadow: [
                 "0 10px 30px rgba(50,150,255,0.3)",
                 "0 10px 50px rgba(50,150,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
                 "0 10px 30px rgba(50,150,255,0.3)"
               ]
             }}
             transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
           >
             {loading ? <Loader2 className="animate-spin"/> : <><Send size={32} className="-mt-1"/> Submit Application</>}
           </motion.button>
        </form>
      </div>
    </div>
  );
}

export default ApplicationPage;
