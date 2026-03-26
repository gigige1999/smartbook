
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOTR_STORY } from '../constants';
import { LotRStoryPage } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { ChevronLeft, ChevronRight, BookOpen, Languages } from 'lucide-react';

interface LotRStoryProps {
  part: 'part1' | 'part2' | 'part3';
}

export const LotRStory: React.FC<LotRStoryProps> = ({ part }) => {
  const pages = LOTR_STORY[part];
  const [currentPage, setCurrentPage] = useState(0);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [embers, setEmbers] = useState<{id: number, left: string, delay: string}[]>([]);
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    // Constant background embers
    const newEmbers = Array.from({length: 15}).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`
    }));
    setEmbers(newEmbers);
  }, []);

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 800);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
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

  const page = pages[currentPage];
  const isSummary = page.id === 0;

  return (
    <div className="min-h-screen lotr-dark-bg flex items-center justify-center p-4 md:p-12 font-serif overflow-hidden relative">
      <div className="ember-container opacity-50">
          {embers.map(e => (
              <div 
                key={e.id} 
                className="ember" 
                style={{
                    left: e.left, 
                    animationDelay: e.delay,
                    width: '1.5px',
                    height: '1.5px'
                }}
              />
          ))}
      </div>

      {/* Shimmer Effect during Page Turn */}
      <AnimatePresence>
        {shimmer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)', mixBlendMode: 'overlay' }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl w-full h-[85vh] shadow-[0_100px_200px_rgba(0,0,0,1)] rounded-sm flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Unified Parchment Spread */}
        <div className="absolute inset-0 parchment-unified">
            <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-for-air.png')] opacity-30 mix-blend-multiply"></div>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
          className="absolute top-6 right-20 z-40 bg-[#1a120b] text-[#d4af37] px-4 py-2 rounded-sm flex items-center gap-2 hover:scale-105 transition-all font-mono text-[10px] shadow-2xl border border-[#d4af37]/30 font-bold uppercase tracking-widest"
        >
          <Languages size={14} />
          {lang === 'zh' ? 'EN' : '中文'}
        </button>

        {/* Left Page: Illustration */}
        <div className="w-full md:w-[48%] h-1/2 md:h-full relative overflow-hidden border-r border-black/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <GenerativeImage 
                initialPrompt={page.imagePrompt}
                alt={lang === 'zh' ? page.title : page.titleEn}
                stylePreset="LOTR_VINTAGE"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
              {/* Added pointer-events-none to the overlay to prevent blocking interactions with the image generator */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10 pointer-events-none"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Page: Narrative Content */}
        <div className="w-full md:w-[52%] h-1/2 md:h-full p-8 md:p-20 flex flex-col relative overflow-y-auto scrollbar-vintage z-10 bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page.id}-${lang}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col h-full relative z-10"
            >
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-3 text-black/40 border-b border-black/10 pb-2">
                    <BookOpen size={18} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-black">
                        {isSummary ? (lang === 'zh' ? '西境纪事 · 序' : 'WESTMARCH · PROLOGUE') : `RECORD 0${page.id}`}
                    </span>
                </div>
                <h2 className={`
                  ${lang === 'en' ? 'font-uncial' : 'font-title'}
                  text-3xl md:text-5xl font-black text-[#1a120b] uppercase leading-tight drop-shadow-md
                `}>
                  {lang === 'zh' ? page.title : page.titleEn}
                </h2>
              </div>
              
              <div className="flex-1">
                <p className={`
                  ${lang === 'zh' ? 'text-xl md:text-2xl tracking-wide leading-[1.8]' : 'text-lg md:text-xl leading-[1.8] font-fantasy italic'}
                  text-[#2c1a0a] text-justify first-letter:text-8xl first-letter:font-title first-letter:mr-4 first-letter:float-left first-letter:text-[#1a120b] first-letter:leading-none
                `}>
                  {lang === 'zh' ? page.content : page.contentEn}
                </p>
              </div>

              <div className="mt-12 flex justify-between items-center opacity-40 border-t border-black/10 pt-6 text-[#1a120b]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-black">Elder Archives</span>
                  <span className="font-title text-sm font-black">RECORD {currentPage + 1} / {pages.length}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-10 right-10 flex gap-4 z-20">
            <button 
                onClick={prevPage}
                disabled={currentPage === 0}
                className="p-5 bg-black/5 text-black rounded-sm disabled:opacity-0 hover:bg-black hover:text-[#ffd700] transition-all shadow-xl backdrop-blur-md border border-black/10"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className="p-5 bg-black/5 text-black rounded-sm disabled:opacity-0 hover:bg-black hover:text-[#ffd700] transition-all shadow-xl backdrop-blur-md border border-black/10"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
