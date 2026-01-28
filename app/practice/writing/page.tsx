"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { WritingService, WritingPrompt } from "@/services/writing.service";

export default function WritingPracticePage() {
  const [activeTab, setActiveTab] = useState<"practice" | "history">("practice");
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [promptsData, historyData] = await Promise.all([
        WritingService.getPrompts(),
        WritingService.getUserSubmissions()
    ]);
    setPrompts(promptsData || []);
    setHistory(historyData || []);
    setLoading(false);
  };

  // Group prompts by categories - handle both category and task_type for backward compatibility
  const task1Prompts = prompts.filter(p => {
    const category = p.category || p.task_type;
    return category === "task1" || category === "builder";
  });
  const task2Prompts = prompts.filter(p => {
    const category = p.category || p.task_type;
    return category === "task2";
  });

  const categories = [
      {
          id: "task-1-academic",
          title: "Task 1",
          description: "Describe charts, graphs, tables or diagrams in 150 words.",
          time: "20 mins",
          icon: "bar_chart",
          color: "text-blue-600",
          bg: "bg-blue-50",
          borderColor: "border-blue-200",
          prompts: task1Prompts
      },
      {
          id: "task-2-essay",
          title: "Task 2",
          description: "Write a formal essay in response to a point of view, argument or problem in 250 words.",
          time: "40 mins",
          icon: "edit_note",
          color: "text-purple-600",
          bg: "bg-purple-50",
          borderColor: "border-purple-200",
          prompts: task2Prompts
      }
  ];
  
  return (
    <div className="bg-background-light min-h-screen font-sans">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/practice" className="text-[#896161] hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Practice</span>
          </Link>
          <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
          <span className="text-[#181111] font-medium">Writing</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-[#181111] mb-2">
            Writing Practice
          </h1>
          <p className="text-lg text-[#896161]">
            Master Task 1 and Task 2 with AI-powered feedback and comprehensive practice materials.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-[#f4f0f0]">
            <button 
              onClick={() => setActiveTab("practice")}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 relative ${
                activeTab === "practice" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-[#896161] hover:text-[#181111]"
              }`}
            >
              Practice Library
              {activeTab === "practice" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 relative ${
                activeTab === "history" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-[#896161] hover:text-[#181111]"
              }`}
            >
              My History
              {activeTab === "history" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "practice" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              <>
                <div className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-6">
                  {/* Category Card */}
                  <div className="rounded-xl border border-[#f4f0f0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`size-14 rounded-xl ${category.bg} ${category.color} flex items-center justify-center flex-shrink-0 border ${category.borderColor}`}>
                        <span className="material-symbols-outlined text-3xl">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-black text-[#181111]">{category.title}</h2>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            {category.time}
                          </span>
                        </div>
                        <p className="text-[#896161] text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#f4f0f0]">
                      <span className="text-sm font-medium text-[#896161]">
                        {category.prompts.length} {category.prompts.length === 1 ? 'prompt' : 'prompts'} available
                      </span>
                      <button 
                        className="px-4 py-2 rounded-lg bg-[#f4f0f0] text-[#181111] font-bold text-sm hover:bg-gray-200 transition-colors opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Random Practice
                      </button>
                    </div>
                  </div>
    
                  {/* Prompts List */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[#181111] font-black text-lg">Featured {category.title} Prompts</h3>
                      <span className="text-xs text-[#896161] font-medium">
                        {category.prompts.length} {category.prompts.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    {category.prompts.length > 0 ? (
                      <div className="space-y-3">
                        {category.prompts.map((prompt) => (
                          <Link key={prompt.id} href={`/practice/writing/${prompt.id}`}>
                            <div className="group bg-white rounded-xl border border-[#f4f0f0] p-5 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${category.title === 'Task 1' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                      {category.title}
                                    </span>
                                    {prompt.sub_type && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                        {prompt.sub_type}
                                      </span>
                                    )}
                                    {prompt.source && (
                                      <span className="text-xs text-[#896161]">
                                        {prompt.source}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-black text-[#181111] group-hover:text-primary transition-colors mb-2 line-clamp-2 text-lg">
                                    {prompt.title}
                                  </h4>
                                  {prompt.question_text && (
                                    <p className="text-sm text-[#896161] line-clamp-2 leading-relaxed">
                                      {prompt.question_text}
                                    </p>
                                  )}
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors flex-shrink-0 mt-1">
                                  chevron_right
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border border-dashed border-[#f4f0f0] rounded-xl">
                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl text-gray-300">{category.icon}</span>
                        </div>
                        <p className="text-sm font-medium text-[#896161] mb-1">No {category.title} prompts available</p>
                        <p className="text-xs text-gray-400">Check back later for new content</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-[#f4f0f0] p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.type === 'Task 1' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-sm text-[#896161]">{item.date}</span>
                        {item.status === 'draft' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            Draft
                          </span>
                        )}
                        {item.status === 'evaluated' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            Evaluated
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-xl text-[#181111] mb-1">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      {item.score ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-[#896161] uppercase tracking-wider mb-1">Score</span>
                          <span className="text-3xl font-black text-primary">{item.score}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-[#896161] uppercase tracking-wider mb-1">Status</span>
                          <span className="text-sm font-bold text-[#896161]">
                            {item.status === 'evaluated' ? 'Evaluating...' : 'In Progress'}
                          </span>
                        </div>
                      )}
                      <div className="h-12 w-px bg-[#f4f0f0]"></div>
                      <Link href={`/practice/writing/${item.id}?mode=review`}>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#f4f0f0] font-bold text-sm hover:bg-[#f8f6f6] transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            {item.status === 'draft' ? 'edit' : 'visibility'}
                          </span>
                          <span>{item.status === 'draft' ? 'Continue' : 'Review'}</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-[#f4f0f0]">
                <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl text-gray-400">history_edu</span>
                </div>
                <h3 className="text-xl font-black text-[#181111] mb-2">No writing history yet</h3>
                <p className="text-[#896161] mb-6">Complete your first practice test to see your analytics and progress.</p>
                <Link href="/practice/writing">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">edit_note</span>
                    <span>Start Practicing</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
