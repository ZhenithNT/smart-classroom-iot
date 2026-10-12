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

// Đăng ký các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard({
  sensorRealtime,
  chartDataPoints,
  devices,
  toggleDevice,
}) {
  // Cấu hình dữ liệu biểu đồ
  const chartData = {
    labels: chartDataPoints.map((p) => p.time),
    datasets: [
      {
        label: 'Ánh sáng',
        data: chartDataPoints.map((p) => p.light),
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        yAxisID: 'yLux',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Nhiệt độ',
        data: chartDataPoints.map((p) => p.temp),
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        yAxisID: 'yTempHumid',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Độ ẩm',
        data: chartDataPoints.map((p) => p.humid),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        yAxisID: 'yTempHumid',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }

  // Tùy chọn biểu đồ 2 trục Y giống thiết kế
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Dùng legend tùy biến phía trên giống PDF
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
      },
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
          drawOnChartArea: false,
        },
        ticks: {
          color: '#6B7280',
          stepSize: 600,
          font: { size: 12 },
        },
      },
    },
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Gửi dữ liệu mỗi 2 giây</p>
      </div>

      {/* Hàng 4 Card: 3 Cảm biến + 1 Bảng điều khiển thiết bị */}
      <div className="dashboard-grid">
        {/* Card Ánh sáng */}
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

        {/* Card Nhiệt độ */}
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

        {/* Card Độ ẩm */}
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

        {/* Card Điều khiển thiết bị */}
        <div className="device-control-card">
          <div className="control-title">Điều khiển thiết bị</div>
          <div className="device-list">
            {devices.map((dev) => {
              const DevIcon = dev.id === 1 ? IconBulb : IconFan
              return (
                <div key={dev.id} className="device-item">
                  <div className="device-left">
                    <div className="device-icon-box">
                      <DevIcon />
                    </div>
                    <div className="device-meta">
                      <span className="device-name">{dev.name}</span>
                      <span className="device-status">
                        {dev.status ? 'Đang bật' : 'Đang tắt'}
                      </span>
                    </div>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={dev.status}
                      onChange={() => toggleDevice(dev.id)}
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
