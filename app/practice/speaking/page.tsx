"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { SpeakingService, SpeakingTopic } from "@/services/speaking.service";

export default function SpeakingPracticePage() {
  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPart, setFilterPart] = useState<number | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // Fetch published topics from database
      const data = await SpeakingService.getTopics({ status: "published" });
      setTopics(data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = filterPart 
    ? topics.filter(t => t.part === filterPart) 
    : topics;

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Hard": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
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
            Choose a speaking topic to practice and improve your fluency
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterPart(null)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterPart === null
                ? "bg-primary text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary"
            }`}
          >
            All Parts
          </button>
          <button
            onClick={() => setFilterPart(1)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterPart === 1
                ? "bg-primary text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary"
            }`}
          >
            Part 1
          </button>
          <button
            onClick={() => setFilterPart(2)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterPart === 2
                ? "bg-primary text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary"
            }`}
          >
            Part 2
          </button>
          <button
            onClick={() => setFilterPart(3)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterPart === 3
                ? "bg-primary text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary"
            }`}
          >
            Part 3
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topics...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              mic_off
            </span>
            <p className="text-gray-600 text-lg font-medium">No topics available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    Part {topic.part}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {topic.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    {topic.category}
                  </span>
                  <Link href={`/practice/speaking/${topic.id}`}>
                    <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                      <span className="material-symbols-outlined text-sm">mic</span>
                      Start
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
