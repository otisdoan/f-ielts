import { createClient } from "@/lib/supabase/client";

export type SpeakingTopic = {
  id: string;
  part: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  preparation_time?: number; // in seconds
  speaking_time?: number; // in seconds
  tips?: string[];
  sample_answer?: string | null;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
};

const TOPICS_TABLE = "speaking_topics";

export const SpeakingService = {
  async getTopics(filters?: { part?: number; difficulty?: string; status?: string }) {
    const supabase = createClient();
    try {
      let query = supabase
        .from(TOPICS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.part) query = query.eq("part", filters.part);
      if (filters?.difficulty) query = query.eq("difficulty", filters.difficulty);
      if (filters?.status) query = query.eq("status", filters.status);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as SpeakingTopic[];
    } catch (err) {
      console.error("Error fetching speaking topics:", err);
      return [];
    }
  },

  async getTopicById(id: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from(TOPICS_TABLE)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as SpeakingTopic;
    } catch (err) {
      console.error("Error fetching topic:", err);
      return null;
    }
  },

  async createTopic(topic: Omit<SpeakingTopic, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from(TOPICS_TABLE)
        .insert([topic])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error("Error creating topic:", err);
      throw err;
    }
  },

  async updateTopic(id: string, updates: Partial<SpeakingTopic>) {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from(TOPICS_TABLE)
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating topic:", err);
      throw err;
    }
  },

  async deleteTopic(id: string) {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from(TOPICS_TABLE)
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting topic:", err);
      throw err;
    }
  },

  async publishTopic(id: string) {
    return this.updateTopic(id, { status: "published" });
  },

  async unpublishTopic(id: string) {
    return this.updateTopic(id, { status: "draft" });
  },
};
