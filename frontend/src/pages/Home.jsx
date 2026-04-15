import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LuWifi, LuDumbbell, LuWaves, LuUtensils, LuBike,
  LuSparkles, LuShirt, LuArrowRight,
} from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import heroImg from '../assets/hero.png';

const AMENITIES = [
  { icon: <LuWifi />,      label: 'Free Wi-Fi' },
  { icon: <LuUtensils />,  label: 'Restaurant' },
  { icon: <LuWaves />,     label: 'Swimming Pool' },
  { icon: <LuSparkles />,  label: 'Spa & Wellness' },
  { icon: <LuDumbbell />,  label: 'Fitness Center' },
  // { icon: <LuTv2 />,       label: 'Smart TV' },
  { icon: <LuShirt />,     label: 'Laundry Service' },
  { icon: <LuBike />,      label: 'Bicycle Rental' },
];

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
        // silently fail — homepage still renders
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <img src={'https://res.cloudinary.com/dcgdwxqau/image/upload/v1776247648/The_Lush_and_Luxurious_Sanya_EDITION_on_Hainan_Island_bmqpxi.jpg'} alt="" className="hero-bg" />
        {/* <div className="hero-overlay" /> */}

        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">✦ Welcome to Isinmi Hotel</span>
            <h1 className="hero-title">
              Where Comfort<br />
              Meets <em>Elegance</em>
            </h1>
            <p className="hero-sub">
              Discover a world-class retreat designed to delight your senses.
              Exceptional rooms, genuine hospitality, and memories that last a lifetime.
            </p>
            <div className="hero-actions">
              <Link to="/rooms" className="btn-hero-primary">
                Explore Rooms <LuArrowRight size={16} />
              </Link>
              <a href="#amenities" className="btn-hero-outline">
                Our Amenities
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats-bar">
          <div className="hero-stats-inner">
            {[
              { num: '50+', label: 'Luxury Rooms' },
              { num: '10+', label: 'Years of Excellence' },
              { num: '98%', label: 'Guest Satisfaction' },
              { num: '24/7', label: 'Concierge Service' },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ───────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Accommodations</span>
            <h2 className="section-title">Rooms & Suites</h2>
            <p className="section-subtitle">
              Each room is thoughtfully curated with premium furnishings,
              modern amenities, and refined details to ensure a truly restorative stay.
            </p>
          </div>

          {loading ? (
            <div className="rooms-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ height: 220, background: 'var(--cream-dark)' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 12, background: 'var(--cream-dark)', borderRadius: 6, marginBottom: 10, width: '40%' }} />
                    <div style={{ height: 18, background: 'var(--cream-dark)', borderRadius: 6, marginBottom: 16 }} />
                    <div style={{ height: 12, background: 'var(--cream-dark)', borderRadius: 6, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCategories.length > 0 ? (
            <div className="rooms-grid">
              {featuredCategories.map((cat) => (
                <div key={cat._id} className="room-card">
                  <div className="room-card-img">
                    {cat.image?.url
                      ? <img src={cat.image.url} alt={cat.name} />
                      : <div className="room-card-placeholder">🛏</div>
                    }
                  </div>
                  <div className="room-card-body">
                    <p className="room-card-cat">Room Category</p>
                    <h3 className="room-card-name">{cat.name}</h3>
                    {cat.features?.length > 0 && (
                      <div className="room-card-features">
                        {cat.features.slice(0, 3).map((f) => (
                          <span key={f._id} className="feature-chip">{f.name}</span>
                        ))}
                      </div>
                    )}
                    <div className="room-card-footer">
                      <div className="room-price">
                        <span className="price-amount">
                          {cat.price > 0 ? `₦${cat.price.toLocaleString()}` : 'Contact us'}
                        </span>
                        {cat.price > 0 && <span className="price-night">/night</span>}
                      </div>
                      <Link to={`/rooms/${cat._id}`} className="room-card-btn">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/rooms" className="btn-hero-outline" style={{ color: 'var(--green-dark)', borderColor: 'var(--green-dark)', borderRadius: 'var(--radius-full)', padding: '12px 32px', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
              View All Rooms <LuArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Amenities ────────────────────────────── */}
      <section className="section amenities-bg" id="amenities">
        <div className="container">
          <div className="section-header centered">
            <span className="section-tag">Resort-Style Living</span>
            <h2 className="section-title">Discover Our Amenities</h2>
            <p className="section-subtitle">
              Immerse yourself in a world of relaxation and recreation.
              Everything you need is right here.
            </p>
          </div>

          <div className="amenities-grid">
            {AMENITIES.map(({ icon, label }) => (
              <div key={label} className="amenity-card">
                <span className="amenity-icon">{icon}</span>
                <span className="amenity-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2 className="cta-title">Ready to Experience Isinmi?</h2>
            <p className="cta-sub">
              Book your stay today and let us take care of the rest.
              Exceptional comfort awaits you.
            </p>
            <Link to="/rooms" className="cta-btn">
              Reserve a Room
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
