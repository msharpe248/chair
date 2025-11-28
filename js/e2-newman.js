/**
 * E2 Newman Projection Renderer
 *
 * Renders Newman projections specifically for E2 elimination visualization,
 * highlighting anti-periplanar relationships between leaving groups and β-hydrogens.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with attributes
 */
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * E2 Newman projection configurations for different substrates
 */
export const E2_NEWMAN_CONFIGS = {
  '2-bromobutane': {
    name: '2-Bromobutane',
    frontCarbon: {
      label: 'C2 (α)',
      // Positions: angle in degrees (0 = up, clockwise)
      bonds: [
        { angle: 180, label: 'CH₃', type: 'alkyl' },
        { angle: 300, label: 'H', type: 'hydrogen' },
        { angle: 60, label: 'Br', type: 'leaving-group' }
      ]
    },
    backCarbon: {
      label: 'C3 (β)',
      bonds: [
        { angle: 0, label: 'CH₃', type: 'alkyl' },
        { angle: 120, label: 'H', type: 'hydrogen', canEliminate: false },  // Gauche to Br
        { angle: 240, label: 'H', type: 'hydrogen', canEliminate: true }    // Anti to Br
      ]
    },
    products: {
      anti: { name: '(E)-2-butene', isZaitsev: true },
      note: 'Anti H at 240° eliminates with Br at 60° (180° dihedral)'
    }
  },
  '2-bromopentane': {
    name: '2-Bromopentane',
    frontCarbon: {
      label: 'C2 (α)',
      bonds: [
        { angle: 180, label: 'CH₃', type: 'alkyl' },
        { angle: 300, label: 'H', type: 'hydrogen' },
        { angle: 60, label: 'Br', type: 'leaving-group' }
      ]
    },
    backCarbon: {
      label: 'C3 (β)',
      bonds: [
        { angle: 0, label: 'C₂H₅', type: 'alkyl' },
        { angle: 120, label: 'H', type: 'hydrogen', canEliminate: false },
        { angle: 240, label: 'H', type: 'hydrogen', canEliminate: true }
      ]
    },
    products: {
      anti: { name: '(E)-2-pentene', isZaitsev: true }
    }
  },
  'cyclohexyl-bromide': {
    name: 'Bromocyclohexane (axial Br)',
    frontCarbon: {
      label: 'C1 (α)',
      bonds: [
        { angle: 180, label: 'C6', type: 'ring' },
        { angle: 300, label: 'H', type: 'hydrogen', position: 'equatorial' },
        { angle: 60, label: 'Br', type: 'leaving-group', position: 'axial' }
      ]
    },
    backCarbon: {
      label: 'C2 (β)',
      bonds: [
        { angle: 0, label: 'C3', type: 'ring' },
        { angle: 120, label: 'H', type: 'hydrogen', position: 'equatorial', canEliminate: false },
        { angle: 240, label: 'H', type: 'hydrogen', position: 'axial', canEliminate: true }
      ]
    },
    products: {
      anti: { name: 'Cyclohexene', isZaitsev: true },
      note: 'Only axial β-H (240°) is anti to axial Br (60°)'
    },
    isCyclic: true
  },
  'menthyl-chloride': {
    name: 'Menthyl chloride (axial Cl)',
    frontCarbon: {
      label: 'C1 (α)',
      bonds: [
        { angle: 180, label: 'C6', type: 'ring' },
        { angle: 300, label: 'iPr', type: 'alkyl', position: 'equatorial' },
        { angle: 60, label: 'Cl', type: 'leaving-group', position: 'axial' }
      ]
    },
    backCarbon: {
      label: 'C2 (β)',
      bonds: [
        { angle: 0, label: 'C3', type: 'ring' },
        { angle: 120, label: 'CH₃', type: 'alkyl', position: 'equatorial' },
        { angle: 240, label: 'H', type: 'hydrogen', position: 'axial', canEliminate: true }
      ]
    },
    products: {
      anti: { name: '2-Menthene' },
      note: 'Only one β-H available, and it is anti-periplanar'
    },
    isCyclic: true
  },
  'neomenthyl-chloride': {
    name: 'Neomenthyl chloride (equatorial Cl)',
    frontCarbon: {
      label: 'C1 (α)',
      bonds: [
        { angle: 180, label: 'C6', type: 'ring' },
        { angle: 60, label: 'iPr', type: 'alkyl', position: 'axial' },
        { angle: 300, label: 'Cl', type: 'leaving-group', position: 'equatorial' }
      ]
    },
    backCarbon: {
      label: 'C2 (β)',
      bonds: [
        { angle: 0, label: 'C3', type: 'ring' },
        { angle: 240, label: 'CH₃', type: 'alkyl', position: 'axial' },
        { angle: 120, label: 'H', type: 'hydrogen', position: 'equatorial', canEliminate: false }
      ]
    },
    products: {
      anti: { name: 'Cannot eliminate without ring flip' },
      note: 'Equatorial Cl has no anti-periplanar H - must ring flip first!'
    },
    isCyclic: true,
    needsRingFlip: true
  }
};

