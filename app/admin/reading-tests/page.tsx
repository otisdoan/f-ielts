import React from "react";
import { createClient } from "@/lib/supabase/server";
import ReadingTestsClient from "./client";

export default async function AdminReadingTestsPage() {
  const supabase = await createClient();

  // Fetch tests directly on the server to eliminate client-side network latency
  const { data: tests, error } = await supabase
    .from("reading_tests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tests:", error);
  }

  return <ReadingTestsClient initialTests={tests || []} />;
}
