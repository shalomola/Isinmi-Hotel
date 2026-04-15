import { useState } from 'react';
import ModalInput from '../Inputs/ModalInput.jsx';

const AddFeatureForm = ({ onAddFeature, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const isEdit = !!initialData;

  return (
    <div className="flex flex-col gap-3">
      <ModalInput
        value={name}
        onChange={({ target }) => setName(target.value)}
        label="Feature Name"
        placeholder="e.g. WiFi, Balcony, Jacuzzi"
        type="text"
      />

      <button
        type="button"
        onClick={() => onAddFeature(name)}
        className="w-full mt-2 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        {isEdit ? 'Save Changes' : 'Add Feature'}
      </button>
    </div>
  );
};

export default AddFeatureForm;
