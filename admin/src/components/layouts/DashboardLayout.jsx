import React from 'react'
import Navbar from './Navbar.jsx'
import SideMenu from './SideMenu.jsx'
import { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext.jsx'
import Topbar from './Topbar.jsx'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    const [page, setPage] = useState("dashboard");
    
    // ensure Topbar always receives an object with a title property
    const topbarPage = typeof page === 'string' ? { title: page } : page;
    
      return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
          {/* Sidebar */}
          <SideMenu activeMenu={activeMenu} page={page} setPage={setPage} />

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Topbar */}
            <Topbar activeMenu={activeMenu} />

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-7">
                {children}
            </main>

          </div>
        </div>
      );
}

export default DashboardLayout