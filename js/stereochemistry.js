/**
 * Stereochemistry Tracker Module
 *
 * Tracks stereochemistry through reaction sequences and helps understand
 * R/S configurations, SN1/SN2 outcomes, and stereoisomer relationships.
 */

// Stereocenter configuration data
export const STEREOCENTERS = {
  'R': { name: 'R', rotation: 'clockwise', color: '#2563eb' },
  'S': { name: 'S', rotation: 'counterclockwise', color: '#dc2626' }
};

// Preset molecules with stereocenters
export const PRESET_MOLECULES = {
  '2-bromobutane-r': {
    name: '(R)-2-Bromobutane',
    smiles: 'CC[C@@H](Br)C',
    stereocenters: [{ carbon: 2, config: 'R', substituents: ['CH3', 'C2H5', 'Br', 'H'] }],
    hasLeavingGroup: true,
    leavingGroup: 'Br'
  },
  '2-bromobutane-s': {
    name: '(S)-2-Bromobutane',
    smiles: 'CC[C@H](Br)C',
    stereocenters: [{ carbon: 2, config: 'S', substituents: ['CH3', 'C2H5', 'Br', 'H'] }],
    hasLeavingGroup: true,
    leavingGroup: 'Br'
  },
  '2-chlorobutane-r': {
    name: '(R)-2-Chlorobutane',
    smiles: 'CC[C@@H](Cl)C',
    stereocenters: [{ carbon: 2, config: 'R', substituents: ['CH3', 'C2H5', 'Cl', 'H'] }],
    hasLeavingGroup: true,
    leavingGroup: 'Cl'
  },
  'lactic-acid-r': {
    name: '(R)-Lactic Acid',
    smiles: 'C[C@@H](O)C(=O)O',
    stereocenters: [{ carbon: 2, config: 'R', substituents: ['CH3', 'COOH', 'OH', 'H'] }],
    hasLeavingGroup: false
  },
  'lactic-acid-s': {
    name: '(S)-Lactic Acid',
    smiles: 'C[C@H](O)C(=O)O',
    stereocenters: [{ carbon: 2, config: 'S', substituents: ['CH3', 'COOH', 'OH', 'H'] }],
    hasLeavingGroup: false
  },
  'alanine-l': {
    name: 'L-Alanine (S)',
    smiles: 'C[C@H](N)C(=O)O',
    stereocenters: [{ carbon: 2, config: 'S', substituents: ['CH3', 'COOH', 'NH2', 'H'] }],
    hasLeavingGroup: false
  },
  'tartaric-acid-rr': {
    name: '(R,R)-Tartaric Acid',
    smiles: '[C@H](O)(C(=O)O)[C@@H](O)C(=O)O',
    stereocenters: [
      { carbon: 2, config: 'R', substituents: ['COOH', 'H', 'OH', 'C*'] },
      { carbon: 3, config: 'R', substituents: ['COOH', 'H', 'OH', 'C*'] }
    ],
    hasLeavingGroup: false,
    isMeso: false
  },
  'tartaric-acid-meso': {
    name: 'meso-Tartaric Acid',
    smiles: '[C@H](O)(C(=O)O)[C@H](O)C(=O)O',
    stereocenters: [
      { carbon: 2, config: 'R', substituents: ['COOH', 'H', 'OH', 'C*'] },
      { carbon: 3, config: 'S', substituents: ['COOH', 'H', 'OH', 'C*'] }
    ],
    hasLeavingGroup: false,
    isMeso: true
  }
};

// Reaction types and their stereochemical outcomes
export const REACTION_OUTCOMES = {
  'SN1': {
    name: 'SN1',
    outcome: 'racemization',
    description: 'Carbocation intermediate - nucleophile attacks from both faces',
    ratio: { retention: 50, inversion: 50 },
    explanation: [
      'SN1 proceeds through a planar carbocation intermediate',
      'The carbocation is sp² hybridized with trigonal planar geometry',
      'Nucleophile can attack from either face with equal probability',
      'Results in a 50:50 mixture of retained and inverted products',
      'Net result: Racemization (if starting material was optically active)'
    ]
  },
  'SN2': {
    name: 'SN2',
    outcome: 'inversion',
    description: 'Backside attack - Walden inversion',
    ratio: { retention: 0, inversion: 100 },
    explanation: [
      'SN2 is a concerted, one-step mechanism',
      'Nucleophile attacks from the side opposite the leaving group',
      'This "backside attack" leads to complete inversion',
      'Known as Walden inversion',
      'R configuration becomes S, and vice versa'
    ]
  },
  'E2': {
    name: 'E2',
    outcome: 'elimination',
    description: 'Stereocenter may be destroyed',
    explanation: [
      'E2 elimination removes the stereocenter if it bears the leaving group',
      'Results in an alkene product',
      'E/Z geometry depends on which H is eliminated'
    ]
  },
  'E1': {
    name: 'E1',
    outcome: 'elimination',
    description: 'Carbocation intermediate followed by elimination',
    explanation: [
      'E1 proceeds through a carbocation intermediate',
      'Multiple H atoms can be eliminated',
      'Often gives mixture of Zaitsev and Hofmann products'
    ]
  }
};

