"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SpeakingService, SpeakingTopic } from "@/services/speaking.service";
import { SPEAKING_PARTS, DIFFICULTY_LEVELS } from "@/lib/constants/speaking";

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

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getPartLabel(part: number) {
  const partInfo = SPEAKING_PARTS.find((p) => p.value === part);
  return partInfo ? partInfo.label : `Part ${part}`;
}

export default function AdminSpeakingPage() {
  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<SpeakingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filters, setFilters] = useState({ part: "", difficulty: "", status: "" });

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    let list = [...topics];
    if (filters.part) list = list.filter((t) => t.part === parseInt(filters.part));
    if (filters.difficulty) list = list.filter((t) => t.difficulty === filters.difficulty);
    if (filters.status) list = list.filter((t) => t.status === filters.status);
    setFilteredTopics(list);
  }, [topics, filters]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("created") === "true") {
      setToast({ message: "Topic created successfully!", type: "success" });
      window.history.replaceState({}, "", "/admin/speaking");
    } else if (params.get("updated") === "true") {
      setToast({ message: "Topic updated successfully!", type: "success" });
      window.history.replaceState({}, "", "/admin/speaking");
    }
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const data = await SpeakingService.getTopics();
    setTopics(data || []);
    setLoading(false);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this speaking topic?")) return;
    try {
      await SpeakingService.deleteTopic(id);
      showToast("Topic deleted successfully.", "success");
      loadTopics();
    } catch (e) {
      showToast("Failed to delete topic.", "error");
      console.error(e);
    }
  };

  const handleToggleStatus = async (topic: SpeakingTopic) => {
    try {
      if (topic.status === "published") {
        await SpeakingService.unpublishTopic(topic.id);
        showToast("Topic unpublished.", "success");
      } else {
        await SpeakingService.publishTopic(topic.id);
        showToast("Topic published.", "success");
      }
      loadTopics();
    } catch (e) {
      showToast("Failed to update status.", "error");
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumb */}
      <div className="px-8 py-4 flex items-center gap-2 text-sm border-b border-[#e6dbdb]">
        <Link href="/admin" className="text-[#896161] hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
        <span className="text-[#181111] font-medium">Speaking Management</span>
      </div>

      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-[#e6dbdb]">
        <div>
          <h1 className="text-2xl font-bold text-[#181111] mb-1">Speaking Topics</h1>
          <p className="text-sm text-[#896161]">Manage IELTS speaking practice topics</p>
        </div>
        <Link href="/admin/speaking/new">
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New Topic
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 flex gap-4 bg-[#f8f6f6] border-b border-[#e6dbdb]">
        <select
          value={filters.part}
          onChange={(e) => setFilters((f) => ({ ...f, part: e.target.value }))}
          className="border border-[#e6dbdb] rounded-lg px-4 py-2 bg-white text-sm"
        >
          <option value="">All Parts</option>
          {SPEAKING_PARTS.map((p) => (
            <option key={p.value} value={p.value}>
              Part {p.value}
            </option>
          ))}
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
          className="border border-[#e6dbdb] rounded-lg px-4 py-2 bg-white text-sm"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTY_LEVELS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="border border-[#e6dbdb] rounded-lg px-4 py-2 bg-white text-sm"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {(filters.part || filters.difficulty || filters.status) && (
          <button
            onClick={() => setFilters({ part: "", difficulty: "", status: "" })}
            className="text-sm text-primary hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Topics List */}
      <div className="flex-1 px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topics...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e6dbdb]">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              mic_off
            </span>
            <p className="text-gray-600 text-lg font-medium mb-2">No topics found</p>
            <p className="text-gray-500 text-sm mb-6">
              {filters.part || filters.difficulty || filters.status
                ? "Try adjusting your filters"
                : "Get started by creating your first speaking topic"}
            </p>
            {!filters.part && !filters.difficulty && !filters.status && (
              <Link href="/admin/speaking/new">
                <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                  Add New Topic
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e6dbdb] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f8f6f6] border-b border-[#e6dbdb]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Part
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#896161] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dbdb]">
                {filteredTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-[#f8f6f6] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#181111]">{topic.title}</div>
                      <div className="text-xs text-[#896161] mt-1 line-clamp-1">
                        {topic.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        Part {topic.part}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#181111]">{topic.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(
                          topic.difficulty
                        )}`}
                      >
                        {topic.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(topic)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          topic.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {topic.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/speaking/${topic.id}`}>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px] text-[#181111]">
                              edit
                            </span>
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(topic.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px] text-red-600">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
