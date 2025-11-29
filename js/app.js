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
import { renderEnergyDiagram as renderEnergyDiagramSVG, REACTION_PRESETS, getEnergyInfo, renderInteractiveEnergyDiagram, createCustomConfig } from './energy-diagram.js';
import { predictMechanism, getMechanismEnergy, explainPrediction, getCompetingMechanisms } from './reaction-predictor.js';
import { analyzeReaction, getEnergyFromSMILES, REACTION_EXAMPLES } from './reaction-smiles.js';
import { generateEnergyQuestion, checkEnergyAnswer, resetEnergyQuiz, getEnergyQuizState } from './energy-quiz.js';
import { E2_PRESETS, analyzeE2, generateE2Question } from './e2-stereo.js';
import { renderE2Newman, getE2Analysis, E2_NEWMAN_CONFIGS } from './e2-newman.js';
import { HYDROGENATION_DATA, COMPARISON_SETS, getStabilityRanking, generateAlkeneQuestion, checkAlkeneAnswer, parseAlkeneSMILES } from './alkene-stability.js';
import { renderAlkeneComparison, renderHydrogenationDiagram } from './alkene-renderer.js';
import { PRESET_MOLECULES, REACTION_OUTCOMES, calculateStereoOutcome, generateStereoQuestion, checkStereoAnswer, parseStereoSMILES } from './stereochemistry.js';
import { renderSN2Mechanism, renderSN1Mechanism, renderRelationshipDiagram } from './stereo-renderer.js';
import { MECHANISMS, getMechanism, getStepData, generateMechanismQuestion, checkMechanismAnswer } from './mechanism-animator.js';
import { renderMechanism, renderSN2Mechanism as renderMechSN2, renderSN1Mechanism as renderMechSN1, renderE2Mechanism as renderMechE2, renderAdditionMechanism, renderBrominationMechanism } from './mechanism-renderer.js';
import { initBuilder } from './smiles-builder.js';
import { NOMENCLATURE_DATA, getAllCompounds, getCompoundsByDifficulty, getCompoundsByClass, generateNomenclatureQuestion, checkNomenclatureAnswer, NAMING_RULES, getNamingRules } from './nomenclature.js';
import { renderMolecule, renderNomenclatureQuiz, renderEZExplanation, renderNamingRules } from './nomenclature-renderer.js';
import { REAGENT_DATA, getAllReagents, getReagentsByCategory, generateReagentQuestion, checkReagentAnswer } from './reagents.js';

console.log('app.js module loaded - all imports successful');

// Application State
let state = createMoleculeState();
let currentViewer = 'chair';  // 'chair' or 'energy'
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

// Energy diagram state
let energyCurves = [];
let selectedReactionPreset = 'sn2';
let energyMode = 'predict';  // 'predict', 'smiles', 'preset', or 'quiz'
let currentPrediction = null;

// Energy quiz state
let energyQuizActive = false;
let currentEnergyQuestion = null;

// Custom energy diagram state
let customEnergyConfig = {
  ea: 15,
  deltaH: -5,
  twoStep: false,
  intE: 12,
  ea2: 5
};

// E2 stereochemistry state
let e2Substrate = '2-bromobutane';
let e2Base = 'NaOEt';
let e2ShowHighlighting = true;
let e2ViewMode = 'newman';  // 'newman' or 'chair'
let e2QuizActive = false;
let e2QuizScore = { correct: 0, total: 0 };
let currentE2Question = null;
let selectedE2Answer = null;
let selectedEnergyAnswer = null;

// Alkene stability state
let alkeneComparisonSet = 'butene-isomers';
let alkeneViewMode = 'comparison';  // 'comparison' or 'energy'
let alkeneHighlightMost = true;
let alkeneCustomSelection = [];
let alkeneQuizActive = false;
let alkeneQuizScore = { correct: 0, total: 0 };
let currentAlkeneQuestion = null;
let selectedAlkeneAnswer = null;

// Stereochemistry tracker state
let stereoMode = 'sn2';  // 'sn2', 'sn1', 'enantiomers', 'diastereomers'
let stereoStartConfig = 'R';
let stereoMolecule = '2-bromobutane-r';
let stereoQuizActive = false;
let stereoQuizScore = { correct: 0, total: 0 };
let currentStereoQuestion = null;
let selectedStereoAnswer = null;

// Mechanism animator state
let mechanismType = 'sn2';  // 'sn2', 'sn1', 'e2', 'e1', 'addition-hbr', 'addition-br2'
let mechanismStep = 0;
let mechanismShowArrows = true;
let mechanismQuizActive = false;
let mechanismQuizScore = { correct: 0, total: 0 };

// Nomenclature state
let nomenclatureClass = 'all';
let nomenclatureDifficulty = 'all';
let nomenclatureMode = 'practice';  // 'practice' or 'rules'
let nomenclatureCurrentCompound = null;
let nomenclatureQuizActive = false;
let nomenclatureQuizScore = { correct: 0, total: 0 };
let nomenclatureCurrentQuestion = null;
let currentMechanismQuestion = null;
let selectedMechanismAnswer = null;

// Reagent quiz state
let reagentQuizActive = false;
let reagentQuizScore = { correct: 0, total: 0 };
let reagentCurrentQuestion = null;

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
  console.log('App initializing...');
  try {
    // Get DOM elements
    svg = document.getElementById('chair-svg');
    picker = document.getElementById('substituent-picker');
    showLabelsCheckbox = document.getElementById('show-labels');
    showInteractionsCheckbox = document.getElementById('show-interactions');

    // Set up event listeners
    setupEventListeners();

    // Initialize SMILES Builder tool
    initBuilder();

    // Reset viewer dropdown to 'chair' on page load for consistent state
    // (browsers may remember previous selection on refresh)
    const viewerSelect = document.getElementById('viewer-select');
    viewerSelect.value = 'chair';
    currentViewer = 'chair';

    // Initial render
    renderView();
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
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

  // Viewer selector (switch between Chair and Energy viewers)
  document.getElementById('viewer-select').addEventListener('change', handleViewerChange);

  // Energy diagram controls
  document.getElementById('reaction-preset').addEventListener('change', handleReactionPresetChange);
  document.getElementById('add-curve-btn').addEventListener('click', handleAddCurve);
  document.getElementById('clear-curves-btn').addEventListener('click', handleClearCurves);

  // Custom energy diagram sliders
  document.getElementById('ea-slider').addEventListener('input', handleEaSliderChange);
  document.getElementById('delta-h-slider').addEventListener('input', handleDeltaHSliderChange);
  document.getElementById('two-step-checkbox').addEventListener('change', handleTwoStepToggle);
  document.getElementById('int-slider').addEventListener('input', handleIntSliderChange);
  document.getElementById('ea2-slider').addEventListener('input', handleEa2SliderChange);

  // Energy mode toggle (predict vs preset)
  document.querySelectorAll('.energy-mode-btn').forEach(btn => {
    btn.addEventListener('click', handleEnergyModeToggle);
  });

  // Prediction controls
  document.getElementById('predict-btn').addEventListener('click', handlePredictMechanism);
  document.getElementById('show-competing-btn').addEventListener('click', handleShowCompeting);

  // Auto-predict when conditions change
  ['substrate-select', 'nucleophile-select', 'leaving-group-select', 'solvent-select', 'temperature-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      if (energyMode === 'predict' && currentViewer === 'energy') {
        handlePredictMechanism();
      }
    });
  });

  // SMILES mode controls
  document.getElementById('analyze-smiles-btn').addEventListener('click', handleAnalyzeSMILES);
  document.getElementById('smiles-example-select').addEventListener('change', handleSMILESExample);

  // Energy quiz controls
  document.getElementById('energy-quiz-mode-btn').addEventListener('click', toggleEnergyQuizMode);
  document.getElementById('energy-new-question-btn').addEventListener('click', handleEnergyNewQuestion);
  document.getElementById('energy-submit-btn').addEventListener('click', handleEnergySubmitAnswer);

  // E2 stereochemistry controls
  document.getElementById('e2-substrate-select').addEventListener('change', handleE2SubstrateChange);
  document.getElementById('e2-base-select').addEventListener('change', handleE2BaseChange);
  document.getElementById('e2-show-anti').addEventListener('change', handleE2HighlightToggle);
  document.getElementById('e2-analyze-btn').addEventListener('click', handleE2Analyze);
  document.querySelectorAll('.e2-view-btn').forEach(btn => {
    btn.addEventListener('click', handleE2ViewToggle);
  });

  // Alkene stability controls
  document.getElementById('alkene-comparison-set').addEventListener('change', handleAlkeneComparisonChange);
  document.getElementById('alkene-highlight-most').addEventListener('change', handleAlkeneHighlightToggle);
  document.getElementById('alkene-quiz-mode-btn').addEventListener('click', toggleAlkeneQuizMode);
  document.getElementById('alkene-new-question-btn').addEventListener('click', handleAlkeneNewQuestion);
  document.getElementById('alkene-submit-btn').addEventListener('click', handleAlkeneSubmitAnswer);

  // Alkene view toggle buttons
  document.querySelectorAll('.alkene-view-btn').forEach(btn => {
    btn.addEventListener('click', handleAlkeneViewToggle);
  });

  // Custom alkene checkboxes
  document.querySelectorAll('.alkene-checkboxes input').forEach(checkbox => {
    checkbox.addEventListener('change', handleAlkeneCustomSelectionChange);
  });

  // Alkene SMILES input
  document.getElementById('alkene-analyze-btn').addEventListener('click', handleAlkeneSMILESAnalyze);
  document.getElementById('alkene-smiles-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAlkeneSMILESAnalyze();
  });

  // Alkene SMILES example buttons
  document.querySelectorAll('#alkene-controls .example-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.getElementById('alkene-smiles-input').value = e.target.dataset.smiles;
      handleAlkeneSMILESAnalyze();
    });
  });

  // Stereochemistry tracker controls
  document.getElementById('stereo-mode-select').addEventListener('change', handleStereoModeChange);
  document.getElementById('stereo-molecule-select').addEventListener('change', handleStereoMoleculeChange);
  document.getElementById('stereo-quiz-mode-btn').addEventListener('click', toggleStereoQuizMode);
  document.getElementById('stereo-new-question-btn').addEventListener('click', handleStereoNewQuestion);
  document.getElementById('stereo-submit-btn').addEventListener('click', handleStereoSubmitAnswer);

  // Config toggle buttons
  document.querySelectorAll('.config-btn').forEach(btn => {
    btn.addEventListener('click', handleConfigToggle);
  });

  // Stereochemistry SMILES input
  document.getElementById('stereo-analyze-btn').addEventListener('click', handleStereoSMILESAnalyze);
  document.getElementById('stereo-smiles-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleStereoSMILESAnalyze();
  });

  // Stereochemistry SMILES example buttons
  document.querySelectorAll('#stereo-controls .example-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.getElementById('stereo-smiles-input').value = e.target.dataset.smiles;
      handleStereoSMILESAnalyze();
    });
  });

  // Mechanism animator controls
  document.getElementById('mechanism-type-select').addEventListener('change', handleMechanismTypeChange);
  document.getElementById('mechanism-prev-btn').addEventListener('click', handleMechanismPrevStep);
  document.getElementById('mechanism-next-btn').addEventListener('click', handleMechanismNextStep);
  document.getElementById('mechanism-show-arrows').addEventListener('change', handleMechanismArrowToggle);
  document.getElementById('mechanism-quiz-mode-btn').addEventListener('click', toggleMechanismQuizMode);
  document.getElementById('mechanism-new-question-btn').addEventListener('click', handleMechanismNewQuestion);
  document.getElementById('mechanism-submit-btn').addEventListener('click', handleMechanismSubmitAnswer);

  // Nomenclature viewer controls
  document.getElementById('nomenclature-class-select').addEventListener('change', handleNomenclatureClassChange);
  document.getElementById('nomenclature-difficulty-select').addEventListener('change', handleNomenclatureDifficultyChange);
  document.querySelectorAll('.nomenclature-mode-btn').forEach(btn => {
    btn.addEventListener('click', handleNomenclatureModeToggle);
  });
  document.getElementById('nomenclature-new-btn').addEventListener('click', handleNewNomenclatureCompound);
  document.getElementById('nomenclature-quiz-mode-btn').addEventListener('click', toggleNomenclatureQuizMode);
  document.getElementById('nomenclature-new-question-btn').addEventListener('click', handleNomenclatureNewQuestion);
  document.getElementById('nomenclature-submit-btn').addEventListener('click', handleNomenclatureSubmitAnswer);

  // Reagent quiz controls
  document.getElementById('reagent-quiz-mode-btn').addEventListener('click', toggleReagentQuizMode);
  document.getElementById('reagent-new-question-btn').addEventListener('click', handleReagentNewQuestion);
  document.getElementById('reagent-submit-btn').addEventListener('click', handleReagentSubmitAnswer);

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

