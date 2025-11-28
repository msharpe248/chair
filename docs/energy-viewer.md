# Using the Energy Diagram Viewer

The Reaction Energy Diagram Viewer helps you visualize and understand reaction energy profiles for common organic chemistry mechanisms.

## Accessing the Energy Viewer

1. Use the **dropdown menu** in the top-left corner of the header
2. Select **"Reaction Energy Diagram"** from the list
3. The interface will switch to the energy diagram viewer

## Viewer Modes

The energy viewer has three main modes, accessible via the toggle buttons:

### Conditions Mode (Default)

Predict reaction mechanisms based on reaction conditions.

#### Input Parameters

| Parameter | Options | Effect |
|-----------|---------|--------|
| **Substrate** | Methyl, 1°, 2°, 3°, Allylic, Benzylic, Vinyl | Determines steric accessibility and carbocation stability |
| **Nucleophile/Base** | Strong small, Strong normal, Strong bulky, Weak, None | Affects mechanism rate and type |
| **Leaving Group** | Excellent, Good, Moderate, Poor | Better LG = faster reaction |
| **Solvent** | Polar aprotic, Polar protic, Nonpolar | Affects ion solvation and nucleophilicity |
| **Temperature** | Low, Room, Elevated, High | Higher T favors elimination |

#### How It Works

1. **Select your conditions** using the dropdown menus
2. The prediction **updates automatically** as you change conditions
3. View the **probability bars** showing likelihood of each mechanism
4. Read the **explanation** of why the predicted mechanism is favored

#### Understanding the Prediction Panel

```
┌─────────────────────────────┐
│  SN2            65% likely  │  ← Primary prediction
├─────────────────────────────┤
│ SN2  ████████████░░░  65%   │  ← Mechanism probabilities
│ SN1  ██░░░░░░░░░░░░░  10%   │
│ E2   █████░░░░░░░░░░  20%   │
│ E1   █░░░░░░░░░░░░░░   5%   │
├─────────────────────────────┤
│ Why this mechanism?         │
│ • Primary substrate allows  │
│   backside attack           │
│ • Strong nucleophile drives │
│   SN2 mechanism             │
└─────────────────────────────┘
```

#### Show All Competing

Click **"Show All Competing"** to overlay energy diagrams for all mechanisms with >10% probability. This helps visualize:
- Which pathway has the lowest activation energy
- Why certain mechanisms are kinetically favored
- How close the competition is between pathways

### SMILES Mode

Analyze reactions by entering reactant and product structures in SMILES notation.

#### What is SMILES?

SMILES (Simplified Molecular Input Line Entry System) is a text representation of molecular structures:

| Molecule | SMILES |
|----------|--------|
| Ethane | CC |
| Bromoethane | CCBr |
| Ethanol | CCO |
| Propene | CC=C |
| tert-Butyl bromide | CC(C)(C)Br |

#### Using SMILES Mode

1. **Enter the reactant SMILES** in the first field (e.g., `CCBr`)
2. **Enter the product SMILES** in the second field (e.g., `CCO`)
3. Click **"Analyze Reaction"**

#### What the Analysis Shows

The viewer will:
- **Classify the reaction type** (substitution, elimination, addition)
- **Identify bonds broken and formed**
- **Calculate estimated ΔH** from bond dissociation energies
- **Generate an energy diagram** based on the reaction type

#### Built-in Examples

Use the **Examples** dropdown to load common reactions:
- **SN2**: CCBr → CCO (bromoethane to ethanol)
- **SN1**: CC(C)(C)Br → CC(C)(C)O (tert-butyl bromide)
- **E2**: CC(Br)C → CC=C (2-bromopropane to propene)
- **Hydrogenation**: CC=CC → CCCC (2-butene to butane)

### Preset Mode

Quickly view standard energy diagram shapes without calculations.

#### Available Presets

| Preset | Steps | Description |
|--------|-------|-------------|
| SN2 | 1 | Single TS, concerted backside attack |
| SN1 | 2 | Two TS, carbocation intermediate |
| E2 | 1 | Single TS, concerted elimination |
| E1 | 2 | Two TS, carbocation intermediate |
| Hydrogenation | 1 | Single TS, highly exothermic |
| Exothermic | 1 | Generic downhill reaction |
| Endothermic | 1 | Generic uphill reaction |
| **Custom** | 1-2 | **Interactive, adjustable diagram** |

#### Comparing Presets

1. Select a preset from the dropdown
2. Click **"+ Add Curve"** to overlay additional reactions
3. Each curve appears in a different color with a legend
4. Compare Ea values and reaction profiles visually

### Custom (Interactive) Mode

Create your own energy diagrams with adjustable parameters.

#### Using Custom Mode

