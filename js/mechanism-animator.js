/**
 * Mechanism Animator Module
 *
 * Provides step-by-step animated curved-arrow mechanisms
 * for common organic reactions (SN1, SN2, E1, E2, additions).
 */

// Mechanism data for common reactions
export const MECHANISMS = {
  'sn2': {
    name: 'SN2 - Nucleophilic Substitution (Bimolecular)',
    description: 'Concerted, one-step mechanism with backside attack',
    type: 'substitution',
    steps: [
      {
        title: 'Backside Attack',
        description: 'Nucleophile attacks carbon 180° from leaving group',
        structures: {
          substrate: { carbon: 'C', groups: ['R₁', 'R₂', 'H'], leavingGroup: 'Br' },
          nucleophile: 'OH⁻'
        },
        arrows: [
          { from: 'nucleophile', to: 'carbon', type: 'full', label: 'Attack' },
          { from: 'carbon-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        notes: [
          'Single concerted step',
          'Bond making and breaking simultaneous',
          'Transition state is pentacoordinate'
        ]
      }
    ],
    products: ['Alcohol (inverted)', 'Br⁻'],
    keyPoints: [
      'Rate = k[substrate][nucleophile]',
      'Complete inversion of configuration',
      'Favored by: strong nucleophile, primary substrate, polar aprotic solvent'
    ]
  },

  'sn1': {
    name: 'SN1 - Nucleophilic Substitution (Unimolecular)',
    description: 'Two-step mechanism via carbocation intermediate',
    type: 'substitution',
    steps: [
      {
        title: 'Step 1: Ionization',
        description: 'Leaving group departs to form carbocation',
        structures: {
          substrate: { carbon: 'C', groups: ['R₁', 'R₂', 'R₃'], leavingGroup: 'Br' }
        },
        arrows: [
          { from: 'carbon-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        intermediate: { type: 'carbocation', geometry: 'planar sp²' },
        notes: [
          'Rate-determining step',
          'Carbocation is sp² hybridized',
          'Planar geometry'
        ]
      },
      {
        title: 'Step 2: Nucleophilic Attack',
        description: 'Nucleophile attacks planar carbocation from either face',
        structures: {
          carbocation: { carbon: 'C⁺', groups: ['R₁', 'R₂', 'R₃'], geometry: 'planar' },
          nucleophile: 'OH₂'
        },
        arrows: [
          { from: 'nucleophile', to: 'carbocation', type: 'full', label: 'Attack (either face)' }
        ],
        notes: [
          '50% attack from top',
          '50% attack from bottom',
          'Results in racemization'
        ]
      }
    ],
    products: ['Alcohol (racemic mixture)', 'Br⁻'],
    keyPoints: [
      'Rate = k[substrate] (first order)',
      'Racemization at stereocenter',
      'Favored by: tertiary substrate, weak nucleophile, polar protic solvent'
    ]
  },

  'e2': {
    name: 'E2 - Elimination (Bimolecular)',
    description: 'Concerted elimination requiring anti-periplanar geometry',
    type: 'elimination',
    steps: [
      {
        title: 'Anti-Periplanar Elimination',
        description: 'Base abstracts β-hydrogen while leaving group departs',
        structures: {
          substrate: { carbon: 'Cα', beta: 'Cβ', groups: ['R₁', 'R₂'], leavingGroup: 'Br', betaH: 'H' },
          base: 'OH⁻'
        },
        arrows: [
          { from: 'base', to: 'beta-h', type: 'full', label: 'Base abstracts H' },
          { from: 'beta-h', to: 'c-c', type: 'full', label: 'π bond forms' },
          { from: 'c-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        notes: [
          'H and LG must be anti-periplanar (180°)',
          'All bonds break/form simultaneously',
          'E2 competes with SN2'
        ]
      }
    ],
    products: ['Alkene', 'H₂O', 'Br⁻'],
    keyPoints: [
      'Rate = k[substrate][base]',
      'Anti-periplanar geometry required',
      'Zaitsev product usually favored',
      'Favored by: strong base, heat, bulky base for Hofmann'
    ]
  },

  'e1': {
    name: 'E1 - Elimination (Unimolecular)',
    description: 'Two-step elimination via carbocation intermediate',
    type: 'elimination',
    steps: [
      {
        title: 'Step 1: Ionization',
        description: 'Leaving group departs to form carbocation',
        structures: {
          substrate: { carbon: 'C', groups: ['R₁', 'R₂', 'R₃'], leavingGroup: 'Br' }
        },
        arrows: [
          { from: 'carbon-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        intermediate: { type: 'carbocation', geometry: 'planar sp²' },
        notes: [
          'Same as SN1 first step',
          'Rate-determining step'
        ]
      },
      {
        title: 'Step 2: Deprotonation',
        description: 'Base removes β-hydrogen to form alkene',
        structures: {
          carbocation: { carbon: 'C⁺', beta: 'Cβ', betaH: 'H' },
          base: 'H₂O'
        },
        arrows: [
          { from: 'base', to: 'beta-h', type: 'full', label: 'Base takes H' },
          { from: 'beta-h', to: 'c-c', type: 'full', label: 'π bond forms' }
        ],
        notes: [
          'Usually gives Zaitsev product',
          'Often competes with SN1',
          'Can also give rearranged products'
        ]
      }
    ],
    products: ['Alkene', 'H₃O⁺', 'Br⁻'],
    keyPoints: [
      'Rate = k[substrate]',
      'No anti-periplanar requirement',
      'Carbocation rearrangements possible',
      'Favored by: tertiary substrate, high temperature, weak base'
    ]
  },

  'addition-hbr': {
    name: 'HBr Addition to Alkene',
    description: 'Electrophilic addition following Markovnikov\'s rule',
    type: 'addition',
    steps: [
      {
        title: 'Step 1: Protonation',
        description: 'π electrons attack H⁺, forming more stable carbocation',
        structures: {
          alkene: { c1: 'C', c2: 'C', groups: ['R', 'H', 'H', 'H'] },
          electrophile: 'HBr'
        },
        arrows: [
          { from: 'pi-bond', to: 'h-plus', type: 'full', label: 'π attacks H⁺' }
        ],
        intermediate: { type: 'carbocation', note: 'More substituted = more stable' },
        notes: [
          'π bond acts as nucleophile',
          'H⁺ adds to less substituted carbon',
          'More stable carbocation forms (Markovnikov)'
        ]
      },
      {
        title: 'Step 2: Nucleophilic Attack',
        description: 'Bromide attacks carbocation',
        structures: {
          carbocation: { carbon: 'C⁺', groups: ['R', 'H', 'CH₃'] },
          nucleophile: 'Br⁻'
        },
        arrows: [
          { from: 'nucleophile', to: 'carbocation', type: 'full', label: 'Br⁻ attacks C⁺' }
        ],
        notes: [
          'Br adds to more substituted carbon',
          'Markovnikov product formed'
        ]
      }
    ],
    products: ['Alkyl bromide (Markovnikov)'],
    keyPoints: [
      'Markovnikov\'s rule: H to C with more H\'s',
      'Regioselectivity from carbocation stability',
      'Can have rearrangements if carbocation can migrate'
    ]
  },

  'addition-h2o': {
    name: 'Acid-Catalyzed Hydration',
    description: 'Addition of water to alkene via carbocation',
    type: 'addition',
    steps: [
      {
        title: 'Step 1: Protonation',
        description: 'π electrons attack H⁺ from acid catalyst',
        structures: {
          alkene: { c1: 'C', c2: 'C', doubleBond: true },
          electrophile: 'H₃O⁺'
        },
        arrows: [
          { from: 'pi-bond', to: 'h-plus', type: 'full', label: 'π attacks H⁺' }
        ],
        intermediate: { type: 'carbocation' },
        notes: [
          'Forms more stable carbocation',
          'Markovnikov regioselectivity'
        ]
      },
      {
        title: 'Step 2: Water Attack',
        description: 'Water attacks carbocation',
        structures: {
          carbocation: { carbon: 'C⁺' },
          nucleophile: 'H₂O'
        },
        arrows: [
          { from: 'water', to: 'carbocation', type: 'full', label: 'H₂O attacks' }
        ],
        intermediate: { type: 'oxonium' },
        notes: ['Forms protonated alcohol (oxonium ion)']
      },
      {
        title: 'Step 3: Deprotonation',
        description: 'Water removes proton to give alcohol',
        structures: {
          oxonium: { oxygen: 'O⁺H₂' },
          base: 'H₂O'
        },
        arrows: [
          { from: 'water', to: 'oxonium-h', type: 'full', label: 'H₂O takes H⁺' }
        ],
        notes: ['Regenerates acid catalyst', 'Markovnikov alcohol formed']
      }
    ],
    products: ['Alcohol (Markovnikov)', 'H₃O⁺ regenerated'],
    keyPoints: [
      'Net addition of H-OH across double bond',
      'Follows Markovnikov\'s rule',
      'Acid is catalyst (regenerated)',
      'Mechanism is reverse of E1'
    ]
  },

  'addition-br2': {
    name: 'Bromination of Alkene',
    description: 'Anti addition of Br₂ via bromonium ion',
    type: 'addition',
    steps: [
      {
        title: 'Step 1: Bromonium Ion Formation',
        description: 'π electrons attack Br₂, forming cyclic bromonium ion',
        structures: {
          alkene: { c1: 'C', c2: 'C', doubleBond: true },
          electrophile: 'Br-Br'
        },
        arrows: [
          { from: 'pi-bond', to: 'br-br', type: 'full', label: 'π attacks Br' },
          { from: 'br-br', to: 'br-minus', type: 'full', label: 'Br⁻ leaves' }
        ],
        intermediate: { type: 'bromonium', note: 'Three-membered ring' },
        notes: [
          'Cyclic bromonium ion formed',
          'Br bridges both carbons',
          'Prevents rotation'
        ]
      },
      {
        title: 'Step 2: Nucleophilic Attack',
        description: 'Br⁻ attacks from opposite face (anti attack)',
        structures: {
          bromonium: { ring: 'cyclic' },
          nucleophile: 'Br⁻'
        },
        arrows: [
          { from: 'br-minus', to: 'carbon', type: 'full', label: 'Anti attack' }
        ],
        notes: [
          'Must attack from opposite face',
          'Results in anti addition',
          'Trans product from cis alkene'
        ]
      }
    ],
    products: ['Vicinal dibromide (anti addition)'],
    keyPoints: [
      'Anti stereochemistry (trans addition)',
      'Bromonium ion prevents syn addition',
      'Works with Cl₂ similarly',
      'Used as test for unsaturation'
    ]
  },

  // ===== CARBOCATION REARRANGEMENTS =====

  'rearrangement-hydride': {
    name: '1,2-Hydride Shift',
    description: 'Carbocation rearrangement via hydride migration',
    type: 'rearrangement',
    steps: [
      {
        title: 'Step 1: Carbocation Formation',
        description: 'Leaving group departs, forming initial carbocation',
        structures: {
          substrate: { carbon: 'C', groups: ['H', 'R', 'CH(CH₃)₂'], leavingGroup: 'Br' }
        },
        arrows: [
          { from: 'carbon-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        intermediate: { type: 'carbocation', stability: '2°' },
        notes: [
          'Secondary carbocation forms',
          'Adjacent carbon has H and more substituents'
        ]
      },
      {
        title: 'Step 2: 1,2-Hydride Shift',
        description: 'Hydride migrates with its bonding electrons to adjacent carbocation',
        structures: {
          carbocation: { carbon: 'C⁺', adjacent: 'C-H' }
        },
        arrows: [
          { from: 'c-h', to: 'carbocation', type: 'full', label: 'H⁻ migrates' }
        ],
        intermediate: { type: 'carbocation', stability: '3°' },
        notes: [
          'H moves WITH its electrons',
          '2° → 3° carbocation',
          'More stable carbocation forms'
        ]
      },
      {
        title: 'Step 3: Product Formation',
        description: 'Nucleophile attacks rearranged carbocation',
        structures: {
          carbocation: { carbon: 'C⁺', position: 'rearranged' },
          nucleophile: 'Nu⁻'
        },
        arrows: [
          { from: 'nucleophile', to: 'carbocation', type: 'full', label: 'Nu attacks' }
        ],
        notes: [
          'Product has different connectivity',
          'Substitution at different carbon than expected'
        ]
      }
    ],
    products: ['Rearranged product'],
    keyPoints: [
      'Occurs when more stable carbocation can form',
      'Hydride (H:⁻) migrates with bonding electrons',
      '2° → 3° is favorable (~15 kcal/mol)',
      '1° → 2° or 1° → 3° also favorable'
    ]
  },

  'rearrangement-methyl': {
    name: '1,2-Methyl Shift',
    description: 'Carbocation rearrangement via methyl migration',
    type: 'rearrangement',
    steps: [
      {
        title: 'Step 1: Carbocation Formation',
        description: 'Leaving group departs, forming initial carbocation',
        structures: {
          substrate: { carbon: 'C', groups: ['H', 'H', 'C(CH₃)₃'], leavingGroup: 'Br' }
        },
        arrows: [
          { from: 'carbon-lg', to: 'leavingGroup', type: 'full', label: 'LG leaves' }
        ],
        intermediate: { type: 'carbocation', stability: '1°' },
        notes: [
          'Primary carbocation forms (very unstable)',
          'Adjacent quaternary carbon has methyl groups'
        ]
      },
      {
        title: 'Step 2: 1,2-Methyl Shift',
        description: 'Methyl group migrates with its bonding electrons',
        structures: {
          carbocation: { carbon: 'C⁺', adjacent: 'C-CH₃' }
        },
        arrows: [
          { from: 'c-ch3', to: 'carbocation', type: 'full', label: 'CH₃⁻ migrates' }
        ],
        intermediate: { type: 'carbocation', stability: '3°' },
        notes: [
          'Methyl moves WITH its electrons',
          '1° → 3° carbocation!',
          'Huge stability gain'
        ]
      },
      {
        title: 'Step 3: Product Formation',
        description: 'Nucleophile attacks rearranged carbocation',
        structures: {
          carbocation: { carbon: 'C⁺', position: 'rearranged' },
          nucleophile: 'Nu⁻'
        },
        arrows: [
          { from: 'nucleophile', to: 'carbocation', type: 'full', label: 'Nu attacks' }
        ],
        notes: [
          'Product skeleton is rearranged',
          'Classic example: neopentyl → t-amyl'
        ]
      }
    ],
    products: ['Rearranged product'],
    keyPoints: [
      'Occurs when adjacent carbon has alkyl groups',
      'Methyl (CH₃:⁻) migrates with bonding electrons',
      'Especially important for neopentyl systems',
      '1° → 3° rearrangement is very favorable'
    ]
  },

  // ===== ANTI-MARKOVNIKOV ADDITIONS =====

  'addition-hbr-peroxide': {
    name: 'HBr + Peroxides (Radical Addition)',
    description: 'Anti-Markovnikov addition via radical mechanism',
    type: 'addition',
    regiochemistry: 'anti-markovnikov',
    steps: [
      {
        title: 'Initiation: Radical Formation',
        description: 'Peroxide breaks homolytically, abstracts H from HBr',
        structures: {
          peroxide: { formula: 'RO-OR' },
          hbr: { formula: 'H-Br' }
        },
        arrows: [
          { from: 'o-o', to: 'radicals', type: 'fishhook', label: 'Homolysis' },
          { from: 'ro-radical', to: 'h-br', type: 'fishhook', label: 'H abstraction' }
        ],
        intermediate: { type: 'radical', species: 'Br•' },
        notes: [
          'ROOR → 2 RO• (homolytic cleavage)',
          'RO• + HBr → ROH + Br•',
          'Br radical is the active species'
        ]
      },
      {
        title: 'Propagation 1: Br• Addition',
        description: 'Br radical adds to LESS substituted carbon',
        structures: {
          alkene: { c1: 'C', c2: 'C', doubleBond: true },
          radical: 'Br•'
        },
        arrows: [
          { from: 'br-radical', to: 'less-sub-c', type: 'fishhook', label: 'Br• adds' }
        ],
        intermediate: { type: 'carbon radical', stability: 'more stable' },
        notes: [
          'Br• adds to less substituted C',
          'MORE stable carbon radical forms',
          'This is OPPOSITE of ionic mechanism!'
        ]
      },
      {
        title: 'Propagation 2: H Abstraction',
        description: 'Carbon radical abstracts H from HBr',
        structures: {
          carbonRadical: { carbon: 'C•', groups: ['Br', 'R'] },
          hbr: 'H-Br'
        },
        arrows: [
          { from: 'c-radical', to: 'h-br', type: 'fishhook', label: 'H abstraction' }
        ],
        notes: [
          'Product formed + new Br•',
          'Chain continues',
          'Net: anti-Markovnikov addition'
        ]
      }
    ],
    products: ['Anti-Markovnikov alkyl bromide'],
    keyPoints: [
      'ONLY works with HBr (not HCl or HI)',
      'Peroxides required (ROOR)',
      'Radical mechanism reverses regiochemistry',
      'Br adds to LESS substituted carbon'
    ]
  },

  'addition-hydroboration': {
    name: 'Hydroboration-Oxidation',
    description: 'Anti-Markovnikov syn addition of H-OH',
    type: 'addition',
    regiochemistry: 'anti-markovnikov',
    stereochemistry: 'syn',
    steps: [
      {
        title: 'Step 1: Hydroboration',
        description: 'Concerted syn addition of B-H across double bond',
        structures: {
          alkene: { c1: 'C', c2: 'C', doubleBond: true },
          borane: 'BH₃'
        },
        arrows: [
          { from: 'pi-bond', to: 'b', type: 'full', label: 'π → B' },
          { from: 'b-h', to: 'c', type: 'full', label: 'H → C' }
        ],
        intermediate: { type: 'alkylborane' },
        notes: [
          'Concerted 4-membered transition state',
          'B adds to LESS substituted C',
          'H adds to MORE substituted C',
          'SYN addition (same face)'
        ]
      },
      {
        title: 'Step 2: Oxidation',
        description: 'Boron replaced by OH with retention of configuration',
        structures: {
          alkylborane: { carbon: 'C-B' },
          oxidizer: 'H₂O₂, NaOH'
        },
        arrows: [
          { from: 'hoo-minus', to: 'b', type: 'full', label: 'HOO⁻ attacks B' },
          { from: 'c-b', to: 'c-o', type: 'full', label: 'Migration' }
        ],
        notes: [
          'B replaced by OH',
          'Retention of configuration',
          'Net result: H-OH added syn, anti-Markovnikov'
        ]
      }
    ],
    products: ['Anti-Markovnikov alcohol (syn addition)'],
    keyPoints: [
      'Net addition of H-OH',
      'Anti-Markovnikov: OH on LESS substituted C',
      'Syn stereochemistry (both add same face)',
      'Complementary to acid-catalyzed hydration'
    ]
  },

  'addition-halohydrin': {
    name: 'Halohydrin Formation',
    description: 'Addition of Br₂/H₂O giving bromohydrin',
    type: 'addition',
    steps: [
      {
        title: 'Step 1: Bromonium Ion Formation',
        description: 'Same as bromination - cyclic bromonium ion forms',
        structures: {
          alkene: { c1: 'C', c2: 'C', doubleBond: true },
          electrophile: 'Br₂'
        },
        arrows: [
          { from: 'pi-bond', to: 'br-br', type: 'full', label: 'π attacks Br' }
        ],
        intermediate: { type: 'bromonium', note: 'Three-membered ring' },
        notes: [
          'Bromonium ion forms as usual',
          'But now H₂O is the nucleophile'
        ]
      },
      {
        title: 'Step 2: Water Attack',
        description: 'Water attacks more substituted carbon (Markovnikov-like)',
        structures: {
          bromonium: { ring: 'cyclic' },
          nucleophile: 'H₂O'
        },
        arrows: [
          { from: 'water', to: 'more-sub-c', type: 'full', label: 'H₂O attacks' }
        ],
        notes: [
          'Water attacks MORE substituted C',
          'More δ⁺ character at more substituted C',
          'Anti addition (opposite face)'
        ]
      },
      {
        title: 'Step 3: Deprotonation',
        description: 'Loss of proton gives bromohydrin',
        arrows: [
          { from: 'base', to: 'oxonium-h', type: 'full', label: 'Deprotonation' }
        ],
        notes: [
          'Product: bromohydrin',
          'Br and OH are anti and on adjacent carbons'
        ]
      }
    ],
    products: ['Bromohydrin (anti addition)'],
    keyPoints: [
      'Br₂ in H₂O (or NBS/H₂O)',
      'OH goes to MORE substituted C',
      'Br goes to LESS substituted C',
      'Anti stereochemistry'
    ]
  }
};

// Preset reaction conditions and their likely mechanisms
export const REACTION_CONDITIONS = {
  'strong-nuc-primary': {
    conditions: 'Strong nucleophile + primary substrate + polar aprotic',
    mechanism: 'sn2',
    examples: ['NaCN in DMSO', 'NaI in acetone']
  },
  'weak-nuc-tertiary': {
    conditions: 'Weak nucleophile + tertiary substrate + polar protic',
    mechanism: 'sn1',
    examples: ['H₂O, heat', 'ROH, heat']
  },
  'strong-base-heat': {
    conditions: 'Strong base + heat',
    mechanism: 'e2',
    examples: ['NaOH/heat', 'KOtBu']
  },
  'weak-base-tertiary-heat': {
    conditions: 'Weak base + tertiary substrate + heat',
    mechanism: 'e1',
    examples: ['H₂O, heat', 'ROH, heat']
  }
};

/**
 * Get mechanism by ID
 * @param {string} id - Mechanism ID
 * @returns {Object} Mechanism data
 */
export function getMechanism(id) {
  return MECHANISMS[id] || null;
}

/**
 * Get all mechanism IDs by type
 * @param {string} type - Mechanism type (substitution, elimination, addition)
 * @returns {Array} List of mechanism IDs
 */
export function getMechanismsByType(type) {
  return Object.entries(MECHANISMS)
    .filter(([_, mech]) => mech.type === type)
    .map(([id, _]) => id);
}

/**
 * Get step data for animation
 * @param {string} mechanismId - Mechanism ID
 * @param {number} stepIndex - Step index
 * @returns {Object} Step data for rendering
 */
export function getStepData(mechanismId, stepIndex) {
  const mechanism = MECHANISMS[mechanismId];
  if (!mechanism) return null;

  const step = mechanism.steps[stepIndex];
  if (!step) return null;

  return {
    ...step,
    mechanismName: mechanism.name,
    totalSteps: mechanism.steps.length,
    currentStep: stepIndex + 1,
    isLastStep: stepIndex === mechanism.steps.length - 1,
    products: stepIndex === mechanism.steps.length - 1 ? mechanism.products : null
  };
}

/**
 * Generate mechanism quiz question
 * @returns {Object} Quiz question data
 */
export function generateMechanismQuestion() {
  const questionTypes = [
    'identify-mechanism',
    'predict-product',
    'identify-intermediate',
    'mechanism-step',
    'stereochemistry',
    'rearrangement',
    'addition-regiochem'
  ];

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (type) {
    case 'identify-mechanism':
      return generateIdentifyMechanismQuestion();
    case 'predict-product':
      return generatePredictProductQuestion();
    case 'identify-intermediate':
      return generateIntermediateQuestion();
    case 'mechanism-step':
      return generateStepQuestion();
    case 'stereochemistry':
      return generateStereoQuestion();
    case 'rearrangement':
      return generateRearrangementQuestion();
    case 'addition-regiochem':
      return generateAdditionRegiochemQuestion();
    default:
      return generateIdentifyMechanismQuestion();
  }
}

function generateIdentifyMechanismQuestion() {
  const scenarios = [
    {
      question: 'A primary alkyl bromide reacts with NaCN in DMSO. What mechanism?',
      answer: 'sn2',
      options: ['sn1', 'sn2', 'e1', 'e2'],
      explanation: 'Strong nucleophile (CN⁻) + primary substrate + polar aprotic solvent = SN2'
    },
    {
      question: 'A tertiary alkyl chloride reacts with water at high temperature. What mechanism(s)?',
      answer: 'sn1-e1',
      options: ['sn2', 'sn1-e1', 'e2', 'sn1'],
      explanation: 'Tertiary substrate + weak nucleophile/base + heat = SN1 and E1 compete'
    },
    {
      question: 'A secondary alkyl bromide reacts with KOtBu (strong bulky base). What mechanism?',
      answer: 'e2',
      options: ['sn1', 'sn2', 'e1', 'e2'],
      explanation: 'Strong bulky base favors E2 elimination over SN2'
    },
    {
      question: 'A secondary alkyl iodide reacts with NaN₃ in DMF. What mechanism?',
      answer: 'sn2',
      options: ['sn1', 'sn2', 'e1', 'e2'],
      explanation: 'Good nucleophile (N₃⁻) + polar aprotic solvent favors SN2'
    }
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  return {
    type: 'identify-mechanism',
    question: scenario.question,
    options: scenario.options.map(opt => ({
      value: opt,
      label: opt.toUpperCase().replace('-', ' + ')
    })),
    correctAnswer: scenario.answer,
    explanation: scenario.explanation
  };
}

function generatePredictProductQuestion() {
  const reactions = [
    {
      question: 'What is the major product when propene reacts with HBr?',
      answer: '2-bromopropane',
      options: ['1-bromopropane', '2-bromopropane', 'propane', '1,2-dibromopropane'],
      explanation: 'HBr adds via Markovnikov\'s rule: H to less substituted C, Br to more substituted C'
    },
    {
      question: 'What is the stereochemical outcome when (R)-2-bromobutane undergoes SN2 with OH⁻?',
      answer: '(S)-2-butanol',
      options: ['(R)-2-butanol', '(S)-2-butanol', 'Racemic 2-butanol', '1-butanol'],
      explanation: 'SN2 proceeds with complete inversion of configuration (Walden inversion)'
    },
    {
      question: 'What product forms when cyclohexene reacts with Br₂?',
      answer: 'trans-1,2-dibromocyclohexane',
      options: ['cis-1,2-dibromocyclohexane', 'trans-1,2-dibromocyclohexane', 'bromocyclohexane', 'cyclohexane'],
      explanation: 'Bromination proceeds via bromonium ion with anti addition, giving trans product'
    }
  ];

  const reaction = reactions[Math.floor(Math.random() * reactions.length)];

  return {
    type: 'predict-product',
    question: reaction.question,
    options: reaction.options.map(opt => ({ value: opt, label: opt })),
    correctAnswer: reaction.answer,
    explanation: reaction.explanation
  };
}

function generateIntermediateQuestion() {
  const questions = [
    {
      question: 'What intermediate is formed in an SN1 reaction?',
      answer: 'carbocation',
      options: ['carbocation', 'carbanion', 'radical', 'no intermediate'],
      explanation: 'SN1 proceeds via a planar carbocation intermediate (sp² hybridized)'
    },
    {
      question: 'What intermediate is formed during bromination of an alkene?',
      answer: 'bromonium',
      options: ['carbocation', 'bromonium ion', 'radical', 'carbanion'],
      explanation: 'A cyclic bromonium ion forms, which controls the anti stereochemistry'
    },
    {
      question: 'What is the geometry of a carbocation intermediate?',
      answer: 'planar',
      options: ['tetrahedral', 'planar', 'pyramidal', 'linear'],
      explanation: 'Carbocations are sp² hybridized with trigonal planar geometry'
    }
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  return {
    type: 'identify-intermediate',
    question: q.question,
    options: q.options.map(opt => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) })),
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}

function generateStepQuestion() {
  const questions = [
    {
      question: 'In an SN2 reaction, how many steps are there?',
      answer: '1',
      options: ['1', '2', '3', '4'],
      explanation: 'SN2 is concerted - bond making and breaking happen in a single step'
    },
    {
      question: 'What is the rate-determining step in SN1?',
      answer: 'ionization',
      options: ['nucleophilic attack', 'ionization', 'deprotonation', 'protonation'],
      explanation: 'The slow step is departure of the leaving group (ionization)'
    },
    {
      question: 'In E2, which bonds break and form simultaneously?',
      answer: 'all three',
      options: ['C-H and C-LG', 'Only C-LG', 'Only C-H', 'C-H, C-LG, and C=C forms'],
      explanation: 'E2 is concerted: C-H breaks, C-LG breaks, and C=C forms all at once'
    }
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  return {
    type: 'mechanism-step',
    question: q.question,
    options: q.options.map(opt => ({ value: opt, label: opt })),
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}

function generateStereoQuestion() {
  const questions = [
    {
      question: 'What is the stereochemical outcome of an SN2 reaction?',
      answer: 'inversion',
      options: ['retention', 'inversion', 'racemization', 'random'],
      explanation: 'SN2 proceeds with complete inversion (Walden inversion) due to backside attack'
    },
    {
      question: 'What is the stereochemical outcome of an SN1 reaction?',
      answer: 'racemization',
      options: ['retention', 'inversion', 'racemization', 'elimination'],
      explanation: 'The planar carbocation is attacked equally from both faces, giving racemization'
    },
    {
      question: 'What type of addition occurs in Br₂ addition to alkenes?',
      answer: 'anti',
      options: ['syn', 'anti', 'random', 'no preference'],
      explanation: 'The bromonium ion forces anti addition (from opposite faces)'
    }
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  return {
    type: 'stereochemistry',
    question: q.question,
    options: q.options.map(opt => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) })),
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}

function generateRearrangementQuestion() {
  const questions = [
    {
      question: 'Will neopentyl bromide ((CH₃)₃CCH₂Br) undergo rearrangement under SN1 conditions?',
      answer: 'yes',
      options: ['yes', 'no'],
      explanation: 'Yes! The initial 1° carbocation is very unstable. A 1,2-methyl shift gives a much more stable 3° carbocation.'
    },
    {
      question: 'What type of shift occurs when 2-bromo-3-methylbutane undergoes SN1?',
      answer: 'hydride',
      options: ['hydride shift', 'methyl shift', 'no shift', 'alkyl shift'],
      explanation: '1,2-Hydride shift: H migrates from C3 to C2, converting 2° carbocation to more stable 3° carbocation.'
    },
    {
      question: 'A 2° carbocation is adjacent to a quaternary carbon. What type of rearrangement occurs?',
      answer: 'methyl',
      options: ['hydride shift', 'methyl shift', 'no shift', 'both possible'],
      explanation: 'Methyl shift: No H available on the quaternary carbon, so a methyl group migrates to give a 3° carbocation.'
    },
    {
      question: 'Why do carbocation rearrangements occur?',
      answer: 'stability',
      options: ['To form more stable carbocation', 'To form less stable carbocation', 'Random process', 'Temperature dependent'],
      explanation: 'Rearrangements occur to form more stable carbocations. 3° > 2° > 1° in stability due to hyperconjugation and inductive effects.'
    },
    {
      question: 'A tertiary alkyl bromide undergoes SN1. Will it rearrange?',
      answer: 'no',
      options: ['yes', 'no', 'maybe', 'always'],
      explanation: 'No rearrangement. The 3° carbocation is already the most stable possible; there\'s no driving force for rearrangement.'
    },
    {
      question: 'In a 1,2-hydride shift, what happens to the migrating hydrogen?',
      answer: 'moves with electrons',
      options: ['Moves with both electrons', 'Moves as H⁺', 'Moves as H•', 'Leaves the molecule'],
      explanation: 'The H moves with its bonding electrons (as H:⁻) to the adjacent carbocation center.'
    },
    {
      question: 'Which substrate would most likely undergo rearrangement in SN1?',
      answer: 'neopentyl',
      options: ['tert-butyl bromide', 'neopentyl bromide', '2-bromobutane', 'bromocyclohexane'],
      explanation: 'Neopentyl bromide: Forms 1° carbocation initially, which readily rearranges via methyl shift to 3° carbocation.'
    },
    {
      question: 'What is the driving force for carbocation rearrangement?',
      answer: 'thermodynamics',
      options: ['Kinetics only', 'Thermodynamics - stability', 'Entropy', 'Solvent effects'],
      explanation: 'Thermodynamics: The more substituted carbocation is lower in energy, making rearrangement favorable.'
    }
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  return {
    type: 'rearrangement',
    question: q.question,
    options: q.options.map(opt => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) })),
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}

function generateAdditionRegiochemQuestion() {
  const questions = [
    {
      question: 'What is the major product when propene reacts with HBr (no peroxides)?',
      answer: '2-bromopropane',
      options: ['1-bromopropane', '2-bromopropane', 'mixture', 'no reaction'],
      explanation: 'Markovnikov addition: H adds to the less substituted carbon (C1), Br adds to the more substituted carbon (C2).'
    },
    {
      question: 'What is the major product when propene reacts with HBr + ROOR (peroxides)?',
      answer: '1-bromopropane',
      options: ['1-bromopropane', '2-bromopropane', 'mixture', 'no reaction'],
      explanation: 'Anti-Markovnikov (radical mechanism): Br• adds to less substituted carbon first, giving 1-bromopropane.'
    },
    {
      question: 'Why does HBr + peroxides give anti-Markovnikov addition?',
      answer: 'radical stability',
      options: ['Carbocation stability', 'Radical stability', 'Steric effects', 'Polar effects'],
      explanation: 'Radical mechanism: Br• adds to form the MORE stable carbon radical (on the more substituted carbon), then H is abstracted.'
    },
    {
      question: 'What reagents give anti-Markovnikov hydration of alkenes?',
      answer: 'hydroboration',
      options: ['H₂O/H⁺', 'BH₃ then H₂O₂/NaOH', 'HBr', 'Br₂/H₂O'],
      explanation: 'Hydroboration-oxidation: BH₃ adds with B going to less substituted C, then oxidation replaces B with OH.'
    },
    {
      question: 'What is the stereochemistry of hydroboration-oxidation?',
      answer: 'syn',
      options: ['syn', 'anti', 'mixture', 'inversion'],
      explanation: 'Syn addition: Both B and H add to the same face in the concerted hydroboration step. Oxidation proceeds with retention.'
    },
    {
      question: 'In Markovnikov addition of HX to alkenes, where does H+ add?',
      answer: 'less substituted',
      options: ['More substituted carbon', 'Less substituted carbon', 'Random', 'Terminal carbon only'],
      explanation: 'H⁺ adds to the less substituted carbon, generating the more stable (more substituted) carbocation.'
    },
    {
      question: 'What is the intermediate in HBr addition to alkenes (no peroxides)?',
      answer: 'carbocation',
      options: ['Carbocation', 'Radical', 'Carbanion', 'Bromonium ion'],
      explanation: 'Carbocation intermediate: H⁺ adds first to form the more stable carbocation, then Br⁻ attacks.'
    },
    {
      question: 'What product forms when 1-butene reacts with H₂O/H⁺?',
      answer: '2-butanol',
      options: ['1-butanol', '2-butanol', 'butanal', 'no reaction'],
      explanation: 'Markovnikov hydration: H₂O adds across the double bond with OH on the more substituted carbon.'
    },
    {
      question: 'What is the regiochemistry of Br₂/H₂O (halohydrin formation)?',
      answer: 'OH more substituted',
      options: ['OH on more substituted C', 'OH on less substituted C', 'Random', 'No selectivity'],
      explanation: 'Markovnikov-like: Water attacks the more substituted carbon of the bromonium ion (more δ⁺ character).'
    },
    {
      question: 'Which statement about Markovnikov\'s rule is correct?',
      answer: 'carbocation stability',
      options: ['H goes to C with more H\'s', 'Based on carbocation stability', 'Only applies to HBr', 'Random preference'],
      explanation: 'Markovnikov\'s rule reflects carbocation stability: the reaction proceeds through the more stable carbocation intermediate.'
    }
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  return {
    type: 'addition-regiochem',
    question: q.question,
    options: q.options.map(opt => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) })),
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}

/**
 * Check answer for mechanism quiz
 * @param {any} answer - User's answer
 * @param {Object} question - Question object
 * @returns {Object} Result with isCorrect and explanation
 */
export function checkMechanismAnswer(answer, question) {
  const isCorrect = answer === question.correctAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}

/**
 * Get list of all available mechanisms for UI
 * @returns {Array} List of mechanisms with id and name
 */
export function getMechanismList() {
  return Object.entries(MECHANISMS).map(([id, mech]) => ({
    id,
    name: mech.name,
    type: mech.type
  }));
}
