"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [config, setConfig] = useState({
    type: 'technical',
    capacity: 5,
    includeDSA: true,
    questionCount: 2,
  });

  const handleCreateRoom = () => {
    // Generate a temporary room ID
    const roomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    // In a real app, this would hit the backend to create a room entry in DB
    router.push(`/interview/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          SKILLSPHERE
        </h1>
        <p className="text-gray-400 mb-10 text-lg">Standardized Interview Room Module</p>

        <div className="space-y-8">
          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Interview Type</label>
            <div className="grid grid-cols-3 gap-4">
              {['Behavioral', 'Technical', 'Hybrid'].map((type) => (
                <button
                  key={type}
                  onClick={() => setConfig({ ...config, type: type.toLowerCase() })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                    config.type === type.toLowerCase()
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-800 bg-gray-800/30 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Max Participants</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.capacity}
                onChange={(e) => setConfig({ ...config, capacity: parseInt(e.target.value) })}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">No. of Questions</label>
              <input
                type="number"
                min="1"
                max="5"
                value={config.questionCount}
                onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* DSA Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
            <div>
              <div className="font-bold text-lg">Include DSA Round</div>
              <div className="text-sm text-gray-500">Adds a coding challenge to the interview</div>
            </div>
            <button
              onClick={() => setConfig({ ...config, includeDSA: !config.includeDSA })}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                config.includeDSA ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200 ${
                config.includeDSA ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Standardized Room
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-center">
            <button className="text-blue-400 hover:underline">Join existing room with ID</button>
        </div>
      </div>
    </div>
  );
}
