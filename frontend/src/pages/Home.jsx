import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LuArrowRight,
  LuBath,
  LuBike,
  LuCalendarDays,
  LuCar,
  LuClock3,
  LuCoffee,
  LuDumbbell,
  LuMapPin,
  LuShieldCheck,
  LuShirt,
  LuSparkles,
  LuUtensils,
  LuWaves,
  LuWifi,
} from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const HERO_IMAGE =
  'https://res.cloudinary.com/dcgdwxqau/image/upload/v1776247648/The_Lush_and_Luxurious_Sanya_EDITION_on_Hainan_Island_bmqpxi.jpg';

const AMENITIES = [
  { icon: <LuWifi />, label: 'Fast Wi-Fi', desc: 'Quiet work, video calls, and streaming without the hallway shuffle.' },
  { icon: <LuUtensils />, label: 'Kitchen Table', desc: 'Seasonal plates, late breakfast, and light meals after meetings.' },
  { icon: <LuWaves />, label: 'Pool Court', desc: 'A shaded water courtyard for slow mornings and warm evenings.' },
  { icon: <LuSparkles />, label: 'Wellness Room', desc: 'Massage, steam, and recovery rituals arranged on request.' },
  { icon: <LuDumbbell />, label: 'Training Studio', desc: 'Compact strength and cardio equipment for daily routines.' },
  { icon: <LuShirt />, label: 'Laundry Care', desc: 'Pressed shirts, same-day refreshes, and travel-ready packing.' },
  { icon: <LuBike />, label: 'City Rides', desc: 'Bicycles and driver support for close-by errands and discovery.' },
];

const SERVICE_NOTES = [
  { icon: <LuClock3 />, title: 'Late arrivals handled calmly', text: 'Send your flight time. We keep the handover simple.' },
  { icon: <LuCoffee />, title: 'Breakfast without a rush', text: 'Choose an early tray, courtyard table, or in-room coffee.' },
  { icon: <LuCar />, title: 'Airport transfers on request', text: 'A driver can meet you at arrivals and bring you straight in.' },
  { icon: <LuShieldCheck />, title: 'Secure, private stay', text: 'Discreet access, attentive staff, and a front desk that knows your plans.' },
];

const RoomSkeleton = () => (
  <div className="room-card skeleton-card">
    <div className="skeleton-media" />
    <div className="room-card-body">
      <div className="skeleton-line short" />
      <div className="skeleton-line title" />
      <div className="skeleton-line" />
      <div className="skeleton-line tiny" />
    </div>
  </div>
);