/**
 * Render E2 Newman projection with anti-periplanar highlighting
 * @param {SVGElement} svg - SVG element to render into
 * @param {string} substrateKey - Key for E2_NEWMAN_CONFIGS
 * @param {boolean} showHighlighting - Whether to highlight anti-periplanar relationships
 */
export function renderE2Newman(svg, substrateKey, showHighlighting = true) {
  // Clear existing content
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const config = E2_NEWMAN_CONFIGS[substrateKey];
  if (!config) {
    console.error('Unknown E2 substrate:', substrateKey);
    return;
  }

  const centerX = 200;
  const centerY = 175;
  const frontRadius = 50;
  const bondLength = 70;

  const group = createSVGElement('g', { class: 'e2-newman-group' });
  svg.appendChild(group);

  // Find the leaving group angle
  const lgBond = config.frontCarbon.bonds.find(b => b.type === 'leaving-group');
  const lgAngle = lgBond ? lgBond.angle : 0;
  const antiAngle = (lgAngle + 180) % 360;

  // Draw anti-periplanar indicator arc (if highlighting)
  if (showHighlighting && lgBond) {
    drawAntiArc(group, centerX, centerY, frontRadius + bondLength + 25, lgAngle, antiAngle);
  }

  // Draw back carbon bonds first (behind the circle)
  const backGroup = createSVGElement('g', { class: 'newman-back' });
  group.appendChild(backGroup);
  drawE2Bonds(backGroup, centerX, centerY, frontRadius, bondLength, config.backCarbon.bonds, true, lgAngle, showHighlighting);

  // Draw front carbon circle
  const frontCircle = createSVGElement('circle', {
    cx: centerX,
    cy: centerY,
    r: frontRadius,
    class: 'newman-front-circle'
  });
  group.appendChild(frontCircle);

  // Draw front carbon bonds
  const frontGroup = createSVGElement('g', { class: 'newman-front' });
  group.appendChild(frontGroup);
  drawE2Bonds(frontGroup, centerX, centerY, 0, bondLength, config.frontCarbon.bonds, false, lgAngle, showHighlighting);

  // Draw center dot
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
  title.textContent = config.name;
  group.appendChild(title);

  // Add carbon labels
  const frontLabel = createSVGElement('text', {
    x: centerX - 80,
    y: centerY + 5,
    class: 'newman-legend',
    'text-anchor': 'middle',
    'font-size': '11'
  });
  frontLabel.textContent = config.frontCarbon.label;
  group.appendChild(frontLabel);

  const backLabel = createSVGElement('text', {
    x: centerX + 80,
    y: centerY + 5,
    class: 'newman-legend',
    'text-anchor': 'middle',
    'font-size': '11'
  });
  backLabel.textContent = config.backCarbon.label;
  group.appendChild(backLabel);

  // Add dihedral angle labels if highlighting
  if (showHighlighting) {
    addDihedralLabels(group, centerX, centerY, frontRadius, bondLength, config, lgAngle);
  }

  // Add note if present
  if (config.products && config.products.note) {
    const note = createSVGElement('text', {
      x: centerX,
      y: 330,
      class: 'e2-note',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: 'var(--text-secondary)'
    });
    note.textContent = config.products.note;
    group.appendChild(note);
  }

  // Warning for neomenthyl
  if (config.needsRingFlip) {
    const warning = createSVGElement('text', {
      x: centerX,
      y: 310,
      class: 'e2-warning',
      'text-anchor': 'middle',
      'font-size': '12',
      fill: '#dc2626',
      'font-weight': '600'
    });
    warning.textContent = '⚠ No anti-periplanar H available!';
    group.appendChild(warning);
  }
}

