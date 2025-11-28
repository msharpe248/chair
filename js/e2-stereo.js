/**
 * E2 Stereochemistry Module
 *
 * Handles E2 elimination visualization, including:
 * - Anti-periplanar requirement visualization
 * - Product prediction with E/Z geometry
 * - Newman projection highlighting
 */

// Common leaving groups
export const LEAVING_GROUPS = {
  Br: { name: 'Bromide', symbol: 'Br', quality: 'good' },
  Cl: { name: 'Chloride', symbol: 'Cl', quality: 'good' },
  I: { name: 'Iodide', symbol: 'I', quality: 'excellent' },
  OTs: { name: 'Tosylate', symbol: 'OTs', quality: 'excellent' },
  OMs: { name: 'Mesylate', symbol: 'OMs', quality: 'excellent' },
  OH2: { name: 'Water', symbol: 'OH₂⁺', quality: 'good' }
};

// Common bases for E2
export const E2_BASES = {
  'tBuOK': { name: 'Potassium tert-butoxide', strength: 'strong', bulky: true, favors: 'hofmann' },
  'NaOEt': { name: 'Sodium ethoxide', strength: 'strong', bulky: false, favors: 'zaitsev' },
  'NaOH': { name: 'Sodium hydroxide', strength: 'strong', bulky: false, favors: 'zaitsev' },
  'DBU': { name: 'DBU', strength: 'strong', bulky: true, favors: 'hofmann' },
  'LDA': { name: 'LDA', strength: 'strong', bulky: true, favors: 'hofmann' }
};

/**
 * E2 substrate configuration
 * Represents a molecule for E2 elimination analysis
 */
export function createE2Substrate(config) {
  return {
    // Carbon bearing the leaving group (α-carbon)
    alphaCarbon: config.alphaCarbon || {
      substituents: ['H', 'CH3'],  // Groups on α-carbon besides LG and β-carbon
      leavingGroup: 'Br'
    },
    // β-carbons (can have multiple)
    betaCarbons: config.betaCarbons || [
      {
        id: 'beta1',
        hydrogens: 2,  // Number of β-hydrogens
        substituents: ['H'],  // Other substituents
        // Dihedral angles of each H relative to leaving group (180° = anti-periplanar)
        hDihedrals: [180, 60]  // First H is anti, second is gauche
      }
    ],
    name: config.name || 'Substrate'
  };
}

/**
 * Preset E2 substrates for demonstration
 */
export const E2_PRESETS = {
  '2-bromobutane': {
    name: '2-Bromobutane',
    alphaCarbon: {
      substituents: ['H', 'CH3'],
      leavingGroup: 'Br'
    },
    betaCarbons: [
      {
        id: 'C1',
        name: 'C1 (methyl)',
        hydrogens: 3,
        substituents: [],
        hDihedrals: [180, 60, 300],  // One anti-periplanar
        product: '1-butene',
        productType: 'terminal',
        isZaitsev: false
      },
      {
        id: 'C3',
        name: 'C3 (methylene)',
        hydrogens: 2,
        substituents: ['CH3'],
        hDihedrals: [180, 60],  // One anti-periplanar
        product: '2-butene',
        productType: 'internal',
        isZaitsev: true
      }
    ]
  },
  '2-bromopentane': {
    name: '2-Bromopentane',
    alphaCarbon: {
      substituents: ['H', 'CH3'],
      leavingGroup: 'Br'
    },
    betaCarbons: [
      {
        id: 'C1',
        name: 'C1 (methyl)',
        hydrogens: 3,
        substituents: [],
        hDihedrals: [180, 60, 300],
        product: '1-pentene',
        productType: 'terminal',
        isZaitsev: false
      },
      {
        id: 'C3',
        name: 'C3 (methylene)',
        hydrogens: 2,
        substituents: ['C2H5'],
        hDihedrals: [180, 60],
        product: '2-pentene',
        productType: 'internal',
        isZaitsev: true
      }
    ]
  },
  'cyclohexyl-bromide': {
    name: 'Bromocyclohexane',
    alphaCarbon: {
      substituents: ['H'],
      leavingGroup: 'Br',
      position: 'axial'  // LG position affects which H's are anti
    },
    betaCarbons: [
      {
        id: 'C2',
        name: 'C2',
        hydrogens: 2,
        substituents: [],
        // In chair: axial LG means axial β-H is anti-periplanar
        hDihedrals: [180, 60],  // Axial H is anti when LG is axial
        hPositions: ['axial', 'equatorial'],
        product: 'cyclohexene',
        productType: 'cyclic',
        isZaitsev: true
      }
    ],
    isCyclic: true
  },
  'menthyl-chloride': {
    name: '(1R,2S,5R)-Menthyl chloride',
    description: 'Classic example showing anti-periplanar requirement in chair',
    alphaCarbon: {
      substituents: ['iPr'],
      leavingGroup: 'Cl',
      position: 'axial'
    },
    betaCarbons: [
      {
        id: 'C2',
        name: 'C2',
        hydrogens: 1,
        substituents: ['CH3'],
        hDihedrals: [180],  // Only one β-H, and it's anti
        hPositions: ['axial'],
        product: '2-menthene',
        productType: 'cyclic',
        canEliminate: true
      }
    ],
    isCyclic: true
  },
  'neomenthyl-chloride': {
    name: 'Neomenthyl chloride',
    description: 'Epimer of menthyl - LG equatorial, different reactivity',
    alphaCarbon: {
      substituents: ['iPr'],
      leavingGroup: 'Cl',
      position: 'equatorial'
    },
    betaCarbons: [
      {
        id: 'C2',
        name: 'C2',
        hydrogens: 1,
        substituents: ['CH3'],
        hDihedrals: [60],  // β-H is gauche, not anti!
        hPositions: ['equatorial'],
        product: '2-menthene',
        productType: 'cyclic',
        canEliminate: false,  // Must ring flip first
        note: 'Requires ring flip for anti-periplanar geometry'
      }
    ],
    isCyclic: true
  }
};

