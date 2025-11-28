/**
 * Chair Conformation Viewer - Main Application
 *
 * Handles user interaction, state management, and coordinates
 * rendering and energy calculations for cyclohexane, pyranose, and decalin.
 */

import {
  createMoleculeState,
  setSubstituent,
  removeSubstituent,
  getSubstituent,
  flipChair,
  resetMolecule
} from './chair.js';

import { render, renderChair, highlightCarbon, getSubstituentLabel } from './renderer.js';

import {
  compareConformations,
  formatEnergy,
  getPreferredDescription
} from './energy.js';

import { createPyranoseState, changeSugarType, toggleAnomer } from './pyranose.js';
import { createDecalinState, canFlip, getDecalinInfo, toggleDecalinType } from './decalin.js';

// Application State
let state = createMoleculeState();
let currentMode = 'cyclohexane';
let selectedCarbon = null;
let selectedPosition = 'axial';

// Zoom and pan state
const DEFAULT_VIEWBOX = { x: 0, y: 0, width: 400, height: 350 };
let zoomLevel = 1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

// Pan state
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

// DOM Elements
let svg;
let picker;
let showLabelsCheckbox;

/**
 * Initialize the application
 */
function init() {
  // Get DOM elements
  svg = document.getElementById('chair-svg');
  picker = document.getElementById('substituent-picker');
  showLabelsCheckbox = document.getElementById('show-labels');

  // Set up event listeners
  setupEventListeners();

  // Initial render
  renderView();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Mode selector buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => handleModeChange(e.target.dataset.mode));
  });

  // Ring flip button
  document.getElementById('flip-btn').addEventListener('click', handleFlip);

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', handleReset);

  // Show labels checkbox
  showLabelsCheckbox.addEventListener('change', renderView);

  // Picker modal buttons
  document.getElementById('add-substituent-btn').addEventListener('click', handleAddSubstituent);
  document.getElementById('remove-substituent-btn').addEventListener('click', handleRemoveSubstituent);
  document.getElementById('cancel-picker-btn').addEventListener('click', closePicker);

  // Position selector buttons
  document.querySelectorAll('.position-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedPosition = e.target.dataset.position;
      updatePositionButtons();
      updatePickerForPosition();
    });
  });

  // Close picker when clicking outside
  picker.addEventListener('click', (e) => {
    if (e.target === picker) {
      closePicker();
    }
  });

  // Pyranose controls
  document.getElementById('sugar-select').addEventListener('change', handleSugarChange);
  document.getElementById('alpha-btn').addEventListener('click', () => handleAnomerChange('alpha'));
  document.getElementById('beta-btn').addEventListener('click', () => handleAnomerChange('beta'));

  // Decalin controls
  document.getElementById('trans-btn').addEventListener('click', () => handleDecalinTypeChange('trans'));
  document.getElementById('cis-btn').addEventListener('click', () => handleDecalinTypeChange('cis'));

  // Zoom controls
  document.getElementById('zoom-in-btn').addEventListener('click', () => handleZoom(ZOOM_STEP));
  document.getElementById('zoom-out-btn').addEventListener('click', () => handleZoom(-ZOOM_STEP));
  document.getElementById('zoom-reset-btn').addEventListener('click', resetZoom);

  // Mouse wheel zoom
  const chairContainer = document.querySelector('.chair-container');
  chairContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    handleZoom(delta);
  }, { passive: false });

  // Pan/drag functionality
  chairContainer.addEventListener('mousedown', handlePanStart);
  chairContainer.addEventListener('mousemove', handlePanMove);
  chairContainer.addEventListener('mouseup', handlePanEnd);
  chairContainer.addEventListener('mouseleave', handlePanEnd);

  // Touch support for mobile
  chairContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
  chairContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  chairContainer.addEventListener('touchend', handlePanEnd);

  // Export controls
  document.getElementById('export-png-btn').addEventListener('click', exportAsPNG);
  document.getElementById('export-svg-btn').addEventListener('click', exportAsSVG);
}

/**
 * Handle mode change (cyclohexane/pyranose/decalin)
 */
function handleModeChange(mode) {
  if (mode === currentMode) return;

  currentMode = mode;

  // Update mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Show/hide mode-specific controls
  document.getElementById('cyclohexane-controls').classList.toggle('hidden', mode !== 'cyclohexane');
  document.getElementById('pyranose-controls').classList.toggle('hidden', mode !== 'pyranose');
  document.getElementById('decalin-controls').classList.toggle('hidden', mode !== 'decalin');

  // Show/hide appropriate energy panels
  document.getElementById('energy-panel').classList.toggle('hidden', mode === 'decalin');
  document.getElementById('decalin-energy-panel').classList.toggle('hidden', mode !== 'decalin');

  // Create appropriate state for the mode
  switch (mode) {
    case 'pyranose':
      state = createPyranoseState('glucose', 'beta');
      break;
    case 'decalin':
      state = createDecalinState('trans');
      updateDecalinUI();
      break;
    case 'cyclohexane':
    default:
      state = createMoleculeState();
      break;
  }

  renderView();
}

