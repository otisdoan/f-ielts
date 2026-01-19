
export default function FilterSidebar() {
  return (
    <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
      <div className="bg-white -background-dark/50 rounded-xl border border-slate-200 -slate-800 p-4 sticky top-24">
        <h3 className="text-[#181111] -white text-base font-bold mb-4 px-2">
          Filters
        </h3>
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary cursor-pointer">
            <span className="material-symbols-outlined">grid_view</span>
            <p className="text-sm font-bold">All Mock Tests</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f4f0f0] :bg-[#3d1d1d] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">school</span>
            <p className="text-sm font-medium">Academic</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f4f0f0] :bg-[#3d1d1d] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">work</span>
            <p className="text-sm font-medium">General Training</p>
          </div>
        </div>
        <div className="border-t border-[#f4f0f0] -[#3d1d1d] pt-4">
          <details className="group mb-2" open>
            <summary className="flex cursor-pointer items-center justify-between py-2 group-hover:bg-[#f4f0f0] -hover:bg-[#3d1d1d] rounded-lg px-2">
              <span className="text-[#181111] -white text-sm font-bold">
                Difficulty
              </span>
              <span className="material-symbols-outlined text-lg transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="flex flex-col gap-2 p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">Beginner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  defaultChecked
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">Intermediate</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">Advanced</span>
              </label>
            </div>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-2 group-hover:bg-[#f4f0f0] -hover:bg-[#3d1d1d] rounded-lg px-2">
              <span className="text-[#181111] -white text-sm font-bold">
                Status
              </span>
              <span className="material-symbols-outlined text-lg transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="flex flex-col gap-2 p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">Not Started</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">In Progress</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="rounded text-primary focus:ring-primary border-[#e6dbdb] size-4"
                  type="checkbox"
                />
                <span className="text-sm text-[#896161]">Completed</span>
              </label>
            </div>
          </details>
        </div>
      </div>
    </aside>
  );
}
