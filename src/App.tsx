import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ArticlePage } from './pages/ArticlePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { SimulatorPage } from './pages/SimulatorPage.tsx';
import { LexiconPage } from './pages/LexiconPage.tsx';
import { ReadingListPage } from './pages/ReadingListPage.tsx';

export default function App() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('the_corridor_bookmarks');
      return saved ? JSON.parse(saved) : ['bumrah-release-biomechanics', 'death-bowling-yorker-geometry'];
    } catch {
      return ['bumrah-release-biomechanics', 'death-bowling-yorker-geometry'];
    }
  });

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

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#FBF9F5]">
      {/* Universal 3-Zone Header with Real Route Links */}
      <Navbar bookmarkedCount={bookmarkedIds.length} />

      {/* Main Routed Content Area */}
      <main className="flex-1">
        <Routes>
          {/* Home / All Monographs */}
          <Route
            path="/"
            element={
              <HomePage
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            }
          />

          {/* Dedicated Individual Blog Article URL */}
          <Route
            path="/essay/:slug"
            element={
              <ArticlePage
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            }
          />

          {/* Department / Category URL */}
          <Route
            path="/category/:catSlug"
            element={
              <CategoryPage
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            }
          />

          {/* Hawkeye Ballistics Trajectory Simulator */}
          <Route
            path="/simulator"
            element={<SimulatorPage />}
          />

          {/* Cricket Analytics Lexicon & Terminology */}
          <Route
            path="/lexicon"
            element={<LexiconPage />}
          />

          {/* Saved Reading List */}
          <Route
            path="/reading-list"
            element={
              <ReadingListPage
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Editorial Colophon Footer */}
      <Footer />
    </div>
  );
}
