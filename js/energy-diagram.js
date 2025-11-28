/**
 * Energy Diagram Renderer
 *
 * Draws reaction energy diagrams (energy vs reaction progress curves)
 * for common organic chemistry reaction types.
 */

// Reaction presets with typical energy values
export const REACTION_PRESETS = {
  sn2: {
    name: 'SN2 (concerted)',
    steps: 1,
    startE: 0,
    tsE: [15],
    intermediateE: [],
    productE: -5,
    description: 'Single transition state, backside attack'
  },
  sn1: {
    name: 'SN1 (2-step)',
    steps: 2,
    startE: 0,
    tsE: [20, 5],
    intermediateE: [12],
    productE: -5,
    description: 'Carbocation intermediate'
  },
  e2: {
    name: 'E2 (concerted)',
    steps: 1,
    startE: 0,
    tsE: [18],
    intermediateE: [],
    productE: 2,
    description: 'Single transition state, anti-periplanar'
  },
  e1: {
    name: 'E1 (2-step)',
    steps: 2,
    startE: 0,
    tsE: [22, 8],
    intermediateE: [14],
    productE: 2,
    description: 'Carbocation intermediate'
  },
  hydrogenation: {
    name: 'Hydrogenation',
    steps: 1,
    startE: 0,
    tsE: [12],
    intermediateE: [],
    productE: -30,
    description: 'Highly exothermic'
  },
  exothermic: {
    name: 'Exothermic (generic)',
    steps: 1,
    startE: 0,
    tsE: [15],
    intermediateE: [],
    productE: -10,
    description: 'Products lower in energy'
  },
  endothermic: {
    name: 'Endothermic (generic)',
    steps: 1,
    startE: 0,
    tsE: [25],
    intermediateE: [],
    productE: 10,
    description: 'Products higher in energy'
  }
};

// Curve colors for comparison mode
const CURVE_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
];

/**
 * Render energy diagram with the given curves
 * @param {SVGElement} svg - The SVG element to render to
 * @param {Array} curves - Array of curve configurations
 */
export function renderEnergyDiagram(svg, curves = []) {
  svg.innerHTML = '';
  const svgNS = 'http://www.w3.org/2000/svg';

  // Chart dimensions (within 400x350 viewBox)
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = 400 - margin.left - margin.right;
  const chartHeight = 350 - margin.top - margin.bottom;

  // Calculate energy scale based on all curves
  let minE = 0, maxE = 30;
  curves.forEach(curve => {
    const preset = REACTION_PRESETS[curve.preset];
    if (preset) {
      minE = Math.min(minE, preset.productE, preset.startE);
      maxE = Math.max(maxE, ...preset.tsE, preset.startE, preset.productE);
      if (preset.intermediateE.length > 0) {
        maxE = Math.max(maxE, ...preset.intermediateE);
      }
    }
  });
  // Add padding
  const range = maxE - minE;
  minE -= range * 0.1;
  maxE += range * 0.1;

  // Create group for chart area
  const chartGroup = document.createElementNS(svgNS, 'g');
  chartGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
  svg.appendChild(chartGroup);

  // Draw axes
  drawAxes(chartGroup, chartWidth, chartHeight, minE, maxE);

  // Draw each curve
  curves.forEach((curve, index) => {
    const preset = REACTION_PRESETS[curve.preset];
    if (preset) {
      const color = curve.color || CURVE_COLORS[index % CURVE_COLORS.length];
      drawEnergyCurve(chartGroup, preset, chartWidth, chartHeight, minE, maxE, color, curve.name);
    }
  });

  // Draw legend if multiple curves
  if (curves.length > 1) {
    drawLegend(svg, curves, margin.left + 10, margin.top + 10);
  }
}

/**
 * Draw axes and labels
 */