/**
 * Calculate stereochemical outcome of a reaction
 * @param {string} moleculeKey - Starting material key
 * @param {string} reactionType - Type of reaction (SN1, SN2, E1, E2)
 * @param {string} nucleophile - Nucleophile used
 * @returns {Object} Outcome data
 */
export function calculateStereoOutcome(moleculeKey, reactionType, nucleophile = 'OH-') {
  const molecule = PRESET_MOLECULES[moleculeKey];
  if (!molecule) return null;

  const reaction = REACTION_OUTCOMES[reactionType];
  if (!reaction) return null;

  const startConfig = molecule.stereocenters[0]?.config;

  if (reactionType === 'SN1') {
    return {
      startingMaterial: molecule.name,
      startConfig,
      reaction: 'SN1',
      products: [
        {
          name: `Product with retention (${startConfig})`,
          config: startConfig,
          percentage: 50
        },
        {
          name: `Product with inversion (${startConfig === 'R' ? 'S' : 'R'})`,
          config: startConfig === 'R' ? 'S' : 'R',
          percentage: 50
        }
      ],
      outcome: 'Racemization - 50% retention, 50% inversion',
      explanation: reaction.explanation,
      isOpticallyActive: false
    };
  }

  if (reactionType === 'SN2') {
    const invertedConfig = startConfig === 'R' ? 'S' : 'R';
    return {
      startingMaterial: molecule.name,
      startConfig,
      reaction: 'SN2',
      products: [
        {
          name: `Product with complete inversion (${invertedConfig})`,
          config: invertedConfig,
          percentage: 100
        }
      ],
      outcome: `Complete inversion - ${startConfig} → ${invertedConfig}`,
      explanation: reaction.explanation,
      isOpticallyActive: true
    };
  }

  if (reactionType === 'E2' || reactionType === 'E1') {
    return {
      startingMaterial: molecule.name,
      startConfig,
      reaction: reactionType,
      products: [
        {
          name: 'Alkene (stereocenter destroyed)',
          config: 'N/A',
          percentage: 100
        }
      ],
      outcome: 'Elimination - stereocenter destroyed',
      explanation: reaction.explanation,
      isOpticallyActive: false
    };
  }

  return null;
}

/**
 * Track stereochemistry through a reaction sequence
 * @param {string} startMolecule - Starting molecule key
 * @param {Array} reactions - Array of reaction objects
 * @returns {Object} Sequence outcome
 */
export function trackStereoSequence(startMolecule, reactions) {
  const molecule = PRESET_MOLECULES[startMolecule];
  if (!molecule) return null;

  const sequence = [];
  let currentConfig = molecule.stereocenters[0]?.config;
  let isRacemic = false;
  let isEliminated = false;

  for (const reaction of reactions) {
    if (isEliminated) {
      sequence.push({
        reaction: reaction.type,
        outcome: 'No stereocenter present',
        configBefore: 'N/A',
        configAfter: 'N/A'
      });
      continue;
    }

    if (isRacemic) {
      if (reaction.type === 'SN2') {
        sequence.push({
          reaction: 'SN2',
          outcome: 'Both enantiomers invert - still racemic',
          configBefore: 'Racemic',
          configAfter: 'Racemic'
        });
      } else if (reaction.type === 'SN1') {
        sequence.push({
          reaction: 'SN1',
          outcome: 'Both enantiomers racemize - still racemic',
          configBefore: 'Racemic',
          configAfter: 'Racemic'
        });
      }
      continue;
    }

    const configBefore = currentConfig;

    switch (reaction.type) {
      case 'SN2':
        currentConfig = currentConfig === 'R' ? 'S' : 'R';
        sequence.push({
          reaction: 'SN2',
          outcome: 'Walden inversion',
          configBefore,
          configAfter: currentConfig
        });
        break;
      case 'SN1':
        isRacemic = true;
        sequence.push({
          reaction: 'SN1',
          outcome: 'Racemization',
          configBefore,
          configAfter: 'Racemic (R + S)'
        });
        break;
      case 'E2':
      case 'E1':
        isEliminated = true;
        sequence.push({
          reaction: reaction.type,
          outcome: 'Elimination - stereocenter destroyed',
          configBefore,
          configAfter: 'N/A (alkene)'
        });
        break;
    }
  }

  return {
    startingMaterial: molecule.name,
    initialConfig: molecule.stereocenters[0]?.config,
    sequence,
    finalConfig: isEliminated ? 'N/A' : (isRacemic ? 'Racemic' : currentConfig),
    isOpticallyActive: !isRacemic && !isEliminated
  };
}

