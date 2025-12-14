import React, { useState } from 'react';
import { ViewState } from './types';
import { BookCover } from './components/BookCover';
import { Timeline } from './components/Timeline';
import { FamilyTree } from './components/FamilyTree';
import { AmbientSound } from './components/AmbientSound';
import { GitBranch, History, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.INTRO);

  const renderContent = () => {
    switch (view) {
      case ViewState.INTRO:
        return <BookCover onOpen={() => setView(ViewState.TIMELINE)} />;
      case ViewState.TIMELINE:
        return <Timeline />;
      case ViewState.FAMILY_TREE:
        return <FamilyTree />;
      default:
        return <BookCover onOpen={() => setView(ViewState.TIMELINE)} />;
    }
  };

  return (
    <div className="min-h-screen relative paper-texture">
      {/* Background Ambience */}
      <AmbientSound />

      {/* Navigation (Hidden on Intro) */}
      {view !== ViewState.INTRO && (
        <nav className="fixed top-0 inset-x-0 z-40 p-4 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-[#2c241b] text-[#e3dcd2] p-1 rounded-sm shadow-lg flex gap-1">
             <button 
                onClick={() => setView(ViewState.INTRO)}
                className={`p-2 hover:bg-[#4a3b2a] rounded-sm transition-colors ${view === ViewState.INTRO ? 'bg-[#4a3b2a]' : ''}`}
                title="Cover"
             >
                <BookOpen size={20} />
             </button>
             <button 
                onClick={() => setView(ViewState.TIMELINE)}
                className={`p-2 hover:bg-[#4a3b2a] rounded-sm transition-colors ${view === ViewState.TIMELINE ? 'bg-[#4a3b2a]' : ''}`}
                title="Timeline"
             >
                <History size={20} />
             </button>
             <button 
                onClick={() => setView(ViewState.FAMILY_TREE)}
                className={`p-2 hover:bg-[#4a3b2a] rounded-sm transition-colors ${view === ViewState.FAMILY_TREE ? 'bg-[#4a3b2a]' : ''}`}
                title="Family Tree"
             >
                <GitBranch size={20} />
             </button>
          </div>
          
          <div className="pointer-events-auto bg-[#e3dcd2]/90 p-2 rounded border border-[#8a7a5f] shadow-sm max-w-[150px] text-right">
             <h1 className="font-title text-sm font-bold text-[#2c241b]">Macondo</h1>
             <p className="font-mono text-[10px] text-[#5c4d3c]">City of Mirrors</p>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="min-h-screen">
        {renderContent()}
      </main>

      {/* Decorative Borders for the "App" feeling */}
      <div className="fixed inset-0 border-[12px] border-transparent pointer-events-none z-50 mix-blend-multiply" 
           style={{ boxShadow: 'inset 0 0 100px rgba(44, 36, 27, 0.2)' }}>
      </div>
    </div>
  );
};

export default App;
