import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const CategoryCard = ({ category }) => {
  const features = category.features?.slice(0, 3) || [];
  const hasImage = category.image?.url;

  return (
    <div className="room-card">
      {/* Image */}
      <div className="room-card-img">
        {hasImage ? (
          <img src={category.image.url} alt={category.name} />
        ) : (
          <div className="room-card-placeholder">🛏</div>
        )}
      </div>

      {/* Body */}
      <div className="room-card-body">
        <p className="room-card-cat">Room Category</p>
        <h3 className="room-card-name">{category.name}</h3>

        {category.description && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            {category.description}
          </p>
        )}

        {/* {features.length > 0 && (
          <div className="room-card-features">
            {features.map((f) => (
              <span key={f._id} className="feature-chip">{f.name}</span>
            ))}
            {category.features.length > 3 && (
              <span className="feature-chip" style={{ background: 'var(--cream-dark)', color: 'var(--text-muted)' }}>
                +{category.features.length - 3} more
              </span>
            )}
          </div>
        )} */}

        <div className="room-card-footer">
          <div className="room-price">
            <span className="price-amount">
              {category.price > 0 ? `₦${category.price.toLocaleString()}` : 'Contact us'}
            </span>
            {category.price > 0 && <span className="price-night">/night</span>}
          </div>
          <Link to={`/rooms/${category._id}`} className="room-card-btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const Rooms = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        setCategories(res.data?.categories || []);
      } catch {
        // empty state renders below
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <span className="page-header-tag">Accommodations</span>
            <h1 className="page-header-title">Rooms & Suites</h1>
            <p className="page-header-sub">
              Choose your preferred room type and we'll assign you the perfect room.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="rooms-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ height: 220, background: 'var(--cream-dark)' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 11, background: 'var(--cream-dark)', borderRadius: 6, marginBottom: 10, width: '35%' }} />
                    <div style={{ height: 18, background: 'var(--cream-dark)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 11, background: 'var(--cream-dark)', borderRadius: 6, width: '55%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No room types available</h3>
              <p className="empty-state-text">Please check back soon.</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Rooms;
