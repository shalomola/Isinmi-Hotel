import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import useUserAuth from '../../hooks/useUserAuth';
import { TableSkeleton } from '../../components/Skeleton.jsx';

const Guests = () => {
  useUserAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.BOOKINGS.GET_ALL);
      const bookings = response.data?.bookings || [];

      // Aggregate unique guests from bookings
      const guestMap = {};
      bookings.forEach((b) => {
        const key = b.guestEmail;
        if (!guestMap[key]) {
          guestMap[key] = {
            name: b.guestName,
            email: b.guestEmail,
            totalBookings: 0,
            totalSpent: 0,
            lastStay: null,
          };
        }
        guestMap[key].totalBookings += 1;
        guestMap[key].totalSpent += b.totalPrice || 0;
        const checkOut = new Date(b.checkOutDate);
        if (!guestMap[key].lastStay || checkOut > guestMap[key].lastStay) {
          guestMap[key].lastStay = checkOut;
        }
      });

      setGuests(Object.values(guestMap).sort((a, b) => b.totalBookings - a.totalBookings));
    } catch (error) {
      console.error('Error fetching guests:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu={'guests'}>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-800">All guests</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Guest name", "Email", "Total bookings", "Total spent", "Last stay"].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-sm text-gray-400 text-center">
                  No guests found.
                </td>
              </tr>
            ) : (
              guests.map((g) => (
                <tr
                  key={g.email}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{g.name}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{g.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{g.totalBookings}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-emerald-700">
                    {g.totalSpent > 0 ? `₦${g.totalSpent.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {g.lastStay
                      ? g.lastStay.toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Guests;
