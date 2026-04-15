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



const Bookings = () => {
  useUserAuth();
    const [bookingData, setBookingData] = useState([])
    const [loading, setLoading] = useState(false)


    const [filter, setFilter] = useState("all");
    const filters = ["all", "confirmed", "pending", "cancelled", "completed"];
    const filtered = filter === "all" ? bookingData : bookingData.filter((b) => b.bookingStatus === filter);

    const [openAddBookingModal, setOpenAddBookingModal] = useState(false)

    useEffect(() => {
      fetchBookingDetails();
    }, []);

    // Handle add booking
    const handleAddBooking = async (booking) => {
      const { categoryId, guestName, guestEmail, checkInDate, checkOutDate, numOfGuests, specialRequests } = booking;

      if (!categoryId) {
        toast.error('Please select a category');
        return;
      }
      if (!guestName.trim()) {
        toast.error('Guest name is required');
        return;
      }
      if (!guestEmail.trim()) {
        toast.error('Guest email is required');
        return;
      }
      if (!checkInDate) {
        toast.error('Check-in date is required');
        return;
      }
      if (!checkOutDate) {
        toast.error('Check-out date is required');
        return;
      }
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        toast.error('Check-out date must be after check-in date');
        return;
      }
      if (!numOfGuests || isNaN(numOfGuests) || Number(numOfGuests) < 1) {
        toast.error('Number of guests must be at least 1');
        return;
      }

      try {
        await axiosInstance.post(`${API_PATHS.BOOKINGS.CREATE}`, {
          categoryId,
          guestName,
          guestEmail,
          checkInDate,
          checkOutDate,
          numOfGuests: Number(numOfGuests),
          specialRequests,
        });

        setOpenAddBookingModal(false);
        toast.success('Booking added successfully');
        fetchBookingDetails();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    };

    // Get all booking Details
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKINGS.GET_ALL);
        if (response.data?.bookings) {
          setBookingData(response.data.bookings);
        }
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
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["#", "Guest", "Email", "Room", "Check-in", "Check-out", "Total", "Booked by", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={6} cols={9} />
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-sm text-gray-400 text-center">No bookings found.</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400">{b._id.slice(-5).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.guestName}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{b.guestEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.room?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.totalPrice ? `₦${b.totalPrice.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.bookedBy?.name ?? 'Self'}</td>
                    <td className="px-4 py-3"><Badge status={b.bookingStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="newBooking">
            <button onClick={() => setOpenAddBookingModal(true)} className="absolute bottom-10 right-10 z-50 w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl cursor-pointer">
              <LuCalendarPlus />
            </button>
          </div>

          <Modal
            isOpen={openAddBookingModal}
            onClose={() => setOpenAddBookingModal(false)}
            title="Create Booking"
          >
            {/* Modal content goes here */}
            <AddBookingForm onAddBooking={handleAddBooking} />
          </Modal>

          {/* <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Income"
          >
            <DeleteAlert 
              content={`Are you sure you want to delete this income source?`}
              onDelete={() => {
                // Call the delete function here
                handleDeleteIncome(openDeleteAlert.data);
              }}
            />
          </Modal> */}

          
        </div>
      </DashboardLayout>
    );
}

export default Bookings