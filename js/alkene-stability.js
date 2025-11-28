/**
 * Alkene Stability Module
 *
 * Provides data and analysis for alkene stability comparisons,
 * including heats of hydrogenation, substitution patterns, and E/Z stereochemistry.
 */

// Heats of hydrogenation (kcal/mol) - more negative = less stable alkene
// Reference: cyclohexene = -28.6 kcal/mol
export const HYDROGENATION_DATA = {
  // Ethene family
  'ethene': {
    deltaH: -32.8,
    name: 'Ethene',
    formula: 'CH₂=CH₂',
    substitution: 'unsubstituted',
    substituents: 0
  },
  'propene': {
    deltaH: -30.1,
    name: 'Propene',
    formula: 'CH₃CH=CH₂',
    substitution: 'monosubstituted',
    substituents: 1
  },

  // Butene isomers
  '1-butene': {
    deltaH: -30.3,
    name: '1-Butene',
    formula: 'CH₃CH₂CH=CH₂',
    substitution: 'monosubstituted',
    substituents: 1
  },
  'cis-2-butene': {
    deltaH: -28.6,
    name: 'cis-2-Butene',
    formula: 'CH₃CH=CHCH₃ (Z)',
    substitution: 'disubstituted',
    substituents: 2,
    stereochemistry: 'Z'
  },
  'trans-2-butene': {
    deltaH: -27.6,
    name: 'trans-2-Butene',
    formula: 'CH₃CH=CHCH₃ (E)',
    substitution: 'disubstituted',
    substituents: 2,
    stereochemistry: 'E'
  },
  'isobutylene': {
    deltaH: -28.4,
    name: 'Isobutylene',
    formula: '(CH₃)₂C=CH₂',
    substitution: 'disubstituted',
    substituents: 2
  },

  // Pentene isomers
  '1-pentene': {
    deltaH: -30.1,
    name: '1-Pentene',
    formula: 'CH₃CH₂CH₂CH=CH₂',
    substitution: 'monosubstituted',
    substituents: 1
  },
  'cis-2-pentene': {
    deltaH: -28.6,
    name: 'cis-2-Pentene',
    formula: 'CH₃CH=CHCH₂CH₃ (Z)',
    substitution: 'disubstituted',
    substituents: 2,
    stereochemistry: 'Z'
  },
  'trans-2-pentene': {
    deltaH: -27.6,
    name: 'trans-2-Pentene',
    formula: 'CH₃CH=CHCH₂CH₃ (E)',
    substitution: 'disubstituted',
    substituents: 2,
    stereochemistry: 'E'
  },
  '2-methyl-1-butene': {
    deltaH: -28.5,
    name: '2-Methyl-1-butene',
    formula: 'CH₂=C(CH₃)CH₂CH₃',
    substitution: 'disubstituted',
    substituents: 2
  },
  '2-methyl-2-butene': {
    deltaH: -26.9,
    name: '2-Methyl-2-butene',
    formula: '(CH₃)₂C=CHCH₃',
    substitution: 'trisubstituted',
    substituents: 3
  },
  '3-methyl-1-butene': {
    deltaH: -30.3,
    name: '3-Methyl-1-butene',
    formula: '(CH₃)₂CHCH=CH₂',
    substitution: 'monosubstituted',
    substituents: 1
  },

  // Highly substituted
  '2,3-dimethyl-2-butene': {
    deltaH: -26.6,
    name: '2,3-Dimethyl-2-butene',
    formula: '(CH₃)₂C=C(CH₃)₂',
    substitution: 'tetrasubstituted',
    substituents: 4
  },

  // Cyclic alkenes
  'cyclohexene': {
    deltaH: -28.6,
    name: 'Cyclohexene',
    formula: 'cyclo-C₆H₁₀',
    substitution: 'disubstituted (cyclic)',
    substituents: 2,
    cyclic: true
  },
  'cyclopentene': {
    deltaH: -26.9,
    name: 'Cyclopentene',
    formula: 'cyclo-C₅H₈',
    substitution: 'disubstituted (cyclic)',
    substituents: 2,
    cyclic: true
  },
  '1-methylcyclohexene': {
    deltaH: -26.0,
    name: '1-Methylcyclohexene',
    formula: '1-Me-cyclohexene',
    substitution: 'trisubstituted',
    substituents: 3,
    cyclic: true
  }
};

