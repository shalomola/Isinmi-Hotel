import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import useUserAuth from '../../hooks/useUserAuth';
import Modal from '../../components/Modal.jsx';
import AddUserForm from '../../components/Users/AddUserForm.jsx';
import toast from 'react-hot-toast';
import { LuUserPlus } from 'react-icons/lu';
import { TableSkeleton } from '../../components/Skeleton.jsx';

const roleLabel = (user) => {
  if (user.isSuperAdmin) return 'Super Admin';
  if (user.isAdmin) return 'Admin';
  return 'Staff';
};

const Users = () => {
  useUserAuth();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL);
      setUserData(response.data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user) => {
    const { name, email, isAdmin } = user;

    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!email.trim()) { toast.error('Email is required'); return; }

    try {
      await axiosInstance.put(API_PATHS.USERS.UPDATE(editTarget._id), { name, email, isAdmin });
      setEditTarget(null);
      toast.success('Staff account updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update account');
    }
  };

  const handleAddUser = async (user) => {
    const { name, email, password } = user;

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.USERS.CREATE, {
        name,
        email,
        password,
        isAdmin: user.isAdmin,
      });
      setOpenAddModal(false);
      toast.success('Staff account created');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <DashboardLayout activeMenu={'staff'}>
      <div>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-800">Staff accounts</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : userData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-sm text-gray-400 text-center">No staff accounts found.</td>
                </tr>
              ) : (
                userData.map((u) => (
                  <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
                          {u.name?.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{roleLabel(u)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs text-emerald-700 cursor-pointer hover:underline"
                      onClick={() => setEditTarget(u)}
                    >
                      Edit
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="absolute bottom-10 right-10 z-50 w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl cursor-pointer"
        >
          <LuUserPlus />
        </button>

        <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Add Staff">
          <AddUserForm onAddUser={handleAddUser} />
        </Modal>

        <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Staff">
          <AddUserForm onAddUser={handleEditUser} initialData={editTarget} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
