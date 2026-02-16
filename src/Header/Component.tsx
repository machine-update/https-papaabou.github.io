import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  let headerData: Header
  try {
    headerData = await getCachedGlobal('header', 1)()
  } catch (error) {
    console.warn('Header global unavailable, using fallback navigation.', error)
    headerData = { navItems: [] } as unknown as Header
  }

  return <HeaderClient data={headerData} />
}
