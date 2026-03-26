
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOTR_CHARACTERS } from '../constants';
import { Character } from '../types';
import { GenerativeImage } from './GenerativeImage';
import { X, Sparkles, BookOpen, ChevronRight, RotateCcw, Languages, Compass, Award, Shield } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  textEn: string;
  imagePrompt: string;
  options: {
    text: string;
    textEn: string;
    traits: string[]; 
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "你在荒野中发现了一枚散发着诱人光芒的强大戒指，你会如何抉择？",
    textEn: "You find a powerful ring glowing with a seductive light in the wilderness. What do you do?",
    imagePrompt: "A golden ring glowing with ancient runes on a stone plinth, surrounded by mist",
    options: [
      { text: "立刻将其深埋，或是交给睿智的长者寻求指引。", textEn: "Bury it at once or seek counsel from the wise.", traits: ["Hobbit", "Light", "Wisdom"] },
      { text: "利用它来守卫我的家园与子民，抵御外敌。", textEn: "Use it as a weapon to defend my people and home.", traits: ["Man", "Light", "Power"] },
      { text: "潜心钻研其背后的奥秘，洞察万物之理。", textEn: "Study its ancient mysteries and the nature of all things.", traits: ["Maia", "Elf", "Wisdom"] },
      { text: "将其据为己有，这是属于我的权柄。", textEn: "Take it as my own. It is my right and my power.", traits: ["Shadow", "Ambition"] }
    ]
  },
  {
    id: 2,
    text: "在这动荡的世界中，你最向往的归宿是何处？",
    textEn: "In this fractured world, where do you long to find rest?",
    imagePrompt: "A panoramic view of Middle-earth landscapes, from snowy peaks to green valleys",
    options: [
      { text: "充满欢笑、美酒与宁静绿野的小山洞。", textEn: "A cozy hole filled with laughter, ale, and green hills.", traits: ["Hobbit", "Peace"] },
      { text: "雄伟庄严、象征人皇荣耀的白石之城。", textEn: "A grand white city of stone, symbolizing the glory of kings.", traits: ["Man", "Honor"] },
      { text: "如梦似幻、与自然共生的星光森林。", textEn: "An ethereal forest of starlight, living in harmony with nature.", traits: ["Elf", "Eternity"] },
      { text: "屹立于熔岩之上，统领众生的钢铁堡垒。", textEn: "A fortress of iron standing above molten lava, ruling all.", traits: ["Shadow", "Ambition"] }
    ]
  },
  {
    id: 3,
    text: "当邪恶的阴影笼罩大地，你选择用什么方式去战斗？",
    textEn: "When the shadow of evil spreads, how do you choose to fight?",
    imagePrompt: "Silhouettes of warriors charging into a dark storm, banners flying",
    options: [
      { text: "坚韧的意志与同伴间的生死契约。", textEn: "Steadfast will and the unbreakable bonds of fellowship.", traits: ["Hobbit", "Loyalty"] },
      { text: "祖传的圣剑，身先士卒冲向敌阵。", textEn: "An ancestral blade, leading the charge into the fray.", traits: ["Man", "Dwarf", "Valour"] },
      { text: "精准的长弓，或是流淌在血脉中的古老魔力。", textEn: "A precise bow, or the ancient magic flowing in my veins.", traits: ["Elf", "Elegance"] },
      { text: "无尽的黑暗军团，让恐惧成为最高效的武器。", textEn: "Countless legions, using fear as the ultimate tool.", traits: ["Shadow", "Power"] }
    ]
  },
  {
    id: 4,
    text: "面对未知的命运，你更相信什么？",
    textEn: "Facing an unknown destiny, what do you believe in most?",
    imagePrompt: "An ancient constellation map reflecting on still water",
    options: [
      { text: "我相信小人物也能通过努力改变世界的走向。", textEn: "I believe small people can change the course of the world.", traits: ["Hobbit", "Hope"] },
      { text: "我相信血脉的传承与不可逃避的责任。", textEn: "I believe in the strength of bloodline and duty.", traits: ["Man", "Duty"] },
      { text: "我相信古老的智慧与星辰的指引。", textEn: "I believe in ancient wisdom and the guidance of stars.", traits: ["Elf", "Maia", "Wisdom"] },
      { text: "我相信唯有绝对的力量才能终结混乱。", textEn: "I believe only absolute power can end the chaos.", traits: ["Shadow", "Power"] }
    ]
  }
];

