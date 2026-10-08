import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Filter, SlidersHorizontal, BookOpen, Sparkles } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogs.ts';
import { HeroLead } from '../components/HeroLead.tsx';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { updatePageSEO } from '../utils/seo.ts';
import { categoryToSlug, formatToSlug } from '../utils/slugs.ts';

interface HomePageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || 'all');

  useEffect(() => {
    updatePageSEO({
      title: 'The Corridor',
      description: 'Peer-reviewed cricket analytics, biomechanical breakdowns, Hawk-Eye ball tracking data, and long-form tactical journalism across Test, ODI, and T20 cricket.',
      canonicalPath: '/',
      type: 'website',
    });
  }, []);

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      if (selectedFormat !== 'all' && article.format !== selectedFormat) return false;

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
  }, [selectedFormat, searchQuery]);

  const leadStory = BLOG_ARTICLES[0];
  const gridArticles = !searchQuery.trim() && selectedFormat === 'all'
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div>
      {/* Curatorial Header & Search Ribbon */}
      <section className="bg-[#F6F2EB] border-b border-[#E7E2D9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
                MONOGRAPHS & RESEARCH PAPERS · 10 COMPREHENSIVE ESSAYS
              </div>
              <h1 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1C1917]">
                The Science of 22 Yards
              </h1>
              <p className="text-sm text-stone-600 font-sans mt-1.5 max-w-xl">
                Deconstructing the physics of Duke ball seam deviation, T20 death-over geometries, batting kinetic chains, and DRS probability matrices.
              </p>
            </div>

            {/* Search Bar with Real URL Query Sync */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (q.trim()) {
                      setSearchParams({ q });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  placeholder="Search by bowler, pitch, metric..."
                  className="w-full pl-9 pr-8 py-2 bg-[#FDFCFA] border border-[#DDD7CC] rounded-md text-xs font-medium placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchParams({});
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Department Navigation Links (Good URL Hierarchy) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-[#EBE5DB]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <Link
                to="/"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#1C1917] text-[#FBF9F5] shadow-xs whitespace-nowrap"
              >
                All 10 Essays
              </Link>
              <Link
                to="/category/bowling-analytics"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4] transition-colors whitespace-nowrap"
              >
                Bowling Ballistics
              </Link>
              <Link
                to="/category/batting-mechanics"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4] transition-colors whitespace-nowrap"
              >
                Batting Biomechanics
              </Link>
              <Link
                to="/category/tactical-theory"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4] transition-colors whitespace-nowrap"
              >
                Field Chess
              </Link>
              <Link
                to="/category/data-science"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4] transition-colors whitespace-nowrap"
              >
                Data Science
              </Link>
              <Link
                to="/category/equipment-physics"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#EDE7DD] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD4] transition-colors whitespace-nowrap"
              >
                Equipment Physics
              </Link>
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-1.5 text-xs font-sans text-stone-600">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
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
      </section>

      {/* Flagship Lead Story (Shown on default home view) */}
      {!searchQuery.trim() && selectedFormat === 'all' && (
        <HeroLead
          article={leadStory}
          onReadArticle={() => {}}
          isBookmarked={bookmarkedIds.includes(leadStory.id)}
          onToggleBookmark={onToggleBookmark}
        />
      )}

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E7E2D9]">
          <div className="flex items-center gap-2">
            <h2 className="font-editorial-serif text-2xl font-medium text-[#1C1917]">
              Research Monographs
            </h2>
            <span className="text-xs font-mono text-stone-400">
              ({gridArticles.length} {gridArticles.length === 1 ? 'essay' : 'essays'})
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-xs text-stone-600 hover:text-stone-950 flex items-center gap-1 cursor-pointer font-sans"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear search</span>
            </button>
          )}
        </div>

        {gridArticles.length === 0 ? (
          <div className="py-20 text-center bg-[#F7F3EB] rounded-xl border border-[#E7E2D9] p-8 max-w-xl mx-auto">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="font-editorial-serif text-xl font-medium text-stone-900 mb-2">
              No matching monographs found
            </h3>
            <p className="text-xs text-stone-600 mb-6 font-sans">
              No published essays match the current query "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFormat('all');
                setSearchParams({});
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-[#FBF9F5] text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              View All 10 Essays
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadArticle={() => {}}
                isBookmarked={bookmarkedIds.includes(article.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trajectory Simulator Banner */}
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
              <Link
                to="/simulator"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#1C1917] hover:bg-stone-800 text-[#FBF9F5] rounded-lg text-sm font-medium transition-all shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Launch Delivery Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
