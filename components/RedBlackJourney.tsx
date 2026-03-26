
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JULIEN_JOURNEY } from '../constants';
import { JourneyNode } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { Brain, X, ArrowRight } from 'lucide-react';

export const RedBlackJourney: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);

  return (
    <div className="min-h-screen bg-[#e5e5e5] relative overflow-hidden font-sans pb-20">
      {/* Background Split */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/2 bg-[#f0f0f0] border-r border-gray-300"></div>
        <div className="w-1/2 bg-[#e0e0e0]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4">
        
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 text-black uppercase">
            The Red <span className="text-[#cf1313]">&</span> Black
          </h1>
          <p className="text-gray-600 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">Julien Sorel's Descent</p>
        </header>

        {/* Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-20 md:space-y-32">
            {JULIEN_JOURNEY.map((node) => {
              return (
                <div key={node.id} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 relative group">
                  
                  {/* Left Side: Illustration Card */}
                  <div className="w-full md:w-[45%] md:pr-12 flex justify-center md:justify-end order-2 md:order-1">
                     <div className="relative w-64 h-80 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] bg-white rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-hidden p-1">
                            <GenerativeImage 
                                initialPrompt={node.imagePrompt}
                                alt={node.title}
                                aspectRatio="aspect-square"
                                stylePreset="RED_BLACK"
                                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="h-10 border-t-2 border-black flex items-center justify-center bg-white">
                            <span className="font-mono text-[10px] uppercase font-black tracking-widest">{node.title.length > 15 ? 'THE SEEKER' : node.title}</span>
                        </div>
                     </div>
                  </div>

                  {/* Center: Dot and Number */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center z-20 order-2">
                     <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-500
                        ${node.dominantColor === 'red' ? 'bg-[#cf1313]' : 'bg-black'}
                        group-hover:scale-150
                     `}></div>
                     <div className="mt-2 bg-white px-2 py-1 border-2 border-black font-bold text-xs select-none">
                        {node.id}
                     </div>
                  </div>

                  {/* Right Side: Narrative Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full md:w-[45%] md:pl-12 order-1 md:order-3 text-center md:text-left"
                  >
                     <div 
                        className="bg-white p-8 shadow-xl border-2 border-black hover:bg-gray-50 transition-all cursor-pointer relative overflow-hidden group/card flex flex-col h-full"
                        onClick={() => setSelectedNode(node)}
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none group-hover/card:opacity-10 transition-opacity">{node.id}</div>
                        
                        <div className={`absolute top-0 left-0 bottom-0 w-2 ${node.dominantColor === 'red' ? 'bg-[#cf1313]' : 'bg-black'}`}></div>

                        <h3 className="font-black text-2xl mb-4 uppercase tracking-tighter">{node.title}</h3>
                        <p className="text-sm text-gray-800 font-mono leading-relaxed mb-6">
                            "{node.context}"
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                             <span className={`text-[10px] uppercase font-black px-3 py-1 text-white rounded-none
                                ${node.dominantColor === 'red' ? 'bg-[#cf1313]' : node.dominantColor === 'black' ? 'bg-black' : 'bg-gradient-to-r from-[#cf1313] to-black'}
                             `}>
                                {node.dominantColor}
                             </span>
                        </div>

                        <div className="mt-auto pt-6 border-t-2 border-gray-100 flex justify-between items-center text-xs font-black uppercase tracking-tighter hover:text-[#cf1313] transition-colors group-hover/card:translate-x-2 duration-300">
                            <span>Analyze Psyche</span>
                            <ArrowRight size={18}/>
                        </div>
                     </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Modal Analysis */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedNode(null)}
          >
             <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl flex flex-col md:flex-row relative border-4 border-black"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 z-50 text-white md:text-black hover:rotate-90 transition-transform bg-black md:bg-transparent rounded-full p-2">
                <X size={28} />
              </button>

              {/* Visual Side */}
              <div className="w-full md:w-1/2 bg-[#111] relative flex items-center justify-center p-8">
                 <div className="w-full aspect-square border-4 border-white shadow-2xl relative">
                    <GenerativeImage 
                        initialPrompt={selectedNode.imagePrompt}
                        alt={selectedNode.title}
                        aspectRatio="aspect-square"
                        stylePreset="RED_BLACK"
                        className="w-full h-full"
                    />
                 </div>
              </div>

              {/* Analysis Side */}
              <div className="w-full md:w-1/2 p-10 flex flex-col bg-[#ffffff] relative">
                 <div className="mb-8 border-b-4 border-black pb-4">
                    <span className="font-mono text-xs text-[#cf1313] tracking-widest uppercase mb-2 block font-black">Record Phase {selectedNode.id}</span>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">{selectedNode.title}</h2>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="group">
                        <div className="flex items-center gap-3 mb-3 text-[#cf1313]">
                            <h3 className="font-black uppercase tracking-tighter text-sm">Passion (Rouge)</h3>
                        </div>
                        <p className="pl-6 border-l-4 border-[#cf1313] text-gray-900 leading-relaxed font-medium">
                            {selectedNode.redAspect}
                        </p>
                    </div>

                    <div className="group">
                        <div className="flex items-center gap-3 mb-3 text-black">
                            <h3 className="font-black uppercase tracking-tighter text-sm">Calculation (Noir)</h3>
                        </div>
                        <p className="pl-6 border-l-4 border-black text-gray-900 leading-relaxed font-medium">
                            {selectedNode.blackAspect}
                        </p>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t-2 border-gray-100 italic text-xs text-gray-400 font-mono">
                    "A man's worth in this world is estimated according to the value he puts upon himself."
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
