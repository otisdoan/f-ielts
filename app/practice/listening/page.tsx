"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { ListeningService, ListeningTest } from "@/services/listening.service";

export default function ListeningPracticePage() {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await ListeningService.getTests();
      setTests(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const published = tests.filter((t) => t.status === "published");

  return (
    <div className="bg-background-light min-h-screen">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Listening Practice
          </h1>
          <p className="text-slate-500 text-lg">
            Choose a listening test to practice. Play the audio and answer the questions.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading tests...</p>
          </div>
        ) : published.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">
              headphones
            </span>
            <p className="text-gray-500 text-lg">No listening tests available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new practice tests!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {published.map((t) => (
              <Link
                key={t.id}
                href={`/practice/listening/${t.id}`}
                className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-1">{t.title}</h3>
                <p className="text-sm text-slate-500">
                  {t.source || "—"} · {t.question_count ?? 0} questions
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