/**
 * Draw bonds with E2-specific highlighting
 */
function drawE2Bonds(parent, cx, cy, startRadius, bondLength, bonds, isBack, lgAngle, showHighlighting) {
  for (const bond of bonds) {
    const angleRad = (bond.angle - 90) * Math.PI / 180;

    // Start and end points
    const startX = cx + Math.cos(angleRad) * startRadius;
    const startY = cy + Math.sin(angleRad) * startRadius;
    const endX = cx + Math.cos(angleRad) * (startRadius + bondLength);
    const endY = cy + Math.sin(angleRad) * (startRadius + bondLength);

    // Determine bond class based on type and anti-periplanar relationship
    let bondClass = 'newman-bond';
    if (isBack) bondClass += ' newman-back-bond';

    // Calculate dihedral angle from leaving group
    const dihedral = Math.abs(bond.angle - lgAngle);
    const normalizedDihedral = Math.min(dihedral, 360 - dihedral);
    const isAnti = normalizedDihedral >= 150 && normalizedDihedral <= 210;
    const isGauche = normalizedDihedral >= 50 && normalizedDihedral <= 70;

    if (showHighlighting) {
      if (bond.type === 'leaving-group') {
        bondClass += ' e2-leaving-group';
      } else if (bond.type === 'hydrogen' && isAnti && bond.canEliminate !== false) {
        bondClass += ' e2-anti';
      } else if (bond.type === 'hydrogen' && isGauche) {
        bondClass += ' e2-gauche';
      }
    }

    // Draw bond line
    const line = createSVGElement('line', {
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      class: bondClass
    });
    parent.appendChild(line);

    // Draw endpoint circle for highlighted bonds
    if (showHighlighting && (bond.type === 'leaving-group' || (bond.type === 'hydrogen' && (isAnti || isGauche)))) {
      let circleClass = '';
      if (bond.type === 'leaving-group') {
        circleClass = 'e2-highlight-lg';
      } else if (isAnti && bond.canEliminate !== false) {
        circleClass = 'e2-highlight-anti';
      } else if (isGauche) {
        circleClass = 'e2-highlight-gauche';
      }

      if (circleClass) {
        const circle = createSVGElement('circle', {
          cx: endX,
          cy: endY,
          r: 8,
          class: circleClass
        });
        parent.appendChild(circle);
      }
    }

    // Draw label
    const labelDistance = startRadius + bondLength + 18;
    const labelX = cx + Math.cos(angleRad) * labelDistance;
    const labelY = cy + Math.sin(angleRad) * labelDistance;

    let labelClass = 'newman-label';
    if (isBack) labelClass += ' newman-back-label';

    if (showHighlighting) {
      if (bond.type === 'leaving-group') {
        labelClass += ' e2-leaving-group';
      } else if (bond.type === 'hydrogen' && isAnti && bond.canEliminate !== false) {
        labelClass += ' e2-anti';
      } else if (bond.type === 'hydrogen' && isGauche) {
        labelClass += ' e2-gauche';
      }
    }

    const label = createSVGElement('text', {
      x: labelX,
      y: labelY,
      class: labelClass,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    });
    label.textContent = bond.label;
    parent.appendChild(label);
  }
}

