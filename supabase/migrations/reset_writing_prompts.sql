-- ⚠️ WARNING: This will delete all writing prompts, submissions, and feedback data!
-- Only run this if you want to completely reset the writing feature.

-- Drop tables in reverse order (respecting foreign keys)
drop table if exists writing_feedback
cascade;
drop table if exists writing_submissions
cascade;
drop table if exists writing_prompts
cascade;

-- Drop the trigger function if no other tables are using it
-- drop function if exists update_updated_at_column() cascade;

-- Now you can run create_writing_prompts.sql to recreate everything fresh
