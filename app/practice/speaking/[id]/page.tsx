"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SpeakingPrompt } from "@/lib/types/speaking-prompt";

export default function SpeakingPracticePage() {
  const params = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<SpeakingPrompt | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer states
  const [preparationTime, setPreparationTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [phase, setPhase] = useState<"preparing" | "recording" | "finished">(
    "preparing",
  );

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const preparationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPrompt();
  }, [params.id]);

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      if (preparationTimerRef.current)
        clearInterval(preparationTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      // Stop recording if active
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/speaking-prompts/${params.id}`);
      const { data } = await response.json();

      if (!data) {
        alert("Prompt not found");
        router.push("/practice/speaking");
        return;
      }

      setPrompt(data);
      setPreparationTime(data.preparationTime);

      // Start preparation timer if applicable
      if (data.preparationTime > 0) {
        startPreparationTimer(data.preparationTime);
      } else {
        setPhase("recording");
      }
    } catch (error) {
      console.error("Error fetching prompt:", error);
      alert("Failed to load prompt");
      router.push("/practice/speaking");
    } finally {
      setLoading(false);
    }
  };

  const startPreparationTimer = (duration: number) => {
    let timeLeft = duration;
    setPreparationTime(timeLeft);

    preparationTimerRef.current = setInterval(() => {
      timeLeft--;
      setPreparationTime(timeLeft);

      if (timeLeft <= 0) {
        if (preparationTimerRef.current) {
          clearInterval(preparationTimerRef.current);
        }
        setPhase("recording");
        // Auto-start recording after preparation
        setTimeout(() => startRecording(), 500);
      }
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      let time = 0;
      recordingTimerRef.current = setInterval(() => {
        time++;
        setRecordingTime(time);

        // Optional: Auto-stop after speaking time limit
        if (prompt && time >= prompt.speakingTime) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Failed to access microphone. Please allow microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPhase("finished");

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleRetry = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setPhase("preparing");

    if (prompt && prompt.preparationTime > 0) {
      startPreparationTimer(prompt.preparationTime);
    } else {
      setPhase("recording");
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert("No recording available");
      return;
    }

    // TODO: Upload audio and submit for AI analysis
    alert("Submit for AI feedback feature coming soon!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!prompt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e6dbdb] bg-white dark:bg-background-dark/90 backdrop-blur px-4 md:px-10 lg:px-40 py-3">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
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
            <h2 className="text-[#181111] dark:text-white text-xl font-black leading-tight tracking-[-0.015em]">
              F-IELTS
            </h2>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
            style={{
              backgroundImage:
                'url("https://cdn.usegalileo.ai/sdxl10/3f3e1a8c-6197-4ea8-8533-5c3e23daa3d6.png")',
            }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[#896161] dark:text-white/60">
              <Link className="hover:text-primary" href="/practice">
                Practice
              </Link>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <Link className="hover:text-primary" href="/practice/speaking">
                Speaking
              </Link>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="font-semibold text-[#181111] dark:text-white">
                Part {prompt.part}
              </span>
            </div>

            {/* Topic Card */}
            <div className="bg-white dark:bg-[#2d1a1a] rounded-2xl border border-[#e6dbdb] dark:border-white/10 p-10 text-center shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                Part {prompt.part}: {getPartLabel(prompt.part)}
              </span>
              <h1 className="text-[#181111] dark:text-white text-3xl font-black leading-tight mb-4">
                {prompt.promptText}
              </h1>

              {/* Bullet Points for Part 2 */}
              {prompt.bulletPoints && prompt.bulletPoints.length > 0 && (
                <div className="text-[#896161] dark:text-white/60 text-left max-w-lg mx-auto mt-6">
                  <p className="font-semibold mb-3">You should say:</p>
                  <ul className="space-y-2">
                    {prompt.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions for Part 1 or Part 3 */}
              {prompt.followUpQuestions &&
                prompt.followUpQuestions.length > 0 && (
                  <div className="text-[#896161] dark:text-white/60 text-left max-w-lg mx-auto mt-6">
                    <p className="font-semibold mb-3">Questions:</p>
                    <ul className="space-y-3">
                      {prompt.followUpQuestions.map((question, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary font-bold">
                            {index + 1}.
                          </span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Recording Interface */}
            <div className="flex flex-col items-center gap-8 py-8">
              {/* Timers */}
              <div className="flex gap-12 text-center">
                {prompt.preparationTime > 0 && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          phase === "preparing"
                            ? "text-primary"
                            : "text-[#896161]"
                        }`}
                      >
                        Preparation
                      </span>
                      <span
                        className={`text-3xl font-mono font-bold ${
                          phase === "preparing"
                            ? "text-primary"
                            : "text-[#181111] dark:text-white"
                        }`}
                      >
                        {formatTime(preparationTime)}
                      </span>
                    </div>
                    <div className="w-px bg-[#e6dbdb] dark:bg-white/10"></div>
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      phase === "recording" ? "text-primary" : "text-[#896161]"
                    }`}
                  >
                    {phase === "finished" ? "Recorded" : "Recording"}
                  </span>
                  <span
                    className={`text-3xl font-mono font-bold ${
                      phase === "recording"
                        ? "text-primary"
                        : "text-[#181111] dark:text-white"
                    }`}
                  >
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>

              {/* Waveform Animation */}
              {isRecording && (
                <div className="flex items-center justify-center h-12 gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="waveform-bar"></div>
                  ))}
                </div>
              )}

              {/* Recording Button */}
              <button
                onClick={
                  phase === "recording" || isRecording
                    ? stopRecording
                    : startRecording
                }
                disabled={phase === "preparing"}
                className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all"></div>
                <div className="relative size-24 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 hover:scale-105 transition-transform disabled:hover:scale-100">
                  <span className="material-symbols-outlined text-4xl">
                    {isRecording ? "stop" : "mic"}
                  </span>
                </div>
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-[#181111] dark:text-white whitespace-nowrap">
                  {phase === "preparing"
                    ? "Get Ready..."
                    : isRecording
                      ? "Stop Recording"
                      : "Start Recording"}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* AI Feedback Card */}
            <div className="bg-gradient-to-br from-[#181111] to-[#2d1a1a] text-white p-6 rounded-2xl shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-2">Ready for analysis?</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Our AI will evaluate your fluency, pronunciation, and vocabulary
                range instantly.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!audioBlob}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">
                  psychology
                </span>
                Submit for AI Feedback
              </button>
            </div>

            {/* Speaking Tips */}
            {prompt.tips && prompt.tips.length > 0 && (
              <div className="bg-white dark:bg-[#2d1a1a] border border-[#e6dbdb] dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#181111] dark:text-white font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      lightbulb
                    </span>
                    Speaking Tips
                  </h3>
                </div>
                <ul className="space-y-4">
                  {prompt.tips.map((tip, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="size-5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-xs">
                          check
                        </span>
                      </div>
                      <p className="text-sm text-[#896161] dark:text-white/60">
                        {tip}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-[#e6dbdb] dark:border-white/10 text-[#181111] dark:text-white font-bold py-3 px-4 rounded-xl hover:bg-[#f4f0f0] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  replay
                </span>
                Retry
              </button>
              <Link
                href="/practice/speaking"
                className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-[#e6dbdb] dark:border-white/10 text-[#181111] dark:text-white font-bold py-3 px-4 rounded-xl hover:bg-[#f4f0f0] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  skip_next
                </span>
                Skip
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e6dbdb] dark:border-white/10 py-10 px-4 md:px-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
              </svg>
            </div>
            <span className="text-[#181111] dark:text-white font-black text-sm">
              F-IELTS © 2024
            </span>
          </div>
          <div className="flex gap-8 text-[#896161] dark:text-white/40 text-sm font-medium">
            <a className="hover:text-primary" href="#">
              Help Center
            </a>
            <a className="hover:text-primary" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary" href="#">
              Community
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 32px;
          }
        }
        .waveform-bar {
          width: 3px;
          background-color: #ec1313;
          border-radius: 2px;
          margin: 0 1px;
          animation: wave 1.2s ease-in-out infinite;
        }
        .waveform-bar:nth-child(2) {
          animation-delay: 0.1s;
        }
        .waveform-bar:nth-child(3) {
          animation-delay: 0.2s;
        }
        .waveform-bar:nth-child(4) {
          animation-delay: 0.3s;
        }
        .waveform-bar:nth-child(5) {
          animation-delay: 0.4s;
        }
        .waveform-bar:nth-child(6) {
          animation-delay: 0.5s;
        }
        .waveform-bar:nth-child(7) {
          animation-delay: 0.6s;
        }
        .waveform-bar:nth-child(8) {
          animation-delay: 0.7s;
        }
        .waveform-bar:nth-child(9) {
          animation-delay: 0.8s;
        }
        .waveform-bar:nth-child(10) {
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  );
}
