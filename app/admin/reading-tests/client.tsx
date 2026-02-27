"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReadingTestsClient({ initialTests }: { initialTests: any[] }) {
    const router = useRouter();
    const [tests, setTests] = useState<any[]>(initialTests);

    const deleteTest = async (id: string) => {
        if (!confirm("Are you sure you want to delete this test?")) return;

        try {
            await fetch(`/api/reading-tests/${id}`, { method: "DELETE" });
            setTests(tests.filter((t) => t.id !== id));
            router.refresh();
        } catch (error) {
            alert("Error deleting test");
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Breadcrumbs */}
            <div className="px-8 py-4 flex items-center gap-2 text-sm">
                <Link
                    href="/admin"
                    className="text-[#896161] hover:text-primary transition-colors"
                >
                    Home
                </Link>
                <span className="material-symbols-outlined text-xs text-[#896161]">
                    chevron_right
                </span>
                <span className="text-[#181111] font-medium">Reading Tests</span>
            </div>

            {/* Page Heading */}
            <div className="px-8 py-2 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#181111]">
                            Reading Tests Management
                        </h2>
                        <p className="text-[#896161] mt-1">
                            Create and manage IELTS reading practice tests
                        </p>
                    </div>
                    <Link
                        href="/admin/reading-tests/add"
                        className="bg-primary hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span>Add New Test</span>
                    </Link>
                </div>

                {/* Tests List */}
                <div className="bg-white rounded-xl border border-[#e6dbdb] overflow-hidden">
                    {tests.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                                description
                            </span>
                            <p className="text-gray-500">
                                No reading tests yet. Create your first test!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-[#e6dbdb]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Test Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Target Band
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Questions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tests.map((test) => (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {test.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-primary">
                                                    Band {test.target_band}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {test.duration} mins
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {test.questions?.length || 0} questions
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${test.is_published
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {test.is_published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            router.push(`/practice/reading/${test.id}`)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Preview"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">
                                                            visibility
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/reading-tests/edit/${test.id}`,
                                                            )
                                                        }
                                                        className="text-primary hover:text-red-700"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">
                                                            edit
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTest(test.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">
                                                            delete
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
