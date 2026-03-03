-- Create speaking_topics table
create table
if not exists public.speaking_topics
(
  id uuid primary key default gen_random_uuid
(),
  part int not null check
(part in
(1, 2, 3)),
  title text not null,
  description text not null,
  difficulty text not null check
(difficulty in
('Easy', 'Medium', 'Hard')),
  category text not null,
  preparation_time int default 0,
  speaking_time int default 120,
  tips text[],
  sample_answer text,
  status text not null default 'draft' check
(status in
('draft', 'published')),
  created_at timestamp
with time zone default now
(),
  updated_at timestamp
with time zone default now
(),
  created_by uuid references auth.users
(id)
);

-- Add indexes for better query performance
create index
if not exists idx_speaking_topics_part on public.speaking_topics
(part);
create index
if not exists idx_speaking_topics_difficulty on public.speaking_topics
(difficulty);
create index
if not exists idx_speaking_topics_status on public.speaking_topics
(status);
create index
if not exists idx_speaking_topics_created_at on public.speaking_topics
(created_at desc);

-- Enable Row Level Security
alter table public.speaking_topics enable row level security;

-- Policy: Anyone can read published topics
create policy "Anyone can view published speaking topics"
  on public.speaking_topics
  for
select
    using (status = 'published' or auth.role() = 'authenticated');

-- Policy: Authenticated users can create topics
create policy "Authenticated users can create speaking topics"
  on public.speaking_topics
  for
insert
  to authenticated
  with check (
true);

-- Policy: Users can update their own topics or admins can update any
create policy "Users can update their own speaking topics"
  on public.speaking_topics
  for
update
  to authenticated
  using (created_by = auth.uid() or auth.role() = 'service_role');

-- Policy: Users can delete their own topics or admins can delete any
create policy "Users can delete their own speaking topics"
  on public.speaking_topics
  for
delete
  to authenticated
  using (created_by = auth.uid() or auth.role() = 'service_role');

-- Create function to auto-update updated_at timestamp
create or replace function public.handle_updated_at
()
returns trigger as $$
begin
  new.updated_at = now
();
return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_speaking_topics_updated_at
  before
update on public.speaking_topics
  for each row
execute
function public.handle_updated_at
();

-- Insert sample data
insert into public.speaking_topics
    (part, title, description, difficulty, category, preparation_time, speaking_time, tips, status)
values
    (1, 'Work and Studies', 'Let''s talk about what you do. Do you work or are you a student? What do you enjoy most about your work/studies?', 'Easy', 'Personal', 0, 180, array
['Be natural and honest', 'Use present tenses', 'Give reasons for your answers'], 'published'),
(1, 'Hometown and Home', 'Let''s talk about where you live. Can you describe your hometown? What do you like most about living there?', 'Easy', 'Personal', 0, 180, array['Describe specific features', 'Compare past and present', 'Express personal feelings'], 'published'),
(2, 'Describe a book you recently read', 'You should say: what the book is, why you chose it, what it is about, and explain why you liked or disliked it.', 'Medium', 'Objects', 60, 120, array['Use connectors like "Moreover" or "On the other hand"', 'Don''t be afraid of brief pauses', 'Vary your tone to sound more natural'], 'published'),
(2, 'Describe a memorable journey', 'You should say: where you went, who you went with, what you did there, and explain why it was memorable.', 'Medium', 'Experience', 60, 120, array['Use past tenses consistently', 'Include sensory details', 'Build up to the memorable moment'], 'published'),
(2, 'Describe a person who influenced you', 'You should say: who this person is, how you know them, what they did, and explain how they influenced you.', 'Medium', 'People', 60, 120, array['Give specific examples', 'Show the impact clearly', 'Use descriptive adjectives'], 'published'),
(3, 'Technology and Society', 'Let''s discuss technology in more depth. How has technology changed the way people communicate? Do you think these changes are positive or negative?', 'Hard', 'Abstract', 0, 240, array['Consider multiple perspectives', 'Use complex sentence structures', 'Provide specific examples'], 'published'),
(3, 'Education System', 'Let''s consider education. What do you think are the most important qualities of a good teacher? How has education changed in your country?', 'Hard', 'Abstract', 0, 240, array['Compare and contrast ideas', 'Use conditional sentences', 'Support opinions with reasoning'], 'published');
