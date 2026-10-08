import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GLOSSARY_TERMS = [
  {
    term: 'Expected Run Value (xRV)',
    discipline: 'Data Science & Match Analytics',
    definition:
      'A delivery-level metric quantifying the net change in expected innings total resulting from a specific ball trajectory. A dot ball on a good length may produce an xRV of -0.45 runs, whereas a wide yorker conceded outside the tramline produces +1.00 runs.',
  },
  {
    term: 'Gyroscopic Seam Precession',
    discipline: 'Fluid Dynamics & Ballistics',
    definition:
      'The rhythmic conical wobble of a cricket ball seam during flight (as observed in wobble seam deliveries by Cummins and Shami). This irregular oscillation prevents boundary layer separation, denying conventional swing in the air while maximizing random deviation upon pitch impact.',
  },
  {
    term: 'Ground Reaction Force (GRF)',
    discipline: 'Biomechanics & Kinetic Chain',
    definition:
      'The upward and horizontal counter-force exerted by the pitch surface back against the bowler’s front plant foot upon delivery stride. Jasprit Bumrah generates peak GRF of 8.9 times his body weight, providing explosive energy transfer into the release.',
  },
  {
    term: 'Polar Moment of Inertia (MOI)',
    discipline: 'Equipment Physics & Batting Mechanics',
    definition:
      'The resistance of a cricket bat blade to angular rotational twisting when struck by a ball off-center. Modern bats with 42mm edges place substantial willow mass along the extreme perimeters, maximizing MOI so that outside edges carry over boundary ropes.',
  },
  {
    term: 'Coefficient of Restitution (CoR)',
    discipline: 'Material Science',
    definition:
      'The ratio of relative speed after collision to relative speed before collision between a cricket ball and bat face. Modern lightly-pressed English Willow blades achieve CoR values exceeding 0.62, compared to 0.44 during the 1970s.',
  },
  {
    term: 'Saccadic Reaction Window',
    discipline: 'Neuro-Ocular Science',
    definition:
      'The time required for an elite batter’s optical cortex to execute rapid eye movements (saccades) to track a 140 km/h delivery from release point to predicted pitch mark. This biological window averages 180 to 220 milliseconds.',
  },
  {
    term: 'DRS Three-Meter Impact Threshold',
    discipline: 'Technology & Game Theory',
    definition:
      'Under ICC Decision Review System protocols, when pad impact occurs three meters or more from the stumps, Hawkeye’s projected path uncertainty increases exponentially, safeguarding batters who play expansive front-foot sweeps against LBW dismissals.',
  },
  {
    term: 'Markov Decision Process (MDP) in T20',
    discipline: 'Statistical Economics',
    definition:
      'A mathematical model that analyzes the 240 potential game states in a T20 match (overs remaining, wickets lost) to determine the mathematical optimal balance between strike rate and wicket preservation.',
  },
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F5] border border-stone-300 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#E5DFD4] bg-[#F4EFE6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-stone-800" />
            <div>
              <h2 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
                The Corridor — Analytics & Ballistics Lexicon
              </h2>
              <p className="text-xs text-stone-600 font-sans">
                Definitive guide to advanced metrics, biomechanical indicators, and aerodynamic principles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close Lexicon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {GLOSSARY_TERMS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#FDFBF7] border border-[#E7E2D9] hover:border-stone-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-editorial-serif text-lg font-semibold text-stone-900">
                    {item.term}
                  </h3>
                  <span className="text-[11px] font-sans font-medium text-stone-500 uppercase tracking-wider">
                    {item.discipline}
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-sans">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 bg-[#F4EFE6] border-t border-[#E5DFD4] flex items-center justify-between text-xs text-stone-600">
          <span>Standardized to ICC & MCC Ballistics Specifications</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
