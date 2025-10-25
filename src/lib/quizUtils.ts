import { QuizQuestion, QuestionType, QuizCategory, Difficulty } from '@/types/quiz';
import { Element } from '@/types/element';

export const generateQuizQuestion = (elements: Element[], difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion => {
  // TestSprite Enhancement: Add comprehensive input validation
  if (!elements || elements.length === 0) {
    throw new Error('QuizUtils: Cannot generate question - no elements provided');
  }
  
  if (elements.length < 4) {
    throw new Error('QuizUtils: Need at least 4 elements to generate multiple choice questions');
  }
  
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    console.warn(`QuizUtils: Invalid difficulty "${difficulty}", defaulting to "medium"`);
    difficulty = 'medium';
  }
  
  // Filter elements based on difficulty level
  const filteredElements = filterElementsByDifficulty(elements, difficulty);
  const randomElement = filteredElements[Math.floor(Math.random() * filteredElements.length)];
  
  if (!randomElement) {
    throw new Error(`QuizUtils: No elements available for difficulty level "${difficulty}"`);
  }
  
  const questionTypes = getQuestionTypesByDifficulty(difficulty);
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (questionType) {
    case 'symbol':
      return {
        id: `q-${Date.now()}`,
        question: `What is the chemical symbol for ${randomElement.name}?`,
        type: QuestionType.MULTIPLE_CHOICE,
        options: generateSymbolOptions(randomElement, elements),
        correctAnswer: randomElement.symbol,
        difficulty: difficulty as any,
        category: QuizCategory.PERIODIC_TABLE,
        explanation: `The chemical symbol for ${randomElement.name} is ${randomElement.symbol}.`,
        points: 10
      };
    
    case 'name':
      return {
        id: `q-${Date.now()}`,
        question: `What element has the symbol "${randomElement.symbol}"?`,
        type: QuestionType.MULTIPLE_CHOICE,
        options: generateNameOptions(randomElement, elements),
        correctAnswer: randomElement.name,
        difficulty: difficulty as any,
        category: QuizCategory.PERIODIC_TABLE,
        explanation: `${randomElement.symbol} is the symbol for ${randomElement.name}.`,
        points: 10
      };
    
    case 'atomicNumber':
      return {
        id: `q-${Date.now()}`,
        question: `What is the atomic number of ${randomElement.name}?`,
        type: QuestionType.MULTIPLE_CHOICE,
        options: generateAtomicNumberOptions(randomElement),
        correctAnswer: randomElement.atomicNumber.toString(),
        difficulty: difficulty as any,
        category: QuizCategory.ATOMIC_STRUCTURE,
        explanation: `${randomElement.name} has an atomic number of ${randomElement.atomicNumber}.`,
        points: 10
      };
    
    default:
      return {
        id: `q-${Date.now()}`,
        question: `What category does ${randomElement.name} belong to?`,
        type: QuestionType.MULTIPLE_CHOICE,
        options: generateCategoryOptions(randomElement),
        correctAnswer: randomElement.category,
        difficulty: difficulty as any,
        category: QuizCategory.PERIODIC_TABLE,
        explanation: `${randomElement.name} belongs to the ${randomElement.category} category.`,
        points: 10
      };
  }
};

const generateSymbolOptions = (correct: Element, allElements: Element[]): string[] => {
  try {
    if (!correct?.symbol) {
      throw new Error('Invalid correct element or missing symbol');
    }
    
    const options = [correct.symbol];
    const otherElements = allElements.filter(el => el?.id !== correct.id && el?.symbol && el.symbol !== correct.symbol);
    
    if (otherElements.length < 3) {
      console.warn('QuizUtils: Not enough elements for diverse options, using fallback symbols');
      // Fallback with common element symbols
      const fallbackSymbols = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];
      const validFallbacks = fallbackSymbols.filter(symbol => symbol !== correct.symbol);
      options.push(...validFallbacks.slice(0, 3));
    } else {
      // Intelligent selection: prefer elements from same period or group for better difficulty
      const sameGroupElements = otherElements.filter(el => 
        Math.abs(el.atomicNumber - correct.atomicNumber) <= 10
      );
      
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loops
      
      while (options.length < 4 && attempts < maxAttempts) {
        const sourceElements = sameGroupElements.length >= 3 ? sameGroupElements : otherElements;
        const randomEl = sourceElements[Math.floor(Math.random() * sourceElements.length)];
        
        if (randomEl?.symbol && !options.includes(randomEl.symbol)) {
          options.push(randomEl.symbol);
        }
        attempts++;
      }
      
      // Fill remaining slots if needed
      while (options.length < 4) {
        const fallback = `X${options.length}`;
        options.push(fallback);
      }
    }
    
    return shuffleArray(options.slice(0, 4)); // Ensure exactly 4 options
  } catch (error) {
    console.error('QuizUtils: Error generating symbol options:', error);
    return [correct?.symbol || 'X', 'Y', 'Z', 'W']; // Safe fallback
  }
};

