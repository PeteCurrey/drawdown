import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard | Drawdown',
  // Keep dashboard fully out of search engine indexes
  robots: { index: false, follow: false },
}

/**
 * Server-side auth guard — fires on every render of any /dashboard page.
 * Uses the cookie-aware SSR client so the user's active session is read
 * correctly. The middleware handles the first redirect; this is defense-in-depth.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
