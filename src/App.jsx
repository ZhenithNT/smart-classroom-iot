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

/*
 ============================================================================
  GHI CHÚ DÀNH CHO LẬP TRÌNH VIÊN C / C++:
 ----------------------------------------------------------------------------
  1. "Component" (App) tương đương một hàm hoặc lớp giao diện (GUI Window).
     Hàm này trả về cây đối tượng giao diện (JSX tương đương cây widget như Qt/Win32).
  2. "useState": Giống như khai báo biến thành viên (member variable) của struct/class.
     Khi ta gọi hàm setter (ví dụ setDevices), React sẽ ghi nhận trạng thái mới
     và tự động kích hoạt hàm render() vẽ lại giao diện (gọi là Re-render).
  3. "useEffect": Giống như khởi tạo một luồng chạy ngầm (std::thread / Timer)
     khi khởi tạo đối tượng (Constructor). Giá trị trả về trong hàm return là hàm
     hủy (Destructor / cleanup), sẽ gọi clearInterval để dừng timer khi tắt ứng dụng.
  4. "Tính bất biến (Immutability)": Trong C++, ta thường sửa trực tiếp ô nhớ
     (in-place mutation: arr[i] = x). Trong React, ta không sửa trực tiếp mảng cũ
     mà tạo một mảng/đối tượng mới với dữ liệu cập nhật, để React nhận biết địa chỉ
     con trỏ thay đổi và tiến hành vẽ lại màn hình.
 ============================================================================
*/

// ==========================================
// CÁC HÀM PHỤ TRỢ (HELPER FUNCTIONS)
// ==========================================

/**
 * Thêm số 0 vào trước số có 1 chữ số (giống std::setw(2) và std::setfill('0') trong <iomanip>)
 * @param {number} num Số nguyên cần định dạng
 * @returns {string} Chuỗi ký tự có độ dài tối thiểu 2 chữ số
 */
function padZero(num) {
  if (num < 10) {
    return '0' + num
  }
  return String(num)
}

/**
 * Định dạng ngày giờ thành chuỗi "DD/MM/YYYY HH:mm:ss"
 * @param {Date} date Đối tượng thời gian
 * @returns {string} Chuỗi thời gian hoàn chỉnh
 */
