"use client";

import React from 'react';
import Link from 'next/link';
import DiscussionChat from '@/components/interview/DiscussionChat';
import { Trophy, Award, BarChart3, ChevronRight } from 'lucide-react';

export default function ResultsPage() {
  const scores = [
    { rank: 1, name: 'You', score: 850, status: 'Top Performer', color: 'text-yellow-400' },
    { rank: 2, name: 'Candidate_482', score: 720, status: 'Completed', color: 'text-gray-300' },
    { rank: 3, name: 'Candidate_109', score: 650, status: 'Completed', color: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Results Area */}
        <div className="lg:col-span-2 space-y-12">
          <header className="flex flex-col gap-4">
             <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
               SESSION COMPLETE
             </h1>
             <p className="text-gray-400 text-xl max-w-xl">
               Great work today. You ranked <span className="text-white font-bold">#1</span> out of 5 participants.
             </p>
          </header>

          {/* Performance Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy size={120} />
               </div>
               <div className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Overall Performance</div>
               <div className="text-7xl font-black text-blue-400 mb-2">85<span className="text-3xl font-bold text-gray-700">%</span></div>
               <div className="text-green-500 font-bold flex items-center gap-2">
                  <Award size={18} /> Top 5% of all users
               </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2.5rem] space-y-6">
               <h3 className="text-gray-200 font-bold flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-400" /> Score Breakdown
               </h3>
               <div className="space-y-4">
                  {[
                    { label: 'Coding Accuracy', val: 95, color: 'bg-blue-500' },
                    { label: 'Technical Explanation', val: 82, color: 'bg-purple-500' },
                    { label: 'Communication', val: 78, color: 'bg-pink-500' }
                  ].map((s) => (
                    <div key={s.label}>
                       <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">{s.label}</span>
                          <span className="text-white font-bold">{s.val}%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Leaderboard Table */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] overflow-hidden">
             <div className="px-8 py-6 border-b border-gray-800 bg-gray-800/30">
                <h3 className="text-xl font-bold">Standardized Leaderboard</h3>
             </div>
             <div className="divide-y divide-gray-800">
                {scores.map((s) => (
                  <div key={s.rank} className="px-8 py-6 flex items-center justify-between hover:bg-gray-800/20 transition-colors">
                     <div className="flex items-center gap-6">
                        <span className={`text-2xl font-black w-8 ${s.color}`}>#{s.rank}</span>
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-xl font-black ${s.color}`}>
                              {s.name[0]}
                           </div>
                           <div>
                              <div className="font-bold text-lg">{s.name}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-tighter">{s.status}</div>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <div className="text-2xl font-black mb-1">{s.score} <span className="text-xs text-gray-600 font-bold">PTS</span></div>
                        <button className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline">
                           View Solution <ChevronRight size={12} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar: Chat & Feedback */}
        <aside className="space-y-8">
           <div className="bg-blue-600 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white mb-2">Detailed Report</h3>
                 <p className="text-blue-100 text-sm mb-6 opacity-80">Download your AI-generated technical feedback report.</p>
                 <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                    Generate Full Report
                 </button>
              </div>
              <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform">
                 <Award size={200} />
              </div>
           </div>

           <DiscussionChat />

           <Link href="/" className="w-full flex items-center justify-center gap-2 py-5 text-gray-500 font-bold border-2 border-dashed border-gray-800 rounded-[2.5rem] hover:border-gray-600 hover:text-gray-300 transition-all">
              Return to Dashboard
           </Link>
        </aside>
      </div>
    </div>
  );
}
