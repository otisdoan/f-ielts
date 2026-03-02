"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { SpeakingPart } from "@/lib/types/speaking-prompt";

export default function EditSpeakingPromptPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    part: 2 as SpeakingPart,
    topic: "",
    promptText: "",
    bulletPoints: [] as string[],
    followUpQuestions: [] as string[],
    preparationTime: 60,
    speakingTime: 120,
    tips: [] as string[],
    targetBand: 7.0,
    isPublished: false,
  });

  const [bulletInput, setBulletInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [tipInput, setTipInput] = useState("");

  useEffect(() => {
    fetchPrompt();
  }, [params.id]);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/speaking-prompts/${params.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch prompt: ${response.status}`);
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Prompt not found");
      }

      setFormData({
        title: data.title,
        part: data.part,
        topic: data.topic,
        promptText: data.promptText,
        bulletPoints: data.bulletPoints || [],
        followUpQuestions: data.followUpQuestions || [],
        preparationTime: data.preparationTime,
        speakingTime: data.speakingTime,
        tips: data.tips || [],
        targetBand: data.targetBand,
        isPublished: data.isPublished,
      });
    } catch (error) {
      console.error("Error fetching prompt:", error);
      alert("Failed to load prompt");
      router.push("/admin/speaking-prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!formData.title || !formData.topic || !formData.promptText) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/speaking-prompts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublished: publish,
        }),
      });

      if (response.ok) {
        router.push("/admin/speaking-prompts");
      } else {
        const error = await response.json();
        alert(`Failed to update prompt: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      alert("Failed to update prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const addBulletPoint = () => {
    if (bulletInput.trim()) {
      setFormData({
        ...formData,
        bulletPoints: [...formData.bulletPoints, bulletInput.trim()],
      });
      setBulletInput("");
    }
  };

  const removeBulletPoint = (index: number) => {
    setFormData({
      ...formData,
      bulletPoints: formData.bulletPoints.filter((_, i) => i !== index),
    });
  };

  const addQuestion = () => {
    if (questionInput.trim()) {
      setFormData({
        ...formData,
        followUpQuestions: [...formData.followUpQuestions, questionInput.trim()],
      });
      setQuestionInput("");
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      followUpQuestions: formData.followUpQuestions.filter((_, i) => i !== index),
    });
  };

  const addTip = () => {
    if (tipInput.trim()) {
      setFormData({
        ...formData,
        tips: [...formData.tips, tipInput.trim()],
      });
      setTipInput("");
    }
  };

  const removeTip = (index: number) => {
    setFormData({
      ...formData,
      tips: formData.tips.filter((_, i) => i !== index),
    });
  };

  const handlePartChange = (part: SpeakingPart) => {
    setFormData({
      ...formData,
      part,
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/speaking-prompts"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Speaking Prompts
        </Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Edit Speaking Prompt
        </h1>
        <p className="text-slate-600">Modify the IELTS speaking practice prompt</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Basic Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Part 2: Describe a Book You Recently Read"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Part *
                </label>
                <select
                  value={formData.part}
                  onChange={(e) =>
                    handlePartChange(parseInt(e.target.value) as SpeakingPart)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>Part 1</option>
                  <option value={2}>Part 2</option>
                  <option value={3}>Part 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  placeholder="e.g., Books & Reading"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Band
                </label>
                <select
                  value={formData.targetBand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetBand: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((band) => (
                    <option key={band} value={band}>
                      {band}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Prompt Text *
              </label>
              <textarea
                value={formData.promptText}
                onChange={(e) =>
                  setFormData({ ...formData, promptText: e.target.value })
                }
                placeholder="Main question or topic description"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Preparation Time (seconds)
                </label>
                <input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preparationTime: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Speaking Time (seconds)
                </label>
                <input
                  type="number"
                  value={formData.speakingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speakingTime: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bullet Points (Part 2) */}
        {formData.part === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Bullet Points
              <span className="text-sm font-normal text-slate-500 ml-2">
                (You should say...)
              </span>
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addBulletPoint()}
                  placeholder="e.g., what the book is"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={addBulletPoint}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Add
                </button>
              </div>

              {formData.bulletPoints.length > 0 && (
                <ul className="space-y-2">
                  {formData.bulletPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg"
                    >
                      <span className="text-slate-700">• {point}</span>
                      <button
                        onClick={() => removeBulletPoint(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Questions (Part 1 & 3) */}
        {(formData.part === 1 || formData.part === 3) && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {formData.part === 1 ? "Interview Questions" : "Discussion Questions"}
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addQuestion()}
                  placeholder="Enter a question"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={addQuestion}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Add
                </button>
              </div>

              {formData.followUpQuestions.length > 0 && (
                <ul className="space-y-2">
                  {formData.followUpQuestions.map((question, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg"
                    >
                      <span className="text-slate-700">
                        {index + 1}. {question}
                      </span>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Speaking Tips */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Speaking Tips
          </h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tipInput}
                onChange={(e) => setTipInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTip()}
                placeholder="Enter a helpful tip"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={addTip}
                className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-700"
              >
                Add
              </button>
            </div>

            {formData.tips.length > 0 && (
              <ul className="space-y-2">
                {formData.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg"
                  >
                    <span className="text-slate-700">{tip}</span>
                    <button
                      onClick={() => removeTip(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
