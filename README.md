# Smart Classroom IoT System - Frontend Dashboard

Hệ thống giám sát và điều khiển Smart Classroom IoT qua MQTT & REST API.

## Giới thiệu
Dự án được xây dựng phục vụ học phần **IoT và Ứng dụng** (Học viện Công nghệ Bưu chính Viễn thông).

- **Sinh viên thực hiện:** Nguyễn Trung Nghĩa
- **Mã sinh viên:** B23DCAT211
- **Nhóm:** 13
- **Giảng viên hướng dẫn:** TS. Nguyễn Quốc Uy

## Các tính năng chính
1. **Dashboard:**
   - Giám sát thời gian thực 3 cảm biến: Ánh sáng (lux), Nhiệt độ (°C), Độ ẩm (%).
   - Điều khiển bật / tắt thiết bị: Đèn, Quạt.
   - Biểu đồ đường hiển thị dữ liệu cảm biến trực quan 2 trục Y.
2. **Dữ liệu cảm biến (Data Sensor):**
   - Xem dữ liệu đo từ các cảm biến.
   - Lọc theo tiêu chí: Ánh sáng, Nhiệt độ, Độ ẩm, Thời gian.
   - Phân trang, hiển thị chi tiết.
3. **Lịch sử điều khiển (History Action):**
   - Nhật ký thao tác bật/tắt thiết bị (#A1, #A2,...).
   - Bộ lọc theo thiết bị, hành động, trạng thái và tìm kiếm thời gian.
4. **Hồ sơ cá nhân (Profile):**
   - Thông tin sinh viên và nhóm thực hiện.
   - Liên kết tài liệu: Thiết kế Figma, Báo cáo PDF, GitHub, Swagger API.

## Hướng dẫn cài đặt & chạy
```bash
# Cài đặt thư viện
npm install

# Chạy server phát triển
npm run dev

# Đóng gói sản phẩm
npm run build
```
