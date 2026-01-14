"use client";

import React from 'react';

const InterviewNavbar = ({ roomId, phase, timeRemaining }: { roomId: string, phase: string, timeRemaining: number }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800">
      <div className="text-xl font-bold text-blue-400">SKILLSPHERE</div>
      <div className="flex gap-8">
        <div>Room: <span className="font-mono text-yellow-500">{roomId}</span></div>
        <div>Phase: <span className="capitalize text-green-400">{phase}</span></div>
      </div>
      <div className="text-2xl font-mono text-red-500 bg-red-900/20 px-4 py-1 rounded border border-red-500/30">
        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
      </div>
    </nav>
  );
};

export default InterviewNavbar;
