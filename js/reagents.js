/**
 * Reagent Identification Database
 * Common organic chemistry reagents organized by reaction type
 */

export const REAGENT_DATA = {
  // Oxidation reagents
  oxidation: [
    {
      name: 'KMnO₄ (potassium permanganate)',
      formula: 'KMnO4',
      category: 'oxidation',
      reactions: ['alkene cleavage', 'alcohol oxidation', 'aromatic side chain oxidation'],
      conditions: 'cold, dilute for syn-dihydroxylation; hot, concentrated for cleavage',
      products: 'diols (cold); carboxylic acids/ketones (hot)',
      color: 'purple → brown (MnO₂)',
      difficulty: 2
    },
    {
      name: 'OsO₄ (osmium tetroxide)',
      formula: 'OsO4',
      category: 'oxidation',
      reactions: ['syn-dihydroxylation'],
      conditions: 'catalytic with NMO (N-methylmorpholine N-oxide) or stoichiometric',
      products: '1,2-diols (cis)',
      color: 'pale yellow',
      notes: 'Very toxic; syn addition across alkene',
      difficulty: 2
    },
    {
      name: 'PCC (pyridinium chlorochromate)',
      formula: 'C5H5NHCrO3Cl',
      category: 'oxidation',
      reactions: ['alcohol oxidation'],
      conditions: 'CH₂Cl₂, anhydrous',
      products: 'primary alcohol → aldehyde (stops); secondary → ketone',
      notes: 'Mild oxidizer, won\'t over-oxidize to carboxylic acid',
      difficulty: 2
    },
    {
      name: 'PDC (pyridinium dichromate)',
      formula: '(C5H5NH)2Cr2O7',
      category: 'oxidation',
      reactions: ['alcohol oxidation'],
      conditions: 'CH₂Cl₂ or DMF',
      products: 'primary alcohol → aldehyde; secondary → ketone',
      notes: 'Similar to PCC but milder',
      difficulty: 3
    },
    {
      name: 'Jones Reagent (CrO₃/H₂SO₄)',
      formula: 'CrO3/H2SO4/H2O',
      category: 'oxidation',
      reactions: ['alcohol oxidation'],
      conditions: 'acetone, aqueous',
      products: 'primary alcohol → carboxylic acid; secondary → ketone',
      notes: 'Strong oxidizer; orange → green color change',
      difficulty: 2
    },
    {
      name: 'Swern Oxidation (DMSO/oxalyl chloride)',
      formula: '(COCl)2/DMSO/Et3N',
      category: 'oxidation',
      reactions: ['alcohol oxidation'],
      conditions: '-78°C, then warm',
      products: 'alcohol → aldehyde or ketone',
      notes: 'Very mild; good for sensitive substrates',
      difficulty: 3
    },
    {
      name: 'MCPBA (m-chloroperoxybenzoic acid)',
      formula: 'm-ClC6H4CO3H',
      category: 'oxidation',
      reactions: ['epoxidation', 'Baeyer-Villiger oxidation'],
      conditions: 'CH₂Cl₂, room temp',
      products: 'alkene → epoxide; ketone → ester',
      notes: 'Stereospecific syn-addition',
      difficulty: 2
    },
    {
      name: 'Ozone (O₃)',
      formula: 'O3',
      category: 'oxidation',
      reactions: ['ozonolysis'],
      conditions: '-78°C, then reductive (Zn/DMS) or oxidative (H₂O₂) workup',
      products: 'alkene → aldehydes/ketones (reductive) or carboxylic acids (oxidative)',
      notes: 'Cleaves C=C double bond',
      difficulty: 2
    }
  ],

  // Reduction reagents
  reduction: [
    {
      name: 'LiAlH₄ (lithium aluminum hydride)',
      formula: 'LiAlH4',
      category: 'reduction',
      reactions: ['carbonyl reduction', 'carboxylic acid reduction', 'ester reduction', 'amide reduction'],
      conditions: 'dry ether or THF; then H₂O workup',
      products: 'aldehydes/ketones → alcohols; RCOOH → RCH₂OH; esters → 2 alcohols; amides → amines',
      notes: 'Strong reducing agent; reacts violently with water',
      difficulty: 1
    },
    {
      name: 'NaBH₄ (sodium borohydride)',
      formula: 'NaBH4',
      category: 'reduction',
      reactions: ['carbonyl reduction'],
      conditions: 'MeOH or EtOH',
      products: 'aldehydes/ketones → alcohols',
      notes: 'Mild reducer; won\'t reduce esters or carboxylic acids',
      difficulty: 1
    },
    {
      name: 'DIBAL-H (diisobutylaluminum hydride)',
      formula: '(i-Bu)2AlH',
      category: 'reduction',
      reactions: ['ester reduction', 'nitrile reduction'],
      conditions: '-78°C, toluene or hexane',
      products: 'ester → aldehyde (at -78°C); nitrile → aldehyde',
      notes: 'Partial reduction when cold',
      difficulty: 3
    },
    {
      name: 'H₂/Pd (catalytic hydrogenation)',
      formula: 'H2/Pd/C',
      category: 'reduction',
      reactions: ['alkene hydrogenation', 'alkyne hydrogenation', 'nitro reduction'],
      conditions: 'Pd/C catalyst, H₂ atmosphere',
      products: 'alkene → alkane (syn); alkyne → alkene (Lindlar) or alkane',
      notes: 'Syn addition; can use Pd, Pt, or Ni',
      difficulty: 1
    },
    {
      name: 'Lindlar\'s Catalyst (Pd/CaCO₃/Pb)',
      formula: 'Pd/CaCO3/Pb(OAc)2',
      category: 'reduction',
      reactions: ['alkyne partial reduction'],
      conditions: 'H₂ atmosphere',
      products: 'alkyne → cis-alkene',
      notes: 'Poisoned catalyst stops at alkene',
      difficulty: 2
    },
    {
      name: 'Na/NH₃ (Birch reduction)',
      formula: 'Na/NH3(l)',
      category: 'reduction',
      reactions: ['alkyne reduction', 'aromatic reduction'],
      conditions: 'liquid ammonia, -33°C',
      products: 'alkyne → trans-alkene; benzene → 1,4-cyclohexadiene',
      notes: 'Dissolving metal reduction; anti addition',
      difficulty: 2
    },
    {
      name: 'Zn/HCl (Clemmensen reduction)',
      formula: 'Zn(Hg)/HCl',
      category: 'reduction',
      reactions: ['carbonyl to methylene'],
      conditions: 'amalgamated zinc, aqueous HCl, reflux',
      products: 'C=O → CH₂',
      notes: 'Acidic conditions; for acid-stable substrates',
      difficulty: 2
    },
    {
      name: 'Wolff-Kishner reduction',
      formula: 'NH2NH2/KOH',
      category: 'reduction',
      reactions: ['carbonyl to methylene'],
      conditions: 'hydrazine, then KOH, high temp',
      products: 'C=O → CH₂',
      notes: 'Basic conditions; for base-stable substrates',
      difficulty: 2
    }
  ],

  // Substitution and addition reagents
  nucleophiles: [
    {
      name: 'NaOH/KOH (hydroxide)',
      formula: 'NaOH',
      category: 'nucleophile',
      reactions: ['SN2', 'E2', 'ester hydrolysis'],
      conditions: 'aqueous or alcoholic',
      products: 'R-X → R-OH (SN2); alkene (E2)',
      notes: 'Strong base/nucleophile; E2 favored with heat and bulky substrate',
      difficulty: 1
    },
    {
      name: 'NaCN (cyanide)',
      formula: 'NaCN',
      category: 'nucleophile',
      reactions: ['SN2', 'cyanohydrin formation'],
      conditions: 'polar aprotic solvent',
      products: 'R-X → R-CN; ketone/aldehyde → cyanohydrin',
      notes: 'Good nucleophile; adds one carbon',
      difficulty: 2
    },
    {
      name: 'NaN₃ (azide)',
      formula: 'NaN3',
      category: 'nucleophile',
      reactions: ['SN2'],
      conditions: 'polar aprotic solvent',
      products: 'R-X → R-N₃',
      notes: 'Good nucleophile; azide can be reduced to amine',
      difficulty: 2
    },
    {
      name: 'NaI (iodide)',
      formula: 'NaI',
      category: 'nucleophile',
      reactions: ['SN2', 'Finkelstein reaction'],
      conditions: 'acetone',
      products: 'R-Cl/Br → R-I',
      notes: 'Good nucleophile; NaCl/NaBr precipitates driving reaction',
      difficulty: 2
    },
    {
      name: 'NaSH/NaSR (thiolate)',
      formula: 'NaSH',
      category: 'nucleophile',
      reactions: ['SN2'],
      conditions: 'polar aprotic',
      products: 'R-X → R-SH (thiol)',
      notes: 'Excellent nucleophile; soft, polarizable',
      difficulty: 2
    },
    {
      name: 'Grignard Reagent (RMgX)',
      formula: 'RMgBr',
      category: 'nucleophile',
      reactions: ['carbonyl addition', 'epoxide opening'],
      conditions: 'dry ether/THF; then H₃O⁺ workup',
      products: 'aldehyde → secondary alcohol; ketone → tertiary alcohol',
      notes: 'Strong base/nucleophile; reacts with protic solvents',
      difficulty: 1
    },
    {
      name: 'Organolithium (RLi)',
      formula: 'n-BuLi',
      category: 'nucleophile',
      reactions: ['carbonyl addition', 'deprotonation'],
      conditions: 'dry THF, -78°C',
      products: 'similar to Grignard but more reactive',
      notes: 'Extremely strong base; more reactive than Grignard',
      difficulty: 2
    },
    {
      name: 'Gilman Reagent (R₂CuLi)',
      formula: '(CH3)2CuLi',
      category: 'nucleophile',
      reactions: ['conjugate addition', 'SN2 with alkyl halides'],
      conditions: 'dry ether, -78°C',
      products: 'enone → 1,4-addition product',
      notes: 'Softer nucleophile; 1,4-addition (conjugate) not 1,2',
      difficulty: 3
    }
  ],

  // Acids and bases
  acidsBases: [
    {
      name: 'H₂SO₄ (sulfuric acid)',
      formula: 'H2SO4',
      category: 'acid',
      reactions: ['alkene hydration', 'alcohol dehydration', 'esterification'],
      conditions: 'concentrated or dilute',
      products: 'alkene → alcohol (Markovnikov); alcohol → alkene',
      notes: 'Strong acid catalyst',
      difficulty: 1
    },
    {
      name: 'H₃PO₄ (phosphoric acid)',
      formula: 'H3PO4',
      category: 'acid',
      reactions: ['alcohol dehydration'],
      conditions: 'heat',
      products: 'alcohol → alkene',
      notes: 'Less likely to cause rearrangements than H₂SO₄',
      difficulty: 2
    },
    {
      name: 'HBr (hydrobromic acid)',
      formula: 'HBr',
      category: 'acid',
      reactions: ['alkene addition', 'alcohol substitution'],
      conditions: 'with or without peroxides',
      products: 'Markovnikov addition (without ROOR); anti-Markovnikov (with ROOR)',
      notes: 'Peroxides cause radical mechanism → anti-Markovnikov',
      difficulty: 1
    },
    {
      name: 'HCl (hydrochloric acid)',
      formula: 'HCl',
      category: 'acid',
      reactions: ['alkene addition', 'alcohol to alkyl chloride'],
      conditions: 'gas or aqueous',
      products: 'Markovnikov addition',
      notes: 'Less reactive than HBr for radical reactions',
      difficulty: 1
    },
    {
      name: 't-BuOK (potassium tert-butoxide)',
      formula: '(CH3)3COK',
      category: 'base',
      reactions: ['E2 elimination'],
      conditions: 't-BuOH solvent',
      products: 'Hofmann product (less substituted alkene)',
      notes: 'Bulky base favors less substituted alkene',
      difficulty: 2
    },
    {
      name: 'NaOEt (sodium ethoxide)',
      formula: 'NaOCH2CH3',
      category: 'base',
      reactions: ['E2 elimination', 'Williamson ether synthesis'],
      conditions: 'EtOH',
      products: 'Zaitsev product (more substituted alkene)',
      notes: 'Small base favors more substituted alkene',
      difficulty: 2
    },
    {
      name: 'LDA (lithium diisopropylamide)',
      formula: 'LiN(iPr)2',
      category: 'base',
      reactions: ['enolate formation', 'deprotonation'],
      conditions: 'THF, -78°C',
      products: 'kinetic enolate',
      notes: 'Strong, bulky, non-nucleophilic base',
      difficulty: 2
    },
    {
      name: 'DBU (1,8-diazabicyclo[5.4.0]undec-7-ene)',
      formula: 'C9H16N2',
      category: 'base',
      reactions: ['E2 elimination'],
      conditions: 'various solvents',
      products: 'alkene',
      notes: 'Non-nucleophilic base; good for eliminations',
      difficulty: 3
    }
  ],

  // Halogenation reagents
  halogenation: [
    {
      name: 'Br₂ (bromine)',
      formula: 'Br2',
      category: 'halogenation',
      reactions: ['alkene bromination', 'aromatic bromination'],
      conditions: 'CCl₄ for alkenes; FeBr₃ for aromatics',
      products: 'alkene → vicinal dibromide (anti); benzene → bromobenzene',
      notes: 'Red-brown decolorization = positive test for alkenes',
      difficulty: 1
    },
    {
      name: 'Cl₂ (chlorine)',
      formula: 'Cl2',
      category: 'halogenation',
      reactions: ['alkene chlorination', 'aromatic chlorination', 'radical halogenation'],
      conditions: 'hv or heat for radicals; FeCl₃ for aromatics',
      products: 'alkene → vicinal dichloride; alkane → alkyl chloride (radical)',
      notes: 'Less selective than Br₂ for radical reactions',
      difficulty: 1
    },
    {
      name: 'NBS (N-bromosuccinimide)',
      formula: 'C4H4BrNO2',
      category: 'halogenation',
      reactions: ['allylic bromination', 'benzylic bromination'],
      conditions: 'hv or peroxide initiator, CCl₄',
      products: 'allylic C-H → allylic C-Br',
      notes: 'Selective for allylic/benzylic positions',
      difficulty: 2
    },
    {
      name: 'SOCl₂ (thionyl chloride)',
      formula: 'SOCl2',
      category: 'halogenation',
      reactions: ['alcohol to alkyl chloride', 'carboxylic acid to acyl chloride'],
      conditions: 'pyridine optional',
      products: 'R-OH → R-Cl; RCOOH → RCOCl',
      notes: 'Produces gaseous byproducts (SO₂, HCl)',
      difficulty: 1
    },
    {
      name: 'PBr₃ (phosphorus tribromide)',
      formula: 'PBr3',
      category: 'halogenation',
      reactions: ['alcohol to alkyl bromide'],
      conditions: 'ether',
      products: 'R-OH → R-Br',
      notes: 'SN2 mechanism; inversion of stereochemistry',
      difficulty: 2
    },
    {
      name: 'PCl₅ (phosphorus pentachloride)',
      formula: 'PCl5',
      category: 'halogenation',
      reactions: ['alcohol to alkyl chloride', 'carboxylic acid to acyl chloride'],
      conditions: 'ether',
      products: 'R-OH → R-Cl; RCOOH → RCOCl',
      notes: 'More reactive than SOCl₂',
      difficulty: 2
    }
  ],

  // Protecting groups
  protectingGroups: [
    {
      name: 'TBS-Cl (tert-butyldimethylsilyl chloride)',
      formula: '(CH3)3CSi(CH3)2Cl',
      category: 'protecting group',
      reactions: ['alcohol protection'],
      conditions: 'imidazole, DMF',
      products: 'R-OH → R-OTBS',
      deprotection: 'TBAF or HF·pyridine',
      notes: 'Common silyl protecting group; stable to bases',
      difficulty: 3
    },
    {
      name: 'Ac₂O (acetic anhydride)',
      formula: '(CH3CO)2O',
      category: 'protecting group',
      reactions: ['alcohol acetylation', 'amine acetylation'],
      conditions: 'pyridine or DMAP',
      products: 'R-OH → R-OAc; R-NH₂ → R-NHAc',
      deprotection: 'base hydrolysis or LiAlH₄',
      notes: 'Acetyl group; easy to install and remove',
      difficulty: 2
    },
    {
      name: 'Boc₂O (di-tert-butyl dicarbonate)',
      formula: '((CH3)3CO)2CO',
      category: 'protecting group',
      reactions: ['amine protection'],
      conditions: 'base, CH₂Cl₂',
      products: 'R-NH₂ → R-NHBoc',
      deprotection: 'TFA or HCl',
      notes: 'Boc group; removed by acid',
      difficulty: 3
    },
    {
      name: 'Fmoc-Cl (fluorenylmethyloxycarbonyl chloride)',
      formula: 'C15H11ClO2',
      category: 'protecting group',
      reactions: ['amine protection'],
      conditions: 'base',
      products: 'R-NH₂ → R-NHFmoc',
      deprotection: 'piperidine',
      notes: 'Fmoc group; removed by base; used in peptide synthesis',
      difficulty: 3
    }
  ]
};

