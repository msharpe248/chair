# Organic Chemistry Visualization Suite - Development Plan

## Completed Features

### Chair Conformation Viewer
- [x] Interactive cyclohexane chair conformations
- [x] Substituent placement with energy calculations
- [x] Ring flip visualization
- [x] Newman projections
- [x] Pyranose sugars (glucose, galactose, etc.)
- [x] Decalin fused ring systems
- [x] Quiz mode
- [x] 3D rotation
- [x] SMILES input
- [x] Export PNG/SVG

### Reaction Energy Diagram Viewer
- [x] Mechanism prediction from conditions (SN1/SN2/E1/E2)
- [x] SMILES-based reaction analysis
- [x] Preset energy diagrams
- [x] Custom interactive diagrams with draggable points
- [x] Competing mechanism overlay
- [x] Quiz mode

---

## Planned Features (from Mock Exam Analysis)

### Phase 1: E2 Stereochemistry Visualizer (Priority: HIGH) ✅ COMPLETE
**Addresses:** Mock Exam Q3 - E2 reactions with stereochemistry

Features:
- [x] Enhance Newman projection to highlight anti-periplanar H atoms
- [x] Color-coded visualization (green=anti, orange=gauche, red=LG)
- [x] Highlight which hydrogens are anti-periplanar to leaving group
- [x] Show dihedral angles for each β-hydrogen
- [x] Zaitsev vs Hofmann product prediction based on base
- [x] Preset substrates including menthyl/neomenthyl chloride
- [ ] Quiz mode for E2 stereochemistry (future)

### Phase 2: Alkene Stability Viewer (Priority: HIGH)
**Addresses:** Mock Exam Q1 - Alkene hydrogenation and stability

Features:
- [ ] Compare alkene isomers side-by-side
- [ ] Show substitution pattern (mono/di/tri/tetrasubstituted)
- [ ] Display relative stability order
- [ ] Visualize heats of hydrogenation (ΔH)
- [ ] Overlay energy diagrams for different isomers
- [ ] IUPAC naming with E/Z stereochemistry
- [ ] Explain hyperconjugation and stability
- [ ] Quiz mode for stability ranking

### Phase 3: Stereochemistry Tracker (Priority: MEDIUM)
**Addresses:** Mock Exam Q4 - Multi-step synthesis stereochemistry

Features:
- [ ] Track R/S configuration through reaction sequences
- [ ] Visualize SN1 outcomes (racemization)
- [ ] Visualize SN2 outcomes (inversion - Walden inversion)
- [ ] Show wedge/dash notation changes
- [ ] Fischer projection ↔ wedge/dash conversion
- [ ] Meso compound identification
- [ ] Enantiomer vs diastereomer relationships

### Phase 4: Mechanism Animator (Priority: LOW)
**Addresses:** Mock Exam Q5 - Curved-arrow mechanisms

Features:
- [ ] Animated curved-arrow mechanisms
- [ ] Step-by-step mechanism breakdown
- [ ] Common reactions: SN1, SN2, E1, E2, additions
- [ ] Electron flow visualization
- [ ] Intermediate structures
- [ ] Resonance structure generation

### Phase 5: Reagent Reference (Priority: LOW)
**Addresses:** Mock Exam Q5 - Identifying reagents

Features:
- [ ] Searchable reagent database
- [ ] Common transformations and their reagents
- [ ] Flashcard mode for memorization
- [ ] Quiz mode for reagent identification

---

## Technical Notes

### E2 Stereochemistry Implementation Plan
1. Add "E2 Mode" to existing Newman projection viewer
2. Allow user to specify leaving group position
3. Highlight anti-periplanar hydrogens (180° dihedral)
4. Show resulting alkene product with E/Z geometry
5. Add chair view option showing axial/equatorial relationships
6. Implement Zaitsev (more substituted) vs Hofmann (less substituted) toggle

### Integration Points
- E2 viewer can reuse Newman projection renderer
- Alkene stability can reuse energy diagram components
- Stereochemistry tracker can reuse chair conformation renderer

---

*Last updated: 2025-11-28*
