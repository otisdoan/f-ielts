-- Create writing_prompts table (if not exists)
create table
if not exists writing_prompts
(
  id uuid default gen_random_uuid
() primary key,
  title text not null,
  task_type text not null check
(task_type in
('task1', 'task2')),
  instruction text not null,
  question_text text,
  image_url text,
  sample_answer_json jsonb default '{}'::jsonb,
  created_by uuid references auth.users
(id),
  created_at timestamptz default now
(),
  updated_at timestamptz default now
()
);

-- Create writing_submissions table (if not exists)
create table
if not exists writing_submissions
(
  id uuid default gen_random_uuid
() primary key,
  user_id uuid references auth.users
(id) on
delete cascade not null,
  prompt_id uuid
references writing_prompts
(id) on
delete cascade not null,
  content text
not null,
  word_count int,
  time_spent int, -- in seconds
  status text default 'submitted' check
(status in
('draft', 'submitted', 'evaluated')),
  created_at timestamptz default now
(),
  updated_at timestamptz default now
()
);

-- Create writing_feedback table (if not exists)
create table
if not exists writing_feedback
(
  id uuid default gen_random_uuid
() primary key,
  submission_id uuid references writing_submissions
(id) on
delete cascade not null unique,
  overall_band numeric,
  task_achievement numeric,
  coherence_cohesion numeric,
  lexical_resource numeric,
  grammatical_range numeric,
  feedback_text text,
  suggestions jsonb
default '[]'::jsonb,
  evaluated_at timestamptz default now
()
);

-- Enable RLS
alter table writing_prompts enable row level security;
alter table writing_submissions enable row level security;
alter table writing_feedback enable row level security;

-- RLS Policies for writing_prompts (drop if exists first)
drop policy
if exists "Everyone can view writing prompts" on writing_prompts;
create policy "Everyone can view writing prompts" 
  on writing_prompts for
select
  using (true);

drop policy
if exists "Admins can insert writing prompts" on writing_prompts;
create policy "Admins can insert writing prompts" 
  on writing_prompts for
insert 
  with check
  (
  exists (
  sel
ct 1 from pro
where id = auth.uid() and role = 'admin'
    )
);

drop policy
if exists "Admins can update writing prompts" on writing_prompts;
create policy "Admins can update writing prompts" 
  on writing_prompts for
update 
  using (
    exists (
      select 1
from profiles
where id = auth.uid() and role = 'admin'
    )
);

drop policy
if exists "Admins can delete writing prompts" on writing_prompts;
create policy "Admins can delete writing prompts" 
  on writing_prompts for
delete 
  using (
    exists
(
      select 1
from profiles
where id = auth.uid() and role = 'admin'
    )
);

-- RLS Policies for writing_submissions (drop if exists first)
drop policy
if exists "Users can view own submissions" on writing_submissions;
create policy "Users can view own submissions" 
  on writing_submissions for
select
  using (auth.uid() = user_id);

drop policy
if exists "Users can insert own submissions" on writing_submissions;
create policy "Users can insert own submissions" 
  on writing_submissions for
insert 
  with check (auth.uid() =
user_id);

drop policy
if exists "Users can update own submissions" on writing_submissions;
create policy "Users can update own submissions" 
  on writing_submissions for
update 
  using (auth.uid()
= user_id);

-- RLS Policies for writing_feedback (drop if exists first)
drop policy
if exists "Users can view own feedback" on writing_feedback;
create policy "Users can view own feedback" 
  on writing_feedback for
select
  using (
    exists (
      select 1
  from writing_submissions
  where id = writing_feedback.submission_id
    and user_id = auth.uid()
    )
  );

drop policy
if exists "System can insert feedback" on writing_feedback;
create policy "System can insert feedback" 
  on writing_feedback for
insert 
  with check
  (true)
;

-- Create indexes for better performance (if not exists)
create index
if not exists idx_writing_prompts_task_type on writing_prompts
(task_type);
create index
if not exists idx_writing_prompts_created_at on writing_prompts
(created_at desc);
create index
if not exists idx_writing_submissions_user_id on writing_submissions
(user_id);
create index
if not exists idx_writing_submissions_prompt_id on writing_submissions
(prompt_id);
create index
if not exists idx_writing_submissions_status on writing_submissions
(status);
create index
if not exists idx_writing_feedback_submission_id on writing_feedback
(submission_id);

-- Add updated_at trigger function (create or replace)
create or replace function update_updated_at_column
()
returns trigger as $$
begin
  new.updated_at = now
();
return new;
end;
$$ language plpgsql;

-- Drop and recreate triggers
drop trigger if exists update_writing_prompts_updated_at
on writing_prompts;
create trigger update_writing_prompts_updated_at
  before
update on writing_prompts
  for each row
execute function update_updated_at_column
();

drop trigger if exists update_writing_submissions_updated_at
on writing_submissions;
create trigger update_writing_submissions_updated_at
  before
update on writing_submissions
  for each row
execute function update_updated_at_column
();
