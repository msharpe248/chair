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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
