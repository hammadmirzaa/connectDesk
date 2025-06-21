import React, { useState } from "react";
import { Users, Wifi, UserPlus, Bell } from "lucide-react";
import SharedLayout from "../../navbar";

// Dummy Data Example
const workspace = {
  name: "Frontend Team",
  authorizedUsers: 2,
  activeUsers: 1,
  activities: [
    {
      id: 1,
      message: "Admin changed the role of user@example.com",
      by: "admin@example.com",
      date: "2024-Nov-20",
    },
    {
      id: 2,
      message: "Updated the workspace settings",
      by: "user2@example.com",
      date: "2024-Aug-04",
    },
    {
      id: 3,
      message: "Removed user3@example.com from workspace",
      by: "admin@example.com",
      date: "2024-Sept-5",
    },
    {
      id: 4,
      message: "Created a new project titled 'Team Collab'",
      by: "user@example.com",
      date: "2024-May-15",
    },
  ],
  members: [
    { name: "Ali Hassan" },
    { name: "Sara Qureshi" },
    { name: "Ahmed" },
  ],
};

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function WorkspaceDetails() {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <SharedLayout>
    <div className="min-h-screen bg-[#f8fafc] py-10 px-5 flex flex-col items-center">
      {/* Workspace Name */}
      <div className="w-full max-w-5xl mb-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          {workspace.name}
        </h1>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition font-semibold"
          onClick={() => setShowAddMember(true)}
        >
          <UserPlus size={18} />
          Add Member
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-5xl">
        <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-2xl font-bold text-blue-900">{workspace.authorizedUsers}</div>
            <div className="text-gray-400 text-sm mb-1">Authorized Users</div>
            <a className="text-teal-600 text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer">
              Check out <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="bg-blue-100 rounded-full p-2">
            <Users size={28} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-2xl font-bold text-blue-900">{workspace.activeUsers}</div>
            <div className="text-gray-400 text-sm mb-1">Active Users</div>
            <a className="text-teal-600 text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer">
              View More <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="bg-sky-100 rounded-full p-2">
            <Wifi size={28} className="text-sky-600" />
          </div>
        </div>
      </div>
      {/* Last Activity Feed */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow border border-gray-100 mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="font-bold text-md text-blue-900">Last Activity</div>
            <div className="text-gray-400 text-xs">
              Recent activities done by users.
            </div>
          </div>
          <Bell className="text-blue-400" />
        </div>
        <div className="divide-y">
          {workspace.activities.map((a) => (
            <div
              key={a.id}
              className="px-6 py-3 flex items-center justify-between hover:bg-blue-50/40 transition"
            >
              <div>
                <div className="text-[15px] text-blue-900">{a.message}</div>
                <div className="text-xs text-teal-600">by {a.by}</div>
              </div>
              <div className="text-xs text-gray-500 min-w-fit">{a.date}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[340px] flex flex-col items-center">
            <button
              onClick={() => setShowAddMember(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-6">
              <h2 className="font-bold text-blue-900 text-lg mb-2">
                Add Member
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Invite a new member to this workspace.
              </p>
              <input
                type="email"
                placeholder="Enter member email"
                className="w-full p-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
              onClick={() => setShowAddMember(false)}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
    </SharedLayout>
  );
}
