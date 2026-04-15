import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import ModalInput from '../Inputs/ModalInput.jsx';

const AddBookingForm = ({ onAddBooking }) => {
  const [booking, setBooking] = useState({
    categoryId: "",
    guestName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    numOfGuests: 1,
    specialRequests: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (key, value) => setBooking({ ...booking, [key]: value });

  return (
    <div className="flex flex-col gap-3">
      {/* Category dropdown */}
      <div>
        <label className="text-[13px] text-slate-600">Category</label>
        <div className="form-input-box mt-1">
          <select
            value={booking.categoryId}
            onChange={({ target }) => handleChange('categoryId', target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-700"
          >
            <option value="">
              {loadingCategories ? 'Loading categories...' : 'Select a category'}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ModalInput
          value={booking.guestName}
          onChange={({ target }) => handleChange('guestName', target.value)}
          label="Guest Name"
          placeholder="Enter guest name"
          type="text"
        />
        <ModalInput
          value={booking.guestEmail}
          onChange={({ target }) => handleChange('guestEmail', target.value)}
          label="Guest Email"
          placeholder="Enter guest email"
          type="email"
        />
        <ModalInput
          value={booking.checkInDate}
          onChange={({ target }) => handleChange('checkInDate', target.value)}
          label="Check-in Date"
          placeholder=""
          type="date"
        />
        <ModalInput
          value={booking.checkOutDate}
          onChange={({ target }) => handleChange('checkOutDate', target.value)}
          label="Check-out Date"
          placeholder=""
          type="date"
        />
        <ModalInput
          value={booking.numOfGuests}
          onChange={({ target }) => handleChange('numOfGuests', target.value)}
          label="Number of Guests"
          placeholder="1"
          type="number"
        />
      </div>

      <div>
        <label className="text-[13px] text-slate-600">
          Special Requests <span className="text-gray-400">(optional)</span>
        </label>
        <div className="form-input-box mt-1">
          <textarea
            rows={3}
            placeholder="Any special requests..."
            value={booking.specialRequests}
            onChange={({ target }) => handleChange('specialRequests', target.value)}
            className="w-full bg-transparent outline-none text-sm resize-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddBooking(booking)}
        className="w-full mt-2 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        Create Booking
      </button>
    </div>
  );
};

export default AddBookingForm;