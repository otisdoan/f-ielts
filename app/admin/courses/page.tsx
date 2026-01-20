
import React from 'react';

export default function AdminCoursesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Breadcrumbs */}
        <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <a className="text-[#896161] hover:text-primary transition-colors" href="/admin">Home</a>
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
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Lessons</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161]">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#896161] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f0f0]">
                        {/* Course Row 1 */}
                        <tr className="hover:bg-[#f8f6f6] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-16 rounded-md bg-zinc-100 flex-shrink-0 bg-cover bg-center border border-zinc-200 flex items-center justify-center">
                                       <span className="text-[10px] font-bold text-slate-400">IMAGE</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#181111]">Academic Reading Masterclass</p>
                                        <p className="text-xs text-[#896161]">Last updated: 2 days ago</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                    Band 7.5+
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-zinc-700">
                                24 Lessons
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-sm font-medium text-emerald-600">Published</span>
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
                         {/* Course Row 2 */}
                         <tr className="hover:bg-[#f8f6f6] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-16 rounded-md bg-zinc-100 flex-shrink-0 bg-cover bg-center border border-zinc-200 flex items-center justify-center">
                                       <span className="text-[10px] font-bold text-slate-400">IMAGE</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#181111]">Speaking Intensive: Part 1 &amp; 2</p>
                                        <p className="text-xs text-[#896161]">Last updated: 5 hours ago</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                                    Band 6.0
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-zinc-700">
                                12 Lessons
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-amber-500"></span>
                                    <span className="text-sm font-medium text-amber-600">Draft</span>
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
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
