const rooms = new Map();

module.exports = {
    rooms,
    init: (io) => {
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('join-room', ({ roomId, username }) => {
                socket.join(roomId);

                if (!rooms.has(roomId)) {
                    rooms.set(roomId, {
                        id: roomId,
                        participants: [],
                        status: 'lobby',
                        config: {}
                    });
                }

                const room = rooms.get(roomId);
                const participant = {
                    id: socket.id,
                    name: username || `Candidate ${room.participants.length + 1}`,
                    isReady: false
                };

                room.participants.push(participant);

                // Broadcast the new participant list to everyone in the room
                io.to(roomId).emit('room-update', room);
                console.log(`User ${participant.name} joined room ${roomId}`);
            });

            socket.on('player-ready', ({ roomId, isReady }) => {
                const room = rooms.get(roomId);
                if (!room) return;

                const participant = room.participants.find(p => p.id === socket.id);
                if (participant) {
                    participant.isReady = isReady;
                }

                // Check if all participants are ready
                const allReady = room.participants.every(p => p.isReady);
                if (allReady && room.participants.length > 0) {
                    room.status = 'coding';
                    io.to(roomId).emit('start-interview', room);
                } else {
                    io.to(roomId).emit('room-update', room);
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                // Handle cleanup (remove from room)
                rooms.forEach((room, roomId) => {
                    const index = room.participants.findIndex(p => p.id === socket.id);
                    if (index !== -1) {
                        room.participants.splice(index, 1);
                        io.to(roomId).emit('room-update', room);
                    }
                });
            });
        });
    }
};
