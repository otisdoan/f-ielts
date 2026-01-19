
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white text-[#181111] antialiased transition-colors duration-300">
      {/* Force Header to be light mode compatible if possible, or it will adapt to system */}
      <Header />
      <main className="max-w-[1280px] mx-auto overflow-hidden">
        {/* Hero Section */}
        <section className="px-6 lg:px-10 py-12 @container">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-6 lg:w-1/2">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
                  <span className="material-symbols-outlined text-sm">
                    auto_awesome
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    AI-Powered Platform
                  </span>
                </div>
                <h1 className="text-[#181111] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl">
                  Master IELTS with <span className="text-primary">Confidence</span>
                </h1>
                <p className="text-[#181111]/70 text-lg leading-relaxed max-w-[540px]">
                  Personalized paths, AI-powered writing feedback, and realistic mock
                  tests designed to help you hit Band 8+ faster than ever.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:bg-red-600 transition-all">
                  Start Free Practice
                </button>
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white border border-[#e6dbdb] text-[#181111] text-base font-bold hover:bg-gray-50 transition-all">
                  Take Mock Test
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  <div
                    className="size-10 rounded-full border-2 border-white bg-gray-300 bg-cover"
                    data-alt="Student profile avatar 1"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqlMuT8RHgDYctRk1qAl_8ZXQuNWgUWz_MqMzLStzVyUe77Z3KJ3yhU-xy4-69C8GeKzm5obyr5OH3OmC7S4X6eW9Ki2rtQHJJX460HwhR763N8bRCj4WWQsg3hODpOvv9-nGbgBt7pDMoKrcjclyuEs3dASB0PTZW4z654wAuEl4XNYaL5h0NSGqLPmO0Osq_pmZF5G6IFSGvL7uyO8h7L79pMy_76Z7aOu6bT3tDZkix23mkpar79o4l-pumU5L7_k7M_exPjgZU')",
                    }}
                  ></div>
                  <div
                    className="size-10 rounded-full border-2 border-white bg-gray-400 bg-cover"
                    data-alt="Student profile avatar 2"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKezwmOzrL9WA8RPa9UaASStEMp2RpvHpuRZ2tTM3CmBWKeurFiIZSHFFvBASob471NMdf2eXXe5nAmOf8PaIOPQKKuE_vdGpa_HVT03p8d8qBI4SBmGlXp80mMylBkhCbQd9lxqasP_oOdL1GuIJpZ7H4Phkq0SGdlAVFZW5Fl0NXfSQVu9lVSXKF9gulpEn9NpDjH8tjwQmc8DvWoJ-819lTC3urEXeMgtu7YIphhFSy3dnOnXgK9dilNptj0ooM2Ra0fvGQYr8Y')",
                    }}
                  ></div>
                  <div
                    className="size-10 rounded-full border-2 border-white bg-gray-500 bg-cover"
                    data-alt="Student profile avatar 3"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-RAmw9UuB_g4pE0X3Z_mf1GMtnQhvsNf3BcH_kMIUP5htmhLgOBHAHczWFaIi21CAlYI1LfESF7CfaI2dhetqFCBLbPyXQwCmzCZmyR6fLU6CYLtdpEIXl8yFtD24JHo6rB4McAJo0Cb_hABm3Xc-UKZ0QBTx2bB9zl7QOJMdfRUzGZMKTZjx6vIiVFdDmKL278JXPRJzij-ZgO-knbWf1HaP80dzdBnV422NBGJLd3lObRp6Vue3eEdzL2YgL_iU6bdSdaqczmb1')",
                    }}
                  ></div>
                </div>
                <p className="text-sm text-[#181111]/60">
                  Join{" "}
                  <span className="font-bold text-[#181111]">
                    12,000+ students
                  </span>{" "}
                  improving today
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div
                className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-2xl shadow-2xl relative z-10 overflow-hidden border-8 border-white"
                data-alt="IELTS student studying with digital dashboard"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASlN3P6zwgNMzjSq_7mjv7GOAGcis9EK1S9oUm2fNNcFGsloRwcbr9FybbqD6SVpx0OZzXSJ_Uqn4hTDc6717ikVANqYNAQmWc5QM9qWy9Fvk1BHjroE9THcXfoowJCDY9h9AjALyLEwgSzdjoOO3XYovin6C3ip57M9Gr86SvfkhEqy5wg4Bn-U1a1YpgmEQM3z4LPZy8VmIVe-wSCVXnQ_CmB1t9hiKNFQi10dMKbNU7UTYmLkNtBXoKBz9neeCQT4ri2jscFGr-")',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-xl shadow-2xl border border-[#e6dbdb] flex items-center gap-4 animate-bounce-slow">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <span className="material-symbols-outlined font-bold">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">
                    Avg. Improvement
                  </p>
                  <p className="text-lg font-black text-[#181111]">
                    +1.5 Band Score
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* FeatureSection: The 4 Skills */}
        <section className="px-6 lg:px-10 py-20 @container">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-[#181111] text-3xl font-black @[480px]:text-4xl">
                Comprehensive <span className="text-primary">Skill Modules</span>
              </h2>
              <p className="text-[#181111]/70 text-lg max-w-[720px]">
                Practice all 4 sections of the IELTS exam with expert-crafted
                materials and real-time performance analytics.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Reading */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#e6dbdb] bg-white p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    menu_book
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181111] text-xl font-bold leading-tight">
                    Reading
                  </h3>
                  <p className="text-[#181111]/60 text-sm leading-normal">
                    Practice with 1,000+ real-world articles and complex academic
                    texts.
                  </p>
                </div>
                <Link
                  className="mt-auto flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all"
                  href="/practice/reading"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
              {/* Listening */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#e6dbdb] bg-white p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    headphones
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181111] text-xl font-bold leading-tight">
                    Listening
                  </h3>
                  <p className="text-[#181111]/60 text-sm leading-normal">
                    Adaptive audio environments with various accents and background
                    noise levels.
                  </p>
                </div>
                <Link
                  className="mt-auto flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all"
                  href="/practice/listening"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
              {/* Writing */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#e6dbdb] bg-white p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    edit_note
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181111] text-xl font-bold leading-tight">
                    Writing
                  </h3>
                  <p className="text-[#181111]/60 text-sm leading-normal">
                    Instant AI-driven grading and detailed feedback on grammar and
                    coherence.
                  </p>
                </div>
                <Link
                  className="mt-auto flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all"
                  href="/practice/writing"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
              {/* Speaking */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#e6dbdb] bg-white p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">mic</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181111] text-xl font-bold leading-tight">
                    Speaking
                  </h3>
                  <p className="text-[#181111]/60 text-sm leading-normal">
                    Advanced voice recognition and fluency tracking technology to fix
                    your speech.
                  </p>
                </div>
                <Link
                  className="mt-auto flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all"
                  href="/practice/speaking"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* AI Feature Panel */}
        <section className="px-6 lg:px-10 py-10">
          <div className="relative overflow-hidden rounded-3xl border border-[#e6dbdb] bg-white p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex flex-col gap-6 lg:w-1/2">
                <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#181111] text-3xl font-black leading-tight">
                    AI Writing Assistant
                  </h2>
                  <p className="text-[#181111]/70 text-lg leading-relaxed">
                    Get instant band scores and detailed grammatical corrections for
                    your essays using our advanced AI engine trained on over 50,000
                    graded papers.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 font-bold">
                      check_circle
                    </span>
                    <span className="text-sm font-medium">
                      Detailed coherence &amp; cohesion analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 font-bold">
                      check_circle
                    </span>
                    <span className="text-sm font-medium">
                      Vocabulary richness scoring
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 font-bold">
                      check_circle
                    </span>
                    <span className="text-sm font-medium">
                      Grammar &amp; Punctuation fixes
                    </span>
                  </div>
                </div>
                <button className="flex min-w-[200px] w-fit cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all">
                  Try AI Writing Now
                </button>
              </div>
              <div className="lg:w-1/2 w-full">
                {/* Simulated AI UI */}
                <div className="bg-gray-50 rounded-xl p-6 border border-[#e6dbdb]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Analysis result
                    </span>
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold italic">
                      Band 7.5 Predicted
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-gray-600 italic">
                      &quot;The{" "}
                      <span className="bg-red-100 text-red-700 px-1 border-b-2 border-red-500">
                        enviromental
                      </span>{" "}
                      problems are increasing...&quot;
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-red-200 flex gap-3 shadow-sm">
                      <span className="material-symbols-outlined text-red-500 text-sm">
                        error
                      </span>
                      <div className="text-xs">
                        <p className="font-bold text-red-600">Spelling Error</p>
                        <p className="text-gray-500">
                          Correct to:{" "}
                          <span className="text-green-600 font-bold">
                            environmental
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>Task Achievement</span>
                      <span>8.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="px-6 lg:px-10 py-24 @container">
          <div className="flex flex-col items-center justify-center gap-8 rounded-3xl bg-primary p-12 lg:p-20 text-center shadow-2xl shadow-primary/20">
            <div className="flex flex-col gap-4">
              <h1 className="text-white text-4xl font-black leading-tight @[480px]:text-6xl max-w-[800px]">
                Ready to hit <span className="underline decoration-white/30">Band 8+</span>?
              </h1>
              <p className="text-white/80 text-lg lg:text-xl font-medium max-w-[640px] mx-auto">
                Join thousands of students who have already achieved their target
                scores with the F-IELTS ecosystem.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-lg h-14 px-10 bg-white text-primary text-lg font-bold shadow-xl hover:bg-gray-100 transition-all active:scale-95">
                Get Started for Free
              </button>
              <button className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-lg h-14 px-10 border-2 border-white text-white text-lg font-bold hover:bg-white/10 transition-all">
                View Pricing
              </button>
            </div>
            <p className="text-white/60 text-xs">
              No credit card required. 7-day free trial on premium features.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
