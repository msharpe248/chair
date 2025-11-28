/**
 * SMILES Parser for Cyclohexane Derivatives
 *
 * A focused parser that extracts cyclohexane ring substituents from SMILES strings.
 * This is not a full SMILES parser - it handles common cyclohexane patterns.
 */

// Map SMILES fragments to our substituent groups
const SUBSTITUENT_MAP = {
  'C': 'CH3',
  'CC': 'C2H5',
  'C(C)C': 'iPr',
  'C(C)(C)C': 'tBu',
  'O': 'OH',
  'OC': 'OCH3',
  'F': 'F',
  'Cl': 'Cl',
  'Br': 'Br',
  'I': 'I',
  'N': 'NH2',
  'C#N': 'CN',
  'c1ccccc1': 'Ph',
};

/**
 * Parse a SMILES string and extract cyclohexane substituents
 * @param {string} smiles - SMILES string
 * @returns {Object} { success: boolean, substituents: [], error?: string }
 */
export function parseCyclohexaneSMILES(smiles) {
  const normalized = smiles.trim();

  if (!normalized) {
    return { success: false, error: 'Empty SMILES string' };
  }

  // Check for cyclohexane ring pattern
  if (!normalized.includes('1')) {
    return { success: false, error: 'No ring detected. Use format like C1CCCCC1 for cyclohexane.' };
  }

  try {
    const substituents = parseSimpleCyclohexane(normalized);
    return { success: true, substituents };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to parse SMILES' };
  }
}

/**
 * Simple parser for cyclohexane SMILES
 * Handles patterns like: CC1CCCCC1, C1CCCCC1, C1(C)CCCCC1, etc.
 */
function parseSimpleCyclohexane(smiles) {
  const substituents = [];

  // Find the ring portion (between the two '1' markers)
  const firstRingMarker = smiles.indexOf('1');
  const lastRingMarker = smiles.lastIndexOf('1');

  if (firstRingMarker === lastRingMarker) {
    throw new Error('Invalid ring - need opening and closing markers');
  }

  // Check for substituent BEFORE the ring (e.g., "CC1CCCCC1" - methyl on C1)
  const beforeRing = smiles.substring(0, firstRingMarker);
  if (beforeRing.length > 0) {
    // Find the last carbon before the ring marker - that's C1
    // Everything before that carbon is attached to C1
    const lastCarbonBefore = beforeRing.lastIndexOf('C');
    if (lastCarbonBefore > 0) {
      const subPart = beforeRing.substring(0, lastCarbonBefore);
      const group = identifySubstituent(subPart);
      if (group) {
        substituents.push({
          carbonIndex: 0,
          position: 'equatorial',
          group: group
        });
      }
    }
  }

  // Now parse the ring portion for branches (substituents in parentheses)
  const ringPortion = smiles.substring(firstRingMarker - 1, lastRingMarker + 1);

  // Count carbons and find branches
  let carbonIndex = 0;
  let i = 0;

  while (i < ringPortion.length) {
    const char = ringPortion[i];

    if (char === 'C' && ringPortion[i + 1] !== 'l') {
      // Found a carbon - check for branch after it
      let j = i + 1;

      // Skip ring markers
      while (j < ringPortion.length && /[0-9]/.test(ringPortion[j])) {
        j++;
      }

      // Check for branch
      if (ringPortion[j] === '(') {
        // Find matching close paren
        let depth = 1;
        let k = j + 1;
        while (k < ringPortion.length && depth > 0) {
          if (ringPortion[k] === '(') depth++;
          if (ringPortion[k] === ')') depth--;
          k++;
        }
        const branchContent = ringPortion.substring(j + 1, k - 1);
        const group = identifySubstituent(branchContent);
        if (group) {
          substituents.push({
            carbonIndex: carbonIndex % 6,
            position: 'equatorial',
            group: group
          });
        }
      }

      carbonIndex++;
      i = j > i ? j : i + 1;
    } else if (char === 'C' && ringPortion[i + 1] === 'l') {
      // Chlorine attached directly
      substituents.push({
        carbonIndex: carbonIndex % 6,
        position: 'equatorial',
        group: 'Cl'
      });
      carbonIndex++;
      i += 2;
    } else if (char === 'O' || char === 'N' || char === 'F' || char === 'I') {
      // Heteroatom directly in chain (attached to previous carbon)
      // This shouldn't happen in cyclohexane ring, but handle substituent case
      i++;
    } else if (char === 'B' && ringPortion[i + 1] === 'r') {
      i += 2;
    } else {
      i++;
    }
  }

  // Also check for substituents attached with direct bonds (no parentheses)
  // Pattern: look for atoms right after ring carbons that aren't other ring carbons

  return substituents;
}

/**
 * Identify what substituent a SMILES fragment represents
 */
function identifySubstituent(fragment) {
  if (!fragment || fragment.length === 0) return null;

  // Direct matches
  if (SUBSTITUENT_MAP[fragment]) {
    return SUBSTITUENT_MAP[fragment];
  }

  // Check for common patterns
  const f = fragment.trim();

  // Halogens
  if (f === 'F') return 'F';
  if (f === 'Cl') return 'Cl';
  if (f === 'Br') return 'Br';
  if (f === 'I') return 'I';

  // Oxygen-containing
  if (f === 'O' || f === 'OH') return 'OH';
  if (f === 'OC' || f.startsWith('OC')) return 'OCH3';

  // Nitrogen-containing
  if (f === 'N' || f === 'NH2') return 'NH2';
  if (f === 'C#N' || f === 'CN') return 'CN';

  // Alkyl groups - count carbons
  const carbonCount = (f.match(/C/g) || []).length;
  const hasBranch = f.includes('(');

  if (carbonCount === 1 && !hasBranch) return 'CH3';
  if (carbonCount === 2 && !hasBranch) return 'C2H5';
  if (carbonCount === 3 && hasBranch) return 'iPr';
  if (carbonCount === 4 && hasBranch) return 'tBu';
  if (carbonCount === 3 && !hasBranch) return 'iPr'; // Linear propyl treated as iPr for simplicity
  if (carbonCount >= 4) return 'tBu';

  // Phenyl
  if (f.includes('c1ccccc1') || f.includes('c1ccc')) return 'Ph';

  // Default: if it starts with C, assume methyl
  if (f.startsWith('C')) return 'CH3';

  return null;
}

/**
 * Get example SMILES strings
 */
export function getExampleSMILES() {
  return [
    { smiles: 'C1CCCCC1', name: 'Cyclohexane' },
    { smiles: 'CC1CCCCC1', name: 'Methylcyclohexane' },
    { smiles: 'C1(C)CCCCC1', name: 'Methylcyclohexane (alt)' },
    { smiles: 'CC1CCC(C)CC1', name: '1,4-Dimethylcyclohexane' },
    { smiles: 'OC1CCCCC1', name: 'Cyclohexanol' },
    { smiles: 'FC1CCCCC1', name: 'Fluorocyclohexane' },
    { smiles: 'ClC1CCCCC1', name: 'Chlorocyclohexane' },
  ];
}
