"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ListeningService } from "@/services/listening.service";
import { LISTENING_SOURCES, SECTION_TYPES } from "@/lib/constants/listening";

export default function NewListeningTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    source: "",
    section_type: "full",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Please enter a test title.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = await ListeningService.createTest({
        title: formData.title.trim(),
        source: formData.source || null,
        section_type: formData.section_type,
        status: "draft",
      });
      showToast("Test created. Add audio, transcript and questions.", "success");
      router.push(`/admin/listening/${id}`);
    } catch (error) {
      console.error("Create failed:", error);
      showToast("Failed to create test.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold z-[100] ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="px-8 py-4 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <Link href="/admin/listening" className="text-[#896161] hover:text-primary transition-colors">
          Listening Management
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">New Test</span>
      </div>

      <div className="px-8 py-4 max-w-2xl">
        <h2 className="text-2xl font-bold text-[#181111] mb-6">Create Listening Test</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">Test Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111]"
              placeholder="e.g. Cam 18 - Test 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData((f) => ({ ...f, source: e.target.value }))}
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
            >
              <option value="">Select source</option>
              {LISTENING_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">Test Type</label>
            <select
              value={formData.section_type}
              onChange={(e) => setFormData((f) => ({ ...f, section_type: e.target.value }))}
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
            >
              {SECTION_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="bg-primary hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-bold"
            >
              {isSubmitting ? "Creating..." : "Create & Edit"}
            </button>
            <Link
              href="/admin/listening"
              className="px-5 py-2.5 rounded-lg border border-[#e6dbdb] text-[#181111] font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
