const rooms = new Map();

module.exports = {
    rooms,
    init: (io) => {
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('join-room', ({ roomId, username, config }) => {
                socket.join(roomId);

                if (!rooms.has(roomId)) {
                    rooms.set(roomId, {
                        id: roomId,
                        participants: [],
                        status: 'lobby',
                        config: config || {},
                        content: null // Stores generated DSA/Voice questions
                    });
                } else if (config && Object.keys(config).length > 0) {
                    // Update config if the current room has no config (e.g. created by a joiner without params)
                    const room = rooms.get(roomId);
                    if (!room.config || Object.keys(room.config).length === 0) {
                        room.config = config;
                    }
                }

                const room = rooms.get(roomId);

                // Cleanup existing participants with the same name (handle refreshes)
                const existingIndex = room.participants.findIndex(p => p.name === username);
                if (existingIndex !== -1) {
                    room.participants.splice(existingIndex, 1);
                }

                const participant = {
                    id: socket.id,
                    name: username || `Candidate ${room.participants.length + 1}`,
                    isReady: false
                };

                room.participants.push(participant);

                // Broadcast the new participant list to everyone in the room
                io.to(roomId).emit('room-update', room);
                console.log(`User ${participant.name} joined room ${roomId} (Total: ${room.participants.length})`);
            });

            socket.on('update-room-content', ({ roomId, content }) => {
                const room = rooms.get(roomId);
                if (room) {
                    room.content = content;
                    io.to(roomId).emit('room-update', room);
                }
            });

            socket.on('update-room-status', ({ roomId, status }) => {
                const room = rooms.get(roomId);
                if (room) {
                    room.status = status;
                    io.to(roomId).emit('room-update', room);
                }
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
                    const includeDSA = room.config?.includeDSA !== false;
                    room.status = includeDSA ? 'coding' : 'voice';
                    console.log(`Phase transition: Room ${roomId} moving to ${room.status} (DSA: ${includeDSA})`);
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
