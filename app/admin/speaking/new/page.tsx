"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpeakingService } from "@/services/speaking.service";
import {
  SPEAKING_PARTS,
  DIFFICULTY_LEVELS,
  SPEAKING_CATEGORIES,
} from "@/lib/constants/speaking";

export default function NewSpeakingTopicPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState({
    part: 2,
    title: "",
    description: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    category: "Personal",
    preparation_time: 60,
    speaking_time: 120,
    tips: [""],
    sample_answer: "",
    status: "draft" as "draft" | "published",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Please enter a topic title.", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Please enter a description.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const tipsFiltered = formData.tips.filter((t) => t.trim() !== "");
      await SpeakingService.createTopic({
        part: formData.part,
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        category: formData.category,
        preparation_time: formData.part === 2 ? formData.preparation_time : 0,
        speaking_time: formData.speaking_time,
        tips: tipsFiltered.length > 0 ? tipsFiltered : undefined,
        sample_answer: formData.sample_answer.trim() || null,
        status: formData.status,
      });
      showToast("Topic created successfully!", "success");
      setTimeout(() => {
        router.push("/admin/speaking?created=true");
      }, 1000);
    } catch (error) {
      console.error("Create failed:", error);
      showToast("Failed to create topic.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTip = () => {
    setFormData((f) => ({ ...f, tips: [...f.tips, ""] }));
  };

  const removeTip = (index: number) => {
    setFormData((f) => ({ ...f, tips: f.tips.filter((_, i) => i !== index) }));
  };

  const updateTip = (index: number, value: string) => {
    setFormData((f) => {
      const newTips = [...f.tips];
      newTips[index] = value;
      return { ...f, tips: newTips };
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold z-[100] ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-8 py-4 flex items-center gap-2 text-sm border-b border-[#e6dbdb]">
        <Link
          href="/admin"
          className="text-[#896161] hover:text-primary transition-colors"
        >
          Home
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">
          chevron_right
        </span>
        <Link
          href="/admin/speaking"
          className="text-[#896161] hover:text-primary transition-colors"
        >
          Speaking Management
        </Link>
        <span className="material-symbols-outlined text-xs text-[#896161]">
          chevron_right
        </span>
        <span className="text-[#181111] font-medium">New Topic</span>
      </div>

      {/* Form */}
      <div className="px-8 py-6 max-w-4xl">
        <h2 className="text-2xl font-bold text-[#181111] mb-6">
          Create Speaking Topic
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Part Selection */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-2">
              Speaking Part *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SPEAKING_PARTS.map((part) => (
                <button
                  key={part.value}
                  type="button"
                  onClick={() =>
                    setFormData((f) => ({ ...f, part: part.value }))
                  }
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    formData.part === part.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-[#e6dbdb] text-[#896161] hover:border-primary/50"
                  }`}
                >
                  Part {part.value}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">
              Topic Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111]"
              placeholder="e.g. Describe a book you recently read"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111] min-h-[100px]"
              placeholder="You should say: what the book is, why you chose it, what it is about, and explain why you liked or disliked it."
            />
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
              >
                {SPEAKING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    difficulty: e.target.value as "Easy" | "Medium" | "Hard",
                  }))
                }
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            {formData.part === 2 && (
              <div>
                <label className="block text-sm font-medium text-[#181111] mb-1">
                  Preparation Time (seconds)
                </label>
                <input
                  type="number"
                  value={formData.preparation_time}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      preparation_time: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111]"
                  min="0"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">
                Speaking Time (seconds)
              </label>
              <input
                type="number"
                value={formData.speaking_time}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    speaking_time: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111]"
                min="0"
              />
            </div>
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-2">
              Speaking Tips
            </label>
            <div className="space-y-2">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => updateTip(index, e.target.value)}
                    className="flex-1 border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111]"
                    placeholder="Enter a helpful tip..."
                  />
                  <button
                    type="button"
                    onClick={() => removeTip(index)}
                    className="px-3 py-2 border border-[#e6dbdb] rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-red-600">
                      delete
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTip}
              className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Tip
            </button>
          </div>

          {/* Sample Answer */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-1">
              Sample Answer (Optional)
            </label>
            <textarea
              value={formData.sample_answer}
              onChange={(e) =>
                setFormData((f) => ({ ...f, sample_answer: e.target.value }))
              }
              className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 text-[#181111] min-h-[150px]"
              placeholder="Provide a sample answer for reference..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#181111] mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData((f) => ({ ...f, status: "draft" }))}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  formData.status === "draft"
                    ? "border-gray-500 bg-gray-100 text-gray-700"
                    : "border-[#e6dbdb] text-[#896161] hover:border-gray-300"
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({ ...f, status: "published" }))
                }
                className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  formData.status === "published"
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-[#e6dbdb] text-[#896161] hover:border-green-300"
                }`}
              >
                Publish Immediately
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#e6dbdb]">
            <Link href="/admin/speaking" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-3 border border-[#e6dbdb] rounded-lg text-[#181111] font-bold hover:bg-[#f8f6f6] transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
