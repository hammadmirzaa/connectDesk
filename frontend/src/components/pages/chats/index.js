import React, { useState } from "react";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Tune as TuneIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";
import SharedLayout from "../../navbar";
import StartConversationImg from "../../../assets/svg/start_conversation.svg";

const chatList = [
  { id: "fyp", name: "FYP", lastMessage: "Oct 22, 2024", avatar: "" },
  { id: "project-a", name: "Project A", lastMessage: "Nov 10, 2024", avatar: "" },
  { id: "task-mgmt", name: "Task Management", lastMessage: "Dec 05, 2024", avatar: "" },
  { id: "ecommerce", name: "E-commerce", lastMessage: "Jan 15, 2025", avatar: "" },
];

const chatMessages = {
  fyp: [
    { sender: "User", text: "Hey, how's the project?", time: "10:00 AM", type: "sent" },
    { sender: "You", text: "Going well! Need any updates?", time: "10:05 AM", type: "received" },
  ],
  "project-a": [
    { sender: "User", text: "What's the deadline?", time: "9:30 AM", type: "sent" },
  ],
  "task-mgmt": [
    { sender: "User", text: "Any blockers?", time: "12:00 PM", type: "sent" },
    { sender: "You", text: "Not yet!", time: "12:05 PM", type: "received" },
  ],
  ecommerce: [
    { sender: "User", text: "Can we launch the site?", time: "2:00 PM", type: "sent" },
  ],
};

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState("");

  return (
    <SharedLayout>
      <div className="w-full min-h-screen flex bg-[#f6f8fa]">
        <div className="w-[330px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2 font-bold text-lg text-blue-900">
              Messages
            </div>
            <IconButton size="small" className="!text-blue-500">
              <TuneIcon />
            </IconButton>
          </div>
          <div className="px-6 py-2">
            <div className="flex items-center rounded-md bg-[#f3f5f9] px-2">
              <SearchIcon className="text-gray-400" />
              <input
                type="text"
                placeholder="Search chats"
                className="w-full p-2 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul>
              {chatList.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition
                    ${chat.id === selectedChatId ? "bg-blue-100" : ""}`}
                >
                  <Avatar alt={chat.name} src={chat.avatar} sx={{ width: 36, height: 36, fontSize: 16 }}>
                    {chat.name[0]}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900 text-sm">{chat.name}</div>
                    <div className="text-xs text-gray-500">{chat.lastMessage}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#f6f8fa]">
          {selectedChatId ? (
            <>
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                  <Avatar sx={{ bgcolor: "#1976d2", width: 40, height: 40, fontSize: 16 }}>
                    {chatList.find((c) => c.id === selectedChatId)?.name[0] || "?"}
                  </Avatar>
                  <div>
                    <div className="font-semibold text-blue-900">
                      {chatList.find((c) => c.id === selectedChatId)?.name}
                    </div>
                    <div className="text-xs text-gray-500">Active now</div>
                  </div>
                </div>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col gap-4">
                {chatMessages[selectedChatId]?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.type === "received" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xl min-w-[80px] shadow 
                        ${msg.type === "sent"
                          ? "bg-white text-blue-900 rounded-bl-none"
                          : "bg-blue-600 text-white rounded-br-none"}
                      `}
                    >
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-[11px] text-gray-400 mt-1 text-right">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="flex items-center gap-2 px-8 py-6 bg-white border-t border-gray-200"
                onSubmit={e => {
                  e.preventDefault();
                  if (input.trim()) {
                    // Add your send message logic here
                    setInput("");
                  }
                }}
              >
                <IconButton>
                  <EmojiIcon className="text-blue-500" />
                </IconButton>
                <IconButton>
                  <AttachFileIcon className="text-blue-500" />
                </IconButton>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Write your message..."
                  className="flex-1 p-3 rounded-lg bg-[#f3f5f9] outline-none text-sm"
                />
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <SendIcon />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center flex-1">
              <img
                src={StartConversationImg}
                alt="Start a Conversation"
                className="max-w-xs w-full mb-6"
              />
              <h2 className="text-xl font-semibold mb-2 text-center">Start a Conversation</h2>
              <p className="text-gray-500 text-center">Collaborate in real-time with your team or clients.</p>
            </div>
          )}
        </div>

      </div>
    </SharedLayout>
  );
};

export default Chats;
