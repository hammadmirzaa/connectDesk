// src/components/CreateWorkspaceModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

// Dummy users. Replace with your user state/prop if you have one.
const users = [
  { username: "admin" },
  { username: "hammad" },
  { username: "test" },
  { username: "hammadd" },
];

export default function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);

  const toggleUser = (username) => {
    setSelected((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend here if needed
    onCreate && onCreate({ name, members: selected });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl shadow-2xl min-w-[350px] w-full max-w-md px-8 py-8 flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-800 text-lg"
          tabIndex={-1}
        >
          <X size={22} />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Workspace</h3>
        <label className="mb-1 text-sm font-medium text-gray-700">Workspace Name</label>
        <input
          required
          placeholder="Enter workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-6 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 font-medium shadow-sm"
        />

        <label className="mb-1 text-sm font-medium text-gray-700">Add Members</label>
        <div className="mb-6 max-h-36 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-3">
          {users.map((u) => (
            <label
              key={u.username}
              className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(u.username)}
                onChange={() => toggleUser(u.username)}
                className="accent-blue-600"
              />
              <span className="text-gray-800">{u.username}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 font-semibold shadow transition"
          >
            Create
          </button>
          <button
            type="button"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-5 py-2 font-semibold shadow transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