const CategoryCard = ({ category, index }) => {
  const features = category.features?.slice(0, 3) || [];
  const hasImage = category.image?.url;

  return (
    <article className="room-card" style={{ '--i': index }}>
      <Link to={`/rooms/${category._id}`} className="room-card-img" aria-label={`View ${category.name}`}>
        {hasImage ? (
          <img src={category.image.url} alt={category.name} />
        ) : (
          <div className="room-card-placeholder">
            <span>Isinmi</span>
          </div>
        )}
      </Link>
      <div className="room-card-body">
        <p className="room-card-cat">Room Category</p>
        <h3 className="room-card-name">{category.name}</h3>
        {features.length > 0 && (
          <div className="room-card-features">
            {features.map((feature) => (
              <span key={feature._id} className="feature-chip">{feature.name}</span>
            ))}
          </div>
        )}
        <div className="room-card-footer">
          <div className="room-price">
            <span className="price-amount">
              {category.price > 0 ? `NGN ${category.price.toLocaleString()}` : 'Contact us'}
            </span>
            {category.price > 0 && <span className="price-night">per night</span>}
          </div>
          <Link to={`/rooms/${category._id}`} className="room-card-btn">
            Book <LuArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const Home = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        const cats = res.data?.categories || [];
        setFeaturedCategories(cats.slice(0, 3));
      } catch {
        setFeaturedCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            <img src={HERO_IMAGE} alt="" />
          </div>

          <div className="hero-shell">
            <div className="hero-content">
              <span className="hero-eyebrow">Isinmi Hotel, Lagos</span>
              <h1 className="hero-title">A softer landing after the city.</h1>
              <p className="hero-sub">
                Tucked into a calm Lagos address, Isinmi pairs composed rooms,
                steady service, and enough privacy to make a short stay feel fully reset.
              </p>
              <div className="hero-actions">
                <Link to="/rooms" className="btn btn-primary">
                  View rooms <LuArrowRight size={16} />
                </Link>
                <a href="#amenities" className="btn btn-quiet">
                  Amenities
                </a>
              </div>
            </div>

            <aside className="arrival-panel" aria-label="Arrival highlights">
              <div>
                <span className="arrival-kicker">Tonight at Isinmi</span>
                <p>Courtyard dinner until 22:30</p>
              </div>
              <div className="arrival-row">
                <LuCalendarDays />
                <span>Flexible check-in by arrangement</span>
              </div>
              <div className="arrival-row">
                <LuMapPin />
                <span>Victoria Island access without the noise</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section intro-section">
          <div className="container intro-grid">
            <div>
              <span className="section-tag">The mood</span>
              <h2 className="section-title">Hotel comfort with the pace turned down.</h2>
            </div>
            <p className="section-subtitle">
              Isinmi is built for guests who need their room to do more than hold luggage.
              Rest properly, prepare for the next meeting, host a quiet breakfast, or arrive late
              and still feel expected.
            </p>
          </div>
        </section>

        <section className="section rooms-section">
          <div className="container">
            <div className="split-header">
              <div>
                <span className="section-tag">Stay options</span>
                <h2 className="section-title">Rooms shaped for recovery, work, and unhurried mornings.</h2>
              </div>
              <Link to="/rooms" className="text-link">
                See every room <LuArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="rooms-grid">
                {[0, 1, 2].map((item) => <RoomSkeleton key={item} />)}
              </div>
            ) : featuredCategories.length > 0 ? (
              <div className="rooms-grid">
                {featuredCategories.map((category, index) => (
                  <CategoryCard key={category._id} category={category} index={index} />
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <h3 className="empty-state-title">Rooms are being prepared</h3>
                <p className="empty-state-text">Please check again soon or contact the front desk.</p>
              </div>
            )}
          </div>
        </section>

        <section className="section amenities-section" id="amenities">
          <div className="container amenities-layout">
            <div className="amenities-copy">
              <span className="section-tag">Amenities</span>
              <h2 className="section-title">The details that make a stay feel handled.</h2>
              <p className="section-subtitle">
                Small comforts matter when travel days are full. The essentials are close,
                the service is human, and the pace stays easy.
              </p>
            </div>

            <div className="amenities-grid">
              {AMENITIES.map(({ icon, label, desc }) => (
                <article key={label} className="amenity-card">
                  <span className="amenity-icon">{icon}</span>
                  <div>
                    <h3 className="amenity-label">{label}</h3>
                    <p>{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section service-section">
          <div className="container service-grid">
            <div className="service-image">
              <img src="https://picsum.photos/seed/isinmi-lounge/1100/1400" alt="Hotel lounge with warm seating" />
            </div>
            <div className="service-list">
              <span className="section-tag">Guest rhythm</span>
              <h2 className="section-title">A front desk that remembers the practical things.</h2>
              {SERVICE_NOTES.map(({ icon, title, text }) => (
                <article key={title} className="service-note">
                  <span>{icon}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <span className="section-tag">Reservations</span>
            <h2 className="cta-title">Arrive with less to manage.</h2>
            <p className="cta-sub">
              Choose a room category, send your dates, and our team will confirm the best available room.
            </p>
            <Link to="/rooms" className="btn btn-light">
              Reserve a room <LuArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
