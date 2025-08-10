interface CompoundData {
  elements: string[];
  formula: string;
  name: string;
  properties: {
    state: string;
    melting_point: string;
    boiling_point: string;
    density: string;
  };
  uses: string[];
  links: {
    wikipedia: string;
    pubchem: string;
  };
}

// Cache for compounds
const compoundCache = new Map<string, CompoundData | null>();
let compoundsDatabase: Record<string, CompoundData> | null = null;

export async function lookupCompound(elements: { symbol: string; name: string }[]): Promise<CompoundData | null> {
  // Normalize element names and create lookup keys
  const elementNames = elements.map(el => el.name);
  const sortedNames = [...elementNames].sort();
  
  // Generate all possible permutations for lookup
  const lookupKeys = new Set<string>();
  
  // Add basic combinations
  lookupKeys.add(elementNames.join('+'));
  lookupKeys.add(sortedNames.join('+'));
  lookupKeys.add(elementNames.reverse().join('+'));
  
  // For 3+ elements, try different groupings
  if (elementNames.length >= 3) {
    const permutations = getPermutations(elementNames);
    permutations.forEach(perm => lookupKeys.add(perm.join('+')));
  }
  
  const lookupKeysArray = Array.from(lookupKeys);
  
  console.log('Looking up compound for:', elementNames, 'Keys:', lookupKeysArray);
  
  // Check cache first for any of the keys
  for (const key of lookupKeysArray) {
    if (compoundCache.has(key)) {
      console.log('Found in cache with key:', key);
      return compoundCache.get(key) || null;
    }
  }

  // Load compounds database if not loaded
  if (!compoundsDatabase) {
    try {
      const response = await fetch('/data/compounds.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      compoundsDatabase = await response.json();
      console.log('Loaded compounds database:', Object.keys(compoundsDatabase || {}));
    } catch (error) {
      console.error('Failed to load compounds database:', error);
      compoundsDatabase = {};
    }
  }

  // Check local database with all possible keys
  if (compoundsDatabase) {
    for (const key of lookupKeysArray) {
      const localCompound = compoundsDatabase[key];
      if (localCompound) {
        console.log('Found in local database with key:', key, 'compound:', localCompound.name);
        compoundCache.set(sortedNames.join('+'), localCompound);
        return localCompound;
      }
    }
  }

  console.log('Not found in local database, querying PubChem API...');
  
  // Query PubChem API for comprehensive compound database
  try {
    const pubchemCompound = await queryPubChemByElements(elements);
    if (pubchemCompound) {
      console.log('Found compound via PubChem:', pubchemCompound.name);
      compoundCache.set(sortedNames.join('+'), pubchemCompound);
      return pubchemCompound;
    }
  } catch (error) {
    console.error('PubChem query failed:', error);
  }
  
  // Cache negative result to avoid repeated API calls
  compoundCache.set(sortedNames.join('+'), null);
  return null;
}

async function queryPubChemByElements(elements: { symbol: string; name: string }[]): Promise<CompoundData | null> {
  try {
    // Generate possible molecular formulas
    const formulas = generatePossibleFormulas(elements);
    
    // Try each formula with PubChem
    for (const formula of formulas) {
      const compound = await queryPubChemByFormula(formula);
      if (compound) {
        return compound;
      }
    }
    
    // Try name-based search as fallback
    const nameQuery = elements.map(el => el.name.toLowerCase()).sort().join(' ');
    const nameCompound = await queryPubChemByName(nameQuery);
    if (nameCompound) {
      return nameCompound;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function queryPubChemByFormula(formula: string): Promise<CompoundData | null> {
  try {
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/formula/${formula}/JSON`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const compounds = data.PC_Compounds;
    
    if (!compounds || compounds.length === 0) return null;
    
    // Get the first compound
    const compound = compounds[0];
    const cid = compound.id?.id?.cid;
    
    if (!cid) return null;

    // Get detailed properties
    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,IUPACName,MolecularWeight,CanonicalSMILES/JSON`;
    const propsResponse = await fetch(propsUrl);
    
    if (!propsResponse.ok) return null;
    
    const propsData = await propsResponse.json();
    const props = propsData.PropertyTable?.Properties?.[0];
    
    if (!props) return null;

    const name = props.IUPACName || props.MolecularFormula || 'Unknown compound';
    
    return {
      elements: [],
      formula: props.MolecularFormula || formula,
      name: name.length > 50 ? props.MolecularFormula : name,
      properties: {
        state: 'Unknown',
        melting_point: 'Unknown',
        boiling_point: 'Unknown',
        density: 'Unknown'
      },
      uses: ['Chemical compound', 'Research', 'Industrial applications'],
      links: {
        wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
        pubchem: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`
      }
    };
  } catch (error) {
    return null;
  }
}

async function queryPubChemByName(nameQuery: string): Promise<CompoundData | null> {
  try {
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(nameQuery)}/JSON`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const compounds = data.PC_Compounds;
    
    if (!compounds || compounds.length === 0) return null;
    
    const compound = compounds[0];
    const cid = compound.id?.id?.cid;
    
    if (!cid) return null;

    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,IUPACName,MolecularWeight/JSON`;
    const propsResponse = await fetch(propsUrl);
    
    if (!propsResponse.ok) return null;
    
    const propsData = await propsResponse.json();
    const props = propsData.PropertyTable?.Properties?.[0];
    
    if (!props) return null;

    const name = props.IUPACName || nameQuery;
    
    return {
      elements: [],
      formula: props.MolecularFormula || 'Unknown',
      name: name.length > 50 ? props.MolecularFormula : name,
      properties: {
        state: 'Unknown',
        melting_point: 'Unknown',
        boiling_point: 'Unknown',
        density: 'Unknown'
      },
      uses: ['Chemical compound', 'Research', 'Industrial applications'],
      links: {
        wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
        pubchem: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`
      }
    };
  } catch (error) {
    return null;
  }
}

function generatePossibleFormulas(elements: { symbol: string; name: string }[]): string[] {
  const formulas: string[] = [];
  const symbols = elements.map(el => el.symbol);
  
  if (elements.length === 2) {
    const [s1, s2] = symbols;
    formulas.push(
      `${s1}${s2}`, `${s2}${s1}`,
      `${s1}2${s2}`, `${s2}2${s1}`,
      `${s1}${s2}2`, `${s2}${s1}2`,
      `${s1}2${s2}3`, `${s2}2${s1}3`,
      `${s1}3${s2}2`, `${s2}3${s1}2`,
      `${s1}3${s2}`, `${s2}3${s1}`,
      `${s1}${s2}3`, `${s2}${s1}3`,
      `${s1}4${s2}`, `${s2}4${s1}`
    );
  } else if (elements.length === 3) {
    const [s1, s2, s3] = symbols;
    formulas.push(
      `${s1}${s2}${s3}`, `${s1}${s3}${s2}`, `${s2}${s1}${s3}`,
      `${s2}${s3}${s1}`, `${s3}${s1}${s2}`, `${s3}${s2}${s1}`,
      `${s1}2${s2}${s3}`, `${s1}${s2}2${s3}`, `${s1}${s2}${s3}2`,
      `${s1}${s2}${s3}3`, `${s1}${s2}3${s3}`, `${s1}3${s2}${s3}`
    );
  } else if (elements.length >= 4) {
    // For 4+ elements, try basic combinations
    formulas.push(symbols.join(''));
    formulas.push(symbols.reverse().join(''));
  }
  
  return Array.from(new Set(formulas));
}

function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = getPermutations(rest);
    for (const perm of perms) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

export function getElementWikipediaUrl(elementName: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(elementName)}`;
}