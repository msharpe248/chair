/**
 * Newman Projection Renderer
 *
 * Renders Newman projections looking down C-C bonds of cyclohexane
 * to help visualize steric interactions.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

// Substituent display names
const SUBSTITUENT_LABELS = {
  'H': 'H',
  'CH3': 'CH₃',
  'C2H5': 'C₂H₅',
  'iPr': 'iPr',
  'tBu': 'tBu',
  'Ph': 'Ph',
  'OH': 'OH',
  'OCH3': 'OCH₃',
  'F': 'F',
  'Cl': 'Cl',
  'Br': 'Br',
  'I': 'I',
  'CN': 'CN',
  'NO2': 'NO₂',
  'NH2': 'NH₂',
  'COOH': 'COOH',
};

/**
 * Create an SVG element
 */
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * Get the Newman projection data for a specific C-C bond
 * @param {Object} state - Molecule state
 * @param {number} bondIndex - Which bond to look down (0-5, where 0 = C1-C2)
 * @returns {Object} Front and back carbon substituents with angles
 */
export function getNewmanData(state, bondIndex) {
  const flipped = state.flipped;

  // Carbon indices for the bond
  const frontCarbon = bondIndex;
  const backCarbon = (bondIndex + 1) % 6;

  // Previous and next carbons in the ring (for ring connections)
  const prevCarbon = (bondIndex + 5) % 6;
  const nextNextCarbon = (bondIndex + 2) % 6;

  // Determine axial direction for each carbon
  // Carbons 0, 2, 4 have axialDir = -1 (up), carbons 1, 3, 5 have axialDir = 1 (down)
  const frontAxialUp = flipped ? (frontCarbon % 2 === 1) : (frontCarbon % 2 === 0);
  const backAxialUp = flipped ? (backCarbon % 2 === 1) : (backCarbon % 2 === 0);

  // Get substituents at each position
  const getSubAt = (carbonIdx, position) => {
    const sub = state.substituents.find(
      s => s.carbonIndex === carbonIdx && s.position === position
    );
    return sub ? sub.group : 'H';
  };

  // Front carbon substituents (three bonds visible):
  // 1. To previous carbon in ring
  // 2. Axial substituent
  // 3. Equatorial substituent

  // Back carbon substituents (three bonds visible):
  // 1. To next-next carbon in ring
  // 2. Axial substituent
  // 3. Equatorial substituent

  // Newman projection angles (0° = up, clockwise)
  // The exact angles depend on the chair geometry
  // In a chair, looking down C1-C2:
  // - Front (C1): ring bond to C6, axial, equatorial
  // - Back (C2): ring bond to C3, axial, equatorial

  // For staggered chair conformation, angles are offset by 60°
  const frontAngles = {
    ring: 180,        // Ring bond points down
    axial: frontAxialUp ? 300 : 60,   // Axial up or down
    equatorial: frontAxialUp ? 60 : 300  // Equatorial opposite
  };

  const backAngles = {
    ring: 0,          // Ring bond points up (staggered from front)
    axial: backAxialUp ? 240 : 120,
    equatorial: backAxialUp ? 120 : 240
  };

  return {
    frontCarbon: frontCarbon + 1,  // 1-indexed for display
    backCarbon: backCarbon + 1,
    front: {
      ring: { label: `C${prevCarbon + 1}`, angle: frontAngles.ring },
      axial: { label: getSubAt(frontCarbon, 'axial'), angle: frontAngles.axial, isAxial: true },
      equatorial: { label: getSubAt(frontCarbon, 'equatorial'), angle: frontAngles.equatorial, isAxial: false }
    },
    back: {
      ring: { label: `C${nextNextCarbon + 1}`, angle: backAngles.ring },
      axial: { label: getSubAt(backCarbon, 'axial'), angle: backAngles.axial, isAxial: true },
      equatorial: { label: getSubAt(backCarbon, 'equatorial'), angle: backAngles.equatorial, isAxial: false }
    }
  };
}

/**
 * Render a Newman projection
 * @param {SVGElement} svg - SVG element to render into
 * @param {Object} state - Molecule state
 * @param {number} bondIndex - Which bond to look down (0-5)
 */
