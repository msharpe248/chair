/**
 * Pyranose Sugar Support
 *
 * Handles chair conformations for 6-membered ring sugars (pyranoses).
 * The ring contains an oxygen atom between C5 and C1 (anomeric carbon).
 */

// Ring positions for pyranose (C1-C5 + O)
// In standard numbering: C1 (anomeric) - C2 - C3 - C4 - C5 - O - back to C1
// Position indices: 0=C1, 1=C2, 2=C3, 3=C4, 4=C5, 5=O

/**
 * Pyranose geometry - similar to cyclohexane but position 5 is oxygen
 * The chair is drawn with the ring oxygen at the back-right
 */
export const PYRANOSE_COORDS = [
  { id: 'C1', x: 120, y: 60,  axialDir: -1, isCarbon: true },   // C1 - anomeric carbon
  { id: 'C2', x: 200, y: 100, axialDir: 1,  isCarbon: true },   // C2
  { id: 'C3', x: 240, y: 180, axialDir: -1, isCarbon: true },   // C3
  { id: 'C4', x: 200, y: 260, axialDir: 1,  isCarbon: true },   // C4
  { id: 'C5', x: 120, y: 220, axialDir: -1, isCarbon: true },   // C5
  { id: 'O',  x: 80,  y: 140, axialDir: 1,  isCarbon: false },  // Ring oxygen
];

/**
 * Sugar templates - define substituent patterns for common sugars
 * Positions are given for the 4C1 conformation (most stable for D-sugars)
 *
 * Each sugar defines:
 * - hydroxyl positions and their orientations (up/down in Haworth projection)
 * - The CH2OH group is always on C5
 */
export const SUGAR_TEMPLATES = {
  'glucose': {
    name: 'D-Glucose',
    substituents: [
      // C1: anomeric OH - depends on alpha/beta
      { carbon: 1, position: 'equatorial', group: 'OH' },  // C2-OH (equatorial, down in Haworth)
      { carbon: 2, position: 'equatorial', group: 'OH' },  // C3-OH (equatorial, up in Haworth)
      { carbon: 3, position: 'equatorial', group: 'OH' },  // C4-OH (equatorial, down in Haworth)
      { carbon: 4, position: 'equatorial', group: 'CH2OH' }, // C5-CH2OH
    ],
    // In 4C1: all OH groups are equatorial for beta-D-glucose
    anomericEquatorial: 'beta',  // beta has equatorial anomeric OH
  },

  'galactose': {
    name: 'D-Galactose',
    substituents: [
      { carbon: 1, position: 'equatorial', group: 'OH' },  // C2-OH equatorial
      { carbon: 2, position: 'equatorial', group: 'OH' },  // C3-OH equatorial
      { carbon: 3, position: 'axial', group: 'OH' },       // C4-OH AXIAL (differs from glucose)
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'mannose': {
    name: 'D-Mannose',
    substituents: [
      { carbon: 1, position: 'axial', group: 'OH' },       // C2-OH AXIAL (differs from glucose)
      { carbon: 2, position: 'equatorial', group: 'OH' },  // C3-OH equatorial
      { carbon: 3, position: 'equatorial', group: 'OH' },  // C4-OH equatorial
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'allose': {
    name: 'D-Allose',
    substituents: [
      { carbon: 1, position: 'equatorial', group: 'OH' },
      { carbon: 2, position: 'axial', group: 'OH' },       // C3-OH axial
      { carbon: 3, position: 'equatorial', group: 'OH' },
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'altrose': {
    name: 'D-Altrose',
    substituents: [
      { carbon: 1, position: 'axial', group: 'OH' },
      { carbon: 2, position: 'axial', group: 'OH' },
      { carbon: 3, position: 'equatorial', group: 'OH' },
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'gulose': {
    name: 'D-Gulose',
    substituents: [
      { carbon: 1, position: 'equatorial', group: 'OH' },
      { carbon: 2, position: 'axial', group: 'OH' },
      { carbon: 3, position: 'axial', group: 'OH' },
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'idose': {
    name: 'D-Idose',
    substituents: [
      { carbon: 1, position: 'axial', group: 'OH' },
      { carbon: 2, position: 'axial', group: 'OH' },
      { carbon: 3, position: 'axial', group: 'OH' },
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },

  'talose': {
    name: 'D-Talose',
    substituents: [
      { carbon: 1, position: 'axial', group: 'OH' },
      { carbon: 2, position: 'equatorial', group: 'OH' },
      { carbon: 3, position: 'axial', group: 'OH' },
      { carbon: 4, position: 'equatorial', group: 'CH2OH' },
    ],
    anomericEquatorial: 'beta',
  },
};

/**
 * Get pyranose coordinates
 * @param {boolean} flipped - If true, return the ring-flipped conformation (1C4)
 * @returns {Array} Array of position objects
 */
export function getPyranoseCoords(flipped = false) {
  if (!flipped) {
    return PYRANOSE_COORDS.map(c => ({ ...c }));
  }

  // Ring flip: axial directions swap (4C1 <-> 1C4)
  return PYRANOSE_COORDS.map(c => ({
    ...c,
    axialDir: -c.axialDir
  }));
}

/**
 * Get the bonds for pyranose ring
 * @returns {Array} Array of bond objects
 */
export function getPyranoseBonds() {
  return [
    { from: 0, to: 1 },  // C1-C2
    { from: 1, to: 2 },  // C2-C3
    { from: 2, to: 3 },  // C3-C4
    { from: 3, to: 4 },  // C4-C5
    { from: 4, to: 5 },  // C5-O
    { from: 5, to: 0 },  // O-C1
  ];
}

/**
 * Create a pyranose molecule state from a template
 * @param {string} sugarType - Key from SUGAR_TEMPLATES
 * @param {string} anomer - 'alpha' or 'beta'
 * @returns {Object} Molecule state
 */
export function createPyranoseState(sugarType = 'glucose', anomer = 'beta') {
  const template = SUGAR_TEMPLATES[sugarType];
  if (!template) {
    throw new Error(`Unknown sugar type: ${sugarType}`);
  }

  const substituents = [];

  // Add the template substituents (C2-C5)
  for (const sub of template.substituents) {
    substituents.push({
      carbonIndex: sub.carbon,
      position: sub.position,
      group: sub.group
    });
  }

  // Add anomeric OH at C1 (index 0)
  // Beta = equatorial in 4C1 for D-sugars
  // Alpha = axial in 4C1 for D-sugars
  const anomericPosition = (anomer === template.anomericEquatorial) ? 'equatorial' : 'axial';
  substituents.push({
    carbonIndex: 0,
    position: anomericPosition,
    group: 'OH'
  });

  return {
    mode: 'pyranose',
    sugarType,
    anomer,
    flipped: false,
    substituents
  };
}

/**
 * Get available sugar types
 * @returns {Array} Array of {key, name} objects
 */
export function getAvailableSugars() {
  return Object.entries(SUGAR_TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name
  }));
}

/**
 * Toggle anomer (alpha <-> beta)
 * @param {Object} state - Current pyranose state
 * @returns {Object} New state with toggled anomer
 */
export function toggleAnomer(state) {
  const newAnomer = state.anomer === 'alpha' ? 'beta' : 'alpha';
  return createPyranoseState(state.sugarType, newAnomer);
}

/**
 * Change sugar type
 * @param {Object} state - Current state
 * @param {string} sugarType - New sugar type
 * @returns {Object} New state
 */
export function changeSugarType(state, sugarType) {
  return createPyranoseState(sugarType, state.anomer || 'beta');
}
