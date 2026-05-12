import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuBedDouble } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const CategoryCard = ({ category, index }) => {
  const features = category.features?.slice(0, 4) || [];
  const hasImage = category.image?.url;

  return (
    <article className="room-card room-card-wide" style={{ '--i': index }}>
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

        {category.description && (
          <p className="room-card-desc">{category.description}</p>
        )}

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
            Request <LuArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
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
        setCategories([]);
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
        <section className="page-header rooms-page-header">
          <div className="container page-header-grid">
            <div>
              <span className="page-header-tag">Accommodations</span>
              <h1 className="page-header-title">Choose the room that matches the day.</h1>
              <p className="page-header-sub">
                Browse by category. After you request a stay, the team assigns the best available room for your dates.
              </p>
            </div>
            <aside className="page-note">
              <LuBedDouble />
              <p>Need a quiet room, extra bedding, or late arrival support? Add it to your request.</p>
            </aside>
          </div>
        </section>

        <section className="section rooms-list-section">
          <div className="container">
            {loading ? (
              <div className="rooms-grid">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="room-card skeleton-card">
                    <div className="skeleton-media" />
                    <div className="room-card-body">
                      <div className="skeleton-line short" />
                      <div className="skeleton-line title" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line tiny" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-state-title">No room types available</h3>
                <p className="empty-state-text">Please check back soon or contact the front desk.</p>
              </div>
            ) : (
              <div className="rooms-grid">
                {categories.map((category, index) => (
                  <CategoryCard key={category._id} category={category} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Rooms;
