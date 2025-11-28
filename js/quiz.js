/**
 * Practice Quiz Mode
 *
 * Generates random problems to test understanding of chair conformations.
 */

import { createMoleculeState, setSubstituent } from './chair.js';
import { compareConformations, getAValue } from './energy.js';

// Substituents for quiz problems (with their complexity levels)
const QUIZ_SUBSTITUENTS = [
  { group: 'CH3', name: 'methyl', level: 1 },
  { group: 'C2H5', name: 'ethyl', level: 1 },
  { group: 'OH', name: 'hydroxyl', level: 1 },
  { group: 'Cl', name: 'chlorine', level: 1 },
  { group: 'Br', name: 'bromine', level: 1 },
  { group: 'iPr', name: 'isopropyl', level: 2 },
  { group: 'tBu', name: 'tert-butyl', level: 2 },
  { group: 'Ph', name: 'phenyl', level: 2 },
  { group: 'CN', name: 'cyano', level: 2 },
  { group: 'NO2', name: 'nitro', level: 2 },
];

// Question types
const QUESTION_TYPES = [
  'preferred_conformer',
  'count_axial',
  'energy_difference',
  'ring_flip_result',
];

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a random molecule state for quiz
 * @param {number} difficulty - 1 (easy), 2 (medium), 3 (hard)
 */
export function generateRandomMolecule(difficulty = 1) {
  const state = createMoleculeState();

  // Number of substituents based on difficulty
  const numSubstituents = difficulty === 1 ? 1 : difficulty === 2 ? 2 : randomInt(2, 3);

  // Filter substituents by difficulty level
  const availableSubs = QUIZ_SUBSTITUENTS.filter(s => s.level <= difficulty);

  // Pick random positions and substituents
  const usedPositions = new Set();
  let resultState = state;

  for (let i = 0; i < numSubstituents; i++) {
    // Pick random carbon (0-5)
    let carbon;
    do {
      carbon = randomInt(0, 5);
    } while (usedPositions.has(carbon));
    usedPositions.add(carbon);

    // Pick random position (axial or equatorial)
    const position = Math.random() < 0.5 ? 'axial' : 'equatorial';

    // Pick random substituent
    const sub = availableSubs[randomInt(0, availableSubs.length - 1)];

    resultState = setSubstituent(resultState, carbon, position, sub.group);
  }

  return resultState;
}

/**
 * Generate a quiz question
 * @param {number} difficulty - 1 (easy), 2 (medium), 3 (hard)
 */
export function generateQuestion(difficulty = 1) {
  const molecule = generateRandomMolecule(difficulty);
  const comparison = compareConformations(molecule);

  // Pick a question type based on difficulty
  let questionTypes = ['preferred_conformer', 'count_axial'];
  if (difficulty >= 2) {
    questionTypes.push('energy_difference');
  }
  if (difficulty >= 2) {
    questionTypes.push('ring_flip_result');
  }

  const type = questionTypes[randomInt(0, questionTypes.length - 1)];

  switch (type) {
    case 'preferred_conformer':
      return generatePreferredConformerQuestion(molecule, comparison);
    case 'count_axial':
      return generateCountAxialQuestion(molecule);
    case 'energy_difference':
      return generateEnergyDifferenceQuestion(molecule, comparison);
    case 'ring_flip_result':
      return generateRingFlipQuestion(molecule);
    default:
      return generatePreferredConformerQuestion(molecule, comparison);
  }
}

/**
 * Generate "which conformer is preferred" question
 */
