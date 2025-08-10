import { Element, ElementCategory } from '@/types/element';

// Get color for element category
export const getElementCategoryColor = (element: Element): string => {
  const categoryColors: Record<ElementCategory, string> = {
    [ElementCategory.ALKALI_METALS]: '#ab5cf2',
    [ElementCategory.ALKALINE_EARTH_METALS]: '#8aff00',
    [ElementCategory.TRANSITION_METALS]: '#e06633',
    [ElementCategory.POST_TRANSITION_METALS]: '#bfa6a6',
    [ElementCategory.METALLOIDS]: '#f0c8a0',
    [ElementCategory.NONMETALS]: '#ff8000',
    [ElementCategory.HALOGENS]: '#90e050',
    [ElementCategory.NOBLE_GASES]: '#b3e3f5',
    [ElementCategory.LANTHANIDES]: '#70d4ff',
    [ElementCategory.ACTINIDES]: '#70abfa',
    [ElementCategory.UNKNOWN]: '#gray'
  };

  return categoryColors[element.category] || element.color || '#gray';
};

// Format temperature with proper units
export const formatTemperature = (temp: number): string => {
  if (temp < -200) {
    return `${temp}°C`;
  }
  return `${temp}°C`;
};

// Get element position in periodic table
export const getElementPosition = (element: Element): { row: number; column: number } => {
  const atomicNumber = element.atomicNumber;

  // Period 1
  if (atomicNumber === 1) return { row: 1, column: 1 };   // H
  if (atomicNumber === 2) return { row: 1, column: 18 };  // He

  // Period 2
  if (atomicNumber === 3) return { row: 2, column: 1 };   // Li
  if (atomicNumber === 4) return { row: 2, column: 2 };   // Be
  if (atomicNumber === 5) return { row: 2, column: 13 };  // B
  if (atomicNumber === 6) return { row: 2, column: 14 };  // C
  if (atomicNumber === 7) return { row: 2, column: 15 };  // N
  if (atomicNumber === 8) return { row: 2, column: 16 };  // O
  if (atomicNumber === 9) return { row: 2, column: 17 };  // F
  if (atomicNumber === 10) return { row: 2, column: 18 }; // Ne

  // Period 3
  if (atomicNumber === 11) return { row: 3, column: 1 };  // Na
  if (atomicNumber === 12) return { row: 3, column: 2 };  // Mg
  if (atomicNumber === 13) return { row: 3, column: 13 }; // Al
  if (atomicNumber === 14) return { row: 3, column: 14 }; // Si
  if (atomicNumber === 15) return { row: 3, column: 15 }; // P
  if (atomicNumber === 16) return { row: 3, column: 16 }; // S
  if (atomicNumber === 17) return { row: 3, column: 17 }; // Cl
  if (atomicNumber === 18) return { row: 3, column: 18 }; // Ar

  // Period 4 (K to Kr)
  if (atomicNumber >= 19 && atomicNumber <= 36) {
    return { row: 4, column: atomicNumber - 18 };
  }

  // Period 5 (Rb to Xe)
  if (atomicNumber >= 37 && atomicNumber <= 54) {
    return { row: 5, column: atomicNumber - 36 };
  }

  // Period 6 (Cs to Rn)
  if (atomicNumber === 55) return { row: 6, column: 1 };  // Cs
  if (atomicNumber === 56) return { row: 6, column: 2 };  // Ba
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    // Lanthanides (La to Lu) - separate row
    return { row: 8, column: atomicNumber - 54 };
  }
  if (atomicNumber >= 72 && atomicNumber <= 86) {
    // Hf to Rn
    return { row: 6, column: atomicNumber - 68 };
  }

  // Period 7 (Fr to Og)
  if (atomicNumber === 87) return { row: 7, column: 1 };  // Fr
  if (atomicNumber === 88) return { row: 7, column: 2 };  // Ra
  if (atomicNumber >= 89 && atomicNumber <= 103) {
    // Actinides (Ac to Lr) - separate row
    return { row: 9, column: atomicNumber - 86 };
  }
  if (atomicNumber >= 104 && atomicNumber <= 118) {
    // Rf to Og
    return { row: 7, column: atomicNumber - 100 };
  }

  return { row: 1, column: 1 };
};