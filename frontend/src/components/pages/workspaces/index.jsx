import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, PlusCircle } from "lucide-react";
import SharedLayout from "../../navbar";
import CreateWorkspaceModal from "./WorkspaceModal";

// Dummy Data Example (replace with your real workspaces data)
const workspaces = [
  {
    id: 1,
    name: "Frontend Team",
    description: "All things UI & UX",
    stats: { posts: 122, members: 6, visits: 4.2 },
    members: [
      { name: "Ali Hassan" },
      { name: "Sara Qureshi" },
      { name: "Zain K." },
      { name: "Ahmed" },
    ],
    groupColor: "#6366f1", // indigo
    background: "/workspace-bg-1.png", // optional, can use gradient if you want
  },
  {
    id: 2,
    name: "Backend Gurus",
    description: "APIs, DB, and DevOps",
    stats: { posts: 87, members: 8, visits: 2.7 },
    members: [{ name: "Hammad" }, { name: "Ayesha" }, { name: "Uzair" }],
    groupColor: "#38bdf8", // sky
    background: "/workspace-bg-2.png",
  },
  {
    id: 3,
    name: "Backend Gurus",
    description: "APIs, DB, and DevOps",
    stats: { posts: 87, members: 8, visits: 2.7 },
    members: [{ name: "Hammad" }, { name: "Ayesha" }, { name: "Uzair" }],
    groupColor: "#38bdf8", // sky
    background: "/workspace-bg-2.png",
  },
  {
    id: 3,
    name: "Backend Gurus",
    description: "APIs, DB, and DevOps",
    stats: { posts: 87, members: 8, visits: 2.7 },
    members: [{ name: "Hammad" }, { name: "Ayesha" }, { name: "Uzair" }],
    groupColor: "#38bdf8", // sky
    background: "/workspace-bg-2.png",
  },
  {
    id: 3,
    name: "Backend Gurus",
    description: "APIs, DB, and DevOps",
    stats: { posts: 87, members: 8, visits: 2.7 },
    members: [{ name: "Hammad" }, { name: "Ayesha" }, { name: "Uzair" }],
    groupColor: "#38bdf8", // sky
    background: "/workspace-bg-2.png",
  },
  {
    id: 3,
    name: "Backend Gurus",
    description: "APIs, DB, and DevOps",
    stats: { posts: 87, members: 8, visits: 2.7 },
    members: [{ name: "Hammad" }, { name: "Ayesha" }, { name: "Uzair" }],
    groupColor: "#38bdf8", // sky
    background: "/workspace-bg-2.png",
  },
  // ...more workspaces
];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function WorkspacesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // Handlers
  const handleVisit = (id) => navigate(`/workspaces/${id}`);
  const handleAddMembers = (workspace) => {
    // open Add Members modal
    alert(`Add Members for workspace: ${workspace.name}`);
  };
  const handleSendMessage = (workspace) => {
    // open chat modal
    alert(`Send Message to workspace: ${workspace.name}`);
  };

  return (
    <SharedLayout>

      <div className="min-h-screen bg-[#f8fafc] py-16 px-12 flex flex-col items-center">
      <div className="flex justify-between items-center w-full " >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-10 tracking-tight text-center">
          Workspaces
        </h1>
             <button
        className="mb-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition"
        onClick={() => setShowCreateModal(true)}
      >
        + Create Workspace
      </button>
      </div>
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center relative group"
              style={{ minWidth: 320 }}
            >
              {/* Header with optional background */}
              <div
                className="w-full h-24 bg-cover bg-center relative"
                style={{
                  background: ws.background
                    ? `url(${ws.background}) center/cover`
                    : `linear-gradient(90deg, ${ws.groupColor} 0%, #c7d2fe 100%)`,
                }}
              >
                {/* Group icon in hex shape */}
                <div
                  className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-white rounded-full p-1 shadow"
                  style={{
                    width: 70,
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid #f8fafc",
                  }}
                >
                  <Users size={42} color={ws.groupColor} />
                </div>
              </div>
              {/* Card Content */}
              <div className="pt-14 pb-8 px-6 flex flex-col items-center w-full">
                {/* Name */}
                <div className="font-bold text-lg text-blue-900 mb-1">
                  {ws.name}
                </div>
                {/* Description */}
                <div className="text-sm text-gray-400 mb-4 text-center">
                  {ws.description}
                </div>
                {/* Member Initials - overlap */}
                <div className="flex mb-3 -space-x-4">
                  {ws.members.map((m, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center font-bold text-blue-700 text-sm"
                      style={{
                        zIndex: ws.members.length - i,
                        boxShadow: "0 2px 6px rgba(56,189,248,0.09)",
                      }}
                    >
                      {getInitials(m.name)}
                    </div>
                  ))}
                  {ws.members.length > 4 && (
                    <div className="w-9 h-9 bg-gray-300 border-2 border-white rounded-full flex items-center justify-center font-bold text-gray-700 text-xs">
                      +{ws.members.length - 4}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 px-2 py-1 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => handleVisit(ws.id)}
                  >
                    Visit
                  </button>
                  <button
                    className="flex-1 px-4 py-1 rounded-xl bg-sky-100 text-sky-700 font-semibold hover:bg-sky-200 transition flex items-center justify-center gap-1"
                    onClick={() => handleSendMessage(ws)}
                  >
                    <MessageCircle size={18} /> Send Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            // Optionally handle the created workspace here
            console.log("Workspace created:", data);
          }}
        />
      )}
    </SharedLayout>
  );
}
