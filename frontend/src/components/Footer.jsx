import { Link } from 'react-router-dom';
import { LuMapPin, LuPhone, LuMail, LuInstagram, LuFacebook, LuTwitter } from 'react-icons/lu';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <span className="footer-logo">Isinmi Hotel</span>
            <p className="footer-desc">
              A sanctuary of comfort and elegance. We craft unforgettable
              experiences for every guest, from business travellers to
              families seeking a restful escape.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Instagram"><LuInstagram /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><LuFacebook /></a>
              <a href="#" className="social-btn" aria-label="Twitter"><LuTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-col-title">Quick Links</p>
            <nav className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/rooms">Rooms & Suites</Link>
              <a href="#amenities">Amenities</a>
              <a href="#contact">Contact Us</a>
            </nav>
          </div>

          {/* Rooms */}
          <div>
            <p className="footer-col-title">Our Rooms</p>
            <nav className="footer-links">
              <Link to="/rooms">Standard Rooms</Link>
              <Link to="/rooms">Deluxe Rooms</Link>
              <Link to="/rooms">Executive Suites</Link>
              <Link to="/rooms">Family Rooms</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-title">Contact</p>
            <div className="footer-contact-row">
              <LuMapPin className="footer-contact-icon" />
              <span>123 Isinmi Close, Victoria Island, Lagos, Nigeria</span>
            </div>
            <div className="footer-contact-row">
              <LuPhone className="footer-contact-icon" />
              <span>+234 800 000 0000</span>
            </div>
            <div className="footer-contact-row">
              <LuMail className="footer-contact-icon" />
              <span>hello@isinmihotel.com</span>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>© {year} Isinmi Hotel. All rights reserved.</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Crafted with care.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
