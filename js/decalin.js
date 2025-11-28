/**
 * Decalin (Fused Ring) Support
 *
 * Handles chair conformations for decalin (bicyclo[4.4.0]decane),
 * which consists of two fused cyclohexane rings sharing two carbons.
 */

/**
 * Decalin geometry - two fused chairs
 *
 * Ring A: C1-C2-C3-C4-C9-C10 (left ring)
 * Ring B: C5-C6-C7-C8-C9-C10 (right ring)
 * Bridgehead carbons: C9 and C10 (shared between rings)
 *
 * For trans-decalin: bridgehead H's are on opposite faces (diequatorial fusion)
 * For cis-decalin: bridgehead H's are on same face (axial-equatorial fusion)
 */

// Coordinates for the left ring (Ring A)
const RING_A_COORDS = [
  { id: 'C1',  x: 60,  y: 80,  axialDir: -1 },
  { id: 'C2',  x: 120, y: 60,  axialDir: 1 },
  { id: 'C3',  x: 180, y: 80,  axialDir: -1 },
  { id: 'C10', x: 180, y: 160, axialDir: 1 },  // Bridgehead
  { id: 'C9',  x: 120, y: 180, axialDir: -1 }, // Bridgehead
  { id: 'C8',  x: 60,  y: 160, axialDir: 1 },
];

// Coordinates for the right ring (Ring B) - shares C9 and C10 with Ring A
const RING_B_COORDS = [
  { id: 'C10', x: 180, y: 160, axialDir: 1 },  // Bridgehead (shared)
  { id: 'C4',  x: 240, y: 140, axialDir: -1 },
  { id: 'C5',  x: 300, y: 160, axialDir: 1 },
  { id: 'C6',  x: 300, y: 240, axialDir: -1 },
  { id: 'C7',  x: 240, y: 260, axialDir: 1 },
  { id: 'C9',  x: 180, y: 240, axialDir: -1 }, // Bridgehead (shared)
];

// Combined decalin coordinates (10 unique carbons)
// trans-decalin geometry (most stable, both rings in chair form)
export const TRANS_DECALIN_COORDS = [
  { id: 'C1',  x: 80,  y: 60,  axialDir: -1, ring: 'A' },
  { id: 'C2',  x: 140, y: 40,  axialDir: 1,  ring: 'A' },
  { id: 'C3',  x: 200, y: 60,  axialDir: -1, ring: 'A' },
  { id: 'C4',  x: 260, y: 100, axialDir: 1,  ring: 'B' },
  { id: 'C5',  x: 300, y: 160, axialDir: -1, ring: 'B' },
  { id: 'C6',  x: 280, y: 230, axialDir: 1,  ring: 'B' },
  { id: 'C7',  x: 220, y: 250, axialDir: -1, ring: 'B' },
  { id: 'C8',  x: 100, y: 200, axialDir: 1,  ring: 'A' },
  { id: 'C9',  x: 160, y: 220, axialDir: -1, ring: 'AB' }, // Bridgehead
  { id: 'C10', x: 200, y: 140, axialDir: 1,  ring: 'AB' }, // Bridgehead
];

// cis-decalin has different geometry - the rings are folded
export const CIS_DECALIN_COORDS = [
  { id: 'C1',  x: 80,  y: 80,  axialDir: -1, ring: 'A' },
  { id: 'C2',  x: 140, y: 60,  axialDir: 1,  ring: 'A' },
  { id: 'C3',  x: 200, y: 80,  axialDir: -1, ring: 'A' },
  { id: 'C4',  x: 260, y: 120, axialDir: -1, ring: 'B' },  // Note: same dir as C3
  { id: 'C5',  x: 300, y: 180, axialDir: 1,  ring: 'B' },
  { id: 'C6',  x: 280, y: 250, axialDir: -1, ring: 'B' },
  { id: 'C7',  x: 220, y: 270, axialDir: 1,  ring: 'B' },
  { id: 'C8',  x: 100, y: 210, axialDir: 1,  ring: 'A' },
  { id: 'C9',  x: 160, y: 230, axialDir: -1, ring: 'AB' }, // Bridgehead
  { id: 'C10', x: 200, y: 160, axialDir: 1,  ring: 'AB' }, // Bridgehead
];

