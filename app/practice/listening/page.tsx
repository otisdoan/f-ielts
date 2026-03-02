"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { ListeningTest } from "@/lib/types/listening-test";

export default function ListeningPracticePage() {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/listening-tests?published=true");
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
            Listening Practice
          </h1>
          <p className="text-slate-500 text-lg">
            Choose a listening test to practice your comprehension skills
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
              headphones
            </span>
            <p className="text-gray-600 text-lg font-medium">
              No listening tests available yet
            </p>
          </div>
        ) : (
          /* Test Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/practice/listening/${test.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-primary hover:shadow-lg transition-all duration-200">
                  {/* Test Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        headphones
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Band {test.targetBand}
                    </span>
                  </div>

                  {/* Test Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {test.title}
                  </h3>

                  {/* Test Details */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        timer
                      </span>
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        music_note
                      </span>
                      <span>
                        {Math.floor(test.audioDuration / 60)}:
                        {String(test.audioDuration % 60).padStart(2, "0")} audio
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        quiz
                      </span>
                      <span>
                        {test.parts.reduce(
                          (sum, part) => sum + part.questions.length,
                          0
                        )}{" "}
                        questions
                      </span>
                    </div>
                    {!test.canReplay && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <span className="material-symbols-outlined text-base">
                          warning
                        </span>
                        <span className="font-medium">
                          Audio plays once only
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Start Button */}
                  <button className="mt-6 w-full bg-slate-900 text-white font-bold py-3 rounded-lg group-hover:bg-primary transition-colors">
                    Start Test
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
