import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import useUserAuth from '../../hooks/useUserAuth';
import Modal from '../../components/Modal.jsx';
import AddFeatureForm from '../../components/Features/AddFeatureForm.jsx';
import toast from 'react-hot-toast';
import { LuPlus, LuPencil } from 'react-icons/lu';
import { TableSkeleton } from '../../components/Skeleton.jsx';

const Features = () => {
  useUserAuth();
  const [featureData, setFeatureData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.FEATURES.GET_ALL);
      setFeatureData(response.data?.features || []);
    } catch (error) {
      console.error('Error fetching features:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (name) => {
    if (!name.trim()) {
      toast.error('Feature name is required');
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.FEATURES.CREATE, { name });
      setOpenAddModal(false);
      toast.success('Feature added successfully');
      fetchFeatures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add feature');
    }
  };

  const handleEditFeature = async (name) => {
    if (!name.trim()) {
      toast.error('Feature name is required');
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.FEATURES.UPDATE(editTarget._id), { name });
      setEditTarget(null);
      toast.success('Feature updated');
      fetchFeatures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update feature');
    }
  };

  return (
    <DashboardLayout activeMenu={'features'}>
      <div>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-800">Room features</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Name", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={5} cols={2} />
                ) : featureData.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-8 text-sm text-gray-400 text-center">No features found.</td>
                  </tr>
                ) : (
                  featureData.map((f) => (
                    <tr key={f._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{f.name}</td>
                      <td
                        className="px-5 py-3.5 text-sm text-slate-400 hover:text-emerald-900 cursor-pointer hover:underline"
                        onClick={() => setEditTarget(f)}
                      >
                        <LuPencil />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="absolute bottom-10 right-10 z-50 w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl cursor-pointer"
        >
          <LuPlus />
        </button>

        <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Add Feature">
          <AddFeatureForm onAddFeature={handleAddFeature} />
        </Modal>

        <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Feature">
          <AddFeatureForm onAddFeature={handleEditFeature} initialData={editTarget} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Features;
