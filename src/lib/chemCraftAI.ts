/**
 * ChemCraft AI Compound Prediction Engine
 * Advanced chemistry prediction system with rules engine, ML model, and PubChem integration
 */

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: number;
  period: number;
  category: string;
  electronegativity: number;
  oxidationStates: number[];
  valenceElectrons: number;
}

interface CompoundPrediction {
  will_react: boolean;
  confidence: number;
  formula?: string;
  name?: string;
  properties?: any;
  safety?: any;
  uses?: string[];
  source: 'database' | 'rules_engine' | 'ml_model' | 'pubchem_api';
  rule_applied?: string;
  warnings?: string[];
  reason?: string;
  note?: string;
}

interface ChemistryRule {
  rule_id: string;
  name: string;
  pattern: any;
  prediction: any;
}

class ChemCraftAI {
  private database: any;
  private rules: ChemistryRule[] = [];
  private elements: Map<string, Element> = new Map();
  private cache: Map<string, CompoundPrediction> = new Map();

  constructor() {
    this.loadDatabase();
    this.initializeElements();
    this.loadChemistryRules();
  }

  /**
   * Main prediction function - implements the AI workflow
   */
  async predictCompound(elements: Array<{symbol: string, count: number}>): Promise<CompoundPrediction>;
  async predictCompound(element1: string, element2: string): Promise<CompoundPrediction>;
  async predictCompound(
    elementsOrElement1: Array<{symbol: string, count: number}> | string, 
    element2?: string
  ): Promise<CompoundPrediction> {
    
    // Handle different input formats
    if (Array.isArray(elementsOrElement1)) {
      return this.predictCompoundWithCounts(elementsOrElement1);
    } else if (element2) {
      return this.predictBinaryCompound(elementsOrElement1, element2);
    } else {
      throw new Error('Invalid input format for predictCompound');
    }
  }

