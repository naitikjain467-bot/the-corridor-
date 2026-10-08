export interface PageKeywordEntry {
  pagePath: string;
  pageName: string;
  pageTitle: string; // Strictly 30–60 characters, specific, branded
  pageType: 'Core Page' | 'Monograph' | 'Research Department';
  mainKeyword: string;
  relatedKeywords: [string, string];
  description: string; // Strictly 120–160 characters with actionable CTA
}

export const SITE_PAGE_KEYWORDS: Record<string, PageKeywordEntry> = {
  // Core Platform Pages
  '/': {
    pagePath: '/',
    pageName: 'Journal Home & Overview',
    pageTitle: 'The Corridor – Cricket Analytics & Tactical Journal', // 52 chars
    pageType: 'Core Page',
    mainKeyword: 'cricket analysis',
    relatedKeywords: ['Hawk-Eye ball tracking', 'cricket tactical analytics'],
    description: 'Explore peer-reviewed cricket analytics, Hawk-Eye ball tracking data, biomechanical models, and tactical monographs across Test, ODI, and T20 matches.', // 151 chars
  },
  '/simulator': {
    pagePath: '/simulator',
    pageName: 'Delivery Trajectory & Ballistics Simulator',
    pageTitle: 'Hawkeye Ballistics Simulator | The Corridor', // 44 chars
    pageType: 'Core Page',
    mainKeyword: 'cricket delivery trajectory simulator',
    relatedKeywords: ['22-yard Hawkeye physics engine', 'crease bounce height calculation'],
    description: 'Simulate 22-yard delivery vectors, calculate bounce height at the crease, and model seam deviation with our interactive Hawkeye ballistics physics engine.', // 154 chars
  },
  '/lexicon': {
    pagePath: '/lexicon',
    pageName: 'Cricket Ballistics & Analytics Lexicon',
    pageTitle: 'Cricket Analytics Lexicon | The Corridor', // 41 chars
    pageType: 'Core Page',
    mainKeyword: 'cricket analytics terminology glossary',
    relatedKeywords: ['advanced cricket metrics definitions', 'ballistics parameters reference'],
    description: 'Study standardized definitions for advanced cricket metrics including expected run value xRV, polar MOI, and ground reaction forces in our research glossary.', // 157 chars
  },
  '/reading-list': {
    pagePath: '/reading-list',
    pageName: 'Saved Monograph Reading List',
    pageTitle: 'Saved Monograph Reading List | The Corridor', // 44 chars
    pageType: 'Core Page',
    mainKeyword: 'cricket research monograph archive',
    relatedKeywords: ['saved tactical studies', 'offline sports science papers'],
    description: 'Access your personal archive of saved cricket analytics monographs, biomechanical data models, and tactical game theory papers for comprehensive study.', // 152 chars
  },

  // Research Departments
  '/category/bowling-analytics': {
    pagePath: '/category/bowling-analytics',
    pageName: 'Bowling Analytics Department',
    pageTitle: 'Bowling Ballistics Research | The Corridor', // 44 chars
    pageType: 'Research Department',
    mainKeyword: 'fast bowling ballistics research',
    relatedKeywords: ['seam orientation aerodynamics', 'pace release metrics'],
    description: 'Analyze fast bowling ballistics research, release velocity kinematics, Duke seam aerodynamics, and T20 mystery spin revolutions in our scholarly papers.', // 154 chars
  },
  '/category/batting-mechanics': {
    pagePath: '/category/batting-mechanics',
    pageName: 'Batting Mechanics Department',
    pageTitle: 'Batting Biomechanics Studies | The Corridor', // 44 chars
    pageType: 'Research Department',
    mainKeyword: 'cricket batting biomechanics',
    relatedKeywords: ['kinetic chain bat speed', 'DRS ball tracking defense'],
    description: 'Examine cricket batting biomechanics, kinetic chain energy transfer, DRS 3-meter impact protection, and horizontal sweep shot vectors in our monographs.', // 153 chars
  },
  '/category/tactical-theory': {
    pagePath: '/category/tactical-theory',
    pageName: 'Tactical Theory & Field Chess Department',
    pageTitle: 'Tactical Game Theory in Cricket | The Corridor', // 47 chars
    pageType: 'Research Department',
    mainKeyword: 'cricket game theory tactics',
    relatedKeywords: ['fielding geometric traps', 'fourth innings run chases'],
    description: 'Explore strategic cricket game theory, fielding cordon geometry, short mid-wicket traps, and risk-adjusted fourth-innings win probabilities with our team.', // 154 chars
  },
  '/category/data-science': {
    pagePath: '/category/data-science',
    pageName: 'Data Science & Probability Department',
    pageTitle: 'Cricket Performance Data Science | The Corridor', // 48 chars
    pageType: 'Research Department',
    mainKeyword: 'cricket performance data science',
    relatedKeywords: ['Markov run expectancy matrices', 'expected run value models'],
    description: 'Discover performance data science models, Markov chain run expectancy matrices, and delivery-level expected run value xRV simulations in our research.', // 151 chars
  },
  '/category/equipment-physics': {
    pagePath: '/category/equipment-physics',
    pageName: 'Equipment & Material Physics Department',
    pageTitle: 'Cricket Equipment Physics Lab | The Corridor', // 45 chars
    pageType: 'Research Department',
    mainKeyword: 'cricket equipment material science',
    relatedKeywords: ['Salix alba willow density', 'bat pressing cellular compression'],
    description: 'Investigate English Willow cricket bat physics, 42mm edge moment of inertia, cellular wood compression, and trampoline restitution coefficients today.', // 151 chars
  },

  // Individual Research Monographs (10 Blogs)
  '/essay/death-bowling-yorker-geometry': {
    pagePath: '/essay/death-bowling-yorker-geometry',
    pageName: 'The Death Bowling Revolution',
    pageTitle: 'Death Bowling Yorker Analytics | The Corridor', // 46 chars
    pageType: 'Monograph',
    mainKeyword: 'death bowling yorker analytics',
    relatedKeywords: ['T20 wide line strategy', 'expected run value xRV'],
    description: 'Deconstruct modern T20 death overs, expected run value xRV, and why wide tramline trajectories neutralized front-leg clearing in this tactical monograph.', // 153 chars
  },
  '/essay/bumrah-release-biomechanics': {
    pagePath: '/essay/bumrah-release-biomechanics',
    pageName: 'Deconstructing Bumrah’s Release',
    pageTitle: 'Bumrah Release Biomechanics | The Corridor', // 43 chars
    pageType: 'Monograph',
    mainKeyword: 'Jasprit Bumrah bowling action biomechanics',
    relatedKeywords: ['ground reaction force cricket', 'hyperextended release angle'],
    description: 'Analyze Jasprit Bumrah\'s 8-pace run-up, 8.9x ground reaction force, hyperextended elbow whip, and 0.38-second reaction window with high-speed telemetry.', // 152 chars
  },
  '/essay/death-of-classical-spin-t20': {
    pagePath: '/essay/death-of-classical-spin-t20',
    pageName: 'The Death of Classical Drift',
    pageTitle: 'T20 Mystery Spin Mechanics | The Corridor', // 42 chars
    pageType: 'Monograph',
    mainKeyword: 'T20 mystery spin bowling mechanics',
    relatedKeywords: ['carrom ball revolutions RPM', 'rapid skid trajectory'],
    description: 'Discover why 95 km/h release speeds, rapid skid, and carrom finger flick releases displaced traditional looping flight in modern T20 cricket analytics.', // 152 chars
  },
  '/essay/bazball-fourth-innings-dynamics': {
    pagePath: '/essay/bazball-fourth-innings-dynamics',
    pageName: 'Bazball Under the Microscope',
    pageTitle: 'Bazball Fourth-Innings Tactics | The Corridor', // 46 chars
    pageType: 'Monograph',
    mainKeyword: 'Bazball fourth innings Test match strategy',
    relatedKeywords: ['run rate aggression index', 'field spreading geometry'],
    description: 'Audit England\'s run rate surge to 4.7 RPO, risk-adjusted win probabilities, and how aggressive strokeplay dismantles Test match slip cordons in our paper.', // 154 chars
  },
  '/essay/wobble-seam-revolution': {
    pagePath: '/essay/wobble-seam-revolution',
    pageName: 'The Wobble Seam Revolution',
    pageTitle: 'Wobble Seam Aerodynamics | The Corridor', // 41 chars
    pageType: 'Monograph',
    mainKeyword: 'wobble seam cricket aerodynamics',
    relatedKeywords: ['Duke ball seam precession', 'pitch impact micro-deviation'],
    description: 'Explore the fluid dynamics of gyroscopic seam precession and learn why random turf micro-deviation consistently defeats elite batters over air-swing.', // 148 chars
  },
  '/essay/geometry-of-modern-sweep': {
    pagePath: '/essay/geometry-of-modern-sweep',
    pageName: 'The Geometry of the Modern Sweep',
    pageTitle: 'Modern Reverse Sweep Physics | The Corridor', // 44 chars
    pageType: 'Monograph',
    mainKeyword: 'reverse sweep shot mechanics',
    relatedKeywords: ['DRS 3-meter LBW impact threshold', 'horizontal bat spin counter'],
    description: 'Understand the vector physics of horizontal-bat sweeps, DRS 3-meter LBW impact rules, and counter-drift tactics against elite spin in our analysis.', // 147 chars
  },
  '/essay/anchor-paradox-t20-run-expectancy': {
    pagePath: '/essay/anchor-paradox-t20-run-expectancy',
    pageName: 'The Anchor Paradox',
    pageTitle: 'T20 Anchor Strike Rate Paradox | The Corridor', // 46 chars
    pageType: 'Monograph',
    mainKeyword: 'T20 batting strike rate analytics',
    relatedKeywords: ['Markov chain run expectancy', 'anchor role depreciation'],
    description: 'Evaluate Markov chain simulations across 10,000 T20 innings and discover why traditional anchor accumulations destroy team win probability in modern play.', // 155 chars
  },
  '/essay/left-arm-pacer-asymmetry': {
    pagePath: '/essay/left-arm-pacer-asymmetry',
    pageName: 'The Left-Arm Pacer Asymmetry',
    pageTitle: 'Left-Arm Fast Bowling Angles | The Corridor', // 44 chars
    pageType: 'Monograph',
    mainKeyword: 'left arm fast bowler release angle',
    relatedKeywords: ['opening over powerplay dismissals', 'saccadic eye tracking blindspot'],
    description: 'Investigate the geometric release angles of elite left-arm pacers and discover how saccadic visual occlusion generates a 38% powerplay wicket advantage.', // 153 chars
  },
  '/essay/fielding-placements-as-chess': {
    pagePath: '/essay/fielding-placements-as-chess',
    pageName: 'Fielding Placements as Chess',
    pageTitle: 'Cricket Field Placement Chess | The Corridor', // 45 chars
    pageType: 'Monograph',
    mainKeyword: 'Test match cricket fielding strategy',
    relatedKeywords: ['short mid-wicket trap', 'computer vision catch probability'],
    description: 'Analyze computer-vision catch probability heatmaps, 12-meter short mid-wicket traps, and psychological weight transfer manipulation in modern Test cricket.', // 155 chars
  },
  '/essay/material-physics-modern-willow': {
    pagePath: '/essay/material-physics-modern-willow',
    pageName: 'The Material Physics of Modern Willow',
    pageTitle: 'English Willow Cricket Bat Physics | The Corridor', // 50 chars
    pageType: 'Monograph',
    mainKeyword: 'English Willow cricket bat physics',
    relatedKeywords: ['42mm bat edge moment of inertia', 'coefficient of restitution willow'],
    description: 'Explore Grade 1 English Willow density, 42mm edge perimeter mass, polar moment of inertia, and restitution physics in this material science monograph.', // 151 chars
  },
};

// Also populate /blog/ aliases for seamless routing and canonical indexing
Object.keys(SITE_PAGE_KEYWORDS).forEach((key) => {
  if (key.startsWith('/essay/')) {
    const blogKey = key.replace('/essay/', '/blog/');
    SITE_PAGE_KEYWORDS[blogKey] = {
      ...SITE_PAGE_KEYWORDS[key],
      pagePath: blogKey,
    };
  }
});

export function getPageKeywordEntry(pathOrSlug: string): PageKeywordEntry | undefined {
  if (SITE_PAGE_KEYWORDS[pathOrSlug]) return SITE_PAGE_KEYWORDS[pathOrSlug];
  if (SITE_PAGE_KEYWORDS[`/essay/${pathOrSlug}`]) return SITE_PAGE_KEYWORDS[`/essay/${pathOrSlug}`];
  if (SITE_PAGE_KEYWORDS[`/blog/${pathOrSlug}`]) return SITE_PAGE_KEYWORDS[`/blog/${pathOrSlug}`];
  if (SITE_PAGE_KEYWORDS[`/category/${pathOrSlug}`]) return SITE_PAGE_KEYWORDS[`/category/${pathOrSlug}`];
  return undefined;
}
