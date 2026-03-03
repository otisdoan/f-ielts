# Hướng Dẫn Fix Lỗi Upload Avatar

## Lỗi: "new row violates row-level security policy"

Để fix lỗi này, bạn cần chạy 2 migrations trong Supabase.

## Cách 1: Chạy SQL Trực Tiếp (Khuyên dùng)

### Bước 1: Mở Supabase Dashboard
1. Truy cập: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (biểu tượng database bên trái)

### Bước 2: Chạy Migration 1 - Fix Profiles RLS

Click **New Query** và paste code sau:

```sql
-- Fix profiles RLS policies and add auto-creation trigger

-- Drop existing policies
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

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
```

Click **Run** (Ctrl + Enter)

### Bước 3: Chạy Migration 2 - Setup Storage

Click **New Query** lại và paste code sau:

```sql
-- Setup storage bucket and policies for avatars

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
```

Click **Run** (Ctrl + Enter)

### Bước 4: Fix Profile Hiện Tại (Nếu cần)

Nếu profile của user hiện tại chưa tồn tại, chạy query này (thay `YOUR_USER_ID` bằng ID của bạn):

```sql
-- Lấy user ID của bạn từ auth.users
select id, email from auth.users;

-- Sau đó insert profile (thay YOUR_USER_ID)
insert into public.profiles (id, full_name, role)
values ('YOUR_USER_ID', 'Your Name', 'student')
on conflict (id) do nothing;
```

## Cách 2: Sử dụng Supabase CLI

Nếu bạn có Supabase CLI:

```bash
# Install Supabase CLI (nếu chưa có)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Kiểm Tra

Sau khi chạy migrations:
1. Refresh trang settings
2. Thử upload avatar lại
3. Lỗi "row-level security policy" sẽ biến mất

## Troubleshooting

### Lỗi "relation does not exist"
- Đảm bảo bạn đã tạo table `profiles` trong schema.sql

### Lỗi "permission denied"
- Kiểm tra bạn có quyền admin trong Supabase project

### Vẫn lỗi sau khi chạy migrations
- Clear browser cache
- Logout và login lại
- Kiểm tra console.log để xem error message chi tiết
