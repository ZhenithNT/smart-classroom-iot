import React from 'react'
import { STUDENT_PROFILE } from '../mockData'
import { IconUserAvatar } from './Icons'

export default function Profile() {
  const { fullName, studentId, group, links } = STUDENT_PROFILE

  const handleOpenLink = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      alert('Tài liệu này sẽ được bổ sung sau!')
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Hồ sơ cá nhân</h1>
      </div>

      <div className="profile-layout">
        {/* Cột trái: Thông tin sinh viên */}
        <div className="profile-student-card">
          <div className="avatar-wrapper">
            <IconUserAvatar />
          </div>

          <div className="student-info-section">
            <h3 className="student-card-title">Thông tin sinh viên</h3>
            <div className="student-name">{fullName}</div>
            <div className="student-detail">
              <span className="detail-label">MSSV: </span>
              <span className="detail-value">{studentId}</span>
            </div>
            <div className="student-detail">
              <span className="detail-label">Nhóm: </span>
              <span className="detail-value">{group}</span>
            </div>
          </div>
        </div>

        {/* Cột phải: 4 card sản phẩm/liên kết dạng lưới 2x2 */}
        <div className="profile-links-grid">
          {links.map((item, idx) => (
            <div key={idx} className="link-card">
              <div className="link-card-header">
                <h3 className="link-card-title">{item.title}</h3>
                <p className="link-card-desc">{item.desc}</p>
              </div>
              <button
                className="btn-open-link"
                onClick={() => handleOpenLink(item.url)}
              >
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
