/**
 * SMILES-Based Reaction Analyzer
 *
 * Analyzes reactions from SMILES strings to classify reaction type
 * and estimate thermodynamic parameters.
 */

// Bond dissociation energies (kcal/mol) - average values
export const BOND_ENERGIES = {
  'C-H': 99,
  'C-C': 83,
  'C=C': 146,
  'C≡C': 200,
  'C-O': 86,
  'C=O': 178,
  'C-N': 73,
  'C=N': 147,
  'C≡N': 213,
  'C-F': 116,
  'C-Cl': 81,
  'C-Br': 68,
  'C-I': 51,
  'C-S': 65,
  'O-H': 110,
  'N-H': 93,
  'S-H': 82,
  'H-H': 104,
  'H-F': 136,
  'H-Cl': 103,
  'H-Br': 87,
  'H-I': 71
};

// Common leaving groups with their quality scores
const LEAVING_GROUPS = {
  'I': { quality: 'excellent', bondType: 'C-I' },
  'Br': { quality: 'good', bondType: 'C-Br' },
  'Cl': { quality: 'good', bondType: 'C-Cl' },
  'F': { quality: 'moderate', bondType: 'C-F' },
  'OTs': { quality: 'excellent', bondType: 'C-O' },
  'OMs': { quality: 'excellent', bondType: 'C-O' },
  'OH': { quality: 'poor', bondType: 'C-O' },
  'OR': { quality: 'poor', bondType: 'C-O' },
  'NH2': { quality: 'poor', bondType: 'C-N' }
};

// Functional group patterns in SMILES
const FUNCTIONAL_GROUPS = {
  alkylHalide: /[A-Z]?[a-z]?(Cl|Br|I|F)(?![a-z])/,
  alcohol: /[A-Z]?[a-z]?O(?![a-z])/,
  ether: /[A-Z]?[a-z]?O[A-Z]?[a-z]?/,
  alkene: /C=C/,
  alkyne: /C#C/,
  carbonyl: /C=O/,
  carboxyl: /C\(=O\)O/,
  amine: /N(?![a-z])/,
  nitrile: /C#N/,
  thiol: /S(?![a-z])/
};

/**
 * Simple SMILES parser to extract molecular features
 */