// ============== Viewer Switching ==============

/**
 * Handle switching between viewers (chair, energy)
 */
function handleViewerChange(e) {
  try {
    const newViewer = e.target.value;
    console.log('handleViewerChange called:', newViewer);
    if (newViewer === currentViewer) return;

    currentViewer = newViewer;
    console.log('Switching to viewer:', currentViewer);

    // Hide all mode controls first
    document.querySelectorAll('.mode-controls').forEach(el => el.classList.add('hidden'));

  // Show/hide chair-only elements
  document.querySelectorAll('.chair-only').forEach(el => {
    el.style.display = currentViewer === 'chair' ? '' : 'none';
  });

  // Show/hide energy-only elements
  document.querySelectorAll('.energy-only').forEach(el => {
    el.style.display = currentViewer === 'energy' ? '' : 'none';
    el.classList.toggle('hidden', currentViewer !== 'energy');
  });

  // Show/hide chair mode selector
  const modeSelector = document.getElementById('chair-mode-selector');
  modeSelector.style.display = currentViewer === 'chair' ? '' : 'none';

  // Hide chair mode controls when not in chair viewer
  if (currentViewer !== 'chair') {
    document.getElementById('cyclohexane-controls').classList.add('hidden');
    document.getElementById('pyranose-controls').classList.add('hidden');
    document.getElementById('decalin-controls').classList.add('hidden');
  }

  // Show/hide viewer-specific panels
  const energyPanel = document.getElementById('energy-panel');
  const reactionPanel = document.getElementById('reaction-energy-panel');
  const decalinPanel = document.getElementById('decalin-energy-panel');
  const e2Panel = document.getElementById('e2-panel');
  const alkenePanel = document.getElementById('alkene-panel');

  // Hide E2, alkene, and stereo panels by default
  e2Panel.classList.add('hidden');
  alkenePanel.classList.add('hidden');
  const stereoPanel = document.getElementById('stereo-panel');
  stereoPanel.classList.add('hidden');

  // Hide alkene-only elements by default
  document.querySelectorAll('.alkene-only').forEach(el => {
    el.style.display = 'none';
    el.classList.add('hidden');
  });

  // Hide stereo-only elements by default
  document.querySelectorAll('.stereo-only').forEach(el => {
    el.style.display = 'none';
    el.classList.add('hidden');
  });

  // Hide mechanism-only elements by default
  document.querySelectorAll('.mechanism-only').forEach(el => {
    el.style.display = 'none';
    el.classList.add('hidden');
  });

  // Hide mechanism panel by default
  const mechanismPanel = document.getElementById('mechanism-panel');
  mechanismPanel.classList.add('hidden');

  // Hide nomenclature-only elements by default
  document.querySelectorAll('.nomenclature-only').forEach(el => {
    el.style.display = 'none';
    el.classList.add('hidden');
  });

  // Hide nomenclature panel by default
  const nomenclaturePanel = document.getElementById('nomenclature-panel');
  nomenclaturePanel.classList.add('hidden');

  if (currentViewer === 'chair') {
    // Show chair-specific controls based on current mode
    if (currentMode === 'cyclohexane') {
      document.getElementById('cyclohexane-controls').classList.remove('hidden');
      energyPanel.classList.remove('hidden');
      decalinPanel.classList.add('hidden');
    } else if (currentMode === 'pyranose') {
      document.getElementById('pyranose-controls').classList.remove('hidden');
      energyPanel.classList.remove('hidden');
      decalinPanel.classList.add('hidden');
    } else if (currentMode === 'decalin') {
      document.getElementById('decalin-controls').classList.remove('hidden');
      energyPanel.classList.add('hidden');
      decalinPanel.classList.remove('hidden');
    }
    reactionPanel.classList.add('hidden');

    // Re-render chair view
    renderView();
  } else if (currentViewer === 'energy') {
    // Show energy diagram controls
    document.getElementById('energy-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.remove('hidden');

    // Initialize based on current energy mode
    if (energyMode === 'predict') {
      // Show predict controls, hide preset controls
      document.getElementById('predict-controls').classList.remove('hidden');
      document.getElementById('preset-controls').classList.add('hidden');
      document.getElementById('prediction-result').classList.remove('hidden');
      document.getElementById('prediction-explanation').classList.remove('hidden');
      document.getElementById('curve-list').classList.add('hidden');

      // Run initial prediction
      handlePredictMechanism();
    } else {
      // Show preset controls, hide predict controls
      document.getElementById('predict-controls').classList.add('hidden');
      document.getElementById('preset-controls').classList.remove('hidden');
      document.getElementById('prediction-result').classList.add('hidden');
      document.getElementById('prediction-explanation').classList.add('hidden');
      document.getElementById('curve-list').classList.remove('hidden');

      renderEnergyDiagram();
    }
  } else if (currentViewer === 'e2') {
    // Show E2 stereochemistry controls
    document.getElementById('e2-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.add('hidden');
    document.getElementById('e2-panel').classList.remove('hidden');

    // Reset SVG viewBox and transforms for E2 viewer
    const svg = document.getElementById('chair-svg');
    svg.setAttribute('viewBox', '0 0 400 350');
    svg.style.transform = '';

    // Render E2 Newman projection
    console.log('About to call renderE2View');
    renderE2View();
  } else if (currentViewer === 'alkene') {
    // Show alkene stability controls
    document.getElementById('alkene-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.add('hidden');
    document.getElementById('alkene-panel').classList.remove('hidden');

    // Show alkene quiz button, hide others
    document.querySelectorAll('.alkene-only').forEach(el => {
      el.style.display = '';
      el.classList.remove('hidden');
    });

    // Reset SVG viewBox and transforms for alkene viewer
    const svg = document.getElementById('chair-svg');
    svg.setAttribute('viewBox', '0 0 400 350');
    svg.style.transform = '';

    // Render alkene view
    console.log('About to call renderAlkeneView');
    renderAlkeneView();
  } else if (currentViewer === 'stereo') {
    // Show stereochemistry tracker controls
    document.getElementById('stereo-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.add('hidden');
    document.getElementById('stereo-panel').classList.remove('hidden');

    // Show stereo quiz button, hide others
    document.querySelectorAll('.stereo-only').forEach(el => {
      el.style.display = '';
      el.classList.remove('hidden');
    });

    // Reset SVG viewBox and transforms for stereo viewer
    const svg = document.getElementById('chair-svg');
    svg.setAttribute('viewBox', '0 0 400 350');
    svg.style.transform = '';

    // Render stereo view
    console.log('About to call renderStereoView');
    renderStereoView();
  } else if (currentViewer === 'mechanism') {
    // Show mechanism animator controls
    document.getElementById('mechanism-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.add('hidden');
    document.getElementById('mechanism-panel').classList.remove('hidden');

    // Show mechanism quiz button, hide others
    document.querySelectorAll('.mechanism-only').forEach(el => {
      el.style.display = '';
      el.classList.remove('hidden');
    });

    // Reset step to 0 when entering mechanism view
    mechanismStep = 0;

    // Reset SVG viewBox and transforms for mechanism viewer
    const svg = document.getElementById('chair-svg');
    svg.setAttribute('viewBox', '0 0 400 350');
    svg.style.transform = '';

    // Render mechanism view
    console.log('About to call renderMechanismView');
    renderMechanismView();
  } else if (currentViewer === 'nomenclature') {
    // Show nomenclature controls
    document.getElementById('nomenclature-controls').classList.remove('hidden');
    energyPanel.classList.add('hidden');
    decalinPanel.classList.add('hidden');
    reactionPanel.classList.add('hidden');
    document.getElementById('nomenclature-panel').classList.remove('hidden');

    // Show nomenclature quiz button, hide others
    document.querySelectorAll('.nomenclature-only').forEach(el => {
      el.style.display = '';
      el.classList.remove('hidden');
    });

    // Reset SVG viewBox and transforms for nomenclature viewer
    const svg = document.getElementById('chair-svg');
    svg.setAttribute('viewBox', '0 0 500 350');
    svg.style.transform = '';

    // Render nomenclature view
    console.log('About to call renderNomenclatureView');
    renderNomenclatureView();
  }
  } catch (error) {
    console.error('Error in handleViewerChange:', error);
  }
}

/**
 * Render E2 stereochemistry view
 */
function renderE2View() {
  console.log('renderE2View called');
  const svg = document.getElementById('chair-svg');
  console.log('SVG element:', svg);
  try {
    if (e2ViewMode === 'chair') {
      renderE2Chair(svg, e2Substrate, e2ShowHighlighting);
    } else {
      renderE2Newman(svg, e2Substrate, e2ShowHighlighting);
    }
    updateE2Panel();
    console.log('renderE2View completed successfully');
  } catch (error) {
    console.error('Error in renderE2View:', error);
  }
}

/**
 * Update E2 analysis panel
 */
function updateE2Panel() {
  const analysis = getE2Analysis(e2Substrate, e2Base);
  if (!analysis) return;

  // Update product list
  const productList = document.getElementById('e2-product-list');
  productList.innerHTML = '';

  for (const product of analysis.products) {
    const item = document.createElement('div');
    item.className = 'e2-product-item' + (product.canEliminate ? ' major' : '');

    const name = document.createElement('span');
    name.className = 'product-name';
    name.textContent = `H at ${product.position} (${product.dihedral}°)`;
    item.appendChild(name);

    const tag = document.createElement('span');
    tag.className = 'product-tag';
    tag.textContent = product.canEliminate ? 'Anti - Can eliminate' : 'Gauche - Cannot eliminate';
    item.appendChild(tag);

    productList.appendChild(item);
  }

  // Update major product
  const majorProductDiv = document.getElementById('e2-major-product');
  if (analysis.majorProduct && !analysis.needsRingFlip) {
    majorProductDiv.classList.remove('hidden');
    document.getElementById('e2-major-name').textContent = analysis.majorProduct.name;
    document.getElementById('e2-product-type').textContent =
      analysis.isBulkyBase ? 'Hofmann product (bulky base)' : 'Zaitsev product (non-bulky base)';
  } else {
    majorProductDiv.classList.add('hidden');
  }

  // Update explanation list
  const explanationList = document.getElementById('e2-explanation-list');
  explanationList.innerHTML = '';

  const explanations = [
    `Leaving group: ${analysis.leavingGroup}`,
    `Base: ${analysis.isBulkyBase ? 'Bulky (Hofmann)' : 'Non-bulky (Zaitsev)'}`,
    'Anti-periplanar H required (180° dihedral)'
  ];

  if (analysis.needsRingFlip) {
    explanations.push('⚠ No anti-periplanar H - ring flip needed!');
  }

  if (analysis.note) {
    explanations.push(analysis.note);
  }

  for (const exp of explanations) {
    const li = document.createElement('li');
    li.innerHTML = exp;
    explanationList.appendChild(li);
  }
}

/**
 * Handle E2 substrate change
 */
function handleE2SubstrateChange(e) {
  e2Substrate = e.target.value;
  renderE2View();
}

/**
 * Handle E2 base change
 */
function handleE2BaseChange(e) {
  e2Base = e.target.value;
  updateE2Panel();
}

/**
 * Handle E2 highlighting toggle
 */
function handleE2HighlightToggle(e) {
  e2ShowHighlighting = e.target.checked;
  renderE2View();
}

/**
 * Handle E2 analyze button
 */
function handleE2Analyze() {
  renderE2View();
}

/**
 * Handle E2 view toggle (Newman vs Chair)
 */
function handleE2ViewToggle(e) {
  const newView = e.target.dataset.view;
  if (newView === e2ViewMode) return;

  e2ViewMode = newView;

  // Update button states
  document.querySelectorAll('.e2-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === newView);
  });

  renderE2View();
}

/**
 * Render E2 elimination in chair conformation
 * Shows trans-diaxial requirement for cyclohexane substrates
 */
function renderE2Chair(svg, substrateKey, showHighlighting) {
  // Clear SVG
  svg.innerHTML = '';

  const config = E2_NEWMAN_CONFIGS[substrateKey];
  if (!config) return;

  // Check if this is a cyclic substrate
  if (!config.isCyclic) {
    // For acyclic substrates, show a message
    renderAcyclicE2Message(svg, config);
    return;
  }

  // Chair geometry constants
  const centerX = 200;
  const centerY = 150;
  const width = 160;
  const height = 80;
  const axialLength = 50;
  const eqLength = 40;

  // Define chair carbon positions (6 carbons)
  const carbons = [
    { x: centerX - width/2, y: centerY },                    // C1 (left)
    { x: centerX - width/4, y: centerY - height/2 },         // C2 (top-left)
    { x: centerX + width/4, y: centerY - height/2 },         // C3 (top-right)
    { x: centerX + width/2, y: centerY },                    // C4 (right)
    { x: centerX + width/4, y: centerY + height/2 },         // C5 (bottom-right)
    { x: centerX - width/4, y: centerY + height/2 }          // C6 (bottom-left)
  ];

  // Draw title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'mechanism-title');
  title.textContent = config.name + ' - Chair View';
  svg.appendChild(title);

  // Draw chair bonds
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    const bond = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    bond.setAttribute('x1', carbons[i].x);
    bond.setAttribute('y1', carbons[i].y);
    bond.setAttribute('x2', carbons[next].x);
    bond.setAttribute('y2', carbons[next].y);
    bond.setAttribute('stroke', '#334155');
    bond.setAttribute('stroke-width', '2.5');
    bond.setAttribute('stroke-linecap', 'round');
    svg.appendChild(bond);
  }

  // E2 Chair configurations for different substrates
  const chairConfigs = {
    'cyclohexyl-bromide': {
      leavingGroup: { pos: 0, type: 'axial', label: 'Br', color: '#dc2626' },
      betaHydrogens: [
        { pos: 1, type: 'axial', canEliminate: true },
        { pos: 1, type: 'equatorial', canEliminate: false },
        { pos: 5, type: 'axial', canEliminate: true },
        { pos: 5, type: 'equatorial', canEliminate: false }
      ],
      explanation: 'Axial Br needs axial β-H for E2 (trans-diaxial)'
    },
    'menthyl-chloride': {
      leavingGroup: { pos: 0, type: 'axial', label: 'Cl', color: '#16a34a' },
      substituents: [
        { pos: 0, type: 'equatorial', label: 'iPr' },
        { pos: 1, type: 'equatorial', label: 'Me' },
        { pos: 4, type: 'equatorial', label: 'Me' }
      ],
      betaHydrogens: [
        { pos: 1, type: 'axial', canEliminate: true }
      ],
      explanation: 'Only ONE axial β-H available → ONE product'
    },
    'neomenthyl-chloride': {
      leavingGroup: { pos: 0, type: 'equatorial', label: 'Cl', color: '#16a34a' },
      substituents: [
        { pos: 0, type: 'axial', label: 'iPr' },
        { pos: 1, type: 'axial', label: 'Me' },
        { pos: 4, type: 'equatorial', label: 'Me' }
      ],
      betaHydrogens: [
        { pos: 1, type: 'equatorial', canEliminate: false }
      ],
      explanation: 'Equatorial Cl has NO trans-diaxial H → must ring flip!'
    }
  };

  const chairConfig = chairConfigs[substrateKey];
  if (!chairConfig) return;

  // Helper to determine if axial bond goes up or down at each carbon
  function axialGoesUp(carbonIdx) {
    // In a chair: C1, C3, C5 have axial going up; C2, C4, C6 have axial going down
    // (or vice versa depending on chair orientation)
    return carbonIdx === 0 || carbonIdx === 2 || carbonIdx === 4;
  }

  // Helper to get axial/equatorial bond endpoint
  function getBondEnd(carbonIdx, type) {
    const c = carbons[carbonIdx];

    if (type === 'axial') {
      const goesUp = axialGoesUp(carbonIdx);
      return {
        x: c.x,
        y: goesUp ? c.y - axialLength : c.y + axialLength
      };
    } else {
      // Equatorial bonds point outward in the plane of the ring
      // Angles chosen to point away from ring center and avoid overlaps
      const eqAngles = [180, -45, 45, 0, 135, -135]; // degrees for each carbon
      const angle = eqAngles[carbonIdx] * Math.PI / 180;
      return {
        x: c.x + Math.cos(angle) * eqLength,
        y: c.y + Math.sin(angle) * eqLength * 0.5
      };
    }
  }

  // Helper to get label position (offset from bond end)
  function getLabelPos(bondEnd, carbonPos, type, carbonIdx) {
    if (type === 'axial') {
      const goesUp = axialGoesUp(carbonIdx);
      return {
        x: bondEnd.x,
        y: goesUp ? bondEnd.y - 10 : bondEnd.y + 14
      };
    } else {
      // Position label based on equatorial direction for each carbon
      const eqAngles = [180, -45, 45, 0, 135, -135];
      const angle = eqAngles[carbonIdx] * Math.PI / 180;
      return {
        x: bondEnd.x + Math.cos(angle) * 12,
        y: bondEnd.y + Math.sin(angle) * 6 + 4
      };
    }
  }

  // Draw leaving group
  const lg = chairConfig.leavingGroup;
  const lgEnd = getBondEnd(lg.pos, lg.type);
  const lgBond = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  lgBond.setAttribute('x1', carbons[lg.pos].x);
  lgBond.setAttribute('y1', carbons[lg.pos].y);
  lgBond.setAttribute('x2', lgEnd.x);
  lgBond.setAttribute('y2', lgEnd.y);
  lgBond.setAttribute('stroke', lg.color);
  lgBond.setAttribute('stroke-width', '3');
  svg.appendChild(lgBond);

  // Leaving group label
  const lgLabelPos = getLabelPos(lgEnd, carbons[lg.pos], lg.type, lg.pos);
  const lgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  lgLabel.setAttribute('x', lgLabelPos.x);
  lgLabel.setAttribute('y', lgLabelPos.y);
  lgLabel.setAttribute('text-anchor', 'middle');
  lgLabel.setAttribute('fill', lg.color);
  lgLabel.setAttribute('font-weight', 'bold');
  lgLabel.setAttribute('font-size', '14');
  lgLabel.textContent = lg.label;
  svg.appendChild(lgLabel);

  // Draw other substituents
  if (chairConfig.substituents) {
    chairConfig.substituents.forEach(sub => {
      const subEnd = getBondEnd(sub.pos, sub.type);
      const subBond = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      subBond.setAttribute('x1', carbons[sub.pos].x);
      subBond.setAttribute('y1', carbons[sub.pos].y);
      subBond.setAttribute('x2', subEnd.x);
      subBond.setAttribute('y2', subEnd.y);
      subBond.setAttribute('stroke', '#64748b');
      subBond.setAttribute('stroke-width', '2');
      svg.appendChild(subBond);

      const subLabelPos = getLabelPos(subEnd, carbons[sub.pos], sub.type, sub.pos);
      const subLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      subLabel.setAttribute('x', subLabelPos.x);
      subLabel.setAttribute('y', subLabelPos.y);
      subLabel.setAttribute('text-anchor', 'middle');
      subLabel.setAttribute('fill', '#64748b');
      subLabel.setAttribute('font-size', '11');
      subLabel.textContent = sub.label;
      svg.appendChild(subLabel);
    });
  }

  // Draw β-hydrogens
  chairConfig.betaHydrogens.forEach(h => {
    const hEnd = getBondEnd(h.pos, h.type);
    const hBond = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hBond.setAttribute('x1', carbons[h.pos].x);
    hBond.setAttribute('y1', carbons[h.pos].y);
    hBond.setAttribute('x2', hEnd.x);
    hBond.setAttribute('y2', hEnd.y);

    if (showHighlighting && h.canEliminate) {
      hBond.setAttribute('stroke', '#2563eb');
      hBond.setAttribute('stroke-width', '3');
    } else {
      hBond.setAttribute('stroke', '#94a3b8');
      hBond.setAttribute('stroke-width', '2');
    }
    svg.appendChild(hBond);

    const hLabelPos = getLabelPos(hEnd, carbons[h.pos], h.type, h.pos);
    const hLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hLabel.setAttribute('x', hLabelPos.x);
    hLabel.setAttribute('y', hLabelPos.y);
    hLabel.setAttribute('text-anchor', 'middle');
    hLabel.setAttribute('font-size', '12');

    if (showHighlighting && h.canEliminate) {
      hLabel.setAttribute('fill', '#2563eb');
      hLabel.setAttribute('font-weight', 'bold');
      hLabel.textContent = 'H (anti)';
    } else {
      hLabel.setAttribute('fill', '#94a3b8');
      hLabel.textContent = 'H';
    }
    svg.appendChild(hLabel);
  });

  // Draw carbon labels - position them to avoid bond overlaps
  carbons.forEach((c, i) => {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Offset labels based on carbon position to avoid bonds
    let offsetX = 0, offsetY = 0;
    switch (i) {
      case 0: offsetX = -18; offsetY = 4; break;   // C1 left - push further left
      case 1: offsetX = -12; offsetY = -8; break;  // C2 top-left - push up-left
      case 2: offsetX = 12; offsetY = -8; break;   // C3 top-right - push up-right
      case 3: offsetX = 18; offsetY = 4; break;    // C4 right - push further right
      case 4: offsetX = 12; offsetY = 12; break;   // C5 bottom-right - push down-right
      case 5: offsetX = -12; offsetY = 12; break;  // C6 bottom-left - push down-left
    }

    label.setAttribute('x', c.x + offsetX);
    label.setAttribute('y', c.y + offsetY);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#94a3b8');
    label.setAttribute('font-size', '9');
    label.textContent = 'C' + (i + 1);
    svg.appendChild(label);
  });

  // Draw explanation
  const explText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  explText.setAttribute('x', '200');
  explText.setAttribute('y', '280');
  explText.setAttribute('text-anchor', 'middle');
  explText.setAttribute('fill', '#64748b');
  explText.setAttribute('font-size', '12');
  explText.textContent = chairConfig.explanation;
  svg.appendChild(explText);

  // Trans-diaxial requirement note
  const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  noteText.setAttribute('x', '200');
  noteText.setAttribute('y', '300');
  noteText.setAttribute('text-anchor', 'middle');
  noteText.setAttribute('fill', '#2563eb');
  noteText.setAttribute('font-size', '11');
  noteText.setAttribute('font-weight', '500');
  noteText.textContent = 'E2 requires trans-diaxial geometry (LG and H both axial)';
  svg.appendChild(noteText);
}

/**
 * Render message for acyclic substrates in chair view
 */
function renderAcyclicE2Message(svg, config) {
  svg.innerHTML = '';

  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '100');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'mechanism-title');
  title.textContent = config.name;
  svg.appendChild(title);

  const msg1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  msg1.setAttribute('x', '200');
  msg1.setAttribute('y', '160');
  msg1.setAttribute('text-anchor', 'middle');
  msg1.setAttribute('fill', '#64748b');
  msg1.setAttribute('font-size', '14');
  msg1.textContent = 'Chair view is for cyclohexane substrates.';
  svg.appendChild(msg1);

  const msg2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  msg2.setAttribute('x', '200');
  msg2.setAttribute('y', '185');
  msg2.setAttribute('text-anchor', 'middle');
  msg2.setAttribute('fill', '#64748b');
  msg2.setAttribute('font-size', '14');
  msg2.textContent = 'Use Newman Projection for acyclic substrates.';
  svg.appendChild(msg2);

  const msg3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  msg3.setAttribute('x', '200');
  msg3.setAttribute('y', '230');
  msg3.setAttribute('text-anchor', 'middle');
  msg3.setAttribute('fill', '#2563eb');
  msg3.setAttribute('font-size', '12');
  msg3.textContent = 'Try: Bromocyclohexane, Menthyl chloride, or Neomenthyl chloride';
  svg.appendChild(msg3);
}

// ============== Alkene Stability Functions ==============

/**
 * Render alkene stability view
 */
function renderAlkeneView() {
  console.log('renderAlkeneView called');
  const svg = document.getElementById('chair-svg');
  const alkeneKeys = getCurrentAlkeneKeys();
  console.log('Alkene keys:', alkeneKeys);

  try {
    if (alkeneViewMode === 'comparison') {
      renderAlkeneComparison(svg, alkeneKeys, { highlightMostStable: alkeneHighlightMost });
    } else {
      renderHydrogenationDiagram(svg, alkeneKeys);
    }
    updateAlkenePanel(alkeneKeys);
    console.log('renderAlkeneView completed successfully');
  } catch (error) {
    console.error('Error in renderAlkeneView:', error);
  }
}

/**
 * Get current alkene keys based on selection
 */
function getCurrentAlkeneKeys() {
  if (alkeneComparisonSet === 'custom') {
    return alkeneCustomSelection;
  }
  const set = COMPARISON_SETS[alkeneComparisonSet];
  return set ? set.alkenes : [];
}

/**
 * Update alkene analysis panel
 */
function updateAlkenePanel(alkeneKeys) {
  const ranking = getStabilityRanking(alkeneKeys);

  // Update ranking list
  const rankingList = document.getElementById('alkene-ranking-list');
  rankingList.innerHTML = '';

  if (ranking.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-message';
    li.textContent = 'Select alkenes to compare';
    rankingList.appendChild(li);
    return;
  }

  ranking.forEach((alkene, index) => {
    const li = document.createElement('li');
    li.textContent = `${alkene.name} (${alkene.deltaH} kcal/mol)`;
    if (index === 0) li.classList.add('most-stable');
    if (index === ranking.length - 1) li.classList.add('least-stable');
    rankingList.appendChild(li);
  });

  // Update info panel
  const mostStable = ranking[0];
  const leastStable = ranking[ranking.length - 1];

  document.getElementById('alkene-most-stable').textContent = mostStable.name;
  document.getElementById('alkene-most-stable-dh').textContent = `${mostStable.deltaH} kcal/mol`;
  document.getElementById('alkene-least-stable').textContent = leastStable.name;
  document.getElementById('alkene-least-stable-dh').textContent = `${leastStable.deltaH} kcal/mol`;

  const diff = Math.abs(mostStable.deltaH - leastStable.deltaH);
  document.getElementById('alkene-diff').textContent = `${diff.toFixed(1)} kcal/mol`;
}

/**
 * Handle alkene comparison set change
 */
function handleAlkeneComparisonChange(e) {
  alkeneComparisonSet = e.target.value;

  // Show/hide custom selection
  const customSelect = document.getElementById('alkene-custom-select');
  customSelect.classList.toggle('hidden', alkeneComparisonSet !== 'custom');

  if (alkeneComparisonSet !== 'custom') {
    renderAlkeneView();
  }
}

/**
 * Handle alkene view toggle (bar chart vs energy diagram)
 */
function handleAlkeneViewToggle(e) {
  const view = e.target.dataset.view;
  if (view === alkeneViewMode) return;

  alkeneViewMode = view;

  document.querySelectorAll('.alkene-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  renderAlkeneView();
}

/**
 * Handle alkene highlight toggle
 */
function handleAlkeneHighlightToggle(e) {
  alkeneHighlightMost = e.target.checked;
  renderAlkeneView();
}

/**
 * Handle custom alkene selection change
 */
function handleAlkeneCustomSelectionChange() {
  alkeneCustomSelection = [];
  document.querySelectorAll('.alkene-checkboxes input:checked').forEach(checkbox => {
    alkeneCustomSelection.push(checkbox.value);
  });

  if (alkeneComparisonSet === 'custom') {
    renderAlkeneView();
  }
}

/**
 * Handle alkene SMILES analysis
 */
function handleAlkeneSMILESAnalyze() {
  const input = document.getElementById('alkene-smiles-input');
  const smiles = input.value.trim();

  if (!smiles) {
    alert('Please enter a SMILES string for an alkene');
    return;
  }

  const result = parseAlkeneSMILES(smiles);
  const resultPanel = document.getElementById('alkene-smiles-result');

  if (result.error) {
    resultPanel.classList.remove('hidden');
    document.getElementById('alkene-result-smiles').textContent = smiles;
    document.getElementById('alkene-result-class').textContent = 'Error';
    document.getElementById('alkene-result-stereo').textContent = '—';
    document.getElementById('alkene-result-dh').textContent = result.error;
    document.getElementById('alkene-result-explanation').innerHTML = '';
    return;
  }

  // Display the results
  resultPanel.classList.remove('hidden');
  document.getElementById('alkene-result-smiles').textContent = result.smiles;
  document.getElementById('alkene-result-class').textContent =
    result.substitution.charAt(0).toUpperCase() + result.substitution.slice(1) +
    ` (${result.substituents} substituent${result.substituents !== 1 ? 's' : ''})`;
  document.getElementById('alkene-result-stereo').textContent =
    result.stereochemistry ? result.stereochemistry + ' isomer' : 'N/A (no stereochemistry)';
  document.getElementById('alkene-result-dh').textContent = result.deltaH + ' kcal/mol';

  // Display explanation
  const explanationDiv = document.getElementById('alkene-result-explanation');
  if (result.explanation && result.explanation.length > 0) {
    explanationDiv.innerHTML = '<ul>' +
      result.explanation.map(exp => `<li>${exp}</li>`).join('') +
      '</ul>';
  } else {
    explanationDiv.innerHTML = '';
  }
}

/**
 * Toggle alkene quiz mode
 */
function toggleAlkeneQuizMode() {
  alkeneQuizActive = !alkeneQuizActive;

  const quizBtn = document.getElementById('alkene-quiz-mode-btn');
  const quizPanel = document.getElementById('alkene-quiz-panel');
  const infoPanel = document.getElementById('alkene-info');
  const explanationPanel = document.getElementById('alkene-explanation');

  if (alkeneQuizActive) {
    quizBtn.classList.add('active');
    quizPanel.classList.remove('hidden');
    infoPanel.classList.add('hidden');
    explanationPanel.classList.add('hidden');
    handleAlkeneNewQuestion();
  } else {
    quizBtn.classList.remove('active');
    quizPanel.classList.add('hidden');
    infoPanel.classList.remove('hidden');
    explanationPanel.classList.remove('hidden');
    renderAlkeneView();
  }
}

/**
 * Generate new alkene quiz question
 */
function handleAlkeneNewQuestion() {
  currentAlkeneQuestion = generateAlkeneQuestion();
  selectedAlkeneAnswer = null;

  // Update question display
  document.getElementById('alkene-quiz-question').textContent = currentAlkeneQuestion.question;

  // Build options
  const optionsContainer = document.getElementById('alkene-quiz-options');
  optionsContainer.innerHTML = '';

  currentAlkeneQuestion.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.dataset.value = option.value;
    btn.textContent = option.label;
    btn.addEventListener('click', () => selectAlkeneAnswer(option.value));
    optionsContainer.appendChild(btn);
  });

  // Hide feedback
  document.getElementById('alkene-quiz-feedback').classList.add('hidden');

  // Disable submit until answer selected
  document.getElementById('alkene-submit-btn').disabled = true;

  // Render diagram for question if applicable
  if (currentAlkeneQuestion.alkenes) {
    renderAlkeneComparison(document.getElementById('chair-svg'), currentAlkeneQuestion.alkenes, { highlightMostStable: false });
  }
}