// Preset comparison sets
export const COMPARISON_SETS = {
  'butene-isomers': {
    name: 'Butene Isomers',
    description: 'Compare all C₄H₈ alkene isomers',
    alkenes: ['1-butene', 'cis-2-butene', 'trans-2-butene', 'isobutylene']
  },
  'substitution-effect': {
    name: 'Substitution Effect',
    description: 'Effect of increasing alkyl substitution',
    alkenes: ['ethene', 'propene', '2-methyl-2-butene', '2,3-dimethyl-2-butene']
  },
  'cis-trans': {
    name: 'Cis vs Trans (E/Z)',
    description: 'Compare cis and trans isomers',
    alkenes: ['cis-2-butene', 'trans-2-butene', 'cis-2-pentene', 'trans-2-pentene']
  },
  'pentene-isomers': {
    name: 'Pentene Isomers',
    description: 'Compare C₅H₁₀ pentene isomers',
    alkenes: ['1-pentene', 'cis-2-pentene', 'trans-2-pentene', '2-methyl-2-butene', '3-methyl-1-butene']
  },
  'cyclic': {
    name: 'Cyclic Alkenes',
    description: 'Compare cyclic alkenes',
    alkenes: ['cyclopentene', 'cyclohexene', '1-methylcyclohexene']
  }
};

/**
 * Get stability ranking for a set of alkenes
 * @param {string[]} alkeneKeys - Array of alkene keys
 * @returns {Object[]} Sorted array from most stable to least stable
 */
export function getStabilityRanking(alkeneKeys) {
  const alkenes = alkeneKeys
    .filter(key => HYDROGENATION_DATA[key])
    .map(key => ({
      key,
      ...HYDROGENATION_DATA[key]
    }));

  // Sort by deltaH ascending (less negative = more stable)
  return alkenes.sort((a, b) => a.deltaH - b.deltaH);
}

/**
 * Get relative stability explanation
 * @param {string} alkeneKey - Alkene identifier
 * @returns {string[]} Array of explanation points
 */
export function getStabilityExplanation(alkeneKey) {
  const alkene = HYDROGENATION_DATA[alkeneKey];
  if (!alkene) return [];

  const explanations = [];

  // Substitution explanation
  switch (alkene.substitution) {
    case 'unsubstituted':
      explanations.push('Unsubstituted alkene - no stabilizing hyperconjugation');
      break;
    case 'monosubstituted':
      explanations.push('Monosubstituted - one alkyl group provides some hyperconjugation');
      break;
    case 'disubstituted':
      explanations.push('Disubstituted - two alkyl groups provide moderate hyperconjugation');
      break;
    case 'trisubstituted':
      explanations.push('Trisubstituted - three alkyl groups provide significant hyperconjugation');
      explanations.push('More substituted = more stable');
      break;
    case 'tetrasubstituted':
      explanations.push('Tetrasubstituted - maximum alkyl substitution');
      explanations.push('Most stable type of alkene due to extensive hyperconjugation');
      break;
  }

  // E/Z explanation
  if (alkene.stereochemistry === 'E') {
    explanations.push('E (trans) isomer - larger groups on opposite sides');
    explanations.push('Less steric strain than Z isomer');
  } else if (alkene.stereochemistry === 'Z') {
    explanations.push('Z (cis) isomer - larger groups on same side');
    explanations.push('Steric strain between groups destabilizes the alkene');
  }

  // Cyclic explanation
  if (alkene.cyclic) {
    explanations.push('Cyclic alkene - ring constraints affect stability');
  }

  return explanations;
}

/**
 * Calculate stability difference between two alkenes
 * @param {string} alkene1 - First alkene key
 * @param {string} alkene2 - Second alkene key
 * @returns {Object} Comparison data
 */
export function compareAlkenes(alkene1, alkene2) {
  const a1 = HYDROGENATION_DATA[alkene1];
  const a2 = HYDROGENATION_DATA[alkene2];

  if (!a1 || !a2) return null;

  const diff = a1.deltaH - a2.deltaH;

  return {
    alkene1: { key: alkene1, ...a1 },
    alkene2: { key: alkene2, ...a2 },
    difference: Math.abs(diff),
    moreStable: diff < 0 ? alkene1 : alkene2,
    lessStable: diff < 0 ? alkene2 : alkene1,
    explanation: diff < 0
      ? `${a1.name} is ${Math.abs(diff).toFixed(1)} kcal/mol more stable than ${a2.name}`
      : `${a2.name} is ${Math.abs(diff).toFixed(1)} kcal/mol more stable than ${a1.name}`
  };
}

/**
 * Parse alkene SMILES and analyze stability
 * @param {string} smiles - SMILES string for an alkene
 * @returns {Object} Alkene analysis data
 */
