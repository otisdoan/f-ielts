"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ListeningTest,
  ListeningStudentAnswer,
} from "@/lib/types/listening-test";

export default function ListeningTestPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchTest();
  }, [params.id]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/listening-tests/${params.id}`);
      const { data } = await response.json();
      setTest(data);
      setTimeRemaining(data.duration * 60);
    } catch (error) {
      console.error("Error fetching test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current && test) {
      if (!test.canReplay && audioPlayed) {
        alert("Audio can only be played once!");
        return;
      }
      audioRef.current.play();
      setAudioPlaying(true);
      setAudioPlayed(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && test) {
      const progress =
        (audioRef.current.currentTime / test.audioDuration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !confirm(
        "Are you sure you want to submit? You cannot change your answers after submission.",
      )
    ) {
      return;
    }

    // Process and submit answers
    console.log("Submitting answers:", answers);
    // TODO: Implement submission logic
    router.push("/practice/listening");
  };

  const toggleFlag = (questionNumber: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionNumber)) {
        newSet.delete(questionNumber);
      } else {
        newSet.add(questionNumber);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getAllQuestions = () => {
    if (!test) return [];
    return test.parts.flatMap((part) => part.questions);
  };

  const getTotalQuestions = () => {
    return getAllQuestions().length;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Test not found</p>
      </div>
    );
  }

  const allQuestions = getAllQuestions();

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-background-dark font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white dark:bg-background-dark/90 backdrop-blur px-6 py-3">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-8">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                  fill="currentColor"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h1 className="text-[#181111] dark:text-white text-xl font-black leading-tight tracking-tight">
              F-IELTS Listening
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-[#896161] dark:text-white/60 uppercase tracking-widest">
                Time Remaining
              </span>
              <span className="text-2xl font-mono font-bold text-primary tracking-tighter">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              Submit Test
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* Audio Player */}
          <div className="bg-white dark:bg-[#2d1a1a] rounded-xl border border-[#e6dbdb] dark:border-white/10 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <button
                  onClick={audioPlaying ? handlePauseAudio : handlePlayAudio}
                  disabled={!test.canReplay && audioPlayed && !audioPlaying}
                  className="size-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-4xl ml-1">
                    {audioPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[#181111] dark:text-white font-bold text-lg">
                    {test.title}
                  </h3>
                  {!test.canReplay && (
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        info
                      </span>
                      AUDIO CAN ONLY BE PLAYED ONCE
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(
                      Math.floor((audioProgress / 100) * test.audioDuration),
                    )}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(test.audioDuration)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center border-l border-gray-100 pl-6 hidden md:flex">
                <span className="text-xs text-gray-400 font-bold uppercase">
                  Volume
                </span>
                <span className="material-symbols-outlined text-gray-400">
                  volume_up
                </span>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={test.audioUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={handleAudioEnded}
            />
          </div>

          {/* Questions */}
          <div className="flex-1 bg-white dark:bg-[#2d1a1a] rounded-xl border border-[#e6dbdb] dark:border-white/10 p-8 shadow-sm overflow-y-auto">
            {test.parts.map((part, partIndex) => (
              <div key={partIndex} className="mb-10">
                <div className="mb-8 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-black text-[#181111] dark:text-white mb-2">
                    {part.title}
                  </h2>
                  <p className="text-gray-600 dark:text-white/60 italic">
                    {part.instruction}
                  </p>
                </div>

                {/* Context Section */}
                {part.context && (
                  <div className="bg-[#f9fafb] dark:bg-white/5 p-8 rounded-xl border border-gray-100 mb-10">
                    {part.context.title && (
                      <h3 className="text-xl font-bold text-center mb-6 uppercase tracking-wider text-gray-700 dark:text-white/80">
                        {part.context.title}
                      </h3>
                    )}
                    {part.context.prefilledData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {Object.entries(part.context.prefilledData).map(
                          ([key, value]) => (
                            <div key={key} className="flex flex-col gap-2">
                              <label className="text-sm font-bold text-gray-500 uppercase">
                                {key}:
                              </label>
                              <p className="text-lg font-medium border-b border-gray-300 pb-1">
                                {value}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-8">
                  {part.questions.map((question) => (
                    <div key={question.id} className="flex flex-col gap-4">
                      {question.type === "fill-in-blank" ? (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-gray-500 uppercase">
                            {question.questionNumber}. {question.label}
                          </label>
                          <input
                            className="bg-white border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all"
                            placeholder="Your answer"
                            type="text"
                            value={answers[question.id] || ""}
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
                          />
                        </div>
                      ) : question.type === "multiple-choice" ? (
                        <>
                          <p className="font-bold text-lg text-[#181111] dark:text-white">
                            {question.questionNumber}. {question.text}
                          </p>
                          <div className="grid gap-3 max-w-2xl">
                            {question.options?.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary/50 cursor-pointer bg-white transition-all group"
                              >
                                <input
                                  className="size-5 text-primary focus:ring-primary border-gray-300"
                                  type="radio"
                                  name={question.id}
                                  value={String.fromCharCode(65 + index)}
                                  checked={
                                    answers[question.id] ===
                                    String.fromCharCode(65 + index)
                                  }
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      question.id,
                                      e.target.value,
                                    )
                                  }
                                />
                                <span className="ml-4 font-medium text-gray-700">
                                  {String.fromCharCode(65 + index)}. {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-6">
          <div className="bg-white dark:bg-[#2d1a1a] rounded-xl border border-[#e6dbdb] dark:border-white/10 p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-[#181111] dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                grid_view
              </span>
              Question Navigation
            </h3>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-5 gap-2">
                {allQuestions.map((question) => {
                  const isAnswered = answers[question.id];
                  const isFlagged = flaggedQuestions.has(
                    question.questionNumber,
                  );
                  return (
                    <button
                      key={question.id}
                      onClick={() =>
                        setCurrentQuestion(question.questionNumber)
                      }
                      className={`aspect-square flex items-center justify-center rounded-lg font-bold text-sm ${
                        isAnswered
                          ? "border-2 border-primary bg-primary text-white"
                          : isFlagged
                            ? "border border-yellow-400 bg-yellow-400 text-white"
                            : "border border-gray-200 text-gray-400"
                      }`}
                    >
                      {question.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="size-3 rounded-sm bg-primary"></div>
                  <span>Answered</span>
                </div>
                <span className="font-bold">
                  {getAnsweredCount()}/{getTotalQuestions()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="size-3 rounded-sm border border-gray-300"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="size-3 rounded-sm bg-yellow-400"></div>
                <span>Flagged for Review</span>
              </div>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">
                tips_and_updates
              </span>
              Exam Tip
            </h4>
            <p className="text-xs leading-relaxed text-[#896161]">
              Read ahead! Use the silence before the audio begins to highlight
              keywords in the questions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e7eb] px-6 py-4 mt-auto">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => {
                const prevQuestion = Math.max(1, currentQuestion - 1);
                setCurrentQuestion(prevQuestion);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </button>
            <button
              onClick={() => {
                const nextQuestion = Math.min(
                  getTotalQuestions(),
                  currentQuestion + 1,
                );
                setCurrentQuestion(nextQuestion);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-800 text-white font-bold hover:bg-black transition-colors"
            >
              Next
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => toggleFlag(currentQuestion)}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
            >
              <span className="material-symbols-outlined">flag</span>
              Flag Question
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
