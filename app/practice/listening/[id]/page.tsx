"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ListeningService, ListeningTest } from "@/services/listening.service";

export default function ListeningTestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const isPreview = searchParams.get("preview") === "1";

  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="bg-background-light min-h-screen">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto py-12 px-4 text-center">
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="bg-background-light min-h-screen">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto py-12 px-4 text-center">
          <p className="text-red-600 mb-4">{error ?? "Test not found."}</p>
          <Link href="/practice/listening" className="text-primary font-medium hover:underline">
            Back to Listening Practice
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/practice/listening" className="text-[#896161] hover:text-primary">
            Listening
          </Link>
          <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
          <span className="text-[#181111] font-medium">{test.title}</span>
          {isPreview && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
              Preview
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#181111] mb-6">{test.title}</h1>

        {test.audio_url && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-[#e6dbdb]">
            <p className="text-sm font-medium text-[#896161] mb-2">Audio</p>
            <audio controls src={test.audio_url} className="w-full max-w-2xl" />
          </div>
        )}

        {test.transcript && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-[#e6dbdb]">
            <p className="text-sm font-medium text-[#896161] mb-2">Transcript</p>
            <div className="text-[#181111] whitespace-pre-wrap text-sm">{test.transcript}</div>
          </div>
        )}

        <div className="space-y-8">
          {(test.question_groups || []).map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-xl border border-[#e6dbdb] p-6">
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
              <div className="space-y-4">
                {(group.questions || []).map((q, qIdx) => (
                  <div key={qIdx} className="border-l-2 border-gray-200 pl-4">
                    <p className="text-xs text-gray-500 mb-1">Question {q.question_number}</p>
                    {q.question_text && (
                      <p className="text-[#181111] mb-2">{q.question_text}</p>
                    )}
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    {isPreview && q.explanation && (
                      <p className="text-sm text-gray-500 mt-2 italic">Explanation: {q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(!test.question_groups || test.question_groups.length === 0) && (
          <p className="text-gray-500 text-center py-8">No questions in this test yet.</p>
        )}
      </main>
    </div>
  );
}
