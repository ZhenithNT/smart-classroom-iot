import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { IconSun, IconTemp, IconHumid, IconBulb, IconFan } from './Icons'

/*
 ============================================================================
  GHI CHÚ DÀNH CHO LẬP TRÌNH VIÊN C / C++:
 ----------------------------------------------------------------------------
  1. "Props" trong Dashboard({ sensorRealtime, chartDataPoints, ... }):
     Tương đương việc truyền một struct tham số vào hàm:
     void RenderDashboard(const DashboardProps& props);
  2. "Tách hàm xử lý logic (Helper Functions)":
     Thay vì viết các toán tử ba ngôi (ternary operator ? :) lồng nhau phức tạp
     ngay trong giao diện, ta tách thành các hàm thuần túy (pure functions)
     sử dụng if / else rõ ràng, giống hệt hàm trong C++.
  3. "Chart.js Config Object":
     Là một cấu trúc dữ liệu phân cấp (struct lồng nhau) mô tả cách thư viện đồ họa
     vẽ các điểm ảnh (canvas rendering), thiết lập 2 trục Y độc lập (trục trái cho °C/%
     và trục phải cho Lux).
 ============================================================================
*/

// Đăng ký các module vẽ đồ thị với thư viện Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// ==========================================
// CÁC HÀM PHỤ TRỢ (HELPER FUNCTIONS)
// ==========================================

/**
 * Xác định lớp CSS cho khung icon của thiết bị
 * @param {object} device Đối tượng thiết bị (id, name, status)
 * @returns {string} Tên lớp CSS tương ứng
 */
function getDeviceBoxClass(device) {
  const isBulb = (device.id === 1) // id = 1 là Đèn, id = 2 là Quạt

  if (isBulb) {
    if (device.status === true) {
      return 'device-icon-box bulb-on' // Đèn bật: phát sáng vàng
    } else {
      return 'device-icon-box bulb-off' // Đèn tắt: xám
    }
  } else {
    // Là thiết bị Quạt
    if (device.status === true) {
      return 'device-icon-box fan-on' // Quạt bật: xanh dương + quay tròn
    } else {
      return 'device-icon-box fan-off' // Quạt tắt: đứng yên
    }
  }
}

/**
 * Xác định chuỗi văn bản trạng thái hiển thị của thiết bị
 * @param {object} device Đối tượng thiết bị
 * @param {boolean} isPending Cờ báo thiết bị có đang chờ phản hồi mạng hay không
 * @returns {string} Nhãn hiển thị ('Đang xử lý…' | 'Đang bật' | 'Đang tắt')
 */
function getDeviceStatusText(device, isPending) {
  // Ưu tiên 1: Đang trong quá trình trễ 1.2s chờ phản hồi
  if (isPending === true) {
    return 'Đang xử lý…'
  }

  // Ưu tiên 2: Trạng thái hiện tại của thiết bị
  if (device.status === true) {
    return 'Đang bật'
  } else {
    return 'Đang tắt'
  }
}

