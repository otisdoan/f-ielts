
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MockTestCard from "@/components/mock-tests/MockTestCard";
import Link from "next/link";

const READING_PRACTICE_SETS = [
  {
    id: "reading-1",
    title: "The History of Sustainable Architecture",
    duration: "20m",
    difficulty: "Intermediate",
    type: "Academic",
    status: "Not Started",
  },
  {
    id: "reading-2",
    title: "Urban Planning in 20th Century",
    duration: "20m",
    difficulty: "Advanced",
    type: "Academic",
    status: "Completed",
    score: "8.0",
  },
  {
    id: "reading-3",
    title: "Wildlife Conservation Efforts",
    duration: "20m",
    difficulty: "Beginner",
    type: "General",
    status: "In Progress",
    progress: 40,
  },
] as const;

export default function ReadingListPage() {
  return (
    <div className="bg-background-light -background-dark min-h-screen text-[#181111] -white font-sans">
      <DashboardHeader />
      <main className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-40 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link
            className="text-[#896161] text-sm font-medium flex items-center gap-1"
            href="/practice"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Practice
          </Link>
          <span className="text-[#896161] text-sm font-medium">/</span>
          <span className="text-[#181111] -white text-sm font-bold">
            Reading Practice
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#181111] -white mb-6">
          Reading Practice Library
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {READING_PRACTICE_SETS.map((test) => (
             // @ts-ignore - reusing MockTestCard props roughly fits
            <MockTestCard key={test.id} {...test} id={test.id} /> 
          ))}
        </div>
      </main>
    </div>
  );
}
