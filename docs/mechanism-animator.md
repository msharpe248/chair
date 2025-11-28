# Mechanism Animator Guide

## Understanding Reaction Mechanisms

Reaction mechanisms show the step-by-step electron movement during a chemical reaction. The Mechanism Animator helps you visualize these processes with curved-arrow notation and step-by-step breakdowns.

## Curved Arrow Notation

Curved arrows show electron flow:
- **Full arrows** (→): Movement of an electron pair
- **Fish-hook arrows** (⇀): Movement of a single electron (radicals)

### Key Rules
1. Arrows always point **FROM** electrons **TO** where they're going
2. Electrons flow from nucleophile to electrophile
3. Arrow tail starts at lone pair or bond
4. Arrow head points to atom or bond

## SN2 Mechanism

### Characteristics
- **Bimolecular**: Rate depends on both substrate AND nucleophile
- **Concerted**: All bonds break/form simultaneously
- **One step**: No intermediate

### Rate Law
```
Rate = k[substrate][nucleophile]
```

### Stereochemistry
- **Complete inversion** (Walden inversion)
- (R) → (S) or (S) → (R)
- Product is optically active

### Factors Favoring SN2
| Factor | SN2 Favored When... |
|--------|---------------------|
| Substrate | Primary (1°) or methyl |
| Nucleophile | Strong (CN⁻, I⁻, OH⁻) |
| Solvent | Polar aprotic (DMSO, DMF, acetone) |
| Leaving Group | Good (I⁻ > Br⁻ > Cl⁻) |

## SN1 Mechanism

### Characteristics
- **Unimolecular**: Rate depends only on substrate
- **Two steps**: Ionization, then nucleophilic attack
- **Carbocation intermediate**: sp², planar

### Rate Law
```
Rate = k[substrate]
```

### Stereochemistry
- **Racemization** (50% retention + 50% inversion)
- Planar carbocation allows attack from both faces
- Product is NOT optically active (racemic)

### Factors Favoring SN1
| Factor | SN1 Favored When... |
|--------|---------------------|
| Substrate | Tertiary (3°), allylic, benzylic |
| Nucleophile | Weak (H₂O, ROH) |
| Solvent | Polar protic (water, alcohols) |
| Leaving Group | Good (same as SN2) |

### Carbocation Stability
```
3° > 2° > 1° > methyl
Most stable → Least stable
```

## E2 Mechanism

### Characteristics
- **Bimolecular**: Rate depends on substrate AND base
- **Concerted**: All bonds break/form simultaneously
- **Anti-periplanar requirement**: H and LG must be 180° apart

### Rate Law
```
Rate = k[substrate][base]
```

### Stereochemistry
- **Anti elimination**: H and LG must be anti-periplanar
- Determines E/Z geometry of product
- No carbocation intermediate

### Product Selectivity
| Base Type | Favored Product |
|-----------|-----------------|
| Non-bulky (OH⁻, EtO⁻) | Zaitsev (more substituted alkene) |
| Bulky (tBuO⁻, LDA) | Hofmann (less substituted alkene) |

## E1 Mechanism

### Characteristics
- **Unimolecular**: Rate depends only on substrate
- **Two steps**: Ionization, then deprotonation
- **Carbocation intermediate**: Same as SN1

### Rate Law
```
Rate = k[substrate]
```

### Key Features
- No anti-periplanar requirement (unlike E2)
- Usually gives Zaitsev product
- Often competes with SN1
- Can have carbocation rearrangements

## Addition Reactions

### HBr Addition (Electrophilic Addition)

**Step 1**: π bond attacks H⁺
- Forms carbocation intermediate
- **Markovnikov's rule**: H adds to C with more H's

**Step 2**: Br⁻ attacks carbocation
- Br ends up on more substituted carbon

### Br₂ Addition (Anti Addition)

**Step 1**: Bromonium ion formation
- Cyclic three-membered ring
- Br bridges both carbons

**Step 2**: Br⁻ attacks from opposite face
- **Anti addition**: Br's end up on opposite faces
- Trans product from cis alkene

## Using the Mechanism Animator

### Controls

1. **Reaction Type**: Select from SN2, SN1, E2, E1, or addition reactions
2. **Step Navigation**: Use ◀ Prev and Next ▶ buttons to step through mechanism
3. **Show Arrows**: Toggle electron flow arrow display

### Viewing Tips

- Watch for **electron flow arrows** (red curved arrows)
- Notice **intermediate structures** (carbocations, bromonium ions)
- Pay attention to **stereochemistry changes**

### Quiz Mode

Test your understanding with questions about:
- Identifying mechanisms from conditions
- Predicting products
- Identifying intermediates
- Understanding stereochemistry

## Mechanism Decision Flowchart

```
Is the nucleophile/base strong?
├── Yes → Is the substrate primary or methyl?
│         ├── Yes → SN2
│         └── No (2° or 3°) → Is it a bulky base?
│                             ├── Yes → E2
│                             └── No → SN2/E2 competition
└── No → Is the substrate tertiary?
         ├── Yes → SN1/E1 (high temp favors E1)
         └── No → Reaction is slow or doesn't occur
```

## Common Mistakes

1. **Confusing SN2 and SN1 conditions**
   - Strong nucleophile + primary = SN2
   - Weak nucleophile + tertiary = SN1

2. **Forgetting anti-periplanar in E2**
   - E2 REQUIRES 180° dihedral between H and LG
   - Check Newman projection!

3. **Ignoring solvent effects**
   - Polar aprotic favors SN2
   - Polar protic favors SN1

4. **Markovnikov vs Anti-Markovnikov**
   - Regular HBr → Markovnikov (H to less substituted C)
   - HBr + peroxides → Anti-Markovnikov (radical mechanism)

---

*← [Back to Index](index.md) | [Stereochemistry Guide](stereochemistry.md) →*
