/**
 * Mechanism Renderer Module
 *
 * SVG rendering for animated curved-arrow mechanisms
 * with step-by-step visualization.
 */

import { MECHANISMS, getStepData } from './mechanism-animator.js';

const NS = 'http://www.w3.org/2000/svg';

const COLORS = {
  carbon: '#1e293b',
  bond: '#334155',
  electronArrow: '#dc2626',
  nucleophile: '#059669',
  leavingGroup: '#dc2626',
  carbocation: '#f59e0b',
  intermediate: '#8b5cf6',
  pi: '#2563eb',
  text: '#334155',
  highlight: '#fef3c7',
  background: '#f8fafc'
};

/**
 * Create SVG element
 */
function createSVG(tag, attrs = {}) {
  const el = document.createElementNS(NS, tag);
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, val);
  }
  return el;
}

/**
 * Add defs with arrow markers and gradients
 */
function addDefs(svg) {
  const defs = createSVG('defs');

  // Curved arrow marker (for electron flow)
  const electronMarker = createSVG('marker', {
    id: 'electron-arrow',
    markerWidth: '10',
    markerHeight: '7',
    refX: '9',
    refY: '3.5',
    orient: 'auto'
  });
  electronMarker.appendChild(createSVG('polygon', {
    points: '0 0, 10 3.5, 0 7',
    fill: COLORS.electronArrow
  }));
  defs.appendChild(electronMarker);

  // Nucleophile arrow marker
  const nucMarker = createSVG('marker', {
    id: 'nuc-arrow',
    markerWidth: '10',
    markerHeight: '7',
    refX: '9',
    refY: '3.5',
    orient: 'auto'
  });
  nucMarker.appendChild(createSVG('polygon', {
    points: '0 0, 10 3.5, 0 7',
    fill: COLORS.nucleophile
  }));
  defs.appendChild(nucMarker);

  // Reaction arrow marker
  const rxnMarker = createSVG('marker', {
    id: 'rxn-arrow',
    markerWidth: '12',
    markerHeight: '8',
    refX: '11',
    refY: '4',
    orient: 'auto'
  });
  rxnMarker.appendChild(createSVG('polygon', {
    points: '0 0, 12 4, 0 8',
    fill: COLORS.bond
  }));
  defs.appendChild(rxnMarker);

  svg.appendChild(defs);
}

/**
 * Draw a curved arrow representing electron flow
 */
