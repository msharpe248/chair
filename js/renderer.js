/**
 * SVG Renderer for Chair Conformations
 *
 * Handles all SVG drawing operations for cyclohexane, pyranose, and decalin.
 */

import {
  getChairCarbons,
  getChairBonds,
  getSubstituentPosition,
  getSubstituent,
  getAxialDirection
} from './chair.js';

import { getPyranoseCoords, getPyranoseBonds } from './pyranose.js';
import { getDecalinCoords, getDecalinBonds, getDecalinInfo } from './decalin.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Substituent display names (with subscripts for HTML)
const SUBSTITUENT_LABELS = {
  'H': 'H',
  'CH3': 'CH₃',
  'C2H5': 'C₂H₅',
  'iPr': 'iPr',
  'tBu': 'tBu',
  'Ph': 'Ph',
  'OH': 'OH',
  'OCH3': 'OCH₃',
  'CH2OH': 'CH₂OH',
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
 * Clear the SVG element
 * @param {SVGElement} svg - The SVG element to clear
 */
export function clearSVG(svg) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

/**
 * Create an SVG element
 * @param {string} tag - SVG element tag name
 * @param {Object} attrs - Attributes to set
 * @returns {SVGElement}
 */
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * Main render function - dispatches based on mode
 * @param {SVGElement} svg - The SVG element to render into
 * @param {Object} state - The molecule state
 * @param {Object} options - Rendering options
 */
export function render(svg, state, options = {}) {
  switch (state.mode) {
    case 'pyranose':
      renderPyranose(svg, state, options);
      break;
    case 'decalin':
      renderDecalin(svg, state, options);
      break;
    case 'cyclohexane':
    default:
      renderChair(svg, state, options);
      break;
  }
}

/**
 * Render a cyclohexane chair conformation
 * @param {SVGElement} svg - The SVG element to render into
 * @param {Object} state - The molecule state
 * @param {Object} options - Rendering options
 */
export function renderChair(svg, state, options = {}) {
  const { showLabels = true, onCarbonClick = null } = options;

  clearSVG(svg);

  const flipped = state.flipped;
  const carbons = getChairCarbons(flipped);
  const bonds = getChairBonds();

  // Create a group for the whole chair
  const chairGroup = createSVGElement('g', { class: 'chair-group' });
  svg.appendChild(chairGroup);

  // Draw C-C bonds (the ring)
  const bondsGroup = createSVGElement('g', { class: 'bonds-group' });
  chairGroup.appendChild(bondsGroup);

  for (const bond of bonds) {
    const c1 = carbons[bond.from];
    const c2 = carbons[bond.to];

    const line = createSVGElement('line', {
      x1: c1.x,
      y1: c1.y,
      x2: c2.x,
      y2: c2.y,
      class: 'carbon-bond'
    });
    bondsGroup.appendChild(line);
  }

  // Draw substituent bonds and labels
  const substituentsGroup = createSVGElement('g', { class: 'substituents-group' });
  chairGroup.appendChild(substituentsGroup);

  for (let i = 0; i < 6; i++) {
    // Check for explicit substituents at axial and equatorial positions
    const axialSub = getSubstituent(state, i, 'axial');
    const eqSub = getSubstituent(state, i, 'equatorial');

    // Draw axial substituent (or H if none)
    renderSubstituent(substituentsGroup, i, 'axial', axialSub, flipped, showLabels);

    // Draw equatorial substituent (or H if none)
    renderSubstituent(substituentsGroup, i, 'equatorial', eqSub, flipped, showLabels);
  }

  // Draw carbon positions (clickable circles)
  const carbonsGroup = createSVGElement('g', { class: 'carbons-group' });
  chairGroup.appendChild(carbonsGroup);

  for (let i = 0; i < 6; i++) {
    const carbon = carbons[i];

    // Carbon circle (clickable)
    const circle = createSVGElement('circle', {
      cx: carbon.x,
      cy: carbon.y,
      r: 12,
      class: 'carbon-circle',
      'data-index': i
    });

    if (onCarbonClick) {
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        onCarbonClick(i, carbon.x, carbon.y);
      });
    }

    carbonsGroup.appendChild(circle);

    // Carbon number label
    const label = createSVGElement('text', {
      x: carbon.x,
      y: carbon.y + 4,
      class: 'carbon-label',
      'text-anchor': 'middle'
    });
    label.textContent = (i + 1).toString();
    carbonsGroup.appendChild(label);
  }

  // Draw axial/equatorial position labels if enabled
  if (showLabels) {
    const labelsGroup = createSVGElement('g', { class: 'position-labels-group' });
    chairGroup.appendChild(labelsGroup);

    for (let i = 0; i < 6; i++) {
      const axialDir = getAxialDirection(i, flipped);
      const axialPos = getSubstituentPosition(i, 'axial', flipped);
      const eqPos = getSubstituentPosition(i, 'equatorial', flipped);

      // Only show labels for positions without substituents (showing H)
      const axialSub = getSubstituent(state, i, 'axial');
      const eqSub = getSubstituent(state, i, 'equatorial');

      if (!axialSub) {
        const axLabel = createSVGElement('text', {
          x: axialPos.labelX + (axialDir === 'up' ? 15 : 15),
          y: axialPos.labelY,
          class: 'ax-eq-label axial-label',
          'text-anchor': 'start'
        });
        axLabel.textContent = 'ax';
        labelsGroup.appendChild(axLabel);
      }

      if (!eqSub) {
        const eqLabel = createSVGElement('text', {
          x: eqPos.labelX,
          y: eqPos.labelY + 12,
          class: 'ax-eq-label equatorial-label',
          'text-anchor': 'middle'
        });
        eqLabel.textContent = 'eq';
        labelsGroup.appendChild(eqLabel);
      }
    }
  }
}

