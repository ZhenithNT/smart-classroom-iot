import { useState } from 'react'
import { IconSearch } from './Icons'
import Pagination from './Pagination'

export default function DataSensor({ sensorDataList }) {
  const [criterion, setCriterion] = useState('Ánh sáng') // tìm theo cái gì
  const [search, setSearch] = useState('')               // chữ người dùng gõ
  const [page, setPage] = useState(1)                    // trang hiện tại
  const [pageSize, setPageSize] = useState(10)           // số hàng mỗi trang

  // Lọc dữ liệu: chạy lại mỗi khi gõ chữ hoặc đổi tiêu chí
  const query = search.trim().toLowerCase()
  const rows = sensorDataList.filter((item) => {
    if (query === '') return true                                  // chưa gõ gì -> giữ hết
    if (criterion === 'Thời gian') return item.time.toLowerCase().includes(query)
    return item.type === criterion && item.value.toLowerCase().includes(query)
  })

  // Cắt ra các hàng của trang hiện tại
  const start = (page - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  // Chữ gợi ý trong ô tìm kiếm
  const examples = { 'Ánh sáng': '1000', 'Nhiệt độ': '28', 'Độ ẩm': '80' }
  const placeholder =
    criterion === 'Thời gian'
      ? 'Nhập thời gian cần tìm (vd: 08:30, 15/08/2026)...'
      : `Nhập giá trị ${criterion.toLowerCase()} cần tìm (vd: ${examples[criterion]})...`

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dữ liệu cảm biến</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Tìm theo</span>
          <select
            className="filter-select"
            value={criterion}
            onChange={(e) => { setCriterion(e.target.value); setPage(1) }}
          >
            <option>Ánh sáng</option>
            <option>Nhiệt độ</option>
            <option>Độ ẩm</option>
            <option>Thời gian</option>
          </select>
        </div>

        <div className="search-input-wrapper">
          <IconSearch />
          <input
            type="text"
            className="filter-input"
            placeholder={placeholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại cảm biến</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((item) => (
              <tr key={item.id}>
                <td className="cell-id">{item.id}</td>
                <td>{item.type}</td>
                <td className="cell-value">{item.value}</td>
                <td className="cell-time">{item.time}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-cell">Không tìm thấy kết quả phù hợp</td>
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
