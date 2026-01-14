"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DiscussionChat from '@/components/interview/DiscussionChat';
import EvaluationModal from '@/components/interview/EvaluationModal';
import { Trophy, Award, BarChart3, ChevronRight, Home, ArrowDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { io } from 'socket.io-client';
import { generateEvaluationPDF } from '@/lib/pdf-generator';

const SOCKET_URL = 'http://localhost:5000';

export default function ResultsPage({ params: paramsPromise }: { params: Promise<{ roomId: string }> }) {
  const params = use(paramsPromise);
  const roomId = params.roomId;
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "You";

  const [participants, setParticipants] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{ name: string, score: number } | null>(null);

  const handleOpenDetails = (candidate: any) => {
    setSelectedCandidate({ name: candidate.name, score: candidate.score });
    setIsModalOpen(true);
  };


  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    // Join room just to get status updates (no config needed here)
    socket.emit('join-room', { roomId, username });

    socket.on('room-update', (room: any) => {
       // Filter out duplicates if logic in backend allows multiple joins for same name
       const uniqueParticipants = room.participants; 
       setParticipants(uniqueParticipants);
       const me = uniqueParticipants.find((p: any) => p.name === username) || { name: username };
       setCurrentUser(me);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  // Deterministic score generator based on name char codes to stay consistent
  const getScore = (name: string) => {
    if (!name) return 750;
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 700 + (seed % 250); // Score between 700 and 950
  };

  const sortedParticipants = [...participants]
    .map(p => ({
      ...p,
      score: getScore(p.name),
      status: 'Completed', 
      color: p.name === username ? 'text-orange-500' : 'text-black/30'
    }))
    .sort((a, b) => b.score - a.score);

  const myRank = sortedParticipants.findIndex(p => p.name === username) + 1;
  const myScore = sortedParticipants.find(p => p.name === username)?.score || 850;

  return (
    <div className="min-h-screen bg-white text-black p-8 lg:p-12 font-sans overflow-x-hidden bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-orange-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Results Area */}
        <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-left-10 duration-700">
          <header className="flex flex-col gap-4">
             <div className="flex items-center gap-3 bg-orange-50 w-fit px-4 py-2 rounded-full border border-orange-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Session Evaluation Complete</span>
             </div>
             <h1 className="text-7xl font-black tracking-tighter text-black leading-tight">
               YOUR PERFORMANCE <br/> SUMMARY
             </h1>
             <p className="text-black/60 text-xl max-w-xl font-black">
               Stellar work, <span className="text-orange-500">{username}</span>. You ranked <span className="text-orange-600 font-black">#{myRank}</span> out of {participants.length} participants with an impressive final score.
             </p>
          </header>

          {/* Performance Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-orange-100 p-10 rounded-4xl flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_20px_60px_rgba(249,115,22,0.05)]">
               <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-orange-500 rotate-12">
                  <Trophy size={200} />
               </div>
               <div className="text-black/30 font-black uppercase tracking-[0.2em] text-[10px] mb-6">Overall Proficiency</div>
               <div className="text-8xl font-black text-orange-500 mb-4 tracking-tighter">{Math.floor(myScore / 10)}<span className="text-3xl font-black text-black/10">/100</span></div>
               <div className="bg-orange-50 px-4 py-2 rounded-full text-orange-600 font-black text-xs flex items-center gap-2 border border-orange-100">
                  <Award size={14} /> ELITE BAND
               </div>
            </div>

            <div className="bg-white border border-gray-100 p-10 rounded-4xl space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
               <h3 className="text-black font-black flex items-center justify-between">
                  <span className="flex items-center gap-2">
                     <BarChart3 size={20} className="text-orange-400" /> Score Weights
                  </span>
                  <div className="flex gap-1">
                     {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-orange-100 rounded-full" />)}
                  </div>
               </h3>
               <div className="space-y-6">
                  {[
                    { label: 'Technical Accuracy', val: 95, color: 'bg-orange-500' },
                    { label: 'Conceptual Clarity', val: 82, color: 'bg-orange-300' },
                    { label: 'Soft Skills', val: 78, color: 'bg-black' }
                  ].map((s) => (
                    <div key={s.label}>
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                          <span className="text-black/30">{s.label}</span>
                          <span className="text-black">{s.val}%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden p-0.5">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Leaderboard Table */}
          <section className="bg-white border border-gray-100 rounded-4xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
             <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <Users className="w-5 h-5 text-orange-500" />
                   Room Ranking ({participants.length})
                </h3>
                <span className="text-[10px] font-black text-black/20 uppercase tracking-widest italic">Standardized Weights Applied</span>
             </div>
             <div className="divide-y divide-gray-50">
                {sortedParticipants.length === 0 ? (
                    <div className="p-10 text-center text-black/30 font-black uppercase tracking-widest">
                        Waiting for results data...
                    </div>
                ) : (
                    sortedParticipants.map((s, idx) => (
                    <div key={s.id || idx} className="px-10 py-8 flex items-center justify-between hover:bg-orange-50/20 transition-all cursor-default group">
                        <div className="flex items-center gap-8">
                            <span className={`text-3xl font-black w-8 ${s.color}`}>0{idx + 1}</span>
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-xl font-black transition-all group-hover:border-orange-500 group-hover:text-orange-500 ${s.color === 'text-orange-500' ? 'border-orange-500 shadow-lg shadow-orange-100' : 'text-black/10'}`}>
                                {s.name[0]?.toUpperCase()}
                                </div>
                                <div>
                                <div className="font-black text-xl text-black flex items-center gap-2">
                                    {s.name}
                                    {s.name === username && <span className="bg-orange-100 text-orange-600 text-[9px] px-2 py-0.5 rounded-full">YOU</span>}
                                </div>
                                <div className="text-[10px] text-black/30 font-black uppercase tracking-[0.2em] mt-1">{s.status}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-black mb-1 text-black">{s.score} <span className="text-[10px] text-black/20 font-black tracking-widest ml-1">POINTS</span></div>
                            <button 
                                onClick={() => handleOpenDetails(s)}
                                className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-orange-600 transition-colors"
                            >
                            Details <ChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                    ))
                )}
             </div>
          </section>
        </div>

        {/* Sidebar: Chat & Feedback */}
        <aside className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
           <div className="bg-orange-500 p-10 rounded-4xl relative overflow-hidden group shadow-2xl shadow-orange-200">
              <div className="relative z-10">
                 <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">AI FEEDBACK</h3>
                 <p className="text-orange-100 text-sm mb-8 font-black leading-relaxed">Download your comprehensive technical evaluation and improvement path.</p>
                 <button 
                    onClick={() => currentUser && generateEvaluationPDF({ name: currentUser.name, score: sortedParticipants.find(p => p.name === currentUser.name)?.score || 850 })}
                    className="w-full py-5 bg-white text-orange-600 font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                    <ArrowDown size={20} /> GET FULL REPORT
                 </button>
              </div>

              <div className="absolute -bottom-12 -right-12 text-white/10 group-hover:scale-110 transition-transform rotate-12">
                 <Award size={240} />
              </div>
           </div>

           <DiscussionChat />

           <Link href="/" className="w-full h-20 flex items-center justify-center gap-2 text-black/30 font-black uppercase tracking-widest border-4 border-dashed border-gray-100 rounded-4xl hover:border-orange-200 hover:text-orange-600 transition-all group">
              <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" /> 
              Back home
           </Link>
        </aside>
      </div>

      <EvaluationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        candidateName={selectedCandidate?.name || ''} 
        score={selectedCandidate?.score || 0} 
      />
    </div>
  );
}