/**
 * Render a pyranose sugar chair conformation
 * @param {SVGElement} svg - The SVG element to render into
 * @param {Object} state - The molecule state
 * @param {Object} options - Rendering options
 */
export function renderPyranose(svg, state, options = {}) {
  const { showLabels = true, onCarbonClick = null } = options;

  clearSVG(svg);

  const flipped = state.flipped;
  const coords = getPyranoseCoords(flipped);
  const bonds = getPyranoseBonds();

  // Adjust viewBox for pyranose (slightly different positioning)
  // svg.setAttribute('viewBox', '0 0 400 350');

  const chairGroup = createSVGElement('g', { class: 'chair-group pyranose' });
  svg.appendChild(chairGroup);

  // Draw bonds
  const bondsGroup = createSVGElement('g', { class: 'bonds-group' });
  chairGroup.appendChild(bondsGroup);

  for (const bond of bonds) {
    const c1 = coords[bond.from];
    const c2 = coords[bond.to];

    // Use different style for C-O bonds
    const isOxygenBond = !c1.isCarbon || !c2.isCarbon;

    const line = createSVGElement('line', {
      x1: c1.x,
      y1: c1.y,
      x2: c2.x,
      y2: c2.y,
      class: isOxygenBond ? 'carbon-bond oxygen-bond' : 'carbon-bond'
    });
    bondsGroup.appendChild(line);
  }

  // Draw substituents for carbons only (not oxygen)
  const substituentsGroup = createSVGElement('g', { class: 'substituents-group' });
  chairGroup.appendChild(substituentsGroup);

  for (let i = 0; i < 5; i++) {  // Only C1-C5 (indices 0-4)
    const sub = state.substituents.find(s => s.carbonIndex === i);

    if (sub) {
      renderPyranoseSubstituent(substituentsGroup, coords, i, sub.position, sub.group, flipped);
    }
  }

  // Draw atom positions
  const atomsGroup = createSVGElement('g', { class: 'carbons-group' });
  chairGroup.appendChild(atomsGroup);

  for (let i = 0; i < coords.length; i++) {
    const atom = coords[i];
    const isOxygen = !atom.isCarbon;

    const circle = createSVGElement('circle', {
      cx: atom.x,
      cy: atom.y,
      r: isOxygen ? 14 : 12,
      class: isOxygen ? 'oxygen-circle' : 'carbon-circle',
      'data-index': i
    });

    if (onCarbonClick && atom.isCarbon) {
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        onCarbonClick(i, atom.x, atom.y);
      });
    }

    atomsGroup.appendChild(circle);

    // Atom label
    const label = createSVGElement('text', {
      x: atom.x,
      y: atom.y + 4,
      class: isOxygen ? 'oxygen-label' : 'carbon-label',
      'text-anchor': 'middle'
    });
    label.textContent = atom.id;
    atomsGroup.appendChild(label);
  }

  // Add sugar name and anomer label
  const infoGroup = createSVGElement('g', { class: 'info-group' });
  chairGroup.appendChild(infoGroup);

  const sugarLabel = createSVGElement('text', {
    x: 200,
    y: 320,
    class: 'sugar-label',
    'text-anchor': 'middle'
  });
  const greekAnomer = state.anomer === 'alpha' ? 'α' : 'β';
  sugarLabel.textContent = `${greekAnomer}-D-${state.sugarType.charAt(0).toUpperCase() + state.sugarType.slice(1)}`;
  infoGroup.appendChild(sugarLabel);

  // Add conformation label (4C1 or 1C4)
  const confLabel = createSVGElement('text', {
    x: 200,
    y: 340,
    class: 'conformation-label',
    'text-anchor': 'middle'
  });
  confLabel.textContent = flipped ? '¹C₄' : '⁴C₁';
  infoGroup.appendChild(confLabel);
}