/**
 * Determine relationship between two stereoisomers
 * @param {Object} mol1 - First molecule
 * @param {Object} mol2 - Second molecule
 * @returns {Object} Relationship data
 */
export function getStereoisomerRelationship(mol1Key, mol2Key) {
  const mol1 = PRESET_MOLECULES[mol1Key];
  const mol2 = PRESET_MOLECULES[mol2Key];

  if (!mol1 || !mol2) return null;

  // Check if they have same number of stereocenters
  if (mol1.stereocenters.length !== mol2.stereocenters.length) {
    return {
      relationship: 'Not stereoisomers',
      explanation: 'Different number of stereocenters'
    };
  }

  // Check meso compounds
  if (mol1.isMeso || mol2.isMeso) {
    if (mol1.isMeso && mol2.isMeso) {
      return {
        relationship: 'Identical (same meso compound)',
        explanation: 'Both are meso compounds with identical structure'
      };
    }
    return {
      relationship: 'Diastereomers',
      explanation: 'One is meso, one is chiral - not mirror images'
    };
  }

  // Single stereocenter case
  if (mol1.stereocenters.length === 1) {
    if (mol1.stereocenters[0].config === mol2.stereocenters[0].config) {
      return {
        relationship: 'Identical',
        explanation: 'Same configuration at the stereocenter'
      };
    } else {
      return {
        relationship: 'Enantiomers',
        explanation: 'Mirror images - opposite configuration (R vs S)'
      };
    }
  }

  // Multiple stereocenters
  let sameCount = 0;
  let diffCount = 0;

  for (let i = 0; i < mol1.stereocenters.length; i++) {
    if (mol1.stereocenters[i].config === mol2.stereocenters[i].config) {
      sameCount++;
    } else {
      diffCount++;
    }
  }

  if (diffCount === 0) {
    return {
      relationship: 'Identical',
      explanation: 'All stereocenters have same configuration'
    };
  } else if (diffCount === mol1.stereocenters.length) {
    return {
      relationship: 'Enantiomers',
      explanation: 'All stereocenters have opposite configuration - mirror images'
    };
  } else {
    return {
      relationship: 'Diastereomers',
      explanation: `Some stereocenters same, some different - not mirror images (${sameCount} same, ${diffCount} different)`
    };
  }
}

/**
 * Check if a molecule is a meso compound
 * @param {string} moleculeKey - Molecule key
 * @returns {Object} Meso analysis
 */
export function checkMeso(moleculeKey) {
  const molecule = PRESET_MOLECULES[moleculeKey];
  if (!molecule) return null;

  if (molecule.isMeso) {
    return {
      isMeso: true,
      explanation: [
        'This molecule has stereocenters but is achiral',
        'It has an internal plane of symmetry',
        'The two stereocenters are mirror images within the molecule',
        'R and S configurations cancel out',
        'Not optically active despite having stereocenters'
      ]
    };
  }

  if (molecule.stereocenters.length < 2) {
    return {
      isMeso: false,
      explanation: ['Meso compounds require at least 2 stereocenters']
    };
  }

  return {
    isMeso: false,
    explanation: [
      'No internal plane of symmetry',
      'This molecule is chiral and optically active'
    ]
  };
}

/**
 * Generate stereochemistry quiz question
 * @returns {Object} Quiz question data
 */
export function generateStereoQuestion() {
  const questionTypes = [
    'sn2-outcome',
    'sn1-outcome',
    'identify-relationship',
    'meso-identification',
    'inversion-retention'
  ];

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (type) {
    case 'sn2-outcome':
      return generateSN2OutcomeQuestion();
    case 'sn1-outcome':
      return generateSN1OutcomeQuestion();
    case 'identify-relationship':
      return generateRelationshipQuestion();
    case 'meso-identification':
      return generateMesoQuestion();
    case 'inversion-retention':
      return generateInversionQuestion();
    default:
      return generateSN2OutcomeQuestion();
  }
}

function generateSN2OutcomeQuestion() {
  const startConfigs = ['R', 'S'];
  const startConfig = startConfigs[Math.floor(Math.random() * 2)];
  const expectedConfig = startConfig === 'R' ? 'S' : 'R';

  return {
    type: 'sn2-outcome',
    question: `If (${startConfig})-2-bromobutane undergoes an SN2 reaction with NaCN, what is the configuration of the product?`,
    options: [
      { value: 'R', label: '(R) configuration' },
      { value: 'S', label: '(S) configuration' },
      { value: 'racemic', label: 'Racemic mixture' },
      { value: 'unknown', label: 'Cannot be determined' }
    ],
    correctAnswer: expectedConfig,
    explanation: `SN2 reactions proceed with complete inversion (Walden inversion). The (${startConfig}) starting material gives (${expectedConfig}) product.`
  };
}

