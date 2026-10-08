import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogs.ts';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { updatePageSEO } from '../utils/seo.ts';
import { CATEGORY_MAP } from '../utils/slugs.ts';

interface CategoryPageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { catSlug } = useParams<{ catSlug: string }>();
  const categoryName = catSlug ? CATEGORY_MAP[catSlug] : undefined;

  const articles = BLOG_ARTICLES.filter((a) => a.category === categoryName);

  useEffect(() => {
    if (categoryName) {
      updatePageSEO({
        title: `${categoryName} Research`,
        description: `Explore scholarly cricket monographs and Hawkeye empirical studies in ${categoryName}.`,
        canonicalPath: `/category/${catSlug}`,
        type: 'website',
      });
      window.scrollTo(0, 0);
    }
  }, [categoryName, catSlug]);

  if (!categoryName) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
        <h1 className="font-editorial-serif text-3xl font-medium text-stone-900 mb-3">
          Category Not Found
        </h1>
        <p className="text-sm text-stone-600 mb-6 font-sans">
          The requested research department does not exist.
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

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-stone-500 font-sans flex items-center gap-2">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-stone-400">Department</span>
          <span aria-hidden="true">/</span>
          <span className="text-stone-800 font-medium">{categoryName}</span>
        </nav>

        {/* Department Header */}
        <div className="pb-8 mb-10 border-b border-[#E7E2D9]">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-2">
            RESEARCH DEPARTMENT
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-medium text-[#1C1917]">
            {categoryName}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans mt-2 max-w-2xl">
            In-depth academic monographs focusing on {categoryName.toLowerCase()}, spatial telemetry, and match outcome modeling.
          </p>
          <div className="mt-4 text-xs font-mono text-stone-400">
            {articles.length} peer-reviewed {articles.length === 1 ? 'essay' : 'essays'} published
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onReadArticle={() => {}}
              isBookmarked={bookmarkedIds.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
