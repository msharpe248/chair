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

import { render, renderChair, highlightCarbon, getSubstituentLabel, draw13DiaxialInteractions } from './renderer.js';

import {
  compareConformations,
  formatEnergy,
  getPreferredDescription
} from './energy.js';

import { createPyranoseState, changeSugarType, toggleAnomer } from './pyranose.js';
import { createDecalinState, canFlip, getDecalinInfo, toggleDecalinType } from './decalin.js';
import { renderNewman } from './newman.js';
import { generateQuestion, checkAnswer } from './quiz.js';
import { parseCyclohexaneSMILES } from './smiles.js';

// Application State
let state = createMoleculeState();
let currentMode = 'cyclohexane';
let currentView = 'chair';  // 'chair' or 'newman'
let newmanBondIndex = 0;    // Which C-C bond to view in Newman projection
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

// 3D rotation state
let is3DEnabled = false;
let rotateX = 0;
let rotateY = 0;

// Quiz state
let quizDifficulty = 1;
let currentQuestion = null;
let selectedAnswer = null;
let quizScore = { correct: 0, total: 0 };

// Theme state
let currentTheme = localStorage.getItem('theme') || 'auto';

// Preset definitions for cyclohexane examples
const PRESETS = {
  // Single substituent
  'methyl-ax': {
    name: 'Methylcyclohexane (axial)',
    substituents: [{ carbonIndex: 0, position: 'axial', group: 'CH3' }]
  },
  'methyl-eq': {
    name: 'Methylcyclohexane (equatorial)',
    substituents: [{ carbonIndex: 0, position: 'equatorial', group: 'CH3' }]
  },
  'tbutyl-eq': {
    name: 'tert-Butylcyclohexane',
    substituents: [{ carbonIndex: 0, position: 'equatorial', group: 'tBu' }]
  },

  // 1,2-disubstituted (carbons 0 and 1)
  '1,2-dimethyl-cis': {
    name: '1,2-Dimethylcyclohexane (cis)',
    // cis = both on same face = one axial, one equatorial
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 1, position: 'axial', group: 'CH3' }
    ]
  },
  '1,2-dimethyl-trans': {
    name: '1,2-Dimethylcyclohexane (trans)',
    // trans = opposite faces = both equatorial (or both axial)
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 1, position: 'equatorial', group: 'CH3' }
    ]
  },

  // 1,3-disubstituted (carbons 0 and 2)
  '1,3-dimethyl-cis': {
    name: '1,3-Dimethylcyclohexane (cis)',
    // cis 1,3 = same face = both equatorial (or both axial)
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 2, position: 'equatorial', group: 'CH3' }
    ]
  },
  '1,3-dimethyl-trans': {
    name: '1,3-Dimethylcyclohexane (trans)',
    // trans 1,3 = opposite faces = one axial, one equatorial
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 2, position: 'axial', group: 'CH3' }
    ]
  },

  // 1,4-disubstituted (carbons 0 and 3)
  '1,4-dimethyl-cis': {
    name: '1,4-Dimethylcyclohexane (cis)',
    // cis 1,4 = same face = one axial, one equatorial
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 3, position: 'axial', group: 'CH3' }
    ]
  },
  '1,4-dimethyl-trans': {
    name: '1,4-Dimethylcyclohexane (trans)',
    // trans 1,4 = opposite faces = both equatorial (or both axial)
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 3, position: 'equatorial', group: 'CH3' }
    ]
  },

  // Complex examples
  'menthol': {
    name: 'Menthol-like pattern',
    // 1-methyl, 2-isopropyl, 4-hydroxyl (all equatorial in preferred conformer)
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 1, position: 'equatorial', group: 'iPr' },
      { carbonIndex: 3, position: 'equatorial', group: 'OH' }
    ]
  },
  'all-axial': {
    name: 'All Axial Methyl Groups',
    substituents: [
      { carbonIndex: 0, position: 'axial', group: 'CH3' },
      { carbonIndex: 1, position: 'axial', group: 'CH3' },
      { carbonIndex: 2, position: 'axial', group: 'CH3' },
      { carbonIndex: 3, position: 'axial', group: 'CH3' },
      { carbonIndex: 4, position: 'axial', group: 'CH3' },
      { carbonIndex: 5, position: 'axial', group: 'CH3' }
    ]
  },
  'all-equatorial': {
    name: 'All Equatorial Methyl Groups',
    substituents: [
      { carbonIndex: 0, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 1, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 2, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 3, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 4, position: 'equatorial', group: 'CH3' },
      { carbonIndex: 5, position: 'equatorial', group: 'CH3' }
    ]
  }
};

