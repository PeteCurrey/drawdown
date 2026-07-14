import { Metadata } from 'next';
import { getAllBasicPages } from '@/lib/basic';
import BasicHub from '@/components/basic/BasicHub';

export const metadata: Metadata = {
  title: 'Trading Basics | Drawdown — What Is Trading, Forex, Leverage & More',
  description: 'Plain-English answers to the questions every new trader asks. What is forex? What is leverage? What is a broker? Everything from first principles, no jargon.',
  alternates: { canonical: 'https://drawdown.trading/basic' },
};

export default function BasicHubPage() {
  const pages = getAllBasicPages();
  return <BasicHub pages={pages} />;
}
