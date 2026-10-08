import React, { useState, useMemo } from 'react';
import { X, Play, RotateCcw, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

interface TrajectorySimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: {
    speedKmph: number;
    lengthMeters: number;
    seamAngleDeg: number;
    releaseHeightM: number;
    ballType: 'Kookaburra Red' | 'Duke Red' | 'White Kookaburra' | 'Pink SG';
  };
}

export const TrajectorySimulator: React.FC<TrajectorySimulatorProps> = ({
  isOpen,
  onClose,
  initialPreset,
}) => {
  const [speed, setSpeed] = useState<number>(initialPreset?.speedKmph ?? 142);
  const [length, setLength] = useState<number>(initialPreset?.lengthMeters ?? 6.4);
  const [seamAngle, setSeamAngle] = useState<number>(initialPreset?.seamAngleDeg ?? 14);
  const [releaseHeight, setReleaseHeight] = useState<number>(initialPreset?.releaseHeightM ?? 2.18);
  const [ballType, setBallType] = useState<string>(initialPreset?.ballType ?? 'Duke Red');
  const [pitchCondition, setPitchCondition] = useState<'Standard Test Track' | 'Subcontinent Turner' | 'Perth Bouncy' | 'Abrasive T20 Drop-in'>('Standard Test Track');

  // Sync when initialPreset changes
  React.useEffect(() => {
    if (initialPreset) {
      setSpeed(initialPreset.speedKmph);
      setLength(initialPreset.lengthMeters);
      setSeamAngle(initialPreset.seamAngleDeg);
      setReleaseHeight(initialPreset.releaseHeightM);
      setBallType(initialPreset.ballType);
    }
  }, [initialPreset]);

  // Calculations
  const metrics = useMemo(() => {
    const speedMs = (speed * 1000) / 3600;
    const pitchLengthM = 20.12; // 22 yards
    const timeFlightSec = pitchLengthM / speedMs;
    const reactionWindowMs = Math.round(timeFlightSec * 1000 * 0.85);

    // Bounce physics
    let pitchBounceMultiplier = 1.0;
    if (pitchCondition === 'Perth Bouncy') pitchBounceMultiplier = 1.28;
    if (pitchCondition === 'Subcontinent Turner') pitchBounceMultiplier = 0.82;
    if (pitchCondition === 'Abrasive T20 Drop-in') pitchBounceMultiplier = 0.95;

    // Ball coefficient of restitution
    let ballCoR = 0.58;
    if (ballType === 'Duke Red') ballCoR = 0.64;
    if (ballType === 'Pink SG') ballCoR = 0.60;
    if (ballType === 'White Kookaburra') ballCoR = 0.56;

    // Calculate bounce height at batting crease (approx 1.2m behind length landing)
    // Distance from pitch mark to stumps = pitchLengthM - length
    const distanceAfterPitch = Math.max(0.5, pitchLengthM - length);
    const incidentAngleRad = Math.atan2(releaseHeight, length);
    const postBounceAngleRad = incidentAngleRad * ballCoR * pitchBounceMultiplier;
    const bounceHeightM = Math.min(2.2, Math.max(0.05, Math.tan(postBounceAngleRad) * distanceAfterPitch));
    const bounceHeightCm = Math.round(bounceHeightM * 100);

    // Lateral deviation at crease
    const deviationCm = Math.round(Math.sin((seamAngle * Math.PI) / 180) * (distanceAfterPitch / 2) * 12);

    // Outcome determination
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F5] border border-stone-300 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5DFD4] bg-[#F4EFE6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-stone-800" />
            <div>
              <h2 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
                The Corridor — Ballistics & Delivery Trajectory Laboratory
              </h2>
              <p className="text-xs text-stone-600 font-sans">
                Real-time spatial physics model predicting release vector, turf compression, and edge probability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual 2D Pitch & Trajectory Canvas */}
          <div className="bg-gradient-to-b from-[#2A342B] to-[#1E2620] p-4 sm:p-6 rounded-lg text-white border border-stone-800 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-emerald-300 mb-3">
              <span>HAWKEYE 22-YARD TRAJECTORY PROJECTION</span>
              <span>SCALE: 1:40 PHYSICAL GEOMETRY</span>
            </div>

            {/* Trajectory SVG */}
            <div className="w-full h-48 sm:h-56 relative bg-[#1A221C] rounded border border-emerald-900/40 p-2">
              <svg viewBox="0 0 800 200" className="w-full h-full">
                {/* Grass Pitch Base */}
                <line x1="20" y1="175" x2="780" y2="175" stroke="#4B634E" strokeWidth="4" />
                
                {/* Bowler End Crease (left) */}
                <line x1="60" y1="140" x2="60" y2="185" stroke="#A7C4AB" strokeWidth="2" strokeDasharray="3 3" />
                <text x="50" y="195" fill="#88A08C" fontSize="10" fontFamily="sans-serif">Bowler Crease</text>

                {/* Batter End Stumps (right) */}
                <rect x="740" y="115" width="4" height="60" fill="#E6C280" />
                <rect x="736" y="115" width="12" height="4" fill="#D4A760" />
                <text x="720" y="195" fill="#88A08C" fontSize="10" fontFamily="sans-serif">Stumps (71cm)</text>

                {/* Pitch Landing Point Indicator */}
                {/* Map length (0 to 20m) to SVG X (60 to 740) */}
                {/* length from bowling crease: x = 60 + (length / 20.12) * 680 */}
                {(() => {
                  const pitchX = 60 + (length / 20.12) * 680;
                  const releaseY = 175 - (releaseHeight / 2.5) * 110;
                  const bounceY = 175 - (metrics.bounceHeightCm / 220) * 110;

                  return (
                    <>
                      {/* Trajectory Pre-Bounce (Flight) */}
                      <path
                        d={`M 60 ${releaseY} Q ${(60 + pitchX) / 2} ${(releaseY + 175) / 2 - 12} ${pitchX} 175`}
                        fill="none"
                        stroke="#FF5252"
                        strokeWidth="2.5"
                        strokeDasharray="none"
                      />

                      {/* Trajectory Post-Bounce (Rebound to Bat) */}
                      <path
                        d={`M ${pitchX} 175 Q ${(pitchX + 740) / 2} ${(175 + bounceY) / 2} 740 ${bounceY}`}
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />

                      {/* Release Point Marker */}
                      <circle cx="60" cy={releaseY} r="5" fill="#FF5252" />
                      <text x="68" y={releaseY - 4} fill="#FF8A80" fontSize="9" fontFamily="monospace">
                        Release ({releaseHeight}m)
                      </text>

                      {/* Turf Pitch Impact Mark */}
                      <circle cx={pitchX} cy="175" r="4" fill="#69F0AE" />
                      <line x1={pitchX} y1="165" x2={pitchX} y2="185" stroke="#69F0AE" strokeWidth="1.5" />
                      <text x={pitchX - 25} y="160" fill="#B9F6CA" fontSize="9" fontFamily="monospace">
                        Pitch ({length.toFixed(1)}m)
                      </text>

                      {/* Batter Crease Impact Point */}
                      <circle cx="740" cy={bounceY} r="4.5" fill="#FFD54F" />
                      <text x="660" y={bounceY - 6} fill="#FFE082" fontSize="9" fontFamily="monospace">
                        Bounce: {metrics.bounceHeightCm}cm
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Hawkeye Instant Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-900/50 text-xs">
              <div>
                <span className="text-emerald-400 block font-mono text-[10px]">TIME TO CREASE</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {metrics.timeFlightSec}s
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {metrics.reactionWindowMs}ms reaction
                </span>
              </div>
              <div>
                <span className="text-emerald-400 block font-mono text-[10px]">CREASE BOUNCE</span>
                <span className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                  {metrics.bounceHeightCm} cm
                </span>
                <span className="text-[10px] text-stone-400 block">Stumps = 71.1cm</span>
              </div>
              <div>
                <span className="text-emerald-400 block font-mono text-[10px]">SEAM DEVIATION</span>
                <span className="text-lg font-mono font-bold text-rose-300 tabular-nums">
                  {metrics.deviationCm > 0 ? `+${metrics.deviationCm}` : metrics.deviationCm} cm
                </span>
                <span className="text-[10px] text-stone-400 block">At batting edge plane</span>
              </div>
              <div>
                <span className="text-emerald-400 block font-mono text-[10px]">THREAT INDEX</span>
                <span className="text-lg font-mono font-bold text-emerald-300 tabular-nums">
                  {metrics.dismissalThreat}/100
                </span>
                <span className="text-[10px] text-stone-400 block">{metrics.xRV} xRV</span>
              </div>
            </div>
          </div>

          {/* Outcome Verdict Card */}
          <div className="p-4 rounded-lg bg-[#F4EFE6] border border-[#E7E2D9] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {metrics.dismissalThreat > 75 ? (
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
              <div>
                <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  Predicted Hawkeye Verdict
                </div>
                <div className="text-base font-semibold text-stone-900 font-editorial-serif">
                  {metrics.outcome}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono px-2.5 py-1 bg-stone-200 rounded text-stone-800">
                xRV: {metrics.xRV}
              </span>
            </div>
          </div>

          {/* Tactical Sliders & Parametric Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Speed Control */}
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
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>80 km/h (Slow Spin)</span>
                <span>135 (Fast-Med)</span>
                <span>155 (Express Pace)</span>
              </div>
            </div>

            {/* Pitch Length Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-stone-700">
                <span>Pitch Length (Distance from Bowler)</span>
                <span className="font-mono font-bold text-stone-900">{length.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="11.5"
                step="0.2"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>2.0m (Yorker)</span>
                <span>6.5m (Good Length)</span>
                <span>11.0m (Bouncer)</span>
              </div>
            </div>

            {/* Seam Tilt Angle */}
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
                onChange={(e) => setSeamAngle(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>-20° (Sharp Inswing)</span>
                <span>0° (Upright)</span>
                <span>+20° (Wobble Out)</span>
              </div>
            </div>

            {/* Release Height */}
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
                onChange={(e) => setReleaseHeight(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>1.90m (Round-arm / Malinga)</span>
                <span>2.14m (Bumrah)</span>
                <span>2.45m (Tall Stature)</span>
              </div>
            </div>
          </div>

          {/* Ball & Pitch Preset Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E7E2D9]">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">
                Ball Specification
              </label>
              <select
                value={ballType}
                onChange={(e) => setBallType(e.target.value)}
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

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F4EFE6] border-t border-[#E5DFD4] flex items-center justify-between">
          <button
            onClick={() => {
              setSpeed(142);
              setLength(6.4);
              setSeamAngle(14);
              setReleaseHeight(2.18);
              setBallType('Duke Red');
            }}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Good Length</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
