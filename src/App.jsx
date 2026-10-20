import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import DataSensor from './components/DataSensor'
import HistoryAction from './components/HistoryAction'
import Profile from './components/Profile'
import {
  INITIAL_DEVICES,
  INITIAL_SENSOR_REALTIME,
  INITIAL_CHART_POINTS,
  MOCK_SENSOR_DATA,
  MOCK_ACTION_HISTORY,
} from './mockData'

// Giờ hiện tại, ví dụ "08:30:00"
const getTime = () => new Date().toLocaleTimeString('en-GB')
// Ngày giờ hiện tại, ví dụ "15/08/2026 08:30:00"
const getDateTime = () => new Date().toLocaleDateString('en-GB') + ' ' + getTime()

export default function App() {
  // ----- CÁC BIẾN "TRẠNG THÁI" (khi đổi giá trị, React tự vẽ lại màn hình) -----
  const [tab, setTab] = useState('dashboard')                    // đang ở trang nào
  const [devices, setDevices] = useState(INITIAL_DEVICES)         // đèn, quạt
  const [pending, setPending] = useState({})                      // thiết bị nào đang chờ phản hồi, vd { 1: true }
  const [sensor, setSensor] = useState(INITIAL_SENSOR_REALTIME)   // 3 số cảm biến hiện tại
  const [chartPoints, setChartPoints] = useState(INITIAL_CHART_POINTS) // các điểm trên biểu đồ
  const [history, setHistory] = useState(MOCK_ACTION_HISTORY)     // lịch sử bật/tắt

  // ----- MỖI 2 GIÂY TẠO DỮ LIỆU CẢM BIẾN GIẢ -----
  useEffect(() => {
    const timer = setInterval(() => {
      const light = 950 + Math.floor(Math.random() * 150)
      const temp = 27 + Math.floor(Math.random() * 4)
      const humid = 76 + Math.floor(Math.random() * 9)

      setSensor({ light, temp, humid })

      // Thêm điểm mới vào cuối, chỉ giữ 8 điểm gần nhất
      setChartPoints((old) => [...old, { time: getTime(), light, temp, humid }].slice(-8))
    }, 2000)

    return () => clearInterval(timer) // dừng timer khi thoát
  }, [])

  // ----- BẬT / TẮT THIẾT BỊ (giả lập gửi lệnh, chờ 1.2 giây rồi thành công) -----
  function toggleDevice(id) {
    if (pending[id]) return // đang chờ rồi thì không cho bấm tiếp

    const device = devices.find((d) => d.id === id)
    const recordId = history.length + 1

    // 1. Đánh dấu thiết bị đang xử lý
    setPending((old) => ({ ...old, [id]: true }))

    // 2. Thêm 1 dòng "Đang xử lý" vào đầu bảng lịch sử
    const newRecord = {
      id: recordId,
      device: device.name,
      action: device.status ? 'Tắt' : 'Bật',
      status: 'Đang xử lý',
      respTime: 'Đang chờ',
    }
    setHistory((old) => [newRecord, ...old])

    // 3. Sau 1.2 giây: đổi trạng thái thiết bị, sửa dòng lịch sử, mở khóa công tắc
    setTimeout(() => {
      setDevices((old) => old.map((d) => (d.id === id ? { ...d, status: !d.status } : d)))
      setHistory((old) =>
        old.map((r) => (r.id === recordId ? { ...r, status: 'Thành công', respTime: getDateTime() } : r))
      )
      setPending((old) => ({ ...old, [id]: false }))
    }, 1200)
  }

  // ----- HIỂN THỊ TRANG THEO TAB -----
  return (
    <div className="app-container">
      <Sidebar currentTab={tab} setTab={setTab} />

      <main className="main-content">
        {tab === 'dashboard' && (
          <Dashboard
            sensor={sensor}
            chartPoints={chartPoints}
            devices={devices}
            pending={pending}
            toggleDevice={toggleDevice}
          />
        )}
        {tab === 'sensor' && <DataSensor sensorDataList={MOCK_SENSOR_DATA} />}
        {tab === 'history' && <HistoryAction actionHistoryList={history} />}
        {tab === 'profile' && <Profile />}
      </main>
    </div>
  )
}
