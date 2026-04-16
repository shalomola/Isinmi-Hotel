import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx';
import Badge from '../../components/Badge.jsx';
import useUserAuth from '../../hooks/useUserAuth'
import { API_PATHS } from '../../utils/apiPaths.js';
import Modal from '../../components/Modal.jsx';
import DeleteAlert from '../../components/DeleteAlert.jsx';
import AddBookingForm from '../../components/Bookings/AddBookingForm.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import toast from 'react-hot-toast';
import { LuCalendarPlus } from "react-icons/lu";
import { TableSkeleton } from '../../components/Skeleton.jsx';
import { LuPencil, LuTrash2 } from "react-icons/lu";


const STATUSES = ['pending', 'confirmed', 'in-progress', 'cancelled', 'completed'];

const EditBookingForm = ({ booking, onSave, onClose }) => {
  const [form, setForm] = useState({
    bookingStatus: booking.bookingStatus,
    isPaid: booking.isPaid || false,
    checkInDate: booking.checkInDate?.slice(0, 10) ?? '',
    checkOutDate: booking.checkOutDate?.slice(0, 10) ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (form.checkInDate && form.checkOutDate && new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.put(API_PATHS.BOOKINGS.UPDATE(booking._id), form);
      toast.success('Booking updated');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select
          value={form.bookingStatus}
          onChange={(e) => set('bookingStatus', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Check-in Date</label>
        <input
          type="date"
          value={form.checkInDate}
          onChange={(e) => set('checkInDate', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Check-out Date</label>
        <input
          type="date"
          value={form.checkOutDate}
          onChange={(e) => set('checkOutDate', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set('isPaid', !form.isPaid)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.isPaid ? 'bg-emerald-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isPaid ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className="text-sm text-gray-700">Mark as Paid</span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const Bookings = () => {
  useUserAuth();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("all");
  const filters = ["all", "confirmed", "pending", "in-progress", "cancelled", "completed"];
  const filtered = filter === "all" ? bookingData : bookingData.filter((b) => b.bookingStatus === filter);

  const [openAddBookingModal, setOpenAddBookingModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const handleAddBooking = async (booking) => {
    const { categoryId, guestName, guestEmail, checkInDate, checkOutDate, numOfGuests, specialRequests } = booking;

    if (!categoryId) { toast.error('Please select a category'); return; }
    if (!guestName.trim()) { toast.error('Guest name is required'); return; }
    if (!guestEmail.trim()) { toast.error('Guest email is required'); return; }
    if (!checkInDate) { toast.error('Check-in date is required'); return; }
    if (!checkOutDate) { toast.error('Check-out date is required'); return; }
    if (new Date(checkOutDate) <= new Date(checkInDate)) { toast.error('Check-out must be after check-in'); return; }
    if (!numOfGuests || isNaN(numOfGuests) || Number(numOfGuests) < 1) { toast.error('Number of guests must be at least 1'); return; }

    try {
      await axiosInstance.post(API_PATHS.BOOKINGS.CREATE, {
        categoryId, guestName, guestEmail, checkInDate, checkOutDate,
        numOfGuests: Number(numOfGuests), specialRequests,
      });
      setOpenAddBookingModal(false);
      toast.success('Booking added successfully');
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await axiosInstance.delete(API_PATHS.BOOKINGS.DELETE(deleteTarget._id));
      toast.success('Booking deleted');
      setDeleteTarget(null);
      fetchBookingDetails();
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.BOOKINGS.GET_ALL);
      if (response.data?.bookings) setBookingData(response.data.bookings);
    } catch (error) {
      console.log('Error fetching booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu={'bookings'}>
      <div>
        <div className="flex gap-2 mb-5">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs capitalize border transition-all ${filter === f ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["#", "Guest", "Email", "Room", "Check-in", "Check-out", "Total", "Paid", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={6} cols={10} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-sm text-gray-400 text-center">No bookings found.</td></tr>
              ) : filtered.map((b) => (
                <tr key={b._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400">{b._id.slice(-5).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.guestName}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{b.guestEmail}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.room?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.totalPrice ? `₦${b.totalPrice.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${b.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      {b.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge status={b.bookingStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setEditTarget(b)}
                        className="text-sm text-slate-400 hover:text-emerald-900 hover:underline cursor-pointer"
                      >
                        <LuPencil />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        className="text-sm text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Add booking FAB */}
        <button
          onClick={() => setOpenAddBookingModal(true)}
          className="absolute bottom-10 right-10 z-50 w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl cursor-pointer"
        >
          <LuCalendarPlus />
        </button>

        {/* Add booking modal */}
        <Modal isOpen={openAddBookingModal} onClose={() => setOpenAddBookingModal(false)} title="Create Booking">
          <AddBookingForm onAddBooking={handleAddBooking} />
        </Modal>

        {/* Edit booking modal */}
        <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Booking">
          {editTarget && (
            <EditBookingForm
              booking={editTarget}
              onSave={() => { setEditTarget(null); fetchBookingDetails(); }}
              onClose={() => setEditTarget(null)}
            />
          )}
        </Modal>

        {/* Delete confirmation modal */}
        <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Booking">
          <DeleteAlert
            content={`Are you sure you want to permanently delete the booking for ${deleteTarget?.guestName}? This cannot be undone.`}
            onDelete={handleDeleteBooking}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
