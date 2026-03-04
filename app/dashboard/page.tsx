import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDictionary, Language } from "@/lib/i18n";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Lấy data profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "Learner";

  const cookieStore = await cookies();
  const lang = (cookieStore.get("preferred_language")?.value as Language) || "en";
  const dict = getDictionary(lang);

  // === Study Intensity: đếm số lần attempt của user theo ngày trong tuần ===
  // Xác định phạm vi ngày của tuần hiện tại (Mon-Sun) và tuần trước
  const now = new Date();
  // Tính ngày đầu tuần (Thứ Hai)
  const dayOfWeek = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - daysFromMonday);
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  // Fetch tất cả attempt trong 2 tuần gần nhất
  const [{ data: testAttempts }, { data: readingAttempts }] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("submitted_at")
      .eq("user_id", user.id)
      .gte("submitted_at", lastWeekStart.toISOString())
      .lt("submitted_at", thisWeekEnd.toISOString()),
    supabase
      .from("reading_test_attempts")
      .select("submitted_at")
      .eq("user_id", user.id)
      .gte("submitted_at", lastWeekStart.toISOString())
      .lt("submitted_at", thisWeekEnd.toISOString()),
  ]);

  // Gom tất cả submitted_at lại
  const allAttempts = [
    ...(testAttempts ?? []),
    ...(readingAttempts ?? []),
  ];

  // Đếm theo từng ngày trong tuần hiện tại (0=Mon, 6=Sun)
  const weekDayCount = [0, 0, 0, 0, 0, 0, 0]; // Mon..Sun
  let lastWeekTotal = 0;
  let thisWeekTotal = 0;

  for (const a of allAttempts) {
    const d = new Date(a.submitted_at);
    if (d >= thisWeekStart && d < thisWeekEnd) {
      const wd = d.getDay(); // 0=Sun
      const idx = wd === 0 ? 6 : wd - 1; // convert Sun=0 -> idx=6
      weekDayCount[idx]++;
      thisWeekTotal++;
    } else {
      lastWeekTotal++;
    }
  }

  // Tính % thay đổi so tuần trước
  let changePercent: number | null = null;
  if (lastWeekTotal > 0) {
    changePercent = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
  } else if (thisWeekTotal > 0) {
    changePercent = 100;
  }

  const maxCount = Math.max(...weekDayCount, 1); // tránh chia 0

  return (
    <div className="dashboard-body-bg text-slate-900 min-h-screen font-sans flex flex-col">
      <DashboardHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* HERO BANNER */}
        <div className="mb-12 relative overflow-hidden glass-card rounded-[32px] p-12 flex flex-col items-center text-center bg-gradient-to-br from-white/80 via-white/40 to-red-50/30">
          <div className="absolute inset-0 z-0">
            <span className="material-symbols-outlined floating-icon text-6xl text-primary/40 -top-4 left-10 rotate-12">menu_book</span>
            <span className="material-symbols-outlined floating-icon text-5xl text-blue-400/30 top-1/4 right-12 -rotate-12">headphones</span>
            <span className="material-symbols-outlined floating-icon text-7xl text-amber-400/30 bottom-10 left-1/4 rotate-45">mic_external_on</span>
            <span className="material-symbols-outlined floating-icon text-5xl text-emerald-400/30 top-10 right-1/4 rotate-12">public</span>
            <span className="material-symbols-outlined floating-icon text-6xl text-red-400/30 bottom-1/4 left-12 -rotate-12">school</span>
            <span className="material-symbols-outlined floating-icon text-4xl text-slate-300 top-1/2 left-[15%]">description</span>
            <span className="material-symbols-outlined floating-icon text-5xl text-slate-300 bottom-1/2 right-[15%]">edit_square</span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {dict.welcomeBack}, {firstName}!
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 leading-relaxed">
              {dict.onTrack} {dict.band} 7.5. Keep it up!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-primary/20 group cursor-pointer">
                <span>{dict.continueLearning}</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
              </button>
              <button className="bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 px-8 py-4 rounded-3xl font-bold hover:bg-white transition-all shadow-lg shadow-slate-200/50 cursor-pointer">
                {dict.viewAnalysis || "View Route"}
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-7 space-y-8">

            {/* Performance Metrics & Info Boxes */}
            <div className="glass-card rounded-[32px] p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col xl:flex-row items-center gap-10">
                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                  <svg className="gauge-svg w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-primary" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset="69" strokeLinecap="round" strokeWidth="10"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">7.5</span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Band Score</span>
                  </div>
                </div>
                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Performance Metrics</h3>
                    <p className="text-slate-500 text-sm">Estimated based on your last 5 practice sessions.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 p-4 rounded-3xl border border-white">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{dict.listening}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">8.0</span>
                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-3xl border border-white">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{dict.reading}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">7.5</span>
                        <span className="material-symbols-outlined text-slate-300 text-sm">horizontal_rule</span>
                      </div>
                    </div>
                    <div className="bg-red-50/50 p-4 rounded-3xl border border-red-100">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{dict.writing}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">6.5</span>
                        <span className="material-symbols-outlined text-red-500 text-sm">priority_high</span>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-3xl border border-white">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{dict.speaking}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">7.0</span>
                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Study Intensity */}
            <div className="glass-card rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{dict.studyIntensity}</h3>
                  <p className="text-slate-500 text-sm">{dict.dailyPracticeHours}</p>
                </div>
                <div className="flex items-center gap-3">
                  {changePercent !== null ? (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${changePercent >= 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                        }`}
                    >
                      {changePercent >= 0 ? "+" : ""}{changePercent}% {dict.vsLastWeek}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-bold">
                      {dict.noActivity}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-end justify-between h-40 gap-4">
                {([
                  { key: "mon", label: dict.dayMon },
                  { key: "tue", label: dict.dayTue },
                  { key: "wed", label: dict.dayWed },
                  { key: "thu", label: dict.dayThu },
                  { key: "fri", label: dict.dayFri },
                  { key: "sat", label: dict.daySat },
                  { key: "sun", label: dict.daySun },
                ] as const).map((day, idx) => {
                  const count = weekDayCount[idx];
                  // Độ cao tối thiểu 8% nếu có dữ liệu, 4% nếu không
                  const heightPct = count > 0 ? Math.max(8, Math.round((count / maxCount) * 90)) : 4;
                  // ngày hiện tại
                  const isToday = idx === (daysFromMonday);
                  const isActive = count > 0;
                  return (
                    <div key={day.key} className="flex-1 flex flex-col items-center gap-3 group/bar relative">
                      {/* Tooltip */}
                      {count > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                            {count} {dict.attempts}
                          </div>
                          <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                        </div>
                      )}
                      <div
                        className={`w-full rounded-lg transition-all duration-300 ${isActive
                          ? isToday
                            ? "bg-primary shadow-lg shadow-primary/30 hover:bg-red-600"
                            : "bg-primary/70 hover:bg-primary"
                          : isToday
                            ? "bg-slate-200 ring-2 ring-primary/30"
                            : "bg-slate-100 hover:bg-primary/20"
                          }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase ${isToday ? "text-primary" : "text-slate-400"
                          }`}
                      >
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Tổng hoạt động trong tuần */}
              {thisWeekTotal > 0 && (
                <p className="text-xs text-slate-400 mt-4 text-center">
                  {thisWeekTotal} {dict.attempts} {lang === "vi" ? "trong tuần này" : "this week"}
                </p>
              )}
            </div>

            {/* Skill Progress (KEPT FROM ORIGINAL) */}
            <section className="glass-card rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-slate-900 text-xl font-bold">
                  {dict.skillProgress}
                </h2>
                <a className="text-primary text-sm font-semibold hover:underline" href="#">
                  {dict.viewAnalysis}
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reading */}
                <div className="bg-white/60 p-5 rounded-2xl border border-white/80 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-slate-600">import_contacts</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{dict.reading}</h3>
                        <p className="text-xs text-slate-500">{dict.mastered} 14/18 {dict.topics}</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      8.0 {dict.avg}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{dict.overallCompletion}</span>
                      <span className="text-slate-900">85%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
                {/* Listening */}
                <div className="bg-white/60 p-5 rounded-2xl border border-white/80 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-slate-600">headphones</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{dict.listening}</h3>
                        <p className="text-xs text-slate-500">{dict.mastered} 10/18 {dict.topics}</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      7.5 {dict.avg}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{dict.overallCompletion}</span>
                      <span className="text-slate-900">70%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                </div>
                {/* Writing */}
                <div className="bg-white/60 p-5 rounded-2xl border border-white/80 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-slate-600">edit_note</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{dict.writing}</h3>
                        <p className="text-xs text-slate-500">{dict.mastered} 5/18 {dict.topics}</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      6.5 {dict.avg}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{dict.overallCompletion}</span>
                      <span className="text-slate-900">45%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
                {/* Speaking */}
                <div className="bg-white/60 p-5 rounded-2xl border border-white/80 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-slate-600">mic</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{dict.speaking}</h3>
                        <p className="text-xs text-slate-500">{dict.mastered} 8/18 {dict.topics}</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      7.0 {dict.avg}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{dict.overallCompletion}</span>
                      <span className="text-slate-900">60%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-5 space-y-8">

            {/* Course Progress */}
            <div className="glass-card rounded-[32px] overflow-hidden group">
              <div className="h-44 relative">
                <img alt="Course Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFULuyO38zMQe-0vafmdoMQ3hDRTFaL2nUF-7l9DTr2J8zKmXOvN1cBiMKFc-l-bXkUxL9-k-J55SHH0lvgExBc1bDLQ32W4KMeP6EB8xu_0TIAxCYJmHbquJglsyJdrYbtViqqH41j0aC9fdzEvxY1nfv3Iy31NnZahxk2uR9FSrOEJcVFBcAk16ifLfCdnwV6NWb_1XH57MDgo3HWKprt2GkLL_k-xGMIfIUDxmcKEPe-sA5yhblpu1mhhYdkaSRtMpiSuCCb1yM" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/30">In Progress</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">Academic Vocabulary: Writing Task 2</h3>
                <p className="text-slate-500 text-sm mb-6">Master complex structures and high-level lexical resources.</p>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex-1 mr-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Completion</span>
                      <span className="text-sm font-bold text-slate-900">68%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[68%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-primary/20 group/btn cursor-pointer">
                  <span>Continue Learning</span>
                  <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-[32px] p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-8">{dict.recentActivity}</h3>
              <div className="space-y-0">
                <div className="timeline-item relative flex gap-6 pb-8">
                  <div className="relative z-10 w-12 h-12 flex-shrink-0 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">edit_note</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-slate-900">Submitted Essay Task 2</p>
                    <p className="text-xs text-slate-400 mt-1">Today, 10:24 AM • Feedback Pending</p>
                  </div>
                </div>
                <div className="timeline-item relative flex gap-6 pb-8">
                  <div className="relative z-10 w-12 h-12 flex-shrink-0 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-slate-900">Completed Listening Section</p>
                    <p className="text-xs text-slate-400 mt-1">Yesterday, 4:15 PM • Score: 8.5/9.0</p>
                  </div>
                </div>
                <div className="timeline-item relative flex gap-6">
                  <div className="relative z-10 w-12 h-12 flex-shrink-0 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-slate-900">Started 'Advanced Vocabulary'</p>
                    <p className="text-xs text-slate-400 mt-1">2 days ago • Module 1 of 4</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <footer className="w-full bg-white/40 backdrop-blur-md border-t border-slate-100 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <div className="bg-slate-900 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">school</span>
            </div>
            <h2 className="text-lg font-bold tracking-tighter text-slate-900">F-IELTS</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2024 F-IELTS EdTech. All rights reserved.</p>
          <div className="flex gap-10">
            <a className="text-sm font-bold text-slate-400 hover:text-primary transition-colors" href="#">Support</a>
            <a className="text-sm font-bold text-slate-400 hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm font-bold text-slate-400 hover:text-primary transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
