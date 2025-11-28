# Using the Chair Conformation Viewer

This guide explains how to use the viewer effectively for learning and problem-solving.

## Interface Overview

The viewer has three main areas:

1. **Mode Selector** (top) - Switch between Cyclohexane, Sugar, and Decalin modes
2. **Canvas** (center-left) - Interactive visualization of the molecule
3. **Info Panel** (right) - Energy analysis and substituent list

## Cyclohexane Mode

### SMILES Input

You can enter a [SMILES](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system) string to quickly load a cyclohexane derivative:

1. **Enter a SMILES string** in the input field (e.g., `CC1CCCCC1`)
2. **Click Load** or press **Enter**
3. The molecule will be displayed with substituents in equatorial positions (the more stable default)

#### Supported SMILES Patterns

| SMILES | Molecule | Notes |
|--------|----------|-------|
| `C1CCCCC1` | Cyclohexane | Unsubstituted ring |
| `CC1CCCCC1` | Methylcyclohexane | Methyl on C1 |
| `C1(C)CCCCC1` | Methylcyclohexane | Alternate syntax (branch notation) |
| `CC1CCC(C)CC1` | 1,4-Dimethylcyclohexane | Two substituents |
| `OC1CCCCC1` | Cyclohexanol | Hydroxyl group |
| `ClC1CCCCC1` | Chlorocyclohexane | Halogen |
| `CC(C)C1CCCCC1` | Isopropylcyclohexane | Branched alkyl |
| `CC(C)(C)C1CCCCC1` | tert-Butylcyclohexane | Bulky group |

#### Supported Substituents

The parser recognizes these functional groups:

| Group | SMILES Fragment | A-value (kcal/mol) |
|-------|-----------------|-------------------|
| Methyl | `C` | 1.74 |
| Ethyl | `CC` | 1.75 |
| Isopropyl | `C(C)C` | 2.15 |
| tert-Butyl | `C(C)(C)C` | >4.5 |
| Hydroxyl | `O` | 0.94 |
| Methoxy | `OC` | 0.75 |
| Fluorine | `F` | 0.15 |
| Chlorine | `Cl` | 0.53 |
| Bromine | `Br` | 0.48 |
| Iodine | `I` | 0.47 |
| Amino | `N` | 1.23 |
| Cyano | `C#N` | 0.17 |
| Phenyl | `c1ccccc1` | 2.80 |

> **Note**: This is a focused parser for cyclohexane derivatives, not a full SMILES parser. Complex molecules or unsupported patterns will show an error message.

### Adding Substituents Manually

1. **Click on a carbon** (numbered 1-6) to open the substituent picker
2. **Choose the position**: Axial or Equatorial
3. **Select a substituent** from the dropdown menu
4. Click **Add** to place it, or **Remove** to replace with hydrogen

### Using Presets

Select from the **Example** dropdown to quickly load common molecules:
- Single substituents (methyl axial/equatorial, tert-butyl)
- 1,2-Disubstituted (cis and trans)
- 1,3-Disubstituted (cis and trans)
- 1,4-Disubstituted (cis and trans)
- Complex examples (menthol-like, all-axial, all-equatorial)

### Understanding the Display

- **Numbered circles** represent the six carbons
- **Lines extending from carbons** show bonds to substituents
- **Red labels** indicate explicit substituents (not hydrogen)
- **Gray "H"** labels show implicit hydrogens
- **"ax" and "eq"** labels indicate axial and equatorial positions

### Newman Projection View

Switch to Newman projection to see the molecule looking down a C-C bond:

1. Click **Newman Projection** button (next to Chair View)
2. Select which bond to view from the dropdown (C1-C2, C2-C3, etc.)
3. Front carbon substituents shown with solid lines
4. Back carbon substituents shown with lighter lines

Newman projections help visualize:
- Staggered vs. eclipsed conformations
- Gauche interactions between substituents
- Why certain conformations are preferred

### 3D View Toggle

Enable pseudo-3D rotation to better visualize the chair shape:

1. Check the **3D** checkbox in the canvas controls
2. Use the **X rotation** slider to tilt forward/backward
3. Use the **Y rotation** slider to rotate left/right
4. Click **↺** to reset rotation

This helps students understand the 3D geometry of the chair without needing molecular modeling software.

### Energy Analysis Panel

The right panel shows a **visual bar chart** comparing energies:

- **Blue bar**: Current chair conformation energy
- **Purple bar**: Flipped chair conformation energy
- **Green outline**: Indicates the preferred (lower energy) conformer

Below the chart:

| Field | Meaning |
|-------|---------|
| ΔE | Energy difference between conformations |
| Preferred | Which conformation is more stable, with percentage |

**Example**: If you add a methyl group (A = 1.74) in an axial position:
- Current Chair: 1.74 kcal/mol (longer bar)
- Flipped Chair: 0.00 kcal/mol (shorter bar, green outline)
- Preferred: Flipped (95%)

### 1,3-Diaxial Interactions

Check **Show 1,3-Diaxial** to visualize steric interactions:

- Red dashed curves connect substituents with 1,3-diaxial interactions
- These interactions contribute to conformational strain
- Helps explain why multiple axial groups are destabilizing

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

### Export

Save your molecule visualization:

- **📷 PNG**: Export as a high-resolution image (800×700 pixels)
- **📄 SVG**: Export as scalable vector graphics

Exported images include:
- The molecule structure
- All substituent labels
- White background for easy printing

### Practice Quiz Mode

Test your understanding with randomized problems:

1. Click **Quiz Mode** button in the header
2. Select difficulty: **Easy**, **Medium**, or **Hard**
3. Click **New Question** to get a problem
4. The viewer shows a random molecule configuration
5. Answer the multiple-choice question
6. Click **Submit** to check your answer

#### Question Types

| Difficulty | Question Types |
|------------|---------------|
| Easy | Preferred conformer, Count axial substituents |
| Medium | + Energy difference estimation |
| Hard | + Ring flip predictions, Multiple substituents |

#### Scoring

- Your score is tracked (e.g., "4/5")
- Click **Reset Score** to start over
- Explanations are provided after each answer

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
