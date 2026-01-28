import { createClient } from "@/lib/supabase/client";

// Define the type based on the updated 'writing_prompts' table
export type WritingPrompt = {
  id: string;
  title: string;
  category: "task1" | "task2" | "builder"; // Replaces task_type
  source?: string;
  sub_type?: string;
  instruction: string;
  question_text?: string;
  image_url?: string;
  sample_answer_json?: {
      intro?: string;
      overview?: string;
      body_1?: string;
      body_2?: string;
  };
  guide_tips?: string[]; // For Task 1 Builder
  created_at?: string;
  // Legacy field for backward compatibility
  task_type?: "task1" | "task2"; // Will be migrated to category
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

      // Handle migration: map task_type to category if category is null
      if (!data.category && data.task_type) {
        data.category = data.task_type;
      }

      return data as WritingPrompt;
    } catch (err) {
      console.error("Error fetching writing prompt:", err);
      return null;
    }
  },

  // Fetch all prompts for Admin list with optional filters
  async getPrompts(filters?: {
    category?: string;
    source?: string;
    sub_type?: string;
  }) {
    const supabase = createClient();
    try {
        let query = supabase
          .from(TABLE_NAME)
          .select("*");

        // Apply filters
        if (filters?.category) {
          query = query.eq("category", filters.category);
        }
        if (filters?.source) {
          query = query.eq("source", filters.source);
        }
        if (filters?.sub_type) {
          query = query.eq("sub_type", filters.sub_type);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;
        
        // Handle migration: map task_type to category for old records
        const migratedData = (data || []).map((item: any) => {
          if (!item.category && item.task_type) {
            item.category = item.task_type;
          }
          return item;
        });
        
        return migratedData as WritingPrompt[];
    } catch (err) {
        console.error("Error fetching writing prompts list:", err);
        return [];
    }
  },

  // Create new prompt
  async createPrompt(prompt: Omit<WritingPrompt, "id" | "created_at" | "task_type">) {
    const supabase = createClient();
    
    // Explicitly construct payload
    const payload: any = {
        title: prompt.title,
        category: prompt.category,
        instruction: prompt.instruction,
        question_text: prompt.question_text || null,
        image_url: prompt.image_url || null,
        sample_answer_json: prompt.sample_answer_json || {}
    };

    // Add optional fields
    if (prompt.source) payload.source = prompt.source;
    if (prompt.sub_type) payload.sub_type = prompt.sub_type;
    if (prompt.guide_tips && prompt.guide_tips.length > 0) {
      payload.guide_tips = prompt.guide_tips;
    }

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
    if (prompt.category !== undefined) updates.category = prompt.category;
    if (prompt.source !== undefined) updates.source = prompt.source;
    if (prompt.sub_type !== undefined) updates.sub_type = prompt.sub_type;
    if (prompt.instruction !== undefined) updates.instruction = prompt.instruction;
    if (prompt.question_text !== undefined) updates.question_text = prompt.question_text;
    if (prompt.image_url !== undefined) updates.image_url = prompt.image_url;
    if (prompt.sample_answer_json !== undefined) updates.sample_answer_json = prompt.sample_answer_json;
    if (prompt.guide_tips !== undefined) updates.guide_tips = prompt.guide_tips;

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
                writing_prompts ( title, category, task_type ),
                writing_feedback ( overall_band )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Map to cleaner structure
        return data.map((item: any) => {
          const prompt = item.writing_prompts;
          const category = prompt?.category || prompt?.task_type || 'task1';
          return {
            id: item.id,
            title: prompt?.title || "Untitled Submission",
            type: category === 'task1' || category === 'builder' ? 'Task 1' : 'Task 2',
            date: new Date(item.created_at).toLocaleDateString(),
            score: item.writing_feedback?.[0]?.overall_band || null, 
            status: item.status
          };
        });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        return [];
    }
  }
};