function drawCurvedArrow(svg, x1, y1, x2, y2, curve = 30, color = COLORS.electronArrow) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - curve;

  const path = createSVG('path', {
    d: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`,
    fill: 'none',
    stroke: color,
    'stroke-width': '2.5',
    'marker-end': color === COLORS.nucleophile ? 'url(#nuc-arrow)' : 'url(#electron-arrow)'
  });

  svg.appendChild(path);
  return path;
}

/**
 * Draw a molecule structure (simplified)
 */
function drawMolecule(svg, config, x, y) {
  const g = createSVG('g', { transform: `translate(${x}, ${y})` });

  // Central carbon
  const carbonCircle = createSVG('circle', {
    cx: '0', cy: '0', r: '15',
    fill: 'white',
    stroke: config.isIntermediate ? COLORS.carbocation : COLORS.carbon,
    'stroke-width': '2'
  });
  g.appendChild(carbonCircle);

  const carbonLabel = createSVG('text', {
    x: '0', y: '5',
    'text-anchor': 'middle',
    'font-size': '12',
    'font-weight': '600',
    fill: config.isIntermediate ? COLORS.carbocation : COLORS.carbon
  });
  carbonLabel.textContent = config.label || 'C';
  g.appendChild(carbonLabel);

  // Draw bonds to substituents
  const positions = [
    { angle: -90, label: config.top || 'R₁' },
    { angle: 180, label: config.left || 'R₂' },
    { angle: 0, label: config.right || 'R₃' },
    { angle: 90, label: config.bottom || 'H' }
  ];

  positions.forEach((pos, i) => {
    if (config.hidePositions && config.hidePositions.includes(i)) return;

    const rad = pos.angle * Math.PI / 180;
    const bondLength = 40;
    const x2 = Math.cos(rad) * bondLength;
    const y2 = Math.sin(rad) * bondLength;

    // Bond
    const bond = createSVG('line', {
      x1: Math.cos(rad) * 15,
      y1: Math.sin(rad) * 15,
      x2: x2,
      y2: y2,
      stroke: pos.label === config.leavingGroup ? COLORS.leavingGroup : COLORS.bond,
      'stroke-width': '2',
      'stroke-dasharray': pos.isDashed ? '4,2' : 'none'
    });
    g.appendChild(bond);

    // Label
    const labelX = Math.cos(rad) * (bondLength + 12);
    const labelY = Math.sin(rad) * (bondLength + 12) + 4;

    const label = createSVG('text', {
      x: labelX, y: labelY,
      'text-anchor': 'middle',
      'font-size': '11',
      fill: pos.label === config.leavingGroup ? COLORS.leavingGroup :
            pos.label === config.nucleophile ? COLORS.nucleophile : COLORS.text
    });
    label.textContent = pos.label;
    g.appendChild(label);
  });

  svg.appendChild(g);
  return g;
}

/**
 * Draw a planar carbocation (sp2)
 */
function drawCarbocation(svg, x, y, groups = ['R₁', 'R₂', 'R₃']) {
  const g = createSVG('g', { transform: `translate(${x}, ${y})` });

  // Empty p orbital representation
  const pOrbital = createSVG('ellipse', {
    cx: '0', cy: '0',
    rx: '8', ry: '25',
    fill: 'none',
    stroke: COLORS.carbocation,
    'stroke-width': '1.5',
    'stroke-dasharray': '3,2',
    opacity: '0.6'
  });
  g.appendChild(pOrbital);

  // Central carbon with + charge
  const carbonBg = createSVG('circle', {
    cx: '0', cy: '0', r: '14',
    fill: '#fef3c7',
    stroke: COLORS.carbocation,
    'stroke-width': '2'
  });
  g.appendChild(carbonBg);

  const carbonLabel = createSVG('text', {
    x: '0', y: '5',
    'text-anchor': 'middle',
    'font-size': '11',
    'font-weight': '600',
    fill: '#92400e'
  });
  carbonLabel.textContent = 'C⁺';
  g.appendChild(carbonLabel);

  // Trigonal planar bonds at 120° apart
  const angles = [-90, 150, 30];
  groups.forEach((group, i) => {
    const rad = angles[i] * Math.PI / 180;
    const bondLength = 35;

    const bond = createSVG('line', {
      x1: Math.cos(rad) * 14,
      y1: Math.sin(rad) * 14,
      x2: Math.cos(rad) * bondLength,
      y2: Math.sin(rad) * bondLength,
      stroke: COLORS.bond,
      'stroke-width': '2'
    });
    g.appendChild(bond);

    const label = createSVG('text', {
      x: Math.cos(rad) * (bondLength + 10),
      y: Math.sin(rad) * (bondLength + 10) + 4,
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    label.textContent = group;
    g.appendChild(label);
  });

  svg.appendChild(g);
  return g;
}

/**
 * Draw an alkene (double bond)
 */
function drawAlkene(svg, x, y, groups = ['R₁', 'H', 'R₂', 'H']) {
  const g = createSVG('g', { transform: `translate(${x}, ${y})` });

  // Double bond
  const bond1 = createSVG('line', {
    x1: '-20', y1: '-3', x2: '20', y2: '-3',
    stroke: COLORS.bond, 'stroke-width': '2'
  });
  const bond2 = createSVG('line', {
    x1: '-20', y1: '3', x2: '20', y2: '3',
    stroke: COLORS.pi, 'stroke-width': '2'
  });
  g.appendChild(bond1);
  g.appendChild(bond2);

  // Left carbon
  const c1 = createSVG('text', {
    x: '-20', y: '5', 'text-anchor': 'middle',
    'font-size': '12', 'font-weight': '600', fill: COLORS.carbon
  });
  c1.textContent = 'C';
  g.appendChild(c1);

  // Right carbon
  const c2 = createSVG('text', {
    x: '20', y: '5', 'text-anchor': 'middle',
    'font-size': '12', 'font-weight': '600', fill: COLORS.carbon
  });
  c2.textContent = 'C';
  g.appendChild(c2);

  // Substituents
  const positions = [
    { x: -35, y: -20, label: groups[0] },
    { x: -35, y: 25, label: groups[1] },
    { x: 35, y: -20, label: groups[2] },
    { x: 35, y: 25, label: groups[3] }
  ];

  positions.forEach(pos => {
    const bondLine = createSVG('line', {
      x1: pos.x > 0 ? 25 : -25,
      y1: pos.y > 0 ? 8 : -5,
      x2: pos.x,
      y2: pos.y - 5,
      stroke: COLORS.bond,
      'stroke-width': '1.5'
    });
    g.appendChild(bondLine);

    const label = createSVG('text', {
      x: pos.x, y: pos.y,
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    label.textContent = pos.label;
    g.appendChild(label);
  });

  svg.appendChild(g);
  return g;
}

/**
 * Draw bromonium ion intermediate
 */
function drawBromoniumIon(svg, x, y) {
  const g = createSVG('g', { transform: `translate(${x}, ${y})` });

  // Three-membered ring
  const ringPath = createSVG('path', {
    d: 'M -20 10 L 0 -15 L 20 10 Z',
    fill: 'none',
    stroke: COLORS.intermediate,
    'stroke-width': '2'
  });
  g.appendChild(ringPath);

  // Carbons
  const c1 = createSVG('circle', { cx: '-20', cy: '10', r: '8', fill: 'white', stroke: COLORS.carbon, 'stroke-width': '1.5' });
  const c2 = createSVG('circle', { cx: '20', cy: '10', r: '8', fill: 'white', stroke: COLORS.carbon, 'stroke-width': '1.5' });
  g.appendChild(c1);
  g.appendChild(c2);

  // Bromine with positive charge
  const brCircle = createSVG('circle', { cx: '0', cy: '-15', r: '12', fill: '#fef3c7', stroke: COLORS.intermediate, 'stroke-width': '2' });
  g.appendChild(brCircle);

  const brLabel = createSVG('text', {
    x: '0', y: '-11',
    'text-anchor': 'middle',
    'font-size': '10',
    'font-weight': '600',
    fill: '#7c3aed'
  });
  brLabel.textContent = 'Br⁺';
  g.appendChild(brLabel);

  svg.appendChild(g);
  return g;
}

/**
 * Render SN2 mechanism step by step
 */
export function renderSN2Mechanism(svg, step = 0, animate = false) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 350');
  addDefs(svg);

  // Title
  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = 'SN2 Mechanism: Backside Attack';
  svg.appendChild(title);

  // Subtitle
  const subtitle = createSVG('text', {
    x: '250', y: '45',
    'text-anchor': 'middle',
    'font-size': '11',
    fill: '#64748b'
  });
  subtitle.textContent = 'Concerted, one-step with complete inversion';
  svg.appendChild(subtitle);

  // Starting material
  drawMolecule(svg, {
    label: 'C',
    top: 'R₁',
    left: 'R₂',
    right: 'Br',
    bottom: 'H',
    leavingGroup: 'Br'
  }, 80, 150);

  const smLabel = createSVG('text', {
    x: '80', y: '220',
    'text-anchor': 'middle',
    'font-size': '10',
    fill: COLORS.text
  });
  smLabel.textContent = 'Substrate';
  svg.appendChild(smLabel);

  // Nucleophile approaching
  const nucG = createSVG('g', { transform: 'translate(30, 150)' });
  const nucCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#d1fae5', stroke: COLORS.nucleophile, 'stroke-width': '2' });
  nucG.appendChild(nucCircle);
  const nucText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '600', fill: COLORS.nucleophile });
  nucText.textContent = 'Nu⁻';
  nucG.appendChild(nucText);
  svg.appendChild(nucG);

  // Curved arrow from nucleophile
  if (step >= 1) {
    drawCurvedArrow(svg, 45, 150, 65, 150, -20, COLORS.nucleophile);

    // Arrow from C-Br bond
    drawCurvedArrow(svg, 105, 150, 135, 150, 20, COLORS.electronArrow);
  }

  // Reaction arrow
  const rxnArrow = createSVG('line', {
    x1: '165', y1: '150', x2: '215', y2: '150',
    stroke: COLORS.bond,
    'stroke-width': '2',
    'marker-end': 'url(#rxn-arrow)'
  });
  svg.appendChild(rxnArrow);

  // Transition state
  const tsG = createSVG('g', { transform: 'translate(280, 150)' });

  // Brackets
  const bracket1 = createSVG('text', { x: '-55', y: '8', 'font-size': '40', fill: '#64748b' });
  bracket1.textContent = '[';
  tsG.appendChild(bracket1);

  const bracket2 = createSVG('text', { x: '40', y: '8', 'font-size': '40', fill: '#64748b' });
  bracket2.textContent = ']‡';
  tsG.appendChild(bracket2);

  // Dashed bonds
  const nuDash = createSVG('line', {
    x1: '-35', y1: '0', x2: '-12', y2: '0',
    stroke: COLORS.nucleophile,
    'stroke-width': '2',
    'stroke-dasharray': '4,2'
  });
  tsG.appendChild(nuDash);

  const lgDash = createSVG('line', {
    x1: '12', y1: '0', x2: '35', y2: '0',
    stroke: COLORS.leavingGroup,
    'stroke-width': '2',
    'stroke-dasharray': '4,2'
  });
  tsG.appendChild(lgDash);

  // Central carbon (planar)
  const tsCarbon = createSVG('circle', { cx: '0', cy: '0', r: '10', fill: 'white', stroke: '#94a3b8', 'stroke-width': '2' });
  tsG.appendChild(tsCarbon);
  const tsC = createSVG('text', { x: '0', y: '4', 'text-anchor': 'middle', 'font-size': '10', fill: COLORS.carbon });
  tsC.textContent = 'C';
  tsG.appendChild(tsC);

  // Nu and LG labels in TS
  const tsNu = createSVG('text', { x: '-42', y: '5', 'font-size': '9', fill: COLORS.nucleophile });
  tsNu.textContent = 'Nu';
  tsG.appendChild(tsNu);

  const tsLg = createSVG('text', { x: '38', y: '5', 'font-size': '9', fill: COLORS.leavingGroup });
  tsLg.textContent = 'Br';
  tsG.appendChild(tsLg);

  svg.appendChild(tsG);

  const tsLabel = createSVG('text', {
    x: '280', y: '220',
    'text-anchor': 'middle',
    'font-size': '10',
    fill: COLORS.text
  });
  tsLabel.textContent = 'Transition State';
  svg.appendChild(tsLabel);

  // Second arrow
  const rxnArrow2 = createSVG('line', {
    x1: '350', y1: '150', x2: '390', y2: '150',
    stroke: COLORS.bond,
    'stroke-width': '2',
    'marker-end': 'url(#rxn-arrow)'
  });
  svg.appendChild(rxnArrow2);

  // Product
  drawMolecule(svg, {
    label: 'C',
    top: 'R₁',
    left: 'Nu',
    right: 'R₂',
    bottom: 'H',
    nucleophile: 'Nu'
  }, 440, 150);

  const prodLabel = createSVG('text', {
    x: '440', y: '220',
    'text-anchor': 'middle',
    'font-size': '10',
    fill: COLORS.text
  });
  prodLabel.textContent = 'Product (inverted)';
  svg.appendChild(prodLabel);

  // Leaving group
  const lgG = createSVG('g', { transform: 'translate(490, 150)' });
  const lgCircle = createSVG('circle', { cx: '0', cy: '0', r: '12', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '1.5' });
  lgG.appendChild(lgCircle);
  const lgText = createSVG('text', { x: '0', y: '4', 'text-anchor': 'middle', 'font-size': '9', fill: COLORS.leavingGroup });
  lgText.textContent = 'Br⁻';
  lgG.appendChild(lgText);
  svg.appendChild(lgG);

  // Key points box
  const boxBg = createSVG('rect', {
    x: '20', y: '250',
    width: '460', height: '90',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(boxBg);

  const keyPoints = [
    'SN2 Key Features:',
    '• Nucleophile attacks from backside (180° from LG)',
    '• Single concerted step - no intermediate',
    '• Complete inversion of configuration (Walden inversion)',
    '• Rate = k[substrate][nucleophile] (second order)'
  ];

  keyPoints.forEach((text, i) => {
    const label = createSVG('text', {
      x: '35', y: 270 + i * 16,
      'font-size': i === 0 ? '11' : '10',
      'font-weight': i === 0 ? '600' : '400',
      fill: COLORS.text
    });
    label.textContent = text;
    svg.appendChild(label);
  });
}

/**
 * Render SN1 mechanism step by step
 */
export function renderSN1Mechanism(svg, step = 0) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 400');
  addDefs(svg);

  // Title
  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = `SN1 Mechanism: Step ${step + 1} of 2`;
  svg.appendChild(title);

  if (step === 0) {
    // Step 1: Ionization
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 1: Ionization (Rate-Determining Step)';
    svg.appendChild(subtitle);

    // Starting material
    drawMolecule(svg, {
      label: 'C',
      top: 'R₁',
      left: 'R₂',
      right: 'Br',
      bottom: 'R₃',
      leavingGroup: 'Br'
    }, 120, 150);

    // Curved arrow (electron flow)
    drawCurvedArrow(svg, 145, 150, 190, 150, 25, COLORS.electronArrow);

    // Reaction arrow
    const rxnArrow = createSVG('line', {
      x1: '200', y1: '150', x2: '260', y2: '150',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(rxnArrow);

    const slowLabel = createSVG('text', {
      x: '230', y: '135',
      'text-anchor': 'middle',
      'font-size': '9',
      fill: '#dc2626'
    });
    slowLabel.textContent = 'slow';
    svg.appendChild(slowLabel);

    // Carbocation
    drawCarbocation(svg, 340, 150, ['R₁', 'R₂', 'R₃']);

    const catLabel = createSVG('text', {
      x: '340', y: '220',
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.carbocation
    });
    catLabel.textContent = 'Carbocation (sp², planar)';
    svg.appendChild(catLabel);

    // Plus sign
    const plus = createSVG('text', {
      x: '400', y: '155',
      'font-size': '16',
      fill: COLORS.text
    });
    plus.textContent = '+';
    svg.appendChild(plus);

    // Bromide
    const brG = createSVG('g', { transform: 'translate(450, 150)' });
    const brCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    brG.appendChild(brCircle);
    const brText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    brText.textContent = 'Br⁻';
    brG.appendChild(brText);
    svg.appendChild(brG);

  } else {
    // Step 2: Nucleophilic attack
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 2: Nucleophilic Attack (from either face)';
    svg.appendChild(subtitle);

    // Carbocation in center
    drawCarbocation(svg, 150, 180, ['R₁', 'R₂', 'R₃']);

    // Nucleophiles approaching from both sides
    // Top nucleophile
    const nucTop = createSVG('g', { transform: 'translate(150, 80)' });
    const nucTopCircle = createSVG('circle', { cx: '0', cy: '0', r: '12', fill: '#d1fae5', stroke: COLORS.nucleophile, 'stroke-width': '2' });
    nucTop.appendChild(nucTopCircle);
    const nucTopText = createSVG('text', { x: '0', y: '4', 'text-anchor': 'middle', 'font-size': '9', fill: COLORS.nucleophile });
    nucTopText.textContent = 'Nu⁻';
    nucTop.appendChild(nucTopText);
    svg.appendChild(nucTop);

    drawCurvedArrow(svg, 150, 95, 150, 145, 20, COLORS.nucleophile);

    // Bottom nucleophile
    const nucBot = createSVG('g', { transform: 'translate(150, 280)' });
    const nucBotCircle = createSVG('circle', { cx: '0', cy: '0', r: '12', fill: '#d1fae5', stroke: COLORS.nucleophile, 'stroke-width': '2' });
    nucBot.appendChild(nucBotCircle);
    const nucBotText = createSVG('text', { x: '0', y: '4', 'text-anchor': 'middle', 'font-size': '9', fill: COLORS.nucleophile });
    nucBotText.textContent = 'Nu⁻';
    nucBot.appendChild(nucBotText);
    svg.appendChild(nucBot);

    drawCurvedArrow(svg, 150, 265, 150, 215, -20, COLORS.nucleophile);

    // 50% labels
    const top50 = createSVG('text', { x: '175', y: '115', 'font-size': '9', fill: COLORS.text });
    top50.textContent = '50%';
    svg.appendChild(top50);

    const bot50 = createSVG('text', { x: '175', y: '255', 'font-size': '9', fill: COLORS.text });
    bot50.textContent = '50%';
    svg.appendChild(bot50);

    // Arrows to products
    const arrow1 = createSVG('path', {
      d: 'M 200 140 Q 260 100 320 130',
      fill: 'none',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(arrow1);

    const arrow2 = createSVG('path', {
      d: 'M 200 220 Q 260 260 320 230',
      fill: 'none',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(arrow2);

    // Products
    drawMolecule(svg, {
      label: 'C',
      top: 'Nu',
      left: 'R₁',
      right: 'R₂',
      bottom: 'R₃',
      nucleophile: 'Nu'
    }, 380, 130);

    const retLabel = createSVG('text', {
      x: '380', y: '195',
      'text-anchor': 'middle',
      'font-size': '9',
      fill: COLORS.text
    });
    retLabel.textContent = 'Retention (50%)';
    svg.appendChild(retLabel);

    drawMolecule(svg, {
      label: 'C',
      top: 'R₃',
      left: 'R₁',
      right: 'R₂',
      bottom: 'Nu',
      nucleophile: 'Nu'
    }, 380, 280);

    const invLabel = createSVG('text', {
      x: '380', y: '345',
      'text-anchor': 'middle',
      'font-size': '9',
      fill: COLORS.text
    });
    invLabel.textContent = 'Inversion (50%)';
    svg.appendChild(invLabel);
  }

  // Key points box
  const boxBg = createSVG('rect', {
    x: '20', y: step === 0 ? '250' : '370',
    width: '460', height: step === 0 ? '80' : '25',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(boxBg);

  const keyText = step === 0
    ? 'Rate-determining step: LG leaves to form planar carbocation (sp²)'
    : 'Result: Racemic mixture (50% R + 50% S) - NOT optically active';

  const keyLabel = createSVG('text', {
    x: '250', y: step === 0 ? '290' : '387',
    'text-anchor': 'middle',
    'font-size': '11',
    fill: COLORS.text
  });
  keyLabel.textContent = keyText;
  svg.appendChild(keyLabel);
}

/**
 * Render E2 mechanism
 */
export function renderE2Mechanism(svg, step = 0) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 350');
  addDefs(svg);

  // Title
  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = 'E2 Mechanism: Anti-Periplanar Elimination';
  svg.appendChild(title);

  const subtitle = createSVG('text', {
    x: '250', y: '45',
    'text-anchor': 'middle',
    'font-size': '11',
    fill: '#64748b'
  });
  subtitle.textContent = 'Concerted elimination requiring anti geometry';
  svg.appendChild(subtitle);

  // Newman-style representation of anti-periplanar
  const newmanG = createSVG('g', { transform: 'translate(120, 160)' });

  // Back carbon circle
  const backC = createSVG('circle', { cx: '0', cy: '0', r: '35', fill: 'white', stroke: COLORS.bond, 'stroke-width': '2' });
  newmanG.appendChild(backC);

  // Front carbon
  const frontC = createSVG('circle', { cx: '0', cy: '0', r: '8', fill: 'white', stroke: COLORS.carbon, 'stroke-width': '2' });
  newmanG.appendChild(frontC);

  // Cα label
  const caLabel = createSVG('text', { x: '0', y: '4', 'text-anchor': 'middle', 'font-size': '8', fill: COLORS.carbon });
  caLabel.textContent = 'Cα';
  newmanG.appendChild(caLabel);

  // Cβ label
  const cbLabel = createSVG('text', { x: '0', y: '-45', 'text-anchor': 'middle', 'font-size': '8', fill: COLORS.carbon });
  cbLabel.textContent = 'Cβ';
  newmanG.appendChild(cbLabel);

  // Leaving group (bottom of front carbon) - at 180° from H
  const lgBond = createSVG('line', { x1: '0', y1: '8', x2: '0', y2: '55', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
  newmanG.appendChild(lgBond);
  const lgLabel = createSVG('text', { x: '0', y: '70', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
  lgLabel.textContent = 'Br';
  newmanG.appendChild(lgLabel);

  // H on back carbon (top) - anti to LG
  const hBond = createSVG('line', { x1: '0', y1: '-35', x2: '0', y2: '-55', stroke: '#22c55e', 'stroke-width': '3' });
  newmanG.appendChild(hBond);
  const hLabel = createSVG('text', { x: '0', y: '-62', 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '600', fill: '#22c55e' });
  hLabel.textContent = 'H';
  newmanG.appendChild(hLabel);

  // Other groups
  const angles = [120, 240];
  const groups = ['R₁', 'R₂'];
  angles.forEach((angle, i) => {
    const rad = angle * Math.PI / 180;
    const bond = createSVG('line', {
      x1: Math.cos(rad) * 35,
      y1: Math.sin(rad) * 35,
      x2: Math.cos(rad) * 55,
      y2: Math.sin(rad) * 55,
      stroke: COLORS.bond,
      'stroke-width': '2'
    });
    newmanG.appendChild(bond);

    const label = createSVG('text', {
      x: Math.cos(rad) * 65,
      y: Math.sin(rad) * 65 + 4,
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    label.textContent = groups[i];
    newmanG.appendChild(label);
  });

  // Front carbon groups
  const frontAngles = [60, 300];
  const frontGroups = ['H', 'H'];
  frontAngles.forEach((angle, i) => {
    const rad = angle * Math.PI / 180;
    const bond = createSVG('line', {
      x1: Math.cos(rad) * 8,
      y1: Math.sin(rad) * 8,
      x2: Math.cos(rad) * 45,
      y2: Math.sin(rad) * 45,
      stroke: COLORS.bond,
      'stroke-width': '2'
    });
    newmanG.appendChild(bond);

    const label = createSVG('text', {
      x: Math.cos(rad) * 55,
      y: Math.sin(rad) * 55 + 4,
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    label.textContent = frontGroups[i];
    newmanG.appendChild(label);
  });

  svg.appendChild(newmanG);

  // Anti label
  const antiLabel = createSVG('text', { x: '120', y: '250', 'text-anchor': 'middle', 'font-size': '10', fill: '#22c55e' });
  antiLabel.textContent = 'H and Br are anti (180°)';
  svg.appendChild(antiLabel);

  // Base approaching
  const baseG = createSVG('g', { transform: 'translate(40, 100)' });
  const baseCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#dbeafe', stroke: '#2563eb', 'stroke-width': '2' });
  baseG.appendChild(baseCircle);
  const baseText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '10', 'font-weight': '600', fill: '#2563eb' });
  baseText.textContent = 'B⁻';
  baseG.appendChild(baseText);
  svg.appendChild(baseG);

  // Curved arrows showing electron flow
  drawCurvedArrow(svg, 55, 100, 115, 100, -15, '#2563eb');
  drawCurvedArrow(svg, 120, 105, 120, 130, 15, COLORS.electronArrow);
  drawCurvedArrow(svg, 120, 175, 120, 210, -15, COLORS.electronArrow);

  // Reaction arrow
  const rxnArrow = createSVG('line', {
    x1: '200', y1: '160', x2: '260', y2: '160',
    stroke: COLORS.bond,
    'stroke-width': '2',
    'marker-end': 'url(#rxn-arrow)'
  });
  svg.appendChild(rxnArrow);

  // Product: alkene
  drawAlkene(svg, 340, 160, ['R₁', 'H', 'R₂', 'H']);

  const prodLabel = createSVG('text', {
    x: '340', y: '210',
    'text-anchor': 'middle',
    'font-size': '10',
    fill: COLORS.text
  });
  prodLabel.textContent = 'Alkene Product';
  svg.appendChild(prodLabel);

  // Plus products
  const plusLabel = createSVG('text', { x: '400', y: '165', 'font-size': '14', fill: COLORS.text });
  plusLabel.textContent = '+';
  svg.appendChild(plusLabel);

  const hbLabel = createSVG('text', { x: '440', y: '165', 'font-size': '11', fill: '#2563eb' });
  hbLabel.textContent = 'H-B';
  svg.appendChild(hbLabel);

  const plus2 = createSVG('text', { x: '465', y: '165', 'font-size': '14', fill: COLORS.text });
  plus2.textContent = '+';
  svg.appendChild(plus2);

  const brLabel = createSVG('text', { x: '485', y: '165', 'font-size': '11', fill: COLORS.leavingGroup });
  brLabel.textContent = 'Br⁻';
  svg.appendChild(brLabel);

  // Key points box
  const boxBg = createSVG('rect', {
    x: '20', y: '265',
    width: '460', height: '75',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(boxBg);

  const keyPoints = [
    'E2 Key Features:',
    '• H and LG must be anti-periplanar (180° dihedral)',
    '• All bonds break/form simultaneously (concerted)',
    '• Rate = k[substrate][base]'
  ];

  keyPoints.forEach((text, i) => {
    const label = createSVG('text', {
      x: '35', y: 285 + i * 16,
      'font-size': i === 0 ? '11' : '10',
      'font-weight': i === 0 ? '600' : '400',
      fill: COLORS.text
    });
    label.textContent = text;
    svg.appendChild(label);
  });
}

/**
 * Render addition mechanism (HBr to alkene)
 */
export function renderAdditionMechanism(svg, step = 0) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 350');
  addDefs(svg);

  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = `HBr Addition: Step ${step + 1} of 2`;
  svg.appendChild(title);

  if (step === 0) {
    // Step 1: Protonation
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 1: π bond attacks H⁺ (Markovnikov)';
    svg.appendChild(subtitle);

    // Alkene
    drawAlkene(svg, 100, 150, ['CH₃', 'H', 'H', 'H']);

    // HBr approaching
    const hbrG = createSVG('g', { transform: 'translate(100, 80)' });
    const hbrText = createSVG('text', { x: '0', y: '0', 'text-anchor': 'middle', 'font-size': '14', fill: COLORS.text });
    hbrText.textContent = 'H—Br';
    hbrG.appendChild(hbrText);

    const deltaPlus = createSVG('text', { x: '-12', y: '-10', 'font-size': '9', fill: COLORS.carbocation });
    deltaPlus.textContent = 'δ+';
    hbrG.appendChild(deltaPlus);

    const deltaMinus = createSVG('text', { x: '18', y: '-10', 'font-size': '9', fill: COLORS.leavingGroup });
    deltaMinus.textContent = 'δ-';
    hbrG.appendChild(deltaMinus);
    svg.appendChild(hbrG);

    // Curved arrow from pi bond to H
    drawCurvedArrow(svg, 100, 145, 95, 95, 25, COLORS.pi);

    // Reaction arrow
    const rxnArrow = createSVG('line', {
      x1: '180', y1: '150', x2: '240', y2: '150',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(rxnArrow);

    // Carbocation product (more stable - secondary)
    drawCarbocation(svg, 320, 150, ['CH₃', 'CH₃', 'H']);

    const catLabel = createSVG('text', {
      x: '320', y: '215',
      'text-anchor': 'middle',
      'font-size': '9',
      fill: COLORS.carbocation
    });
    catLabel.textContent = '2° carbocation (more stable)';
    svg.appendChild(catLabel);

    // Plus Br-
    const plus = createSVG('text', { x: '390', y: '155', 'font-size': '14', fill: COLORS.text });
    plus.textContent = '+';
    svg.appendChild(plus);

    const brG = createSVG('g', { transform: 'translate(440, 150)' });
    const brCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    brG.appendChild(brCircle);
    const brText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    brText.textContent = 'Br⁻';
    brG.appendChild(brText);
    svg.appendChild(brG);

  } else {
    // Step 2: Bromide attack
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 2: Br⁻ attacks carbocation';
    svg.appendChild(subtitle);

    // Carbocation
    drawCarbocation(svg, 120, 150, ['CH₃', 'CH₃', 'H']);

    // Bromide approaching
    const brG = createSVG('g', { transform: 'translate(60, 150)' });
    const brCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    brG.appendChild(brCircle);
    const brText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    brText.textContent = 'Br⁻';
    brG.appendChild(brText);
    svg.appendChild(brG);

    // Curved arrow
    drawCurvedArrow(svg, 75, 150, 100, 150, -20, COLORS.leavingGroup);

    // Reaction arrow
    const rxnArrow = createSVG('line', {
      x1: '200', y1: '150', x2: '260', y2: '150',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(rxnArrow);

    // Product
    drawMolecule(svg, {
      label: 'C',
      top: 'CH₃',
      left: 'Br',
      right: 'CH₃',
      bottom: 'H'
    }, 350, 150);

    const prodLabel = createSVG('text', {
      x: '350', y: '220',
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    prodLabel.textContent = '2-Bromopropane (Markovnikov)';
    svg.appendChild(prodLabel);
  }

  // Key points box
  const boxBg = createSVG('rect', {
    x: '20', y: '260',
    width: '460', height: '80',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(boxBg);

  const keyText = step === 0
    ? 'Markovnikov\'s Rule: H adds to C with more H\'s; forms more stable carbocation'
    : 'Product: Br on more substituted carbon (Markovnikov product)';

  const keyLabel = createSVG('text', {
    x: '250', y: '285',
    'text-anchor': 'middle',
    'font-size': '11',
    fill: COLORS.text
  });
  keyLabel.textContent = keyText;
  svg.appendChild(keyLabel);

  const keyLabel2 = createSVG('text', {
    x: '250', y: '310',
    'text-anchor': 'middle',
    'font-size': '10',
    fill: '#64748b'
  });
  keyLabel2.textContent = step === 0
    ? 'Carbocation stability: 3° > 2° > 1° > methyl'
    : 'Regioselectivity controlled by carbocation stability';
  svg.appendChild(keyLabel2);
}

/**
 * Render bromination (anti addition via bromonium ion)
 */
export function renderBrominationMechanism(svg, step = 0) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 350');
  addDefs(svg);

  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = `Br₂ Addition: Step ${step + 1} of 2`;
  svg.appendChild(title);

  if (step === 0) {
    // Step 1: Bromonium ion formation
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 1: Bromonium Ion Formation';
    svg.appendChild(subtitle);

    // Alkene
    drawAlkene(svg, 100, 150, ['H', 'H', 'H', 'H']);

    // Br2 approaching
    const br2G = createSVG('g', { transform: 'translate(100, 80)' });
    const br2Text = createSVG('text', { x: '0', y: '0', 'text-anchor': 'middle', 'font-size': '14', fill: COLORS.leavingGroup });
    br2Text.textContent = 'Br—Br';
    br2G.appendChild(br2Text);
    svg.appendChild(br2G);

    // Curved arrows
    drawCurvedArrow(svg, 100, 145, 95, 95, 25, COLORS.pi);
    drawCurvedArrow(svg, 105, 80, 130, 95, -15, COLORS.electronArrow);

    // Reaction arrow
    const rxnArrow = createSVG('line', {
      x1: '180', y1: '150', x2: '240', y2: '150',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(rxnArrow);

    // Bromonium ion
    drawBromoniumIon(svg, 320, 150);

    const ionLabel = createSVG('text', {
      x: '320', y: '210',
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.intermediate
    });
    ionLabel.textContent = 'Bromonium ion';
    svg.appendChild(ionLabel);

    // Plus Br-
    const plus = createSVG('text', { x: '400', y: '155', 'font-size': '14', fill: COLORS.text });
    plus.textContent = '+';
    svg.appendChild(plus);

    const brG = createSVG('g', { transform: 'translate(450, 150)' });
    const brCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    brG.appendChild(brCircle);
    const brText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    brText.textContent = 'Br⁻';
    brG.appendChild(brText);
    svg.appendChild(brG);

  } else {
    // Step 2: Anti attack
    const subtitle = createSVG('text', {
      x: '250', y: '45',
      'text-anchor': 'middle',
      'font-size': '11',
      fill: '#64748b'
    });
    subtitle.textContent = 'Step 2: Anti Attack by Br⁻';
    svg.appendChild(subtitle);

    // Bromonium ion
    drawBromoniumIon(svg, 120, 150);

    // Br- attacking from bottom (anti to top Br)
    const brG = createSVG('g', { transform: 'translate(120, 230)' });
    const brCircle = createSVG('circle', { cx: '0', cy: '0', r: '15', fill: '#fee2e2', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    brG.appendChild(brCircle);
    const brText = createSVG('text', { x: '0', y: '5', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    brText.textContent = 'Br⁻';
    brG.appendChild(brText);
    svg.appendChild(brG);

    // Arrow showing anti attack
    drawCurvedArrow(svg, 120, 215, 120, 175, 25, COLORS.leavingGroup);

    const antiLabel = createSVG('text', { x: '165', y: '200', 'font-size': '9', fill: COLORS.leavingGroup });
    antiLabel.textContent = 'anti attack';
    svg.appendChild(antiLabel);

    // Reaction arrow
    const rxnArrow = createSVG('line', {
      x1: '200', y1: '150', x2: '260', y2: '150',
      stroke: COLORS.bond,
      'stroke-width': '2',
      'marker-end': 'url(#rxn-arrow)'
    });
    svg.appendChild(rxnArrow);

    // Product (trans-dibromide)
    const prodG = createSVG('g', { transform: 'translate(350, 150)' });

    // Two carbons
    const c1 = createSVG('circle', { cx: '-20', cy: '0', r: '12', fill: 'white', stroke: COLORS.carbon, 'stroke-width': '2' });
    prodG.appendChild(c1);
    const c2 = createSVG('circle', { cx: '20', cy: '0', r: '12', fill: 'white', stroke: COLORS.carbon, 'stroke-width': '2' });
    prodG.appendChild(c2);

    // C-C bond
    const ccBond = createSVG('line', { x1: '-8', y1: '0', x2: '8', y2: '0', stroke: COLORS.bond, 'stroke-width': '2' });
    prodG.appendChild(ccBond);

    // Bromines (trans/anti)
    const br1 = createSVG('text', { x: '-20', y: '-30', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    br1.textContent = 'Br';
    prodG.appendChild(br1);

    const br2 = createSVG('text', { x: '20', y: '40', 'text-anchor': 'middle', 'font-size': '11', fill: COLORS.leavingGroup });
    br2.textContent = 'Br';
    prodG.appendChild(br2);

    // Bonds to Br
    const brBond1 = createSVG('line', { x1: '-20', y1: '-12', x2: '-20', y2: '-22', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    prodG.appendChild(brBond1);
    const brBond2 = createSVG('line', { x1: '20', y1: '12', x2: '20', y2: '28', stroke: COLORS.leavingGroup, 'stroke-width': '2' });
    prodG.appendChild(brBond2);

    // H's
    const h1 = createSVG('text', { x: '-45', y: '5', 'font-size': '10', fill: COLORS.text });
    h1.textContent = 'H';
    prodG.appendChild(h1);
    const h2 = createSVG('text', { x: '40', y: '5', 'font-size': '10', fill: COLORS.text });
    h2.textContent = 'H';
    prodG.appendChild(h2);

    svg.appendChild(prodG);

    const prodLabel = createSVG('text', {
      x: '350', y: '210',
      'text-anchor': 'middle',
      'font-size': '10',
      fill: COLORS.text
    });
    prodLabel.textContent = 'trans-1,2-Dibromide (anti)';
    svg.appendChild(prodLabel);
  }

  // Key points box
  const boxBg = createSVG('rect', {
    x: '20', y: '260',
    width: '460', height: '80',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(boxBg);

  const keyPoints = step === 0 ? [
    'Bromonium ion: cyclic intermediate prevents free rotation',
    'Br bridges both carbons, blocking one face'
  ] : [
    'Anti addition: Br⁻ must attack from opposite face',
    'Result: trans (anti) stereochemistry in product'
  ];

  keyPoints.forEach((text, i) => {
    const label = createSVG('text', {
      x: '250', y: 285 + i * 18,
      'text-anchor': 'middle',
      'font-size': '11',
      fill: COLORS.text
    });
    label.textContent = text;
    svg.appendChild(label);
  });
}

/**
 * Main render function - dispatches to specific mechanism renderer
 */
export function renderMechanism(svg, mechanismId, step = 0) {
  switch (mechanismId) {
    case 'sn2':
      renderSN2Mechanism(svg, step);
      break;
    case 'sn1':
      renderSN1Mechanism(svg, step);
      break;
    case 'e2':
      renderE2Mechanism(svg, step);
      break;
    case 'e1':
      renderSN1Mechanism(svg, step); // E1 is similar to SN1 step 1
      break;
    case 'addition-hbr':
      renderAdditionMechanism(svg, step);
      break;
    case 'addition-br2':
      renderBrominationMechanism(svg, step);
      break;
    default:
      renderSN2Mechanism(svg, step);
  }
}
