import React, { useState } from 'react';
import { BUENDIA_FAMILY } from '../constants';
import { Character } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ChevronDown, 
    Scroll, Sparkles, FlaskConical, Home, 
    Anchor, Fish, Scissors, Bone, 
    Sword, Ticket, Cross, Wind, 
    BookOpen, CircleDollarSign, Crown, PawPrint, 
    Music, Droplets, Footprints, FileText, Bug 
} from 'lucide-react';

// Map icon strings to components
const IconMap: Record<string, React.FC<any>> = {
    Scroll, Sparkles, FlaskConical, Home,
    Anchor, Fish, Scissors, Bone,
    Sword, Ticket, Cross, Wind,
    BookOpen, CircleDollarSign, Crown, PawPrint,
    Music, Droplets, Footprints, FileText, Bug
};

export const FamilyTree: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  // Group characters by generation
  const generations = [1, 2, 3, 4, 5, 6, 7];
  const externalChars = BUENDIA_FAMILY.filter(c => c.generation === 0);

  const getGenerationTitle = (gen: number) => {
    switch (gen) {
      case 1: return "The Founders";
      case 2: return "Expansion & Division";
      case 3: return "Chaos & Tragedy";
      case 4: return "Prosperity & Decay";
      case 5: return "Modern Solitude";
      case 6: return "The Return";
      case 7: return "The Prophecy Fulfilled";
      default: return "";
    }
  };

  return (
    <div className="relative min-h-screen bg-[#e3dcd2] overflow-y-auto pb-40">
       {/* Background Center Line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#5c4d3c] opacity-20 border-l border-dashed border-[#2c241b] z-0"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
            <h2 className="font-title text-4xl text-[#2c241b] tracking-widest">The Buendía Lineage</h2>
            <p className="font-hand text-[#5c4d3c]">A history of solitude repeated through seven generations.</p>
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center pt-4 opacity-50"
             >
                <ChevronDown />
             </motion.div>
        </div>

        {/* External Influences */}
        <div className="mb-24 relative">
             <h3 className="text-center font-mono text-sm text-[#8a7a5f] uppercase tracking-[0.3em] mb-8 border-b border-[#8a7a5f] inline-block left-1/2 -translate-x-1/2 relative px-4 pb-2">
                External Influences
             </h3>
             <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
                {externalChars.map(char => (
                    <CharacterNode key={char.id} char={char} onClick={setSelectedChar} />
                ))}
             </div>
        </div>

        {/* Generations Loop */}
        <div className="space-y-24">
            {generations.map(gen => {
                const chars = BUENDIA_FAMILY.filter(c => c.generation === gen);
                if (chars.length === 0) return null;

                return (
                    <div key={`gen-${gen}`} className="relative">
                        {/* Generation Marker */}
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <div className="h-[1px] w-12 bg-[#5c4d3c] opacity-50"></div>
                            <div className="text-center">
                                <span className="block font-title text-2xl text-[#2c241b]">Generation {toRoman(gen)}</span>
                                <span className="block font-mono text-xs text-[#8a7a5f] uppercase tracking-wider">{getGenerationTitle(gen)}</span>
                            </div>
                            <div className="h-[1px] w-12 bg-[#5c4d3c] opacity-50"></div>
                        </div>

                        {/* Nodes */}
                        <div className="flex justify-center gap-8 md:gap-12 flex-wrap px-4">
                            {chars.map(char => (
                                <CharacterNode key={char.id} char={char} onClick={setSelectedChar} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <CharacterModal char={selectedChar} onClose={() => setSelectedChar(null)} />
    </div>
  );
};

const CharacterNode: React.FC<{ char: Character, onClick: (c: Character) => void }> = ({ char, onClick }) => {
    const isFamily = char.type === 'FAMILY';
    const Icon = IconMap[char.symbol] || Sparkles;
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.05, rotate: isFamily ? 1 : -1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3 cursor-pointer group w-32 md:w-40 relative"
            onClick={() => onClick(char)}
        >
            {/* Portrait Frame */}
            <div className={`relative w-28 h-28 md:w-36 md:h-36 overflow-hidden bg-[#d6cfc4] shadow-md transition-all group-hover:shadow-2xl
                ${isFamily ? 'border-[3px] border-[#2c241b] rounded-sm' : 'border-[3px] border-[#8a7a5f] rounded-full'}
            `}>
                <GenerativeImage 
                    initialPrompt={char.imagePrompt} 
                    alt={char.name}
                    className="w-full h-full opacity-90 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-500 sepia"
                />
                
                {/* Overlay effect */}
                <div className="absolute inset-0 ring-inset ring-4 ring-black/10 pointer-events-none"></div>

                {/* Symbolic Icon Badge */}
                <div className="absolute -bottom-1 -right-1 bg-[#2c241b] text-[#e3dcd2] p-1.5 rounded-tl-lg shadow-lg border-t border-l border-[#8a7a5f] z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Icon size={18} strokeWidth={1.5} />
                </div>
            </div>

            {/* Name Tag */}
            <div className="text-center z-20 relative flex flex-col items-center">
                <span className={`block font-hand font-bold text-sm bg-[#f2efe9] px-2 py-1 shadow-sm border border-[#d6cfc4] text-[#2c241b]
                     ${!isFamily && 'text-[#5c4d3c]'}
                `}>
                    {char.name}
                </span>
                
                {/* Mobile visible icon (since hover doesn't work well on mobile) */}
                <div className="md:hidden mt-1 text-[#5c4d3c] opacity-50">
                    <Icon size={14} />
                </div>

                <span className="text-[10px] font-mono text-[#5c4d3c] mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                    {char.relation}
                </span>
            </div>
        </motion.div>
    );
};

const CharacterModal: React.FC<{ char: Character | null, onClose: () => void }> = ({ char, onClose }) => {
    if (!char) return null;
    const Icon = IconMap[char.symbol] || Sparkles;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-[#1a1510]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    className="bg-[#e3dcd2] max-w-2xl w-full rounded-sm shadow-2xl overflow-hidden border-4 border-[#2c241b] relative m-auto my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-[#d6cfc4] rounded-full z-20 transition-colors"
                    >
                        <X size={24} className="text-[#2c241b]"/>
                    </button>

                    <div className="flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="w-full md:w-1/2 p-8 bg-[#d6cfc4] flex items-center justify-center border-b md:border-b-0 md:border-r border-[#8a7a5f]">
                            <div className="w-full aspect-square relative shadow-xl border-8 border-white bg-white rotate-1 transform group-hover:rotate-0 transition-transform">
                                <GenerativeImage 
                                    initialPrompt={char.imagePrompt}
                                    alt={char.name}
                                    className="w-full h-full"
                                />
                                {/* Tape */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#f2efe9]/50 rotate-[-2deg] border border-white/20 shadow-sm"></div>
                                
                                {/* Large Watermark Icon */}
                                <div className="absolute bottom-4 right-4 text-[#2c241b] opacity-20">
                                    <Icon size={64} strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="w-full md:w-1/2 p-8 space-y-6 relative paper-texture">
                            <div className="space-y-2 border-b-2 border-[#2c241b] pb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-title text-3xl text-[#2c241b]">{char.name}</h2>
                                    <p className="font-mono text-xs uppercase tracking-widest text-[#5c4d3c]">{char.relation}</p>
                                </div>
                                <div className="text-[#5c4d3c]">
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="prose prose-stone">
                                <p className="font-hand text-lg leading-relaxed text-[#2c241b]">
                                    "{char.description}"
                                </p>
                            </div>

                            <div className="pt-4 space-y-2 text-sm font-mono text-[#5c4d3c]">
                                {char.partner && (
                                    <div className="flex gap-2">
                                        <span className="font-bold">Partner:</span>
                                        <span>{BUENDIA_FAMILY.find(c => c.id === char.partner)?.name || char.partner}</span>
                                    </div>
                                )}
                                {char.parents && (
                                    <div className="flex gap-2">
                                        <span className="font-bold">Lineage:</span>
                                        <span>
                                            {char.parents.map(pid => BUENDIA_FAMILY.find(c => c.id === pid)?.name).join(' & ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="absolute bottom-2 right-2 opacity-20">
                                <span className="font-title text-6xl">{char.generation > 0 ? toRoman(char.generation) : ''}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

function toRoman(num: number): string {
    const roman = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let str = '';
    for (const i of Object.keys(roman) as Array<keyof typeof roman>) {
        const q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str;
}
