import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const WorkspaceContext = createContext();
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [workspaces, setWorkspaces] = useState([]);
  const [activities, setActivities] = useState([])


  // Fetch workspaces
  const fetchWorkspaces = async () => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/workspaces/`, {
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
    const res = await fetch(`${apiUrl}/workspaces/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, members: memberIds }),
    });
    const newWorkspace = await res.json();
    setWorkspaces((prev) => [...prev, newWorkspace]); 
    return newWorkspace;
  };

  // At the top, add this to your WorkspaceProvider:
const fetchWorkspaceActivity = async (workspaceId) => {
  const token = Cookies.get("access_token");
  const res = await fetch(
    `${apiUrl}/workspaces/${workspaceId}/activity/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch activity");
  const data = await res.json();
  setActivities(data)
  return data; // Array of activities
};


  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        fetchWorkspaceActivity,
        fetchWorkspaces,
        createWorkspace,
        activities,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
