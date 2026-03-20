import { useEffect, useState } from "react";
import socket from "../socket";

const JoinRoom = ({ setJoined, setRoomData }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.on("players", () => {});

    return () => socket.off("players");
  }, []);

  const joinRoom = () => {
    if (!name || !roomId) return;

    socket.emit("join_room", { name, roomId });

    setRoomData({ name, roomId });
    setJoined(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎮 Join Game</h1>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />

      <br /><br />

      <button onClick={joinRoom}>Join</button>
    </div>
  );
};

export default JoinRoom;