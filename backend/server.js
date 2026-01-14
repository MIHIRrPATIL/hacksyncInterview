require('dotenv').config();
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'SkillSphere Backend is Running' });
});

// Socket.io initialization
const { init, rooms } = require('./socket');
init(io);

// Check if room exists
app.get('/api/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    console.log(`Checking existence for room: ${roomId}. Available rooms:`, Array.from(rooms.keys()));
    if (rooms.has(roomId)) {
        res.json({ exists: true });
    } else {
        res.status(404).json({ exists: false, message: 'Room not found' });
    }
});

// Get all available rooms
app.get('/api/rooms', (req, res) => {
    const availableRooms = Array.from(rooms.values()).map(room => ({
        roomId: room.id,
        link: `http://localhost:3000/interview/${room.id}`,
        hostCandidateName: room.participants.length > 0 ? room.participants[0].name : "Waiting for Host...",
        participantCount: room.participants.length,
        status: room.status
    }));
    res.json(availableRooms);
});

// Proxy Code Execution Endpoint
app.post('/api/execute', async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: 'Language and code are required' });
    }

    try {
        const executionUrl = process.env.EXECUTION_API_URL;
        if (!executionUrl || executionUrl.includes('ip-addr')) {
            console.warn("EXECUTION_API_URL not configured properly.");
            return res.status(500).json({ error: 'Server configuration error: EXECUTION_API_URL missing' });
        }

        // Map language to Piston/Runtoman versions
        // You might need to adjust these versions based on the specific API you are using
        let version = "0.0.0";
        let langMap = language;

        if (language === 'python') {
            version = "3.10.0";
        } else if (language === 'javascript') {
            version = "18.15.0";
        } else if (language === 'cpp') {
            version = "10.2.0";
            langMap = "c++";
        }

        const payload = {
            language: langMap,
            version: version,
            files: [{ content: code }]
        };

        const response = await axios.post(executionUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Execution API Error:", error.message);
        // If the external service fails, return a formatted error
        res.status(500).json({
            run: {
                output: `Error connecting to execution environment: ${error.message}\nPlease check EXECUTION_API_URL in backend .env`
            }
        });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
