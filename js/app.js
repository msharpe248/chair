/**
 * Chair Conformation Viewer - Main Application
 *
 * Handles user interaction, state management, and coordinates
 * rendering and energy calculations.
 */

import {
  createMoleculeState,
  setSubstituent,
  removeSubstituent,
  getSubstituent,
  flipChair,
  resetMolecule
} from './chair.js';

import { renderChair, highlightCarbon, getSubstituentLabel } from './renderer.js';

import {
  compareConformations,
  formatEnergy,
  getPreferredDescription
} from './energy.js';

// Application State
let state = createMoleculeState();
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
  render();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Ring flip button
  document.getElementById('flip-btn').addEventListener('click', handleFlip);

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', handleReset);

  // Show labels checkbox
  showLabelsCheckbox.addEventListener('change', render);

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

  // Mode buttons (for future pyranose/decalin support)
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      // TODO: Handle mode change
    });
  });
}

/**
 * Main render function
 */
function render() {
  const showLabels = showLabelsCheckbox.checked;

  renderChair(svg, state, {
    showLabels,
    onCarbonClick: handleCarbonClick
  });

  updateEnergyDisplay();
  updateSubstituentsList();
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
  render();
  closePicker();
}

/**
 * Handle removing a substituent (replacing with H)
 */
function handleRemoveSubstituent() {
  if (selectedCarbon === null) return;

  state = removeSubstituent(state, selectedCarbon, selectedPosition);
  render();
  closePicker();
}

/**
 * Handle ring flip
 */
function handleFlip() {
  state = flipChair(state);
  render();
}

/**
 * Handle reset
 */
function handleReset() {
  state = resetMolecule();
  render();
}

/**
 * Update the energy display panel
 */
function updateEnergyDisplay() {
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

  if (state.substituents.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-message';
    li.textContent = 'Click a position on the chair to add substituents';
    list.appendChild(li);
    return;
  }

  // Sort by carbon index
  const sorted = [...state.substituents].sort((a, b) => a.carbonIndex - b.carbonIndex);

  for (const sub of sorted) {
    const li = document.createElement('li');
    const posLabel = sub.position === 'axial' ? 'ax' : 'eq';
    li.textContent = `C${sub.carbonIndex + 1}: ${getSubstituentLabel(sub.group)} (${posLabel})`;
    list.appendChild(li);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
