"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ListeningService, ListeningTest } from "@/services/listening.service";
import { LISTENING_SOURCES, SECTION_TYPES } from "@/lib/constants/listening";

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold z-[100] ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined">
          {type === "success" ? "check_circle" : "error"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function getAudioStatus(audioUrl: string | null): "none" | "ok" | "error" {
  if (!audioUrl || audioUrl.trim() === "") return "none";
  return "ok";
}

function getAudioStatusLabel(status: "none" | "ok" | "error") {
  if (status === "none") return "Chưa có";
  if (status === "error") return "Lỗi";
  return "Đã upload";
}

function getTypeLabel(sectionType: string) {
  if (sectionType === "full") return "Full Test (4 Parts)";
  const part = SECTION_TYPES.find((s) => s.value === sectionType);
  return part?.label ?? sectionType;
}

export default function AdminListeningPage() {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filters, setFilters] = useState({ source: "", section_type: "" });

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    let list = [...tests];
    if (filters.source) list = list.filter((t) => t.source === filters.source);
    if (filters.section_type) list = list.filter((t) => t.section_type === filters.section_type);
    setFilteredTests(list);
  }, [tests, filters]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("created") === "true") {
      setToast({ message: "Test created successfully!", type: "success" });
      window.history.replaceState({}, "", "/admin/listening");
    } else if (params.get("updated") === "true") {
      setToast({ message: "Test updated successfully!", type: "success" });
      window.history.replaceState({}, "", "/admin/listening");
    }
  }, []);

  const loadTests = async () => {
    setLoading(true);
    const data = await ListeningService.getTests();
    setTests(data || []);
    setLoading(false);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listening test?")) return;
    try {
      await ListeningService.deleteTest(id);
      showToast("Test deleted successfully.", "success");
      loadTests();
    } catch (e) {
      console.error(e);
      showToast("Failed to delete test.", "error");
    }
  };

  const displayTests = filteredTests.length > 0 ? filteredTests : tests;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="px-8 py-4 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">Listening Management</span>
      </div>

      <div className="px-8 py-2 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#181111]">
              Listening Tests Management
            </h2>
            <p className="text-[#896161] mt-1">
              Create and manage IELTS listening tests with audio and question groups
            </p>
          </div>
          <Link
            href="/admin/listening/new"
            className="bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add New Test</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filters.source}
            onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
            className="border border-[#e6dbdb] rounded-lg px-3 py-2 text-sm bg-white min-w-[180px]"
          >
            <option value="">All sources</option>
            {LISTENING_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.section_type}
            onChange={(e) => setFilters((f) => ({ ...f, section_type: e.target.value }))}
            className="border border-[#e6dbdb] rounded-lg px-3 py-2 text-sm bg-white min-w-[180px]"
          >
            <option value="">All sections</option>
            {SECTION_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-[#e6dbdb] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#896161]">Loading tests...</div>
          ) : displayTests.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">
                headphones
              </span>
              <p className="text-gray-500">No listening tests yet. Create your first test.</p>
              <Link
                href="/admin/listening/new"
                className="inline-block mt-4 text-primary font-semibold hover:underline"
              >
                Add New Test
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#e6dbdb]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audio Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dbdb]">
                  {displayTests.map((test) => {
                    const audioStatus = getAudioStatus(test.audio_url);
                    return (
                      <tr key={test.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm font-medium text-[#181111]">
                          {test.title}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={
                              audioStatus === "ok"
                                ? "text-green-600"
                                : audioStatus === "error"
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }
                          >
                            {getAudioStatusLabel(audioStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {test.source || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getTypeLabel(test.section_type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {test.question_count ?? 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              test.status === "published"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {test.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/practice/listening/${test.id}?preview=1`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Preview"
                            >
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </Link>
                            <Link
                              href={`/admin/listening/${test.id}`}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(test.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
