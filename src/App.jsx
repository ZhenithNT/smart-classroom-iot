import React, { useState, useEffect } from 'react'
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

// Hàm lấy chuỗi thời gian định dạng DD/MM/YYYY HH:mm:ss
const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  const d = pad(date.getDate())
  const m = pad(date.getMonth() + 1)
  const y = date.getFullYear()
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  const s = pad(date.getSeconds())
  return `${d}/${m}/${y} ${h}:${min}:${s}`
}

// Hàm lấy chuỗi thời gian HH:mm:ss cho biểu đồ
const formatTimeOnly = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function App() {
  const [currentTab, setTab] = useState('dashboard')

  // Trạng thái các thiết bị (Đèn, Quạt)
  const [devices, setDevices] = useState(INITIAL_DEVICES)

  // Trạng thái thiết bị đang chờ phản hồi (pending)
  const [pendingDevices, setPendingDevices] = useState({})

  // Trạng thái cảm biến thời gian thực
  const [sensorRealtime, setSensorRealtime] = useState(INITIAL_SENSOR_REALTIME)

  // Điểm dữ liệu biểu đồ
  const [chartDataPoints, setChartDataPoints] = useState(INITIAL_CHART_POINTS)

  // Danh sách lịch sử cảm biến (Data Sensor)
  const [sensorDataList, setSensorDataList] = useState(MOCK_SENSOR_DATA)

  // Danh sách lịch sử điều khiển (History Action)
  const [actionHistoryList, setActionHistoryList] = useState(MOCK_ACTION_HISTORY)

  // Luồng mô phỏng cập nhật dữ liệu cảm biến mỗi 2 giây (giống phụ đề PDF)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const timeStr = formatTimeOnly(now)
      const fullTimeStr = formatDateTime(now)

      // Sinh giá trị ngẫu nhiên mượt quanh ngưỡng thực tế
      const newLight = 950 + Math.floor(Math.random() * 150) // 950 - 1100 lux
      const newTemp = 27 + Math.floor(Math.random() * 4)     // 27 - 30 °C
      const newHumid = 76 + Math.floor(Math.random() * 9)    // 76 - 84 %

      // Cập nhật card realtime
      setSensorRealtime({
        light: newLight,
        temp: newTemp,
        humid: newHumid,
      })

      // Cập nhật biểu đồ (giữ 8 điểm gần nhất để biểu đồ trượt mượt mà)
      setChartDataPoints((prev) => {
        const next = [
          ...prev,
          { time: timeStr, light: newLight, temp: newTemp, humid: newHumid },
        ]
        return next.slice(-8)
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  // Xử lý bật/tắt thiết bị có độ trễ mô phỏng phản hồi IoT / MQTT
  const toggleDevice = (deviceId) => {
    // Nếu thiết bị này đang xử lý lệnh thì không cho bấm trùng lặp
    if (pendingDevices[deviceId]) return

    const dev = devices.find((d) => d.id === deviceId)
    if (!dev) return

    const now = new Date()
    const sendTime = formatDateTime(now)
    const targetAction = dev.status ? 'Tắt' : 'Bật'
    const newActionId = actionHistoryList.length + 1

    // 1. Đặt trạng thái đang xử lý (Pending)
    setPendingDevices((prev) => ({ ...prev, [deviceId]: true }))

    // 2. Ghi bản ghi vào Lịch sử điều khiển với trạng thái "Đang xử lý", thời gian phản hồi: "Đang chờ"
    setActionHistoryList((history) => [
      {
        id: newActionId,
        device: dev.name,
        action: targetAction,
        status: 'Đang xử lý',
        sendTime,
        respTime: 'Đang chờ',
      },
      ...history,
    ])

    // 3. Sau khoảng trễ 1.2s (mô phỏng gửi MQTT đến ESP32 và nhận kết quả phản hồi)
    setTimeout(() => {
      const respTime = formatDateTime(new Date())

      // Cập nhật trạng thái mới cho thiết bị
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, status: !d.status } : d))
      )

      // Cập nhật bản ghi trong History Action thành "Thành công" và có thời gian phản hồi
      setActionHistoryList((history) =>
        history.map((item) =>
          item.id === newActionId
            ? { ...item, status: 'Thành công', respTime }
            : item
        )
      )

      // Kết thúc trạng thái đang xử lý
      setPendingDevices((prev) => {
        const next = { ...prev }
        delete next[deviceId]
        return next
      })
    }, 1200)
  }

  return (
    <div className="app-container">
      {/* Sidebar cố định bên trái */}
      <Sidebar currentTab={currentTab} setTab={setTab} />

      {/* Khu vực nội dung chính */}
      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard
            sensorRealtime={sensorRealtime}
            chartDataPoints={chartDataPoints}
            devices={devices}
            toggleDevice={toggleDevice}
            pendingDevices={pendingDevices}
          />
        )}
        {currentTab === 'sensor' && (
          <DataSensor sensorDataList={sensorDataList} />
        )}
        {currentTab === 'history' && (
          <HistoryAction actionHistoryList={actionHistoryList} />
        )}
        {currentTab === 'profile' && <Profile />}
      </main>
    </div>
  )
}
