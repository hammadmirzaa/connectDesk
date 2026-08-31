import React, { useState } from "react";
import {
  Share2,
  Lock,
  Star,
  LayoutGrid,
  Filter,
  Zap,
  Send,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { UseGlobalContext } from "../../../context/GlobalContext";
import { UseBoardsContext } from "../../../context/BoardsContext";
import { UseAuthContext } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";
import TrashIcon from "../../../assets/icons/TrashIcon";

// Dummy fallback user logo SVG (circle)
function DummyAvatar({ initial = "?" }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold border border-gray-200">
      {initial}
    </div>
  );
}

// Helper: Get Initials from Name or Email
function getInitial(name, email) {
  if (name) return name[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return "?";
}

const BoardNavbar = ({ savedBoards }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [activeTab, setActiveTab] = useState("members");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { boardState } = UseGlobalContext();
  const { boardId } = useParams();

  const {
    boardMembers = [],
    boards,
    handleRemoveMember,
    loadBoards,
  } = UseBoardsContext();
  const { users } = UseAuthContext();

  const currentBoard = boards.find((board) => board.id === boardId);
  console.log("currentBoard:", currentBoard);

  const currentUser = users.filter((user) => user.admin === true)[0] || {
    name: "Admin",
    email: "admin@desk.com",
  };

  const [showShare, setShowShare] = useState(false);

  const [shareLink, setShareLink] = useState("");

  const handleRemoveBoardMember = async (boardId, userId) => {
    await handleRemoveMember(boardId, userId);
  };

  const handleShareOpen = () => {
    setShareLink(
      `${window.location.origin}/boards/share/${
        boardState?.id || "demo"
      }-${Date.now().toString().slice(-5)}`
    );
    setShowShare(true);
  };

  const handleShareClose = () => setShowShare(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const members = boardMembers.length
    ? currentBoard.members
    : [
        { name: "Hamadbaig25", email: "hamad@desk.com" },
        { name: "Waleed Sheikh", email: "waleed@desk.com" },
      ];

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      setInviteStatus("Please enter a valid email.");
      return;
    }

    setInviteStatus("Sending...");

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${apiUrl}/boards/${boardId}/invite-member/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: inviteEmail }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setInviteStatus(data.message || "Invite sent!");
      } else {
        setInviteStatus(data.error || "Failed to send invite.");
      }
      setInviteEmail("");
      setTimeout(() => setInviteStatus(""), 1500);
    } catch (err) {
      setInviteStatus("Failed to send invite.");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      setInviteStatus("Please select a user to add.");
      return;
    }

    setInviteStatus("Adding user...");

    const token = Cookies.get("access_token");
    try {
      const response = await fetch(`${apiUrl}/boards/${boardId}/add-member/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: selectedUser.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setInviteStatus(data.message || "User added!");
      } else {
        setInviteStatus(data.error || "Failed to add user.");
      }
      loadBoards();
      setSelectedUser(null);
      setTimeout(() => setInviteStatus(""), 1500);
    } catch (err) {
      setInviteStatus("Failed to add user.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">
            {boardState.title}
          </h1>
          <Star
            size={16}
            className="text-gray-400 cursor-pointer hover:text-yellow-400"
          />
          <Lock size={16} className="text-gray-400" />
          <button className="flex items-center gap-1 text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 border border-gray-200">
            <LayoutGrid size={14} />
            Board
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Send size={16} className="cursor-pointer hover:text-gray-700" />
          <Zap size={16} className="cursor-pointer hover:text-gray-700" />
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </div>
          {/* Share Button */}
          <button
            onClick={handleShareOpen}
            className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            <Share2 size={16} />
            Share
          </button>
          {/* User Avatar */}
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <DummyAvatar
              initial={getInitial(currentUser?.username, currentUser.email)}
            />
          )}
        </div>
      </nav>

      {/* Share Modal */}

      {showShare && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleShareClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-7 min-w-[350px] w-full max-w-md border border-gray-200 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={handleShareClose}
              >
                <X size={22} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Share board
              </h2>
              <div className="mb-5">
                <label className="text-sm text-gray-700 mb-1 block">
                  Copy share link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-gray-100 border border-gray-200 rounded-l px-3 py-2 text-gray-700 font-mono"
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition"
                    onClick={handleCopy}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`flex-1 px-4 py-2 text-sm font-semibold ${
                    activeTab === "add"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("add")}
                >
                  Add Member
                </button>
                <button
                  className={`flex-1 px-4 py-2 text-sm font-semibold ${
                    activeTab === "members"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "add" && (
                <div className="mb-2">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Select a User to Add
                  </label>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition ${
                          selectedUser?.id === user.id
                            ? "bg-blue-100 border-blue-400"
                            : "bg-gray-50 border-gray-100"
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <DummyAvatar
                          initial={getInitial(user.username, user.email)}
                        />
                        <span className="font-medium text-gray-700">
                          {user.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddMember}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Add Selected Member
                  </button>
                </div>
              )}

              {activeTab === "members" && (
                <div>
                  <div className="font-semibold mb-2 text-gray-700">
                    Board members
                  </div>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-2">
                    {currentBoard?.members?.map((m, idx) => (
                      <div
                        key={m.email || idx}
                        className="flex items-start justify-between gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <DummyAvatar
                            initial={getInitial(m.username, m.email)}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">
                              {m.username}
                            </span>
                            {m.admin && (
                              <span className="text-xs text-blue-500 font-semibold">
                                Admin
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {m.email}
                            </span>
                          </div>
                        </div>

                        {!m.admin && (
                          <button
                            onClick={(e) => {
                              handleRemoveBoardMember(boardId, m.id);
                            }}
                            className="stroke-black hover:scale-110 transition"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BoardNavbar;
