import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Share2, Check, Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';
import { updatePageSEO } from '../utils/seo.ts';

export const SimulatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Read initial from search params or defaults
  const initialSpeed = Number(searchParams.get('speed')) || 142;
  const initialLength = Number(searchParams.get('length')) || 6.4;
  const initialSeam = Number(searchParams.get('seam')) || 14;
  const initialRelease = Number(searchParams.get('release')) || 2.18;
  const initialBall = searchParams.get('ball') || 'Duke Red';

  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [length, setLength] = useState<number>(initialLength);
  const [seamAngle, setSeamAngle] = useState<number>(initialSeam);
  const [releaseHeight, setReleaseHeight] = useState<number>(initialRelease);
  const [ballType, setBallType] = useState<string>(initialBall);
  const [pitchCondition, setPitchCondition] = useState<'Standard Test Track' | 'Subcontinent Turner' | 'Perth Bouncy' | 'Abrasive T20 Drop-in'>('Standard Test Track');

  useEffect(() => {
    updatePageSEO({
      title: 'Hawkeye Delivery Simulator & Trajectory Lab',
      description: 'Interactive 22-yard physics simulator modeling ball release velocity, seam tilt angle, turf compression, and edge dismissal probability.',
      canonicalPath: '/simulator',
      type: 'website',
    });
  }, []);

  // Sync to URL params whenever values change
  const syncParams = (newSpeed: number, newLength: number, newSeam: number, newRelease: number, newBall: string) => {
    setSearchParams({
      speed: String(newSpeed),
      length: String(newLength),
      seam: String(newSeam),
      release: String(newRelease),
      ball: newBall,
    });
  };

  const copyPresetUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Trajectory Physics
  const metrics = useMemo(() => {
    const speedMs = (speed * 1000) / 3600;
    const pitchLengthM = 20.12;
    const timeFlightSec = pitchLengthM / speedMs;
    const reactionWindowMs = Math.round(timeFlightSec * 1000 * 0.85);

    let pitchBounceMultiplier = 1.0;
    if (pitchCondition === 'Perth Bouncy') pitchBounceMultiplier = 1.28;
    if (pitchCondition === 'Subcontinent Turner') pitchBounceMultiplier = 0.82;
    if (pitchCondition === 'Abrasive T20 Drop-in') pitchBounceMultiplier = 0.95;

    let ballCoR = 0.58;
    if (ballType === 'Duke Red') ballCoR = 0.64;
    if (ballType === 'Pink SG') ballCoR = 0.60;
    if (ballType === 'White Kookaburra') ballCoR = 0.56;

    const distanceAfterPitch = Math.max(0.5, pitchLengthM - length);
    const incidentAngleRad = Math.atan2(releaseHeight, length);
    const postBounceAngleRad = incidentAngleRad * ballCoR * pitchBounceMultiplier;
    const bounceHeightM = Math.min(2.2, Math.max(0.05, Math.tan(postBounceAngleRad) * distanceAfterPitch));
    const bounceHeightCm = Math.round(bounceHeightM * 100);
    const deviationCm = Math.round(Math.sin((seamAngle * Math.PI) / 180) * (distanceAfterPitch / 2) * 12);

    let outcome = 'Defended on Back Foot';
    let dismissalThreat = 45;
    let xRV = '+0.88 runs';

    if (length < 3.2) {
      outcome = 'Yorker: Dig-Out or Toe Crush';
      dismissalThreat = 82;
      xRV = '-0.42 runs';
    } else if (length >= 5.8 && length <= 7.2) {
      if (Math.abs(deviationCm) > 6) {
        outcome = 'Outside Edge to Slip Cordon / Play & Miss';
        dismissalThreat = 91;
        xRV = '-0.85 runs';
      } else if (bounceHeightCm >= 68 && bounceHeightCm <= 78) {
        outcome = 'Top of Off-Stump Cartwheel / Plumb LBW';
        dismissalThreat = 95;
        xRV = '-1.10 runs';
      } else {
        outcome = 'Corridor of Uncertainty: Batter Tentative';
        dismissalThreat = 78;
        xRV = '+0.15 runs';
      }
    } else if (length > 9.5) {
      outcome = 'Bouncer: Duck or Hook/Pull Shot';
      dismissalThreat = 58;
      xRV = '+1.45 runs';
    } else {
      outcome = 'Full Driving Length: Front-foot Punch';
      dismissalThreat = 35;
      xRV = '+1.80 runs';
    }

    return {
      timeFlightSec: timeFlightSec.toFixed(2),
      reactionWindowMs,
      bounceHeightCm,
      deviationCm,
      outcome,
      dismissalThreat,
      xRV,
    };
  }, [speed, length, seamAngle, releaseHeight, ballType, pitchCondition]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Journal Home</span>
          </Link>

          <button
            onClick={copyPresetUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE7DD] hover:bg-[#E5DFD4] text-stone-800 rounded-md text-xs font-medium transition-colors"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800">Unique Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Delivery URL</span>
              </>
            )}
          </button>
        </div>

        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-[#E7E2D9]">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-1.5">
            HAWKEYE RESEARCH LABORATORY
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            22-Yard Delivery Ballistics & Trajectory Engine
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans mt-2 max-w-2xl">
            Simulate the exact physical vectors of cricket deliveries: release velocity, length, gyroscopic seam wobble, and turf rebound dynamics.
          </p>
        </div>

        {/* Visual 2D Pitch SVG Canvas */}
        <div className="bg-gradient-to-b from-[#2A342B] to-[#1E2620] p-6 rounded-xl text-white border border-stone-800 shadow-lg relative overflow-hidden mb-8">
          <div className="flex items-center justify-between text-xs font-mono tracking-wider text-emerald-300 mb-4">
            <span>HAWKEYE 22-YARD TRAJECTORY PROJECTION</span>
            <span>SCALE: 1:40 PHYSICAL GEOMETRY</span>
          </div>

          <div className="w-full h-56 sm:h-64 relative bg-[#1A221C] rounded-lg border border-emerald-900/40 p-2">
            <svg viewBox="0 0 800 200" className="w-full h-full">
              <line x1="20" y1="175" x2="780" y2="175" stroke="#4B634E" strokeWidth="4" />
              <line x1="60" y1="140" x2="60" y2="185" stroke="#A7C4AB" strokeWidth="2" strokeDasharray="3 3" />
              <text x="50" y="195" fill="#88A08C" fontSize="10" fontFamily="sans-serif">Bowler Crease</text>

              <rect x="740" y="115" width="4" height="60" fill="#E6C280" />
              <rect x="736" y="115" width="12" height="4" fill="#D4A760" />
              <text x="720" y="195" fill="#88A08C" fontSize="10" fontFamily="sans-serif">Stumps (71cm)</text>

              {(() => {
                const pitchX = 60 + (length / 20.12) * 680;
                const releaseY = 175 - (releaseHeight / 2.5) * 110;
                const bounceY = 175 - (metrics.bounceHeightCm / 220) * 110;

                return (
                  <>
                    <path
                      d={`M 60 ${releaseY} Q ${(60 + pitchX) / 2} ${(releaseY + 175) / 2 - 12} ${pitchX} 175`}
                      fill="none"
                      stroke="#FF5252"
                      strokeWidth="2.5"
                    />
                    <path
                      d={`M ${pitchX} 175 Q ${(pitchX + 740) / 2} ${(175 + bounceY) / 2} 740 ${bounceY}`}
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    <circle cx="60" cy={releaseY} r="5" fill="#FF5252" />
                    <text x="68" y={releaseY - 4} fill="#FF8A80" fontSize="9" fontFamily="monospace">
                      Release ({releaseHeight}m)
                    </text>
                    <circle cx={pitchX} cy="175" r="4" fill="#69F0AE" />
                    <line x1={pitchX} y1="165" x2={pitchX} y2="185" stroke="#69F0AE" strokeWidth="1.5" />
                    <text x={pitchX - 25} y="160" fill="#B9F6CA" fontSize="9" fontFamily="monospace">
                      Pitch ({length.toFixed(1)}m)
                    </text>
                    <circle cx="740" cy={bounceY} r="4.5" fill="#FFD54F" />
                    <text x="660" y={bounceY - 6} fill="#FFE082" fontSize="9" fontFamily="monospace">
                      Bounce: {metrics.bounceHeightCm}cm
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Hawkeye Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-emerald-900/50 text-xs">
            <div>
              <span className="text-emerald-400 block font-mono text-[10px]">TIME TO CREASE</span>
              <span className="text-xl font-mono font-bold text-white tabular-nums">
                {metrics.timeFlightSec}s
              </span>
              <span className="text-[10px] text-stone-400 block">{metrics.reactionWindowMs}ms reaction</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-mono text-[10px]">CREASE BOUNCE</span>
              <span className="text-xl font-mono font-bold text-amber-300 tabular-nums">
                {metrics.bounceHeightCm} cm
              </span>
              <span className="text-[10px] text-stone-400 block">Stumps = 71.1cm</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-mono text-[10px]">SEAM DEVIATION</span>
              <span className="text-xl font-mono font-bold text-rose-300 tabular-nums">
                {metrics.deviationCm > 0 ? `+${metrics.deviationCm}` : metrics.deviationCm} cm
              </span>
              <span className="text-[10px] text-stone-400 block">At batting edge</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-mono text-[10px]">THREAT INDEX</span>
              <span className="text-xl font-mono font-bold text-emerald-300 tabular-nums">
                {metrics.dismissalThreat}/100
              </span>
              <span className="text-[10px] text-stone-400 block">{metrics.xRV}</span>
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="p-5 rounded-xl bg-[#F4EFE6] border border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {metrics.dismissalThreat > 75 ? (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            )}
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                Predicted Outcome
              </div>
              <div className="text-lg font-semibold text-stone-900 font-editorial-serif">
                {metrics.outcome}
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs font-mono px-3 py-1.5 bg-stone-200 rounded text-stone-800">
              Expected Run Value (xRV): {metrics.xRV}
            </span>
          </div>
        </div>

        {/* Parameter Sliders */}
        <div className="bg-[#FDFCFA] border border-[#E7E2D9] rounded-xl p-6 shadow-xs space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-stone-700">
                <span>Release Velocity</span>
                <span className="font-mono font-bold text-stone-900">{speed} km/h</span>
              </div>
              <input
                type="range"
                min="80"
                max="155"
                step="1"
                value={speed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSpeed(val);
                  syncParams(val, length, seamAngle, releaseHeight, ballType);
                }}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>80 (Spin)</span>
                <span>135 (Fast-Med)</span>
                <span>155 (Express)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-stone-700">
                <span>Pitch Length (Landing Point)</span>
                <span className="font-mono font-bold text-stone-900">{length.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="11.5"
                step="0.2"
                value={length}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLength(val);
                  syncParams(speed, val, seamAngle, releaseHeight, ballType);
                }}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>2.0m (Yorker)</span>
                <span>6.5m (Good Length)</span>
                <span>11.0m (Bouncer)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-stone-700">
                <span>Seam Precession / Wobble Angle</span>
                <span className="font-mono font-bold text-stone-900">{seamAngle}°</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={seamAngle}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSeamAngle(val);
                  syncParams(speed, length, val, releaseHeight, ballType);
                }}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>-20° (Inswing)</span>
                <span>0° (Upright)</span>
                <span>+20° (Wobble)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-stone-700">
                <span>Vertical Release Point</span>
                <span className="font-mono font-bold text-stone-900">{releaseHeight.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="1.90"
                max="2.45"
                step="0.02"
                value={releaseHeight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setReleaseHeight(val);
                  syncParams(speed, length, seamAngle, val, ballType);
                }}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>1.90m (Round-arm)</span>
                <span>2.14m (Bumrah)</span>
                <span>2.45m (Tall)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E7E2D9]">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">
                Ball Specification
              </label>
              <select
                value={ballType}
                onChange={(e) => {
                  const val = e.target.value;
                  setBallType(val);
                  syncParams(speed, length, seamAngle, releaseHeight, val);
                }}
                className="w-full px-3 py-2 bg-[#FDFCFA] border border-[#DDD7CC] rounded-md text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="Duke Red">Duke Red (Pronounced Hand-Stitched Seam)</option>
                <option value="Kookaburra Red">Kookaburra Red (Machine Stitched Seam)</option>
                <option value="White Kookaburra">White Kookaburra (T20 Hard Enamel Finish)</option>
                <option value="Pink SG">Pink SG (Day-Night Lacquer Layer)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">
                Surface & Pitch Character
              </label>
              <select
                value={pitchCondition}
                onChange={(e) => setPitchCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FDFCFA] border border-[#DDD7CC] rounded-md text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="Standard Test Track">Standard Test Track (Lord's / Melbourne)</option>
                <option value="Perth Bouncy">Perth WACA / Optus (Extreme Clay Hardness)</option>
                <option value="Subcontinent Turner">Subcontinent Day 4 (Low Skid & Turn)</option>
                <option value="Abrasive T20 Drop-in">Abrasive T20 Drop-in (High Friction)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
