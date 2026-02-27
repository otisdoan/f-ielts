import React from "react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch metrics concurrently
  const [
    { count: usersCount },
    { count: readingTestsCount },
    { count: writingPromptsCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('reading_tests').select('*', { count: 'exact', head: true }),
    supabase.from('writing_prompts').select('*', { count: 'exact', head: true })
  ]);

  const totalUsers = usersCount || 0;
  const activeUsers = Math.floor(totalUsers * 0.8); // Mocked for now, depending on presence
  const totalTests = (readingTestsCount || 0) + (writingPromptsCount || 0);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-black text-[#181111] tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-[#896161]">Welcome back. Here's a snapshot of the platform.</p>
        </div>
      </div>
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
          <p className="text-3xl font-bold">{totalUsers.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#896161]">Registered profiles</span>
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
          <p className="text-3xl font-bold">{activeUsers.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#896161]">Estimated engagement</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#e6dbdb] shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-[#896161]">Total Tests & Prompts</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg !text-xl">
              assignment_turned_in
            </span>
          </div>
          <p className="text-3xl font-bold">{totalTests.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#896161]">Reading & Writing</span>
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
            <span className="text-xs text-[#896161]">Platform average</span>
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
    </div>
  );
}
