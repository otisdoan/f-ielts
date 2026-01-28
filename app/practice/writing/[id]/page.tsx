"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { WritingService, WritingPrompt } from "@/services/writing.service";

// WritingSection Component - shows sample in textarea when enabled
function WritingSection({
  label,
  sampleText,
  value,
  onChange,
  showSample,
  placeholder,
  minHeight = "200px"
}: {
  label: string;
  sampleText?: string;
  value: string;
  onChange: (value: string) => void;
  showSample: boolean;
  placeholder?: string;
  minHeight?: string;
}) {
  // When showSample is true, display sample text and make readonly
  // When showSample is false, display user content and allow editing
  const displayValue = showSample && sampleText ? sampleText : value;
  const isReadonly = showSample && sampleText;

  return (
    <div className="transition-all duration-300 ease-in-out">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        {label}
        {isReadonly && (
          <span className="ml-2 text-blue-600 font-normal normal-case">(Sample Answer - Read Only)</span>
        )}
      </label>
      <textarea
        value={displayValue}
        onChange={(e) => !isReadonly && onChange(e.target.value)}
        readOnly={isReadonly}
        disabled={isReadonly}
        placeholder={isReadonly ? "" : placeholder}
        className={`w-full p-6 rounded-lg border text-lg leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none shadow-sm placeholder:text-slate-400 transition-all duration-300 ${
          isReadonly
            ? "bg-blue-50 text-blue-900 border-blue-200 cursor-not-allowed font-serif"
            : "bg-white text-[#181111] border-slate-200"
        }`}
        style={{ minHeight }}
      />
    </div>
  );
}

