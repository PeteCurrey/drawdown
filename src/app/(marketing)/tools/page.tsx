import type { Metadata } from 'next'
import ToolsPage from './ToolsClient'

export const metadata: Metadata = {
  title: 'AI Trading Tools | Risk Calculator, Trade Journal & More',
  description: 'AI-powered trading tools built into the Drawdown platform. Risk Calculator, Trade Journal, Market Scanner and more — included with every plan.',
  alternates: { canonical: 'https://drawdown.trading/tools' }
}

export default function Page() {
  return <ToolsPage />
}
