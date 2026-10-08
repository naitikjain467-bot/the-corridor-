import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bookmark,
  Share2,
  Clock,
  User,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Check,
  Quote,
  Sparkles,
} from 'lucide-react';
import { BlogArticle, BLOG_ARTICLES } from '../data/blogs.ts';

interface ArticleReaderModalProps {
  article: BlogArticle | null;
  onClose: () => void;
  onSelectArticle: (article: BlogArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onOpenSimulatorWithPreset: (preset: any) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onOpenSimulatorWithPreset,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'editorial'>('normal');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track reading scroll progress
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  // Keyboard shortcut to close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  // Find index for prev/next navigation
  const currentIndex = BLOG_ARTICLES.findIndex((b) => b.id === article.id);
  const prevArticle = currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIndex + 1] : null;

  const copyCitation = () => {
    const citation = `${article.author.name} (${article.date}). "${article.title}". The Corridor: Cricket Intelligence & Tactical Journal, Vol. VII.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const getProseSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'editorial':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex justify-center animate-in fade-in duration-200">
      {/* Scrollable Reader Modal Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-[#FBF9F5] text-[#1C1917] w-full max-w-4xl h-full overflow-y-auto shadow-2xl flex flex-col relative"
      >
        {/* Sticky Reading Progress Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D9]">
          <div
            className="h-1 bg-[#1C1917] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Reader Top Utility Bar */}
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-stone-600 font-sans">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-stone-800 hover:text-stone-950 font-medium cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Reader</span>
              </button>

              <span className="hidden sm:inline text-stone-300">|</span>

              <span className="hidden sm:inline text-stone-500 font-mono">
                {Math.round(scrollProgress)}% read
              </span>
            </div>

            {/* Reading Controls */}
            <div className="flex items-center gap-3">
              {/* Type Size Selector */}
              <div className="hidden sm:flex items-center gap-1 bg-[#EFEAE1] p-1 rounded-md text-[11px] font-medium">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    fontSize === 'normal' ? 'bg-[#FBF9F5] text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    fontSize === 'large' ? 'bg-[#FBF9F5] text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Large
                </button>
                <button
                  onClick={() => setFontSize('editorial')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    fontSize === 'editorial' ? 'bg-[#FBF9F5] text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Editorial
                </button>
              </div>

              {/* Bookmark */}
              <button
                onClick={(e) => onToggleBookmark(article.id, e)}
                className={`p-1.5 rounded-md border text-stone-700 transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-stone-900 text-stone-100 border-stone-900'
                    : 'border-[#DDD7CC] hover:bg-[#EFEAE1]'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark this monograph'}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              {/* Copy Citation */}
              <button
                onClick={copyCitation}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#DDD7CC] hover:bg-[#EFEAE1] transition-colors cursor-pointer text-stone-700"
                title="Copy academic citation"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">Cite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="px-5 sm:px-12 md:px-16 py-10 max-w-3xl mx-auto w-full">
          {/* Header Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2.5 text-xs text-stone-500 font-sans mb-4">
            <span className="font-semibold text-stone-900 uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.format}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {article.readTime}
            </span>
          </div>

          {/* Article Main Headline */}
          <h1 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1C1917] leading-[1.14] mb-5 text-balance">
            {article.title}
          </h1>

          {/* Analytical Subtitle Deck */}
          <p className="text-lg sm:text-xl text-stone-600 font-sans leading-relaxed mb-8">
            {article.subtitle}
          </p>

          {/* Author Byline Lockup */}
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#E7E2D9]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-800 font-editorial-serif font-bold text-base">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-900">
                  {article.author.name}
                </div>
                <div className="text-xs text-stone-500 font-sans">
                  {article.author.role} · {article.author.credentials}
                </div>
              </div>
            </div>

