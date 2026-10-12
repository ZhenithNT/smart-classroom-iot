import React, { useState, useMemo } from 'react'
import { IconSearch } from './Icons'

export default function DataSensor({ sensorDataList }) {
  // Tiêu chí tìm kiếm: Ánh sáng, Nhiệt độ, Độ ẩm, Thời gian
  const [criterion, setCriterion] = useState('Ánh sáng')
  // Giá trị người dùng nhập vào ô tìm kiếm
  const [searchValue, setSearchValue] = useState('')

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Xử lý thay đổi tiêu chí
  const handleCriterionChange = (e) => {
    setCriterion(e.target.value)
    setCurrentPage(1)
  }

  // Xử lý gõ vào ô tìm kiếm (lọc tức thì)
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

  // Luồng lọc dữ liệu tự động
  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    // Nếu ô nhập trống: Bảng giữ nguyên tất cả dữ liệu
    if (!query) {
      return sensorDataList
    }

    // Nếu có nhập giá trị tìm kiếm:
    return sensorDataList.filter((item) => {
      if (criterion === 'Thời gian') {
        return item.time.toLowerCase().includes(query)
      }

      // Đối với Ánh sáng, Nhiệt độ, Độ ẩm: Lọc theo loại và giá trị
      if (item.type === criterion) {
        const matchValStr = item.value.toLowerCase().includes(query)
        const matchRawVal = String(item.rawValue).toLowerCase().includes(query)
        return matchValStr || matchRawVal
      }

      return false
    })
  }, [sensorDataList, criterion, searchValue])

  // Tính toán dữ liệu hiển thị theo trang
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const currentItems = filteredData.slice(startIndex, startIndex + pageSize)

  // Placeholder động theo tiêu chí đã chọn
  const getPlaceholder = () => {
    if (criterion === 'Thời gian') {
      return 'Nhập thời gian cần tìm (vd: 08:30, 15/08/2026)...'
    }
    const sample = criterion === 'Ánh sáng' ? '1000' : criterion === 'Nhiệt độ' ? '28' : '80'
    return `Nhập giá trị ${criterion.toLowerCase()} cần tìm (vd: ${sample})...`
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dữ liệu cảm biến</h1>
      </div>

      {/* Thanh bộ lọc: Ô chọn tiêu chí đứng TRƯỚC ô nhập, lọc tức thì không cần nút */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Tìm theo</span>
          <select
            className="filter-select"
            value={criterion}
            onChange={handleCriterionChange}
          >
            <option value="Ánh sáng">Ánh sáng</option>
            <option value="Nhiệt độ">Nhiệt độ</option>
            <option value="Độ ẩm">Độ ẩm</option>
            <option value="Thời gian">Thời gian</option>
          </select>
        </div>

        <div className="search-input-wrapper">
          <IconSearch />
          <input
            type="text"
            className="filter-input"
            placeholder={getPlaceholder()}
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="cell-id">{item.id}</td>
                  <td>{item.type}</td>
                  <td className="cell-value">{item.value}</td>
                  <td className="cell-time">{item.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-cell">
                  Không tìm thấy kết quả phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Thanh phân trang dưới chân bảng */}
        <div className="pagination-footer">
          <div className="pagination-info">
            Hiển thị {currentItems.length} / {totalItems} kết quả
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn page-arrow"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="page-btn page-arrow"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau →
            </button>
          </div>

          <div className="page-size-selector">
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={5}>5 hàng / trang</option>
              <option value={10}>10 hàng / trang</option>
              <option value={20}>20 hàng / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
