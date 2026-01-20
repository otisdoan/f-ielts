import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function Dashboard() {
  return (
    <div className="bg-background-light text-slate-900 min-h-screen font-sans">
      <DashboardHeader />
      <main className="max-w-[1280px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 -white text-3xl font-black tracking-tight">
              Welcome back, Alex!
            </h1>
            <p className="text-slate-500 -slate-400 text-lg">
              You're currently on track for an estimated{" "}
              <span className="text-primary font-bold">Band 7.5</span>. Keep it
              up!
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit cursor-pointer">
            <span className="material-symbols-outlined">play_circle</span>
            Continue Learning
          </button>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white -slate-900 p-6 rounded-2xl border border-slate-200 -slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 -blue-900/20 rounded-lg">
                <span className="material-symbols-outlined text-blue-600">
                  schedule
                </span>
              </div>
              <span className="text-emerald-500 text-xs font-bold">
                +12% this week
              </span>
            </div>
            <p className="text-slate-500 -slate-400 text-sm font-medium mb-1">
              Total Study Time
            </p>
            <p className="text-slate-900 -white  text-2xl font-black">
              42h 15m
            </p>
          </div>
          <div className="bg-white -slate-900 p-6 rounded-2xl border border-slate-200 -slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 -purple-900/20 rounded-lg">
                <span className="material-symbols-outlined text-purple-600">
                  task_alt
                </span>
              </div>
              <span className="text-emerald-500 text-xs font-bold">+3 new</span>
            </div>
            <p className="text-slate-500 -slate-400 text-sm font-medium mb-1">
              Tests Completed
            </p>
            <p className="text-slate-900 -white text-2xl font-black">12</p>
          </div>
          <div className="bg-white -slate-900 p-6 rounded-2xl border border-slate-200 -slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 -orange-900/20 rounded-lg">
                <span className="material-symbols-outlined text-orange-600">
                  menu_book
                </span>
              </div>
              <span className="text-slate-400 text-xs font-bold">Top 5%</span>
            </div>
            <p className="text-slate-500 -slate-400 text-sm font-medium mb-1">
              Vocabulary Mastery
            </p>
            <p className="text-slate-900 -white text-2xl font-black">85%</p>
          </div>
          <div className="bg-white -slate-900 p-6 rounded-2xl border border-slate-200 -slate-800 shadow-sm border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 -primary/10 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  trending_up
                </span>
              </div>
              <span className="text-primary text-xs font-bold">On Track</span>
            </div>
            <p className="text-slate-500 -slate-400 text-sm font-medium mb-1">
              Target Score
            </p>
            <p className="text-slate-900 -white text-2xl font-black">
              Band 8.0
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Progress & Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Progress */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-slate-900 -white text-xl font-bold">
                  Skill Progress
                </h2>
                <a
                  className="text-primary text-sm font-semibold hover:underline"
                  href="#"
                >
                  View Detailed Analysis
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reading */}
                <div className="bg-white -slate-900 p-5 rounded-2xl border border-slate-200 -slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 -slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 -slate-300">
                          import_contacts
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 -white">
                          Reading
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mastered 14/18 topics
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      8.0 Avg
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Overall Completion</span>
                      <span className="text-slate-900 -white">85%</span>
                    </div>
                    <div className="h-2 bg-slate-100 -slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Listening */}
                <div className="bg-white -slate-900 p-5 rounded-2xl border border-slate-200 -slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 -slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 -slate-300">
                          headphones
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 -white">
                          Listening
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mastered 10/18 topics
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      7.5 Avg
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Overall Completion</span>
                      <span className="text-slate-900 -white">70%</span>
                    </div>
                    <div className="h-2 bg-slate-100 -slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Writing */}
                <div className="bg-white -slate-900 p-5 rounded-2xl border border-slate-200 -slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 -slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 -slate-300">
                          edit_note
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 -white">
                          Writing
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mastered 5/18 topics
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      6.5 Avg
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Overall Completion</span>
                      <span className="text-slate-900 -white">45%</span>
                    </div>
                    <div className="h-2 bg-slate-100 -slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Speaking */}
                <div className="bg-white -slate-900 p-5 rounded-2xl border border-slate-200 -slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 -slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 -slate-300">
                          mic
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 -white">
                          Speaking
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mastered 8/18 topics
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      7.0 Avg
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Overall Completion</span>
                      <span className="text-slate-900 -white">60%</span>
                    </div>
                    <div className="h-2 bg-slate-100 -slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Performance Trends */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-slate-900 -white text-xl font-bold">
                  Score Trends
                </h2>
                <div className="flex gap-2">
                  <button className="text-xs font-bold px-3 py-1 bg-white -slate-900 rounded-lg border border-slate-200 -slate-800 cursor-pointer hover:bg-slate-50">
                    1W
                  </button>
                  <button className="text-xs font-bold px-3 py-1 bg-primary text-white rounded-lg cursor-pointer">
                    1M
                  </button>
                  <button className="text-xs font-bold px-3 py-1 bg-white -slate-900 rounded-lg border border-slate-200 -slate-800 cursor-pointer hover:bg-slate-50">
                    3M
                  </button>
                </div>
              </div>
              <div className="bg-white -slate-900 p-6 rounded-2xl border border-slate-200 -slate-800 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Abstract Visual Trend Representation */}
                <div className="absolute inset-0 opacity-10 flex items-end">
                  <div
                    className="w-full h-48 bg-gradient-to-t from-primary to-transparent"
                    style={{
                      clipPath:
                        "polygon(0 80%, 15% 70%, 30% 75%, 45% 60%, 60% 50%, 75% 55%, 90% 40%, 100% 35%, 100% 100%, 0 100%)",
                    }}
                  ></div>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-6xl mb-4">
                  insights
                </span>
                <p className="text-slate-500 max-w-sm relative z-10 font-medium">
                  Your score has improved by 0.5 bands in the last 30 days. Most
                  growth seen in Reading and Speaking.
                </p>
                <div className="mt-6 flex gap-8 relative z-10">
                  <div>
                    <p className="text-2xl font-black text-slate-900 -white">
                      7.0
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Start
                    </p>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-200 -slate-800"></div>
                  <div>
                    <p className="text-2xl font-black text-primary">7.5</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Current
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Right Column: Recent Activity & Recommended */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <section>
              <h2 className="text-slate-900 -white text-xl font-bold mb-4 px-2">
                Recent Activity
              </h2>
              <div className="bg-white -slate-900 rounded-2xl border border-slate-200 -slate-800 overflow-hidden">
                <div className="divide-y divide-slate-100 -slate-800">
                  <div className="p-4 flex gap-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 -emerald-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-600">
                        done_all
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-900 -white">
                        Reading Practice #4
                      </p>
                      <p className="text-xs text-slate-500">
                        Score: 8.5 • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 -blue-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600">
                        visibility
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-900 -white">
                        Video: Essay Structures
                      </p>
                      <p className="text-xs text-slate-500">
                        Watched 80% • 5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber-50 -amber-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-600">
                        edit_square
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-900 -white">
                        Writing Task 2 Draft
                      </p>
                      <p className="text-xs text-slate-500">
                        Submitted for Review • Yesterday
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 -slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">
                        timer
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-900 -white">
                        Vocabulary Drill
                      </p>
                      <p className="text-xs text-slate-500">
                        Completed 50 words • 2 days ago
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full p-4 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-slate-50/50 -slate-800/30 cursor-pointer">
                  View All History
                </button>
              </div>
            </section>
            {/* Recommendation Card */}
            <section>
              <div className="bg-slate-900 -primary/10 rounded-2xl p-6 text-white -primary border border-slate-800 -primary/20 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-20 transform rotate-12">
                  <span className="material-symbols-outlined text-8xl">
                    bolt
                  </span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">
                  Recommended Next
                </p>
                <h3 className="text-xl font-black mb-4">
                  Writing Task 2: Advanced Cohesion
                </h3>
                <p className="text-sm opacity-80 mb-6 leading-relaxed">
                  Boost your Writing score by focusing on linking words and
                  complex paragraph structures.
                </p>
                <button className="w-full bg-white -primary text-slate-900 -white font-bold py-3 rounded-xl text-sm hover:scale-[1.02] transition-transform cursor-pointer">
                  Start Lesson
                </button>
              </div>
            </section>
            {/* Gamification / Daily Goal */}
            <section className="bg-white -slate-900 rounded-2xl border border-slate-200 -slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">
                  local_fire_department
                </span>
                <h3 className="font-bold text-slate-900 -white">Daily Goal</h3>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl font-black">
                  45
                  <span className="text-slate-400 text-sm font-medium">
                    /60 mins
                  </span>
                </p>
                <span className="text-xs font-bold text-primary">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 -slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-orange-500"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium">
                15 more minutes to keep your 5-day streak alive!
              </p>
            </section>
          </div>
        </div>
      </main>
      <footer className="max-w-[1280px] mx-auto py-12 px-4 border-t border-slate-200 -slate-800 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">database</span>
          <p className="text-xs font-bold">
            © 2024 F-IELTS EdTech. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-xs font-bold">
          <a className="hover:text-primary" href="#">
            Support
          </a>
          <a className="hover:text-primary" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary" href="#">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
