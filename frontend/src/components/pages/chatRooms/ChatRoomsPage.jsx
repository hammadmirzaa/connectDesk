import React, { useState } from "react";
import RoomList from "./RoomList";
import RoomChat from "./RoomChat";
import CreateRoomModal from "./CreateRoomModal";
import SharedLayout from "../../navbar";

export default function ChatRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshRooms, setRefreshRooms] = useState(false);

  return (
    <SharedLayout>
    <div className="flex h-screen bg-[#f6f8fa] font-sans">
      <RoomList
        onSelectRoom={setSelectedRoom}
        onCreate={() => setShowCreate(true)}
        key={refreshRooms}
      />
      <div className="flex-1 flex flex-col">
        <RoomChat room={selectedRoom} />
      </div>
      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreated={() => setRefreshRooms((v) => !v)}
        />
      )}
    </div>
    </SharedLayout>
  );
}
