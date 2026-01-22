"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QuestionType =
  | "summary-completion"
  | "true-false-not-given"
  | "multiple-choice"
  | "matching-headings";

interface QuestionPart {
  id: string;
  type: QuestionType;
  instruction: string; // e.g. "Complete the notes below. Choose ONE WORD ONLY..."
  content?: string; // The summary text with [numbers] or headings
  questions: Question[];
}

interface Question {
  id: string;
  questionNumber: number;
  text?: string; // Statement for T/F or Context for Summary
  options?: string[];
  correctAnswer: string;
}

export default function AddReadingTestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "questions">(
    "content",
  );

  const [formData, setFormData] = useState({
    title: "",
    targetBand: 7.0,
    duration: 60,
    passageContent: "",
    parts: [] as QuestionPart[],
  });

  const [currentPart, setCurrentPart] = useState<Partial<QuestionPart>>({
    type: "summary-completion",
    instruction: "",
    content: "",
    questions: [],
  });

  const [isEditingPart, setIsEditingPart] = useState(false);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);

  // Helper to count total questions so far
  const getTotalQuestions = () => {
    return formData.parts.reduce((acc, part) => acc + part.questions.length, 0);
  };

  const handleAddPart = () => {
    const startNum = getTotalQuestions() + 1;

    // Auto-generate some default instructions
    let defaultInstruction = "";
    if (currentPart.type === "summary-completion")
      defaultInstruction =
        "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.";
    else if (currentPart.type === "true-false-not-given")
      defaultInstruction =
        "Do the following statements agree with the information given in Reading Passage 1?";

    const newPart: QuestionPart = {
      id: `part-${Date.now()}`,
      type: currentPart.type as QuestionType,
      instruction: currentPart.instruction || defaultInstruction,
      content: currentPart.content || "",
      questions: currentPart.questions || [],
    };

    setFormData({
      ...formData,
      parts: [...formData.parts, newPart],
    });

    // Reset
    setCurrentPart({
      type: "summary-completion",
      instruction: "",
      content: "",
      questions: [],
    });
  };

  const handleDeletePart = (id: string) => {
    setFormData({
      ...formData,
      parts: formData.parts.filter((p) => p.id !== id),
    });
  };

  const updateQuestionInPart = (partIndex: number, questions: Question[]) => {
    const newParts = [...formData.parts];
    newParts[partIndex].questions = questions;
    setFormData({ ...formData, parts: newParts });
  };

  const addQuestionToPart = (partIndex: number) => {
    const parts = [...formData.parts];
    const part = parts[partIndex];

    // Calculate global question number
    // We need to support re-numbering if we insert/delete.
    // For now, let's just calc based on current position, but assumes strict order.
    // Simplification: Recalculate ALL numbers on render/save.

    const newQ: Question = {
      id: `q-${Date.now()}`,
      questionNumber: 0, // Will act as placeholder, re-calc later
      text: "",
      correctAnswer: "",
    };

    part.questions.push(newQ);
    setFormData({ ...formData, parts });
  };

  const removeQuestionFromPart = (partIndex: number, qIndex: number) => {
    const parts = [...formData.parts];
    parts[partIndex].questions.splice(qIndex, 1);
    setFormData({ ...formData, parts });
  };

  const updateQuestionField = (
    partIndex: number,
    qIndex: number,
    field: keyof Question,
    value: any,
  ) => {
    const parts = [...formData.parts];
    parts[partIndex].questions[qIndex] = {
      ...parts[partIndex].questions[qIndex],
      [field]: value,
    };
    setFormData({ ...formData, parts });
  };

  const updatePartField = (
    partIndex: number,
    field: keyof QuestionPart,
    value: any,
  ) => {
    const parts = [...formData.parts];
    parts[partIndex] = { ...parts[partIndex], [field]: value };
    setFormData({ ...formData, parts });
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (
      !formData.title ||
      !formData.passageContent ||
      formData.parts.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Assign Question Numbers sequentially across all parts
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
      const response = await fetch("/api/reading-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          targetBand: formData.targetBand,
          duration: formData.duration,
          passageContent: formData.passageContent,
          questions: numberedParts, // We send parts as "questions" property?
          // Wait, if the DB/API expects "questions" to be the array, we can send parts if we assume frontend handles it.
          // Or we wrap it? Let's check api.
          // API: questions: body.questions
          // So it saves whatever we send. GOOD.
          isPublished: publish,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      alert("Test saved successfully!");
      router.push("/admin/reading-tests");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[#e6dbdb] flex-none z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/reading-tests"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#181111]">
                Create Reading Test
              </h1>
              <p className="text-sm text-[#896161]">
                Design your test structure
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
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Passage Editor */}
        <div className="w-1/2 flex flex-col border-r border-[#e6dbdb] bg-white">
          <div className="p-4 border-b border-[#e6dbdb] bg-gray-50">
            <h2 className="font-bold text-gray-700">Reading Passage</h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <input
              type="text"
              placeholder="Test Title (e.g. Find your way out...)"
              className="w-full text-xl font-bold border-none focus:ring-0 placeholder-gray-300 px-0"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Target Band
                </label>
                <select
                  className="w-full mt-1 p-2 border rounded"
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
              <div className="flex-1">
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Duration (Min)
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
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
            <textarea
              className="w-full h-full min-h-[500px] resize-none border-none focus:ring-0 text-gray-700 leading-relaxed font-serif"
              placeholder="Paste the reading passage here..."
              value={formData.passageContent}
              onChange={(e) =>
                setFormData({ ...formData, passageContent: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        {/* Right Panel: Questions Builder */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-[#e6dbdb] bg-white flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Questions Builder</h2>
            <button
              onClick={() => handleAddPart()}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span> New
              Group
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {formData.parts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No questions yet.</p>
                <p className="text-sm">
                  Click "New Group" to start adding questions.
                </p>
              </div>
            )}

            {formData.parts.map((part, pIndex) => (
              <div
                key={part.id}
                className="bg-white rounded-xl shadow-sm border border-[#e6dbdb] overflow-hidden"
              >
                {/* Part Header */}
                <div className="bg-gray-100 p-4 border-b border-[#e6dbdb] flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded font-bold">
                        {/* Number range calc is complex here, simplified for now */}
                        Group {pIndex + 1}
                      </span>
                      <select
                        className="text-sm border-gray-300 rounded focus:ring-primary focus:border-primary"
                        value={part.type}
                        onChange={(e) =>
                          updatePartField(pIndex, "type", e.target.value)
                        }
                      >
                        <option value="summary-completion">
                          Summary Completion
                        </option>
                        <option value="true-false-not-given">
                          True / False / Not Given
                        </option>
                        <option value="multiple-choice">Multiple Choice</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      placeholder="Instruction (e.g. Complete the notes below...)"
                      value={part.instruction}
                      onChange={(e) =>
                        updatePartField(pIndex, "instruction", e.target.value)
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleDeletePart(part.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                {/* Part Content (Summary Text) */}
                {part.type === "summary-completion" && (
                  <div className="p-4 border-b border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      SUMMARY CONTENT
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      Use [1], [2] etc. to indicate where blanks should be.
                    </p>
                    <textarea
                      className="w-full border rounded p-2 text-sm font-mono min-h-[100px]"
                      value={part.content}
                      onChange={(e) =>
                        updatePartField(pIndex, "content", e.target.value)
                      }
                      placeholder="The Brooklyn Food Association enters data on [1]..."
                    />
                  </div>
                )}

                {/* Questions List */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-gray-700">
                      Questions ({part.questions.length})
                    </h4>
                    <button
                      onClick={() => addQuestionToPart(pIndex)}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-3">
                    {part.questions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="flex gap-3 items-start p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="mt-2 text-xs font-bold text-gray-500">
                          #{qIndex + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          {part.type === "true-false-not-given" && (
                            <input
                              type="text"
                              className="w-full text-sm p-1.5 border rounded"
                              placeholder="Statement..."
                              value={q.text}
                              onChange={(e) =>
                                updateQuestionField(
                                  pIndex,
                                  qIndex,
                                  "text",
                                  e.target.value,
                                )
                              }
                            />
                          )}
                          {part.type === "multiple-choice" && (
                            <input
                              type="text"
                              className="w-full text-sm p-1.5 border rounded"
                              placeholder="Question Text..."
                              value={q.text}
                              onChange={(e) =>
                                updateQuestionField(
                                  pIndex,
                                  qIndex,
                                  "text",
                                  e.target.value,
                                )
                              }
                            />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-700 whitespace-nowrap">
                              Correct Answer:
                            </span>
                            {part.type === "true-false-not-given" ? (
                              <select
                                className="text-sm border rounded p-1"
                                value={q.correctAnswer}
                                onChange={(e) =>
                                  updateQuestionField(
                                    pIndex,
                                    qIndex,
                                    "correctAnswer",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Select...</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                                <option value="Not Given">Not Given</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                className="flex-1 text-sm p-1 border rounded"
                                placeholder="Answer"
                                value={q.correctAnswer}
                                onChange={(e) =>
                                  updateQuestionField(
                                    pIndex,
                                    qIndex,
                                    "correctAnswer",
                                    e.target.value,
                                  )
                                }
                              />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeQuestionFromPart(pIndex, qIndex)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
