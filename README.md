# Chair Conformation Viewer

An interactive web application for visualizing cyclohexane chair conformations. Designed to help university-level organic chemistry students verify their problem sets involving conformational analysis.

## Features

- **Interactive Chair Visualization**: Click on any carbon to add substituents
- **Axial/Equatorial Positioning**: Choose where to place each substituent
- **Ring Flip**: See how substituents swap between axial and equatorial positions
- **Energy Calculations**: Automatic calculation of conformational strain using A-values
- **Equilibrium Prediction**: Shows which chair conformation is preferred and by how much

## Supported Substituents

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

## How to Use

1. **Add Substituents**: Click on any carbon (numbered 1-6) to open the substituent picker
2. **Choose Position**: Select whether to place the substituent in the axial or equatorial position
3. **Select Group**: Choose from the dropdown menu of available substituents
4. **Ring Flip**: Click the "Ring Flip" button to see the alternate chair conformation
5. **Compare Energies**: The energy panel shows the strain energy for both conformations

## Running Locally

No build step required. Simply serve the files with any HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

## Deployment

This app is designed for easy deployment on GitHub Pages:

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from branch" with `main` / `root`
4. Your app will be live at `https://username.github.io/repo-name/`

## Technical Details

- Pure HTML/CSS/JavaScript (no build step, no dependencies)
- SVG-based rendering for crisp, scalable graphics
- ES6 modules for code organization
- A-values sourced from standard organic chemistry references

## Educational Background

### Chair Conformations

Cyclohexane adopts a "chair" conformation to minimize angle strain and torsional strain. In this conformation:

- **Axial positions** point straight up or down, perpendicular to the ring
- **Equatorial positions** point outward, roughly in the plane of the ring

### 1,3-Diaxial Interactions

When bulky substituents occupy axial positions, they experience steric strain with other axial groups on the same face of the ring (at positions 1,3,5 or 2,4,6). This strain is quantified by **A-values**.

### Ring Flip

Cyclohexane undergoes rapid ring flipping at room temperature, interconverting between two chair conformations. During a ring flip, all axial substituents become equatorial and vice versa.

## License

MIT License - Free to use for educational purposes.
