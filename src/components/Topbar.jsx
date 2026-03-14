import React from 'react';
import { Menu } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="bg-[#22304e] h-12 flex items-center justify-between px-6 shadow-md z-10 shrink-0">
      {/* Hamburger button - only visible on mobile */}
      <button
        className="md:hidden text-white"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>
    </header>
  );
};

export default Topbar;