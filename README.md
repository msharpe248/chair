# Organic Chemistry Visualization Suite

An interactive web application suite for visualizing and understanding organic chemistry concepts. Designed to help university-level organic chemistry students with conformational analysis, reaction mechanisms, and stereochemistry.

## Available Viewers

### 1. Chair Conformation Viewer
Visualize cyclohexane chair conformations with real-time energy calculations.

- **Interactive Chair Visualization**: Click on any carbon to add substituents
- **Axial/Equatorial Positioning**: Choose where to place each substituent
- **Ring Flip**: See how substituents swap between axial and equatorial positions
- **Energy Calculations**: Automatic calculation of conformational strain using A-values
- **Newman Projections**: View any C-C bond as a Newman projection
- **Pyranose Sugars**: Visualize glucose, galactose, mannose, and other sugars
- **Decalin Systems**: Explore cis and trans fused ring systems
- **3D Rotation**: Rotate the view in 3D space
- **Quiz Mode**: Test your understanding with practice questions

### 2. Reaction Energy Diagram Viewer
Understand reaction mechanisms and thermodynamics.

- **Mechanism Prediction**: Predict SN1, SN2, E1, E2 from reaction conditions
- **SMILES Analysis**: Enter reactant/product SMILES to analyze reactions
- **Preset Diagrams**: View standard energy profiles for common reactions
- **Custom Diagrams**: Create your own with draggable points and sliders
- **Competing Mechanisms**: Overlay multiple pathways for comparison
- **Quiz Mode**: Practice identifying mechanisms from energy diagrams

### 3. E2 Stereochemistry Viewer
Master the anti-periplanar requirement for E2 eliminations.

- **Newman Projection Visualization**: See the spatial relationship between β-H and leaving group
- **Anti-Periplanar Highlighting**: Color-coded bonds show which H's can eliminate
  - Green = Anti-periplanar (180°) - CAN eliminate
  - Orange = Gauche (60°) - Cannot eliminate
  - Red = Leaving group
- **Dihedral Angles**: See the exact angle for each β-hydrogen
- **Zaitsev vs Hofmann**: Compare product predictions with different bases
- **Classic Examples**: Menthyl vs neomenthyl chloride demonstrates the requirement

### 4. Alkene Stability Viewer
Compare relative stabilities of alkene isomers.

- **Substitution Patterns**: Visualize mono-, di-, tri-, and tetrasubstituted alkenes
- **Heat of Hydrogenation**: See ΔH values for each alkene type
- **Hyperconjugation**: Understand why more substituted = more stable
- **E/Z Isomers**: Compare cis vs trans (E vs Z) stabilities
- **SMILES Input**: Enter your own alkene structures for analysis
- **Quiz Mode**: Test your ability to rank alkene stabilities

### 5. Stereochemistry Tracker
Understand stereochemical outcomes of SN1 and SN2 reactions.

- **SN2 Walden Inversion**: Animated mechanism showing backside attack and complete inversion
- **SN1 Racemization**: See how planar carbocation leads to 50:50 product mixture
- **Wedge-Dash Notation**: Clear stereochemical representations
- **SMILES Input**: Analyze your own chiral molecules (use @/@@  for R/S configuration)
- **Preset Molecules**: 2-bromobutane, lactic acid, and more

### 6. Mechanism Animator
Step through reaction mechanisms with electron-flow arrows.

- **Substitution Mechanisms**: SN1 and SN2 with electron pushing
- **Elimination Mechanisms**: E1 and E2 with orbital overlap visualization
- **Addition Reactions**: HBr and Br₂ addition to alkenes
- **Step-by-Step**: Navigate through each mechanistic step
- **Electron Flow Arrows**: Curved arrows show electron movement

## Quick Start

```bash
# Clone the repository
git clone https://github.com/msharpe248/chair.git
cd chair

# Serve with Python
python3 -m http.server 8080

# Or with Node.js
npx serve

# Open in browser
open http://localhost:8080
```

## How to Use

### Chair Conformation Viewer
1. Select **"Chair Conformation Viewer"** from the dropdown
2. Click on any carbon (C1-C6) to add substituents
3. Choose axial or equatorial position
4. Click **"Ring Flip"** to see the alternate conformation
5. Compare energies in the panel on the right

### Reaction Energy Diagram Viewer
1. Select **"Reaction Energy Diagram"** from the dropdown
2. Choose a mode:
   - **Conditions**: Set substrate, nucleophile, solvent, temperature
   - **SMILES**: Enter reactant → product structures
   - **Preset**: Select standard reaction types
3. View the predicted mechanism and energy diagram

### E2 Stereochemistry Viewer
1. Select **"E2 Stereochemistry"** from the dropdown
2. Choose a substrate (e.g., 2-bromobutane, menthyl chloride)
3. Select a base (bulky vs non-bulky)
4. Observe which β-hydrogens are anti-periplanar (green)
5. See the predicted major product

## Supported Substituents (Chair Viewer)

| Group | A-value (kcal/mol) |
|-------|-------------------|
| H | 0 |
| F | 0.15 |
| Cl | 0.43 |
| Br | 0.38 |
| OH | 0.87 |
| OCH₃ | 0.60 |
| CH₃ | 1.74 |
| C₂H₅ | 1.79 |
| iPr | 2.15 |
| tBu | 4.90 |
| Ph | 2.80 |
| CN | 0.17 |
| NO₂ | 1.10 |
| NH₂ | 1.23 |
| COOH | 1.35 |

## Educational Background

### Chair Conformations
Cyclohexane adopts a "chair" conformation to minimize angle strain and torsional strain. In this conformation:
- **Axial positions** point straight up or down, perpendicular to the ring
- **Equatorial positions** point outward, roughly in the plane of the ring

### 1,3-Diaxial Interactions
When bulky substituents occupy axial positions, they experience steric strain with other axial groups on the same face of the ring. This strain is quantified by **A-values**.

### E2 Anti-Periplanar Requirement
E2 elimination requires the β-hydrogen and leaving group to be at a 180° dihedral angle (anti-periplanar). This allows proper orbital overlap for the concerted mechanism.

### Mechanism Selection (SN1/SN2/E1/E2)
The choice of mechanism depends on:
- **Substrate**: Methyl/1° favor SN2, 3° favor SN1/E1
- **Nucleophile/Base**: Strong favors SN2/E2, weak favors SN1/E1
- **Solvent**: Polar aprotic favors SN2, polar protic favors SN1
- **Temperature**: Higher temperature favors elimination

## Technical Details

- Pure HTML/CSS/JavaScript (no build step, no dependencies)
- SVG-based rendering for crisp, scalable graphics
- ES6 modules for code organization
- Dark mode support (automatic or manual toggle)
- Export diagrams as PNG or SVG

## Deployment

This app is designed for easy deployment on GitHub Pages:

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from branch" with `main` / `root`
4. Your app will be live at `https://username.github.io/repo-name/`

## Documentation

Full documentation is available in the `docs/` folder or by clicking **"? Help"** in the app.

- [Chair Conformation Theory](docs/theory.md)
- [Using the Chair Viewer](docs/using-the-viewer.md)
- [Pyranose Sugars](docs/sugars.md)
- [Decalin & Fused Rings](docs/decalin.md)
- [Reaction Energy Theory](docs/energy-theory.md)
- [Using the Energy Viewer](docs/energy-viewer.md)

## License

MIT License - Free to use for educational purposes.
