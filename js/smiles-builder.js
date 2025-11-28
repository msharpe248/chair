/**
 * SMILES Builder - Interactive SMILES String Construction Tool
 *
 * A floating panel with four building modes:
 * 1. Template Library - Common molecules by category
 * 2. Dropdown Builder - Form-based selection
 * 3. Guided Wizard - Step-by-step questions
 * 4. Visual Editor - Draw molecules (SVG canvas)
 */

// Template data organized by context
const BUILDER_TEMPLATES = {
  cyclohexane: [
    { name: 'Cyclohexane', smiles: 'C1CCCCC1', desc: 'Basic 6-membered ring' },
    { name: 'Methylcyclohexane', smiles: 'CC1CCCCC1', desc: 'Single methyl substituent' },
    { name: 'Ethylcyclohexane', smiles: 'CCC1CCCCC1', desc: 'Ethyl substituent' },
    { name: 'Isopropylcyclohexane', smiles: 'CC(C)C1CCCCC1', desc: 'Isopropyl substituent' },
    { name: 't-Butylcyclohexane', smiles: 'CC(C)(C)C1CCCCC1', desc: 'Large t-butyl group' },
    { name: 'Cyclohexanol', smiles: 'OC1CCCCC1', desc: 'Hydroxyl substituent' },
    { name: 'Bromocyclohexane', smiles: 'BrC1CCCCC1', desc: 'Bromine substituent' },
    { name: '1,2-Dimethyl (cis)', smiles: 'C[C@H]1CCCC[C@H]1C', desc: 'Adjacent methyls, same side' },
    { name: '1,2-Dimethyl (trans)', smiles: 'C[C@H]1CCCC[C@@H]1C', desc: 'Adjacent methyls, opposite' },
    { name: '1,3-Dimethyl (cis)', smiles: 'C[C@H]1CCC[C@H](C)C1', desc: '1,3-disubstituted, same side' },
    { name: '1,3-Dimethyl (trans)', smiles: 'C[C@H]1CCC[C@@H](C)C1', desc: '1,3-disubstituted, opposite' },
    { name: '1,4-Dimethyl (cis)', smiles: 'C[C@H]1CC[C@H](C)CC1', desc: '1,4-disubstituted, same side' },
    { name: '1,4-Dimethyl (trans)', smiles: 'C[C@H]1CC[C@@H](C)CC1', desc: '1,4-disubstituted, opposite' },
  ],
  reaction: [
    { name: 'Methyl bromide', smiles: 'CBr', desc: 'Methyl halide (SN2 fast)' },
    { name: 'Ethyl bromide', smiles: 'CCBr', desc: 'Primary halide (SN2)' },
    { name: '1-Bromopropane', smiles: 'CCCBr', desc: 'Primary halide (SN2)' },
    { name: '2-Bromopropane', smiles: 'CC(Br)C', desc: 'Secondary halide' },
    { name: '2-Bromobutane', smiles: 'CC(Br)CC', desc: 'Secondary, longer chain' },
    { name: 't-Butyl bromide', smiles: 'CC(C)(C)Br', desc: 'Tertiary halide (SN1)' },
    { name: 'Benzyl bromide', smiles: 'BrCc1ccccc1', desc: 'Benzylic (stabilized)' },
    { name: 'Allyl bromide', smiles: 'BrCC=C', desc: 'Allylic (stabilized)' },
    { name: 'Ethyl chloride', smiles: 'CCCl', desc: 'Primary chloride' },
    { name: 'Ethyl iodide', smiles: 'CCI', desc: 'Primary iodide (good LG)' },
    { name: 'Ethyl tosylate', smiles: 'CCOS(=O)(=O)c1ccc(C)cc1', desc: 'Excellent leaving group' },
  ],
  alkene: [
    { name: 'Ethene', smiles: 'C=C', desc: 'Simplest alkene' },
    { name: 'Propene', smiles: 'CC=C', desc: 'Monosubstituted' },
    { name: '1-Butene', smiles: 'CCC=C', desc: 'Terminal alkene' },
    { name: '(E)-2-Butene', smiles: 'C/C=C/C', desc: 'Trans disubstituted' },
    { name: '(Z)-2-Butene', smiles: 'C/C=C\\C', desc: 'Cis disubstituted' },
    { name: 'Isobutylene', smiles: 'CC(=C)C', desc: 'Gem-disubstituted' },
    { name: '2-Methyl-2-butene', smiles: 'CC(C)=CC', desc: 'Trisubstituted' },
    { name: 'Tetramethylethene', smiles: 'CC(C)=C(C)C', desc: 'Tetrasubstituted' },
    { name: '1-Pentene', smiles: 'CCCC=C', desc: 'Longer terminal' },
    { name: '(E)-2-Pentene', smiles: 'CC/C=C/C', desc: 'Trans pentene' },
    { name: '(Z)-2-Pentene', smiles: 'CC/C=C\\C', desc: 'Cis pentene' },
    { name: 'Cyclohexene', smiles: 'C1CCC=CC1', desc: 'Cyclic alkene' },
  ],
  stereo: [
    { name: '(R)-2-Bromobutane', smiles: 'CC[C@@H](Br)C', desc: 'R configuration' },
    { name: '(S)-2-Bromobutane', smiles: 'CC[C@H](Br)C', desc: 'S configuration' },
    { name: '(R)-2-Chlorobutane', smiles: 'CC[C@@H](Cl)C', desc: 'R with chlorine' },
    { name: '(S)-2-Chlorobutane', smiles: 'CC[C@H](Cl)C', desc: 'S with chlorine' },
    { name: '(R)-2-Iodobutane', smiles: 'CC[C@@H](I)C', desc: 'R with iodine' },
    { name: '(S)-2-Iodobutane', smiles: 'CC[C@H](I)C', desc: 'S with iodine' },
    { name: '(R)-Lactic acid', smiles: 'C[C@@H](O)C(=O)O', desc: 'Natural form' },
    { name: '(S)-Lactic acid', smiles: 'C[C@H](O)C(=O)O', desc: 'Unnatural form' },
    { name: 'L-Alanine', smiles: 'C[C@H](N)C(=O)O', desc: 'Natural amino acid' },
    { name: 'D-Alanine', smiles: 'C[C@@H](N)C(=O)O', desc: 'Unnatural form' },
    { name: '(R)-2-Bromopentane', smiles: 'CCC[C@@H](Br)C', desc: 'Longer chain R' },
    { name: '(S)-2-Bromopentane', smiles: 'CCC[C@H](Br)C', desc: 'Longer chain S' },
  ]
};

