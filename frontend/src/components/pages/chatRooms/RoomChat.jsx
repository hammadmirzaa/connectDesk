import React, { useEffect, useState, useRef } from "react";
import {
  Users,
  Video,
  Phone,
  MoreVertical,
} from "lucide-react";
import { UseAuthContext } from "../../../context/AuthContext";
import Pusher from "pusher-js";
import CreateRoomModal from "./CreateRoomModal";
import ChatInput from "./ChatInput";
import { MessageFileBubble } from "./MessageFile";
import { useRoomContext } from "../../../context/RoomContext";

export default function RoomChat({ room }) {
  const { user, users } = UseAuthContext();
  const {
    fetchMessages,
    fetchMembers,
    sendMessage,
    roomMessages,
    roomMembers,
    appendMessage,
  } = useRoomContext();

  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [file, setFile] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

  const endRef = useRef();

  const currentUser = users.find((u) => u.admin === true);

  // Fetch messages when room changes
  useEffect(() => {
    if (room) fetchMessages(room.id);
  }, [room, fetchMessages]);

  // Fetch members when room changes
  useEffect(() => {
    if (room) fetchMembers(room.id);
  }, [room, fetchMembers]);

  // Real-time updates via Pusher
  useEffect(() => {
    if (!room) return;
    const pusher = new Pusher("575b2db9014b7654f685", { cluster: "eu" });
    const channel = pusher.subscribe(`room_${room.id}`);
    const handler = (data) => appendMessage(room.id, data);
    channel.bind("message", handler);
    return () => {
      channel.unbind("message", handler);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [room, appendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room, roomMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    await sendMessage(room.id, { message: input, file });
    setInput("");
    setFile(null);
  };

  if (!room)
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f6f8fa]">
        <div className="text-2xl text-gray-500">
          Select a chat to start messaging
        </div>
      </div>
    );

  // These are now provided by context
  const messages = roomMessages[room.id] || [];
  const members = roomMembers[room.id] || [];

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
            <div className="text-xs text-gray-500">
              {members.length} members
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <button className="p-2 hover:bg-gray-100 rounded">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Video size={18} />
          </button> */}
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => setShowMembers((show) => !show)}
          >
            <Users size={18} />
          </button>
          {showMembers && (
            <div className="absolute right-20 top-16 w-64 bg-white border rounded-xl shadow-lg z-30 py-2">
              <button
                onClick={() => setShowMembers(false)}
                className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
                style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                title="Close"
              >
                &times;
              </button>
              <div className="px-4 py-2 font-semibold border-b text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Members
              </div>
              <ul className="mt-2">
                {members.length === 0 && (
                  <li className="px-4 py-2 text-gray-400">No members</li>
                )}
                {members.map((member, idx) => {
                  const initials = member.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <li
                      key={member.id || idx}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-black">
                        {initials}
                      </div>
                      <span className="truncate">{member.username}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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
              {!isCurrentUser && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-[#1e40af] flex items-center justify-center font-bold mb-1">
                    {initials}
                  </div>
                  <div className="text-[11px] text-gray-500">{name}</div>
                </div>
              )}

              {msg.file ? (
                <MessageFileBubble
                  fileUrl={msg.file}
                  fileName={msg.file_name}
                  mimeType={msg.file_mime}
                  fileSize={msg.file_size}
                  pdfPages={msg.pdf_pages}
                />
              ) : (
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xl min-w-[80px] shadow ${
                    isCurrentUser
                      ? "bg-[#1e40af] text-white rounded-br-none"
                      : "bg-white text-blue-900 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm emoji-bubble ">{msg.content}</div>
                  <div className="text-[11px] text-gray-400 mt-1 text-right">
                    {msg.timestamp &&
                      new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}

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
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={handleSendMessage}
        setFile={setFile}
        file={file}
      />
      {showAddMembers && (
        <CreateRoomModal room={room} onClose={() => setShowAddMembers(false)} />
      )}
    </div>
  );
}
