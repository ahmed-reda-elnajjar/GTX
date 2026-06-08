import React from "react";
import { themeColors } from "../config/theme";
import JobsListView from "./JobsList";

function RecommendedJobsView({ jobs, user, onViewDetails }) {
  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="text-gray-900 p-8 rounded-[3rem] shadow-xl text-center relative overflow-hidden" style={{ backgroundColor: themeColors.accentPurple }}>
          <div className="relative z-10">
             <h2 className="text-3xl font-black mb-2">Hello, {user.name.split(" ")[0]}! 🚀</h2>
             <p className="opacity-90 font-bold">Experience: {user.experience} • Language: {user.language}</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-50"></div>
       </div>

       {jobs.length > 0 ? (
         <JobsListView jobs={jobs} filters={{language: "all", location: "all"}} setFilters={()=>{}} onViewDetails={onViewDetails} hideFilters={true} />
       ) : (
         <div className="text-center py-20 text-gray-400 font-bold">
            No recommended jobs found.
         </div>
       )}
    </div>
  );
}

export default RecommendedJobsView;
