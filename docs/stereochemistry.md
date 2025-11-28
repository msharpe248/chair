# Stereochemistry Tracker Guide

## Understanding Stereochemistry in Reactions

Stereochemistry plays a crucial role in organic reactions. The Stereochemistry Tracker helps you understand how configuration changes (or doesn't change) during SN1 and SN2 reactions.

## R and S Configuration

The R/S system (Cahn-Ingold-Prelog rules) assigns absolute configuration to stereocenters:

1. **Rank substituents** by atomic number (highest = 1)
2. **Orient** the lowest priority group away from you
3. **Trace** 1→2→3:
   - **Clockwise** = R (rectus, Latin for "right")
   - **Counterclockwise** = S (sinister, Latin for "left")

## SN2 Reactions: Walden Inversion

### Mechanism

SN2 is a **concerted** reaction - bond breaking and forming happen simultaneously:

```
       Nu⁻                Nu
         \               /
          ↘            ↙
      R₂---C---LG → R₂---C    + LG⁻
         /              \
        R₁              R₁
```

### Key Points

1. **Backside attack**: Nucleophile attacks 180° from leaving group
2. **One-step**: No intermediate formed
3. **Complete inversion**: (R) → (S) or (S) → (R)
4. **Optically active product**: If starting material was optically active, product is too

### Stereochemical Outcome

| Starting Material | Product |
|------------------|---------|
| (R)-substrate | (S)-product |
| (S)-substrate | (R)-product |

## SN1 Reactions: Racemization

### Mechanism

SN1 is a **two-step** reaction with a carbocation intermediate:

```
Step 1: R₂---C---LG → R₂---C⁺ + LG⁻
              |             (planar)
             R₁

Step 2: Nu⁻ attacks from either face:
              Nu
              |
        R₂---C   (50%)
             |
            R₁

        or

             R₁
              |
        R₂---C    (50%)
              |
             Nu
```

### Key Points

1. **Carbocation intermediate**: sp² hybridized, planar
2. **Two faces**: Nucleophile can attack from either side
3. **Equal probability**: 50% attack from each face
4. **Racemization**: Product is a 50:50 mixture of R and S

### Stereochemical Outcome

| Starting Material | Product |
|------------------|---------|
| (R)-substrate | 50% (R) + 50% (S) = Racemic |
| (S)-substrate | 50% (R) + 50% (S) = Racemic |

**Result**: Racemic mixture is NOT optically active

## Enantiomers

Enantiomers are **non-superimposable mirror images**:

- Opposite configuration at **all** stereocenters
- Same physical properties (mp, bp, solubility)
- Opposite optical rotation (+/−)
- Same reactivity with achiral reagents
- Different reactivity with chiral reagents

## Diastereomers

Diastereomers are stereoisomers that are **NOT mirror images**:

- Different configuration at **some** (not all) stereocenters
- Different physical properties
- Different reactivity
- Can sometimes include meso compounds

## Using the Stereochemistry Tracker

### Modes

1. **SN2 Inversion**: Visualize the Walden inversion mechanism
   - See backside attack with clear curved arrows
   - Watch configuration invert through transition state
   - Understand why product is optically active

2. **SN1 Racemization**: Visualize racemization
   - See planar carbocation intermediate (sp² geometry)
   - Watch nucleophile attack from both faces (top and bottom)
   - Branching arrows show both pathways leading to 50/50 products
   - Understand why product is racemic

3. **Enantiomers**: Compare R and S enantiomers
   - See mirror relationship
   - Understand properties

4. **Diastereomers**: Compare stereoisomers
   - See structural differences
   - Understand why properties differ

### Controls

- **Mode**: Select SN2, SN1, or stereoisomer comparison
- **Substrate**: Choose a preset molecule
- **Configuration**: Toggle between R and S starting material

### SMILES Input

Analyze your own chiral molecules using SMILES notation:

1. **Enter a SMILES string** in the input field (e.g., `CC[C@@H](Br)C`)
2. **Click "Analyze"** to see stereochemical analysis
3. **Use stereochemistry notation**:
   - `@` = S configuration (counterclockwise)
   - `@@` = R configuration (clockwise)

**Examples:**
- `CC[C@@H](Br)C` — (R)-2-bromobutane
- `CC[C@H](Br)C` — (S)-2-bromobutane
- `C[C@@H](O)C(=O)O` — (R)-lactic acid
- `C[C@H](N)C(=O)O` — L-alanine

The analyzer will identify:
- Stereocenters and their configurations
- Leaving groups (Br, Cl, I, OTs, OMs)
- Predicted SN1 and SN2 outcomes

### Quiz Mode

Test your understanding with questions about:
- SN2 stereochemical outcomes
- SN1 racemization
- Identifying stereoisomer relationships
- Meso compound identification

## Key Concepts Summary

| Reaction | Intermediate | Outcome | Optical Activity |
|----------|-------------|---------|-----------------|
| SN2 | None (concerted) | Inversion | Maintained |
| SN1 | Planar carbocation | Racemization | Lost |

## Common Mistakes

1. **Confusing SN1 and SN2 outcomes**
   - SN2 = inversion (optically active)
   - SN1 = racemization (racemic)

2. **Forgetting carbocation geometry**
   - sp² = planar = two faces for attack

3. **Mixing up retention and inversion**
   - SN2 NEVER has retention
   - SN1 has 50% retention, 50% inversion

## Exam Tips

1. For SN2: The answer is always "complete inversion"
2. For SN1: The answer is always "racemization" or "50:50 mixture"
3. If a product is optically active: it was NOT an SN1 reaction
4. If a product is racemic: it WAS an SN1 reaction (or started racemic)

---

*← [Back to Index](index.md) | [Alkene Stability](alkene-stability.md) →*
