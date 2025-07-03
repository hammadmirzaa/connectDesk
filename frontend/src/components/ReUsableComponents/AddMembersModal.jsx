import React, { useState } from "react";
import { useWorkspace } from "../../context/WorkspacesContext";
import { UseAuthContext } from "../../context/AuthContext";

export default function AddMemberModal({ workspaceId, onClose }) {
  const { users } = UseAuthContext();
  const { addMemberToWorkspace } = useWorkspace();
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");

  const handleAdd = async () => {
    if (!selectedUser) return;
    try {
      await addMemberToWorkspace(workspaceId, selectedUser.id);
      setStatus("Member added!");
      onClose();
    } catch {
      setStatus("Failed to add.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        <h2 className="font-bold text-lg text-blue-800 mb-4">Add Member</h2>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`px-3 py-2 rounded-lg cursor-pointer border ${
                selectedUser?.id === user.id
                  ? "bg-blue-100 border-blue-400"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          ))}
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Add Member
        </button>
        {status && <div className="text-sm mt-2 text-green-600">{status}</div>}
      </div>
    </div>
  );
}
