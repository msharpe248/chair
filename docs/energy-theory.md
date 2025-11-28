# Reaction Energy Diagram Theory

## Introduction to Energy Diagrams

Reaction energy diagrams (also called reaction coordinate diagrams or potential energy diagrams) show how the energy of a chemical system changes as a reaction progresses from reactants to products.

### What the Diagram Shows

```
    Energy
      ↑       ╭──╮ ← Transition State (TS)
      │      ╱    ╲
      │     ╱      ╲  Ea (activation energy)
      │    ╱        ╲ ↓
      │ SM ──────────╲
      │                ╲
      │                 ╲── P (products)
      │                    ↑
      │                   ΔH (enthalpy change)
      └─────────────────────────→
              Reaction Progress
```

- **X-axis (Reaction Coordinate)**: Progress from reactants to products
- **Y-axis (Energy)**: Potential energy of the system
- **SM**: Starting Materials (reactants)
- **TS**: Transition State (highest energy point)
- **P**: Products

## Key Thermodynamic Parameters

### Activation Energy (Ea)

The **activation energy** is the energy barrier that must be overcome for a reaction to proceed.

```
Ea = E(transition state) - E(reactants)
```

**Key points about Ea:**
- Higher Ea = slower reaction (fewer molecules have enough energy)
- Lower Ea = faster reaction
- Ea is always positive
- Catalysts lower Ea without changing ΔH

### Enthalpy Change (ΔH)

The **enthalpy change** is the difference in energy between products and reactants.

```
ΔH = E(products) - E(reactants)
```

| ΔH Value | Reaction Type | Products vs Reactants |
|----------|---------------|----------------------|
| Negative | Exothermic | Products lower in energy |
| Positive | Endothermic | Products higher in energy |
| Zero | Thermoneutral | Same energy |

### Relationship Between Ea and ΔH

The **Hammond Postulate** connects these parameters:

> The transition state of a reaction resembles whichever species (reactants or products) it is closer to in energy.

**Implications:**
- **Exothermic reactions**: Early, reactant-like TS → lower Ea
- **Endothermic reactions**: Late, product-like TS → higher Ea

## Substitution Reactions: SN1 vs SN2

### SN2 Mechanism (Substitution Nucleophilic Bimolecular)

The SN2 mechanism is a **concerted, one-step** process:

```
Nu⁻ + R-LG → [Nu---R---LG]‡ → Nu-R + LG⁻
```

**Energy Diagram:**
```
    Energy
      ↑      ╭──╮ Single TS
      │     ╱    ╲
      │    ╱      ╲
      │   ╱        ╲
      │ SM          ╲── P
      └─────────────────→
```

**Characteristics:**
- **One transition state** (pentacoordinate carbon)
- Rate = k[Nu⁻][R-LG] (second order)
- **Backside attack** → inversion of configuration
- Typical Ea: 15-25 kcal/mol

**Factors Favoring SN2:**
| Factor | Favorable for SN2 |
|--------|------------------|
| Substrate | Methyl > 1° > 2° >> 3° (blocked) |
| Nucleophile | Strong, small nucleophiles |
| Solvent | Polar aprotic (DMSO, DMF, acetone) |
| Leaving group | Better LG = faster |

### SN1 Mechanism (Substitution Nucleophilic Unimolecular)

The SN1 mechanism is a **two-step** process with a carbocation intermediate:

```
Step 1: R-LG → R⁺ + LG⁻ (slow, rate-determining)
Step 2: R⁺ + Nu → R-Nu (fast)
```

**Energy Diagram:**
```
    Energy
      ↑    ╭──╮TS1        ╭─╮TS2
      │   ╱    ╲         ╱   ╲
      │  ╱      ╲       ╱     ╲
      │ ╱        ╲ Int ╱       ╲
      │SM         ╲___╱         ╲── P
      └───────────────────────────→
```

**Characteristics:**
- **Two transition states** with carbocation intermediate
- Rate = k[R-LG] (first order, nucleophile not in rate law)
- Carbocation is planar → **racemization** (or partial inversion)
- Typical Ea1: 20-30 kcal/mol (rate-determining)

**Factors Favoring SN1:**
| Factor | Favorable for SN1 |
|--------|------------------|
| Substrate | 3° > 2° >> 1° > methyl (never) |
| Nucleophile | Weak nucleophiles (or solvent) |
| Solvent | Polar protic (H₂O, ROH) |
| Leaving group | Better LG = faster |

### Carbocation Stability

The intermediate carbocation's stability is crucial for SN1:

```
Stability: 3° > 2° > 1° > methyl

     CH₃           CH₃          H            H
      |             |           |            |
CH₃─C⁺─CH₃ > CH₃─C⁺─H > CH₃─C⁺─H > H─C⁺─H
      |             |           |            |
    (3°)          (2°)        (1°)       (methyl)
```

**Resonance-stabilized carbocations:**
- Allylic: CH₂=CH-CH₂⁺ ↔ ⁺CH₂-CH=CH₂
- Benzylic: Ph-CH₂⁺ (stabilized by aromatic ring)

