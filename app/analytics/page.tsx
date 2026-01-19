
import Sidebar from "@/components/Sidebar";

export default function AnalyticsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#181111] dark:text-white min-h-screen flex">
      {/* Side Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[#e6dbdb] dark:border-[#3d2424] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold tracking-tight">
              Analytics Dashboard
            </h2>
            <div className="h-4 w-[1px] bg-[#e6dbdb] dark:bg-[#3d2424]"></div>
            <p className="text-sm text-[#896161] dark:text-[#c4a1a1]">
              Overview of your IELTS journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#896161] text-lg">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-[#f4f0f0] dark:bg-[#3d2424] border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Search insights..."
                type="text"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424] text-[#896161] transition-colors relative cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export Report
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Page Heading */}
          <div className="flex flex-col gap-1">
            <h3 className="text-3xl font-black tracking-tight">
              Your Progress Insights
            </h3>
            <p className="text-[#896161] dark:text-[#c4a1a1]">
              Personalized data and deep dive analysis to help you reach Band
              7.5+
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#3d2424] p-6 rounded-xl border border-[#e6dbdb] dark:border-none shadow-sm flex flex-col gap-1">
              <p className="text-sm text-[#896161] dark:text-[#c4a1a1] font-semibold uppercase tracking-wider">
                Current Est. Band
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">6.5</p>
                <p className="text-green-600 text-sm font-bold flex items-center">
                  <span className="material-symbols-outlined text-xs">
                    arrow_upward
                  </span>{" "}
                  0.5
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#3d2424] p-6 rounded-xl border border-[#e6dbdb] dark:border-none shadow-sm flex flex-col gap-1">
              <p className="text-sm text-[#896161] dark:text-[#c4a1a1] font-semibold uppercase tracking-wider">
                Weekly Study Time
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">12h 45m</p>
                <p className="text-green-600 text-sm font-bold flex items-center">
                  <span className="material-symbols-outlined text-xs">
                    arrow_upward
                  </span>{" "}
                  15%
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#3d2424] p-6 rounded-xl border border-[#e6dbdb] dark:border-none shadow-sm flex flex-col gap-1">
              <p className="text-sm text-[#896161] dark:text-[#c4a1a1] font-semibold uppercase tracking-wider">
                Accuracy Rate
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">72%</p>
                <p className="text-red-600 text-sm font-bold flex items-center">
                  <span className="material-symbols-outlined text-xs">
                    arrow_downward
                  </span>{" "}
                  2%
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#3d2424] p-6 rounded-xl border border-[#e6dbdb] dark:border-none shadow-sm flex flex-col gap-1">
              <p className="text-sm text-[#896161] dark:text-[#c4a1a1] font-semibold uppercase tracking-wider">
                Test Completed
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">24</p>
                <p className="text-[#896161] text-sm font-bold">tests</p>
              </div>
            </div>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Band Score Line Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#3d2424] rounded-xl border border-[#e6dbdb] dark:border-none p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-lg font-bold">Band Score Improvement</h4>
                  <p className="text-sm text-[#896161] dark:text-[#c4a1a1]">
                    Historical performance vs. Target (7.5)
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#896161]">
                    <span className="size-2 rounded-full bg-primary"></span>{" "}
                    Actual
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#896161]">
                    <span className="size-2 rounded-full bg-[#e6dbdb] dark:bg-[#5a3a3a]"></span>{" "}
                    Goal
                  </span>
                </div>
              </div>
              <div className="h-64 relative mt-4">
                {/* SVG Placeholder for Line Chart */}
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 200"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ec1313"
                        stopOpacity="0.2"
                      ></stop>
                      <stop
                        offset="100%"
                        stopColor="#ec1313"
                        stopOpacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                  {/* Goal line */}
                  <line
                    stroke="#e6dbdb"
                    strokeDasharray="8 4"
                    strokeWidth="2"
                    x1="0"
                    x2="800"
                    y1="40"
                    y2="40"
                  ></line>
                  {/* Progress path */}
                  <path
                    d="M0,180 Q100,160 200,140 T400,100 T600,60 T800,50"
                    fill="none"
                    stroke="#ec1313"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></path>
                  <path
                    d="M0,180 Q100,160 200,140 T400,100 T600,60 T800,50 V200 H0 Z"
                    fill="url(#chartGradient)"
                  ></path>
                  {/* Points */}
                  <circle cx="200" cy="140" fill="#ec1313" r="4"></circle>
                  <circle cx="400" cy="100" fill="#ec1313" r="4"></circle>
                  <circle cx="600" cy="60" fill="#ec1313" r="4"></circle>
                  <circle
                    cx="800"
                    cy="50"
                    fill="#ec1313"
                    r="6"
                    stroke="white"
                    strokeWidth="2"
                  ></circle>
                </svg>
              </div>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-xs font-bold text-[#896161] uppercase">
                  Jan
                </span>
                <span className="text-xs font-bold text-[#896161] uppercase">
                  Feb
                </span>
                <span className="text-xs font-bold text-[#896161] uppercase">
                  Mar
                </span>
                <span className="text-xs font-bold text-[#896161] uppercase">
                  Apr
                </span>
                <span className="text-xs font-bold text-[#896161] uppercase">
                  May
                </span>
                <span className="text-xs font-bold text-[#896161] uppercase text-primary">
                  Jun
                </span>
              </div>
            </div>
            {/* Skill Radar */}
            <div className="bg-white dark:bg-[#3d2424] rounded-xl border border-[#e6dbdb] dark:border-none p-6 shadow-sm flex flex-col items-center">
              <div className="w-full text-left mb-4">
                <h4 className="text-lg font-bold">Skill Proficiency</h4>
                <p className="text-sm text-[#896161] dark:text-[#c4a1a1]">
                  Balance across four sections
                </p>
              </div>
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Radar Chart Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-full h-full opacity-20 stroke-current text-[#896161]"
                    viewBox="0 0 200 200"
                  >
                    <circle cx="100" cy="100" fill="none" r="80"></circle>
                    <circle cx="100" cy="100" fill="none" r="60"></circle>
                    <circle cx="100" cy="100" fill="none" r="40"></circle>
                    <line x1="100" x2="100" y1="20" y2="180"></line>
                    <line x1="20" x2="180" y1="100" y2="100"></line>
                  </svg>
                  {/* Skill polygon */}
                  <svg
                    className="absolute w-full h-full"
                    viewBox="0 0 200 200"
                  >
                    <polygon
                      fill="#ec1313"
                      fillOpacity="0.3"
                      points="100,40 160,100 100,170 30,100"
                      stroke="#ec1313"
                      strokeWidth="2"
                    ></polygon>
                  </svg>
                </div>
                {/* Labels */}
                <div className="absolute top-0 text-xs font-bold uppercase">
                  Listening (7.5)
                </div>
                <div className="absolute bottom-0 text-xs font-bold uppercase">
                  Speaking (6.0)
                </div>
                <div className="absolute left-0 text-xs font-bold uppercase -rotate-90 origin-center -translate-x-8">
                  Writing (5.5)
                </div>
                <div className="absolute right-0 text-xs font-bold uppercase rotate-90 origin-center translate-x-8">
                  Reading (7.0)
                </div>
              </div>
            </div>
          </div>

          {/* Lower Insights Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Heatmap & Question Breakdown */}
            <div className="xl:col-span-2 space-y-8">
              {/* Heatmap */}
              <div className="bg-white dark:bg-[#3d2424] rounded-xl border border-[#e6dbdb] dark:border-none p-6 shadow-sm">
                <h4 className="text-lg font-bold mb-4">
                  Weekly Study Consistency
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-7 gap-2">
                    {/* Simple representation of a heatmap grid */}
                    <div className="space-y-2">
                      <div className="aspect-square bg-primary/20 rounded-sm" title="2 hours"></div>
                      <div className="aspect-square bg-primary/60 rounded-sm" title="4 hours"></div>
                      <div className="aspect-square bg-primary/10 rounded-sm" title="0.5 hours"></div>
                      <div className="aspect-square bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">MON</div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-primary/80 rounded-sm" title="6 hours"></div>
                      <div className="aspect-square bg-primary/40 rounded-sm"></div>
                      <div className="aspect-square bg-primary rounded-sm" title="8 hours"></div>
                      <div className="aspect-square bg-primary/20 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">TUE</div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="aspect-square bg-primary/10 rounded-sm"></div>
                      <div className="aspect-square bg-primary/20 rounded-sm"></div>
                      <div className="aspect-square bg-primary/40 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">WED</div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-primary/60 rounded-sm"></div>
                      <div className="aspect-square bg-primary/90 rounded-sm"></div>
                      <div className="aspect-square bg-primary/10 rounded-sm"></div>
                      <div className="aspect-square bg-primary/20 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">THU</div>
                    </div>
                     <div className="space-y-2">
                      <div className="aspect-square bg-primary/20 rounded-sm"></div>
                      <div className="aspect-square bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="aspect-square bg-primary/10 rounded-sm"></div>
                      <div className="aspect-square bg-primary/80 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">FRI</div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-primary rounded-sm"></div>
                      <div className="aspect-square bg-primary/80 rounded-sm"></div>
                      <div className="aspect-square bg-primary/60 rounded-sm"></div>
                      <div className="aspect-square bg-primary/40 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">SAT</div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-primary/10 rounded-sm"></div>
                      <div className="aspect-square bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="aspect-square bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="aspect-square bg-primary/20 rounded-sm"></div>
                      <div className="text-[10px] text-center font-bold text-[#896161]">SUN</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="text-[10px] text-[#896161]">Less</span>
                    <div className="flex gap-1">
                      <div className="size-3 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-sm"></div>
                      <div className="size-3 bg-primary/20 rounded-sm"></div>
                      <div className="size-3 bg-primary/50 rounded-sm"></div>
                      <div className="size-3 bg-primary rounded-sm"></div>
                    </div>
                    <span className="text-[10px] text-[#896161]">More</span>
                  </div>
                </div>
              </div>
              {/* Accuracy Breakdown */}
              <div className="bg-white dark:bg-[#3d2424] rounded-xl border border-[#e6dbdb] dark:border-none p-6 shadow-sm">
                <h4 className="text-lg font-bold mb-6">
                  Accuracy by Question Type
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Multiple Choice</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Matching Headings</span>
                      <span className="font-bold text-primary">42%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{width: '42%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Map Labeling</span>
                      <span className="font-bold">68%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{width: '68%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Sentence Completion</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">True/False/Not Given</span>
                      <span className="font-bold">59%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{width: '59%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Short Answer</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="h-2 bg-[#f4f0f0] dark:bg-[#4a2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* AI Insights Text Box */}
            <div className="bg-primary text-white rounded-xl p-8 shadow-xl shadow-primary/30 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined fill-1">
                    auto_awesome
                  </span>
                  <h4 className="text-xl font-bold tracking-tight">
                    AI Skill Insights
                  </h4>
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                      Priority Focus
                    </p>
                    <h5 className="text-xl font-bold mb-2">
                      Matching Headings
                    </h5>
                    <p className="text-sm leading-relaxed text-white/90">
                      Your current accuracy for "Matching Headings" is 42%,
                      which is significantly lower than your target. This is
                      usually due to skimming too fast or missing contextual
                      links between paragraphs.
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                    <p className="text-xs font-bold uppercase mb-2">
                      Recommended Action
                    </p>
                    <p className="text-sm italic">
                      "Try the &apos;Contextual Cues&apos; video lesson in Module 3. We&apos;ve
                      also unlocked 5 targeted practice sets focused on heading
                      logic for you."
                    </p>
                  </div>
                </div>
                <button className="mt-8 w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  Start Suggested Lesson
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer-like padding */}
        <footer className="mt-auto p-8 text-center">
          <p className="text-xs text-[#896161] dark:text-[#c4a1a1]">
            © 2024 F-IELTS Learning Systems. All data is updated every 24
            hours.
          </p>
        </footer>
      </main>
    </div>
  );
}
