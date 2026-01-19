
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="bg-background-light font-display min-h-screen font-sans">
      <DashboardHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-40 py-10">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-3 pb-8">
          <div className="flex min-w-72 flex-col gap-1">
            <p className="text-[#181111] -white text-4xl font-black leading-tight tracking-[-0.033em]">
              Master Your Skills
            </p>
            <p className="text-[#896161] -white/60 text-lg font-normal leading-normal">
              Select an IELTS module to begin your targeted practice session.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white -white/5 px-4 py-2 rounded-xl border border-[#e6dbdb] -white/10">
            <span className="material-symbols-outlined text-primary text-sm">
              event
            </span>
            <span className="text-sm font-medium text-[#181111] -white/80">
              Goal: 7.5 Band by Oct 20
            </span>
          </div>
        </div>

        {/* Skill Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {/* Reading Card */}
          <div className="group flex flex-col gap-6 rounded-xl border border-[#e6dbdb] -white/10 bg-white -[#2d1a1a] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  auto_stories
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <svg className="size-16">
                  <circle
                    className="text-[#f4f0f0] -white/5"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="text-primary progress-ring__circle"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="175.92"
                    strokeDashoffset="43.98"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute text-xs font-bold text-[#181111] -white">
                  75%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#181111] -white text-2xl font-bold leading-tight">
                Reading
              </h2>
              <p className="text-[#896161] -white/60 text-base leading-normal">
                Enhance comprehension with academic passages and question-type
                drills.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-semibold text-[#896161] -white/40 uppercase tracking-wider">
                15/20 Lessons
              </span>
              <Link href="/practice/reading">
                <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  Practice Now
                </button>
              </Link>
            </div>
          </div>

          {/* Listening Card */}
          <div className="group flex flex-col gap-6 rounded-xl border border-[#e6dbdb] -white/10 bg-white -[#2d1a1a] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  headphones
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <svg className="size-16">
                    <circle
                    className="text-[#f4f0f0] -white/5"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="text-primary progress-ring__circle"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="175.92"
                    strokeDashoffset="96.75"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute text-xs font-bold text-[#181111] -white">
                  45%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#181111] -white text-2xl font-bold leading-tight">
                Listening
              </h2>
              <p className="text-[#896161] -white/60 text-base leading-normal">
                Improve accuracy across various English accents and complex
                conversations.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-semibold text-[#896161] -white/40 uppercase tracking-wider">
                9/20 Lessons
              </span>
              <Link href="/practice/listening">
                <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  Practice Now
                </button>
              </Link>
            </div>
          </div>

          {/* Writing Card */}
          <div className="group flex flex-col gap-6 rounded-xl border border-[#e6dbdb] -white/10 bg-white -[#2d1a1a] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  edit_note
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <svg className="size-16">
                  <circle
                    className="text-[#f4f0f0] -white/5"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="text-primary progress-ring__circle"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="175.92"
                    strokeDashoffset="140.73"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute text-xs font-bold text-[#181111] -white">
                  20%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#181111] -white text-2xl font-bold leading-tight">
                Writing
              </h2>
              <p className="text-[#896161] -white/60 text-base leading-normal">
                Refine Task 1 and Task 2 structures with real-time grammar
                checking.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-semibold text-[#896161] -white/40 uppercase tracking-wider">
                4/20 Lessons
              </span>
              <Link href="/practice/writing">
                <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  Practice Now
                </button>
              </Link>
            </div>
          </div>

          {/* Speaking Card */}
          <div className="group flex flex-col gap-6 rounded-xl border border-[#e6dbdb] -white/10 bg-white -[#2d1a1a] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  record_voice_over
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <svg className="size-16">
                  <circle
                    className="text-[#f4f0f0] -white/5"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="text-primary progress-ring__circle"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="175.92"
                    strokeDashoffset="158.32"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute text-xs font-bold text-[#181111] -white">
                  10%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#181111] -white text-2xl font-bold leading-tight">
                Speaking
              </h2>
              <p className="text-[#896161] -white/60 text-base leading-normal">
                Practice fluency and pronunciation with interactive AI feedback
                modules.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-semibold text-[#896161] -white/40 uppercase tracking-wider">
                2/20 Lessons
              </span>
              <Link href="/practice/speaking">
                <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  Practice Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Performance Footer Section */}
        <div className="bg-white -[#2d1a1a] rounded-xl border border-[#e6dbdb] -white/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#181111] -white text-xl font-bold">
              Recommended for you
            </h3>
            <a href="#" className="text-primary text-sm font-bold hover:underline">
              View all recommendations
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] flex items-center gap-4 p-4 rounded-lg bg-background-light -white/5 border border-transparent hover:border-primary/20 transition-all cursor-pointer">
              <div className="size-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="text-[#181111] -white font-bold">
                  Vocabulary Drill: Environment
                </p>
                <p className="text-[#896161] -white/60 text-sm">
                  Targeting your weak area in Speaking
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-[300px] flex items-center gap-4 p-4 rounded-lg bg-background-light -white/5 border border-transparent hover:border-primary/20 transition-all cursor-pointer">
              <div className="size-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <p className="text-[#181111] -white font-bold">
                  Mock Test #4 Analysis
                </p>
                <p className="text-[#896161] -white/60 text-sm">
                  Review common errors in Reading
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto border-t border-[#e6dbdb] -white/10 py-10 px-4 md:px-10 lg:px-40 opacity-60">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">database</span>
                <p className="text-xs font-bold">© 2024 F-IELTS EdTech. All rights reserved.</p>
            </div>
            <div className="flex gap-8 text-[#896161] -white/40 text-sm font-medium">
                <a className="hover:text-primary" href="#">Help Center</a>
                <a className="hover:text-primary" href="#">Terms of Service</a>
                <a className="hover:text-primary" href="#">Privacy Policy</a>
                <a className="hover:text-primary" href="#">Community</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