// DOM Elements
let svg;
let picker;
let showLabelsCheckbox;
let showInteractionsCheckbox;

/**
 * Initialize the application
 */
function init() {
  // Get DOM elements
  svg = document.getElementById('chair-svg');
  picker = document.getElementById('substituent-picker');
  showLabelsCheckbox = document.getElementById('show-labels');
  showInteractionsCheckbox = document.getElementById('show-interactions');

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

  // Show 1,3-diaxial interactions checkbox
  showInteractionsCheckbox.addEventListener('change', renderView);

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

  // Preset selector
  document.getElementById('preset-select').addEventListener('change', handlePresetChange);

  // SMILES input
  document.getElementById('parse-smiles-btn').addEventListener('click', handleSMILESParse);
  document.getElementById('smiles-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSMILESParse();
    }
  });

  // View toggle (Chair/Newman)
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => handleViewChange(e.target.dataset.view));
  });

  // Newman bond selector
  document.getElementById('newman-bond-select').addEventListener('change', handleNewmanBondChange);

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

  // 3D rotation controls
  document.getElementById('enable-3d').addEventListener('change', handle3DToggle);
  document.getElementById('rotate-x').addEventListener('input', handleRotationChange);
  document.getElementById('rotate-y').addEventListener('input', handleRotationChange);
  document.getElementById('reset-rotation-btn').addEventListener('click', resetRotation);

  // Quiz controls
  document.getElementById('quiz-mode-btn').addEventListener('click', toggleQuizMode);
  document.getElementById('new-question-btn').addEventListener('click', loadNewQuestion);
  document.getElementById('submit-answer-btn').addEventListener('click', submitQuizAnswer);
  document.getElementById('reset-quiz-btn').addEventListener('click', resetQuizScore);

  // Quiz difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      quizDifficulty = parseInt(e.target.dataset.level, 10);
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // Initialize theme
  initTheme();
}

/**
 * Handle mode change (cyclohexane/pyranose/decalin)
 */
function handleModeChange(mode) {
  if (mode === currentMode) return;

  currentMode = mode;

  // Reset to chair view when switching modes
  currentView = 'chair';
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === 'chair');
  });
  document.getElementById('newman-bond-select').classList.add('hidden');

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
      // Reset preset dropdown
      document.getElementById('preset-select').value = '';
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
 * Handle preset change
 */
function handlePresetChange(e) {
  const presetKey = e.target.value;
  if (!presetKey || !PRESETS[presetKey]) {
    return;
  }

  const preset = PRESETS[presetKey];

  // Create a fresh molecule state and apply the preset's substituents
  state = createMoleculeState();

  for (const sub of preset.substituents) {
    state = setSubstituent(state, sub.carbonIndex, sub.position, sub.group);
  }

  renderView();
}

/**
 * Handle SMILES input parsing
 */
function handleSMILESParse() {
  const input = document.getElementById('smiles-input');
  const errorDiv = document.getElementById('smiles-error');
  const smiles = input.value.trim();

  // Clear previous error
  errorDiv.classList.add('hidden');
  errorDiv.textContent = '';

  if (!smiles) {
    return;
  }

  const result = parseCyclohexaneSMILES(smiles);

  if (!result.success) {
    errorDiv.textContent = result.error;
    errorDiv.classList.remove('hidden');
    return;
  }

  // Apply the parsed substituents
  state = createMoleculeState();

  for (const sub of result.substituents) {
    state = setSubstituent(state, sub.carbonIndex, sub.position, sub.group);
  }

  // Clear preset selection since we're using custom SMILES
  document.getElementById('preset-select').value = '';

  renderView();
}

/**
 * Handle view change (Chair/Newman)
 */
function handleViewChange(view) {
  if (view === currentView) return;

  currentView = view;

  // Update button states
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  // Show/hide Newman bond selector
  const bondSelect = document.getElementById('newman-bond-select');
  bondSelect.classList.toggle('hidden', view !== 'newman');

  renderView();
}

/**
 * Handle Newman bond selection change
 */
