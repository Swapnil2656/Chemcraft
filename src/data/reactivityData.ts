/**
 * Chemical Reactivity Data for Element Mixer
 * Based on general inorganic chemistry principles and common reactions
 * Each element maps to an array of symbols it can react with
 */

export interface ReactivityRule {
  symbol: string;
  reactsWith: string[];
  description?: string;
}

export const reactivityMap: Record<string, string[]> = {
  // Hydrogen - reacts with most nonmetals and some metals
  H: ['O', 'Cl', 'F', 'Br', 'I', 'N', 'S', 'C', 'Na', 'K', 'Ca', 'Mg', 'Li', 'Al', 'Zn', 'Fe', 'Cu', 'Pb'],
  
  // Helium - noble gas, no reactions
  He: [],
  
  // Lithium - alkali metal, highly reactive
  Li: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'N', 'H', 'C'],
  
  // Beryllium - alkaline earth metal
  Be: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Boron - metalloid
  B: ['O', 'Cl', 'F', 'Br', 'I', 'N', 'H'],
  
  // Carbon - forms many compounds
  C: ['O', 'H', 'N', 'S', 'Cl', 'F', 'Br', 'I', 'Si'],
  
  // Nitrogen - forms many compounds
  N: ['H', 'O', 'C', 'Cl', 'F', 'Br', 'I', 'S', 'Li', 'Na', 'K', 'Ca', 'Mg'],
  
  // Oxygen - reacts with most elements
  O: ['H', 'C', 'N', 'S', 'P', 'Si', 'Li', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn', 'Pb', 'Ag', 'Au', 'Ti', 'Cr', 'Mn', 'Ni', 'Co'],
  
  // Fluorine - most reactive halogen
  F: ['H', 'Li', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'C', 'N', 'B', 'Be'],
  
  // Neon - noble gas
  Ne: [],
  
  // Sodium - alkali metal
  Na: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'N', 'C'],
  
  // Magnesium - alkaline earth metal
  Mg: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'N', 'C'],
  
  // Aluminum - reactive metal
  Al: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'N'],
  
  // Silicon - metalloid
  Si: ['O', 'Cl', 'F', 'Br', 'I', 'C', 'H'],
  
  // Phosphorus - reactive nonmetal
  P: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'C'],
  
  // Sulfur - reactive nonmetal
  S: ['H', 'O', 'C', 'N', 'P', 'Fe', 'Cu', 'Zn', 'Ag', 'Pb', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Li'],
  
  // Chlorine - halogen
  Cl: ['H', 'Li', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn', 'Ag', 'Pb', 'C', 'N', 'P', 'S', 'Si', 'B', 'Be', 'F'],
  
  // Argon - noble gas
  Ar: [],
  
  // Potassium - alkali metal
  K: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'N', 'C'],
  
  // Calcium - alkaline earth metal
  Ca: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H', 'N', 'C'],
  
  // Scandium - transition metal
  Sc: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Titanium - transition metal
  Ti: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'N', 'C'],
  
  // Vanadium - transition metal
  V: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Chromium - transition metal
  Cr: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Manganese - transition metal
  Mn: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Iron - transition metal
  Fe: ['O', 'S', 'Cl', 'Br', 'I', 'C', 'H'],
  
  // Cobalt - transition metal
  Co: ['O', 'S', 'Cl', 'Br', 'I'],
  
  // Nickel - transition metal
  Ni: ['O', 'S', 'Cl', 'Br', 'I'],
  
  // Copper - transition metal
  Cu: ['O', 'S', 'Cl', 'Br', 'I', 'H'],
  
  // Zinc - transition metal
  Zn: ['O', 'S', 'Cl', 'Br', 'I', 'H'],
  
  // Gallium - post-transition metal
  Ga: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Germanium - metalloid
  Ge: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Arsenic - metalloid
  As: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Selenium - nonmetal
  Se: ['H', 'O', 'Na', 'K', 'Ca', 'Mg'],
  
  // Bromine - halogen
  Br: ['H', 'Li', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn', 'Ag', 'Pb', 'C', 'N', 'P', 'S', 'Si', 'B', 'Be'],
  
  // Krypton - noble gas
  Kr: [],
  
  // Rubidium - alkali metal
  Rb: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Strontium - alkaline earth metal
  Sr: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Yttrium - transition metal
  Y: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Zirconium - transition metal
  Zr: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Niobium - transition metal
  Nb: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Molybdenum - transition metal
  Mo: ['O', 'S', 'Cl', 'F'],
  
  // Technetium - transition metal
  Tc: ['O', 'Cl', 'F', 'S'],
  
  // Ruthenium - transition metal
  Ru: ['O', 'Cl', 'F'],
  
  // Rhodium - transition metal
  Rh: ['O', 'Cl', 'F'],
  
  // Palladium - transition metal
  Pd: ['O', 'Cl', 'Br', 'I'],
  
  // Silver - transition metal
  Ag: ['O', 'S', 'Cl', 'Br', 'I'],
  
  // Cadmium - transition metal
  Cd: ['O', 'S', 'Cl', 'Br', 'I'],
  
  // Indium - post-transition metal
  In: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Tin - post-transition metal
  Sn: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Antimony - metalloid
  Sb: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Tellurium - metalloid
  Te: ['H', 'O', 'Na', 'K'],
  
  // Iodine - halogen
  I: ['H', 'Li', 'Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn', 'Ag', 'Pb', 'C', 'N', 'P', 'S', 'Si'],
  
  // Xenon - noble gas (can form some compounds)
  Xe: ['F', 'O'],
  
  // Cesium - alkali metal
  Cs: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Barium - alkaline earth metal
  Ba: ['O', 'Cl', 'F', 'Br', 'I', 'S', 'H'],
  
  // Lanthanum - lanthanide
  La: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Cerium - lanthanide
  Ce: ['O', 'Cl', 'F', 'S'],
  
  // Praseodymium - lanthanide
  Pr: ['O', 'Cl', 'F', 'S'],
  
  // Neodymium - lanthanide
  Nd: ['O', 'Cl', 'F', 'S'],
  
  // Promethium - lanthanide
  Pm: ['O', 'Cl', 'F'],
  
  // Samarium - lanthanide
  Sm: ['O', 'Cl', 'F', 'S'],
  
  // Europium - lanthanide
  Eu: ['O', 'Cl', 'F', 'S'],
  
  // Gadolinium - lanthanide
  Gd: ['O', 'Cl', 'F', 'S'],
  
  // Terbium - lanthanide
  Tb: ['O', 'Cl', 'F'],
  
  // Dysprosium - lanthanide
  Dy: ['O', 'Cl', 'F'],
  
  // Holmium - lanthanide
  Ho: ['O', 'Cl', 'F'],
  
  // Erbium - lanthanide
  Er: ['O', 'Cl', 'F'],
  
  // Thulium - lanthanide
  Tm: ['O', 'Cl', 'F'],
  
  // Ytterbium - lanthanide
  Yb: ['O', 'Cl', 'F'],
  
  // Lutetium - lanthanide
  Lu: ['O', 'Cl', 'F'],
  
  // Hafnium - transition metal
  Hf: ['O', 'Cl', 'F', 'S'],
  
  // Tantalum - transition metal
  Ta: ['O', 'F', 'Cl'],
  
  // Tungsten - transition metal
  W: ['O', 'F', 'Cl', 'S'],
  
  // Rhenium - transition metal
  Re: ['O', 'F', 'Cl'],
  
  // Osmium - transition metal
  Os: ['O', 'F'],
  
  // Iridium - transition metal
  Ir: ['O', 'F', 'Cl'],
  
  // Platinum - transition metal
  Pt: ['O', 'Cl', 'F'],
  
  // Gold - transition metal
  Au: ['Cl', 'Br', 'I'],
  
  // Mercury - transition metal
  Hg: ['O', 'S', 'Cl', 'Br', 'I'],
  
  // Thallium - post-transition metal
  Tl: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Lead - post-transition metal
  Pb: ['O', 'S', 'Cl', 'Br', 'I', 'H'],
  
  // Bismuth - post-transition metal
  Bi: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Polonium - metalloid
  Po: ['O', 'Cl', 'Br', 'I'],
  
  // Astatine - halogen
  At: ['H', 'Na', 'K'],
  
  // Radon - noble gas
  Rn: [],
  
  // Francium - alkali metal
  Fr: ['O', 'Cl', 'F', 'Br', 'I'],
  
  // Radium - alkaline earth metal
  Ra: ['O', 'Cl', 'F', 'Br', 'I', 'S'],
  
  // Actinium - actinide
  Ac: ['O', 'Cl', 'F'],
  
  // Thorium - actinide
  Th: ['O', 'Cl', 'F', 'S'],
  
  // Protactinium - actinide
  Pa: ['O', 'F', 'Cl'],
  
  // Uranium - actinide
  U: ['O', 'F', 'Cl', 'S'],
  
  // Neptunium - actinide
  Np: ['O', 'F', 'Cl'],
  
  // Plutonium - actinide
  Pu: ['O', 'F', 'Cl'],
  
  // Americium - actinide
  Am: ['O', 'F', 'Cl'],
  
  // Curium - actinide
  Cm: ['O', 'F'],
  
  // Berkelium - actinide
  Bk: ['O', 'F'],
  
  // Californium - actinide
  Cf: ['O', 'F'],
  
  // Einsteinium - actinide
  Es: ['O'],
  
  // Fermium - actinide
  Fm: [],
  
  // Mendelevium - actinide
  Md: [],
  
  // Nobelium - actinide
  No: [],
  
  // Lawrencium - actinide
  Lr: [],
  
  // Rutherfordium - transactinide
  Rf: [],
  
  // Dubnium - transactinide
  Db: [],
  
  // Seaborgium - transactinide
  Sg: [],
  
  // Bohrium - transactinide
  Bh: [],
  
  // Hassium - transactinide
  Hs: [],
  
  // Meitnerium - transactinide
  Mt: [],
  
  // Darmstadtium - transactinide
  Ds: [],
  
  // Roentgenium - transactinide
  Rg: [],
  
  // Copernicium - transactinide
  Cn: [],
  
  // Nihonium - transactinide
  Nh: [],
  
  // Flerovium - transactinide
  Fl: [],
  
  // Moscovium - transactinide
  Mc: [],
  
  // Livermorium - transactinide
  Lv: [],
  
  // Tennessine - transactinide
  Ts: [],
  
  // Oganesson - transactinide
  Og: []
};

/**
 * Get reactive partners for a given element symbol
 */
export const getReactivePartners = (elementSymbol: string): string[] => {
  return reactivityMap[elementSymbol] || [];
};

/**
 * Check if two elements can react with each other
 */
export const canElementsReact = (element1: string, element2: string): boolean => {
  const partners1 = reactivityMap[element1] || [];
  const partners2 = reactivityMap[element2] || [];
  
  return partners1.includes(element2) || partners2.includes(element1);
};

/**
 * Get reactivity description for educational purposes
 */
export const getReactivityDescription = (elementSymbol: string): string => {
  const reactsWith = reactivityMap[elementSymbol] || [];
  
  if (reactsWith.length === 0) {
    return "This element is chemically inert and rarely forms compounds.";
  } else if (reactsWith.length < 5) {
    return "This element has limited reactivity with specific elements.";
  } else if (reactsWith.length < 10) {
    return "This element is moderately reactive and forms various compounds.";
  } else {
    return "This element is highly reactive and forms many different compounds.";
  }
};