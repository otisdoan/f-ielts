
"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { WritingService, WritingPrompt } from "@/services/writing.service";

// Mock history (still mock for now as backend service handles prompts first)
const MOCK_HISTORY = [
    { id: "sub-1", title: "Technology in Education", date: "2024-03-10", score: 7.5, type: "Task 2" },
    { id: "sub-2", title: "Global Population Growth", date: "2024-03-08", score: 6.5, type: "Task 1" },
];

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

  // Group prompts by categories
  const task1Prompts = prompts.filter(p => p.task_type === "task1");
  const task2Prompts = prompts.filter(p => p.task_type === "task2");

  const categories = [
      {
          id: "task-1-academic",
          title: "Task 1",
          description: "Describe charts, graphs, tables or diagrams.",
          time: "20 mins",
          icon: "bar_chart",
          color: "text-blue-500",
          bg: "bg-blue-100",
          prompts: task1Prompts
      },
      {
          id: "task-2-essay",
          title: "Task 2",
          description: "Write a formal essay in response to a point of view, argument or problem.",
          time: "40 mins",
          icon: "edit_document",
          color: "text-purple-500",
          bg: "bg-purple-100",
          prompts: task2Prompts
      }
  ];
  
  return (
    <div className="bg-background-light min-h-screen font-sans">
      <DashboardHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-40 py-10">
        <div className="flex flex-col gap-4 pb-8">
            <div className="flex items-center gap-2 text-[#896161]/60">
                 <Link href="/practice" className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                 </Link>
                 <span>/</span>
                 <span className="text-[#181111] font-medium">Writing</span>
            </div>
            
            <div className="flex flex-wrap justify-between items-end gap-3">
                <div>
                    <h1 className="text-[#181111] text-4xl font-black leading-tight tracking-[-0.033em]">
                        Writing Practice
                    </h1>
                    <p className="text-[#896161]/60 text-lg font-normal leading-normal mt-2">
                        Master Task 1 and Task 2 with AI-powered feedback.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e6dbdb] mt-4">
                <button 
                    onClick={() => setActiveTab("practice")}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === "practice" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-[#181111]"}`}
                >
                    Practice Library
                </button>
                <button 
                    onClick={() => setActiveTab("history")}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-[#181111]"}`}
                >
                    My History
                </button>
            </div>
        </div>

        {activeTab === "practice" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                    <div className="col-span-2 space-y-4">
                        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                ) : (
                    categories.map((category) => (
                    <div key={category.id} className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-[#e6dbdb] bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`size-12 rounded-xl ${category.bg} ${category.color} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#181111]">{category.title}</h2>
                                    <p className="text-[#896161]/60 text-sm font-medium">{category.time}</p>
                                </div>
                            </div>
                            <p className="text-[#181111]/70 leading-relaxed mb-6">
                                {category.description}
                            </p>
                            <button className="w-full py-2.5 rounded-lg bg-[#181111] text-white font-bold hover:bg-primary transition-colors opacity-50 cursor-not-allowed">
                                Start Random {category.title}
                            </button>
                        </div>
    
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[#181111] font-bold text-lg px-2">Featured {category.title} Prompts</h3>
                            {category.prompts.length > 0 ? (
                                category.prompts.map((prompt) => (
                                    <Link key={prompt.id} href={`/practice/writing/${prompt.id}`}>
                                        <div className="group bg-white rounded-xl border border-[#e6dbdb] p-4 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${category.title === 'Task 1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {category.title}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-600">
                                                        New
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-[#181111] group-hover:text-primary transition-colors line-clamp-1">
                                                    {prompt.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                                    {prompt.instruction}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
                                                chevron_right
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white border border-dashed border-gray-300 rounded-lg">
                                    <p className="text-sm text-gray-400 italic">No {category.title} prompts available yet.</p>
                                    <p className="text-xs text-gray-400">Please check back later.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )))}
            </div>
        ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                     <div className="space-y-4">
                        <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                     </div>
                ) : history.length > 0 ? (
                    history.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-[#e6dbdb] p-6 flex items-center justify-between hover:shadow-md transition-all">
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                     <span className="text-primary font-bold text-sm">{item.type}</span>
                                     <span className="text-gray-400 text-sm">•</span>
                                     <span className="text-gray-500 text-sm">{item.date}</span>
                                     {item.status === 'draft' && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">Draft</span>}
                                </div>
                                <h3 className="font-bold text-lg text-[#181111]">{item.title}</h3>
                             </div>
                             <div className="flex items-center gap-6">
                                {item.score ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Score</span>
                                        <span className="text-2xl font-black text-primary">{item.score}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                                        <span className="text-sm font-bold text-gray-600">{item.status === 'evaluated' ? 'Evaluating...' : 'In Progress'}</span>
                                    </div>
                                )}
                                <div className="h-10 w-[1px] bg-gray-200"></div>
                                <Link href={`/practice/writing/${item.id}?mode=review`}>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e6dbdb] font-bold text-sm hover:bg-gray-50 transition-colors">
                                        {item.status === 'draft' ? 'Continue' : 'Review'}
                                    </button>
                                </Link>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-[#e6dbdb]">
                        <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <span className="material-symbols-outlined text-3xl">history_edu</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#181111]">No writing history yet</h3>
                        <p className="text-gray-500">Complete your first practice test to see your analytics.</p>
                    </div>
                )}
            </div>
        )}
       
      </main>
    </div>
  );
}
