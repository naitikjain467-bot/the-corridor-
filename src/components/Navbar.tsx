import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, SlidersHorizontal, BookOpen } from 'lucide-react';

interface NavbarProps {
  bookmarkedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ bookmarkedCount }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
          <Link
            to="/"
            className="text-left group cursor-pointer block"
            aria-label="The Corridor Home"
          >
            <span className="font-editorial-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1C1917] block group-hover:text-stone-700 transition-colors">
              The Corridor
            </span>
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans block -mt-1">
              Cricket Intelligence & Tactical Journal
            </span>
          </Link>

          {/* Zone 2: Clean 4–6 text navigation links with true URLs */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <Link
              to="/"
              className={`transition-colors py-1 ${
                isActive('/')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              All Essays
            </Link>
            <Link
              to="/category/bowling-analytics"
              className={`transition-colors py-1 ${
                isActive('/category/bowling-analytics')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Bowling Analytics
            </Link>
            <Link
              to="/category/batting-mechanics"
              className={`transition-colors py-1 ${
                isActive('/category/batting-mechanics')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Batting Biomechanics
            </Link>
            <Link
              to="/category/tactical-theory"
              className={`transition-colors py-1 ${
                isActive('/category/tactical-theory')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Tactical Chess
            </Link>
            <Link
              to="/category/data-science"
              className={`transition-colors py-1 ${
                isActive('/category/data-science')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              Data Models
            </Link>
            <Link
              to="/lexicon"
              className={`transition-colors py-1 flex items-center gap-1.5 ${
                isActive('/lexicon')
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : 'hover:text-stone-950'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Lexicon</span>
            </Link>
          </nav>

          {/* Zone 3: 1–2 primary actions with true URLs */}
          <div className="flex items-center gap-3">
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1C1917] hover:bg-stone-800 rounded-md transition-all whitespace-nowrap shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ballistics Simulator</span>
              <span className="sm:hidden">Simulator</span>
            </Link>

            <Link
              to="/reading-list"
              className={`relative p-2 rounded-md border text-stone-700 transition-colors block ${
                isActive('/reading-list')
                  ? 'bg-stone-200 border-stone-300 text-stone-900'
                  : 'border-[#E7E2D9] hover:bg-[#F2EDE4]'
              }`}
              title="Saved Reading List"
              aria-label="Saved Reading List"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C1917] text-[#FBF9F5] text-[10px] font-mono font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