/**
 * Select alkene quiz answer
 */
function selectAlkeneAnswer(value) {
  selectedAlkeneAnswer = value;

  document.querySelectorAll('#alkene-quiz-options .quiz-option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value);
  });

  document.getElementById('alkene-submit-btn').disabled = false;
}

/**
 * Submit alkene quiz answer
 */
function handleAlkeneSubmitAnswer() {
  if (!selectedAlkeneAnswer || !currentAlkeneQuestion) return;

  const result = checkAlkeneAnswer(selectedAlkeneAnswer, currentAlkeneQuestion);

  // Update score
  alkeneQuizScore.total++;
  if (result.isCorrect) alkeneQuizScore.correct++;

  // Show feedback
  const feedbackDiv = document.getElementById('alkene-quiz-feedback');
  feedbackDiv.classList.remove('hidden');

  if (result.isCorrect) {
    feedbackDiv.className = 'quiz-feedback correct';
    feedbackDiv.innerHTML = `<strong>Correct!</strong> ${result.explanation}`;
  } else {
    const correctLabel = currentAlkeneQuestion.options.find(o => o.value === result.correctAnswer)?.label || result.correctAnswer;
    feedbackDiv.className = 'quiz-feedback incorrect';
    feedbackDiv.innerHTML = `<strong>Incorrect.</strong> The answer is ${correctLabel}. ${result.explanation}`;
  }

  // Update score display
  document.getElementById('alkene-quiz-score').textContent = `${alkeneQuizScore.correct}/${alkeneQuizScore.total}`;

  // Highlight correct/incorrect answers
  document.querySelectorAll('#alkene-quiz-options .quiz-option-btn').forEach(btn => {
    if (btn.dataset.value === result.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.dataset.value === selectedAlkeneAnswer && !result.isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  document.getElementById('alkene-submit-btn').disabled = true;
}

// ============== Stereochemistry Tracker Functions ==============

/**
 * Render stereochemistry view
 */
function renderStereoView() {
  console.log('renderStereoView called, mode:', stereoMode);
  const svg = document.getElementById('chair-svg');

  try {
    switch (stereoMode) {
      case 'sn2':
        renderSN2Mechanism(svg, stereoStartConfig);
        updateStereoPanel('sn2');
        break;
      case 'sn1':
        renderSN1Mechanism(svg, stereoStartConfig);
        updateStereoPanel('sn1');
        break;
      case 'enantiomers':
        renderRelationshipDiagram(svg, 'enantiomers');
        updateStereoPanel('enantiomers');
        break;
      case 'diastereomers':
        renderRelationshipDiagram(svg, 'diastereomers');
        updateStereoPanel('diastereomers');
        break;
    }
    console.log('renderStereoView completed successfully');
  } catch (error) {
    console.error('Error in renderStereoView:', error);
  }
}

/**
 * Update stereochemistry panel
 */
function updateStereoPanel(mode) {
  const startConfig = document.getElementById('stereo-start-config');
  const endConfig = document.getElementById('stereo-end-config');
  const result = document.getElementById('stereo-result');
  const explanationList = document.getElementById('stereo-explanation-list');

  // Clear previous
  startConfig.className = 'config-badge';
  endConfig.className = 'config-badge';

  if (mode === 'sn2') {
    const endConfigValue = stereoStartConfig === 'R' ? 'S' : 'R';
    startConfig.textContent = `(${stereoStartConfig})`;
    startConfig.classList.add(stereoStartConfig);
    endConfig.textContent = `(${endConfigValue})`;
    endConfig.classList.add(endConfigValue);
    result.textContent = 'Complete Inversion';

    explanationList.innerHTML = `
      <li><strong>Walden Inversion:</strong> (${stereoStartConfig}) → (${endConfigValue})</li>
      <li>Backside attack (180° from leaving group)</li>
      <li>Concerted mechanism - no intermediate</li>
      <li>Product is optically active</li>
    `;
  } else if (mode === 'sn1') {
    startConfig.textContent = `(${stereoStartConfig})`;
    startConfig.classList.add(stereoStartConfig);
    endConfig.textContent = 'Racemic';
    endConfig.classList.add('racemic');
    result.textContent = '50% R + 50% S';

    explanationList.innerHTML = `
      <li><strong>Racemization:</strong> Planar carbocation intermediate</li>
      <li>Nucleophile attacks from both faces equally</li>
      <li>50% retention + 50% inversion</li>
      <li>Product is NOT optically active</li>
    `;
  } else if (mode === 'enantiomers') {
    startConfig.textContent = '(R)';
    startConfig.classList.add('R');
    endConfig.textContent = '(S)';
    endConfig.classList.add('S');
    result.textContent = 'Mirror Images';

    explanationList.innerHTML = `
      <li><strong>Enantiomers:</strong> Non-superimposable mirror images</li>
      <li>Opposite configuration at ALL stereocenters</li>
      <li>Same physical properties (mp, bp, solubility)</li>
      <li>Opposite optical rotation (+/−)</li>
      <li>Same reactivity with achiral reagents</li>
    `;
  } else if (mode === 'diastereomers') {
    startConfig.textContent = '(R,R)';
    startConfig.classList.add('R');
    endConfig.textContent = '(R,S)';
    endConfig.classList.add('racemic');
    result.textContent = 'Not Mirror Images';

    explanationList.innerHTML = `
      <li><strong>Diastereomers:</strong> NOT mirror images</li>
      <li>Different configuration at SOME stereocenters</li>
      <li>Different physical properties</li>
      <li>Different reactivity</li>
      <li>One may be meso (achiral despite stereocenters)</li>
    `;
  }
}

/**
 * Handle stereochemistry SMILES analysis
 */
function handleStereoSMILESAnalyze() {
  const input = document.getElementById('stereo-smiles-input');
  const smiles = input.value.trim();

  if (!smiles) {
    alert('Please enter a SMILES string with stereochemistry notation');
    return;
  }

  const result = parseStereoSMILES(smiles);
  const resultPanel = document.getElementById('stereo-smiles-result');

  if (result.error) {
    resultPanel.classList.remove('hidden');
    document.getElementById('stereo-result-smiles').textContent = smiles;
    document.getElementById('stereo-result-centers').textContent = 'Error';
    document.getElementById('stereo-result-lg').textContent = '—';
    document.getElementById('stereo-result-sn2').textContent = result.error;
    document.getElementById('stereo-result-sn1').textContent = '—';
    document.getElementById('stereo-result-explanation').innerHTML = '';
    return;
  }

  // Display the results
  resultPanel.classList.remove('hidden');
  document.getElementById('stereo-result-smiles').textContent = result.smiles;

  // Display stereocenters
  if (result.stereocenters.length > 0) {
    const centerStr = result.stereocenters
      .map(sc => `${sc.config} (${sc.marker})`)
      .join(', ');
    document.getElementById('stereo-result-centers').textContent = centerStr;
  } else {
    document.getElementById('stereo-result-centers').textContent = 'None detected (use @/@@ notation)';
  }

  // Display leaving groups
  document.getElementById('stereo-result-lg').textContent =
    result.leavingGroups.length > 0 ? result.leavingGroups.join(', ') : 'None detected';

  // Display SN2 and SN1 outcomes
  document.getElementById('stereo-result-sn2').textContent = result.sn2Outcome || 'N/A';
  document.getElementById('stereo-result-sn1').textContent = result.sn1Outcome;

  // Display explanation
  const explanationDiv = document.getElementById('stereo-result-explanation');
  if (result.explanation && result.explanation.length > 0) {
    explanationDiv.innerHTML = '<ul>' +
      result.explanation.map(exp => `<li>${exp}</li>`).join('') +
      '</ul>';
  } else {
    explanationDiv.innerHTML = '';
  }
}

/**
 * Handle stereo mode change
 */
function handleStereoModeChange(e) {
  stereoMode = e.target.value;

  // Show/hide relevant controls
  const moleculeRow = document.getElementById('stereo-molecule-row');
  const configRow = document.getElementById('stereo-config-row');

  if (stereoMode === 'sn2' || stereoMode === 'sn1') {
    moleculeRow.classList.remove('hidden');
    configRow.classList.remove('hidden');
  } else {
    moleculeRow.classList.add('hidden');
    configRow.classList.add('hidden');
  }

  renderStereoView();
}

/**
 * Handle stereo molecule change
 */
function handleStereoMoleculeChange(e) {
  stereoMolecule = e.target.value;

  // Update config based on molecule
  if (stereoMolecule.includes('-r')) {
    stereoStartConfig = 'R';
  } else if (stereoMolecule.includes('-s')) {
    stereoStartConfig = 'S';
  }

  // Update config buttons
  document.querySelectorAll('.config-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.config === stereoStartConfig);
  });

  renderStereoView();
}

/**
 * Handle config toggle
 */
function handleConfigToggle(e) {
  const config = e.target.dataset.config;
  if (!config) return;

  stereoStartConfig = config;

  document.querySelectorAll('.config-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.config === config);
  });

  renderStereoView();
}

/**
 * Toggle stereo quiz mode
 */
function toggleStereoQuizMode() {
  stereoQuizActive = !stereoQuizActive;

  const quizBtn = document.getElementById('stereo-quiz-mode-btn');
  const quizPanel = document.getElementById('stereo-quiz-panel');
  const outcomePanel = document.getElementById('stereo-outcome');
  const explanationPanel = document.getElementById('stereo-explanation');

  if (stereoQuizActive) {
    quizBtn.classList.add('active');
    quizPanel.classList.remove('hidden');
    outcomePanel.classList.add('hidden');
    explanationPanel.classList.add('hidden');
    handleStereoNewQuestion();
  } else {
    quizBtn.classList.remove('active');
    quizPanel.classList.add('hidden');
    outcomePanel.classList.remove('hidden');
    explanationPanel.classList.remove('hidden');
    renderStereoView();
  }
}

/**
 * Generate new stereo quiz question
 */
function handleStereoNewQuestion() {
  currentStereoQuestion = generateStereoQuestion();
  selectedStereoAnswer = null;

  // Update question display
  document.getElementById('stereo-quiz-question').textContent = currentStereoQuestion.question;

  // Build options
  const optionsContainer = document.getElementById('stereo-quiz-options');
  optionsContainer.innerHTML = '';

  currentStereoQuestion.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.dataset.value = option.value;
    btn.textContent = option.label;
    btn.addEventListener('click', () => selectStereoAnswer(option.value));
    optionsContainer.appendChild(btn);
  });

  // Hide feedback
  document.getElementById('stereo-quiz-feedback').classList.add('hidden');

  // Disable submit until answer selected
  document.getElementById('stereo-submit-btn').disabled = true;
}

