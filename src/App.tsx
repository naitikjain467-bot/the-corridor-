import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  BookOpen,
  Filter,
  Flame,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from './data/blogs.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroLead } from './components/HeroLead.tsx';
import { ArticleCard } from './components/ArticleCard.tsx';
import { ArticleReaderModal } from './components/ArticleReaderModal.tsx';
import { TrajectorySimulator } from './components/TrajectorySimulator.tsx';
import { GlossaryModal } from './components/GlossaryModal.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('the_corridor_bookmarks');
      return saved ? JSON.parse(saved) : ['bumrah-release-biomechanics', 'death-bowling-yorker-geometry'];
    } catch {
      return ['bumrah-release-biomechanics', 'death-bowling-yorker-geometry'];
    }
  });

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorPreset, setSimulatorPreset] = useState<any>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_corridor_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openSimulatorWithPreset = (preset: any) => {
    setSimulatorPreset(preset);
    setIsSimulatorOpen(true);
  };

  // Filtered Articles Logic
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      // Tab filter
      if (activeTab === 'bowling' && article.category !== 'Bowling Analytics') return false;
      if (activeTab === 'batting' && article.category !== 'Batting Mechanics') return false;
      if (activeTab === 'tactics' && article.category !== 'Tactical Theory') return false;
      if (activeTab === 'data' && article.category !== 'Data Science' && article.category !== 'Equipment Physics') return false;
      if (activeTab === 'bookmarks' && !bookmarkedIds.includes(article.id)) return false;

      // Format filter
      if (formatFilter !== 'all' && article.format !== formatFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSubtitle = article.subtitle.toLowerCase().includes(q);
        const matchesAuthor = article.author.name.toLowerCase().includes(q);
        const matchesAbstract = article.abstract.toLowerCase().includes(q);
        const matchesCategory = article.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesAuthor && !matchesAbstract && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, formatFilter, searchQuery, bookmarkedIds]);

  // Lead story is the flagship first article when no search/filter applied
  const leadStory = BLOG_ARTICLES[0];
  const gridArticles = activeTab === 'all' && !searchQuery.trim() && formatFilter === 'all'
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#FBF9F5]">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkedCount={bookmarkedIds.length}
        onOpenSimulator={() => {
          setSimulatorPreset(null);
          setIsSimulatorOpen(true);
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      <main className="flex-1">
        {/* Curatorial Header & Search Ribbon */}
        <section className="bg-[#F6F2EB] border-b border-[#E7E2D9] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
                  MONOGRAPHS & RESEARCH PAPERS · 10 COMPREHENSIVE ESSAYS
                </div>
                <h2 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1C1917]">
                  The Science of 22 Yards
                </h2>
                <p className="text-sm text-stone-600 font-sans mt-1.5 max-w-xl">
                  Deconstructing the physics of Duke ball seam deviation, T20 death-over geometries, batting kinetic chains, and DRS probability matrices.
                </p>
              </div>

              {/* Search Bar & Controls */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by bowler, pitch, metric..."
                    className="w-full pl-9 pr-8 py-2 bg-[#FDFCFA] border border-[#DDD7CC] rounded-md text-xs font-medium placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Segmented Filter Bar (Functional buttons with click handlers) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-[#EBE5DB]">
              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setFormatFilter('all');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs'
                      : 'bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4]'
                  }`}
                >
                  All 10 Essays
                </button>
                <button
                  onClick={() => setActiveTab('bowling')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'bowling'
                      ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs'
                      : 'bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4]'
                  }`}
                >
                  Bowling Ballistics
                </button>
                <button
                  onClick={() => setActiveTab('batting')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'batting'
                      ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs'
                      : 'bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4]'
                  }`}
                >
                  Batting Biomechanics
                </button>
                <button
                  onClick={() => setActiveTab('tactics')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'tactics'
                      ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs'
                      : 'bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4]'
                  }`}
                >
                  Field Chess
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'data'
                      ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs'
                      : 'bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4]'
                  }`}
                >
                  Data & Equipment
                </button>
              </div>

              {/* Format Filter Dropdown & Bookmark Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-sans text-stone-600">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <span>Format:</span>
                  <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="bg-[#EDE7DD] border border-[#DDD7CC] rounded px-2 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                  >
                    <option value="all">All Formats</option>
                    <option value="Test Match">Test Cricket</option>
                    <option value="T20 & IPL">T20 & IPL</option>
                    <option value="Universal">Universal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Lead Monograph (Only shown on 'all' view with no active search query) */}
        {activeTab === 'all' && !searchQuery.trim() && formatFilter === 'all' && (
          <HeroLead
            article={leadStory}
            onReadArticle={(art) => setSelectedArticle(art)}
            isBookmarked={bookmarkedIds.includes(leadStory.id)}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {/* Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Heading & Result Count */}
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E7E2D9]">
            <div className="flex items-center gap-2">
              <h3 className="font-editorial-serif text-2xl font-medium text-[#1C1917]">
                {activeTab === 'bookmarks'
                  ? 'Saved Reading List'
                  : activeTab === 'all'
                  ? 'Recent Research Papers'
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Papers`}
              </h3>
              <span className="text-xs font-mono text-stone-400">
                ({gridArticles.length} {gridArticles.length === 1 ? 'essay' : 'essays'})
              </span>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-600 hover:text-stone-950 flex items-center gap-1 cursor-pointer font-sans"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear search</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {gridArticles.length === 0 ? (
            <div className="py-20 text-center bg-[#F7F3EB] rounded-xl border border-[#E7E2D9] p-8 max-w-xl mx-auto">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h4 className="font-editorial-serif text-xl font-medium text-stone-900 mb-2">
                No matching monographs found
              </h4>
              <p className="text-xs text-stone-600 mb-6 font-sans">
                {activeTab === 'bookmarks'
                  ? 'You have not saved any articles to your reading list yet. Click the bookmark icon on any paper to save it for offline review.'
                  : `No published essays match the current query "${searchQuery}".`}
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                  setFormatFilter('all');
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-[#FBF9F5] text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                View All 10 Essays
              </button>
            </div>
          ) : (
            /* Editorial 3-Tier Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onReadArticle={(art) => setSelectedArticle(art)}
                  isBookmarked={bookmarkedIds.includes(article.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Analytical Callout Banner */}
        <section className="bg-[#EFEAE0] border-y border-[#DDD7CC] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-600">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>The Corridor Experimental Research Division</span>
                </div>
                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
                  Test Any Delivery in 22-Yard Hawkeye Simulation
                </h3>
                <p className="text-sm text-stone-700 font-sans leading-relaxed max-w-2xl">
                  Adjust release velocity from 80 km/h spin to 155 km/h express pace, calibrate seam precession tilt from -20° to +20°, and model bounce height at the popping crease on standard Test, Perth, or turning wickets.
                </p>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <button
                  onClick={() => {
                    setSimulatorPreset(null);
                    setIsSimulatorOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1C1917] hover:bg-stone-800 text-[#FBF9F5] rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Launch Delivery Simulator</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Colophon Footer */}
      <Footer
        onOpenSimulator={() => {
          setSimulatorPreset(null);
          setIsSimulatorOpen(true);
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onSelectCategory={(cat) => {
          setActiveTab(cat);
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
      />

      {/* Immersive Long-Form Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onSelectArticle={(art) => setSelectedArticle(art)}
        isBookmarked={selectedArticle ? bookmarkedIds.includes(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
        onOpenSimulatorWithPreset={openSimulatorWithPreset}
      />

      {/* Hawkeye Trajectory Physics Simulator */}
      <TrajectorySimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        initialPreset={simulatorPreset}
      />

      {/* Analytical Lexicon & Definitions Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
