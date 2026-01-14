"use client";

import * as React from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Code, 
  ArrowUpRight, 
  Info, 
  Users,
  Trophy,
  Brain
} from "lucide-react";

import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep === 1 && !username.trim()) {
      alert("Please enter your name first!");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateRoom();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateRoom = () => {
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

  const handleNumericChange = (field: string, value: string) => {
    const parsed = parseInt(value);
    setConfig(prev => ({ ...prev, [field]: isNaN(parsed) ? 1 : parsed }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
      <div className="absolute top-10 flex flex-col items-center">
         <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            SKILLSPHERE
         </h1>
         <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
      </div>

      <MultiStepForm
        currentStep={currentStep}
        totalSteps={totalSteps}
        title={currentStep === 1 ? "Personal Identity" : currentStep === 2 ? "Room Specifications" : "Interview Content"}
        description={currentStep === 1 ? "Tell us who you are before starting the session." : currentStep === 2 ? "Configure the logistics of this interview room." : "Define the challenges and evaluation criteria."}
        onBack={handleBack}
        onNext={handleNext}
        size="lg"
        nextButtonText={currentStep === totalSteps ? "Create & Launch" : "Continue"}
        className="bg-gray-900/40 backdrop-blur-2xl border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        footerContent={
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-widest font-bold">
            SkillSphere <span className="text-blue-500">v1.2</span>
          </div>
        }
      >
        {/* Step 1: Identity */}
        {currentStep === 1 && (
          <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-blue-500/10 rounded-lg"><User className="w-5 h-5 text-blue-400" /></div>
                 <Label htmlFor="username" className="text-lg font-bold">Display Name</Label>
              </div>
              <Input
                id="username"
                placeholder="How should others see you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 bg-gray-800/40 border-gray-700 text-lg focus-visible:ring-blue-500/30"
              />
              <p className="text-sm text-gray-500 italic">This name will be displayed in the lobby and result board.</p>
            </div>
          </div>
        )}

        {/* Step 2: Room Specs */}
        {currentStep === 2 && (
          <div className="space-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-500/10 rounded-lg"><Settings className="w-5 h-5 text-purple-400" /></div>
                   <Label>Interview Focus</Label>
                </div>
                <Select value={config.type} onValueChange={(v) => setConfig({...config, type: v})}>
                  <SelectTrigger className="h-12 bg-gray-800/40 border-gray-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical (Coding Focus)</SelectItem>
                    <SelectItem value="behavioral">Behavioral (Soft Skills)</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500/10 rounded-lg"><Users className="w-5 h-5 text-green-400" /></div>
                   <Label>Participant Capacity</Label>
                </div>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={config.capacity.toString()}
                  onChange={(e) => handleNumericChange('capacity', e.target.value)}
                  className="h-12 bg-gray-800/40 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-4">
               <Label>Difficulty Level</Label>
               <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <Button
                      key={d}
                      variant={config.difficulty === d.toLowerCase() ? 'default' : 'outline'}
                      onClick={() => setConfig({ ...config, difficulty: d.toLowerCase() })}
                      className={`h-14 rounded-xl border-2 transition-all ${
                        config.difficulty === d.toLowerCase()
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-800 bg-transparent text-gray-500 hover:border-gray-700'
                      }`}
                    >
                      {d}
                    </Button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Step 3: Content Setup */}
        {currentStep === 3 && (
          <div className="space-y-8 pt-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-black border border-gray-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl transition-all ${config.includeDSA ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-gray-800 text-gray-400'}`}>
                     <Code className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black">Coding Challenges</h3>
                     <p className="text-sm text-gray-500">Include real-time DSA coding round</p>
                  </div>
               </div>
               <Button 
                 variant={config.includeDSA ? 'default' : 'outline'}
                 onClick={() => setConfig({...config, includeDSA: !config.includeDSA})}
                 className={`w-28 rounded-xl ${config.includeDSA ? 'bg-blue-600 hover:bg-blue-500' : ''}`}
               >
                 {config.includeDSA ? 'ENABLED' : 'DISABLED'}
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <Label>DSA Question Count</Label>
                   </div>
                   <Input 
                      type="number"
                      disabled={!config.includeDSA}
                      value={config.includeDSA ? config.dsaCount : 0}
                      onChange={(e) => handleNumericChange('dsaCount', e.target.value)}
                      className="h-12 bg-gray-800/40 border-gray-700 disabled:opacity-20"
                   />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-pink-500" />
                      <Label>Viva/Voice Count</Label>
                   </div>
                   <Input 
                      type="number"
                      value={config.vivaCount}
                      onChange={(e) => handleNumericChange('vivaCount', e.target.value)}
                      className="h-12 bg-gray-800/40 border-gray-700"
                   />
                </div>
            </div>

            <Alert className="bg-blue-500/5 border-blue-500/20 text-blue-400">
               <Info className="w-4 h-4" />
               <AlertDescription>
                  SkillSphere AI will automatically generate questions based on these parameters.
               </AlertDescription>
            </Alert>
          </div>
        )}
      </MultiStepForm>

      {/* Footer Actions */}
      <div className="mt-12 w-full max-w-lg flex flex-col items-center gap-6">
          {!showJoinInput ? (
              <button 
                onClick={() => setShowJoinInput(true)}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 group"
              >
                Join existing room <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
          ) : (
              <div className="flex gap-2 w-full animate-in zoom-in-95 duration-300">
                  <Input 
                    placeholder="ENTER SECRET ROOM ID"
                    value={roomToJoin}
                    onChange={(e) => setRoomToJoin(e.target.value.toUpperCase())}
                    className="h-14 bg-gray-900 border-gray-700 text-center font-black tracking-widest text-blue-400 placeholder:text-gray-700"
                  />
                  <Button onClick={handleJoinRoom} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 font-black">JOIN</Button>
                  <Button variant="ghost" className="h-14 text-gray-600" onClick={() => setShowJoinInput(false)}>✕</Button>
              </div>
          )}
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em] font-black">Advanced Agentic Coding Interface</p>
      </div>
    </div>
  );
}