/**
 * Select stereo quiz answer
 */
function selectStereoAnswer(value) {
  selectedStereoAnswer = value;

  document.querySelectorAll('#stereo-quiz-options .quiz-option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value);
  });

  document.getElementById('stereo-submit-btn').disabled = false;
}

/**
 * Submit stereo quiz answer
 */
function handleStereoSubmitAnswer() {
  if (!selectedStereoAnswer || !currentStereoQuestion) return;

  const result = checkStereoAnswer(selectedStereoAnswer, currentStereoQuestion);

  // Update score
  stereoQuizScore.total++;
  if (result.isCorrect) stereoQuizScore.correct++;

  // Show feedback
  const feedbackDiv = document.getElementById('stereo-quiz-feedback');
  feedbackDiv.classList.remove('hidden');

  if (result.isCorrect) {
    feedbackDiv.className = 'quiz-feedback correct';
    feedbackDiv.innerHTML = `<strong>Correct!</strong> ${result.explanation}`;
  } else {
    const correctLabel = currentStereoQuestion.options.find(o => o.value === result.correctAnswer)?.label || result.correctAnswer;
    feedbackDiv.className = 'quiz-feedback incorrect';
    feedbackDiv.innerHTML = `<strong>Incorrect.</strong> The answer is ${correctLabel}. ${result.explanation}`;
  }

  // Update score display
  document.getElementById('stereo-quiz-score').textContent = `${stereoQuizScore.correct}/${stereoQuizScore.total}`;

  // Highlight correct/incorrect answers
  document.querySelectorAll('#stereo-quiz-options .quiz-option-btn').forEach(btn => {
    if (btn.dataset.value === result.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.dataset.value === selectedStereoAnswer && !result.isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  document.getElementById('stereo-submit-btn').disabled = true;
}

// ============== Mechanism Animator Functions ==============

/**
 * Render mechanism view
 */
function renderMechanismView() {
  console.log('renderMechanismView called, type:', mechanismType, 'step:', mechanismStep);
  const svg = document.getElementById('chair-svg');

  try {
    renderMechanism(svg, mechanismType, mechanismStep);
    updateMechanismPanel();
    updateMechanismStepControls();
    console.log('renderMechanismView completed successfully');
  } catch (error) {
    console.error('Error in renderMechanismView:', error);
  }
}

/**
 * Update mechanism panel
 */
function updateMechanismPanel() {
  const mechanism = getMechanism(mechanismType);
  if (!mechanism) return;

  // Update mechanism name
  document.getElementById('mechanism-name-display').textContent = mechanism.name;

  // Update type badge
  const typeBadge = document.getElementById('mechanism-type-badge');
  typeBadge.textContent = mechanism.type.charAt(0).toUpperCase() + mechanism.type.slice(1);
  typeBadge.className = 'mechanism-type-badge ' + mechanism.type;

  // Update step info
  const stepData = getStepData(mechanismType, mechanismStep);
  if (stepData) {
    document.getElementById('mechanism-step-title').textContent = stepData.title;
    document.getElementById('mechanism-step-description').textContent = stepData.description;
  }

  // Update key points
  const pointsList = document.getElementById('mechanism-points-list');
  pointsList.innerHTML = '';
  mechanism.keyPoints.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    pointsList.appendChild(li);
  });

  // Update products
  const productsList = document.getElementById('mechanism-products-list');
  productsList.innerHTML = '';
  mechanism.products.forEach(product => {
    const span = document.createElement('span');
    span.className = 'product-item';
    span.textContent = product;
    productsList.appendChild(span);
  });
}

/**
 * Update mechanism step navigation controls
 */
function updateMechanismStepControls() {
  const mechanism = getMechanism(mechanismType);
  if (!mechanism) return;

  const totalSteps = mechanism.steps.length;
  const prevBtn = document.getElementById('mechanism-prev-btn');
  const nextBtn = document.getElementById('mechanism-next-btn');
  const indicator = document.getElementById('mechanism-step-indicator');

  prevBtn.disabled = mechanismStep <= 0;
  nextBtn.disabled = mechanismStep >= totalSteps - 1;
  indicator.textContent = `${mechanismStep + 1} / ${totalSteps}`;
}

/**
 * Handle mechanism type change
 */
function handleMechanismTypeChange(e) {
  mechanismType = e.target.value;
  mechanismStep = 0;
  renderMechanismView();
}

/**
 * Handle mechanism previous step
 */
function handleMechanismPrevStep() {
  if (mechanismStep > 0) {
    mechanismStep--;
    renderMechanismView();
  }
}

/**
 * Handle mechanism next step
 */
function handleMechanismNextStep() {
  const mechanism = getMechanism(mechanismType);
  if (mechanism && mechanismStep < mechanism.steps.length - 1) {
    mechanismStep++;
    renderMechanismView();
  }
}

/**
 * Handle mechanism arrow toggle
 */
function handleMechanismArrowToggle(e) {
  mechanismShowArrows = e.target.checked;
  renderMechanismView();
}

/**
 * Toggle mechanism quiz mode
 */
function toggleMechanismQuizMode() {
  mechanismQuizActive = !mechanismQuizActive;

  const quizBtn = document.getElementById('mechanism-quiz-mode-btn');
  const quizPanel = document.getElementById('mechanism-quiz-panel');
  const infoPanel = document.getElementById('mechanism-info');
  const stepPanel = document.getElementById('mechanism-step-info');
  const keyPointsPanel = document.getElementById('mechanism-key-points');
  const productsPanel = document.getElementById('mechanism-products');

  if (mechanismQuizActive) {
    quizBtn.classList.add('active');
    quizPanel.classList.remove('hidden');
    infoPanel.classList.add('hidden');
    stepPanel.classList.add('hidden');
    keyPointsPanel.classList.add('hidden');
    productsPanel.classList.add('hidden');
    handleMechanismNewQuestion();
  } else {
    quizBtn.classList.remove('active');
    quizPanel.classList.add('hidden');
    infoPanel.classList.remove('hidden');
    stepPanel.classList.remove('hidden');
    keyPointsPanel.classList.remove('hidden');
    productsPanel.classList.remove('hidden');
    renderMechanismView();
  }
}

/**
 * Generate new mechanism quiz question
 */
function handleMechanismNewQuestion() {
  currentMechanismQuestion = generateMechanismQuestion();
  selectedMechanismAnswer = null;

  // Update question display
  document.getElementById('mechanism-quiz-question').textContent = currentMechanismQuestion.question;

  // Build options
  const optionsContainer = document.getElementById('mechanism-quiz-options');
  optionsContainer.innerHTML = '';

  currentMechanismQuestion.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.dataset.value = option.value;
    btn.textContent = option.label;
    btn.addEventListener('click', () => selectMechanismAnswer(option.value));
    optionsContainer.appendChild(btn);
  });

  // Hide feedback
  document.getElementById('mechanism-quiz-feedback').classList.add('hidden');

  // Disable submit until answer selected
  document.getElementById('mechanism-submit-btn').disabled = true;
}

