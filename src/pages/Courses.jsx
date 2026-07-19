import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Globe, Layers, BookOpen, Loader2, Book, Mic, Headphones, MessageCircle, CheckCircle2
} from "lucide-react";
import { themeColors } from "../config/theme";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import englishImage from "./english.png";

// Customer Service syllabus (10 sessions)
const customerServiceSyllabus = [
  {
    title: "Session 1 | Foundations",
    vocabulary: ["Greetings", "Introductions", "Daily Expressions", "Fillers (Well, Actually, Basically...)"],
    speaking: ["Introduce yourself", "Small Talk", "Keep the conversation going"],
    listening: ["Everyday conversations"],
    homework: ["Voice note (2 minutes)", "30 words", "Shadowing"]
  },
  {
    title: "Session 2 | Customer Service Basics",
    grammar: ["Past Simple", "Present Perfect"],
    vocabulary: ["Customer Service Terms", "Polite Language"],
    speaking: ["Greeting customers", "Asking for information", "Clarifying"],
    rolePlay: ["Customer & Agent"]
  },
  {
    title: "Session 3 | Phone English",
    grammar: ["Future Forms", "Modals"],
    vocabulary: ["Telephone Expressions", "Confirming Information"],
    speaking: ["Phone Calls", "Call Opening", "Call Closing"]
  },
  {
    title: "Session 4 | Handling Problems",
    grammar: ["Conditionals"],
    vocabulary: ["Complaints", "Apologizing", "Solutions"],
    rolePlay: ["Angry Customer"]
  },
  {
    title: "Session 5 | Fluency Builder",
    grammar: ["Relative Clauses"],
    vocabulary: ["Phrasal Verbs", "Collocations"],
    speaking: ["Long Conversations"]
  },
  {
    title: "Session 6 | Interview Preparation",
    grammar: ["Narrative Tenses"],
    vocabulary: ["Strengths", "Weaknesses", "Experience"],
    speaking: ["Mock Interview"]
  },
  {
    title: "Session 7 | Advanced Customer Service",
    grammar: ["Passive Voice"],
    vocabulary: ["Difficult Situations", "Escalation"],
    speaking: ["Real Scenarios"]
  },
  {
    title: "Session 8 | Accent & Pronunciation",
    topics: ["Stress", "Intonation", "Connected Speech", "American pronunciation", "Shadowing"]
  },
  {
    title: "Session 9 | Live Simulation",
    topics: ["Complete Call Simulation", "Customer Scenarios", "Speaking Feedback", "Error Correction"]
  },
  {
    title: "Session 10 | Final Assessment",
    assessment: ["Mock Interview", "Mock Customer Call", "Grammar Test", "Vocabulary Test", "Speaking Evaluation", "Personalized feedback"]
  }
];

// Pricing packages (from flyer)
const pricingPackages = {
  generalEnglish: {
    title: "General English",
    note: "5-7 students per session",
    levels: {
      B2: [
        { sessions: 5, price: 1000 },
        { sessions: 7, price: 1500 },
        { sessions: 10, price: 2000 },
        { sessions: 12, price: 3000 }
      ],
      B1: [
        { sessions: 12, price: 3500 }
      ]
    }
  },
  coldCalling: {
    title: "Cold Calling Training",
    feeRange: "2000 - 3000 EGP",
    description: "Speak with Confidence. Connect with Results."
  }
};

function PricingSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2rem] p-6 border border-white/10 bg-white/5 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-4">1 - General English</h3>
          <p className="text-sm text-gray-300 mb-3">{pricingPackages.generalEnglish.note}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-bold text-white mb-2">B2 Level</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {pricingPackages.generalEnglish.levels.B2.map((p, i) => (
                  <li key={i} className="flex justify-between"><span>{p.sessions} Sessions</span><span className="font-black">{p.price} EGP</span></li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-bold text-white mb-2">B1 Level</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {pricingPackages.generalEnglish.levels.B1.map((p, i) => (
                  <li key={i} className="flex justify-between"><span>{p.sessions} Sessions</span><span className="font-black">{p.price} EGP</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] p-6 border border-white/10 bg-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-white mb-3">2 - Cold Calling Training</h3>
            <div className="py-6 px-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm text-gray-300">Course Fee</div>
              <div className="text-2xl font-black text-white mt-2">{pricingPackages.coldCalling.feeRange}</div>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-400">Invest in your future. Speak English. Achieve more.</div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md"
      style={{ backgroundColor: themeColors?.glassCardBg || 'rgba(255,255,255,0.05)' }}
    >
      <div className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] font-black text-[#44aaff]">Training Course</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">{course.title}</h3>
          </div>
          <div className="rounded-3xl bg-white/5 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-bold text-gray-200 shrink-0 border border-white/10">
            {course.levels}
          </div>
        </div>

        {course.subtitle && <p className="text-gray-300 text-sm sm:text-base leading-7">{course.subtitle}</p>}

        <div className="grid grid-cols-1 gap-3 text-sm text-gray-300">
          {course.eligibility && <p><span className="font-bold text-white">Eligibility:</span> {course.eligibility}</p>}
          {course.stages && <p><span className="font-bold text-white">Course Path:</span> {course.stages}</p>}
          {course.commission && <p><span className="font-bold text-white">Commission:</span> {course.commission}</p>}
          {course.additionalCommission && <p><span className="font-bold text-white">Extra:</span> {course.additionalCommission}</p>}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <span className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3 text-sm text-gray-200 border border-white/10">
              <Globe size={16} className="text-[#44aaff]" /> Online from Home
            </span>
            <span className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3 text-sm text-gray-200 border border-white/10">
              <Layers size={16} className="text-[#9966ff]" /> All Levels A1–C2
            </span>
          </div>
          <a
            href={course.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#9966ff] px-6 py-4 font-black text-white transition-all hover:brightness-110 text-sm sm:text-base mt-2"
          >
            Apply Now <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function SubscriptionForm({ courses = [] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(courses && courses.length ? courses[0].id : null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if ((!selectedCourseId || selectedCourseId === null) && courses && courses.length) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const selectedCourse = courses.find(c => c.id === selectedCourseId);
      await addDoc(collection(db, "course_inquiries"), {
        name: name.trim(),
        phone: phone.trim(),
        courseId: selectedCourse?.id || null,
        courseTitle: selectedCourse?.title || "Training Career Sprint (Academy)",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setName("");
      setPhone("");
      setSelectedCourseId(courses && courses.length ? courses[0].id : null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-white mb-2">اختر الكورس</label>
        <select value={selectedCourseId || ""} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-2xl focus:outline-none focus:bg-white/10 focus:border-[#44aaff] transition-all text-sm">
          {courses && courses.length ? (
            courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
          ) : (
            <option value="">Training Career Sprint (Academy)</option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-white mb-2">الاسم</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك"
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 px-4 py-3.5 rounded-2xl focus:outline-none focus:bg-white/10 focus:border-[#44aaff] transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-white mb-2">رقم الهاتف</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+20 10 38993317"
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 px-4 py-3.5 rounded-2xl focus:outline-none focus:bg-white/10 focus:border-[#44aaff] transition-all text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#44aaff] px-7 py-4 font-black text-white hover:brightness-110 transition-all disabled:opacity-50 text-sm mt-2 shadow-lg shadow-blue-500/20"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={18} />}
        {loading ? "جاري الإرسال..." : "سجل اهتمامك الآن"}
      </button>
      {submitted && (
        <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-center text-sm mt-2">
          ✓ تم استقبال طلبك بنجاح.
        </div>
      )}
    </form>
  );
}

export function SyllabusSection() {
  const renderList = (title, icon, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="flex items-center gap-1.5 text-sm font-bold text-white mb-2">
          {icon} {title}
        </h4>
        <ul className="space-y-1.5 ml-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
              <span className="text-[#44aaff] mt-0.5">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const currentSyllabus = customerServiceSyllabus;

  return (
    <div className="space-y-8 mt-16 px-4 sm:px-0">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white">Course Details</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our detailed 10-session plans designed to take your English and professional skills to the next level.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="px-6 py-4 rounded-2xl font-bold bg-[#9966ff] text-white border-[#9966ff] shadow-lg shadow-purple-500/20 text-sm sm:text-base">
          Customer Service & Fluency Course
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={"cs"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentSyllabus.map((session, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/10 transition-colors">
              <div className="bg-white/10 w-fit px-4 py-2 rounded-full mb-6">
                <h3 className="font-black text-white text-sm">{session.title}</h3>
              </div>

              <div className="space-y-2">
                {renderList("Topics", <BookOpen size={16} className="text-[#9966ff]" />, session.topics)}
                {renderList("Grammar", <Book size={16} className="text-[#44aaff]" />, session.grammar)}
                {renderList("Vocabulary", <BookOpen size={16} className="text-[#44aaff]" />, session.vocabulary)}
                {renderList("Speaking", <Mic size={16} className="text-[#25D366]" />, session.speaking)}
                {renderList("Listening", <Headphones size={16} className="text-[#25D366]" />, session.listening)}
                {renderList("Role Play", <MessageCircle size={16} className="text-[#9966ff]" />, session.rolePlay)}
                {renderList("Homework", <CheckCircle2 size={16} className="text-gray-400" />, session.homework)}
                {renderList("Assessment", <CheckCircle2 size={16} className="text-[#ff4444]" />, session.assessment)}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CoursesView({ courses = [], setView }) {
  const visibleCourses = courses.filter((course) => !course.isHidden);

  return (
    <div className="space-y-8 sm:space-y-12 sm:px-4 lg:px-0 pb-20">
      <div 
        className="rounded-none sm:rounded-[3rem] overflow-hidden border-y sm:border border-white/10 shadow-2xl backdrop-blur-xl" 
        style={{ backgroundColor: themeColors?.glassBg || 'rgba(0,0,0,0.5)' }}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
          <div className="p-6 sm:p-10 md:p-14 space-y-12 flex flex-col justify-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#44aaff]/10 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#44aaff] w-fit">
                  <BookOpen size={16} /> Career Sprint Academy
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  Training Career Sprint <br className="hidden lg:block"/> (Academy)
                </h1>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
This course is designed to improve English communication skills for customer service and call center jobs. It focuses on speaking, listening, pronunciation, handling customer inquiries, solving problems professionally, and building confidence in real workplace situations. The course also includes interview preparation and common call center scenarios to help learners become job-ready and increase their employment opportunities                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10"></div>

            <div className="space-y-6">
              <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8">
                <h3 className="text-xl font-black text-white mb-6">سجل اهتمامك الآن وسنتواصل معك</h3>
                <SubscriptionForm courses={visibleCourses} />
              </div>
            </div>

          </div>

          <div className="flex flex-col items-center justify-start bg-black/30 lg:border-l border-white/10">
            <div className="w-full lg:sticky lg:top-10 p-0 sm:p-6 md:p-10 space-y-4">
              <img
                src={englishImage}
                alt="Online training"
                className="w-full h-auto object-contain rounded-none sm:rounded-[2rem] shadow-2xl"
              />

              <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6 text-center mx-auto max-w-sm backdrop-blur-md m-4 sm:m-0">
                <p className="font-bold text-gray-300 text-xs sm:text-sm mb-1">أو للتواصل المباشر:</p>
                <p className="text-2xl sm:text-3xl font-black text-[#44aaff] mb-4 tracking-widest" style={{ direction: 'ltr' }}>
                  01507150999
                </p>
                
                <div className="flex flex-row gap-2 sm:gap-3">
                  <a
                    href="tel:+201507150999"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white px-2 py-2.5 sm:py-3 font-bold transition-all text-xs sm:text-sm"
                  >
                    📞 اتصال
                  </a>
                  <a
                    href="https://wa.me/201507150999"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#25D366] px-2 py-2.5 sm:py-3 font-bold transition-all text-xs sm:text-sm"
                  >
                    💬 واتس أب
                  </a>
                </div>
                <div className="mt-4">
                  <button onClick={() => setView && setView("course_details")} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#44aaff] px-4 py-3 font-black text-white hover:brightness-110 transition-all text-sm">
                    Course Details
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="space-y-6 px-4 sm:px-0 pt-12 border-t border-white/10 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Available Courses</h2>
            <p className="text-sm text-gray-400 mt-2">Browse active training programs you can join today.</p>
          </div>
        </div>

        {visibleCourses.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 sm:p-12 text-center text-sm text-gray-400">
            No courses have been added yet. Use the admin dashboard to publish new training programs.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default CoursesView;
