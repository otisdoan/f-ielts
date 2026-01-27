"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ReadingTest,
  Question,
  QuestionPart,
  StudentAnswer,
} from "@/lib/types/reading-test";

export default function ReadingTestPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  useEffect(() => {
    fetchTest();
  }, [params.id]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/reading-tests/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch test");
      const { data } = await response.json();

      // Map DB snake_case to Frontend camelCase
      const mappedTest: ReadingTest = {
        ...data,
        passageContent: data.passage_content,
        targetBand: data.target_band,
        duration: data.duration,
        isPublished: data.is_published,
        questions: data.questions || [],
      };

      setTest(mappedTest);
      if (mappedTest.duration) setTimeLeft(mappedTest.duration * 60);
    } catch (error) {
      console.error(error);
      alert("Error loading test");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit your answers?")) return;
    console.log("Submitted answers:", answers);
    alert("Test submitted successfully!");
    router.push("/practice/reading");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to extract all questions in a flat list for navigation
  const getAllQuestions = (): Question[] => {
    if (!test) return [];
    const all: Question[] = [];
    test.questions.forEach((item) => {
      if ("questions" in item) {
        // It's a Part
        all.push(...(item as QuestionPart).questions);
      } else {
        all.push(item as Question);
      }
    });
    return all.sort((a, b) => a.questionNumber - b.questionNumber);
  };

  const allQuestions = getAllQuestions();

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((key) => {
      const val = answers[key];
      return val !== undefined && val !== "" && val !== null;
    }).length;
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!test) return <div className="p-10 text-center">Test not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e6dbdb] sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-[#181111]">{test.title}</h1>
            <span className="text-sm bg-red-50 text-primary px-2 py-1 rounded">
              Band {test.targetBand}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="font-mono font-bold text-lg">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm">
              {getAnsweredCount()} / {allQuestions.length} Answered
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1800px] mx-auto w-full overflow-hidden">
        <div className="grid grid-cols-2 gap-0 h-[calc(100vh-64px)]">
          {/* Passage Panel */}
          {/* Passage Panel */}
          <div className="bg-white border-r border-[#e6dbdb] overflow-y-auto flex flex-col h-full scroll-smooth">
            <div className="px-8 py-6 pb-4 bg-white sticky top-0 z-10 border-b border-gray-50/50 backdrop-blur-sm bg-white/95">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#181111] leading-tight">
                  <span className="text-gray-800">[YouPass Collect]</span> -{" "}
                  {test.title}
                </h2>
                <button className="flex-none px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-red-100 bg-white shadow-sm transition-all whitespace-nowrap">
                  Xem tóm tắt bài đọc
                </button>
              </div>
            </div>

            <div className="px-8 py-6 flex-1">
              <div
                className="max-w-none prose prose-lg prose-slate prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-loose prose-a:text-primary font-medium"
                dangerouslySetInnerHTML={{ __html: test.passageContent }}
              ></div>
            </div>
          </div>

          {/* Questions Panel */}
          <div className="bg-gray-50 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              {/* Render Groups/Questions */}
              {test.questions.map((item: any, index: number) => {
                if (item.questions) {
                  // It's a Group
                  return (
                    <GroupRenderer
                      key={item.id || index}
                      part={item}
                      answers={answers}
                      onAnswer={handleAnswerChange}
                    />
                  );
                } else {
                  // Legacy flat question
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded shadow-sm"
                    >
                      <LegacyQuestionRenderer
                        question={item}
                        answer={answers[item.id]}
                        onChange={(val: string) =>
                          handleAnswerChange(item.id, val)
                        }
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* Navigator logic is handled better in a separate component or strict sticky footer */}
            {/* For now, simplistic Navigator */}
            <div className="fixed bottom-0 right-0 w-1/2 bg-white border-t border-gray-200 p-4 z-10">
              <div className="max-w-3xl mx-auto">
                <div className="text-xs font-bold text-gray-500 mb-2">
                  NAVIGATOR
                </div>
                <div className="flex flex-wrap gap-2">
                  {allQuestions.map((q) => {
                    const isAnswered = answers[q.id];
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          const el = document.getElementById(`q-${q.id}`);
                          el?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold border ${isAnswered ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300 hover:border-blue-500"}`}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupRenderer({
  part,
  answers,
  onAnswer,
}: {
  part: QuestionPart;
  answers: any;
  onAnswer: any;
}) {
  const startNum = part.questions[0]?.questionNumber;
  const endNum = part.questions[part.questions.length - 1]?.questionNumber;

  // Function to render Summary Content with Inputs
  const renderSummaryContent = () => {
    if (!part.content) return null;

    // Split content by [number] regex
    // e.g. "Text [1] text [2]"
    // We need to map [1] to the input for the question with questionNumber 1 (or matching the index)

    // Robust strategy: Find all [x]. Replace with input.
    // However, [x] in text might be "1" literal.
    // Let's assume the user entered [1], [2] corresponding to order?
    // Or corresponding to ACTUAL Question Number?
    // In Admin, I set [1], [2]...
    // I should probably map them sequentially to the questions in `part.questions`.

    // Simple split by regex `\[\d+\]`
    const parts = part.content.split(/\[(\d+)\]/);
    // parts[0] = text, parts[1] = number, parts[2] = text...

    return (
      <div className="bg-white border border-gray-300 p-6 leading-relaxed text-gray-800">
        {parts.map((frag, i) => {
          // Every odd index is a capturing group (the number)
          if (i % 2 === 1) {
            // This is a placeholder number, e.g. "1"
            // Find the corresponding question
            // Strategy: The regex matched "1", implies 1st question in the group? Not necessarily.
            // But Admin says "Use [1], [2]..."
            // Let's assume index-based for simplicity: [1] -> part.questions[0]
            const index = parseInt(frag) - 1;
            const question = part.questions[index];

            if (!question)
              return (
                <span key={i} className="text-red-500">
                  [{frag}?]
                </span>
              );

            return (
              <span
                key={i}
                id={`q-${question.id}`}
                className="inline-flex items-center mx-1 align-middle relative group"
              >
                <span className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 bg-white px-1 border rounded-full shadow-sm whitespace-nowrap z-10">
                  {question.questionNumber}
                </span>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-0.5 w-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-bold text-blue-800"
                  value={answers[question.id] || ""}
                  onChange={(e) => onAnswer(question.id, e.target.value)}
                  placeholder={`${question.questionNumber}`}
                  aria-label={`Answer for question ${question.questionNumber}`}
                  autoComplete="off"
                />
              </span>
            );
          }
          // Even index is text
          return <span key={i}>{frag}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e6dbdb] overflow-hidden scroll-mt-20">
      <div className="bg-gray-50 border-b border-[#e6dbdb] px-6 py-3">
        <h3 className="font-bold text-[#181111]">
          Questions {startNum} - {endNum}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{part.instruction}</p>
      </div>

      <div className="p-6">
        {part.type === "summary-completion" ? (
          <>
            {part.content ? (
              renderSummaryContent()
            ) : (
              <div className="space-y-4">
                {/* Fallback if no content provided but type is summary */}
                {part.questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex gap-2 items-center"
                    id={`q-${q.id}`}
                  >
                    <span className="font-bold text-gray-500 w-8">
                      {q.questionNumber}.
                    </span>
                    <input
                      className="border p-2 rounded w-full max-w-sm"
                      value={answers[q.id] || ""}
                      onChange={(e) => onAnswer(q.id, e.target.value)}
                      aria-label={`Answer for question ${q.questionNumber}`}
                      placeholder="Type your answer"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : part.type === "true-false-not-given" ? (
          <div className="space-y-4">
            {part.questions.map((q) => (
              <div
                key={q.id}
                id={`q-${q.id}`}
                className="flex justify-between items-start gap-4 p-3 hover:bg-gray-50 rounded"
              >
                <div className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">
                    {q.questionNumber}
                  </span>
                  <p className="text-gray-800 text-sm">{q.text}</p>
                </div>
                <select
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[120px]"
                  value={answers[q.id] || ""}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                  aria-label={`Answer for question ${q.questionNumber}`}
                >
                  <option value="">Select...</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                  <option value="Not Given">Not Given</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {part.questions.map((q) => (
              <div key={q.id} id={`q-${q.id}`}>
                <div className="flex gap-2 mb-2">
                  <span className="font-bold text-primary">
                    {q.questionNumber}
                  </span>
                  <p className="font-medium text-gray-800">{q.text}</p>
                </div>
                {/* Multiple choice options rendering would go here - simplified for now */}
                <input
                  className="border p-2 rounded w-full"
                  value={answers[q.id] || ""}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                  placeholder="Your Answer"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LegacyQuestionRenderer({ question, answer, onChange }: any) {
  return (
    <div>
      <p className="font-bold mb-2">Question {question.questionNumber}</p>
      <p className="mb-2">{question.questionText || question.question}</p>
      <input
        className="border p-2 rounded w-full"
        value={answer || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Answer for question ${question.questionNumber}`}
        placeholder="Type your answer"
      />
    </div>
  );
}