// ==========================================
// THÀNH PHẦN DASHBOARD (DASHBOARD COMPONENT)
// ==========================================
export default function Dashboard({
  sensorRealtime,
  chartDataPoints,
  devices,
  toggleDevice,
  pendingDevices = {},
}) {
  // --------------------------------------------------------------------------
  // BƯỚC 1: TRÍCH XUẤT DỮ LIỆU ĐỒ THỊ (Tương đương duyệt mảng vector trong C++)
  // --------------------------------------------------------------------------
  const labelsList = []
  const lightDataList = []
  const tempDataList = []
  const humidDataList = []

  for (let i = 0; i < chartDataPoints.length; i++) {
    const point = chartDataPoints[i]
    labelsList.push(point.time)
    lightDataList.push(point.light)
    tempDataList.push(point.temp)
    humidDataList.push(point.humid)
  }

  // --------------------------------------------------------------------------
  // BƯỚC 2: CẤU HÌNH DỮ LIỆU VẼ ĐỒ THỊ (3 đường: Ánh sáng, Nhiệt độ, Độ ẩm)
  // --------------------------------------------------------------------------
  const chartData = {
    labels: labelsList,
    datasets: [
      {
        label: 'Ánh sáng',
        data: lightDataList,
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        yAxisID: 'yLux', // Gắn vào trục Y bên phải (đơn vị lux, 0 - 1200)
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Nhiệt độ',
        data: tempDataList,
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        yAxisID: 'yTempHumid', // Gắn vào trục Y bên trái (đơn vị °C / %, 0 - 100)
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Độ ẩm',
        data: humidDataList,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        yAxisID: 'yTempHumid', // Dùng chung trục Y bên trái với Nhiệt độ
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }

  // --------------------------------------------------------------------------
  // BƯỚC 3: CẤU HÌNH TÙY CHỌN ĐỒ THỊ (Đồ thị 2 trục Y theo yêu cầu báo cáo)
  // --------------------------------------------------------------------------
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn legend mặc định vì đã có thanh legend tùy biến phía trên
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      // Trục hoành X: Thời gian đo (HH:mm:ss)
      x: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
      },
      // Trục tung Y bên trái: Dành cho Nhiệt độ (°C) và Độ ẩm (%)
      yTempHumid: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: '°C / %',
          color: '#4B5563',
          font: { size: 12.5, weight: 600 },
        },
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          stepSize: 50,
          font: { size: 12 },
        },
      },
      // Trục tung Y bên phải: Dành cho Ánh sáng (lux)
      yLux: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 1200,
        title: {
          display: true,
          text: 'lux',
          color: '#4B5563',
          font: { size: 12.5, weight: 600 },
        },
        grid: {
          drawOnChartArea: false, // Tránh vẽ đè lưới lên trục bên trái
        },
        ticks: {
          color: '#6B7280',
          stepSize: 600,
          font: { size: 12 },
        },
      },
    },
  }

  // --------------------------------------------------------------------------
  // BƯỚC 4: RENDER GIAO DIỆN HTML/JSX
  // --------------------------------------------------------------------------
  return (
    <div className="page-content">
      {/* Tiêu đề trang */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Gửi dữ liệu mỗi 2 giây</p>
      </div>

      {/* Hàng 4 Card: 3 Cảm biến + 1 Bảng điều khiển thiết bị */}
      <div className="dashboard-grid">
        {/* Card 1: Ánh sáng */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <IconSun />
              <span className="metric-label">Ánh sáng</span>
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{sensorRealtime.light}</span>
            <span className="metric-unit">lux</span>
          </div>
          <div className="metric-footer">
            <span className="badge-realtime">Realtime</span>
          </div>
        </div>

        {/* Card 2: Nhiệt độ */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <IconTemp />
              <span className="metric-label">Nhiệt độ</span>
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{sensorRealtime.temp}</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            <span className="badge-realtime">Realtime</span>
          </div>
        </div>

        {/* Card 3: Độ ẩm */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <IconHumid />
              <span className="metric-label">Độ ẩm</span>
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{sensorRealtime.humid}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            <span className="badge-realtime">Realtime</span>
          </div>
        </div>

        {/* Card 4: Bảng điều khiển thiết bị (Đèn, Quạt) */}
        <div className="device-control-card">
          <div className="control-title">Điều khiển thiết bị</div>
          <div className="device-list">
            {devices.map(function(dev) {
              const isBulb = (dev.id === 1)
              const isPending = Boolean(pendingDevices[dev.id])
              const DevIcon = isBulb ? IconBulb : IconFan
              const boxClass = getDeviceBoxClass(dev)
              const statusText = getDeviceStatusText(dev, isPending)

              // Xác định lớp CSS cho nhãn trạng thái và nút gạt
              let statusClass = 'device-status'
              if (isPending) {
                statusClass += ' status-processing'
              }

              let switchClass = 'switch'
              if (isPending) {
                switchClass += ' disabled'
              }

              return (
                <div key={dev.id} className="device-item">
                  <div className="device-left">
                    {/* Hộp icon: phát sáng khi đèn bật, quay khi quạt bật */}
                    <div className={boxClass}>
                      <DevIcon on={dev.status} />
                    </div>

                    <div className="device-meta">
                      <span className="device-name">{dev.name}</span>
                      <span className={statusClass}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Nút gạt ON/OFF */}
                  <label className={switchClass}>
                    <input
                      type="checkbox"
                      checked={dev.status}
                      disabled={isPending}
                      onChange={function() {
                        toggleDevice(dev.id)
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Card Biểu đồ dữ liệu cảm biến */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Biểu đồ dữ liệu cảm biến</h2>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }} />
              Ánh sáng
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#EF4444' }} />
              Nhiệt độ
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#3B82F6' }} />
              Độ ẩm
            </span>
          </div>
        </div>

        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
