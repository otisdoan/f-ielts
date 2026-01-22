-- Run this in Supabase SQL Editor to create the reading_tests table

-- Drop table if exists (caution: this will delete all data)
DROP TABLE IF EXISTS reading_tests CASCADE;

-- Create reading_tests table
CREATE TABLE reading_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  target_band NUMERIC,
  duration INT, -- in minutes
  passage_content TEXT NOT NULL, -- HTML/Rich text content
  questions JSONB NOT NULL, -- Array of questions with different types
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reading_tests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published tests
CREATE POLICY "Published tests are viewable by everyone"
  ON reading_tests FOR SELECT
  USING (is_published = true);

-- Policy: Admins can view all tests (including drafts)
CREATE POLICY "Admins can view all tests"
  ON reading_tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert tests
CREATE POLICY "Admins can insert tests"
  ON reading_tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update tests
CREATE POLICY "Admins can update tests"
  ON reading_tests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete tests
CREATE POLICY "Admins can delete tests"
  ON reading_tests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for better performance
CREATE INDEX idx_reading_tests_published ON reading_tests(is_published);
CREATE INDEX idx_reading_tests_created_at ON reading_tests(created_at DESC);
