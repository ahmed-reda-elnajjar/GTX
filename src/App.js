import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LayoutGrid, LogIn, Loader2 } from "lucide-react";
import { db, auth } from "./firebase";
import { collection, onSnapshot, query, updateDoc, doc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { themeColors } from "./config/theme";
import GTXLogo from "./components/GTXLogo";
import UserProfileModal from "./components/UserProfileModal";
import Footer from "./components/Footer";
import HomeView from "./pages/Home";
import LoginView from "./pages/Login";
import RecommendedJobsView from "./pages/Recommended";
import JobsListView from "./pages/JobsList";
import JobDetailsView from "./pages/JobDetails";
import ApplicationPage from "./pages/Application";
import AdminPanelView from "./pages/Admin";
import CoursesView from "./pages/Courses";
import "./index.css";

// Apply saved theme immediately to prevent flash
document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('gtxTheme') === 'light' ? 'light' : 'dark'
);

export default function App() {
  const [view, setView] = useState("home");
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ language: "all", location: "all" });

  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);

  const [isDark, setIsDark] = useState(() => localStorage.getItem('gtxTheme') !== 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('gtxTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const savedUser = localStorage.getItem("egyptHireUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    signInAnonymously(auth).catch(console.error);
    document.documentElement.dir = "ltr";
  }, []);

  useEffect(() => {
    const q = query(collection(db, "jobs"));
    const unsub = onSnapshot(q, (snapshot) => {
      let fetchedJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      fetchedJobs.sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        if (orderA !== orderB) return orderA - orderB;

        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setJobs(fetchedJobs);
      setLoading(false);

      const locs = [...new Set(fetchedJobs.map(j => j.location?.trim()).filter(Boolean))];
      const langs = [...new Set(fetchedJobs.map(j => j.language?.trim()).filter(Boolean))];
      setUniqueLocations(locs);
      setUniqueLanguages(langs);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "courses"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedCourses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedCourses.sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        return orderA - orderB;
      });
      setCourses(fetchedCourses);
    });
    return () => unsub();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (job.isHidden && view !== "admin") return false;

    if (view === "recommended" && currentUser) {
      const userLang = currentUser.language?.toLowerCase().trim();
      const jobLang = job.language?.toLowerCase().trim();
      return currentUser.language === "all" || (jobLang && jobLang.includes(userLang));
    }
    const langMatch = filters.language === "all" || job.language?.toLowerCase().includes(filters.language.toLowerCase());
    const locMatch = filters.location === "all" || job.location?.toLowerCase().includes(filters.location.toLowerCase());
    return langMatch && locMatch;
  });

  const handleFastApply = () => {
    if (currentUser) {
      setView("recommended");
    } else {
      setView("login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("egyptHireUser");
    setCurrentUser(null);
    setShowProfileModal(false);
    setView("home");
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, updatedData);
      const newUser = { ...currentUser, ...updatedData };
      setCurrentUser(newUser);
      localStorage.setItem("egyptHireUser", JSON.stringify(newUser));
      alert("Updated successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: themeColors.mainBgGradient }}>
        <Loader2 size={60} className="animate-spin text-[#9966ff]" />
        <p className="font-bold text-lg animate-pulse" style={{ color: themeColors.accentPurple }}>Loading Jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans text-left transition-all duration-500" style={{ background: themeColors.mainBgGradient }}>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 border-b border-white/5 sticky top-0 z-50 shadow-xl backdrop-blur-2xl"
        style={{ backgroundColor: themeColors.glassBg }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
              <GTXLogo className="h-12 w-auto" />
            </div>
            <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
              <button onClick={() => setView("home")} className={view === "home" ? "border-b-2 pb-1 text-white" : "hover:text-white transition-colors"} style={{ borderColor: view === "home" ? themeColors.accentPurple : "transparent" }}>Home</button>
              <button onClick={() => setView("jobs")} className={view === "jobs" ? "border-b-2 pb-1 text-white" : "hover:text-white transition-colors"} style={{ borderColor: view === "jobs" ? themeColors.accentPurple : "transparent" }}>Find Jobs</button>
              <button onClick={() => setView("courses")} className={view === "courses" ? "border-b-2 pb-1 text-white" : "hover:text-white transition-colors"} style={{ borderColor: view === "courses" ? themeColors.accentPurple : "transparent" }}>Courses</button>

              {currentUser && (
                <button onClick={() => setView("recommended")} className={view === "recommended" ? "border-b-2 pb-1 text-white" : "hover:text-white transition-colors"} style={{ borderColor: view === "recommended" ? themeColors.accentPurple : "transparent" }}>Recommended</button>
              )}
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            {!currentUser ? (
              <motion.button whileHover={{ scale: 1.1, color: themeColors.accentPurple }} whileTap={{ scale: 0.9 }} onClick={() => setView("login")} className="text-gray-300 hover:text-white transition-colors p-2 rounded-full" title="Login"><LogIn size={24} /></motion.button>
            ) : (
               <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShowProfileModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 font-bold cursor-pointer shadow-lg transition-colors border-2 border-[#9966ff]/50" style={{ backgroundColor: themeColors.accentPurple }}>{currentUser.name.charAt(0).toUpperCase()}</motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(d => !d)}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, color: themeColors.accentPurple }} whileTap={{ scale: 0.9 }} onClick={() => setView("admin")} className="text-gray-300 hover:text-white transition-colors p-2 rounded-full" title="Admin Panel"><LayoutGrid size={24} /></motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {showProfileModal && currentUser && (
           <UserProfileModal user={currentUser} onClose={() => setShowProfileModal(false)} onLogout={handleLogout} onUpdate={handleUpdateProfile}/>
        )}
        <motion.main key={view} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto px-4 py-8 min-h-[70vh]">
          {view === "home" && <HomeView setView={setView} onFastApply={handleFastApply} jobs={jobs} currentUser={currentUser} onViewDetails={(j) => { setSelectedJob(j); setView("details"); }} />}
          {view === "jobs" && <JobsListView jobs={filteredJobs} filters={filters} setFilters={setFilters} onViewDetails={(j) => { setSelectedJob(j); setView("details"); }} locations={uniqueLocations} languages={uniqueLanguages} />}
          {view === "recommended" && <RecommendedJobsView jobs={filteredJobs} user={currentUser} onViewDetails={(j) => { setSelectedJob(j); setView("details"); }} />}
          {view === "details" && <JobDetailsView job={selectedJob} onBack={() => setView("jobs")} onApply={() => setView("apply")} />}
          {view === "apply" && <ApplicationPage job={selectedJob} onBack={() => setView("details")} user={currentUser} />}
          {view === "login" && <LoginView onLogin={(user) => { setCurrentUser(user); setView("recommended"); }} availableLanguages={uniqueLanguages} />}
          {view === "courses" && <CoursesView courses={courses} />}
          {view === "admin" && <AdminPanelView jobs={jobs} />}
        </motion.main>
      </AnimatePresence>
      <Footer setView={setView} />
    </div>
  );
}
