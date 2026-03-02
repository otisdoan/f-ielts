"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ListeningTest,
  ListeningPart,
  ListeningQuestion,
  ListeningQuestionType,
} from "@/lib/types/listening-test";

export default function EditListeningTestPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    targetBand: 7.0,
    duration: 30,
    audioUrl: "",
    audioDuration: 0,
    canReplay: false,
    parts: [] as ListeningPart[],
    isPublished: false,
  });

  const [currentPart, setCurrentPart] = useState<Partial<ListeningPart>>({
    partNumber: 1,
    title: "",
    instruction: "",
    context: {
      title: "",
      prefilledData: {},
    },
    questions: [],
  });

  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchTest();
  }, [params.id]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/listening-tests/${params.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch test: ${response.status}`);
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Test not found");
      }

      setFormData({
        title: data.title,
        targetBand: data.targetBand,
        duration: data.duration,
        audioUrl: data.audioUrl,
        audioDuration: data.audioDuration,
        canReplay: data.canReplay,
        parts: data.parts,
        isPublished: data.isPublished,
      });
    } catch (error) {
      console.error("Error fetching test:", error);
      alert(
        "Failed to load test. The test may not exist or the database table may not be created yet. Please run the migration first.",
      );
      router.push("/admin/listening-tests");
    } finally {
      setLoading(false);
    }
  };

  const getTotalQuestions = () => {
    return formData.parts.reduce((acc, part) => acc + part.questions.length, 0);
  };

  const handleAddPart = () => {
    if (!currentPart.title || !currentPart.instruction) {
      alert("Please fill in Part Title and Instruction");
      return;
    }

    const newPart: ListeningPart = {
      partNumber: formData.parts.length + 1,
      title: currentPart.title || "",
      instruction: currentPart.instruction || "",
      context: currentPart.context || {},
      questions: currentPart.questions || [],
    };

    if (editingPartIndex !== null) {
      const parts = [...formData.parts];
      parts[editingPartIndex] = newPart;
      setFormData({ ...formData, parts });
      setEditingPartIndex(null);
    } else {
      setFormData({
        ...formData,
        parts: [...formData.parts, newPart],
      });
    }

    setCurrentPart({
      partNumber: formData.parts.length + 2,
      title: "",
      instruction: "",
      context: { title: "", prefilledData: {} },
      questions: [],
    });
    setShowPartModal(false);
  };

  const handleEditPart = (index: number) => {
    setCurrentPart(formData.parts[index]);
    setEditingPartIndex(index);
    setShowPartModal(true);
  };

  const handleDeletePart = (index: number) => {
    if (!confirm("Delete this part?")) return;
    const parts = formData.parts.filter((_, i) => i !== index);
    const renumberedParts = parts.map((p, i) => ({ ...p, partNumber: i + 1 }));
    setFormData({ ...formData, parts: renumberedParts });
  };

  const addQuestionToCurrentPart = () => {
    const questionNumber = (currentPart.questions?.length || 0) + 1;
    const newQ: ListeningQuestion = {
      id: `q-${Date.now()}`,
      questionNumber,
      type: "fill-in-blank",
      label: "",
      correctAnswer: "",
    };
    setCurrentPart({
      ...currentPart,
      questions: [...(currentPart.questions || []), newQ],
    });
  };

  const removeQuestionFromCurrentPart = (index: number) => {
    const questions = (currentPart.questions || []).filter(
      (_, i) => i !== index,
    );
    const renumberedQuestions = questions.map((q, i) => ({
      ...q,
      questionNumber: i + 1,
    }));
    setCurrentPart({ ...currentPart, questions: renumberedQuestions });
  };

  const updateQuestionInCurrentPart = (
    index: number,
    field: keyof ListeningQuestion,
    value: any,
  ) => {
    const questions = [...(currentPart.questions || [])];
    questions[index] = { ...questions[index], [field]: value };
    setCurrentPart({ ...currentPart, questions });
  };

  const addOptionToQuestion = (qIndex: number) => {
    const questions = [...(currentPart.questions || [])];
    if (!questions[qIndex].options) {
      questions[qIndex].options = [];
    }
    questions[qIndex].options!.push("");
    setCurrentPart({ ...currentPart, questions });
  };

  const updateQuestionOption = (
    qIndex: number,
    optIndex: number,
    value: string,
  ) => {
    const questions = [...(currentPart.questions || [])];
    questions[qIndex].options![optIndex] = value;
    setCurrentPart({ ...currentPart, questions });
  };

  const removeQuestionOption = (qIndex: number, optIndex: number) => {
    const questions = [...(currentPart.questions || [])];
    questions[qIndex].options!.splice(optIndex, 1);
    setCurrentPart({ ...currentPart, questions });
  };

  const addPrefilledField = () => {
    const key = prompt("Enter field name (e.g., 'Customer Name'):");
    if (!key) return;
    const value = prompt("Enter field value:");
    if (value === null) return;

    setCurrentPart({
      ...currentPart,
      context: {
        ...currentPart.context,
        prefilledData: {
          ...(currentPart.context?.prefilledData || {}),
          [key]: value,
        },
      },
    });
  };

  const removePrefilledField = (key: string) => {
    const data = { ...(currentPart.context?.prefilledData || {}) };
    delete data[key];
    setCurrentPart({
      ...currentPart,
      context: {
        ...currentPart.context,
        prefilledData: data,
      },
    });
  };

  const handleSubmit = async (publish: boolean | null = null) => {
    if (
      !formData.title ||
      !formData.audioUrl ||
      formData.audioDuration === 0 ||
      formData.parts.length === 0
    ) {
      alert("Please fill in all required fields and add at least one part");
      return;
    }

    let qCounter = 1;
    const numberedParts = formData.parts.map((part) => ({
      ...part,
      questions: part.questions.map((q) => ({
        ...q,
        questionNumber: qCounter++,
      })),
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`/api/listening-tests/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          targetBand: formData.targetBand,
          duration: formData.duration,
          audioUrl: formData.audioUrl,
          audioDuration: formData.audioDuration,
          canReplay: formData.canReplay,
          parts: numberedParts,
          isPublished: publish !== null ? publish : formData.isPublished,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      alert("Test updated successfully!");
      router.push("/admin/listening-tests");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[#e6dbdb] flex-none z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/listening-tests"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#181111]">
                Edit Listening Test
              </h1>
              <p className="text-sm text-[#896161]">
                Modify your listening test
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-red-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              {formData.isPublished ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Test Info */}
        <div className="w-1/2 flex flex-col border-r border-[#e6dbdb] bg-white">
          <div className="p-4 border-b border-[#e6dbdb] bg-gray-50">
            <h2 className="font-bold text-gray-700">Test Information</h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Same form fields as Add page */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Test Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Practice Test #04 - Accommodation Booking"
                className="w-full text-lg border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Band *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                  value={formData.targetBand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetBand: parseFloat(e.target.value),
                    })
                  }
                >
                  {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <span className="material-symbols-outlined">headphones</span>
                Audio Information
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Audio URL *
                </label>
                <input
                  type="text"
                  placeholder="/audio/practice-04.mp3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                  value={formData.audioUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, audioUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Audio Duration (Seconds) *
                </label>
                <input
                  type="number"
                  placeholder="252"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                  value={formData.audioDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioDuration: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.audioDuration > 0 &&
                    `= ${Math.floor(formData.audioDuration / 60)}:${String(
                      formData.audioDuration % 60,
                    ).padStart(2, "0")} minutes`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canReplay"
                  className="size-5 text-primary focus:ring-primary rounded"
                  checked={formData.canReplay}
                  onChange={(e) =>
                    setFormData({ ...formData, canReplay: e.target.checked })
                  }
                />
                <label htmlFor="canReplay" className="text-sm font-medium">
                  Allow audio replay
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-3">Test Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Parts:</span>
                  <span className="font-bold">{formData.parts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-bold">{getTotalQuestions()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-bold ${
                      formData.isPublished ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {formData.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Parts Builder - Same as Add page */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-[#e6dbdb] bg-white flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Test Parts</h2>
            <button
              onClick={() => {
                setCurrentPart({
                  partNumber: formData.parts.length + 1,
                  title: `Part ${formData.parts.length + 1}: Questions ${
                    getTotalQuestions() + 1
                  }-${getTotalQuestions() + 10}`,
                  instruction: "",
                  context: { title: "", prefilledData: {} },
                  questions: [],
                });
                setEditingPartIndex(null);
                setShowPartModal(true);
              }}
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Part
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {formData.parts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <span className="material-symbols-outlined text-6xl mb-4">
                  queue_music
                </span>
                <p>No parts yet.</p>
                <p className="text-sm">Click "Add Part" to start.</p>
              </div>
            )}

            {formData.parts.map((part, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-[#e6dbdb] overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-[#e6dbdb] flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded font-bold">
                        Part {part.partNumber}
                      </span>
                      <span className="text-xs text-gray-500">
                        {part.questions.length} questions
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{part.title}</h3>
                    <p className="text-sm text-gray-600 italic mt-1">
                      {part.instruction}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPart(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeletePart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {part.context?.title && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-1">
                        Context: {part.context.title}
                      </p>
                      {part.context.prefilledData &&
                        Object.keys(part.context.prefilledData).length > 0 && (
                          <div className="text-xs text-gray-600">
                            {Object.entries(part.context.prefilledData).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <strong>{key}:</strong> {value}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {part.questions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm"
                      >
                        <span className="font-bold text-primary">
                          Q{qIndex + 1}:
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-700">
                            {q.type === "fill-in-blank" ? q.label : q.text}
                          </span>
                          {q.type === "multiple-choice" &&
                            q.options &&
                            q.options.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Options: {q.options.length}
                              </div>
                            )}
                        </div>
                        <span className="text-xs text-green-600 font-medium">
                          ✓ {q.correctAnswer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Part Editor Modal - Same as Add page */}
      {showPartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-primary to-red-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingPartIndex !== null ? "Edit Part" : "Add New Part"}
                </h2>
                <p className="text-sm opacity-90">
                  Configure part details and questions
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPartModal(false);
                  setEditingPartIndex(null);
                }}
                className="text-white hover:bg-white/20 rounded-lg p-2"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Reuse same modal content from Add page */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Part Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Part 1: Questions 1-10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    value={currentPart.title}
                    onChange={(e) =>
                      setCurrentPart({ ...currentPart, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Instruction *
                  </label>
                  <textarea
                    placeholder="e.g., Complete the notes below..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[80px]"
                    value={currentPart.instruction}
                    onChange={(e) =>
                      setCurrentPart({
                        ...currentPart,
                        instruction: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Context Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    article
                  </span>
                  Context (Optional)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Context Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Accommodation Booking Form"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      value={currentPart.context?.title || ""}
                      onChange={(e) =>
                        setCurrentPart({
                          ...currentPart,
                          context: {
                            ...currentPart.context,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Pre-filled Fields
                      </label>
                      <button
                        onClick={addPrefilledField}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        + Add Field
                      </button>
                    </div>
                    {currentPart.context?.prefilledData &&
                      Object.keys(currentPart.context.prefilledData).length >
                        0 && (
                        <div className="space-y-2">
                          {Object.entries(
                            currentPart.context.prefilledData,
                          ).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center gap-2 p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <span className="text-sm font-medium">
                                  {key}:
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                  {value}
                                </span>
                              </div>
                              <button
                                onClick={() => removePrefilledField(key)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  close
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      quiz
                    </span>
                    Questions ({currentPart.questions?.length || 0})
                  </h3>
                  <button
                    onClick={addQuestionToCurrentPart}
                    className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {currentPart.questions?.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-primary">
                          Question {qIndex + 1}
                        </span>
                        <button
                          onClick={() => removeQuestionFromCurrentPart(qIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">
                            Question Type
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            value={q.type}
                            onChange={(e) =>
                              updateQuestionInCurrentPart(
                                qIndex,
                                "type",
                                e.target.value as ListeningQuestionType,
                              )
                            }
                          >
                            <option value="fill-in-blank">Fill in Blank</option>
                            <option value="multiple-choice">
                              Multiple Choice
                            </option>
                            <option value="matching">Matching</option>
                          </select>
                        </div>

                        {q.type === "fill-in-blank" ? (
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                              Label (e.g., "Arrival Date:")
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              value={q.label || ""}
                              onChange={(e) =>
                                updateQuestionInCurrentPart(
                                  qIndex,
                                  "label",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                              Question Text
                            </label>
                            <textarea
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              value={q.text || ""}
                              onChange={(e) =>
                                updateQuestionInCurrentPart(
                                  qIndex,
                                  "text",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        )}

                        {q.type === "multiple-choice" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-xs font-bold text-gray-600">
                                Options
                              </label>
                              <button
                                onClick={() => addOptionToQuestion(qIndex)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {q.options?.map((opt, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <span className="text-sm font-medium text-gray-500 mt-2">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                    value={opt}
                                    onChange={(e) =>
                                      updateQuestionOption(
                                        qIndex,
                                        optIndex,
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <button
                                    onClick={() =>
                                      removeQuestionOption(qIndex, optIndex)
                                    }
                                    className="text-red-500"
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      close
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-green-700 mb-1">
                            Correct Answer *
                          </label>
                          {q.type === "multiple-choice" &&
                          q.options &&
                          q.options.length > 0 ? (
                            <select
                              className="w-full border border-green-300 rounded px-3 py-2 text-sm bg-green-50"
                              value={q.correctAnswer}
                              onChange={(e) =>
                                updateQuestionInCurrentPart(
                                  qIndex,
                                  "correctAnswer",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Select correct answer...</option>
                              {q.options.map((opt, idx) => (
                                <option
                                  key={idx}
                                  value={String.fromCharCode(65 + idx)}
                                >
                                  {String.fromCharCode(65 + idx)} - {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter correct answer"
                              className="w-full border border-green-300 rounded px-3 py-2 text-sm bg-green-50"
                              value={q.correctAnswer}
                              onChange={(e) =>
                                updateQuestionInCurrentPart(
                                  qIndex,
                                  "correctAnswer",
                                  e.target.value,
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!currentPart.questions ||
                    currentPart.questions.length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No questions yet</p>
                      <p className="text-sm">Click "Add Question" to start</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPartModal(false);
                  setEditingPartIndex(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPart}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700"
              >
                {editingPartIndex !== null ? "Update Part" : "Add Part"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
