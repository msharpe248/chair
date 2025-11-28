/**
 * Energy Diagram Quiz Module
 *
 * Generates quiz questions about reaction energy diagrams,
 * mechanism prediction, and thermodynamics.
 */

import { REACTION_PRESETS } from './energy-diagram.js';
import { predictMechanism, getMechanismEnergy, SUBSTRATES, NUCLEOPHILES, SOLVENTS } from './reaction-predictor.js';

// Question types
const QUESTION_TYPES = [
  'identify_mechanism',      // Show diagram, identify mechanism type
  'predict_from_conditions', // Given conditions, predict mechanism
  'compare_ea',              // Compare activation energies
  'exo_vs_endo',             // Identify exothermic vs endothermic
  'rate_comparison'          // Which reaction is faster?
];

// Quiz state
let quizState = {
  score: { correct: 0, total: 0 },
  currentQuestion: null,
  selectedAnswer: null
};

/**
 * Generate a random quiz question
 */
export function generateEnergyQuestion() {
  const questionType = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

  switch (questionType) {
    case 'identify_mechanism':
      return generateIdentifyMechanismQuestion();
    case 'predict_from_conditions':
      return generatePredictFromConditionsQuestion();
    case 'compare_ea':
      return generateCompareEaQuestion();
    case 'exo_vs_endo':
      return generateExoEndoQuestion();
    case 'rate_comparison':
      return generateRateComparisonQuestion();
    default:
      return generateIdentifyMechanismQuestion();
  }
}

/**
 * Generate "Identify the mechanism from the diagram" question
 */
function generateIdentifyMechanismQuestion() {
  const mechanisms = ['sn2', 'sn1', 'e2', 'e1'];
  const correctMech = mechanisms[Math.floor(Math.random() * mechanisms.length)];
  const preset = REACTION_PRESETS[correctMech];

  // Shuffle options
  const options = shuffleArray([...mechanisms]);

  return {
    type: 'identify_mechanism',
    question: 'What type of mechanism does this energy diagram represent?',
    preset: correctMech,
    options: options.map(m => ({
      value: m,
      label: m.toUpperCase()
    })),
    correctAnswer: correctMech,
    explanation: getIdentifyExplanation(correctMech, preset)
  };
}

/**
 * Generate "Predict mechanism from conditions" question
 */
function generatePredictFromConditionsQuestion() {
  // Generate random conditions
  const substrateKeys = ['methyl', 'primary', 'secondary', 'tertiary'];
  const nucleophileKeys = ['strong_small', 'strong_normal', 'strong_bulky', 'weak'];
  const solventKeys = ['polar_aprotic', 'polar_protic'];

  const conditions = {
    substrate: substrateKeys[Math.floor(Math.random() * substrateKeys.length)],
    nucleophile: nucleophileKeys[Math.floor(Math.random() * nucleophileKeys.length)],
    leavingGroup: 'good',
    solvent: solventKeys[Math.floor(Math.random() * solventKeys.length)],
    temperature: 'room'
  };

  const prediction = predictMechanism(conditions);
  const correctMech = prediction.primary.mechanism;

  // Build question text
  const subLabel = SUBSTRATES[conditions.substrate].label;
  const nucLabel = NUCLEOPHILES[conditions.nucleophile].label.split(' ')[0];
  const solvLabel = SOLVENTS[conditions.solvent].label.split(' ')[0];

  const questionText = `A ${subLabel.toLowerCase()} substrate with a ${nucLabel.toLowerCase()} nucleophile in ${solvLabel.toLowerCase()} solvent. What mechanism is most likely?`;

  return {
    type: 'predict_from_conditions',
    question: questionText,
    conditions: conditions,
    options: ['sn2', 'sn1', 'e2', 'e1'].map(m => ({
      value: m,
      label: m.toUpperCase()
    })),
    correctAnswer: correctMech,
    explanation: getPredictExplanation(conditions, prediction)
  };
}

/**
 * Generate "Compare activation energies" question
 */
function generateCompareEaQuestion() {
  const pairs = [
    { a: 'sn2', b: 'sn1', comparison: 'lower', reason: 'SN2 is concerted with no intermediate' },
    { a: 'e2', b: 'e1', comparison: 'lower', reason: 'E2 is concerted, E1 forms carbocation' },
    { a: 'sn2', b: 'e2', comparison: 'varies', reason: 'Depends on substrate and conditions' }
  ];

  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const presetA = REACTION_PRESETS[pair.a];
  const presetB = REACTION_PRESETS[pair.b];

  const eaA = presetA.tsE[0];
  const eaB = presetB.tsE[0];

  const correct = eaA < eaB ? pair.a : pair.b;

  return {
    type: 'compare_ea',
    question: `Which reaction typically has a LOWER activation energy (Ea)?`,
    presets: [pair.a, pair.b],
    options: [
      { value: pair.a, label: `${pair.a.toUpperCase()} (Ea ≈ ${eaA} kcal/mol)` },
      { value: pair.b, label: `${pair.b.toUpperCase()} (Ea ≈ ${eaB} kcal/mol)` },
      { value: 'same', label: 'About the same' }
    ],
    correctAnswer: correct,
    explanation: `${pair.a.toUpperCase()} has Ea ≈ ${eaA} kcal/mol, ${pair.b.toUpperCase()} has Ea ≈ ${eaB} kcal/mol. ${pair.reason}.`
  };
}

