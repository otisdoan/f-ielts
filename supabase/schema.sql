
-- Profiles table
create table profiles
(
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role text default 'student',
  -- 'student', 'admin', 'tutor'
  target_band numeric,
  created_at timestamptz default now()
);

-- Courses table
create table courses
(
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  level text,
  thumbnail text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Lessons table
create table lessons
(
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  content text,
  -- Markdown or HTML content
  order_index int,
  created_at timestamptz default now()
);

-- Practice Tests table (Mock Tests or Skill Tests)
create table practice_tests
(
  id uuid default gen_random_uuid() primary key,
  title text not null,
  skill text,
  -- 'Reading', 'Listening', 'Writing', 'Speaking', 'Full'
  duration int,
  -- in minutes
  difficulty text,
  -- 'Beginner', 'Intermediate', 'Advanced'
  type text,
  -- 'Academic', 'General'
  target_band numeric,
  created_at timestamptz default now()
);

-- Reading Tests table (specific for reading practice)
create table reading_tests
(
  id uuid default gen_random_uuid() primary key,
  title text not null,
  target_band numeric,
  duration int,
  -- in minutes
  passage_content text not null,
  -- HTML/Rich text content
  questions jsonb not null,
  -- Array of questions with different types
  created_by uuid references auth.users(id),
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reading Tests table (Detailed structure for reading tests)
create table reading_tests
(
  id uuid default gen_random_uuid() primary key,
  title text not null,
  target_band numeric,
  duration int,
  -- in minutes
  passage_content jsonb not null,
  -- Rich text content with formatting
  questions jsonb not null,
  -- Array of questions with different types
  status text default 'draft',
  -- 'draft', 'published', 'archived'
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Questions table
create table questions
(
  id uuid default gen_random_uuid() primary key,
  test_id uuid references practice_tests(id) on delete cascade,
  type text,
  -- 'MultipleChoice', 'TrueFalse', 'FillGap'
  content text,
  -- Question text or passage reference
  options jsonb,
  -- e.g. ["Option A", "Option B"]
  correct_answer text,
  order_index int,
  created_at timestamptz default now()
);

-- Reading Test Attempts
create table reading_test_attempts
(
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  test_id uuid references reading_tests(id) on delete cascade,
  answers jsonb not null,
  -- User's answers
  score numeric,
  total_correct int,
  total_questions int,
  time_spent int,
  -- in seconds
  submitted_at timestamptz default now()
);

-- Test Attempts / Results
create table test_attempts
(
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  test_id uuid references practice_tests(id) on delete cascade,
  score numeric,
  answers jsonb,
  -- User's answers
  submitted_at timestamptz default now()
);

-- Progress Tracking
create table progress
(
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  completed_lessons int,
  updated_at timestamptz default now()
);

-- RLS Policies (Simple example)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() =
id);
create policy "Users can update own profile." on profiles for
update using (auth.uid()
= id);

alter table test_attempts enable row level security;
create policy "Users can view own attempts" on test_attempts for
select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on test_attempts for
insert with check (auth.uid() =
user_id);

-- RLS for reading_tests
alter table reading_tests enable row level security;
create policy "Everyone can view published reading tests" on reading_tests for
select using (status = 'published' or auth.uid() = created_by);
create policy "Admins can insert reading tests" on reading_tests for
insert with check
  (
  exists (select 1
from profiles
where id = auth.uid() and role = 'admin')
);
create policy "Admins can update reading tests" on reading_tests for
update using (
  exists (select 1
from profiles
where id = auth.uid() and role = 'admin')
);

-- RLS for reading_test_attempts
alter table reading_test_attempts enable row level security;
create policy "Users can view own reading attempts" on reading_test_attempts for
select using (auth.uid() = user_id);
create policy "Users can insert own reading attempts" on reading_test_attempts for
insert with check (auth.uid() =
user_id);

