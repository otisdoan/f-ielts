-- Tạo profiles cho tất cả users chưa có profile
-- Chạy query này trong Supabase SQL Editor

-- Bước 1: Xem tất cả users trong hệ thống
select id, email, created_at from auth.users order by created_at desc;

-- Bước 2: Tạo profiles cho tất cả users chưa có profile
insert into public.profiles (id, full_name, role, avatar_url)
select 
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  'student',
  null
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;

-- Bước 3: Kiểm tra profiles đã tạo thành công
select p.id, p.full_name, p.role, u.email 
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at desc;
