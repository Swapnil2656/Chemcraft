import { Element } from '@/types/element';

export interface CompoundFormation {
  formula: string;
  name: string;
  type: 'ionic' | 'covalent' | 'metallic';
  description: string;
  properties: {
    state: string;
    color: string;
    solubility: string;
  };
}

export const predictCompound = (elements: Element[]): CompoundFormation | null => {
  if (elements.length !== 2) return null;

  const [el1, el2] = elements;
  
  // Simple compound prediction logic
  if (el1.symbol === 'Na' && el2.symbol === 'Cl') {
    return {
      formula: 'NaCl',
      name: 'Sodium Chloride',
      type: 'ionic',
      description: 'Common table salt',
      properties: {
        state: 'solid',
        color: 'white',
        solubility: 'highly soluble in water'
      }
    };
  }

  if ((el1.symbol === 'H' && el2.symbol === 'O') || (el1.symbol === 'O' && el2.symbol === 'H')) {
    return {
      formula: 'H₂O',
      name: 'Water',
      type: 'covalent',
      description: 'Essential for life',
      properties: {
        state: 'liquid',
        color: 'colorless',
        solubility: 'universal solvent'
      }
    };
  }

  return null;
};

export const getCompoundColor = (compound: CompoundFormation): string => {
  const colorMap: Record<string, string> = {
    'white': '#ffffff',
    'colorless': '#f0f0f0',
    'blue': '#3b82f6',
    'green': '#10b981',
    'red': '#ef4444',
    'yellow': '#eab308'
  };

  return colorMap[compound.properties.color] || '#gray-400';
};