/**
 * Select mechanism quiz answer
 */
function selectMechanismAnswer(value) {
  selectedMechanismAnswer = value;

  document.querySelectorAll('#mechanism-quiz-options .quiz-option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value);
  });

  document.getElementById('mechanism-submit-btn').disabled = false;
}

/**
 * Submit mechanism quiz answer
 */
function handleMechanismSubmitAnswer() {
  if (!selectedMechanismAnswer || !currentMechanismQuestion) return;

  const result = checkMechanismAnswer(selectedMechanismAnswer, currentMechanismQuestion);

  // Update score
  mechanismQuizScore.total++;
  if (result.isCorrect) mechanismQuizScore.correct++;

  // Show feedback
  const feedbackDiv = document.getElementById('mechanism-quiz-feedback');
  feedbackDiv.classList.remove('hidden');

  if (result.isCorrect) {
    feedbackDiv.className = 'quiz-feedback correct';
    feedbackDiv.innerHTML = `<strong>Correct!</strong> ${result.explanation}`;
  } else {
    const correctLabel = currentMechanismQuestion.options.find(o => o.value === result.correctAnswer)?.label || result.correctAnswer;
    feedbackDiv.className = 'quiz-feedback incorrect';
    feedbackDiv.innerHTML = `<strong>Incorrect.</strong> The answer is ${correctLabel}. ${result.explanation}`;
  }

  // Update score display
  document.getElementById('mechanism-quiz-score').textContent = `${mechanismQuizScore.correct}/${mechanismQuizScore.total}`;

  // Highlight correct/incorrect answers
  document.querySelectorAll('#mechanism-quiz-options .quiz-option-btn').forEach(btn => {
    if (btn.dataset.value === result.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.dataset.value === selectedMechanismAnswer && !result.isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  document.getElementById('mechanism-submit-btn').disabled = true;
}

/**
 * Render energy diagram with current curves
 */
function renderEnergyDiagram() {
  const svg = document.getElementById('chair-svg');

  if (energyCurves.length === 0) {
    // Show empty state with just the preset
    const preset = document.getElementById('reaction-preset').value;
    energyCurves = [{ preset: preset, name: REACTION_PRESETS[preset].name }];
  }

  renderEnergyDiagramSVG(svg, energyCurves);
  updateReactionEnergyPanel();
}

/**
 * Update the reaction energy info panel
 */
function updateReactionEnergyPanel() {
  const curveList = document.getElementById('curve-list');

  if (energyCurves.length === 0) {
    curveList.innerHTML = '<p class="empty-message">Select a reaction preset to begin</p>';
    return;
  }

  let html = '';
  energyCurves.forEach((curve, index) => {
    const info = getEnergyInfo(curve.preset);
    if (info) {
      html += `
        <div class="curve-info" data-index="${index}">
          <div class="curve-header">
            <span class="curve-name">${info.name}</span>
            ${energyCurves.length > 1 ? `<button class="remove-curve-btn" data-index="${index}">×</button>` : ''}
          </div>
          <div class="curve-details">
            <div class="energy-row">
              <span>Ea:</span>
              <span>${info.ea.toFixed(1)} kcal/mol</span>
            </div>
            <div class="energy-row">
              <span>ΔH:</span>
              <span>${info.deltaH.toFixed(1)} kcal/mol</span>
            </div>
            <div class="energy-row">
              <span>Steps:</span>
              <span>${info.steps}</span>
            </div>
          </div>
          <p class="curve-description">${info.description}</p>
        </div>
      `;
    }
  });

  curveList.innerHTML = html;

  // Add event listeners for remove buttons
  curveList.querySelectorAll('.remove-curve-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      energyCurves.splice(index, 1);
      renderEnergyDiagram();
    });
  });
}

