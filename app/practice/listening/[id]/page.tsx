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
            <span className="material-symbols-outlined text-5xl text-primary/50 animate-spin mb-4 block">
              progress_activity
            </span>
            <p className="text-[#896161] font-medium">Loading test...</p>
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

      {/* Sticky top bar: back + breadcrumb + title */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#e6dbdb] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/practice/listening"
              className="flex items-center gap-1.5 text-[#896161] hover:text-primary transition-colors font-medium text-sm"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              <span>Listening</span>
            </Link>
            <span className="material-symbols-outlined text-[#896161] text-sm">chevron_right</span>
            <span
              className="text-[#181111] font-bold truncate max-w-[180px] sm:max-w-md"
              title={test.title}
            >
              {test.title}
            </span>
            {isPreview && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md uppercase tracking-wider">
                Preview
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 pb-28">
        <h1 className="text-2xl sm:text-3xl font-black text-[#181111] mb-2">{test.title}</h1>
        {test.source && (
          <p className="text-sm text-[#896161] font-medium mb-8">{test.source}</p>
        )}

        {/* Audio card */}
        {test.audio_url && (
          <div className="mb-8 p-6 bg-white rounded-xl border border-[#e6dbdb] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">graphic_eq</span>
              <p className="text-sm font-bold text-[#896161] uppercase tracking-wider">Audio</p>
            </div>
            <audio controls src={test.audio_url} className="w-full max-w-2xl h-10" />
            <p className="text-xs text-gray-500 mt-3">
              Use the player at the bottom of the page while you scroll through questions.
            </p>
          </div>
        )}

        {/* Transcript (collapsible) */}
        {test.transcript && (
          <div className="mb-8 bg-white rounded-xl border border-[#e6dbdb] shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setTranscriptOpen((o) => !o)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#896161] text-xl">menu_book</span>
                <p className="text-sm font-bold text-[#896161] uppercase tracking-wider">
                  Transcript
                </p>
              </div>
              <span className="material-symbols-outlined text-[#896161] text-xl">
                {transcriptOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {transcriptOpen && (
              <div className="px-6 pb-6 pt-0 border-t border-[#e6dbdb]">
                <div className="text-[#181111] whitespace-pre-wrap text-sm leading-relaxed pt-4">
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
              className="bg-white rounded-xl border border-[#e6dbdb] p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-black">
                  {gIdx + 1}
                </span>
                <p className="text-sm font-bold text-[#896161] uppercase tracking-wider">
                  Section {gIdx + 1}
                </p>
              </div>
              {group.instruction && (
                <p className="text-sm font-medium text-[#896161] mb-5 leading-relaxed border-l-2 border-primary/30 pl-4">
                  {group.instruction}
                </p>
              )}
              {group.image_url && (
                <img
                  src={group.image_url}
                  alt=""
                  className="max-w-full h-auto rounded-lg mb-6 border border-[#e6dbdb] shadow-sm"
                />
              )}
              <div className="space-y-6">
                {(group.questions || []).map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="pl-4 border-l-2 border-[#e6dbdb] hover:border-primary/30 transition-colors"
                  >
                    <p className="text-xs font-bold text-[#896161] uppercase tracking-wider mb-2">
                      Question {q.question_number}
                    </p>
                    {q.question_text && (
                      <p className="text-[#181111] mb-3 font-medium leading-relaxed">
                        {q.question_text}
                      </p>
                    )}
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <ul className="space-y-2 mb-3">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className="text-sm text-[#181111] flex gap-2 items-start"
                          >
                            <span className="font-bold text-[#896161] shrink-0 mt-0.5">
                              {OPTION_LETTERS[i] ?? i + 1}.
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isPreview && q.explanation && (
                      <div className="bg-gray-50 rounded-lg p-4 border-l-2 border-primary/40 mt-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Explanation
                        </p>
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(!test.question_groups || test.question_groups.length === 0) && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#e6dbdb] shadow-sm">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">
              quiz
            </span>
            <p className="text-gray-500 font-medium mb-1">No questions in this test yet.</p>
            <p className="text-sm text-gray-400 mb-6">Check back later or try another test.</p>
            <Link
              href="/practice/listening"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Listening Practice
            </Link>
          </div>
        )}
      </main>

      {/* Sticky Audio Player at bottom */}
      {test.audio_url && (
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-[#e6dbdb] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl shrink-0">
              graphic_eq
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#896161] uppercase tracking-wider mb-1.5">
                Listen
              </p>
              <audio controls src={test.audio_url} className="w-full h-10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