/**
 * Generate "Exothermic vs Endothermic" question
 */
function generateExoEndoQuestion() {
  const reactions = [
    { preset: 'sn2', deltaH: -5, type: 'exothermic' },
    { preset: 'sn1', deltaH: -5, type: 'exothermic' },
    { preset: 'e2', deltaH: 2, type: 'endothermic' },
    { preset: 'e1', deltaH: 2, type: 'endothermic' },
    { preset: 'hydrogenation', deltaH: -30, type: 'exothermic' },
    { preset: 'endothermic', deltaH: 10, type: 'endothermic' }
  ];

  const reaction = reactions[Math.floor(Math.random() * reactions.length)];

  return {
    type: 'exo_vs_endo',
    question: 'Based on this energy diagram, is the reaction exothermic or endothermic?',
    preset: reaction.preset,
    options: [
      { value: 'exothermic', label: 'Exothermic (ΔH < 0)' },
      { value: 'endothermic', label: 'Endothermic (ΔH > 0)' }
    ],
    correctAnswer: reaction.type,
    explanation: `The products are ${reaction.type === 'exothermic' ? 'lower' : 'higher'} in energy than the reactants. ΔH ≈ ${reaction.deltaH} kcal/mol, so the reaction is ${reaction.type}.`
  };
}

/**
 * Generate "Rate comparison" question
 */
function generateRateComparisonQuestion() {
  const scenarios = [
    {
      question: 'For a primary alkyl halide, which conditions would give a FASTER reaction?',
      optionA: { label: 'Strong nucleophile in polar aprotic', mechanism: 'sn2', ea: 15 },
      optionB: { label: 'Weak nucleophile in polar protic', mechanism: 'sn1', ea: 25 },
      correct: 'a',
      reason: 'Primary substrates undergo fast SN2 with strong nucleophiles'
    },
    {
      question: 'For a tertiary alkyl halide, which mechanism is faster?',
      optionA: { label: 'SN1 in polar protic', mechanism: 'sn1', ea: 18 },
      optionB: { label: 'SN2 (if it occurred)', mechanism: 'sn2', ea: 35 },
      correct: 'a',
      reason: 'Tertiary substrates cannot undergo SN2 due to steric hindrance'
    }
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  return {
    type: 'rate_comparison',
    question: scenario.question,
    options: [
      { value: 'a', label: scenario.optionA.label },
      { value: 'b', label: scenario.optionB.label }
    ],
    correctAnswer: scenario.correct,
    explanation: scenario.reason
  };
}

/**
 * Get explanation for identify mechanism question
 */
function getIdentifyExplanation(mechanism, preset) {
  const explanations = {
    sn2: 'Single transition state, concerted mechanism. The curve shows one peak (TS) going directly from reactants to products.',
    sn1: 'Two transition states with a carbocation intermediate. The curve shows two peaks with a valley (intermediate) between them.',
    e2: 'Single transition state, concerted elimination. Similar shape to SN2 but typically slightly higher Ea.',
    e1: 'Two transition states with a carbocation intermediate, followed by elimination. Similar shape to SN1.'
  };

  return explanations[mechanism] || 'This mechanism has characteristic energy profile features.';
}

/**
 * Get explanation for predict from conditions question
 */
function getPredictExplanation(conditions, prediction) {
  const reasons = [];

  if (conditions.substrate === 'tertiary') {
    reasons.push('Tertiary substrates favor unimolecular mechanisms (SN1/E1) due to steric hindrance');
  } else if (conditions.substrate === 'methyl' || conditions.substrate === 'primary') {
    reasons.push('Methyl/primary substrates favor SN2 due to low steric hindrance');
  }

  if (conditions.nucleophile === 'strong_bulky') {
    reasons.push('Bulky bases favor E2 elimination');
  } else if (conditions.nucleophile.startsWith('strong')) {
    reasons.push('Strong nucleophiles favor bimolecular mechanisms');
  }

  if (conditions.solvent === 'polar_aprotic') {
    reasons.push('Polar aprotic solvents enhance nucleophilicity');
  } else {
    reasons.push('Polar protic solvents stabilize carbocations');
  }

  return reasons.join('. ') + '.';
}

/**
 * Check answer and update score
 */
export function checkEnergyAnswer(selectedAnswer, question) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  quizState.score.total++;
  if (isCorrect) {
    quizState.score.correct++;
  }

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    score: { ...quizState.score }
  };
}

/**
 * Get current quiz state
 */
export function getEnergyQuizState() {
  return { ...quizState };
}

/**
 * Reset quiz state
 */
export function resetEnergyQuiz() {
  quizState = {
    score: { correct: 0, total: 0 },
    currentQuestion: null,
    selectedAnswer: null
  };
  return quizState;
}

/**
 * Shuffle array helper
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
