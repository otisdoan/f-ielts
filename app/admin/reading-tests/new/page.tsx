"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import QuestionsBuilder from "@/components/admin/QuestionsBuilder";
import { ReadingTest, Question } from "@/lib/types/reading-test";

export default function AddReadingTestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<ReadingTest>({
    title: "",
    targetBand: 7.0,
    duration: 60,
    passageContent: "",
    questions: [],
    isPublished: false,
  });

  const handleSubmit = async (publish: boolean = false) => {
    if (
      !formData.title ||
      !formData.passageContent ||
      formData.questions.length === 0
    ) {
      alert(
        "Please fill in all required fields and add at least one question.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/reading-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isPublished: publish }),
      });

      if (!response.ok) throw new Error("Failed to create test");

      alert(publish ? "Test published successfully!" : "Test saved as draft!");
      router.push("/admin/courses");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[#e6dbdb] sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#181111]">
                  Add New Reading Test
                </h1>
                <p className="text-sm text-[#896161]">
                  Create a new IELTS reading practice test
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border-2 border-[#e6dbdb] text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPreview ? "edit" : "visibility"}
                </span>
                {showPreview ? "Edit" : "Preview"}
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white font-medium disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  publish
                </span>
                Publish Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {!showPreview ? (
          // Edit Mode
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Test Info & Passage */}
            <div className="space-y-6">
              {/* Test Information Card */}
              <div className="bg-white rounded-xl border border-[#e6dbdb] p-6">
                <h2 className="text-lg font-bold text-[#181111] mb-4">
                  Test Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Academic Reading Masterclass - Test 1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Band Score
                      </label>
                      <select
                        value={formData.targetBand}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetBand: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(
                          (band) => (
                            <option key={band} value={band}>
                              Band {band}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Passage Card */}
              <div className="bg-white rounded-xl border border-[#e6dbdb] p-6">
                <h2 className="text-lg font-bold text-[#181111] mb-4">
                  Reading Passage <span className="text-red-500">*</span>
                </h2>
                <RichTextEditor
                  content={formData.passageContent}
                  onChange={(content) =>
                    setFormData({ ...formData, passageContent: content })
                  }
                  placeholder="Paste or type the reading passage here. You can format text using the toolbar above."
                />
              </div>
            </div>

            {/* Right Column - Questions */}
            <div className="bg-white rounded-xl border border-[#e6dbdb] p-6">
              <h2 className="text-lg font-bold text-[#181111] mb-4">
                Questions <span className="text-red-500">*</span>
              </h2>
              <QuestionsBuilder
                questions={formData.questions}
                onChange={(questions) =>
                  setFormData({ ...formData, questions })
                }
              />
            </div>
          </div>
        ) : (
          // Preview Mode
          <PreviewMode test={formData} />
        )}
      </div>
    </div>
  );
}

// Preview Component (similar to student view)
function PreviewMode({ test }: { test: ReadingTest }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  return (
    <div className="bg-white rounded-xl border border-[#e6dbdb] overflow-hidden">
      <div className="bg-primary text-white px-6 py-4">
        <h2 className="text-xl font-bold">Preview Mode</h2>
        <p className="text-sm opacity-90">
          This is how students will see your test
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 p-6 min-h-[600px]">
        {/* Left: Passage */}
        <div className="border-r border-[#e6dbdb] pr-6 overflow-y-auto max-h-[70vh]">
          <h3 className="text-lg font-bold mb-4">Reading Passage</h3>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                test.passageContent ||
                '<p class="text-gray-400">No passage content yet...</p>',
            }}
          />
        </div>

        {/* Right: Questions */}
        <div className="overflow-y-auto max-h-[70vh]">
          <h3 className="text-lg font-bold mb-4">Questions</h3>
          {test.questions.length === 0 ? (
            <p className="text-gray-400">No questions added yet...</p>
          ) : (
            <div className="space-y-6">
              {test.questions.map((question) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 pb-4"
                >
                  <p className="font-medium text-gray-900 mb-3">
                    Question {question.questionNumber}
                  </p>

                  {question.type === "fill-in-blanks" && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {question.text}
                      </p>
                      {question.blanks?.map((blank) => (
                        <div
                          key={blank.number}
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm font-medium">
                            [{blank.number}]
                          </span>
                          <input
                            type="text"
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                            placeholder="Your answer"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false-not-given" && (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        {question.statement}
                      </p>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                        <option value="">Select answer</option>
                        <option value="True">True</option>
                        <option value="False">False</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>
                  )}

                  {question.type === "multiple-choice" && (
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options?.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-start gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`q-${question.id}`}
                              className="mt-1"
                            />
                            <span className="text-sm">
                              {String.fromCharCode(65 + index)}. {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Question Navigator */}
          {test.questions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Question Navigator</p>
              <div className="flex flex-wrap gap-2">
                {test.questions.map((q) => (
                  <button
                    key={q.id}
                    className="w-10 h-10 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100"
                  >
                    {q.questionNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
