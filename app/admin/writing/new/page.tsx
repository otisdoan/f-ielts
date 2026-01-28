"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WritingService } from "@/services/writing.service";
import { WRITING_SOURCES, TASK1_SUB_TYPES, TASK2_SUB_TYPES } from "@/lib/constants/writing";

// Simple Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
    return (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-in slide-in-from-bottom-5 duration-300 z-[100] ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">{type === 'success' ? 'check_circle' : 'error'}</span>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function CreateWritingPromptPage() {
  const router = useRouter();
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

      await WritingService.createPrompt(payload);
      showToast("New prompt created successfully!", "success");
      setTimeout(() => {
        router.push("/admin/writing");
      }, 1500);
    } catch (error) {
      console.error("Failed to create prompt:", error);
      showToast("Failed to save. Check console for details.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Admin
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <Link href="/admin/writing" className="text-[#896161] hover:text-primary transition-colors">
          Writing Management
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">New Prompt</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/writing"
            className="p-2 hover:bg-background-light rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#181111]">Create New Prompt</h1>
            <p className="text-[#896161]">Add a new writing prompt for Task 1 or Task 2</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Section 1: Categorization */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">category</span>
              <span>Categorization</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value as "task1" | "task2" | "builder")}
                >
                  <option value="task1">Task 1</option>
                  <option value="task2">Task 2</option>
                  <option value="builder">Task 1 Builder</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Source</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Sub Type</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                  value={formData.sub_type}
                  onChange={(e) => setFormData({...formData, sub_type: e.target.value})}
                  disabled={!formData.category}
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
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">description</span>
              <span>Content</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. The Impact of Technology"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://example.com/chart.png"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Question Text *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="The charts below show..."
                    value={formData.question_text}
                    onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Instructions *</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Write at least 150 words..."
                    value={formData.instruction}
                    onChange={(e) => setFormData({...formData, instruction: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sample Answer */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">menu_book</span>
              <span>Writing Content & Sample</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sample Introduction</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#e6dbdb] text-sm focus:border-primary outline-none resize-none font-serif text-gray-800"
                  placeholder="Enter sample introduction..."
                  value={formData.sample_intro}
                  onChange={(e) => setFormData({...formData, sample_intro: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sample Overview</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#e6dbdb] text-sm focus:border-primary outline-none resize-none font-serif text-gray-800"
                  placeholder="Enter sample overview..."
                  value={formData.sample_overview}
                  onChange={(e) => setFormData({...formData, sample_overview: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sample Body Paragraph 1</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-[#e6dbdb] text-sm focus:border-primary outline-none resize-none font-serif text-gray-800"
                  placeholder="Enter sample body paragraph 1..."
                  value={formData.sample_body_1}
                  onChange={(e) => setFormData({...formData, sample_body_1: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sample Body Paragraph 2</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-[#e6dbdb] text-sm focus:border-primary outline-none resize-none font-serif text-gray-800"
                  placeholder="Enter sample body paragraph 2..."
                  value={formData.sample_body_2}
                  onChange={(e) => setFormData({...formData, sample_body_2: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Guide Tips (Conditional for Builder) */}
          {formData.category === "builder" && (
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">tips_and_updates</span>
                  <span>Guide Tips (Step-by-step instructions)</span>
                </h3>
                <button
                  type="button"
                  onClick={addGuideTip}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary font-bold hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Tip
                </button>
              </div>
              <div className="space-y-3">
                {formData.guide_tips.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No guide tips yet. Click "Add Tip" to add step-by-step instructions.</p>
                ) : (
                  formData.guide_tips.map((tip, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Step {index + 1}
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-[#e6dbdb] text-sm focus:border-primary outline-none resize-none"
                          placeholder={`Enter step ${index + 1} instruction...`}
                          value={tip}
                          onChange={(e) => updateGuideTip(index, e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGuideTip(index)}
                        className="mt-6 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove tip"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/writing"
              className="px-6 py-2 rounded-lg border border-[#e6dbdb] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Prompt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
