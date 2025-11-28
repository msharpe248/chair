/**
 * Reaction Mechanism Predictor
 *
 * Predicts SN1, SN2, E1, E2 mechanisms based on reaction conditions
 * and generates appropriate energy diagram parameters.
 */

// Substrate classifications
export const SUBSTRATES = {
  methyl: { label: 'Methyl (CH₃-X)', sn2: 5, sn1: 0, e2: 1, e1: 0 },
  primary: { label: '1° Primary', sn2: 4, sn1: 1, e2: 2, e1: 0 },
  secondary: { label: '2° Secondary', sn2: 2, sn1: 2, e2: 3, e1: 2 },
  tertiary: { label: '3° Tertiary', sn2: 0, sn1: 4, e2: 4, e1: 4 },
  vinyl: { label: 'Vinyl/Aryl', sn2: 0, sn1: 0, e2: 0, e1: 0 },
  allylic: { label: 'Allylic', sn2: 3, sn1: 4, e2: 2, e1: 3 },
  benzylic: { label: 'Benzylic', sn2: 3, sn1: 4, e2: 2, e1: 3 }
};

// Nucleophile/Base classifications
export const NUCLEOPHILES = {
  strong_small: {
    label: 'Strong, small (CN⁻, I⁻, RS⁻)',
    sn2: 4, sn1: 0, e2: 1, e1: 0,
    examples: ['NaCN', 'KI', 'NaSH', 'NaN₃']
  },
  strong_normal: {
    label: 'Strong (OH⁻, RO⁻)',
    sn2: 3, sn1: 0, e2: 3, e1: 0,
    examples: ['NaOH', 'KOH', 'NaOCH₃', 'NaOEt']
  },
  strong_bulky: {
    label: 'Strong, bulky (tBuO⁻, LDA)',
    sn2: 0, sn1: 0, e2: 5, e1: 0,
    examples: ['KOtBu', 'LDA', 'DBU']
  },
  weak: {
    label: 'Weak (H₂O, ROH)',
    sn2: 1, sn1: 3, e2: 0, e1: 2,
    examples: ['H₂O', 'CH₃OH', 'EtOH']
  },
  none: {
    label: 'None / Very weak',
    sn2: 0, sn1: 2, e2: 0, e1: 3,
    examples: ['Heat only', 'Neutral conditions']
  }
};

// Leaving group quality
export const LEAVING_GROUPS = {
  excellent: {
    label: 'Excellent (OTs, OMs, I⁻)',
    factor: 1.3,
    examples: ['Tosylate', 'Mesylate', 'Iodide', 'Triflate']
  },
  good: {
    label: 'Good (Br⁻, Cl⁻)',
    factor: 1.0,
    examples: ['Bromide', 'Chloride']
  },
  moderate: {
    label: 'Moderate (F⁻, OAc)',
    factor: 0.6,
    examples: ['Fluoride', 'Acetate']
  },
  poor: {
    label: 'Poor (OH, OR, NH₂)',
    factor: 0.1,
    examples: ['Hydroxyl', 'Alkoxy', 'Amino']
  }
};

// Solvent effects
export const SOLVENTS = {
  polar_aprotic: {
    label: 'Polar aprotic (DMSO, DMF, acetone)',
    sn2: 3, sn1: -1, e2: 2, e1: -1,
    explanation: 'Enhances nucleophilicity by not solvating anions'
  },
  polar_protic: {
    label: 'Polar protic (H₂O, MeOH, EtOH)',
    sn2: -1, sn1: 3, e2: 0, e1: 2,
    explanation: 'Stabilizes carbocation intermediates and solvates nucleophiles'
  },
  nonpolar: {
    label: 'Nonpolar (hexane, toluene)',
    sn2: 0, sn1: -2, e2: 1, e1: -2,
    explanation: 'Does not stabilize ionic intermediates'
  }
};

// Temperature effects
export const TEMPERATURES = {
  low: {
    label: 'Low (< 0°C)',
    sn2: 1, sn1: -1, e2: -1, e1: -2,
    explanation: 'Kinetic control, favors lower Ea pathway'
  },
  room: {
    label: 'Room temp (20-25°C)',
    sn2: 0, sn1: 0, e2: 0, e1: 0,
    explanation: 'Standard conditions'
  },
  elevated: {
    label: 'Elevated (50-80°C)',
    sn2: -1, sn1: 1, e2: 2, e1: 2,
    explanation: 'Favors elimination (entropy)'
  },
  high: {
    label: 'High (> 100°C)',
    sn2: -2, sn1: 1, e2: 3, e1: 3,
    explanation: 'Strongly favors elimination products'
  }
};

/**
 * Calculate mechanism scores based on conditions
 */
