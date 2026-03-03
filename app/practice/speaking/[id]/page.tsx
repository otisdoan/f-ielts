"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SpeakingInterface from "@/components/practice/SpeakingInterface";
import { SpeakingService, SpeakingTopic } from "@/services/speaking.service";

export default function SpeakingPracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<SpeakingTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      // Fetch topic from database
      const data = await SpeakingService.getTopicById(id);
      
      if (data && data.status === "published") {
        setTopic(data);
      } else {
        // Topic not found or not published, redirect to speaking practice page
        router.push("/practice/speaking");
      }
    } catch (error) {
      console.error("Error fetching topic:", error);
      router.push("/practice/speaking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return null; // Will redirect
  }

  return <SpeakingInterface topic={topic} />;
}