/**
 * Render a substituent for pyranose
 */
function renderPyranoseSubstituent(parent, coords, carbonIndex, position, group, flipped) {
  const carbon = coords[carbonIndex];
  const BOND_LENGTH = 40;

  // Calculate substituent position based on axial/equatorial
  let dx, dy;
  const axialDir = flipped ? -carbon.axialDir : carbon.axialDir;

  if (position === 'axial') {
    dx = 0;
    dy = axialDir * BOND_LENGTH;
  } else {
    // Equatorial - point outward from ring center
    const centerX = 160;
    const centerY = 160;
    dx = (carbon.x - centerX) * 0.4;
    dy = (carbon.y - centerY) * 0.4 + axialDir * 10;
  }

  const subGroup = createSVGElement('g', {
    class: `substituent ${position} explicit`,
    'data-carbon': carbonIndex,
    'data-position': position
  });
  parent.appendChild(subGroup);

  // Bond line
  const line = createSVGElement('line', {
    x1: carbon.x,
    y1: carbon.y,
    x2: carbon.x + dx,
    y2: carbon.y + dy,
    class: 'substituent-bond explicit-bond'
  });
  subGroup.appendChild(line);

  // Label
  const label = createSVGElement('text', {
    x: carbon.x + dx * 1.3,
    y: carbon.y + dy * 1.3,
    class: 'substituent-label explicit-label',
    'text-anchor': 'middle',
    'dominant-baseline': 'middle'
  });
  label.textContent = SUBSTITUENT_LABELS[group] || group;
  subGroup.appendChild(label);
}

/**
 * Render a decalin (fused bicyclic) structure
 * @param {SVGElement} svg - The SVG element to render into
 * @param {Object} state - The molecule state
 * @param {Object} options - Rendering options
 */
