
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterSidebar from "@/components/mock-tests/FilterSidebar";
import MockTestCard from "@/components/mock-tests/MockTestCard";
import Link from "next/link";

const MOCK_TESTS = [
  {
    id: "cam-18-test-1",
    title: "Cambridge 18 - Test 1",
    duration: "2h 45m",
    difficulty: "Intermediate",
    type: "Academic",
    status: "Completed",
    score: "7.5",
  },
  {
    id: "cam-18-test-2",
    title: "Cambridge 18 - Test 2",
    duration: "2h 45m",
    difficulty: "Advanced",
    type: "Academic",
    status: "In Progress",
    progress: 60,
  },
  {
    id: "practice-alpha",
    title: "Practice Set Alpha",
    duration: "2h 45m",
    difficulty: "Beginner",
    type: "General",
    status: "Not Started",
  },
  {
    id: "cam-17-test-4",
    title: "Cambridge 17 - Test 4",
    duration: "2h 45m",
    difficulty: "Intermediate",
    type: "Academic",
    status: "Not Started",
  },
] as const;

export default function MockTestsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#181111] dark:text-white font-sans">
      <DashboardHeader />
      <main className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-40 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            className="text-[#896161] text-sm font-medium flex items-center gap-1"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Home
          </Link>
          <span className="text-[#896161] text-sm font-medium">/</span>
          <span className="text-[#181111] dark:text-white text-sm font-bold">
            Mock Test Library
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#181111] dark:text-white">
                  Mock Test Library
                </h1>
                <p className="text-[#896161] text-sm mt-1">
                  Practice with 24 full-length IELTS tests
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white dark:bg-[#3d1d1d] border border-[#f4f0f0] dark:border-[#3d1d1d] rounded-lg px-3 py-1 flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-[#896161]">
                    Sort by:
                  </span>
                  <span className="text-xs font-bold text-primary">Newest</span>
                </div>
              </div>
            </div>

            {/* Test Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_TESTS.map((test) => (
                <MockTestCard key={test.id} {...test} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12 pb-10">
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-background-dark/50 border border-[#f4f0f0] dark:border-[#3d1d1d] rounded-xl hover:bg-[#f4f0f0] dark:hover:bg-[#3d1d1d] transition-colors font-bold text-sm cursor-pointer">
                View More Tests
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mobile Nav (Quick Access) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-[#f4f0f0] dark:border-[#3d1d1d] flex justify-around py-2 px-4 z-40">
        <Link href="/dashboard" className="flex flex-col items-center text-[#896161] hover:text-primary">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/mock-tests" className="flex flex-col items-center text-primary">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-[10px] font-bold">Tests</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-[#896161] hover:text-primary">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] font-bold">Stats</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-[#896161] hover:text-primary">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold">Settings</span>
        </Link>
        </div>
    </div>
  );
}
