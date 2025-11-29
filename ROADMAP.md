# Organic Chemistry Visualization Suite - Feature Roadmap

## Current Features (Completed)

- [x] Chair Conformation Viewer (cyclohexane, pyranose sugars, decalin)
- [x] Reaction Energy Diagram
- [x] E2 Stereochemistry
- [x] Alkene Stability
- [x] Stereochemistry Tracker (R/S, E/Z)
- [x] Mechanism Animator (SN1, SN2, E1, E2, additions, rearrangements)
- [x] IUPAC Nomenclature (alkanes, alkenes, alcohols, alkyl halides, cyclic)
- [x] Reagent Identification Quiz

---

## Planned Features

### High Priority - Core Exam Topics

#### Spectroscopy Interpreter
- **IR Spectroscopy**: Functional group identification from absorption peaks
- **¹H NMR**: Chemical shift, splitting patterns, integration
- **¹³C NMR**: Chemical shift, DEPT
- **Mass Spectrometry**: Molecular ion, fragmentation patterns
- Quiz modes for each technique
- Practice with real-world spectra

#### pKa Trainer
- Compare acidities of different compounds
- Predict direction of acid-base equilibrium
- Rank series of acids/bases by strength
- Explain factors affecting acidity (electronegativity, resonance, induction, orbital)
- Common pKa values flashcards

#### Aromatic Chemistry (EAS)
- Electrophilic Aromatic Substitution mechanisms
- Directing effects visualization (ortho/meta/para)
- Activating vs deactivating groups
- Predict major products of substitution
- Multi-substituted benzene ring analysis
- Quiz on directing effects

#### Retrosynthesis Practice
- Work backwards from target molecules
- Identify key disconnections
- Suggest synthetic equivalents
- Multi-step synthesis planning
- Common retrosynthetic strategies

### Medium Priority - Synthesis & Reactions

#### Functional Group Transformations
- Interactive flowchart/web of transformations
- Click to see reagents for each conversion
- Filter by functional group
- "How do I make X from Y?" pathfinder

#### Synthesis Pathways
- Connect individual mechanisms into multi-step routes
- Show reagents and conditions for each step
- Common synthetic sequences (e.g., alkene → alcohol → ketone)

#### Reaction Condition Drills
- Rapid-fire "What reagent converts A → B?" questions
- Timed quiz mode
- Focus on specific reaction types

### Lower Priority - Practice Tools

#### Curved Arrow Drawing
- Interactive electron-pushing practice
- Draw arrows on mechanism diagrams
- Verify arrow placement and direction
- Common arrow-pushing patterns

#### Export Quiz Results
- Save scores to local storage
- Print/export study progress
- Track improvement over time

---

## Quick Enhancements

### Nomenclature Expansion
- [ ] Add ethers (IUPAC and common names)
- [ ] Add amines
- [ ] Add carboxylic acids and derivatives (esters, amides, anhydrides, acyl halides)
- [ ] Add aldehydes and ketones
- [ ] Add nitriles
- [ ] Add more complex stereochemistry examples

### Reagent Database Expansion
- [ ] Add more oxidation reagents (Dess-Martin, IBX, TEMPO)
- [ ] Add coupling reagents (DCC, EDC, HATU)
- [ ] Add more organometallic reagents
- [ ] Add common catalysts
- [ ] Add Lewis acids

### UI/UX Improvements
- [ ] Keyboard shortcuts for quiz navigation (Enter to submit, N for new question)
- [ ] Dark mode improvements
- [ ] Mobile-responsive layout optimization
- [ ] Progress indicators for multi-step mechanisms

---

## Implementation Notes

### Spectroscopy Interpreter Architecture
```
js/spectroscopy.js        - Spectra data and peak databases
js/spectroscopy-renderer.js - SVG rendering for spectra
js/spectroscopy-quiz.js   - Quiz generation
```

### pKa Trainer Architecture
```
js/pka.js                 - pKa database and comparison logic
js/pka-renderer.js        - Molecule rendering with pKa labels
```

### EAS Architecture
```
js/aromatic.js            - Directing effects rules and data
js/aromatic-renderer.js   - Benzene ring visualization
```

---

## Priority Order for Implementation

1. **Spectroscopy Interpreter** - Most frequently tested, high value
2. **pKa Trainer** - Fundamental concept, quick to implement
3. **Aromatic Chemistry** - Common exam topic
4. **Nomenclature Expansion** - Low effort, incremental value
5. **Retrosynthesis** - More complex, save for later
