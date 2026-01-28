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
  const isReadonly: boolean = Boolean(showSample && sampleText);

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
        onChange={(e) => {
          if (!isReadonly) {
            onChange(e.target.value);
          }
        }}
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
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-gray-400 animate-spin mb-4 block">progress_activity</span>
            <p className="text-gray-500 font-medium">Loading prompt...</p>
          </div>
        </div>
      );
  }

  if (!prompt) {
       return (
         <div className="min-h-screen flex items-center justify-center bg-background-light">
           <div className="text-center">
             <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="material-symbols-outlined text-4xl text-red-400">error</span>
             </div>
             <p className="text-lg font-bold text-[#181111] mb-2">Prompt not found</p>
             <p className="text-sm text-[#896161] mb-6">The prompt you're looking for doesn't exist.</p>
             <Link href="/practice/writing">
               <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined">arrow_back</span>
                 <span>Back to Writing Practice</span>
               </button>
             </Link>
           </div>
         </div>
       );
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
      <header className="flex items-center justify-between border-b border-[#f4f0f0] bg-white px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/practice/writing" className="p-2 hover:bg-[#f8f6f6] rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div className="h-8 w-px bg-[#f4f0f0]"></div>
          <div className="flex items-center gap-2 text-sm">
            <Link className="text-[#896161] hover:text-primary transition-colors font-medium" href="/practice/writing">
              Writing Practice
            </Link>
            <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
            <span className="text-[#181111] font-bold">
              {(prompt.category || prompt.task_type) === 'task1' ? 'Task 1' : 'Task 2'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer Component */}
          <div className="flex gap-2 items-center bg-[#f8f6f6] px-4 py-2 rounded-lg border border-[#f4f0f0]">
            <span className="material-symbols-outlined text-primary text-lg">timer</span>
            <div className="flex gap-1.5 font-mono">
              <span className="text-[#181111] text-sm font-bold">00</span>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <span className="text-[#181111] text-sm font-bold">20</span>
              <span className="text-[#181111] text-sm font-bold">:</span>
              <span className="text-[#181111] text-sm font-bold">00</span>
            </div>
          </div>
          <div className="h-8 w-px bg-[#f4f0f0]"></div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveDraft}
              disabled={showSample}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#f4f0f0] text-[#181111] text-sm font-bold hover:bg-[#f8f6f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>Save Draft</span>
            </button>
            <Link href="/practice/writing">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">close</span>
                <span>Exit</span>
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Task Description */}
        <div className="w-1/2 border-r border-[#f4f0f0] overflow-y-auto bg-white p-8">
          <div className="max-w-2xl ml-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                  Academic Writing
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                  (prompt.category || prompt.task_type) === 'task1' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {(prompt.category || prompt.task_type) === 'task1' ? 'Task 1' : 'Task 2'}
                </span>
              </div>
              <h2 className="text-3xl font-black text-[#181111] mb-2">
                {(prompt.category || prompt.task_type) === 'task1' ? 'Task 1' : 'Task 2'}
              </h2>
              {prompt.sub_type && (
                <p className="text-sm text-[#896161] font-medium">{prompt.sub_type}</p>
              )}
            </div>
            <div className="space-y-6">
              {/* Question Text */}
              {prompt.question_text && (
                <div className="bg-[#f8f6f6] rounded-xl border border-[#f4f0f0] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="text-xs font-bold text-[#896161] uppercase tracking-wider">Question</span>
                  </div>
                  <p className="text-[#181111] text-lg font-medium leading-relaxed">
                    {prompt.question_text}
                  </p>
                </div>
              )}

              {/* Image */}
              {prompt.image_url && (
                <div className="rounded-xl border border-[#f4f0f0] p-4 bg-white overflow-hidden shadow-sm">
                  <img 
                    src={prompt.image_url} 
                    alt="Task visualization" 
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Instruction Note */}
              <div className="flex items-start gap-4 p-5 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="size-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-yellow-700">lightbulb</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-yellow-900 mb-2 text-sm uppercase tracking-wider">Instructions</p>
                  <div className="text-yellow-800 leading-relaxed whitespace-pre-wrap">
                    {prompt.instruction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel: Text Editor */}
        <div className="w-1/2 flex flex-col bg-[#f8f6f6] p-8 overflow-hidden">
          <div className="max-w-2xl flex-1 flex flex-col overflow-y-auto">
          
            {/* Sample Answer Toggle */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#f8f6f6] z-10 py-3 px-4 rounded-xl border border-[#f4f0f0] bg-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                <span className="text-sm font-bold text-[#181111]">Show Sample Answer</span>
              </div>
              <div className="flex items-center gap-3">
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
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm`}
                  />
                </button>
                {!canViewSample && !showSample && (
                  <span className="text-xs text-red-600 font-medium">
                    Write {100 - wordCount > 0 ? 100 - wordCount : 0} more words
                  </span>
                )}
                {showSample && (
                  <span className="text-xs text-blue-600 font-medium">
                    Sample Mode
                  </span>
                )}
              </div>
            </div>

            {/* Editor Toolbar */}
            {!showSample && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-lg border border-[#f4f0f0]">
                <button className="p-2 hover:bg-[#f8f6f6] rounded-lg text-[#896161] transition-colors" title="Undo">
                  <span className="material-symbols-outlined text-lg">undo</span>
                </button>
                <button className="p-2 hover:bg-[#f8f6f6] rounded-lg text-[#896161] transition-colors" title="Redo">
                  <span className="material-symbols-outlined text-lg">redo</span>
                </button>
                <div className="h-6 w-px bg-[#f4f0f0] mx-1"></div>
                <button className="p-2 hover:bg-[#f8f6f6] rounded-lg text-[#896161] transition-colors" title="Bold">
                  <span className="material-symbols-outlined text-lg">format_bold</span>
                </button>
                <button className="p-2 hover:bg-[#f8f6f6] rounded-lg text-[#896161] transition-colors" title="Italic">
                  <span className="material-symbols-outlined text-lg">format_italic</span>
                </button>
                <div className="ml-auto flex items-center gap-2 text-xs font-medium text-[#896161]">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Auto-saved</span>
                </div>
              </div>
            )}

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
            <div className="mt-6 flex items-center justify-between sticky bottom-0 bg-[#f8f6f6] pt-4 pb-2 border-t border-[#f4f0f0]">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#896161] font-bold mb-1">Word Count</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#181111]">
                      {showSample ? (
                        <span className="text-gray-400">Sample Mode</span>
                      ) : (
                        wordCount
                      )}
                    </span>
                    {!showSample && (
                      <span className="text-sm text-[#896161] font-medium">
                        / {(prompt.category || prompt.task_type) === 'task1' ? 150 : 250} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
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
