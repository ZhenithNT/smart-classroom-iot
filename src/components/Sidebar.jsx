import { IconLogo, IconDashboard, IconSensor, IconHistory, IconProfile } from './Icons'

// Danh sách menu: thêm / bớt trang chỉ cần sửa ở đây
const MENU = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'sensor', label: 'Data Sensor', Icon: IconSensor },
  { id: 'history', label: 'History Action', Icon: IconHistory },
  { id: 'profile', label: 'Profile', Icon: IconProfile },
]

export default function Sidebar({ currentTab, setTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <IconLogo />
        <span className="logo-text">IOT System</span>
      </div>

      <nav className="sidebar-menu">
        {MENU.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={'menu-item ' + (currentTab === id ? 'active' : '')}
            onClick={() => setTab(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