/**
 * Handle sugar type change
 */
function handleSugarChange(e) {
  state = changeSugarType(state, e.target.value);
  renderView();
}

/**
 * Handle anomer change (alpha/beta)
 */
function handleAnomerChange(anomer) {
  if (state.anomer === anomer) return;

  // Update UI
  document.getElementById('alpha-btn').classList.toggle('selected', anomer === 'alpha');
  document.getElementById('beta-btn').classList.toggle('selected', anomer === 'beta');

  // Update state
  state = createPyranoseState(state.sugarType, anomer);
  renderView();
}

/**
 * Handle decalin type change (cis/trans)
 */
function handleDecalinTypeChange(type) {
  if (state.decalinType === type) return;

  // Update UI
  document.getElementById('trans-btn').classList.toggle('selected', type === 'trans');
  document.getElementById('cis-btn').classList.toggle('selected', type === 'cis');

  // Update state
  state = createDecalinState(type);
  updateDecalinUI();
  renderView();
}

/**
 * Update decalin-specific UI elements
 */
function updateDecalinUI() {
  const info = getDecalinInfo(state.decalinType);

  // Update info text
  document.getElementById('decalin-info').textContent = info.description;

  // Update flip button state
  const flipBtn = document.getElementById('flip-btn');
  flipBtn.disabled = !info.canFlip;

  // Update energy panel
  document.getElementById('decalin-stability').textContent =
    state.decalinType === 'trans' ? 'Most stable' : 'Less stable';
  document.getElementById('decalin-delta').textContent =
    state.decalinType === 'trans' ? '2.7 kcal/mol more stable' : '2.7 kcal/mol less stable';
}

/**
 * Main render function
 */
function renderView() {
  const showLabels = showLabelsCheckbox.checked;

  render(svg, state, {
    showLabels,
    onCarbonClick: currentMode === 'cyclohexane' ? handleCarbonClick : null
  });

  if (currentMode === 'cyclohexane') {
    updateEnergyDisplay();
  }

  updateSubstituentsList();
  updateFlipButtonState();
}

/**
 * Update flip button enabled state
 */
function updateFlipButtonState() {
  const flipBtn = document.getElementById('flip-btn');

  if (currentMode === 'decalin') {
    flipBtn.disabled = !canFlip(state.decalinType);
  } else {
    flipBtn.disabled = false;
  }
}

/**
 * Handle click on a carbon atom
 * @param {number} carbonIndex - Index of clicked carbon (0-5)
 * @param {number} x - X coordinate of carbon
 * @param {number} y - Y coordinate of carbon
 */
function handleCarbonClick(carbonIndex, x, y) {
  selectedCarbon = carbonIndex;
  selectedPosition = 'axial';
  updatePositionButtons();
  updatePickerForPosition();
  openPicker();
  highlightCarbon(svg, carbonIndex);
}

/**
 * Open the substituent picker modal
 */
function openPicker() {
  picker.classList.remove('hidden');
}

/**
 * Close the substituent picker modal
 */
function closePicker() {
  picker.classList.add('hidden');
  selectedCarbon = null;
  highlightCarbon(svg, -1);
}

/**
 * Update the position selector buttons
 */
function updatePositionButtons() {
  document.querySelectorAll('.position-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.position === selectedPosition);
  });
}

/**
 * Update the picker to show current substituent at selected position
 */
function updatePickerForPosition() {
  if (selectedCarbon === null) return;

  const currentSub = getSubstituent(state, selectedCarbon, selectedPosition);
  const select = document.getElementById('substituent-select');

  // Set the dropdown to the current substituent (or H if none)
  select.value = currentSub || 'H';
}

/**
 * Handle adding/changing a substituent
 */
function handleAddSubstituent() {
  if (selectedCarbon === null) return;

  const select = document.getElementById('substituent-select');
  const group = select.value;

  state = setSubstituent(state, selectedCarbon, selectedPosition, group);
  renderView();
  closePicker();
}

/**
 * Handle removing a substituent (replacing with H)
 */
function handleRemoveSubstituent() {
  if (selectedCarbon === null) return;

  state = removeSubstituent(state, selectedCarbon, selectedPosition);
  renderView();
  closePicker();
}