// Dropdown builder configuration by context
const DROPDOWN_CONFIGS = {
  cyclohexane: {
    fields: [
      {
        id: 'backbone',
        label: 'Ring Type',
        options: [
          { value: 'cyclohexane', label: 'Cyclohexane', smiles: 'C1CCCCC1' },
        ]
      },
      {
        id: 'sub1',
        label: 'Substituent 1',
        options: [
          { value: 'none', label: 'None' },
          { value: 'CH3', label: 'Methyl (CH₃)' },
          { value: 'C2H5', label: 'Ethyl (C₂H₅)' },
          { value: 'iPr', label: 'Isopropyl' },
          { value: 'tBu', label: 't-Butyl' },
          { value: 'OH', label: 'Hydroxyl (OH)' },
          { value: 'Br', label: 'Bromine' },
          { value: 'Cl', label: 'Chlorine' },
        ]
      },
      {
        id: 'pos1',
        label: 'Position 1',
        options: [
          { value: '1', label: 'C1' },
          { value: '2', label: 'C2' },
          { value: '3', label: 'C3' },
          { value: '4', label: 'C4' },
        ]
      },
      {
        id: 'sub2',
        label: 'Substituent 2',
        options: [
          { value: 'none', label: 'None' },
          { value: 'CH3', label: 'Methyl (CH₃)' },
          { value: 'C2H5', label: 'Ethyl (C₂H₅)' },
          { value: 'iPr', label: 'Isopropyl' },
          { value: 'tBu', label: 't-Butyl' },
          { value: 'OH', label: 'Hydroxyl (OH)' },
          { value: 'Br', label: 'Bromine' },
        ]
      },
      {
        id: 'pos2',
        label: 'Position 2',
        options: [
          { value: 'none', label: 'None' },
          { value: '2', label: 'C2' },
          { value: '3', label: 'C3' },
          { value: '4', label: 'C4' },
        ]
      },
    ]
  },
  reaction: {
    fields: [
      {
        id: 'substrate_type',
        label: 'Substrate Type',
        options: [
          { value: 'methyl', label: 'Methyl' },
          { value: 'primary', label: 'Primary (1°)' },
          { value: 'secondary', label: 'Secondary (2°)' },
          { value: 'tertiary', label: 'Tertiary (3°)' },
        ]
      },
      {
        id: 'leaving_group',
        label: 'Leaving Group',
        options: [
          { value: 'Br', label: 'Bromide (Br)' },
          { value: 'Cl', label: 'Chloride (Cl)' },
          { value: 'I', label: 'Iodide (I)' },
        ]
      },
      {
        id: 'chain_length',
        label: 'Carbon Chain',
        options: [
          { value: '1', label: '1 carbon' },
          { value: '2', label: '2 carbons' },
          { value: '3', label: '3 carbons' },
          { value: '4', label: '4 carbons' },
        ]
      },
    ]
  },
  alkene: {
    fields: [
      {
        id: 'carbons',
        label: 'Number of Carbons',
        options: [
          { value: '2', label: '2 (Ethene)' },
          { value: '3', label: '3 (Propene)' },
          { value: '4', label: '4 (Butene)' },
          { value: '5', label: '5 (Pentene)' },
        ]
      },
      {
        id: 'db_position',
        label: 'Double Bond Position',
        options: [
          { value: '1', label: 'Position 1' },
          { value: '2', label: 'Position 2' },
        ]
      },
      {
        id: 'geometry',
        label: 'E/Z Geometry',
        options: [
          { value: 'none', label: 'N/A (terminal)' },
          { value: 'E', label: 'E (trans)' },
          { value: 'Z', label: 'Z (cis)' },
        ]
      },
    ]
  },
  stereo: {
    fields: [
      {
        id: 'base_structure',
        label: 'Base Structure',
        options: [
          { value: '2-halobutane', label: '2-Halobutane' },
          { value: '2-halopentane', label: '2-Halopentane' },
          { value: 'lactic_acid', label: 'Lactic Acid' },
          { value: 'alanine', label: 'Alanine' },
        ]
      },
      {
        id: 'configuration',
        label: 'Configuration',
        options: [
          { value: 'R', label: '(R)' },
          { value: 'S', label: '(S)' },
        ]
      },
      {
        id: 'halogen',
        label: 'Halogen (if applicable)',
        options: [
          { value: 'Br', label: 'Bromine' },
          { value: 'Cl', label: 'Chlorine' },
          { value: 'I', label: 'Iodine' },
        ]
      },
    ]
  }
};