export function renderNewman(svg, state, bondIndex) {
  // Clear existing content
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const data = getNewmanData(state, bondIndex);

  const centerX = 200;
  const centerY = 190;     // Moved down to avoid title overlap
  const frontRadius = 50;  // Front carbon circle
  const bondLength = 70;   // Length of substituent bonds

  const group = createSVGElement('g', { class: 'newman-group' });
  svg.appendChild(group);

  // Draw back carbon bonds first (behind the circle)
  const backGroup = createSVGElement('g', { class: 'newman-back' });
  group.appendChild(backGroup);

  drawNewmanBonds(backGroup, centerX, centerY, frontRadius, bondLength, data.back, true);

  // Draw front carbon circle
  const frontCircle = createSVGElement('circle', {
    cx: centerX,
    cy: centerY,
    r: frontRadius,
    class: 'newman-front-circle'
  });
  group.appendChild(frontCircle);

  // Draw front carbon bonds (in front of circle)
  const frontGroup = createSVGElement('g', { class: 'newman-front' });
  group.appendChild(frontGroup);

  drawNewmanBonds(frontGroup, centerX, centerY, 0, bondLength, data.front, false);

  // Draw center dot for front carbon
  const centerDot = createSVGElement('circle', {
    cx: centerX,
    cy: centerY,
    r: 4,
    class: 'newman-center-dot'
  });
  group.appendChild(centerDot);

  // Add title
  const title = createSVGElement('text', {
    x: centerX,
    y: 30,
    class: 'newman-title',
    'text-anchor': 'middle'
  });
  title.textContent = `Newman Projection: C${data.frontCarbon}–C${data.backCarbon}`;
  group.appendChild(title);

  // Add legend
  const legendY = 320;
  const frontLegend = createSVGElement('text', {
    x: centerX - 60,
    y: legendY,
    class: 'newman-legend',
    'text-anchor': 'middle'
  });
  frontLegend.textContent = `Front: C${data.frontCarbon}`;
  group.appendChild(frontLegend);

  const backLegend = createSVGElement('text', {
    x: centerX + 60,
    y: legendY,
    class: 'newman-legend',
    'text-anchor': 'middle'
  });
  backLegend.textContent = `Back: C${data.backCarbon}`;
  group.appendChild(backLegend);
}

/**
 * Draw bonds for one carbon in Newman projection
 */
function drawNewmanBonds(parent, cx, cy, startRadius, bondLength, carbonData, isBack) {
  const bonds = [carbonData.ring, carbonData.axial, carbonData.equatorial];

  for (const bond of bonds) {
    const angleRad = (bond.angle - 90) * Math.PI / 180;  // -90 to make 0° point up

    // Start point (at circle edge for back, at center for front)
    const startX = cx + Math.cos(angleRad) * startRadius;
    const startY = cy + Math.sin(angleRad) * startRadius;

    // End point
    const endX = cx + Math.cos(angleRad) * (startRadius + bondLength);
    const endY = cy + Math.sin(angleRad) * (startRadius + bondLength);

    // Determine bond style
    let bondClass = 'newman-bond';
    if (isBack) bondClass += ' newman-back-bond';
    if (bond.isAxial) bondClass += ' newman-axial';

    // Draw bond line
    const line = createSVGElement('line', {
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      class: bondClass
    });
    parent.appendChild(line);

    // Draw label
    const labelDistance = startRadius + bondLength + 15;
    const labelX = cx + Math.cos(angleRad) * labelDistance;
    const labelY = cy + Math.sin(angleRad) * labelDistance;

    let labelClass = 'newman-label';
    if (isBack) labelClass += ' newman-back-label';
    if (bond.label !== 'H' && !bond.label.startsWith('C')) {
      labelClass += ' newman-substituent-label';
    }

    const label = createSVGElement('text', {
      x: labelX,
      y: labelY,
      class: labelClass,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    });
    label.textContent = SUBSTITUENT_LABELS[bond.label] || bond.label;
    parent.appendChild(label);
  }
}

/**
 * Get list of available bonds for Newman projection
 * @returns {Array} Array of {index, label} objects
 */
export function getNewmanBondOptions() {
  return [
    { index: 0, label: 'C1–C2' },
    { index: 1, label: 'C2–C3' },
    { index: 2, label: 'C3–C4' },
    { index: 3, label: 'C4–C5' },
    { index: 4, label: 'C5–C6' },
    { index: 5, label: 'C6–C1' }
  ];
}
