
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
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-in slide-in-from-bottom-5 duration-300 z-100 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">{type === 'success' ? 'check_circle' : 'error'}</span>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function AdminWritingPage() {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "task1" | "task2">("all");

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

  // Filter and search logic
  useEffect(() => {
    let filtered = prompts;
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(p => p.task_type === filterType);
    }
    
    // Search by title or question
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.question_text && p.question_text.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredPrompts(filtered);
  }, [prompts, filterType, searchQuery]);

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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold text-[#181111]">Writing Prompts Management</h1>
           <p className="text-[#896161] mt-1">Manage IELTS Task 1 and Task 2 writing questions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Prompt
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#896161]">
              search
            </span>
            <input 
              type="text"
              placeholder="Search by title or question..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter by Type */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filterType === "all" 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("task1")}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filterType === "task1" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Task 1
            </button>
            <button
              onClick={() => setFilterType("task2")}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filterType === "task2" 
                  ? "bg-purple-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Task 2
            </button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 text-sm text-[#896161]">
          Showing <span className="font-bold text-[#181111]">{filteredPrompts.length}</span> of <span className="font-bold text-[#181111]">{prompts.length}</span> prompts
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-light/50 text-[#896161] font-bold uppercase text-[11px] tracking-wider border-b border-[#e6dbdb]">
            <tr>
              <th className="px-6 py-4 w-12">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Question Preview</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dbdb]">
            {loading ? (
               <tr>
                 <td colSpan={6} className="px-6 py-12 text-center">
                   <div className="flex flex-col items-center gap-3">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                     <p className="text-gray-500">Loading prompts...</p>
                   </div>
                 </td>
               </tr>
            ) : filteredPrompts.length === 0 ? (
                <tr>
                 <td colSpan={6} className="px-6 py-12 text-center">
                   <div className="flex flex-col items-center gap-3">
                     <span className="material-symbols-outlined text-6xl text-gray-300">search_off</span>
                     <p className="text-gray-500">
                       {searchQuery || filterType !== "all" 
                         ? "No prompts match your search criteria" 
                         : "No prompts found. Create your first one!"
                       }
                     </p>
                   </div>
                 </td>
               </tr>
            ) : (
              filteredPrompts.map((prompt, index) => (
                <tr key={prompt.id} className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {prompt.image_url && (
                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          <img 
                            src={prompt.image_url} 
                            alt={prompt.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="font-semibold text-[#181111] line-clamp-2">
                        {prompt.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      prompt.task_type === 'task1' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {prompt.task_type === 'task1' ? 'Task 1' : 'Task 2'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs">
                    <p className="line-clamp-2 text-xs">
                      {prompt.question_text || prompt.instruction || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                      {prompt.created_at ? new Date(prompt.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                          onClick={() => handleOpenModal(prompt)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button 
                          onClick={() => handleDelete(prompt.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#181111] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      {editingId ? 'edit_note' : 'add_circle'}
                    </span>
                    {editingId ? "Edit Writing Prompt" : "Create New Writing Prompt"}
                  </h2>
                  <p className="text-sm text-[#896161] mt-1">
                    Fill in the details below to {editingId ? 'update' : 'create'} an IELTS writing prompt
                  </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-[#181111] hover:bg-gray-100 rounded-lg transition-all"
                    title="Close"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
                {/* Basic Information Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <h3 className="font-bold text-lg text-[#181111]">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input 
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="e.g., The Impact of Technology on Education"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Task Type <span className="text-red-500">*</span>
                      </label>
                      <select
                          title="Select task type"
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                          value={formData.task_type}
                          onChange={(e) => setFormData({...formData, task_type: e.target.value as "task1" | "task2"})}
                      >
                          <option value="task1">Task 1 - Academic/General (150 words)</option>
                          <option value="task2">Task 2 - Essay (250 words)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.task_type === 'task1' 
                          ? 'Charts, graphs, diagrams, or processes' 
                          : 'Opinion essays, discussion, problem-solution'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Image URL {formData.task_type === 'task1' && <span className="text-orange-500">(recommended)</span>}
                      </label>
                      <input 
                          type="url"
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="https://example.com/chart.png"
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      />
                      {formData.image_url && (
                        <div className="mt-3 border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
                          <img 
                            src={formData.image_url} 
                            alt="Preview" 
                            className="w-full h-32 object-contain rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E❌ Invalid URL%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Content Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <h3 className="font-bold text-lg text-[#181111]">Question Content</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Question Text <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none font-serif"
                          placeholder="Describe the main question or prompt for students..."
                          value={formData.question_text}
                          onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Be clear and specific</span>
                        <span>{formData.question_text.length} characters</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Instructions <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          placeholder="e.g., Write at least 150 words. You should spend about 20 minutes on this task."
                          value={formData.instruction}
                          onChange={(e) => setFormData({...formData, instruction: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Sample Answer Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">school</span>
                    <h3 className="font-bold text-lg text-[#181111]">
                      Sample Answer (Band 9.0)
                    </h3>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                      Optional but Recommended
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-xl">lightbulb</span>
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">💡 Pro Tip:</p>
                        <p>Provide a high-quality sample answer to help students understand what a Band 9.0 response looks like. Break it down into clear sections.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        📝 Introduction
                      </label>
                      <textarea 
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif leading-relaxed"
                          placeholder="Write the introduction paragraph..."
                          value={formData.sample_intro}
                          onChange={(e) => setFormData({...formData, sample_intro: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        🔍 Overview
                      </label>
                      <textarea 
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif leading-relaxed"
                          placeholder="Write the overview paragraph..."
                          value={formData.sample_overview}
                          onChange={(e) => setFormData({...formData, sample_overview: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        📊 Body Paragraph 1
                      </label>
                      <textarea 
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif leading-relaxed"
                          placeholder="Write the first body paragraph..."
                          value={formData.sample_body_1}
                          onChange={(e) => setFormData({...formData, sample_body_1: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        📊 Body Paragraph 2
                      </label>
                      <textarea 
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#e6dbdb] text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-serif leading-relaxed"
                          placeholder="Write the second body paragraph..."
                          value={formData.sample_body_2}
                          onChange={(e) => setFormData({...formData, sample_body_2: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-3 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex items-center gap-2 px-10 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-red-600 hover:shadow-xl transition-all"
                    >
                        <span className="material-symbols-outlined">
                          {editingId ? 'check_circle' : 'add_circle'}
                        </span>
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
