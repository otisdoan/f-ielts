# Speaking Admin Module - Setup Guide

## ✅ Các tính năng đã hoàn thành

### 1. **Admin Speaking Management Pages**
Đã tạo đầy đủ các trang quản lý đề thi Speaking:

- **[/app/admin/speaking/page.tsx](app/admin/speaking/page.tsx)** - Danh sách tất cả đề Speaking
  - Bảng hiển thị tất cả topics
  - Filter theo Part (1, 2, 3)
  - Filter theo độ khó (Easy, Medium, Hard)
  - Filter theo trạng thái (Draft, Published)
  - Nút Edit và Delete cho từng topic
  - Toggle status (Publish/Unpublish)

- **[/app/admin/speaking/new/page.tsx](app/admin/speaking/new/page.tsx)** - Thêm đề mới
  - Form đầy đủ để tạo topic mới
  - Chọn Part (1, 2, 3)
  - Nhập tiêu đề và mô tả
  - Chọn category và difficulty
  - Cài đặt thời gian chuẩn bị và nói
  - Thêm tips (có thể nhiều tips)
  - Nhập sample answer (optional)
  - Chọn status (Draft/Published)

- **[/app/admin/speaking/[id]/page.tsx](app/admin/speaking/[id]/page.tsx)** - Chỉnh sửa đề
  - Load dữ liệu topic hiện tại
  - Form giống như Add New
  - Nút Delete topic
  - Cập nhật thông tin

### 2. **Speaking Service**
- **[/services/speaking.service.ts](services/speaking.service.ts)**
  - `getTopics()` - Lấy danh sách topics (có filter)
  - `getTopicById()` - Lấy chi tiết 1 topic
  - `createTopic()` - Tạo topic mới
  - `updateTopic()` - Cập nhật topic
  - `deleteTopic()` - Xóa topic
  - `publishTopic()` - Publish topic
  - `unpublishTopic()` - Unpublish topic

### 3. **Database Migration**
- **[/supabase/migrations/create_speaking_topics.sql](supabase/migrations/create_speaking_topics.sql)**
  - Tạo bảng `speaking_topics`
  - Các indexes để optimize query
  - Row Level Security policies
  - Trigger auto-update `updated_at`
  - 7 sample topics (Part 1, 2, 3)

### 4. **Constants & Types**
- **[/lib/constants/speaking.ts](lib/constants/speaking.ts)**
  - `SPEAKING_PARTS` - Cấu hình 3 parts
  - `SPEAKING_TOPICS` - Danh sách chủ đề
  - `DIFFICULTY_LEVELS` - Easy, Medium, Hard
  - `SPEAKING_CATEGORIES` - Personal, People, Places, Objects, Events, Experience, Abstract
  - `ASSESSMENT_CRITERIA` - 4 tiêu chí chấm điểm IELTS

### 5. **Admin Navigation**
- Đã cập nhật **[/components/admin/Sidebar.tsx](components/admin/Sidebar.tsx)**
  - Thêm menu "Speaking Management" với icon microphone
  - Link đến `/admin/speaking`

## 🚀 Cách sử dụng

### Bước 1: Chạy Database Migration

Bạn cần chạy migration để tạo bảng `speaking_topics`:

**Nếu dùng Supabase CLI:**
```bash
# Trong terminal
supabase db push
```

**Hoặc chạy SQL trực tiếp trong Supabase Dashboard:**
1. Vào Supabase Dashboard → SQL Editor
2. Copy toàn bộ nội dung từ file `supabase/migrations/create_speaking_topics.sql`
3. Paste vào editor và chạy

### Bước 2: Truy cập Admin Panel

1. Đăng nhập vào admin panel: `/admin`
2. Click vào "Speaking Management" trong sidebar
3. Bạn sẽ thấy 7 sample topics đã được tạo sẵn

### Bước 3: Thêm đề Speaking mới

1. Trong trang Speaking Management, click "Add New Topic"
2. Điền thông tin:
   - **Part**: Chọn 1, 2, hoặc 3
   - **Title**: Tiêu đề đề thi (VD: "Describe a book you recently read")
   - **Description**: Mô tả chi tiết câu hỏi
   - **Category**: Chọn loại (Personal, Objects, Experience, v.v.)
   - **Difficulty**: Easy, Medium, hoặc Hard
   - **Preparation Time**: Chỉ dành cho Part 2 (mặc định 60 giây)
   - **Speaking Time**: Thời gian nói (mặc định 120 giây)
   - **Tips**: Thêm các tips hữu ích (có thể thêm nhiều)
   - **Sample Answer**: Câu trả lời mẫu (optional)
   - **Status**: Draft hoặc Published
3. Click "Create Topic"

### Bước 4: Quản lý đề

- **Chỉnh sửa**: Click icon ✏️ edit
- **Xóa**: Click icon 🗑️ delete
- **Publish/Unpublish**: Click vào badge status để toggle
- **Filter**: Dùng dropdown để lọc theo Part, Difficulty, Status

## 📊 Database Schema

```sql
speaking_topics (
  id: uuid (primary key)
  part: int (1, 2, hoặc 3)
  title: text
  description: text
  difficulty: text (Easy, Medium, Hard)
  category: text
  preparation_time: int (seconds)
  speaking_time: int (seconds)
  tips: text[] (array)
  sample_answer: text
  status: text (draft, published)
  created_at: timestamp
  updated_at: timestamp
  created_by: uuid (foreign key to users)
)
```

## 🔗 Integration với User-Facing Pages

Module admin này đã được integrate với:
- **[/app/practice/speaking/page.tsx](app/practice/speaking/page.tsx)** - Trang danh sách đề cho học viên
- **[/app/practice/speaking/[id]/page.tsx](app/practice/speaking/[id]/page.tsx)** - Trang luyện tập

Các đề Published trong admin sẽ tự động hiện trong trang practice của học viên.

## 🎯 Next Steps

### Đã implement:
✅ CRUD operations cho speaking topics  
✅ Filter và search  
✅ Status management (Draft/Published)  
✅ Database migration với sample data  
✅ Admin UI hoàn chỉnh  

### Chưa implement (có thể làm sau):
- [ ] Bulk import topics từ Excel/CSV
- [ ] Duplicate topic function
- [ ] Version history của topics
- [ ] Advanced search với keyword
- [ ] Export topics to PDF/JSON

## 🐛 Troubleshooting

**Lỗi: "Table 'speaking_topics' does not exist"**
- Chạy migration: `supabase db push` hoặc copy SQL từ migration file

**Lỗi: "Permission denied"**
- Kiểm tra RLS policies trong Supabase
- Đảm bảo user đã đăng nhập và có quyền admin

**Topics không hiện trong practice page**
- Kiểm tra status = 'published'
- Kiểm tra filter trong code practice page

## 📝 Tips

1. **Sample Data**: Migration đã tạo 7 topics mẫu để test
2. **Validation**: Form có basic validation (title, description required)
3. **Toast Messages**: Có thông báo success/error cho mọi action
4. **Responsive**: UI responsive, hoạt động tốt trên mobile
5. **Consistent Design**: Giữ đúng design system của F-IELTS

---

Chúc bạn sử dụng module thành công! 🎉
