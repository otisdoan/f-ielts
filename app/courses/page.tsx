import { getDictionary, Language } from "@/lib/i18n";
import { cookies } from "next/headers";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/login");
    }
    
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
    
    const cookieStore = await cookies();
    const lang = (cookieStore.get("preferred_language")?.value as Language) || "en";
    const dict = getDictionary(lang);

    return (
        <div className="bg-background-light text-[#181111] min-h-screen font-sans flex flex-col transition-colors duration-200">
            <DashboardHeader user={user} profile={profile} />
            <main className="flex flex-1 justify-center py-8">
                <div className="flex flex-col max-w-[1240px] flex-1 px-8 lg:px-10">
                    {/* Header Section */}
                    <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
                        <div className="flex min-w-72 flex-col gap-2">
                            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">
                                IELTS Course Library
                            </h1>
                            <p className="text-slate-500 text-lg font-normal">
                                Expert-led courses designed to help you reach your target band score.
                            </p>
                        </div>
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-sm">
                            <span className="material-symbols-outlined">auto_awesome</span>
                            <span>Personalized Recommendations Available</span>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-10 space-y-4 border border-slate-100">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <label className="flex flex-col min-w-40 h-12 w-full">
                                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 hover:border-slate-300 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                                        <div className="text-slate-400 flex items-center justify-center pl-4 rounded-l-lg bg-slate-50">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 focus:outline-0 focus:ring-0 border-none bg-slate-50 h-full placeholder:text-slate-400 px-4 rounded-r-lg text-base font-normal"
                                            placeholder="Search for courses like 'Writing Task 2' or 'Speaking Intensive'..."
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap items-center">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mr-2">
                                Filters:
                            </span>
                            <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-slate-100 px-4 hover:bg-slate-200 transition-all text-slate-700 cursor-pointer">
                                <p className="text-sm font-medium">Level (Band)</p>
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </button>
                            <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-slate-100 px-4 hover:bg-slate-200 transition-all text-slate-700 cursor-pointer">
                                <p className="text-sm font-medium">Price Range</p>
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </button>
                            <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-slate-100 px-4 hover:bg-slate-200 transition-all text-slate-700 cursor-pointer">
                                <p className="text-sm font-medium">Instructor</p>
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </button>
                            <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-red-50 text-primary px-4 font-semibold ml-auto hover:bg-red-100 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-lg mr-1">restart_alt</span>
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-0 mb-10">
                        {/* Course Card 1 */}
                        <div className="flex flex-col gap-0 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div
                                className="relative w-full aspect-[4/3] bg-cover bg-center overflow-hidden"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfynkICXe_IrIz3bSG-ulYNdd0ohNKy1Ruyc0_QnL0bojfWiHCPsDKF4vWNC1tdoXHYRRBWDRiFqgK-5Cc50EWjLpa37QtJUZl_t0gBmsnCeFyRMWjx7Hq8n2K19ytgbZCavGS3GyHkxrKeBP2YPreOYjQe9_N9NjgREgRluBx-PAm8wsHisvNONgId4-Y2yz4a-MhkS_mBD7Kw5qiZuSbsFCjL0cuKpPaoaoT6ewIkl1t9iamkN95cFb47XcXyBMJ6P5L-4s1YDC4")',
                                }}
                            >
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                                    Target 7.5+
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-slate-700 shadow-sm border border-slate-100/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    12h 45m
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-slate-900 text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    Mastering Writing Task 2
                                </h3>
                                <p className="text-slate-500 text-sm mb-4">By Dr. Sarah Jenkins • Senior Examiner</p>
                                <div className="flex items-center gap-1.5 mb-5">
                                    <span className="material-symbols-outlined text-amber-400 fill-1 text-lg">star</span>
                                    <span className="font-bold text-sm text-slate-800">4.8</span>
                                    <span className="text-slate-400 text-sm">(1.2k reviews)</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</span>
                                        <span className="text-xl font-black text-slate-900">$49.99</span>
                                    </div>
                                    <button className="w-full md:w-auto flex items-center justify-center rounded-xl px-5 h-11 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="flex flex-col gap-0 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div
                                className="relative w-full aspect-[4/3] bg-cover bg-center overflow-hidden"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsDSf7LO3rMVCVKEjSWAorBrYrTAooCez01kvv6p3NIeWBSWkMGn1veLqOT3nTO6yJAgi6J52P9n0AbQfu3PMR9SmSqBiNHb6s9PgC-vo1Fe_mdqLbQ3VfyqU9_R406TEgMQXGStoPhbcZfrmPhyl6HGQzKM3h9QuvNqsr0Vm1_SW7ylpK503xveLRJx3opsUpHxpSmZ2d9FbIFE4smrVuRXlZVe04DSvhMAaiFCbnLz95I9muIF0Q1P3WYTMP1aVHEPmEqYgjpQWR")',
                                }}
                            >
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                                    Target 7.0+
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-slate-700 shadow-sm border border-slate-100/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    8h 20m
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-slate-900 text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    Speaking Band 7+ Intensive
                                </h3>
                                <p className="text-slate-500 text-sm mb-4">By Simon Watts • IELTS Expert</p>
                                <div className="flex items-center gap-1.5 mb-5">
                                    <span className="material-symbols-outlined text-amber-400 fill-1 text-lg">star</span>
                                    <span className="font-bold text-sm text-slate-800">4.9</span>
                                    <span className="text-slate-400 text-sm">(850 reviews)</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</span>
                                        <span className="text-xl font-black text-slate-900">$59.99</span>
                                    </div>
                                    <button className="w-full md:w-auto flex items-center justify-center rounded-xl px-5 h-11 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="flex flex-col gap-0 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div
                                className="relative w-full aspect-[4/3] bg-cover bg-center overflow-hidden"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsHfDLjAqubv_UIS9ETrfZ8QxvZrztueNNvdvYyjdf6Y9kIXpInQuXctypWs5E8a5Iy4gjGp8jRAaMyrTrgiLccRwqASsy69HqiE9LohTIBdA1z60YGpqd9M_fetMZT_joWC1ZvFvuJ_n0B0KQ5rIkbeeWjny6mXVDsjAYL5PCHtIIMzYE5pUyVOyCyIvshgb1oXI0E1WK6aKOLCiXp4G1r6uU_RbkQuO6fOOlwOl58osKNqC7dJVvM-_s7xvXpBLM957mYbjHQ1TN")',
                                }}
                            >
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                                <div className="absolute top-3 left-3 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md border border-slate-700">
                                    Target 6.5+
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-slate-700 shadow-sm border border-slate-100/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    15h 10m
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-slate-900 text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    Complete Reading Strategies
                                </h3>
                                <p className="text-slate-500 text-sm mb-4">By Lisa Ray • Former Examiner</p>
                                <div className="flex items-center gap-1.5 mb-5">
                                    <span className="material-symbols-outlined text-amber-400 fill-1 text-lg">star</span>
                                    <span className="font-bold text-sm text-slate-800">4.7</span>
                                    <span className="text-slate-400 text-sm">(2.1k reviews)</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</span>
                                        <span className="text-xl font-black text-slate-900">$39.99</span>
                                    </div>
                                    <button className="w-full md:w-auto flex items-center justify-center rounded-xl px-5 h-11 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 4 */}
                        <div className="flex flex-col gap-0 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div
                                className="relative w-full aspect-[4/3] bg-cover bg-center overflow-hidden"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyF2qu5TllEXkaYcqTtOT6NA3JEjiojVC5Lko21gqFk7qzP6IxvMsCqfYmk3RTRg9Dbu5mnQDeqOTW5oKx4Ni3UB_5b78hKU-D7BNVpLQzZfngpbgqMZGM9K5bqkj-apwgSDnU1Ub0t7yo0YuTNvkxayM4YdlctPOx0DY0rDpQpDwRBHKi1lmunm_9knhbvLRoE9loX9zcPJSJBQc5pU1a6ZHzhXFim_Aop9cU2pOOLdv7kN0fyGsYu8Nc309XdiMmBm_VPCfUKKWY")',
                                }}
                            >
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                                    Target 8.0+
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-slate-700 shadow-sm border border-slate-100/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    6h 45m
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-slate-900 text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    Listening Hacks for Band 8+
                                </h3>
                                <p className="text-slate-500 text-sm mb-4">By David Miller • Native Speaker</p>
                                <div className="flex items-center gap-1.5 mb-5">
                                    <span className="material-symbols-outlined text-amber-400 fill-1 text-lg">star</span>
                                    <span className="font-bold text-sm text-slate-800">4.9</span>
                                    <span className="text-slate-400 text-sm">(420 reviews)</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</span>
                                        <span className="text-xl font-black text-slate-900">$29.99</span>
                                    </div>
                                    <button className="w-full md:w-auto flex items-center justify-center rounded-xl px-5 h-11 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Added Extra Layout Polish - You could map these out from an array in a real app */}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 py-8 border-t border-slate-100 mt-4">
                        <button className="flex min-w-[200px] h-12 items-center justify-center gap-2 rounded-xl bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold cursor-pointer group shadow-sm hover:shadow-md">
                            <span>Load More Courses</span>
                            <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">expand_more</span>
                        </button>
                        <p className="text-sm font-medium text-slate-500">Showing 4 of 42 courses available</p>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-10 px-10">
                <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <span className="font-black text-xl text-slate-900 tracking-tight">F-IELTS EdTech</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-slate-500">
                        <a className="hover:text-primary transition-colors" href="#">About Us</a>
                        <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                    </div>
                    <div className="flex gap-4">
                        <button className="size-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-slate-600">
                            <span className="material-symbols-outlined text-xl">language</span>
                        </button>
                        <button className="size-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-slate-600">
                            <span className="material-symbols-outlined text-xl">forum</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-bold text-slate-400">
                    © 2024 F-IELTS Bilingual SaaS Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
