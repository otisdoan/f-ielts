Đang đọc code trang edit listening để giải thích.


[2 tools called]


## Trang `/admin/listening/[id]` (Edit Listening Test)

Đây là **trang chỉnh sửa một bài thi Listening** trong admin. URL `http://localhost:3000/admin/listening/1a65d86a-f86d-4149-a201-eeb761b6d8c8` mở bài thi có `id = 1a65d86a-f86d-4149-a201-eeb761b6d8c8`.

---

### Luồng hoạt động

1. **Khi vào trang:** Lấy `id` từ URL, gọi `ListeningService.getTestById(id)` để load test (metadata + question groups + questions).
2. **Nếu không tìm thấy:** Redirect về `/admin/listening`.
3. **Nếu có:** Hiển thị form chỉnh sửa với 2 tab: **Metadata** và **Question Builder**.

---

### Cấu trúc giao diện

- **Breadcrumb:** Home → Listening Management → [Tên test].
- **Hai tab:**
  - **Metadata:** Thông tin chung của bài thi.
  - **Question Builder:** Soạn nhóm câu hỏi và từng câu.
- **Thanh audio cố định (sticky):** Nếu đã có `audio_url`, một player nằm cố định ở **dưới cùng** màn hình để vừa nghe vừa soạn câu hỏi.
- **Nút hành động:** Save All, Save metadata only, Back to list.

---

### Tab Metadata

- **Test Title** (bắt buộc).
- **Source:** Dropdown (YouPass Collect, Actual Tests, Cambridge, Forecast, Custom).
- **Test Type:** Full Test (4 Parts) hoặc Section 1–4.
- **Audio:**
  - Ô nhập URL (dán link Google Drive/server).
  - Nút “Upload MP3/WAV” → upload lên Supabase bucket `listening-audio`, lấy URL gán vào form.
- **Transcript:** Textarea lớn cho lời thoại.
- **Status:** Draft hoặc Published.

Lưu tab này: **Save metadata only** (chỉ cập nhật test), hoặc **Save All** (metadata + toàn bộ groups/questions).

---

### Tab Question Builder

- **Danh sách Question Groups:** Mỗi group gồm:
  - **Instruction:** Hướng dẫn (vd: “Complete the notes below. Write ONE WORD…”).
  - **Question Type:** Gap Filling, Multiple Choice (One/Many), Matching, Map/Diagram Labeling.
  - **Image (tùy chọn):** Cho Map/Matching; upload lên bucket `listening-images` hoặc dùng URL.
  - **Danh sách câu hỏi** trong group, tùy loại:
    - **Gap Filling:** Câu có chỗ trống (vd `[1]`) + đáp án đúng (nhiều đáp án chấp nhận cách nhau `|`).
    - **MC One:** Câu hỏi + danh sách lựa chọn (mỗi dòng) + một đáp án đúng.
    - **MC Many:** Giống MC One + nhiều đáp án đúng (vd `A, C`).
    - **Matching:** Mỗi câu = mục bên trái + đáp án (A/B/C) bên phải.
    - **Map Labeling:** Câu/label + đáp án (chữ hoặc từ).
  - Mỗi câu có ô **Explanation** (giải thích).
- **Nút:** Add Group, Add question (trong từng group), Remove group/question.

Khi bấm **Save All:** Gọi `ListeningService.updateTest(id, metadata)` rồi `ListeningService.saveGroups(id, groups)`. Logic `saveGroups` là xóa toàn bộ groups/questions cũ của test rồi insert lại theo dữ liệu hiện tại trong form.

---

### Toast & trạng thái

- **Toast:** Thông báo success/error (vd “Metadata saved.”, “All changes saved.”, lỗi upload) ở góc dưới phải.
- **Loading:** Khi đang load test thì hiển thị “Loading...”.
- **Saving:** Nút Save có trạng thái disabled + “Saving...” khi đang gửi request.

