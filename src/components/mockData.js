// Dữ liệu mẫu (mock data) chuẩn theo file PDF thiết kế IOT System

export const INITIAL_DEVICES = [
  { id: 1, name: 'Đèn', status: true },
  { id: 2, name: 'Quạt', status: true },
]

export const INITIAL_SENSOR_REALTIME = {
  light: 1000, // lux
  temp: 28,    // °C
  humid: 80,   // %
}

// 6 mốc thời gian ban đầu hiển thị trên biểu đồ giống PDF
export const INITIAL_CHART_POINTS = [
  { time: '10:00:00', light: 950, temp: 26, humid: 75 },
  { time: '10:05:00', light: 1020, temp: 27, humid: 78 },
  { time: '10:10:00', light: 980, temp: 29, humid: 82 },
  { time: '10:15:00', light: 1100, temp: 28, humid: 80 },
  { time: '10:20:00', light: 1050, temp: 30, humid: 76 },
  { time: '10:25:00', light: 1000, temp: 28, humid: 80 },
]

// 50 bản ghi dữ liệu cảm biến mẫu khớp chuẩn PDF
export const MOCK_SENSOR_DATA = [
  { id: '#S1', type: 'Ánh sáng', value: '1000 lux', rawValue: 1000, time: '15/08/2026 08:30:00' },
  { id: '#S2', type: 'Nhiệt độ', value: '28°C', rawValue: 28, time: '15/08/2026 08:30:00' },
  { id: '#S3', type: 'Độ ẩm', value: '80%', rawValue: 80, time: '15/08/2026 08:30:00' },
  { id: '#S4', type: 'Ánh sáng', value: '950 lux', rawValue: 950, time: '15/08/2026 09:00:00' },
  { id: '#S5', type: 'Nhiệt độ', value: '30°C', rawValue: 30, time: '15/08/2026 09:00:00' },
  { id: '#S6', type: 'Độ ẩm', value: '75%', rawValue: 75, time: '15/08/2026 09:00:00' },
  { id: '#S7', type: 'Ánh sáng', value: '1100 lux', rawValue: 1100, time: '15/08/2026 09:30:00' },
  { id: '#S8', type: 'Nhiệt độ', value: '27°C', rawValue: 27, time: '15/08/2026 09:30:00' },
  { id: '#S9', type: 'Độ ẩm', value: '82%', rawValue: 82, time: '15/08/2026 09:30:00' },
  { id: '#S10', type: 'Ánh sáng', value: '980 lux', rawValue: 980, time: '15/08/2026 10:00:00' },
  // Tạo tiếp từ #S11 đến #S50 để phân trang đủ 50 kết quả
  ...Array.from({ length: 40 }, (_, i) => {
    const idx = i + 11
    const types = ['Ánh sáng', 'Nhiệt độ', 'Độ ẩm']
    const curType = types[i % 3]
    let valStr = ''
    let raw = 0
    if (curType === 'Ánh sáng') {
      raw = 900 + ((idx * 37) % 300)
      valStr = `${raw} lux`
    } else if (curType === 'Nhiệt độ') {
      raw = 25 + ((idx * 3) % 9)
      valStr = `${raw}°C`
    } else {
      raw = 70 + ((idx * 5) % 18)
      valStr = `${raw}%`
    }
    const hour = String(10 + Math.floor(i / 6)).padStart(2, '0')
    const minute = String((i % 6) * 10).padStart(2, '0')
    return {
      id: `#S${idx}`,
      type: curType,
      value: valStr,
      rawValue: raw,
      time: `15/08/2026 ${hour}:${minute}:00`,
    }
  }),
]

// 30 bản ghi lịch sử điều khiển khớp chuẩn
export const MOCK_ACTION_HISTORY = [
  { id: 1, device: 'Đèn', action: 'Bật', status: 'Thành công', respTime: '16/08/2026 08:30:18' },
  { id: 2, device: 'Quạt', action: 'Tắt', status: 'Thành công', respTime: '16/08/2026 09:15:45' },
  { id: 3, device: 'Đèn', action: 'Bật', status: 'Đang xử lý', respTime: 'Đang chờ' },
  { id: 4, device: 'Đèn', action: 'Tắt', status: 'Thất bại', respTime: '16/08/2026 11:45:05' },
  { id: 5, device: 'Quạt', action: 'Bật', status: 'Thành công', respTime: '16/08/2026 12:10:24' },
  { id: 6, device: 'Quạt', action: 'Tắt', status: 'Thất bại', respTime: '16/08/2026 13:21:25' },
  { id: 7, device: 'Đèn', action: 'Bật', status: 'Đang xử lý', respTime: 'Đang chờ' },
  { id: 8, device: 'Quạt', action: 'Tắt', status: 'Thất bại', respTime: '16/08/2026 15:30:42' },
  { id: 9, device: 'Đèn', action: 'Bật', status: 'Thành công', respTime: '16/08/2026 16:15:10' },
  { id: 10, device: 'Đèn', action: 'Tắt', status: 'Thất bại', respTime: '16/08/2026 17:00:38' },
  // Tạo tiếp từ ID 11 đến 30 để phân trang đủ 30 kết quả
  ...Array.from({ length: 20 }, (_, i) => {
    const idx = i + 11
    const devs = ['Đèn', 'Quạt']
    const acts = ['Bật', 'Tắt']
    const stats = ['Thành công', 'Thất bại', 'Đang xử lý']
    const d = devs[i % 2]
    const a = acts[i % 2]
    const s = stats[i % 3]
    const hour = String(17 + Math.floor(i / 4)).padStart(2, '0')
    const minute = String((i % 4) * 15).padStart(2, '0')
    const resp = s === 'Đang xử lý' ? 'Đang chờ' : `16/08/2026 ${hour}:${minute}:13`
    return {
      id: idx,
      device: d,
      action: a,
      status: s,
      respTime: resp,
    }
  }),
]

export const STUDENT_PROFILE = {
  fullName: 'Nguyễn Trung Nghĩa',
  studentId: 'B23DCAT211',
  group: '13',
  links: [
    {
      title: 'Figma',
      desc: 'https://www.figma.com/design/Q142HeQDCmSJKCGBhen3nH/Untitled?node-id=0-1&t=a30Ba2izMMXob8lO-1',
      url: 'https://www.figma.com/design/Q142HeQDCmSJKCGBhen3nH/Untitled?node-id=0-1&t=a30Ba2izMMXob8lO-1',
      buttonText: 'Mở liên kết',
    },
    {
      title: 'Báo cáo PDF',
      desc: 'Báo cáo bài thực hành 1 - IoT và Ứng dụng.pdf',
      url: '/Bao-cao-bai-thuc-hanh-1-IoT.pdf',
      buttonText: 'Mở liên kết',
    },
    {
      title: 'GitHub',
      desc: 'https://github.com/ZhenithNT/smart-classroom-iot',
      url: 'https://github.com/ZhenithNT/smart-classroom-iot',
      buttonText: 'Mở liên kết',
    },
    {
      title: 'Swagger API',
      desc: 'https://app.swaggerhub.com/apis/zhenithnt/smart_classroom_iot_api/1.0.0',
      url: 'https://app.swaggerhub.com/apis/zhenithnt/smart_classroom_iot_api/1.0.0',
      buttonText: 'Mở liên kết',
    },
  ],
}
