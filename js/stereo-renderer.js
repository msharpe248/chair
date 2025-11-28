/**
 * Stereochemistry Renderer Module
 *
 * SVG rendering for stereochemistry visualization including
 * wedge-dash notation, Fischer projections, and reaction outcomes.
 */

import { PRESET_MOLECULES, REACTION_OUTCOMES } from './stereochemistry.js';

const COLORS = {
  R: '#2563eb',    // Blue for R
  S: '#dc2626',    // Red for S
  racemic: '#8b5cf6', // Purple for racemic
  bond: '#334155',
  carbon: '#1e293b',
  wedge: '#334155',
  dash: '#64748b',
  arrow: '#22c55e',
  nucleophile: '#059669'
};

/**
 * Render wedge-dash structure of a stereocenter
 * @param {SVGElement} svg - Target SVG
 * @param {Object} stereocenter - Stereocenter data
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 */
function renderWedgeDash(svg, stereocenter, cx, cy) {
  const NS = 'http://www.w3.org/2000/svg';
  const bondLength = 50;

  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${cx}, ${cy})`);

  // Carbon label at center
  const carbonCircle = document.createElementNS(NS, 'circle');
  carbonCircle.setAttribute('cx', '0');
  carbonCircle.setAttribute('cy', '0');
  carbonCircle.setAttribute('r', '12');
  carbonCircle.setAttribute('fill', 'white');
  carbonCircle.setAttribute('stroke', COLORS[stereocenter.config]);
  carbonCircle.setAttribute('stroke-width', '3');
  g.appendChild(carbonCircle);

  const configLabel = document.createElementNS(NS, 'text');
  configLabel.setAttribute('x', '0');
  configLabel.setAttribute('y', '5');
  configLabel.setAttribute('text-anchor', 'middle');
  configLabel.setAttribute('font-size', '14');
  configLabel.setAttribute('font-weight', 'bold');
  configLabel.setAttribute('fill', COLORS[stereocenter.config]);
  configLabel.textContent = stereocenter.config;
  g.appendChild(configLabel);

  const subs = stereocenter.substituents;

  // Top substituent (wedge - coming out)
  const wedge = document.createElementNS(NS, 'polygon');
  const wedgePoints = `0,-15 -8,-${bondLength} 8,-${bondLength}`;
  wedge.setAttribute('points', wedgePoints);
  wedge.setAttribute('fill', COLORS.wedge);
  g.appendChild(wedge);

  const topLabel = document.createElementNS(NS, 'text');
  topLabel.setAttribute('x', '0');
  topLabel.setAttribute('y', -bondLength - 5);
  topLabel.setAttribute('text-anchor', 'middle');
  topLabel.setAttribute('font-size', '12');
  topLabel.setAttribute('fill', COLORS.carbon);
  topLabel.textContent = subs[0] || 'R₁';
  g.appendChild(topLabel);

  // Bottom substituent (dashed - going back)
  const dashGroup = document.createElementNS(NS, 'g');
  for (let i = 0; i < 7; i++) {
    const dash = document.createElementNS(NS, 'line');
    const y = 15 + (i * 5);
    const width = 3 + (i * 0.8);
    dash.setAttribute('x1', -width);
    dash.setAttribute('y1', y);
    dash.setAttribute('x2', width);
    dash.setAttribute('y2', y);
    dash.setAttribute('stroke', COLORS.dash);
    dash.setAttribute('stroke-width', '2');
    dashGroup.appendChild(dash);
  }
  g.appendChild(dashGroup);

  const bottomLabel = document.createElementNS(NS, 'text');
  bottomLabel.setAttribute('x', '0');
  bottomLabel.setAttribute('y', bondLength + 15);
  bottomLabel.setAttribute('text-anchor', 'middle');
  bottomLabel.setAttribute('font-size', '12');
  bottomLabel.setAttribute('fill', COLORS.carbon);
  bottomLabel.textContent = subs[3] || 'R₄';
  g.appendChild(bottomLabel);

  // Left substituent (in plane)
  const leftBond = document.createElementNS(NS, 'line');
  leftBond.setAttribute('x1', '-12');
  leftBond.setAttribute('y1', '0');
  leftBond.setAttribute('x2', -bondLength);
  leftBond.setAttribute('y2', '0');
  leftBond.setAttribute('stroke', COLORS.bond);
  leftBond.setAttribute('stroke-width', '2');
  g.appendChild(leftBond);

  const leftLabel = document.createElementNS(NS, 'text');
  leftLabel.setAttribute('x', -bondLength - 10);
  leftLabel.setAttribute('y', '5');
  leftLabel.setAttribute('text-anchor', 'end');
  leftLabel.setAttribute('font-size', '12');
  leftLabel.setAttribute('fill', COLORS.carbon);
  leftLabel.textContent = subs[1] || 'R₂';
  g.appendChild(leftLabel);

  // Right substituent (in plane)
  const rightBond = document.createElementNS(NS, 'line');
  rightBond.setAttribute('x1', '12');
  rightBond.setAttribute('y1', '0');
  rightBond.setAttribute('x2', bondLength);
  rightBond.setAttribute('y2', '0');
  rightBond.setAttribute('stroke', COLORS.bond);
  rightBond.setAttribute('stroke-width', '2');
  g.appendChild(rightBond);

  const rightLabel = document.createElementNS(NS, 'text');
  rightLabel.setAttribute('x', bondLength + 10);
  rightLabel.setAttribute('y', '5');
  rightLabel.setAttribute('text-anchor', 'start');
  rightLabel.setAttribute('font-size', '12');
  rightLabel.setAttribute('fill', COLORS.carbon);
  rightLabel.textContent = subs[2] || 'R₃';
  g.appendChild(rightLabel);

  svg.appendChild(g);
}

/**
 * Render SN2 mechanism diagram showing inversion
 * @param {SVGElement} svg - Target SVG
 * @param {string} startConfig - Starting configuration (R or S)
 */
export function renderSN2Mechanism(svg, startConfig = 'R') {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';
  const endConfig = startConfig === 'R' ? 'S' : 'R';

  // Title
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '25');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'stereo-title');
  title.textContent = 'SN2: Walden Inversion';
  svg.appendChild(title);

  // Starting material
  const startLabel = document.createElementNS(NS, 'text');
  startLabel.setAttribute('x', '80');
  startLabel.setAttribute('y', '60');
  startLabel.setAttribute('text-anchor', 'middle');
  startLabel.setAttribute('font-size', '12');
  startLabel.setAttribute('fill', COLORS.carbon);
  startLabel.textContent = `Starting: (${startConfig})`;
  svg.appendChild(startLabel);

  renderWedgeDash(svg, {
    config: startConfig,
    substituents: ['R₁', 'R₂', 'LG', 'H']
  }, 80, 140);

  // Arrow
  const arrow = document.createElementNS(NS, 'path');
  arrow.setAttribute('d', 'M 140 140 L 180 140');
  arrow.setAttribute('stroke', COLORS.arrow);
  arrow.setAttribute('stroke-width', '3');
  arrow.setAttribute('marker-end', 'url(#arrowhead-green)');
  svg.appendChild(arrow);

  // Nucleophile
  const nucLabel = document.createElementNS(NS, 'text');
  nucLabel.setAttribute('x', '160');
  nucLabel.setAttribute('y', '115');
  nucLabel.setAttribute('text-anchor', 'middle');
  nucLabel.setAttribute('font-size', '11');
  nucLabel.setAttribute('fill', COLORS.nucleophile);
  nucLabel.textContent = 'Nu⁻';
  svg.appendChild(nucLabel);

  // Transition state
  const tsLabel = document.createElementNS(NS, 'text');
  tsLabel.setAttribute('x', '200');
  tsLabel.setAttribute('y', '60');
  tsLabel.setAttribute('text-anchor', 'middle');
  tsLabel.setAttribute('font-size', '12');
  tsLabel.setAttribute('fill', COLORS.carbon);
  tsLabel.textContent = 'Transition State';
  svg.appendChild(tsLabel);

  // Draw transition state (simplified)
  const tsGroup = document.createElementNS(NS, 'g');
  tsGroup.setAttribute('transform', 'translate(200, 140)');

  // Dashed bonds showing partial bonding
  const nuDash = document.createElementNS(NS, 'line');
  nuDash.setAttribute('x1', '-45');
  nuDash.setAttribute('y1', '0');
  nuDash.setAttribute('x2', '-12');
  nuDash.setAttribute('y2', '0');
  nuDash.setAttribute('stroke', COLORS.nucleophile);
  nuDash.setAttribute('stroke-width', '2');
  nuDash.setAttribute('stroke-dasharray', '4,2');
  tsGroup.appendChild(nuDash);

  const lgDash = document.createElementNS(NS, 'line');
  lgDash.setAttribute('x1', '12');
  lgDash.setAttribute('y1', '0');
  lgDash.setAttribute('x2', '45');
  lgDash.setAttribute('y2', '0');
  lgDash.setAttribute('stroke', '#dc2626');
  lgDash.setAttribute('stroke-width', '2');
  lgDash.setAttribute('stroke-dasharray', '4,2');
  tsGroup.appendChild(lgDash);

  // Central carbon (planar in TS)
  const tsCarbon = document.createElementNS(NS, 'circle');
  tsCarbon.setAttribute('cx', '0');
  tsCarbon.setAttribute('cy', '0');
  tsCarbon.setAttribute('r', '10');
  tsCarbon.setAttribute('fill', 'white');
  tsCarbon.setAttribute('stroke', '#94a3b8');
  tsCarbon.setAttribute('stroke-width', '2');
  tsGroup.appendChild(tsCarbon);

  const tsC = document.createElementNS(NS, 'text');
  tsC.setAttribute('x', '0');
  tsC.setAttribute('y', '4');
  tsC.setAttribute('text-anchor', 'middle');
  tsC.setAttribute('font-size', '10');
  tsC.textContent = 'C';
  tsGroup.appendChild(tsC);

  // Nu label
  const nuLabel2 = document.createElementNS(NS, 'text');
  nuLabel2.setAttribute('x', '-55');
  nuLabel2.setAttribute('y', '5');
  nuLabel2.setAttribute('font-size', '10');
  nuLabel2.setAttribute('fill', COLORS.nucleophile);
  nuLabel2.textContent = 'Nu';
  tsGroup.appendChild(nuLabel2);

  // LG label
  const lgLabel = document.createElementNS(NS, 'text');
  lgLabel.setAttribute('x', '50');
  lgLabel.setAttribute('y', '5');
  lgLabel.setAttribute('font-size', '10');
  lgLabel.setAttribute('fill', '#dc2626');
  lgLabel.textContent = 'LG';
  tsGroup.appendChild(lgLabel);

  // Brackets for TS
  const bracket1 = document.createElementNS(NS, 'text');
  bracket1.setAttribute('x', '-65');
  bracket1.setAttribute('y', '5');
  bracket1.setAttribute('font-size', '24');
  bracket1.textContent = '[';
  tsGroup.appendChild(bracket1);

  const bracket2 = document.createElementNS(NS, 'text');
  bracket2.setAttribute('x', '58');
  bracket2.setAttribute('y', '5');
  bracket2.setAttribute('font-size', '24');
  bracket2.textContent = ']‡';
  tsGroup.appendChild(bracket2);

  svg.appendChild(tsGroup);

  // Arrow to product
  const arrow2 = document.createElementNS(NS, 'path');
  arrow2.setAttribute('d', 'M 260 140 L 300 140');
  arrow2.setAttribute('stroke', COLORS.arrow);
  arrow2.setAttribute('stroke-width', '3');
  arrow2.setAttribute('marker-end', 'url(#arrowhead-green)');
  svg.appendChild(arrow2);

  // Product
  const prodLabel = document.createElementNS(NS, 'text');
  prodLabel.setAttribute('x', '320');
  prodLabel.setAttribute('y', '60');
  prodLabel.setAttribute('text-anchor', 'middle');
  prodLabel.setAttribute('font-size', '12');
  prodLabel.setAttribute('fill', COLORS.carbon);
  prodLabel.textContent = `Product: (${endConfig})`;
  svg.appendChild(prodLabel);

  renderWedgeDash(svg, {
    config: endConfig,
    substituents: ['R₁', 'Nu', 'R₂', 'H']
  }, 320, 140);

  // Add legend/explanation
  const explanationBox = document.createElementNS(NS, 'rect');
  explanationBox.setAttribute('x', '30');
  explanationBox.setAttribute('y', '240');
  explanationBox.setAttribute('width', '340');
  explanationBox.setAttribute('height', '100');
  explanationBox.setAttribute('rx', '8');
  explanationBox.setAttribute('fill', '#f1f5f9');
  explanationBox.setAttribute('stroke', '#e2e8f0');
  svg.appendChild(explanationBox);

  const expLines = [
    'SN2 Key Points:',
    '• Nucleophile attacks from backside (180° from LG)',
    '• Single concerted step - no intermediate',
    `• Complete inversion: (${startConfig}) → (${endConfig})`,
    '• Called "Walden inversion"'
  ];

  expLines.forEach((line, i) => {
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', '45');
    text.setAttribute('y', 258 + (i * 18));
    text.setAttribute('font-size', i === 0 ? '12' : '11');
    text.setAttribute('font-weight', i === 0 ? '600' : '400');
    text.setAttribute('fill', '#334155');
    text.textContent = line;
    svg.appendChild(text);
  });

  // Add marker definition
  addArrowMarker(svg, 'arrowhead-green', COLORS.arrow);
}

/**
 * Render SN1 mechanism diagram showing racemization
 * @param {SVGElement} svg - Target SVG
 * @param {string} startConfig - Starting configuration (R or S)
 */
export function renderSN1Mechanism(svg, startConfig = 'R') {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';

  // Title
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '25');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'stereo-title');
  title.textContent = 'SN1: Racemization';
  svg.appendChild(title);

  // Starting material label
  const startLabel = document.createElementNS(NS, 'text');
  startLabel.setAttribute('x', '60');
  startLabel.setAttribute('y', '55');
  startLabel.setAttribute('text-anchor', 'middle');
  startLabel.setAttribute('font-size', '11');
  startLabel.setAttribute('fill', COLORS.carbon);
  startLabel.textContent = `(${startConfig})-substrate`;
  svg.appendChild(startLabel);

  // Simplified starting structure
  renderWedgeDash(svg, {
    config: startConfig,
    substituents: ['R₁', 'R₂', 'LG', 'H']
  }, 60, 120);

  // Arrow to carbocation
  const arrow1 = document.createElementNS(NS, 'path');
  arrow1.setAttribute('d', 'M 115 120 L 145 120');
  arrow1.setAttribute('stroke', COLORS.arrow);
  arrow1.setAttribute('stroke-width', '2');
  arrow1.setAttribute('marker-end', 'url(#arrowhead-green)');
  svg.appendChild(arrow1);

  // LG leaving label
  const lgLabel = document.createElementNS(NS, 'text');
  lgLabel.setAttribute('x', '130');
  lgLabel.setAttribute('y', '100');
  lgLabel.setAttribute('font-size', '9');
  lgLabel.setAttribute('fill', '#dc2626');
  lgLabel.textContent = '-LG⁻';
  svg.appendChild(lgLabel);

  // Carbocation (planar)
  const carbocatGroup = document.createElementNS(NS, 'g');
  carbocatGroup.setAttribute('transform', 'translate(190, 120)');

  // Planar carbocation
  const catCenter = document.createElementNS(NS, 'circle');
  catCenter.setAttribute('cx', '0');
  catCenter.setAttribute('cy', '0');
  catCenter.setAttribute('r', '10');
  catCenter.setAttribute('fill', '#fef3c7');
  catCenter.setAttribute('stroke', '#f59e0b');
  catCenter.setAttribute('stroke-width', '2');
  carbocatGroup.appendChild(catCenter);

  const catLabel = document.createElementNS(NS, 'text');
  catLabel.setAttribute('x', '0');
  catLabel.setAttribute('y', '4');
  catLabel.setAttribute('text-anchor', 'middle');
  catLabel.setAttribute('font-size', '9');
  catLabel.setAttribute('fill', '#92400e');
  catLabel.textContent = 'C⁺';
  carbocatGroup.appendChild(catLabel);

  // Draw sp2 planar geometry
  const angles = [-90, 150, 30];
  const labels = ['R₁', 'R₂', 'H'];
  angles.forEach((angle, i) => {
    const rad = angle * Math.PI / 180;
    const x2 = Math.cos(rad) * 35;
    const y2 = Math.sin(rad) * 35;

    const bond = document.createElementNS(NS, 'line');
    bond.setAttribute('x1', Math.cos(rad) * 10);
    bond.setAttribute('y1', Math.sin(rad) * 10);
    bond.setAttribute('x2', x2);
    bond.setAttribute('y2', y2);
    bond.setAttribute('stroke', COLORS.bond);
    bond.setAttribute('stroke-width', '2');
    carbocatGroup.appendChild(bond);

    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', Math.cos(rad) * 45);
    label.setAttribute('y', Math.sin(rad) * 45 + 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '10');
    label.textContent = labels[i];
    carbocatGroup.appendChild(label);
  });

  svg.appendChild(carbocatGroup);

  // Carbocation label
  const catTitle = document.createElementNS(NS, 'text');
  catTitle.setAttribute('x', '190');
  catTitle.setAttribute('y', '55');
  catTitle.setAttribute('text-anchor', 'middle');
  catTitle.setAttribute('font-size', '11');
  catTitle.setAttribute('fill', '#f59e0b');
  catTitle.textContent = 'Planar C⁺';
  svg.appendChild(catTitle);

  // Arrows to both products (showing attack from both faces)
  // Top arrow
  const arrow2a = document.createElementNS(NS, 'path');
  arrow2a.setAttribute('d', 'M 225 100 Q 260 80 290 95');
  arrow2a.setAttribute('stroke', COLORS.nucleophile);
  arrow2a.setAttribute('stroke-width', '2');
  arrow2a.setAttribute('fill', 'none');
  arrow2a.setAttribute('marker-end', 'url(#arrowhead-nu)');
  svg.appendChild(arrow2a);

  // Bottom arrow
  const arrow2b = document.createElementNS(NS, 'path');
  arrow2b.setAttribute('d', 'M 225 140 Q 260 160 290 145');
  arrow2b.setAttribute('stroke', COLORS.nucleophile);
  arrow2b.setAttribute('stroke-width', '2');
  arrow2b.setAttribute('fill', 'none');
  arrow2b.setAttribute('marker-end', 'url(#arrowhead-nu)');
  svg.appendChild(arrow2b);

  // Nu labels
  const nuTop = document.createElementNS(NS, 'text');
  nuTop.setAttribute('x', '260');
  nuTop.setAttribute('y', '75');
  nuTop.setAttribute('font-size', '9');
  nuTop.setAttribute('fill', COLORS.nucleophile);
  nuTop.textContent = 'Nu⁻';
  svg.appendChild(nuTop);

  const nuBot = document.createElementNS(NS, 'text');
  nuBot.setAttribute('x', '260');
  nuBot.setAttribute('y', '175');
  nuBot.setAttribute('font-size', '9');
  nuBot.setAttribute('fill', COLORS.nucleophile);
  nuBot.textContent = 'Nu⁻';
  svg.appendChild(nuBot);

  // Products (R and S)
  const prod1Label = document.createElementNS(NS, 'text');
  prod1Label.setAttribute('x', '340');
  prod1Label.setAttribute('y', '55');
  prod1Label.setAttribute('text-anchor', 'middle');
  prod1Label.setAttribute('font-size', '11');
  prod1Label.setAttribute('fill', COLORS.R);
  prod1Label.textContent = '(R) 50%';
  svg.appendChild(prod1Label);

  renderWedgeDash(svg, {
    config: 'R',
    substituents: ['R₁', 'R₂', 'Nu', 'H']
  }, 340, 95);

  const prod2Label = document.createElementNS(NS, 'text');
  prod2Label.setAttribute('x', '340');
  prod2Label.setAttribute('y', '205');
  prod2Label.setAttribute('text-anchor', 'middle');
  prod2Label.setAttribute('font-size', '11');
  prod2Label.setAttribute('fill', COLORS.S);
  prod2Label.textContent = '(S) 50%';
  svg.appendChild(prod2Label);

  renderWedgeDash(svg, {
    config: 'S',
    substituents: ['R₁', 'Nu', 'R₂', 'H']
  }, 340, 245);

  // Explanation box
  const explanationBox = document.createElementNS(NS, 'rect');
  explanationBox.setAttribute('x', '10');
  explanationBox.setAttribute('y', '295');
  explanationBox.setAttribute('width', '380');
  explanationBox.setAttribute('height', '50');
  explanationBox.setAttribute('rx', '6');
  explanationBox.setAttribute('fill', '#f1f5f9');
  explanationBox.setAttribute('stroke', '#e2e8f0');
  svg.appendChild(explanationBox);

  const expText = document.createElementNS(NS, 'text');
  expText.setAttribute('x', '200');
  expText.setAttribute('y', '315');
  expText.setAttribute('text-anchor', 'middle');
  expText.setAttribute('font-size', '10');
  expText.setAttribute('fill', '#334155');
  expText.textContent = 'Planar carbocation allows attack from either face → Racemization';
  svg.appendChild(expText);

  const expText2 = document.createElementNS(NS, 'text');
  expText2.setAttribute('x', '200');
  expText2.setAttribute('y', '332');
  expText2.setAttribute('text-anchor', 'middle');
  expText2.setAttribute('font-size', '10');
  expText2.setAttribute('fill', '#334155');
  expText2.textContent = 'Result: 50% (R) + 50% (S) = Racemic mixture (not optically active)';
  svg.appendChild(expText2);

  // Add marker definitions
  addArrowMarker(svg, 'arrowhead-green', COLORS.arrow);
  addArrowMarker(svg, 'arrowhead-nu', COLORS.nucleophile);
}

/**
 * Render stereoisomer relationship diagram
 * @param {SVGElement} svg - Target SVG
 * @param {string} relationship - 'enantiomers', 'diastereomers', 'meso'
 */
export function renderRelationshipDiagram(svg, relationship = 'enantiomers') {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';

  if (relationship === 'enantiomers') {
    // Title
    const title = document.createElementNS(NS, 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('class', 'stereo-title');
    title.textContent = 'Enantiomers: Mirror Images';
    svg.appendChild(title);

    // Mirror line
    const mirror = document.createElementNS(NS, 'line');
    mirror.setAttribute('x1', '200');
    mirror.setAttribute('y1', '50');
    mirror.setAttribute('x2', '200');
    mirror.setAttribute('y2', '250');
    mirror.setAttribute('stroke', '#94a3b8');
    mirror.setAttribute('stroke-width', '2');
    mirror.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(mirror);

    const mirrorLabel = document.createElementNS(NS, 'text');
    mirrorLabel.setAttribute('x', '200');
    mirrorLabel.setAttribute('y', '270');
    mirrorLabel.setAttribute('text-anchor', 'middle');
    mirrorLabel.setAttribute('font-size', '11');
    mirrorLabel.setAttribute('fill', '#64748b');
    mirrorLabel.textContent = 'Mirror plane';
    svg.appendChild(mirrorLabel);

    // R enantiomer
    const rLabel = document.createElementNS(NS, 'text');
    rLabel.setAttribute('x', '100');
    rLabel.setAttribute('y', '60');
    rLabel.setAttribute('text-anchor', 'middle');
    rLabel.setAttribute('font-size', '13');
    rLabel.setAttribute('font-weight', '600');
    rLabel.setAttribute('fill', COLORS.R);
    rLabel.textContent = '(R)-Enantiomer';
    svg.appendChild(rLabel);

    renderWedgeDash(svg, {
      config: 'R',
      substituents: ['A', 'B', 'C', 'D']
    }, 100, 150);

    // S enantiomer (mirror image)
    const sLabel = document.createElementNS(NS, 'text');
    sLabel.setAttribute('x', '300');
    sLabel.setAttribute('y', '60');
    sLabel.setAttribute('text-anchor', 'middle');
    sLabel.setAttribute('font-size', '13');
    sLabel.setAttribute('font-weight', '600');
    sLabel.setAttribute('fill', COLORS.S);
    sLabel.textContent = '(S)-Enantiomer';
    svg.appendChild(sLabel);

    renderWedgeDash(svg, {
      config: 'S',
      substituents: ['A', 'C', 'B', 'D']
    }, 300, 150);

    // Properties
    const props = [
      'Properties of Enantiomers:',
      '• Non-superimposable mirror images',
      '• Opposite R/S configuration',
      '• Same physical properties (mp, bp)',
      '• Opposite optical rotation (+/−)',
      '• Same reactivity (except with chiral reagents)'
    ];

    props.forEach((text, i) => {
      const label = document.createElementNS(NS, 'text');
      label.setAttribute('x', '200');
      label.setAttribute('y', 290 + i * 14);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-weight', i === 0 ? '600' : '400');
      label.setAttribute('fill', '#334155');
      label.textContent = text;
      svg.appendChild(label);
    });

  } else if (relationship === 'diastereomers') {
    // Title
    const title = document.createElementNS(NS, 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('class', 'stereo-title');
    title.textContent = 'Diastereomers: Not Mirror Images';
    svg.appendChild(title);

    // Labels
    const label1 = document.createElementNS(NS, 'text');
    label1.setAttribute('x', '100');
    label1.setAttribute('y', '55');
    label1.setAttribute('text-anchor', 'middle');
    label1.setAttribute('font-size', '12');
    label1.setAttribute('fill', '#334155');
    label1.textContent = '(R,R)';
    svg.appendChild(label1);

    const label2 = document.createElementNS(NS, 'text');
    label2.setAttribute('x', '300');
    label2.setAttribute('y', '55');
    label2.setAttribute('text-anchor', 'middle');
    label2.setAttribute('font-size', '12');
    label2.setAttribute('fill', '#334155');
    label2.textContent = '(R,S) / meso';
    svg.appendChild(label2);

    // Simplified representation of two stereocenters
    renderWedgeDash(svg, { config: 'R', substituents: ['OH', 'COOH', 'C*', 'H'] }, 100, 130);
    renderWedgeDash(svg, { config: 'R', substituents: ['OH', 'C*', 'COOH', 'H'] }, 100, 230);

    renderWedgeDash(svg, { config: 'R', substituents: ['OH', 'COOH', 'C*', 'H'] }, 300, 130);
    renderWedgeDash(svg, { config: 'S', substituents: ['OH', 'C*', 'COOH', 'H'] }, 300, 230);

    // Properties
    const props = [
      'Properties of Diastereomers:',
      '• NOT mirror images of each other',
      '• Different physical properties',
      '• Different reactivity'
    ];

    props.forEach((text, i) => {
      const label = document.createElementNS(NS, 'text');
      label.setAttribute('x', '200');
      label.setAttribute('y', 300 + i * 14);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-weight', i === 0 ? '600' : '400');
      label.setAttribute('fill', '#334155');
      label.textContent = text;
      svg.appendChild(label);
    });
  }
}

/**
 * Add arrow marker definition to SVG
 */
function addArrowMarker(svg, id, color) {
  const NS = 'http://www.w3.org/2000/svg';

  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(NS, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }

  const marker = document.createElementNS(NS, 'marker');
  marker.setAttribute('id', id);
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');

  const polygon = document.createElementNS(NS, 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', color);
  marker.appendChild(polygon);

  defs.appendChild(marker);
}
