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
    if (category === "task1") return "bg-blue-50 text-blue-700 border-blue-200";
    if (category === "task2") return "bg-purple-50 text-purple-700 border-purple-200";
    if (category === "builder") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Calculate stats
  const stats = {
    total: prompts.length,
    task1: prompts.filter(p => (p.category || p.task_type) === "task1").length,
    task2: prompts.filter(p => (p.category || p.task_type) === "task2").length,
    builder: prompts.filter(p => (p.category || p.task_type) === "builder").length,
  };

  const displayPrompts = filteredPrompts.length > 0 ? filteredPrompts : prompts;
  const hasActiveFilters = filters.category || filters.source || filters.sub_type;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumbs */}
      <div className="px-8 py-4 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Admin
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">Writing Management</span>
      </div>

      {/* Page Heading & Controls */}
      <div className="px-8 py-2 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#181111]">Writing Prompts Management</h2>
            <p className="text-[#896161] mt-1">Manage Task 1 and Task 2 questions with advanced categorization</p>
          </div>
          <Link
            href="/admin/writing/new"
            className="bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add New Prompt</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#f4f0f0] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#896161] uppercase tracking-wide mb-1">Total Prompts</p>
                <p className="text-2xl font-black text-[#181111]">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#f4f0f0] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#896161] uppercase tracking-wide mb-1">Task 1</p>
                <p className="text-2xl font-black text-blue-700">{stats.task1}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-2xl">bar_chart</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#f4f0f0] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#896161] uppercase tracking-wide mb-1">Task 2</p>
                <p className="text-2xl font-black text-purple-700">{stats.task2}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 text-2xl">edit_note</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#f4f0f0] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#896161] uppercase tracking-wide mb-1">Builders</p>
                <p className="text-2xl font-black text-orange-700">{stats.builder}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600 text-2xl">tips_and_updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#f4f0f0] shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilters({...filters, category: ""})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !filters.category
                  ? "bg-primary text-white"
                  : "bg-[#f4f0f0] text-[#181111] hover:bg-zinc-200"
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setFilters({...filters, category: "task1", sub_type: ""})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category === "task1"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-[#f4f0f0] text-[#181111] hover:bg-zinc-200"
              }`}
            >
              Task 1
            </button>
            <button
              onClick={() => setFilters({...filters, category: "task2", sub_type: ""})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category === "task2"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-[#f4f0f0] text-[#181111] hover:bg-zinc-200"
              }`}
            >
              Task 2
            </button>
            <button
              onClick={() => setFilters({...filters, category: "builder", sub_type: ""})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category === "builder"
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-[#f4f0f0] text-[#181111] hover:bg-zinc-200"
              }`}
            >
              Task 1 Builder
            </button>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <span className="text-xs text-[#896161] font-medium">
                {filteredPrompts.length} of {prompts.length} prompts
              </span>
            )}
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-1.5 rounded-lg border border-[#f4f0f0] bg-white text-sm text-[#181111] font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                value={filters.source}
                onChange={(e) => setFilters({...filters, source: e.target.value})}
              >
                <option value="">All Sources</option>
                {WRITING_SOURCES.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              {filters.category && (
                <select
                  className="px-3 py-1.5 rounded-lg border border-[#f4f0f0] bg-white text-sm text-[#181111] font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                  value={filters.sub_type}
                  onChange={(e) => setFilters({...filters, sub_type: e.target.value})}
                >
                  <option value="">All Sub Types</option>
                  {getSubTypeOptions().map((subType) => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-[#896161] hover:text-[#181111] hover:bg-[#f4f0f0] transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-[#f4f0f0] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-[#f4f0f0]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Prompt Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Source</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Sub Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Created</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0f0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-gray-300 animate-spin">progress_activity</span>
                      <p className="text-gray-500 font-medium">Loading prompts...</p>
                    </div>
                  </td>
                </tr>
              ) : displayPrompts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">description</span>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#181111] mb-1">
                          {hasActiveFilters ? "No prompts match your filters" : "No prompts yet"}
                        </p>
                        <p className="text-sm text-[#896161]">
                          {hasActiveFilters 
                            ? "Try adjusting your filters to see more results" 
                            : "Get started by creating your first writing prompt"}
                        </p>
                      </div>
                      {!hasActiveFilters && (
                        <Link
                          href="/admin/writing/new"
                          className="mt-2 bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20"
                        >
                          <span className="material-symbols-outlined">add</span>
                          <span>Create First Prompt</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-[#f8f6f6] transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#181111] mb-1">{prompt.title}</p>
                        <p className="text-xs text-[#896161] line-clamp-1">
                          {prompt.question_text || "No question text"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryBadgeColor(prompt)}`}>
                        {getCategoryLabel(prompt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {prompt.source ? (
                        <span className="text-sm font-medium text-zinc-700">{prompt.source}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {prompt.sub_type ? (
                        <span className="text-sm font-medium text-zinc-700">{prompt.sub_type}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-600">
                        {prompt.created_at 
                          ? new Date(prompt.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/writing/${prompt.id}`}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Prompt"
                        >
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </Link>
                        <Link
                          href={`/admin/writing/${prompt.id}`}
                          className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Prompt"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(prompt.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Prompt"
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
      </div>
    </div>
  );
}
