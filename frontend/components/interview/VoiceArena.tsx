"use client";

import React, { useState, useEffect } from 'react';
import Waveform from './Waveform';
import { Mic, MicOff, CheckCircle } from 'lucide-react';

const VoiceArena = () => {
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [transcript, setTranscript] = useState([
    { role: 'ai', text: "Great job on the coding part! Now, could you please explain your approach to the problem?" }
  ]);
  const [isMicOn, setIsMicOn] = useState(true);

  // Simulate AI/User conversation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAiSpeaking(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-950 text-white p-8">
      {/* AI Visualizer Stage */}
      <div className="flex flex-col items-center mb-12">
        <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-6 ${
          isAiSpeaking ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'border-gray-800 bg-transparent'
        }`}>
          <div className="text-center">
            <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${isAiSpeaking ? 'text-blue-400' : 'text-gray-500'}`}>
              {isAiSpeaking ? 'Interviewer Speaking' : 'Listening...'}
            </div>
            <Waveform isActive={isAiSpeaking} />
          </div>
        </div>
      </div>
      
      {/* Transcript & Controls */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-md">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">Live Transcript</h3>
          <div className="h-64 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            {transcript.map((line, i) => (
              <div key={i} className={`flex ${line.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                 <div className={`max-w-[80%] p-4 rounded-2xl text-lg leading-relaxed ${
                   line.role === 'ai' 
                   ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100' 
                   : 'bg-gray-800 border border-gray-700 text-gray-200'
                 }`}>
                   {line.text}
                 </div>
              </div>
            ))}
            {!isAiSpeaking && (
              <div className="flex justify-end">
                <div className="bg-gray-800/50 border border-dashed border-gray-600 p-4 rounded-2xl text-gray-500 italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  Your turn to speak...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full border transition-all ${
              isMicOn 
              ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
              : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
            }`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
             <CheckCircle size={20} /> Finish Interview
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default VoiceArena;
