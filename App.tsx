
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { BookCover } from './components/BookCover';
import { Timeline } from './components/Timeline';
import { FamilyTree } from './components/FamilyTree';
import { RedBlackJourney } from './components/RedBlackJourney';
import { JulienNetwork } from './components/JulienNetwork';
import { LotRHub } from './components/LotRHub';
import { LotRCharacters } from './components/LotRCharacters';
import { LotRStory } from './components/LotRStory';
import { LotRPersonalityTest } from './components/LotRPersonalityTest';
import { Library } from './components/Library';
import { AmbientSound } from './components/AmbientSound';
import { GitBranch, History, BookOpen, Library as LibraryIcon, Network, BrainCircuit, Users, Compass, Sparkles, Languages } from 'lucide-react';
import { BOOKS } from './constants';
import { useLanguage } from './src/contexts/LanguageContext';
import { Language } from './types';

const App: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  // Default to 100years intro instead of library
  const [view, setView] = useState<ViewState>(ViewState.INTRO);
  const [currentBookId, setCurrentBookId] = useState<string | null>('100years');

  const currentBook = BOOKS.find(b => b.id === currentBookId) || null;

  const handleSelectBook = (bookId: string) => {
    setCurrentBookId(bookId);
    setView(ViewState.INTRO);
  };

  const handleBackToLibrary = () => {
      setView(ViewState.LIBRARY);
      setCurrentBookId(null);
  };

  const renderContent = () => {
    if (view === ViewState.LIBRARY) {
        return <Library onSelectBook={handleSelectBook} />;
    }

    if (view === ViewState.INTRO) {
        return <BookCover book={currentBook} onOpen={() => {
            if (currentBookId === '100years') setView(ViewState.TIMELINE);
            if (currentBookId === 'red_black') setView(ViewState.JULIEN_JOURNEY);
            if (currentBookId === 'lotr') setView(ViewState.LOTR_HUB);
        }} onBack={handleBackToLibrary} />;
    }

    // 100 Years Logic
    if (currentBookId === '100years') {
        switch (view) {
            case ViewState.TIMELINE: return <Timeline />;
            case ViewState.FAMILY_TREE: return <FamilyTree />;
            default: return <Timeline />;
        }
    }

    // Red & Black Logic
    if (currentBookId === 'red_black') {
        switch (view) {
            case ViewState.JULIEN_JOURNEY: return <RedBlackJourney />;
            case ViewState.JULIEN_NETWORK: return <JulienNetwork />;
            default: return <RedBlackJourney />;
        }
    }

    // LOTR Logic
    if (currentBookId === 'lotr') {
        switch (view) {
            case ViewState.LOTR_HUB: return <LotRHub onNavigate={setView} />;
            case ViewState.LOTR_CHARACTERS: return <LotRCharacters />;
            case ViewState.LOTR_STORY_1: return <LotRStory part="part1" />;
            case ViewState.LOTR_STORY_2: return <LotRStory part="part2" />;
            case ViewState.LOTR_STORY_3: return <LotRStory part="part3" />;
            case ViewState.LOTR_QUIZ: return <LotRPersonalityTest onBack={() => setView(ViewState.LOTR_HUB)} />;
            default: return <LotRHub onNavigate={setView} />;
        }
    }

    return <Library onSelectBook={handleSelectBook} />;
  };

  const renderNav = () => {
    if (view === ViewState.LIBRARY || view === ViewState.INTRO) return null;

    const isLOTR = currentBookId === 'lotr';
    const isRedBlack = currentBookId === 'red_black';
    const is100Years = currentBookId === '100years';

    const navBg = isRedBlack ? 'bg-black text-white' : isLOTR ? 'bg-[#1a120b] text-[#d4af37]' : 'bg-[#2c241b] text-[#e3dcd2]';
    const hoverBg = isRedBlack ? 'hover:bg-gray-800' : 'hover:bg-white/10';
    const activeBg = isRedBlack ? 'bg-gray-800' : 'bg-white/10';
    const titleColor = isRedBlack ? 'text-black' : isLOTR ? 'text-[#d4af37]' : 'text-[#2c241b]';

    return (
        <nav className="fixed top-0 inset-x-0 z-40 p-4 flex justify-between items-start pointer-events-none">
          <div className={`pointer-events-auto p-1 rounded-sm shadow-lg flex gap-1 ${navBg}`}>
             <button 
                onClick={handleBackToLibrary}
                className={`p-2 rounded-sm transition-colors ${hoverBg}`}
                title={t('返回图书馆', 'Back to Library')}
             >
                <LibraryIcon size={20} />
             </button>
             <div className="w-[1px] bg-white/20 mx-1"></div>
             <button 
                onClick={() => setView(ViewState.INTRO)}
                className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.INTRO ? activeBg : ''}`}
                title={t('封面', 'Cover')}
             >
                <BookOpen size={20} />
             </button>

             {is100Years && (
                <>
                    <button 
                        onClick={() => setView(ViewState.TIMELINE)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.TIMELINE ? activeBg : ''}`}
                        title={t('时间线', 'Timeline')}
                    >
                        <History size={20} />
                    </button>
                    <button 
                        onClick={() => setView(ViewState.FAMILY_TREE)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.FAMILY_TREE ? activeBg : ''}`}
                        title={t('家族树', 'Family Tree')}
                    >
                        <GitBranch size={20} />
                    </button>
                </>
             )}

             {isRedBlack && (
                <>
                    <button 
                        onClick={() => setView(ViewState.JULIEN_JOURNEY)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.JULIEN_JOURNEY ? activeBg : ''}`}
                        title={t('于连的旅程', "Julien's Journey")}
                    >
                        <BrainCircuit size={20} />
                    </button>
                    <button 
                        onClick={() => setView(ViewState.JULIEN_NETWORK)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.JULIEN_NETWORK ? activeBg : ''}`}
                        title={t('人物关系网', 'Character Network')}
                    >
                        <Network size={20} />
                    </button>
                </>
             )}

             {isLOTR && (
                <>
                    <button 
                        onClick={() => setView(ViewState.LOTR_HUB)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.LOTR_HUB ? activeBg : ''}`}
                        title={t('编年史中心', 'The Chronicles Hub')}
                    >
                        <Compass size={20} />
                    </button>
                    <button 
                        onClick={() => setView(ViewState.LOTR_CHARACTERS)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.LOTR_CHARACTERS ? activeBg : ''}`}
                        title={t('人物', 'Characters')}
                    >
                        <Users size={20} />
                    </button>
                    <button 
                        onClick={() => setView(ViewState.LOTR_QUIZ)}
                        className={`p-2 rounded-sm transition-colors ${hoverBg} ${view === ViewState.LOTR_QUIZ ? activeBg : ''}`}
                        title={t('性格测试', 'Personality Test')}
                    >
                        <Sparkles size={20} />
                    </button>
                </>
             )}
             <div className="w-[1px] bg-white/20 mx-1"></div>
             <button 
                onClick={() => setLanguage(language === Language.ZH ? Language.EN : Language.ZH)}
                className={`p-2 rounded-sm transition-colors ${hoverBg}`}
                title={t('切换语言', 'Switch Language')}
             >
                <Languages size={20} />
             </button>
          </div>
          
          <div className={`pointer-events-auto p-2 rounded border shadow-sm max-w-[150px] text-right bg-white/90 ${isRedBlack ? 'border-black' : isLOTR ? 'border-[#d4af37]' : 'border-[#8a7a5f]'}`}>
             <h1 className={`font-title text-sm font-bold ${titleColor}`}>
                {t(currentBook?.title || '', currentBook?.titleEn || '')}
             </h1>
             <p className="font-mono text-[10px] text-gray-500 opacity-80">
                {is100Years ? t('马孔多', 'Macondo') : isRedBlack ? t('维里耶尔', 'Verrières') : t('中土世界', 'Middle-earth')}
             </p>
          </div>
        </nav>
    );
  };

  return (
    <div className={`min-h-screen relative ${currentBookId === '100years' || !currentBookId ? 'paper-texture' : currentBookId === 'lotr' ? 'bg-[#1a120b]' : 'bg-[#e5e5e5]'}`}>
      {currentBookId === '100years' && view !== ViewState.LIBRARY && (
        <AmbientSound />
      )}
      {renderNav()}
      <main className="min-h-screen">
        {renderContent()}
      </main>
      {(currentBookId === '100years' || !currentBookId) && (
        <div className="fixed inset-0 border-[12px] border-transparent pointer-events-none z-40 mix-blend-multiply" 
            style={{ boxShadow: 'inset 0 0 100px rgba(44, 36, 27, 0.2)' }}>
        </div>
      )}
    </div>
  );
};

export default App;
