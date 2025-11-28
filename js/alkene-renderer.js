/**
 * Alkene Stability Renderer
 *
 * SVG rendering for alkene stability comparisons and energy diagrams
 */

import { HYDROGENATION_DATA, getStabilityRanking, getStabilityExplanation } from './alkene-stability.js';

// Colors for different substitution levels
const SUBSTITUTION_COLORS = {
  'unsubstituted': '#ef4444',     // Red - least stable
  'monosubstituted': '#f97316',    // Orange
  'disubstituted': '#eab308',      // Yellow
  'trisubstituted': '#22c55e',     // Green
  'tetrasubstituted': '#3b82f6'    // Blue - most stable
};

const CURVE_COLORS = ['#2563eb', '#dc2626', '#059669', '#f59e0b', '#8b5cf6'];

/**
 * Render the alkene stability comparison view
 * @param {SVGElement} svg - Target SVG element
 * @param {string[]} alkeneKeys - Array of alkene keys to compare
 * @param {Object} options - Rendering options
 */
export function renderAlkeneComparison(svg, alkeneKeys, options = {}) {
  const {
    showStructures = true,
    showEnergies = true,
    highlightMostStable = true
  } = options;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';

  // Get alkene data and sort by stability
  const alkenes = alkeneKeys
    .filter(key => HYDROGENATION_DATA[key])
    .map((key, index) => ({
      key,
      index,
      color: CURVE_COLORS[index % CURVE_COLORS.length],
      ...HYDROGENATION_DATA[key]
    }));

  if (alkenes.length === 0) {
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '175');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'empty-message');
    text.textContent = 'Select alkenes to compare';
    svg.appendChild(text);
    return;
  }

  // Find energy range for scaling
  const minDeltaH = Math.min(...alkenes.map(a => a.deltaH));
  const maxDeltaH = Math.max(...alkenes.map(a => a.deltaH));
  const range = Math.abs(maxDeltaH - minDeltaH) || 5;

  // Draw title
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '25');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'alkene-title');
  title.textContent = 'Heats of Hydrogenation Comparison';
  svg.appendChild(title);

  // Draw Y-axis
  drawYAxis(svg, NS, minDeltaH, maxDeltaH);

  // Draw bar chart for each alkene
  const chartLeft = 80;
  const chartWidth = 280;
  const chartTop = 60;
  const chartHeight = 200;
  const barWidth = Math.min(50, (chartWidth - 20) / alkenes.length - 10);

  // Sort by deltaH for display (most negative = tallest bar)
  const sortedAlkenes = [...alkenes].sort((a, b) => a.deltaH - b.deltaH);
  const mostStableKey = sortedAlkenes[sortedAlkenes.length - 1].key;

  alkenes.forEach((alkene, i) => {
    const x = chartLeft + (i * (chartWidth / alkenes.length)) + (chartWidth / alkenes.length / 2) - barWidth / 2;

    // Calculate bar height (more negative = taller)
    const normalizedHeight = (Math.abs(alkene.deltaH) - Math.abs(maxDeltaH)) / range;
    const barHeight = 20 + normalizedHeight * (chartHeight - 40);

    // Draw bar
    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('x', x);
    bar.setAttribute('y', chartTop + chartHeight - barHeight);
    bar.setAttribute('width', barWidth);
    bar.setAttribute('height', barHeight);
    bar.setAttribute('class', 'alkene-bar');
    bar.setAttribute('fill', alkene.color);
    bar.setAttribute('rx', '3');

    if (highlightMostStable && alkene.key === mostStableKey) {
      bar.setAttribute('stroke', '#16a34a');
      bar.setAttribute('stroke-width', '3');
    }

    svg.appendChild(bar);

    // Draw value label
    const valueLabel = document.createElementNS(NS, 'text');
    valueLabel.setAttribute('x', x + barWidth / 2);
    valueLabel.setAttribute('y', chartTop + chartHeight - barHeight - 5);
    valueLabel.setAttribute('text-anchor', 'middle');
    valueLabel.setAttribute('class', 'alkene-value');
    valueLabel.textContent = alkene.deltaH.toFixed(1);
    svg.appendChild(valueLabel);

    // Draw name label (rotated for better fit)
    const nameLabel = document.createElementNS(NS, 'text');
    nameLabel.setAttribute('x', x + barWidth / 2);
    nameLabel.setAttribute('y', chartTop + chartHeight + 15);
    nameLabel.setAttribute('text-anchor', 'middle');
    nameLabel.setAttribute('class', 'alkene-name');

    // Truncate long names
    const displayName = alkene.name.length > 12
      ? alkene.name.substring(0, 11) + '...'
      : alkene.name;
    nameLabel.textContent = displayName;
    svg.appendChild(nameLabel);

    // Draw substitution indicator
    const subIndicator = document.createElementNS(NS, 'circle');
    subIndicator.setAttribute('cx', x + barWidth / 2);
    subIndicator.setAttribute('cy', chartTop + chartHeight + 32);
    subIndicator.setAttribute('r', '6');
    subIndicator.setAttribute('fill', SUBSTITUTION_COLORS[alkene.substitution.replace(' (cyclic)', '')] || '#94a3b8');
    svg.appendChild(subIndicator);
  });

  // Draw baseline
  const baseline = document.createElementNS(NS, 'line');
  baseline.setAttribute('x1', chartLeft - 10);
  baseline.setAttribute('y1', chartTop + chartHeight);
  baseline.setAttribute('x2', chartLeft + chartWidth + 10);
  baseline.setAttribute('y2', chartTop + chartHeight);
  baseline.setAttribute('class', 'alkene-baseline');
  svg.appendChild(baseline);

  // Draw legend
  drawLegend(svg, NS);

  // Draw stability arrow
  const arrow = document.createElementNS(NS, 'g');
  arrow.setAttribute('transform', 'translate(370, 160)');

  const arrowLine = document.createElementNS(NS, 'line');
  arrowLine.setAttribute('x1', '0');
  arrowLine.setAttribute('y1', '-40');
  arrowLine.setAttribute('x2', '0');
  arrowLine.setAttribute('y2', '40');
  arrowLine.setAttribute('class', 'stability-arrow');
  arrow.appendChild(arrowLine);

  const arrowHead = document.createElementNS(NS, 'polygon');
  arrowHead.setAttribute('points', '-6,-40 6,-40 0,-50');
  arrowHead.setAttribute('class', 'stability-arrow-head');
  arrow.appendChild(arrowHead);

  const arrowLabel = document.createElementNS(NS, 'text');
  arrowLabel.setAttribute('x', '0');
  arrowLabel.setAttribute('y', '55');
  arrowLabel.setAttribute('text-anchor', 'middle');
  arrowLabel.setAttribute('class', 'stability-label');
  arrowLabel.textContent = 'More';
  arrow.appendChild(arrowLabel);

  const arrowLabel2 = document.createElementNS(NS, 'text');
  arrowLabel2.setAttribute('x', '0');
  arrowLabel2.setAttribute('y', '67');
  arrowLabel2.setAttribute('text-anchor', 'middle');
  arrowLabel2.setAttribute('class', 'stability-label');
  arrowLabel2.textContent = 'Stable';
  arrow.appendChild(arrowLabel2);

  svg.appendChild(arrow);
}

