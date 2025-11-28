# SMILES Notation Guide

A comprehensive guide to SMILES (Simplified Molecular Input Line Entry System) notation for organic chemistry students using this visualization suite.

## Table of Contents

1. [What is SMILES?](#what-is-smiles)
2. [Basic Notation](#basic-notation)
3. [Bonds](#bonds)
4. [Branches](#branches)
5. [Rings](#rings)
6. [Stereochemistry](#stereochemistry)
7. [Functional Groups Reference](#functional-groups-reference)
8. [Viewer-Specific Examples](#viewer-specific-examples)
9. [Common Mistakes](#common-mistakes)
10. [Quick Reference](#quick-reference)

---

## What is SMILES?

SMILES is a line notation for representing molecular structures as text strings. It was developed to allow chemists to enter molecular structures into databases and computer programs without drawing them.

### Why Learn SMILES?

- **Universal**: Used by PubChem, ChemDraw, and most chemistry software
- **Compact**: A complex molecule in just a few characters
- **Searchable**: Find molecules in databases by structure
- **This App**: Enter custom molecules into any viewer

### How This App Uses SMILES

Each viewer accepts SMILES input for custom molecule analysis:

| Viewer | SMILES Use |
|--------|------------|
| Chair Conformation | Cyclohexane derivatives |
| Reaction Energy | Substrates and products |
| Alkene Stability | Alkene structures |
| Stereochemistry Tracker | Chiral molecules |

---

## Basic Notation

### Atoms

Most atoms are represented by their atomic symbols:

| Atom | SMILES | Notes |
|------|--------|-------|
| Carbon | C | Most common, often implicit |
| Nitrogen | N | |
| Oxygen | O | |
| Sulfur | S | |
| Phosphorus | P | |
| Fluorine | F | |
| Chlorine | Cl | Two letters - capital C, lowercase l |
| Bromine | Br | Two letters - capital B, lowercase r |
| Iodine | I | |

**Important**: Chlorine is `Cl` (not `CL` or `cl`) and Bromine is `Br` (not `BR` or `br`).

### Hydrogen Atoms

Hydrogens are usually **implicit** - the software adds them automatically to satisfy valence:

| SMILES | Meaning | Hydrogens Added |
|--------|---------|-----------------|
| `C` | Methane | 4 H (CH₄) |
| `CC` | Ethane | 6 H (C₂H₆) |
| `CCC` | Propane | 8 H (C₃H₈) |
| `O` | Water | 2 H (H₂O) |
| `N` | Ammonia | 3 H (NH₃) |

You can write explicit hydrogens in square brackets when needed:
- `[H]` = hydrogen atom
- `[CH4]` = methane (explicit)
- `[OH2]` = water (explicit)

### Organic Subset

These atoms can be written without brackets (organic subset):
`B, C, N, O, P, S, F, Cl, Br, I`

All other atoms require brackets: `[Fe]`, `[Cu]`, `[Zn]`

---

## Bonds

### Single Bonds

Single bonds are **implicit** between adjacent atoms:

| SMILES | Structure |
|--------|-----------|
| `CC` | CH₃-CH₃ (ethane) |
| `CCO` | CH₃-CH₂-OH (ethanol) |
| `CCN` | CH₃-CH₂-NH₂ (ethylamine) |

You can write them explicitly with `-` but it's rarely needed:
- `C-C` = same as `CC`

### Double Bonds

Use `=` for double bonds:

| SMILES | Structure | Name |
|--------|-----------|------|
| `C=C` | CH₂=CH₂ | Ethene |
| `CC=C` | CH₃-CH=CH₂ | Propene |
| `C=CC=C` | CH₂=CH-CH=CH₂ | 1,3-Butadiene |
| `CC=CC` | CH₃-CH=CH-CH₃ | 2-Butene |
| `C=O` | CH₂=O | Formaldehyde |
| `CC=O` | CH₃-CH=O | Acetaldehyde |

### Triple Bonds

Use `#` for triple bonds:

| SMILES | Structure | Name |
|--------|-----------|------|
| `C#C` | HC≡CH | Ethyne (acetylene) |
| `CC#C` | CH₃-C≡CH | Propyne |
| `C#N` | HC≡N | Hydrogen cyanide |
| `CC#N` | CH₃-C≡N | Acetonitrile |

### Aromatic Bonds

Aromatic atoms are written in **lowercase**:

| SMILES | Structure | Name |
|--------|-----------|------|
| `c1ccccc1` | Benzene | Aromatic ring |
| `c1ccc(C)cc1` | Toluene | Methylbenzene |
| `c1ccc(O)cc1` | Phenol | Hydroxybenzene |

Alternative: Use uppercase with ring notation (see Rings section).

---

## Branches

Branches are enclosed in **parentheses** `()`. The branch connects to the atom immediately before the opening parenthesis.

### Simple Branches

| SMILES | Structure | Name |
|--------|-----------|------|
| `CC(C)C` | Isobutane | 2-Methylpropane |
| `CC(C)(C)C` | Neopentane | 2,2-Dimethylpropane |
| `CCC(C)C` | Isopentane | 2-Methylbutane |
| `CC(C)CC` | Isopentane | 2-Methylbutane (same) |

### Understanding Branch Attachment

```
CC(C)C     means:    CH₃
                      |
               CH₃ - C - CH₃
                      |
                      H

The branch (C) attaches to the second carbon in the chain.
```

### Multiple Branches on One Carbon

```
CC(C)(C)C   means:    CH₃
                       |
                CH₃ - C - CH₃
                       |
                      CH₃

Two branches (C)(C) both attach to the second carbon.
```

### Nested Branches

Branches can contain branches:

| SMILES | Structure |
|--------|-----------|
| `CC(CC)C` | 2-Ethylpropane... wait, that's just pentane written oddly |
| `CC(C(C)C)C` | 2-Isopropylpropane (2,3-dimethylbutane) |

**Tip**: Keep it simple. There's often a cleaner way to write the same molecule.

### Functional Group Branches

| SMILES | Structure | Name |
|--------|-----------|------|
| `CC(O)C` | 2-Propanol | Isopropyl alcohol |
| `CC(=O)C` | Acetone | Propan-2-one |
| `CC(Br)C` | 2-Bromopropane | Isopropyl bromide |
| `CC(N)C` | 2-Propylamine | Isopropylamine |

---

## Rings

Rings are indicated by **matching numbers** that show where atoms connect to close the ring.

### Basic Ring Notation

```
C1CCCCC1 = Cyclohexane

The "1" after the first C and the "1" after the last C
indicate these two atoms are bonded, closing the ring.

    C1 - C - C
    |        |
    C - C - C1  (same carbon, ring closes here)
```

### Common Rings

| SMILES | Structure | Name |
|--------|-----------|------|
| `C1CC1` | Cyclopropane | 3-membered ring |
| `C1CCC1` | Cyclobutane | 4-membered ring |
| `C1CCCC1` | Cyclopentane | 5-membered ring |
| `C1CCCCC1` | Cyclohexane | 6-membered ring |
| `C1CCCCCC1` | Cycloheptane | 7-membered ring |

### Substituted Rings

Add substituents as branches:

| SMILES | Structure | Name |
|--------|-----------|------|
| `CC1CCCCC1` | Methylcyclohexane | |
| `CC1CCC(C)CC1` | 1,3-Dimethylcyclohexane | |
| `CC1CCCCC1C` | 1,2-Dimethylcyclohexane | |
| `BrC1CCCCC1` | Bromocyclohexane | |
| `OC1CCCCC1` | Cyclohexanol | |

### Multiple Ring Numbers

For molecules with multiple rings, use different numbers:

```
C1CC2CCCCC2C1 = Decalin (bicyclic)

Ring 1 closes with "1"
Ring 2 closes with "2"
```

| SMILES | Structure |
|--------|-----------|
| `C1CC2CCCCC2C1` | Decalin |
| `C1CCC2CCCCC2C1` | Bicyclo compound |

### Aromatic Rings

| SMILES | Structure | Name |
|--------|-----------|------|
| `c1ccccc1` | Benzene | (lowercase = aromatic) |
| `C1=CC=CC=C1` | Benzene | (uppercase, explicit double bonds) |
| `c1ccc2ccccc2c1` | Naphthalene | Fused aromatic rings |

---

## Stereochemistry

### Tetrahedral Stereocenters (R/S Configuration)

Use `@` and `@@` to specify stereochemistry at chiral centers.

**The Rule**:
- Look at the stereocenter with the first three neighbors in order
- `@` = counterclockwise (S-like)
- `@@` = clockwise (R-like)

**Important**: Stereocenters require square brackets: `[C@H]` or `[C@@H]`

| SMILES | Configuration | Example |
|--------|--------------|---------|
| `CC[C@H](Br)C` | S | (S)-2-Bromobutane |
| `CC[C@@H](Br)C` | R | (R)-2-Bromobutane |
| `C[C@H](O)C(=O)O` | S | (S)-Lactic acid |
| `C[C@@H](O)C(=O)O` | R | (R)-Lactic acid |
| `C[C@H](N)C(=O)O` | S | L-Alanine |

### How to Determine @ vs @@

1. Identify the stereocenter
2. List the four substituents in SMILES order
3. Place the 4th substituent (often H) in back
4. View 1→2→3: counterclockwise = `@`, clockwise = `@@`

**Practical tip**: For common molecules, use the examples above as templates and modify them.

### Alkene Stereochemistry (E/Z or cis/trans)

Use `/` and `\` to specify geometry around double bonds.

**The System**:
```
    H    CH₃         H    H
     \  /             \  /
      C=C      vs      C=C
     /  \             /  \
   CH₃   H          CH₃   CH₃

  trans (E)          cis (Z)
  C/C=C/C           C/C=C\C
```

| SMILES | Geometry | Name |
|--------|----------|------|
| `C/C=C/C` | E (trans) | (E)-2-Butene |
| `C/C=C\C` | Z (cis) | (Z)-2-Butene |
| `C/C=C/CC` | E | (E)-2-Pentene |
| `C/C=C\CC` | Z | (Z)-2-Pentene |

**Memory aid**:
- Same direction (`/C=C/` or `\C=C\`) = trans (E)
- Opposite direction (`/C=C\` or `\C=C/`) = cis (Z)

### Complex Stereochemistry Examples

| SMILES | Description |
|--------|-------------|
| `C/C=C/[C@H](O)C` | (E)-alkene with (R) stereocenter |
| `C[C@H]1CCCCC1` | (R)-methylcyclohexane |
| `C[C@H]1CCCC[C@@H]1C` | trans-1,2-Dimethylcyclohexane |
| `C[C@H]1CCCC[C@H]1C` | cis-1,2-Dimethylcyclohexane |

---

## Functional Groups Reference

### Alkyl Halides

| Name | SMILES | Type |
|------|--------|------|
| Methyl bromide | `CBr` | Methyl |
| Ethyl bromide | `CCBr` | Primary (1°) |
| 1-Bromopropane | `CCCBr` | Primary (1°) |
| 2-Bromopropane | `CC(Br)C` | Secondary (2°) |
| 2-Bromobutane | `CC(Br)CC` | Secondary (2°) |
| t-Butyl bromide | `CC(C)(C)Br` | Tertiary (3°) |
| Bromocyclohexane | `BrC1CCCCC1` | Secondary (2°) |

### Alcohols

| Name | SMILES | Type |
|------|--------|------|
| Methanol | `CO` | Methyl |
| Ethanol | `CCO` | Primary (1°) |
| 1-Propanol | `CCCO` | Primary (1°) |
| 2-Propanol | `CC(O)C` | Secondary (2°) |
| t-Butanol | `CC(C)(C)O` | Tertiary (3°) |
| Cyclohexanol | `OC1CCCCC1` | Secondary (2°) |

### Alkenes

| Name | SMILES | Substitution |
|------|--------|--------------|
| Ethene | `C=C` | Unsubstituted |
| Propene | `CC=C` | Monosubstituted |
| 1-Butene | `CCC=C` | Monosubstituted |
| 2-Butene (E) | `C/C=C/C` | Disubstituted |
| 2-Butene (Z) | `C/C=C\C` | Disubstituted |
| Isobutene | `CC(=C)C` | Disubstituted |
| 2-Methyl-2-butene | `CC(C)=CC` | Trisubstituted |
| Tetramethylethene | `CC(C)=C(C)C` | Tetrasubstituted |

### Carboxylic Acids and Derivatives

| Name | SMILES | Type |
|------|--------|------|
| Formic acid | `C(=O)O` | Carboxylic acid |
| Acetic acid | `CC(=O)O` | Carboxylic acid |
| Acetaldehyde | `CC=O` | Aldehyde |
| Acetone | `CC(=O)C` | Ketone |
| Methyl acetate | `CC(=O)OC` | Ester |

### Amines

| Name | SMILES | Type |
|------|--------|------|
| Methylamine | `CN` | Primary (1°) |
| Ethylamine | `CCN` | Primary (1°) |
| Dimethylamine | `CNC` | Secondary (2°) |
| Trimethylamine | `CN(C)C` | Tertiary (3°) |

---

## Viewer-Specific Examples

### Chair Conformation Viewer

Best molecules for chair analysis:

| SMILES | Name | Why Interesting |
|--------|------|-----------------|
| `CC1CCCCC1` | Methylcyclohexane | Simple axial/equatorial |
| `CC1CCC(C)CC1` | 1,3-Dimethylcyclohexane | cis/trans isomers |
| `C[C@H]1CCCC[C@@H]1C` | trans-1,2-Dimethyl | Diaxial strain |
| `CC(C)C1CCCCC1` | Isopropylcyclohexane | Bulky substituent |
| `CC(C)(C)C1CCCCC1` | t-Butylcyclohexane | Locks conformation |

### Reaction Energy Diagram

Molecules for mechanism analysis:

| SMILES | Name | Expected Mechanism |
|--------|------|-------------------|
| `CCBr` | Ethyl bromide | SN2 (primary) |
| `CC(Br)C` | 2-Bromopropane | SN2 or E2 |
| `CC(C)(C)Br` | t-Butyl bromide | SN1/E1 (tertiary) |
| `CC(Br)CC` | 2-Bromobutane | Competition |

### Alkene Stability Viewer

Compare stabilities:

| SMILES | Substitution | Relative Stability |
|--------|--------------|-------------------|
| `C=C` | Unsubstituted | Lowest |
| `CC=C` | Mono | Low |
| `C/C=C/C` | Di (E) | Medium |
| `C/C=C\C` | Di (Z) | Medium (less than E) |
| `CC(C)=CC` | Tri | High |
| `CC(C)=C(C)C` | Tetra | Highest |

### Stereochemistry Tracker

Chiral molecules for SN1/SN2 analysis:

| SMILES | Name | Configuration |
|--------|------|---------------|
| `CC[C@@H](Br)C` | (R)-2-Bromobutane | R |
| `CC[C@H](Br)C` | (S)-2-Bromobutane | S |
| `C[C@@H](Br)CC` | (R)-2-Bromobutane | R (same) |
| `CC[C@H](Cl)C` | (S)-2-Chlorobutane | S |
| `C[C@@H](O)C(=O)O` | (R)-Lactic acid | R |

---

## Common Mistakes

### 1. Capitalization Errors

| Wrong | Right | Element |
|-------|-------|---------|
| `CL` | `Cl` | Chlorine |
| `cl` | `Cl` | Chlorine |
| `BR` | `Br` | Bromine |
| `br` | `Br` | Bromine |

### 2. Forgetting Ring Closure Numbers

| Wrong | Right | Problem |
|-------|-------|---------|
| `CCCCCC` | `C1CCCCC1` | Not a ring, just hexane |
| `C1CCCCC` | `C1CCCCC1` | Ring never closes |
| `C1CCCCC2` | `C1CCCCC1` | Mismatched numbers |

### 3. Missing Brackets for Stereocenters

| Wrong | Right | Problem |
|-------|-------|---------|
| `CC@HC` | `C[C@H]C` | @ needs brackets |
| `CC@@HBrC` | `C[C@@H](Br)C` | @@ needs brackets |

### 4. Wrong E/Z Direction

| Wrong Effect | SMILES | Actual Geometry |
|--------------|--------|-----------------|
| Wanted trans, got cis | `C/C=C\C` | This IS cis (Z) |
| Wanted cis, got trans | `C/C=C/C` | This IS trans (E) |

**Remember**: Same slash direction = trans, opposite = cis

### 5. Branch Attachment Confusion

| SMILES | Actual Structure |
|--------|------------------|
| `CC(C)C` | Isobutane (branch on C2) |
| `C(C)CC` | Same as `CCCC` (butane) |
| `CCC(C)` | Same as `CC(C)C` |

The branch attaches to the atom **immediately before** the parenthesis.

### 6. Aromatic Lowercase Confusion

| SMILES | Meaning |
|--------|---------|
| `c1ccccc1` | Benzene (aromatic) |
| `C1CCCCC1` | Cyclohexane (not aromatic!) |
| `C1=CC=CC=C1` | Benzene (explicit double bonds) |

---

## Quick Reference

### Bond Symbols

| Symbol | Bond Type |
|--------|-----------|
| (none) | Single |
| `-` | Single (explicit) |
| `=` | Double |
| `#` | Triple |
| `:` | Aromatic |

### Special Characters

| Symbol | Meaning |
|--------|---------|
| `()` | Branch |
| `[]` | Atom with special properties |
| `1-9` | Ring closure |
| `@` | Counterclockwise stereocenter |
| `@@` | Clockwise stereocenter |
| `/` | Up bond (E/Z) |
| `\` | Down bond (E/Z) |

### Common Functional Groups

| Group | SMILES Fragment |
|-------|-----------------|
| Hydroxyl | `O` or `(O)` |
| Carbonyl | `=O` or `(=O)` |
| Carboxyl | `C(=O)O` |
| Amino | `N` or `(N)` |
| Halide | `Br`, `Cl`, `F`, `I` |
| Methyl | `C` or `(C)` |
| Ethyl | `CC` or `(CC)` |

### Molecule Templates

**Copy-paste these for common structures:**

```
Cyclohexane:        C1CCCCC1
Methylcyclohexane:  CC1CCCCC1
Benzene:            c1ccccc1
Ethanol:            CCO
Acetone:            CC(=O)C
2-Bromobutane (R):  CC[C@@H](Br)C
2-Bromobutane (S):  CC[C@H](Br)C
trans-2-Butene:     C/C=C/C
cis-2-Butene:       C/C=C\C
```

---

## Need Help Building SMILES?

Use the **SMILES Builder** tool! Click the "Build" button next to any SMILES input field to access:

- **Template Library**: Click on common molecules
- **Dropdown Builder**: Select options from menus
- **Guided Wizard**: Step-by-step questions
- **Visual Editor**: Draw your molecule

---

*← [Back to Index](index.md)*
