"use client";

import React, { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  isReady: boolean;
}

const Lobby = ({ roomId, participants, onReady }: { roomId: string, participants: Participant[], onReady: (status: boolean) => void }) => {
  const [isReady, setIsReady] = useState(false);

  const toggleReady = () => {
    const nextStatus = !isReady;
    setIsReady(nextStatus);
    onReady(nextStatus);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-black text-white p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Info & Gear Check */}
        <div className="space-y-8">
           <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-4">Interview Setup</h2>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                  <p>Check your camera and microphone.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
                  <p>Read the DSA problem carefully once it starts.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
                  <p>Prepare for AI follow-up questions after coding.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-xl text-yellow-500 text-sm">
                 ⚠️ Once you click "Ready", the session will start automatically when all participants are set.
              </div>
           </div>

           <button
             onClick={toggleReady}
             className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
               isReady 
               ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
               : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
             }`}
           >
             {isReady ? 'WAITING FOR OTHERS...' : 'I AM READY'}
           </button>
        </div>

        {/* Right: Participant List */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex justify-between">
            Participants
            <span className="text-blue-400 font-normal text-sm">{participants.length} Joined</span>
          </h3>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    <span className="font-medium">{p.name} {p.id === 'me' ? '(You)' : ''}</span>
                </div>
                {p.isReady ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-tighter">Ready</span>
                ) : (
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-500 text-xs font-bold rounded-full border border-gray-600/20 uppercase tracking-tighter">Joined</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
