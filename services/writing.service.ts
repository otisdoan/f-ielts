
import { createClient } from "@/lib/supabase/client";

// Define the type based on the new 'writing_prompts' table
export type WritingPrompt = {
  id: string;
  title: string;
  task_type: "task1" | "task2";
  instruction: string;
  question_text?: string;
  image_url?: string;
  sample_answer_json?: {
      intro?: string;
      overview?: string;
      body_1?: string;
      body_2?: string;
  };
  created_at?: string;
};

const TABLE_NAME = "writing_prompts"; 

export const WritingService = {
  // Fetch a single prompt by ID
  async getPromptById(id: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      if (!data) return null;

      return data as WritingPrompt;
    } catch (err) {
      console.error("Error fetching writing prompt:", err);
      return null;
    }
  },

  // Fetch all prompts for Admin list
  async getPrompts() {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

        if (error) throw error;
        
        return (data || []) as WritingPrompt[];
    } catch (err) {
        console.error("Error fetching writing prompts list:", err);
        return [];
    }
  },

  // Create new prompt
  async createPrompt(prompt: Omit<WritingPrompt, "id" | "created_at">) {
    const supabase = createClient();
    
    // Explicitly construct payload
    const payload = {
        title: prompt.title,
        task_type: prompt.task_type,
        instruction: prompt.instruction,
        question_text: prompt.question_text || null,
        image_url: prompt.image_url || null,
        sample_answer_json: prompt.sample_answer_json || {}
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) {
        console.error("Supabase Create Error:", JSON.stringify(error, null, 2));
        throw error;
    }
    return data;
  },

  // Update existing prompt
  async updatePrompt(id: string, prompt: Partial<WritingPrompt>) {
    const supabase = createClient();
    
    const updates: any = {};
    if (prompt.title !== undefined) updates.title = prompt.title;
    if (prompt.task_type !== undefined) updates.task_type = prompt.task_type;
    if (prompt.instruction !== undefined) updates.instruction = prompt.instruction;
    if (prompt.question_text !== undefined) updates.question_text = prompt.question_text;
    if (prompt.image_url !== undefined) updates.image_url = prompt.image_url;
    if (prompt.sample_answer_json !== undefined) updates.sample_answer_json = prompt.sample_answer_json;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  // Delete prompt
  async deletePrompt(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Fetch User Submissions (History)
  async getUserSubmissions() {
    const supabase = createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from("writing_submissions")
            .select(`
                id,
                created_at,
                status,
                writing_prompts ( title, task_type ),
                writing_feedback ( overall_band )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Map to cleaner structure
        return data.map((item: any) => ({
            id: item.id,
            title: item.writing_prompts?.title || "Untitled Submission",
            type: item.writing_prompts?.task_type === 'task1' ? 'Task 1' : 'Task 2',
            date: new Date(item.created_at).toLocaleDateString(),
            score: item.writing_feedback?.[0]?.overall_band || null, 
            status: item.status
        }));
    } catch (err) {
        console.error("Error fetching submissions:", err);
        return [];
    }
  }
};
