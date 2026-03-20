import { useState } from "react";
import JoinRoom from "./pages/JoinRoom";
import Game from "./pages/Game";

function App() {
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState(null);

  return !joined ? (
    <JoinRoom setJoined={setJoined} setRoomData={setRoomData} />
  ) : (
    <Game roomData={roomData} />
  );
}

export default App;