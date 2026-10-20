import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { IconSun, IconTemp, IconHumid, IconBulb, IconFan } from './Icons'

// Bật các "bộ phận" của biểu đồ mà mình dùng
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

// ----- THẺ CẢM BIẾN (Ánh sáng / Nhiệt độ / Độ ẩm) -----
function SensorCard({ label, value, unit, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-title-group">
          {icon}
          <span className="metric-label">{label}</span>
        </div>
      </div>
      <div className="metric-body">
        <span className="metric-value">{value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
      <div className="metric-footer">
        <span className="badge-realtime">Realtime</span>
      </div>
    </div>
  )
}

// ----- MỘT HÀNG ĐIỀU KHIỂN THIẾT BỊ (Đèn hoặc Quạt) -----
function DeviceItem({ device, isPending, onToggle }) {
  const isBulb = device.id === 1 // id 1 là đèn, còn lại là quạt
  const boxClass = (isBulb ? 'bulb-' : 'fan-') + (device.status ? 'on' : 'off')

  let statusText = device.status ? 'Đang bật' : 'Đang tắt'
  if (isPending) statusText = 'Đang xử lý…'

  return (
    <div className="device-item">
      <div className="device-left">
        <div className={'device-icon-box ' + boxClass}>
          {isBulb ? <IconBulb on={device.status} /> : <IconFan on={device.status} />}
        </div>
        <div className="device-meta">
          <span className="device-name">{device.name}</span>
          <span className={'device-status ' + (isPending ? 'status-processing' : '')}>{statusText}</span>
        </div>
      </div>

      <label className={'switch ' + (isPending ? 'disabled' : '')}>
        <input
          type="checkbox"
          checked={device.status}
          disabled={isPending}
          onChange={() => onToggle(device.id)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  )
}

// ----- CẤU HÌNH BIỂU ĐỒ -----
const COLORS = { light: '#F59E0B', temp: '#EF4444', humid: '#3B82F6' }
const tickStyle = { color: '#6B7280', font: { size: 12 } }
const axisTitle = (text) => ({
  display: true,
  text,
  color: '#4B5563',
  font: { size: 12.5, weight: 600 },
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // tự vẽ chú thích bên dưới nên tắt cái mặc định
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    // Trục ngang: thời gian
    x: { grid: { color: '#F3F4F6' }, ticks: tickStyle },
    // Trục dọc bên trái: nhiệt độ + độ ẩm (0 - 100)
    yTempHumid: {
      type: 'linear',
      position: 'left',
      min: 0,
      max: 100,
      title: axisTitle('°C / %'),
      grid: { color: '#F3F4F6' },
      ticks: { ...tickStyle, stepSize: 50 },
    },
    // Trục dọc bên phải: ánh sáng (0 - 1200 lux)
    yLux: {
      type: 'linear',
      position: 'right',
      min: 0,
      max: 1200,
      title: axisTitle('lux'),
      grid: { drawOnChartArea: false },
      ticks: { ...tickStyle, stepSize: 600 },
    },
  },
}

// Tạo 1 đường trên biểu đồ: tên, lấy cột nào trong dữ liệu, màu, dùng trục nào
function makeLine(points, label, key, axis) {
  return {
    label,
    data: points.map((p) => p[key]),
    borderColor: COLORS[key],
    backgroundColor: COLORS[key],
    yAxisID: axis,
    tension: 0.35,
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
  }
}

// ----- TRANG DASHBOARD -----
export default function Dashboard({ sensor, chartPoints, devices, pending, toggleDevice }) {
  const chartData = {
    labels: chartPoints.map((p) => p.time),
    datasets: [
      makeLine(chartPoints, 'Ánh sáng', 'light', 'yLux'),
      makeLine(chartPoints, 'Nhiệt độ', 'temp', 'yTempHumid'),
      makeLine(chartPoints, 'Độ ẩm', 'humid', 'yTempHumid'),
    ],
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Gửi dữ liệu mỗi 2 giây</p>
      </div>

      {/* Hàng trên: 3 thẻ cảm biến + 1 thẻ điều khiển */}
      <div className="dashboard-grid">
        <SensorCard label="Ánh sáng" value={sensor.light} unit="lux" icon={<IconSun />} />
        <SensorCard label="Nhiệt độ" value={sensor.temp} unit="°C" icon={<IconTemp />} />
        <SensorCard label="Độ ẩm" value={sensor.humid} unit="%" icon={<IconHumid />} />

        <div className="device-control-card">
          <div className="control-title">Điều khiển thiết bị</div>
          <div className="device-list">
            {devices.map((d) => (
              <DeviceItem key={d.id} device={d} isPending={pending[d.id]} onToggle={toggleDevice} />
            ))}
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Biểu đồ dữ liệu cảm biến</h2>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: COLORS.light }} />
              Ánh sáng
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: COLORS.temp }} />
              Nhiệt độ
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: COLORS.humid }} />
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