const generateNameOptions = (correct: Element, allElements: Element[]): string[] => {
  try {
    if (!correct?.name) {
      throw new Error('Invalid correct element or missing name');
    }
    
    const options = [correct.name];
    const otherElements = allElements.filter(el => 
      el?.id !== correct.id && 
      el?.name && 
      el.name !== correct.name &&
      el.name.length > 0
    );
    
    if (otherElements.length < 3) {
      console.warn('QuizUtils: Not enough elements for diverse name options');
      const fallbackNames = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon'];
      const validFallbacks = fallbackNames.filter(name => name !== correct.name);
      options.push(...validFallbacks.slice(0, 3));
    } else {
      // Smart selection: prefer elements with similar characteristics or naming patterns
      const similarElements = otherElements.filter(el => {
        // Prefer elements from same category or similar atomic mass
        return el.category === correct.category || 
               Math.abs(el.atomicNumber - correct.atomicNumber) <= 15;
      });
      
      let attempts = 0;
      const maxAttempts = 50;
      
      while (options.length < 4 && attempts < maxAttempts) {
        const sourceElements = similarElements.length >= 3 ? similarElements : otherElements;
        const randomEl = sourceElements[Math.floor(Math.random() * sourceElements.length)];
        
        if (randomEl?.name && !options.includes(randomEl.name)) {
          options.push(randomEl.name);
        }
        attempts++;
      }
      
      // Fill remaining slots with safe fallbacks
      const elementFallbacks = ['Oxygen', 'Nitrogen', 'Fluorine', 'Neon'];
      let fallbackIndex = 0;
      while (options.length < 4 && fallbackIndex < elementFallbacks.length) {
        const fallback = elementFallbacks[fallbackIndex];
        if (!options.includes(fallback)) {
          options.push(fallback);
        }
        fallbackIndex++;
      }
    }
    
    return shuffleArray(options.slice(0, 4));
  } catch (error) {
    console.error('QuizUtils: Error generating name options:', error);
    return [correct?.name || 'Unknown', 'Hydrogen', 'Oxygen', 'Carbon'];
  }
};

const generateAtomicNumberOptions = (correct: Element): string[] => {
  try {
    if (!correct || typeof correct.atomicNumber !== 'number' || correct.atomicNumber < 1) {
      throw new Error('Invalid element or atomic number');
    }
    
    const options = [correct.atomicNumber.toString()];
    const usedNumbers = new Set([correct.atomicNumber]);
    
    // Generate realistic distractors based on atomic number ranges
    const generateDistractor = (): number => {
      let randomNum: number;
      let attempts = 0;
      const maxAttempts = 20;
      
      do {
        // Smart distractor generation based on atomic number ranges
        if (correct.atomicNumber <= 20) {
          // For light elements, stay within 1-30 range
          randomNum = Math.floor(Math.random() * 30) + 1;
        } else if (correct.atomicNumber <= 54) {
          // For medium elements, use broader range but avoid extremes
          randomNum = Math.max(1, correct.atomicNumber + Math.floor(Math.random() * 40) - 20);
        } else {
          // For heavy elements, use wide range
          randomNum = Math.max(1, correct.atomicNumber + Math.floor(Math.random() * 60) - 30);
        }
        
        // Ensure realistic atomic number (1-118)
        randomNum = Math.min(118, Math.max(1, randomNum));
        attempts++;
      } while (usedNumbers.has(randomNum) && attempts < maxAttempts);
      
      return randomNum;
    };
    
    while (options.length < 4) {
      const distractor = generateDistractor();
      if (!usedNumbers.has(distractor)) {
        options.push(distractor.toString());
        usedNumbers.add(distractor);
      }
    }
    
    // Validate all options are different and within valid range
    const validOptions = options.filter((opt, index, self) => {
      const num = parseInt(opt);
      return num >= 1 && num <= 118 && self.indexOf(opt) === index;
    });
    
    // Fill with safe fallbacks if needed
    while (validOptions.length < 4) {
      let fallback = validOptions.length;
      while (validOptions.includes(fallback.toString())) {
        fallback++;
      }
      validOptions.push(fallback.toString());
    }
    
    return shuffleArray(validOptions.slice(0, 4));
  } catch (error) {
    console.error('QuizUtils: Error generating atomic number options:', error);
    const safeCorrect = correct?.atomicNumber?.toString() || '1';
    return shuffleArray([safeCorrect, '2', '3', '4']);
  }
};

