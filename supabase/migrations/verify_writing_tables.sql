-- Verification script for writing prompts tables
-- Run this to check if your tables are set up correctly

-- Check if tables exist
select
  schemaname,
  tablename,
  tableowner
from pg_tables
where schemaname = 'public'
  and tablename in ('writing_prompts', 'writing_submissions', 'writing_feedback')
order by tablename;

-- Check columns for writing_prompts
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'writing_prompts'
order by ordinal_position;

-- Check RLS is enabled
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('writing_prompts', 'writing_submissions', 'writing_feedback');

-- Check policies
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('writing_prompts', 'writing_submissions', 'writing_feedback')
order by tablename, policyname;

-- Check indexes
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('writing_prompts', 'writing_submissions', 'writing_feedback')
order by tablename, indexname;

-- Check triggers
select
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
from information_schema.triggers
where trigger_schema = 'public'
  and event_object_table in ('writing_prompts', 'writing_submissions', 'writing_feedback')
order by event_object_table, trigger_name;

-- Count existing data
  select
    'writing_prompts' as table_name,
    count(*) as row_count
  from writing_prompts
union all
  select
    'writing_submissions' as table_name,
    count(*) as row_count
  from writing_submissions
union all
  select
    'writing_feedback' as table_name,
    count(*) as row_count
  from writing_feedback;