/**
 * Handle reaction preset change
 */
function handleReactionPresetChange(e) {
  const preset = e.target.value;
  selectedReactionPreset = preset;

  // Show/hide custom controls
  const customControls = document.getElementById('custom-energy-controls');
  customControls.classList.toggle('hidden', preset !== 'custom');

  if (preset === 'custom') {
    // Render interactive diagram for custom preset
    renderCustomEnergyDiagram();
  } else {
    // Update the first curve or add if empty
    if (energyCurves.length === 0) {
      energyCurves = [{ preset: preset, name: REACTION_PRESETS[preset].name }];
    } else {
      energyCurves[0] = { preset: preset, name: REACTION_PRESETS[preset].name };
    }

    renderEnergyDiagram();
  }
}

/**
 * Render custom energy diagram with interactive controls
 */
function renderCustomEnergyDiagram() {
  const svg = document.getElementById('chair-svg');
  const config = createCustomConfig(
    customEnergyConfig.ea,
    customEnergyConfig.deltaH,
    customEnergyConfig.twoStep,
    customEnergyConfig.intE,
    customEnergyConfig.ea2
  );

  renderInteractiveEnergyDiagram(svg, config, handleDragPoint);
}

/**
 * Handle dragging a point on the custom energy diagram
 */
function handleDragPoint(pointType, newEnergy) {
  switch (pointType) {
    case 'ts1':
      customEnergyConfig.ea = newEnergy;
      document.getElementById('ea-slider').value = newEnergy;
      document.getElementById('ea-value').textContent = `${newEnergy} kcal/mol`;
      break;
    case 'product':
      customEnergyConfig.deltaH = newEnergy;
      document.getElementById('delta-h-slider').value = newEnergy;
      document.getElementById('delta-h-value').textContent = `${newEnergy} kcal/mol`;
      break;
    case 'int':
      customEnergyConfig.intE = newEnergy;
      document.getElementById('int-slider').value = newEnergy;
      document.getElementById('int-value').textContent = `${newEnergy} kcal/mol`;
      break;
    case 'ts2':
      // ts2 energy is intermediate + ea2, so calculate ea2
      const ea2 = newEnergy - customEnergyConfig.intE;
      customEnergyConfig.ea2 = ea2;
      document.getElementById('ea2-slider').value = ea2;
      document.getElementById('ea2-value').textContent = `${ea2} kcal/mol`;
      break;
  }

  // Re-render without full reset to avoid drag interruption
  // The drag handler updates the circle position directly
}

/**
 * Handle slider changes for custom energy diagram
 */
function handleEaSliderChange(e) {
  customEnergyConfig.ea = parseInt(e.target.value);
  document.getElementById('ea-value').textContent = `${customEnergyConfig.ea} kcal/mol`;
  renderCustomEnergyDiagram();
}

function handleDeltaHSliderChange(e) {
  customEnergyConfig.deltaH = parseInt(e.target.value);
  document.getElementById('delta-h-value').textContent = `${customEnergyConfig.deltaH} kcal/mol`;
  renderCustomEnergyDiagram();
}

function handleTwoStepToggle(e) {
  customEnergyConfig.twoStep = e.target.checked;
  document.getElementById('step2-controls').classList.toggle('hidden', !customEnergyConfig.twoStep);
  renderCustomEnergyDiagram();
}

function handleIntSliderChange(e) {
  customEnergyConfig.intE = parseInt(e.target.value);
  document.getElementById('int-value').textContent = `${customEnergyConfig.intE} kcal/mol`;
  renderCustomEnergyDiagram();
}

function handleEa2SliderChange(e) {
  customEnergyConfig.ea2 = parseInt(e.target.value);
  document.getElementById('ea2-value').textContent = `${customEnergyConfig.ea2} kcal/mol`;
  renderCustomEnergyDiagram();
}

/**
 * Handle adding a new curve for comparison
 */
function handleAddCurve() {
  if (energyCurves.length >= 5) {
    alert('Maximum 5 curves for comparison');
    return;
  }

  const preset = document.getElementById('reaction-preset').value;

  // Don't allow adding custom as a comparison curve
  if (preset === 'custom') {
    alert('Custom diagram cannot be added for comparison. Select a preset reaction.');
    return;
  }

  energyCurves.push({
    preset: preset,
    name: `${REACTION_PRESETS[preset].name} (${energyCurves.length + 1})`
  });

  renderEnergyDiagram();
}

/**
 * Handle clearing all curves
 */
function handleClearCurves() {
  energyCurves = [];
  renderEnergyDiagram();
}

/**
 * Handle energy mode toggle (predict vs smiles vs preset)
 */
