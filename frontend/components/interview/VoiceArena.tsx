"use client";

import React, { useState, useEffect } from 'react';
import Waveform from './Waveform';
import { Mic, MicOff, CheckCircle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-white text-black p-8 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-orange-50/50 via-white to-white">
      {/* AI Visualizer Stage */}
      <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-700">
        <div className={`w-56 h-56 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-6 bg-white ${
          isAiSpeaking ? 'border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.15)] bg-orange-50/10' : 'border-gray-100'
        }`}>
          <div className="text-center flex flex-col items-center">
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isAiSpeaking ? 'text-orange-600' : 'text-black/30'}`}>
              {isAiSpeaking ? 'AI Interviewer' : 'System Ready'}
            </div>
            <Waveform isActive={isAiSpeaking} />
          </div>
        </div>
      </div>
      
      {/* Transcript & Controls */}
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="bg-white border border-orange-100 p-10 rounded-4xl shadow-[0_20px_60px_rgba(249,115,22,0.05)]">
          <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
             <h3 className="text-black/30 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Radio className="w-3 h-3 text-orange-500" />
                Live Analysis
             </h3>
             <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-orange-200 rounded-full" />)}
             </div>
          </div>

          <div className="h-72 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            {transcript.map((line, i) => (
              <div key={i} className={`flex ${line.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-500`}>
                 <div className={`max-w-[85%] p-6 rounded-3xl text-lg leading-relaxed font-black ${
                   line.role === 'ai' 
                   ? 'bg-orange-50 border border-orange-100 text-black shadow-sm' 
                   : 'bg-white border border-gray-100 text-black/70 shadow-sm'
                 }`}>
                   {line.text}
                 </div>
              </div>
            ))}
            {!isAiSpeaking && (
              <div className="flex justify-end animate-pulse">
                <div className="bg-orange-50/50 border border-dashed border-orange-200 px-6 py-4 rounded-3xl text-orange-600 text-sm font-black italic flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                  Please explain your logic...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
              isMicOn 
              ? 'bg-white border-gray-100 text-black/20 hover:border-orange-300 hover:text-orange-500 shadow-sm' 
              : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100 shadow-lg shadow-red-100'
            }`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <Button className="px-10 h-16 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl flex items-center gap-2 shadow-xl shadow-orange-100 transition-all text-lg">
             <CheckCircle size={22} /> FINISH INTERVIEW
          </Button>
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
          background: #ffe7d9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default VoiceArena;
