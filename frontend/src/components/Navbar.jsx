import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={close} aria-label="Isinmi Hotel home">
          <span className="logo-mark">I</span>
          <span>Isinmi Hotel</span>
        </Link>

        <div className={`navbar-links${open ? ' open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/rooms" onClick={close}>Rooms</NavLink>
          <a href="/#amenities" onClick={close}>Amenities</a>
          <a href="#contact" onClick={close}>Contact</a>
        </div>

        <div className="navbar-right">
          <Link to="/rooms" className="navbar-book-btn" onClick={close}>
            Book a stay
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
