"use client";

import React, { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import InterviewNavbar from '@/components/interview/InterviewNavbar';
import Lobby from '@/components/interview/Lobby';
import CodingArena from '@/components/interview/CodingArena';
import VoiceArena from '@/components/interview/VoiceArena';

const SOCKET_URL = 'http://localhost:5000';

export default function InterviewPage({ params: paramsPromise }: { params: Promise<{ roomId: string }> }) {
  const params = use(paramsPromise);
  const searchParams = useSearchParams();
  const roomId = params.roomId;
  const username = searchParams.get('username') || `Candidate_${Math.floor(Math.random() * 1000)}`;

  const [socket, setSocket] = useState<any>(null);
  const [phase, setPhase] = useState<'lobby' | 'coding' | 'voice' | 'results'>('lobby');
  const [participants, setParticipants] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 mins
  const [problem, setProblem] = useState({ 
    title: "Two Sum", 
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`." 
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit('join-room', { roomId, username });

    newSocket.on('room-update', (room) => {
      setParticipants(room.participants);
      setPhase(room.status);
    });

    newSocket.on('start-interview', (room) => {
      setParticipants(room.participants);
      setPhase('coding');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (phase === 'coding' && timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [phase, timeRemaining]);

  const handleReady = (status: boolean) => {
    if (socket) {
      socket.emit('player-ready', { roomId, isReady: status });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <InterviewNavbar 
        roomId={roomId} 
        phase={phase} 
        timeRemaining={timeRemaining} 
        isDarkMode={isDarkMode && phase === 'coding'}
      />
      
      <main className="animate-in fade-in duration-500">
        {phase === 'lobby' && (
           <Lobby 
             roomId={roomId} 
             participants={participants} 
             onReady={handleReady} 
           />
        )}
        {phase === 'coding' && (
          <CodingArena 
            problem={problem} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
          />
        )}
        {phase === 'voice' && <VoiceArena />}
      </main>
    </div>
  );
}