export function renderDecalin(svg, state, options = {}) {
  const { showLabels = true } = options;

  clearSVG(svg);

  const type = state.decalinType || 'trans';
  const flipped = state.flipped;
  const coords = getDecalinCoords(type, flipped);
  const bonds = getDecalinBonds();
  const info = getDecalinInfo(type);

  const chairGroup = createSVGElement('g', { class: 'chair-group decalin' });
  svg.appendChild(chairGroup);

  // Draw bonds
  const bondsGroup = createSVGElement('g', { class: 'bonds-group' });
  chairGroup.appendChild(bondsGroup);

  for (const bond of bonds) {
    const c1 = coords[bond.from];
    const c2 = coords[bond.to];

    // Color code by ring
    let bondClass = 'carbon-bond';
    if (bond.ring === 'A') bondClass += ' ring-a-bond';
    else if (bond.ring === 'B') bondClass += ' ring-b-bond';
    else bondClass += ' bridging-bond';

    const line = createSVGElement('line', {
      x1: c1.x,
      y1: c1.y,
      x2: c2.x,
      y2: c2.y,
      class: bondClass
    });
    bondsGroup.appendChild(line);
  }

  // Draw carbons
  const carbonsGroup = createSVGElement('g', { class: 'carbons-group' });
  chairGroup.appendChild(carbonsGroup);

  for (let i = 0; i < coords.length; i++) {
    const carbon = coords[i];
    const isBridgehead = carbon.ring === 'AB';

    const circle = createSVGElement('circle', {
      cx: carbon.x,
      cy: carbon.y,
      r: isBridgehead ? 14 : 12,
      class: isBridgehead ? 'carbon-circle bridgehead' : 'carbon-circle',
      'data-index': i
    });
    carbonsGroup.appendChild(circle);

    // Carbon label
    const label = createSVGElement('text', {
      x: carbon.x,
      y: carbon.y + 4,
      class: 'carbon-label',
      'text-anchor': 'middle'
    });
    label.textContent = carbon.id;
    carbonsGroup.appendChild(label);
  }

  // Add info labels
  const infoGroup = createSVGElement('g', { class: 'info-group' });
  chairGroup.appendChild(infoGroup);

  const nameLabel = createSVGElement('text', {
    x: 200,
    y: 310,
    class: 'decalin-label',
    'text-anchor': 'middle'
  });
  nameLabel.textContent = info.name;
  infoGroup.appendChild(nameLabel);

  // Show ring flip status
  const flipLabel = createSVGElement('text', {
    x: 200,
    y: 330,
    class: 'conformation-label',
    'text-anchor': 'middle'
  });
  flipLabel.textContent = info.canFlip ? '(can ring flip)' : '(locked - cannot flip)';
  infoGroup.appendChild(flipLabel);
}

/**
 * Render a single substituent (bond + label) for cyclohexane
 * @param {SVGElement} parent - Parent SVG group
 * @param {number} carbonIndex - Carbon index (0-5)
 * @param {string} position - 'axial' or 'equatorial'
 * @param {string|null} group - Substituent group or null for H
 * @param {boolean} flipped - Whether chair is flipped
 * @param {boolean} showLabels - Whether to show ax/eq labels
 */
function renderSubstituent(parent, carbonIndex, position, group, flipped, showLabels) {
  const pos = getSubstituentPosition(carbonIndex, position, flipped);
  const displayGroup = group || 'H';

  // Create group for this substituent
  const subGroup = createSVGElement('g', {
    class: `substituent ${position} ${group ? 'explicit' : 'hydrogen'}`,
    'data-carbon': carbonIndex,
    'data-position': position
  });
  parent.appendChild(subGroup);

  // Draw bond line
  const bondLine = createSVGElement('line', {
    x1: pos.bondStartX,
    y1: pos.bondStartY,
    x2: pos.x,
    y2: pos.y,
    class: `substituent-bond ${group ? 'explicit-bond' : 'hydrogen-bond'}`
  });
  subGroup.appendChild(bondLine);

  // Draw label (atom/group)
  if (group || !showLabels) {
    // Show actual substituent label
    const label = createSVGElement('text', {
      x: pos.labelX,
      y: pos.labelY,
      class: `substituent-label ${group ? 'explicit-label' : 'hydrogen-label'}`,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    });
    label.textContent = SUBSTITUENT_LABELS[displayGroup] || displayGroup;
    subGroup.appendChild(label);
  }
}

/**
 * Highlight a carbon position (for hover/selection)
 * @param {SVGElement} svg - The SVG element
 * @param {number} carbonIndex - Carbon index to highlight (-1 to clear)
 */
export function highlightCarbon(svg, carbonIndex) {
  // Remove existing highlights
  const existing = svg.querySelectorAll('.carbon-circle.highlighted');
  existing.forEach(el => el.classList.remove('highlighted'));

  if (carbonIndex >= 0) {
    const circle = svg.querySelector(`.carbon-circle[data-index="${carbonIndex}"]`);
    if (circle) {
      circle.classList.add('highlighted');
    }
  }
}

/**
 * Get substituent label for display
 * @param {string} group - Substituent group code
 * @returns {string} Display label with subscripts
 */
export function getSubstituentLabel(group) {
  return SUBSTITUENT_LABELS[group] || group;
}
