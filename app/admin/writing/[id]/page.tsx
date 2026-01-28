"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { WritingService, WritingPrompt } from "@/services/writing.service";

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
  const promptId = typeof params.id === 'string' ? params.id : '';
  
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
      title: "",
      task_type: "task1" as "task1" | "task2",
      question_text: "",
      instruction: "",
      image_url: "",
      sample_intro: "",
      sample_overview: "",
      sample_body_1: "",
      sample_body_2: ""
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
      setFormData({
        title: data.title,
        task_type: data.task_type,
        question_text: data.question_text || "",
        instruction: data.instruction || "",
        image_url: data.image_url || "",
        sample_intro: data.sample_answer_json?.intro || "",
        sample_overview: data.sample_answer_json?.overview || "",
        sample_body_1: data.sample_answer_json?.body_1 || "",
        sample_body_2: data.sample_answer_json?.body_2 || ""
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
          task_type: formData.task_type,
          question_text: formData.question_text,
          instruction: formData.instruction,
          image_url: formData.image_url,
          sample_answer_json: {
              intro: formData.sample_intro,
              overview: formData.sample_overview,
              body_1: formData.sample_body_1,
              body_2: formData.sample_body_2
          }
      };

      await WritingService.updatePrompt(promptId, payload);
      showToast("Prompt updated successfully!", "success");
      setTimeout(() => {
        router.push("/admin/writing");
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

  if (loading) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin mb-4">progress_activity</span>
            <p className="text-gray-500">Loading prompt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <p className="text-gray-500 mb-4">Prompt not found.</p>
          <Link href="/admin/writing" className="text-primary hover:underline">
            Back to Writing Management
          </Link>
        </div>
      </div>
    );
  }

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
        <span className="text-[#181111] font-medium">{prompt.title}</span>
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
            <h1 className="text-2xl font-bold text-[#181111]">Edit Prompt</h1>
            <p className="text-[#896161]">Update writing prompt details</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 font-bold hover:bg-red-50 transition-all"
        >
          <span className="material-symbols-outlined">delete</span>
          Delete
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-primary">Basic Information</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Task Type</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                  value={formData.task_type}
                  onChange={(e) => setFormData({...formData, task_type: e.target.value as "task1" | "task2"})}
                >
                  <option value="task1">Task 1 (Academic/General)</option>
                  <option value="task2">Task 2 (Essay)</option>
                </select>
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Question Text</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Instructions</label>
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

            {/* Writing Content & Sample */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">menu_book</span>
                <span>Writing Content & Sample</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
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
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
