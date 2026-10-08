import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogs.ts';
import { updatePageSEO } from '../utils/seo.ts';
import { categoryToSlug } from '../utils/slugs.ts';
import { SITE_PAGE_KEYWORDS } from '../data/keywords.ts';

interface ArticlePageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'editorial'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imgError, setImgError] = useState(false);

  const article = BLOG_ARTICLES.find((a) => a.id === slug);
  const keywordEntry = article
    ? SITE_PAGE_KEYWORDS[`/essay/${article.id}`] || SITE_PAGE_KEYWORDS[`/blog/${article.id}`]
    : undefined;

  // Sync scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update SEO Title (30-60 chars) & Meta Description (120-160 chars) & Keywords & AEO FAQ Schema
  useEffect(() => {
    if (article && keywordEntry) {
      const faqEntries = article.sections.map((s) => ({
        question: s.heading,
        answer: s.content[0].replace(/^Direct Answer:\s*/i, ''),
      }));

      updatePageSEO({
        title: keywordEntry.pageTitle,
        description: keywordEntry.description,
        canonicalPath: `/essay/${article.id}`,
        type: 'article',
        publishedTime: article.date,
        author: article.author.name,
        image: article.image,
        keywords: {
          main: keywordEntry.mainKeyword,
          related: keywordEntry.relatedKeywords,
        },
        faqEntries,
      });
      window.scrollTo(0, 0);
    }
  }, [article, keywordEntry]);

  if (!article || !keywordEntry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
        <h1 className="font-editorial-serif text-3xl font-medium text-stone-900 mb-3">
          Monograph Not Found
        </h1>
        <p className="text-sm text-stone-600 mb-6 font-sans">
          The requested analytical monograph does not exist or may have been archived.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-100 rounded-md text-xs font-medium hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Home</span>
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarkedIds.includes(article.id);
  const currentIndex = BLOG_ARTICLES.findIndex((b) => b.id === article.id);
  const prevArticle = currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIndex + 1] : null;

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCitation = () => {
    const citation = `${article.author.name} (${article.date}). "${article.title}". The Corridor: Cricket Intelligence & Tactical Journal, Vol. VII. ${window.location.href}`;
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
    <article className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      {/* Sticky Reading Progress Bar */}
      <div className="sticky top-20 left-0 right-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D9]">
        <div
          className="h-1 bg-[#1C1917] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Reader Top Utility Bar with Real Anchor Text */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-stone-600 font-sans">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Monographs</span>
            </Link>

            <span className="hidden sm:inline text-stone-300">|</span>

            <span className="hidden sm:inline text-stone-500 font-mono">
              {Math.round(scrollProgress)}% read
            </span>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2.5">
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

            {/* Bookmark with Accessible Label */}
            <button
              onClick={(e) => onToggleBookmark(article.id, e)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-stone-700 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-stone-900 text-stone-100 border-stone-900'
                  : 'border-[#DDD7CC] hover:bg-[#EFEAE1]'
              }`}
              title={isBookmarked ? 'Bookmarked in reading list' : 'Bookmark this monograph'}
              aria-label={isBookmarked ? 'Remove monograph from bookmarks' : 'Bookmark monograph'}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Copy Shareable Unique URL */}
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#DDD7CC] hover:bg-[#EFEAE1] transition-colors cursor-pointer text-stone-700"
              title="Copy shareable clean URL"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Share URL</span>
                </>
              )}
            </button>

            {/* Academic Cite */}
            <button
              onClick={copyCitation}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#DDD7CC] hover:bg-[#EFEAE1] transition-colors cursor-pointer text-stone-700 text-[11px]"
              title="Copy academic citation"
            >
              {copiedCitation ? (
                <span className="text-emerald-700">Cited!</span>
              ) : (
                <span>Cite Monograph</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-10">
        {/* Breadcrumb Hierarchy with Anchor Text */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-stone-500 font-sans flex items-center gap-2">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Journal Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/category/${categoryToSlug(article.category)}`}
            className="hover:text-stone-900 transition-colors font-medium text-stone-800"
          >
            {article.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-stone-400 truncate max-w-xs">{article.id}</span>
        </nav>

        {/* Unboxed Metadata (Zero-Pill Discipline) with Anchor Text */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500 font-sans mb-3">
          <Link
            to={`/category/${categoryToSlug(article.category)}`}
            className="font-semibold text-stone-900 hover:underline uppercase tracking-wider"
          >
            {article.category}
          </Link>
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

        {/* Article Headline */}
        <h1 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1C1917] leading-[1.14] mb-4 text-balance">
          {article.title}
        </h1>

        {/* Deck Subtitle */}
        <p className="text-lg sm:text-xl text-stone-600 font-sans leading-relaxed mb-6">
          {article.subtitle}
        </p>

        {/* Topical Keywords Index (Main Keyword + 2 Related Keywords) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-sans p-3 bg-[#F4EFE6] border border-[#E7E2D9] rounded-md mb-8">
          <span className="font-semibold text-stone-900">Topical Keywords:</span>
          <span className="text-stone-950 font-medium">{keywordEntry.mainKeyword}</span>
          <span aria-hidden="true">·</span>
          <span>{keywordEntry.relatedKeywords[0]}</span>
          <span aria-hidden="true">·</span>
          <span>{keywordEntry.relatedKeywords[1]}</span>
        </div>

        {/* Author Byline & Lab CTA with Anchor Text */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E7E2D9]">
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
            <Link
              to={`/simulator?speed=${article.simulationPreset.speedKmph}&length=${article.simulationPreset.lengthMeters}&seam=${article.simulationPreset.seamAngleDeg}&release=${article.simulationPreset.releaseHeightM}&ball=${encodeURIComponent(article.simulationPreset.ballType)}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EFEAE1] hover:bg-[#E6E0D5] text-stone-900 rounded-md text-xs font-medium transition-colors border border-[#DDD7CC]"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-700" />
              <span>Simulate Delivery Trajectory</span>
            </Link>
          )}
        </div>

        {/* Small, Tastefully Sized Article Photography with Alt Text */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="aspect-[16/10] max-h-72 sm:max-h-80 overflow-hidden rounded-lg border border-[#DDD7CC] bg-[#EAE4D9]">
            {!imgError ? (
              <img
                src={article.image}
                alt={article.imageAlt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-900 p-6 flex flex-col justify-center text-stone-300">
                <div className="font-editorial-serif text-xl italic mb-2">
                  {article.title}
                </div>
                <div className="text-xs font-mono text-stone-500">
                  The Corridor Tactical Monograph Repository
                </div>
              </div>
            )}
          </div>
          <figcaption className="text-xs font-serif italic text-stone-500 mt-2 text-center">
            {article.caption}
          </figcaption>
        </div>

        {/* Executive Abstract Box */}
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

              {/* Paragraphs with AEO Question-Answer Box on Paragraph 0 and Drop Cap */}
              <div className={`space-y-5 text-stone-800 font-sans ${getProseSizeClass()}`}>
                {section.content.map((p, pIdx) => {
                  if (pIdx === 0 && p.startsWith('Direct Answer:')) {
                    const answerText = p.replace(/^Direct Answer:\s*/i, '');
                    return (
                      <div
                        key={pIdx}
                        className="my-5 p-5 bg-[#F6F1E7] border-l-4 border-[#1C1917] rounded-r-lg shadow-2xs"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                          <span>AEO Answer Summary</span>
                        </div>
                        <p className="font-sans text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
                          {answerText}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={pIdx}
                      className={sIdx === 0 && pIdx === 0 ? 'drop-cap' : ''}
                    >
                      {p}
                    </p>
                  );
                })}
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

        {/* Simulator Callout Footer with Anchor Text */}
        {article.simulationPreset && (
          <div className="mt-8 p-6 bg-[#F4EFE6] border border-[#E7E2D9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-editorial-serif text-lg font-medium text-stone-900">
                Test This Delivery In The Corridor Laboratory
              </h3>
              <p className="text-xs text-stone-600 font-sans">
                Load this article's calibrated speed ({article.simulationPreset.speedKmph} km/h) and seam parameters in our real-time Hawkeye simulator.
              </p>
            </div>
            <Link
              to={`/simulator?speed=${article.simulationPreset.speedKmph}&length=${article.simulationPreset.lengthMeters}&seam=${article.simulationPreset.seamAngleDeg}&release=${article.simulationPreset.releaseHeightM}&ball=${encodeURIComponent(article.simulationPreset.ballType)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-md text-xs font-medium transition-colors shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch Interactive Physics Engine</span>
            </Link>
          </div>
        )}

        {/* Prev / Next Article Navigation Footer with Explicit Anchor Text */}
        <div className="mt-16 pt-8 border-t border-[#E7E2D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <Link
              to={`/essay/${prevArticle.id}`}
              className="p-4 rounded-lg border border-[#E7E2D9] hover:bg-[#F2EDE4] transition-all text-left group block"
            >
              <div className="flex items-center gap-1 text-xs text-stone-500 font-sans mb-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Monograph</span>
              </div>
              <div className="font-editorial-serif text-base text-stone-900 font-medium line-clamp-1 group-hover:text-stone-700">
                {prevArticle.title}
              </div>
            </Link>
          ) : <div />}

          {nextArticle ? (
            <Link
              to={`/essay/${nextArticle.id}`}
              className="p-4 rounded-lg border border-[#E7E2D9] hover:bg-[#F2EDE4] transition-all text-right group block"
            >
              <div className="flex items-center justify-end gap-1 text-xs text-stone-500 font-sans mb-1">
                <span>Next Monograph</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-editorial-serif text-base text-stone-900 font-medium line-clamp-1 group-hover:text-stone-700">
                {nextArticle.title}
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </article>
  );
};
