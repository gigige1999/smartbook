
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JULIEN_NETWORK, JULIEN_LINKS } from '../constants';
import { NetworkNode } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { X, Info, Network, Layers, Shield, Heart, Zap } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';

export const JulienNetwork: React.FC = () => {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [viewMode, setViewMode] = useState<'NETWORK' | 'SOCIAL'>('NETWORK');

  // Filter nodes based on view mode
  const visibleNodes = JULIEN_NETWORK.filter(node => {
      if (node.viewMode === 'NETWORK_ONLY' && viewMode !== 'NETWORK') return false;
      if (node.viewMode === 'SOCIAL_ONLY' && viewMode !== 'SOCIAL') return false;
      return true;
  });

  // Filter links
  const visibleLinks = JULIEN_LINKS.filter(link => {
      const mode = viewMode === 'NETWORK' ? 'NETWORK_ONLY' : 'SOCIAL_ONLY';
      return link.viewMode === 'ALL' || link.viewMode === mode;
  });

  return (
    <div className="min-h-screen bg-[#f0f0f0] relative overflow-hidden flex items-center justify-center font-sans">
      
      {/* Title & Controls */}
      <div className="absolute top-20 left-4 md:left-8 z-20 flex flex-col items-start gap-4">
        <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-black/80">{t('社交网络', 'Social Web')}</h2>
            <p className="font-mono text-xs text-red-700 tracking-widest mt-1">{t('红与黑', 'THE RED AND THE BLACK')}</p>
        </div>

        <div className="flex gap-2 bg-white/50 p-1 rounded border border-black/10 backdrop-blur-sm">
            <button 
                onClick={() => setViewMode('NETWORK')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-colors rounded-sm
                    ${viewMode === 'NETWORK' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-black/5'}
                `}
            >
                <Network size={14} />
                Relations
            </button>
            <button 
                onClick={() => setViewMode('SOCIAL')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-colors rounded-sm
                    ${viewMode === 'SOCIAL' ? 'bg-[#cf1313] text-white shadow-md' : 'text-gray-500 hover:bg-[#cf1313]/5'}
                `}
            >
                <Layers size={14} />
                Classes
            </button>
        </div>
      </div>

      {/* Social Layer Labels */}
      <AnimatePresence>
        {viewMode === 'SOCIAL' && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-0"
             >
                <div className="absolute top-[10%] left-4 right-4 border-b border-black/10 text-right">
                    <span className="text-[10px] font-mono text-black/30 uppercase tracking-widest">{t('贵族 / 权力', 'Aristocracy / Power')}</span>
                </div>
                <div className="absolute top-[45%] left-4 right-4 border-b border-black/10 text-right">
                    <span className="text-[10px] font-mono text-black/30 uppercase tracking-widest">{t('资产阶级 / 圣职', 'Bourgeoisie / Clergy')}</span>
                </div>
                <div className="absolute top-[85%] left-4 right-4 border-b border-black/10 text-right">
                    <span className="text-[10px] font-mono text-black/30 uppercase tracking-widest">{t('农民 / 仆人', 'Peasantry / Servants')}</span>
                </div>
             </motion.div>
        )}
      </AnimatePresence>

      {/* Network Container */}
      <div className="relative w-full h-[80vh] md:h-screen max-w-6xl mx-auto">
        
        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {visibleLinks.map((link, i) => {
            const startNode = visibleNodes.find(n => n.id === link.from);
            const endNode = visibleNodes.find(n => n.id === link.to);
            if (!startNode || !endNode) return null;

            const x1 = viewMode === 'SOCIAL' ? startNode.socialX ?? startNode.x : startNode.x;
            const y1 = viewMode === 'SOCIAL' ? startNode.socialY ?? startNode.y : startNode.y;
            const x2 = viewMode === 'SOCIAL' ? endNode.socialX ?? endNode.x : endNode.x;
            const y2 = viewMode === 'SOCIAL' ? endNode.socialY ?? endNode.y : endNode.y;

            return (
              <g key={`link-${i}-${viewMode}`}>
                 <motion.line 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    x1={`${x1}%`} y1={`${y1}%`}
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={link.color || 'black'}
                    strokeWidth="1.5"
                    strokeDasharray={link.type === 'dashed' ? "6,4" : link.type === 'dotted' ? "2,2" : "none"}
                  />
                  {link.label && (
                      <text 
                        x={(x1 + x2) / 2 + '%'} 
                        y={(y1 + y2) / 2 + '%'}
                        fill={link.color || 'black'}
                        fontSize="10"
                        fontWeight="900"
                        fontFamily="monospace"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        opacity="0.6"
                        dy="-6"
                        className="uppercase"
                      >
                          {t(link.label, link.labelEn)}
                      </text>
                  )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Nodes */}
        <AnimatePresence>
        {visibleNodes.map(node => {
            const targetX = viewMode === 'SOCIAL' ? (node.socialX ?? node.x) : node.x;
            const targetY = viewMode === 'SOCIAL' ? (node.socialY ?? node.y) : node.y;
            const isJulien = node.id === 'julien';

            return (
              <motion.div 
                key={node.id}
                layoutId={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    left: `${targetX}%`,
                    top: `${targetY}%` 
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.25 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                onClick={() => setSelectedNode(node)}
              >
                 <div className="flex flex-col items-center justify-center">
                    
                    {/* Circle Wrapper with Dynamic Border */}
                    <div 
                        className={`
                            rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                            ${node.size === 'lg' ? 'w-28 h-28 md:w-36 md:h-36 p-[6px]' : node.size === 'md' ? 'w-20 h-20 md:w-26 md:h-26 p-[4px]' : 'w-16 h-16 md:w-18 md:h-18 p-[3px]'}
                        `}
                        style={{
                            background: isJulien 
                                ? 'conic-gradient(from 0deg, #cf1313 0deg 180deg, #000000 180deg 360deg)'
                                : node.alignment === 'red' ? '#cf1313'
                                : node.alignment === 'black' ? '#000000'
                                : '#a1a1aa'
                        }}
                    >
                        <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                            <GenerativeImage 
                                initialPrompt={node.imagePrompt}
                                alt={node.name}
                                stylePreset="RED_BLACK"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    {/* Label Box like screenshot */}
                    <div className="absolute top-full mt-4 bg-white px-4 py-2 rounded-sm border-2 border-black/10 text-center whitespace-nowrap z-20 pointer-events-none group-hover:scale-105 group-hover:border-red-700 transition-all shadow-xl">
                        <span className="block font-black text-xs md:text-sm uppercase tracking-tighter text-black">{t(node.name, node.nameEn)}</span>
                        <div className={`h-[1px] w-8 mx-auto my-1 opacity-50 ${node.alignment === 'red' ? 'bg-red-700' : 'bg-black'}`}></div>
                        <span className={`block text-[10px] md:text-[11px] font-bold uppercase tracking-widest
                            ${node.alignment === 'red' || node.role.includes('LOVE') ? 'text-red-700' : 'text-gray-500'}
                        `}>
                            {t(node.role, node.roleEn)}
                        </span>
                    </div>
                 </div>
              </motion.div>
            );
        })}
        </AnimatePresence>

      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
            <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 border-l-8 border-black overflow-y-auto"
            >
                <div className="relative h-full flex flex-col">
                    <button 
                        onClick={() => setSelectedNode(null)} 
                        className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-full aspect-square bg-gray-100 relative">
                         <GenerativeImage 
                            initialPrompt={selectedNode.imagePrompt}
                            alt={selectedNode.name}
                            stylePreset="RED_BLACK"
                            className="w-full h-full"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                         <div className="absolute bottom-6 left-6 text-white">
                             <h2 className="text-4xl font-black uppercase leading-none mb-2 tracking-tighter">{t(selectedNode.name, selectedNode.nameEn)}</h2>
                             <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-red-700 text-white`}>
                                    {t(selectedNode.role, selectedNode.roleEn)}
                                </span>
                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border border-white text-white`}>
                                    {t('阵营', 'Alignment')}: {selectedNode.alignment}
                                </span>
                             </div>
                         </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1 bg-white">
                        <div className="flex gap-4 items-center border-b border-black/5 pb-4">
                             {selectedNode.alignment === 'red' && <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase"><Heart size={14} /> {t('激情', 'Passion')}</div>}
                             {selectedNode.alignment === 'black' && <div className="flex items-center gap-2 text-black font-black text-xs uppercase"><Shield size={14} /> {t('权力', 'Power')}</div>}
                             {selectedNode.alignment === 'mixed' && <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase"><Zap size={14} /> {t('分裂的灵魂', 'Divided Soul')}</div>}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {t(selectedNode.traits, selectedNode.traitsEn).split(',').map((trait, i) => (
                                <span key={i} className="px-3 py-1 rounded-sm border-2 border-black text-xs font-mono font-black hover:bg-red-700 hover:text-white transition-colors cursor-default uppercase">
                                    {trait.trim()}
                                </span>
                            ))}
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-black uppercase text-sm mb-3 text-red-700">
                                <Info size={16} />
                                {t('人物档案', 'Character Record')}
                            </h3>
                            <p className="text-lg leading-relaxed font-bold text-gray-800 font-mono">
                                {t(selectedNode.description, selectedNode.descriptionEn)}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
