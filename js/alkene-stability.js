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