function formatDateTime(date) {
  const day = padZero(date.getDate())
  const month = padZero(date.getMonth() + 1) // Tháng trong JS bắt đầu từ 0 đến 11
  const year = date.getFullYear()
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * Định dạng mốc thời gian thành "HH:mm:ss" phục vụ hiển thị trục hoành biểu đồ
 * @param {Date} date Đối tượng thời gian
 * @returns {string} Chuỗi giờ:phút:giây
 */
function formatTimeOnly(date) {
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return hours + ':' + minutes + ':' + seconds
}

// ==========================================
// THÀNH PHẦN CHÍNH (MAIN COMPONENT)
// ==========================================
export default function App() {
  // Biến lưu tab màn hình hiện tại ('dashboard' | 'sensor' | 'history' | 'profile')
  const [currentTab, setTab] = useState('dashboard')

  // Trạng thái các thiết bị (Đèn, Quạt) - tương đương struct Device { int id; string name; bool status; }
  const [devices, setDevices] = useState(INITIAL_DEVICES)

  // Bảng băm theo dõi các thiết bị đang bận xử lý lệnh (tương đương std::unordered_map<int, bool>)
  const [pendingDevices, setPendingDevices] = useState({})

  // Giá trị cảm biến thời gian thực hiển thị trên các Card
  const [sensorRealtime, setSensorRealtime] = useState(INITIAL_SENSOR_REALTIME)

  // Hàng đợi lưu 8 điểm dữ liệu gần nhất cho biểu đồ (tương đương std::deque<Point> có dung lượng 8)
  const [chartDataPoints, setChartDataPoints] = useState(INITIAL_CHART_POINTS)

  // Danh sách dữ liệu cảm biến (trang Data Sensor)
  const [sensorDataList, setSensorDataList] = useState(MOCK_SENSOR_DATA)

  // Danh sách lịch sử thao tác điều khiển thiết bị (trang History Action)
  const [actionHistoryList, setActionHistoryList] = useState(MOCK_ACTION_HISTORY)

  // --------------------------------------------------------------------------
  // TIMER CẬP NHẬT DỮ LIỆU CẢM BIẾN MỖI 2 GIÂY (Mô phỏng chu kỳ đọc của ESP32)
  // --------------------------------------------------------------------------
  useEffect(function() {
    // Khởi tạo một đồng hồ định kỳ (Interval Timer) gọi callback sau mỗi 2000ms
    const timerId = setInterval(function() {
      const now = new Date()
      const timeStr = formatTimeOnly(now)

      // Sinh giá trị ngẫu nhiên trong dải thực tế
      // Ánh sáng: 950 -> 1100 lux
      const newLight = 950 + Math.floor(Math.random() * 150)
      // Nhiệt độ: 27 -> 30 °C
      const newTemp = 27 + Math.floor(Math.random() * 4)
      // Độ ẩm: 76 -> 84 %
      const newHumid = 76 + Math.floor(Math.random() * 9)

      // 1. Cập nhật struct dữ liệu realtime cho 3 Card
      const newSensorValues = {
        light: newLight,
        temp: newTemp,
        humid: newHumid,
      }
      setSensorRealtime(newSensorValues)

      // 2. Cập nhật dữ liệu đồ thị theo nguyên lý Hàng đợi trượt (Sliding Window Buffer)
      setChartDataPoints(function(previousPoints) {
        const newPoint = {
          time: timeStr,
          light: newLight,
          temp: newTemp,
          humid: newHumid,
        }

        // Tạo mảng mới gồm các phần tử cũ và đẩy điểm mới vào cuối (vector::push_back)
        const updatedList = [...previousPoints, newPoint]

        // Giữ lại tối đa 8 phần tử gần nhất (nếu nhiều hơn 8 thì bỏ bớt phần tử cũ nhất ở đầu)
        if (updatedList.length > 8) {
          return updatedList.slice(updatedList.length - 8)
        }
        return updatedList
      })
    }, 2000)

    // Hàm dọn dẹp khi component bị hủy (Destructor)
    return function() {
      clearInterval(timerId)
    }
  }, []) // Mảng rỗng [] chỉ thị hiệu ứng này chỉ khởi chạy duy nhất 1 lần khi nạp trang

  // --------------------------------------------------------------------------
  // HÀM XỬ LÝ BẬT/TẮT THIẾT BỊ (Mô phỏng gửi lệnh MQTT và chờ phản hồi 1.2 giây)
  // --------------------------------------------------------------------------
  function toggleDevice(deviceId) {
    // Kiểm tra điều kiện chặn: Nếu thiết bị này đang bận xử lý thì không nhận lệnh mới
    const isAlreadyPending = Boolean(pendingDevices[deviceId])
    if (isAlreadyPending) {
      return
    }

    // Tìm kiếm thiết bị theo ID (tương tự std::find_if trong C++)
    let targetDevice = null
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].id === deviceId) {
        targetDevice = devices[i]
        break
      }
    }

    // Nếu không tìm thấy thiết bị thì thoát hàm
    if (!targetDevice) {
      return
    }

    const now = new Date()
    const sendTime = formatDateTime(now)

    // Xác định hành động đảo trạng thái với câu lệnh if/else rõ ràng
    let targetAction = ''
    if (targetDevice.status === true) {
      targetAction = 'Tắt'
    } else {
      targetAction = 'Bật'
    }

    // ID cho bản ghi lịch sử mới (tăng dần)
    const newActionId = actionHistoryList.length + 1

    // BƯỚC 1: Đánh dấu thiết bị rơi vào trạng thái "Đang xử lý" (Pending)
    setPendingDevices(function(prevPending) {
      const updatedPending = { ...prevPending }
      updatedPending[deviceId] = true
      return updatedPending
    })

    // BƯỚC 2: Thêm bản ghi vào đầu danh sách Lịch sử thao tác (vector::insert at position 0)
    setActionHistoryList(function(previousHistory) {
      const newHistoryRecord = {
        id: newActionId,
        device: targetDevice.name,
        action: targetAction,
        status: 'Đang xử lý',
        sendTime: sendTime,
        respTime: 'Đang chờ',
      }
      return [newHistoryRecord, ...previousHistory]
    })

    // BƯỚC 3: Tạo một bộ đếm thời gian trễ 1200ms (1.2 giây) mô phỏng độ trễ truyền gói tin mạng
    setTimeout(function() {
      const respTime = formatDateTime(new Date())

      // 3.1. Cập nhật trạng thái ON/OFF của thiết bị trong danh sách
      setDevices(function(previousDevices) {
        const nextDevices = []
        for (let i = 0; i < previousDevices.length; i++) {
          const currentDev = previousDevices[i]
          if (currentDev.id === deviceId) {
            // Sao chép và đảo trạng thái boolean
            nextDevices.push({
              ...currentDev,
              status: !currentDev.status,
            })
          } else {
            nextDevices.push(currentDev)
          }
        }
        return nextDevices
      })

      // 3.2. Cập nhật bản ghi trong lịch sử thao tác từ "Đang xử lý" -> "Thành công"
      setActionHistoryList(function(previousHistory) {
        const nextHistory = []
        for (let i = 0; i < previousHistory.length; i++) {
          const item = previousHistory[i]
          if (item.id === newActionId) {
            nextHistory.push({
              ...item,
              status: 'Thành công',
              respTime: respTime,
            })
          } else {
            nextHistory.push(item)
          }
        }
        return nextHistory
      })

      // 3.3. Xóa trạng thái đang xử lý để mở khóa công tắc
      setPendingDevices(function(previousPending) {
        const nextPending = { ...previousPending }
        delete nextPending[deviceId]
        return nextPending
      })
    }, 1200)
  }

  // --------------------------------------------------------------------------
  // RENDER GIAO DIỆN CHÍNH
  // --------------------------------------------------------------------------
  return (
    <div className="app-container">
      {/* Cột điều hướng Sidebar cố định bên trái */}
      <Sidebar currentTab={currentTab} setTab={setTab} />

      {/* Vùng hiển thị nội dung màn hình được chọn */}
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
