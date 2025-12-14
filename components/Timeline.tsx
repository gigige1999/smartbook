import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryPhase } from '../types';
import { STORY_PHASES } from '../constants';
import { GenerativeImage } from './GenerativeImage';
import { ArrowDown } from 'lucide-react';

export const Timeline: React.FC = () => {
  const [revealedIndex, setRevealedIndex] = useState(0);

  const revealNext = () => {
    if (revealedIndex < STORY_PHASES.length - 1) {
      setRevealedIndex(prev => prev + 1);
      // Smooth scroll to bottom after small delay
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-16 pb-40">
      <div className="text-center space-y-4 mb-16">
        <h2 className="font-title text-3xl text-[#2c241b]">The Cycle of Time</h2>
        <p className="font-hand text-[#5c4d3c]">Events repeat themselves in a wheel that spins for eternity...</p>
      </div>

      <div className="relative border-l-2 border-[#5c4d3c] border-dashed ml-6 md:ml-10 space-y-16">
        {STORY_PHASES.map((phase, index) => (
          index <= revealedIndex && (
            <TimelineCard key={phase.id} phase={phase} index={index} />
          )
        ))}
        
        {revealedIndex < STORY_PHASES.length - 1 && (
             <div className="absolute -bottom-16 left-[-11px] md:left-[29px]">
                 <button 
                    onClick={revealNext}
                    className="flex items-center gap-2 bg-[#2c241b] text-[#e3dcd2] px-6 py-3 rounded-sm font-mono text-sm hover:bg-[#4a3b2a] transition-colors shadow-lg z-10 relative"
                 >
                    <ArrowDown size={16} />
                    Next Cycle
                 </button>
             </div>
        )}
      </div>
    </div>
  );
};

const TimelineCard: React.FC<{ phase: StoryPhase, index: number }> = ({ phase, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20, rotate: -1 }}
      animate={{ opacity: 1, x: 0, rotate: index % 2 === 0 ? 1 : -1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline Node */}
      <div className="absolute -left-[9px] top-0 w-5 h-5 bg-[#2c241b] rounded-full border-4 border-[#e3dcd2] z-10"></div>

      <div className="bg-[#f2efe9] p-6 shadow-xl border border-[#d6cfc4] transform transition-transform hover:scale-[1.01]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 shrink-0">
             <div className="relative -rotate-2 transform transition-transform hover:rotate-0 duration-500">
                <GenerativeImage 
                    initialPrompt={phase.imagePrompt} 
                    alt={phase.title}
                    aspectRatio="aspect-[3/4]"
                    className="shadow-md"
                />
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#e3dcd2]/80 rotate-2 shadow-sm border border-white/20"></div>
             </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#d6cfc4] pb-2">
                <h3 className="font-title text-xl font-bold text-[#2c241b]">{phase.title}</h3>
                <span className="font-mono text-xs text-[#8a7a5f]">Phase {phase.id}</span>
            </div>
            <p className="font-hand text-lg leading-relaxed text-[#4a3b2a]">
              {phase.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
