import React from 'react'
import {
  IconLogo,
  IconDashboard,
  IconSensor,
  IconHistory,
  IconProfile,
} from './Icons'

export default function Sidebar({ currentTab, setTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'sensor', label: 'Data Sensor', icon: IconSensor },
    { id: 'history', label: 'History Action', icon: IconHistory },
    { id: 'profile', label: 'Profile', icon: IconProfile },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <IconLogo />
        <span className="logo-text">IOT System</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = currentTab === item.id
          return (
            <button
              key={item.id}
              className={`menu-item ${active ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