// Wizard questions by context
const WIZARD_STEPS = {
  cyclohexane: [
    {
      question: 'What type of ring do you want?',
      options: [
        { value: 'simple', label: 'Simple cyclohexane', next: 1 },
        { value: 'substituted', label: 'Substituted cyclohexane', next: 2 },
      ]
    },
    {
      question: 'Would you like to specify stereochemistry?',
      options: [
        { value: 'no', label: 'No (just the ring)', result: 'C1CCCCC1' },
        { value: 'yes', label: 'Yes', next: 2 },
      ]
    },
    {
      question: 'How many substituents?',
      options: [
        { value: '1', label: 'One substituent', next: 3 },
        { value: '2', label: 'Two substituents', next: 4 },
      ]
    },
    {
      question: 'Choose the substituent:',
      options: [
        { value: 'CH3', label: 'Methyl (CH₃)', result: 'CC1CCCCC1' },
        { value: 'OH', label: 'Hydroxyl (OH)', result: 'OC1CCCCC1' },
        { value: 'Br', label: 'Bromine (Br)', result: 'BrC1CCCCC1' },
        { value: 'tBu', label: 't-Butyl', result: 'CC(C)(C)C1CCCCC1' },
      ]
    },
    {
      question: 'Choose the substitution pattern:',
      options: [
        { value: '1,2-cis', label: '1,2-cis', result: 'C[C@H]1CCCC[C@H]1C' },
        { value: '1,2-trans', label: '1,2-trans', result: 'C[C@H]1CCCC[C@@H]1C' },
        { value: '1,3-cis', label: '1,3-cis', result: 'C[C@H]1CCC[C@H](C)C1' },
        { value: '1,3-trans', label: '1,3-trans', result: 'C[C@H]1CCC[C@@H](C)C1' },
        { value: '1,4-cis', label: '1,4-cis', result: 'C[C@H]1CC[C@H](C)CC1' },
        { value: '1,4-trans', label: '1,4-trans', result: 'C[C@H]1CC[C@@H](C)CC1' },
      ]
    },
  ],
  reaction: [
    {
      question: 'What type of substrate?',
      options: [
        { value: 'methyl', label: 'Methyl (CH₃-X)', next: 1 },
        { value: 'primary', label: 'Primary (1°)', next: 1 },
        { value: 'secondary', label: 'Secondary (2°)', next: 1 },
        { value: 'tertiary', label: 'Tertiary (3°)', next: 1 },
      ]
    },
    {
      question: 'Choose the leaving group:',
      options: [
        { value: 'Br', label: 'Bromide (Br)', next: 2 },
        { value: 'Cl', label: 'Chloride (Cl)', next: 2 },
        { value: 'I', label: 'Iodide (I)', next: 2 },
      ]
    },
    {
      question: 'Carbon chain length:',
      options: [
        { value: '2', label: '2 carbons', final: true },
        { value: '3', label: '3 carbons', final: true },
        { value: '4', label: '4 carbons', final: true },
      ]
    },
  ],
  alkene: [
    {
      question: 'How many carbons?',
      options: [
        { value: '2', label: '2 carbons (ethene)', result: 'C=C' },
        { value: '3', label: '3 carbons (propene)', result: 'CC=C' },
        { value: '4', label: '4 carbons', next: 1 },
        { value: '5', label: '5 carbons', next: 2 },
      ]
    },
    {
      question: 'Double bond position for 4-carbon alkene?',
      options: [
        { value: '1', label: '1-Butene (terminal)', result: 'CCC=C' },
        { value: '2-E', label: '2-Butene (E/trans)', result: 'C/C=C/C' },
        { value: '2-Z', label: '2-Butene (Z/cis)', result: 'C/C=C\\C' },
        { value: 'iso', label: 'Isobutylene', result: 'CC(=C)C' },
      ]
    },
    {
      question: 'Double bond position for 5-carbon alkene?',
      options: [
        { value: '1', label: '1-Pentene (terminal)', result: 'CCCC=C' },
        { value: '2-E', label: '2-Pentene (E/trans)', result: 'CC/C=C/C' },
        { value: '2-Z', label: '2-Pentene (Z/cis)', result: 'CC/C=C\\C' },
      ]
    },
  ],
  stereo: [
    {
      question: 'What configuration do you need?',
      options: [
        { value: 'R', label: '(R) configuration', next: 1 },
        { value: 'S', label: '(S) configuration', next: 2 },
      ]
    },
    {
      question: 'Choose the (R) molecule:',
      options: [
        { value: 'R-2-bromobutane', label: '(R)-2-Bromobutane', result: 'CC[C@@H](Br)C' },
        { value: 'R-2-chlorobutane', label: '(R)-2-Chlorobutane', result: 'CC[C@@H](Cl)C' },
        { value: 'R-lactic', label: '(R)-Lactic acid', result: 'C[C@@H](O)C(=O)O' },
        { value: 'D-alanine', label: 'D-Alanine', result: 'C[C@@H](N)C(=O)O' },
      ]
    },
    {
      question: 'Choose the (S) molecule:',
      options: [
        { value: 'S-2-bromobutane', label: '(S)-2-Bromobutane', result: 'CC[C@H](Br)C' },
        { value: 'S-2-chlorobutane', label: '(S)-2-Chlorobutane', result: 'CC[C@H](Cl)C' },
        { value: 'S-lactic', label: '(S)-Lactic acid', result: 'C[C@H](O)C(=O)O' },
        { value: 'L-alanine', label: 'L-Alanine', result: 'C[C@H](N)C(=O)O' },
      ]
    },
  ]
};

