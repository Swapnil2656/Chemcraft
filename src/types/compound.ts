export interface Compound {
  id: string;
  name: string;
  formula: string;
  elements: CompoundElement[];
  type: CompoundType;
  properties: CompoundProperty[];
  description: string;
  uses: string[];
  color?: string;
  phase: 'solid' | 'liquid' | 'gas' | 'plasma';
  meltingPoint?: number;
  boilingPoint?: number;
  density?: number;
  solubility?: string;
  hazards?: string[];
  image?: string;
  learnMore?: string;
  pubchemUrl?: string;
  confidence?: number;
  source?: 'database' | 'rules_engine' | 'ml_model' | 'pubchem_api';
  rule_applied?: string;
  safety_warnings?: string[];
}

export interface CompoundElement {
  element: string; // Element symbol
  count: number;
}

export enum CompoundType {
  IONIC = 'ionic',
  COVALENT = 'covalent',
  METALLIC = 'metallic',
  ACID = 'acid',
  BASE = 'base',
  SALT = 'salt',
  OXIDE = 'oxide',
  ORGANIC = 'organic',
  POLYMER = 'polymer'
}

export interface CompoundProperty {
  name: string;
  value: string | number;
  unit?: string;
}

export interface MixingResult {
  success: boolean;
  compound?: Compound;
  reaction?: ChemicalReaction;
  error?: string;
  suggestions?: string[];
  confidence?: number;
  source?: 'database' | 'rules_engine' | 'ml_model' | 'pubchem_api';
  rule_applied?: string;
  safety_warnings?: string[];
}

export interface ChemicalReaction {
  reactants: string[];
  products: string[];
  type: ReactionType;
  equation: string;
  balanced: boolean;
  conditions?: string[];
  energy: number; // kJ/mol (positive = endothermic, negative = exothermic)
}

export enum ReactionType {
  SYNTHESIS = 'synthesis',
  DECOMPOSITION = 'decomposition',
  SINGLE_REPLACEMENT = 'single-replacement',
  DOUBLE_REPLACEMENT = 'double-replacement',
  COMBUSTION = 'combustion',
  ACID_BASE = 'acid-base',
  REDOX = 'redox'
}
