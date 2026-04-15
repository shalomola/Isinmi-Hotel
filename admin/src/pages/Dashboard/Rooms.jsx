import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import useUserAuth from '../../hooks/useUserAuth';
import Modal from '../../components/Modal.jsx';
import AddRoomForm from '../../components/Rooms/AddRoomForm.jsx';
import toast from 'react-hot-toast';
import { LuPlus } from 'react-icons/lu';
import { RoomCardSkeleton } from '../../components/Skeleton.jsx';

const Rooms = () => {
  useUserAuth();
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const filtered =
    filter === "all"
      ? roomData
      : filter === "available"
      ? roomData.filter((r) => r.available)
      : roomData.filter((r) => !r.available);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ROOMS.GET_ALL);
      setRoomData(response.data?.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (room) => {
    const { name, category } = room;

    if (!name.trim()) { toast.error('Room name is required'); return; }
    if (!category) { toast.error('Please select a category'); return; }

    try {
      await axiosInstance.put(API_PATHS.ROOMS.UPDATE(editTarget._id), {
        name,
        category,
        available: room.available,
      });
      setEditTarget(null);
      toast.success('Room updated');
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update room');
    }
  };

  const handleAddRoom = async (room) => {
    const { name, category } = room;

    if (!name.trim()) { toast.error('Room name is required'); return; }
    if (!category) { toast.error('Please select a category'); return; }

    try {
      await axiosInstance.post(API_PATHS.ROOMS.CREATE, {
        name,
        category,
        available: room.available,
      });
      setOpenAddModal(false);
      toast.success('Room added successfully');
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  return (
    <DashboardLayout activeMenu={'rooms'}>
      <div>
        <div className="flex gap-2 mb-5">
          {["all", "available", "occupied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs capitalize border transition-all ${
                filter === f
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No rooms found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors"
              >
                {r.images?.[0]?.url ? (
                  <img src={r.images[0].url} alt={r.name} className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-4xl">
                    🛏
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.category?.name ?? '—'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-emerald-700">
                      {r.category?.price > 0
                        ? `₦${r.category.price.toLocaleString()}`
                        : '—'}
                      <span className="text-xs text-gray-400 font-normal">/night</span>
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.available ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {r.available ? "Available" : "Occupied"}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditTarget(r)}
                    className="mt-3 w-full text-xs text-emerald-700 border border-emerald-200 rounded-lg py-1.5 hover:bg-emerald-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpenAddModal(true)}
          className="absolute bottom-10 right-10 z-50 w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl cursor-pointer"
        >
          <LuPlus />
        </button>

        <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Add Room">
          <AddRoomForm onAddRoom={handleAddRoom} />
        </Modal>

        <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Room">
          <AddRoomForm onAddRoom={handleEditRoom} initialData={editTarget} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
