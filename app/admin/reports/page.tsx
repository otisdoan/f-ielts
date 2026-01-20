
import React from 'react';

export default function AdminReportsPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-8 max-w-[1440px] mx-auto w-full">
      {/* PageHeading */}
      <div className="flex flex-wrap justify-between items-end gap-3 bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-1">
          <p className="text-[#181111] text-3xl font-black leading-tight tracking-tight">Analytics &amp; Reports</p>
          <p className="text-[#896161] text-sm font-normal">Detailed performance insights for the last 6 months across all user cohorts.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">
             <span className="material-symbols-outlined text-lg">filter_list</span>
             Filter View
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">
             <span className="material-symbols-outlined text-lg">ios_share</span>
             Export Data
          </button>
        </div>
      </div>

       {/* Stats Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200 bg-white">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Active Users</p>
            <div className="flex items-baseline gap-2">
                <p className="text-[#181111] tracking-tight text-2xl font-black">12,450</p>
                <p className="text-[#078807] text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span>12%</p>
            </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200 bg-white">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Avg. Band Score</p>
            <div className="flex items-baseline gap-2">
                <p className="text-[#181111] tracking-tight text-2xl font-black">6.5</p>
                <p className="text-[#078807] text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span>0.2</p>
            </div>
        </div>
         <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200 bg-white">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Completion Rate</p>
            <div className="flex items-baseline gap-2">
                <p className="text-[#181111] tracking-tight text-2xl font-black">78%</p>
                <p className="text-primary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_downward</span>5%</p>
            </div>
        </div>
         <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200 bg-white">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Active Sessions</p>
            <div className="flex items-baseline gap-2">
                <p className="text-[#181111] tracking-tight text-2xl font-black">3,200</p>
                <p className="text-[#078807] text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span>8%</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
           <h3 className="text-lg font-bold mb-4">Average Band Score Trends</h3>
           <div className="h-64 bg-slate-50 flex items-center justify-center rounded-lg border border-dashed border-slate-300">
              <span className="text-slate-400 font-medium">Chart Visualization Placeholder</span>
           </div>
        </div>
        {/* Pie Chart Area */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
           <h3 className="text-lg font-bold mb-4">Skill Engagement</h3>
            <div className="h-64 bg-slate-50 flex items-center justify-center rounded-lg border border-dashed border-slate-300">
               <span className="text-slate-400 font-medium">Pie Chart Placeholder</span>
            </div>
        </div>
      </div>
    </div>
  );
}
