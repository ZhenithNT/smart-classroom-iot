import { useState } from 'react'
import { IconSearch } from './Icons'
import Pagination from './Pagination'

// Ô chọn (dropdown) dùng lại 3 lần: Thiết bị, Hành động, Trạng thái
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <select className="filter-select" value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

// Mỗi trạng thái ứng với 1 class CSS (màu) khác nhau
const STATUS_CLASS = {
  'Thành công': 'status-success',
  'Đang xử lý': 'status-pending',
  'Thất bại': 'status-failed',
}

export default function HistoryAction({ actionHistoryList }) {
  const [device, setDevice] = useState('Tất cả')
  const [action, setAction] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [time, setTime] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Hàm tạo "onChange": lưu giá trị mới + quay về trang 1
  const handle = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  // Giữ lại dòng nào thỏa TẤT CẢ điều kiện
  const query = time.trim().toLowerCase()
  const rows = actionHistoryList.filter(
    (item) =>
      (device === 'Tất cả' || item.device === device) &&
      (action === 'Tất cả' || item.action === action) &&
      (status === 'Tất cả' || item.status === status) &&
      (query === '' || item.respTime.toLowerCase().includes(query))
  )

  const start = (page - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Lịch sử điều khiển</h1>
      </div>

      <div className="filter-bar">
        <FilterSelect label="Thiết bị" value={device} onChange={handle(setDevice)} options={['Tất cả', 'Đèn', 'Quạt']} />
        <FilterSelect label="Hành động" value={action} onChange={handle(setAction)} options={['Tất cả', 'Bật', 'Tắt']} />
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={handle(setStatus)}
          options={['Tất cả', 'Thành công', 'Đang xử lý', 'Thất bại']}
        />

        <div className="search-input-wrapper">
          <IconSearch />
          <input
            type="text"
            className="filter-input"
            placeholder="Tìm theo thời gian (vd: 08:30, 16/08/2026)..."
            value={time}
            onChange={handle(setTime)}
          />
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thiết bị</th>
              <th>Hành động</th>
              <th>Trạng thái</th>
              <th>Thời gian phản hồi</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((item) => (
              <tr key={item.id}>
                <td className="cell-id">#A{item.id}</td>
                <td>{item.device}</td>
                <td>{item.action}</td>
                <td>
                  <span className={'status-badge ' + STATUS_CLASS[item.status]}>{item.status}</span>
                </td>
                <td className="cell-time">{item.respTime}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-cell">Không tìm thấy kết quả phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          total={rows.length}
          shown={pageRows.length}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  )
}
