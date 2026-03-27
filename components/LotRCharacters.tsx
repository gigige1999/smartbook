
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOTR_CHARACTERS } from '../constants';
import { Character } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { X, Sword, Shield, BookOpen, ChevronLeft, ChevronRight, User, Award, Zap, Languages } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { Language } from '../types';

export const LotRCharacters: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [shimmer, setShimmer] = useState(false);
  
  const char = LOTR_CHARACTERS[currentPage];

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 800);
  };

  const nextPage = () => {
    if (currentPage < LOTR_CHARACTERS.length - 1) {
      triggerShimmer();
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      triggerShimmer();
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen lotr-dark-bg flex items-center justify-center p-4 md:p-8 font-serif overflow-hidden relative">
      {/* Background Ambience */}
      <div className="ember-container opacity-30">
          {Array.from({length: 15}).map((_, i) => (
              <div key={i} className="ember" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, width: '1.5px', height: '1.5px' }} />
          ))}
      </div>

      <AnimatePresence>
        {shimmer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)', mixBlendMode: 'overlay' }} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl w-full h-[90vh] shadow-[0_100px_200px_rgba(0,0,0,1)] rounded-sm flex flex-col md:flex-row relative overflow-hidden">
        {/* Parchment Base */}
        <div className="absolute inset-0 parchment-unified">
            <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-for-air.png')] opacity-30 mix-blend-multiply"></div>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-black/40 -translate-x-1/2 z-10"></div>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLanguage(language === Language.ZH ? Language.EN : Language.ZH)}
          className="absolute top-4 right-16 z-40 bg-[#1a120b] text-[#d4af37] px-3 py-1.5 rounded-sm flex items-center gap-2 hover:scale-105 transition-all font-mono text-[9px] shadow-2xl border border-[#d4af37]/30 font-bold uppercase tracking-widest"
        >
          <Languages size={12} />
          {language === Language.ZH ? 'EN' : '中文'}
        </button>

        {/* Left Page: Portrait */}
        <div className="w-full md:w-1/2 h-2/5 md:h-full relative overflow-hidden border-r border-black/10 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={char.id}
              initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 p-6 md:p-12 flex items-center justify-center"
            >
              <div className="w-full h-full relative group">
                  <div className="absolute -inset-1.5 md:-inset-4 border-[6px] md:border-[12px] border-[#1a120b] shadow-[0_15px_45px_rgba(0,0,0,0.8)] z-0 rounded-sm"></div>
                  <div className="absolute inset-0 bg-white p-1 md:p-1.5 z-10 shadow-inner overflow-hidden">
                      <GenerativeImage 
                        initialPrompt={char.imagePrompt}
                        alt={t(char.name, char.nameEn)}
                        stylePreset="LOTR_VINTAGE"
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                        aspectRatio="aspect-square"
                      />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none opacity-60"></div>
                  <div className="absolute bottom-4 left-4 text-white z-30">
                      <p className="font-fantasy text-[9px] md:text-[14px] uppercase tracking-[0.3em] text-[#d4af37] mb-1 font-bold">
                        {t(char.type, char.typeEn)}
                      </p>
                      <h3 className="text-xl md:text-5xl font-black uppercase font-uncial leading-tight drop-shadow-lg">
                        {t(char.name, char.nameEn).split(' (')[0]}
                      </h3>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Page: Bestiary Entry */}
        <div className="w-full md:w-1/2 h-3/5 md:h-full p-6 md:p-12 flex flex-col relative z-20 bg-transparent overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${char.id}-${language}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                <div className="flex items-center gap-2 text-black/30 border-b border-black/10 pb-1.5">
                    <BookOpen size={16} />
                    <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black">
                        {t('古籍善本 · 第', 'ELDER RECORDS · FOLIO')} {currentPage + 1} {t('页', '')}
                    </span>
                </div>
                <h2 className={`
                  ${language === Language.EN ? 'font-uncial' : 'font-title'}
                  text-2xl md:text-5xl font-black text-[#1a120b] uppercase tracking-tighter leading-tight drop-shadow-sm
                `}>
                  {t(char.name, char.nameEn)}
                </h2>
              </div>
              
              <div className="flex-1 space-y-6 md:space-y-10">
                {/* Description */}
                <div className="bg-black/5 p-5 md:p-8 border-l-4 md:border-l-8 border-[#d4af37] relative">
                    <div className="absolute -top-3 -left-3 md:-top-5 md:-left-5 text-[#d4af37] opacity-20"><Award size={32} md={42} /></div>
                    <p className={`
                      ${language === Language.ZH ? 'text-lg md:text-xl' : 'text-base md:text-lg font-fantasy italic'}
                      leading-relaxed text-[#2c1a0a]
                    `}>
                      "{t(char.description, char.descriptionEn)}"
                    </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-8 md:gap-12 font-mono uppercase tracking-widest">
                    <div className="space-y-2 md:space-y-3">
                        <span className="text-[10px] md:text-[11px] font-black opacity-40 block flex items-center gap-2 tracking-[0.15em]">
                          <Zap size={14} className="text-[#d4af37]"/> {t('阵营', 'Faction')}
                        </span>
                        <span className={`
                          ${language === Language.ZH ? 'text-lg md:text-2xl font-title' : 'text-base md:text-lg font-fantasy font-bold'}
                          pb-1 border-b border-black/10 block transition-colors 
                          ${char.faction === '黑暗势力' ? 'text-red-900' : 'text-blue-900'}
                        `}>
                            {t(char.faction, char.factionEn)}
                        </span>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        <span className="text-[10px] md:text-[11px] font-black opacity-40 block flex items-center gap-2 tracking-[0.15em]">
                          <User size={14} className="text-[#d4af37]"/> {t('种族', 'Species')}
                        </span>
                        <span className={`
                          ${language === Language.ZH ? 'text-lg md:text-2xl font-title' : 'text-base md:text-lg font-fantasy font-bold'}
                          pb-1 border-b border-black/10 block text-[#1a120b]
                        `}>
                            {t(char.type, char.typeEn)}
                        </span>
                    </div>
                </div>

                {/* Legendary Saga Block */}
                {(char.deeds || char.deedsEn) && (
                  <div className="pt-6 md:pt-8 border-t border-black/5">
                    <h4 className="font-mono text-[10px] md:text-[11px] font-black opacity-30 uppercase tracking-[0.3em] mb-3 md:mb-4">
                      {t('史诗事迹', 'LEGENDARY SAGA')}
                    </h4>
                    <p className={`
                      ${language === Language.ZH ? 'text-base md:text-lg' : 'text-sm md:text-base font-fantasy italic'}
                      text-[#5c4d3c] leading-relaxed
                    `}>
                      {t(char.deeds, char.deedsEn)}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 md:mt-10 pt-6 border-t border-black/10 flex items-center justify-between">
                  <div className="flex gap-4 md:gap-6">
                    <button 
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1a120b] text-[#d4af37] rounded-sm disabled:opacity-20 hover:scale-110 transition-all shadow-xl border border-[#d4af37]/20"
                    >
                        <ChevronLeft size={24} md={28} />
                    </button>
                    <button 
                        onClick={nextPage}
                        disabled={currentPage === LOTR_CHARACTERS.length - 1}
                        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1a120b] text-[#d4af37] rounded-sm disabled:opacity-20 hover:scale-110 transition-all shadow-xl border border-[#d4af37]/20"
                    >
                        <ChevronRight size={24} md={28} />
                    </button>
                  </div>
                  <div className="text-right">
                      <span className="block font-mono text-[9px] md:text-[10px] opacity-40 uppercase tracking-[0.2em] mb-1">
                        {t('纪元定位', 'Chronicle Position')}
                      </span>
                      <span className="block font-uncial text-xl md:text-2xl font-bold text-[#1a120b]">{currentPage + 1} / {LOTR_CHARACTERS.length}</span>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
