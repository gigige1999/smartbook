
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Book } from '../types';

interface BookCoverProps {
  book: Book | null;
  onOpen: () => void;
  onBack: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ book, onOpen, onBack }) => {
  if (!book) return null;

  const isRedBlack = book.id === 'red_black';
  const isLotR = book.id === 'lotr';
  
  const coverBg = isLotR ? '#1a2a1a' : isRedBlack ? '#1a1a1a' : '#2c241b';
  const textColor = isLotR ? '#d4af37' : isRedBlack ? '#f0f0f0' : '#d4cbb8';
  const accentColor = isLotR ? '#d4af37' : isRedBlack ? '#cf1313' : '#8a7a5f';
  const spineColor = isLotR ? '#0d1a0d' : isRedBlack ? '#000000' : '#1a1510';
  const titleFont = isLotR ? 'font-title tracking-tight font-bold' : isRedBlack ? 'font-sans font-black tracking-tighter' : 'font-title tracking-widest';
  const icon = isLotR ? '💍' : isRedBlack ? '秤' : '♾️';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: isLotR ? '#0a0f0a' : isRedBlack ? '#e5e5e5' : 'transparent' }}>
      
      {isLotR && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[1px] border-[#d4af37]/20 blur-sm"></div>
        </div>
      )}

      <button 
        onClick={onBack}
        className={`absolute top-4 left-4 z-50 p-2 rounded-full transition-colors flex items-center gap-2 group
            ${isLotR ? 'text-[#d4af37] hover:bg-white/10' : isRedBlack ? 'text-black hover:bg-gray-200' : 'text-[#5c4d3c] hover:bg-[#d6cfc4]'}
        `}
      >
        <ArrowLeft size={20} />
        <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">Library</span>
      </button>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, rotateY: -20 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="relative w-full max-w-md aspect-[3/4] cursor-pointer group perspective-1000"
        onClick={onOpen}
      >
        {/* Book Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-6 rounded-l-sm z-0 transform -translate-x-3 shadow-2xl" style={{ backgroundColor: spineColor }}></div>

        {/* Cover */}
        <div 
            className={`absolute inset-0 rounded-r-md shadow-2xl flex flex-col items-center justify-center border-r-8 border-b-8 transition-all duration-700 group-hover:rotate-y-5
              ${isLotR ? 'border-[#d4af37]/30' : ''}
            `}
            style={{ 
                backgroundColor: coverBg,
                borderColor: isLotR ? '#111' : spineColor
            }}
        >
          {/* Ornate Gold Borders for LotR */}
          {isLotR && (
            <>
              <div className="absolute inset-4 border-4 border-[#d4af37] opacity-60 rounded-sm"></div>
              <div className="absolute inset-6 border-[1px] border-[#d4af37] opacity-40 rounded-sm"></div>
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-[#d4af37] opacity-80"></div>
              <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-[#d4af37] opacity-80"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-[#d4af37] opacity-80"></div>
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-[#d4af37] opacity-80"></div>
            </>
          )}

          {!isLotR && (
            <>
              <div className="absolute inset-2 border-2 rounded-sm opacity-50" style={{ borderColor: accentColor }}></div>
              <div className="absolute inset-4 border rounded-sm opacity-30" style={{ borderColor: accentColor }}></div>
            </>
          )}
          
          <div className="p-10 text-center space-y-10 z-10 relative">
            <h1 className={`${titleFont} text-3xl md:text-5xl leading-tight uppercase`} style={{ color: textColor }}>
              {book.title.split(' ').map((word, i) => (
                  <span key={i} className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{word}</span>
              ))}
            </h1>
            
            <div className={`w-20 h-20 mx-auto border-2 rounded-full flex items-center justify-center shadow-inner
                ${isLotR ? 'border-[#d4af37] bg-[#d4af37]/10' : ''}
            `} style={{ borderColor: textColor }}>
               <span className="text-3xl filter drop-shadow-lg">{icon}</span>
            </div>

            <div className="space-y-2">
                <p className="font-hand text-xl italic" style={{ color: accentColor }}>
                  {book.author}
                </p>
                {isLotR && <div className="h-[2px] w-16 bg-[#d4af37]/30 mx-auto"></div>}
            </div>

            <motion.p 
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-mono text-[10px] tracking-widest uppercase opacity-60" 
              style={{ color: textColor }}
            >
              Open the Manuscripts
            </motion.p>
          </div>

          {/* Texture Overlay */}
          <div className={`absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none 
              ${isLotR ? "bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" : "bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"}
          `}></div>
        </div>
      </motion.div>
    </div>
  );
};