const generateCategoryOptions = (correct: Element): string[] => {
  const categories = [
    'alkali-metals',
    'alkaline-earth-metals',
    'transition-metals',
    'post-transition-metals',
    'metalloids',
    'nonmetals',
    'halogens',
    'noble-gases',
    'lanthanides',
    'actinides'
  ];
  
  const options: string[] = [correct.category];
  const otherCategories = categories.filter(cat => cat !== correct.category);
  
  while (options.length < 4) {
    const randomCat = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    if (!options.includes(randomCat)) {
      options.push(randomCat);
    }
  }
  
  return shuffleArray(options);
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// TestSprite Enhancement: Difficulty-based element filtering
const filterElementsByDifficulty = (elements: Element[], difficulty: string): Element[] => {
  try {
    switch (difficulty) {
      case 'easy':
        // Focus on common elements (atomic numbers 1-20)
        return elements.filter(el => el.atomicNumber <= 20);
      case 'medium':
        // Include transition metals and common elements (atomic numbers 1-54)
        return elements.filter(el => el.atomicNumber <= 54);
      case 'hard':
        // All elements including rare earth elements
        return elements;
      default:
        return elements;
    }
  } catch (error) {
    console.error('QuizUtils: Error filtering elements by difficulty:', error);
    return elements; // Fallback to all elements
  }
};

// TestSprite Enhancement: Difficulty-based question types
const getQuestionTypesByDifficulty = (difficulty: string): string[] => {
  try {
    switch (difficulty) {
      case 'easy':
        return ['symbol', 'name']; // Basic symbol and name recognition
      case 'medium':
        return ['symbol', 'name', 'atomicNumber']; // Add atomic numbers
      case 'hard':
        return ['symbol', 'name', 'atomicNumber', 'category', 'properties']; // All question types
      default:
        return ['symbol', 'name', 'atomicNumber', 'category'];
    }
  } catch (error) {
    console.error('QuizUtils: Error getting question types by difficulty:', error);
    return ['symbol', 'name']; // Safe fallback
  }
};

// TestSprite Enhancement: Input validation helper
export const validateQuizInputs = (elements: Element[], difficulty: string): { isValid: boolean; error?: string } => {
  try {
    if (!elements) {
      return { isValid: false, error: 'Elements array is null or undefined' };
    }
    
    if (!Array.isArray(elements)) {
      return { isValid: false, error: 'Elements must be an array' };
    }
    
    if (elements.length === 0) {
      return { isValid: false, error: 'Elements array is empty' };
    }
    
    if (elements.length < 4) {
      return { isValid: false, error: 'Need at least 4 elements for multiple choice questions' };
    }
    
    if (!difficulty || typeof difficulty !== 'string') {
      return { isValid: false, error: 'Difficulty must be a non-empty string' };
    }
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return { isValid: false, error: 'Difficulty must be "easy", "medium", or "hard"' };
    }
    
    // Validate element structure
    for (const element of elements) {
      if (!element.id || !element.name || !element.symbol || typeof element.atomicNumber !== 'number') {
        return { isValid: false, error: 'Invalid element structure detected' };
      }
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// TestSprite Enhancement: Error recovery for question generation
export const generateQuizQuestionSafe = (elements: Element[], difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion | null => {
  try {
    const validation = validateQuizInputs(elements, difficulty);
    if (!validation.isValid) {
      console.error('QuizUtils: Validation failed:', validation.error);
      return null;
    }
    
    return generateQuizQuestion(elements, difficulty);
  } catch (error) {
    console.error('QuizUtils: Error generating quiz question:', error);
    
    // Attempt recovery with fallback options
    try {
      console.log('QuizUtils: Attempting recovery with simplified question...');
      if (elements.length >= 4) {
        const fallbackElement = elements[0]; // Use first element as fallback
        return {
          id: `fallback-q-${Date.now()}`,
          question: `What is the chemical symbol for ${fallbackElement.name}?`,
          type: QuestionType.MULTIPLE_CHOICE,
          options: [fallbackElement.symbol, 'X', 'Y', 'Z'], // Simple fallback options
          correctAnswer: fallbackElement.symbol,
          difficulty: difficulty as any,
          category: QuizCategory.PERIODIC_TABLE,
          explanation: `The chemical symbol for ${fallbackElement.name} is ${fallbackElement.symbol}.`,
          points: 5 // Reduced points for fallback question
        };
      }
    } catch (recoveryError) {
      console.error('QuizUtils: Recovery attempt failed:', recoveryError);
    }
    
    return null;
  }
};