function handleEnergyModeToggle(e) {
  const mode = e.target.dataset.mode;
  if (mode === energyMode) return;

  energyMode = mode;

  // Update button states
  document.querySelectorAll('.energy-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Show/hide appropriate controls
  document.getElementById('predict-controls').classList.toggle('hidden', mode !== 'predict');
  document.getElementById('smiles-controls').classList.toggle('hidden', mode !== 'smiles');
  document.getElementById('preset-controls').classList.toggle('hidden', mode !== 'preset');

  // Hide custom energy controls when switching modes
  document.getElementById('custom-energy-controls').classList.add('hidden');
  // Reset preset dropdown to non-custom value if switching away
  if (mode === 'preset') {
    document.getElementById('reaction-preset').value = 'sn2';
    selectedReactionPreset = 'sn2';
  }

  // Show/hide appropriate panels
  document.getElementById('prediction-result').classList.toggle('hidden', mode !== 'predict');
  document.getElementById('prediction-explanation').classList.toggle('hidden', mode !== 'predict');
  document.getElementById('curve-list').classList.toggle('hidden', mode !== 'preset');

  // Clear and re-render
  energyCurves = [];
  currentPrediction = null;

  // Exit quiz mode when changing modes
  if (energyQuizActive) {
    energyQuizActive = false;
    document.getElementById('energy-quiz-mode-btn').classList.remove('active');
    document.getElementById('energy-quiz-panel').classList.add('hidden');
  }

  if (mode === 'predict') {
    // Run initial prediction
    handlePredictMechanism();
  } else if (mode === 'smiles') {
    // Clear SVG, wait for user input
    const svg = document.getElementById('chair-svg');
    svg.innerHTML = '';
    document.getElementById('smiles-analysis').classList.add('hidden');
  } else {
    renderEnergyDiagram();
  }
}

/**
 * Get current reaction conditions from UI
 */
function getReactionConditions() {
  return {
    substrate: document.getElementById('substrate-select').value,
    nucleophile: document.getElementById('nucleophile-select').value,
    leavingGroup: document.getElementById('leaving-group-select').value,
    solvent: document.getElementById('solvent-select').value,
    temperature: document.getElementById('temperature-select').value
  };
}

/**
 * Handle mechanism prediction
 */
function handlePredictMechanism() {
  const conditions = getReactionConditions();
  const prediction = predictMechanism(conditions);
  currentPrediction = prediction;

  // Get energy parameters for predicted mechanism
  const energy = getMechanismEnergy(prediction.primary.mechanism, conditions);

  // Set up single curve for the predicted mechanism
  energyCurves = [{
    preset: null,
    customEnergy: energy,
    name: energy.name,
    mechanism: prediction.primary.mechanism
  }];

  // Update prediction display
  updatePredictionDisplay(prediction);

  // Render the energy diagram with custom energy
  renderEnergyDiagramWithCustom();
}

/**
 * Handle showing all competing mechanisms
 */
function handleShowCompeting() {
  const conditions = getReactionConditions();
  const result = getCompetingMechanisms(conditions, 10);

  // Build curves for all competing mechanisms
  energyCurves = result.mechanisms.map((m, index) => ({
    preset: null,
    customEnergy: m.energy,
    name: `${m.energy.name} (${m.percentage}%)`,
    mechanism: m.mechanism,
    isPrimary: m.isPrimary
  }));

  // Update prediction display
  const prediction = predictMechanism(conditions);
  currentPrediction = prediction;
  updatePredictionDisplay(prediction);

  // Render with all curves
  renderEnergyDiagramWithCustom();
}

/**
 * Update the prediction display panel
 */
function updatePredictionDisplay(prediction) {
  // Update main mechanism display
  document.getElementById('predicted-mechanism').textContent = prediction.primary.mechanism.toUpperCase();
  document.getElementById('prediction-confidence').textContent = `${prediction.primary.percentage}% likely`;

  // Update score bars
  const mechanisms = ['sn2', 'sn1', 'e2', 'e1'];
  mechanisms.forEach(mech => {
    const score = prediction.scores[mech] || 0;
    document.getElementById(`score-${mech}`).style.width = `${score}%`;
    document.getElementById(`score-${mech}-val`).textContent = `${score}%`;
  });

  // Update explanation
  const explanation = explainPrediction(prediction);
  const explanationList = document.getElementById('explanation-list');

  if (explanation.reasons.length > 0) {
    explanationList.innerHTML = explanation.reasons.map(reason => {
      const isWarning = reason.includes('⚠️');
      return `<li class="${isWarning ? 'warning' : ''}">${reason.replace('⚠️ ', '')}</li>`;
    }).join('');
  } else {
    explanationList.innerHTML = '<li class="empty-message">Standard reaction conditions</li>';
  }
}

/**
 * Render energy diagram with custom energy parameters
 */
function renderEnergyDiagramWithCustom() {
  const svg = document.getElementById('chair-svg');
  svg.innerHTML = '';

  if (energyCurves.length === 0) {
    return;
  }

  // Convert custom energies to the format expected by renderEnergyDiagramSVG
  const curvesForRender = energyCurves.map((curve, index) => {
    if (curve.customEnergy) {
      // Register this as a temporary preset
      const tempKey = `_custom_${index}`;
      REACTION_PRESETS[tempKey] = curve.customEnergy;
      return {
        preset: tempKey,
        name: curve.name,
        color: curve.isPrimary ? '#2563eb' : undefined
      };
    }
    return curve;
  });

  renderEnergyDiagramSVG(svg, curvesForRender);

  // Clean up temporary presets
  Object.keys(REACTION_PRESETS).forEach(key => {
    if (key.startsWith('_custom_')) {
      delete REACTION_PRESETS[key];
    }
  });
}

/**
 * Handle SMILES example selection
 */
function handleSMILESExample(e) {
  const exampleKey = e.target.value;
  if (!exampleKey) return;

  const examples = {
    'sn2': { reactant: 'CCBr', product: 'CCO' },
    'sn1': { reactant: 'CC(C)(C)Br', product: 'CC(C)(C)O' },
    'e2': { reactant: 'CC(Br)C', product: 'CC=C' },
    'hydro': { reactant: 'CC=CC', product: 'CCCC' }
  };

  const example = examples[exampleKey];
  if (example) {
    document.getElementById('reactant-smiles').value = example.reactant;
    document.getElementById('product-smiles').value = example.product;
  }
}

/**
 * Handle SMILES reaction analysis
 */
function handleAnalyzeSMILES() {
  const reactantSMILES = document.getElementById('reactant-smiles').value.trim();
  const productSMILES = document.getElementById('product-smiles').value.trim();

  if (!reactantSMILES || !productSMILES) {
    alert('Please enter both reactant and product SMILES');
    return;
  }

  // Analyze the reaction
  const analysis = analyzeReaction(reactantSMILES, productSMILES);

  if (analysis.error) {
    alert('Could not analyze reaction: ' + analysis.error);
    return;
  }

  // Update analysis display
  const analysisDiv = document.getElementById('smiles-analysis');
  analysisDiv.classList.remove('hidden');

  document.getElementById('smiles-reaction-type').textContent =
    `${analysis.subType || analysis.reactionType}`;
  document.getElementById('smiles-bonds-broken').textContent =
    analysis.bondsBroken.join(', ') || '—';
  document.getElementById('smiles-bonds-formed').textContent =
    analysis.bondsFormed.join(', ') || '—';

  const deltaH = analysis.estimatedDeltaH;
  const sign = deltaH >= 0 ? '+' : '';
  document.getElementById('smiles-delta-h').textContent =
    `${sign}${deltaH.toFixed(1)} kcal/mol`;

  // Get energy parameters and render
  const energy = getEnergyFromSMILES(reactantSMILES, productSMILES);

  if (energy) {
    energyCurves = [{
      preset: null,
      customEnergy: energy,
      name: energy.name,
      mechanism: analysis.mechanism
    }];

    renderEnergyDiagramWithCustom();
  }
}

// ============== Energy Quiz Functions ==============

/**
 * Toggle energy quiz mode on/off
 */
function toggleEnergyQuizMode() {
  energyQuizActive = !energyQuizActive;

  const quizBtn = document.getElementById('energy-quiz-mode-btn');
  const quizPanel = document.getElementById('energy-quiz-panel');
  const predictionResult = document.getElementById('prediction-result');
  const predictionExplanation = document.getElementById('prediction-explanation');

  if (energyQuizActive) {
    // Entering quiz mode
    quizBtn.classList.add('active');
    quizPanel.classList.remove('hidden');

    // Hide prediction panels when in quiz mode
    predictionResult.classList.add('hidden');
    predictionExplanation.classList.add('hidden');

    // Generate first question
    handleEnergyNewQuestion();
  } else {
    // Exiting quiz mode
    quizBtn.classList.remove('active');
    quizPanel.classList.add('hidden');

    // Restore prediction panels if in predict mode
    if (energyMode === 'predict') {
      predictionResult.classList.remove('hidden');
      predictionExplanation.classList.remove('hidden');
      handlePredictMechanism();
    } else if (energyMode === 'preset') {
      renderEnergyDiagram();
    }
  }
}

/**
 * Handle generating a new energy quiz question
 */
function handleEnergyNewQuestion() {
  currentEnergyQuestion = generateEnergyQuestion();
  selectedEnergyAnswer = null;

  // Update question display
  document.getElementById('energy-quiz-question').textContent = currentEnergyQuestion.question;

  // Build options
  const optionsContainer = document.getElementById('energy-quiz-options');
  optionsContainer.innerHTML = '';

  currentEnergyQuestion.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.dataset.value = option.value;
    btn.textContent = option.label;
    btn.addEventListener('click', () => selectEnergyAnswer(option.value));
    optionsContainer.appendChild(btn);
  });

  // Hide feedback
  document.getElementById('energy-quiz-feedback').classList.add('hidden');

  // Disable submit until answer selected
  document.getElementById('energy-submit-btn').disabled = true;

  // Render the diagram for the question
  renderQuestionDiagram(currentEnergyQuestion);
}

/**
 * Select an energy quiz answer
 */
function selectEnergyAnswer(value) {
  selectedEnergyAnswer = value;

  // Update button states
  document.querySelectorAll('#energy-quiz-options .quiz-option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value);
  });

  // Enable submit
  document.getElementById('energy-submit-btn').disabled = false;
}

/**
 * Handle submitting an energy quiz answer
 */
