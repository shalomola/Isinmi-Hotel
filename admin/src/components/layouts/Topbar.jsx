import React from 'react'
import { PAGE_TITLES } from '../../utils/data.js'

const Topbar = ({ activeMenu }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-7 h-14 flex items-center justify-between shrink-0">
        <div>
        <p className="text-sm font-medium text-gray-900">
          {PAGE_TITLES[activeMenu]?.title ?? 'Dashboard'}
        </p>
        <p className="text-xs text-gray-400">
          {PAGE_TITLES[activeMenu]?.sub ?? ''}
        </p>
        </div>
        <div className="flex items-center gap-3">
        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">2026</span>
        <span className="text-xs text-gray-400">April 13, 2026</span>
        </div>
    </header>
  )
}

export default Topbar