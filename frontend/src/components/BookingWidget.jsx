import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const today = () => new Date().toISOString().split('T')[0];

const BookingWidget = ({ room }) => {
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    checkInDate: '',
    checkOutDate: '',
    numOfGuests: 1,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Live price estimate
  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    const diff = (new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86400000;
    return diff > 0 ? diff : 0;
  }, [form.checkInDate, form.checkOutDate]);

  const totalEstimate = nights * (room?.price ?? 0);

  const handleSubmit = async () => {
    const { guestName, guestEmail, checkInDate, checkOutDate, numOfGuests } = form;

    if (!guestName.trim()) { toast.error('Please enter your name'); return; }
    if (!/\S+@\S+\.\S+/.test(guestEmail)) { toast.error('Please enter a valid email'); return; }
    if (!checkInDate) { toast.error('Please select a check-in date'); return; }
    if (!checkOutDate) { toast.error('Please select a check-out date'); return; }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error('Check-out must be after check-in');
      return;
    }

    const categoryId = room?.category?._id ?? room?.category;
    if (!categoryId) { toast.error('Room category unavailable'); return; }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.BOOKINGS.CREATE, {
        categoryId,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        checkInDate,
        checkOutDate,
        numOfGuests: Number(numOfGuests),
        specialRequests: form.specialRequests.trim(),
      });

      toast.success('Booking request sent! Check your email to confirm.');
      setForm({
        guestName: '',
        guestEmail: '',
        checkInDate: '',
        checkOutDate: '',
        numOfGuests: 1,
        specialRequests: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-widget">
      {/* Header */}
      <div className="widget-header">
        <div className="widget-price">
          ₦{room?.price?.toLocaleString() ?? '—'}
        </div>
        <p className="widget-price-note">per night · prices may vary by season</p>
      </div>

      {/* Form */}
      <div className="widget-body">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Amara Okafor"
            value={form.guestName}
            onChange={({ target }) => handleChange('guestName', target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={form.guestEmail}
            onChange={({ target }) => handleChange('guestEmail', target.value)}
          />
        </div>

        <div className="form-row form-group">
          <div>
            <label className="form-label">Check-in</label>
            <input
              className="form-input"
              type="date"
              min={today()}
              value={form.checkInDate}
              onChange={({ target }) => handleChange('checkInDate', target.value)}
            />
          </div>
          <div>
            <label className="form-label">Check-out</label>
            <input
              className="form-input"
              type="date"
              min={form.checkInDate || today()}
              value={form.checkOutDate}
              onChange={({ target }) => handleChange('checkOutDate', target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Number of Guests</label>
          <select
            className="form-input"
            value={form.numOfGuests}
            onChange={({ target }) => handleChange('numOfGuests', target.value)}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Special Requests <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            className="form-input form-textarea"
            placeholder="Dietary requirements, accessibility needs, early check-in..."
            value={form.specialRequests}
            onChange={({ target }) => handleChange('specialRequests', target.value)}
          />
        </div>

        {/* Price preview */}
        {nights > 0 && (
          <div className="price-summary">
            <span className="price-summary-label">
              ₦{room?.price?.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span className="price-summary-value">
              ₦{totalEstimate.toLocaleString()}
            </span>
          </div>
        )}

        <button
          className="widget-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sending Request…' : 'Request to Book'}
        </button>

        <p className="widget-note">
          You won't be charged yet. A confirmation link will be sent to your email.
        </p>
      </div>
    </div>
  );
};

export default BookingWidget;
