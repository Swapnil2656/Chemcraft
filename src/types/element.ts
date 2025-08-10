export interface Element {
  id: number;
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicWeight: number;
  category: ElementCategory;
  period: number;
  group: number;
  block: string;
  electronConfiguration: string;
  description: string;
  discoveredBy?: string;
  discoveredYear?: number;
  color: string;
  phase: 'solid' | 'liquid' | 'gas' | 'unknown';
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  electronegativity?: number;
  ionizationEnergy?: number;
  properties: string[];
  uses: string[];
}

export enum ElementCategory {
  ALKALI_METALS = 'alkali-metals',
  ALKALINE_EARTH_METALS = 'alkaline-earth-metals',
  TRANSITION_METALS = 'transition-metals',
  POST_TRANSITION_METALS = 'post-transition-metals',
  METALLOIDS = 'metalloids',
  NONMETALS = 'nonmetals',
  HALOGENS = 'halogens',
  NOBLE_GASES = 'noble-gases',
  LANTHANIDES = 'lanthanides',
  ACTINIDES = 'actinides',
  UNKNOWN = 'unknown'
}

export interface ElementPosition {
  row: number;
  column: number;
}

export interface PeriodicTableData {
  elements: Element[];
  categories: Record<ElementCategory, CategoryInfo>;
}

export interface CategoryInfo {
  name: string;
  color: string;
  description: string;
}