function handleEnergySubmitAnswer() {
  if (!selectedEnergyAnswer || !currentEnergyQuestion) return;

  const result = checkEnergyAnswer(selectedEnergyAnswer, currentEnergyQuestion);

  // Show feedback
  const feedbackDiv = document.getElementById('energy-quiz-feedback');
  feedbackDiv.classList.remove('hidden');

  if (result.isCorrect) {
    feedbackDiv.className = 'quiz-feedback correct';
    feedbackDiv.innerHTML = `<strong>Correct!</strong> ${result.explanation}`;
  } else {
    feedbackDiv.className = 'quiz-feedback incorrect';
    feedbackDiv.innerHTML = `<strong>Incorrect.</strong> The answer is ${result.correctAnswer.toUpperCase()}. ${result.explanation}`;
  }

  // Update score display
  document.getElementById('energy-quiz-score').textContent =
    `${result.score.correct}/${result.score.total}`;

  // Highlight correct/incorrect answers
  document.querySelectorAll('#energy-quiz-options .quiz-option-btn').forEach(btn => {
    if (btn.dataset.value === result.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.dataset.value === selectedEnergyAnswer && !result.isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  // Disable submit
  document.getElementById('energy-submit-btn').disabled = true;
}

/**
 * Render diagram for quiz question
 */
function renderQuestionDiagram(question) {
  const svg = document.getElementById('chair-svg');

  if (question.preset) {
    // Single preset diagram
    energyCurves = [{ preset: question.preset, name: '' }];
    renderEnergyDiagramSVG(svg, energyCurves);
  } else if (question.presets) {
    // Multiple presets for comparison
    energyCurves = question.presets.map((preset, i) => ({
      preset,
      name: preset.toUpperCase()
    }));
    renderEnergyDiagramSVG(svg, energyCurves);
  } else {
    // No diagram needed, clear
    svg.innerHTML = '';
  }
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

// ============== Nomenclature Functions ==============

/**
 * Render nomenclature view
 */
function renderNomenclatureView() {
  console.log('renderNomenclatureView called');
  const svg = document.getElementById('chair-svg');
  svg.innerHTML = '';

  try {
    if (nomenclatureQuizActive) {
      // Quiz mode - show the current question
      if (nomenclatureCurrentQuestion) {
        renderNomenclatureQuiz(svg, nomenclatureCurrentQuestion);
      } else {
        // Generate first question
        handleNomenclatureNewQuestion();
      }
    } else if (nomenclatureMode === 'rules') {
      // Show naming rules for selected class
      const ruleClass = nomenclatureClass === 'all' ? 'alkanes' : nomenclatureClass;
      renderNamingRules(svg, ruleClass);
      updateNomenclatureRulesPanel(ruleClass);
    } else {
      // Practice mode - show a compound
      if (!nomenclatureCurrentCompound) {
        selectNewCompound();
      }
      if (nomenclatureCurrentCompound) {
        renderMolecule(svg, nomenclatureCurrentCompound.smiles, {
          showName: true,
          name: nomenclatureCurrentCompound.iupac
        });
        updateNomenclaturePanel();
      }
    }
    console.log('renderNomenclatureView completed successfully');
  } catch (error) {
    console.error('Error in renderNomenclatureView:', error);
  }
}

/**
 * Select a new random compound based on current filters
 */
function selectNewCompound() {
  let compounds;

  if (nomenclatureClass === 'all') {
    compounds = getAllCompounds();
  } else {
    compounds = getCompoundsByClass(nomenclatureClass);
  }

  if (nomenclatureDifficulty !== 'all') {
    const level = parseInt(nomenclatureDifficulty, 10);
    compounds = compounds.filter(c => c.difficulty === level);
  }

  if (compounds.length > 0) {
    const randomIndex = Math.floor(Math.random() * compounds.length);
    nomenclatureCurrentCompound = compounds[randomIndex];
  }
}

/**
 * Update nomenclature info panel
 */
function updateNomenclaturePanel() {
  if (!nomenclatureCurrentCompound) return;

  const compound = nomenclatureCurrentCompound;

  // Update compound info
  document.getElementById('nomenclature-class').textContent =
    compound.class.charAt(0).toUpperCase() + compound.class.slice(1);
  document.getElementById('nomenclature-level').textContent =
    compound.difficulty === 1 ? 'Basic' : compound.difficulty === 2 ? 'Intermediate' : 'Advanced';

  // Show/hide common name section
  const commonSection = document.getElementById('nomenclature-common');
  if (compound.common) {
    commonSection.classList.remove('hidden');
    document.getElementById('nomenclature-common-name').textContent = compound.common;
  } else {
    commonSection.classList.add('hidden');
  }

  // Show/hide stereochemistry section
  const stereoSection = document.getElementById('nomenclature-stereo');
  if (compound.stereochemistry) {
    stereoSection.classList.remove('hidden');
    document.getElementById('nomenclature-stereo-info').textContent = compound.stereochemistry;
  } else {
    stereoSection.classList.add('hidden');
  }

  // Hide rules panel in practice mode
  document.getElementById('nomenclature-rules').classList.add('hidden');
}

/**
 * Update naming rules panel
 */
function updateNomenclatureRulesPanel(ruleClass) {
  const rules = getNamingRules(ruleClass);
  const rulesList = document.getElementById('nomenclature-rules-list');
  rulesList.innerHTML = '';

  rules.forEach(rule => {
    const li = document.createElement('li');
    li.textContent = rule;
    rulesList.appendChild(li);
  });

  document.getElementById('nomenclature-rules').classList.remove('hidden');
  document.getElementById('nomenclature-common').classList.add('hidden');
  document.getElementById('nomenclature-stereo').classList.add('hidden');

  // Update class display
  document.getElementById('nomenclature-class').textContent =
    ruleClass.charAt(0).toUpperCase() + ruleClass.slice(1);
  document.getElementById('nomenclature-level').textContent = 'Reference';
}

/**
 * Handle compound class filter change
 */
function handleNomenclatureClassChange(e) {
  nomenclatureClass = e.target.value;
  if (nomenclatureMode === 'rules' && nomenclatureClass === 'all') {
    // Default to alkanes for rules view
    renderNamingRules(document.getElementById('chair-svg'), 'alkanes');
    updateNomenclatureRulesPanel('alkanes');
  } else if (nomenclatureMode === 'rules') {
    renderNamingRules(document.getElementById('chair-svg'), nomenclatureClass);
    updateNomenclatureRulesPanel(nomenclatureClass);
  } else {
    selectNewCompound();
    renderNomenclatureView();
  }
}

/**
 * Handle difficulty filter change
 */
function handleNomenclatureDifficultyChange(e) {
  nomenclatureDifficulty = e.target.value;
  selectNewCompound();
  renderNomenclatureView();
}

/**
 * Handle mode toggle (practice vs rules)
 */
function handleNomenclatureModeToggle(e) {
  const newMode = e.target.dataset.mode;
  if (newMode === nomenclatureMode) return;

  nomenclatureMode = newMode;

  // Update button states
  document.querySelectorAll('.nomenclature-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === newMode);
  });

  renderNomenclatureView();
}

/**
 * Handle new compound button
 */
function handleNewNomenclatureCompound() {
  selectNewCompound();
  renderNomenclatureView();
}

/**
 * Toggle nomenclature quiz mode
 */
function toggleNomenclatureQuizMode() {
  nomenclatureQuizActive = !nomenclatureQuizActive;

  const quizBtn = document.getElementById('nomenclature-quiz-mode-btn');
  const quizPanel = document.getElementById('nomenclature-quiz-panel');
  const compoundInfo = document.getElementById('nomenclature-compound-info');

  quizBtn.classList.toggle('active', nomenclatureQuizActive);
  quizPanel.classList.toggle('hidden', !nomenclatureQuizActive);
  compoundInfo.classList.toggle('hidden', nomenclatureQuizActive);

  if (nomenclatureQuizActive) {
    handleNomenclatureNewQuestion();
  } else {
    renderNomenclatureView();
  }
}

/**
 * Handle new nomenclature question
 */
function handleNomenclatureNewQuestion() {
  // Determine question type based on what's available
  const questionTypes = ['naming', 'structure', 'error', 'ez'];
  const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  nomenclatureCurrentQuestion = generateNomenclatureQuestion(randomType);

  // Update quiz display
  document.getElementById('nomenclature-quiz-question').textContent =
    nomenclatureCurrentQuestion.question;

  // Render options
  const optionsContainer = document.getElementById('nomenclature-quiz-options');
  optionsContainer.innerHTML = '';

  nomenclatureCurrentQuestion.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'quiz-option';
    optionBtn.textContent = option;
    optionBtn.dataset.index = index;
    optionBtn.addEventListener('click', () => selectNomenclatureOption(optionBtn));
    optionsContainer.appendChild(optionBtn);
  });

  // Reset state
  document.getElementById('nomenclature-submit-btn').disabled = true;
  document.getElementById('nomenclature-quiz-feedback').classList.add('hidden');

  // Render the question visualization
  const svg = document.getElementById('chair-svg');
  renderNomenclatureQuiz(svg, nomenclatureCurrentQuestion);
}

/**
 * Select a nomenclature quiz option
 */
function selectNomenclatureOption(selectedBtn) {
  // Remove selection from all options
  document.querySelectorAll('#nomenclature-quiz-options .quiz-option').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Select clicked option
  selectedBtn.classList.add('selected');

  // Enable submit button
  document.getElementById('nomenclature-submit-btn').disabled = false;
}

/**
 * Handle nomenclature quiz answer submission
 */
function handleNomenclatureSubmitAnswer() {
  const selectedOption = document.querySelector('#nomenclature-quiz-options .quiz-option.selected');
  if (!selectedOption) return;

  const selectedIndex = parseInt(selectedOption.dataset.index, 10);
  const selectedAnswer = nomenclatureCurrentQuestion.options[selectedIndex];
  const isCorrect = checkNomenclatureAnswer(selectedAnswer, nomenclatureCurrentQuestion);

  // Update score
  nomenclatureQuizScore.total++;
  if (isCorrect) {
    nomenclatureQuizScore.correct++;
  }

  // Update score display
  document.getElementById('nomenclature-quiz-score').textContent =
    `${nomenclatureQuizScore.correct}/${nomenclatureQuizScore.total}`;

  // Show feedback
  const feedback = document.getElementById('nomenclature-quiz-feedback');
  feedback.classList.remove('hidden');
  feedback.classList.toggle('correct', isCorrect);
  feedback.classList.toggle('incorrect', !isCorrect);

  if (isCorrect) {
    feedback.innerHTML = '<strong>Correct!</strong>';
  } else {
    feedback.innerHTML = `<strong>Incorrect.</strong> The correct answer is: <em>${nomenclatureCurrentQuestion.answer}</em>`;
    if (nomenclatureCurrentQuestion.explanation) {
      feedback.innerHTML += `<br><small>${nomenclatureCurrentQuestion.explanation}</small>`;
    }
  }

  // Highlight correct/incorrect options
  document.querySelectorAll('#nomenclature-quiz-options .quiz-option').forEach(btn => {
    const optionText = btn.textContent;
    if (optionText === nomenclatureCurrentQuestion.answer) {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected') && !isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  // Disable submit, enable new question
  document.getElementById('nomenclature-submit-btn').disabled = true;
}

// ============== Reagent Quiz Functions ==============

/**
 * Toggle reagent quiz mode
 */
function toggleReagentQuizMode() {
  reagentQuizActive = !reagentQuizActive;

  const quizBtn = document.getElementById('reagent-quiz-mode-btn');
  const quizPanel = document.getElementById('reagent-quiz-panel');
  const mechanismQuizPanel = document.getElementById('mechanism-quiz-panel');
  const mechanismQuizBtn = document.getElementById('mechanism-quiz-mode-btn');

  quizBtn.classList.toggle('active', reagentQuizActive);
  quizPanel.classList.toggle('hidden', !reagentQuizActive);

  // Deactivate mechanism quiz if activating reagent quiz
  if (reagentQuizActive && mechanismQuizActive) {
    mechanismQuizActive = false;
    mechanismQuizBtn.classList.remove('active');
    mechanismQuizPanel.classList.add('hidden');
  }

  if (reagentQuizActive) {
    handleReagentNewQuestion();
  }
}

/**
 * Handle new reagent question
 */
function handleReagentNewQuestion() {
  reagentCurrentQuestion = generateReagentQuestion();

  // Update quiz display
  document.getElementById('reagent-quiz-question').textContent =
    reagentCurrentQuestion.question;

  // Render options
  const optionsContainer = document.getElementById('reagent-quiz-options');
  optionsContainer.innerHTML = '';

  reagentCurrentQuestion.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'quiz-option';
    optionBtn.textContent = option;
    optionBtn.dataset.index = index;
    optionBtn.addEventListener('click', () => selectReagentOption(optionBtn));
    optionsContainer.appendChild(optionBtn);
  });

  // Reset state
  document.getElementById('reagent-submit-btn').disabled = true;
  document.getElementById('reagent-quiz-feedback').classList.add('hidden');

  // Show reagent info in the SVG area
  renderReagentInfo(reagentCurrentQuestion);
}

/**
 * Render reagent information in SVG
 */
function renderReagentInfo(question) {
  const svg = document.getElementById('chair-svg');
  svg.innerHTML = '';

  // Create a text display for the reagent info
  const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleText.setAttribute('x', '250');
  titleText.setAttribute('y', '50');
  titleText.setAttribute('text-anchor', 'middle');
  titleText.setAttribute('class', 'mechanism-title');
  titleText.textContent = 'Reagent Identification';
  svg.appendChild(titleText);

  // If there's a reagent in the question, show its category
  if (question.reagent) {
    const categoryText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    categoryText.setAttribute('x', '250');
    categoryText.setAttribute('y', '85');
    categoryText.setAttribute('text-anchor', 'middle');
    categoryText.setAttribute('class', 'mechanism-label');
    categoryText.textContent = `Category: ${question.reagent.category}`;
    svg.appendChild(categoryText);

    // Show formula if identify or conditions question
    if (question.type === 'conditions' || question.type === 'reaction') {
      const formulaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      formulaText.setAttribute('x', '250');
      formulaText.setAttribute('y', '150');
      formulaText.setAttribute('text-anchor', 'middle');
      formulaText.setAttribute('font-size', '24');
      formulaText.setAttribute('font-weight', 'bold');
      formulaText.setAttribute('fill', '#2563eb');
      formulaText.textContent = question.reagent.formula;
      svg.appendChild(formulaText);

      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', '250');
      nameText.setAttribute('y', '180');
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '14');
      nameText.setAttribute('fill', '#64748b');
      nameText.textContent = question.reagent.name;
      svg.appendChild(nameText);
    }

    // For product questions, show the reaction type
    if (question.type === 'product' || question.type === 'identify') {
      const reactionText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      reactionText.setAttribute('x', '250');
      reactionText.setAttribute('y', '150');
      reactionText.setAttribute('text-anchor', 'middle');
      reactionText.setAttribute('font-size', '16');
      reactionText.setAttribute('fill', '#1e293b');

      if (question.type === 'identify') {
        reactionText.textContent = `Reaction: ${question.reagent.reactions[0]}`;
      } else {
        reactionText.textContent = question.reagent.name;
      }
      svg.appendChild(reactionText);
    }
  }

  // Show question hint
  const hintText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  hintText.setAttribute('x', '250');
  hintText.setAttribute('y', '280');
  hintText.setAttribute('text-anchor', 'middle');
  hintText.setAttribute('font-size', '12');
  hintText.setAttribute('fill', '#94a3b8');
  hintText.textContent = 'Select your answer below';
  svg.appendChild(hintText);
}

/**
 * Select a reagent quiz option
 */
function selectReagentOption(selectedBtn) {
  // Remove selection from all options
  document.querySelectorAll('#reagent-quiz-options .quiz-option').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Select clicked option
  selectedBtn.classList.add('selected');

  // Enable submit button
  document.getElementById('reagent-submit-btn').disabled = false;
}

/**
 * Handle reagent quiz answer submission
 */
function handleReagentSubmitAnswer() {
  const selectedOption = document.querySelector('#reagent-quiz-options .quiz-option.selected');
  if (!selectedOption) return;

  const selectedAnswer = selectedOption.textContent;
  const isCorrect = checkReagentAnswer(selectedAnswer, reagentCurrentQuestion);

  // Update score
  reagentQuizScore.total++;
  if (isCorrect) {
    reagentQuizScore.correct++;
  }

  // Update score display
  document.getElementById('reagent-quiz-score').textContent =
    `${reagentQuizScore.correct}/${reagentQuizScore.total}`;

  // Show feedback
  const feedback = document.getElementById('reagent-quiz-feedback');
  feedback.classList.remove('hidden');
  feedback.classList.toggle('correct', isCorrect);
  feedback.classList.toggle('incorrect', !isCorrect);

  if (isCorrect) {
    feedback.innerHTML = '<strong>Correct!</strong>';
  } else {
    feedback.innerHTML = `<strong>Incorrect.</strong> The correct answer is: <em>${reagentCurrentQuestion.answer}</em>`;
  }

  if (reagentCurrentQuestion.explanation) {
    feedback.innerHTML += `<br><small>${reagentCurrentQuestion.explanation}</small>`;
  }

  // Highlight correct/incorrect options
  document.querySelectorAll('#reagent-quiz-options .quiz-option').forEach(btn => {
    const optionText = btn.textContent;
    if (optionText === reagentCurrentQuestion.answer) {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected') && !isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  // Disable submit
  document.getElementById('reagent-submit-btn').disabled = true;
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
