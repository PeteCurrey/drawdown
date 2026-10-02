import type { Metadata } from 'next'
import PropSurvivalKitPage from './PropSurvivalKitClient'

export const metadata: Metadata = {
  title: 'Prop Firm Survival Kit | Pass Every Challenge',
  description: 'The complete guide to passing prop firm challenges. Drawdown rules decoded, position protocol, psychology frameworks and funded phase transition. Built by UK traders.',
  alternates: { canonical: 'https://drawdown.trading/prop-firms/survival-kit' }
}

export default function Page() {
  return <PropSurvivalKitPage />
}