// Builder state
let builderState = {
  isOpen: false,
  context: 'cyclohexane',  // cyclohexane, reaction, alkene, stereo
  mode: 'templates',        // templates, dropdown, wizard, draw
  currentSmiles: '',
  targetInput: null,        // The input element to populate
  wizardStep: 0,
  wizardAnswers: [],
  panelPosition: { x: 100, y: 100 },
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
};

// Context detection from viewer
function detectContext(inputElement) {
  if (!inputElement) return 'cyclohexane';

  const id = inputElement.id || '';
  const parent = inputElement.closest('.mode-controls');

  if (id === 'smiles-input' || (parent && parent.id === 'cyclohexane-controls')) {
    return 'cyclohexane';
  }
  if (id === 'reactant-smiles' || id === 'product-smiles' || (parent && parent.id === 'energy-controls')) {
    return 'reaction';
  }
  if (id === 'alkene-smiles-input' || (parent && parent.id === 'alkene-controls')) {
    return 'alkene';
  }
  if (id === 'stereo-smiles-input' || (parent && parent.id === 'stereo-controls')) {
    return 'stereo';
  }

  return 'cyclohexane';
}

// Create the floating panel HTML
function createBuilderPanel() {
  const panel = document.createElement('div');
  panel.id = 'smiles-builder-panel';
  panel.className = 'smiles-builder-panel hidden';

  panel.innerHTML = `
    <div class="builder-header">
      <span class="drag-handle">⋮⋮</span>
      <span class="builder-title">SMILES Builder</span>
      <div class="builder-header-buttons">
        <button class="builder-minimize-btn" title="Minimize">−</button>
        <button class="builder-close-btn" title="Close">×</button>
      </div>
    </div>

    <div class="builder-body">
      <div class="builder-mode-tabs">
        <button class="builder-tab active" data-mode="templates">Templates</button>
        <button class="builder-tab" data-mode="dropdown">Build</button>
        <button class="builder-tab" data-mode="wizard">Wizard</button>
        <button class="builder-tab" data-mode="draw">Draw</button>
      </div>

      <div class="builder-content">
        <!-- Templates Mode -->
        <div class="builder-mode-content templates-content active">
          <div class="templates-search">
            <input type="text" id="template-search" placeholder="Search templates...">
          </div>
          <div class="templates-grid" id="templates-grid">
            <!-- Filled dynamically -->
          </div>
        </div>

        <!-- Dropdown Builder Mode -->
        <div class="builder-mode-content dropdown-content">
          <div class="dropdown-fields" id="dropdown-fields">
            <!-- Filled dynamically -->
          </div>
          <button class="builder-generate-btn" id="dropdown-generate-btn">Generate SMILES</button>
        </div>

        <!-- Wizard Mode -->
        <div class="builder-mode-content wizard-content">
          <div class="wizard-progress" id="wizard-progress">
            <div class="wizard-progress-bar"></div>
          </div>
          <div class="wizard-question" id="wizard-question">
            <!-- Filled dynamically -->
          </div>
          <div class="wizard-options" id="wizard-options">
            <!-- Filled dynamically -->
          </div>
          <div class="wizard-nav">
            <button class="wizard-back-btn" id="wizard-back-btn" disabled>← Back</button>
            <button class="wizard-restart-btn" id="wizard-restart-btn">Restart</button>
          </div>
        </div>

        <!-- Draw Mode -->
        <div class="builder-mode-content draw-content">
          <div class="draw-toolbar">
            <div class="draw-atoms">
              <button class="draw-atom-btn" data-atom="C">C</button>
              <button class="draw-atom-btn" data-atom="N">N</button>
              <button class="draw-atom-btn" data-atom="O">O</button>
              <button class="draw-atom-btn" data-atom="S">S</button>
              <button class="draw-atom-btn" data-atom="F">F</button>
              <button class="draw-atom-btn" data-atom="Cl">Cl</button>
              <button class="draw-atom-btn" data-atom="Br">Br</button>
              <button class="draw-atom-btn" data-atom="I">I</button>
            </div>
            <div class="draw-bonds">
              <button class="draw-bond-btn active" data-bond="single">─</button>
              <button class="draw-bond-btn" data-bond="double">=</button>
              <button class="draw-bond-btn" data-bond="triple">≡</button>
            </div>
            <div class="draw-rings">
              <button class="draw-ring-btn" data-ring="5">⬠</button>
              <button class="draw-ring-btn" data-ring="6">⬡</button>
            </div>
            <div class="draw-actions">
              <button class="draw-undo-btn" id="draw-undo">↩</button>
              <button class="draw-clear-btn" id="draw-clear">Clear</button>
            </div>
          </div>
          <div class="draw-canvas-container">
            <svg id="draw-canvas" viewBox="0 0 300 200"></svg>
          </div>
          <p class="draw-hint">Click to add atoms, drag between atoms to create bonds</p>
        </div>
      </div>

      <div class="builder-preview">
        <label>Generated SMILES:</label>
        <div class="preview-row">
          <input type="text" id="builder-smiles-output" readonly placeholder="Select a molecule...">
          <button class="copy-btn" id="builder-copy-btn" title="Copy to clipboard">📋</button>
        </div>
      </div>

      <div class="builder-actions">
        <button class="builder-insert-btn" id="builder-insert-btn">Insert into Input</button>
        <button class="builder-cancel-btn" id="builder-cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  return panel;
}

// Initialize the builder
function initBuilder() {
  // Create and append panel if it doesn't exist
  let panel = document.getElementById('smiles-builder-panel');
  if (!panel) {
    panel = createBuilderPanel();
    document.body.appendChild(panel);
  }

  // Set up event listeners
  setupBuilderEvents(panel);

  // Add "Build" buttons next to SMILES inputs
  addBuildButtons();

  console.log('SMILES Builder initialized');
}

// Add "Build" buttons next to SMILES inputs
function addBuildButtons() {
  const smilesInputs = [
    { id: 'smiles-input', container: '.smiles-input-row' },
    { id: 'reactant-smiles', container: '.smiles-row' },
    { id: 'product-smiles', container: '.smiles-row' },
    { id: 'alkene-smiles-input', container: '.smiles-input-row' },
    { id: 'stereo-smiles-input', container: '.smiles-input-row' },
  ];

  smilesInputs.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (!input) return;

    // Check if button already exists
    if (input.parentElement.querySelector('.build-smiles-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'build-smiles-btn small-btn';
    btn.textContent = 'Build';
    btn.title = 'Open SMILES Builder';
    btn.type = 'button';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBuilder(input);
    });

    // Insert after the input
    input.parentElement.insertBefore(btn, input.nextSibling);
  });
}

// Set up all event listeners
function setupBuilderEvents(panel) {
  // Mode tab switching
  panel.querySelectorAll('.builder-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      switchBuilderMode(mode);
    });
  });

  // Close button
  panel.querySelector('.builder-close-btn').addEventListener('click', closeBuilder);

  // Minimize button
  panel.querySelector('.builder-minimize-btn').addEventListener('click', () => {
    panel.classList.toggle('minimized');
  });

  // Insert button
  panel.querySelector('#builder-insert-btn').addEventListener('click', insertSmiles);

  // Cancel button
  panel.querySelector('#builder-cancel-btn').addEventListener('click', closeBuilder);

  // Copy button
  panel.querySelector('#builder-copy-btn').addEventListener('click', copySmiles);

  // Template search
  panel.querySelector('#template-search').addEventListener('input', (e) => {
    filterTemplates(e.target.value);
  });

  // Wizard navigation
  panel.querySelector('#wizard-back-btn').addEventListener('click', wizardBack);
  panel.querySelector('#wizard-restart-btn').addEventListener('click', wizardRestart);

  // Dropdown generate
  panel.querySelector('#dropdown-generate-btn').addEventListener('click', generateFromDropdown);

  // Draw mode
  panel.querySelector('#draw-clear').addEventListener('click', clearDrawCanvas);
  panel.querySelector('#draw-undo').addEventListener('click', undoDrawAction);

  // Dragging
  const header = panel.querySelector('.builder-header');
  header.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && builderState.isOpen) {
      closeBuilder();
    }
  });
}

// Open the builder panel
function openBuilder(targetInput) {
  const panel = document.getElementById('smiles-builder-panel');
  if (!panel) return;

  builderState.isOpen = true;
  builderState.targetInput = targetInput;
  builderState.context = detectContext(targetInput);
  builderState.currentSmiles = targetInput?.value || '';

  // Update output field with current value
  panel.querySelector('#builder-smiles-output').value = builderState.currentSmiles;

  // Load context-appropriate templates
  loadTemplates();
  loadDropdownFields();
  startWizard();

  // Position panel near the input
  if (targetInput) {
    const rect = targetInput.getBoundingClientRect();
    builderState.panelPosition = {
      x: Math.min(rect.left, window.innerWidth - 400),
      y: rect.bottom + 10
    };
    panel.style.left = builderState.panelPosition.x + 'px';
    panel.style.top = builderState.panelPosition.y + 'px';
  }

  panel.classList.remove('hidden');
  panel.querySelector('#template-search').focus();
}

// Close the builder panel
function closeBuilder() {
  const panel = document.getElementById('smiles-builder-panel');
  if (panel) {
    panel.classList.add('hidden');
  }
  builderState.isOpen = false;
  builderState.targetInput = null;
}

// Switch between builder modes
function switchBuilderMode(mode) {
  const panel = document.getElementById('smiles-builder-panel');
  if (!panel) return;

  builderState.mode = mode;

  // Update tabs
  panel.querySelectorAll('.builder-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  // Update content
  panel.querySelectorAll('.builder-mode-content').forEach(content => {
    content.classList.remove('active');
  });
  panel.querySelector(`.${mode}-content`).classList.add('active');

  // Mode-specific initialization
  if (mode === 'wizard') {
    startWizard();
  } else if (mode === 'draw') {
    initDrawCanvas();
  }
}

// Load templates for current context
function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  const templates = BUILDER_TEMPLATES[builderState.context] || BUILDER_TEMPLATES.cyclohexane;

  grid.innerHTML = templates.map(t => `
    <div class="template-item" data-smiles="${t.smiles}" title="${t.desc}">
      <div class="template-name">${t.name}</div>
      <div class="template-smiles">${t.smiles}</div>
    </div>
  `).join('');

  // Add click handlers
  grid.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      selectTemplate(item.dataset.smiles);
    });
  });
}

// Filter templates by search
function filterTemplates(query) {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  const lowerQuery = query.toLowerCase();

  grid.querySelectorAll('.template-item').forEach(item => {
    const name = item.querySelector('.template-name').textContent.toLowerCase();
    const smiles = item.dataset.smiles.toLowerCase();
    const matches = name.includes(lowerQuery) || smiles.includes(lowerQuery);
    item.style.display = matches ? '' : 'none';
  });
}

// Select a template
function selectTemplate(smiles) {
  builderState.currentSmiles = smiles;
  document.getElementById('builder-smiles-output').value = smiles;

  // Highlight selected
  document.querySelectorAll('.template-item').forEach(item => {
    item.classList.toggle('selected', item.dataset.smiles === smiles);
  });
}

// Load dropdown fields for current context
function loadDropdownFields() {
  const container = document.getElementById('dropdown-fields');
  if (!container) return;

  const config = DROPDOWN_CONFIGS[builderState.context] || DROPDOWN_CONFIGS.cyclohexane;

  container.innerHTML = config.fields.map(field => `
    <div class="dropdown-field">
      <label for="builder-${field.id}">${field.label}:</label>
      <select id="builder-${field.id}">
        ${field.options.map(opt => `
          <option value="${opt.value}">${opt.label}</option>
        `).join('')}
      </select>
    </div>
  `).join('');
}

// Generate SMILES from dropdown selections
function generateFromDropdown() {
  const context = builderState.context;
  let smiles = '';

  if (context === 'cyclohexane') {
    const sub1 = document.getElementById('builder-sub1')?.value;
    const sub2 = document.getElementById('builder-sub2')?.value;

    if (sub1 === 'none' || !sub1) {
      smiles = 'C1CCCCC1';
    } else if (sub2 === 'none' || !sub2) {
      const subMap = {
        'CH3': 'C', 'C2H5': 'CC', 'iPr': 'C(C)C', 'tBu': 'C(C)(C)C',
        'OH': 'O', 'Br': 'Br', 'Cl': 'Cl'
      };
      smiles = (subMap[sub1] || 'C') + 'C1CCCCC1';
    } else {
      // For now, default to a simple disubstituted
      smiles = 'CC1CCCCC1C';
    }
  } else if (context === 'reaction') {
    const type = document.getElementById('builder-substrate_type')?.value;
    const lg = document.getElementById('builder-leaving_group')?.value || 'Br';
    const chain = document.getElementById('builder-chain_length')?.value || '2';

    if (type === 'methyl') {
      smiles = 'C' + lg;
    } else if (type === 'primary') {
      smiles = 'C'.repeat(parseInt(chain) - 1) + 'C' + lg;
    } else if (type === 'secondary') {
      const n = parseInt(chain);
      if (n <= 2) {
        smiles = 'CC(' + lg + ')C';
      } else {
        smiles = 'CC(' + lg + ')' + 'C'.repeat(n - 2);
      }
    } else if (type === 'tertiary') {
      smiles = 'CC(C)(C)' + lg;
    }
  } else if (context === 'alkene') {
    const carbons = document.getElementById('builder-carbons')?.value || '2';
    const pos = document.getElementById('builder-db_position')?.value || '1';
    const geom = document.getElementById('builder-geometry')?.value || 'none';

    const n = parseInt(carbons);
    if (n === 2) {
      smiles = 'C=C';
    } else if (n === 3) {
      smiles = 'CC=C';
    } else if (n === 4) {
      if (pos === '1') {
        smiles = 'CCC=C';
      } else {
        smiles = geom === 'E' ? 'C/C=C/C' : (geom === 'Z' ? 'C/C=C\\C' : 'CC=CC');
      }
    } else {
      if (pos === '1') {
        smiles = 'C'.repeat(n - 2) + 'C=C';
      } else {
        smiles = geom === 'E' ? 'C/C=C/' + 'C'.repeat(n - 3) : 'CC=C' + 'C'.repeat(n - 3);
      }
    }
  } else if (context === 'stereo') {
    const base = document.getElementById('builder-base_structure')?.value || '2-halobutane';
    const config = document.getElementById('builder-configuration')?.value || 'R';
    const halogen = document.getElementById('builder-halogen')?.value || 'Br';

    const stereo = config === 'R' ? '@@' : '@';

    if (base === '2-halobutane') {
      smiles = `CC[C${stereo}H](${halogen})C`;
    } else if (base === '2-halopentane') {
      smiles = `CCC[C${stereo}H](${halogen})C`;
    } else if (base === 'lactic_acid') {
      smiles = `C[C${stereo}H](O)C(=O)O`;
    } else if (base === 'alanine') {
      smiles = `C[C${stereo}H](N)C(=O)O`;
    }
  }

  builderState.currentSmiles = smiles;
  document.getElementById('builder-smiles-output').value = smiles;
}

// Wizard functions
function startWizard() {
  builderState.wizardStep = 0;
  builderState.wizardAnswers = [];
  renderWizardStep();
}

function renderWizardStep() {
  const steps = WIZARD_STEPS[builderState.context] || WIZARD_STEPS.cyclohexane;
  const step = steps[builderState.wizardStep];

  if (!step) {
    // No more steps, should have result
    return;
  }

  // Update progress
  const progress = document.getElementById('wizard-progress');
  if (progress) {
    const bar = progress.querySelector('.wizard-progress-bar');
    const percent = ((builderState.wizardStep + 1) / steps.length) * 100;
    bar.style.width = percent + '%';
  }

  // Update question
  document.getElementById('wizard-question').textContent = step.question;

  // Update options
  const optionsContainer = document.getElementById('wizard-options');
  optionsContainer.innerHTML = step.options.map(opt => `
    <button class="wizard-option-btn" data-value="${opt.value}"
            data-next="${opt.next !== undefined ? opt.next : ''}"
            data-result="${opt.result || ''}">
      ${opt.label}
    </button>
  `).join('');

  // Add click handlers
  optionsContainer.querySelectorAll('.wizard-option-btn').forEach(btn => {
    btn.addEventListener('click', () => wizardSelectOption(btn));
  });

  // Update back button
  document.getElementById('wizard-back-btn').disabled = builderState.wizardStep === 0;
}

function wizardSelectOption(btn) {
  const value = btn.dataset.value;
  const next = btn.dataset.next;
  const result = btn.dataset.result;

  builderState.wizardAnswers.push(value);

  if (result) {
    // We have a result
    builderState.currentSmiles = result;
    document.getElementById('builder-smiles-output').value = result;
    document.getElementById('wizard-question').textContent = 'Complete! Your SMILES is ready.';
    document.getElementById('wizard-options').innerHTML = `
      <div class="wizard-result">
        <strong>${result}</strong>
        <p>Click "Insert into Input" to use this SMILES.</p>
      </div>
    `;
  } else if (next !== '') {
    builderState.wizardStep = parseInt(next);
    renderWizardStep();
  }
}

function wizardBack() {
  if (builderState.wizardStep > 0) {
    builderState.wizardStep--;
    builderState.wizardAnswers.pop();
    renderWizardStep();
  }
}

function wizardRestart() {
  startWizard();
}

// Draw mode functions
let drawState = {
  atoms: [],
  bonds: [],
  selectedAtom: 'C',
  selectedBond: 'single',
  dragStart: null,
};

function initDrawCanvas() {
  const canvas = document.getElementById('draw-canvas');
  if (!canvas) return;

  // Clear canvas
  canvas.innerHTML = '';
  drawState.atoms = [];
  drawState.bonds = [];

  // Add grid background
  canvas.innerHTML = `
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eee" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <g class="bonds-layer"></g>
    <g class="atoms-layer"></g>
  `;

  // Set up event listeners
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousedown', handleCanvasMouseDown);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);

  // Atom buttons
  document.querySelectorAll('.draw-atom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.draw-atom-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawState.selectedAtom = btn.dataset.atom;
    });
  });

  // Bond buttons
  document.querySelectorAll('.draw-bond-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.draw-bond-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawState.selectedBond = btn.dataset.bond;
    });
  });

  // Ring buttons
  document.querySelectorAll('.draw-ring-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addRingAtCenter(parseInt(btn.dataset.ring));
    });
  });
}

function handleCanvasClick(e) {
  const canvas = document.getElementById('draw-canvas');
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (300 / rect.width);
  const y = (e.clientY - rect.top) * (200 / rect.height);

  // Check if clicking near existing atom
  const nearAtom = findNearAtom(x, y, 15);

  if (!nearAtom) {
    // Add new atom
    addAtom(x, y, drawState.selectedAtom);
  }
}

function handleCanvasMouseDown(e) {
  const canvas = document.getElementById('draw-canvas');
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (300 / rect.width);
  const y = (e.clientY - rect.top) * (200 / rect.height);

  const nearAtom = findNearAtom(x, y, 15);
  if (nearAtom) {
    drawState.dragStart = nearAtom;
  }
}

function handleCanvasMouseMove(e) {
  // Could show preview line while dragging
}

function handleCanvasMouseUp(e) {
  if (!drawState.dragStart) return;

  const canvas = document.getElementById('draw-canvas');
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (300 / rect.width);
  const y = (e.clientY - rect.top) * (200 / rect.height);

  const nearAtom = findNearAtom(x, y, 15);

  if (nearAtom && nearAtom !== drawState.dragStart) {
    // Create bond between atoms
    addBond(drawState.dragStart, nearAtom, drawState.selectedBond);
  } else if (!nearAtom && distance(drawState.dragStart.x, drawState.dragStart.y, x, y) > 20) {
    // Add new atom and bond to it
    const newAtom = addAtom(x, y, drawState.selectedAtom);
    if (newAtom) {
      addBond(drawState.dragStart, newAtom, drawState.selectedBond);
    }
  }

  drawState.dragStart = null;
}

function findNearAtom(x, y, threshold) {
  for (const atom of drawState.atoms) {
    if (distance(atom.x, atom.y, x, y) < threshold) {
      return atom;
    }
  }
  return null;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function addAtom(x, y, element) {
  const atom = { id: drawState.atoms.length, x, y, element };
  drawState.atoms.push(atom);
  renderDrawing();
  updateSmilesFromDrawing();
  return atom;
}

function addBond(atom1, atom2, type) {
  // Check if bond already exists
  const exists = drawState.bonds.some(b =>
    (b.atom1 === atom1 && b.atom2 === atom2) ||
    (b.atom1 === atom2 && b.atom2 === atom1)
  );
  if (exists) return;

  drawState.bonds.push({ atom1, atom2, type });
  renderDrawing();
  updateSmilesFromDrawing();
}

function addRingAtCenter(size) {
  const cx = 150;
  const cy = 100;
  const radius = 40;

  const atoms = [];
  for (let i = 0; i < size; i++) {
    const angle = (i / size) * Math.PI * 2 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    atoms.push(addAtom(x, y, 'C'));
  }

  // Connect with bonds
  for (let i = 0; i < atoms.length; i++) {
    addBond(atoms[i], atoms[(i + 1) % atoms.length], 'single');
  }
}

function renderDrawing() {
  const canvas = document.getElementById('draw-canvas');
  if (!canvas) return;

  const bondsLayer = canvas.querySelector('.bonds-layer');
  const atomsLayer = canvas.querySelector('.atoms-layer');

  // Render bonds
  bondsLayer.innerHTML = drawState.bonds.map(bond => {
    const x1 = bond.atom1.x;
    const y1 = bond.atom1.y;
    const x2 = bond.atom2.x;
    const y2 = bond.atom2.y;

    if (bond.type === 'single') {
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2"/>`;
    } else if (bond.type === 'double') {
      const dx = (y2 - y1) * 0.1;
      const dy = (x1 - x2) * 0.1;
      return `
        <line x1="${x1 - dx}" y1="${y1 - dy}" x2="${x2 - dx}" y2="${y2 - dy}" stroke="#333" stroke-width="2"/>
        <line x1="${x1 + dx}" y1="${y1 + dy}" x2="${x2 + dx}" y2="${y2 + dy}" stroke="#333" stroke-width="2"/>
      `;
    } else if (bond.type === 'triple') {
      const dx = (y2 - y1) * 0.12;
      const dy = (x1 - x2) * 0.12;
      return `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2"/>
        <line x1="${x1 - dx}" y1="${y1 - dy}" x2="${x2 - dx}" y2="${y2 - dy}" stroke="#333" stroke-width="2"/>
        <line x1="${x1 + dx}" y1="${y1 + dy}" x2="${x2 + dx}" y2="${y2 + dy}" stroke="#333" stroke-width="2"/>
      `;
    }
  }).join('');

  // Render atoms
  atomsLayer.innerHTML = drawState.atoms.map(atom => {
    const color = atom.element === 'C' ? '#333' :
                  atom.element === 'O' ? '#e44' :
                  atom.element === 'N' ? '#44e' :
                  atom.element === 'S' ? '#ee4' :
                  atom.element === 'Br' ? '#a44' :
                  atom.element === 'Cl' ? '#4a4' :
                  atom.element === 'F' ? '#4aa' :
                  atom.element === 'I' ? '#a4a' : '#333';

    return `
      <g class="atom" data-id="${atom.id}">
        <circle cx="${atom.x}" cy="${atom.y}" r="12" fill="white" stroke="${color}" stroke-width="2"/>
        <text x="${atom.x}" y="${atom.y + 4}" text-anchor="middle" font-size="10" fill="${color}">${atom.element}</text>
      </g>
    `;
  }).join('');
}