export function parseAlkeneSMILES(smiles) {
  if (!smiles || typeof smiles !== 'string') {
    return { error: 'Please enter a valid SMILES string' };
  }

  // Clean up the SMILES
  const cleanSmiles = smiles.trim();

  // Check for double bond
  if (!cleanSmiles.includes('=')) {
    return { error: 'No double bond found. Please enter an alkene (contains C=C)' };
  }

  try {
    // Parse the SMILES to find double bond and substituents
    const analysis = analyzeAlkeneSMILES(cleanSmiles);

    if (analysis.error) {
      return analysis;
    }

    // Estimate heat of hydrogenation based on substitution pattern
    const deltaH = estimateHeatOfHydrogenation(analysis);

    // Determine substitution pattern name
    const substitutionNames = {
      0: 'unsubstituted',
      1: 'monosubstituted',
      2: 'disubstituted',
      3: 'trisubstituted',
      4: 'tetrasubstituted'
    };

    return {
      smiles: cleanSmiles,
      name: generateAlkeneName(analysis),
      formula: cleanSmiles,
      substitution: substitutionNames[analysis.totalSubstituents] || 'unknown',
      substituents: analysis.totalSubstituents,
      deltaH: deltaH,
      stereochemistry: analysis.stereochemistry,
      c1Substituents: analysis.c1Substituents,
      c2Substituents: analysis.c2Substituents,
      explanation: getSubstitutionExplanation(analysis)
    };
  } catch (e) {
    return { error: 'Could not parse SMILES: ' + e.message };
  }
}

/**
 * Analyze alkene SMILES structure
 */
function analyzeAlkeneSMILES(smiles) {
  // Find the double bond position
  const doubleBondIndex = smiles.indexOf('=');

  // Count substituents on each carbon of the double bond
  // This is a simplified parser - works for common cases

  let c1Substituents = 0;  // Carbon before =
  let c2Substituents = 0;  // Carbon after =
  let stereochemistry = null;

  // Check for E/Z stereochemistry markers
  if (smiles.includes('/') || smiles.includes('\\')) {
    // Simplified E/Z detection based on marker positions
    const beforeDouble = smiles.substring(0, doubleBondIndex);
    const afterDouble = smiles.substring(doubleBondIndex + 1);

    // Count slashes to determine configuration
    const slashBefore = (beforeDouble.match(/[/\\]/g) || []).length;
    const slashAfter = (afterDouble.match(/[/\\]/g) || []).length;

    if (slashBefore > 0 || slashAfter > 0) {
      // Check pattern: /C=C/ or /C=C\ etc.
      if ((beforeDouble.includes('/') && afterDouble.includes('/')) ||
          (beforeDouble.includes('\\') && afterDouble.includes('\\'))) {
        stereochemistry = 'E';
      } else if ((beforeDouble.includes('/') && afterDouble.includes('\\')) ||
                 (beforeDouble.includes('\\') && afterDouble.includes('/'))) {
        stereochemistry = 'Z';
      }
    }
  }

  // Parse to count substituents
  // Look at what's connected to each carbon of the double bond

  // Get the part before the double bond
  const beforePart = smiles.substring(0, doubleBondIndex);
  // Get the part after the double bond
  const afterPart = smiles.substring(doubleBondIndex + 1);

  // Count substituents before the first carbon of C=C
  c1Substituents = countSubstituents(beforePart, 'before');

  // Count substituents after the second carbon of C=C
  c2Substituents = countSubstituents(afterPart, 'after');

  const totalSubstituents = c1Substituents + c2Substituents;

  return {
    c1Substituents,
    c2Substituents,
    totalSubstituents,
    stereochemistry
  };
}

/**
 * Count substituents connected to a carbon
 */
