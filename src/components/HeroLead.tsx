import React, { useState } from 'react';
import { ArrowUpRight, Bookmark, Clock, User, Sparkles } from 'lucide-react';
import { BlogArticle } from '../data/blogs.ts';

interface HeroLeadProps {
  article: BlogArticle;
  onReadArticle: (article: BlogArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const HeroLead: React.FC<HeroLeadProps> = ({
  article,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="border-b border-[#E7E2D9] pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-stone-500 font-sans mb-5 pb-3 border-b border-[#EFEBE4]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">Flagship Monograph</span>
            <span aria-hidden="true">·</span>
            <span>Vol. VII</span>
            <span aria-hidden="true">·</span>
            <span>{article.format}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Special Analytical Report</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Dominant Editorial Headline & Text (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Metadata (Zero Pill Discipline) */}
            <div className="flex items-center gap-2.5 text-xs text-stone-600 mb-4 font-sans">
              <span className="font-medium text-stone-900">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span>{article.date}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {article.readTime}
              </span>
            </div>

            <h1
              onClick={() => onReadArticle(article)}
              className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1C1917] leading-[1.12] mb-5 hover:text-stone-700 transition-colors cursor-pointer text-balance"
            >
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans mb-6 max-w-2xl">
              {article.subtitle}
            </p>

            {/* Key Data Previews (Tabular figures) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#F4EFE6] border border-[#E7E2D9] rounded-lg mb-7">
              {article.metrics.slice(0, 3).map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                    {metric.label}
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-semibold text-stone-900 tabular-nums">
                    {metric.value}{' '}
                    <span className="text-xs font-sans text-stone-600 font-normal">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 line-clamp-1">
                    {metric.context}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions & Byline */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EFEBE4]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 font-editorial-serif font-bold text-sm">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900">
                    {article.author.name}
                  </div>
                  <div className="text-xs text-stone-500 font-sans">
                    {article.author.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => onToggleBookmark(article.id, e)}
                  className={`p-2.5 rounded-md border text-stone-700 transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-stone-900 text-stone-100 border-stone-900'
                      : 'border-[#DED8CD] hover:bg-[#EFEBE4]'
                  }`}
                  aria-label="Bookmark article"
                  title="Bookmark article"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onReadArticle(article)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#FBF9F5] bg-[#1C1917] hover:bg-stone-800 rounded-md transition-all cursor-pointer group shadow-sm"
                >
                  <span>Read Full Analytical Paper</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Lead Visual (5 cols) */}
          <div className="lg:col-span-5">
            <div
              onClick={() => onReadArticle(article)}
              className="group cursor-pointer block relative overflow-hidden rounded-lg border border-[#DDD7CC] shadow-md bg-[#EBE5DB]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                {!imgError ? (
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 p-8 flex flex-col justify-between text-stone-200">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Visual Ballistics Tracking
                    </div>
                    <div className="font-editorial-serif text-2xl font-light italic">
                      "{article.title}"
                    </div>
                    <div className="text-xs text-stone-400">
                      The Corridor Tactical Laboratory
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-4 right-4 text-stone-200 text-xs font-sans line-clamp-1">
                  {article.caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
