import React from 'react';
import { motion } from 'framer-motion';
import { BOOKS } from '../constants';
import { Book } from '../types';
import { Lock } from 'lucide-react';

interface LibraryProps {
  onSelectBook: (bookId: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ onSelectBook }) => {
  return (
    <div className="min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <header className="text-center space-y-4">
          <h1 className="font-title text-4xl md:text-5xl text-[#2c241b] tracking-widest">
            THE ARCHIVES
          </h1>
          <div className="h-[2px] w-24 bg-[#5c4d3c] mx-auto opacity-50"></div>
          <p className="font-hand text-[#5c4d3c] text-lg">
            Choose a manuscript to unravel its secrets.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 justify-items-center">
          {BOOKS.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} onSelect={onSelectBook} />
          ))}
        </div>

      </div>
    </div>
  );
};

const BookCard: React.FC<{ book: Book, index: number, onSelect: (id: string) => void }> = ({ book, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      whileHover={{ y: -10, rotateX: 10 }}
      className={`relative w-full max-w-[220px] aspect-[2/3] perspective-1000 group cursor-pointer ${book.locked ? 'grayscale opacity-70 cursor-not-allowed' : ''}`}
      onClick={() => !book.locked && onSelect(book.id)}
    >
        {/* Book Shadow */}
        <div className="absolute inset-0 bg-black/20 translate-y-4 translate-x-2 blur-md rounded-r-md group-hover:blur-lg transition-all"></div>

        {/* Book Spine (3D effect) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 rounded-l-sm transform -translate-x-4 skew-y-12 origin-right brightness-75 z-0" style={{ backgroundColor: book.coverColor }}></div>

        {/* Front Cover */}
        <div className="absolute inset-0 rounded-r-md shadow-2xl flex flex-col p-6 z-10 transition-transform duration-500 origin-left" 
             style={{ backgroundColor: book.coverColor }}>
          
          {/* Border Decoration */}
          <div className="absolute inset-3 border border-white/20 rounded-sm"></div>
          <div className="absolute inset-5 border border-white/10 rounded-sm"></div>

          <div className="h-full flex flex-col justify-between text-[#e3dcd2] text-center">
            <div className="mt-8 space-y-2">
                <span className="font-mono text-[10px] tracking-[0.2em] opacity-70 uppercase block">Interactive Book</span>
                <div className="w-8 h-[1px] bg-[#e3dcd2]/40 mx-auto"></div>
            </div>

            <h2 className="font-title text-2xl leading-snug tracking-wide">
              {book.title}
            </h2>

            <div className="mb-8">
                <p className="font-hand text-xs opacity-80 mb-2">{book.author}</p>
                {book.locked ? (
                    <div className="flex justify-center mt-4">
                        <Lock size={20} className="text-white/50" />
                    </div>
                ) : (
                    <div className="w-6 h-6 border border-[#e3dcd2]/40 rounded-full mx-auto flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        ➤
                    </div>
                )}
            </div>
          </div>
          
          {/* Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
        </div>
    </motion.div>
  );
};