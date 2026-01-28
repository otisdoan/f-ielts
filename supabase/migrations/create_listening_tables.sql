-- Listening Module: listening_tests, listening_question_groups, listening_questions
-- Run in Supabase SQL Editor. Create bucket "listening-audio" (and optionally "listening-images") in Dashboard > Storage.

-- listening_tests
CREATE TABLE IF NOT EXISTS listening_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  audio_url text,
  transcript text,
  source text,
  section_type text NOT NULL DEFAULT 'full',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_listening_tests_source ON listening_tests(source);
CREATE INDEX IF NOT EXISTS idx_listening_tests_section_type ON listening_tests(section_type);
CREATE INDEX IF NOT EXISTS idx_listening_tests_status ON listening_tests(status);
CREATE INDEX IF NOT EXISTS idx_listening_tests_created_at ON listening_tests(created_at DESC);

-- listening_question_groups
CREATE TABLE IF NOT EXISTS listening_question_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id uuid NOT NULL REFERENCES listening_tests(id) ON DELETE CASCADE,
  instruction text,
  image_url text,
  group_type text NOT NULL CHECK (group_type IN ('gap_fill', 'multiple_choice_one', 'multiple_choice_many', 'matching', 'map_labeling')),
  order_index int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_listening_question_groups_test_id ON listening_question_groups(test_id);

-- listening_questions
CREATE TABLE IF NOT EXISTS listening_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES listening_question_groups(id) ON DELETE CASCADE,
  question_number int NOT NULL,
  question_text text,
  options jsonb,
  correct_answer text,
  explanation text
);

CREATE INDEX IF NOT EXISTS idx_listening_questions_group_id ON listening_questions(group_id);

-- RLS
ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_question_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_questions ENABLE ROW LEVEL SECURITY;

-- listening_tests: admins full access; others can select published or own
CREATE POLICY "listening_tests_select" ON listening_tests FOR SELECT
  USING (
    status = 'published' OR created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "listening_tests_insert" ON listening_tests FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_tests_update" ON listening_tests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_tests_delete" ON listening_tests FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- listening_question_groups: same as tests (via test_id)
CREATE POLICY "listening_question_groups_select" ON listening_question_groups FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM listening_tests t WHERE t.id = test_id AND (t.status = 'published' OR t.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')))
  );
CREATE POLICY "listening_question_groups_insert" ON listening_question_groups FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_question_groups_update" ON listening_question_groups FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_question_groups_delete" ON listening_question_groups FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- listening_questions: via group -> test
CREATE POLICY "listening_questions_select" ON listening_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listening_question_groups g
      JOIN listening_tests t ON t.id = g.test_id
      WHERE g.id = group_id AND (t.status = 'published' OR t.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );
CREATE POLICY "listening_questions_insert" ON listening_questions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_questions_update" ON listening_questions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "listening_questions_delete" ON listening_questions FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
