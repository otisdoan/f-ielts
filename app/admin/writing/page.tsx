"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    loadPrompts();
  }, []);

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
           <p className="text-[#896161]">Manage Task 1 and Task 2 questions (Simplified Schema).</p>
        </div>
        <Link
          href="/admin/writing/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Prompt
        </Link>
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
                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                   <div className="flex flex-col items-center gap-4">
                     <span className="material-symbols-outlined text-6xl text-gray-300">description</span>
                     <p>No prompts found. Create one!</p>
                     <Link
                       href="/admin/writing/new"
                       className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
                     >
                       <span className="material-symbols-outlined">add</span>
                       Create First Prompt
                     </Link>
                   </div>
                 </td>
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
