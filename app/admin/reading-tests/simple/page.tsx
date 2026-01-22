"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddReadingTestSimple() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold mb-4">
            Add New Reading Test (Simple Version)
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Test Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter test title"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => alert("Title: " + title)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