function handleNewmanBondChange(e) {
  newmanBondIndex = parseInt(e.target.value, 10);
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
  const showInteractions = showInteractionsCheckbox.checked;

  // Check if we should render Newman projection (cyclohexane mode only)
  if (currentMode === 'cyclohexane' && currentView === 'newman') {
    renderNewman(svg, state, newmanBondIndex);
  } else {
    render(svg, state, {
      showLabels,
      onCarbonClick: currentMode === 'cyclohexane' ? handleCarbonClick : null
    });

    // Draw 1,3-diaxial interactions if enabled (cyclohexane chair view only)
    if (currentMode === 'cyclohexane' && showInteractions) {
      draw13DiaxialInteractions(svg, state, state.flipped);
    }
  }

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
      // Reset preset dropdown
      document.getElementById('preset-select').value = '';
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

  // Update text values
  document.getElementById('energy-delta').textContent = formatEnergy(comparison.deltaE);
  document.getElementById('preferred-chair').textContent = getPreferredDescription(comparison);

  // Update bar chart
  updateEnergyBarChart(comparison);
}

/**
 * Update the energy bar chart visualization
 */
function updateEnergyBarChart(comparison) {
  const barCurrent = document.getElementById('bar-current');
  const barFlipped = document.getElementById('bar-flipped');
  const valueCurrent = document.getElementById('bar-current-value');
  const valueFlipped = document.getElementById('bar-flipped-value');
  const chartMax = document.getElementById('chart-max');

  const energyCurrent = comparison.energyCurrent;
  const energyFlipped = comparison.energyFlipped;

  // Determine max scale (round up to nice number)
  const maxEnergy = Math.max(energyCurrent, energyFlipped, 0.5);
  const scale = Math.ceil(maxEnergy * 2) / 2; // Round to nearest 0.5
  const displayScale = Math.max(scale, 1); // Minimum scale of 1

  // Calculate bar widths as percentages
  const currentWidth = (energyCurrent / displayScale) * 100;
  const flippedWidth = (energyFlipped / displayScale) * 100;

  // Update bars
  barCurrent.style.width = `${Math.min(currentWidth, 100)}%`;
  barFlipped.style.width = `${Math.min(flippedWidth, 100)}%`;

  // Update values
  valueCurrent.textContent = energyCurrent.toFixed(2);
  valueFlipped.textContent = energyFlipped.toFixed(2);

  // Update scale label
  chartMax.textContent = displayScale.toFixed(1);

  // Highlight preferred conformer
  barCurrent.classList.remove('preferred');
  barFlipped.classList.remove('preferred');

  if (comparison.deltaE < -0.1) {
    barCurrent.classList.add('preferred');
  } else if (comparison.deltaE > 0.1) {
    barFlipped.classList.add('preferred');
  }
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
 * Handle 3D toggle
 */
function handle3DToggle(e) {
  is3DEnabled = e.target.checked;

  const container = document.getElementById('chair-container');
  const rotateXSlider = document.getElementById('rotate-x');
  const rotateYSlider = document.getElementById('rotate-y');
  const resetBtn = document.getElementById('reset-rotation-btn');

  container.classList.toggle('mode-3d', is3DEnabled);
  rotateXSlider.classList.toggle('hidden', !is3DEnabled);
  rotateYSlider.classList.toggle('hidden', !is3DEnabled);
  resetBtn.classList.toggle('hidden', !is3DEnabled);

  if (!is3DEnabled) {
    resetRotation();
  }

  update3DTransform();
}

/**
 * Handle rotation slider change
 */
function handleRotationChange() {
  rotateX = parseInt(document.getElementById('rotate-x').value, 10);
  rotateY = parseInt(document.getElementById('rotate-y').value, 10);
  update3DTransform();
}

/**
 * Reset rotation to default
 */
function resetRotation() {
  rotateX = 0;
  rotateY = 0;
  document.getElementById('rotate-x').value = 0;
  document.getElementById('rotate-y').value = 0;
  update3DTransform();
}

/**
 * Update 3D transform on the SVG wrapper
 */
function update3DTransform() {
  const wrapper = document.getElementById('svg-wrapper');

  if (is3DEnabled) {
    wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  } else {
    wrapper.style.transform = '';
  }
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

// ============== Quiz Functions ==============

/**
 * Toggle quiz mode on/off
 */
function toggleQuizMode() {
  const quizPanel = document.getElementById('quiz-panel');
  const quizBtn = document.getElementById('quiz-mode-btn');
  const isActive = !quizPanel.classList.contains('hidden');

  if (isActive) {
    // Turn off quiz mode
    quizPanel.classList.add('hidden');
    quizBtn.classList.remove('active');
    quizBtn.textContent = 'Quiz Mode';
  } else {
    // Turn on quiz mode
    quizPanel.classList.remove('hidden');
    quizBtn.classList.add('active');
    quizBtn.textContent = 'Exit Quiz';
  }
}

/**
 * Load a new quiz question
 */
function loadNewQuestion() {
  currentQuestion = generateQuestion(quizDifficulty);
  selectedAnswer = null;

  // Update the main view with the question's molecule
  state = currentQuestion.molecule;
  currentMode = 'cyclohexane';
  currentView = 'chair';

  // Update mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === 'cyclohexane');
  });

  renderView();

  // Display the question
  document.getElementById('quiz-question').textContent = currentQuestion.question;

  // Display options
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach((option, index) => {
    const optionEl = document.createElement('label');
    optionEl.className = 'quiz-option';
    optionEl.innerHTML = `
      <input type="radio" name="quiz-answer" value="${option.value}">
      <span>${option.label}</span>
    `;
    optionEl.addEventListener('click', () => {
      selectedAnswer = option.value;
      document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
      optionEl.classList.add('selected');
      document.getElementById('submit-answer-btn').disabled = false;
    });
    optionsContainer.appendChild(optionEl);
  });

  // Reset feedback
  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.add('hidden');
  feedback.classList.remove('correct', 'incorrect');

  // Enable submit button only after selection
  document.getElementById('submit-answer-btn').disabled = true;
}