function updateSmilesFromDrawing() {
  // Simple graph-to-SMILES conversion
  // This is a basic implementation - a full implementation would handle rings, stereochemistry, etc.

  if (drawState.atoms.length === 0) {
    builderState.currentSmiles = '';
    document.getElementById('builder-smiles-output').value = '';
    return;
  }

  // Build adjacency list
  const adj = new Map();
  for (const atom of drawState.atoms) {
    adj.set(atom.id, []);
  }
  for (const bond of drawState.bonds) {
    adj.get(bond.atom1.id).push({ atom: bond.atom2, type: bond.type });
    adj.get(bond.atom2.id).push({ atom: bond.atom1, type: bond.type });
  }

  // DFS to generate SMILES
  const visited = new Set();
  let smiles = '';

  function dfs(atomId) {
    if (visited.has(atomId)) return '';
    visited.add(atomId);

    const atom = drawState.atoms.find(a => a.id === atomId);
    let result = atom.element;

    const neighbors = adj.get(atomId) || [];
    const branches = [];

    for (const { atom: neighbor, type } of neighbors) {
      if (visited.has(neighbor.id)) continue;

      const bondStr = type === 'double' ? '=' : type === 'triple' ? '#' : '';
      const branchSmiles = bondStr + dfs(neighbor.id);
      branches.push(branchSmiles);
    }

    // First branch continues main chain, rest are in parentheses
    if (branches.length > 0) {
      result += branches[0];
      for (let i = 1; i < branches.length; i++) {
        result += '(' + branches[i] + ')';
      }
    }

    return result;
  }

  smiles = dfs(drawState.atoms[0].id);

  builderState.currentSmiles = smiles;
  document.getElementById('builder-smiles-output').value = smiles;
}

