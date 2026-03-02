-- Run this in Supabase SQL Editor to create the speaking_prompts table

-- Drop table if exists (caution: this will delete all data)
DROP TABLE IF EXISTS speaking_prompts CASCADE;

-- Create speaking_prompts table
CREATE TABLE speaking_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  part INT NOT NULL, -- 1, 2, or 3
  topic TEXT NOT NULL,
  prompt_text TEXT NOT NULL, -- Main question/topic description
  bullet_points TEXT[], -- For Part 2: "You should say..." points
  follow_up_questions TEXT[], -- For Part 3: Discussion questions
  preparation_time INT DEFAULT 60, -- In seconds (usually 60 for Part 2, 0 for others)
  speaking_time INT DEFAULT 120, -- In seconds (recommended speaking duration)
  tips TEXT[], -- Speaking tips for this prompt
  target_band NUMERIC DEFAULT 6.5,
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE speaking_prompts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published prompts
CREATE POLICY "Published speaking prompts are viewable by everyone"
  ON speaking_prompts FOR SELECT
  USING (is_published = true);

-- Policy: Admins can view all prompts (including drafts)
CREATE POLICY "Admins can view all speaking prompts"
  ON speaking_prompts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert prompts
CREATE POLICY "Admins can insert speaking prompts"
  ON speaking_prompts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update prompts
CREATE POLICY "Admins can update speaking prompts"
  ON speaking_prompts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete prompts
CREATE POLICY "Admins can delete speaking prompts"
  ON speaking_prompts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_speaking_prompts_published ON speaking_prompts(is_published);
CREATE INDEX idx_speaking_prompts_part ON speaking_prompts(part);
CREATE INDEX idx_speaking_prompts_created_at ON speaking_prompts(created_at DESC);

-- Insert sample speaking prompts

-- Part 1: Introduction & Interview
INSERT INTO speaking_prompts (
  title,
  part,
  topic,
  prompt_text,
  bullet_points,
  follow_up_questions,
  preparation_time,
  speaking_time,
  tips,
  target_band,
  is_published
) VALUES (
  'Part 1: Hometown & Hobbies',
  1,
  'Introduction',
  'The examiner will ask you questions about yourself and familiar topics.',
  ARRAY[
    'What is your hometown like?',
    'Do you enjoy living there?',
    'What do you like to do in your free time?',
    'How long have you had this hobby?'
  ],
  NULL,
  0,
  240,
  ARRAY[
    'Keep answers concise but complete (30-60 seconds each)',
    'Use present simple for habits and routines',
    'Show enthusiasm when talking about hobbies',
    'Add examples to support your answers'
  ],
  6.0,
  true
);

-- Part 2: Individual Long Turn
INSERT INTO speaking_prompts (
  title,
  part,
  topic,
  prompt_text,
  bullet_points,
  follow_up_questions,
  preparation_time,
  speaking_time,
  tips,
  target_band,
  is_published
) VALUES (
  'Part 2: Describe a Book You Recently Read',
  2,
  'Books & Reading',
  'Describe a book you recently read.',
  ARRAY[
    'what the book is',
    'why you chose it',
    'what it is about',
    'and explain why you liked or disliked it'
  ],
  NULL,
  60,
  120,
  ARRAY[
    'Use connectors like "Moreover" or "On the other hand" to improve flow',
    'Don''t be afraid of brief pauses; it''s better than saying "uhm" repeatedly',
    'Vary your tone to sound more natural and engaged with the topic',
    'Try to speak for the full 2 minutes - practice helps!'
  ],
  7.0,
  true
);

-- Part 2: Another topic
INSERT INTO speaking_prompts (
  title,
  part,
  topic,
  prompt_text,
  bullet_points,
  follow_up_questions,
  preparation_time,
  speaking_time,
  tips,
  target_band,
  is_published
) VALUES (
  'Part 2: Describe a Place You Want to Visit',
  2,
  'Travel',
  'Describe a place you would like to visit in the future.',
  ARRAY[
    'where this place is',
    'how you learned about it',
    'what you would do there',
    'and explain why you want to visit this place'
  ],
  NULL,
  60,
  120,
  ARRAY[
    'Use future forms correctly: "I would like to...", "I plan to..."',
    'Describe the place vividly using adjectives',
    'Explain personal reasons for wanting to visit',
    'Structure: Where → How you know → Activities → Why'
  ],
  7.0,
  true
);

-- Part 3: Two-way Discussion
INSERT INTO speaking_prompts (
  title,
  part,
  topic,
  prompt_text,
  bullet_points,
  follow_up_questions,
  preparation_time,
  speaking_time,
  tips,
  target_band,
  is_published
) VALUES (
  'Part 3: Discussion on Reading & Literature',
  3,
  'Books & Reading',
  'Now let''s discuss reading habits and literature in general.',
  NULL,
  ARRAY[
    'Do you think people read less nowadays compared to the past?',
    'What are the advantages of reading books over watching movies?',
    'Should governments invest more in public libraries?',
    'How has technology changed the way people read?',
    'Do you think traditional books will disappear in the future?'
  ],
  0,
  300,
  ARRAY[
    'Give developed answers (40-60 seconds each)',
    'Use advanced vocabulary and complex sentences',
    'Consider different perspectives: "On one hand... On the other hand..."',
    'Support opinions with examples or reasons',
    'It''s okay to say "That''s an interesting question" to buy thinking time'
  ],
  7.5,
  true
);

-- Part 2: Describe a memorable event
INSERT INTO speaking_prompts (
  title,
  part,
  topic,
  prompt_text,
  bullet_points,
  follow_up_questions,
  preparation_time,
  speaking_time,
  tips,
  target_band,
  is_published
) VALUES (
  'Part 2: Describe a Memorable Event',
  2,
  'Life Events',
  'Describe a memorable event from your childhood.',
  ARRAY[
    'when this event happened',
    'where it took place',
    'who was there with you',
    'and explain why it was memorable'
  ],
  NULL,
  60,
  120,
  ARRAY[
    'Use past tenses correctly (past simple, past continuous, past perfect)',
    'Include sensory details: what you saw, heard, felt',
    'Show emotion in your voice when describing feelings',
    'Finish with a reflection on why it matters to you now'
  ],
  6.5,
  true
);
