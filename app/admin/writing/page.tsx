"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function AdminWritingPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    category: "",
    source: "",
    sub_type: ""
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  // Apply filters when prompts or filters change
  useEffect(() => {
    applyFilters();
  }, [prompts, filters]);

  // Check for success message from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === 'true') {
      showToast("Prompt created successfully!", "success");
      window.history.replaceState({}, '', '/admin/writing');
    } else if (params.get('updated') === 'true') {
      showToast("Prompt updated successfully!", "success");
      window.history.replaceState({}, '', '/admin/writing');
    }
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

  const applyFilters = () => {
    let filtered = [...prompts];

    if (filters.category) {
      filtered = filtered.filter(p => {
        const category = p.category || p.task_type;
        return category === filters.category;
      });
    }

    if (filters.source) {
      filtered = filtered.filter(p => p.source === filters.source);
    }

    if (filters.sub_type) {
      filtered = filtered.filter(p => p.sub_type === filters.sub_type);
    }

    setFilteredPrompts(filtered);
  };

  const clearFilters = () => {
    setFilters({ category: "", source: "", sub_type: "" });
  };

  const getSubTypeOptions = () => {
    if (filters.category === "task1" || filters.category === "builder") {
      return TASK1_SUB_TYPES;
    } else if (filters.category === "task2") {
      return TASK2_SUB_TYPES;
    }
    return [];
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

  const getCategoryLabel = (prompt: WritingPrompt) => {
    const category = prompt.category || prompt.task_type || "task1";
    if (category === "task1") return "Task 1";
    if (category === "task2") return "Task 2";
    if (category === "builder") return "Task 1 Builder";
    return "Task 1";
  };

  const getCategoryBadgeColor = (prompt: WritingPrompt) => {
    const category = prompt.category || prompt.task_type || "task1";
    if (category === "task1") return "bg-blue-100 text-blue-700";
    if (category === "task2") return "bg-purple-100 text-purple-700";
    if (category === "builder") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  const displayPrompts = filteredPrompts.length > 0 ? filteredPrompts : prompts;
  const hasActiveFilters = filters.category || filters.source || filters.sub_type;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Admin
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">Writing Management</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-[#181111]">Writing Prompts Management</h1>
           <p className="text-[#896161]">Manage Task 1 and Task 2 questions with advanced categorization.</p>
        </div>
        <Link
          href="/admin/writing/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Prompt
        </Link>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl border border-[#e6dbdb] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <span className="material-symbols-outlined">filter_list</span>
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter by Category */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-sm"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value, sub_type: ""})}
            >
              <option value="">All Categories</option>
              <option value="task1">Task 1</option>
              <option value="task2">Task 2</option>
              <option value="builder">Task 1 Builder</option>
            </select>
          </div>
          
          {/* Filter by Source */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-sm"
              value={filters.source}
              onChange={(e) => setFilters({...filters, source: e.target.value})}
            >
              <option value="">All Sources</option>
              {WRITING_SOURCES.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          
          {/* Filter by Sub Type */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Type</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-[#e6dbdb] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-sm"
              value={filters.sub_type}
              onChange={(e) => setFilters({...filters, sub_type: e.target.value})}
              disabled={!filters.category}
            >
              <option value="">All Sub Types</option>
              {getSubTypeOptions().map((subType) => (
                <option key={subType} value={subType}>{subType}</option>
              ))}
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-light/50 text-[#896161] font-bold uppercase text-[11px] tracking-wider border-b border-[#e6dbdb]">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Sub Type</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dbdb]">
            {loading ? (
               <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading prompts...</td>
               </tr>
            ) : displayPrompts.length === 0 ? (
                <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                   <div className="flex flex-col items-center gap-4">
                     <span className="material-symbols-outlined text-6xl text-gray-300">description</span>
                     <p>{hasActiveFilters ? "No prompts match the selected filters." : "No prompts found. Create one!"}</p>
                     {!hasActiveFilters && (
                       <Link
                         href="/admin/writing/new"
                         className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
                       >
                         <span className="material-symbols-outlined">add</span>
                         Create First Prompt
                       </Link>
                     )}
                   </div>
                 </td>
               </tr>
            ) : (
              displayPrompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#181111]">{prompt.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getCategoryBadgeColor(prompt)}`}>
                      {getCategoryLabel(prompt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {prompt.source || <span className="text-gray-400 italic">-</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {prompt.sub_type || <span className="text-gray-400 italic">-</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                      {prompt.created_at ? new Date(prompt.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/writing/${prompt.id}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="View/Edit"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </Link>
                      <Link
                        href={`/admin/writing/${prompt.id}`}
                        className="text-gray-400 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(prompt.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
