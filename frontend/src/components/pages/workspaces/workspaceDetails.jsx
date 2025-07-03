import React, { useEffect, useState } from "react";
import { Users, Wifi, UserPlus, Bell } from "lucide-react";
import SharedLayout from "../../navbar";
import { useWorkspace } from "../../../context/WorkspacesContext";
import { useParams } from "react-router-dom";
import AddMemberModal from "../../ReUsableComponents/AddMembersModal";
import TrashIcon from "../../../assets/icons/TrashIcon";

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
  const [showMembers, setShowMembers] = useState(false);
  const [currentWorkSpace, setCurrentWorkSpace] = useState(null);
  const { activities, workspaces, removeMemberFromWorkspace, fetchWorkspaces } = useWorkspace();
  const { workspaceId } = useParams();

  useEffect(() => {
    fetchWorkspaces();
    if (workspaceId) {
      const currentWorkspace = workspaces?.find(
        (ws) => ws.id === Number(workspaceId)
      );
      if (currentWorkspace) setCurrentWorkSpace(currentWorkspace);
    }
  }, [workspaces, workspaceId]);

  const handleRemoveMember = async (userId) => {
  if (!currentWorkSpace?.id || !userId) return;
  try {
    await removeMemberFromWorkspace(currentWorkSpace.id, userId);
  } catch (err) {
    console.error("Failed to remove member:", err);
    alert("Error removing member");
  }
};


  return (
    <SharedLayout>
      <div className="min-h-screen bg-[#f8fafc] py-10 px-5 flex flex-col items-center">
        {/* Workspace Name */}
        <div className="w-full max-w-5xl mb-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            {currentWorkSpace?.name}
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
            <div
              onClick={() => setShowMembers(true)}
              className="cursor-pointer"
            >
              <div className="text-2xl font-bold text-blue-900">
                {currentWorkSpace?.members?.length}
              </div>
              <div className="text-gray-400 text-sm mb-1">Authorized Users</div>
            </div>
            <div className="bg-blue-100 rounded-full p-2">
              <Users size={28} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between border border-gray-100">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {currentWorkSpace?.board_count || 0}
              </div>
              <div className="text-gray-400 text-sm mb-1">Boards</div>
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
              <div className="font-bold text-md text-blue-900">
                Last Activity
              </div>
              <div className="text-gray-400 text-xs">
                Recent activities done by users.
              </div>
            </div>
            <Bell className="text-blue-400" />
          </div>
          <div className="divide-y">
            {activities.map((a) => (
              <div
                key={a.id}
                className="px-6 py-3 flex items-center justify-between hover:bg-blue-50/40 transition"
              >
                <div>
                  <div className="text-[15px] text-blue-900">{a?.message}</div>
                  <div className="text-xs text-teal-600">by {a?.username}</div>
                </div>
                <div className="text-xs text-gray-500 min-w-fit">
                  {a?.created_by}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add Member Modal */}
        {showAddMember && (
          <AddMemberModal
            workspaceId={currentWorkSpace.id}
            onClose={() => setShowAddMember(false)}
          />
        )}
      </div>
      {showMembers && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative w-64 bg-white border rounded-xl shadow-lg py-2">
            {/* Close Button */}
            <button
              onClick={() => setShowMembers(false)}
              className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
              title="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="px-4 py-2 font-semibold border-b text-gray-700 flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              Members
            </div>

            {/* Members List */}
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {currentWorkSpace?.members.length === 0 && (
                <li className="px-4 py-2 text-gray-400">No members</li>
              )}
              {currentWorkSpace?.members.map((member, idx) => {
                const initials = member?.username
                  ?.split(" ")
                  ?.map((word) => word[0])
                  ?.join("")
                  ?.slice(0, 2)
                  ?.toUpperCase();
                return (
                  <li
                    key={member?.id || idx}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 justify-between "
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-black">
                        {initials}
                      </div>
                      <span className="truncate">{member?.username}</span>
                    </div>

                    {/* Trash Icon */}
                    <button
                      onClick={() => handleRemoveMember(member?.id)}
                      className="stroke-black hover:scale-110 transition "
                      title="Remove member"
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </SharedLayout>
  );
}
