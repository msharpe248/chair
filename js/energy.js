/**
 * Energy Calculations for Chair Conformations
 *
 * Calculates conformational energy based on 1,3-diaxial interactions
 * using A-values (kcal/mol).
 */

// A-values in kcal/mol - represents the energy penalty for having
// a substituent in the axial position vs equatorial
const A_VALUES = {
  'H': 0,
  'D': 0.006,
  'F': 0.15,
  'Cl': 0.43,
  'Br': 0.38,
  'I': 0.43,
  'OH': 0.87,
  'OCH3': 0.60,
  'OAc': 0.60,
  'NH2': 1.23,
  'NMe2': 1.50,
  'CH3': 1.74,
  'C2H5': 1.79,
  'iPr': 2.15,
  'tBu': 4.90,
  'Ph': 2.80,
  'CN': 0.17,
  'NO2': 1.10,
  'COOH': 1.35,
  'COOMe': 1.25,
  'CHO': 0.56
};

/**
 * Get the A-value for a substituent
 * @param {string} group - Substituent group name
 * @returns {number} A-value in kcal/mol
 */
export function getAValue(group) {
  return A_VALUES[group] ?? 0;
}

/**
 * Calculate the total strain energy for a conformation
 *
 * The A-value represents the energy difference between axial and equatorial
 * positions. When a substituent is axial, it experiences 1,3-diaxial interactions
 * with axial hydrogens (or other substituents) at positions 2 carbons away.
 *
 * @param {Object} state - Molecule state
 * @param {boolean} flipped - Whether to calculate for the flipped conformation
 * @returns {number} Total strain energy in kcal/mol
 */
export function calculateStrainEnergy(state, flipped = false) {
  let totalStrain = 0;

  for (const sub of state.substituents) {
    // Determine the actual position in this conformation
    // If flipped, axial becomes equatorial and vice versa
    const actualPosition = flipped
      ? (sub.position === 'axial' ? 'equatorial' : 'axial')
      : sub.position;

    // Add A-value if substituent is in axial position
    if (actualPosition === 'axial') {
      totalStrain += getAValue(sub.group);
    }
  }

  return totalStrain;
}

/**
 * Compare the energies of both chair conformations
 * @param {Object} state - Molecule state
 * @returns {Object} Comparison result
 */
export function compareConformations(state) {
  const energyCurrent = calculateStrainEnergy(state, state.flipped);
  const energyFlipped = calculateStrainEnergy(state, !state.flipped);

  const deltaE = Math.abs(energyCurrent - energyFlipped);
  const preferred = energyCurrent <= energyFlipped ? 'current' : 'flipped';

  // Calculate equilibrium ratio using Boltzmann distribution
  // K = exp(-ΔG/RT) where R = 1.987 cal/(mol·K) and T = 298K (25°C)
  // For kcal/mol: K = exp(-1000 * ΔE / (1.987 * 298)) = exp(-ΔE / 0.592)
  const RT = 0.592; // kcal/mol at 298K
  let percentPreferred;

  if (deltaE < 0.001) {
    percentPreferred = 50;
  } else {
    const K = Math.exp(deltaE / RT);
    percentPreferred = (K / (K + 1)) * 100;
  }

  return {
    energyCurrent,
    energyFlipped,
    deltaE,
    preferred,
    percentPreferred: Math.round(percentPreferred)
  };
}

/**
 * Get a text description of the preferred conformation
 * @param {Object} comparison - Result from compareConformations
 * @returns {string} Human-readable description
 */
export function getPreferredDescription(comparison) {
  if (comparison.deltaE < 0.01) {
    return 'Neither (equal energy)';
  }

  const chairName = comparison.preferred === 'current' ? 'Current' : 'Flipped';
  return `${chairName} (${comparison.percentPreferred}%)`;
}

/**
 * Format energy value for display
 * @param {number} energy - Energy in kcal/mol
 * @returns {string} Formatted string
 */
export function formatEnergy(energy) {
  return energy.toFixed(2) + ' kcal/mol';
}

/**
 * Get all available substituents with their A-values
 * @returns {Array} Array of {group, aValue} objects
 */
export function getAvailableSubstituents() {
  return Object.entries(A_VALUES).map(([group, aValue]) => ({
    group,
    aValue
  }));
}
