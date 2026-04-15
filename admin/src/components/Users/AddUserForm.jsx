import { useState } from 'react';
import ModalInput from '../Inputs/ModalInput.jsx';

const AddUserForm = ({ onAddUser, initialData }) => {
  const isEdit = !!initialData;
  const [user, setUser] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    isAdmin: initialData?.isAdmin ?? false,
  });

  const handleChange = (key, value) => setUser({ ...user, [key]: value });

  return (
    <div className="flex flex-col gap-3">
      <ModalInput
        value={user.name}
        onChange={({ target }) => handleChange('name', target.value)}
        label="Full Name"
        placeholder="Enter staff name"
        type="text"
      />

      <ModalInput
        value={user.email}
        onChange={({ target }) => handleChange('email', target.value)}
        label="Email"
        placeholder="Enter email address"
        type="email"
      />

      {!isEdit && (
        <ModalInput
          value={user.password}
          onChange={({ target }) => handleChange('password', target.value)}
          label="Password"
          placeholder="Set a password"
          type="password"
        />
      )}

      <div className="flex items-center gap-2 mt-1">
        <input
          id="isAdmin"
          type="checkbox"
          checked={user.isAdmin}
          onChange={({ target }) => handleChange('isAdmin', target.checked)}
          className="accent-emerald-700"
        />
        <label htmlFor="isAdmin" className="text-[13px] text-slate-600 cursor-pointer">
          Grant admin access
        </label>
      </div>

      <button
        type="button"
        onClick={() => onAddUser(user)}
        className="w-full mt-2 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        {isEdit ? 'Save Changes' : 'Add Staff'}
      </button>
    </div>
  );
};

export default AddUserForm;
