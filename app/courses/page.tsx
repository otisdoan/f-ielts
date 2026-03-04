import { getDictionary, Language } from "@/lib/i18n";
import { cookies } from "next/headers";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Fetch courses — chỉ dùng fields có trong schema:
  // id, title, slug, description, level, thumbnail, is_active, created_at
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, slug, description, level, thumbnail, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
  }

  const cookieStore = await cookies();
  const lang =
    (cookieStore.get("preferred_language")?.value as Language) || "en";
  const dict = getDictionary(lang);

  // Badge color theo level
  function getBadgeClass(level: string | null) {
    const l = parseFloat(level || "0");
    if (l >= 8.0) return "bg-amber-500";
    if (l >= 7.0) return "bg-primary";
    return "bg-slate-700";
  }

  const displayCourses = courses ?? [];

  return (
    <div className="bg-background-light text-[#181111] min-h-screen font-sans flex flex-col transition-colors duration-200">
      <DashboardHeader user={user} profile={profile} />

      <main className="flex flex-1 justify-center py-8">
        <div className="flex flex-col max-w-[1200px] flex-1 px-10">

          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-[#181111] text-4xl font-black leading-tight tracking-tight">
                IELTS Course Library
              </h1>
              <p className="text-[#896161] text-lg font-normal">
                Expert-led courses designed to help you reach your target band score.
              </p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-sm">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Personalized Recommendations Available</span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-10 space-y-4 border border-[#f4f0f0]">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-[#896161] flex bg-[#f4f0f0] items-center justify-center pl-4 rounded-l-lg">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#181111] focus:outline-0 focus:ring-0 border-none bg-[#f4f0f0] h-full placeholder:text-[#896161] px-4 text-base font-normal"
                      placeholder="Search for courses like 'Writing Task 2' or 'Speaking Intensive'..."
                    />
                  </div>
                </label>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <span className="text-sm font-semibold text-[#896161] uppercase tracking-wider mr-2">Filters:</span>
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] px-4 hover:bg-gray-200 transition-all text-[#181111]">
                <p className="text-sm font-medium">Level (Band)</p>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] px-4 hover:bg-gray-200 transition-all text-[#181111]">
                <p className="text-sm font-medium">Price Range</p>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] px-4 hover:bg-gray-200 transition-all text-[#181111]">
                <p className="text-sm font-medium">Instructor</p>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary/10 text-primary px-4 font-semibold ml-auto hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg mr-1">restart_alt</span>
                Clear All
              </button>
            </div>
          </div>

          {/* Course Grid */}
          {displayCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-0">
                {displayCourses.map((course: any) => (
                  <div
                    key={course.id}
                    className="flex flex-col gap-0 bg-white border border-[#f4f0f0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-full bg-center bg-no-repeat aspect-video bg-cover overflow-hidden"
                      style={{
                        backgroundImage: course.thumbnail
                          ? `url("${course.thumbnail}")`
                          : `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfynkICXe_IrIz3bSG-ulYNdd0ohNKy1Ruyc0_QnL0bojfWiHCPsDKF4vWNC1tdoXHYRRBWDRiFqgK-5Cc50EWjLpa37QtJUZl_t0gBmsnCeFyRMWjx7Hq8n2K19ytgbZCavGS3GyHkxrKeBP2YPreOYjQe9_N9NjgREgRluBx-PAm8wsHisvNONgId4-Y2yz4a-MhkS_mBD7Kw5qiZuSbsFCjL0cuKpPaoaoT6ewIkl1t9iamkN95cFb47XcXyBMJ6P5L-4s1YDC4")`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                      {course.level && (
                        <div className={`absolute top-3 left-3 ${getBadgeClass(course.level)} text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
                          Target {course.level}+
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[#181111] text-lg font-bold leading-tight group-hover:text-primary transition-colors mb-2">
                        {course.title}
                      </h3>
                      <p className="text-[#896161] text-sm mb-4 line-clamp-2">
                        {course.description || "No description available"}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-6 text-xs text-[#896161]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          {new Date(course.created_at).toLocaleDateString("vi-VN")}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${course.is_active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {course.is_active ? "Published" : "Draft"}
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-4 border-t border-[#f4f0f0]">
                        <button className="w-full flex items-center justify-center rounded-lg h-11 bg-primary hover:bg-red-700 text-white text-sm font-bold tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Count */}
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <p className="text-sm text-[#896161]">
                  Showing {displayCourses.length} course{displayCourses.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="col-span-full text-center py-24">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-7xl text-slate-200">school</span>
                <h3 className="text-xl font-bold text-slate-600">No courses available yet</h3>
                <p className="text-slate-400">
                  Admin chưa thêm khóa học nào. Vào{" "}
                  <a href="/admin/courses" className="text-primary font-medium hover:underline">
                    Admin → Courses
                  </a>{" "}
                  để thêm khóa học.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#f4f0f0] py-10 px-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" />
              </svg>
            </div>
            <span className="font-bold text-lg">F-IELTS EdTech</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-[#896161]">
            <a className="hover:text-primary transition-colors" href="#">About Us</a>
            <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
          <div className="flex gap-4">
            <button className="size-10 rounded-full bg-[#f4f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[#896161]">
              <span className="material-symbols-outlined text-xl">language</span>
            </button>
            <button className="size-10 rounded-full bg-[#f4f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[#896161]">
              <span className="material-symbols-outlined text-xl">forum</span>
            </button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#f4f0f0] text-center text-xs text-[#896161]">
          © 2024 F-IELTS Bilingual SaaS Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