/**
 * Handle ring flip
 */
function handleFlip() {
  if (currentMode === 'decalin' && !canFlip(state.decalinType)) {
    return;
  }

  state = { ...state, flipped: !state.flipped };
  renderView();
}

/**
 * Handle reset
 */
function handleReset() {
  switch (currentMode) {
    case 'pyranose':
      state = createPyranoseState(state.sugarType || 'glucose', state.anomer || 'beta');
      break;
    case 'decalin':
      state = createDecalinState(state.decalinType || 'trans');
      break;
    case 'cyclohexane':
    default:
      state = resetMolecule();
      break;
  }
  renderView();
}

/**
 * Update the energy display panel
 */
function updateEnergyDisplay() {
  if (currentMode !== 'cyclohexane') return;

  const comparison = compareConformations(state);

  document.getElementById('energy-current').textContent = formatEnergy(comparison.energyCurrent);
  document.getElementById('energy-flipped').textContent = formatEnergy(comparison.energyFlipped);
  document.getElementById('energy-delta').textContent = formatEnergy(comparison.deltaE);
  document.getElementById('preferred-chair').textContent = getPreferredDescription(comparison);
}

/**
 * Update the substituents list panel
 */
function updateSubstituentsList() {
  const list = document.getElementById('substituent-list');
  list.innerHTML = '';

  if (currentMode === 'decalin') {
    const li = document.createElement('li');
    li.className = 'empty-message';
    li.textContent = 'Decalin is shown as the parent hydrocarbon';
    list.appendChild(li);
    return;
  }

  if (state.substituents.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-message';
    li.textContent = currentMode === 'cyclohexane'
      ? 'Click a position on the chair to add substituents'
      : 'Sugar template loaded';
    list.appendChild(li);
    return;
  }

  // Sort by carbon index
  const sorted = [...state.substituents].sort((a, b) => a.carbonIndex - b.carbonIndex);

  for (const sub of sorted) {
    const li = document.createElement('li');
    const posLabel = sub.position === 'axial' ? 'ax' : 'eq';
    const carbonLabel = currentMode === 'pyranose' ? `C${sub.carbonIndex + 1}` : `C${sub.carbonIndex + 1}`;
    li.textContent = `${carbonLabel}: ${getSubstituentLabel(sub.group)} (${posLabel})`;
    list.appendChild(li);
  }
}

/**
 * Handle zoom in/out
 * @param {number} delta - Zoom change amount (positive = zoom in, negative = zoom out)
 */
function handleZoom(delta) {
  const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel + delta));
  if (newZoom !== zoomLevel) {
    zoomLevel = newZoom;
    updateViewBox();
  }
}

/**
 * Reset zoom and pan to default
 */
function resetZoom() {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateViewBox();
}

/**
 * Update SVG transform (zoom and pan)
 */
function updateViewBox() {
  // Use CSS transform for zoom and pan
  svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;

  // Update zoom level display
  const zoomDisplay = document.getElementById('zoom-level');
  if (zoomDisplay) {
    zoomDisplay.textContent = `${Math.round(zoomLevel * 100)}%`;
  }
}

/**
 * Handle pan start (mouse down)
 */
function handlePanStart(e) {
  // Don't pan if clicking on a carbon circle or zoom controls
  if (e.target.closest('.zoom-controls') || e.target.closest('.carbon-circle')) {
    return;
  }

  isPanning = true;
  panStartX = e.clientX - panX;
  panStartY = e.clientY - panY;
}

/**
 * Handle pan move (mouse move)
 */
function handlePanMove(e) {
  if (!isPanning) return;

  e.preventDefault();
  panX = e.clientX - panStartX;
  panY = e.clientY - panStartY;
  updateViewBox();
}

/**
 * Handle pan end (mouse up or leave)
 */
function handlePanEnd() {
  isPanning = false;
}

/**
 * Handle touch start for mobile
 */
function handleTouchStart(e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    if (!e.target.closest('.zoom-controls') && !e.target.closest('.carbon-circle')) {
      isPanning = true;
      panStartX = touch.clientX - panX;
      panStartY = touch.clientY - panY;
    }
  }
}

/**
 * Handle touch move for mobile
 */
function handleTouchMove(e) {
  if (!isPanning || e.touches.length !== 1) return;

  e.preventDefault();
  const touch = e.touches[0];
  panX = touch.clientX - panStartX;
  panY = touch.clientY - panStartY;
  updateViewBox();
}

/**
 * Export the current view as PNG
 */
