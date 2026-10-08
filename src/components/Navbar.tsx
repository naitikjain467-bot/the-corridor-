import React from 'react';
import { Bookmark, Search, SlidersHorizontal, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookmarkedCount: number;
  onOpenSimulator: () => void;
  onOpenGlossary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  bookmarkedCount,
  onOpenSimulator,
  onOpenGlossary,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group cursor-pointer"
          >
            <span className="font-editorial-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1C1917] block group-hover:text-stone-700 transition-colors">
              The Corridor
            </span>
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans block -mt-1">
              Cricket Intelligence & Tactical Journal
            </span>
          </button>

          {/* Zone 2: Clean 4–6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'all' && !searchQuery
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              All Essays
            </button>
            <button
              onClick={() => setActiveTab('bowling')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'bowling'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Bowling Analytics
            </button>
            <button
              onClick={() => setActiveTab('batting')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'batting'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Batting Biomechanics
            </button>
            <button
              onClick={() => setActiveTab('tactics')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'tactics'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Tactical Chess
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'data'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Data Models
            </button>
            <button
              onClick={onOpenGlossary}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Lexicon</span>
            </button>
          </nav>

          {/* Zone 3: 1–2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1C1917] hover:bg-stone-800 rounded-md transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ballistics Simulator</span>
              <span className="sm:hidden">Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`relative p-2 rounded-md border text-stone-700 transition-colors cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'bg-stone-200 border-stone-300 text-stone-900'
                  : 'border-[#E7E2D9] hover:bg-[#F2EDE4]'
              }`}
              title="Saved Reading List"
              aria-label="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C1917] text-[#FBF9F5] text-[10px] font-mono font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