function drawAxes(group, width, height, minE, maxE) {
  const svgNS = 'http://www.w3.org/2000/svg';

  // Y-axis
  const yAxis = document.createElementNS(svgNS, 'line');
  yAxis.setAttribute('x1', '0');
  yAxis.setAttribute('y1', '0');
  yAxis.setAttribute('x2', '0');
  yAxis.setAttribute('y2', height);
  yAxis.setAttribute('stroke', 'var(--bond-color)');
  yAxis.setAttribute('stroke-width', '2');
  group.appendChild(yAxis);

  // Y-axis arrow
  const yArrow = document.createElementNS(svgNS, 'polygon');
  yArrow.setAttribute('points', '0,0 -5,10 5,10');
  yArrow.setAttribute('fill', 'var(--bond-color)');
  group.appendChild(yArrow);

  // Y-axis label
  const yLabel = document.createElementNS(svgNS, 'text');
  yLabel.setAttribute('x', -height / 2);
  yLabel.setAttribute('y', -40);
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('transform', 'rotate(-90)');
  yLabel.setAttribute('fill', 'var(--text-primary)');
  yLabel.setAttribute('font-size', '14');
  yLabel.textContent = 'Energy (kcal/mol)';
  group.appendChild(yLabel);

  // X-axis
  const xAxis = document.createElementNS(svgNS, 'line');
  xAxis.setAttribute('x1', '0');
  xAxis.setAttribute('y1', height);
  xAxis.setAttribute('x2', width);
  xAxis.setAttribute('y2', height);
  xAxis.setAttribute('stroke', 'var(--bond-color)');
  xAxis.setAttribute('stroke-width', '2');
  group.appendChild(xAxis);

  // X-axis arrow
  const xArrow = document.createElementNS(svgNS, 'polygon');
  xArrow.setAttribute('points', `${width},${height} ${width - 10},${height - 5} ${width - 10},${height + 5}`);
  xArrow.setAttribute('fill', 'var(--bond-color)');
  group.appendChild(xArrow);

  // X-axis label
  const xLabel = document.createElementNS(svgNS, 'text');
  xLabel.setAttribute('x', width / 2);
  xLabel.setAttribute('y', height + 35);
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('fill', 'var(--text-primary)');
  xLabel.setAttribute('font-size', '14');
  xLabel.textContent = 'Reaction Progress';
  group.appendChild(xLabel);

  // Y-axis tick marks and labels
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const y = height * i / numTicks;
    const energy = maxE - (maxE - minE) * i / numTicks;

    // Tick mark
    const tick = document.createElementNS(svgNS, 'line');
    tick.setAttribute('x1', '-5');
    tick.setAttribute('y1', y);
    tick.setAttribute('x2', '0');
    tick.setAttribute('y2', y);
    tick.setAttribute('stroke', 'var(--bond-color)');
    tick.setAttribute('stroke-width', '1');
    group.appendChild(tick);

    // Label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', '-10');
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', 'var(--text-secondary)');
    label.setAttribute('font-size', '11');
    label.textContent = Math.round(energy);
    group.appendChild(label);
  }
}

/**
 * Draw a single energy curve
 */
