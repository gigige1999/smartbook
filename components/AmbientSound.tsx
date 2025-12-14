import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AmbientSound: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  
  useEffect(() => {
    return () => stopSound();
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const startSound = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Master Gain (Volume)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.05, ctx.currentTime); // Very low volume for ambience
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create a mysterious drone
    // Oscillator 1: Low fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1

    // Oscillator 2: Detuned slightly
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(58, ctx.currentTime); 

    // Oscillator 3: Very low rumbling
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(27.5, ctx.currentTime); // A0

    // Filter to muffle the sound (Rusty Lake vibe)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    // Simple Delay (Echo) for mystery
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.5;
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.6;
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(masterGain);

    // Connect graph
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(masterGain);
    filter.connect(delay);

    // LFO to modulate filter (breathing effect)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // Very slow
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    oscillatorsRef.current = [osc1, osc2, osc3, lfo];
    setIsPlaying(true);
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  };

  const stopSound = () => {
    oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleSound}
        className="bg-[#2c241b] text-[#e3dcd2] p-3 rounded-full shadow-lg hover:bg-[#4a3b2a] transition-all border border-[#8a7a5f] opacity-80 hover:opacity-100"
        title={isPlaying ? "Silence the spirits" : "Summon the atmosphere"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};
