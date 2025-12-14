import React from 'react';
import { motion } from 'framer-motion';

interface BookCoverProps {
  onOpen: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="relative w-full max-w-md aspect-[3/4] cursor-pointer group perspective-1000"
        onClick={onOpen}
      >
        {/* Book Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#1a1510] rounded-l-sm z-0 transform -translate-x-2"></div>

        {/* Cover */}
        <div className="absolute inset-0 bg-[#2c241b] rounded-r-md shadow-2xl flex flex-col items-center justify-center border-r-4 border-b-4 border-[#1a1510] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-1">
          <div className="absolute inset-2 border-2 border-[#8a7a5f] rounded-sm opacity-50"></div>
          <div className="absolute inset-4 border border-[#8a7a5f] rounded-sm opacity-30"></div>
          
          <div className="p-8 text-center space-y-8">
            <h1 className="font-title text-4xl md:text-5xl text-[#d4cbb8] tracking-widest leading-relaxed">
              CIEN AÑOS<br/>DE<br/>SOLEDAD
            </h1>
            
            <div className="w-16 h-16 mx-auto border-2 border-[#d4cbb8] rounded-full flex items-center justify-center opacity-80">
               <span className="text-2xl text-[#d4cbb8]">♾️</span>
            </div>

            <p className="font-hand text-[#8a7a5f] text-lg mt-8">
              Gabriel García Márquez
            </p>

            <p className="font-mono text-xs text-[#5c4d3c] mt-12 animate-pulse">
              Click to Open
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
