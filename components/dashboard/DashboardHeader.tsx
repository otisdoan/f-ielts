
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white -background-dark border-b border-slate-200 -slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href="/dashboard">
              <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">
                  database
                </span>
              </div>
              <h2 className="text-slate-900 -white text-xl font-black tracking-tight">
                F-IELTS
              </h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                className="text-primary text-sm font-semibold leading-normal"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-slate-600 -slate-400 text-sm font-medium hover:text-primary transition-colors"
                href="/practice"
              >
                Practice Tests
              </Link>
              <Link
                className="text-slate-600 -slate-400 text-sm font-medium hover:text-primary transition-colors"
                href="/courses"
              >
                Study Material
              </Link>
              <Link
                className="text-slate-600 -slate-400 text-sm font-medium hover:text-primary transition-colors"
                href="/settings"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 -slate-800 rounded-lg px-3 py-1.5 gap-2 border border-transparent focus-within:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-lg">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-48 p-0 placeholder:text-slate-500 outline-none"
                placeholder="Search lessons..."
                type="text"
              />
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-primary/20 p-0.5">
              <div
                className="h-full w-full rounded-full bg-cover bg-center"
                data-alt="User profile avatar"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo7B2AjdDjcpRLbIpSG8TTvQgLffRmRtbif5lIPQ1nIUUW1wX0AKIzBO_z9N8A9T5j6H-E35fUVXmBu81JdgbPe-NAt0FDwGZdTXdO-cpIAL8q9bxhb4kwnrJMLFkATxtSr2QdaH5mpBtTPBDUBjwUJjRQbWN0EKG_iH7PY09i_HVgDYTAKksqhiW-n6KsFi-8mzOfHqJb4wi-hLZ-n2kIC3wtjAk0_l43wS8aClbUR8-IM2ESB3J3YfLwaLu5mm9J7iP-it4wE4tL')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
