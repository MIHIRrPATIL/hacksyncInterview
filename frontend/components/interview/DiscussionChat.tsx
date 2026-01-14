"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const DiscussionChat = () => {
  const [messages, setMessages] = useState([
    { user: 'Candidate_482', text: 'That coding problem was tricky!', role: 'other' },
    { user: 'Candidate_109', text: 'Yeah, I struggled with the edge cases.', role: 'other' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: 'You', text: input, role: 'me' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-96 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-gray-200">Session Discussion</h3>
        <span className="text-xs text-gray-500 bg-gray-950 px-2 py-1 rounded">Temporary Chat</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'me' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.user}</span>
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-gray-950/50 border-t border-gray-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border-none rounded-xl px-4 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
        <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-all">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default DiscussionChat;
