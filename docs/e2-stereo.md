# E2 Stereochemistry Guide

## Introduction to E2 Eliminations

The E2 (bimolecular elimination) reaction is one of the most important reactions in organic chemistry. Understanding its stereochemical requirements is crucial for predicting reaction outcomes.

### The E2 Mechanism

In an E2 reaction:
1. A **base** attacks a β-hydrogen
2. The C-H bond breaks
3. A new **π bond** forms between the α and β carbons
4. The **leaving group** departs
5. All of this happens in **one concerted step**

```
     Base
       |
       ↓
   H---C---C---LG  →  C=C  +  Base-H  +  LG⁻
       β   α
```

## The Anti-Periplanar Requirement

The most critical requirement for E2 elimination is that the β-hydrogen and leaving group must be **anti-periplanar** (180° dihedral angle).

### Why Anti-Periplanar?

1. **Orbital Overlap**: The C-H σ bond and C-LG σ* orbital must be aligned for proper overlap
2. **Electron Flow**: Allows smooth electron flow from C-H → π bond → LG departure
3. **Concerted Mechanism**: All bond breaking/forming happens simultaneously, requiring geometric alignment

### Dihedral Angles and Elimination

| Dihedral Angle | Position | Can Eliminate? |
|----------------|----------|----------------|
| 180° | Anti-periplanar | **Yes** |
| 60° | Gauche | No |
| 0° | Syn-periplanar | Rarely (requires special conditions) |

## Newman Projection Analysis

The E2 viewer uses Newman projections to visualize the spatial relationship between β-hydrogens and leaving groups.

### Color Coding

The viewer uses color-coded highlighting:
- **Green** = Anti-periplanar (180°) — CAN eliminate
- **Orange** = Gauche (60°) — Cannot eliminate
- **Red** = Leaving group position

### Reading the Newman Projection

Looking down the Cα-Cβ bond:
- **Front carbon** = Cα (bears the leaving group)
- **Back carbon** = Cβ (bears the β-hydrogens)
- **Anti** = H directly opposite to LG (180°)
- **Gauche** = H at 60° or 300° from LG

## Zaitsev vs Hofmann Products

### Zaitsev's Rule

With most bases, the **more substituted alkene** is the major product:
- More stable due to hyperconjugation
- More substituted = lower activation energy
- **Default for small, strong bases** (NaOEt, NaOH, etc.)

### Hofmann Product

With **bulky bases**, the **less substituted alkene** becomes major:
- Bulky base cannot easily access the more hindered H
- Steric hindrance overrides thermodynamic preference
- **Bulky bases**: t-BuOK, LDA, DBU

### Example: 2-Bromobutane

```
            Zaitsev           Hofmann
              ↓                  ↓
CH₃-CH=CH-CH₃   vs   CH₂=CH-CH₂-CH₃
  (2-butene)         (1-butene)
  More substituted   Less substituted
```

- With NaOEt: 2-butene (Zaitsev) is major
- With t-BuOK: 1-butene (Hofmann) is major

## Using the E2 Viewer

### Substrate Selection

Choose from preset substrates:
- **2-Bromobutane**: Simple example with competing β-hydrogens
- **2-Bromopentane**: Larger substrate with multiple elimination options
- **Menthyl chloride**: Classic example—no anti-periplanar H in most stable chair
- **Neomenthyl chloride**: Contrasting example—anti-periplanar H available

### Base Selection

Compare outcomes with different bases:
- **Non-bulky**: NaOEt, NaOH, NaOMe
- **Bulky**: t-BuOK, LDA, DBU

### Newman Projection Display

The viewer shows:
1. The Newman projection looking down the reacting C-C bond
2. Color-coded highlighting of H positions
3. Dihedral angles for each β-hydrogen
4. Which products can form from each anti-periplanar arrangement

### Analysis Panel

The right panel displays:
- **Major product**: Based on Zaitsev/Hofmann rules
- **Minor products**: Other possible elimination products
- **Product ratios**: Approximate percentages
- **Explanation**: Why certain products are favored

## Classic Example: Menthyl vs Neomenthyl

This classic comparison demonstrates why conformation matters.

### Menthyl Chloride

In the most stable chair conformation:
- The Cl is **equatorial**
- The β-hydrogens are **not** anti-periplanar to Cl
- E2 elimination is **very slow**
- Must flip to less stable chair (or use E1)

### Neomenthyl Chloride

In the most stable chair conformation:
- The Cl is **axial**
- One β-hydrogen **is** anti-periplanar to Cl
- E2 elimination is **fast**
- Proceeds readily with base

### Rate Comparison

Neomenthyl chloride reacts approximately **200× faster** than menthyl chloride via E2, demonstrating the critical importance of the anti-periplanar requirement.

## Stereochemistry of the Alkene Product

The geometry of the starting material determines the E/Z geometry of the product.

### Anti Elimination Stereochemistry

When H and LG are anti:
- Groups on **opposite sides** of the breaking C-C bonds end up **cis** to each other
- Groups on the **same side** end up **trans** to each other

### Predicting E/Z Products

For a given substrate with specific stereochemistry:
1. Identify the anti-periplanar H
2. Note what groups are attached to Cα and Cβ
3. Groups that were on opposite sides become cis in the product
4. Groups that were on the same side become trans in the product

## Practice Tips

1. **Always draw the Newman projection** looking down the reacting bond
2. **Identify the leaving group** (usually on the front carbon)
3. **Check each β-hydrogen** for anti-periplanarity (180°)
4. **Consider the base**: bulky = Hofmann, small = Zaitsev
5. **For cyclic substrates**: Consider which chair conformation allows elimination

## Summary

| Concept | Key Point |
|---------|-----------|
| Anti-periplanar | H and LG must be at 180° dihedral |
| Zaitsev | More substituted alkene (small bases) |
| Hofmann | Less substituted alkene (bulky bases) |
| Color coding | Green = can eliminate, Orange = cannot |
| Menthyl vs Neomenthyl | Conformation determines reactivity |

## Common Mistakes to Avoid

1. **Forgetting anti-periplanar requirement**: Not all β-H's can eliminate
2. **Ignoring conformation**: In cyclic systems, the chair must be right
3. **Mixing up Zaitsev/Hofmann**: Check if the base is bulky
4. **Assuming all H's are equivalent**: Stereochemistry matters

---

*← [Back to Index](index.md) | [Chair Theory](theory.md) →*
