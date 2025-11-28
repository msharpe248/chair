# Using the Chair Conformation Viewer

This guide explains how to use the viewer effectively for learning and problem-solving.

## Interface Overview

The viewer has three main areas:

1. **Mode Selector** (top) - Switch between Cyclohexane, Sugar, and Decalin modes
2. **Canvas** (center-left) - Interactive visualization of the molecule
3. **Info Panel** (right) - Energy analysis and substituent list

## Cyclohexane Mode

### Adding Substituents

1. **Click on a carbon** (numbered 1-6) to open the substituent picker
2. **Choose the position**: Axial or Equatorial
3. **Select a substituent** from the dropdown menu
4. Click **Add** to place it, or **Remove** to replace with hydrogen

### Understanding the Display

- **Numbered circles** represent the six carbons
- **Lines extending from carbons** show bonds to substituents
- **Red labels** indicate explicit substituents (not hydrogen)
- **Gray "H"** labels show implicit hydrogens
- **"ax" and "eq"** labels indicate axial and equatorial positions

### Energy Analysis Panel

The right panel shows:

| Field | Meaning |
|-------|---------|
| Current Chair | Total A-value strain for the displayed conformation |
| Flipped Chair | Total A-value strain if you were to ring flip |
| ΔE | Energy difference between conformations |
| Preferred | Which conformation is more stable, with percentage |

**Example**: If you add a methyl group (A = 1.74) in an axial position:
- Current Chair: 1.74 kcal/mol
- Flipped Chair: 0.00 kcal/mol (methyl would be equatorial)
- Preferred: Flipped (95%)

### Ring Flip Button

Click **Ring Flip** to:
- Swap all axial positions to equatorial (and vice versa)
- See the alternative chair conformation
- Compare energies between the two forms

### Reset Button

Returns to an unsubstituted cyclohexane (all hydrogens).

## Navigation Controls

### Zoom

- **+ button**: Zoom in
- **− button**: Zoom out
- **↺ button**: Reset zoom and pan to default
- **Mouse wheel**: Scroll to zoom in/out
- **Percentage display**: Shows current zoom level

### Pan

- **Click and drag** on the canvas to move the view around
- Works when zoomed in to explore different parts of the molecule
- Reset button returns to centered view

## Sugar Mode

### Selecting a Sugar

1. Click the **Sugar** mode button
2. Use the **Sugar dropdown** to choose from:
   - D-Glucose
   - D-Galactose
   - D-Mannose
   - D-Allose, D-Altrose, D-Gulose, D-Idose, D-Talose

### Anomer Toggle

Sugars have two anomeric forms:
- **α (alpha)**: Anomeric OH is axial (in ⁴C₁)
- **β (beta)**: Anomeric OH is equatorial (in ⁴C₁)

Click the **α** or **β** button to toggle between them.

### Reading the Sugar Display

- **Red "O"** indicates the ring oxygen (between C5 and C1)
- **C1** is the anomeric carbon (where the ring closes)
- **Conformation label** shows ⁴C₁ or ¹C₄ notation
- **Substituents** (OH, CH₂OH) are shown at their stereochemically correct positions

### Why Sugars Matter

The chair viewer helps visualize:
- Why β-D-glucose is more stable (all substituents equatorial)
- How galactose differs from glucose (C4 epimer)
- The anomeric effect in carbohydrate chemistry

## Decalin Mode

### Selecting Decalin Type

1. Click the **Decalin** mode button
2. Choose **trans** or **cis** using the toggle buttons

### Understanding Decalin

Decalin is two fused cyclohexane rings:

- **trans-Decalin**: Bridgehead hydrogens on opposite faces
  - More stable by ~2.7 kcal/mol
  - **Cannot ring flip** (rigid structure)
  - Ring Flip button is disabled

- **cis-Decalin**: Bridgehead hydrogens on same face
  - Less stable
  - **Can ring flip**
  - Both rings flip together

### Visual Indicators

- **Blue bonds**: Ring A
- **Green bonds**: Ring B
- **Yellow circles**: Bridgehead carbons (C9 and C10)

## Tips for Problem Solving

### Predicting Most Stable Conformer

1. Draw substituents on the viewer
2. Note the energy of the current conformation
3. Click Ring Flip
4. Compare energies
5. The **lower energy** conformer is more stable

### Multiple Substituents

When you have multiple substituents:
1. Add all of them to the viewer
2. The energy panel sums all A-values automatically
3. The "Preferred" field tells you which arrangement wins

### Verifying Homework Problems

1. Set up the molecule as shown in your problem
2. Check the energy analysis
3. Use Ring Flip to see the alternative
4. Compare your answer to the viewer's calculation

## Keyboard Shortcuts

Currently, the viewer uses button/click interactions. Future updates may include keyboard shortcuts.

## Troubleshooting

### Substituent won't add
- Make sure you've selected a position (Axial or Equatorial)
- Click the Add button after selecting

### Can't see the whole molecule
- Use zoom out (− button)
- Use reset (↺) to return to default view

### Ring Flip doesn't work
- In Decalin mode with trans selected, ring flip is disabled (this is chemically accurate!)

---

*← [Theory](theory.md) | [Sugars](sugars.md) →*
