"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpeakingPrompt } from "@/lib/types/speaking-prompt";

export default function AdminSpeakingPromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPart, setFilterPart] = useState<number | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, [filterPart]);

  const fetchPrompts = async () => {
    try {
      const url = filterPart
        ? `/api/speaking-prompts?part=${filterPart}`
        : "/api/speaking-prompts";

      const response = await fetch(url);
      const { data } = await response.json();
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      const response = await fetch(`/api/speaking-prompts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts(prompts.filter((prompt) => prompt.id !== id));
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      alert("Failed to delete prompt");
    }
  };

  const handleTogglePublish = async (prompt: SpeakingPrompt) => {
    try {
      const response = await fetch(`/api/speaking-prompts/${prompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prompt,
          isPublished: !prompt.isPublished,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setPrompts(prompts.map((p) => (p.id === prompt.id ? data : p)));
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update prompt");
    }
  };

  const getPartLabel = (part: number) => {
    return `Part ${part}`;
  };

  const getPartColor = (part: number) => {
    switch (part) {
      case 1:
        return "bg-blue-100 text-blue-700";
      case 2:
        return "bg-primary/10 text-primary";
      case 3:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Speaking Prompts
          </h1>
          <p className="text-slate-600">
            Manage IELTS speaking practice prompts
          </p>
        </div>
        <Link
          href="/admin/speaking-prompts/add"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Prompt
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterPart(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterPart === null
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          All Parts
        </button>
        <button
          onClick={() => setFilterPart(1)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterPart === 1
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Part 1
        </button>
        <button
          onClick={() => setFilterPart(2)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterPart === 2
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Part 2
        </button>
        <button
          onClick={() => setFilterPart(3)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterPart === 3
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Part 3
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
            mic
          </span>
          <p className="text-gray-600 text-lg mb-4">No speaking prompts yet</p>
          <Link
            href="/admin/speaking-prompts/add"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Create First Prompt
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Prompt
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Part
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Band
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prompts.map((prompt) => (
                <tr
                  key={prompt.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          mic
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {prompt.title}
                        </p>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {prompt.promptText}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPartColor(
                        prompt.part
                      )}`}
                    >
                      {getPartLabel(prompt.part)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{prompt.topic}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary">
                      {prompt.targetBand}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {prompt.preparationTime > 0 && (
                        <div>{prompt.preparationTime}s prep</div>
                      )}
                      <div>{Math.floor(prompt.speakingTime / 60)}m speak</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(prompt)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                        prompt.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {prompt.isPublished ? (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                          Published
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/speaking-prompts/edit/${prompt.id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-slate-600">
                          edit
                        </span>
                      </Link>
                      <Link
                        href={`/practice/speaking/${prompt.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Preview (opens in new tab)"
                      >
                        <span className="material-symbols-outlined text-slate-600">
                          visibility
                        </span>
                      </Link>
                      <button
                        onClick={() => handleDelete(prompt.id!)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-red-600">
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
  );
}
