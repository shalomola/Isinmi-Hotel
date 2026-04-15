import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import useUserAuth from '../../hooks/useUserAuth';
import Modal from '../../components/Modal.jsx';
import AddCategoryForm from '../../components/Categories/AddCategoryForm.jsx';
import toast from 'react-hot-toast';
import { LuPlus } from 'react-icons/lu';
import { TableSkeleton } from '../../components/Skeleton.jsx';

const Categories = () => {
  useUserAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
      setCategoryData(response.data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (category) => {
    const { name, description, price, features } = category;

    if (!name.trim()) { toast.error('Category name is required'); return; }
    if (!price || isNaN(price) || Number(price) < 0) { toast.error('Please enter a valid price per night'); return; }

    try {
      await axiosInstance.post(API_PATHS.CATEGORIES.CREATE, { name, description, price: Number(price), features });
      setOpenAddModal(false);
      toast.success('Category added successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditCategory = async (category) => {
    const { name, description, price, features } = category;

    if (!name.trim()) { toast.error('Category name is required'); return; }
    if (price === '' || isNaN(price) || Number(price) < 0) { toast.error('Please enter a valid price per night'); return; }

    try {
      await axiosInstance.put(API_PATHS.CATEGORIES.UPDATE(editTarget._id), { name, description, price: Number(price), features });
      setEditTarget(null);
      toast.success('Category updated');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  return (
    <DashboardLayout activeMenu={'categories'}>
      <div>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-800">Room categories</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Price / Night", "Description", "Features", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : categoryData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-gray-400 text-center">No categories found.</td>
                </tr>
              ) : (
                categoryData.map((c) => (
                  <tr key={c._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{c.name}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-emerald-700">
                      {c.price > 0 ? `₦${c.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 max-w-xs">{c.description ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.features?.length > 0 ? (
                          c.features.map((f) => (
                            <span key={f._id} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f.name}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-300">None</span>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs text-emerald-700 cursor-pointer hover:underline"
                      onClick={() => setEditTarget(c)}
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
          <LuPlus />
        </button>

        <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Add Category">
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Modal>

        <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Category">
          <AddCategoryForm onAddCategory={handleEditCategory} initialData={editTarget} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
