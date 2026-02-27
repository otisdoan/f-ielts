
import React from "react";

export default function AdminHeader({ user }: { user: any }) {
  return (
    <header className="h-16 flex items-center justify-between border-b border-[#e6dbdb] bg-white px-8 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="relative w-64 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#896161] !text-lg">
            search
          </span>
          <input
            className="w-full bg-background-light border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary h-9 outline-none"
            placeholder="Search data..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#896161] hover:bg-background-light rounded-lg transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 size-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-[#e6dbdb] mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.email || "Admin User"}</p>
            <p className="text-[10px] text-[#896161] uppercase tracking-wider font-bold">
              Administrator
            </p>
          </div>
          <div
            className="size-10 rounded-full bg-center bg-cover border border-[#e6dbdb] bg-slate-200"
            style={{
              backgroundImage: user?.user_metadata?.avatar_url
                ? `url('${user.user_metadata.avatar_url}')`
                : undefined,
            }}
          >
            {!user?.user_metadata?.avatar_url && (
              <span className="flex items-center justify-center h-full w-full text-slate-500 font-bold text-xs">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
