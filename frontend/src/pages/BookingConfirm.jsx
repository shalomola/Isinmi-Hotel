import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuCircleCheck, LuCircleX, LuCircleAlert, LuArrowRight, LuCalendar, LuBed } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';

const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

const STATE = {
  confirmed:        { icon: LuCircleCheck, color: '#15803d', bg: '#f0faf3', border: '#bbf7d0', label: 'Confirmed!' },
  already_confirmed:{ icon: LuCircleCheck, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Already Confirmed' },
  cancelled:        { icon: LuCircleX,     color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Booking Cancelled' },
  not_found:        { icon: LuCircleAlert, color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Not Found' },
  error:            { icon: LuCircleX,     color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Something Went Wrong' },
};

const BookingConfirm = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const confirm = async () => {
      try {
        const res = await axiosInstance.get(`/api/booking/confirm/${id}`);
        setResult(res.data);
      } catch (err) {
        setResult(
          err.response?.data || { status: 'error', message: 'An unexpected error occurred.' }
        );
      } finally {
        setLoading(false);
      }
    };
    confirm();
  }, [id]);

  const status = result?.status;
  const meta   = STATUS_META(status);

  return (
    <>
      <Navbar />

      <section style={{ minHeight: 'calc(100vh - 70px - 280px)', padding: '80px 0', background: 'var(--cream)' }}>
        <div className="container" style={{ maxWidth: 640 }}>

          {loading ? (
            <div className="loading-center" style={{ minHeight: 320 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

              {/* Coloured top bar */}
              <div style={{ height: 5, background: meta.color }} />

              {/* Icon + heading */}
              <div style={{ padding: '48px 48px 32px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 72, height: 72, borderRadius: '50%',
                  background: meta.bg, border: `2px solid ${meta.border}`,
                  marginBottom: 20,
                }}>
                  <meta.icon size={34} style={{ color: meta.color }} />
                </div>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 36, fontWeight: 500, color: 'var(--green-dark)',
                  margin: '0 0 12px', lineHeight: 1.2,
                }}>
                  {meta.label}
                </h1>

                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                  {result?.message}
                </p>
              </div>

              {/* Booking details — shown on success / already confirmed */}
              {(status === 'confirmed' || status === 'already_confirmed') && result?.checkInDate && (
                <>
                  <div style={{ height: 1, background: 'var(--border)', margin: '0 48px' }} />

                  <div style={{ padding: '28px 48px' }}>
                    <p style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                      textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16,
                    }}>
                      Booking Summary
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {result.guestName && (
                        <DetailRow icon={<LuBed size={15} />} label="Guest" value={result.guestName} />
                      )}
                      {result.roomName && (
                        <DetailRow icon={<LuBed size={15} />} label="Room" value={result.roomName} />
                      )}
                      <DetailRow
                        icon={<LuCalendar size={15} />}
                        label="Check-in"
                        value={fmt(result.checkInDate)}
                      />
                      <DetailRow
                        icon={<LuCalendar size={15} />}
                        label="Check-out"
                        value={fmt(result.checkOutDate)}
                      />
                      {result.daysOfStay && (
                        <DetailRow icon={<LuCalendar size={15} />} label="Duration"
                          value={`${result.daysOfStay} night${result.daysOfStay !== 1 ? 's' : ''}`}
                        />
                      )}
                      {result.totalPrice && (
                        <DetailRow icon={<LuCalendar size={15} />} label="Total"
                          value={`₦${result.totalPrice.toLocaleString()}`}
                          bold
                        />
                      )}
                    </div>
                  </div>

                  {/* Warm note */}
                  {status === 'confirmed' && (
                    <div style={{ margin: '0 48px 28px', padding: '18px 22px', background: 'var(--green-light)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--gold)' }}>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                        A confirmation receipt has been sent to <strong style={{ color: 'var(--green-dark)' }}>{result.guestEmail}</strong>.
                        We look forward to welcoming you to {import.meta.env.VITE_HOTEL_NAME || 'Isinmi Hotel'}.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* CTA */}
              <div style={{ padding: '0 48px 48px', textAlign: 'center' }}>
                <Link
                  to="/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 32px', background: 'var(--green-dark)', color: 'white',
                    borderRadius: 'var(--radius-full)', fontSize: 14, fontWeight: 600,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--green-mid)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--green-dark)'}
                >
                  Back to Home <LuArrowRight size={15} />
                </Link>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

const DetailRow = ({ icon, label, value, bold }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--cream)', borderRadius: 'var(--radius)' }}>
    <span style={{ color: 'var(--green-dark)', flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-muted)', width: 90, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: 'var(--green-dark)' }}>{value}</span>
  </div>
);

/* Map status string → visual config */
const STATUS_META = (status) =>
  STATE[status] ?? STATE.error;

export default BookingConfirm;
