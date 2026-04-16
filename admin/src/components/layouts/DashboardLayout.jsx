import { useState, useEffect } from 'react';
import SideMenu from './SideMenu.jsx';
import Topbar from './Topbar.jsx';

const DashboardLayout = ({ children, activeMenu }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when viewport widens to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SideMenu
        activeMenu={activeMenu}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          activeMenu={activeMenu}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
