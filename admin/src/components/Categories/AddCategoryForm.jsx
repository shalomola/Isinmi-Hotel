import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import ModalInput from '../Inputs/ModalInput.jsx';

const AddCategoryForm = ({ onAddCategory, initialData }) => {
  const isEdit = !!initialData;
  const [category, setCategory] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ?? "",
    // initialData.features may be populated objects [{_id, name}] or plain IDs
    features: initialData?.features?.map((f) => f._id ?? f) || [],
  });

  const [allFeatures, setAllFeatures] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoadingFeatures(true);
      try {
        const response = await axiosInstance.get(API_PATHS.FEATURES.GET_ALL);
        setAllFeatures(response.data?.features || []);
      } catch (error) {
        console.error('Error fetching features:', error.message);
      } finally {
        setLoadingFeatures(false);
      }
    };
    fetchFeatures();
  }, []);

  const handleChange = (key, value) => setCategory({ ...category, [key]: value });

  const toggleFeature = (id) => {
    const updated = category.features.includes(id)
      ? category.features.filter((f) => f !== id)
      : [...category.features, id];
    handleChange('features', updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <ModalInput
        value={category.name}
        onChange={({ target }) => handleChange('name', target.value)}
        label="Category Name"
        placeholder="e.g. Deluxe"
        type="text"
      />

      <ModalInput
        value={category.price}
        onChange={({ target }) => handleChange('price', target.value)}
        label="Price Per Night (₦)"
        placeholder="e.g. 90000"
        type="number"
      />

      <div>
        <label className="text-[13px] text-slate-600">Description <span className="text-gray-400">(optional)</span></label>
        <div className="form-input-box mt-1">
          <textarea
            rows={2}
            placeholder="Brief description of this category..."
            value={category.description}
            onChange={({ target }) => handleChange('description', target.value)}
            className="w-full bg-transparent outline-none text-sm resize-none"
          />
        </div>
      </div>

      <div>
        <label className="text-[13px] text-slate-600 block mb-2">
          Features <span className="text-gray-400">(optional)</span>
        </label>
        {loadingFeatures ? (
          <p className="text-xs text-gray-400">Loading features...</p>
        ) : allFeatures.length === 0 ? (
          <p className="text-xs text-gray-400">No features available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allFeatures.map((f) => {
              const selected = category.features.includes(f._id);
              return (
                <button
                  key={f._id}
                  type="button"
                  onClick={() => toggleFeature(f._id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    selected
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onAddCategory(category)}
        className="w-full mt-2 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        {isEdit ? 'Save Changes' : 'Add Category'}
      </button>
    </div>
  );
};

export default AddCategoryForm;