/**
 * Draw Y-axis with labels
 */
function drawYAxis(svg, NS, minDeltaH, maxDeltaH) {
  const chartTop = 60;
  const chartHeight = 200;

  // Y-axis line
  const yAxis = document.createElementNS(NS, 'line');
  yAxis.setAttribute('x1', '70');
  yAxis.setAttribute('y1', chartTop);
  yAxis.setAttribute('x2', '70');
  yAxis.setAttribute('y2', chartTop + chartHeight);
  yAxis.setAttribute('class', 'alkene-axis');
  svg.appendChild(yAxis);

  // Y-axis label
  const yLabel = document.createElementNS(NS, 'text');
  yLabel.setAttribute('x', '15');
  yLabel.setAttribute('y', chartTop + chartHeight / 2);
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('class', 'axis-label');
  yLabel.setAttribute('transform', `rotate(-90, 15, ${chartTop + chartHeight / 2})`);
  yLabel.textContent = 'ΔH (kcal/mol)';
  svg.appendChild(yLabel);

  // Tick marks
  const range = Math.abs(maxDeltaH - minDeltaH) || 5;
  const numTicks = 5;
  const step = range / (numTicks - 1);

  for (let i = 0; i < numTicks; i++) {
    const value = maxDeltaH - (i * step);
    const y = chartTop + (i / (numTicks - 1)) * chartHeight;

    // Tick line
    const tick = document.createElementNS(NS, 'line');
    tick.setAttribute('x1', '65');
    tick.setAttribute('y1', y);
    tick.setAttribute('x2', '70');
    tick.setAttribute('y2', y);
    tick.setAttribute('class', 'alkene-tick');
    svg.appendChild(tick);

    // Tick label
    const tickLabel = document.createElementNS(NS, 'text');
    tickLabel.setAttribute('x', '60');
    tickLabel.setAttribute('y', y + 4);
    tickLabel.setAttribute('text-anchor', 'end');
    tickLabel.setAttribute('class', 'tick-label');
    tickLabel.textContent = value.toFixed(1);
    svg.appendChild(tickLabel);
  }
}