function drawEnergyCurve(group, preset, width, height, minE, maxE, color, name) {
  const svgNS = 'http://www.w3.org/2000/svg';

  // Helper to convert energy to y coordinate
  const energyToY = (e) => {
    return height * (maxE - e) / (maxE - minE);
  };

  // Build curve points
  const points = [];
  const numSteps = preset.steps;

  // Starting point
  const startX = 30;
  const startY = energyToY(preset.startE);
  points.push({ x: startX, y: startY, label: 'SM', energy: preset.startE });

  // Calculate segment width
  const endX = width - 30;
  const totalWidth = endX - startX;

  if (numSteps === 1) {
    // Single transition state
    const tsX = startX + totalWidth / 2;
    const tsY = energyToY(preset.tsE[0]);
    points.push({ x: tsX, y: tsY, label: 'TS', energy: preset.tsE[0], isTS: true });
  } else {
    // Multiple steps
    const segmentWidth = totalWidth / (numSteps * 2);
    for (let i = 0; i < numSteps; i++) {
      // Transition state
      const tsX = startX + segmentWidth * (2 * i + 1);
      const tsY = energyToY(preset.tsE[i]);
      points.push({ x: tsX, y: tsY, label: `TS${i + 1}`, energy: preset.tsE[i], isTS: true });

      // Intermediate (if not last step)
      if (i < numSteps - 1 && preset.intermediateE[i] !== undefined) {
        const intX = startX + segmentWidth * (2 * i + 2);
        const intY = energyToY(preset.intermediateE[i]);
        points.push({ x: intX, y: intY, label: 'Int', energy: preset.intermediateE[i] });
      }
    }
  }

  // Product
  const productY = energyToY(preset.productE);
  points.push({ x: endX, y: productY, label: 'P', energy: preset.productE });

  // Draw smooth curve through points
  const path = document.createElementNS(svgNS, 'path');
  const d = buildSmoothPath(points);
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '3');
  path.setAttribute('stroke-linecap', 'round');
  group.appendChild(path);

  // Draw points and labels
  points.forEach(pt => {
    // Point circle
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', pt.x);
    circle.setAttribute('cy', pt.y);
    circle.setAttribute('r', pt.isTS ? '5' : '4');
    circle.setAttribute('fill', pt.isTS ? color : 'var(--surface)');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);

    // Label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', pt.x);
    label.setAttribute('y', pt.isTS ? pt.y - 12 : pt.y + 18);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', 'var(--text-primary)');
    label.setAttribute('font-size', '11');
    label.setAttribute('font-weight', '500');
    label.textContent = pt.label;
    group.appendChild(label);
  });

  // Draw dashed lines for activation energy
  const startPt = points[0];
  const tsPt = points.find(p => p.isTS);
  if (tsPt) {
    // Horizontal dashed line from start to under TS
    const hLine = document.createElementNS(svgNS, 'line');
    hLine.setAttribute('x1', startPt.x);
    hLine.setAttribute('y1', startPt.y);
    hLine.setAttribute('x2', tsPt.x);
    hLine.setAttribute('y2', startPt.y);
    hLine.setAttribute('stroke', color);
    hLine.setAttribute('stroke-width', '1');
    hLine.setAttribute('stroke-dasharray', '4,4');
    hLine.setAttribute('opacity', '0.5');
    group.appendChild(hLine);

    // Vertical line for Ea
    const vLine = document.createElementNS(svgNS, 'line');
    vLine.setAttribute('x1', tsPt.x);
    vLine.setAttribute('y1', startPt.y);
    vLine.setAttribute('x2', tsPt.x);
    vLine.setAttribute('y2', tsPt.y);
    vLine.setAttribute('stroke', color);
    vLine.setAttribute('stroke-width', '1');
    vLine.setAttribute('stroke-dasharray', '4,4');
    vLine.setAttribute('opacity', '0.5');
    group.appendChild(vLine);

    // Ea label
    const eaLabel = document.createElementNS(svgNS, 'text');
    eaLabel.setAttribute('x', tsPt.x + 8);
    eaLabel.setAttribute('y', (startPt.y + tsPt.y) / 2 + 4);
    eaLabel.setAttribute('fill', color);
    eaLabel.setAttribute('font-size', '10');
    eaLabel.textContent = `Ea=${Math.round(tsPt.energy - startPt.energy)}`;
    group.appendChild(eaLabel);
  }
}

/**
 * Build smooth SVG path through points using quadratic bezier curves
 */
function buildSmoothPath(points) {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Use quadratic bezier with control point at midpoint
    const midX = (prev.x + curr.x) / 2;

    // Control points for smooth curve
    const cp1x = prev.x + (midX - prev.x) * 0.8;
    const cp1y = prev.y;
    const cp2x = curr.x - (curr.x - midX) * 0.8;
    const cp2y = curr.y;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

/**
 * Draw legend for multiple curves
 */
function drawLegend(svg, curves, x, y) {
  const svgNS = 'http://www.w3.org/2000/svg';

  curves.forEach((curve, index) => {
    const color = curve.color || CURVE_COLORS[index % CURVE_COLORS.length];
    const preset = REACTION_PRESETS[curve.preset];
    const name = curve.name || (preset ? preset.name : curve.preset);

    // Color line
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', y + index * 18);
    line.setAttribute('x2', x + 20);
    line.setAttribute('y2', y + index * 18);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '3');
    svg.appendChild(line);

    // Label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', x + 25);
    label.setAttribute('y', y + index * 18 + 4);
    label.setAttribute('fill', 'var(--text-primary)');
    label.setAttribute('font-size', '11');
    label.textContent = name;
    svg.appendChild(label);
  });
}

/**
 * Calculate energy values from preset
 */
export function getEnergyInfo(preset) {
  const config = REACTION_PRESETS[preset];
  if (!config) return null;

  const ea = config.tsE[0] - config.startE;
  const deltaH = config.productE - config.startE;

  return {
    name: config.name,
    description: config.description,
    ea: ea,
    deltaH: deltaH,
    steps: config.steps
  };
}