/**
 * Get all reagents as a flat array
 */
export function getAllReagents() {
  const all = [];
  for (const category of Object.values(REAGENT_DATA)) {
    all.push(...category);
  }
  return all;
}

/**
 * Get reagents by category
 */
export function getReagentsByCategory(category) {
  return REAGENT_DATA[category] || [];
}

/**
 * Get reagent by name (partial match)
 */
export function findReagent(name) {
  const allReagents = getAllReagents();
  const lowerName = name.toLowerCase();
  return allReagents.find(r =>
    r.name.toLowerCase().includes(lowerName) ||
    r.formula.toLowerCase().includes(lowerName)
  );
}

/**
 * Get reagents by reaction type
 */
export function getReagentsByReaction(reactionType) {
  const allReagents = getAllReagents();
  const lowerType = reactionType.toLowerCase();
  return allReagents.filter(r =>
    r.reactions.some(rxn => rxn.toLowerCase().includes(lowerType))
  );
}

/**
 * Generate a reagent identification quiz question
 */
export function generateReagentQuestion(type = null) {
  const questionTypes = ['identify', 'product', 'conditions', 'reaction'];
  const qType = type || questionTypes[Math.floor(Math.random() * questionTypes.length)];

  const allReagents = getAllReagents();
  const reagent = allReagents[Math.floor(Math.random() * allReagents.length)];

  let question, options, answer, explanation;

  switch (qType) {
    case 'identify':
      // "Which reagent is used for...?"
      question = `Which reagent is used for ${reagent.reactions[0]}?`;
      answer = reagent.name;

      // Get wrong answers from different categories
      const wrongReagents = allReagents
        .filter(r => r.name !== reagent.name && r.category !== reagent.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      options = [reagent.name, ...wrongReagents.map(r => r.name)]
        .sort(() => Math.random() - 0.5);

      explanation = `${reagent.name} is used for ${reagent.reactions.join(', ')}. ${reagent.notes || ''}`;
      break;

    case 'product':
      // "What product is formed when...?"
      question = `What is the typical product when using ${reagent.name}?`;
      answer = reagent.products;

      const wrongProducts = allReagents
        .filter(r => r.name !== reagent.name)
        .map(r => r.products)
        .filter((p, i, arr) => arr.indexOf(p) === i)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      options = [reagent.products, ...wrongProducts].sort(() => Math.random() - 0.5);
      explanation = `${reagent.name}: ${reagent.products}. Conditions: ${reagent.conditions}`;
      break;

    case 'conditions':
      // "What conditions are used with...?"
      question = `What conditions are typically used with ${reagent.name}?`;
      answer = reagent.conditions;

      const wrongConditions = allReagents
        .filter(r => r.name !== reagent.name)
        .map(r => r.conditions)
        .filter((c, i, arr) => arr.indexOf(c) === i)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      options = [reagent.conditions, ...wrongConditions].sort(() => Math.random() - 0.5);
      explanation = `${reagent.name} is typically used with: ${reagent.conditions}`;
      break;

    case 'reaction':
      // "Which reaction can be performed with...?"
      const reactionChoice = reagent.reactions[Math.floor(Math.random() * reagent.reactions.length)];
      question = `Which of these reactions can be performed with ${reagent.name}?`;
      answer = reactionChoice;

      const allReactions = allReagents
        .flatMap(r => r.reactions)
        .filter((rxn, i, arr) => arr.indexOf(rxn) === i);

      const wrongReactions = allReactions
        .filter(rxn => !reagent.reactions.includes(rxn))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      options = [reactionChoice, ...wrongReactions].sort(() => Math.random() - 0.5);
      explanation = `${reagent.name} can be used for: ${reagent.reactions.join(', ')}`;
      break;
  }

  return {
    type: qType,
    question,
    options,
    answer,
    explanation,
    reagent
  };
}

/**
 * Check if answer is correct
 */
export function checkReagentAnswer(userAnswer, question) {
  return userAnswer === question.answer;
}

/**
 * Get reagent categories
 */
export function getReagentCategories() {
  return Object.keys(REAGENT_DATA);
}

/**
 * Common reaction-to-reagent lookup
 */
export const REACTION_REAGENT_MAP = {
  'alcohol to aldehyde': ['PCC', 'PDC', 'Swern'],
  'alcohol to carboxylic acid': ['Jones Reagent', 'KMnO₄'],
  'alcohol to alkyl halide': ['SOCl₂', 'PBr₃', 'HBr'],
  'alkene to diol': ['OsO₄/NMO', 'KMnO₄ (cold)'],
  'alkene to epoxide': ['MCPBA'],
  'alkene to alkane': ['H₂/Pd'],
  'alkyne to cis-alkene': ['Lindlar\'s catalyst'],
  'alkyne to trans-alkene': ['Na/NH₃'],
  'aldehyde/ketone to alcohol': ['NaBH₄', 'LiAlH₄'],
  'ester to alcohol': ['LiAlH₄', 'DIBAL-H (full reduction)'],
  'ester to aldehyde': ['DIBAL-H (-78°C)'],
  'carbonyl to methylene': ['Clemmensen', 'Wolff-Kishner'],
  'SN2': ['NaCN', 'NaN₃', 'NaI', 'NaOH'],
  'E2': ['t-BuOK', 'NaOEt', 'DBU']
};