/**
 * Draw substitution pattern legend
 */
function drawLegend(svg, NS) {
  const legendItems = [
    { label: 'Unsub', color: SUBSTITUTION_COLORS['unsubstituted'] },
    { label: 'Mono', color: SUBSTITUTION_COLORS['monosubstituted'] },
    { label: 'Di', color: SUBSTITUTION_COLORS['disubstituted'] },
    { label: 'Tri', color: SUBSTITUTION_COLORS['trisubstituted'] },
    { label: 'Tetra', color: SUBSTITUTION_COLORS['tetrasubstituted'] }
  ];

  const legendY = 320;
  const itemWidth = 65;
  const startX = 45;

  const legendTitle = document.createElementNS(NS, 'text');
  legendTitle.setAttribute('x', '200');
  legendTitle.setAttribute('y', legendY - 15);
  legendTitle.setAttribute('text-anchor', 'middle');
  legendTitle.setAttribute('class', 'legend-title');
  legendTitle.textContent = 'Substitution Pattern';
  svg.appendChild(legendTitle);

  legendItems.forEach((item, i) => {
    const x = startX + (i * itemWidth);

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', legendY);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', item.color);
    svg.appendChild(circle);

    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x + 10);
    label.setAttribute('y', legendY + 4);
    label.setAttribute('class', 'legend-label');
    label.textContent = item.label;
    svg.appendChild(label);
  });
}

/**
 * Render hydrogenation energy diagram showing reaction coordinate
 * @param {SVGElement} svg - Target SVG element
 * @param {string[]} alkeneKeys - Alkenes to show
 */
