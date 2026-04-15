import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import ModalInput from '../Inputs/ModalInput.jsx';

const AddRoomForm = ({ onAddRoom, initialData }) => {
  const isEdit = !!initialData;
  const [room, setRoom] = useState({
    name: initialData?.name || "",
    // category may be a populated object or a plain ID
    category: initialData?.category?._id ?? initialData?.category ?? "",
    available: initialData?.available ?? true,
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (key, value) => setRoom({ ...room, [key]: value });

  return (
    <div className="flex flex-col gap-3">
      <ModalInput
        value={room.name}
        onChange={({ target }) => handleChange('name', target.value)}
        label="Room Name"
        placeholder="e.g. Deluxe 101"
        type="text"
      />

      <div>
        <label className="text-[13px] text-slate-600">Category</label>
        <div className="form-input-box mt-1">
          <select
            value={room.category}
            onChange={({ target }) => handleChange('category', target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-700"
          >
            <option value="">
              {loadingCategories ? 'Loading...' : 'Select a category'}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <input
          id="available"
          type="checkbox"
          checked={room.available}
          onChange={({ target }) => handleChange('available', target.checked)}
          className="accent-emerald-700"
        />
        <label htmlFor="available" className="text-[13px] text-slate-600 cursor-pointer">
          Available immediately
        </label>
      </div>

      <button
        type="button"
        onClick={() => onAddRoom(room)}
        className="w-full mt-2 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        {isEdit ? 'Save Changes' : 'Add Room'}
      </button>
    </div>
  );
};

export default AddRoomForm;
