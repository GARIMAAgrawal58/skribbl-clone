const { rooms } = require("../utils/gameLogic");

const joinRoom = (socket, { roomId, name }, io) => {
  socket.join(roomId);

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  rooms[roomId].push({
    id: socket.id,
    name,
    score: 0,
    isDrawer: false,
  });

  io.to(roomId).emit("players", rooms[roomId]);
};

module.exports = { joinRoom };