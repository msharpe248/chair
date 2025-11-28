/**
 * Chair Conformation Geometry Model
 *
 * Defines the 2D coordinates for a cyclohexane chair conformation
 * and calculates axial/equatorial substituent positions.
 */

// Chair carbon positions (2D projection of chair conformation)
// The chair is drawn with carbons 1,3,5 pointing "up" and 2,4,6 pointing "down"
// This creates the characteristic chair shape when viewed from the side
const CHAIR_CARBONS = [
  { id: 1, x: 120, y: 60,  axialDir: -1 },  // C1 - up carbon (axial points up)
  { id: 2, x: 200, y: 100, axialDir: 1 },   // C2 - down carbon (axial points down)
  { id: 3, x: 240, y: 180, axialDir: -1 },  // C3 - up carbon
  { id: 4, x: 200, y: 260, axialDir: 1 },   // C4 - down carbon
  { id: 5, x: 120, y: 220, axialDir: -1 },  // C5 - up carbon
  { id: 6, x: 80,  y: 140, axialDir: 1 },   // C6 - down carbon
];

// Bond length for substituents
const AXIAL_LENGTH = 45;
const EQUATORIAL_LENGTH = 40;

/**
 * Get the coordinates for all 6 carbons in the chair
 * @param {boolean} flipped - If true, return the ring-flipped conformation
 * @returns {Array} Array of carbon position objects
 */
export function getChairCarbons(flipped = false) {
  if (!flipped) {
    return CHAIR_CARBONS.map(c => ({ ...c }));
  }

  // Ring flip: axial directions swap
  return CHAIR_CARBONS.map(c => ({
    ...c,
    axialDir: -c.axialDir
  }));
}

/**
 * Get the bonds connecting the carbons (for drawing the ring)
 * @returns {Array} Array of bond objects with start and end carbon indices
 */
export function getChairBonds() {
  return [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 0 },
  ];
}

/**
 * Calculate the position for a substituent at a given carbon
 * @param {number} carbonIndex - Index of the carbon (0-5)
 * @param {string} position - 'axial' or 'equatorial'
 * @param {boolean} flipped - Whether the chair is flipped
 * @returns {Object} {x, y, labelX, labelY} coordinates for bond end and label
 */
export function getSubstituentPosition(carbonIndex, position, flipped = false) {
  const carbons = getChairCarbons(flipped);
  const carbon = carbons[carbonIndex];
  const prevCarbon = carbons[(carbonIndex + 5) % 6];
  const nextCarbon = carbons[(carbonIndex + 1) % 6];

  if (position === 'axial') {
    // Axial: straight up or down
    const y = carbon.y + (carbon.axialDir * AXIAL_LENGTH);
    return {
      x: carbon.x,
      y: y,
      labelX: carbon.x,
      labelY: y + (carbon.axialDir * 15),
      bondStartX: carbon.x,
      bondStartY: carbon.y,
    };
  } else {
    // Equatorial: roughly in the plane of the ring, pointing outward
    // Direction is approximately bisecting the two adjacent C-C bonds
    // and pointing away from the ring center

    // Calculate outward direction (away from ring center)
    const centerX = 160;
    const centerY = 160;

    // Vector from center to this carbon
    let dx = carbon.x - centerX;
    let dy = carbon.y - centerY;

    // Normalize
    const len = Math.sqrt(dx * dx + dy * dy);
    dx = dx / len;
    dy = dy / len;

    // Add a slight vertical component based on axial direction (opposite)
    // This gives the characteristic "splayed" look of equatorial bonds
    dy += carbon.axialDir * 0.3;

    // Renormalize
    const len2 = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / len2) * EQUATORIAL_LENGTH;
    dy = (dy / len2) * EQUATORIAL_LENGTH;

    return {
      x: carbon.x + dx,
      y: carbon.y + dy,
      labelX: carbon.x + dx * 1.4,
      labelY: carbon.y + dy * 1.4,
      bondStartX: carbon.x,
      bondStartY: carbon.y,
    };
  }
}

/**
 * Get label positions for axial/equatorial indicators
 * @param {number} carbonIndex - Index of the carbon (0-5)
 * @param {boolean} flipped - Whether the chair is flipped
 * @returns {Object} {axial: {x, y}, equatorial: {x, y}}
 */
export function getLabelPositions(carbonIndex, flipped = false) {
  const axialPos = getSubstituentPosition(carbonIndex, 'axial', flipped);
  const eqPos = getSubstituentPosition(carbonIndex, 'equatorial', flipped);

  return {
    axial: { x: axialPos.labelX, y: axialPos.labelY },
    equatorial: { x: eqPos.labelX, y: eqPos.labelY }
  };
}

/**
 * Determine if a position is axial "up" or "down" in the current conformation
 * @param {number} carbonIndex - Index of the carbon (0-5)
 * @param {boolean} flipped - Whether the chair is flipped
 * @returns {string} 'up' or 'down'
 */
export function getAxialDirection(carbonIndex, flipped = false) {
  const carbons = getChairCarbons(flipped);
  return carbons[carbonIndex].axialDir === -1 ? 'up' : 'down';
}

/**
 * Create a molecule state object
 * @returns {Object} Initial molecule state
 */
export function createMoleculeState() {
  return {
    mode: 'cyclohexane',
    flipped: false,
    substituents: [
      // Default: all hydrogens (implicit, but we can track explicit ones)
      // Each entry: { carbonIndex, position: 'axial'|'equatorial', group: 'CH3'|'OH'|etc }
    ]
  };
}

/**
 * Add or update a substituent
 * @param {Object} state - Current molecule state
 * @param {number} carbonIndex - Carbon index (0-5)
 * @param {string} position - 'axial' or 'equatorial'
 * @param {string} group - Substituent group name
 * @returns {Object} Updated state
 */
export function setSubstituent(state, carbonIndex, position, group) {
  const newState = { ...state, substituents: [...state.substituents] };

  // Remove existing substituent at this position if any
  newState.substituents = newState.substituents.filter(
    s => !(s.carbonIndex === carbonIndex && s.position === position)
  );

  // Add new substituent (unless it's H, which is implicit)
  if (group !== 'H') {
    newState.substituents.push({ carbonIndex, position, group });
  }

  return newState;
}

/**
 * Remove a substituent (replace with implicit H)
 * @param {Object} state - Current molecule state
 * @param {number} carbonIndex - Carbon index (0-5)
 * @param {string} position - 'axial' or 'equatorial'
 * @returns {Object} Updated state
 */
export function removeSubstituent(state, carbonIndex, position) {
  return {
    ...state,
    substituents: state.substituents.filter(
      s => !(s.carbonIndex === carbonIndex && s.position === position)
    )
  };
}

/**
 * Get substituent at a specific position
 * @param {Object} state - Current molecule state
 * @param {number} carbonIndex - Carbon index (0-5)
 * @param {string} position - 'axial' or 'equatorial'
 * @returns {string|null} Substituent group or null if H
 */
export function getSubstituent(state, carbonIndex, position) {
  const sub = state.substituents.find(
    s => s.carbonIndex === carbonIndex && s.position === position
  );
  return sub ? sub.group : null;
}

/**
 * Flip the chair conformation
 * @param {Object} state - Current molecule state
 * @returns {Object} Updated state with flipped flag toggled
 */
export function flipChair(state) {
  return {
    ...state,
    flipped: !state.flipped
  };
}

/**
 * Reset the molecule to initial state
 * @returns {Object} Fresh molecule state
 */
export function resetMolecule() {
  return createMoleculeState();
}
