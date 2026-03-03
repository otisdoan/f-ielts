-- Combined migration to fix avatar upload RLS issues
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- PART 1: Fix Profiles RLS Policies
-- ============================================

-- Drop existing policies (both old and new names)
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create better RLS policies
create policy "Users can insert their own profile" on profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create function to automatically create profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to automatically create profile when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;

-- ============================================
-- PART 2: Setup Storage Bucket and Policies
-- ============================================

-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Drop existing policies if they exist
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

-- Allow public access to avatar images
create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = 'avatars'
);

-- Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
);

-- Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
);

-- ============================================
-- PART 3: Create profiles for existing users
-- ============================================

-- Insert profiles for any existing users who don't have one
insert into public.profiles (id, full_name, avatar_url, role)
select 
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', ''),
  coalesce(au.raw_user_meta_data->>'avatar_url', ''),
  'student'
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
)
on conflict (id) do nothing;
