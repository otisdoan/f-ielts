import React from 'react';
import { createClient } from "@/lib/supabase/server";
import Link from 'next/link';

export default async function AdminCoursesPage() {
    const supabase = await createClient();

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Breadcrumbs */}
            <div className="px-8 py-4 flex items-center gap-2 text-sm">
                <Link className="text-[#896161] hover:text-primary transition-colors" href="/admin">Home</Link>
                <span className="material-symbols-outlined text-xs text-[#896161]">chevron_right</span>
                <span className="text-[#181111] font-medium">Course Management</span>
            </div>

            {/* Page Heading & Controls */}
            <div className="px-8 py-2 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#181111]">Course Management</h2>
                        <p className="text-[#896161] mt-1">Design and publish your IELTS curriculum</p>
                    </div>
                    <button
                        className="bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer">
                        <span className="material-symbols-outlined">add</span>
                        <span>Add New Course</span>
                    </button>
                </div>
                {/* Filters/Chips */}
                <div
                    className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#f4f0f0]">
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer">All Courses</button>
                        <button className="px-4 py-1.5 rounded-lg bg-[#f4f0f0] text-[#181111] text-sm font-medium hover:bg-zinc-200 transition-colors cursor-pointer">Published</button>
                        <button className="px-4 py-1.5 rounded-lg bg-[#f4f0f0] text-[#181111] text-sm font-medium hover:bg-zinc-200 transition-colors cursor-pointer">Draft</button>
                        <button className="px-4 py-1.5 rounded-lg bg-[#f4f0f0] text-[#181111] text-sm font-medium hover:bg-zinc-200 transition-colors cursor-pointer">Archived</button>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-[#896161] px-4 cursor-pointer">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        <span>Advanced Filters</span>
                    </button>
                </div>
            </div>

            {/* Course Table Section */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl border border-[#f4f0f0] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-[#f4f0f0]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Course Detail</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Target Band</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f0f0]">
                            {courses && courses.length > 0 ? courses.map((course: any) => (
                                <tr key={course.id} className="hover:bg-[#f8f6f6] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {course.image_url ? (
                                                <div className="h-12 w-16 rounded-md flex-shrink-0 bg-cover bg-center border border-zinc-200 flex items-center justify-center" style={{ backgroundImage: `url(${course.image_url})` }}></div>
                                            ) : (
                                                <div className="h-12 w-16 rounded-md bg-zinc-100 flex-shrink-0 bg-cover bg-center border border-zinc-200 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400">IMAGE</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-[#181111]">{course.title || 'Untitled Course'}</p>
                                                <p className="text-xs text-[#896161]">Last updated: {new Date(course.updated_at || course.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                            Band {course.target_band || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${course.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                            <span className={`text-sm font-medium ${course.is_active ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {course.is_active ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Edit Course">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Delete Course">
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No courses available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