export function predictMechanism(conditions) {
  const { substrate, nucleophile, leavingGroup, solvent, temperature } = conditions;

  const sub = SUBSTRATES[substrate] || SUBSTRATES.secondary;
  const nuc = NUCLEOPHILES[nucleophile] || NUCLEOPHILES.weak;
  const lg = LEAVING_GROUPS[leavingGroup] || LEAVING_GROUPS.good;
  const solv = SOLVENTS[solvent] || SOLVENTS.polar_protic;
  const temp = TEMPERATURES[temperature] || TEMPERATURES.room;

  // Calculate raw scores
  let scores = {
    sn2: sub.sn2 + nuc.sn2 + solv.sn2 + temp.sn2,
    sn1: sub.sn1 + nuc.sn1 + solv.sn1 + temp.sn1,
    e2: sub.e2 + nuc.e2 + solv.e2 + temp.e2,
    e1: sub.e1 + nuc.e1 + solv.e1 + temp.e1
  };

  // Apply leaving group factor
  Object.keys(scores).forEach(key => {
    scores[key] *= lg.factor;
  });

  // Special rules
  // Vinyl/aryl cannot do SN1 or SN2
  if (substrate === 'vinyl') {
    scores.sn1 = -10;
    scores.sn2 = -10;
  }

  // Methyl cannot do E1 (no β-hydrogens meaningfully)
  if (substrate === 'methyl') {
    scores.e1 = -10;
    scores.e2 = -5;
  }

  // Poor leaving group blocks most reactions
  if (leavingGroup === 'poor') {
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(scores[key], 0);
    });
  }

  // Normalize to percentages
  const minScore = Math.min(...Object.values(scores));
  const adjustedScores = {};
  Object.keys(scores).forEach(key => {
    adjustedScores[key] = Math.max(0, scores[key] - minScore + 0.1);
  });

  const total = Object.values(adjustedScores).reduce((a, b) => a + b, 0);
  const percentages = {};
  Object.keys(adjustedScores).forEach(key => {
    percentages[key] = total > 0 ? Math.round((adjustedScores[key] / total) * 100) : 0;
  });

  // Determine primary and secondary mechanisms
  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];
  const secondary = sorted[1];

  return {
    scores: percentages,
    primary: { mechanism: primary[0], percentage: primary[1] },
    secondary: secondary[1] > 15 ? { mechanism: secondary[0], percentage: secondary[1] } : null,
    rawScores: scores,
    conditions: { substrate, nucleophile, leavingGroup, solvent, temperature }
  };
}

/**
 * Generate energy diagram parameters for a mechanism
 */
export function getMechanismEnergy(mechanism, conditions) {
  const sub = SUBSTRATES[conditions.substrate] || SUBSTRATES.secondary;
  const lg = LEAVING_GROUPS[conditions.leavingGroup] || LEAVING_GROUPS.good;

  // Base energy parameters (kcal/mol)
  const baseParams = {
    sn2: {
      name: 'SN2',
      steps: 1,
      startE: 0,
      baseEa: 18,
      baseDeltaH: -5,
      description: 'Concerted backside attack'
    },
    sn1: {
      name: 'SN1',
      steps: 2,
      startE: 0,
      baseEa1: 22,
      baseEa2: 5,
      intermediateE: 15,
      baseDeltaH: -5,
      description: 'Carbocation intermediate'
    },
    e2: {
      name: 'E2',
      steps: 1,
      startE: 0,
      baseEa: 20,
      baseDeltaH: 2,
      description: 'Concerted anti-periplanar elimination'
    },
    e1: {
      name: 'E1',
      steps: 2,
      startE: 0,
      baseEa1: 22,
      baseEa2: 8,
      intermediateE: 15,
      baseDeltaH: 2,
      description: 'Carbocation intermediate then elimination'
    }
  };

  const base = baseParams[mechanism];
  if (!base) return null;

  // Adjust based on substrate
  let eaAdjust = 0;
  let intAdjust = 0;

  if (mechanism === 'sn2') {
    // SN2 Ea increases with steric hindrance
    if (conditions.substrate === 'methyl') eaAdjust = -3;
    if (conditions.substrate === 'primary') eaAdjust = 0;
    if (conditions.substrate === 'secondary') eaAdjust = 5;
    if (conditions.substrate === 'tertiary') eaAdjust = 15; // essentially blocked
  }

  if (mechanism === 'sn1' || mechanism === 'e1') {
    // SN1/E1 carbocation stability affects intermediate
    if (conditions.substrate === 'tertiary') intAdjust = -5;
    if (conditions.substrate === 'benzylic' || conditions.substrate === 'allylic') intAdjust = -4;
    if (conditions.substrate === 'secondary') intAdjust = 0;
    if (conditions.substrate === 'primary') intAdjust = 8;
  }

  // Leaving group affects Ea
  const lgAdjust = (1 - lg.factor) * 5;

  // Build final parameters
  if (base.steps === 1) {
    return {
      name: base.name,
      steps: 1,
      startE: 0,
      tsE: [base.baseEa + eaAdjust + lgAdjust],
      intermediateE: [],
      productE: base.baseDeltaH,
      description: base.description
    };
  } else {
    return {
      name: base.name,
      steps: 2,
      startE: 0,
      tsE: [base.baseEa1 + lgAdjust, base.baseEa2],
      intermediateE: [base.intermediateE + intAdjust],
      productE: base.baseDeltaH,
      description: base.description
    };
  }
}

