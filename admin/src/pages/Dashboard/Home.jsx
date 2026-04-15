import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx';
import StatCard from '../../components/Cards/StatCard.jsx';
import Badge from '../../components/Badge.jsx';
import useRouteHandlers from '../../hooks/useRouteHandlers.jsx';
import useUserAuth from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { FaBed } from "react-icons/fa";
import { TbCoins } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsHourglassSplit } from "react-icons/bs";
import { StatCardSkeleton, TableSkeleton, OccupancySkeleton, ActivitySkeleton } from '../../components/Skeleton.jsx';

const Home = () => {
  useUserAuth();
  const { handleClick } = useRouteHandlers();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, roomsRes, categoriesRes] = await Promise.all([
        axiosInstance.get(`${API_PATHS.BOOKINGS.GET_ALL}?limit=100`),
        axiosInstance.get(API_PATHS.ROOMS.GET_ALL),
        axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL),
      ]);
      setBookings(bookingsRes.data?.bookings || []);
      setRooms(roomsRes.data?.rooms || []);
      setCategories(categoriesRes.data?.categories || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Stat derivations ──────────────────────────────────────────────
  const currentYear = new Date().getFullYear();

  const yearBookings = bookings.filter(
    (b) => new Date(b.createdAt).getFullYear() === currentYear
  );
  const lastYearBookings = bookings.filter(
    (b) => new Date(b.createdAt).getFullYear() === currentYear - 1
  );

  const totalRevenue = yearBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const lastYearRevenue = lastYearBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

  const pendingCount = bookings.filter((b) => b.bookingStatus === 'pending').length;

  const availableRooms = rooms.filter((r) => r.available).length;
  const occupiedRooms = rooms.filter((r) => !r.available).length;
  const totalRooms = rooms.length;
  const occupancyPct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  // circle r=40 → circumference ≈ 251
  const dashArray = `${Math.round((occupancyPct / 100) * 251)} 251`;

  const bookingChangePct =
    lastYearBookings.length > 0
      ? Math.round(((yearBookings.length - lastYearBookings.length) / lastYearBookings.length) * 100)
      : null;
  const revenueChangePct =
    lastYearRevenue > 0
      ? Math.round(((totalRevenue - lastYearRevenue) / lastYearRevenue) * 100)
      : null;

  const formatRevenue = (n) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
    return `₦${n.toLocaleString()}`;
  };

  // ── Recent bookings ───────────────────────────────────────────────
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── Today's activity ──────────────────────────────────────────────
  const todayStr = new Date().toDateString();
  const todayActivity = bookings
    .filter(
      (b) =>
        new Date(b.checkInDate).toDateString() === todayStr ||
        new Date(b.checkOutDate).toDateString() === todayStr
    )
    .slice(0, 5)
    .map((b) => ({
      name: b.guestName,
      room: `${b.room?.name ?? '—'} · ${b.numOfGuests} guest${b.numOfGuests !== 1 ? 's' : ''}`,
      type: new Date(b.checkInDate).toDateString() === todayStr ? 'Check-in' : 'Check-out',
      status: b.bookingStatus,
    }));

  // ── Bookings by category ──────────────────────────────────────────
  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c.name]));
  const catCounts = {};
  bookings.forEach((b) => {
    const catId = b.room?.category;
    if (catId) {
      const name = categoryMap[catId] ?? 'Other';
      catCounts[name] = (catCounts[name] || 0) + 1;
    }
  });
  const totalCatBookings = Object.values(catCounts).reduce((s, v) => s + v, 0);
  const categoryStats = Object.entries(catCounts)
    .map(([name, count]) => [
      name,
      totalCatBookings > 0 ? Math.round((count / totalCatBookings) * 100) : 0,
    ])
    .sort((a, b) => b[1] - a[1]);

  return (
    <DashboardLayout activeMenu={'dashboard'}>
      <div>
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                icon={<FaRegCalendarAlt />}
                label={`Total bookings (${currentYear})`}
                value={yearBookings.length.toString()}
                change={
                  bookingChangePct !== null
                    ? `${bookingChangePct >= 0 ? '+' : ''}${bookingChangePct}% vs last year`
                    : undefined
                }
                changeType={bookingChangePct >= 0 ? 'up' : 'down'}
              />
              <StatCard
                icon={<TbCoins />}
                label={`Revenue (${currentYear})`}
                value={formatRevenue(totalRevenue)}
                change={
                  revenueChangePct !== null
                    ? `${revenueChangePct >= 0 ? '+' : ''}${revenueChangePct}% vs last year`
                    : undefined
                }
                changeType={revenueChangePct >= 0 ? 'up' : 'down'}
              />
              <StatCard
                icon={<FaBed />}
                label="Rooms available"
                value={`${availableRooms} / ${totalRooms}`}
                change={`${occupiedRooms} occupied today`}
              />
              <StatCard
                icon={<BsHourglassSplit />}
                label="Pending confirmations"
                value={pendingCount.toString()}
                change="Awaiting guest action"
                changeType="down"
              />
            </>
          )}
        </div>

        {/* ── Recent bookings + Occupancy ── */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">Recent bookings</h3>
              <button
                onClick={() => handleClick('booking')}
                className="text-xs text-emerald-700 hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  {['Guest', 'Room', 'Check-in', 'Status'].map((h) => (
                    <th key={h} className="text-xs text-gray-400 uppercase tracking-wide pb-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-sm text-gray-400 text-center">No bookings yet.</td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b._id} className="border-t border-gray-50">
                      <td className="py-2.5 text-sm text-gray-700">{b.guestName}</td>
                      <td className="py-2.5 text-sm text-gray-500">{b.room?.name ?? '—'}</td>
                      <td className="py-2.5 text-sm text-gray-500">
                        {new Date(b.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="py-2.5">
                        <Badge status={b.bookingStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Occupancy</h3>
            {loading ? (
              <OccupancySkeleton />
            ) : (
              <>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="12"
                        strokeDasharray={dashArray} strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-medium text-gray-900">{occupancyPct}%</span>
                      <span className="text-xs text-gray-400">occupied</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-around mt-2">
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900">{availableRooms}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Available</p>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900">{occupiedRooms}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Occupied</p>
                  </div>
                </div>
                <div className="mt-5 border-t border-gray-50 pt-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Bookings by category</h3>
                  {categoryStats.length === 0 ? (
                    <p className="text-xs text-gray-400">No data yet.</p>
                  ) : (
                    categoryStats.map(([cat, pct]) => (
                      <div key={cat} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 w-16 truncate">{cat}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Today's check-ins & check-outs ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Today's check-ins & check-outs</h3>
          {loading ? (
            <div className="flex flex-col gap-2.5"><ActivitySkeleton rows={3} /></div>
          ) : todayActivity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No check-ins or check-outs today.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {todayActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.room}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{item.type}</span>
                    <Badge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
