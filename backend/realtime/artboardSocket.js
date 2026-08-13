let io = null;

const roomForArtboard = (artboardId) => `artboard:${String(artboardId)}`;

const initArtboardSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    socket.on('artboard:join', (payload = {}) => {
      const artboardId = payload.artboardId;
      if (!artboardId) return;
      socket.join(roomForArtboard(artboardId));
      socket.data.artboardId = String(artboardId);
      socket.to(roomForArtboard(artboardId)).emit('artboard:peer', {
        type: 'joined',
        socketId: socket.id
      });
    });

    socket.on('artboard:leave', (payload = {}) => {
      const artboardId = payload.artboardId || socket.data.artboardId;
      if (!artboardId) return;
      socket.leave(roomForArtboard(artboardId));
      socket.to(roomForArtboard(artboardId)).emit('artboard:peer', {
        type: 'left',
        socketId: socket.id
      });
    });

    socket.on('disconnect', () => {
      const artboardId = socket.data.artboardId;
      if (!artboardId) return;
      socket.to(roomForArtboard(artboardId)).emit('artboard:peer', {
        type: 'left',
        socketId: socket.id
      });
    });
  });
};

const emitArtboardEvent = (artboardId, event, data, exceptSocketId) => {
  if (!io || !artboardId) return;
  const room = roomForArtboard(artboardId);
  if (exceptSocketId) {
    io.to(room).except(exceptSocketId).emit(event, data);
    return;
  }
  io.to(room).emit(event, data);
};

module.exports = {
  initArtboardSocket,
  emitArtboardEvent,
  roomForArtboard
};
