import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import "./Game.css";

const Game = ({ roomData }) => {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState(null);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [players, setPlayers] = useState([]);

  const [isDrawer, setIsDrawer] = useState(false);
  const [word, setWord] = useState("");
  const [wordLength, setWordLength] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);
  const [drawerId, setDrawerId] = useState(null);

  // 🎨 NEW STATES
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);

  const roomId = roomData.roomId;

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    socket.on("draw", (data) => {
      drawLine(ctx, data);
    });

    socket.on("clear_canvas", () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("players", (data) => {
      setPlayers(data);
    });

    socket.on("correct_guess", (name) => {
      alert(`${name} guessed correctly! 🎉`);
    });

    socket.on("game_data", ({ drawerId, wordLength, round }) => {
      setDrawerId(drawerId);
      setWordLength(wordLength);
      setRound(round);
      setIsDrawer(socket.id === drawerId);
      setTimeLeft(30);
    });

    socket.on("your_word", (w) => {
      setWord(w);
    });

    return () => {
      socket.off("draw");
      socket.off("clear_canvas");
      socket.off("receive_message");
      socket.off("players");
      socket.off("correct_guess");
      socket.off("game_data");
      socket.off("your_word");
    };
  }, []);

  // TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // DRAW FUNCTION
  const drawLine = (ctx, { x0, y0, x1, y1, color, size }) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = (e) => {
    if (!isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setPrevPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setPrevPos(null);
  };

  const draw = (e) => {
    if (!isDrawing || !prevPos || !isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = {
      x0: prevPos.x,
      y0: prevPos.y,
      x1: x,
      y1: y,
      color,
      size: brushSize,
    };

    socket.emit("draw", { roomId, data });

    const ctx = canvasRef.current.getContext("2d");
    drawLine(ctx, data);

    setPrevPos({ x, y });
  };

  // CLEAR
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    socket.emit("clear_canvas", { roomId });
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message) return;

    socket.emit("send_message", {
      roomId,
      message,
      name: roomData.name,
    });

    setMessage("");
  };

  const currentDrawer = players.find((p) => p.id === drawerId);

  return (
    <div className="game-container">

      {/* LEFT */}
      <div className="players">
        <h3>👥 Players</h3>
        {players.map((p) => (
          <div className={`player ${p.id === socket.id ? "me" : ""}`} key={p.id}>
            {p.name} ({p.score})
          </div>
        ))}
      </div>

      {/* CENTER */}
      <div className="canvas-area">

        <div className="top-bar">
          <div>🎮 Round: {round}</div>
          <div>⏳ Time: {timeLeft}s</div>
          <div>👑 Drawing: {currentDrawer?.name}</div>

          <div>
            {isDrawer ? `✏️ ${word}` : "_ ".repeat(wordLength)}
          </div>
        </div>

        {/* 🎨 TOOLS */}
        {isDrawer && (
          <div style={{ margin: "10px" }}>
            🎨 Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            🖌 Size:
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
            />

            <button onClick={clearCanvas}>🧽 Clear</button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* RIGHT */}
      <div className="chat-box">
        <div className="chat-messages">
          {chat.map((c, i) => (
            <p key={i}>
              <b>{c.name}:</b> {c.message}
            </p>
          ))}
        </div>

        <div className="chat-input">
          <input
            disabled={isDrawer}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

    </div>
  );
};

export default Game;