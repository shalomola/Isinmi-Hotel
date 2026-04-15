import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-circle">I</div>
          Isinmi Hotel
        </Link>

        {/* Nav Links */}
        <div className={`navbar-links${open ? ' open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/rooms" onClick={() => setOpen(false)}>Rooms</NavLink>
          <a href="#amenities" onClick={() => setOpen(false)}>Amenities</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>

        {/* Right actions */}
        <div className="navbar-right">
          <Link to="/rooms" className="navbar-book-btn" onClick={() => setOpen(false)}>
            Book Now
          </Link>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