/**
 * Draw arc indicating anti-periplanar relationship
 */
function drawAntiArc(parent, cx, cy, radius, lgAngle, antiAngle) {
  // Draw a curved line connecting LG position to anti position
  const lgRad = (lgAngle - 90) * Math.PI / 180;
  const antiRad = (antiAngle - 90) * Math.PI / 180;

  const lgX = cx + Math.cos(lgRad) * radius;
  const lgY = cy + Math.sin(lgRad) * radius;
  const antiX = cx + Math.cos(antiRad) * radius;
  const antiY = cy + Math.sin(antiRad) * radius;

  // Draw dashed line between LG and anti position
  const line = createSVGElement('line', {
    x1: lgX,
    y1: lgY,
    x2: antiX,
    y2: antiY,
    class: 'e2-anti-arc'
  });
  parent.appendChild(line);

  // Add "180°" label in the middle
  const midX = (lgX + antiX) / 2;
  const midY = (lgY + antiY) / 2;

  // Offset the label perpendicular to the line
  const perpAngle = Math.atan2(antiY - lgY, antiX - lgX) + Math.PI / 2;
  const offsetX = Math.cos(perpAngle) * 15;
  const offsetY = Math.sin(perpAngle) * 15;

  const label = createSVGElement('text', {
    x: midX + offsetX,
    y: midY + offsetY,
    class: 'e2-dihedral-label',
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    fill: '#22c55e',
    'font-weight': '600'
  });
  label.textContent = '180°';
  parent.appendChild(label);
}

/**
 * Add dihedral angle labels to hydrogen positions
 */
function addDihedralLabels(parent, cx, cy, frontRadius, bondLength, config, lgAngle) {
  for (const bond of config.backCarbon.bonds) {
    if (bond.type !== 'hydrogen') continue;

    const dihedral = Math.abs(bond.angle - lgAngle);
    const normalizedDihedral = Math.min(dihedral, 360 - dihedral);

    const angleRad = (bond.angle - 90) * Math.PI / 180;
    const labelDistance = frontRadius + bondLength + 35;
    const labelX = cx + Math.cos(angleRad) * labelDistance;
    const labelY = cy + Math.sin(angleRad) * labelDistance;

    const label = createSVGElement('text', {
      x: labelX,
      y: labelY,
      class: 'e2-dihedral-label',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    });
    label.textContent = `(${Math.round(normalizedDihedral)}°)`;
    parent.appendChild(label);
  }
}

/**
 * Get analysis data for a substrate
 */
export function getE2Analysis(substrateKey, baseType) {
  const config = E2_NEWMAN_CONFIGS[substrateKey];
  if (!config) return null;

  const lgBond = config.frontCarbon.bonds.find(b => b.type === 'leaving-group');
  const lgAngle = lgBond ? lgBond.angle : 0;

  const products = [];
  for (const bond of config.backCarbon.bonds) {
    if (bond.type !== 'hydrogen') continue;

    const dihedral = Math.abs(bond.angle - lgAngle);
    const normalizedDihedral = Math.min(dihedral, 360 - dihedral);
    const isAnti = normalizedDihedral >= 150 && normalizedDihedral <= 210;

    products.push({
      hydrogen: bond.label,
      position: bond.position || 'N/A',
      dihedral: Math.round(normalizedDihedral),
      isAnti: isAnti,
      canEliminate: isAnti && bond.canEliminate !== false
    });
  }

  // Determine major product based on base
  const bulkyBases = ['tBuOK', 'DBU', 'LDA'];
  const isBulky = bulkyBases.includes(baseType);

  return {
    substrate: config.name,
    leavingGroup: lgBond ? lgBond.label : 'Unknown',
    products: products,
    majorProduct: config.products ? config.products.anti : null,
    isBulkyBase: isBulky,
    needsRingFlip: config.needsRingFlip || false,
    note: config.products ? config.products.note : null
  };
}