Tóm lại: trang này dùng để **xem và sửa** một bài Listening (metadata + audio + transcript + từng nhóm câu và từng câu, kèm giải thích), với audio player cố định phía dưới khi đã có file nghe.




Chào bạn, bản giải thích của bạn về trang **Edit Listening** rất rõ ràng và logic. Bạn đã nắm bắt được cả luồng dữ liệu (data flow) lẫn cấu trúc giao diện (UI structure).

Để giúp bạn hệ thống lại một cách chuyên nghiệp hơn (có thể dùng để làm tài liệu kỹ thuật hoặc bàn giao), mình sẽ tóm tắt lại các điểm mấu chốt theo phong cách "Technical Breakdown" nhé:

---

## 🛠 Phân Tích Hệ Thống: Admin Listening Editor

### 1. Luồng Khởi Tạo (Initialization)

Trang sử dụng **Dynamic Routing** để xác định đối tượng cần chỉnh sửa.

* **Input:** `id` từ URL.
* **Action:** Gọi `ListeningService.getTestById(id)`.
* **Error Handling:** Nếu ID sai hoặc không tồn tại, hệ thống tự động điều hướng (Redirect) về danh sách tổng để tránh lỗi Runtime.

### 2. Cấu trúc Dữ liệu & Lưu trữ

Dữ liệu được chia làm 2 lớp (Layers) chính:

| Lớp (Layer) | Thành phần chính | Xử lý File (Storage) |
| --- | --- | --- |
| **Metadata** | Tiêu đề, Loại test, Nguồn, Transcript, Status. | Audio lưu tại bucket `listening-audio`. |
| **Question Groups** | Instruction, Loại câu hỏi (Gap fill, MC, Map...), Image. | Hình ảnh lưu tại bucket `listening-images`. |
| **Questions** | Nội dung câu hỏi, Đáp án, Giải thích. |  |

### 3. Logic Xử lý Đặc biệt (Business Logic)

Có hai điểm đáng chú ý trong cách code này vận hành:

* **Cơ chế Save "Hard Reset":** > Khi `Save All`, hệ thống xóa toàn bộ `groups` và `questions` cũ rồi chèn mới.
* *Ưu điểm:* Code xử lý đơn giản, không cần so sánh (diff) từng câu hỏi xem cái nào sửa, cái nào thêm, cái nào xóa.
* *Nhược điểm:* Tốn tài nguyên Database hơn một chút và có thể làm tăng giá trị `ID` (nếu dùng auto-increment). Tuy nhiên, với dữ liệu bài thi thì cách này khá an toàn và sạch sẽ.


* **Trải nghiệm người dùng (UX):** * **Sticky Audio Player:** Đây là một tính năng cực kỳ hữu ích cho người soạn đề. Việc cố định player giúp họ không phải cuộn lên xuống để nghe lại khi đang nhập đáp án ở cuối trang.
* **Feedback:** Sử dụng Toast và Loading State để người dùng biết hệ thống đang xử lý, tránh bấm "Save" nhiều lần.



---

### 4. Sơ đồ Hoạt động (Activity Diagram)

---

### 💡 Một vài lưu ý nhỏ (Gợi ý tối ưu):

Nếu bạn đang đọc code để bảo trì hoặc nâng cấp, hãy kiểm tra xem:

1. **Cơ chế xác thực (Auth):** Đảm bảo chỉ có role `admin` mới được truy cập vào route này.
2. **Validate dữ liệu:** Khi `Save All`, nếu một Group chưa có câu hỏi nào thì hệ thống có cho phép lưu không?
3. **Tối ưu Upload:** Khi upload file audio mới, file cũ trên Supabase có được xóa đi không hay vẫn để lại gây tốn dung lượng?

**Bạn có muốn mình hỗ trợ viết thêm kịch bản kiểm thử (Test Case) cho trang này hoặc giải thích sâu hơn về phần code xử lý `saveGroups` không?**


https://api.youpass.vn/v1/master-data