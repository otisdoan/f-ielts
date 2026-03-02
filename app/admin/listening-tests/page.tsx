"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListeningTest } from "@/lib/types/listening-test";

export default function AdminListeningTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/listening-tests");
      const { data } = await response.json();
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      const response = await fetch(`/api/listening-tests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTests(tests.filter((test) => test.id !== id));
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete test");
    }
  };

  const handleTogglePublish = async (test: ListeningTest) => {
    try {
      const response = await fetch(`/api/listening-tests/${test.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...test,
          isPublished: !test.isPublished,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setTests(
          tests.map((t) => (t.id === test.id ? data : t))
        );
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update test");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Listening Tests
          </h1>
          <p className="text-slate-600">
            Manage IELTS listening practice tests
          </p>
        </div>
        <Link
          href="/admin/listening-tests/add"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Test
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
            headphones
          </span>
          <p className="text-gray-600 text-lg mb-4">No listening tests yet</p>
          <Link
            href="/admin/listening-tests/add"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Create First Test
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Band
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tests.map((test) => (
                <tr
                  key={test.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          headphones
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{test.title}</p>
                        <p className="text-sm text-slate-500">
                          {Math.floor(test.audioDuration / 60)}:
                          {String(test.audioDuration % 60).padStart(2, "0")}{" "}
                          audio
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary">
                      {test.targetBand}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{test.duration} mins</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">
                      {test.parts.reduce(
                        (sum, part) => sum + part.questions.length,
                        0
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(test)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                        test.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {test.isPublished ? (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                          Published
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/listening-tests/edit/${test.id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-slate-600">
                          edit
                        </span>
                      </Link>
                      <Link
                        href={`/practice/listening/${test.id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <span className="material-symbols-outlined text-slate-600">
                          visibility
                        </span>
                      </Link>
                      <button
                        onClick={() => handleDelete(test.id!)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-red-600">
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
  );
}
