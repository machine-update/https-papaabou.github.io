'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Role } from '@prisma/client'

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productions', label: 'Productions' },
  { href: '/admin/artistes', label: 'Artistes' },
  { href: '/admin/partenaires', label: 'Partenaires' },
  { href: '/admin/activity', label: 'Activite' },
  { href: '/admin/users', label: 'Utilisateurs' },
]

export function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const visibleItems = role === 'ADMIN' ? items : items.filter((item) => item.href !== '/admin/users')

  return (
    <nav className="mt-8 space-y-2">
      {visibleItems.map((item) => {
        const active = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              active
                ? 'bg-[#f19b32]/14 text-[#f19b32] border border-[#f19b32]/35'
                : 'border border-transparent text-white/75 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
