"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SpeakingPrompt } from "@/lib/types/speaking-prompt";

export default function SpeakingPracticePage() {
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, [selectedPart]);

  const fetchPrompts = async () => {
    try {
      const url = selectedPart
        ? `/api/speaking-prompts?published=true&part=${selectedPart}`
        : "/api/speaking-prompts?published=true";

      const response = await fetch(url);
      const { data } = await response.json();
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPartIcon = (part: number) => {
    switch (part) {
      case 1:
        return "chat";
      case 2:
        return "description";
      case 3:
        return "forum";
      default:
        return "mic";
    }
  };

  const getPartLabel = (part: number) => {
    switch (part) {
      case 1:
        return "Introduction & Interview";
      case 2:
        return "Individual Long Turn";
      case 3:
        return "Two-way Discussion";
      default:
        return "Speaking";
    }
  };

  const getPartColor = (part: number) => {
    switch (part) {
      case 1:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 2:
        return "bg-primary/10 text-primary border-primary/20";
      case 3:
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-background-light min-h-screen">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Speaking Practice
          </h1>
          <p className="text-slate-500 text-lg">
            Practice your speaking skills with authentic IELTS topics and get
            AI-powered feedback
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setSelectedPart(null)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedPart === null
                ? "bg-primary text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Parts
          </button>
          <button
            onClick={() => setSelectedPart(1)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedPart === 1
                ? "bg-primary text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Part 1
          </button>
          <button
            onClick={() => setSelectedPart(2)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedPart === 2
                ? "bg-primary text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Part 2
          </button>
          <button
            onClick={() => setSelectedPart(3)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedPart === 3
                ? "bg-primary text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Part 3
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              mic
            </span>
            <p className="text-gray-600 text-lg font-medium">
              No speaking prompts available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/practice/speaking/${prompt.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-primary hover:shadow-lg transition-all duration-200">
                  {/* Prompt Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        {getPartIcon(prompt.part)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Band {prompt.targetBand}
                    </span>
                  </div>

                  {/* Part Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase ${getPartColor(
                        prompt.part,
                      )}`}
                    >
                      Part {prompt.part}
                    </span>
                  </div>

                  {/* Prompt Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {prompt.topic}
                  </h3>

                  {/* Prompt Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {prompt.promptText}
                  </p>

                  {/* Prompt Details */}
                  <div className="space-y-2 text-sm text-slate-600">
                    {prompt.preparationTime > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          schedule
                        </span>
                        <span>{prompt.preparationTime}s preparation</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        mic
                      </span>
                      <span>
                        {Math.floor(prompt.speakingTime / 60)}:
                        {String(prompt.speakingTime % 60).padStart(2, "0")}{" "}
                        speaking
                      </span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      play_arrow
                    </span>
                    Start Practice
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
