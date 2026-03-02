"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { WritingService, WritingPrompt } from "@/services/writing.service";

export default function WritingPracticeInterface() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode"); // 'practice' (default) or 'review'

  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [autoSaveTime, setAutoSaveTime] = useState<string>("");

  const promptId = typeof params.id === "string" ? params.id : "";
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load prompt
  useEffect(() => {
    async function loadPrompt() {
      if (!promptId) return;
      setLoading(true);
      const data = await WritingService.getPromptById(promptId);
      setPrompt(data);
      setLoading(false);
    }
    loadPrompt();
  }, [promptId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Word count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [content]);

  // Auto-save simulation
  useEffect(() => {
    if (content) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setAutoSaveTime(timeString);
    }
  }, [content]);

  // Format timer
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  // Handle Save / Submit
  const handleSaveDraft = async () => {
    // TODO: Supabase Update
    console.log("Saving draft...", content);
    alert("Draft saved successfully!");
  };

  const handleFinishLater = () => {
    if (
      content &&
      confirm("Do you want to save your progress before leaving?")
    ) {
      handleSaveDraft();
    }
    router.push("/practice/writing");
  };

  const handleSubmit = async () => {
    if (wordCount < 150) {
      alert(`Please write at least 150 words. Current count: ${wordCount}`);
      return;
    }

    setIsSubmitting(true);
    // TODO: Supabase Insert/Update -> Trigger AI
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Submitted for AI evaluation!");
      router.push(`/practice/writing/${promptId}/feedback`);
    }, 2000);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading prompt...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">
            error
          </span>
          <p className="text-slate-600 text-lg">Prompt not found.</p>
          <Link
            href="/practice/writing"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Writing Practice
          </Link>
        </div>
      </div>
    );
  }

  // Render "Review" mode (Result View)
  if (mode === "review") {
    return (
      <div className="bg-background-light min-h-screen font-display">
        <header className="sticky top-0 z-50 bg-white border-b border-[#e6dbdb] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/practice/writing"
              className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="font-bold text-lg">Evaluation Result</h1>
          </div>
          <div className="font-bold text-2xl text-primary">Band 7.5</div>
        </header>
        <main className="max-w-5xl mx-auto p-8">
          <div className="bg-white p-8 rounded-xl border border-[#e6dbdb]">
            <h2 className="text-xl font-bold mb-4">Your Submission</h2>
            <div className="p-4 bg-gray-50 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
              {content || "No submission content available."}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const time = formatTime(timeElapsed);
  const minWordCount = prompt.task_type === "task1" ? 150 : 250;

  // Render "Practice" mode (Editor View)
  return (
    <div className="bg-background-light text-[#181111] min-h-screen flex flex-col font-display">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
              <path
                clipRule="evenodd"
                d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
            F-IELTS
          </h2>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            <Link
              className="text-[#896161] hover:text-primary transition-colors"
              href="/practice/writing"
            >
              Writing Practice
            </Link>
            <span className="text-[#896161]">/</span>
            <span className="text-[#181111]">
              {prompt.task_type === "task1" ? "Task 1" : "Task 2"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 md:gap-10">
          {/* Timer Component */}
          <div className="flex gap-2 items-center bg-slate-100 px-3 md:px-4 py-1.5 rounded-lg border border-slate-200">
            <span className="material-symbols-outlined text-primary text-lg">
              timer
            </span>
            <div className="flex gap-1.5">
              <p className="text-[#181111] text-sm font-bold font-mono">
                {time.hours}
              </p>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <p className="text-[#181111] text-sm font-bold font-mono">
                {time.minutes}
              </p>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <p className="text-[#181111] text-sm font-bold font-mono">
                {time.seconds}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleFinishLater}
              className="hidden md:flex min-w-25 cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-slate-100 text-[#181111] text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              <span>Finish Later</span>
            </button>
            <Link href="/practice/writing">
              <button className="flex min-w-20 cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors">
                <span>Exit</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Task Description */}
        <div className="w-full lg:w-1/2 border-r border-slate-200 overflow-y-auto bg-white p-6 md:p-8 hide-scrollbar">
          <div className="max-w-2xl lg:ml-auto">
            <div className="mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Academic Writing
              </span>
              <h2 className="text-[#181111] text-2xl font-bold mt-3">
                {prompt.task_type === "task1" ? "Task 1" : "Task 2"}
              </h2>
            </div>
            <div className="space-y-6">
              {/* Question Text */}
              <p className="text-[#181111] text-lg leading-relaxed">
                {prompt.question_text || prompt.instruction}
              </p>

              {/* Image if exists */}
              {prompt.image_url && (
                <div className="rounded-xl border border-slate-200 p-4 bg-white overflow-hidden">
                  <img
                    src={prompt.image_url}
                    alt="Task visualization"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Writing Requirements */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 mt-0.5">
                  info
                </span>
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">Writing Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Write at least {minWordCount} words.</li>
                    <li>
                      You should spend about{" "}
                      {prompt.task_type === "task1" ? "20" : "40"} minutes on
                      this task.
                    </li>
                    <li>
                      {prompt.task_type === "task1"
                        ? "Focus on trends and major data points."
                        : "Support your opinion with reasons and examples."}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Text Editor */}
        <div className="hidden lg:flex w-1/2 flex-col bg-slate-50 p-8 overflow-hidden">
          <div className="max-w-2xl flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center gap-2 mb-4">
              <button
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Undo"
              >
                <span className="material-symbols-outlined">undo</span>
              </button>
              <button
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Redo"
              >
                <span className="material-symbols-outlined">redo</span>
              </button>
              <div className="h-6 w-px bg-slate-300 mx-1"></div>
              <button
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Bold"
              >
                <span className="material-symbols-outlined">format_bold</span>
              </button>
              <button
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Italic"
              >
                <span className="material-symbols-outlined">format_italic</span>
              </button>
              {autoSaveTime && (
                <div className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Auto-saved at {autoSaveTime}
                </div>
              )}
            </div>

            {/* Text Area */}
            <div className="flex-1 relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-8 rounded-xl border border-slate-200 bg-white text-[#181111] text-lg leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none shadow-sm placeholder:text-slate-400"
                placeholder="Start typing your response here..."
              ></textarea>
            </div>

            {/* Bottom Bar Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Word Count
                  </span>
                  <span className="text-xl font-bold text-[#181111]">
                    {wordCount}
                    <span
                      className={`text-sm font-normal ${wordCount >= minWordCount ? "text-green-600" : "text-slate-400"}`}
                    >
                      {" "}
                      / {minWordCount} min
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white border border-slate-200 text-[#181111] font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">
                    save
                  </span>
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 h-12 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-xl animate-spin">
                        progress_activity
                      </span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">
                        smart_toy
                      </span>
                      <span>Submit for AI Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Editor (Bottom Sheet Style) - Shows on small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-4 max-h-[50vh] overflow-y-auto">
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-4 rounded-lg border border-slate-200 bg-slate-50 text-[#181111] text-base leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none placeholder:text-slate-400"
            placeholder="Start typing..."
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-bold">{wordCount}</span>
            <span className="text-slate-500"> / {minWordCount}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="hidden lg:flex fixed bottom-6 left-6 gap-2">
        <button
          className="flex size-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg text-slate-600 hover:text-primary transition-colors"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined">menu_open</span>
        </button>
        <button
          className="flex size-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg text-slate-600 hover:text-primary transition-colors"
          title="Focus Mode"
        >
          <span className="material-symbols-outlined">fullscreen</span>
        </button>
      </div>
    </div>
  );
}