/**
 * Submit quiz answer
 */
function submitQuizAnswer() {
  if (!currentQuestion || selectedAnswer === null) return;

  const isCorrect = checkAnswer(currentQuestion, selectedAnswer);

  // Update score
  quizScore.total++;
  if (isCorrect) {
    quizScore.correct++;
  }
  updateQuizScoreDisplay();

  // Show feedback
  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.remove('hidden', 'correct', 'incorrect');
  feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
  feedback.innerHTML = isCorrect
    ? `<strong>Correct!</strong> ${currentQuestion.explanation}`
    : `<strong>Incorrect.</strong> ${currentQuestion.explanation}`;

  // Highlight correct/incorrect options
  document.querySelectorAll('.quiz-option').forEach(el => {
    const input = el.querySelector('input');
    const value = input.value;

    // Convert value to match type of correctAnswer
    let typedValue = value;
    if (typeof currentQuestion.correctAnswer === 'number') {
      typedValue = parseFloat(value);
    }

    if (typedValue === currentQuestion.correctAnswer) {
      el.classList.add('correct');
    } else if (value === String(selectedAnswer)) {
      el.classList.add('incorrect');
    }
    input.disabled = true;
  });

  // Disable submit button
  document.getElementById('submit-answer-btn').disabled = true;
}

/**
 * Reset quiz score
 */
function resetQuizScore() {
  quizScore = { correct: 0, total: 0 };
  updateQuizScoreDisplay();
}

/**
 * Update the quiz score display
 */
function updateQuizScoreDisplay() {
  document.getElementById('quiz-score').textContent = `${quizScore.correct}/${quizScore.total}`;
}

// ============== Export Functions ==============

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
    '.diaxial-interaction': { fill: 'none', stroke: '#ef4444', 'stroke-width': '2', 'stroke-dasharray': '4 2', opacity: '0.7' },
    '.diaxial-label': { 'font-size': '8px', fill: '#ef4444', 'font-weight': '500', 'font-family': 'sans-serif' },
    '.newman-front-circle': { fill: '#ffffff', stroke: '#334155', 'stroke-width': '2.5' },
    '.newman-center-dot': { fill: '#334155' },
    '.newman-bond': { stroke: '#334155', 'stroke-width': '2.5', 'stroke-linecap': 'round' },
    '.newman-back-bond': { stroke: '#64748b', 'stroke-width': '2' },
    '.newman-label': { 'font-size': '12px', 'font-weight': '500', fill: '#1e293b', 'font-family': 'sans-serif' },
    '.newman-back-label': { fill: '#64748b' },
    '.newman-substituent-label': { fill: '#dc2626', 'font-weight': '600' },
    '.newman-title': { 'font-size': '14px', 'font-weight': '600', fill: '#1e293b', 'font-family': 'sans-serif' },
    '.newman-legend': { 'font-size': '11px', fill: '#64748b', 'font-family': 'sans-serif' },
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

// ============== Theme Functions ==============

/**
 * Initialize theme based on saved preference or system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // If no saved preference, let CSS handle system preference
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let newTheme;

  if (currentTheme === 'dark') {
    // Dark -> Light
    newTheme = 'light';
  } else if (currentTheme === 'light') {
    // Light -> Auto (remove attribute)
    newTheme = null;
  } else {
    // Auto -> opposite of system preference
    newTheme = prefersDark ? 'light' : 'dark';
  }

  if (newTheme) {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