  private async predictBinaryCompound(element1: string, element2: string): Promise<CompoundPrediction> {
    const cacheKey = this.getCacheKey(element1, element2);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Step 1: Check existing database
    const existing = this.searchDatabase(element1, element2);
    if (existing) {
      const result = {
        ...existing,
        source: 'database' as const,
        confidence: 1.0
      };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Step 2: Try PubChem API (highest priority for verification)
    try {
      const pubchemResult = await this.fetchFromPubChem(element1, element2);
      if (pubchemResult.will_react) {
        this.cache.set(cacheKey, pubchemResult);
        return pubchemResult;
      }
    } catch (error) {
      console.warn('PubChem API failed, falling back to rules engine');
    }

    // Step 3: Apply chemistry rules
    const rulesResult = this.applyChemistryRules(element1, element2);
    if (rulesResult.confidence > 0.8) {
      this.cache.set(cacheKey, rulesResult);
      return rulesResult;
    }

    // Step 4: Use ML prediction
    const mlResult = this.runMLModel(element1, element2);
    if (mlResult.confidence > 0.6) {
      this.cache.set(cacheKey, mlResult);
      return mlResult;
    }

    // Step 5: Return no reaction
    const noReaction = {
      will_react: false,
      confidence: 0.9,
      source: 'rules_engine' as const,
      reason: 'No favorable reaction conditions found'
    };
    this.cache.set(cacheKey, noReaction);
    return noReaction;
  }

  /**
   * Chemistry Rules Engine - Core prediction logic
   */
  private applyChemistryRules(e1: string, e2: string): CompoundPrediction {
    const elem1 = this.elements.get(e1);
    const elem2 = this.elements.get(e2);
    
    if (!elem1 || !elem2) {
      return { will_react: false, confidence: 0, source: 'rules_engine' };
    }

    // Rule R001: Alkali Metal + Halogen → Ionic Salt
    if (this.isAlkaliMetal(e1) && this.isHalogen(e2)) {
      return {
        will_react: true,
        confidence: 1.0,
        formula: `${e1}${e2}`,
        name: `${elem1.name} ${this.getHalideIonName(e2)}`,
        properties: {
          state: 'solid',
          color: 'white',
          type: 'ionic',
          crystal_structure: 'cubic'
        },
        safety: {
          hazard_level: 'safe',
          handling: 'standard'
        },
        uses: [
          'Food seasoning (if NaCl)',
          'De-icing agent',
          'Chemical synthesis',
          'Water treatment'
        ],
        source: 'rules_engine',
        rule_applied: 'R001: Alkali Metal + Halogen',
        warnings: ['Violent reaction during formation']
      };
    }

    // Rule R002: Alkaline Earth + Halogen → Ionic Salt
    if (this.isAlkalineEarthMetal(e1) && this.isHalogen(e2)) {
      return {
        will_react: true,
        confidence: 0.95,
        formula: `${e1}${e2}2`,
        name: `${elem1.name} ${this.getHalideIonName(e2)}`,
        properties: {
          state: 'solid',
          type: 'ionic'
        },
        source: 'rules_engine',
        rule_applied: 'R002: Alkaline Earth + Halogen'
      };
    }

    // Rule R003: Metal + Oxygen → Metal Oxide
    if (this.isMetal(e1) && e2 === 'O' && !['Au', 'Pt', 'Ag'].includes(e1)) {
      const formula = this.calculateOxideFormula(e1);
      return {
        will_react: true,
        confidence: 0.85,
        formula: formula,
        name: `${elem1.name} oxide`,
        properties: {
          state: 'solid',
          type: 'ionic_oxide',
          color: this.predictOxideColor(e1)
        },
        source: 'rules_engine',
        rule_applied: 'R003: Metal + Oxygen'
      };
    }

    // Rule R004: Hydrogen + Nonmetal → Binary Compound
    if (e1 === 'H' && this.isNonmetal(e2)) {
      return this.predictHydrogenCompound(e2);
    }

    // Rule R005: Noble Gas + Any → No Reaction
    if (['He', 'Ne', 'Ar', 'Kr'].includes(e1) || ['He', 'Ne', 'Ar', 'Kr'].includes(e2)) {
      return {
        will_react: false,
        confidence: 1.0,
        source: 'rules_engine',
        rule_applied: 'R005: Noble Gas Inertness',
        reason: 'Noble gases are chemically inert'
      };
    }

    // Rule R006: Xenon + Fluorine → Xenon Fluoride
    if ((e1 === 'Xe' && e2 === 'F') || (e1 === 'F' && e2 === 'Xe')) {
      return {
        will_react: true,
        confidence: 0.7,
        formula: 'XeF2',
        name: 'Xenon difluoride',
        properties: {
          state: 'solid',
          color: 'colorless',
          stability: 'metastable'
        },
        source: 'rules_engine',
        rule_applied: 'R006: Noble Gas Exception',
        warnings: ['Requires extreme conditions', 'Highly reactive compound']
      };
    }

    // Rule R007: Transition Metal + Transition Metal → Alloy
    if (this.isTransitionMetal(e1) && this.isTransitionMetal(e2)) {
      return {
        will_react: false,
        confidence: 0.85,
        source: 'rules_engine',
        rule_applied: 'R007: Metal-Metal Alloy',
        reason: 'Forms metallic mixture (alloy), not chemical compound',
        note: 'May form intermetallic compounds under specific conditions'
      };
    }

    // Additional comprehensive rules for common element combinations
    
    // Rule R008: Transition Metal + Halogen → Transition Metal Halide
    if (this.isTransitionMetal(e1) && this.isHalogen(e2)) {
      return {
        will_react: true,
        confidence: 0.9,
        formula: this.getTransitionMetalHalideFormula(e1, e2),
        name: `${elem1?.name} ${this.getHalideIonName(e2)}`,
        properties: {
          state: 'solid',
          type: 'ionic compound',
          color: this.getTransitionMetalColor(e1, e2)
        },
        safety: {
          hazard_level: 'medium',
          warnings: ['May be toxic', 'Handle with care']
        },
        uses: ['Catalysts', 'Chemical synthesis', 'Research'],
        source: 'rules_engine',
        rule_applied: 'R008: Transition Metal + Halogen',
        warnings: []
      };
    }

    // Rule R009: Carbon + Hydrogen → Hydrocarbon
    if ((e1 === 'C' && e2 === 'H') || (e1 === 'H' && e2 === 'C')) {
      return {
        will_react: true,
        confidence: 0.95,
        formula: 'CH4',
        name: 'methane',
        properties: {
          state: 'gas',
          type: 'organic compound',
          color: 'colorless'
        },
        safety: {
          hazard_level: 'medium',
          warnings: ['Flammable gas', 'Asphyxiant in high concentrations']
        },
        uses: ['Natural gas', 'Fuel', 'Chemical feedstock'],
        source: 'rules_engine',
        rule_applied: 'R009: Carbon + Hydrogen → Simple Hydrocarbon',
        warnings: ['Highly flammable']
      };
    }

    // Rule R010: Metal + Sulfur → Metal Sulfide
    if (this.isMetal(e1) && e2 === 'S') {
      return {
        will_react: true,
        confidence: 0.9,
        formula: this.getMetalSulfideFormula(e1),
        name: `${elem1?.name} sulfide`,
        properties: {
          state: 'solid',
          type: 'ionic compound',
          color: this.getSulfideColor(e1)
        },
        safety: {
          hazard_level: 'medium',
          warnings: ['May release toxic H2S gas when wet']
        },
        uses: ['Semiconductors', 'Pigments', 'Metallurgy'],
        source: 'rules_engine',
        rule_applied: 'R010: Metal + Sulfur → Metal Sulfide',
        warnings: []
      };
    }

    // Rule R011: Nitrogen + Hydrogen → Ammonia
    if ((e1 === 'N' && e2 === 'H') || (e1 === 'H' && e2 === 'N')) {
      return {
        will_react: true,
        confidence: 0.85,
        formula: 'NH3',
        name: 'ammonia',
        properties: {
          state: 'gas',
          type: 'molecular compound',
          color: 'colorless'
        },
        safety: {
          hazard_level: 'high',
          warnings: ['Toxic gas', 'Corrosive', 'Irritant to eyes and respiratory system']
        },
        uses: ['Fertilizer production', 'Cleaning agent', 'Refrigerant'],
        source: 'rules_engine',
        rule_applied: 'R011: Nitrogen + Hydrogen → Ammonia',
        warnings: ['Requires high pressure and temperature', 'Toxic vapors']
      };
    }

    // Rule R012: Carbon + Oxygen → Carbon Compounds
    if ((e1 === 'C' && e2 === 'O') || (e1 === 'O' && e2 === 'C')) {
      return {
        will_react: true,
        confidence: 0.95,
        formula: 'CO2',
        name: 'carbon dioxide',
        properties: {
          state: 'gas',
          type: 'molecular compound',
          color: 'colorless'
        },
        safety: {
          hazard_level: 'low',
          warnings: ['Asphyxiant in high concentrations']
        },
        uses: ['Fire extinguisher', 'Carbonated beverages', 'Dry ice'],
        source: 'rules_engine',
        rule_applied: 'R012: Carbon + Oxygen → Carbon Dioxide',
        warnings: []
      };
    }

    // Rule R013: Silicon + Oxygen → Silicon Dioxide
    if ((e1 === 'Si' && e2 === 'O') || (e1 === 'O' && e2 === 'Si')) {
      return {
        will_react: true,
        confidence: 1.0,
        formula: 'SiO2',
        name: 'silicon dioxide',
        properties: {
          state: 'solid',
          type: 'covalent network',
          color: 'white'
        },
        safety: {
          hazard_level: 'low',
          warnings: ['Dust may cause respiratory irritation']
        },
        uses: ['Glass manufacturing', 'Electronics', 'Ceramics'],
        source: 'rules_engine',
        rule_applied: 'R013: Silicon + Oxygen → Silicon Dioxide',
        warnings: []
      };
    }

    // Default: No clear rule match
    return {
      will_react: false,
      confidence: 0.3,
      source: 'rules_engine',
      reason: 'No applicable chemistry rule found'
    };
  }

  /**
   * Machine Learning Model Prediction
   */
  private runMLModel(e1: string, e2: string): CompoundPrediction {
    const elem1 = this.elements.get(e1);
    const elem2 = this.elements.get(e2);
    
    if (!elem1 || !elem2) {
      return { will_react: false, confidence: 0, source: 'ml_model' };
    }

    // Extract features for ML model
    const features = this.extractFeatures(elem1, elem2);
    
    // Simple rule-based ML simulation (in production, use actual trained model)
    const prediction = this.simulateMLPrediction(features);
    
    return {
      will_react: prediction.probability > 0.6,
      confidence: prediction.probability,
      formula: prediction.formula,
      source: 'ml_model',
      properties: prediction.properties
    };
  }

  /**
   * PubChem API Integration
   */
  private async fetchFromPubChem(e1: string, e2: string): Promise<CompoundPrediction> {
    // Try common formula patterns
    const formulaPatterns = this.generateFormulaPatterns(e1, e2);
    
    for (const formula of formulaPatterns) {
      try {
        const response = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/${formula}/JSON`,
          { 
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.PC_Compounds && data.PC_Compounds.length > 0) {
            return this.parsePubChemData(data.PC_Compounds[0], formula);
          }
        }
      } catch (error) {
        console.warn(`PubChem lookup failed for ${formula}:`, error);
        continue;
      }
    }
    
    return { will_react: false, confidence: 0, source: 'pubchem_api' };
  }

  /**
   * Helper Methods
   */
  private isAlkaliMetal(symbol: string): boolean {
    return ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'].includes(symbol);
  }

  private isAlkalineEarthMetal(symbol: string): boolean {
    return ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'].includes(symbol);
  }

  private isHalogen(symbol: string): boolean {
    return ['F', 'Cl', 'Br', 'I', 'At'].includes(symbol);
  }

  private isMetal(symbol: string): boolean {
    const element = this.elements.get(symbol);
    return element?.category.includes('metal') || false;
  }

  private isNonmetal(symbol: string): boolean {
    const element = this.elements.get(symbol);
    return element?.category === 'nonmetals' || false;
  }



  private getHalideIonName(halogen: string): string {
    const names = {
      'F': 'Fluoride',
      'Cl': 'Chloride', 
      'Br': 'Bromide',
      'I': 'Iodide',
      'At': 'Astatide'
    };
    return names[halogen as keyof typeof names] || 'halide';
  }

  private calculateOxideFormula(metal: string): string {
    const element = this.elements.get(metal);
    if (!element) return `${metal}O`;
    
    // Use most common oxidation state
    const oxidationState = element.oxidationStates[0] || 2;
    
    if (oxidationState === 1) return `${metal}2O`;
    if (oxidationState === 2) return `${metal}O`;
    if (oxidationState === 3) return `${metal}2O3`;
    if (oxidationState === 4) return `${metal}O2`;
    
    return `${metal}O`;
  }

  private predictOxideColor(metal: string): string {
    const colors: { [key: string]: string } = {
      'Fe': 'reddish-brown',
      'Cu': 'black',
      'Cr': 'green',
      'Mn': 'brown',
      'Ni': 'green',
      'Co': 'black',
      'Ti': 'white',
      'Al': 'white',
      'Zn': 'white',
      'Mg': 'white',
      'Ca': 'white'
    };
    return colors[metal] || 'white';
  }

  private predictHydrogenCompound(nonmetal: string): CompoundPrediction {
    const compounds: { [key: string]: any } = {
      'O': {
        formula: 'H2O',
        name: 'Water',
        confidence: 1.0,
        properties: { state: 'liquid', color: 'colorless' },
        uses: ['Universal solvent', 'Drinking water', 'Chemical reactions']
      },
      'S': {
        formula: 'H2S',
        name: 'Hydrogen sulfide',
        confidence: 0.9,
        properties: { state: 'gas', color: 'colorless', odor: 'rotten eggs' },
        warnings: ['Toxic gas', 'Flammable']
      },
      'N': {
        formula: 'NH3',
        name: 'Ammonia',
        confidence: 0.9,
        properties: { state: 'gas', color: 'colorless', odor: 'pungent' },
        uses: ['Fertilizer', 'Cleaning products', 'Refrigeration']
      },
      'Cl': {
        formula: 'HCl',
        name: 'Hydrogen chloride',
        confidence: 0.95,
        properties: { state: 'gas', color: 'colorless' },
        warnings: ['Corrosive', 'Forms hydrochloric acid in water']
      }
    };

    const compound = compounds[nonmetal];
    if (compound) {
      return {
        will_react: true,
        source: 'rules_engine',
        rule_applied: 'R004: Hydrogen + Nonmetal',
        ...compound
      };
    }

    return {
      will_react: false,
      confidence: 0.4,
      source: 'rules_engine'
    };
  }

  private extractFeatures(elem1: Element, elem2: Element): number[] {
    return [
      Math.abs(elem1.electronegativity - elem2.electronegativity), // electronegativity_difference
      elem1.atomicNumber + elem2.atomicNumber, // atomic_number_sum
      this.getGroupCompatibility(elem1, elem2), // group_compatibility
      Math.abs(elem1.period - elem2.period), // period_difference
      this.isMetalNonmetalPair(elem1, elem2) ? 1 : 0, // metal_nonmetal_pair
      elem1.valenceElectrons + elem2.valenceElectrons, // valence_electrons
      this.calculateIonicPotential(elem1, elem2) // ionic_potential
    ];
  }

  private simulateMLPrediction(features: number[]): any {
    // Simplified ML simulation - in production, use actual trained model
    const [enDiff, atomSum, groupComp, periodDiff, metalNonmetal, valence, ionic] = features;
    
    let probability = 0.5;
    
    // Boost probability for metal-nonmetal pairs
    if (metalNonmetal) probability += 0.2;
    
    // Boost for electronegativity difference
    if (enDiff > 1.5) probability += 0.15;
    
    // Reduce for noble gas involvement
    if (atomSum === 10 || atomSum === 18 || atomSum === 36) probability = 0.05;
    
    // Boost for group compatibility
    probability += groupComp * 0.1;
    
    return {
      probability: Math.min(0.95, Math.max(0.05, probability)),
      formula: 'predicted', // Would generate actual formula
      properties: { predicted: true }
    };
  }

  private getGroupCompatibility(elem1: Element, elem2: Element): number {
    // Simple heuristic for group compatibility
    if ((elem1.group === 1 && elem2.group === 17) || 
        (elem1.group === 17 && elem2.group === 1)) return 1;
    if ((elem1.group === 2 && elem2.group === 17) || 
        (elem1.group === 17 && elem2.group === 2)) return 0.9;
    return 0.3;
  }

  private isMetalNonmetalPair(elem1: Element, elem2: Element): boolean {
    const metal1 = this.isMetal(elem1.symbol);
    const metal2 = this.isMetal(elem2.symbol);
    return metal1 !== metal2; // One is metal, one is not
  }

  private calculateIonicPotential(elem1: Element, elem2: Element): number {
    return Math.abs(elem1.electronegativity - elem2.electronegativity) / 4.0;
  }

  private generateFormulaPatterns(e1: string, e2: string): string[] {
    return [
      `${e1}${e2}`,
      `${e2}${e1}`,
      `${e1}2${e2}`,
      `${e1}${e2}2`,
      `${e1}2${e2}3`,
      `${e1}3${e2}2`
    ];
  }

  private parsePubChemData(compound: any, formula: string): CompoundPrediction {
    return {
      will_react: true,
      confidence: 1.0,
      formula: formula,
      name: compound.props?.find((p: any) => p.urn.label === 'IUPAC Name')?.value?.sval || 'Unknown',
      source: 'pubchem_api',
      properties: {
        verified: true,
        pubchem_cid: compound.id?.id?.cid
      }
    };
  }

  private searchDatabase(e1: string, e2: string): any {
    // Search existing compound database
    // Implementation would check all compound categories
    return null; // Placeholder
  }

  private getCacheKey(e1: string, e2: string): string {
    return [e1, e2].sort().join('-');
  }

  private async loadDatabase(): Promise<void> {
    // For now, always use the essential compounds fallback to ensure system works
    // This avoids fetch issues while maintaining full functionality
    // Loading essential compounds database
    this.loadEssentialCompounds();
    
    // Optional: Try to load full database in background (browser only)
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/data/chemcraft-complete-database-550.json');
        const fullDatabase = await response.json();
        // Merge with essential compounds
        this.database = { ...this.database, ...fullDatabase };
        // Full database loaded successfully
      } catch (error) {
        // Full database not available, using essential compounds only
      }
    }
  }

  private initializeElements(): void {
    // Initialize comprehensive element data for all 118 elements
    const allElements = [
      // Period 1
      { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, group: 1, period: 1, category: 'nonmetal', electronegativity: 2.20, oxidationStates: [1, -1], valenceElectrons: 1 },
      { symbol: 'He', name: 'Helium', atomicNumber: 2, group: 18, period: 1, category: 'noble gas', electronegativity: 0, oxidationStates: [0], valenceElectrons: 2 },
      
      // Period 2
      { symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 1, period: 2, category: 'alkali metal', electronegativity: 0.98, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, group: 2, period: 2, category: 'alkaline earth metal', electronegativity: 1.57, oxidationStates: [2], valenceElectrons: 2 },
      { symbol: 'B', name: 'Boron', atomicNumber: 5, group: 13, period: 2, category: 'metalloid', electronegativity: 2.04, oxidationStates: [3], valenceElectrons: 3 },
      { symbol: 'C', name: 'Carbon', atomicNumber: 6, group: 14, period: 2, category: 'nonmetal', electronegativity: 2.55, oxidationStates: [4, -4, 2], valenceElectrons: 4 },
      { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, group: 15, period: 2, category: 'nonmetal', electronegativity: 3.04, oxidationStates: [-3, 3, 5], valenceElectrons: 5 },
      { symbol: 'O', name: 'Oxygen', atomicNumber: 8, group: 16, period: 2, category: 'nonmetal', electronegativity: 3.44, oxidationStates: [-2], valenceElectrons: 6 },
      { symbol: 'F', name: 'Fluorine', atomicNumber: 9, group: 17, period: 2, category: 'halogen', electronegativity: 3.98, oxidationStates: [-1], valenceElectrons: 7 },
      { symbol: 'Ne', name: 'Neon', atomicNumber: 10, group: 18, period: 2, category: 'noble gas', electronegativity: 0, oxidationStates: [0], valenceElectrons: 8 },
      
      // Period 3
      { symbol: 'Na', name: 'Sodium', atomicNumber: 11, group: 1, period: 3, category: 'alkali metal', electronegativity: 0.93, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, group: 2, period: 3, category: 'alkaline earth metal', electronegativity: 1.31, oxidationStates: [2], valenceElectrons: 2 },
      { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, group: 13, period: 3, category: 'post-transition metal', electronegativity: 1.61, oxidationStates: [3], valenceElectrons: 3 },
      { symbol: 'Si', name: 'Silicon', atomicNumber: 14, group: 14, period: 3, category: 'metalloid', electronegativity: 1.90, oxidationStates: [4, -4], valenceElectrons: 4 },
      { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, group: 15, period: 3, category: 'nonmetal', electronegativity: 2.19, oxidationStates: [-3, 3, 5], valenceElectrons: 5 },
      { symbol: 'S', name: 'Sulfur', atomicNumber: 16, group: 16, period: 3, category: 'nonmetal', electronegativity: 2.58, oxidationStates: [-2, 4, 6], valenceElectrons: 6 },
      { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, group: 17, period: 3, category: 'halogen', electronegativity: 3.16, oxidationStates: [-1, 1, 3, 5, 7], valenceElectrons: 7 },
      { symbol: 'Ar', name: 'Argon', atomicNumber: 18, group: 18, period: 3, category: 'noble gas', electronegativity: 0, oxidationStates: [0], valenceElectrons: 8 },
      
      // Period 4
      { symbol: 'K', name: 'Potassium', atomicNumber: 19, group: 1, period: 4, category: 'alkali metal', electronegativity: 0.82, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, group: 2, period: 4, category: 'alkaline earth metal', electronegativity: 1.00, oxidationStates: [2], valenceElectrons: 2 },
      
      // Transition metals (Period 4)
      { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, group: 3, period: 4, category: 'transition metal', electronegativity: 1.36, oxidationStates: [3], valenceElectrons: 2 },
      { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, group: 4, period: 4, category: 'transition metal', electronegativity: 1.54, oxidationStates: [2, 3, 4], valenceElectrons: 2 },
      { symbol: 'V', name: 'Vanadium', atomicNumber: 23, group: 5, period: 4, category: 'transition metal', electronegativity: 1.63, oxidationStates: [2, 3, 4, 5], valenceElectrons: 2 },
      { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, group: 6, period: 4, category: 'transition metal', electronegativity: 1.66, oxidationStates: [2, 3, 6], valenceElectrons: 1 },
      { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, group: 7, period: 4, category: 'transition metal', electronegativity: 1.55, oxidationStates: [2, 3, 4, 6, 7], valenceElectrons: 2 },
      { symbol: 'Fe', name: 'Iron', atomicNumber: 26, group: 8, period: 4, category: 'transition metal', electronegativity: 1.83, oxidationStates: [2, 3], valenceElectrons: 2 },
      { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, group: 9, period: 4, category: 'transition metal', electronegativity: 1.88, oxidationStates: [2, 3], valenceElectrons: 2 },
      { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, group: 10, period: 4, category: 'transition metal', electronegativity: 1.91, oxidationStates: [2], valenceElectrons: 2 },
      { symbol: 'Cu', name: 'Copper', atomicNumber: 29, group: 11, period: 4, category: 'transition metal', electronegativity: 1.90, oxidationStates: [1, 2], valenceElectrons: 1 },
      { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, group: 12, period: 4, category: 'transition metal', electronegativity: 1.65, oxidationStates: [2], valenceElectrons: 2 },
      
      { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, group: 13, period: 4, category: 'post-transition metal', electronegativity: 1.81, oxidationStates: [3], valenceElectrons: 3 },
      { symbol: 'Ge', name: 'Germanium', atomicNumber: 32, group: 14, period: 4, category: 'metalloid', electronegativity: 2.01, oxidationStates: [4], valenceElectrons: 4 },
      { symbol: 'As', name: 'Arsenic', atomicNumber: 33, group: 15, period: 4, category: 'metalloid', electronegativity: 2.18, oxidationStates: [-3, 3, 5], valenceElectrons: 5 },
      { symbol: 'Se', name: 'Selenium', atomicNumber: 34, group: 16, period: 4, category: 'nonmetal', electronegativity: 2.55, oxidationStates: [-2, 4, 6], valenceElectrons: 6 },
      { symbol: 'Br', name: 'Bromine', atomicNumber: 35, group: 17, period: 4, category: 'halogen', electronegativity: 2.96, oxidationStates: [-1, 1, 3, 5, 7], valenceElectrons: 7 },
      { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, group: 18, period: 4, category: 'noble gas', electronegativity: 3.00, oxidationStates: [0, 2], valenceElectrons: 8 },
      
      // Period 5
      { symbol: 'Rb', name: 'Rubidium', atomicNumber: 37, group: 1, period: 5, category: 'alkali metal', electronegativity: 0.82, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Sr', name: 'Strontium', atomicNumber: 38, group: 2, period: 5, category: 'alkaline earth metal', electronegativity: 0.95, oxidationStates: [2], valenceElectrons: 2 },
      { symbol: 'Y', name: 'Yttrium', atomicNumber: 39, group: 3, period: 5, category: 'transition metal', electronegativity: 1.22, oxidationStates: [3], valenceElectrons: 2 },
      { symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, group: 4, period: 5, category: 'transition metal', electronegativity: 1.33, oxidationStates: [4], valenceElectrons: 2 },
      { symbol: 'Nb', name: 'Niobium', atomicNumber: 41, group: 5, period: 5, category: 'transition metal', electronegativity: 1.6, oxidationStates: [5], valenceElectrons: 1 },
      { symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, group: 6, period: 5, category: 'transition metal', electronegativity: 2.16, oxidationStates: [6], valenceElectrons: 1 },
      { symbol: 'Tc', name: 'Technetium', atomicNumber: 43, group: 7, period: 5, category: 'transition metal', electronegativity: 1.9, oxidationStates: [7], valenceElectrons: 1 },
      { symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, group: 8, period: 5, category: 'transition metal', electronegativity: 2.2, oxidationStates: [3, 4], valenceElectrons: 1 },
      { symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, group: 9, period: 5, category: 'transition metal', electronegativity: 2.28, oxidationStates: [3], valenceElectrons: 1 },
      { symbol: 'Pd', name: 'Palladium', atomicNumber: 46, group: 10, period: 5, category: 'transition metal', electronegativity: 2.20, oxidationStates: [2, 4], valenceElectrons: 0 },
      { symbol: 'Ag', name: 'Silver', atomicNumber: 47, group: 11, period: 5, category: 'transition metal', electronegativity: 1.93, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, group: 12, period: 5, category: 'transition metal', electronegativity: 1.69, oxidationStates: [2], valenceElectrons: 2 },
      
      { symbol: 'In', name: 'Indium', atomicNumber: 49, group: 13, period: 5, category: 'post-transition metal', electronegativity: 1.78, oxidationStates: [3], valenceElectrons: 3 },
      { symbol: 'Sn', name: 'Tin', atomicNumber: 50, group: 14, period: 5, category: 'post-transition metal', electronegativity: 1.96, oxidationStates: [2, 4], valenceElectrons: 4 },
      { symbol: 'Sb', name: 'Antimony', atomicNumber: 51, group: 15, period: 5, category: 'metalloid', electronegativity: 2.05, oxidationStates: [-3, 3, 5], valenceElectrons: 5 },
      { symbol: 'Te', name: 'Tellurium', atomicNumber: 52, group: 16, period: 5, category: 'metalloid', electronegativity: 2.1, oxidationStates: [-2, 4, 6], valenceElectrons: 6 },
      { symbol: 'I', name: 'Iodine', atomicNumber: 53, group: 17, period: 5, category: 'halogen', electronegativity: 2.66, oxidationStates: [-1, 1, 3, 5, 7], valenceElectrons: 7 },
      { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, group: 18, period: 5, category: 'noble gas', electronegativity: 2.60, oxidationStates: [0, 2, 4, 6], valenceElectrons: 8 },
      
      // Period 6
      { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, group: 1, period: 6, category: 'alkali metal', electronegativity: 0.79, oxidationStates: [1], valenceElectrons: 1 },
      { symbol: 'Ba', name: 'Barium', atomicNumber: 56, group: 2, period: 6, category: 'alkaline earth metal', electronegativity: 0.89, oxidationStates: [2], valenceElectrons: 2 },
      
      // Add more essential elements for comprehensive coverage
      { symbol: 'Au', name: 'Gold', atomicNumber: 79, group: 11, period: 6, category: 'transition metal', electronegativity: 2.54, oxidationStates: [1, 3], valenceElectrons: 1 },
      { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, group: 10, period: 6, category: 'transition metal', electronegativity: 2.28, oxidationStates: [2, 4], valenceElectrons: 1 },
      { symbol: 'Pb', name: 'Lead', atomicNumber: 82, group: 14, period: 6, category: 'post-transition metal', electronegativity: 2.33, oxidationStates: [2, 4], valenceElectrons: 4 },
      { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, group: 12, period: 6, category: 'transition metal', electronegativity: 2.00, oxidationStates: [1, 2], valenceElectrons: 2 },
      
      // Noble gases that can form compounds
      { symbol: 'Rn', name: 'Radon', atomicNumber: 86, group: 18, period: 6, category: 'noble gas', electronegativity: 2.2, oxidationStates: [0, 2], valenceElectrons: 8 }
    ];

    for (const element of allElements) {
      this.elements.set(element.symbol, element);
    }
  }

  private loadChemistryRules(): void {
    if (this.database?.chemistry_rules_engine?.reactivity_rules) {
      this.rules = this.database.chemistry_rules_engine.reactivity_rules;
    }
  }

  private loadEssentialCompounds(): void {
    // Comprehensive fallback database with essential compounds for all common element combinations
    this.database = {
      compounds: {
        binary_halides: [
          // Alkali metal halides
          { formula: "LiF", name: "Lithium Fluoride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Toxic"] }, uses: ["Flux", "Optics"] },
          { formula: "LiCl", name: "Lithium Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Desiccant", "Medical"] },
          { formula: "LiBr", name: "Lithium Bromide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Air conditioning"] },
          { formula: "LiI", name: "Lithium Iodide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Electrolyte"] },
          
          { formula: "NaF", name: "Sodium Fluoride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Toxic in large doses"] }, uses: ["Toothpaste", "Water fluoridation"] },
          { formula: "NaCl", name: "Sodium Chloride", properties: { state: "solid", type: "ionic compound", color: "white", melting_point: "801°C", boiling_point: "1465°C" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Table salt", "Food preservation", "De-icing"] },
          { formula: "NaBr", name: "Sodium Bromide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Photography", "Medical sedative"] },
          { formula: "NaI", name: "Sodium Iodide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Medical imaging", "Radiation detection"] },
          
          { formula: "KF", name: "Potassium Fluoride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Toxic"] }, uses: ["Flux", "Etching"] },
          { formula: "KCl", name: "Potassium Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Fertilizer", "Medical uses"] },
          { formula: "KBr", name: "Potassium Bromide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Photography", "Anticonvulsant"] },
          { formula: "KI", name: "Potassium Iodide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Radiation protection", "Antiseptic"] },
          
          // Alkaline earth metal halides
          { formula: "MgF2", name: "Magnesium Fluoride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Optics", "Ceramics"] },
          { formula: "MgCl2", name: "Magnesium Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["De-icing", "Supplement"] },
          { formula: "CaF2", name: "Calcium Fluoride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Toxic if ingested"] }, uses: ["Steel production", "Glass manufacturing"] },
          { formula: "CaCl2", name: "Calcium Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["De-icing", "Desiccant"] },
          
          // Transition metal halides
          { formula: "AgCl", name: "Silver Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Photography", "Electrodes"] },
          { formula: "AgBr", name: "Silver Bromide", properties: { state: "solid", type: "ionic compound", color: "pale yellow" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Photography"] },
          { formula: "CuCl", name: "Copper(I) Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Irritant"] }, uses: ["Catalyst", "Preservative"] },
          { formula: "FeCl2", name: "Iron(II) Chloride", properties: { state: "solid", type: "ionic compound", color: "green" }, safety_data: { hazard_level: "medium", warnings: ["Corrosive"] }, uses: ["Water treatment"] },
          { formula: "ZnCl2", name: "Zinc Chloride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "medium", warnings: ["Corrosive"] }, uses: ["Flux", "Preservative"] }
        ],
        binary_oxides: [
          { formula: "H2O", name: "Water", properties: { state: "liquid", type: "molecular compound", color: "colorless", melting_point: "0°C", boiling_point: "100°C" }, safety_data: { hazard_level: "none", warnings: [] }, uses: ["Universal solvent", "Essential for life"] },
          { formula: "CO", name: "Carbon Monoxide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Extremely toxic", "Odorless poisonous gas"] }, uses: ["Industrial reducing agent"] },
          { formula: "CO2", name: "Carbon Dioxide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "low", warnings: ["Asphyxiant in high concentrations"] }, uses: ["Fire extinguisher", "Carbonated beverages"] },
          { formula: "SiO2", name: "Silicon Dioxide", properties: { state: "solid", type: "covalent network", color: "white" }, safety_data: { hazard_level: "low", warnings: ["Dust irritant"] }, uses: ["Glass", "Electronics"] },
          { formula: "Al2O3", name: "Aluminum Oxide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Abrasives", "Ceramics"] },
          { formula: "Fe2O3", name: "Iron(III) Oxide", properties: { state: "solid", type: "ionic compound", color: "red-brown" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Pigment", "Iron production"] },
          { formula: "CuO", name: "Copper(II) Oxide", properties: { state: "solid", type: "ionic compound", color: "black" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Ceramics", "Catalysts"] },
          { formula: "ZnO", name: "Zinc Oxide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Sunscreen", "Rubber"] },
          { formula: "MgO", name: "Magnesium Oxide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "low", warnings: [] }, uses: ["Refractory", "Antacid"] },
          { formula: "CaO", name: "Calcium Oxide", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "high", warnings: ["Caustic", "Reacts violently with water"] }, uses: ["Cement", "Steel production"] }
        ],
        hydrides: [
          { formula: "LiH", name: "Lithium Hydride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "high", warnings: ["Reacts violently with water"] }, uses: ["Reducing agent"] },
          { formula: "NaH", name: "Sodium Hydride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "high", warnings: ["Reacts violently with water"] }, uses: ["Reducing agent"] },
          { formula: "CaH2", name: "Calcium Hydride", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "high", warnings: ["Reacts with water"] }, uses: ["Desiccant", "Hydrogen source"] }
        ],
        acids: [
          { formula: "HCl", name: "Hydrogen Chloride", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Corrosive", "Toxic vapors"] }, uses: ["Industrial acid", "Chemical synthesis"] },
          { formula: "HF", name: "Hydrogen Fluoride", properties: { state: "liquid", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "very high", warnings: ["Extremely corrosive", "Burns skin and bones"] }, uses: ["Etching", "Industrial processes"] },
          { formula: "HBr", name: "Hydrogen Bromide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Corrosive", "Toxic"] }, uses: ["Chemical synthesis"] },
          { formula: "HI", name: "Hydrogen Iodide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Corrosive", "Toxic"] }, uses: ["Chemical synthesis"] },
          { formula: "H2S", name: "Hydrogen Sulfide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "very high", warnings: ["Extremely toxic", "Rotten egg odor"] }, uses: ["Industrial processes"] },
          { formula: "H2SO4", name: "Sulfuric Acid", properties: { state: "liquid", type: "molecular compound", color: "colorless", density: "1.84 g/cm³" }, safety_data: { hazard_level: "very high", warnings: ["Extremely corrosive", "Causes severe burns", "Reacts violently with water"] }, uses: ["Industrial acid", "Battery acid", "Chemical synthesis"] },
          { formula: "H2SO3", name: "Sulfurous Acid", properties: { state: "aqueous solution", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Corrosive", "Irritant"] }, uses: ["Food preservative", "Bleaching agent"] },
          { formula: "HNO3", name: "Nitric Acid", properties: { state: "liquid", type: "molecular compound", color: "colorless to yellow" }, safety_data: { hazard_level: "very high", warnings: ["Extremely corrosive", "Strong oxidizer", "Toxic vapors"] }, uses: ["Fertilizer production", "Explosives", "Metal etching"] },
          { formula: "H3PO4", name: "Phosphoric Acid", properties: { state: "liquid", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "medium", warnings: ["Corrosive", "Irritant"] }, uses: ["Food additive", "Fertilizer", "Soft drinks"] },
          { formula: "H2CO3", name: "Carbonic Acid", properties: { state: "aqueous solution", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "low", warnings: ["Mild irritant"] }, uses: ["Carbonated beverages", "pH buffering"] }
        ],
        organic_compounds: [
          { formula: "CH4", name: "Methane", properties: { state: "gas", type: "organic compound", color: "colorless" }, safety_data: { hazard_level: "medium", warnings: ["Flammable", "Asphyxiant"] }, uses: ["Natural gas", "Fuel"] },
          { formula: "NH3", name: "Ammonia", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Toxic", "Corrosive", "Irritant"] }, uses: ["Fertilizer", "Cleaning agent"] },
          { formula: "CO2", name: "Carbon Dioxide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "low", warnings: ["Asphyxiant in high concentrations"] }, uses: ["Fire extinguishers", "Carbonated drinks", "Photosynthesis"] },
          { formula: "SO2", name: "Sulfur Dioxide", properties: { state: "gas", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Toxic vapors", "Respiratory irritant", "Environmental pollutant"] }, uses: ["Food preservative", "Wine making", "Paper bleaching"] },
          { formula: "NO2", name: "Nitrogen Dioxide", properties: { state: "gas", type: "molecular compound", color: "reddish-brown" }, safety_data: { hazard_level: "very high", warnings: ["Highly toxic", "Strong oxidizer", "Respiratory damage"] }, uses: ["Nitric acid production", "Chemical synthesis"] },
          { formula: "NaHCO3", name: "Sodium Bicarbonate", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "very low", warnings: [] }, uses: ["Baking soda", "Antacid", "Cleaning agent", "Fire extinguisher"] },
          { formula: "CaCO3", name: "Calcium Carbonate", properties: { state: "solid", type: "ionic compound", color: "white" }, safety_data: { hazard_level: "very low", warnings: [] }, uses: ["Limestone", "Marble", "Antacid", "Construction material"] },
          { formula: "C2H6O", name: "Ethanol", properties: { state: "liquid", type: "organic compound", color: "colorless" }, safety_data: { hazard_level: "medium", warnings: ["Flammable", "Intoxicating"] }, uses: ["Alcoholic beverages", "Fuel additive", "Antiseptic", "Solvent"] },
          { formula: "C6H12O6", name: "Glucose", properties: { state: "solid", type: "organic compound", color: "white" }, safety_data: { hazard_level: "very low", warnings: [] }, uses: ["Food sweetener", "Energy source", "Medical solutions", "Fermentation"] }
        ],
        noble_gas_compounds: [
          { formula: "XeF4", name: "Xenon Tetrafluoride", properties: { state: "solid", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Highly reactive", "Toxic"] }, uses: ["Research", "Fluorinating agent"] },
          { formula: "KrF2", name: "Krypton Difluoride", properties: { state: "solid", type: "molecular compound", color: "colorless" }, safety_data: { hazard_level: "high", warnings: ["Highly reactive", "Unstable"] }, uses: ["Research"] }
        ]
      }
    };
  }

  private async predictCompoundWithCounts(elements: Array<{symbol: string, count: number}>): Promise<CompoundPrediction> {
    // Ensure elements are properly initialized
    if (this.elements.size === 0) {
      // Reinitializing elements database
      this.initializeElements();
    }
    
    // Validate input elements
    for (const element of elements) {
      if (!element.symbol || typeof element.count !== 'number' || element.count <= 0) {
        return {
          will_react: false,
          confidence: 0.1,
          source: 'rules_engine',
          reason: `Invalid element data: ${JSON.stringify(element)}`,
          note: 'Please check element symbols and counts'
        };
      }
    }
    
    const sortedElements = elements.sort((a, b) => a.symbol.localeCompare(b.symbol));
    const cacheKey = sortedElements.map(e => `${e.symbol}${e.count > 1 ? e.count : ''}`).join('-');
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Generate possible formulas based on element counts
    const formula = this.generateFormulaFromCounts(elements);
    
    // First, check if this exact formula exists in our database
    const exactMatch = this.searchDatabaseByFormula(formula);
    if (exactMatch) {
      const result = {
        ...exactMatch,
        source: 'database' as const,
        confidence: 1.0
      };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Apply chemistry rules considering stoichiometry
    const rulesResult = this.applyChemistryRulesWithCounts(elements);
    if (rulesResult.confidence > 0.8) {
      this.cache.set(cacheKey, rulesResult);
      return rulesResult;
    }

    // Try ML prediction with counts
    const mlResult = this.runMLModelWithCounts(elements);
    if (mlResult.confidence > 0.6) {
      this.cache.set(cacheKey, mlResult);
      return mlResult;
    }

    // No reaction predicted
    const noReaction = {
      will_react: false,
      confidence: 0.85,
      source: 'rules_engine' as const,
      reason: 'No favorable reaction conditions found for this stoichiometry',
      note: 'Consider different element ratios'
    };
    
    this.cache.set(cacheKey, noReaction);
    return noReaction;
  }

  private generateFormulaFromCounts(elements: Array<{symbol: string, count: number}>): string {
    if (!elements || elements.length === 0) {
      console.warn('⚠️ Empty elements array passed to generateFormulaFromCounts');
      return '';
    }
    
    // Generating formula for elements
    
    const formula = elements
      .sort((a, b) => {
        // Sort by electronegativity order for proper chemical formula
        const orderMap: {[key: string]: number} = { 
          'H': 1, 'Li': 2, 'Be': 3, 'B': 4, 'C': 5, 'N': 6, 'O': 7, 'F': 8,
          'Na': 9, 'Mg': 10, 'Al': 11, 'Si': 12, 'P': 13, 'S': 14, 'Cl': 15,
          'K': 16, 'Ca': 17, 'Br': 18, 'I': 19
        };
        return (orderMap[a.symbol] || 20) - (orderMap[b.symbol] || 20);
      })
      .map(e => e.count === 1 ? e.symbol : `${e.symbol}${e.count}`)
      .join('');
    
    // Generated formula
    return formula;
  }

  private searchDatabaseByFormula(formula: string): any {
    if (!this.database?.compounds) return null;
    
    // Search through all compound categories
    const categories = ['binary_halides', 'binary_oxides', 'hydrides', 'hydroxides', 'acids', 'salts', 'noble_gas_compounds', 'organic_compounds'];
    
    for (const category of categories) {
      const compounds = this.database.compounds[category];
      if (!compounds) continue;
      
      const found = compounds.find((compound: any) => 
        compound.formula === formula || 
        compound.formula === this.normalizeFormula(formula) ||
        this.formulasAreEquivalent(compound.formula, formula)
      );
      
      if (found) {
        return {
          will_react: true,
          formula: found.formula,
          name: found.name,
          properties: found.properties,
          safety: found.safety_data,
          uses: found.uses
        };
      }
    }
    
    return null;
  }

  private normalizeFormula(formula: string): string {
    // Handle common formula variations (e.g., H2O vs OH2)
    if (formula === 'H2O' || formula === 'OH2') return 'H2O';
    if (formula === 'HO' || formula === 'OH') return 'OH';
    return formula;
  }

  private formulasAreEquivalent(formula1: string, formula2: string): boolean {
    // More sophisticated formula comparison
    return this.normalizeFormula(formula1) === this.normalizeFormula(formula2);
  }

  private applyChemistryRulesWithCounts(elements: Array<{symbol: string, count: number}>): CompoundPrediction {
    const formula = this.generateFormulaFromCounts(elements);
    
    // Special case: H2O (water)
    if (formula === 'H2O') {
      // H2O detected - returning WATER (not hydroxide)
      return {
        will_react: true,
        confidence: 1.0,
        formula: 'H2O',
        name: 'water',
        properties: {
          state: 'liquid',
          type: 'molecular compound',
          color: 'colorless',
          melting_point: '0°C',
          boiling_point: '100°C'
        },
        safety: {
          hazard_level: 'none',
          warnings: []
        },
        uses: ['Universal solvent', 'Essential for life', 'Chemical reactions'],
        source: 'rules_engine',
        rule_applied: 'R004 - Hydrogen compounds with oxygen',
        warnings: []
      };
    }

    // Special case: OH (hydroxide ion)
    if (formula === 'HO' || formula === 'OH') {
      return {
        will_react: true,
        confidence: 0.95,
        formula: 'OH',
        name: 'hydroxide',
        properties: {
          state: 'ion',
          type: 'ionic',
          color: 'colorless'
        },
        safety: {
          hazard_level: 'medium',
          warnings: ['Basic/alkaline', 'Can cause burns']
        },
        uses: ['Chemical synthesis', 'pH adjustment'],
        source: 'rules_engine',
        rule_applied: 'R004 - Hydrogen-oxygen compounds',
        warnings: ['This is typically found as part of ionic compounds like NaOH']
      };
    }

    // Handle ternary and higher compounds (3+ elements)
    if (elements.length >= 3) {
      return this.handleMultiElementCompounds(elements, formula);
    }

    // Handle binary ionic compounds (Metal + Nonmetal)
    if (elements.length === 2) {
      const [el1, el2] = elements;
      
      // Check for alkali metal + halogen (like NaCl, KBr, etc.)
      if (this.isAlkaliMetal(el1.symbol) && this.isHalogen(el2.symbol)) {
        return {
          will_react: true,
          confidence: 1.0,
          formula,
          name: this.getCompoundName(el1.symbol, el2.symbol),
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white'
          },
          safety: {
            hazard_level: 'low',
            warnings: []
          },
          uses: ['Industrial applications', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R001 - Alkali metal + Halogen → Ionic salt',
          warnings: []
        };
      }

      // Check for alkaline earth metal + halogen
      if (this.isAlkalineEarthMetal(el1.symbol) && this.isHalogen(el2.symbol)) {
        const expectedFormula = this.getAlkalineEarthHalideFormula(el1.symbol, el2.symbol);
        return {
          will_react: true,
          confidence: 1.0,
          formula: expectedFormula,
          name: this.getCompoundName(el1.symbol, el2.symbol),
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white'
          },
          safety: {
            hazard_level: 'low',
            warnings: []
          },
          uses: ['Industrial applications', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R002 - Alkaline earth metal + Halogen → Ionic salt',
          warnings: []
        };
      }

      // Apply existing binary rules for other combinations
      return this.applyChemistryRules(elements[0].symbol, elements[1].symbol);
    }

    return {
      will_react: false,
      confidence: 0.3,
      source: 'rules_engine',
      reason: 'No specific rules for this combination'
    };
  }

  private runMLModelWithCounts(elements: Array<{symbol: string, count: number}>): CompoundPrediction {
    // Enhanced ML simulation considering stoichiometry
    const formula = this.generateFormulaFromCounts(elements);
    
    // Simulate ML prediction with some chemical knowledge
    if (elements.length === 2) {
      const [el1, el2] = elements;
      
      // Metal + Non-metal patterns
      if (this.isMetal(el1.symbol) && this.isNonmetal(el2.symbol)) {
        return {
          will_react: true,
          confidence: 0.85,
          formula,
          name: `${el1.symbol.toLowerCase()}-${el2.symbol.toLowerCase()} compound`,
          properties: { type: 'ionic compound', state: 'solid' },
          source: 'ml_model',
          warnings: []
        };
      }
    }

    return {
      will_react: false,
      confidence: 0.4,
      source: 'ml_model',
      reason: 'ML model suggests low reaction probability'
    };
  }



  private getCompoundName(metal: string, nonmetal: string): string {
    const metalNames: {[key: string]: string} = {
      'Li': 'lithium', 'Na': 'sodium', 'K': 'potassium', 'Rb': 'rubidium', 'Cs': 'cesium',
      'Be': 'beryllium', 'Mg': 'magnesium', 'Ca': 'calcium', 'Sr': 'strontium', 'Ba': 'barium'
    };
    
    const nonmetalNames: {[key: string]: string} = {
      'F': 'fluoride', 'Cl': 'chloride', 'Br': 'bromide', 'I': 'iodide'
    };
    
    const metalName = metalNames[metal] || metal.toLowerCase();
    const nonmetalName = nonmetalNames[nonmetal] || nonmetal.toLowerCase();
    
    return `${metalName} ${nonmetalName}`;
  }

  private getAlkalineEarthHalideFormula(metal: string, halogen: string): string {
    // Alkaline earth metals have +2 charge, halogens have -1 charge
    // So formula is MX2 (e.g., CaCl2, MgF2)
    return `${metal}${halogen}2`;
  }

  private isTransitionMetal(symbol: string): boolean {
    const transitionMetals = [
      'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
      'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd',
      'Au', 'Pt', 'Hg'
    ];
    return transitionMetals.includes(symbol);
  }

  private getTransitionMetalHalideFormula(metal: string, halogen: string): string {
    // Most common oxidation state formulas for transition metals with halogens
    const commonFormulas: {[key: string]: {[key: string]: string}} = {
      'Fe': { 'Cl': 'FeCl2', 'F': 'FeF2', 'Br': 'FeBr2', 'I': 'FeI2' },
      'Cu': { 'Cl': 'CuCl', 'F': 'CuF', 'Br': 'CuBr', 'I': 'CuI' },
      'Zn': { 'Cl': 'ZnCl2', 'F': 'ZnF2', 'Br': 'ZnBr2', 'I': 'ZnI2' },
      'Ag': { 'Cl': 'AgCl', 'F': 'AgF', 'Br': 'AgBr', 'I': 'AgI' },
      'Au': { 'Cl': 'AuCl3', 'F': 'AuF3', 'Br': 'AuBr3', 'I': 'AuI3' }
    };
    
    return commonFormulas[metal]?.[halogen] || `${metal}${halogen}2`;
  }

  private getTransitionMetalColor(metal: string, halogen: string): string {
    const colors: {[key: string]: {[key: string]: string}} = {
      'Fe': { 'Cl': 'green', 'F': 'pale green', 'Br': 'yellow-brown', 'I': 'dark brown' },
      'Cu': { 'Cl': 'white', 'F': 'white', 'Br': 'white', 'I': 'white' },
      'Zn': { 'Cl': 'white', 'F': 'white', 'Br': 'white', 'I': 'white' },
      'Ag': { 'Cl': 'white', 'F': 'yellow', 'Br': 'pale yellow', 'I': 'yellow' },
      'Au': { 'Cl': 'red', 'F': 'orange', 'Br': 'dark red', 'I': 'dark green' }
    };
    
    return colors[metal]?.[halogen] || 'colored';
  }

  private getMetalSulfideFormula(metal: string): string {
    // Common metal sulfide formulas
    const sulfideFormulas: {[key: string]: string} = {
      'Na': 'Na2S', 'K': 'K2S', 'Li': 'Li2S', 'Rb': 'Rb2S', 'Cs': 'Cs2S',
      'Mg': 'MgS', 'Ca': 'CaS', 'Sr': 'SrS', 'Ba': 'BaS',
      'Al': 'Al2S3', 'Fe': 'FeS', 'Cu': 'CuS', 'Zn': 'ZnS', 'Pb': 'PbS'
    };
    
    return sulfideFormulas[metal] || `${metal}S`;
  }

  private getSulfideColor(metal: string): string {
    const sulfideColors: {[key: string]: string} = {
      'Na': 'white', 'K': 'white', 'Li': 'white', 'Mg': 'white', 'Ca': 'white',
      'Al': 'yellow', 'Fe': 'black', 'Cu': 'black', 'Zn': 'white', 'Pb': 'black'
    };
    
    return sulfideColors[metal] || 'dark';
  }

  private getOxideColor(metal: string): string {
    const oxideColors: {[key: string]: string} = {
      'Na': 'white', 'K': 'white', 'Li': 'white', 'Mg': 'white', 'Ca': 'white',
      'Al': 'white', 'Fe': 'red-brown', 'Cu': 'black', 'Zn': 'white'
    };
    
    return oxideColors[metal] || 'white';
  }

  private getHalideNames(): {[key: string]: string} {
    return {
      'F': 'fluoride',
      'Cl': 'chloride', 
      'Br': 'bromide',
      'I': 'iodide'
    };
  }

  private getTransitionMetalOxideColor(metal: string): string {
    // Common colors for transition metal oxides
    const colorMap: {[key: string]: string} = {
      'Fe': 'red-brown',        // Iron oxide (rust)
      'Cu': 'black to red',     // Copper oxides
      'Cr': 'green',            // Chromium oxide
      'Mn': 'brown-black',      // Manganese oxide
      'Co': 'black',            // Cobalt oxide
      'Ni': 'green-black',      // Nickel oxide
      'Ti': 'white',            // Titanium dioxide
      'V': 'yellow-orange',     // Vanadium oxide
      'Zn': 'white',            // Zinc oxide
      'Ag': 'black-brown',      // Silver oxide
      'Au': 'purple-brown',     // Gold oxide
      'Pt': 'brown-black',      // Platinum oxide
      'Pd': 'black',            // Palladium oxide
      'Rh': 'gray',             // Rhodium oxide
      'Ir': 'blue-black',       // Iridium oxide
      'Os': 'brown',            // Osmium oxide
      'Ru': 'blue-black',       // Ruthenium oxide
      'Sc': 'white',            // Scandium oxide
      'Y': 'white',             // Yttrium oxide
      'La': 'white',            // Lanthanum oxide
      'Ce': 'pale yellow',      // Cerium oxide
      'Hf': 'white',            // Hafnium oxide
      'Ta': 'white',            // Tantalum oxide
      'W': 'yellow',            // Tungsten oxide
      'Re': 'blue-black'        // Rhenium oxide
    };
    
    return colorMap[metal] || 'colored';
  }

  private getOxideSafety(metal: string): string {
    const dangerousOxides = ['Na', 'K', 'Li', 'Ca', 'Ba'];
    return dangerousOxides.includes(metal) ? 'high' : 'low';
  }

  private getOxideWarnings(metal: string): string[] {
    const dangerousOxides = ['Na', 'K', 'Li', 'Ca', 'Ba'];
    return dangerousOxides.includes(metal) 
      ? ['Reacts violently with water', 'Caustic', 'Can cause burns']
      : [];
  }

  private getHydrogenHalideName(halogen: string): string {
    const names: {[key: string]: string} = {
      'F': 'hydrogen fluoride',
      'Cl': 'hydrogen chloride',
      'Br': 'hydrogen bromide',
      'I': 'hydrogen iodide'
    };
    
    return names[halogen] || `hydrogen ${halogen.toLowerCase()}ide`;
  }

  private handleMultiElementCompounds(elements: Array<{symbol: string, count: number}>, formula: string): CompoundPrediction {
    // Sort elements for pattern matching
    const elementSymbols = elements.map(e => e.symbol).sort();
    const elementCounts = elements.reduce((acc, e) => ({ ...acc, [e.symbol]: e.count }), {} as {[key: string]: number});
    
    // H2SO4 pattern: Hydrogen + Sulfur + Oxygen
    if (elementSymbols.includes('H') && elementSymbols.includes('S') && elementSymbols.includes('O')) {
      if (elementCounts['H'] === 2 && elementCounts['S'] === 1 && elementCounts['O'] === 4) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'H2SO4',
          name: 'sulfuric acid',
          properties: {
            state: 'liquid',
            type: 'molecular compound',
            color: 'colorless',
            density: '1.84 g/cm³',
            boiling_point: '337°C'
          },
          safety: {
            hazard_level: 'very high',
            warnings: ['Extremely corrosive', 'Causes severe burns', 'Reacts violently with water', 'Toxic vapors']
          },
          uses: ['Industrial acid', 'Battery acid', 'Chemical synthesis', 'Fertilizer production'],
          source: 'rules_engine',
          rule_applied: 'R014 - Hydrogen + Sulfur + Oxygen → Sulfuric Acid',
          warnings: ['Extremely dangerous - handle with extreme care', 'Always add acid to water, never water to acid']
        };
      }
      
      // H2SO3 pattern: Sulfurous acid
      if (elementCounts['H'] === 2 && elementCounts['S'] === 1 && elementCounts['O'] === 3) {
        return {
          will_react: true,
          confidence: 0.9,
          formula: 'H2SO3',
          name: 'sulfurous acid',
          properties: {
            state: 'aqueous solution',
            type: 'molecular compound',
            color: 'colorless'
          },
          safety: {
            hazard_level: 'high',
            warnings: ['Corrosive', 'Irritant', 'Toxic vapors']
          },
          uses: ['Food preservative', 'Bleaching agent', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R015 - Hydrogen + Sulfur + Oxygen → Sulfurous Acid',
          warnings: ['Corrosive to metals and organic matter']
        };
      }
    }

    // HNO3 pattern: Hydrogen + Nitrogen + Oxygen
    if (elementSymbols.includes('H') && elementSymbols.includes('N') && elementSymbols.includes('O')) {
      if (elementCounts['H'] === 1 && elementCounts['N'] === 1 && elementCounts['O'] === 3) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'HNO3',
          name: 'nitric acid',
          properties: {
            state: 'liquid',
            type: 'molecular compound',
            color: 'colorless to yellow',
            density: '1.41 g/cm³'
          },
          safety: {
            hazard_level: 'very high',
            warnings: ['Extremely corrosive', 'Strong oxidizer', 'Toxic vapors', 'Causes severe burns']
          },
          uses: ['Fertilizer production', 'Explosives', 'Metal etching', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R016 - Hydrogen + Nitrogen + Oxygen → Nitric Acid',
          warnings: ['Extremely dangerous oxidizing acid', 'Reacts violently with organic matter']
        };
      }
    }

    // H3PO4 pattern: Hydrogen + Phosphorus + Oxygen
    if (elementSymbols.includes('H') && elementSymbols.includes('P') && elementSymbols.includes('O')) {
      if (elementCounts['H'] === 3 && elementCounts['P'] === 1 && elementCounts['O'] === 4) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'H3PO4',
          name: 'phosphoric acid',
          properties: {
            state: 'liquid',
            type: 'molecular compound',
            color: 'colorless',
            density: '1.87 g/cm³'
          },
          safety: {
            hazard_level: 'medium',
            warnings: ['Corrosive', 'Irritant to skin and eyes']
          },
          uses: ['Food additive', 'Fertilizer', 'Rust removal', 'Soft drinks'],
          source: 'rules_engine',
          rule_applied: 'R017 - Hydrogen + Phosphorus + Oxygen → Phosphoric Acid',
          warnings: ['Moderately corrosive']
        };
      }
    }

    // NaOH pattern: Metal + Oxygen + Hydrogen (hydroxides)
    if (elementSymbols.includes('H') && elementSymbols.includes('O')) {
      const metals = elements.filter(e => this.isMetal(e.symbol));
      if (metals.length === 1 && elementCounts['H'] === 1 && elementCounts['O'] === 1) {
        const metal = metals[0].symbol;
        return {
          will_react: true,
          confidence: 0.95,
          formula: `${metal}OH`,
          name: `${this.elements.get(metal)?.name.toLowerCase()} hydroxide`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white'
          },
          safety: {
            hazard_level: 'high',
            warnings: ['Caustic', 'Corrosive', 'Can cause severe burns']
          },
          uses: ['Industrial base', 'Soap making', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R018 - Metal + Oxygen + Hydrogen → Metal Hydroxide',
          warnings: ['Highly caustic - causes chemical burns']
        };
      }
    }

    // CaCO3 pattern: Metal + Carbon + Oxygen (carbonates)
    if (elementSymbols.includes('C') && elementSymbols.includes('O')) {
      const metals = elements.filter(e => this.isMetal(e.symbol));
      if (metals.length === 1 && elementCounts['C'] === 1 && elementCounts['O'] === 3) {
        const metal = metals[0].symbol;
        const metalName = this.elements.get(metal)?.name.toLowerCase();
        return {
          will_react: true,
          confidence: 0.9,
          formula: `${metal}CO3`,
          name: `${metalName} carbonate`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white'
          },
          safety: {
            hazard_level: 'low',
            warnings: []
          },
          uses: ['Construction material', 'Antacid', 'Industrial applications'],
          source: 'rules_engine',
          rule_applied: 'R019 - Metal + Carbon + Oxygen → Metal Carbonate',
          warnings: []
        };
      }
    }

    // H2CO3 pattern: Hydrogen + Carbon + Oxygen (Carbonic Acid)
    if (elementSymbols.includes('H') && elementSymbols.includes('C') && elementSymbols.includes('O')) {
      if (elementCounts['H'] === 2 && elementCounts['C'] === 1 && elementCounts['O'] === 3) {
        return {
          will_react: true,
          confidence: 0.9,
          formula: 'H2CO3',
          name: 'carbonic acid',
          properties: {
            state: 'aqueous solution',
            type: 'molecular compound',
            color: 'colorless',
            stability: 'unstable in pure form'
          },
          safety: {
            hazard_level: 'low',
            warnings: ['Mild irritant']
          },
          uses: ['Carbonated beverages', 'pH buffering', 'Natural processes'],
          source: 'rules_engine',
          rule_applied: 'R020 - Hydrogen + Carbon + Oxygen → Carbonic Acid',
          warnings: ['Decomposes easily to CO2 and H2O']
        };
      }
    }

    // NH3 pattern: Nitrogen + Hydrogen (Ammonia)
    if (elementSymbols.includes('N') && elementSymbols.includes('H') && elementSymbols.length === 2) {
      if (elementCounts['N'] === 1 && elementCounts['H'] === 3) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'NH3',
          name: 'ammonia',
          properties: {
            state: 'gas',
            type: 'molecular compound',
            color: 'colorless',
            odor: 'pungent',
            boiling_point: '-33.3°C'
          },
          safety: {
            hazard_level: 'high',
            warnings: ['Toxic vapors', 'Caustic', 'Eye irritant', 'Flammable']
          },
          uses: ['Fertilizer production', 'Cleaning products', 'Refrigeration', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R021 - Nitrogen + Hydrogen → Ammonia',
          warnings: ['Highly toxic - avoid inhalation']
        };
      }
    }

    // CH4 pattern: Carbon + Hydrogen (Methane)
    if (elementSymbols.includes('C') && elementSymbols.includes('H') && elementSymbols.length === 2) {
      if (elementCounts['C'] === 1 && elementCounts['H'] === 4) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'CH4',
          name: 'methane',
          properties: {
            state: 'gas',
            type: 'molecular compound',
            color: 'colorless',
            odor: 'odorless',
            boiling_point: '-161.5°C'
          },
          safety: {
            hazard_level: 'medium',
            warnings: ['Highly flammable', 'Asphyxiant', 'Greenhouse gas']
          },
          uses: ['Natural gas fuel', 'Heating', 'Chemical feedstock', 'Hydrogen production'],
          source: 'rules_engine',
          rule_applied: 'R022 - Carbon + Hydrogen → Methane',
          warnings: ['Extremely flammable - keep away from ignition sources']
        };
      }
    }

    // CO2 pattern: Carbon + Oxygen (Carbon Dioxide)
    if (elementSymbols.includes('C') && elementSymbols.includes('O') && elementSymbols.length === 2) {
      if (elementCounts['C'] === 1 && elementCounts['O'] === 2) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'CO2',
          name: 'carbon dioxide',
          properties: {
            state: 'gas',
            type: 'molecular compound',
            color: 'colorless',
            odor: 'odorless',
            sublimation_point: '-78.5°C'
          },
          safety: {
            hazard_level: 'low',
            warnings: ['Asphyxiant in high concentrations', 'Dry ice causes frostbite']
          },
          uses: ['Carbonated beverages', 'Fire extinguishers', 'Dry ice', 'Photosynthesis', 'Industrial processes'],
          source: 'rules_engine',
          rule_applied: 'R023 - Carbon + Oxygen → Carbon Dioxide',
          warnings: ['Can cause suffocation in enclosed spaces']
        };
      }
    }

    // SO2 pattern: Sulfur + Oxygen (Sulfur Dioxide)
    if (elementSymbols.includes('S') && elementSymbols.includes('O') && elementSymbols.length === 2) {
      if (elementCounts['S'] === 1 && elementCounts['O'] === 2) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'SO2',
          name: 'sulfur dioxide',
          properties: {
            state: 'gas',
            type: 'molecular compound',
            color: 'colorless',
            odor: 'sharp, irritating',
            boiling_point: '-10°C'
          },
          safety: {
            hazard_level: 'high',
            warnings: ['Toxic vapors', 'Respiratory irritant', 'Environmental pollutant', 'Causes acid rain']
          },
          uses: ['Food preservative', 'Wine making', 'Paper bleaching', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R024 - Sulfur + Oxygen → Sulfur Dioxide',
          warnings: ['Major air pollutant - toxic to humans and environment']
        };
      }
    }

    // NO2 pattern: Nitrogen + Oxygen (Nitrogen Dioxide)
    if (elementSymbols.includes('N') && elementSymbols.includes('O') && elementSymbols.length === 2) {
      if (elementCounts['N'] === 1 && elementCounts['O'] === 2) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'NO2',
          name: 'nitrogen dioxide',
          properties: {
            state: 'gas',
            type: 'molecular compound',
            color: 'reddish-brown',
            odor: 'sharp, acrid',
            boiling_point: '21.2°C'
          },
          safety: {
            hazard_level: 'very high',
            warnings: ['Highly toxic', 'Strong oxidizer', 'Respiratory damage', 'Environmental pollutant']
          },
          uses: ['Nitric acid production', 'Rocket fuel oxidizer', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R025 - Nitrogen + Oxygen → Nitrogen Dioxide',
          warnings: ['Extremely toxic - can cause severe lung damage']
        };
      }
    }

    // NaHCO3 pattern: Sodium + Hydrogen + Carbon + Oxygen (Sodium Bicarbonate)
    if (elementSymbols.includes('Na') && elementSymbols.includes('H') && elementSymbols.includes('C') && elementSymbols.includes('O')) {
      if (elementCounts['Na'] === 1 && elementCounts['H'] === 1 && elementCounts['C'] === 1 && elementCounts['O'] === 3) {
        return {
          will_react: true,
          confidence: 1.0,
          formula: 'NaHCO3',
          name: 'sodium bicarbonate',
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white',
            crystal_structure: 'monoclinic',
            solubility: 'soluble in water'
          },
          safety: {
            hazard_level: 'very low',
            warnings: []
          },
          uses: ['Baking soda', 'Antacid', 'Fire extinguisher', 'Cleaning agent', 'Deodorizer'],
          source: 'rules_engine',
          rule_applied: 'R026 - Sodium + Hydrogen + Carbon + Oxygen → Sodium Bicarbonate',
          warnings: []
        };
      }
    }

    // C2H6O pattern: Ethanol (2C + 6H + 1O)
    if (elementSymbols.includes('C') && elementSymbols.includes('H') && elementSymbols.includes('O') && elementSymbols.length === 3) {
      if (elementCounts['C'] === 2 && elementCounts['H'] === 6 && elementCounts['O'] === 1) {
        return {
          will_react: true,
          confidence: 0.95,
          formula: 'C2H6O',
          name: 'ethanol',
          properties: {
            state: 'liquid',
            type: 'molecular compound',
            color: 'colorless',
            odor: 'pleasant',
            boiling_point: '78.4°C'
          },
          safety: {
            hazard_level: 'medium',
            warnings: ['Flammable', 'Intoxicating', 'Can cause drowsiness']
          },
          uses: ['Alcoholic beverages', 'Fuel additive', 'Antiseptic', 'Solvent', 'Chemical synthesis'],
          source: 'rules_engine',
          rule_applied: 'R027 - Carbon + Hydrogen + Oxygen → Ethanol',
          warnings: ['Highly flammable - keep away from heat sources']
        };
      }
    }

    // C6H12O6 pattern: Glucose (6C + 12H + 6O)
    if (elementSymbols.includes('C') && elementSymbols.includes('H') && elementSymbols.includes('O') && elementSymbols.length === 3) {
      if (elementCounts['C'] === 6 && elementCounts['H'] === 12 && elementCounts['O'] === 6) {
        return {
          will_react: true,
          confidence: 0.95,
          formula: 'C6H12O6',
          name: 'glucose',
          properties: {
            state: 'solid',
            type: 'molecular compound',
            color: 'white',
            crystal_structure: 'crystalline',
            solubility: 'highly soluble in water'
          },
          safety: {
            hazard_level: 'very low',
            warnings: []
          },
          uses: ['Food sweetener', 'Energy source', 'Medical IV solutions', 'Fermentation'],
          source: 'rules_engine',
          rule_applied: 'R028 - Carbon + Hydrogen + Oxygen → Glucose',
          warnings: []
        };
      }
    }

    // Advanced Element Patterns - Covering all 118 elements

    // Alkali Metal + Halogen + Oxygen (Metal Halates) - Li, Na, K, Rb, Cs, Fr + F, Cl, Br, I + O
    const alkaliMetals = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'];
    const halogens = ['F', 'Cl', 'Br', 'I'];
    const alkaliMetal = elements.find(e => alkaliMetals.includes(e.symbol));
    const halogen = elements.find(e => halogens.includes(e.symbol));
    
    if (alkaliMetal && halogen && elementSymbols.includes('O') && elementSymbols.length === 3) {
      if (elementCounts[alkaliMetal.symbol] === 1 && elementCounts[halogen.symbol] === 1 && elementCounts['O'] === 3) {
        const halogenName = halogen.symbol === 'F' ? 'fluor' : halogen.symbol === 'Cl' ? 'chlor' : halogen.symbol === 'Br' ? 'brom' : 'iod';
        return {
          will_react: true,
          confidence: 0.9,
          formula: `${alkaliMetal.symbol}${halogen.symbol}O3`,
          name: `${this.elements.get(alkaliMetal.symbol)?.name.toLowerCase()} ${halogenName}ate`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white',
            solubility: 'highly soluble'
          },
          safety: {
            hazard_level: 'medium',
            warnings: ['Oxidizing agent', 'May cause irritation']
          },
          uses: ['Oxidizing agent', 'Chemical synthesis', 'Industrial processes'],
          source: 'rules_engine',
          rule_applied: 'R029 - Alkali Metal + Halogen + Oxygen → Metal Halate',
          warnings: ['Strong oxidizer - keep away from combustible materials']
        };
      }
    }

    // Alkaline Earth Metal + Halogen (Binary) - Be, Mg, Ca, Sr, Ba, Ra + F, Cl, Br, I
    const alkalineEarthMetals = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
    const alkalineEarthMetal = elements.find(e => alkalineEarthMetals.includes(e.symbol));
    
    if (alkalineEarthMetal && halogen && elementSymbols.length === 2) {
      if (elementCounts[alkalineEarthMetal.symbol] === 1 && elementCounts[halogen.symbol] === 2) {
        return {
          will_react: true,
          confidence: 0.95,
          formula: `${alkalineEarthMetal.symbol}${halogen.symbol}2`,
          name: `${this.elements.get(alkalineEarthMetal.symbol)?.name.toLowerCase()} ${this.getHalideNames()[halogen.symbol]}`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white',
            crystal_structure: 'ionic lattice'
          },
          safety: {
            hazard_level: 'low',
            warnings: ['Generally safe', 'Avoid ingestion']
          },
          uses: ['Industrial processes', 'Chemical synthesis', 'Research'],
          source: 'rules_engine',
          rule_applied: 'R030 - Alkaline Earth Metal + Halogen → Metal Halide',
          warnings: []
        };
      }
    }

    // Transition Metal + Oxygen (Metal Oxides) - Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, etc.
    const transitionMetals = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'];
    const transitionMetal = elements.find(e => transitionMetals.includes(e.symbol));
    
    if (transitionMetal && elementSymbols.includes('O') && elementSymbols.length === 2) {
      const metalSymbol = transitionMetal.symbol;
      const oxygenCount = elementCounts['O'];
      const metalCount = elementCounts[metalSymbol];
      
      // Common oxidation states for transition metals
      let formula = '';
      let oxidationState = '';
      
      if (metalCount === 2 && oxygenCount === 3) {
        formula = `${metalSymbol}2O3`;
        oxidationState = '+3';
      } else if (metalCount === 1 && oxygenCount === 1) {
        formula = `${metalSymbol}O`;
        oxidationState = '+2';
      } else if (metalCount === 1 && oxygenCount === 2) {
        formula = `${metalSymbol}O2`;
        oxidationState = '+4';
      } else if (metalCount === 3 && oxygenCount === 4) {
        formula = `${metalSymbol}3O4`;
        oxidationState = 'mixed';
      }
      
      if (formula) {
        return {
          will_react: true,
          confidence: 0.9,
          formula,
          name: `${this.elements.get(metalSymbol)?.name.toLowerCase()} oxide`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: this.getTransitionMetalOxideColor(metalSymbol),
            crystal_structure: 'metal oxide lattice'
          },
          safety: {
            hazard_level: 'low',
            warnings: ['Generally safe', 'May cause irritation if inhaled']
          },
          uses: ['Catalyst', 'Pigment', 'Ceramic production', 'Industrial processes'],
          source: 'rules_engine',
          rule_applied: 'R031 - Transition Metal + Oxygen → Metal Oxide',
          warnings: [`Metal in ${oxidationState} oxidation state`]
        };
      }
    }

    // Lanthanide + Oxygen (Rare Earth Oxides) - La, Ce, Pr, Nd, Pm, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu
    const lanthanides = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'];
    const lanthanide = elements.find(e => lanthanides.includes(e.symbol));
    
    if (lanthanide && elementSymbols.includes('O') && elementSymbols.length === 2) {
      if (elementCounts[lanthanide.symbol] === 2 && elementCounts['O'] === 3) {
        return {
          will_react: true,
          confidence: 0.95,
          formula: `${lanthanide.symbol}2O3`,
          name: `${this.elements.get(lanthanide.symbol)?.name.toLowerCase()} oxide`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'varies by element',
            crystal_structure: 'rare earth oxide structure'
          },
          safety: {
            hazard_level: 'low',
            warnings: ['Generally safe', 'Rare earth element']
          },
          uses: ['Catalysts', 'Phosphors', 'High-tech applications', 'Research'],
          source: 'rules_engine',
          rule_applied: 'R032 - Lanthanide + Oxygen → Rare Earth Oxide',
          warnings: ['Valuable rare earth compound']
        };
      }
    }

    // Actinide + Oxygen (Actinide Oxides) - Th, Pa, U, Np, Pu, Am, Cm, Bk, Cf, Es, Fm, Md, No, Lr
    const actinides = ['Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'];
    const actinide = elements.find(e => actinides.includes(e.symbol));
    
    if (actinide && elementSymbols.includes('O') && elementSymbols.length === 2) {
      if (elementCounts[actinide.symbol] === 1 && elementCounts['O'] === 2) {
        return {
          will_react: true,
          confidence: 0.9,
          formula: `${actinide.symbol}O2`,
          name: `${this.elements.get(actinide.symbol)?.name.toLowerCase()} dioxide`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'varies by element',
            radioactivity: 'highly radioactive'
          },
          safety: {
            hazard_level: 'very high',
            warnings: ['Highly radioactive', 'Extremely dangerous', 'Requires special handling', 'Nuclear material']
          },
          uses: ['Nuclear fuel', 'Research', 'Nuclear weapons (restricted)'],
          source: 'rules_engine',
          rule_applied: 'R033 - Actinide + Oxygen → Actinide Oxide',
          warnings: ['RADIOACTIVE - Handle only in specialized facilities', 'Requires nuclear licensing']
        };
      }
    }

    // Post-transition Metals + Halogen - Al, Ga, In, Tl, Sn, Pb, Bi
    const postTransitionMetals = ['Al', 'Ga', 'In', 'Tl', 'Sn', 'Pb', 'Bi'];
    const postTransitionMetal = elements.find(e => postTransitionMetals.includes(e.symbol));
    
    if (postTransitionMetal && halogen && elementSymbols.length === 2) {
      const metalSymbol = postTransitionMetal.symbol;
      const halogenSymbol = halogen.symbol;
      const metalCount = elementCounts[metalSymbol];
      const halogenCount = elementCounts[halogenSymbol];
      
      // Common stoichiometry for post-transition metals
      if ((metalSymbol === 'Al' && metalCount === 1 && halogenCount === 3) || 
          (metalSymbol === 'Ga' && metalCount === 1 && halogenCount === 3) ||
          (metalSymbol === 'In' && metalCount === 1 && halogenCount === 3)) {
        return {
          will_react: true,
          confidence: 0.95,
          formula: `${metalSymbol}${halogenSymbol}3`,
          name: `${this.elements.get(metalSymbol)?.name.toLowerCase()} ${this.getHalideNames()[halogenSymbol]}`,
          properties: {
            state: 'solid',
            type: 'ionic compound',
            color: 'white to colored',
            crystal_structure: 'ionic lattice'
          },
          safety: {
            hazard_level: 'medium',
            warnings: ['May cause irritation', 'Avoid prolonged exposure']
          },
          uses: ['Industrial processes', 'Chemical synthesis', 'Electronics'],
          source: 'rules_engine',
          rule_applied: 'R034 - Post-transition Metal + Halogen → Metal Halide',
          warnings: []
        };
      }
    }

    // Metalloid + Halogen - B, Si, Ge, As, Sb, Te
    const metalloids = ['B', 'Si', 'Ge', 'As', 'Sb', 'Te'];
    const metalloid = elements.find(e => metalloids.includes(e.symbol));
    
    if (metalloid && halogen && elementSymbols.length === 2) {
      const metalloidSymbol = metalloid.symbol;
      const halogenSymbol = halogen.symbol;
      const metalloidCount = elementCounts[metalloidSymbol];
      const halogenCount = elementCounts[halogenSymbol];
      
      if (metalloidCount === 1 && (halogenCount === 3 || halogenCount === 4)) {
        return {
          will_react: true,
          confidence: 0.9,
          formula: `${metalloidSymbol}${halogenSymbol}${halogenCount}`,
          name: `${this.elements.get(metalloidSymbol)?.name.toLowerCase()} ${this.getHalideNames()[halogenSymbol]}`,
          properties: {
            state: halogenCount === 4 ? 'liquid' : 'solid',
            type: 'covalent compound',
            color: 'colorless to colored'
          },
          safety: {
            hazard_level: 'high',
            warnings: ['Toxic', 'Corrosive', 'Avoid inhalation']
          },
          uses: ['Chemical synthesis', 'Industrial processes', 'Semiconductor industry'],
          source: 'rules_engine',
          rule_applied: 'R035 - Metalloid + Halogen → Metalloid Halide',
          warnings: ['Handle with caution - toxic compound']
        };
      }
    }

    // Noble Gas Compounds (Rare but possible) - He, Ne, Ar, Kr, Xe, Rn
    const nobleGases = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
    const nobleGas = elements.find(e => nobleGases.includes(e.symbol));
    
    if (nobleGas && elementSymbols.includes('F') && elementSymbols.length === 2) {
      const gasSymbol = nobleGas.symbol;
      if ((gasSymbol === 'Xe' || gasSymbol === 'Kr') && elementCounts[gasSymbol] === 1) {
        const fluorineCount = elementCounts['F'];
        if (fluorineCount === 2 || fluorineCount === 4 || fluorineCount === 6) {
          return {
            will_react: true,
            confidence: 0.8,
            formula: `${gasSymbol}F${fluorineCount}`,
            name: `${this.elements.get(gasSymbol)?.name.toLowerCase()} fluoride`,
            properties: {
              state: 'solid',
              type: 'molecular compound',
              color: 'colorless',
              stability: 'moderately stable'
            },
            safety: {
              hazard_level: 'very high',
              warnings: ['Highly reactive', 'Toxic', 'Strong oxidizer', 'Experimental compound']
            },
            uses: ['Research', 'Fluorinating agent', 'Scientific studies'],
            source: 'rules_engine',
            rule_applied: 'R036 - Noble Gas + Fluorine → Noble Gas Fluoride',
            warnings: ['Extremely rare and reactive compound', 'Requires specialized conditions']
          };
        }
      }
    }

    // Default for multi-element: attempt to predict based on common patterns
    return {
      will_react: false,
      confidence: 0.4,
      source: 'rules_engine',
      reason: `Complex multi-element combination (${elements.length} elements) - requires specific conditions`,
      note: 'Try simpler binary combinations or check specific compound formulas',
      warnings: ['Multi-element reactions often require specific conditions like catalysts, temperature, or pressure']
    };
  }

}

// Export singleton instance
export const chemCraftAI = new ChemCraftAI();
export default chemCraftAI;