export function renderHydrogenationDiagram(svg, alkeneKeys) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';

  const alkenes = alkeneKeys
    .filter(key => HYDROGENATION_DATA[key])
    .map((key, index) => ({
      key,
      color: CURVE_COLORS[index % CURVE_COLORS.length],
      ...HYDROGENATION_DATA[key]
    }));

  if (alkenes.length === 0) return;

  // Title
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '25');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'alkene-title');
  title.textContent = 'Hydrogenation Energy Diagram';
  svg.appendChild(title);

  // Chart dimensions
  const chartLeft = 60;
  const chartRight = 360;
  const chartTop = 50;
  const chartBottom = 280;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;

  // Find energy range (product is always alkane at 0, reactants vary)
  const minDeltaH = Math.min(...alkenes.map(a => a.deltaH));
  const maxDeltaH = 0; // Product level

  // Draw axes
  const yAxis = document.createElementNS(NS, 'line');
  yAxis.setAttribute('x1', chartLeft);
  yAxis.setAttribute('y1', chartTop);
  yAxis.setAttribute('x2', chartLeft);
  yAxis.setAttribute('y2', chartBottom);
  yAxis.setAttribute('class', 'alkene-axis');
  svg.appendChild(yAxis);

  const xAxis = document.createElementNS(NS, 'line');
  xAxis.setAttribute('x1', chartLeft);
  xAxis.setAttribute('y1', chartBottom);
  xAxis.setAttribute('x2', chartRight);
  xAxis.setAttribute('y2', chartBottom);
  xAxis.setAttribute('class', 'alkene-axis');
  svg.appendChild(xAxis);

  // Y-axis label
  const yLabel = document.createElementNS(NS, 'text');
  yLabel.setAttribute('x', '15');
  yLabel.setAttribute('y', (chartTop + chartBottom) / 2);
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('class', 'axis-label');
  yLabel.setAttribute('transform', `rotate(-90, 15, ${(chartTop + chartBottom) / 2})`);
  yLabel.textContent = 'Energy';
  svg.appendChild(yLabel);

  // X-axis label
  const xLabel = document.createElementNS(NS, 'text');
  xLabel.setAttribute('x', (chartLeft + chartRight) / 2);
  xLabel.setAttribute('y', chartBottom + 35);
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('class', 'axis-label');
  xLabel.textContent = 'Reaction Coordinate';
  svg.appendChild(xLabel);

  // Scale for energy
  const energyRange = Math.abs(minDeltaH) + 5;
  const scaleY = (energy) => {
    const normalized = (energy - minDeltaH + 5) / energyRange;
    return chartBottom - (normalized * chartHeight);
  };

  // Product level (all go to same alkane)
  const productY = scaleY(0);
  const productLine = document.createElementNS(NS, 'line');
  productLine.setAttribute('x1', chartRight - 60);
  productLine.setAttribute('y1', productY);
  productLine.setAttribute('x2', chartRight - 10);
  productLine.setAttribute('y2', productY);
  productLine.setAttribute('class', 'energy-level');
  productLine.setAttribute('stroke-width', '3');
  svg.appendChild(productLine);

  const productLabel = document.createElementNS(NS, 'text');
  productLabel.setAttribute('x', chartRight - 35);
  productLabel.setAttribute('y', productY - 8);
  productLabel.setAttribute('text-anchor', 'middle');
  productLabel.setAttribute('class', 'energy-label');
  productLabel.textContent = 'Alkane';
  svg.appendChild(productLabel);

  // Draw each alkene's energy curve
  alkenes.forEach((alkene, i) => {
    const startY = scaleY(Math.abs(alkene.deltaH));

    // Reactant level
    const reactantX = chartLeft + 30;
    const reactantLine = document.createElementNS(NS, 'line');
    reactantLine.setAttribute('x1', reactantX - 20);
    reactantLine.setAttribute('y1', startY);
    reactantLine.setAttribute('x2', reactantX + 20);
    reactantLine.setAttribute('y2', startY);
    reactantLine.setAttribute('stroke', alkene.color);
    reactantLine.setAttribute('stroke-width', '3');
    svg.appendChild(reactantLine);

    // Curve to product (simplified - direct line with curve)
    const curve = document.createElementNS(NS, 'path');
    const midX = (reactantX + chartRight - 35) / 2;
    const tsY = startY - 30; // Transition state above reactant
    const d = `M ${reactantX + 20} ${startY}
               Q ${midX} ${tsY} ${chartRight - 60} ${productY}`;
    curve.setAttribute('d', d);
    curve.setAttribute('fill', 'none');
    curve.setAttribute('stroke', alkene.color);
    curve.setAttribute('stroke-width', '2');
    curve.setAttribute('stroke-dasharray', i > 0 ? '5,3' : 'none');
    svg.appendChild(curve);

    // ΔH arrow
    const arrowX = chartLeft + 50 + (i * 25);
    const arrow = document.createElementNS(NS, 'line');
    arrow.setAttribute('x1', arrowX);
    arrow.setAttribute('y1', startY);
    arrow.setAttribute('x2', arrowX);
    arrow.setAttribute('y2', productY);
    arrow.setAttribute('stroke', alkene.color);
    arrow.setAttribute('stroke-width', '1');
    arrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(arrow);

    // ΔH label
    const deltaLabel = document.createElementNS(NS, 'text');
    deltaLabel.setAttribute('x', arrowX + 5);
    deltaLabel.setAttribute('y', (startY + productY) / 2);
    deltaLabel.setAttribute('class', 'delta-h-label');
    deltaLabel.setAttribute('fill', alkene.color);
    deltaLabel.textContent = `${alkene.deltaH}`;
    svg.appendChild(deltaLabel);
  });

  // Add arrowhead marker
  const defs = document.createElementNS(NS, 'defs');
  const marker = document.createElementNS(NS, 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  const polygon = document.createElementNS(NS, 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', '#64748b');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.insertBefore(defs, svg.firstChild);

  // Legend
  const legendY = 310;
  alkenes.forEach((alkene, i) => {
    const x = 70 + (i * 80);

    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', legendY);
    line.setAttribute('x2', x + 20);
    line.setAttribute('y2', legendY);
    line.setAttribute('stroke', alkene.color);
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x + 25);
    label.setAttribute('y', legendY + 4);
    label.setAttribute('class', 'legend-label');
    label.textContent = alkene.name.length > 10 ? alkene.name.substring(0, 9) + '...' : alkene.name;
    svg.appendChild(label);
  });
}

/**
 * Render a single alkene structure (simplified representation)
 * @param {SVGElement} svg - Target SVG element
 * @param {string} alkeneKey - Alkene to render
 */
