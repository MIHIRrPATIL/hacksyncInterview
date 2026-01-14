"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Layout, Terminal, Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import AIChatModal from './AIChatModal';

interface CodingArenaProps {
  problem: any;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const CodingArena = ({ problem, isDarkMode, setIsDarkMode }: CodingArenaProps) => {
  const [code, setCode] = useState(`function solution(nums, target) {\n  // Write your code here\n  \n}`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleRunCode = () => {
    setOutput("Running tests...\n> Test Case 1: [2,7,11,15], target=9\n> Output: [0,1]\n> Result: PASS");
    toaster.create({
      title: "Code Executed",
      description: "Test cases completed. Check console for details.",
      type: "info",
    });
  };

  const handleSubmit = () => {
    toaster.create({
      title: "Submission Successful",
      description: "Your solution has been submitted for evaluation.",
      type: "success",
    });
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-64px)] transition-colors duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Panel */}
        <div className={`w-1/3 p-8 overflow-y-auto border-r transition-colors ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-100'}`}>
                  <Layout className={`w-5 h-5 ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`} />
               </div>
               <h2 className="text-xl font-black tracking-tight">{problem?.title || "Problem Loading..."}</h2>
            </div>
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border transition-colors ${
                isDarkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}>Medium</span>
          </div>
          
          <div className={`space-y-6 text-sm leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>
            <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>{problem?.description || "In this challenge, you need to find two numbers in an array that add up to a specific target."}</p>
            
            <div className={`p-5 rounded-2xl border font-mono text-xs transition-colors ${
                isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-100'
            }`}>
                <span className="text-orange-500 font-black tracking-widest uppercase block mb-2 opacity-50">Example 1</span>
                <div className="space-y-1">
                   <div className="flex gap-2">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-black/40'}>Input:</span> 
                      <code className={`font-black ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>nums = [2,7,11,15], target = 9</code>
                   </div>
                   <div className="flex gap-2">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-black/40'}>Output:</span>
                      <code className={`font-black ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>[0,1]</code>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className={`w-2/3 flex flex-col ${isDarkMode ? 'bg-black' : 'bg-gray-50/30'}`}>
          {/* Header */}
          <div className={`h-14 border-b flex items-center justify-between px-6 transition-colors ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
             <div className="flex items-center gap-6">
               <select 
                 value={language}
                 onChange={(e) => setLanguage(e.target.value)}
                 className={`bg-transparent text-sm font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-orange-500' : 'text-black'}`}
               >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
               </select>

               <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600'}`}
               >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>

               <Button 
                 onClick={() => setIsAIModalOpen(true)}
                 className={`h-9 px-4 rounded-xl font-black text-xs gap-2 transition-all ${
                   isDarkMode 
                   ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white' 
                   : 'bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white'
                 }`}
               >
                  <Sparkles size={14} /> AI HELP
               </Button>
             </div>

             <div className="flex gap-3">
                <Button 
                  onClick={handleRunCode}
                  variant="outline"
                  className={`h-9 px-4 font-black transition-all ${
                      isDarkMode 
                      ? 'bg-transparent border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white' 
                      : 'border-gray-200 text-black hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                  }`}
                >
                   <Play size={14} className="mr-2" /> RUN
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white font-black shadow-lg shadow-orange-500/20"
                >
                   <Send size={14} className="mr-2" /> SUBMIT
                </Button>
             </div>
          </div>

          <div className={`flex-1 relative border-b transition-colors ${isDarkMode ? 'border-gray-800' : 'border-gray-100 bg-white'}`}>
             <Editor
               height="100%"
               defaultLanguage="javascript"
               language={language}
               theme={isDarkMode ? "vs-dark" : "light"}
               value={code}
               onChange={(value) => setCode(value || "")}
               options={{
                 minimap: { enabled: false },
                 fontSize: 14,
                 lineHeight: 24,
                 scrollBeyondLastLine: false,
                 automaticLayout: true,
                 padding: { top: 24, bottom: 24 },
                 fontFamily: "'Geist Mono', 'Fira Code', monospace",
                 renderLineHighlight: 'none',
                 hideCursorInOverviewRuler: true,
                 bracketPairColorization: { enabled: true },
               }}
             />
          </div>
          
          {/* Console */}
          <div className={`h-1/3 overflow-hidden flex flex-col transition-colors ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
             <div className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] border-b flex items-center gap-2 transition-colors ${
                 isDarkMode ? 'text-gray-600 border-gray-800' : 'text-black/40 border-gray-50'
             }`}>
                <Terminal size={12} className="text-orange-500" />
                Console Output
             </div>
             <div className={`flex-1 p-6 font-mono text-sm font-medium overflow-y-auto transition-colors ${
                 isDarkMode ? 'bg-black text-orange-400/80' : 'bg-gray-50/50 text-black'
             }`}>
                <pre>{output || "Click 'RUN' to execute test cases against your code..."}</pre>
             </div>
          </div>
        </div>
      </div>

      <AIChatModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        currentCode={code}
        problem={problem}
      />
    </div>
  );
};

export default CodingArena;
