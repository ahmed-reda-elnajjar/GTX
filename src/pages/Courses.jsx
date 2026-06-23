import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link as ArrowRight, Globe, Layers, BookOpen, Loader2 } from "lucide-react";
import { themeColors } from "../config/theme";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import englishImage from "./english.png";

function CourseCard({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md"
      style={{ backgroundColor: themeColors.glassCardBg }}
    >
      <div className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] font-black text-[#44aaff]">Training Course</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">{course.title}</h3>
          </div>
          <div className="rounded-3xl bg-white/5 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-bold text-gray-200 shrink-0">
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

        <div className="flex flex-col gap-3">
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
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#9966ff] px-6 py-4 font-black text-white transition-all hover:brightness-110 text-sm sm:text-base"
          >
            Apply Now <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function SubscriptionForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "course_inquiries"), {
        name: name.trim(),
        phone: phone.trim(),
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setName("");
      setPhone("");
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
        <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-center text-sm">
          ✓ تم استقبال طلبك بنجاح.
        </div>
      )}
    </form>
  );
}

function CoursesView({ courses = [] }) {
  const visibleCourses = courses.filter((course) => !course.isHidden);

  return (
    <div className="space-y-8 sm:space-y-12 sm:px-4 lg:px-0">
      
      {/* 
        Main Hero Container 
      */}
      <div 
        className="rounded-none sm:rounded-[3rem] overflow-hidden border-y sm:border border-white/10 shadow-2xl backdrop-blur-xl" 
        style={{ backgroundColor: themeColors.glassBg }}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
          
          {/* ================= LEFT COLUMN: Texts, Details & Form ================= */}
          <div className="p-6 sm:p-10 md:p-14 space-y-12 flex flex-col justify-start">
            
            {/* Header & Info section */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#44aaff]/10 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#44aaff] w-fit">
                  <BookOpen size={16} /> Career Sprint Academy
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  Training Career Sprint <br className="hidden lg:block"/> (Academy)
                </h1>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  Online assessment from home followed by a full online course. This training is available for graduates, undergraduates, gap year students, and dropouts — both Egyptians and foreigners.
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="font-black text-white mb-3 text-lg">Eligibility</p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#44aaff]"></div> Grads / Undergrads</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#44aaff]"></div> Gap Year / Drop out</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#44aaff]"></div> Egyptians / Foreigners</li>
                  </ul>
                </div>

                <div className="rounded-3xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="font-black text-white mb-3 text-lg">What You Get</p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9966ff]"></div> 1- Online Assessment</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9966ff]"></div> 2- Online Course</li>
                  </ul>
                </div>

                <div className="rounded-3xl bg-white/5 p-6 border border-white/10 sm:col-span-2 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <p className="font-black text-white text-lg">Course Level</p>
                  <span className="px-4 py-1.5 bg-white/10 rounded-full text-white font-bold text-sm">A1 - C2</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/10"></div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8">
                <h3 className="text-xl font-black text-white mb-6">سجل اهتمامك الآن وسنتواصل معك</h3>
                <SubscriptionForm />
              </div>
            </div>

          </div>


          {/* ================= RIGHT COLUMN: Image & Compact Contact Section ================= */}
          <div className="flex flex-col items-center justify-start bg-black/30 lg:border-l border-white/10">
            {/* الحاوية ثابتة Sticky لتبقى ظاهرة أثناء النزول */}
            <div className="w-full lg:sticky lg:top-10 p-0 sm:p-6 md:p-10 space-y-4">
              
              {/* Image */}
              <img
                src={englishImage}
                alt="Online training"
                className="w-full h-auto object-contain rounded-none sm:rounded-[2rem] shadow-2xl"
              />

              {/* Compact Contact Section */}
              <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6 text-center mx-auto max-w-sm backdrop-blur-md m-4 sm:m-0">
                <p className="font-bold text-gray-300 text-xs sm:text-sm mb-1">أو للتواصل المباشر:</p>
                <p className="text-2xl sm:text-3xl font-black text-[#44aaff] mb-4 tracking-widest">01099119352</p>
                
                <div className="flex flex-row gap-2 sm:gap-3">
                  <a
                    href="tel:+201099119352"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white px-2 py-2.5 sm:py-3 font-bold transition-all text-xs sm:text-sm"
                  >
                    📞 اتصال
                  </a>
                  <a
                    href="https://wa.me/201099119352"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#25D366] px-2 py-2.5 sm:py-3 font-bold transition-all text-xs sm:text-sm"
                  >
                    💬 واتس أب
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= Bottom Section: Course Cards ================= */}
      <div className="space-y-6 px-4 sm:px-0 mt-12">
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