"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { WritingService, WritingPrompt } from "@/services/writing.service";
import { WRITING_SOURCES, TASK1_SUB_TYPES, TASK2_SUB_TYPES } from "@/lib/constants/writing";

// Simple Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-in slide-in-from-bottom-5 duration-300 z-[100] ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">{type === 'success' ? 'check_circle' : 'error'}</span>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function WritingPromptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const promptId = typeof params.id === 'string' ? params.id : '';
  const isViewMode = searchParams.get('mode') === 'view';
  
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
      title: "",
      category: "task1" as "task1" | "task2" | "builder",
      source: "",
      sub_type: "",
      question_text: "",
      instruction: "",
      image_url: "",
      sample_intro: "",
      sample_overview: "",
      sample_body_1: "",
      sample_body_2: "",
      guide_tips: [] as string[]
  });

  useEffect(() => {
    if (promptId) {
      loadPrompt();
    }
  }, [promptId]);

  const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  // Get sub_type options based on category
  const getSubTypeOptions = () => {
    if (formData.category === "task1" || formData.category === "builder") {
      return TASK1_SUB_TYPES;
    } else if (formData.category === "task2") {
      return TASK2_SUB_TYPES;
    }
    return [];
  };

  // Reset sub_type when category changes
  const handleCategoryChange = (category: "task1" | "task2" | "builder") => {
    setFormData({ ...formData, category, sub_type: "" });
  };

  // Guide Tips management
  const addGuideTip = () => {
    setFormData({ ...formData, guide_tips: [...formData.guide_tips, ""] });
  };

  const removeGuideTip = (index: number) => {
    setFormData({ 
      ...formData, 
      guide_tips: formData.guide_tips.filter((_, i) => i !== index) 
    });
  };

  const updateGuideTip = (index: number, value: string) => {
    const newTips = [...formData.guide_tips];
    newTips[index] = value;
    setFormData({ ...formData, guide_tips: newTips });
  };

  const loadPrompt = async () => {
    try {
      setLoading(true);
      const data = await WritingService.getPromptById(promptId);
      if (!data) {
        showToast("Prompt not found.", "error");
        setTimeout(() => router.push("/admin/writing"), 2000);
        return;
      }
      setPrompt(data);
      
      // Handle migration: use category or fallback to task_type
      const category = data.category || (data.task_type as "task1" | "task2" | "builder") || "task1";
      
      setFormData({
        title: data.title,
        category: category,
        source: data.source || "",
        sub_type: data.sub_type || "",
        question_text: data.question_text || "",
        instruction: data.instruction || "",
        image_url: data.image_url || "",
        sample_intro: data.sample_answer_json?.intro || "",
        sample_overview: data.sample_answer_json?.overview || "",
        sample_body_1: data.sample_answer_json?.body_1 || "",
        sample_body_2: data.sample_answer_json?.body_2 || "",
        guide_tips: data.guide_tips || []
      });
    } catch (error) {
      console.error("Error loading prompt:", error);
      showToast("Failed to load prompt.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
          title: formData.title,
          category: formData.category,
          source: formData.source || undefined,
          sub_type: formData.sub_type || undefined,
          question_text: formData.question_text,
          instruction: formData.instruction,
          image_url: formData.image_url || undefined,
          sample_answer_json: {
              intro: formData.sample_intro,
              overview: formData.sample_overview,
              body_1: formData.sample_body_1,
              body_2: formData.sample_body_2
          },
          guide_tips: formData.category === "builder" && formData.guide_tips.length > 0 
            ? formData.guide_tips.filter(tip => tip.trim() !== "") 
            : undefined
      };

      await WritingService.updatePrompt(promptId, payload);
      showToast("Prompt updated successfully!", "success");
      setTimeout(() => {
        router.push("/admin/writing?updated=true");
      }, 1500);
    } catch (error) {
      console.error("Failed to update prompt:", error);
      showToast("Failed to save. Check console for details.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this prompt? This action cannot be undone.")) {
      try {
        await WritingService.deletePrompt(promptId);
        showToast("Prompt deleted successfully.", "success");
        setTimeout(() => {
          router.push("/admin/writing");
        }, 1500);
      } catch (error) {
        console.error("Delete failed:", error);
        showToast("Failed to delete prompt.", "error");
      }
    }
  };

  const getCategoryBadgeColor = () => {
    if (formData.category === "task1") return "bg-blue-50 text-blue-700 border-blue-200";
    if (formData.category === "task2") return "bg-purple-50 text-purple-700 border-purple-200";
    if (formData.category === "builder") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getCategoryLabel = () => {
    if (formData.category === "task1") return "Task 1";
    if (formData.category === "task2") return "Task 2";
    if (formData.category === "builder") return "Task 1 Builder";
    return "Task 1";
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-gray-400 animate-spin mb-4 block">progress_activity</span>
            <p className="text-gray-500 font-medium">Loading prompt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-8 py-16">
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            </div>
            <p className="text-lg font-bold text-[#181111] mb-2">Prompt not found</p>
            <p className="text-sm text-[#896161] mb-6">The prompt you're looking for doesn't exist or has been deleted.</p>
            <Link 
              href="/admin/writing" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back to Writing Management</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumbs */}
      <div className="px-8 py-4 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Admin
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <Link href="/admin/writing" className="text-[#896161] hover:text-primary transition-colors">
          Writing Management
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">{prompt.title}</span>
      </div>

      {/* Page Heading & Controls */}
      <div className="px-8 py-2 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/writing"
              className="p-2 hover:bg-[#f8f6f6] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#181111]">
                {isViewMode ? "View Writing Prompt" : "Edit Writing Prompt"}
              </h2>
              <p className="text-[#896161] mt-1">
                {isViewMode ? "View prompt details and content" : "Update prompt details and content"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeColor()}`}>
              {getCategoryLabel()}
            </span>
            {isViewMode ? (
              <Link
                href={`/admin/writing/${promptId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">edit</span>
                <span>Edit</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 font-bold hover:bg-red-50 transition-all"
                >
                  <span className="material-symbols-outlined">delete</span>
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-8 py-6 flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Section 1: Categorization */}
          <div className="bg-white rounded-xl border border-[#f4f0f0] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">category</span>
              </div>
              <h3 className="text-lg font-black text-[#181111]">Categorization</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Category *</label>
                <select
                  required
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value as "task1" | "task2" | "builder")}
                >
                  <option value="task1">Task 1</option>
                  <option value="task2">Task 2</option>
                  <option value="builder">Task 1 Builder</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Source</label>
                <select
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  <option value="">Select Source</option>
                  {WRITING_SOURCES.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Sub Type</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  value={formData.sub_type}
                  onChange={(e) => setFormData({...formData, sub_type: e.target.value})}
                  disabled={!formData.category || isViewMode}
                >
                  <option value="">Select Sub Type</option>
                  {getSubTypeOptions().map((subType) => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Content */}
          <div className="bg-white rounded-xl border border-[#f4f0f0] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">description</span>
              </div>
              <h3 className="text-lg font-black text-[#181111]">Content</h3>
            </div>
            
            {/* Image Preview */}
            {formData.image_url && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-[#f4f0f0]">
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Image Preview</label>
                <div className="relative rounded-lg overflow-hidden border border-[#f4f0f0] bg-white">
                  <img 
                    src={formData.image_url} 
                    alt="Prompt image" 
                    className="w-full h-auto max-h-64 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Title *</label>
                  <input 
                    type="text"
                    required
                    disabled={isViewMode}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    placeholder="e.g. The Impact of Technology"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Image URL</label>
                  <input 
                    type="text"
                    disabled={isViewMode}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    placeholder="https://example.com/chart.png"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                  <p className="text-xs text-[#896161] mt-1">Enter a valid image URL to display above</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Question Text *</label>
                  <textarea 
                    required
                    rows={5}
                    disabled={isViewMode}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    placeholder="The charts below show..."
                    value={formData.question_text}
                    onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Instructions *</label>
                  <textarea 
                    required
                    rows={4}
                    disabled={isViewMode}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm font-medium disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    placeholder="Write at least 150 words..."
                    value={formData.instruction}
                    onChange={(e) => setFormData({...formData, instruction: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sample Answer */}
          <div className="bg-white rounded-xl border border-[#f4f0f0] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600">menu_book</span>
              </div>
              <h3 className="text-lg font-black text-[#181111]">Sample Answer</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Introduction</label>
                <textarea 
                  rows={4}
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif text-gray-800 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter sample introduction..."
                  value={formData.sample_intro}
                  onChange={(e) => setFormData({...formData, sample_intro: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Overview</label>
                <textarea 
                  rows={4}
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif text-gray-800 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter sample overview..."
                  value={formData.sample_overview}
                  onChange={(e) => setFormData({...formData, sample_overview: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Body Paragraph 1</label>
                <textarea 
                  rows={5}
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif text-gray-800 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter sample body paragraph 1..."
                  value={formData.sample_body_1}
                  onChange={(e) => setFormData({...formData, sample_body_1: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">Body Paragraph 2</label>
                <textarea 
                  rows={5}
                  disabled={isViewMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif text-gray-800 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter sample body paragraph 2..."
                  value={formData.sample_body_2}
                  onChange={(e) => setFormData({...formData, sample_body_2: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Guide Tips (Conditional for Builder) */}
          {formData.category === "builder" && (
            <div className="bg-white rounded-xl border border-[#f4f0f0] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-600">tips_and_updates</span>
                  </div>
                  <h3 className="text-lg font-black text-[#181111]">Guide Tips</h3>
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={addGuideTip}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold hover:bg-orange-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Tip</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.guide_tips.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">tips_and_updates</span>
                    <p className="text-sm text-gray-500 font-medium">No guide tips yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Tip" to add step-by-step instructions</p>
                  </div>
                ) : (
                  formData.guide_tips.map((tip, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border border-[#f4f0f0]">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-[#896161] uppercase tracking-wide mb-2">
                          Step {index + 1}
                        </label>
                        <textarea
                          rows={3}
                          disabled={isViewMode}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#f4f0f0] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-white disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                          placeholder={`Enter step ${index + 1} instruction...`}
                          value={tip}
                          onChange={(e) => updateGuideTip(index, e.target.value)}
                        />
                      </div>
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => removeGuideTip(index)}
                          className="mt-8 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove tip"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-4 pb-8">
              <Link
                href="/admin/writing"
                className="px-6 py-2.5 rounded-lg border border-[#f4f0f0] font-bold text-[#181111] hover:bg-[#f8f6f6] transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save Changes</span>
                  </span>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
