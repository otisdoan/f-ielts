import { createClient } from "@/lib/supabase/client";

export type ListeningTest = {
  id: string;
  title: string;
  audio_url: string | null;
  transcript: string | null;
  source: string | null;
  section_type: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  question_groups?: ListeningQuestionGroup[];
  question_count?: number;
};

export type ListeningQuestionGroup = {
  id: string;
  test_id: string;
  instruction: string | null;
  image_url: string | null;
  group_type: "gap_fill" | "multiple_choice_one" | "multiple_choice_many" | "matching" | "map_labeling";
  order_index: number;
  questions?: ListeningQuestion[];
};

export type ListeningQuestion = {
  id: string;
  group_id: string;
  question_number: number;
  question_text: string | null;
  options: string[] | Record<string, string> | null; // array for MC, object for matching
  correct_answer: string | string[] | Record<string, string> | null; // string for single, array for MC many, object for matching
  explanation: string | null;
};

const TESTS_TABLE = "listening_tests";
const GROUPS_TABLE = "listening_question_groups";
const QUESTIONS_TABLE = "listening_questions";

const STORAGE_BUCKET_AUDIO = "listening-audio";
const STORAGE_BUCKET_IMAGES = "listening-images";

export const ListeningService = {
  async getTests(filters?: { source?: string; section_type?: string }) {
    const supabase = createClient();
    try {
      let query = supabase
        .from(TESTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.source) query = query.eq("source", filters.source);
      if (filters?.section_type) query = query.eq("section_type", filters.section_type);

      const { data: tests, error } = await query;
      if (error) throw error;
      if (!tests?.length) return [] as ListeningTest[];

      const testIds = tests.map((t) => t.id);
      const { data: groupRows } = await supabase
        .from(GROUPS_TABLE)
        .select("id, test_id")
        .in("test_id", testIds);
      const groupIds = (groupRows || []).map((g) => g.id);
      if (groupIds.length === 0) {
        return tests.map((t) => ({ ...t, question_count: 0 })) as ListeningTest[];
      }
      const { data: questionRows } = await supabase
        .from(QUESTIONS_TABLE)
        .select("group_id")
        .in("group_id", groupIds);
      const countByTestId: Record<string, number> = {};
      const groupIdToTestId = new Map((groupRows || []).map((g) => [g.id, g.test_id]));
      (questionRows || []).forEach((q) => {
        const tid = groupIdToTestId.get(q.group_id);
        if (tid) countByTestId[tid] = (countByTestId[tid] || 0) + 1;
      });
      return tests.map((t) => ({
        ...t,
        question_count: countByTestId[t.id] || 0,
      })) as ListeningTest[];
    } catch (err) {
      console.error("Error fetching listening tests:", err);
      return [];
    }
  },

  async getTestById(id: string) {
    const supabase = createClient();
    try {
      const { data: test, error: testError } = await supabase
        .from(TESTS_TABLE)
        .select("*")
        .eq("id", id)
        .single();
      if (testError || !test) return null;

      const { data: groups, error: groupsError } = await supabase
        .from(GROUPS_TABLE)
        .select("*")
        .eq("test_id", id)
        .order("order_index", { ascending: true });
      if (groupsError) throw groupsError;

      const groupIds = (groups || []).map((g) => g.id);
      if (groupIds.length === 0) {
        return { ...test, question_groups: [] } as ListeningTest;
      }

      const { data: questions, error: questionsError } = await supabase
        .from(QUESTIONS_TABLE)
        .select("*")
        .in("group_id", groupIds)
        .order("question_number", { ascending: true });
      if (questionsError) throw questionsError;

      const questionsByGroup = new Map<string, ListeningQuestion[]>();
      (questions || []).forEach((q) => {
        const list = questionsByGroup.get(q.group_id) || [];
        list.push(q as ListeningQuestion);
        questionsByGroup.set(q.group_id, list);
      });

      const question_groups = (groups || []).map((g) => ({
        ...g,
        questions: questionsByGroup.get(g.id) || [],
      })) as ListeningQuestionGroup[];

      return { ...test, question_groups } as ListeningTest;
    } catch (err) {
      console.error("Error fetching listening test:", err);
      return null;
    }
  },

  async createTest(payload: {
    title: string;
    audio_url?: string | null;
    transcript?: string | null;
    source?: string | null;
    section_type?: string;
    status?: "draft" | "published";
  }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from(TESTS_TABLE)
      .insert({
        title: payload.title,
        audio_url: payload.audio_url ?? null,
        transcript: payload.transcript ?? null,
        source: payload.source ?? null,
        section_type: payload.section_type ?? "full",
        status: payload.status ?? "draft",
        updated_at: new Date().toISOString(),
        created_by: user?.id ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  },

  async updateTest(
    id: string,
    payload: Partial<{
      title: string;
      audio_url: string | null;
      transcript: string | null;
      source: string | null;
      section_type: string;
      status: "draft" | "published";
    }>
  ) {
    const supabase = createClient();
    const { error } = await supabase
      .from(TESTS_TABLE)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
  },

  async deleteTest(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from(TESTS_TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  async saveGroups(
    testId: string,
    groups: (Omit<ListeningQuestionGroup, "id" | "test_id" | "questions"> & { id?: string; questions?: (Omit<ListeningQuestion, "id" | "group_id"> & { id?: string })[] })[]
  ) {
    const supabase = createClient();
    const { data: existingGroups } = await supabase
      .from(GROUPS_TABLE)
      .select("id")
      .eq("test_id", testId);
    const existingIds = (existingGroups || []).map((g) => g.id);
    if (existingIds.length > 0) {
      await supabase.from(QUESTIONS_TABLE).delete().in("group_id", existingIds);
      await supabase.from(GROUPS_TABLE).delete().eq("test_id", testId);
    }
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const { data: insertedGroup, error: groupError } = await supabase
        .from(GROUPS_TABLE)
        .insert({
          test_id: testId,
          instruction: g.instruction ?? null,
          image_url: g.image_url ?? null,
          group_type: g.group_type,
          order_index: g.order_index ?? i,
        })
        .select("id")
        .single();
      if (groupError) throw groupError;
      const groupId = insertedGroup.id;
      const questions = g.questions || [];
      for (let j = 0; j < questions.length; j++) {
        const q = questions[j];
        await supabase.from(QUESTIONS_TABLE).insert({
          group_id: groupId,
          question_number: q.question_number ?? j + 1,
          question_text: q.question_text ?? null,
          options: q.options ?? null,
          correct_answer:
            typeof q.correct_answer === "string"
              ? q.correct_answer
              : q.correct_answer != null
                ? JSON.stringify(q.correct_answer)
                : null,
          explanation: q.explanation ?? null,
        });
      }
    }
  },

  async uploadAudio(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "mp3";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_AUDIO)
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET_AUDIO).getPublicUrl(data.path);
    return urlData.publicUrl;
  },

  async uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_IMAGES)
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET_IMAGES).getPublicUrl(data.path);
    return urlData.publicUrl;
  },
};
