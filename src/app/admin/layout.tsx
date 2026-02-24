import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAuthUserFromCookies } from '@/lib/auth'
import { AdminNav } from './admin-nav'
import { LogoutButton } from './logout-button'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAuthUserFromCookies()

  if (!user) {
    redirect('/login?next=/admin')
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#050505] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-black/75 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.52)] lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)]">
          <p className="text-xs uppercase tracking-[0.32em] text-[#f19b32]">XKSPROD</p>
          <h2 className="mt-3 text-2xl font-semibold">Admin</h2>
          <p className="mt-2 text-xs text-white/55">{user.email}</p>

          <AdminNav role={user.role} />

          <div className="mt-6 border-t border-white/10 pt-4">
            <LogoutButton />
          </div>
        </aside>

        <section className="rounded-2xl border border-white/10 bg-black/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.52)] md:p-8">
          {children}
        </section>
      </div>
    </main>
  )
}
