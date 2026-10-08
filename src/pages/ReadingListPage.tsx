import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookOpen } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogs.ts';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { updatePageSEO } from '../utils/seo.ts';

interface ReadingListPageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}

export const ReadingListPage: React.FC<ReadingListPageProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  useEffect(() => {
    updatePageSEO({
      title: 'Saved Reading List',
      description: 'Your curated list of saved cricket analytics monographs for offline review and deep study.',
      canonicalPath: '/reading-list',
      type: 'website',
    });
    window.scrollTo(0, 0);
  }, []);

  const savedArticles = BLOG_ARTICLES.filter((a) => bookmarkedIds.includes(a.id));

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Journal Home</span>
          </Link>
        </div>

        <div className="pb-8 mb-8 border-b border-[#E7E2D9]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
            <Bookmark className="w-4 h-4 text-stone-600" />
            <span>PERSONAL ARCHIVE</span>
          </div>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Saved Reading List
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans mt-2 max-w-2xl">
            Monographs and empirical papers saved to your browser cache for comprehensive study.
          </p>
          <div className="mt-3 text-xs font-mono text-stone-400">
            {savedArticles.length} {savedArticles.length === 1 ? 'monograph' : 'monographs'} saved
          </div>
        </div>

        {savedArticles.length === 0 ? (
          <div className="py-20 text-center bg-[#F7F3EB] rounded-xl border border-[#E7E2D9] p-8 max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h2 className="font-editorial-serif text-2xl font-medium text-stone-900 mb-2">
              Your reading list is empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 font-sans">
              Click the bookmark icon on any research paper or monograph to save it here for convenient reference.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-[#FBF9F5] text-xs font-medium rounded-md transition-colors"
            >
              Browse All 10 Research Papers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadArticle={() => {}}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
