"use client";

import React, { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  isReady: boolean;
}

const Lobby = ({ roomId, participants, onReady }: { roomId: string, participants: Participant[], onReady: (status: boolean) => void }) => {
  const [isReady, setIsReady] = useState(false);
  const readyCount = participants.filter(p => p.isReady).length;

  const toggleReady = () => {
    const nextStatus = !isReady;
    setIsReady(nextStatus);
    onReady(nextStatus);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-black text-white p-6">
      {/* Ready Counter Banner */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div className="flex gap-2">
            {participants.map((p) => (
                <div 
                  key={p.id} 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    p.isReady ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-800'
                  }`} 
                />
            ))}
        </div>
        <div className="text-sm font-bold uppercase tracking-widest text-gray-500">
           <span className="text-green-500">{readyCount}</span> of <span className="text-white">{participants.length}</span> Participants Ready
        </div>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Info & Gear Check */}
        <div className="space-y-6">
           <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-xl">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                 <div className="w-2 h-8 bg-blue-500 rounded-full" />
                 Interview Protocol
              </h2>
              <div className="space-y-6 text-gray-400">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">01</div>
                  <p className="text-sm leading-relaxed">The timer starts as soon as you enter the coding arena. Focus on efficiency and edge cases.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">02</div>
                  <p className="text-sm leading-relaxed">After coding, the AI will ask follow-up questions. Your verbal explanation counts for 40% of the score.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">03</div>
                  <p className="text-sm leading-relaxed">Ensure dynamic communication. Explain <b>why</b> you chose a specific data structure.</p>
                </div>
              </div>
           </div>

           <button
             onClick={toggleReady}
             className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] border-b-4 ${
               isReady 
               ? 'bg-green-600 border-green-800 text-white shadow-green-900/20' 
               : 'bg-indigo-600 border-indigo-800 text-white shadow-indigo-900/20'
             }`}
           >
             {isReady ? 'WAITING FOR OTHERS...' : 'SIGNAL READY'}
           </button>
        </div>

        {/* Right: Participant List */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-200">Room Members</h3>
            <div className="px-3 py-1 bg-gray-800 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live</div>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {participants.map((p) => (
              <div key={p.id} className="group flex items-center justify-between p-5 bg-gray-800/20 rounded-[1.5rem] border border-gray-800/50 hover:border-gray-700 transition-all">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl font-black text-gray-500 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all">
                            {p.name[0]?.toUpperCase()}
                        </div>
                        {p.isReady && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200">{p.name}</span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{p.isReady ? 'Ready to Start' : 'Entering Room...'}</span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
