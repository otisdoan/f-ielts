-- Run this in Supabase SQL Editor to create the listening_tests table

-- Drop table if exists (caution: this will delete all data)
DROP TABLE IF EXISTS listening_tests CASCADE;

-- Create listening_tests table
CREATE TABLE listening_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  target_band NUMERIC,
  duration INT, -- in minutes
  audio_url TEXT NOT NULL, -- URL to audio file
  audio_duration INT, -- audio duration in seconds
  can_replay BOOLEAN DEFAULT false, -- whether audio can be replayed
  parts JSONB NOT NULL, -- Array of parts (Part 1, Part 2, etc.) with questions
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published tests
CREATE POLICY "Published listening tests are viewable by everyone"
  ON listening_tests FOR SELECT
  USING (is_published = true);

-- Policy: Admins can view all tests (including drafts)
CREATE POLICY "Admins can view all listening tests"
  ON listening_tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert tests
CREATE POLICY "Admins can insert listening tests"
  ON listening_tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update tests
CREATE POLICY "Admins can update listening tests"
  ON listening_tests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete tests
CREATE POLICY "Admins can delete listening tests"
  ON listening_tests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for better performance
CREATE INDEX idx_listening_tests_published ON listening_tests(is_published);
CREATE INDEX idx_listening_tests_created_at ON listening_tests(created_at DESC);

-- Insert sample listening test
INSERT INTO listening_tests (
  title,
  target_band,
  duration,
  audio_url,
  audio_duration,
  can_replay,
  parts,
  is_published
) VALUES (
  'Practice Test #04 - Accommodation Booking',
  6.5,
  30,
  '/audio/practice-04.mp3',
  252,
  false,
  '[
    {
      "partNumber": 1,
      "title": "Part 1: Questions 1-10",
      "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      "context": {
        "title": "Accommodation Booking Form",
        "prefilledData": {
          "Customer Name": "Michael O''Neill"
        }
      },
      "questions": [
        {
          "id": "q1",
          "questionNumber": 1,
          "type": "fill-in-blank",
          "label": "Arrival Date:",
          "correctAnswer": "15 June"
        },
        {
          "id": "q2",
          "questionNumber": 2,
          "type": "fill-in-blank",
          "label": "Room Type:",
          "correctAnswer": "double room"
        },
        {
          "id": "q3",
          "questionNumber": 3,
          "type": "fill-in-blank",
          "label": "Number of Nights:",
          "correctAnswer": "5"
        },
        {
          "id": "q4",
          "questionNumber": 4,
          "type": "multiple-choice",
          "text": "What does the speaker say about the breakfast service?",
          "options": [
            "It is served until 10:30 AM daily.",
            "It is included in the base room price.",
            "It must be booked 24 hours in advance."
          ],
          "correctAnswer": "B"
        },
        {
          "id": "q5",
          "questionNumber": 5,
          "type": "multiple-choice",
          "text": "What special request did the customer make?",
          "options": [
            "A room with a view",
            "Ground floor access",
            "Extra pillows"
          ],
          "correctAnswer": "B"
        },
        {
          "id": "q6",
          "questionNumber": 6,
          "type": "fill-in-blank",
          "label": "Total Cost:",
          "correctAnswer": "£450"
        },
        {
          "id": "q7",
          "questionNumber": 7,
          "type": "fill-in-blank",
          "label": "Payment Method:",
          "correctAnswer": "credit card"
        },
        {
          "id": "q8",
          "questionNumber": 8,
          "type": "fill-in-blank",
          "label": "Contact Number:",
          "correctAnswer": "07700 900123"
        },
        {
          "id": "q9",
          "questionNumber": 9,
          "type": "fill-in-blank",
          "label": "Email:",
          "correctAnswer": "michael.oneill@email.com"
        },
        {
          "id": "q10",
          "questionNumber": 10,
          "type": "multiple-choice",
          "text": "When will the booking confirmation be sent?",
          "options": [
            "Within 24 hours",
            "Immediately",
            "Within 2-3 business days"
          ],
          "correctAnswer": "A"
        }
      ]
    }
  ]'::jsonb,
  true
);