/**
 * Analyze E2 elimination possibilities for a substrate
 * @param {Object} substrate - E2 substrate configuration
 * @param {string} baseType - Type of base used
 * @returns {Object} Analysis results
 */
export function analyzeE2(substrate, baseType = 'NaOEt') {
  const base = E2_BASES[baseType] || E2_BASES['NaOEt'];
  const results = {
    substrate: substrate.name,
    base: base.name,
    products: [],
    majorProduct: null,
    explanation: []
  };

  // Analyze each β-carbon
  for (const beta of substrate.betaCarbons) {
    // Find anti-periplanar hydrogens
    const antiHydrogens = beta.hDihedrals.filter(d => d >= 150 && d <= 210);

    if (antiHydrogens.length === 0) {
      results.explanation.push(
        `${beta.name}: No anti-periplanar H available - elimination blocked or requires conformational change`
      );
      continue;
    }

    const product = {
      from: beta.id,
      name: beta.product,
      type: beta.productType,
      isZaitsev: beta.isZaitsev,
      antiHCount: antiHydrogens.length,
      canForm: beta.canEliminate !== false
    };

    if (beta.note) {
      product.note = beta.note;
    }

    results.products.push(product);
  }

  // Determine major product based on base
  if (results.products.length > 0) {
    const viableProducts = results.products.filter(p => p.canForm);

    if (base.favors === 'zaitsev') {
      // More substituted alkene
      results.majorProduct = viableProducts.find(p => p.isZaitsev) || viableProducts[0];
      results.explanation.push(
        `Zaitsev product favored: ${base.name} is not bulky, favors more substituted alkene`
      );
    } else {
      // Less substituted (Hofmann)
      results.majorProduct = viableProducts.find(p => !p.isZaitsev) || viableProducts[0];
      results.explanation.push(
        `Hofmann product favored: ${base.name} is bulky, favors less substituted alkene`
      );
    }
  }

  // Add E2 requirements explanation
  results.explanation.unshift(
    'E2 requires anti-periplanar geometry: H and leaving group must be 180° apart'
  );

  return results;
}

/**
 * Get Newman projection data for E2 visualization
 * Shows leaving group and highlights anti-periplanar hydrogens
 * @param {string} lgPosition - Position of leaving group in degrees (0-360)
 * @param {Array} betaSubstituents - Array of {label, angle} for β-carbon
 * @returns {Object} Newman data with highlighting info
 */
export function getE2NewmanData(lgPosition, betaSubstituents) {
  // Calculate which substituents are anti-periplanar to LG
  const antiAngle = (lgPosition + 180) % 360;

  const highlighted = betaSubstituents.map(sub => {
    const angleDiff = Math.abs(sub.angle - antiAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);

    return {
      ...sub,
      isAntiPeriplanar: normalizedDiff < 30,  // Within 30° of perfect anti
      isGauche: normalizedDiff >= 50 && normalizedDiff <= 70,
      isSyn: normalizedDiff > 150,
      angleDiff: normalizedDiff
    };
  });

  return {
    leavingGroup: { angle: lgPosition, label: 'LG' },
    betaSubstituents: highlighted,
    antiAngle: antiAngle
  };
}

/**
 * Predict E/Z geometry of E2 product based on anti-periplanar elimination
 * @param {Object} config - Configuration of groups
 * @returns {string} 'E', 'Z', or 'N/A' for terminal alkenes
 */
