import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { GLOSSARY_TERMS } from '../components/GlossaryModal.tsx';
import { updatePageSEO } from '../utils/seo.ts';
import { SITE_PAGE_KEYWORDS } from '../data/keywords.ts';

export const LexiconPage: React.FC = () => {
  useEffect(() => {
    const lexKw = SITE_PAGE_KEYWORDS['/lexicon'];
    if (lexKw) {
      updatePageSEO({
        title: lexKw.pageTitle,
        description: lexKw.description,
        canonicalPath: '/lexicon',
        type: 'website',
        keywords: {
          main: lexKw.mainKeyword,
          related: lexKw.relatedKeywords,
        },
      });
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <BookOpen className="w-4 h-4 text-stone-600" />
            <span>REFERENCE & TERMINOLOGY</span>
          </div>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Cricket Ballistics & Analytics Lexicon
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans mt-2 max-w-2xl">
            Standardized definitions for advanced metrics, biomechanical indicators, aerodynamic principles, and game theory equations referenced throughout The Corridor’s monographs.
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-3 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Standardized to ICC & MCC Ballistics Specifications</span>
          </div>
        </div>

        <div className="space-y-6">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              id={item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="p-6 rounded-xl bg-[#FDFCFA] border border-[#E7E2D9] hover:border-stone-400 transition-colors shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="font-editorial-serif text-xl font-semibold text-stone-900">
                  {item.term}
                </h2>
                <span className="text-xs font-sans font-medium text-stone-500 uppercase tracking-wider bg-stone-100 px-2.5 py-0.5 rounded">
                  {item.discipline}
                </span>
              </div>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans mt-2">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