function clearDrawCanvas() {
  drawState.atoms = [];
  drawState.bonds = [];
  initDrawCanvas();
  builderState.currentSmiles = '';
  document.getElementById('builder-smiles-output').value = '';
}

function undoDrawAction() {
  if (drawState.bonds.length > 0) {
    drawState.bonds.pop();
  } else if (drawState.atoms.length > 0) {
    drawState.atoms.pop();
  }
  renderDrawing();
  updateSmilesFromDrawing();
}

// Utility functions
function insertSmiles() {
  if (builderState.targetInput && builderState.currentSmiles) {
    builderState.targetInput.value = builderState.currentSmiles;

    // Trigger input event so viewers can react
    builderState.targetInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Also trigger change event
    builderState.targetInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
  closeBuilder();
}

function copySmiles() {
  const output = document.getElementById('builder-smiles-output');
  if (output && output.value) {
    navigator.clipboard.writeText(output.value).then(() => {
      // Visual feedback
      const btn = document.getElementById('builder-copy-btn');
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = '📋'; }, 1000);
    });
  }
}

// Dragging functions
function startDragging(e) {
  const panel = document.getElementById('smiles-builder-panel');
  if (!panel) return;

  builderState.isDragging = true;
  builderState.dragOffset = {
    x: e.clientX - panel.offsetLeft,
    y: e.clientY - panel.offsetTop
  };

  panel.style.cursor = 'grabbing';
}

function handleDragging(e) {
  if (!builderState.isDragging) return;

  const panel = document.getElementById('smiles-builder-panel');
  if (!panel) return;

  const x = e.clientX - builderState.dragOffset.x;
  const y = e.clientY - builderState.dragOffset.y;

  // Keep within viewport
  const maxX = window.innerWidth - panel.offsetWidth;
  const maxY = window.innerHeight - panel.offsetHeight;

  panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
  panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function stopDragging() {
  builderState.isDragging = false;

  const panel = document.getElementById('smiles-builder-panel');
  if (panel) {
    panel.style.cursor = '';
    builderState.panelPosition = {
      x: panel.offsetLeft,
      y: panel.offsetTop
    };
  }
}

// Export functions
export {
  initBuilder,
  openBuilder,
  closeBuilder,
  BUILDER_TEMPLATES
};
