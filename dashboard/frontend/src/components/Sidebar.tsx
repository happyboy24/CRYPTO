import type { TabKey } from '@/App'

interface SidebarProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'signals', label: 'Signals', icon: '📡' },
  { key: 'bot', label: 'Bot Control', icon: '🤖' },
  { key: 'analytics', label: 'Analytics', icon: '📈' },
  { key: 'drips', label: 'Support', icon: '💧' },
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">◈</div>
        <div className="logo-text">
          CryptoForex<span className="accent">.io</span>
        </div>
      </div>
      <nav className="nav">
        {tabs.map((t) => (
          <a
            key={t.key}
            href="#"
            className={`nav-item ${activeTab === t.key ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onTabChange(t.key)
            }}
          >
            <span className="nav-icon">{t.icon}</span> {t.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