export function renderAlkeneStructure(svg, alkeneKey) {
  const alkene = HYDROGENATION_DATA[alkeneKey];
  if (!alkene) return;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 400 350');

  const NS = 'http://www.w3.org/2000/svg';
  const centerX = 200;
  const centerY = 150;

  // Title
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', '200');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'alkene-title');
  title.textContent = alkene.name;
  svg.appendChild(title);

  // Formula
  const formula = document.createElementNS(NS, 'text');
  formula.setAttribute('x', '200');
  formula.setAttribute('y', '55');
  formula.setAttribute('text-anchor', 'middle');
  formula.setAttribute('class', 'alkene-formula');
  formula.textContent = alkene.formula;
  svg.appendChild(formula);

  // Draw simplified double bond representation
  const bondLength = 60;

  // First line of double bond
  const bond1 = document.createElementNS(NS, 'line');
  bond1.setAttribute('x1', centerX - bondLength / 2);
  bond1.setAttribute('y1', centerY - 4);
  bond1.setAttribute('x2', centerX + bondLength / 2);
  bond1.setAttribute('y2', centerY - 4);
  bond1.setAttribute('class', 'double-bond');
  svg.appendChild(bond1);

  // Second line of double bond
  const bond2 = document.createElementNS(NS, 'line');
  bond2.setAttribute('x1', centerX - bondLength / 2);
  bond2.setAttribute('y1', centerY + 4);
  bond2.setAttribute('x2', centerX + bondLength / 2);
  bond2.setAttribute('y2', centerY + 4);
  bond2.setAttribute('class', 'double-bond');
  svg.appendChild(bond2);

  // Carbon labels
  const c1 = document.createElementNS(NS, 'text');
  c1.setAttribute('x', centerX - bondLength / 2 - 15);
  c1.setAttribute('y', centerY + 5);
  c1.setAttribute('text-anchor', 'middle');
  c1.setAttribute('class', 'carbon-atom');
  c1.textContent = 'C';
  svg.appendChild(c1);

  const c2 = document.createElementNS(NS, 'text');
  c2.setAttribute('x', centerX + bondLength / 2 + 15);
  c2.setAttribute('y', centerY + 5);
  c2.setAttribute('text-anchor', 'middle');
  c2.setAttribute('class', 'carbon-atom');
  c2.textContent = 'C';
  svg.appendChild(c2);

  // Info panel
  const infoY = 220;

  // Substitution pattern
  const subLabel = document.createElementNS(NS, 'text');
  subLabel.setAttribute('x', '200');
  subLabel.setAttribute('y', infoY);
  subLabel.setAttribute('text-anchor', 'middle');
  subLabel.setAttribute('class', 'info-label');
  subLabel.textContent = `Substitution: ${alkene.substitution}`;
  svg.appendChild(subLabel);

  // Heat of hydrogenation
  const deltaHLabel = document.createElementNS(NS, 'text');
  deltaHLabel.setAttribute('x', '200');
  deltaHLabel.setAttribute('y', infoY + 25);
  deltaHLabel.setAttribute('text-anchor', 'middle');
  deltaHLabel.setAttribute('class', 'info-value');
  deltaHLabel.textContent = `ΔH = ${alkene.deltaH} kcal/mol`;
  svg.appendChild(deltaHLabel);

  // Stability indicator
  const stabilityColor = SUBSTITUTION_COLORS[alkene.substitution.replace(' (cyclic)', '')] || '#94a3b8';
  const stabilityRect = document.createElementNS(NS, 'rect');
  stabilityRect.setAttribute('x', '140');
  stabilityRect.setAttribute('y', infoY + 35);
  stabilityRect.setAttribute('width', '120');
  stabilityRect.setAttribute('height', '25');
  stabilityRect.setAttribute('rx', '5');
  stabilityRect.setAttribute('fill', stabilityColor);
  svg.appendChild(stabilityRect);

  const stabilityText = document.createElementNS(NS, 'text');
  stabilityText.setAttribute('x', '200');
  stabilityText.setAttribute('y', infoY + 52);
  stabilityText.setAttribute('text-anchor', 'middle');
  stabilityText.setAttribute('class', 'stability-text');
  stabilityText.textContent = getStabilityLabel(alkene.substituents);
  svg.appendChild(stabilityText);

  // E/Z indicator if applicable
  if (alkene.stereochemistry) {
    const stereoLabel = document.createElementNS(NS, 'text');
    stereoLabel.setAttribute('x', '200');
    stereoLabel.setAttribute('y', infoY + 85);
    stereoLabel.setAttribute('text-anchor', 'middle');
    stereoLabel.setAttribute('class', 'stereo-label');
    stereoLabel.textContent = `Stereochemistry: ${alkene.stereochemistry} (${alkene.stereochemistry === 'E' ? 'trans' : 'cis'})`;
    svg.appendChild(stereoLabel);
  }
}

function getStabilityLabel(substituents) {
  switch (substituents) {
    case 0: return 'Least Stable';
    case 1: return 'Low Stability';
    case 2: return 'Moderate Stability';
    case 3: return 'High Stability';
    case 4: return 'Most Stable';
    default: return 'Unknown';
  }
}
