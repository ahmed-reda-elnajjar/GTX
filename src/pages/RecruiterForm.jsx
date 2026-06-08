import React, { useState } from "react";
import { Loader2, Send, User, Phone, MessageCircle, Users, GraduationCap, Briefcase, Calendar, Mail, FileText, CheckCircle, Upload } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CLOUD_NAME, UPLOAD_PRESET } from "../config/cloudinary";
import { themeColors } from "../config/theme";
import ApplyField from "../components/forms/ApplyField";
import ApplySelect from "../components/forms/ApplySelect";

function RecruiterCandidateForm({ jobs, onAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobId: "", name: "", phone: "", whatsapp: "", age: "", gender: "", education: "", experience: "", hrRecruiterName: "", cvUrl: "", audioUrl: "", audioUrl2: "", email: "", nationalId: ""
  });
  const [cvFile, setCvFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioFile2, setAudioFile2] = useState(null);

  const selectedJob = jobs.find(j => j.id === formData.jobId);
  const scriptUrl = "https://script.google.com/macros/s/AKfycbyFMRbyZSjyp8pXTymYBm2zhw_uoEhbXUEvm4CbxE7o9Fxs2Nf-3aovgry-Qa-DDHf8/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.jobId || !formData.name || !formData.phone || (!audioFile && !formData.audioUrl)) {
       return alert("Please fill all basic required fields and provide the main audio.");
    }

    if (selectedJob?.requireCv && !cvFile && !formData.cvUrl) return alert("CV is required for this job.");

    if(selectedJob?.requiresSecondRecord && (!audioFile2 && !formData.audioUrl2)) {
       return alert("This job requires a SECOND audio record.");
    }

    setLoading(true);
    try {
      let finalCvUrl = formData.cvUrl;
      let finalAudioUrl = formData.audioUrl;
      let finalAudioUrl2 = formData.audioUrl2;

      if (cvFile) {
        const cvData = new FormData();
        cvData.append("file", cvFile);
        cvData.append("upload_preset", UPLOAD_PRESET);
        cvData.append("cloud_name", CLOUD_NAME);
        cvData.append("resource_type", "auto");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: cvData });
        const data = await res.json();
        if(data.error) throw new Error(data.error.message);
        finalCvUrl = data.secure_url;
      }

      if (audioFile) {
        const audioData = new FormData();
        audioData.append("file", audioFile);
        audioData.append("upload_preset", UPLOAD_PRESET);
        audioData.append("cloud_name", CLOUD_NAME);
        audioData.append("resource_type", "video");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: audioData });
        const data = await res.json();
        if(data.error) throw new Error(data.error.message);
        finalAudioUrl = data.secure_url;
      }

      if (audioFile2) {
        const audioData2 = new FormData();
        audioData2.append("file", audioFile2);
        audioData2.append("upload_preset", UPLOAD_PRESET);
        audioData2.append("cloud_name", CLOUD_NAME);
        audioData2.append("resource_type", "video");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: audioData2 });
        const data = await res.json();
        if(data.error) throw new Error(data.error.message);
        finalAudioUrl2 = data.secure_url;
      }

      let combinedAudioForSheet = finalAudioUrl;
      if (finalAudioUrl2) {
        combinedAudioForSheet = `[Record 1]: ${finalAudioUrl} \n\n[Record 2]: ${finalAudioUrl2}`;
      }

      const sheetData = new FormData();
      sheetData.append('name', formData.name);
      sheetData.append('phone', formData.phone);
      sheetData.append('age', formData.age || "N/A");
      sheetData.append('education', formData.education);
      sheetData.append('gender', formData.gender);
      sheetData.append('experience', formData.experience);
      sheetData.append('jobTitle', selectedJob.title);
      sheetData.append('company', selectedJob.company);
      sheetData.append('cvUrl', finalCvUrl);
      sheetData.append('audioUrl', combinedAudioForSheet);
      sheetData.append('hrRecruiterName', formData.hrRecruiterName);
      sheetData.append('email', formData.email || "N/A");
      sheetData.append('nationalId', formData.nationalId || "N/A");
      sheetData.append('qaStatus', 'New');

      fetch(scriptUrl, { method: 'POST', body: sheetData, mode: 'no-cors' }).catch(e=>console.log(e));

      const emailData = {
        service_id: 'service_danc0or',
        template_id: 'template_95u7884',
        user_id: 'dyEaKTlzW6EAKxNjd',
        template_params: {
          'candidate_name': formData.name,
          'job_title': selectedJob.title,
          'candidate_phone': formData.phone,
          'experience': formData.experience
        }
      };

      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(emailData),
        headers: { 'Content-Type': 'application/json' }
      }).catch((err) => console.error("EmailJS Error:", err));

      await addDoc(collection(db, "applications"), {
        ...formData,
        cvUrl: finalCvUrl,
        audioUrl: finalAudioUrl,
        audioUrl2: finalAudioUrl2,
        jobTitle: selectedJob.title,
        jobId: selectedJob.id,
        status: "New",
        englishLevel: "Not Rated",
        appliedAt: serverTimestamp()
      });

      alert("Candidate added successfully!");
      setFormData({ jobId: "", name: "", phone: "", whatsapp: "", age: "", gender: "", education: "", experience: "", hrRecruiterName: "", cvUrl: "", audioUrl: "", audioUrl2: "", email: "", nationalId: ""});
      setCvFile(null);
      setAudioFile(null);
      setAudioFile2(null);
      onAdded();
    } catch(err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 mb-10 text-left">
       <h3 className="text-3xl font-black mb-8 text-center text-white">Add New Candidate</h3>
       <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2 text-left w-full">
               <label className="block text-xs font-black text-gray-400 uppercase tracking-wide">Select Job *</label>
               <select required value={formData.jobId} onChange={e => setFormData({...formData, jobId: e.target.value})} className="w-full bg-white/5 p-5 rounded-3xl font-bold outline-none border border-white/5 focus:bg-white/10 focus:border-[#9966ff] text-white transition-all shadow-sm">
                 <option value="" className="bg-gray-900">Choose Job...</option>
                 {jobs.map(j => <option key={j.id} value={j.id} className="bg-gray-900">{j.title} ({j.company})</option>)}
               </select>
             </div>
             <ApplyField label="HR Recruiter Name" icon={<User size={18}/>} placeholder="Your Name" value={formData.hrRecruiterName} onChange={v => setFormData({...formData, hrRecruiterName: v})} required/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <ApplyField label="Candidate Name" icon={<User size={18}/>} placeholder="Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} pattern="^[A-Za-z ؀-ۿ]+$" title="Letters only" required/>
             <ApplyField label="Phone" type="tel" icon={<Phone size={18}/>} placeholder="01xxxxxxxxx" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} pattern="^[0-9]+$" title="Numbers only" required/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <ApplyField label="WhatsApp" type="tel" icon={<MessageCircle size={18}/>} placeholder="01xxxxxxxxx" value={formData.whatsapp} onChange={v => setFormData({...formData, whatsapp: v})} pattern="^[0-9]+$" title="Numbers only" required/>
             <ApplySelect label="Gender" icon={<Users size={18}/>} value={formData.gender} options={["Male", "Female"]} onChange={v => setFormData({...formData, gender: v})} required/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <ApplySelect label="Education Status" icon={<GraduationCap size={18}/>} value={formData.education} options={["Student", "Graduate", "Drop-out", "Gap Year"]} onChange={v => setFormData({...formData, education: v})} required/>
             <ApplySelect label="Experience" icon={<Briefcase size={18}/>} value={formData.experience} options={["No Experience", "Less than 1 year", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]} onChange={v => setFormData({...formData, experience: v})} required/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <ApplyField label="Age (Optional)" type="tel" pattern="^[0-9]+$" title="Please enter numbers only" icon={<Calendar size={18}/>} placeholder="e.g. 25" value={formData.age} onChange={v => setFormData({...formData, age: v})} required={false}/>
             <ApplyField label="Email (Optional)" type="email" icon={<Mail size={18}/>} placeholder="ahmed@example.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} required={false} />
             <ApplyField label="National ID (Optional)" type="text" pattern="^[0-9]{14}$" title="Must be exactly 14 digits" icon={<FileText size={18}/>} placeholder="2990101..." value={formData.nationalId} onChange={v => setFormData({...formData, nationalId: v})} required={false} />
          </div>

          <div className="space-y-4 text-left w-full bg-white/5 p-6 rounded-3xl border border-white/5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wide">CV (Link or File) {selectedJob?.requireCv ? <span className="text-red-400">* Required</span> : "- Optional"}</label>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="CV Link (Drive, Docs, etc.)" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-[#9966ff] text-white text-sm transition-all" value={formData.cvUrl} onChange={e => setFormData({...formData, cvUrl: e.target.value})}/>
                <span className="text-gray-500 text-xs font-bold">OR</span>
                <div className="relative w-full md:w-auto">
                   <input type="file" id="cv-upload-rec" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} className="hidden"/>
                   <label htmlFor="cv-upload-rec" className={`w-full md:w-48 py-4 px-5 rounded-2xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all border ${cvFile ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                      {cvFile ? <><CheckCircle size={18} className="mr-2"/> Selected</> : <><Upload size={18} className="mr-2"/> Upload File</>}
                   </label>
                </div>
              </div>
           </div>

          {/* Audio 1 */}
          <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5">
             <label className="block text-xs font-black text-[#44aaff] uppercase tracking-wide mb-4">
               First Audio Record (Link or File) * {selectedJob && `— ${selectedJob.recordOneLabel || "Introduce yourself..."}`}
             </label>
             <div className="flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Audio Link (e.g. Google Drive)" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-[#9966ff] text-white text-sm transition-all" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})}/>
                <span className="text-gray-500 text-xs font-bold">OR</span>
                <div className="relative w-full md:w-auto">
                   <input type="file" id="audio-upload-form" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} className="hidden"/>
                   <label htmlFor="audio-upload-form" className={`w-full md:w-48 py-4 px-5 rounded-2xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all border ${audioFile ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-[#9966ff]/10 text-[#9966ff] border-[#9966ff]/30 hover:bg-[#9966ff]/20'}`}>
                      {audioFile ? `Selected` : "Upload File"}
                   </label>
                </div>
             </div>
          </div>

          {/* Audio 2 */}
          {selectedJob?.requiresSecondRecord && (
            <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5">
               <label className="block text-xs font-black text-green-400 uppercase tracking-wide mb-4">
                 Second Audio Record (Link or File) * {`— ${selectedJob.recordTwoLabel || "Second record required..."}`}
               </label>
               <div className="flex flex-col md:flex-row gap-4 items-center">
                  <input type="text" placeholder="Audio Link (e.g. Google Drive)" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-green-400 text-white text-sm transition-all" value={formData.audioUrl2} onChange={e => setFormData({...formData, audioUrl2: e.target.value})}/>
                  <span className="text-gray-500 text-xs font-bold">OR</span>
                  <div className="relative w-full md:w-auto">
                     <input type="file" id="audio-upload-form2" accept="audio/*" onChange={e => setAudioFile2(e.target.files[0])} className="hidden"/>
                     <label htmlFor="audio-upload-form2" className={`w-full md:w-48 py-4 px-5 rounded-2xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all border ${audioFile2 ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'}`}>
                        {audioFile2 ? `Selected` : "Upload File"}
                     </label>
                  </div>
               </div>
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full text-white py-5 rounded-[2rem] font-bold text-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(50,150,255,0.3)]" style={{ backgroundColor: themeColors.applyBtn }}>
            {loading ? <Loader2 className="animate-spin"/> : <Send size={24} className="-mt-1"/>} Submit Candidate
          </button>
       </form>
    </div>
  );
}

export default RecruiterCandidateForm;
