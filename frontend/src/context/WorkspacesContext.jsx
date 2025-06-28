import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const WorkspaceContext = createContext();
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    const token = Cookies.get("access_token");
    const res = await fetch("http://localhost:8000/api/workspaces/", {
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
    const res = await fetch("http://localhost:8000/api/workspaces/create/", {
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

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        fetchWorkspaces,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