export const LotRPersonalityTest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<'START' | 'QUIZ' | 'RESULT'>('START');
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [resultChar, setResultChar] = useState<Character | null>(null);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [shimmer, setShimmer] = useState(false);

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 800);
  };

  const handleStart = () => {
    setScores({});
    setQIndex(0);
    triggerShimmer();
    setCurrentStep('QUIZ');
  };

  const handleSelect = (traits: string[]) => {
    const newScores = { ...scores };
    traits.forEach(t => {
      newScores[t] = (newScores[t] || 0) + 1;
    });
    setScores(newScores);

    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      triggerShimmer();
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Record<string, number>) => {
    let bestMatch = LOTR_CHARACTERS[0];
    let maxOverlap = -1;

    LOTR_CHARACTERS.forEach(char => {
      let overlap = 0;
      
      if (finalScores[char.typeEn || ""]) overlap += 2;
      if (char.type.includes("霍比特") && finalScores["Hobbit"]) overlap += 2;
      if (char.type.includes("人类") && finalScores["Man"]) overlap += 2;
      if (char.type.includes("精灵") && finalScores["Elf"]) overlap += 2;
      
      if (char.factionEn === 'Forces of Light' && finalScores["Light"]) overlap += 1;
      if (char.factionEn === 'Forces of Shadow' && finalScores["Shadow"]) overlap += 3;

      const desc = (char.description + (char.descriptionEn || "")).toLowerCase();
      if (finalScores["Wisdom"] && (desc.includes("智慧") || desc.includes("wise"))) overlap++;
      if (finalScores["Power"] && (desc.includes("力量") || desc.includes("power"))) overlap++;
      if (finalScores["Loyalty"] && (desc.includes("忠诚") || desc.includes("loyalty"))) overlap++;
      if (finalScores["Hope"] && (desc.includes("希望") || desc.includes("hope"))) overlap++;

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = char;
      }
    });

    setResultChar(bestMatch);
    triggerShimmer();
    setCurrentStep('RESULT');
  };

  return (
    <div className="min-h-screen lotr-dark-bg flex items-center justify-center p-4 md:p-8 font-serif overflow-hidden relative">
      <div className="ember-container opacity-30">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="ember" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, width: '1.5px', height: '1.5px' }} />
        ))}
      </div>

      <AnimatePresence>
        {shimmer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)', mixBlendMode: 'overlay' }} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl w-full h-[90vh] shadow-[0_100px_200px_rgba(0,0,0,1)] rounded-sm flex flex-col md:flex-row relative overflow-hidden">
        <div className="absolute inset-0 parchment-unified">
            <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-for-air.png')] opacity-30 mix-blend-multiply"></div>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-black/40 -translate-x-1/2 z-10"></div>
        </div>

        <button 
          onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
          className="absolute top-4 right-16 z-40 bg-[#1a120b] text-[#d4af37] px-3 py-1.5 rounded-sm flex items-center gap-2 hover:scale-105 transition-all font-mono text-[9px] shadow-2xl border border-[#d4af37]/30 font-bold uppercase tracking-widest"
        >
          <Languages size={12} />
          {lang === 'zh' ? 'EN' : '中文'}
        </button>

        <AnimatePresence mode="wait">
          {currentStep === 'START' && (
            <div className="absolute inset-0 z-20 flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-2/5 md:h-full relative overflow-hidden border-r border-black/10 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full h-full relative group">
                        <div className="absolute -inset-1.5 md:-inset-4 border-[6px] md:border-[12px] border-[#1a120b] shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-0 rounded-sm"></div>
                        <div className="absolute inset-0 bg-white p-1 md:p-1.5 z-10 shadow-inner overflow-hidden">
                            <GenerativeImage 
                                initialPrompt="A glowing mystical mirror in an ancient elven hall, reflections of shifting destinies"
                                alt="Trial Start"
                                stylePreset="LOTR_VINTAGE"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 h-3/5 md:h-full p-6 md:p-16 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#1a120b] flex items-center justify-center text-[#1a120b] bg-[#d4af37]/10">
                        <Sparkles size={32} md={42} className="animate-pulse" />
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-3xl md:text-6xl font-black text-[#1a120b] uppercase font-uncial tracking-tighter">
                            {lang === 'zh' ? '天命之试炼' : 'TRIAL OF DESTINY'}
                        </h1>
                        <p className="text-lg md:text-xl italic font-fantasy text-[#2c1a0a] leading-relaxed max-w-sm mx-auto">
                            {lang === 'zh' 
                                ? '"在迷雾笼罩的第三纪元，你的灵魂深处究竟映照着哪位传奇的身影？"' 
                                : '"In the mist-shrouded Third Age, whose legendary soul is reflected in your own?"'}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStart}
                            className="bg-[#1a120b] text-[#d4af37] px-8 md:px-12 py-3 md:py-4 rounded-sm font-title font-bold uppercase tracking-[0.2em] shadow-xl border border-[#d4af37]/30"
                        >
                            {lang === 'zh' ? '开启试炼' : 'BEGIN TRIAL'}
                        </motion.button>
                        <button onClick={onBack} className="text-[#5c4d3c] font-mono text-[9px] md:text-[10px] uppercase tracking-widest hover:text-[#1a120b] transition-colors flex items-center gap-2">
                           <Compass size={12} /> {lang === 'zh' ? '返回目录' : 'BACK'}
                        </button>
                    </div>
                </div>
            </div>
          )}

          {currentStep === 'QUIZ' && (
            <div className="absolute inset-0 z-20 flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-2/5 md:h-full relative overflow-hidden border-r border-black/10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={qIndex}
                            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 p-6 md:p-12 flex items-center justify-center"
                        >
                            <div className="w-full h-full relative group">
                                <div className="absolute -inset-1.5 md:-inset-4 border-[6px] md:border-[12px] border-[#1a120b] shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-0 rounded-sm"></div>
                                <div className="absolute inset-0 bg-white p-1 md:p-1.5 z-10 shadow-inner overflow-hidden">
                                    <GenerativeImage 
                                        initialPrompt={QUESTIONS[qIndex].imagePrompt}
                                        alt="Destiny Visual"
                                        stylePreset="LOTR_VINTAGE"
                                        className="w-full h-full object-cover grayscale-[0.2]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="w-full md:w-1/2 h-3/5 md:h-full p-6 md:p-12 flex flex-col justify-center space-y-8 md:space-y-12">
                    <header className="border-b border-black/10 pb-2 md:pb-4">
                        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-[#8a7a5f]">
                            {lang === 'zh' ? '试炼题目' : 'QUESTION'} {qIndex + 1} / {QUESTIONS.length}
                        </span>
                    </header>
                    <h2 className="text-2xl md:text-4xl font-black text-[#1a120b] leading-tight font-uncial uppercase tracking-tighter">
                        {lang === 'zh' ? QUESTIONS[qIndex].text : QUESTIONS[qIndex].textEn}
                    </h2>
                    <div className="grid gap-3 md:gap-4">
                        {QUESTIONS[qIndex].options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ x: 10, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelect(opt.traits)}
                                className="p-4 md:p-5 border-[1.5px] border-[#1a120b]/10 text-left rounded-sm group flex items-center justify-between transition-all bg-white/30 backdrop-blur-sm"
                            >
                                <span className="text-base md:text-lg font-fantasy text-[#2c1a0a] group-hover:text-[#1a120b]">
                                    {lang === 'zh' ? opt.text : opt.textEn}
                                </span>
                                <ChevronRight size={18} md={22} className="opacity-0 group-hover:opacity-100 text-[#d4af37] transition-opacity" />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {currentStep === 'RESULT' && resultChar && (
            <div className="absolute inset-0 z-20 flex flex-col md:flex-row">
                {/* Left Page: Character Portrait */}
                <div className="w-full md:w-1/2 h-2/5 md:h-full relative overflow-hidden border-r border-black/10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 p-6 md:p-12 flex items-center justify-center"
                    >
                        <div className="w-full h-full relative group">
                            <div className="absolute -inset-1.5 md:-inset-4 border-[6px] md:border-[12px] border-[#1a120b] shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-0 rounded-sm"></div>
                            <div className="absolute inset-0 bg-white p-1 md:p-1.5 z-10 shadow-inner overflow-hidden">
                                <GenerativeImage 
                                    initialPrompt={resultChar.imagePrompt}
                                    alt={resultChar.name}
                                    stylePreset="LOTR_VINTAGE"
                                    className="w-full h-full object-cover grayscale-[0.2]"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none opacity-60"></div>
                            <div className="absolute bottom-4 left-4 text-white z-30">
                                <p className="font-fantasy text-[9px] md:text-[14px] uppercase tracking-[0.3em] text-[#d4af37] mb-1 font-bold">
                                    {lang === 'zh' ? resultChar.type : (resultChar.typeEn || resultChar.type)}
                                </p>
                                <h3 className="text-xl md:text-4xl font-black uppercase font-uncial leading-tight">
                                    {lang === 'zh' ? resultChar.name.split(' (')[0] : (resultChar.nameEn || resultChar.name).split(' (')[0]}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Right Page: Destiny Details - Optimized for One-Page display */}
                <div className="w-full md:w-1/2 h-3/5 md:h-full p-6 md:p-12 flex flex-col relative bg-transparent overflow-hidden">
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-col h-full">
                        <header className="mb-4 md:mb-8 border-b border-black/10 pb-2 md:pb-4">
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#d4af37] font-black block mb-1">
                                {lang === 'zh' ? '试炼结果揭示' : 'DESTINY REVEALED'}
                            </span>
                            <h2 className="text-2xl md:text-5xl font-black text-[#1a120b] uppercase font-uncial leading-none tracking-tighter">
                                {lang === 'zh' ? resultChar.name : (resultChar.nameEn || resultChar.name)}
                            </h2>
                        </header>
                        <div className="flex-1 space-y-4 md:space-y-8">
                            <div className="bg-black/5 p-4 md:p-6 border-l-4 md:border-l-8 border-[#d4af37] relative">
                                <div className="absolute -top-3 -left-3 md:-top-5 md:-left-5 text-[#d4af37] opacity-20"><Award size={32} md={42} /></div>
                                <p className="text-lg md:text-xl leading-relaxed text-[#2c1a0a] font-fantasy italic">
                                    {lang === 'zh' 
                                        ? `"你在抉择中展现了如 ${resultChar.type} 般的特质。这不是巧合，而是天命的共鸣。"` 
                                        : `"Your choices echo the essence of a ${resultChar.typeEn || resultChar.type}. This is no coincidence; it is a resonance of destiny."`}
                                </p>
                            </div>
                            <div className="space-y-2 md:space-y-4">
                                <h4 className="font-mono text-[10px] md:text-[11px] font-black opacity-30 uppercase tracking-[0.3em]">
                                    {lang === 'zh' ? '传奇定位' : 'LEGENDARY RECORD'}
                                </h4>
                                <p className="text-base md:text-lg text-[#5c4d3c] leading-relaxed">
                                    {lang === 'zh' ? resultChar.description : (resultChar.descriptionEn || resultChar.description)}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-6 border-t border-black/10">
                                <div className="space-y-1 md:space-y-2">
                                    <span className="font-mono text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-widest flex items-center gap-2"><Shield size={12} className="text-[#d4af37]"/> {lang === 'zh' ? '阵营' : 'Faction'}</span>
                                    <span className="text-lg md:text-xl font-fantasy font-bold text-[#1a120b]">
                                        {lang === 'zh' ? resultChar.faction : (resultChar.factionEn || resultChar.faction)}
                                    </span>
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <span className="font-mono text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-widest flex items-center gap-2"><BookOpen size={12} className="text-[#d4af37]"/> {lang === 'zh' ? '纪元' : 'Chronicle'}</span>
                                    <span className="text-lg md:text-xl font-fantasy font-bold text-[#1a120b]">
                                        {lang === 'zh' ? '第三纪元' : 'Third Age'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-10 pt-4 md:pt-6 border-t border-black/10 flex gap-3 md:gap-4">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStart} className="flex-1 flex items-center justify-center gap-2 md:gap-3 bg-[#1a120b] text-[#d4af37] p-3 md:p-4 rounded-sm font-title font-bold uppercase text-[10px] md:text-xs tracking-widest border border-[#d4af37]/30 shadow-xl">
                                <RotateCcw size={14} md={18} /> {lang === 'zh' ? '重测' : 'RETRY'}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack} className="flex-1 flex items-center justify-center gap-2 md:gap-3 border-[1.5px] border-[#1a120b] text-[#1a120b] p-3 md:p-4 rounded-sm font-title font-bold uppercase text-[10px] md:text-xs tracking-widest">
                                <Compass size={14} md={18} /> {lang === 'zh' ? '返回目录' : 'BACK'}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
