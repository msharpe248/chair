/**
 * Nomenclature Renderer Module
 *
 * SVG rendering for IUPAC nomenclature visualization and quizzes.
 */

const NS = 'http://www.w3.org/2000/svg';

const COLORS = {
  carbon: '#1e293b',
  bond: '#334155',
  methyl: '#059669',
  substituent: '#dc2626',
  number: '#2563eb',
  parentChain: '#8b5cf6',
  doubleBond: '#f59e0b',
  text: '#334155',
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
 * Simple SMILES parser for visualization
 * Handles basic alkanes, alkenes, and substituents
 */
function parseSMILES(smiles) {
  // This is a simplified parser for educational visualization
  const atoms = [];
  const bonds = [];

  let i = 0;
  let atomIndex = 0;
  const stack = [];
  const ringStarts = {};

  while (i < smiles.length) {
    const char = smiles[i];

    // Skip stereochemistry markers for now
    if (char === '/' || char === '\\') {
      i++;
      continue;
    }

    // Branch start
    if (char === '(') {
      stack.push(atomIndex - 1);
      i++;
      continue;
    }

    // Branch end
    if (char === ')') {
      stack.pop();
      i++;
      continue;
    }

    // Ring numbers
    if (char >= '1' && char <= '9') {
      const ringNum = char;
      if (ringStarts[ringNum] !== undefined) {
        bonds.push({
          from: ringStarts[ringNum],
          to: atomIndex - 1,
          order: 1
        });
        delete ringStarts[ringNum];
      } else {
        ringStarts[ringNum] = atomIndex - 1;
      }
      i++;
      continue;
    }

    // Bonds
    if (char === '=') {
      // Mark last bond as double
      if (bonds.length > 0) {
        bonds[bonds.length - 1].order = 2;
      }
      i++;
      continue;
    }

    if (char === '#') {
      if (bonds.length > 0) {
        bonds[bonds.length - 1].order = 3;
      }
      i++;
      continue;
    }

    // Atoms
    if (char === 'C' || char === 'c') {
      const atom = {
        element: 'C',
        index: atomIndex,
        aromatic: char === 'c'
      };
      atoms.push(atom);

      // Bond to previous atom
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({
          from: prevAtom,
          to: atomIndex,
          order: (char === 'c') ? 1.5 : 1
        });
      }

      atomIndex++;
      i++;
      continue;
    }

    // Halogens
    if (char === 'F' || char === 'I') {
      atoms.push({ element: char, index: atomIndex });
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({ from: prevAtom, to: atomIndex, order: 1 });
      }
      atomIndex++;
      i++;
      continue;
    }

    if (char === 'B' && smiles.substring(i, i+2) === 'Br') {
      atoms.push({ element: 'Br', index: atomIndex });
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({ from: prevAtom, to: atomIndex, order: 1 });
      }
      atomIndex++;
      i += 2;
      continue;
    }

    if (char === 'C' && smiles.substring(i, i+2) === 'Cl') {
      atoms.push({ element: 'Cl', index: atomIndex });
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({ from: prevAtom, to: atomIndex, order: 1 });
      }
      atomIndex++;
      i += 2;
      continue;
    }

    // Oxygen
    if (char === 'O') {
      atoms.push({ element: 'O', index: atomIndex });
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({ from: prevAtom, to: atomIndex, order: 1 });
      }
      atomIndex++;
      i++;
      continue;
    }

    // Nitrogen
    if (char === 'N') {
      atoms.push({ element: 'N', index: atomIndex });
      const prevAtom = stack.length > 0 ? stack[stack.length - 1] : atomIndex - 1;
      if (atomIndex > 0) {
        bonds.push({ from: prevAtom, to: atomIndex, order: 1 });
      }
      atomIndex++;
      i++;
      continue;
    }

    i++;
  }

  return { atoms, bonds };
}

/**
 * Generate 2D coordinates for atoms using simple layout
 */
