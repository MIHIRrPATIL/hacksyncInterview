"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send } from 'lucide-react';

const CodingArena = ({ problem }: { problem: any }) => {
  const [code, setCode] = useState(`function solution(nums, target) {\n  // Write your code here\n  \n}`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    setOutput("Running tests...\n> Test Case 1: [2,7,11,15], target=9\n> Output: [0,1]\n> Result: PASS");
  };

  const handleSubmit = () => {
    alert("Code submitted successfully!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-950">
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Panel */}
        <div className="w-1/3 p-6 overflow-y-auto border-r border-gray-800 text-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{problem?.title || "Problem Loading..."}</h2>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">Easy</span>
          </div>
          <div className="prose prose-invert max-w-none space-y-4">
            <p>{problem?.description}</p>
            
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 font-mono text-sm">
                <span className="text-gray-500 italic">// Example 1</span>
                <div>Input: nums = [2,7,11,15], target = 9</div>
                <div>Output: [0,1]</div>
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-2/3 flex flex-col">
          {/* Header */}
          <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
               className="bg-gray-800 text-gray-300 text-sm border-none rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
             >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
             </select>

             <div className="flex gap-2">
                <button 
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition"
                >
                   <Play size={14} /> Run
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded transition"
                >
                   <Send size={14} /> Submit
                </button>
             </div>
          </div>

          <div className="flex-1 relative">
             <Editor
               height="100%"
               defaultLanguage="javascript"
               language={language}
               theme="vs-dark"
               value={code}
               onChange={(value) => setCode(value || "")}
               options={{
                 minimap: { enabled: false },
                 fontSize: 14,
                 scrollBeyondLastLine: false,
                 automaticLayout: true,
                 padding: { top: 20 }
               }}
             />
          </div>
          
          {/* Console */}
          <div className="h-1/4 bg-gray-900 border-t border-gray-800 overflow-hidden flex flex-col">
             <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
               Console Output
             </div>
             <div className="flex-1 p-4 font-mono text-sm text-gray-400 overflow-y-auto">
                <pre>{output || "Click 'Run' to see output..."}</pre>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingArena;