function exportAsPNG() {
  // Get the SVG element
  const svgElement = document.getElementById('chair-svg');

  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true);

  // Reset transform for export (show at 100% zoom, centered)
  svgClone.style.transform = '';

  // Get SVG dimensions
  const svgRect = svgElement.getBoundingClientRect();
  const width = 800;  // Export at higher resolution
  const height = 700;

  // Set explicit dimensions on clone
  svgClone.setAttribute('width', width);
  svgClone.setAttribute('height', height);
  svgClone.setAttribute('viewBox', '0 0 400 350');

  // Add white background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  svgClone.insertBefore(bg, svgClone.firstChild);

  // Add inline styles for export
  addInlineStyles(svgClone);

  // Convert to data URL
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Create image and canvas for PNG conversion
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);

    // Download
    const pngUrl = canvas.toDataURL('image/png');
    downloadFile(pngUrl, getExportFilename('png'));

    URL.revokeObjectURL(svgUrl);
  };
  img.src = svgUrl;
}

/**
 * Export the current view as SVG
 */
function exportAsSVG() {
  // Get the SVG element
  const svgElement = document.getElementById('chair-svg');

  // Clone the SVG
  const svgClone = svgElement.cloneNode(true);

  // Reset transform for export
  svgClone.style.transform = '';
  svgClone.setAttribute('width', '400');
  svgClone.setAttribute('height', '350');
  svgClone.setAttribute('viewBox', '0 0 400 350');

  // Add white background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  svgClone.insertBefore(bg, svgClone.firstChild);

  // Add inline styles for export
  addInlineStyles(svgClone);

  // Convert to blob and download
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  downloadFile(svgUrl, getExportFilename('svg'));

  setTimeout(() => URL.revokeObjectURL(svgUrl), 100);
}

/**
 * Add inline styles to SVG elements for export
 */
function addInlineStyles(svgElement) {
  // Style mappings for export
  const styles = {
    '.carbon-bond': { stroke: '#334155', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
    '.carbon-circle': { fill: '#f1f5f9', stroke: '#334155', 'stroke-width': '2' },
    '.carbon-circle.bridgehead': { fill: '#fef3c7', stroke: '#d97706', 'stroke-width': '2.5' },
    '.carbon-label': { 'font-size': '11px', 'font-weight': '600', fill: '#1e293b', 'font-family': 'sans-serif' },
    '.oxygen-circle': { fill: '#fecaca', stroke: '#dc2626', 'stroke-width': '2' },
    '.oxygen-label': { 'font-size': '12px', 'font-weight': '700', fill: '#dc2626', 'font-family': 'sans-serif' },
    '.hydrogen-bond': { stroke: '#94a3b8', 'stroke-width': '2', 'stroke-linecap': 'round' },
    '.explicit-bond': { stroke: '#334155', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
    '.explicit-label': { fill: '#dc2626', 'font-weight': '600', 'font-size': '13px', 'font-family': 'sans-serif' },
    '.hydrogen-label': { fill: '#94a3b8', 'font-size': '10px', 'font-family': 'sans-serif' },
    '.ax-eq-label': { 'font-size': '9px', fill: '#64748b', 'font-style': 'italic', 'font-family': 'sans-serif' },
    '.sugar-label': { 'font-size': '14px', 'font-weight': '600', fill: '#1e293b', 'font-family': 'sans-serif' },
    '.conformation-label': { 'font-size': '12px', fill: '#64748b', 'font-family': 'sans-serif' },
    '.decalin-label': { 'font-size': '14px', 'font-weight': '600', fill: '#1e293b', 'font-family': 'sans-serif' },
    '.ring-a-bond': { stroke: '#2563eb', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
    '.ring-b-bond': { stroke: '#059669', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
    '.bridging-bond': { stroke: '#334155', 'stroke-width': '3', 'stroke-linecap': 'round' },
    '.oxygen-bond': { stroke: '#dc2626', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
  };

  for (const [selector, styleObj] of Object.entries(styles)) {
    const elements = svgElement.querySelectorAll(selector);
    elements.forEach(el => {
      for (const [prop, value] of Object.entries(styleObj)) {
        el.style[prop] = value;
      }
    });
  }
}

/**
 * Generate filename for export
 */
function getExportFilename(extension) {
  let name = 'chair';

  if (currentMode === 'pyranose' && state.sugarType) {
    name = `${state.anomer}-${state.sugarType}`;
  } else if (currentMode === 'decalin') {
    name = `${state.decalinType}-decalin`;
  } else if (state.substituents && state.substituents.length > 0) {
    name = 'substituted-cyclohexane';
  } else {
    name = 'cyclohexane';
  }

  return `${name}.${extension}`;
}

/**
 * Trigger file download
 */
function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
