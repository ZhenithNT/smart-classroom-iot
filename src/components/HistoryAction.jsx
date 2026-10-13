import React, { useState, useMemo } from 'react'
import { IconSearch } from './Icons'

export default function HistoryAction({ actionHistoryList }) {
  // Trạng thái các bộ lọc (lọc tức thì)
  const [deviceFilter, setDeviceFilter] = useState('Tất cả')
  const [actionFilter, setActionFilter] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [timeFilter, setTimeFilter] = useState('')

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Xử lý thay đổi các filter
  const handleDeviceChange = (e) => {
    setDeviceFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleActionChange = (e) => {
    setActionFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleTimeChange = (e) => {
    setTimeFilter(e.target.value)
    setCurrentPage(1)
  }

  // Lọc danh sách tức thì
  const filteredData = useMemo(() => {
    const timeQuery = timeFilter.trim().toLowerCase()

    return actionHistoryList.filter((item) => {
      // 1. Lọc theo thiết bị
      if (deviceFilter !== 'Tất cả' && item.device !== deviceFilter) {
        return false
      }
      // 2. Lọc theo hành động
      if (actionFilter !== 'Tất cả' && item.action !== actionFilter) {
        return false
      }
      // 3. Lọc theo trạng thái
      if (statusFilter !== 'Tất cả' && item.status !== statusFilter) {
        return false
      }
      // 4. Chỉ tìm kiếm theo thời gian
      if (timeQuery) {
        const matchSend = item.sendTime.toLowerCase().includes(timeQuery)
        const matchResp = item.respTime.toLowerCase().includes(timeQuery)
        if (!matchSend && !matchResp) {
          return false
        }
      }

      return true
    })
  }, [actionHistoryList, deviceFilter, actionFilter, statusFilter, timeFilter])

  // Phân trang
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const currentItems = filteredData.slice(startIndex, startIndex + pageSize)

  // Màu sắc badge trạng thái
  const renderStatusBadge = (status) => {
    if (status === 'Thành công') {
      return <span className="status-badge status-success">Thành công</span>
    }
    if (status === 'Đang xử lý') {
      return <span className="status-badge status-pending">Đang xử lý</span>
    }
    return <span className="status-badge status-failed">Thất bại</span>
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Lịch sử điều khiển</h1>
      </div>

      {/* Thanh bộ lọc: 3 Dropdown trước, ô tìm kiếm thời gian ở đằng sau, lọc tức thì */}
      <div className="filter-bar">
        {/* 1. Thiết bị */}
        <div className="filter-group">
          <span className="filter-label">Thiết bị</span>
          <select
            className="filter-select"
            value={deviceFilter}
            onChange={handleDeviceChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Đèn">Đèn</option>
            <option value="Quạt">Quạt</option>
          </select>
        </div>

        {/* 2. Hành động */}
        <div className="filter-group">
          <span className="filter-label">Hành động</span>
          <select
            className="filter-select"
            value={actionFilter}
            onChange={handleActionChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Bật">Bật</option>
            <option value="Tắt">Tắt</option>
          </select>
        </div>

        {/* 3. Trạng thái */}
        <div className="filter-group">
          <span className="filter-label">Trạng thái</span>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Thành công">Thành công</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Thất bại">Thất bại</option>
          </select>
        </div>

        {/* 4. Ô nhập đằng sau 3 filter, chỉ tìm kiếm thời gian */}
        <div className="search-input-wrapper">
          <IconSearch />
          <input
            type="text"
            className="filter-input"
            placeholder="Tìm theo thời gian (vd: 08:30, 16/08/2026)..."
            value={timeFilter}
            onChange={handleTimeChange}
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thiết bị</th>
              <th>Hành động</th>
              <th>Trạng thái</th>
              <th>Thời gian gửi</th>
              <th>Thời gian phản hồi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="cell-id">
                    {String(item.id).startsWith('#A') ? item.id : `#A${item.id}`}
                  </td>
                  <td>{item.device}</td>
                  <td>{item.action}</td>
                  <td>{renderStatusBadge(item.status)}</td>
                  <td className="cell-time">{item.sendTime}</td>
                  <td className="cell-time">{item.respTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Không tìm thấy kết quả phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Thanh phân trang */}
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
              Tiếp →
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
