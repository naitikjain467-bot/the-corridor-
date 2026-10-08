import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Clock } from 'lucide-react';
import { BlogArticle } from '../data/blogs.ts';
import { categoryToSlug } from '../utils/slugs.ts';
import { SITE_PAGE_KEYWORDS } from '../data/keywords.ts';

interface ArticleCardProps {
  article: BlogArticle;
  onReadArticle?: (article: BlogArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [imgError, setImgError] = useState(false);
  const keywords = SITE_PAGE_KEYWORDS[`/essay/${article.id}`];

  return (
    <article className="group flex flex-col justify-between bg-[#FDFCFA] border border-[#E7E2D9] rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-300 relative">
      <div>
        {/* Compact, Small Visual Media Header with Link and Accessible Anchor Text */}
        <Link
          to={`/essay/${article.id}`}
          className="relative h-44 sm:h-48 overflow-hidden bg-[#ECE6DC] border-b border-[#E7E2D9] block"
          aria-label={`Read research monograph: ${article.title}`}
        >
          {!imgError ? (
            <img
              src={article.image}
              alt={article.imageAlt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-tr from-stone-200 via-stone-100 to-amber-50/50 text-stone-700">
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500">
                Tactical Monograph
              </span>
              <span className="font-editorial-serif italic text-base line-clamp-2">
                {article.title}
              </span>
            </div>
          )}
          {/* Hidden anchor text for accessibility */}
          <span className="sr-only">Read research monograph: {article.title}</span>
        </Link>

        {/* Quick Bookmark Trigger in Top Corner */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark(article.id, e);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer z-10 ${
            isBookmarked
              ? 'bg-stone-900 text-stone-100'
              : 'bg-[#FBF9F5]/90 text-stone-700 hover:bg-[#FBF9F5] hover:text-stone-950'
          }`}
          aria-label={isBookmarked ? `Remove ${article.title} from reading list` : `Save ${article.title} to reading list`}
          title={isBookmarked ? 'Saved in reading list' : 'Save to reading list'}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>

        {/* Content Body */}
        <div className="p-5">
          {/* Unboxed Metadata (Zero-Pill Discipline) with Anchor Text */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans mb-2.5">
            <Link
              to={`/category/${categoryToSlug(article.category)}`}
              className="font-medium text-stone-800 hover:underline"
            >
              {article.category}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{article.format}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {article.readTime}
            </span>
          </div>

          <h3 className="font-editorial-serif text-xl sm:text-2xl font-medium tracking-tight text-[#1C1917] leading-snug group-hover:text-stone-700 transition-colors mb-3 line-clamp-2 text-balance">
            <Link to={`/essay/${article.id}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4 font-sans">
            {article.subtitle}
          </p>

          {/* Keywords Taxonomy (Zero-Pill Discipline) */}
          {keywords && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 font-sans mb-4 pt-2 border-t border-[#F2ECE3]">
              <span className="text-stone-700 font-medium">{keywords.mainKeyword}</span>
              <span aria-hidden="true">·</span>
              <span>{keywords.relatedKeywords[0]}</span>
            </div>
          )}

          {/* Micro Stat Bar */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-[#F6F2EB] rounded-md border border-[#E9E4DC] mb-1">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 truncate">
                {article.metrics[0].label}
              </div>
              <div className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                {article.metrics[0].value}{' '}
                <span className="text-[10px] font-sans font-normal text-stone-500">
                  {article.metrics[0].unit}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 truncate">
                {article.metrics[1].label}
              </div>
              <div className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                {article.metrics[1].value}{' '}
                <span className="text-[10px] font-sans font-normal text-stone-500">
                  {article.metrics[1].unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer with Byline & Explicit Anchor Text */}
      <div className="px-5 pb-5 pt-3 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-stone-600 font-sans">
        <div className="truncate pr-2">
          <span className="font-medium text-stone-900">{article.author.name}</span>
          <span className="text-stone-500 hidden sm:inline"> · {article.date}</span>
        </div>
        <Link
          to={`/essay/${article.id}`}
          className="flex items-center gap-1 font-medium text-stone-900 group-hover:text-stone-700 whitespace-nowrap shrink-0 hover:underline"
        >
          <span>Read Full Monograph</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
