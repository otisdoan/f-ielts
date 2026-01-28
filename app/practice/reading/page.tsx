"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

export default function ReadingPracticePage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/reading-tests?published=true");
      const { data } = await response.json();
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Reading Practice
          </h1>
          <p className="text-slate-500 text-lg">
            Choose a reading test to practice your comprehension skills
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              description
            </span>
            <p className="text-gray-500 text-lg">
              No reading tests available yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new practice tests!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/practice/reading/${test.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      book
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 bg-red-50 text-primary rounded-full font-bold">
                    Band {test.target_band}+
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {test.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    <span>{test.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      quiz
                    </span>
                    <span>{test.questions?.length || 0} questions</span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    play_arrow
                  </span>
                  Start Test
                </button>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
