import React, { useContext, useState } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data.js'
import { UserContext } from '../../context/userContext.jsx'
import { useNavigate } from 'react-router-dom'
import CharAvatar from '../Cards/CharAvatar.jsx'
import useRouteHandlers from '../../hooks/useRouteHandlers.jsx'

const SideMenu = ({activeMenu, page, setPage}) => {
    const { handleClick } = useRouteHandlers();
    
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
            <p className="text-base font-medium tracking-tight text-gray-900">Isinmi Hotel</p>
            <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mb-2">Overview</p>
            {SIDE_MENU_DATA.slice(0, 1).map((item) => (
            <button key={item.id} onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${activeMenu == item.label ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className=" text-black"><item.icon /></span>{item.label}
            </button>
            ))}
            <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mt-4 mb-2">Manage</p>
            {SIDE_MENU_DATA.slice(1, 5).map((item) => (
            <button key={item.id} onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${activeMenu == item.label ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className="text-base"><item.icon /></span>{item.label}
            </button>
            ))}
            <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mt-4 mb-2">System</p>
            {SIDE_MENU_DATA.slice(5).map((item) => (
            <button key={item.id} onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${activeMenu == item.label ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className="text-base"><item.icon /></span>{item.label}
            </button>
            ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">SA</div>
            <div>
                <p className="text-xs font-medium text-gray-800">Super Admin</p>
                <p className="text-[10px] text-gray-400">isinmihotel.com</p>
            </div>
            </div>
        </div>
    </aside>
  )
}

export default SideMenu