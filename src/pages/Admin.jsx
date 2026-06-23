import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock, Eye, EyeOff, Plus, Loader2, Edit3, Trash2, GripVertical, Clock,
  Search, Languages, Phone, MessageCircle, User, CheckCircle, X, Copy,
  Download, FileText, ExternalLink, Mic, Mail, BookOpen
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { themeColors, formatDateTime } from "../config/theme";
import AdminField from "../components/forms/AdminField";
import JobDetailsView from "./JobDetails";
import RecruiterCandidateForm from "./RecruiterForm";

function AdminPanelView({ jobs }) {
  const [isAuth, setIsAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [unlockedTabs, setUnlockedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const [adminSelectedJob, setAdminSelectedJob] = useState(null);
  const [pendingTab, setPendingTab] = useState(null);
  const [secPass, setSecPass] = useState("");
  const [showSecPass, setShowSecPass] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideRecruiterApps, setHideRecruiterApps] = useState(false);

  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingRecruiter, setEditingRecruiter] = useState({ id: null, name: "" });

  const [form, setForm] = useState({
    title: "", company: "", location: "", locationLink: "", language: "", salary: "", description: "", requirements: "", benefits: "", experience: "", shift: "",
    recordOneLabel: "Introduce yourself and record a voice note in English for at least two minutes to determine your level.",
    requiresSecondRecord: false, recordTwoLabel: "",
    requireCv: false, requireNationalId: false, requireEmail: false, requireAge: false
  });

  const [courseForm, setCourseForm] = useState({
    title: "Training Career Sprint (Academy)",
    subtitle: "Online assessment from home followed by a full online course.",
    eligibility: "Grads / Undergrads / Gap Year / Drop out · Egyptians / Foreigners",
    stages: "1- Online Assessment · 2- Online Course",
    levels: "A1 - C2",
    commission: "50 - 100 EGP",
    additionalCommission: "Another commission after getting hired",
    link: "",
    isHidden: false
  });

  const [loading, setLoading] = useState(false);
  const [draggedJobIdx, setDraggedJobIdx] = useState(null);

  useEffect(() => {
    if (isAuth) {
      const qApps = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
      const unsubApps = onSnapshot(qApps, (snapshot) => {
        setApplications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const qUsers = query(collection(db, "users"), orderBy("joinedAt", "desc"));
      const unsubUsers = onSnapshot(qUsers, (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const qCourses = query(collection(db, "courses"), orderBy("order", "asc"));
      const unsubCourses = onSnapshot(qCourses, (snapshot) => {
        setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return () => { unsubApps(); unsubUsers(); unsubCourses(); };
    }
  }, [isAuth]);

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const handleRateEnglish = async (appId, level) => {
    try {
      await updateDoc(doc(db, "applications", appId), { englishLevel: level, validatedAt: serverTimestamp() });
    } catch (err) { alert("Error updating level: " + err.message); }
  };

  const handleAppStatus = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, "applications", appId), { status: newStatus, validatedAt: serverTimestamp() });
    } catch (err) { alert("Error updating status: " + err.message); }
  };

  const handleUpdateRecruiter = async (appId) => {
    if (!editingRecruiter.name.trim()) return;
    try {
      await updateDoc(doc(db, "applications", appId), { hrRecruiterName: editingRecruiter.name });
      setEditingRecruiter({ id: null, name: "" });
    } catch(err) { alert("Error updating recruiter: " + err.message); }
  };

  const saveJob = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "jobs", editingId), { ...form, updatedAt: serverTimestamp() });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "jobs"), { ...form, createdAt: serverTimestamp(), order: jobs.length, isHidden: false });
      }
      setForm({
        title: "", company: "", location: "", locationLink: "", language: "", salary: "", description: "", requirements: "", benefits: "", experience: "", shift: "",
        recordOneLabel: "Introduce yourself and record a voice note in English for at least two minutes to determine your level.",
        requiresSecondRecord: false, recordTwoLabel: "",
        requireCv: false, requireNationalId: false, requireEmail: false, requireAge: false
      });
      alert("Job Saved Successfully");
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const saveCourse = async () => {
    setLoading(true);
    try {
      if (editingCourseId) {
        await updateDoc(doc(db, "courses", editingCourseId), { ...courseForm, updatedAt: serverTimestamp() });
        setEditingCourseId(null);
      } else {
        await addDoc(collection(db, "courses"), { ...courseForm, createdAt: serverTimestamp(), order: courses.length, isHidden: false });
      }
      setCourseForm({
        title: "Training Career Sprint (Academy)",
        subtitle: "Online assessment from home followed by a full online course.",
        eligibility: "Grads / Undergrads / Gap Year / Drop out · Egyptians / Foreigners",
        stages: "1- Online Assessment · 2- Online Course",
        levels: "A1 - C2",
        commission: "50 - 100 EGP",
        additionalCommission: "Another commission after getting hired",
        link: "https://forms.gle/X4P5uCz1ENPCd3Ha8",
        isHidden: false
      });
      alert("Course Saved Successfully");
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const toggleCourseVisibility = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "courses", id), { isHidden: !currentStatus });
    } catch (err) { alert(err.message); }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, "courses", id));
    } catch (err) { alert(err.message); }
  };

  const editCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm(course);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleJobVisibility = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "jobs", id), { isHidden: !currentStatus });
    } catch (err) { alert(err.message); }
  };

  const handleDrop = async (dropIndex) => {
    if (draggedJobIdx === null || draggedJobIdx === dropIndex) return;
    const newJobsOrder = [...jobs];
    const draggedItem = newJobsOrder.splice(draggedJobIdx, 1)[0];
    newJobsOrder.splice(dropIndex, 0, draggedItem);
    setDraggedJobIdx(null);
    try {
      const updates = newJobsOrder.map((job, idx) => updateDoc(doc(db, "jobs", job.id), { order: idx }));
      await Promise.all(updates);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleTabClick = (tabName) => {
    if (unlockedTabs.includes(tabName)) {
      setActiveTab(tabName);
      setPendingTab(null);
    } else {
      setPendingTab(tabName);
      setSecPass("");
    }
  };

  const handleUnlockTab = () => {
    if (pendingTab === "jobs" || pendingTab === "users" || pendingTab === "courses") {
      if (secPass === "samaltman") {
        setUnlockedTabs(prev => [...new Set([...prev, "jobs", "users", "courses"])]);
        setActiveTab(pendingTab);
        setPendingTab(null);
        setSecPass("");
      } else { alert("Wrong Password for Management!"); }
    } else if (pendingTab === "applications") {
      if (secPass === "rayan") {
        setUnlockedTabs(prev => [...prev, "applications"]);
        setActiveTab(pendingTab);
        setPendingTab(null);
        setSecPass("");
      } else { alert("Wrong Password for Applications!"); }
    } else if (pendingTab === "add_candidate" || pendingTab === "recruiter_apps") {
        setUnlockedTabs(prev => [...prev, pendingTab]);
        setActiveTab(pendingTab);
        setPendingTab(null);
        setSecPass("");
    }
  };

  if (!isAuth) return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="p-10 md:p-12 rounded-[3rem] shadow-2xl border border-white/5 w-full max-w-md text-center backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
        <Lock className="mx-auto mb-6 text-[#9966ff]" size={48}/>
        <h2 className="text-2xl font-bold mb-8 text-white">Admin Login</h2>
        <div className="relative mb-6">
           <input type={showPass ? "text" : "password"} onChange={(e)=>setPass(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { if(pass === "scoutech"){ setIsAuth(true); setUnlockedTabs(["recruiter_apps", "add_candidate"]); } else { alert("Wrong Password"); } } }} className="w-full bg-white/5 p-5 rounded-2xl text-center font-bold outline-none border border-white/5 focus:bg-white/10 focus:border-[#9966ff] transition-all shadow-sm text-white placeholder:text-gray-500" placeholder="******" />
           <button onClick={()=>setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showPass ? <EyeOff size={22}/> : <Eye size={22}/>}</button>
        </div>
        <button onClick={() => { if (pass === "scoutech") { setIsAuth(true); setUnlockedTabs(["recruiter_apps", "add_candidate"]); } else { alert("Wrong Password"); } }} className="w-full text-gray-900 py-5 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>
          Login
        </button>
      </div>
    </div>
  );

  if (adminSelectedJob) {
    return (
      <div className="max-w-7xl mx-auto px-4">
         <JobDetailsView job={adminSelectedJob} onBack={() => setAdminSelectedJob(null)} isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="py-10 space-y-10">

      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 px-4 flex-wrap w-full bg-black/20 p-4 rounded-[2rem] border border-white/5">
        <div className="flex flex-wrap justify-center gap-4 flex-1">
          <button onClick={() => handleTabClick("applications")} className={`px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border ${activeTab === "applications" || pendingTab === "applications" ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"}`} style={{ backgroundColor: activeTab === "applications" || pendingTab === "applications" ? themeColors.accentPurple : "" }}>
             Applications{unlockedTabs.includes("applications") ? ` (${applications.length})` : ""}
          </button>
          <button onClick={() => handleTabClick("recruiter_apps")} className={`px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border ${activeTab === "recruiter_apps" && !pendingTab ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"}`} style={{ backgroundColor: activeTab === "recruiter_apps" && !pendingTab ? themeColors.accentPurple : "" }}>
             Recruiter Apps{unlockedTabs.includes("recruiter_apps") ? ` (${applications.filter(a => a.hrRecruiterName && a.hrRecruiterName.trim() !== "").length})` : ""}
          </button>
          <button onClick={() => handleTabClick("add_candidate")} className={`px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border ${activeTab === "add_candidate" || pendingTab === "add_candidate" ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"}`} style={{ backgroundColor: activeTab === "add_candidate" || pendingTab === "add_candidate" ? themeColors.accentPurple : "" }}>
             Add Candidate
          </button>
        </div>

        <div className="hidden md:block w-px h-12 bg-white/10 mx-2"></div>

        <div className="flex flex-wrap justify-center gap-3 opacity-70 hover:opacity-100 transition-opacity mt-4 md:mt-0">
          <button onClick={() => handleTabClick("jobs")} className={`px-4 py-3 text-sm rounded-xl font-bold transition-all border ${activeTab === "jobs" && !pendingTab ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`} style={{ backgroundColor: activeTab === "jobs" && !pendingTab ? themeColors.accentPurple : "" }}>
             Manage Jobs
          </button>
          <button onClick={() => handleTabClick("courses")} className={`px-4 py-3 text-sm rounded-xl font-bold transition-all border ${activeTab === "courses" && !pendingTab ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`} style={{ backgroundColor: activeTab === "courses" && !pendingTab ? themeColors.accentPurple : "" }}>
             Manage Courses{unlockedTabs.includes("courses") ? ` (${courses.length})` : ""}
          </button>
          <button onClick={() => handleTabClick("users")} className={`px-4 py-3 text-sm rounded-xl font-bold transition-all border ${activeTab === "users" || pendingTab === "users" ? "text-gray-900 border-transparent" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`} style={{ backgroundColor: activeTab === "users" || pendingTab === "users" ? themeColors.accentPurple : "" }}>
             Users{unlockedTabs.includes("users") ? ` (${users.length})` : ""}
          </button>
        </div>
      </div>

      {pendingTab && (
        <div className="flex justify-center items-center py-10 px-4 animate-in zoom-in duration-300">
          <div className="p-10 md:p-12 rounded-[3rem] shadow-2xl border border-white/5 w-full max-w-md text-center backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
            <Lock className="mx-auto mb-6 text-[#9966ff]" size={48}/>
            <h2 className="text-2xl font-bold mb-2 text-white">Secure Section</h2>
            <p className="text-gray-400 mb-8 font-medium">Password required to open {pendingTab === "jobs" ? "Manage Jobs" : pendingTab === "courses" ? "Manage Courses" : pendingTab === "applications" ? "Applications" : pendingTab === "add_candidate" ? "Add Candidate" : "Users"}</p>
            <div className="relative mb-6">
               <input type={showSecPass ? "text" : "password"} value={secPass} onChange={(e)=>setSecPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlockTab()} className="w-full bg-white/5 p-5 rounded-2xl text-center font-bold outline-none border border-white/5 focus:bg-white/10 focus:border-[#9966ff] transition-all shadow-sm text-white placeholder:text-gray-500" placeholder="******" />
               <button onClick={()=>setShowSecPass(!showSecPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showSecPass ? <EyeOff size={22}/> : <Eye size={22}/>}</button>
            </div>
            <button onClick={handleUnlockTab} className="w-full text-gray-900 py-5 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>Unlock Tab</button>
          </div>
        </div>
      )}

      {!pendingTab && activeTab === null && (
        <div className="text-center py-20 animate-in fade-in">
           <Lock className="mx-auto mb-6 text-gray-500" size={60}/>
           <h2 className="text-3xl font-black mb-4 text-white">Welcome to Admin Dashboard</h2>
           <p className="text-gray-400 font-bold">Please select a tab to continue.</p>
        </div>
      )}

      {!pendingTab && activeTab === "add_candidate" && (
        <div className="max-w-4xl mx-auto px-4">
           <RecruiterCandidateForm jobs={jobs} onAdded={() => setActiveTab("recruiter_apps")} />
        </div>
      )}

      {!pendingTab && activeTab === "courses" && (
        <div className="space-y-16 animate-in fade-in px-4 text-left">
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/5 backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
            <h2 className="text-3xl font-black mb-10 flex items-center justify-center gap-3 text-white">
              {editingCourseId ? "Edit Course" : "Add New Course"} <BookOpen className="text-gray-900 rounded-lg p-1.5" size={32} style={{ backgroundColor: themeColors.accentPurple }}/>
            </h2>
            <div className="space-y-6">
              <AdminField label="Course Title" value={courseForm.title} placeholder="Training Career Sprint (Academy)" onChange={v => setCourseForm({...courseForm, title: v})}/>
              <AdminField label="Subtitle" value={courseForm.subtitle} placeholder="Online assessment from home followed by a full online course." onChange={v => setCourseForm({...courseForm, subtitle: v})}/>
              <AdminField label="Eligibility" value={courseForm.eligibility} placeholder="Grads / Undergrads / Gap Year / Drop out · Egyptians / Foreigners" onChange={v => setCourseForm({...courseForm, eligibility: v})}/>
              <AdminField label="Course Stages" value={courseForm.stages} placeholder="1- Online Assessment · 2- Online Course" onChange={v => setCourseForm({...courseForm, stages: v})}/>
              <AdminField label="Levels" value={courseForm.levels} placeholder="A1 - C2" onChange={v => setCourseForm({...courseForm, levels: v})}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Commission" value={courseForm.commission} placeholder="50 - 100 EGP" onChange={v => setCourseForm({...courseForm, commission: v})}/>
                <AdminField label="Additional Commission" value={courseForm.additionalCommission} placeholder="Another commission after getting hired" onChange={v => setCourseForm({...courseForm, additionalCommission: v})}/>
              </div>
              <AdminField label="Registration Link" value={courseForm.link} placeholder="https://forms.gle/..." onChange={v => setCourseForm({...courseForm, link: v})}/>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="courseHidden" checked={courseForm.isHidden} onChange={e => setCourseForm({...courseForm, isHidden: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer" />
                <label htmlFor="courseHidden" className="text-sm font-bold text-white cursor-pointer">Hide Course from Public Page</label>
              </div>
              <button disabled={loading} onClick={saveCourse} className="w-full text-gray-900 py-5 rounded-2xl font-bold text-xl flex justify-center items-center gap-3 shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>
                {loading ? <Loader2 className="animate-spin"/> : <Plus size={24}/>} {editingCourseId ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold mb-6 mr-4 text-white">Active Courses</h3>
            {courses.map((course, index) => (
              <div key={course.id} className={`p-6 rounded-3xl shadow-sm border border-white/5 flex flex-col md:flex-row justify-between items-center backdrop-blur-sm gap-4`} style={{ backgroundColor: themeColors.glassCardBg }}>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {course.isHidden && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Hidden</span>}
                    <h4 className="font-bold text-lg text-white">{course.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{course.subtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <span className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl">Eligibility: {course.eligibility}</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl">Levels: {course.levels}</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl">Commission: {course.commission}</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl">Link: {course.link ? <a href={course.link} target="_blank" rel="noreferrer" className="text-[#44aaff] hover:underline">Open</a> : "N/A"}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => editCourse(course)} className="py-3 px-5 rounded-2xl bg-white/5 text-[#9966ff] border border-white/10 font-bold hover:bg-[#9966ff] hover:text-gray-900 transition-all">Edit</button>
                  <button onClick={async () => window.confirm("Delete course?") && await deleteCourse(course.id)} className="py-3 px-5 rounded-2xl bg-red-500/10 text-red-300 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition-all">Delete</button>
                  <button onClick={() => toggleCourseVisibility(course.id, course.isHidden)} className={`py-3 px-5 rounded-2xl font-bold transition-all ${course.isHidden ? 'bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500 hover:text-gray-900' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}>
                    {course.isHidden ? 'Show' : 'Hide'}
                  </button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-12 text-center text-gray-400">No courses yet. Add one using the form above.</div>
            )}
          </div>
        </div>
      )}
      {!pendingTab && activeTab === "jobs" && (
        <div className="space-y-16 animate-in fade-in px-4 text-left">
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/5 backdrop-blur-xl" style={{ backgroundColor: themeColors.glassCardBg }}>
            <h2 className="text-3xl font-black mb-10 flex items-center justify-center gap-3 text-white">
              {editingId ? "Edit Job" : "Add New Job"} <Plus className="text-gray-900 rounded-lg p-1.5" size={32} style={{ backgroundColor: themeColors.accentPurple }}/>
            </h2>
            <div className="space-y-6">
              <AdminField label="Job Title" value={form.title} placeholder="e.g. Sales Expert" onChange={v => setForm({...form, title: v})}/>
              <AdminField label="Company" value={form.company} placeholder="e.g. Concentrix" onChange={v => setForm({...form, company: v})}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Location" value={form.location} placeholder="Maadi" onChange={v => setForm({...form, location: v})}/>
                <AdminField label="Language" value={form.language} placeholder="German" onChange={v => setForm({...form, language: v})}/>
              </div>
              <AdminField label="Salary" value={form.salary} placeholder="13,000 EGP" onChange={v => setForm({...form, salary: v})}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Experience" value={form.experience} placeholder="Entry Level" onChange={v => setForm({...form, experience: v})}/>
                <AdminField label="Shift" value={form.shift} placeholder="Fixed" onChange={v => setForm({...form, shift: v})}/>
              </div>

              <AdminField label="Location Link (Google Maps)" value={form.locationLink} placeholder="https://maps.app.goo.gl/..." onChange={v => setForm({...form, locationLink: v})}/>

              <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5 space-y-4 mt-4">
                <h4 className="font-black text-[#9966ff] flex items-center gap-2"><FileText size={18}/> Mandatory Fields for Applicants</h4>
                <div className="flex flex-col md:flex-row flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <input type="checkbox" checked={form.requireAge} onChange={e => setForm({...form, requireAge: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer"/>
                    Require Age
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <input type="checkbox" checked={form.requireEmail} onChange={e => setForm({...form, requireEmail: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer"/>
                    Require Email Address
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <input type="checkbox" checked={form.requireNationalId} onChange={e => setForm({...form, requireNationalId: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer"/>
                    Require National ID (14 digits)
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <input type="checkbox" checked={form.requireCv} onChange={e => setForm({...form, requireCv: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer"/>
                    Require CV Upload
                  </label>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <h4 className="font-black text-[#44aaff] flex items-center gap-2"><Mic size={18}/> Audio Records Settings</h4>
                <AdminField label="First Record Prompt" value={form.recordOneLabel} placeholder="e.g. Introduce yourself in English..." onChange={v => setForm({...form, recordOneLabel: v})}/>

                <div className="flex items-center gap-3 py-2">
                   <input type="checkbox" id="reqSec" checked={form.requiresSecondRecord} onChange={e => setForm({...form, requiresSecondRecord: e.target.checked})} className="w-5 h-5 accent-green-500 cursor-pointer"/>
                   <label htmlFor="reqSec" className="text-sm font-bold text-white cursor-pointer">Requires Second Audio Record?</label>
                </div>

                {form.requiresSecondRecord && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <AdminField label="Second Record Prompt" value={form.recordTwoLabel} placeholder="e.g. Sell me this pen in German..." onChange={v => setForm({...form, recordTwoLabel: v})}/>
                  </motion.div>
                )}
              </div>

              <textarea value={form.description} placeholder="Job Description" className="w-full bg-white/5 p-5 rounded-2xl h-32 outline-none font-bold shadow-sm border border-white/5 focus:border-[#9966ff] text-white placeholder:text-gray-500 transition-all" onChange={e => setForm({...form, description: e.target.value})}/>
              <textarea value={form.requirements} placeholder="Requirements" className="w-full bg-white/5 p-5 rounded-2xl h-32 outline-none font-bold shadow-sm border border-white/5 focus:border-[#9966ff] text-white placeholder:text-gray-500 transition-all" onChange={e => setForm({...form, requirements: e.target.value})}/>
              <button disabled={loading} onClick={saveJob} className="w-full text-gray-900 py-5 rounded-2xl font-bold text-xl flex justify-center items-center gap-3 shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: themeColors.accentPurple }}>
                {loading ? <Loader2 className="animate-spin"/> : <Plus size={24}/>} {editingId ? "Save Changes" : "Post Job"}
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold mb-6 mr-4 text-white">Active Jobs</h3>
            {jobs.map((j, index) => (
              <div
                key={j.id}
                draggable
                onDragStart={() => setDraggedJobIdx(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
                className={`p-6 rounded-3xl shadow-sm border border-white/5 flex flex-col md:flex-row justify-between items-center backdrop-blur-sm gap-4 transition-all ${draggedJobIdx === index ? 'opacity-50 scale-95 border-[#9966ff]' : ''}`}
                style={{ backgroundColor: themeColors.glassCardBg }}
              >

                <div className="flex gap-4 items-center w-full md:w-auto">
                   <div className="cursor-grab hover:text-white text-gray-500 active:cursor-grabbing p-2" title="Drag to reorder">
                      <GripVertical size={24}/>
                   </div>

                   <div className="flex gap-2">
                     <button onClick={() => toggleJobVisibility(j.id, j.isHidden)} className={`p-3 rounded-2xl transition-all border ${j.isHidden ? 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-gray-900'}`} title={j.isHidden ? "Show on site" : "Hide from site"}>
                        {j.isHidden ? <EyeOff size={20}/> : <Eye size={20}/>}
                     </button>
                     <button onClick={() => {setEditingId(j.id); setForm(j); window.scrollTo({top:0, behavior:"smooth"});}} className="p-3 bg-white/5 text-[#9966ff] border border-white/5 rounded-2xl hover:bg-[#9966ff] hover:text-gray-900 transition-all"><Edit3 size={20}/></button>
                     <button onClick={async () => window.confirm("Are you sure?") && await deleteDoc(doc(db, "jobs", j.id))} className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                   </div>
                </div>

                <div className="text-right w-full md:w-auto">
                  <div className="flex items-center justify-end gap-2">
                    {j.isHidden && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>}
                    <h4 className={`font-bold text-lg ${j.isHidden ? 'text-gray-500 line-through' : 'text-white'}`}>{j.title}</h4>
                  </div>
                  <p className="text-gray-400 font-bold text-sm mt-1">{j.company} • {j.location}</p>
                  <div className="flex flex-col md:flex-row items-end gap-1 md:gap-3 mt-2 text-xs text-gray-500">
                     <span className="flex items-center gap-1"><Clock size={12}/> Posted: {j.createdAt ? formatDateTime(j.createdAt) : "N/A"}</span>
                     {j.updatedAt && <span className="flex items-center gap-1 text-gray-400"><Edit3 size={12}/> Updated: {formatDateTime(j.updatedAt)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!pendingTab && (activeTab === "applications" || activeTab === "recruiter_apps") && (
        <div className="max-w-6xl mx-auto animate-in fade-in px-4 text-left">

          {activeTab === "recruiter_apps" && (
            <div className="mb-8 relative max-w-2xl mx-auto">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9966ff]"><Search size={22}/></div>
               <input
                 type="text"
                 placeholder="Search Recruiter Name or Phone..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/5 p-4 pl-12 rounded-2xl font-bold outline-none border border-white/5 shadow-sm focus:border-[#9966ff] transition-all text-white placeholder:text-gray-500 backdrop-blur-md"
               />
            </div>
          )}

          {activeTab === "applications" && (
            <div className="mb-6 flex justify-end">
               <button onClick={() => setHideRecruiterApps(!hideRecruiterApps)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm border ${hideRecruiterApps ? 'bg-[#9966ff]/10 text-[#9966ff] border-[#9966ff]/30' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}>
                 {hideRecruiterApps ? <EyeOff size={18} /> : <Eye size={18} />} {hideRecruiterApps ? "Show Recruiter Apps" : "Hide Recruiter Apps"}
               </button>
            </div>
          )}

          {(() => {
             let displayedApps = applications;

             if (activeTab === "recruiter_apps") {
                displayedApps = applications.filter(app => app.hrRecruiterName && app.hrRecruiterName.trim() !== "");
                if (searchQuery.trim() !== "") {
                   const q = searchQuery.toLowerCase();
                   displayedApps = displayedApps.filter(app =>
                     (app.hrRecruiterName && app.hrRecruiterName.toLowerCase().includes(q)) ||
                     (app.phone && app.phone.includes(q))
                   );
                }
             } else if (activeTab === "applications") {
                if (hideRecruiterApps) {
                   displayedApps = applications.filter(app => !app.hrRecruiterName || app.hrRecruiterName.trim() === "");
                }
             }

             if (displayedApps.length === 0) {
               return <div className="text-center text-gray-500 font-bold py-20">No matching applications found.</div>;
             }

             return (
               <div className="grid grid-cols-1 gap-6">
                  {displayedApps.map(app => {
                    let displayStatus = ['Accepted', 'Rejected'].includes(app.status) ? app.status : 'New';
                    return (
                    <div key={app.id} className="p-8 rounded-[2.5rem] shadow-sm border border-white/5 relative group hover:shadow-xl transition-all backdrop-blur-md flex flex-col" style={{ backgroundColor: themeColors.glassCardBg }}>

                       <div className="absolute top-8 right-8">
                          {app.englishLevel ? (
                            <span className={`px-4 py-2 rounded-xl text-white font-bold text-sm shadow-md ${
                              ["C1", "C2"].includes(app.englishLevel) ? "bg-green-500 text-gray-900" :
                              ["B1", "B2"].includes(app.englishLevel) ? "bg-[#9966ff] text-gray-900" : "bg-orange-400 text-gray-900"
                            }`}>
                              Level: {app.englishLevel}
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-bold text-sm">Not Rated</span>
                          )}
                       </div>

                       <div className="absolute top-8 left-8">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                              displayStatus === 'Accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              displayStatus === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              'bg-[#9966ff]/20 text-[#9966ff] border-[#9966ff]/30'
                          }`}>
                              {displayStatus}
                          </span>
                       </div>

                       <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12 mb-4">

                          <div
                             onClick={() => {
                               const jobToView = jobs.find(j => j.id === app.jobId);
                               if(jobToView) setAdminSelectedJob(jobToView);
                             }}
                             className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-3xl transition-all group/profile"
                          >
                              <div className="w-16 h-16 rounded-full flex items-center justify-center text-gray-900 font-bold text-2xl transition-colors shadow-md" style={{ backgroundColor: themeColors.accentPurple }}>
                                 {app.name.charAt(0)}
                              </div>
                              <div>
                                 <h3 className="text-2xl font-black transition-colors underline-offset-4 group-hover/profile:underline text-white">
                                   {app.name}
                                 </h3>
                                 <p className="text-sm font-bold mt-1 flex items-center gap-1" style={{ color: themeColors.accentPink }}>
                                    {app.jobTitle} <ExternalLink size={14} className="mb-0.5"/>
                                 </p>
                              </div>
                          </div>

                          <div className="flex-1 space-y-2 mx-4">
                             {activeTab !== "recruiter_apps" && (
                                <div className="space-y-1">
                                  <p className="text-gray-300 font-bold flex items-center gap-2"><Phone size={16} className="text-[#9966ff]"/> {app.phone}</p>
                                  {app.whatsapp && <p className="text-green-400 font-bold flex items-center gap-2"><MessageCircle size={16} className="text-green-400"/> {app.whatsapp}</p>}
                                </div>
                             )}

                             <div className="flex gap-2 mt-2 text-xs text-gray-300 flex-wrap">
                                 {app.age && <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md">Age: {app.age}</span>}
                                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md">Edu: {app.education || (["Student", "Graduate", "Drop-out", "Gap Year"].includes(app.status) ? app.status : "N/A")}</span>
                                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md">Exp: {app.experience}</span>
                                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md">Gender: {app.gender}</span>
                             </div>

                             <div className="mt-3 text-sm font-bold flex items-center gap-2" style={{ color: themeColors.accentPink }}>
                                <User size={14}/>
                                {activeTab === "applications" ? (
                                  editingRecruiter.id === app.id ? (
                                    <div className="flex items-center gap-2">
                                       <input
                                         type="text"
                                         value={editingRecruiter.name}
                                         onChange={e => setEditingRecruiter({ ...editingRecruiter, name: e.target.value })}
                                         className="bg-black/30 text-white px-2 py-1 rounded outline-none border border-white/20 text-xs w-32"
                                         placeholder="Recruiter Name"
                                         autoFocus
                                       />
                                       <button onClick={() => handleUpdateRecruiter(app.id)} className="text-green-400 hover:text-green-300"><CheckCircle size={16}/></button>
                                       <button onClick={() => setEditingRecruiter({ id: null, name: "" })} className="text-red-400 hover:text-red-300"><X size={16}/></button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                       <span>Recruiter: {app.hrRecruiterName || "None"}</span>
                                       <button
                                         onClick={() => setEditingRecruiter({ id: app.id, name: app.hrRecruiterName || "" })}
                                         className="text-gray-400 hover:text-white transition-colors"
                                         title="Edit Recruiter"
                                       >
                                         <Edit3 size={14}/>
                                       </button>
                                    </div>
                                  )
                                ) : (
                                  <span>Recruiter: {app.hrRecruiterName || "None"}</span>
                                )}
                             </div>

                          </div>

                          <div className="w-full md:w-1/3 flex flex-col gap-4">
                               <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col items-center gap-4 shadow-sm">

                                   {/* Audio 1 */}
                                   <div className="w-full">
                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2 text-center">Record 1</span>
                                     {app.audioUrl ? (
                                         <>
                                           <audio controls src={app.audioUrl} className="w-full h-8 invert opacity-90 mb-2" />
                                           <div className="flex gap-4 w-full justify-center">
                                              <button onClick={() => { navigator.clipboard.writeText(app.audioUrl); alert("Audio link copied!"); }} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                                                <Copy size={12}/> Copy Link
                                              </button>
                                              <a href={app.audioUrl?.includes("cloudinary.com") ? app.audioUrl.replace("/upload/", "/upload/fl_attachment/").replace(/\.[a-zA-Z0-9]+$/, ".mp3") : app.audioUrl} download={`${app.name.replace(/\s+/g, '_')}_Audio1.mp3`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                                                <Download size={12}/> Download MP3
                                              </a>
                                           </div>
                                         </>
                                     ) : (
                                         <span className="text-red-400 text-xs font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/10 block text-center">No Audio</span>
                                     )}
                                   </div>

                                   {/* Audio 2 */}
                                   {app.audioUrl2 && (
                                     <div className="w-full border-t border-white/5 pt-3">
                                       <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2 text-center">Record 2</span>
                                       <audio controls src={app.audioUrl2} className="w-full h-8 invert opacity-90 mb-2" />
                                       <div className="flex gap-4 w-full justify-center">
                                          <button onClick={() => { navigator.clipboard.writeText(app.audioUrl2); alert("Audio 2 link copied!"); }} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                                            <Copy size={12}/> Copy Link
                                          </button>
                                          <a href={app.audioUrl2?.includes("cloudinary.com") ? app.audioUrl2.replace("/upload/", "/upload/fl_attachment/").replace(/\.[a-zA-Z0-9]+$/, ".mp3") : app.audioUrl2} download={`${app.name.replace(/\s+/g, '_')}_Audio2.mp3`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                                            <Download size={12}/> Download MP3
                                          </a>
                                       </div>
                                     </div>
                                   )}

                                   <div className="w-full flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                     <Languages size={16} className="text-[#9966ff]"/>
                                     <select
                                       disabled={activeTab === "recruiter_apps"}
                                       className={`w-full p-2 rounded-xl text-sm font-bold border border-white/5 outline-none transition-all shadow-sm ${
                                         activeTab === "recruiter_apps"
                                         ? "bg-transparent text-gray-500 cursor-not-allowed"
                                         : "bg-white/5 text-white cursor-pointer focus:border-[#9966ff]"
                                       }`}
                                       value={app.englishLevel || ""}
                                       onChange={(e) => handleRateEnglish(app.id, e.target.value)}
                                     >
                                       <option className="bg-gray-900" value="" disabled>Rate Level...</option>
                                       <option className="bg-gray-900" value="A1">A1 (Beginner)</option>
                                       <option className="bg-gray-900" value="A2">A2 (Elementary)</option>
                                       <option className="bg-gray-900" value="B1">B1 (Intermediate)</option>
                                       <option className="bg-gray-900" value="B2">B2 (Upper Interm.)</option>
                                       <option className="bg-gray-900" value="C1">C1 (Advanced)</option>
                                       <option className="bg-gray-900" value="C2">C2 (Fluent)</option>
                                     </select>
                                   </div>

                                   <div className="w-full flex items-center gap-2 mt-1">
                                     <CheckCircle size={16} className={
                                        displayStatus === 'Accepted' ? 'text-green-400' :
                                        displayStatus === 'Rejected' ? 'text-red-400' : 'text-gray-500'
                                     }/>
                                     <select
                                       disabled={activeTab === "recruiter_apps"}
                                       className={`w-full p-2 rounded-xl text-sm font-bold border border-white/5 outline-none transition-all shadow-sm ${
                                         activeTab === "recruiter_apps" ? "cursor-not-allowed opacity-70 bg-transparent" : "cursor-pointer focus:border-[#9966ff]"
                                       } ${
                                         displayStatus === 'Accepted' ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                                         displayStatus === 'Rejected' ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                                         'bg-white/5 text-white'
                                       }`}
                                       value={displayStatus}
                                       onChange={(e) => handleAppStatus(app.id, e.target.value)}
                                     >
                                       <option className="bg-gray-900" value="New">Status: New</option>
                                       <option className="bg-gray-900" value="Accepted">Accepted</option>
                                       <option className="bg-gray-900" value="Rejected">Rejected</option>
                                     </select>
                                   </div>
                               </div>
                               {app.cvUrl && (
                                   <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-gray-900 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:opacity-90 transition-colors shadow-md" style={{ backgroundColor: themeColors.accentPurple }}>
                                       <Download size={18}/> View CV
                                   </a>
                               )}
                          </div>

                          {activeTab === "applications" && (
                            <button onClick={async () => window.confirm("Are you sure?") && await deleteDoc(doc(db, "applications", app.id))} className="text-red-400 hover:text-red-300 transition-colors bg-white/5 p-3 rounded-xl border border-white/5 hover:border-red-400/50">
                               <Trash2 size={20} />
                            </button>
                          )}
                       </div>

                       <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={14}/> Applied: {app.appliedAt ? formatDateTime(app.appliedAt) : "N/A"}</span>
                          {app.validatedAt && (
                             <span className="flex items-center gap-1" style={{ color: themeColors.accentPink }}><CheckCircle size={14}/> Validated: {formatDateTime(app.validatedAt)}</span>
                          )}
                       </div>

                    </div>
                  )})}
               </div>
             );
          })()}
        </div>
      )}

      {!pendingTab && activeTab === "users" && (
        <div className="max-w-6xl mx-auto animate-in fade-in px-4 text-left">
          {users.length === 0 ? (
            <div className="text-center text-gray-500 font-bold py-20">No data found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {users.map(user => (
                 <div key={user.id} className="p-8 rounded-[2.5rem] shadow-sm border border-white/5 flex flex-col gap-4 backdrop-blur-md" style={{ backgroundColor: themeColors.glassCardBg }}>
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl shadow-md" style={{ backgroundColor: themeColors.accentPurple }}>
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-white">{user.name}</h3>
                          <p className="text-sm font-bold text-gray-400 flex items-center gap-1"><Mail size={14} className="text-[#44aaff]"/> {user.email}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm font-bold text-gray-300 mt-2">
                       <div className="bg-white/5 border border-white/5 p-2 rounded-xl text-center shadow-sm">📱 {user.phone}</div>
                       <div className="bg-white/5 border border-white/5 p-2 rounded-xl text-center shadow-sm">💬 {user.whatsapp || "N/A"}</div>
                       <div className="col-span-2 bg-white/5 border border-white/5 p-2 rounded-xl text-center shadow-sm">🌍 {user.language}</div>
                       <div className="col-span-2 bg-white/5 border border-white/5 p-2 rounded-xl text-center shadow-sm">💼 {user.experience}</div>
                    </div>
                    {user.cvUrl && (
                        <a href={user.cvUrl} target="_blank" rel="noreferrer" className="bg-[#9966ff]/10 text-[#9966ff] border border-[#9966ff]/20 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-[#9966ff]/20 transition-all shadow-sm mt-2">
                           <FileText size={18}/> View CV
                        </a>
                    )}
                    <button onClick={async () => window.confirm("Are you sure?") && await deleteDoc(doc(db, "users", user.id))} className="text-red-400 text-xs self-end mt-2 hover:text-red-300 underline underline-offset-4">Delete User</button>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanelView;
