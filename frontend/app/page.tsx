"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [roomToJoin, setRoomToJoin] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [config, setConfig] = useState({
    type: 'technical',
    capacity: 5,
    includeDSA: true,
    dsaCount: 2,
    vivaCount: 3,
    difficulty: 'medium',
  });

  const handleNumericChange = (field: string, value: string) => {
    const parsed = parseInt(value);
    setConfig(prev => ({ ...prev, [field]: isNaN(parsed) ? 1 : parsed }));
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }
    const roomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    router.push(`/interview/${roomId}?username=${encodeURIComponent(username)}`);
  };

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      alert("Please enter a username first!");
      return;
    }
    if (!roomToJoin.trim()) {
      alert("Please enter a Room ID!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomToJoin.toUpperCase()}`);
      if (res.ok) {
        router.push(`/interview/${roomToJoin.toUpperCase()}?username=${encodeURIComponent(username)}`);
      } else {
        alert("This Room ID does not exist! Please check the code or create a new room.");
      }
    } catch (error) {
      console.error("Error checking room:", error);
      alert("Failed to connect to the server. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          SKILLSPHERE
        </h1>
        <p className="text-gray-400 mb-10 text-lg">Standardized Interview Room Module</p>

        <div className="space-y-8">
          {/* Identity Section */}
          <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Interview Type</label>
              <select 
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value })}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3-5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Difficulty</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig({ ...config, difficulty: d.toLowerCase() })}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      config.difficulty === d.toLowerCase()
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-800 bg-gray-800/30 text-gray-400 font-bold text-xs uppercase'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Capacity</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.capacity.toString()}
                onChange={(e) => handleNumericChange('capacity', e.target.value)}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* DSA Count */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">DSA Questions</label>
              <input
                type="number"
                min="0"
                max="5"
                value={config.includeDSA ? config.dsaCount.toString() : "0"}
                disabled={!config.includeDSA}
                onChange={(e) => handleNumericChange('dsaCount', e.target.value)}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Viva Count */}
            <div>
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Viva Questions</label>
              <input
                type="number"
                min="0"
                max="10"
                value={config.vivaCount.toString()}
                onChange={(e) => handleNumericChange('vivaCount', e.target.value)}
                className="w-full bg-gray-800/50 border-2 border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* DSA Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
            <div>
              <div className="font-bold text-lg">Coding Round</div>
              <div className="text-sm text-gray-500">Include real-time DSA challenge</div>
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
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/40 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Create Interview Room
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-center flex-col items-center gap-4">
            {!showJoinInput ? (
                <button 
                  onClick={() => setShowJoinInput(true)}
                  className="text-blue-400 hover:underline"
                >
                  Join existing room with ID
                </button>
            ) : (
                <div className="flex gap-2 w-full max-w-sm animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="ENTER ROOM ID"
                      value={roomToJoin}
                      onChange={(e) => setRoomToJoin(e.target.value.toUpperCase())}
                      className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none uppercase font-mono"
                    />
                    <button 
                      onClick={handleJoinRoom}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                    >
                      Join
                    </button>
                    <button 
                      onClick={() => setShowJoinInput(false)}
                      className="p-2 text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                </div>
            )}
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Powered by SkillSphere AI Engine</p>
        </div>
      </div>
    </div>
  );
}
