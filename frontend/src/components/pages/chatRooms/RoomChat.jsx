import React, { useEffect, useState, useRef } from "react";
import {
  Users,
  Video,
  Phone,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
} from "lucide-react";
import { UseAuthContext } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import Pusher from "pusher-js";
import CreateRoomModal from "./CreateRoomModal";

const API_URL = "http://127.0.0.1:8000/api";

export default function RoomChat({ room }) {
  const { user, users } = UseAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [members, setMembers] = useState([])

  const endRef = useRef();

  const currentUser = users.filter((user) => user.admin === true)[0];
  console.log("currentUser:", currentUser);

  // Fetch messages when room changes
  useEffect(() => {
    if (!room) return;
    const token = Cookies.get("access_token");
    fetch(`${API_URL}/rooms/${room.id}/messages`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    })
      .then((r) => r.json())
      .then(setMessages);
  }, [room]);

  useEffect(()=>{
    if(!room) return
    const token = Cookies.get("access_token")
    fetch(`${API_URL}/rooms/${room.id}/members`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    })
      .then((r) => r.json())
      .then(setMembers)
  },[room])

  // Real-time updates via Pusher
  useEffect(() => {
    if (!room) return;
    const pusher = new Pusher("575b2db9014b7654f685", { cluster: "eu" });
    const channel = pusher.subscribe(`room_${room.id}`);
    const handler = (data) => setMessages((prev) => [...prev, data]);
    channel.bind("message", handler);
    return () => {
      channel.unbind("message", handler);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [room]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !room) return;
    const token = Cookies.get("access_token");
    await fetch(`${API_URL}/rooms/${room.id}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ message: input }),
    });
    setInput("");
  };

  if (!room)
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f6f8fa]">
        <div className="text-2xl text-gray-500">
          Select a chat to start messaging
        </div>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
            {room.name[0]}
          </div>
          <div>
            <div className="font-bold text-gray-900">{room.name}</div>
            <div className="text-xs text-gray-500">{members.length} members</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Video size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Users size={18} />
          </button>
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-30 py-2">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowAddMembers(true);
                    setMenuOpen(false);
                  }}
                >
                  Add Members
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => alert("Option 2")}
                >
                  Option 2
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => alert("Option 3")}
                >
                  Option 3
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Close Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-3 bg-[#fafcff]">
        {messages?.map((msg, i) => {
          const isCurrentUser = msg.sender === currentUser?.username;
          const name = isCurrentUser ? "You" : msg.sender;
          // Get initials (first letter of each word, max 2)
          const initials = msg.sender
            ? msg.sender
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "?";
          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              } mb-2`}
            >
              {/* Avatar on left for others, right for you */}
              {!isCurrentUser && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-[#1e40af] flex items-center justify-center font-bold mb-1">
                    {initials}
                  </div>
                  <div className="text-[11px] text-gray-500">{name}</div>
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-xl min-w-[80px] shadow ${
                  isCurrentUser
                    ? "bg-[#1e40af] text-white rounded-br-none"
                    : "bg-white text-blue-900 rounded-bl-none"
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-[11px] text-gray-400 mt-1 text-right">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Avatar on right for yourself */}
              {isCurrentUser && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center font-bold mb-1">
                    {initials}
                  </div>
                  <div className="text-[11px] text-gray-500">{name}</div>
                </div>
              )}
            </div>
          );
        })}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        className="flex items-center gap-2 px-8 py-5 bg-white border-t border-gray-200"
        onSubmit={sendMessage}
      >
        <button type="button" className="p-2 hover:bg-blue-50 rounded">
          <Smile className="text-blue-500" />
        </button>
        <button type="button" className="p-2 hover:bg-blue-50 rounded">
          <Paperclip className="text-blue-500" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 p-3 rounded-lg bg-[#f3f5f9] outline-none text-sm"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <Send size={18} />
        </button>
      </form>
      {showAddMembers && (
        <CreateRoomModal room={room} onClose={() => setShowAddMembers(false)} />
      )}
    </div>
  );
}
