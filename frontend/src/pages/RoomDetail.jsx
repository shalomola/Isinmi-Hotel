import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft, LuUsers, LuCircleCheck } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingWidget from '../components/BookingWidget';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const RoomDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CATEGORIES.GET_BY_ID(id));
        setCategory(res.data?.category || res.data);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-center" style={{ minHeight: '60vh' }}>
          <div className="spinner" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !category) {
    return (
      <>
        <Navbar />
        <div className="empty-state" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="empty-state-title">Room Type Not Found</h2>
          <p className="empty-state-text" style={{ marginBottom: 24 }}>
            This room category doesn't exist or may have been removed.
          </p>
          <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--green-dark)', fontWeight: 600, justifyContent: 'center' }}>
            <LuArrowLeft size={16} /> Back to Rooms
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const features = category.features || [];
  const hasImage = category.image?.url;

  const description = category.description ||
    `Experience the finest comfort in our ${category.name} category. ` +
    `Every room is meticulously prepared with premium furnishings and modern amenities ` +
    `to ensure a truly restorative and memorable stay at Isinmi Hotel.`;

  // BookingWidget expects a "room" shaped object with category info
  const widgetData = {
    price: category.price,
    category: { _id: category._id, name: category.name },
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="room-detail-hero">
        {hasImage ? (
          <img src={category.image.url} alt={category.name} />
        ) : (
          <div style={{ height: '100%', background: 'linear-gradient(135deg, #1a3528 0%, #2d5c3f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96 }}>
            🛏
          </div>
        )}
        <div className="room-detail-hero-overlay" />
      </div>

      {/* Content */}
      <div className="room-detail-content">
        <div className="container">

          {/* Back link */}
          <Link
            to="/rooms"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 32, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--green-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <LuArrowLeft size={15} /> All Room Types
          </Link>

          <div className="room-detail-layout">
            {/* Left — info */}
            <div>
              <p className="room-detail-cat">Room Category</p>
              <h1 className="room-detail-name">{category.name}</h1>

              <div className="room-detail-price-row">
                <span className="room-detail-price">
                  {category.price > 0 ? `₦${category.price.toLocaleString()}` : 'Contact us'}
                </span>
                {category.price > 0 && (
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/night</span>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <LuUsers size={15} style={{ color: 'var(--green-dark)' }} />
                  Room assigned at booking
                </div>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="room-detail-features">
                  {features.map((f) => (
                    <span key={f._id} className="feature-chip" style={{ fontSize: 12, padding: '5px 14px' }}>
                      {f.name}
                    </span>
                  ))}
                </div>
              )}

              {/* About */}
              <h3 className="room-about-title">About This Room Type</h3>
              <p className="room-about-text">{description}</p>

              {/* How it works */}
              <div style={{ marginTop: 36, padding: 24, background: 'var(--green-light)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: 'var(--green-dark)', marginBottom: 14 }}>
                  How Booking Works
                </h4>
                {[
                  'Choose your dates and fill in your details on the right.',
                  'We\'ll assign you the best available room in this category.',
                  'You\'ll receive a confirmation email — click the link to secure your booking.',
                  'Arrive and enjoy your stay. It\'s that simple.',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <LuCircleCheck size={16} style={{ color: 'var(--green-mid)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Booking Widget */}
            <div>
              <BookingWidget room={widgetData} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomDetail;
