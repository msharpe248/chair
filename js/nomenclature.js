/**
 * IUPAC Nomenclature Module
 *
 * Data and quiz generation for organic compound naming practice.
 */

// Compound database with IUPAC names and common names
export const NOMENCLATURE_DATA = {
  // Alkanes
  alkanes: [
    {
      smiles: 'CC(C)C',
      iupac: '2-methylpropane',
      commonName: 'isobutane',
      class: 'alkane',
      rules: [
        'Longest chain = 3 carbons (propane)',
        'Methyl substituent at C2'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(C)CC',
      iupac: '2-methylbutane',
      commonName: 'isopentane',
      class: 'alkane',
      rules: [
        'Longest chain = 4 carbons (butane)',
        'Methyl substituent at C2',
        'Number from end nearest substituent'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CCC(C)CC',
      iupac: '3-methylpentane',
      class: 'alkane',
      rules: [
        'Longest chain = 5 carbons (pentane)',
        'Methyl at C3 (equidistant from both ends)'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(C)(C)C',
      iupac: '2,2-dimethylpropane',
      commonName: 'neopentane',
      class: 'alkane',
      rules: [
        'Longest chain = 3 carbons (propane)',
        'Two methyl groups at C2',
        'Use "di-" prefix for two identical substituents'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'CC(C)C(C)C',
      iupac: '2,3-dimethylbutane',
      class: 'alkane',
      rules: [
        'Longest chain = 4 carbons (butane)',
        'Methyl groups at C2 and C3'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'CCCC(CC)CC',
      iupac: '3-ethylhexane',
      class: 'alkane',
      rules: [
        'Longest chain = 6 carbons (hexane)',
        'Ethyl substituent at C3'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'CC(C)CC(C)(C)C',
      iupac: '2,2,4-trimethylpentane',
      commonName: 'isooctane',
      class: 'alkane',
      rules: [
        'Longest chain = 5 carbons (pentane)',
        'Two methyls at C2, one at C4',
        'Use "tri-" prefix for three identical substituents'
      ],
      difficulty: 'hard'
    }
  ],

  // Alkenes
  alkenes: [
    {
      smiles: 'C=C',
      iupac: 'ethene',
      commonName: 'ethylene',
      class: 'alkene',
      rules: ['Simplest alkene - 2 carbons with double bond'],
      difficulty: 'easy'
    },
    {
      smiles: 'CC=C',
      iupac: 'propene',
      commonName: 'propylene',
      class: 'alkene',
      rules: [
        'Three carbons with double bond',
        'No number needed (only one position possible)'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC=CC',
      iupac: '2-butene',
      class: 'alkene',
      rules: [
        'Four carbons, double bond at C2',
        'Number indicates position of double bond'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'C/C=C/C',
      iupac: '(E)-2-butene',
      commonName: 'trans-2-butene',
      class: 'alkene',
      stereochem: 'E',
      rules: [
        'E = groups on opposite sides (trans)',
        'Higher priority groups on opposite sides'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'C/C=C\\C',
      iupac: '(Z)-2-butene',
      commonName: 'cis-2-butene',
      class: 'alkene',
      stereochem: 'Z',
      rules: [
        'Z = groups on same side (cis)',
        'Higher priority groups on same side',
        'Z from German "zusammen" (together)'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'CC(C)=CC',
      iupac: '2-methyl-2-butene',
      class: 'alkene',
      rules: [
        'Double bond position takes priority in numbering',
        'Methyl substituent on double bond carbon'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'C=CC=C',
      iupac: '1,3-butadiene',
      class: 'diene',
      rules: [
        'Diene = two double bonds',
        'Conjugated (alternating single-double bonds)'
      ],
      difficulty: 'medium'
    }
  ],

  // Alkyl halides
  alkylHalides: [
    {
      smiles: 'CCBr',
      iupac: 'bromoethane',
      commonName: 'ethyl bromide',
      class: 'alkyl halide',
      rules: [
        'Halogen named as substituent (bromo-)',
        'Listed alphabetically with other substituents'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(Cl)C',
      iupac: '2-chloropropane',
      commonName: 'isopropyl chloride',
      class: 'alkyl halide',
      rules: [
        'Chloro substituent at C2',
        'Numbered to give lowest locant'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(C)(C)Br',
      iupac: '2-bromo-2-methylpropane',
      commonName: 'tert-butyl bromide',
      class: 'alkyl halide',
      rules: [
        'Tertiary alkyl halide',
        'Substituents listed alphabetically (bromo before methyl)'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'ClCCCl',
      iupac: '1,2-dichloroethane',
      commonName: 'ethylene dichloride',
      class: 'alkyl halide',
      rules: [
        'Two chlorine substituents',
        'Use "di-" prefix'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'FC(F)(F)C(F)(F)F',
      iupac: 'hexafluoroethane',
      class: 'alkyl halide',
      rules: [
        'All hydrogens replaced by fluorine',
        'Use "hexa-" prefix for six substituents'
      ],
      difficulty: 'hard'
    }
  ],

  // Alcohols
  alcohols: [
    {
      smiles: 'CO',
      iupac: 'methanol',
      commonName: 'methyl alcohol',
      class: 'alcohol',
      rules: ['Simplest alcohol - OH on one-carbon chain'],
      difficulty: 'easy'
    },
    {
      smiles: 'CCO',
      iupac: 'ethanol',
      commonName: 'ethyl alcohol',
      class: 'alcohol',
      rules: ['Two-carbon alcohol'],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(C)O',
      iupac: 'propan-2-ol',
      commonName: '2-propanol, isopropyl alcohol',
      class: 'alcohol',
      rules: [
        'OH at C2 of propane',
        'Number indicates carbon bearing OH',
        'Modern naming: propan-2-ol'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC(C)(C)O',
      iupac: '2-methylpropan-2-ol',
      commonName: 'tert-butyl alcohol',
      class: 'alcohol',
      rules: [
        'Tertiary alcohol',
        'OH takes priority in numbering'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'OCCO',
      iupac: 'ethane-1,2-diol',
      commonName: 'ethylene glycol',
      class: 'diol',
      rules: [
        'Diol = two OH groups',
        'Both positions indicated'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'OCC(O)CO',
      iupac: 'propane-1,2,3-triol',
      commonName: 'glycerol',
      class: 'triol',
      rules: [
        'Triol = three OH groups',
        'All positions indicated'
      ],
      difficulty: 'medium'
    }
  ],

  // Cyclic compounds
  cyclic: [
    {
      smiles: 'C1CCCCC1',
      iupac: 'cyclohexane',
      class: 'cycloalkane',
      rules: ['Six-membered saturated ring'],
      difficulty: 'easy'
    },
    {
      smiles: 'CC1CCCCC1',
      iupac: 'methylcyclohexane',
      class: 'cycloalkane',
      rules: [
        'Cyclohexane ring with methyl substituent',
        'No number needed for single substituent'
      ],
      difficulty: 'easy'
    },
    {
      smiles: 'CC1CCC(C)CC1',
      iupac: '1,4-dimethylcyclohexane',
      class: 'cycloalkane',
      rules: [
        'Two methyl groups on ring',
        'Number to give lowest locant sum'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'C1=CCCCC1',
      iupac: 'cyclohexene',
      class: 'cycloalkene',
      rules: [
        'Six-membered ring with one double bond',
        'Double bond implied between C1 and C2'
      ],
      difficulty: 'medium'
    },
    {
      smiles: 'c1ccccc1',
      iupac: 'benzene',
      class: 'aromatic',
      rules: ['Parent aromatic compound'],
      difficulty: 'easy'
    },
    {
      smiles: 'Cc1ccccc1',
      iupac: 'methylbenzene',
      commonName: 'toluene',
      class: 'aromatic',
      rules: ['Benzene with methyl substituent'],
      difficulty: 'easy'
    }
  ]
};

// Flatten all compounds for random selection
export function getAllCompounds() {
  const all = [];
  Object.values(NOMENCLATURE_DATA).forEach(category => {
    category.forEach(compound => all.push(compound));
  });
  return all;
}

// Get compounds by difficulty
export function getCompoundsByDifficulty(difficulty) {
  return getAllCompounds().filter(c => c.difficulty === difficulty);
}

// Get compounds by class
export function getCompoundsByClass(compoundClass) {
  return getAllCompounds().filter(c => c.class === compoundClass);
}

// Quiz question generators

/**
 * Generate a "Name this compound" question
 */
export function generateNamingQuestion(difficulty = null) {
  const compounds = difficulty
    ? getCompoundsByDifficulty(difficulty)
    : getAllCompounds();

  const compound = compounds[Math.floor(Math.random() * compounds.length)];

  // Generate wrong answers
  const wrongAnswers = generateWrongNames(compound);

  const options = shuffleArray([compound.iupac, ...wrongAnswers]);

  return {
    type: 'name-compound',
    question: 'What is the IUPAC name of this compound?',
    compound: compound,
    smiles: compound.smiles,
    options: options.map(opt => ({ value: opt, label: opt })),
    correctAnswer: compound.iupac,
    explanation: `The correct name is ${compound.iupac}. ${compound.rules.join(' ')}`
  };
}

/**
 * Generate a "Which structure matches this name?" question
 */
export function generateStructureQuestion(difficulty = null) {
  const compounds = difficulty
    ? getCompoundsByDifficulty(difficulty)
    : getAllCompounds();

  const compound = compounds[Math.floor(Math.random() * compounds.length)];

  // Select wrong structures from same class
  const sameClass = compounds.filter(c =>
    c.class === compound.class && c.iupac !== compound.iupac
  );

  const wrongStructures = shuffleArray(sameClass)
    .slice(0, 3)
    .map(c => c.smiles);

  const options = shuffleArray([compound.smiles, ...wrongStructures]);

  return {
    type: 'structure-from-name',
    question: `Which structure corresponds to "${compound.iupac}"?`,
    targetName: compound.iupac,
    options: options.map(smiles => {
      const match = getAllCompounds().find(c => c.smiles === smiles);
      return { value: smiles, label: match ? match.iupac : smiles };
    }),
    correctAnswer: compound.smiles,
    explanation: `${compound.iupac} has the structure ${compound.smiles}. ${compound.rules[0]}`
  };
}

/**
 * Generate a "What's wrong with this name?" question
 */
export function generateErrorQuestion() {
  const errorScenarios = [
    {
      wrongName: '3-methylbutane',
      correctName: '2-methylbutane',
      structure: 'CC(C)CC',
      error: 'Numbered from wrong end',
      explanation: 'Always number from the end nearest to the substituent. The methyl is at C2, not C3.'
    },
    {
      wrongName: '1,1-dimethylethane',
      correctName: 'propane',
      structure: 'CCC',
      error: 'Unnecessary substituents',
      explanation: 'This is just propane. Methyl groups that are part of the main chain are not named as substituents.'
    },
    {
      wrongName: '2-ethylbutane',
      correctName: '3-methylpentane',
      structure: 'CCC(C)CC',
      error: 'Wrong parent chain',
      explanation: 'The longest chain is 5 carbons (pentane), not 4 carbons with an ethyl substituent.'
    },
    {
      wrongName: '1-methylpropene',
      correctName: '2-butene',
      structure: 'CC=CC',
      error: 'Wrong parent chain',
      explanation: 'The longest chain including the double bond is 4 carbons (butene), not propene.'
    },
    {
      wrongName: '3-butene',
      correctName: '1-butene',
      structure: 'C=CCC',
      error: 'Numbered from wrong end',
      explanation: 'Number the chain to give the double bond the lowest locant (C1, not C3).'
    },
    {
      wrongName: 'methylchloromethane',
      correctName: '1-chloropropane',
      structure: 'CCCCl',
      error: 'Wrong naming approach',
      explanation: 'Name as chloro substituent on propane chain, not as substituted methane.'
    }
  ];

  const scenario = errorScenarios[Math.floor(Math.random() * errorScenarios.length)];

  return {
    type: 'find-error',
    question: `What is wrong with the name "${scenario.wrongName}"?`,
    wrongName: scenario.wrongName,
    smiles: scenario.structure,
    options: [
      { value: 'wrong-end', label: 'Numbered from wrong end' },
      { value: 'wrong-chain', label: 'Wrong parent chain' },
      { value: 'unnecessary', label: 'Unnecessary substituents' },
      { value: 'correct', label: 'Nothing wrong - name is correct' }
    ],
    correctAnswer: scenario.error.toLowerCase().includes('wrong end') ? 'wrong-end' :
                   scenario.error.toLowerCase().includes('chain') ? 'wrong-chain' :
                   scenario.error.toLowerCase().includes('unnecessary') ? 'unnecessary' : 'correct',
    explanation: scenario.explanation,
    correctName: scenario.correctName
  };
}

/**
 * Generate E/Z stereochemistry naming question
 */
export function generateEZQuestion() {
  const ezCompounds = [
    {
      smiles: 'C/C=C/C',
      name: '(E)-2-butene',
      stereochem: 'E',
      explanation: 'E (entgegen): Higher priority groups on opposite sides. The two methyl groups are trans to each other.'
    },
    {
      smiles: 'C/C=C\\C',
      name: '(Z)-2-butene',
      stereochem: 'Z',
      explanation: 'Z (zusammen): Higher priority groups on same side. The two methyl groups are cis to each other.'
    },
    {
      smiles: 'C/C=C/CC',
      name: '(E)-2-pentene',
      stereochem: 'E',
      explanation: 'E: The ethyl and methyl groups (higher priority on each carbon) are on opposite sides.'
    },
    {
      smiles: 'C/C=C\\CC',
      name: '(Z)-2-pentene',
      stereochem: 'Z',
      explanation: 'Z: The ethyl and methyl groups (higher priority on each carbon) are on same side.'
    }
  ];

  const compound = ezCompounds[Math.floor(Math.random() * ezCompounds.length)];

  return {
    type: 'ez-stereochem',
    question: `What is the stereochemistry of this alkene?`,
    smiles: compound.smiles,
    fullName: compound.name,
    options: [
      { value: 'E', label: 'E (trans)' },
      { value: 'Z', label: 'Z (cis)' },
      { value: 'none', label: 'No E/Z designation needed' }
    ],
    correctAnswer: compound.stereochem,
    explanation: compound.explanation
  };
}

/**
 * Main quiz question generator
 */
export function generateNomenclatureQuestion(questionType = null) {
  const types = ['name-compound', 'find-error', 'ez-stereochem'];
  const type = questionType || types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case 'name-compound':
      return generateNamingQuestion();
    case 'structure-from-name':
      return generateStructureQuestion();
    case 'find-error':
      return generateErrorQuestion();
    case 'ez-stereochem':
      return generateEZQuestion();
    default:
      return generateNamingQuestion();
  }
}

/**
 * Check answer for nomenclature quiz
 */
export function checkNomenclatureAnswer(answer, question) {
  const isCorrect = answer === question.correctAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}

// Helper functions

function generateWrongNames(compound) {
  const wrongNames = [];

  // Common naming mistakes
  const mistakes = [
    // Wrong numbering
    name => {
      const match = name.match(/(\d+)-/);
      if (match) {
        const num = parseInt(match[1]);
        return name.replace(match[0], `${num + 1}-`);
      }
      return null;
    },
    // Different prefix
    name => {
      if (name.includes('methyl')) return name.replace('methyl', 'ethyl');
      if (name.includes('ethyl')) return name.replace('ethyl', 'methyl');
      if (name.includes('propyl')) return name.replace('propyl', 'butyl');
      return null;
    },
    // Different parent chain
    name => {
      if (name.includes('butane')) return name.replace('butane', 'pentane');
      if (name.includes('pentane')) return name.replace('pentane', 'hexane');
      if (name.includes('propane')) return name.replace('propane', 'butane');
      if (name.includes('butene')) return name.replace('butene', 'pentene');
      return null;
    }
  ];

  mistakes.forEach(mistake => {
    const wrong = mistake(compound.iupac);
    if (wrong && wrong !== compound.iupac) {
      wrongNames.push(wrong);
    }
  });

  // Add some completely different names from same class
  const sameClass = getAllCompounds().filter(c =>
    c.class === compound.class && c.iupac !== compound.iupac
  );
  const additional = shuffleArray(sameClass).slice(0, 3 - wrongNames.length).map(c => c.iupac);

  return [...wrongNames, ...additional].slice(0, 3);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Naming rules reference
export const NAMING_RULES = {
  alkanes: [
    'Find the longest continuous carbon chain (parent)',
    'Number from the end nearest to the first substituent',
    'Name substituents with locant + prefix (methyl, ethyl, etc.)',
    'List substituents alphabetically',
    'Use di-, tri-, tetra- for multiple identical substituents'
  ],
  alkenes: [
    'Suffix: -ene for double bond',
    'Number to give double bond lowest locant',
    'For E/Z: E = groups on opposite sides, Z = same side',
    'Use Cahn-Ingold-Prelog priority rules for E/Z'
  ],
  alkynes: [
    'Suffix: -yne for triple bond',
    'Number to give triple bond lowest locant'
  ],
  alcohols: [
    'Suffix: -ol for hydroxyl group',
    'OH gets priority in numbering over double bonds',
    'Modern format: propan-2-ol (number before -ol)'
  ],
  alkylHalides: [
    'Halogens named as substituents: fluoro-, chloro-, bromo-, iodo-',
    'Listed alphabetically with other substituents'
  ],
  cyclic: [
    'Prefix: cyclo- before parent name',
    'Number to give lowest locant sum',
    'For one substituent, no number needed'
  ]
};

// Get naming rules for a compound class
export function getNamingRules(compoundClass) {
  return NAMING_RULES[compoundClass] || NAMING_RULES.alkanes;
}