export function predictEZGeometry(config) {
  // For E2: groups that were anti to each other end up on same side (Z)
  // Groups that were gauche end up on opposite sides (E)

  // If terminal alkene, E/Z doesn't apply
  if (config.isTerminal) {
    return 'N/A (terminal alkene)';
  }

  // The β-H that leaves was anti to LG
  // The other group on β-carbon and the group on α-carbon determine E/Z
  // If they were on same side of the C-C bond being viewed → Z product
  // If they were on opposite sides → E product

  if (config.alphaGroup && config.betaGroup) {
    // Check if they were syn or anti to each other
    const angleDiff = Math.abs(config.alphaGroupAngle - config.betaGroupAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);

    if (normalizedDiff < 90) {
      return 'Z';  // Groups were close, end up on same side
    } else {
      return 'E';  // Groups were far apart, end up on opposite sides
    }
  }

  return 'E';  // Default for most substituted cases
}

/**
 * Generate explanation for E2 stereochemistry
 */
export function explainE2Stereo(analysis) {
  const explanations = [
    {
      title: 'Anti-Periplanar Requirement',
      content: 'In E2, the β-hydrogen and leaving group MUST be at 180° dihedral angle (anti-periplanar). This allows the orbitals to align for concerted bond breaking/forming.'
    },
    {
      title: 'Why Anti?',
      content: 'The C-H σ bond must align with the C-LG σ* antibonding orbital. This overlap is maximized at 180° and minimized at 0° (syn).'
    },
    {
      title: 'Concerted Mechanism',
      content: 'E2 is one step: base removes H, C=C forms, and LG leaves all at once. No carbocation intermediate means no rearrangements!'
    }
  ];

  if (analysis.majorProduct) {
    if (analysis.majorProduct.isZaitsev) {
      explanations.push({
        title: 'Zaitsev Product',
        content: 'With a non-bulky base, the more substituted (more stable) alkene is the major product.'
      });
    } else {
      explanations.push({
        title: 'Hofmann Product',
        content: 'With a bulky base, steric hindrance prevents removal of the more hindered H, giving the less substituted alkene.'
      });
    }
  }

  return explanations;
}

/**
 * Create quiz question for E2 stereochemistry
 */
export function generateE2Question(difficulty = 1) {
  const questions = [
    // Easy questions
    {
      difficulty: 1,
      type: 'anti_requirement',
      question: 'In E2 elimination, what is the required dihedral angle between the β-hydrogen and leaving group?',
      options: ['0° (syn)', '60° (gauche)', '120°', '180° (anti)'],
      correct: 3,
      explanation: 'E2 requires anti-periplanar geometry (180°) for proper orbital overlap.'
    },
    {
      difficulty: 1,
      type: 'mechanism_type',
      question: 'Does E2 elimination involve a carbocation intermediate?',
      options: ['Yes, always', 'Only with 3° substrates', 'No, it is concerted', 'Only at high temperature'],
      correct: 2,
      explanation: 'E2 is a concerted (one-step) mechanism with no intermediates. This is why no rearrangements occur.'
    },
    // Medium questions
    {
      difficulty: 2,
      type: 'product_prediction',
      question: 'When 2-bromobutane reacts with NaOEt (non-bulky base), what is the major product?',
      options: ['1-butene', '(E)-2-butene', '(Z)-2-butene', 'Equal mixture of 1-butene and 2-butene'],
      correct: 1,
      explanation: 'Non-bulky base favors Zaitsev product (more substituted). The E isomer is favored due to reduced steric strain.'
    },
    {
      difficulty: 2,
      type: 'base_effect',
      question: 'What product is favored when using t-BuOK (bulky base) for E2?',
      options: ['More substituted alkene (Zaitsev)', 'Less substituted alkene (Hofmann)', 'No reaction occurs', 'Substitution product'],
      correct: 1,
      explanation: 'Bulky bases cannot easily access the more hindered β-hydrogens, so the less substituted (Hofmann) product forms.'
    },
    // Hard questions
    {
      difficulty: 3,
      type: 'cyclohexane_stereo',
      question: 'For E2 elimination from cyclohexane derivatives, when the leaving group is axial, which β-hydrogen can be eliminated?',
      options: ['Only equatorial H', 'Only axial H', 'Either H', 'Neither H without ring flip'],
      correct: 1,
      explanation: 'In a chair conformation, only the axial β-H is anti-periplanar (180°) to an axial leaving group. Equatorial H is gauche (60°).'
    },
    {
      difficulty: 3,
      type: 'stereochemistry',
      question: 'E2 elimination of (2R,3R)-2-bromo-3-deuterobutane gives mostly:',
      options: ['(E)-2-butene-3-d', '(Z)-2-butene-3-d', 'Equal E and Z', '2-butene with no deuterium'],
      correct: 0,
      explanation: 'Anti elimination means the D and CH3 that were anti to each other end up on opposite sides of the double bond (E configuration).'
    }
  ];

  const filtered = questions.filter(q => q.difficulty <= difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