            {article.simulationPreset && (
              <button
                onClick={() => onOpenSimulatorWithPreset(article.simulationPreset)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFEAE1] hover:bg-[#E6E0D5] text-stone-900 rounded-md text-xs font-medium transition-colors cursor-pointer border border-[#DDD7CC]"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-700" />
                <span>Simulate In Hawkeye</span>
              </button>
            )}
          </div>

          {/* High-Resolution Article Photography */}
          <div className="mb-10">
            <div className="aspect-[16/10] overflow-hidden rounded-lg border border-[#DDD7CC] bg-[#EAE4D9]">
              {!imgError ? (
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 p-8 flex flex-col justify-center text-stone-300">
                  <div className="font-editorial-serif text-2xl italic mb-2">
                    {article.title}
                  </div>
                  <div className="text-xs font-mono text-stone-500">
                    The Corridor Tactical Monograph Repository
                  </div>
                </div>
              )}
            </div>
            <figcaption className="text-xs font-serif italic text-stone-500 mt-2.5 text-center">
              {article.caption}
            </figcaption>
          </div>

          {/* Abstract / Executive Summary Box */}
          <div className="bg-[#F4EFE6] border-l-4 border-stone-800 p-6 rounded-r-lg mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
              Executive Analytical Abstract
            </div>
            <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans">
              {article.abstract}
            </p>
          </div>

          {/* Key Quantitative Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8F5EF] border border-[#E7E2D9] rounded-lg mb-12">
            {article.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                  {metric.label}
                </div>
                <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                  {metric.value}{' '}
                  <span className="text-xs font-sans text-stone-500 font-normal">
                    {metric.unit}
                  </span>
                </div>
                <div className="text-[11px] text-stone-600">
                  {metric.context}
                </div>
              </div>
            ))}
          </div>

          {/* Main Editorial Body Content Sections */}
          <div className="space-y-12">
            {article.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-6">
                <div>
                  <h2 className="font-editorial-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1C1917] mb-1.5">
                    {section.heading}
                  </h2>
                  {section.subheading && (
                    <p className="text-sm font-sans text-stone-500 uppercase tracking-wider">
                      {section.subheading}
                    </p>
                  )}
                  <div className="w-12 h-0.5 bg-stone-300 mt-3" />
                </div>

                {/* Paragraphs with Drop Cap on the very first section */}
                <div className={`space-y-5 text-stone-800 font-sans ${getProseSizeClass()}`}>
                  {section.content.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className={sIdx === 0 && pIdx === 0 ? 'drop-cap' : ''}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* Pull Quote */}
                {section.pullQuote && (
                  <blockquote className="my-8 py-4 px-6 border-l-2 border-stone-800 bg-[#F6F1E8] rounded-r italic font-editorial-serif text-xl sm:text-2xl text-stone-800 leading-snug">
                    <p>"{section.pullQuote}"</p>
                  </blockquote>
                )}

                {/* Analytical Data Comparison Table */}
                {section.tableData && (
                  <div className="my-8 overflow-hidden rounded-lg border border-[#DDD7CC] bg-[#FDFCFA]">
                    <div className="px-4 py-3 bg-[#EFEAE1] border-b border-[#DDD7CC] font-mono text-xs font-medium text-stone-700">
                      {section.tableData.caption}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#F8F5EF] text-stone-600 border-b border-[#E7E2D9]">
                          <tr>
                            {section.tableData.columns.map((col, cIdx) => (
                              <th
                                key={cIdx}
                                className="px-4 py-3 font-semibold uppercase tracking-wider"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFEAE1]">
                          {section.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F9F6F0] transition-colors">
                              <td className="px-4 py-3 font-medium text-stone-900">
                                {row.parameter}
                              </td>
                              <td className="px-4 py-3 font-mono tabular-nums text-stone-700">
                                {row.historicalValue}
                              </td>
                              <td className="px-4 py-3 font-mono tabular-nums text-stone-700">
                                {row.modernValue}
                              </td>
                              <td className="px-4 py-3 font-mono tabular-nums font-semibold text-emerald-800">
                                {row.variance}
                              </td>
                              {row.impactScore && (
                                <td className="px-4 py-3 font-mono tabular-nums text-stone-600">
                                  {row.impactScore}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Tactical Takeaways / Analytical Conclusions */}
          <div className="mt-14 p-6 bg-[#1C1917] text-[#FBF9F5] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Tactical Conclusions for Analysts & Coaches</span>
            </div>
            <ul className="space-y-3 font-sans text-sm sm:text-base text-stone-300">
              {article.conclusions.map((conc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-amber-400 font-bold shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{conc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Simulator Callout Footer */}
          {article.simulationPreset && (
            <div className="mt-8 p-6 bg-[#F4EFE6] border border-[#E7E2D9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-editorial-serif text-lg font-medium text-stone-900">
                  Test This Delivery In The Corridor Laboratory
                </h4>
                <p className="text-xs text-stone-600 font-sans">
                  Load this article's calibrated speed ({article.simulationPreset.speedKmph} km/h) and seam parameters in our real-time Hawkeye simulator.
                </p>
              </div>
              <button
                onClick={() => onOpenSimulatorWithPreset(article.simulationPreset)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Launch Interactive Physics</span>
              </button>
            </div>
          )}

          {/* Prev / Next Article Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-[#E7E2D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <button
                onClick={() => {
                  onSelectArticle(prevArticle);
                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-lg border border-[#E7E2D9] hover:bg-[#F2EDE4] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xs text-stone-500 font-sans mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Monograph</span>
                </div>
                <div className="font-editorial-serif text-base text-stone-900 font-medium line-clamp-1 group-hover:text-stone-700">
                  {prevArticle.title}
                </div>
              </button>
            ) : <div />}

            {nextArticle ? (
              <button
                onClick={() => {
                  onSelectArticle(nextArticle);
                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-lg border border-[#E7E2D9] hover:bg-[#F2EDE4] transition-all text-right group cursor-pointer"
              >
                <div className="flex items-center justify-end gap-1 text-xs text-stone-500 font-sans mb-1">
                  <span>Next Monograph</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div className="font-editorial-serif text-base text-stone-900 font-medium line-clamp-1 group-hover:text-stone-700">
                  {nextArticle.title}
                </div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
};
