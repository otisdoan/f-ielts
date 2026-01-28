"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ListeningService,
  ListeningTest,
  ListeningQuestionGroup,
  ListeningQuestion,
} from "@/services/listening.service";
import { LISTENING_SOURCES, SECTION_TYPES, QUESTION_GROUP_TYPES } from "@/lib/constants/listening";

type EditableGroup = Omit<ListeningQuestionGroup, "id" | "test_id" | "questions"> & {
  id?: string;
  questions: (Omit<ListeningQuestion, "id" | "group_id"> & { id?: string })[];
};

function parseCorrectAnswer(val: string | null): string | string[] | Record<string, string> | null {
  if (val == null || val === "") return null;
  try {
    const parsed = JSON.parse(val);
    if (typeof parsed === "object") return parsed;
  } catch {
    // ignore
  }
  return val;
}

export default function EditListeningTestPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"metadata" | "questions">("metadata");

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [sectionType, setSectionType] = useState("full");
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [groups, setGroups] = useState<EditableGroup[]>([]);

  const loadTest = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ListeningService.getTestById(id);
      if (!data) {
        router.replace("/admin/listening");
        return;
      }
      setTest(data);
      setTitle(data.title);
      setSource(data.source ?? "");
      setSectionType(data.section_type ?? "full");
      setAudioUrl(data.audio_url ?? "");
      setTranscript(data.transcript ?? "");
      setStatus(data.status ?? "draft");
      const editableGroups: EditableGroup[] = (data.question_groups || []).map((g) => ({
        instruction: g.instruction ?? null,
        image_url: g.image_url ?? null,
        group_type: g.group_type,
        order_index: g.order_index,
        questions: (g.questions || []).map((q) => ({
          id: q.id,
          question_number: q.question_number,
          question_text: q.question_text ?? null,
          options: q.options ?? null,
          correct_answer: typeof q.correct_answer === "string" ? parseCorrectAnswer(q.correct_answer) : q.correct_answer,
          explanation: q.explanation ?? null,
        })),
      }));
      setGroups(editableGroups);
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to load test.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleSaveMetadata = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await ListeningService.updateTest(id, {
        title,
        source: source || null,
        section_type: sectionType,
        audio_url: audioUrl || null,
        transcript: transcript || null,
        status,
      });
      showToast("Metadata saved.", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await ListeningService.updateTest(id, {
        title,
        source: source || null,
        section_type: sectionType,
        audio_url: audioUrl || null,
        transcript: transcript || null,
        status,
      });
      await ListeningService.saveGroups(
        id,
        groups.map((g, i) => ({
          instruction: g.instruction ?? null,
          image_url: g.image_url || null,
          group_type: g.group_type,
          order_index: i,
          questions: (g.questions || []).map((q, j) => {
            const { id: _, ...rest } = q;
            return {
              question_number: rest.question_number ?? j + 1,
              question_text: rest.question_text || null,
              options: rest.options ?? null,
              correct_answer: rest.correct_answer ?? null,
              explanation: rest.explanation || null,
            };
          }),
        }))
      );
      showToast("All changes saved.", "success");
      loadTest();
    } catch (e) {
      console.error(e);
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    try {
      const url = await ListeningService.uploadAudio(file);
      setAudioUrl(url);
      showToast("Audio uploaded.", "success");
    } catch (err) {
      console.error(err);
      showToast("Audio upload failed. Create bucket 'listening-audio' in Supabase Storage.", "error");
    } finally {
      setUploadingAudio(false);
    }
  };

  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        instruction: null,
        image_url: null,
        group_type: "gap_fill",
        order_index: prev.length,
        questions: [],
      },
    ]);
  };

  const removeGroup = (index: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGroup = (index: number, updates: Partial<EditableGroup>) => {
    setGroups((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const addQuestion = (groupIndex: number) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const num = (g.questions?.length ?? 0) + 1;
      const baseNum = (g.questions || []).reduce((max, q) => Math.max(max, q.question_number ?? 0), 0);
      next[groupIndex] = {
        ...g,
        questions: [
          ...(g.questions || []),
          {
            question_number: baseNum + 1,
            question_text: null,
            correct_answer: null,
            options: null,
            explanation: null,
          } as Omit<ListeningQuestion, "id" | "group_id"> & { id?: string },
        ],
      };
      return next;
    });
  };

  const removeQuestion = (groupIndex: number, qIndex: number) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const questions = (g.questions || []).filter((_, i) => i !== qIndex);
      next[groupIndex] = { ...g, questions };
      return next;
    });
  };

  const updateQuestion = (
    groupIndex: number,
    qIndex: number,
    updates: Partial<EditableGroup["questions"][0]>
  ) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const questions = [...(g.questions || [])];
      questions[qIndex] = { ...questions[qIndex], ...updates };
      next[groupIndex] = { ...g, questions };
      return next;
    });
  };

  const handleGroupImageUpload = async (groupIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `group-${groupIndex}`;
    setUploadingImage(key);
    try {
      const url = await ListeningService.uploadImage(file);
      updateGroup(groupIndex, { image_url: url });
      showToast("Image uploaded.", "success");
    } catch (err) {
      console.error(err);
      showToast("Image upload failed. Create bucket 'listening-images' in Supabase Storage.", "error");
    } finally {
      setUploadingImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#896161]">Loading...</p>
      </div>
    );
  }
  if (!test) return null;

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

      {/* Sticky Audio Player */}
      {audioUrl && (
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-[#e6dbdb] p-4 shadow-lg">
          <p className="text-xs font-medium text-[#896161] mb-1">Preview audio</p>
          <audio controls src={audioUrl} className="w-full max-w-2xl" />
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
        <span className="text-[#181111] font-medium">{test.title || "Edit"}</span>
      </div>

      <div className="px-8 py-4 flex gap-2 border-b border-[#e6dbdb]">
        <button
          type="button"
          onClick={() => setActiveTab("metadata")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "metadata" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700"
          }`}
        >
          Metadata
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "questions" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700"
          }`}
        >
          Question Builder
        </button>
      </div>

      <div className="px-8 py-6 max-w-4xl">
        {activeTab === "metadata" && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">Test Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
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
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
              >
                {SECTION_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">Audio</label>
              <div className="flex flex-col gap-2">
                <input
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="Or paste audio URL (e.g. Google Drive, server)"
                  className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                    {uploadingAudio ? "Uploading..." : "Upload MP3/WAV"}
                  </span>
                  <input
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp3,.mp3,.wav"
                    onChange={handleAudioUpload}
                    disabled={uploadingAudio}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">Transcript</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={10}
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5"
                placeholder="Paste or type the listening script..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#181111] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full border border-[#e6dbdb] rounded-lg px-4 py-2.5 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#181111]">Question Groups</h3>
              <button
                type="button"
                onClick={addGroup}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Group
              </button>
            </div>

            {groups.map((group, gIdx) => (
              <div key={gIdx} className="border border-[#e6dbdb] rounded-xl p-6 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-[#896161]">Group {gIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGroup(gIdx)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Instruction</label>
                    <textarea
                      value={group.instruction ?? ""}
                      onChange={(e) => updateGroup(gIdx, { instruction: e.target.value })}
                      rows={2}
                      className="w-full border border-[#e6dbdb] rounded-lg px-3 py-2 text-sm"
                      placeholder="e.g. Complete the notes below. Write ONE WORD AND/OR A NUMBER"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Question Type</label>
                    <select
                      value={group.group_type}
                      onChange={(e) =>
                        updateGroup(gIdx, {
                          group_type: e.target.value as EditableGroup["group_type"],
                        })
                      }
                      className="w-full border border-[#e6dbdb] rounded-lg px-3 py-2 bg-white"
                    >
                      {QUESTION_GROUP_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(group.group_type === "map_labeling" || group.group_type === "matching") && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Image (optional)</label>
                      {group.image_url ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={group.image_url}
                            alt="Group"
                            className="max-h-32 rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => updateGroup(gIdx, { image_url: "" })}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                            {uploadingImage === `group-${gIdx}` ? "Uploading..." : "Upload image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleGroupImageUpload(gIdx, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#e6dbdb]">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Questions</label>
                      <button
                        type="button"
                        onClick={() => addQuestion(gIdx)}
                        className="text-primary text-sm font-medium flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add question
                      </button>
                    </div>

                    {(group.questions || []).map((q, qIdx) => (
                      <div key={qIdx} className="mb-4 pl-4 border-l-2 border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Q{q.question_number ?? qIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeQuestion(gIdx, qIdx)}
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        {group.group_type === "gap_fill" && (
                          <>
                            <input
                              type="text"
                              value={q.question_text ?? ""}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, { question_text: e.target.value })
                              }
                              placeholder="Question text with [1], [2]..."
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <input
                              type="text"
                              value={
                                typeof q.correct_answer === "string" ? q.correct_answer : ""
                              }
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  correct_answer: e.target.value || null,
                                })
                              }
                              placeholder="Correct answer (use | for alternatives: 10am | 10.00 am)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                          </>
                        )}
                        {group.group_type === "multiple_choice_one" && (
                          <>
                            <input
                              type="text"
                              value={q.question_text ?? ""}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, { question_text: e.target.value })
                              }
                              placeholder="Question text"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <div className="text-xs text-gray-500 mb-1">Options (one per line)</div>
                            <textarea
                              value={(Array.isArray(q.options) ? q.options : []).join("\n")}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  options: e.target.value.split("\n").filter(Boolean),
                                })
                              }
                              rows={3}
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                              placeholder="A. Option A&#10;B. Option B"
                            />
                            <input
                              type="text"
                              value={
                                typeof q.correct_answer === "string" ? q.correct_answer : ""
                              }
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  correct_answer: e.target.value || null,
                                })
                              }
                              placeholder="Correct answer (e.g. A or Option A)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                          </>
                        )}
                        {group.group_type === "multiple_choice_many" && (
                          <>
                            <input
                              type="text"
                              value={q.question_text ?? ""}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, { question_text: e.target.value })
                              }
                              placeholder="Question text (e.g. Which are the TWO main duties?)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <div className="text-xs text-gray-500 mb-1">Options (one per line)</div>
                            <textarea
                              value={(Array.isArray(q.options) ? q.options : []).join("\n")}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  options: e.target.value.split("\n").filter(Boolean),
                                })
                              }
                              rows={3}
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <input
                              type="text"
                              value={
                                Array.isArray(q.correct_answer)
                                  ? q.correct_answer.join(", ")
                                  : typeof q.correct_answer === "string"
                                    ? q.correct_answer
                                    : ""
                              }
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  correct_answer: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : null,
                                })
                              }
                              placeholder="Correct answers (comma-separated: A, C)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                          </>
                        )}
                        {group.group_type === "matching" && (
                          <>
                            <input
                              type="text"
                              value={q.question_text ?? ""}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, { question_text: e.target.value })
                              }
                              placeholder="Left column item (e.g. 1. Ken Simpson)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <input
                              type="text"
                              value={
                                typeof q.correct_answer === "string" ? q.correct_answer : ""
                              }
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  correct_answer: e.target.value || null,
                                })
                              }
                              placeholder="Correct option (e.g. A, B, C)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                          </>
                        )}
                        {group.group_type === "map_labeling" && (
                          <>
                            <input
                              type="text"
                              value={q.question_text ?? ""}
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, { question_text: e.target.value })
                              }
                              placeholder="Label or question (e.g. 11)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                            <input
                              type="text"
                              value={
                                typeof q.correct_answer === "string" ? q.correct_answer : ""
                              }
                              onChange={(e) =>
                                updateQuestion(gIdx, qIdx, {
                                  correct_answer: e.target.value || null,
                                })
                              }
                              placeholder="Correct answer (letter or word)"
                              className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                            />
                          </>
                        )}
                        <textarea
                          value={q.explanation ?? ""}
                          onChange={(e) =>
                            updateQuestion(gIdx, qIdx, { explanation: e.target.value })
                          }
                          rows={2}
                          className="w-full border rounded px-2 py-1.5 text-sm text-gray-600"
                          placeholder="Explanation (optional)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-primary hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-bold"
          >
            {saving ? "Saving..." : "Save All"}
          </button>
          {activeTab === "metadata" && (
            <button
              type="button"
              onClick={handleSaveMetadata}
              disabled={saving}
              className="border border-[#e6dbdb] px-6 py-2.5 rounded-lg font-medium text-[#181111]"
            >
              Save metadata only
            </button>
          )}
          <Link
            href="/admin/listening"
            className="px-6 py-2.5 rounded-lg border border-[#e6dbdb] text-[#181111] font-medium"
          >
            Back to list
          </Link>
        </div>
      </div>
    </div>
  );
}