function layoutMolecule(parsed) {
  const { atoms, bonds } = parsed;
  const positions = [];

  // Simple linear layout with branches
  const bondLength = 40;
  const branchAngle = Math.PI / 3;

  // Build adjacency list
  const adj = atoms.map(() => []);
  bonds.forEach(bond => {
    adj[bond.from].push({ to: bond.to, order: bond.order });
    adj[bond.to].push({ to: bond.from, order: bond.order });
  });

  // Check if cyclic
  const isCyclic = bonds.some(b =>
    adj[b.from].filter(x => x.to === b.to).length > 1 ||
    (bonds.filter(bb => bb.from === b.from || bb.to === b.from).length > 2)
  );

  if (isCyclic && atoms.length >= 3) {
    // Ring layout
    const ringSize = atoms.length;
    const radius = bondLength * ringSize / (2 * Math.PI) * 1.2;

    atoms.forEach((atom, i) => {
      const angle = (2 * Math.PI * i / ringSize) - Math.PI / 2;
      positions[i] = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      };
    });
  } else {
    // Linear layout with branches
    const visited = new Set();
    const queue = [{ index: 0, x: 0, y: 0, angle: 0 }];
    visited.add(0);
    positions[0] = { x: 0, y: 0 };

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = adj[current.index];

      let branchNum = 0;
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor.to)) {
          visited.add(neighbor.to);

          // Alternate angles for branches
          let angle = current.angle;
          if (branchNum > 0) {
            angle += (branchNum % 2 === 0 ? 1 : -1) * branchAngle * Math.ceil(branchNum / 2);
          }

          const newX = current.x + bondLength * Math.cos(angle);
          const newY = current.y + bondLength * Math.sin(angle);

          positions[neighbor.to] = { x: newX, y: newY };
          queue.push({ index: neighbor.to, x: newX, y: newY, angle: angle });
          branchNum++;
        }
      });
    }
  }

  // Center the molecule
  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x));
  const minY = Math.min(...positions.map(p => p.y));
  const maxY = Math.max(...positions.map(p => p.y));

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  positions.forEach(p => {
    p.x -= centerX;
    p.y -= centerY;
  });

  return positions;
}

/**
 * Render a molecule from SMILES
 */
export function renderMolecule(svg, smiles, options = {}) {
  const {
    showNumbers = false,
    highlightParent = false,
    highlightSubstituents = false,
    centerX = 200,
    centerY = 150,
    scale = 1
  } = options;

  const parsed = parseSMILES(smiles);
  const positions = layoutMolecule(parsed);

  const g = createSVG('g', {
    transform: `translate(${centerX}, ${centerY}) scale(${scale})`
  });

  // Draw bonds
  parsed.bonds.forEach(bond => {
    const from = positions[bond.from];
    const to = positions[bond.to];

    if (bond.order === 2) {
      // Double bond
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len * 3;
      const ny = dx / len * 3;

      const line1 = createSVG('line', {
        x1: from.x + nx, y1: from.y + ny,
        x2: to.x + nx, y2: to.y + ny,
        stroke: COLORS.bond,
        'stroke-width': '2'
      });
      const line2 = createSVG('line', {
        x1: from.x - nx, y1: from.y - ny,
        x2: to.x - nx, y2: to.y - ny,
        stroke: COLORS.doubleBond,
        'stroke-width': '2'
      });
      g.appendChild(line1);
      g.appendChild(line2);
    } else if (bond.order === 1.5) {
      // Aromatic
      const line = createSVG('line', {
        x1: from.x, y1: from.y,
        x2: to.x, y2: to.y,
        stroke: COLORS.parentChain,
        'stroke-width': '2'
      });
      g.appendChild(line);
    } else {
      // Single bond
      const line = createSVG('line', {
        x1: from.x, y1: from.y,
        x2: to.x, y2: to.y,
        stroke: COLORS.bond,
        'stroke-width': '2'
      });
      g.appendChild(line);
    }
  });

  // Draw atoms
  parsed.atoms.forEach((atom, i) => {
    const pos = positions[i];

    // Background circle for non-carbon atoms
    if (atom.element !== 'C') {
      const circle = createSVG('circle', {
        cx: pos.x, cy: pos.y, r: '12',
        fill: 'white',
        stroke: atom.element === 'O' ? '#dc2626' :
                atom.element === 'N' ? '#2563eb' :
                atom.element === 'Br' ? '#92400e' :
                atom.element === 'Cl' ? '#059669' :
                atom.element === 'F' ? '#22c55e' :
                atom.element === 'I' ? '#7c3aed' : COLORS.carbon,
        'stroke-width': '2'
      });
      g.appendChild(circle);

      const label = createSVG('text', {
        x: pos.x, y: pos.y + 4,
        'text-anchor': 'middle',
        'font-size': '11',
        'font-weight': '600',
        fill: atom.element === 'O' ? '#dc2626' :
              atom.element === 'N' ? '#2563eb' :
              atom.element === 'Br' ? '#92400e' :
              atom.element === 'Cl' ? '#059669' :
              atom.element === 'F' ? '#22c55e' :
              atom.element === 'I' ? '#7c3aed' : COLORS.carbon
      });
      label.textContent = atom.element;
      g.appendChild(label);
    }

    // Show carbon numbers if requested
    if (showNumbers && atom.element === 'C') {
      const numLabel = createSVG('text', {
        x: pos.x, y: pos.y - 15,
        'text-anchor': 'middle',
        'font-size': '10',
        'font-weight': '600',
        fill: COLORS.number
      });
      numLabel.textContent = String(i + 1);
      g.appendChild(numLabel);
    }
  });

  svg.appendChild(g);
  return g;
}

