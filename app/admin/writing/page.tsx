
"use client";

import { useState, useEffect } from "react";
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

export default function AdminWritingPage() {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const initialFormState = {
      title: "",
      task_type: "task1" as "task1" | "task2",
      question_text: "",
      instruction: "",
      image_url: "",
      sample_intro: "",
      sample_overview: "",
      sample_body_1: "",
      sample_body_2: ""
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadPrompts();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  const loadPrompts = async () => {
    setLoading(true);
    const data = await WritingService.getPrompts();
    setPrompts(data || []);
    setLoading(false);
  };

  const handleOpenModal = (prompt?: WritingPrompt) => {
    if (prompt) {
      setEditingId(prompt.id);
      setFormData({
        title: prompt.title,
        task_type: prompt.task_type,
        question_text: prompt.question_text || "",
        instruction: prompt.instruction || "",
        image_url: prompt.image_url || "",
        // Unpack JSON Sample Answer
        sample_intro: prompt.sample_answer_json?.intro || "",
        sample_overview: prompt.sample_answer_json?.overview || "",
        sample_body_1: prompt.sample_answer_json?.body_1 || "",
        sample_body_2: prompt.sample_answer_json?.body_2 || ""
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (editingId) {
        await WritingService.updatePrompt(editingId, payload);
        showToast("Prompt updated successfully!", "success");
      } else {
        await WritingService.createPrompt(payload);
        showToast("New prompt created successfully!", "success");
      }
      setIsModalOpen(false);
      loadPrompts();
    } catch (error) {
      console.error("Failed to save prompt:", error);
      showToast("Failed to save. Check console for details.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      try {
          await WritingService.deletePrompt(id);
          showToast("Prompt deleted successfully.", "success");
          loadPrompts();
      } catch (error) {
          console.error("Delete failed:", error);
          showToast("Failed to delete prompt.", "error");
      }
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-[#181111]">Writing Prompts Management</h1>
           <p className="text-[#896161]">Manage Task 1 and Task 2 questions (Simplified Schema).</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Prompt
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-light/50 text-[#896161] font-bold uppercase text-[11px] tracking-wider border-b border-[#e6dbdb]">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dbdb]">
            {loading ? (
               <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading prompts...</td>
               </tr>
            ) : prompts.length === 0 ? (
                <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No prompts found. Create one!</td>
               </tr>
            ) : (
              prompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#181111]">{prompt.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${prompt.task_type === 'task1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {prompt.task_type === 'task1' ? 'Task 1' : 'Task 2'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                      {prompt.created_at ? new Date(prompt.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => handleOpenModal(prompt)}
                        className="text-gray-400 hover:text-primary mr-3 transition-colors"
                        title="Edit"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                        onClick={() => handleDelete(prompt.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative hide-scrollbar">
            <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#181111]"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-[#181111] sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                {editingId ? "Edit Prompt" : "Create New Prompt"}
            </h2>
            
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

                    {/* Writing Content & Sample (Simplified Split) */}
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
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 rounded-lg border border-[#e6dbdb] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-2 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-colors"
                    >
                        {editingId ? "Save Changes" : "Create Prompt"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
