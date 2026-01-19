
import Link from 'next/link';

interface MockTestCardProps {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Academic" | "General";
  status: "Completed" | "In Progress" | "Not Started";
  score?: string; // Band score if completed
  progress?: number; // percent if in progress
}

export default function MockTestCard({
  id,
  title,
  duration,
  difficulty,
  type,
  status,
  score,
  progress,
}: MockTestCardProps) {
  const isCompleted = status === "Completed";
  const isInProgress = status === "In Progress";
  const isNotStarted = status === "Not Started";

  // Color mappings
  const typeColor = type === "Academic" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";
  const borderLeftColor = isCompleted
    ? "border-l-green-500"
    : isInProgress
    ? "border-l-orange-500"
    : "border-l-transparent";

  return (
    <div
      className={`bg-white dark:bg-background-dark/30 rounded-xl border border-[#f4f0f0] dark:border-[#3d1d1d] overflow-hidden hover:shadow-lg transition-all border-l-4 ${borderLeftColor}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${typeColor}`}>
            {type}
          </span>
          <div className={`flex items-center gap-1 font-bold text-xs px-2 py-1 rounded ${
              isCompleted ? "bg-green-50 text-green-600" :
              isInProgress ? "bg-orange-50 text-orange-600" :
              "bg-gray-50 text-gray-500"
          }`}>
            <span className="material-symbols-outlined text-sm">
                {isCompleted ? "check_circle" : isInProgress ? "pending" : "fiber_manual_record"}
            </span>
            {status}
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#181111] dark:text-white mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-4 text-[#896161] text-sm mb-4">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">schedule</span>
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              signal_cellular_alt
            </span>
            {difficulty}
          </div>
        </div>

        {isCompleted && score && (
          <div className="bg-gray-100 dark:bg-[#3d1d1d] rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#896161]">Performance Score</span>
              <span className="text-primary">{score} Band</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: "85%" }} // approximation based on score usually
              ></div>
            </div>
          </div>
        )}

        {isInProgress && progress !== undefined && (
          <div className="bg-gray-100 dark:bg-[#3d1d1d] rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#896161]">Section: Listening</span>
              <span className="text-orange-600">{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {isNotStarted && (
           <div className="grid grid-cols-4 gap-1 mb-6">
           <div className="bg-gray-100 dark:bg-[#3d1d1d] h-1 rounded"></div>
           <div className="bg-gray-100 dark:bg-[#3d1d1d] h-1 rounded"></div>
           <div className="bg-gray-100 dark:bg-[#3d1d1d] h-1 rounded"></div>
           <div className="bg-gray-100 dark:bg-[#3d1d1d] h-1 rounded"></div>
           </div>
        )}

        <Link href={`/mock-tests/${id}`}>
          <button className={`w-full py-2 font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 ${
              isCompleted 
              ? "bg-[#f4f0f0] dark:bg-[#3d1d1d] hover:bg-[#e6dbdb] text-[#181111] dark:text-white" 
              : "bg-primary hover:bg-red-700 text-white"
          }`}>
            {isCompleted && "Review Answers"}
            {isInProgress && (
                <>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Resume Test
                </>
            )}
            {isNotStarted && "Start Test"}
          </button>
        </Link>
      </div>
    </div>
  );
}
