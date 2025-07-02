import React, { useState } from "react";
import { UseAuthContext } from "../../../context/AuthContext";
import { UseBoardsContext } from "../../../context/BoardsContext";
import { X } from "lucide-react";
import Cookies from "js-cookie";
const API_URL = "http://127.0.0.1:8000/api";

export default function CreateRoomModal({ onClose, onCreated, room }) {
  const { users, user } = UseAuthContext();
  const token = Cookies.get("access_token");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const token = Cookies.get("access_token");

    try {
      let url, method, body;
      if (room) {
        // Add members to existing room
        url = `${API_URL}/rooms/${room.id}/add`;
        method = "POST";
        body = JSON.stringify({
          members: selected.map((u) => u.username),
        });
      } else {
        // Create new room
        url = `${API_URL}/rooms/create`;
        method = "POST";
        body = JSON.stringify({
          name,
          members: selected.map((u) => u.username),
        });
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      onCreated?.();
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleUser = (username) => {
    setSelected((sel) =>
      sel.some((u) => u?.username === username)
        ? sel.filter((u) => u?.username !== username)
        : [...sel, users.find((u) => u?.username === username)]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleCreate}
        className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 min-w-[350px] w-full max-w-md px-7 py-8 flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 transition"
          tabIndex={-1}
        >
          <X size={22} />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Create Room</h3>
        {error && (
          <div className="mb-2 px-3 py-2 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        {!room && (
          <>
            <label className="mb-1 text-sm font-medium text-gray-700">
              Room Name
            </label>
            <input
              required
              placeholder="Enter room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 text-gray-800 font-medium shadow-sm"
            />
          </>
        )}

        <div className="mb-4 max-h-36 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50/70 p-3">
          {users?.filter((u) => u.username !== user?.username).length === 0 ? (
            <div className="text-gray-400 text-sm">No users available.</div>
          ) : (
            users
              ?.filter((u) => u.username !== user?.username)
              .map((u) => (
                <label
                  key={u?.username}
                  className={`
                    flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition
                    ${
                      selected.find((sel) => sel.username === u?.username)
                        ? "bg-blue-50"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={
                      !!selected.find((sel) => sel.username === u?.username)
                    }
                    onChange={() => toggleUser(u?.username)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-800">{u?.username}</span>
                </label>
              ))
          )}
        </div>
        <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 font-semibold shadow transition focus:outline-none"
        >
          {room ? "Add Members" : "Create"}
        </button>
          <button
            type="button"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-5 py-2 font-semibold shadow transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