function countSubstituents(part, position) {
  if (!part || part.length === 0) return 0;

  // Remove stereochemistry markers for counting
  const cleanPart = part.replace(/[/\\]/g, '');

  let count = 0;

  // Count carbon chains and branches
  // Look for: C, c (aromatic), parentheses (branches)

  if (position === 'before') {
    // For the part before C=C, count what's attached
    // Each C before the double bond carbon is a substituent
    const carbons = (cleanPart.match(/C/gi) || []).length;
    if (carbons > 0) count++;

    // Check for branches (parentheses indicate branching)
    const branches = (cleanPart.match(/\(/g) || []).length;
    count += branches;
  } else {
    // For the part after C=C
    // The first C after = is part of the double bond
    // Everything after that first C is on C2

    // Find where the first carbon's substituents end
    let inBranch = 0;
    let passedFirstCarbon = false;
    let afterFirstCarbon = '';

    for (let i = 0; i < cleanPart.length; i++) {
      const char = cleanPart[i];
      if (char === '(') inBranch++;
      else if (char === ')') inBranch--;
      else if ((char === 'C' || char === 'c') && !passedFirstCarbon && inBranch === 0) {
        passedFirstCarbon = true;
        afterFirstCarbon = cleanPart.substring(i + 1);
        break;
      }
    }

    // Count what's attached to the second carbon (after =C)
    // Check if there's anything on the =C itself (in parentheses right after =)
    if (cleanPart.startsWith('C(') || cleanPart.startsWith('c(')) {
      // There's a branch on the =C carbon
      count++;
    }

    // Check for continuation after the =C carbon
    if (afterFirstCarbon.length > 0) {
      count++;
    }

    // Check for additional branches
    const branchesInFirst = (cleanPart.substring(0, cleanPart.indexOf('C') + 1).match(/\(/g) || []).length;
    count += branchesInFirst;
  }

  return Math.min(count, 2); // Max 2 substituents per carbon
}

/**
 * Estimate heat of hydrogenation based on substitution
 */
function estimateHeatOfHydrogenation(analysis) {
  // Base values (approximate, kcal/mol)
  // Unsubstituted: ~-32.8 (ethene)
  // Each substituent adds ~1-1.5 kcal/mol stability

  const baseHeat = -32.8;
  const stabilizationPerSubstituent = 1.3;

  let deltaH = baseHeat + (analysis.totalSubstituents * stabilizationPerSubstituent);

  // E isomers are more stable than Z by ~1 kcal/mol
  if (analysis.stereochemistry === 'E') {
    deltaH += 0.5;
  } else if (analysis.stereochemistry === 'Z') {
    deltaH -= 0.5;
  }

  return Math.round(deltaH * 10) / 10;
}

/**
 * Generate a name for the analyzed alkene
 */
function generateAlkeneName(analysis) {
  const subNames = {
    0: 'Unsubstituted alkene',
    1: 'Monosubstituted alkene',
    2: 'Disubstituted alkene',
    3: 'Trisubstituted alkene',
    4: 'Tetrasubstituted alkene'
  };

  let name = subNames[analysis.totalSubstituents] || 'Alkene';

  if (analysis.stereochemistry) {
    name += ` (${analysis.stereochemistry})`;
  }

  return name;
}

/**
 * Get explanation for substitution pattern
 */
function getSubstitutionExplanation(analysis) {
  const explanations = [];

  explanations.push(`${analysis.totalSubstituents} substituent(s) on the double bond`);
  explanations.push(`C1 has ${analysis.c1Substituents} alkyl group(s), C2 has ${analysis.c2Substituents} alkyl group(s)`);

  if (analysis.totalSubstituents >= 2) {
    explanations.push('Multiple substituents provide hyperconjugation stabilization');
  }

  if (analysis.stereochemistry === 'E') {
    explanations.push('E (trans) isomer: substituents on opposite sides - less steric strain');
  } else if (analysis.stereochemistry === 'Z') {
    explanations.push('Z (cis) isomer: substituents on same side - more steric strain');
  }

  return explanations;
}

/**
 * Generate quiz question about alkene stability
 * @returns {Object} Quiz question data
 */
export function generateAlkeneQuestion() {
  const questionTypes = [
    'rank-stability',
    'most-stable',
    'least-stable',
    'heat-comparison',
    'substitution-pattern'
  ];

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (type) {
    case 'rank-stability':
      return generateRankingQuestion();
    case 'most-stable':
      return generateMostStableQuestion();
    case 'least-stable':
      return generateLeastStableQuestion();
    case 'heat-comparison':
      return generateHeatComparisonQuestion();
    case 'substitution-pattern':
      return generateSubstitutionQuestion();
    default:
      return generateMostStableQuestion();
  }
}

function generateRankingQuestion() {
  // Pick a comparison set
  const sets = Object.keys(COMPARISON_SETS);
  const setKey = sets[Math.floor(Math.random() * sets.length)];
  const set = COMPARISON_SETS[setKey];

  // Get 3-4 alkenes from the set
  const alkeneKeys = set.alkenes.slice(0, 4);
  const ranking = getStabilityRanking(alkeneKeys);

  return {
    type: 'ranking',
    question: `Rank these alkenes from MOST to LEAST stable:`,
    alkenes: alkeneKeys.map(k => HYDROGENATION_DATA[k].name),
    correctOrder: ranking.map(a => a.name),
    explanation: `Order based on heats of hydrogenation: ${ranking.map(a => `${a.name} (${a.deltaH})`).join(' > ')}`
  };
}

function generateMostStableQuestion() {
  const sets = Object.values(COMPARISON_SETS);
  const set = sets[Math.floor(Math.random() * sets.length)];
  const alkeneKeys = set.alkenes.slice(0, 4);
  const ranking = getStabilityRanking(alkeneKeys);

  // Shuffle options
  const options = [...alkeneKeys]
    .map(k => ({ key: k, ...HYDROGENATION_DATA[k] }))
    .sort(() => Math.random() - 0.5);

  return {
    type: 'most-stable',
    question: 'Which alkene is MOST stable?',
    options: options.map(a => ({
      value: a.key,
      label: a.name
    })),
    correctAnswer: ranking[0].key,
    explanation: `${ranking[0].name} (ΔH = ${ranking[0].deltaH} kcal/mol) has the least negative heat of hydrogenation, indicating it is most stable.`,
    alkenes: alkeneKeys
  };
}

function generateLeastStableQuestion() {
  const sets = Object.values(COMPARISON_SETS);
  const set = sets[Math.floor(Math.random() * sets.length)];
  const alkeneKeys = set.alkenes.slice(0, 4);
  const ranking = getStabilityRanking(alkeneKeys);

  const options = [...alkeneKeys]
    .map(k => ({ key: k, ...HYDROGENATION_DATA[k] }))
    .sort(() => Math.random() - 0.5);

  const leastStable = ranking[ranking.length - 1];

  return {
    type: 'least-stable',
    question: 'Which alkene is LEAST stable?',
    options: options.map(a => ({
      value: a.key,
      label: a.name
    })),
    correctAnswer: leastStable.key,
    explanation: `${leastStable.name} (ΔH = ${leastStable.deltaH} kcal/mol) has the most negative heat of hydrogenation, indicating it is least stable.`,
    alkenes: alkeneKeys
  };
}

function generateHeatComparisonQuestion() {
  const allKeys = Object.keys(HYDROGENATION_DATA);
  const key1 = allKeys[Math.floor(Math.random() * allKeys.length)];
  let key2 = allKeys[Math.floor(Math.random() * allKeys.length)];
  while (key2 === key1) {
    key2 = allKeys[Math.floor(Math.random() * allKeys.length)];
  }

  const a1 = HYDROGENATION_DATA[key1];
  const a2 = HYDROGENATION_DATA[key2];
  const moreNegative = a1.deltaH < a2.deltaH ? key1 : key2;

  return {
    type: 'heat-comparison',
    question: `Which alkene has a MORE NEGATIVE heat of hydrogenation?`,
    options: [
      { value: key1, label: a1.name },
      { value: key2, label: a2.name }
    ],
    correctAnswer: moreNegative,
    explanation: `${HYDROGENATION_DATA[moreNegative].name} (ΔH = ${HYDROGENATION_DATA[moreNegative].deltaH}) has more negative ΔH, meaning it is LESS stable.`,
    alkenes: [key1, key2]
  };
}

function generateSubstitutionQuestion() {
  const allKeys = Object.keys(HYDROGENATION_DATA);
  const key = allKeys[Math.floor(Math.random() * allKeys.length)];
  const alkene = HYDROGENATION_DATA[key];

  const options = [
    { value: 'unsubstituted', label: 'Unsubstituted' },
    { value: 'monosubstituted', label: 'Monosubstituted' },
    { value: 'disubstituted', label: 'Disubstituted' },
    { value: 'trisubstituted', label: 'Trisubstituted' },
    { value: 'tetrasubstituted', label: 'Tetrasubstituted' }
  ];

  // Clean up the answer for matching
  const correctAnswer = alkene.substitution.replace(' (cyclic)', '');

  return {
    type: 'substitution-pattern',
    question: `What is the substitution pattern of ${alkene.name} (${alkene.formula})?`,
    options: options,
    correctAnswer: correctAnswer,
    explanation: `${alkene.name} is ${alkene.substitution} with ${alkene.substituents} alkyl substituent(s) on the double bond.`,
    alkenes: [key]
  };
}

/**
 * Check answer for alkene quiz
 * @param {any} answer - User's answer
 * @param {Object} question - Question object
 * @returns {Object} Result with isCorrect and explanation
 */
export function checkAlkeneAnswer(answer, question) {
  const isCorrect = answer === question.correctAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}