function generateSN1OutcomeQuestion() {
  const startConfigs = ['R', 'S'];
  const startConfig = startConfigs[Math.floor(Math.random() * 2)];

  return {
    type: 'sn1-outcome',
    question: `If (${startConfig})-2-bromo-2-methylbutane undergoes an SN1 reaction with water, what is the stereochemical outcome?`,
    options: [
      { value: 'R', label: '(R) configuration only' },
      { value: 'S', label: '(S) configuration only' },
      { value: 'racemic', label: 'Racemic mixture (50:50)' },
      { value: 'inversion', label: 'Complete inversion' }
    ],
    correctAnswer: 'racemic',
    explanation: `SN1 reactions proceed through a planar carbocation intermediate. The nucleophile can attack from either face with equal probability, resulting in a racemic mixture.`
  };
}

function generateRelationshipQuestion() {
  const pairs = [
    { mol1: '2-bromobutane-r', mol2: '2-bromobutane-s', answer: 'enantiomers' },
    { mol1: 'tartaric-acid-rr', mol2: 'tartaric-acid-meso', answer: 'diastereomers' },
    { mol1: 'lactic-acid-r', mol2: 'lactic-acid-s', answer: 'enantiomers' }
  ];

  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const mol1 = PRESET_MOLECULES[pair.mol1];
  const mol2 = PRESET_MOLECULES[pair.mol2];

  return {
    type: 'identify-relationship',
    question: `What is the relationship between ${mol1.name} and ${mol2.name}?`,
    options: [
      { value: 'identical', label: 'Identical molecules' },
      { value: 'enantiomers', label: 'Enantiomers' },
      { value: 'diastereomers', label: 'Diastereomers' },
      { value: 'structural', label: 'Structural isomers' }
    ],
    correctAnswer: pair.answer,
    explanation: pair.answer === 'enantiomers'
      ? 'Enantiomers are non-superimposable mirror images with opposite configuration at all stereocenters.'
      : 'Diastereomers are stereoisomers that are NOT mirror images - they have different configurations at some but not all stereocenters.'
  };
}

function generateMesoQuestion() {
  const molecules = [
    { key: 'tartaric-acid-meso', isMeso: true, name: 'meso-Tartaric acid' },
    { key: 'tartaric-acid-rr', isMeso: false, name: '(R,R)-Tartaric acid' },
    { key: 'lactic-acid-r', isMeso: false, name: '(R)-Lactic acid' }
  ];

  const mol = molecules[Math.floor(Math.random() * molecules.length)];

  return {
    type: 'meso-identification',
    question: `Is ${mol.name} a meso compound?`,
    options: [
      { value: 'yes', label: 'Yes, it is a meso compound' },
      { value: 'no', label: 'No, it is not a meso compound' }
    ],
    correctAnswer: mol.isMeso ? 'yes' : 'no',
    explanation: mol.isMeso
      ? 'Meso compounds have stereocenters but are achiral due to an internal plane of symmetry.'
      : 'This molecule is chiral and optically active. It does not have an internal plane of symmetry.'
  };
}

function generateInversionQuestion() {
  const reactions = ['SN1', 'SN2'];
  const reaction = reactions[Math.floor(Math.random() * 2)];

  return {
    type: 'inversion-retention',
    question: `Which statement is true about the stereochemical outcome of ${reaction} reactions?`,
    options: reaction === 'SN2' ? [
      { value: 'complete-inversion', label: 'Complete inversion (Walden inversion)' },
      { value: 'complete-retention', label: 'Complete retention of configuration' },
      { value: 'racemization', label: 'Racemization (50:50 mixture)' },
      { value: 'partial', label: 'Partial inversion' }
    ] : [
      { value: 'complete-inversion', label: 'Complete inversion (Walden inversion)' },
      { value: 'complete-retention', label: 'Complete retention of configuration' },
      { value: 'racemization', label: 'Racemization (50:50 mixture)' },
      { value: 'partial', label: 'Partial inversion with some retention' }
    ],
    correctAnswer: reaction === 'SN2' ? 'complete-inversion' : 'racemization',
    explanation: reaction === 'SN2'
      ? 'SN2 proceeds with backside attack, resulting in complete inversion of configuration (Walden inversion).'
      : 'SN1 proceeds through a planar carbocation. Attack from either face gives racemization.'
  };
}

/**
 * Check answer for stereo quiz
 * @param {any} answer - User's answer
 * @param {Object} question - Question object
 * @returns {Object} Result with isCorrect and explanation
 */
export function checkStereoAnswer(answer, question) {
  const isCorrect = answer === question.correctAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}
