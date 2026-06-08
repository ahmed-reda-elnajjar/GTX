import React from "react";

function AdminField({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-2 text-left w-full">
      <label className="block text-sm font-bold text-gray-400 mr-2 uppercase tracking-wide">{label}</label>
      <input
        className="w-full bg-white/5 p-4 rounded-2xl outline-none font-bold text-left shadow-sm border border-white/5 focus:border-[#9966ff] text-white placeholder:text-gray-600 transition-all"
        value={value || ""}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default AdminField;
