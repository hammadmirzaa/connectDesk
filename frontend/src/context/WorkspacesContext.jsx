import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const WorkspaceContext = createContext();
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [workspaces, setWorkspaces] = useState([]);
  const [activities, setActivities] = useState([]);

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/api/workspaces/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setWorkspaces(data);
    return data;
  };

  // Create a new workspace
  const createWorkspace = async (name, description, memberIds) => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/api/workspaces/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, members: memberIds }),
    });
    const newWorkspace = await res.json();
    setWorkspaces((prev) => [...prev, newWorkspace]); 
    fetchWorkspaces();
    return newWorkspace;
  };

  // Fetch activity for a workspace
  const fetchWorkspaceActivity = async (workspaceId) => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/activity/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch activity");
    const data = await res.json();
    setActivities(data);
    return data;
  };

// Add member to workspace
const addMemberToWorkspace = async (workspaceId, userId) => {
  const token = Cookies.get("access_token");
  const res = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/add-member/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to add member");
  await fetchWorkspaces(); // Refresh
};

// Remove member from workspace
const removeMemberFromWorkspace = async (workspaceId, userId) => {
  const token = Cookies.get("access_token");
  const res = await fetch(
    `${apiUrl}/api/workspaces/${workspaceId}/remove-member/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );
  if (!res.ok) throw new Error("Failed to remove member");
  await fetchWorkspaces(); // Refresh
};



  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activities,
        fetchWorkspaces,
        createWorkspace,
        fetchWorkspaceActivity,
        addMemberToWorkspace,
        removeMemberFromWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
