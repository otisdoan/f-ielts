-- Migration: Add advanced categorization fields to writing_prompts table
-- Run this in Supabase SQL Editor
-- add_writing_categorization.sql
-- Add new columns
ALTER TABLE writing_prompts 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS sub_type TEXT,
  ADD COLUMN IF NOT EXISTS guide_tips JSONB;

-- Migrate existing data: task_type → category
UPDATE writing_prompts 
SET category = task_type 
WHERE category IS NULL AND task_type IS NOT NULL;

-- Create indexes for filtering performance
CREATE INDEX IF NOT EXISTS idx_writing_prompts_category ON writing_prompts(category);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_source ON writing_prompts(source);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_sub_type ON writing_prompts(sub_type);

-- Optional: Add check constraint for category values
ALTER TABLE writing_prompts 
  ADD CONSTRAINT check_category_values 
  CHECK (category IS NULL OR category IN ('task1', 'task2', 'builder'));
