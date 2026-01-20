
"use client";

import React, { useState } from "react";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  
  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-[#896161]">Total Users</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg !text-xl">
              group
            </span>
          </div>
          <p className="text-3xl font-bold">12,450</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-600 text-sm font-bold flex items-center">
              <span className="material-symbols-outlined !text-sm">trending_up</span>{" "}
              +5.2%
            </span>
            <span className="text-xs text-[#896161]">from last month</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-[#896161]">Active Users</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg !text-xl">
              bolt
            </span>
          </div>
          <p className="text-3xl font-bold">3,210</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-600 text-sm font-bold flex items-center">
              <span className="material-symbols-outlined !text-sm">trending_up</span>{" "}
              +2.1%
            </span>
            <span className="text-xs text-[#896161]">currently online</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-[#896161]">Total Tests</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg !text-xl">
              assignment_turned_in
            </span>
          </div>
          <p className="text-3xl font-bold">45,800</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-600 text-sm font-bold flex items-center">
              <span className="material-symbols-outlined !text-sm">trending_up</span>{" "}
              +12%
            </span>
            <span className="text-xs text-[#896161]">all categories</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-[#896161]">Avg Band Score</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg !text-xl">
              grade
            </span>
          </div>
          <p className="text-3xl font-bold">6.5</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-red-600 text-sm font-bold flex items-center">
              <span className="material-symbols-outlined !text-sm">trending_down</span>{" "}
              -0.1
            </span>
            <span className="text-xs text-[#896161]">platform average</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart (SVG) */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">User Growth</h3>
              <p className="text-xs text-[#896161]">
                User acquisitions over the last 6 months
              </p>
            </div>
            <select className="bg-background-light border-none rounded-lg text-xs font-semibold py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col justify-end min-h-[220px]">
             {/* Static SVG Chart Copied from HTML */}
            <svg
              className="w-full h-auto overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 500 150"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#ec1313", stopOpacity: 0.2 }}></stop>
                  <stop offset="100%" style={{ stopColor: "#ec1313", stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
              <path
                d="M0,120 Q50,110 80,60 T160,80 T240,40 T320,70 T400,20 T500,50 L500,150 L0,150 Z"
                fill="url(#gradient)"
              ></path>
              <path
                d="M0,120 Q50,110 80,60 T160,80 T240,40 T320,70 T400,20 T500,50"
                fill="none"
                stroke="#ec1313"
                strokeWidth="3"
              ></path>
            </svg>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-[#896161] uppercase tracking-wider">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Attempts by Skill (Bars) */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">Attempts by Skill</h3>
              <p className="text-xs text-[#896161]">
                Most practiced IELTS modules
              </p>
            </div>
            <span className="text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded">
              Live Data
            </span>
          </div>
          <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[220px]">
            {/* Listening */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-background-light rounded-t-lg relative h-32 group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-lg transition-all h-[40%]"
                  title="40%"
                ></div>
              </div>
              <span className="text-[10px] font-bold text-[#896161] uppercase">
                Listening
              </span>
            </div>
            {/* Reading */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-background-light rounded-t-lg relative h-32 group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-lg transition-all h-[65%]"
                  title="65%"
                ></div>
              </div>
              <span className="text-[10px] font-bold text-[#896161] uppercase">
                Reading
              </span>
            </div>
            {/* Writing */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-background-light rounded-t-lg relative h-32 group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all h-[95%]"
                  title="95%"
                ></div>
              </div>
              <span className="text-[10px] font-bold text-[#896161] uppercase">
                Writing
              </span>
            </div>
            {/* Speaking */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-background-light rounded-t-lg relative h-32 group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-lg transition-all h-[30%]"
                  title="30%"
                ></div>
              </div>
              <span className="text-[10px] font-bold text-[#896161] uppercase">
                Speaking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#e6dbdb] flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Test Activity</h3>
          <button className="text-primary text-sm font-bold hover:underline cursor-pointer">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-light/50 text-[#896161] font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Test Module</th>
                <th className="px-6 py-3">Date Completed</th>
                <th className="px-6 py-3">Band Score</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dbdb]">
              <tr className="hover:bg-background-light/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                        SV
                    </div>
                    <span className="font-semibold">Siddharth Varma</span>
                  </div>
                </td>
                <td className="px-6 py-4">Academic Writing #12</td>
                <td className="px-6 py-4 text-[#896161]">Oct 24, 2023 - 14:20</td>
                <td className="px-6 py-4 font-bold text-primary">7.5</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Evaluated
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#896161] hover:text-primary">
                    <span className="material-symbols-outlined !text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
             {/* Rows truncated for brevity in demo */}
              <tr className="hover:bg-background-light/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                        ET
                    </div>
                    <span className="font-semibold">Emma Thompson</span>
                  </div>
                </td>
                <td className="px-6 py-4">General Reading #4</td>
                <td className="px-6 py-4 text-[#896161]">Oct 24, 2023 - 11:05</td>
                <td className="px-6 py-4 font-bold text-primary">6.0</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Evaluated
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#896161] hover:text-primary">
                    <span className="material-symbols-outlined !text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