export default function WritingPracticeInterface() {
  const params = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // 'practice' (default) or 'review'
  
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentParts, setContentParts] = useState({
    intro: "",
    overview: "",
    body_1: "",
    body_2: ""
  });
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSample, setShowSample] = useState(false);
  
  const promptId = typeof params.id === 'string' ? params.id : '';

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

  // Calculate word count from all content parts (only when not showing sample)
  useEffect(() => {
    if (showSample) {
      // Don't count sample words
      setWordCount(0);
    } else {
      const allContent = Object.values(contentParts).join(" ");
      const words = allContent.trim().split(/\s+/).filter(w => w.length > 0).length;
      setWordCount(words);
    }
  }, [contentParts, showSample]);

  // Logic condition to view sample
  const canViewSample = wordCount >= 100 || isSubmitting;

  const toggleSample = () => {
    if (canViewSample) {
        setShowSample(!showSample);
    } else {
        alert("Please write at least 100 words to unlock the sample answer.");
    }
  };

  const updateContentPart = (part: keyof typeof contentParts, value: string) => {
    if (!showSample) {
      setContentParts(prev => ({ ...prev, [part]: value }));
    }
  };

  // Combine content parts for save/submit
  const getCombinedContent = () => {
    const parts = [];
    if (contentParts.intro) parts.push(contentParts.intro);
    if (contentParts.overview) parts.push(contentParts.overview);
    if (contentParts.body_1) parts.push(contentParts.body_1);
    if (contentParts.body_2) parts.push(contentParts.body_2);
    return parts.join("\n\n");
  };

  // Handle Save / Submit
  const handleSaveDraft = async () => {
    // TODO: Supabase Update
    const combinedContent = getCombinedContent();
    console.log("Saving draft...", combinedContent);
    alert("Draft saved!");
  };

  const handleSubmit = async () => {
    // TODO: Supabase Insert/Update -> Trigger AI
    setIsSubmitting(true);
    const combinedContent = getCombinedContent();
    setTimeout(() => {
        setIsSubmitting(false);
        alert("Submitted for evaluation! (Mock)");
        // Redirect to result page or switch mode
    }, 1500);
  }

  // Loading State
  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-background-light">Loading prompt...</div>;
  }

  if (!prompt) {
       return <div className="min-h-screen flex items-center justify-center bg-background-light">Prompt not found.</div>;
  }

  // Render "Review" mode (Result View)
  if (mode === 'review') {
      return (
          <div className="bg-background-light min-h-screen font-sans">
              <header className="sticky top-0 z-50 bg-white border-b border-[#e6dbdb] px-6 py-4 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                        <Link href="/practice/writing" className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
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
                          {/* Mock content for review */}
                          In contemporary society, the debate regarding whether technology improves our lives...
                      </div>
                  </div>
              </main>
          </div>
      )
  }

  // Render "Practice" mode (Editor View)
  return (
    <div className="bg-background-light text-[#181111] min-h-screen flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
              <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">F-IELTS</h2>
          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            <Link className="text-[#896161] hover:text-primary transition-colors" href="/practice/writing">Writing Practice</Link>
            <span className="text-[#896161]">/</span>
            <span className="text-[#181111]">{prompt.task_type === 'task1' ? 'Task 1' : 'Task 2'}</span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          {/* Timer Component (Static for now) */}
          <div className="flex gap-2 items-center bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
            <span className="material-symbols-outlined text-primary text-lg">timer</span>
            <div className="flex gap-1.5">
              <div className="flex flex-col items-center">
                <p className="text-[#181111] text-sm font-bold font-mono">00</p>
              </div>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <div className="flex flex-col items-center">
                <p className="text-[#181111] text-sm font-bold font-mono">20</p>
              </div>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <div className="flex flex-col items-center">
                <p className="text-[#181111] text-sm font-bold font-mono">00</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={handleSaveDraft}
                disabled={showSample}
                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-slate-100 text-[#181111] text-sm font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
              <span>Save Draft</span>
            </button>
            <Link href="/practice/writing">
              <button className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors">
                <span>Exit</span>
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Task Description */}
        <div className="w-1/2 border-r border-slate-200 overflow-y-auto bg-white p-8 hide-scrollbar">
          <div className="max-w-2xl ml-auto">
            <div className="mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Academic Writing</span>
              <h2 className="text-[#181111] text-2xl font-bold mt-3">{prompt.task_type === 'task1' ? 'Task 1' : 'Task 2'}</h2>
            </div>
            <div className="space-y-6">
              {/* Question Text */}
              {prompt.question_text && (
                  <div className="text-[#181111] text-lg font-medium leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                    {prompt.question_text}
                  </div>
              )}

              {/* Image */}
              {prompt.image_url && (
                  <div className="rounded-xl border border-slate-200 p-4 bg-white overflow-hidden shadow-sm">
                    <img src={prompt.image_url} alt="Task visualization" className="w-full h-auto rounded-lg" />
                  </div>
              )}
              
              {/* Instruction Note */}
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800">
                <span className="material-symbols-outlined mt-0.5">lightbulb</span>
                <div className="text-sm">
                  <p className="font-bold mb-1">Instructions:</p>
                  <div className="whitespace-pre-wrap leading-relaxed">
                      {prompt.instruction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel: Text Editor */}
        <div className="w-1/2 flex flex-col bg-slate-50 p-8 overflow-hidden">
          <div className="max-w-2xl flex-1 flex flex-col overflow-y-auto">
          
            {/* Sample Answer Toggle */}
            <div className="flex items-center space-x-3 mb-6 sticky top-0 bg-slate-50 z-10 py-2">
              <span className="text-sm font-bold text-gray-700">Show Sample Answer</span>
              <button
                onClick={toggleSample}
                disabled={!canViewSample && !showSample}
                title={canViewSample ? "Toggle Sample Answer" : "Write at least 100 words to view sample"}
                className={`${
                  showSample ? 'bg-primary' : (canViewSample ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-200 opacity-50 cursor-not-allowed')
                } relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none`}
              >
                <span
                  className={`${
                    showSample ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                />
              </button>
              {!canViewSample && !showSample && (
                  <span className="text-xs text-red-500 font-medium animate-pulse">
                      (Write {100 - wordCount > 0 ? 100 - wordCount : 0} more words to unlock)
                  </span>
              )}
              {showSample && (
                  <span className="text-xs text-blue-600 font-medium">
                      (Sample answer is displayed - toggle off to continue writing)
                  </span>
              )}
            </div>

            {/* Editor Toolbar */}
            <div className={`flex items-center gap-2 mb-4 ${showSample ? 'opacity-50 pointer-events-none' : ''}`}>
              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                <span className="material-symbols-outlined">undo</span>
              </button>
              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                <span className="material-symbols-outlined">redo</span>
              </button>
              <div className="h-6 w-[1px] bg-slate-300 mx-1"></div>
              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                <span className="material-symbols-outlined">format_bold</span>
              </button>
              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                <span className="material-symbols-outlined">format_italic</span>
              </button>
              <div className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Auto-saved
              </div>
            </div>

            {/* Writing Sections */}
            <div className="space-y-6 flex-1 transition-all duration-300 ease-in-out">
              {/* Introduction Section */}
              <WritingSection
                label="Introduction"
                sampleText={prompt.sample_answer_json?.intro}
                value={contentParts.intro}
                onChange={(val) => updateContentPart('intro', val)}
                showSample={showSample}
                placeholder="Write your introduction here..."
                minHeight="150px"
              />

              {/* Overview Section (Only for Task 1) */}
              {prompt.task_type === 'task1' && (
                <WritingSection
                  label="Overview"
                  sampleText={prompt.sample_answer_json?.overview}
                  value={contentParts.overview}
                  onChange={(val) => updateContentPart('overview', val)}
                  showSample={showSample}
                  placeholder="Write your overview here..."
                  minHeight="120px"
                />
              )}

              {/* Body Paragraph 1 */}
              <WritingSection
                label="Body Paragraph 1"
                sampleText={prompt.sample_answer_json?.body_1}
                value={contentParts.body_1}
                onChange={(val) => updateContentPart('body_1', val)}
                showSample={showSample}
                placeholder="Write your first body paragraph here..."
                minHeight="200px"
              />

              {/* Body Paragraph 2 */}
              <WritingSection
                label="Body Paragraph 2"
                sampleText={prompt.sample_answer_json?.body_2}
                value={contentParts.body_2}
                onChange={(val) => updateContentPart('body_2', val)}
                showSample={showSample}
                placeholder="Write your second body paragraph here..."
                minHeight="200px"
              />
            </div>

            {/* Bottom Bar Actions */}
            <div className="mt-6 flex items-center justify-between sticky bottom-0 bg-slate-50 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Word Count</span>
                  <span className="text-xl font-bold text-[#181111]">
                    {showSample ? (
                      <span className="text-slate-400">Sample Mode</span>
                    ) : (
                      <>
                        {wordCount}<span className="text-slate-400 text-sm font-normal"> / {prompt.task_type === 'task1' ? 150 : 250} min</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || showSample}
                    className="flex items-center gap-2 px-8 h-12 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                        <span>Submitting...</span>
                      </>
                  ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                        <span>Submit for AI Evaluation</span>
                      </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
