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

  // Xử lý bật/tắt thiết bị
  const toggleDevice = (deviceId) => {
    const now = new Date()
    const sendTime = formatDateTime(now)
    const respTime = formatDateTime(new Date(now.getTime() + 1500))

    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const nextStatus = !dev.status
          const actionText = nextStatus ? 'Bật' : 'Tắt'

          // Tự động ghi lại lịch sử vào trang History Action
          setActionHistoryList((history) => [
            {
              id: history.length + 1,
              device: dev.name,
              action: actionText,
              status: 'Thành công',
              sendTime,
              respTime,
            },
            ...history,
          ])

          return { ...dev, status: nextStatus }
        }
        return dev
      })
    )
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
