"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "dashboard" },
    { name: "Users", href: "/admin/users", icon: "group" },
    { name: "Courses", href: "/admin/courses", icon: "menu_book" },
    { name: "Writing Management", href: "/admin/writing", icon: "edit_note" },


    {
      name: "Reading Tests",
      href: "/admin/reading-tests",
      icon: "description",
    },
    { name: "Listening Management", href: "/admin/listening", icon: "headphones" },

    { name: "Reports", href: "/admin/reports", icon: "bar_chart" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <aside className="w-64 border-r border-[#e6dbdb] rounded-r-xl bg-white flex flex-col h-full shrink-0">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-3xl">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#181111] text-lg font-bold leading-tight">
              F-IELTS
            </h1>
            <p className="text-[#896161] text-xs font-normal">Admin Panel</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-[#181111] hover:bg-background-light",
                )}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  {item.icon}
                </span>
                <p
                  className={cn(
                    "text-sm",
                    isActive ? "font-semibold" : "font-medium",
                  )}
                >
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>

        {/* Footer Nav */}
        <div className="pt-4 border-t border-[#e6dbdb]">
          <Link
            href="/logout" // Logic to be refined
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#181111] hover:bg-red-50 transition-colors cursor-pointer group"
          >
            <span
              className="material-symbols-outlined group-hover:text-primary"
              style={{ fontSize: "24px" }}
            >
              logout
            </span>
            <p className="text-sm font-medium group-hover:text-primary">
              Logout
            </p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
