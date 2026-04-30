import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardTab from './components/tabs/DashboardTab'
import SignalsTab from './components/tabs/SignalsTab'
import BotControlTab from './components/tabs/BotControlTab'
import AnalyticsTab from './components/tabs/AnalyticsTab'

export type TabKey = 'dashboard' | 'signals' | 'bot' | 'analytics'

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [symbol, setSymbol] = useState('BTCUSDT')

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main">
        <TopBar symbol={symbol} onSymbolChange={setSymbol} />
        {activeTab === 'dashboard' && <DashboardTab symbol={symbol} />}
        {activeTab === 'signals' && <SignalsTab />}
        {activeTab === 'bot' && <BotControlTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  )
}

export default App