/**
 * Generate explanation for why a mechanism is favored
 */
export function explainPrediction(prediction) {
  const { primary, secondary, conditions } = prediction;
  const reasons = [];

  const sub = SUBSTRATES[conditions.substrate];
  const nuc = NUCLEOPHILES[conditions.nucleophile];
  const solv = SOLVENTS[conditions.solvent];
  const temp = TEMPERATURES[conditions.temperature];
  const lg = LEAVING_GROUPS[conditions.leavingGroup];

  // Substrate effects
  if (conditions.substrate === 'tertiary') {
    if (primary.mechanism === 'sn1' || primary.mechanism === 'e1') {
      reasons.push('Tertiary substrate stabilizes carbocation intermediate');
    }
    if (primary.mechanism === 'e2') {
      reasons.push('Tertiary substrate blocks SN2, favors elimination');
    }
    reasons.push('SN2 is blocked due to steric hindrance');
  } else if (conditions.substrate === 'methyl' || conditions.substrate === 'primary') {
    if (primary.mechanism === 'sn2') {
      reasons.push(`${sub.label} substrate allows backside attack`);
    }
    reasons.push('Carbocation would be too unstable for SN1/E1');
  } else if (conditions.substrate === 'secondary') {
    reasons.push('Secondary substrate: multiple mechanisms possible');
  }

  // Nucleophile effects
  if (conditions.nucleophile === 'strong_bulky') {
    reasons.push('Bulky base favors elimination (E2) over substitution');
  } else if (conditions.nucleophile === 'strong_small' || conditions.nucleophile === 'strong_normal') {
    if (primary.mechanism === 'sn2') {
      reasons.push('Strong nucleophile drives SN2 mechanism');
    }
  } else if (conditions.nucleophile === 'weak' || conditions.nucleophile === 'none') {
    reasons.push('Weak/no nucleophile favors unimolecular mechanisms (SN1/E1)');
  }

  // Solvent effects
  if (conditions.solvent === 'polar_aprotic') {
    reasons.push('Polar aprotic solvent enhances nucleophilicity');
  } else if (conditions.solvent === 'polar_protic') {
    if (primary.mechanism === 'sn1' || primary.mechanism === 'e1') {
      reasons.push('Polar protic solvent stabilizes carbocation');
    } else {
      reasons.push('Polar protic solvent solvates nucleophile (reduces SN2 rate)');
    }
  }

  // Temperature effects
  if (conditions.temperature === 'high' || conditions.temperature === 'elevated') {
    if (primary.mechanism === 'e2' || primary.mechanism === 'e1') {
      reasons.push('High temperature favors elimination (ΔS positive)');
    }
  }

  // Leaving group
  if (conditions.leavingGroup === 'excellent') {
    reasons.push('Excellent leaving group accelerates all mechanisms');
  } else if (conditions.leavingGroup === 'poor') {
    reasons.push('Poor leaving group: reaction may require activation');
  }

  // Competition warning
  if (secondary && secondary.percentage > 25) {
    reasons.push(`⚠️ ${secondary.mechanism.toUpperCase()} is a competing pathway (${secondary.percentage}%)`);
  }

  return {
    primary: primary.mechanism.toUpperCase(),
    percentage: primary.percentage,
    reasons,
    competingMechanism: secondary
  };
}

/**
 * Get all competing mechanisms with their energy profiles
 */
export function getCompetingMechanisms(conditions, threshold = 10) {
  const prediction = predictMechanism(conditions);
  const mechanisms = [];

  Object.entries(prediction.scores).forEach(([mech, percentage]) => {
    if (percentage >= threshold) {
      const energy = getMechanismEnergy(mech, conditions);
      if (energy) {
        mechanisms.push({
          mechanism: mech,
          percentage,
          energy,
          isPrimary: mech === prediction.primary.mechanism
        });
      }
    }
  });

  // Sort by percentage descending
  mechanisms.sort((a, b) => b.percentage - a.percentage);

  return {
    mechanisms,
    explanation: explainPrediction(prediction),
    conditions
  };
}