/**
 * Get decalin coordinates
 * @param {string} type - 'cis' or 'trans'
 * @param {boolean} flipped - Whether the conformation is flipped
 * @returns {Array} Array of carbon position objects
 */
export function getDecalinCoords(type = 'trans', flipped = false) {
  const baseCoords = type === 'cis' ? CIS_DECALIN_COORDS : TRANS_DECALIN_COORDS;

  if (!flipped) {
    return baseCoords.map(c => ({ ...c }));
  }

  // For cis-decalin, ring flip swaps axial/equatorial
  // For trans-decalin, ring flip is not possible (it's locked)
  if (type === 'trans') {
    // Trans-decalin cannot flip - return same coords
    return baseCoords.map(c => ({ ...c }));
  }

  // Cis-decalin can flip - reverse axial directions
  return baseCoords.map(c => ({
    ...c,
    axialDir: -c.axialDir
  }));
}

/**
 * Get the bonds for decalin
 * Ring A: C1-C2-C3-C10-C9-C8-C1
 * Ring B: C10-C4-C5-C6-C7-C9-C10
 * @returns {Array} Array of bond objects with ring information
 */
export function getDecalinBonds() {
  return [
    // Ring A
    { from: 0, to: 1, ring: 'A' },   // C1-C2
    { from: 1, to: 2, ring: 'A' },   // C2-C3
    { from: 2, to: 9, ring: 'A' },   // C3-C10
    { from: 9, to: 8, ring: 'AB' },  // C10-C9 (bridging bond)
    { from: 8, to: 7, ring: 'A' },   // C9-C8
    { from: 7, to: 0, ring: 'A' },   // C8-C1

    // Ring B
    { from: 9, to: 3, ring: 'B' },   // C10-C4
    { from: 3, to: 4, ring: 'B' },   // C4-C5
    { from: 4, to: 5, ring: 'B' },   // C5-C6
    { from: 5, to: 6, ring: 'B' },   // C6-C7
    { from: 6, to: 8, ring: 'B' },   // C7-C9
  ];
}

/**
 * Create a decalin molecule state
 * @param {string} type - 'cis' or 'trans'
 * @returns {Object} Molecule state
 */
export function createDecalinState(type = 'trans') {
  return {
    mode: 'decalin',
    decalinType: type,
    flipped: false,
    substituents: []
    // Note: Decalin substituent support can be added later
    // For now, we show the parent hydrocarbon
  };
}

/**
 * Check if ring flip is possible
 * @param {string} type - 'cis' or 'trans'
 * @returns {boolean}
 */
export function canFlip(type) {
  // Trans-decalin is locked and cannot ring flip
  // Cis-decalin can ring flip
  return type === 'cis';
}

/**
 * Get information about the decalin type
 * @param {string} type - 'cis' or 'trans'
 * @returns {Object} Information object
 */
export function getDecalinInfo(type) {
  if (type === 'trans') {
    return {
      name: 'trans-Decalin',
      description: 'Bridgehead hydrogens on opposite faces (diequatorial). Rigid - cannot ring flip.',
      canFlip: false,
      relativeEnergy: 0, // More stable
    };
  } else {
    return {
      name: 'cis-Decalin',
      description: 'Bridgehead hydrogens on same face. Can undergo ring flip.',
      canFlip: true,
      relativeEnergy: 2.7, // ~2.7 kcal/mol less stable than trans
    };
  }
}

/**
 * Toggle decalin type (cis <-> trans)
 * @param {Object} state - Current state
 * @returns {Object} New state
 */
export function toggleDecalinType(state) {
  const newType = state.decalinType === 'cis' ? 'trans' : 'cis';
  return createDecalinState(newType);
}