## Elimination Reactions: E1 vs E2

### E2 Mechanism (Elimination Bimolecular)

The E2 mechanism is a **concerted, one-step** process:

```
Base + H-C-C-LG → [B---H---C=C---LG]‡ → BH + C=C + LG⁻
```

**Energy Diagram:**
```
    Energy
      ↑       ╭──╮ Single TS
      │      ╱    ╲
      │     ╱      ╲
      │    ╱        ╲
      │ SM           ╲── P (alkene + HB + LG⁻)
      └─────────────────→
```

**Characteristics:**
- **One transition state**
- Rate = k[Base][R-LG] (second order)
- Requires **anti-periplanar** geometry (H and LG 180° apart)
- Products slightly higher in energy (ΔH often slightly positive)
- Typical Ea: 18-25 kcal/mol

**Factors Favoring E2:**
| Factor | Favorable for E2 |
|--------|------------------|
| Substrate | 3° > 2° > 1° |
| Base | Strong, bulky bases (tBuO⁻, LDA) |
| Temperature | Higher temperature favors elimination |
| Leaving group | Better LG = faster |

### E1 Mechanism (Elimination Unimolecular)

The E1 mechanism is a **two-step** process sharing the carbocation intermediate with SN1:

```
Step 1: R-LG → R⁺ + LG⁻ (slow, rate-determining)
Step 2: R⁺ → alkene + H⁺ (fast, base removes β-H)
```

**Energy Diagram:**
```
    Energy
      ↑    ╭──╮TS1          ╭─╮TS2
      │   ╱    ╲           ╱   ╲
      │  ╱      ╲         ╱     ╲
      │ ╱        ╲ Int   ╱       ╲── P
      │SM         ╲_____╱
      └───────────────────────────→
```

**Characteristics:**
- **Two transition states** with carbocation intermediate
- Rate = k[R-LG] (first order)
- No stereoelectronic requirement (unlike E2)
- Often competes with SN1
- Typical Ea1: 20-30 kcal/mol

## Predicting the Mechanism

### Decision Flowchart

```
                     Is substrate 3°?
                     /              \
                   Yes              No
                   /                  \
         Strong base?          Is substrate methyl or 1°?
         /         \                /            \
       Yes         No             Yes            No (2°)
        ↓           ↓               ↓              ↓
       E2      SN1/E1 mix        Strong Nu?    Depends on
    (major)   (heat → E1)        /      \      conditions
                               Yes      No
                                ↓        ↓
                              SN2    Borderline
                                     (SN1/SN2/E1/E2)
```

### Summary Table

| Conditions | Methyl/1° | 2° | 3° |
|------------|-----------|----|----|
| Strong Nu, polar aprotic | SN2 | SN2 (some E2) | E2 |
| Strong bulky base | E2 | E2 | E2 |
| Weak Nu, polar protic | SN2 (slow) | SN1/SN2/E1 | SN1/E1 |
| Heat, no strong Nu/base | — | E1 > SN1 | E1 > SN1 |

## Solvent Effects

### Polar Protic Solvents (H₂O, ROH)

- **Stabilize carbocations** through solvation
- **Solvate anions** (reduces nucleophilicity)
- Favor SN1/E1 mechanisms

### Polar Aprotic Solvents (DMSO, DMF, acetone)

- **Do not solvate anions** well
- **Enhance nucleophilicity** of anions
- Favor SN2/E2 mechanisms

```
Nucleophilicity in polar aprotic:
I⁻ < Br⁻ < Cl⁻ < F⁻  (opposite of protic!)

Nucleophilicity in polar protic:
F⁻ < Cl⁻ < Br⁻ < I⁻
```

## Temperature Effects

Higher temperature favors elimination over substitution due to **entropy**:

- **Substitution**: 2 molecules → 2 molecules (ΔS ≈ 0)
- **Elimination**: 2 molecules → 3 molecules (ΔS > 0)

From the Gibbs equation: ΔG = ΔH - TΔS

At higher T, the -TΔS term becomes more significant, making elimination more favorable.

## Bond Dissociation Energies

The enthalpy change (ΔH) can be estimated from bond energies:

```
ΔH ≈ Σ(bonds broken) - Σ(bonds formed)
```

| Bond | BDE (kcal/mol) |
|------|----------------|
| C-H | 99 |
| C-C | 83 |
| C=C | 146 |
| C-O | 86 |
| C-Br | 68 |
| C-Cl | 81 |
| O-H | 110 |

**Example: SN2 on bromoethane with hydroxide**
```
CH₃CH₂-Br + OH⁻ → CH₃CH₂-OH + Br⁻

Bonds broken: C-Br (68)
Bonds formed: C-O (86)

ΔH ≈ 68 - 86 = -18 kcal/mol (exothermic)
```

---

*← [Back to Index](index.md) | [Using the Energy Viewer](energy-viewer.md) →*
