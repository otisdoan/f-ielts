"use client";

import { useState } from "react";
import { Question, QuestionType } from "@/lib/types/reading-test";

interface QuestionsBuilderProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export default function QuestionsBuilder({
  questions,
  onChange,
}: QuestionsBuilderProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      questionNumber: questions.length + 1,
      ...(type === "fill-in-blanks" && {
        text: "",
        blanks: [],
      }),
      ...(type === "true-false-not-given" && {
        statement: "",
        correctAnswer: "True" as const,
      }),
      ...(type === "multiple-choice" && {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      }),
      ...(type === "matching" && {
        question: "",
        items: [],
      }),
    } as Question;

    onChange([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    const filtered = questions.filter((q) => q.id !== id);
    // Renumber questions
    const renumbered = filtered.map((q, index) => ({
      ...q,
      questionNumber: index + 1,
    }));
    onChange(renumbered);
  };

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const index = questions.findIndex((q) => q.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    // Renumber
    const renumbered = newQuestions.map((q, i) => ({
      ...q,
      questionNumber: i + 1,
    }));
    onChange(renumbered);
  };

  return (
    <div className="space-y-4">
      {/* Add Question Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addQuestion("fill-in-blanks")}
          className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
        >
          + Fill in Blanks
        </button>
        <button
          type="button"
          onClick={() => addQuestion("true-false-not-given")}
          className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
        >
          + True/False/Not Given
        </button>
        <button
          type="button"
          onClick={() => addQuestion("multiple-choice")}
          className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
        >
          + Multiple Choice
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white border border-[#e6dbdb] rounded-lg overflow-hidden"
          >
            {/* Question Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-[#e6dbdb]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">
                  Q{question.questionNumber}
                </span>
                <span className="text-sm text-gray-600 capitalize">
                  {question.type.replace("-", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveQuestion(question.id, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_upward
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => moveQuestion(question.id, "down")}
                  disabled={index === questions.length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_downward
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id,
                    )
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <span className="material-symbols-outlined text-sm">
                    {expandedQuestion === question.id
                      ? "expand_less"
                      : "expand_more"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteQuestion(question.id)}
                  className="p-1 hover:bg-red-100 text-red-600 rounded"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                </button>
              </div>
            </div>

            {/* Question Content */}
            {expandedQuestion === question.id && (
              <div className="p-4 space-y-3">
                {question.type === "fill-in-blanks" && (
                  <FillInBlanksEditor
                    question={question}
                    onChange={(updates) => updateQuestion(question.id, updates)}
                  />
                )}
                {question.type === "true-false-not-given" && (
                  <TrueFalseEditor
                    question={question}
                    onChange={(updates) => updateQuestion(question.id, updates)}
                  />
                )}
                {question.type === "multiple-choice" && (
                  <MultipleChoiceEditor
                    question={question}
                    onChange={(updates) => updateQuestion(question.id, updates)}
                  />
                )}

                {/* Explanation field (common for all) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={question.explanation || ""}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        explanation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    placeholder="Provide explanation for the correct answer..."
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          No questions added yet. Click a button above to add your first
          question.
        </div>
      )}
    </div>
  );
}

// Fill in Blanks Editor Component
function FillInBlanksEditor({ question, onChange }: any) {
  const addBlank = () => {
    const blanks = [...(question.blanks || [])];
    blanks.push({ number: blanks.length + 1, correctAnswer: "" });
    onChange({ blanks });
  };

  const updateBlank = (index: number, correctAnswer: string) => {
    const blanks = [...question.blanks];
    blanks[index] = { ...blanks[index], correctAnswer };
    onChange({ blanks });
  };

  const removeBlank = (index: number) => {
    const blanks = question.blanks.filter((_: any, i: number) => i !== index);
    // Renumber blanks
    const renumbered = blanks.map((b: any, i: number) => ({
      ...b,
      number: i + 1,
    }));
    onChange({ blanks: renumbered });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text (Use [1], [2], etc. for blanks)
        </label>
        <textarea
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          rows={4}
          placeholder="Example: The capital of France is [1] and it has a population of [2] million people."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Correct Answers
          </label>
          <button
            type="button"
            onClick={addBlank}
            className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
          >
            + Add Blank
          </button>
        </div>
        <div className="space-y-2">
          {question.blanks?.map((blank: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-600 w-8">
                [{blank.number}]
              </span>
              <input
                type="text"
                value={blank.correctAnswer}
                onChange={(e) => updateBlank(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Correct answer"
              />
              <button
                type="button"
                onClick={() => removeBlank(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// True/False Editor Component
function TrueFalseEditor({ question, onChange }: any) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statement
        </label>
        <textarea
          value={question.statement}
          onChange={(e) => onChange({ statement: e.target.value })}
          className="w-full px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="Enter the statement to be evaluated..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        <div className="flex gap-3">
          {["True", "False", "Not Given"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={question.correctAnswer === option}
                onChange={() => onChange({ correctAnswer: option })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Multiple Choice Editor Component
function MultipleChoiceEditor({ question, onChange }: any) {
  const updateOption = (index: number, value: string) => {
    const options = [...question.options];
    options[index] = value;
    onChange({ options });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <textarea
          value={question.question}
          onChange={(e) => onChange({ question: e.target.value })}
          className="w-full px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
          placeholder="Enter the question..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options (Select correct answer)
        </label>
        <div className="space-y-2">
          {question.options?.map((option: string, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctAnswer === index}
                onChange={() => onChange({ correctAnswer: index })}
                className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
              />
              <span className="text-sm font-medium text-gray-600 w-6">
                {String.fromCharCode(65 + index)}.
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-[#e6dbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
