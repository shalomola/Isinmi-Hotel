import { Link } from 'react-router-dom';
import { LuFacebook, LuInstagram, LuMail, LuMapPin, LuPhone, LuTwitter } from 'react-icons/lu';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">Isinmi Hotel</Link>
            <p className="footer-desc">
              A calm Lagos stay for travelers who want good sleep, careful service,
              and a front desk that keeps the day moving.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Instagram"><LuInstagram /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><LuFacebook /></a>
              <a href="#" className="social-btn" aria-label="Twitter"><LuTwitter /></a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Explore</p>
            <nav className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/rooms">Rooms</Link>
              <a href="/#amenities">Amenities</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div>
            <p className="footer-col-title">Stay</p>
            <nav className="footer-links">
              <Link to="/rooms">Standard rooms</Link>
              <Link to="/rooms">Deluxe rooms</Link>
              <Link to="/rooms">Executive suites</Link>
              <Link to="/rooms">Family stays</Link>
            </nav>
          </div>

          <div>
            <p className="footer-col-title">Front desk</p>
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

        <div className="footer-bottom">
          <span>Copyright {year} Isinmi Hotel. All rights reserved.</span>
          <span>Designed for quieter arrivals.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
