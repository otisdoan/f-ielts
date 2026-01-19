
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

export default function WritingFeedbackPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#181111] dark:text-white font-sans pb-24">
      <DashboardHeader />
      <main className="max-w-[1440px] mx-auto py-6 px-4 md:px-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            className="text-[#896161] dark:text-[#a08484] text-sm font-medium"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <span className="text-[#896161] dark:text-[#a08484] text-sm">/</span>
          <span className="text-sm font-medium">Writing Task 2 Evaluation</span>
        </div>
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#181111] dark:text-white text-3xl font-bold tracking-tight">
              Writing Task 2: Academic Essay
            </h1>
            <p className="text-[#896161] dark:text-[#a08484] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                auto_awesome
              </span>
              Evaluated by AI 2.0 on Oct 24, 2023
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-background-dark border border-[#e6dbdb] dark:border-[#3d2a2a] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-base">
                download
              </span>
              Download PDF Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-background-dark border border-[#e6dbdb] dark:border-[#3d2a2a] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-base">share</span>
              Share
            </button>
          </div>
        </div>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Editor View */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#e6dbdb] dark:border-[#3d2a2a] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#e6dbdb] dark:border-[#3d2a2a] flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Submitted Essay
                </span>
                <span className="text-xs text-gray-400">
                  Word Count: 284 words
                </span>
              </div>
              <div className="p-8 leading-relaxed text-lg text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  In contemporary society, the debate regarding whether
                  technology improves our lives or complicates them is{" "}
                  <span className="highlight-lexical">vastly discussed</span>.
                  While some argue that advancements in digital tools lead to
                  isolation, I firmly believe that the benefits in communication
                  and efficiency{" "}
                  <span className="highlight-grammar">outweighs</span> the
                  drawbacks.
                </p>
                <p className="mb-4">
                  Firstly, the internet has{" "}
                  <span className="highlight-coherence">revolutionized</span> how
                  we connect. In the past, letters took weeks to arrive, but now
                  we can speak to anyone instantly. This{" "}
                  <span className="highlight-lexical">good thing</span> allows
                  families to stay close despite geographic distances.
                  Furthermore, technology in the workplace has increased
                  productivity.
                </p>
                <p className="mb-4">
                  However, critics point out that{" "}
                  <span className="highlight-grammar">peoples</span> are becoming
                  addicted to their screens. This is a valid concern, but it is
                  ultimately a matter of self-discipline rather than a flaw of
                  the technology itself.{" "}
                  <span className="highlight-grammar">If we uses</span> it
                  wisely, we can avoid these negative effects.
                </p>
                <p>
                  To conclude, although there are minor issues, the positive
                  impact of technology on modern life is{" "}
                  <span className="highlight-lexical">very big</span>. It is
                  essential for future development and global integration.
                </p>
              </div>
            </div>
            {/* AI Suggestions Popover Example (Static for UI Demo) */}
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-4">
              <div className="text-primary">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <p className="text-sm font-bold text-primary mb-1">
                  Correction Suggestion
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Change <span className="line-through">"outweighs"</span> to{" "}
                  <span className="font-bold text-primary">"outweigh"</span>.
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Subject-verb agreement: The plural subject "benefits" requires
                  the plural verb form.
                </p>
              </div>
            </div>
          </div>
          {/* Right Panel: Feedback Dashboard */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Main Score Card */}
            <div className="bg-white dark:bg-background-dark rounded-xl border-2 border-primary/30 p-8 shadow-lg flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Estimated Band Score
                </p>
                <p className="text-5xl font-black text-[#181111] dark:text-white">
                  7.5
                </p>
                <p className="text-green-600 text-sm font-medium flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +0.5 from last attempt
                </p>
              </div>
              <div className="relative size-24 flex items-center justify-center">
                <svg
                  className="size-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200 dark:text-gray-800"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  ></path>
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="83, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                </svg>
                <span className="absolute text-xl font-bold">83%</span>
              </div>
            </div>
            {/* Detailed Breakdown */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#e6dbdb] dark:border-[#3d2a2a] p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold">Criteria Breakdown</h3>
              {/* Criterion 1 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Task Achievement</span>
                  <span className="text-sm font-bold">8.0</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "88%" }}
                  ></div>
                </div>
                <p className="text-xs text-[#896161] dark:text-[#a08484]">
                  Excellent response to all parts of the task. Your position is
                  clear throughout.
                </p>
              </div>
              {/* Criterion 2 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Coherence &amp; Cohesion
                  </span>
                  <span className="text-sm font-bold">7.5</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "83%" }}
                  ></div>
                </div>
                <p className="text-xs text-[#896161] dark:text-[#a08484]">
                  Information is logically organized. Transitions between
                  paragraphs are mostly smooth.
                </p>
              </div>
              {/* Criterion 3 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Lexical Resource</span>
                  <span className="text-sm font-bold">7.0</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: "77%" }}
                  ></div>
                </div>
                <p className="text-xs text-[#896161] dark:text-[#a08484]">
                  Good range of vocabulary. Avoid repetitive phrases like "good
                  thing" and "very big".
                </p>
              </div>
              {/* Criterion 4 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Grammatical Range &amp; Accuracy
                  </span>
                  <span className="text-sm font-bold">7.0</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: "77%" }}
                  ></div>
                </div>
                <p className="text-xs text-[#896161] dark:text-[#a08484]">
                  Mix of simple and complex sentences. Watch out for
                  subject-verb agreement and plural nouns.
                </p>
              </div>
              <button className="w-full py-2 text-primary text-sm font-bold border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                Show Detailed AI Analysis
              </button>
            </div>
            {/* AI Tutor Advice */}
            <div className="bg-background-dark dark:bg-white/5 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    smart_toy
                  </span>
                </div>
                <h3 className="font-bold">Advice for Band 8.0</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                To reach a Band 8.0, you should focus on using more{" "}
                <span className="text-primary font-bold italic">
                  academic collocations
                </span>{" "}
                and less common lexical items. For instance, instead of "vastly
                discussed," try "intensively debated" or "a subject of
                considerable controversy."
              </p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">
                  Collocations
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">
                  Complex Structures
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">
                  Punctuation
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Stats/Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 mb-20">
          <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-[#e6dbdb] dark:border-[#3d2a2a] flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Time Spent
            </p>
            <p className="text-2xl font-bold">34m 12s</p>
          </div>
          <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-[#e6dbdb] dark:border-[#3d2a2a] flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Vocabulary Diversity
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">68%</p>
              <span className="text-xs text-green-500 pb-1">Strong</span>
            </div>
          </div>
          <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-[#e6dbdb] dark:border-[#3d2a2a] flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Grammar Errors
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">4</p>
              <span className="text-xs text-amber-500 pb-1">
                Needs attention
              </span>
            </div>
          </div>
        </div>
      </main>
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-[#e6dbdb] dark:border-[#3d2a2a] py-4 px-10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500 hidden sm:block">
            Ready for your next challenge?
          </p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-all cursor-pointer">
              Practice Vocabulary
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
              Try New Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
