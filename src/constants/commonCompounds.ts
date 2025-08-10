export interface CommonCompound {
  formula: string;
  name: string;
  elements: string[];
  type: 'ionic' | 'covalent' | 'metallic';
  commonName?: string;
  uses: string[];
  properties: {
    state: 'solid' | 'liquid' | 'gas';
    color: string;
    meltingPoint?: number;
    boilingPoint?: number;
  };
}

export const COMMON_COMPOUNDS: CommonCompound[] = [
  {
    formula: 'H₂O',
    name: 'Water',
    elements: ['H', 'O'],
    type: 'covalent',
    commonName: 'Water',
    uses: ['Drinking', 'Cleaning', 'Industrial processes', 'Agriculture'],
    properties: {
      state: 'liquid',
      color: 'colorless',
      meltingPoint: 0,
      boilingPoint: 100
    }
  },
  {
    formula: 'NaCl',
    name: 'Sodium Chloride',
    elements: ['Na', 'Cl'],
    type: 'ionic',
    commonName: 'Table Salt',
    uses: ['Food seasoning', 'Food preservation', 'De-icing', 'Chemical industry'],
    properties: {
      state: 'solid',
      color: 'white',
      meltingPoint: 801,
      boilingPoint: 1465
    }
  },
  {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    elements: ['C', 'O'],
    type: 'covalent',
    uses: ['Carbonated drinks', 'Fire extinguishers', 'Dry ice', 'Photosynthesis'],
    properties: {
      state: 'gas',
      color: 'colorless',
      meltingPoint: -78.5,
      boilingPoint: -78.5
    }
  },
  {
    formula: 'NH₃',
    name: 'Ammonia',
    elements: ['N', 'H'],
    type: 'covalent',
    uses: ['Fertilizers', 'Cleaning products', 'Refrigeration', 'Chemical synthesis'],
    properties: {
      state: 'gas',
      color: 'colorless',
      meltingPoint: -77.7,
      boilingPoint: -33.3
    }
  },
  {
    formula: 'CH₄',
    name: 'Methane',
    elements: ['C', 'H'],
    type: 'covalent',
    commonName: 'Natural Gas',
    uses: ['Fuel', 'Heating', 'Electricity generation', 'Chemical feedstock'],
    properties: {
      state: 'gas',
      color: 'colorless',
      meltingPoint: -182.5,
      boilingPoint: -161.5
    }
  },
  {
    formula: 'CaCO₃',
    name: 'Calcium Carbonate',
    elements: ['Ca', 'C', 'O'],
    type: 'ionic',
    commonName: 'Limestone',
    uses: ['Construction', 'Paper production', 'Plastics', 'Pharmaceuticals'],
    properties: {
      state: 'solid',
      color: 'white',
      meltingPoint: 825
    }
  }
];

export const findCompoundByElements = (elementSymbols: string[]): CommonCompound | null => {
  return COMMON_COMPOUNDS.find(compound => 
    compound.elements.length === elementSymbols.length &&
    compound.elements.every(el => elementSymbols.includes(el))
  ) || null;
};