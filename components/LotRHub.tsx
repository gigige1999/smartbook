
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../types';
import { Swords, Compass, MousePointer2, Feather, Shield, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { GenerativeImage } from './GenerativeImage';

interface LotRHubProps {
  onNavigate: (state: ViewState) => void;
}

export const LotRHub: React.FC<LotRHubProps> = ({ onNavigate }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [embers, setEmbers] = useState<{id: number, left: string, delay: string, size: string}[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5500);
    const newEmbers = Array.from({length: 25}).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: `${0.5 + Math.random() * 2.5}px`
    }));
    setEmbers(newEmbers);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { 
        id: ViewState.LOTR_QUIZ, 
        title: "Trial of Destiny", 
        icon: Sparkles, 
        desc: "Which legendary figure of the Third Age mirrors your soul?",
        quote: "Fate is often hidden in the choices we make.",
        imagePrompt: "A mystical glowing mirror in a dark ancient temple, reflections of heroes"
    },
    { 
        id: ViewState.LOTR_CHARACTERS, 
        title: "Character Map", 
        icon: Shield, 
        desc: "The lineages of Men, Elves, Dwarves, and Hobbits.",
        quote: "All that is gold does not glitter, not all those who wander are lost.",
        imagePrompt: "A collection of ancient portraits on a stone wall, torchlight, medieval fantasy"
    },
    { 
        id: ViewState.LOTR_STORY_1, 
        title: "The Fellowship", 
        icon: Feather, 
        desc: "The journey begins from the quiet hills of the Shire.",
        quote: "I will take the Ring, though I do not know the way.",
        imagePrompt: "A group of nine silhouettes walking over a misty mountain ridge, sunrise, epic fantasy"
    },
    { 
        id: ViewState.LOTR_STORY_2, 
        title: "The Two Towers", 
        icon: Swords, 
        desc: "Darkness spreads from Isengard and Mordor alike.",
        quote: "There is some good in this world, and it's worth fighting for.",
        imagePrompt: "Two tall dark stone towers facing each other across a valley, lightning, ominous atmosphere"
    },
    { 
        id: ViewState.LOTR_STORY_3, 
        title: "Return of the King", 
        icon: Crown, 
        desc: "The final battle for the fate of Middle-earth.",
        quote: "End? No, the journey doesn't end here.",
        imagePrompt: "A crown made of silver and gold resting on a white stone altar, ray of light, triumphant"
    }
  ];

  if (showSplash) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        className="fixed inset-0 bg-[#0a0805] z-[100] flex flex-col items-center justify-center p-8 overflow-hidden text-center"
      >
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({length: 60}).map((_, i) => (
                <div key={i} className="ember" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${2 + Math.random() * 3}s`, width: '1.5px', height: '1.5px', backgroundColor: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
            ))}
        </div>
        <motion.div className="relative z-10 max-w-4xl px-4">
            <h2 className="text-2xl md:text-5xl font-title tracking-[0.3em] uppercase mb-6 lotr-entry-text leading-relaxed">
                All that is gold does not glitter,<br/>Not all those who wander are lost.
            </h2>
            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.4 }} transition={{ delay: 1, duration: 2 }} className="h-[1px] w-64 md:w-96 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mx-auto mt-12 shadow-[0_0_15px_#ffd700]" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen lotr-dark-bg flex items-center justify-center p-4 md:p-12 font-serif overflow-hidden relative">
      <div className="ember-container">
          {embers.map(e => (
              <div key={e.id} className="ember" style={{ left: e.left, animationDelay: e.delay, width: e.size, height: e.size }} />
          ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-6xl h-[90vh] md:h-[75vh] flex flex-col md:flex-row shadow-[0_80px_160px_rgba(0,0,0,1)] rounded-sm overflow-hidden bg-black/20"
      >
        <div className="absolute inset-0 parchment-unified">
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply opacity-20"></div>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-black/40 -translate-x-1/2 z-10"></div>
        </div>

        <div className="w-full md:flex-1 relative z-20 p-6 md:p-12 border-b md:border-b-0 md:border-r border-black/10 flex flex-col h-1/2 md:h-full overflow-y-auto scrollbar-vintage bg-transparent">
            <header className="mb-6 md:mb-10 border-b border-[#1a120b]/20 pb-4">
                <span className="font-fantasy text-[10px] uppercase tracking-[0.4em] text-[#5c4d3c] font-bold opacity-60">Westmarch Archives</span>
                <h1 className="text-2xl md:text-5xl font-black text-[#1a120b] uppercase tracking-tighter mt-2 font-uncial">Chronicles</h1>
            </header>

            <div className="flex-1 space-y-2 md:space-y-3">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.id}
                        onMouseEnter={() => setActiveSection(i)}
                        whileHover={{ x: 10 }}
                        className={`group relative flex items-center gap-4 p-2 md:p-3 cursor-pointer transition-all rounded-sm
                            ${activeSection === i ? 'bg-[#d4af37]/10' : ''}
                        `}
                        onClick={() => onNavigate(section.id)}
                    >
                        <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] transition-all
                            ${activeSection === i ? 'bg-[#d4af37] text-white shadow-[0_0_15px_#d4af37]' : ''}
                        `}>
                            <section.icon size={16} />
                        </div>
                        <h3 className={`text-lg md:text-2xl font-bold uppercase tracking-wide font-fantasy transition-all
                            ${activeSection === i ? 'text-[#8b0000]' : 'text-[#1a120b]/60'}
                        `}>
                            {section.title}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="w-full md:flex-1 relative z-20 p-6 md:p-12 flex flex-col bg-black/5 overflow-y-auto scrollbar-vintage h-1/2 md:h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full min-h-full flex flex-col items-center justify-start text-center space-y-6 md:space-y-10 py-4 md:py-8"
                >
                    <div className="w-full max-w-[180px] md:max-w-[280px] aspect-square relative group shrink-0">
                        <div className="absolute -inset-2 md:-inset-4 border-[6px] md:border-[12px] border-[#0a0805] shadow-[0_15px_35px_rgba(0,0,0,0.5)] rounded-sm"></div>
                        <div className="absolute inset-0 bg-white p-1 z-10 shadow-inner overflow-hidden">
                            <GenerativeImage 
                                initialPrompt={sections[activeSection].imagePrompt}
                                alt={sections[activeSection].title}
                                stylePreset="LOTR_VINTAGE"
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 px-4 max-w-sm">
                        <p className="text-[#1a120b] text-sm md:text-lg italic leading-relaxed font-fantasy">
                            {sections[activeSection].desc}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-[#1a120b] text-[#d4af37] px-8 py-3 rounded-sm font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#d4af37]/30 shadow-lg"
                            onClick={() => onNavigate(sections[activeSection].id)}
                        >
                            Open Records <ArrowRight size={14} />
                        </motion.button>
                        <p className="text-[9px] md:text-[10px] font-mono italic text-gray-600 font-bold tracking-[0.2em] uppercase mt-4">
                            {sections[activeSection].quote}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
