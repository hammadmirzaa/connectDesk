import React, { createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});
  const [roomMembers, setRoomMembers] = useState({});
  const token = Cookies.get("access_token");

  // Fetch rooms for user
  const fetchRooms = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/rooms/my-rooms`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    const data = await res.json();
    setRooms(data);
    return data;
  }, [token]);

  // Create a new room or add members
  const createOrUpdateRoom = useCallback(
    async ({ name, members, roomId }) => {
      let url, method, body;
      if (roomId) {
        // Add members
        url = `${API_URL}/api/rooms/${roomId}/add`;
        method = "POST";
        body = JSON.stringify({ members });
      } else {
        // Create new room
        url = `${API_URL}/api/rooms/create`;
        method = "POST";
        body = JSON.stringify({ name, members });
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      await fetchRooms();
      return true;
    },
    [token, fetchRooms]
  );

  // Fetch room messages
  const fetchMessages = useCallback(
    async (roomId) => {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/messages`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      const data = await res.json();
      setRoomMessages((prev) => ({ ...prev, [roomId]: data }));
      return data;
    },
    [token]
  );

  // Fetch room members
  const fetchMembers = useCallback(
    async (roomId) => {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/members`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      const data = await res.json();
      setRoomMembers((prev) => ({ ...prev, [roomId]: data }));
      return data;
    },
    [token]
  );

  // Send message
  const sendMessage = useCallback(
    async (roomId, { message, file }) => {
      const formData = new FormData();
      formData.append("message", message);
      if (file) formData.append("file", file);
      await fetch(`${API_URL}/api/rooms/${roomId}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      // Optionally: fetchMessages(roomId);
    },
    [token]
  );

   const appendMessage = useCallback(
    (roomId, msg) => {
      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), msg],
      }));
    },
    []
  );

  return (
    <RoomContext.Provider
      value={{
        rooms,
        fetchRooms,
        createOrUpdateRoom,
        fetchMessages,
        fetchMembers,
        sendMessage,
        roomMessages,
        roomMembers,
        appendMessage
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  return useContext(RoomContext);
}
