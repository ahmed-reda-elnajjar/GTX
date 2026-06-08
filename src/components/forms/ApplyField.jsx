import React from "react";

function ApplyField({ label, icon, placeholder, onChange, value, type = "text", required = true, pattern, title }) {
  return (
    <div className="space-y-2 text-left w-full">
      <label className="block text-xs font-black text-gray-400 uppercase mr-2 tracking-wide">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
        <input
          type={type}
          required={required}
          value={value || ""}
          pattern={pattern}
          title={title}
          className="w-full bg-white/5 p-5 pr-14 rounded-3xl font-bold outline-none border border-white/5 focus:bg-white/10 focus:border-[#9966ff] transition-all text-left shadow-sm text-white placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ApplyField;
