/**
 * SVG Renderer for Chair Conformations
 *
 * Handles all SVG drawing operations for the chair visualization.
 */

import {
  getChairCarbons,
  getChairBonds,
  getSubstituentPosition,
  getSubstituent,
  getAxialDirection
} from './chair.js';

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
 * Render the complete chair conformation
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
 * Render a single substituent (bond + label)
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
