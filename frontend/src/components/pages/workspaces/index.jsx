import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, PlusCircle } from "lucide-react";
import CreateWorkspaceModal from "./WorkspaceModal";
import SharedLayout from "../../navbar";
import { useWorkspace } from "../../../context/WorkspacesContext";

export default function WorkspacesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { workspaces, fetchWorkspaces, createWorkspace } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Handle workspace creation
  const handleCreateWorkspace = async (data) => {
    await createWorkspace(data.name, data.description, data.members); 
    setShowCreateModal(false);
  };

  console.log(
    workspaces?.map((ws) => ws?.members?.length > 0)
  )
  const wsMembersLength = workspaces?.map((ws) => ws?.members?.length > 0);
  const wsMembers = workspaces?.map((ws) => ws?.members);
  return (
    <SharedLayout>
      <div className="min-h-screen bg-[#f8fafc] py-16 px-12 flex flex-col items-center">
        <div className="flex justify-between items-center w-full">
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
          {workspaces?.map((ws) => (
            <div
              key={ws?.id}
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
                <div className="font-bold text-lg text-blue-900 mb-1">
                  {ws?.name}
                </div>
                <div className="text-sm text-gray-400 mb-4 text-center">
                  {ws?.description}
                </div>

                <div className="flex mb-3 -space-x-4">
                  {wsMembers && wsMembersLength ? (
                    ws.members.map((m, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center font-bold text-blue-700 text-sm"
                        style={{
                          zIndex: ws.members.length - i,
                          boxShadow: "0 2px 6px rgba(56,189,248,0.09)",
                        }}
                      >
                        {m[0]?.toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <div>No members available</div>
                  )}
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 px-2 py-1 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => navigate(`/workspaces/${ws?.id}`)}
                  >
                    Visit
                  </button>
                  <button className="flex-1 px-4 py-1 rounded-xl bg-sky-100 text-sky-700 font-semibold hover:bg-sky-200 transition flex items-center justify-center gap-1">
                    <MessageCircle size={18} /> Send Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWorkspace}
        />
      )}
    </SharedLayout>
  );
}
