const { rooms, words } = require("../utils/gameLogic");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🧽 CLEAR CANVAS
    socket.on("clear_canvas", ({ roomId }) => {
      socket.to(roomId).emit("clear_canvas");
    });

    // 🎮 JOIN ROOM
    socket.on("join_room", ({ roomId, name }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          players: [],
          round: 1,
          drawerIndex: 0,
          word: "",
        };
      }

      const room = rooms[roomId];

      room.players.push({
        id: socket.id,
        name,
        score: 0,
      });

      // ✅ SEND PLAYERS LIST
      io.to(roomId).emit("players", room.players);

      // ✅ START GAME if first player
      if (room.players.length === 1) {
        startRound(io, roomId);
      } else {
        // 🔥 SYNC GAME STATE TO NEW PLAYER
        const drawer = room.players[room.drawerIndex];

        socket.emit("game_data", {
          drawerId: drawer.id,
          wordLength: room.word.length,
          round: room.round,
        });

        // if new player is drawer (edge case)
        if (socket.id === drawer.id) {
          socket.emit("your_word", room.word);
        }
      }
    });

    // ✏️ DRAW
    socket.on("draw", ({ roomId, data }) => {
      socket.to(roomId).emit("draw", data);
    });

    // 💬 CHAT + GUESS
    socket.on("send_message", ({ roomId, message, name }) => {
      const room = rooms[roomId];
      if (!room) return;

      io.to(roomId).emit("receive_message", { message, name });

      // ✅ CHECK CORRECT GUESS
      if (message.toLowerCase() === room.word) {
        const player = room.players.find((p) => p.name === name);
        if (player) player.score += 10;

        io.to(roomId).emit("correct_guess", name);
        io.to(roomId).emit("players", room.players);

        nextRound(io, roomId);
      }
    });

    // ❌ DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let roomId in rooms) {
        const room = rooms[roomId];

        room.players = room.players.filter(
          (p) => p.id !== socket.id
        );

        io.to(roomId).emit("players", room.players);
      }
    });
  });

  // 🔥 START ROUND
  function startRound(io, roomId) {
    const room = rooms[roomId];
    if (!room || room.players.length === 0) return;

    const drawer = room.players[room.drawerIndex];

    const word =
      words[Math.floor(Math.random() * words.length)];
    room.word = word;

    // ✅ SEND GAME DATA TO ALL
    io.to(roomId).emit("game_data", {
      drawerId: drawer.id,
      wordLength: word.length,
      round: room.round,
    });

    // ✅ SEND WORD ONLY TO DRAWER
    io.to(drawer.id).emit("your_word", word);

    // ⏳ NEXT ROUND AFTER 30s
    setTimeout(() => {
      nextRound(io, roomId);
    }, 30000);
  }

  // 🔄 NEXT ROUND
  function nextRound(io, roomId) {
    const room = rooms[roomId];
    if (!room || room.players.length === 0) return;

    room.drawerIndex =
      (room.drawerIndex + 1) % room.players.length;

    room.round += 1;

    startRound(io, roomId);
  }
};

module.exports = socketHandler;