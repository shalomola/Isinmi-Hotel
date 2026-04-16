import { LuMenu } from 'react-icons/lu';
import { PAGE_TITLES } from '../../utils/data.js';

const Topbar = ({ activeMenu, onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-7 h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          aria-label="Open menu"
        >
          <LuMenu size={20} />
        </button>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {PAGE_TITLES[activeMenu]?.title ?? 'Dashboard'}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            {PAGE_TITLES[activeMenu]?.sub ?? ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">2026</span>
        <span className="text-xs text-gray-400 hidden sm:block">April 13, 2026</span>
      </div>
    </header>
  );
};

export default Topbar;
