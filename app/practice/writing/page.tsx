
"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WritingService, WritingPrompt } from "@/services/writing.service";

// Mock history (still mock for now as backend service handles prompts first)
const MOCK_HISTORY = [
    { id: "sub-1", title: "Technology in Education", date: "2024-03-10", score: 7.5, type: "Task 2" },
    { id: "sub-2", title: "Global Population Growth", date: "2024-03-08", score: 6.5, type: "Task 1" },
];

export default function WritingPracticePage() {
  const router = useRouter();
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

  const startRandomPrompt = (taskPrompts: WritingPrompt[]) => {
    if (taskPrompts.length === 0) {
      alert("No prompts available for this task type");
      return;
    }
    const randomPrompt = taskPrompts[Math.floor(Math.random() * taskPrompts.length)];
    router.push(`/practice/writing/${randomPrompt.id}`);
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
    <div className="bg-background-light min-h-screen font-display">
      <DashboardHeader />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#896161] mb-6">
          <Link href="/practice" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </Link>
          <span>/</span>
          <span className="text-[#181111] font-semibold">Writing</span>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#181111] text-3xl md:text-4xl font-bold mb-2">
            Writing Practice
          </h1>
          <p className="text-[#896161] text-base">
            Master Task 1 and Task 2 with AI-powered feedback.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#e6dbdb] mb-8">
          <button 
            onClick={() => setActiveTab("practice")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "practice" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-[#181111]"
            }`}
          >
            Practice Library
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "history" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-[#181111]"
            }`}
          >
            My History
          </button>
        </div>

        {/* Content */}
        {activeTab === "practice" ? (
          <div className="space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="bg-white rounded-xl border border-[#e6dbdb] p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`size-14 rounded-xl ${category.bg} ${category.color} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-3xl">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-[#181111] mb-1">{category.title}</h2>
                          <p className="text-[#896161] text-sm font-medium">{category.time}</p>
                        </div>
                      </div>
                      <p className="text-[#181111]/70 text-sm leading-relaxed mb-5">
                        {category.description}
                      </p>
                      <button 
                        onClick={() => startRandomPrompt(category.prompts)}
                        disabled={category.prompts.length === 0}
                        className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                          category.prompts.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-red-600'
                        }`}
                      >
                        {category.prompts.length === 0 
                          ? `No ${category.title} Available` 
                          : `Start Random ${category.title}`
                        }
                      </button>
                    </div>
                  ))}
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ) : history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl border border-[#e6dbdb] p-5 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.type === 'Task 1' 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-purple-50 text-purple-600'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{item.date}</span>
                        {item.status === 'draft' && (
                          <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-base text-[#181111] line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      {item.score ? (
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                            Band Score
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {item.score}
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                            Status
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            {item.status === 'evaluated' ? 'Evaluating...' : 'In Progress'}
                          </div>
                        </div>
                      )}
                      
                      <div className="h-12 w-px bg-gray-200"></div>
                      
                      <Link href={`/practice/writing/${item.id}?mode=review`}>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#e6dbdb] font-semibold text-sm hover:bg-gray-50 hover:border-primary transition-all">
                          {item.status === 'draft' ? (
                            <>
                              <span className="material-symbols-outlined text-lg">edit</span>
                              <span>Continue</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              <span>Review</span>
                            </>
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-[#e6dbdb]">
                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-gray-400">
                    history_edu
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#181111] mb-2">
                  No writing history yet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Complete your first practice test to see your results.
                </p>
                <button 
                  onClick={() => setActiveTab("practice")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  <span>Start Practicing</span>
                </button>
              </div>
            )}
          </div>
        )}
       
      </main>
    </div>
  );
}