/**
 * Render nomenclature quiz display
 */
export function renderNomenclatureQuiz(svg, question) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 350');

  // Background
  const bg = createSVG('rect', {
    x: '0', y: '0', width: '500', height: '350',
    fill: COLORS.background
  });
  svg.appendChild(bg);

  // Title
  const title = createSVG('text', {
    x: '250', y: '30',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = 'IUPAC Nomenclature';
  svg.appendChild(title);

  // Question
  const questionText = createSVG('text', {
    x: '250', y: '55',
    'text-anchor': 'middle',
    'font-size': '12',
    fill: COLORS.text
  });
  questionText.textContent = question.question;
  svg.appendChild(questionText);

  // Render molecule if present
  if (question.smiles) {
    renderMolecule(svg, question.smiles, {
      centerX: 250,
      centerY: 150,
      showNumbers: true,
      scale: 1.2
    });
  }

  // If it's a naming error question, show the wrong name prominently
  if (question.type === 'find-error' && question.wrongName) {
    const wrongNameBg = createSVG('rect', {
      x: '150', y: '230',
      width: '200', height: '30',
      rx: '4',
      fill: '#fee2e2',
      stroke: '#fecaca'
    });
    svg.appendChild(wrongNameBg);

    const wrongNameText = createSVG('text', {
      x: '250', y: '250',
      'text-anchor': 'middle',
      'font-size': '14',
      'font-weight': '600',
      fill: '#dc2626'
    });
    wrongNameText.textContent = `"${question.wrongName}"`;
    svg.appendChild(wrongNameText);
  }

  // Key box
  const keyBox = createSVG('rect', {
    x: '20', y: '280',
    width: '460', height: '60',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(keyBox);

  const keyTitle = createSVG('text', {
    x: '35', y: '300',
    'font-size': '10',
    'font-weight': '600',
    fill: COLORS.text
  });
  keyTitle.textContent = 'Remember:';
  svg.appendChild(keyTitle);

  const tips = [
    'Find longest chain → Number from nearest substituent → List alphabetically'
  ];

  tips.forEach((tip, i) => {
    const tipText = createSVG('text', {
      x: '35', y: 318 + i * 14,
      'font-size': '10',
      fill: COLORS.text
    });
    tipText.textContent = tip;
    svg.appendChild(tipText);
  });
}

/**
 * Render E/Z stereochemistry explanation
 */
export function renderEZExplanation(svg, smiles, stereochem) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 300');

  const bg = createSVG('rect', {
    x: '0', y: '0', width: '500', height: '300',
    fill: COLORS.background
  });
  svg.appendChild(bg);

  const title = createSVG('text', {
    x: '250', y: '25',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = 'E/Z Stereochemistry';
  svg.appendChild(title);

  // Draw the alkene with clear E/Z indication
  const centerX = 250;
  const centerY = 130;

  // Double bond
  const line1 = createSVG('line', {
    x1: centerX - 30, y1: centerY - 3,
    x2: centerX + 30, y2: centerY - 3,
    stroke: COLORS.bond, 'stroke-width': '3'
  });
  const line2 = createSVG('line', {
    x1: centerX - 30, y1: centerY + 3,
    x2: centerX + 30, y2: centerY + 3,
    stroke: COLORS.doubleBond, 'stroke-width': '3'
  });
  svg.appendChild(line1);
  svg.appendChild(line2);

  // Groups
  if (stereochem === 'E') {
    // E = trans - groups on opposite sides
    // Left top
    const lt = createSVG('text', { x: centerX - 50, y: centerY - 20, 'font-size': '14', 'font-weight': '600', fill: COLORS.methyl });
    lt.textContent = 'CH₃';
    svg.appendChild(lt);
    const ltLine = createSVG('line', { x1: centerX - 35, y1: centerY - 5, x2: centerX - 45, y2: centerY - 15, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(ltLine);

    // Left bottom
    const lb = createSVG('text', { x: centerX - 50, y: centerY + 35, 'font-size': '12', fill: COLORS.text });
    lb.textContent = 'H';
    svg.appendChild(lb);
    const lbLine = createSVG('line', { x1: centerX - 35, y1: centerY + 5, x2: centerX - 45, y2: centerY + 25, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(lbLine);

    // Right top
    const rt = createSVG('text', { x: centerX + 40, y: centerY - 20, 'font-size': '12', fill: COLORS.text });
    rt.textContent = 'H';
    svg.appendChild(rt);
    const rtLine = createSVG('line', { x1: centerX + 35, y1: centerY - 5, x2: centerX + 45, y2: centerY - 15, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(rtLine);

    // Right bottom
    const rb = createSVG('text', { x: centerX + 40, y: centerY + 35, 'font-size': '14', 'font-weight': '600', fill: COLORS.methyl });
    rb.textContent = 'CH₃';
    svg.appendChild(rb);
    const rbLine = createSVG('line', { x1: centerX + 35, y1: centerY + 5, x2: centerX + 45, y2: centerY + 25, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(rbLine);

  } else {
    // Z = cis - groups on same side
    // Left top
    const lt = createSVG('text', { x: centerX - 50, y: centerY - 20, 'font-size': '14', 'font-weight': '600', fill: COLORS.methyl });
    lt.textContent = 'CH₃';
    svg.appendChild(lt);
    const ltLine = createSVG('line', { x1: centerX - 35, y1: centerY - 5, x2: centerX - 45, y2: centerY - 15, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(ltLine);

    // Left bottom
    const lb = createSVG('text', { x: centerX - 50, y: centerY + 35, 'font-size': '12', fill: COLORS.text });
    lb.textContent = 'H';
    svg.appendChild(lb);
    const lbLine = createSVG('line', { x1: centerX - 35, y1: centerY + 5, x2: centerX - 45, y2: centerY + 25, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(lbLine);

    // Right top
    const rt = createSVG('text', { x: centerX + 40, y: centerY - 20, 'font-size': '14', 'font-weight': '600', fill: COLORS.methyl });
    rt.textContent = 'CH₃';
    svg.appendChild(rt);
    const rtLine = createSVG('line', { x1: centerX + 35, y1: centerY - 5, x2: centerX + 45, y2: centerY - 15, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(rtLine);

    // Right bottom
    const rb = createSVG('text', { x: centerX + 40, y: centerY + 35, 'font-size': '12', fill: COLORS.text });
    rb.textContent = 'H';
    svg.appendChild(rb);
    const rbLine = createSVG('line', { x1: centerX + 35, y1: centerY + 5, x2: centerX + 45, y2: centerY + 25, stroke: COLORS.bond, 'stroke-width': '2' });
    svg.appendChild(rbLine);
  }

  // E/Z label
  const ezLabel = createSVG('text', {
    x: '250', y: '200',
    'text-anchor': 'middle',
    'font-size': '18',
    'font-weight': '700',
    fill: stereochem === 'E' ? COLORS.substituent : COLORS.methyl
  });
  ezLabel.textContent = stereochem === 'E' ? '(E) - Entgegen (opposite)' : '(Z) - Zusammen (together)';
  svg.appendChild(ezLabel);

  // Explanation box
  const expBox = createSVG('rect', {
    x: '30', y: '220',
    width: '440', height: '70',
    rx: '8',
    fill: '#f1f5f9',
    stroke: '#e2e8f0'
  });
  svg.appendChild(expBox);

  const expLines = stereochem === 'E' ? [
    'E (trans): Higher priority groups on OPPOSITE sides',
    'Priority: CH₃ > H (more atoms attached)',
    'The two methyl groups are across from each other'
  ] : [
    'Z (cis): Higher priority groups on SAME side',
    'Priority: CH₃ > H (more atoms attached)',
    'The two methyl groups are on the same side'
  ];

  expLines.forEach((line, i) => {
    const text = createSVG('text', {
      x: '45', y: 240 + i * 18,
      'font-size': '11',
      fill: COLORS.text
    });
    text.textContent = line;
    svg.appendChild(text);
  });
}

/**
 * Render naming rules reference
 */
export function renderNamingRules(svg, compoundClass = 'alkanes') {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 500 400');

  const bg = createSVG('rect', {
    x: '0', y: '0', width: '500', height: '400',
    fill: COLORS.background
  });
  svg.appendChild(bg);

  const title = createSVG('text', {
    x: '250', y: '30',
    'text-anchor': 'middle',
    'font-size': '16',
    'font-weight': '600',
    fill: COLORS.text
  });
  title.textContent = `IUPAC Naming Rules: ${compoundClass.charAt(0).toUpperCase() + compoundClass.slice(1)}`;
  svg.appendChild(title);

  const rules = {
    alkanes: [
      '1. Find the longest continuous carbon chain (parent)',
      '2. Number from the end nearest to the first substituent',
      '3. Name substituents: methyl, ethyl, propyl, etc.',
      '4. Use di-, tri-, tetra- for multiple identical groups',
      '5. List substituents alphabetically (ignore di-, tri-)',
      '6. Combine: locants-substituents + parent name'
    ],
    alkenes: [
      '1. Suffix: -ene replaces -ane',
      '2. Number to give double bond lowest locant',
      '3. For E/Z stereochemistry:',
      '   • Determine priority on each carbon (CIP rules)',
      '   • E = higher priority groups on opposite sides',
      '   • Z = higher priority groups on same side'
    ],
    alcohols: [
      '1. Suffix: -ol replaces -e of parent',
      '2. OH gets priority over double bonds in numbering',
      '3. Modern format: propan-2-ol (number before -ol)',
      '4. Diols: -diol suffix with both positions',
      '5. OH is a higher priority functional group'
    ],
    alkylHalides: [
      '1. Halogens are named as substituents',
      '2. Prefixes: fluoro-, chloro-, bromo-, iodo-',
      '3. Listed alphabetically with other substituents',
      '4. Number to give lowest locant'
    ]
  };

  const classRules = rules[compoundClass] || rules.alkanes;

  classRules.forEach((rule, i) => {
    const ruleText = createSVG('text', {
      x: '30', y: 70 + i * 28,
      'font-size': '12',
      fill: COLORS.text
    });
    ruleText.textContent = rule;
    svg.appendChild(ruleText);
  });

  // Example
  const exBox = createSVG('rect', {
    x: '30', y: '280',
    width: '440', height: '100',
    rx: '8',
    fill: '#dbeafe',
    stroke: '#93c5fd'
  });
  svg.appendChild(exBox);

  const exTitle = createSVG('text', {
    x: '45', y: '305',
    'font-size': '12',
    'font-weight': '600',
    fill: COLORS.number
  });
  exTitle.textContent = 'Example:';
  svg.appendChild(exTitle);

  const examples = {
    alkanes: ['CC(C)CC → 2-methylbutane', '• Longest chain: 4C (butane)', '• Methyl at position 2'],
    alkenes: ['CC=CC → 2-butene', '• Double bond at C2', '• Add (E) or (Z) if needed'],
    alcohols: ['CC(O)C → propan-2-ol', '• OH at C2 of propane', '• Number from end nearest OH'],
    alkylHalides: ['CC(Cl)C → 2-chloropropane', '• Chloro at C2 of propane']
  };

  const classExamples = examples[compoundClass] || examples.alkanes;

  classExamples.forEach((ex, i) => {
    const exText = createSVG('text', {
      x: '45', y: 325 + i * 18,
      'font-size': '11',
      fill: COLORS.text
    });
    exText.textContent = ex;
    svg.appendChild(exText);
  });
}