export function parseSMILES(smiles) {
  if (!smiles || typeof smiles !== 'string') {
    return null;
  }

  const features = {
    carbons: 0,
    hydrogens: 0, // implicit
    halogens: { F: 0, Cl: 0, Br: 0, I: 0 },
    oxygens: 0,
    nitrogens: 0,
    sulfurs: 0,
    doubleBonds: 0,
    tripleBonds: 0,
    rings: 0,
    branches: 0,
    functionalGroups: []
  };

  // Count atoms
  // Carbon count (explicit C and implicit in lowercase)
  features.carbons = (smiles.match(/C(?![l])/g) || []).length +
                     (smiles.match(/c/g) || []).length;

  // Halogens
  features.halogens.F = (smiles.match(/F/g) || []).length;
  features.halogens.Cl = (smiles.match(/Cl/g) || []).length;
  features.halogens.Br = (smiles.match(/Br/g) || []).length;
  features.halogens.I = (smiles.match(/I/g) || []).length;

  // Other heteroatoms
  features.oxygens = (smiles.match(/O/g) || []).length;
  features.nitrogens = (smiles.match(/N/g) || []).length;
  features.sulfurs = (smiles.match(/S/g) || []).length;

  // Bond types
  features.doubleBonds = (smiles.match(/=/g) || []).length;
  features.tripleBonds = (smiles.match(/#/g) || []).length;

  // Rings (numbered atoms)
  const ringNumbers = smiles.match(/\d/g) || [];
  features.rings = Math.floor(ringNumbers.length / 2);

  // Branches
  features.branches = (smiles.match(/\(/g) || []).length;

  // Identify functional groups
  Object.entries(FUNCTIONAL_GROUPS).forEach(([name, pattern]) => {
    if (pattern.test(smiles)) {
      features.functionalGroups.push(name);
    }
  });

  // Determine carbon type (primary, secondary, tertiary)
  features.carbonType = inferCarbonType(smiles);

  return features;
}

/**
 * Infer carbon type from SMILES structure
 */
function inferCarbonType(smiles) {
  // Look for patterns indicating carbon substitution
  // This is a simplified heuristic

  // Tertiary: carbon connected to 3 other carbons
  if (/C\(C\)\(C\)C/.test(smiles) || /CC\(C\)\(C\)/.test(smiles)) {
    return 'tertiary';
  }

  // Secondary: carbon connected to 2 other carbons
  if (/CC\(/.test(smiles) || /C\([^)]+\)C/.test(smiles)) {
    return 'secondary';
  }

  // Methyl: single carbon with leaving group
  if (/^C[A-Z]/.test(smiles) && smiles.length <= 3) {
    return 'methyl';
  }

  // Default to primary
  return 'primary';
}

/**
 * Analyze a reaction from reactant and product SMILES
 */
export function analyzeReaction(reactantSMILES, productSMILES) {
  const reactant = parseSMILES(reactantSMILES);
  const product = parseSMILES(productSMILES);

  if (!reactant || !product) {
    return { error: 'Could not parse SMILES' };
  }

  const analysis = {
    reactant,
    product,
    reactionType: null,
    subType: null,
    bondsFormed: [],
    bondsBroken: [],
    estimatedDeltaH: 0,
    estimatedEa: 0,
    confidence: 'low'
  };

  // Determine reaction type based on changes
  classifyReaction(analysis);

  // Calculate thermodynamics
  calculateThermodynamics(analysis);

  return analysis;
}

/**
 * Classify reaction type based on structural changes
 */
function classifyReaction(analysis) {
  const { reactant, product } = analysis;

  // Check for substitution (halogen replaced by nucleophile)
  const halogenLost = Object.entries(reactant.halogens).some(
    ([hal, count]) => count > product.halogens[hal]
  );

  const oxygenGained = product.oxygens > reactant.oxygens;
  const nitrogenGained = product.nitrogens > reactant.nitrogens;

  // Check for elimination (double bond formed, halogen lost)
  const doubleBondGained = product.doubleBonds > reactant.doubleBonds;

  if (halogenLost && (oxygenGained || nitrogenGained) && !doubleBondGained) {
    // Substitution reaction
    analysis.reactionType = 'substitution';

    // Determine SN1 vs SN2 based on carbon type
    if (reactant.carbonType === 'tertiary') {
      analysis.subType = 'SN1';
      analysis.mechanism = 'sn1';
    } else if (reactant.carbonType === 'methyl' || reactant.carbonType === 'primary') {
      analysis.subType = 'SN2';
      analysis.mechanism = 'sn2';
    } else {
      analysis.subType = 'SN1/SN2';
      analysis.mechanism = 'sn2'; // Default to SN2 for secondary
    }

    // Identify bonds
    const lostHalogen = Object.entries(reactant.halogens).find(
      ([hal, count]) => count > product.halogens[hal]
    );
    if (lostHalogen) {
      analysis.bondsBroken.push(`C-${lostHalogen[0]}`);
    }
    if (oxygenGained) {
      analysis.bondsFormed.push('C-O');
    } else if (nitrogenGained) {
      analysis.bondsFormed.push('C-N');
    }

    analysis.confidence = 'medium';

  } else if (halogenLost && doubleBondGained) {
    // Elimination reaction
    analysis.reactionType = 'elimination';

    // Determine E1 vs E2
    if (reactant.carbonType === 'tertiary') {
      analysis.subType = 'E1';
      analysis.mechanism = 'e1';
    } else {
      analysis.subType = 'E2';
      analysis.mechanism = 'e2';
    }

    const lostHalogen = Object.entries(reactant.halogens).find(
      ([hal, count]) => count > product.halogens[hal]
    );
    if (lostHalogen) {
      analysis.bondsBroken.push(`C-${lostHalogen[0]}`);
    }
    analysis.bondsBroken.push('C-H');
    analysis.bondsFormed.push('C=C');

    analysis.confidence = 'medium';

  } else if (reactant.doubleBonds > product.doubleBonds) {
    // Addition reaction (double bond consumed)
    analysis.reactionType = 'addition';
    analysis.subType = 'addition';
    analysis.mechanism = 'hydrogenation';

    analysis.bondsBroken.push('C=C');
    analysis.bondsFormed.push('C-C');
    analysis.bondsFormed.push('C-H');
    analysis.bondsFormed.push('C-H');

    analysis.confidence = 'medium';

  } else {
    // Unknown reaction type
    analysis.reactionType = 'unknown';
    analysis.mechanism = 'exothermic'; // Default
    analysis.confidence = 'low';
  }
}

/**
 * Calculate estimated thermodynamic parameters
 */
function calculateThermodynamics(analysis) {
  let deltaH = 0;

  // Energy required to break bonds (positive)
  analysis.bondsBroken.forEach(bond => {
    const energy = BOND_ENERGIES[bond] || 80;
    deltaH += energy;
  });

  // Energy released forming bonds (negative)
  analysis.bondsFormed.forEach(bond => {
    const energy = BOND_ENERGIES[bond] || 80;
    deltaH -= energy;
  });

  analysis.estimatedDeltaH = deltaH;

  // Estimate activation energy using Hammond postulate
  // Exothermic reactions have early TS (lower Ea)
  // Endothermic reactions have late TS (higher Ea)
  const baseEa = {
    'sn2': 18,
    'sn1': 22,
    'e2': 20,
    'e1': 22,
    'hydrogenation': 12,
    'exothermic': 15,
    'endothermic': 25
  };

  let ea = baseEa[analysis.mechanism] || 20;

  // Adjust based on ΔH (Hammond postulate)
  if (deltaH < -20) {
    ea -= 3; // Very exothermic, early TS
  } else if (deltaH > 10) {
    ea += 5; // Endothermic, late TS
  }

  analysis.estimatedEa = Math.max(5, ea);
}

/**
 * Generate energy diagram parameters from SMILES analysis
 */
export function getEnergyFromSMILES(reactantSMILES, productSMILES) {
  const analysis = analyzeReaction(reactantSMILES, productSMILES);

  if (analysis.error) {
    return null;
  }

  // Build energy parameters
  const isTwoStep = analysis.mechanism === 'sn1' || analysis.mechanism === 'e1';

  if (isTwoStep) {
    return {
      name: `${analysis.subType} (from SMILES)`,
      steps: 2,
      startE: 0,
      tsE: [analysis.estimatedEa, analysis.estimatedEa * 0.3],
      intermediateE: [analysis.estimatedEa * 0.6],
      productE: analysis.estimatedDeltaH,
      description: `${analysis.reactionType}: ${analysis.bondsBroken.join(', ')} → ${analysis.bondsFormed.join(', ')}`
    };
  } else {
    return {
      name: `${analysis.subType || analysis.reactionType} (from SMILES)`,
      steps: 1,
      startE: 0,
      tsE: [analysis.estimatedEa],
      intermediateE: [],
      productE: analysis.estimatedDeltaH,
      description: `${analysis.reactionType}: ${analysis.bondsBroken.join(', ')} → ${analysis.bondsFormed.join(', ')}`
    };
  }
}

/**
 * Common reaction examples with SMILES
 */
export const REACTION_EXAMPLES = {
  'SN2 - Bromide to Alcohol': {
    reactant: 'CCBr',
    product: 'CCO',
    description: 'Bromoethane + OH⁻ → Ethanol'
  },
  'SN1 - Tertiary Bromide': {
    reactant: 'CC(C)(C)Br',
    product: 'CC(C)(C)O',
    description: '2-Bromo-2-methylpropane → tert-Butanol'
  },
  'E2 - Elimination': {
    reactant: 'CC(Br)C',
    product: 'CC=C',
    description: '2-Bromopropane → Propene'
  },
  'Hydrogenation': {
    reactant: 'CC=CC',
    product: 'CCCC',
    description: '2-Butene + H₂ → Butane'
  }
};
