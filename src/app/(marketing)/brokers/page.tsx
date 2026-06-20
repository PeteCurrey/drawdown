import type { Metadata } from 'next'
import BrokerComparisonHub from './BrokersClient'

export const metadata: Metadata = {
  title: 'Broker Reviews & Comparisons | Honest UK Trader Assessments',
  description: 'Honest broker reviews and head-to-head comparisons for UK traders. FCA regulated options, spread betting availability, and real trading cost breakdowns.',
  alternates: { canonical: 'https://drawdown.trading/brokers' }
}

export default function Page() {
  return <BrokerComparisonHub />
}
