
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 border-r border-[#e6dbdb] dark:border-[#3d2424] bg-white dark:bg-background-dark hidden lg:flex flex-col fixed h-full z-20">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#181111] dark:text-white text-lg font-bold leading-tight tracking-tight">
              F-IELTS
            </h1>
            <p className="text-[#896161] dark:text-[#c4a1a1] text-xs font-medium">
              Premium Member
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-primary/10 text-primary"
                : "text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424]"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
          <Link
            href="/practice"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/practice")
                ? "bg-primary/10 text-primary"
                : "text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424]"
            }`}
          >
            <span className="material-symbols-outlined">edit_note</span>
            <span className="text-sm font-semibold">Practice Tests</span>
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/analytics")
                ? "bg-primary/10 text-primary"
                : "text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424]"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              leaderboard
            </span>
            <span className="text-sm font-semibold">Analytics</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/materials")
                ? "bg-primary/10 text-primary"
                : "text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424]"
            }`}
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm font-semibold">Study Materials</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/plan")
                ? "bg-primary/10 text-primary"
                : "text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424]"
            }`}
          >
            <span className="material-symbols-outlined">event</span>
            <span className="text-sm font-semibold">Study Plan</span>
          </Link>
        </nav>
        <div className="mt-auto border-t border-[#e6dbdb] dark:border-[#3d2424] pt-6 flex flex-col gap-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#896161] hover:bg-[#f4f0f0] dark:hover:bg-[#3d2424] transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-semibold">Settings</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-4 mt-4 bg-[#f4f0f0] dark:bg-[#3d2424] rounded-xl">
            <div
              className="size-10 rounded-full bg-cover bg-center"
              data-alt="User profile avatar smiling"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiNKfkg_F9MjX0xBnTCeULDDPhVEs06KcpIm3dk8ZBzkmwitGHfdhk-wDFvAhSVMSHCTlFiw3aDLM53v7b4gaES4zUWW55StC-lZG-vDBAha0VZ_TKJ5-ltGwCUK8sEtcR-KEW64oIQIMDBMoUsWjV9lurL0Iv_SbkA_k6luU7mk1L6fnAqpobVNGrdl-6z0E8C4BQGrMrvP9QtpIa_L6CBJI4Pqg2MPSozDk6aHECnVA7WOTl6atT0F-urACf3cIvuWv8huSv8ep0')",
              }}
            ></div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Johnson</p>
              <p className="text-xs text-[#896161] dark:text-[#c4a1a1]">
                Target Band: 7.5
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
