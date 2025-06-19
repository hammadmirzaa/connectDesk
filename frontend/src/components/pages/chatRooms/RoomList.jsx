import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Cookies from "js-cookie";
const API_URL = "http://127.0.0.1:8000/api/rooms";

export default function RoomList({ onSelectRoom, onCreate }) {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const token = Cookies.get("access_token");
    fetch(`${API_URL}/my-rooms`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    })
      .then((r) => r.json())
      .then(setRooms);
  }, [onCreate]);

  return (
    <aside className="w-[330px] border-r border-gray-200 bg-white flex flex-col">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4 rounded bg-[#f3f5f9] px-2">
          <Search className="text-gray-400" size={20} />
          <input
            className="flex-1 px-2 py-2 text-sm outline-none bg-transparent"
            placeholder="Search..."
          />
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 mb-4"
          onClick={onCreate}
        >
          <Plus size={18} /> Create New Group
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 mb-2 font-bold text-gray-700 text-xs">Messages</div>
        <ul>
          {rooms?.map((room) => (
            <li
              key={room.id}
              className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100"
              onClick={() => onSelectRoom(room)}
            >
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                {room.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{room.name}</div>
                <div className="text-xs text-gray-500">{room.lastMessage || "No messages yet"}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