function generatePreferredConformerQuestion(molecule, comparison) {
  const axialCount = molecule.substituents.filter(s => s.position === 'axial').length;
  const eqCount = molecule.substituents.filter(s => s.position === 'equatorial').length;

  let correctAnswer;
  let explanation;

  if (comparison.deltaE < -0.1) {
    correctAnswer = 'current';
    explanation = `The current conformer is more stable by ${Math.abs(comparison.deltaE).toFixed(2)} kcal/mol because it has more substituents in equatorial positions.`;
  } else if (comparison.deltaE > 0.1) {
    correctAnswer = 'flipped';
    explanation = `The flipped conformer is more stable by ${Math.abs(comparison.deltaE).toFixed(2)} kcal/mol because it would have more substituents in equatorial positions.`;
  } else {
    correctAnswer = 'equal';
    explanation = 'Both conformers have approximately equal energy.';
  }

  return {
    type: 'preferred_conformer',
    molecule,
    question: 'Which chair conformer is more stable?',
    options: [
      { value: 'current', label: 'Current (as shown)' },
      { value: 'flipped', label: 'Ring-flipped conformer' },
      { value: 'equal', label: 'Both are equal' },
    ],
    correctAnswer,
    explanation,
  };
}

/**
 * Generate "count axial substituents" question
 */
function generateCountAxialQuestion(molecule) {
  const axialCount = molecule.substituents.filter(s => s.position === 'axial').length;

  // Generate wrong answers
  const options = [axialCount];
  while (options.length < 4) {
    const wrong = randomInt(0, molecule.substituents.length + 1);
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }

  return {
    type: 'count_axial',
    molecule,
    question: 'How many substituents (not including H) are in axial positions?',
    options: shuffle(options).map(n => ({ value: n, label: n.toString() })),
    correctAnswer: axialCount,
    explanation: `There ${axialCount === 1 ? 'is' : 'are'} ${axialCount} substituent${axialCount === 1 ? '' : 's'} in axial position${axialCount === 1 ? '' : 's'}.`,
  };
}

/**
 * Generate energy difference question
 */
function generateEnergyDifferenceQuestion(molecule, comparison) {
  const actualDiff = Math.abs(comparison.deltaE);

  // Round to nearest 0.5
  const roundedDiff = Math.round(actualDiff * 2) / 2;

  // Generate options
  const options = [roundedDiff];
  const possibleValues = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0];

  while (options.length < 4) {
    const val = possibleValues[randomInt(0, possibleValues.length - 1)];
    if (!options.includes(val)) {
      options.push(val);
    }
  }

  return {
    type: 'energy_difference',
    molecule,
    question: 'What is the approximate energy difference (ΔE) between conformers?',
    options: shuffle(options).map(n => ({ value: n, label: `${n.toFixed(1)} kcal/mol` })),
    correctAnswer: roundedDiff,
    explanation: `The energy difference is ${actualDiff.toFixed(2)} kcal/mol, based on the A-values of the substituents.`,
  };
}

/**
 * Generate ring flip result question
 */
function generateRingFlipQuestion(molecule) {
  // After ring flip, axial becomes equatorial and vice versa
  const currentAxial = molecule.substituents.filter(s => s.position === 'axial').length;
  const currentEq = molecule.substituents.filter(s => s.position === 'equatorial').length;

  // After flip: axial count becomes what was equatorial
  const flippedAxial = currentEq;

  const options = [];
  for (let i = 0; i <= molecule.substituents.length; i++) {
    options.push(i);
  }

  return {
    type: 'ring_flip_result',
    molecule,
    question: 'After a ring flip, how many substituents will be in axial positions?',
    options: shuffle(options.slice(0, 4)).map(n => ({ value: n, label: n.toString() })),
    correctAnswer: flippedAxial,
    explanation: `After ring flip, axial and equatorial positions swap. The ${currentEq} equatorial substituent${currentEq === 1 ? '' : 's'} will become axial.`,
  };
}

/**
 * Check if the given answer is correct
 */
export function checkAnswer(question, answer) {
  return answer === question.correctAnswer;
}

/**
 * Get quiz statistics
 */
export function calculateScore(correct, total) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  let grade;

  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';
  else grade = 'F';

  return { correct, total, percentage, grade };
}
