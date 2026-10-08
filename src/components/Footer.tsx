import React from 'react';
import { BookOpen, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenSimulator: () => void;
  onOpenGlossary: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSimulator,
  onOpenGlossary,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#1C1917] text-[#FBF9F5] border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Masthead & Editorial Mandate (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-editorial-serif text-2xl sm:text-3xl font-medium tracking-tight block text-stone-100">
              The Corridor
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-sans block -mt-2">
              Cricket Intelligence & Tactical Journal
            </span>
            <p className="text-sm text-stone-400 leading-relaxed font-sans max-w-sm">
              An independent scholarly journal of cricket ballistics, biomechanical modeling, spatial Hawkeye analytics, and tactical game theory across red-ball and white-ball formats.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Peer-Reviewed Data Modeling · ISSN 2814-9921</span>
            </div>
          </div>

          {/* Col 2: Research Departments (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-300 font-semibold font-sans">
              Analytical Sections
            </h4>
            <ul className="space-y-2 text-sm text-stone-400 font-sans">
              <li>
                <button
                  onClick={() => onSelectCategory('bowling')}
                  className="hover:text-stone-200 transition-colors cursor-pointer text-left"
                >
                  Pace & Spin Ballistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('batting')}
                  className="hover:text-stone-200 transition-colors cursor-pointer text-left"
                >
                  Batting Biomechanics & DRS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('tactics')}
                  className="hover:text-stone-200 transition-colors cursor-pointer text-left"
                >
                  Tactical Chess & Field Geometry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('data')}
                  className="hover:text-stone-200 transition-colors cursor-pointer text-left"
                >
                  Markov Chain & Run Expectancy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Utilities (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-300 font-semibold font-sans">
              Laboratory & Reference
            </h4>
            <div className="space-y-3">
              <button
                onClick={onOpenSimulator}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-stone-200 flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hawkeye Trajectory Simulator</span>
                  </div>
                  <div className="text-xs text-stone-500 font-sans mt-0.5">
                    Model 22-yard ballistics in real time
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenGlossary}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-stone-200 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Analytical Lexicon</span>
                  </div>
                  <div className="text-xs text-stone-500 font-sans mt-0.5">
                    Definitions of xRV, MOI, GRF, and Precession
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Colophon Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-sans">
          <div>
            © {new Date().getFullYear()} The Corridor Journal of Cricket Intelligence. All monographs published under Open Research Commons.
          </div>
          <div className="flex items-center gap-4">
            <span>Volume VII, Issue 1</span>
            <span aria-hidden="true">·</span>
            <span>Archived at Cambridge & Bengaluru</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