1. Select **"Custom (adjustable)"** from the Preset dropdown
2. The **slider controls** will appear:
   - **Activation Energy (Ea)**: Adjust the height of the transition state (5-40 kcal/mol)
   - **ΔH (Product Energy)**: Set the energy of products relative to reactants (-30 to +20 kcal/mol)
   - **Two-step mechanism**: Toggle to add an intermediate and second transition state

#### Interactive Dragging

You can also **drag the points directly** on the diagram:
- **Drag the TS point** up/down to adjust activation energy
- **Drag the Product point** to change ΔH
- For two-step mechanisms, drag the **Intermediate** and **TS2** points

The sliders update automatically as you drag, and vice versa.

#### Two-Step Mechanisms

When enabled:
- **Intermediate Energy**: Set the energy of the carbocation/intermediate
- **Second Ea**: Set the activation energy for the second step (relative to intermediate)

This is useful for understanding:
- How intermediate stability affects the reaction profile
- Why the first step is typically rate-determining in SN1/E1

## Quiz Mode

Test your understanding of reaction energy diagrams.

### Accessing Quiz Mode

Click the **"Quiz Mode"** button in the header (turns green when active).

### Question Types

1. **Identify Mechanism from Diagram**
   - View an unlabeled energy diagram
   - Select whether it's SN1, SN2, E1, or E2
   - Learn to recognize one-step vs two-step profiles

2. **Predict from Conditions**
   - Given reaction conditions (substrate + reagent + solvent)
   - Predict which mechanism will dominate
   - Apply your knowledge of mechanism selection rules

3. **Compare Activation Energies**
   - View two reaction profiles
   - Identify which reaction is faster (lower Ea)
   - Understand factors affecting reaction rates

4. **Exothermic vs Endothermic**
   - Analyze the energy diagram
   - Determine if ΔH is positive or negative
   - Practice reading thermodynamic information from diagrams

### Quiz Features

- **Score tracking**: See your correct/total answers
- **Immediate feedback**: Learn from explanations after each question
- **Visual learning**: Diagrams reinforce the concepts

## Reading Energy Diagrams

### One-Step Mechanisms (SN2, E2)

```
    Energy
      ↑       ╭──╮ ← Transition State
      │      ╱    ╲
      │     ╱  Ea  ╲
      │    ╱   ↓    ╲
      │ SM ──────────╲
      │                ╲── P
      │                ↑
      │               ΔH
      └─────────────────→
         Reaction Progress
```

**Characteristics:**
- Single peak (one transition state)
- Smooth curve from reactants to products
- Ea measured from SM to TS
- ΔH measured from SM to P

### Two-Step Mechanisms (SN1, E1)

```
    Energy
      ↑    ╭──╮ TS1       ╭─╮ TS2
      │   ╱    ╲         ╱   ╲
      │  ╱ Ea1  ╲       ╱Ea2  ╲
      │ ╱   ↓    ╲ Int ╱   ↓   ╲
      │SM         ╲___╱         ╲── P
      │           ↑
      │      Intermediate
      └───────────────────────────→
```

**Characteristics:**
- Two peaks (two transition states)
- Valley between peaks = intermediate (carbocation)
- First step usually rate-determining (higher Ea1)
- Second step usually fast (lower Ea2)

### Labels on the Diagram

| Label | Meaning |
|-------|---------|
| SM | Starting Materials (reactants) |
| TS / TS1 / TS2 | Transition State(s) |
| Int | Intermediate |
| P | Products |
| Ea | Activation Energy (shown with dashed line) |

## Tips for Learning

### Recognizing Mechanisms

- **One peak** = concerted (SN2 or E2)
- **Two peaks** = stepwise with intermediate (SN1 or E1)
- **ΔH < 0** (products lower) = exothermic
- **ΔH > 0** (products higher) = endothermic

### Predicting Mechanisms

Remember the key factors:
1. **Substrate structure** is often most important
2. **Strong nucleophile** → SN2/E2 more likely
3. **Weak/no nucleophile** → SN1/E1 more likely
4. **Bulky base** → E2 over SN2
5. **High temperature** → elimination over substitution
6. **Polar aprotic** → enhances nucleophile strength
7. **Polar protic** → stabilizes carbocations

### Common Mistakes

- Forgetting that 3° substrates **cannot** do SN2
- Ignoring solvent effects on mechanism choice
- Not considering temperature's effect on S vs E competition
- Confusing Ea (activation energy) with ΔH (enthalpy change)

## Export Options

The energy diagram can be exported:
- **PNG**: Click the 📷 PNG button for an image file
- **SVG**: Click the 📄 SVG button for a scalable vector graphic

Exports are useful for:
- Including diagrams in reports or presentations
- Printing study materials
- Sharing with classmates

---

*← [Reaction Energy Theory](energy-theory.md) | [Back to Index](index.md) →*
