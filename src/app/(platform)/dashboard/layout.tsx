import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createInternalSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard | Drawdown',
  // Keep dashboard fully out of search engine indexes
  robots: { index: false, follow: false },
}

/**
 * Server-side auth guard — fires on every render of any /dashboard page.
 * The middleware handles this first, but this provides defense-in-depth:
 * if the middleware is ever misconfigured or bypassed, the layout still
 * enforces that only authenticated users reach any dashboard route.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createInternalSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
