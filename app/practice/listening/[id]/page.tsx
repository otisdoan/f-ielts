"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ListeningService, ListeningTest } from "@/services/listening.service";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function ListeningTestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const isPreview = searchParams.get("preview") === "1";

  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ListeningService.getTestById(id);
        if (!data) {
          setError("Test not found.");
          return;
        }
        if (!isPreview && data.status !== "published") {
          setError("This test is not available yet.");
          return;
        }
        setTest(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load test.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isPreview]);

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-gray-400 animate-spin mb-4 block">
              progress_activity
            </span>
            <p className="text-gray-500 font-medium">Loading test...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="bg-background-light min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            </div>
            <p className="text-lg font-bold text-[#181111] mb-2">
              {error === "Test not found."
                ? "Test not found"
                : error === "This test is not available yet."
                  ? "Not available"
                  : "Something went wrong"}
            </p>
            <p className="text-sm text-[#896161] mb-6">
              {error ?? "The test you're looking for doesn't exist or couldn't be loaded."}
            </p>
            <Link href="/practice/listening">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Back to Listening Practice</span>
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 pb-24">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm flex-wrap">
          <Link
            href="/practice/listening"
            className="text-[#896161] hover:text-primary transition-colors font-medium"
          >
            Listening
          </Link>
          <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
          <span className="text-[#181111] font-bold truncate max-w-[200px] sm:max-w-none" title={test.title}>
            {test.title}
          </span>
          {isPreview && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
              Preview
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#181111] mb-6">{test.title}</h1>

        {/* Audio card in main */}
        {test.audio_url && (
          <div className="mb-8 p-6 bg-white rounded-xl border border-[#e6dbdb] shadow-sm">
            <p className="text-sm font-medium text-[#896161] mb-2">Audio</p>
            <audio controls src={test.audio_url} className="w-full max-w-2xl" />
            <p className="text-xs text-gray-500 mt-2">
              You can also use the player at the bottom of the page while scrolling.
            </p>
          </div>
        )}

        {/* Transcript (collapsible) */}
        {test.transcript && (
          <div className="mb-8 bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setTranscriptOpen((o) => !o)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <p className="text-sm font-medium text-[#896161]">Transcript</p>
              <span className="material-symbols-outlined text-[#896161]">
                {transcriptOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {transcriptOpen && (
              <div className="px-6 pb-6 pt-0 border-t border-[#e6dbdb]">
                <div className="text-[#181111] whitespace-pre-wrap text-sm leading-relaxed">
                  {test.transcript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question groups */}
        <div className="space-y-8">
          {(test.question_groups || []).map((group, gIdx) => (
            <div
              key={gIdx}
              className="bg-white rounded-xl border border-[#e6dbdb] p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-[#896161] mb-3">
                Section {gIdx + 1}
              </p>
              {group.instruction && (
                <p className="text-sm font-medium text-[#896161] mb-4">{group.instruction}</p>
              )}
              {group.image_url && (
                <img
                  src={group.image_url}
                  alt=""
                  className="max-w-full h-auto rounded-lg mb-4 border border-[#e6dbdb]"
                />
              )}
              <div className="space-y-6">
                {(group.questions || []).map((q, qIdx) => (
                  <div key={qIdx} className="border-l-2 border-[#e6dbdb] pl-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Question {q.question_number}
                    </p>
                    {q.question_text && (
                      <p className="text-[#181111] mb-3 font-medium">{q.question_text}</p>
                    )}
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <ul className="space-y-1.5 mb-3">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className="text-sm text-[#181111] flex gap-2"
                          >
                            <span className="font-semibold text-[#896161] shrink-0">
                              {OPTION_LETTERS[i] ?? i + 1}.
                            </span>
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isPreview && q.explanation && (
                      <div className="bg-gray-50 rounded-lg p-3 border-l-2 border-primary/30 mt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Explanation
                        </p>
                        <p className="text-sm text-gray-600 italic">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(!test.question_groups || test.question_groups.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e6dbdb]">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">
              quiz
            </span>
            <p className="text-gray-500 font-medium">No questions in this test yet.</p>
            <Link
              href="/practice/listening"
              className="inline-block mt-4 text-primary font-semibold hover:underline"
            >
              Back to Listening Practice
            </Link>
          </div>
        )}
      </main>

      {/* Sticky Audio Player at bottom */}
      {test.audio_url && (
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-[#e6dbdb] p-4 shadow-lg">
          <p className="text-xs font-medium text-[#896161] mb-1">Listen</p>
          <audio controls src={test.audio_url} className="w-full max-w-2xl" />
        </div>
      )}
    </div>
  );
}
