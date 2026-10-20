// Thanh phân trang dùng chung cho 2 bảng (Data Sensor và History Action)
export default function Pagination({ total, shown, page, setPage, pageSize, setPageSize }) {
  const totalPages = Math.ceil(total / pageSize) || 1
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1) // [1, 2, 3, ...]

  return (
    <div className="pagination-footer">
      <div className="pagination-info">
        Hiển thị {shown} / {total} kết quả
      </div>

      <div className="pagination-controls">
        <button className="page-btn page-arrow" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ← Trước
        </button>

        {pageNumbers.map((n) => (
          <button key={n} className={'page-btn ' + (page === n ? 'active' : '')} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}

        <button className="page-btn page-arrow" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Tiếp →
        </button>
      </div>

      <div className="page-size-selector">
        <select
          className="page-size-select"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
        >
          <option value={5}>5 hàng / trang</option>
          <option value={10}>10 hàng / trang</option>
          <option value={20}>20 hàng / trang</option>
        </select>
      </div>
    </div>
  )
}
