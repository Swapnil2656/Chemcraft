import { QuizQuestion, QuestionType, QuizCategory, Difficulty } from '@/types/quiz';
import { Element } from '@/types/element';

export const generateQuizQuestion = (elements: Element[], difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion => {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  
  const questionTypes = ['symbol', 'name', 'atomicNumber', 'category'];
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
  const options = [correct.symbol];
  const otherElements = allElements.filter(el => el.id !== correct.id);
  
  while (options.length < 4) {
    const randomEl = otherElements[Math.floor(Math.random() * otherElements.length)];
    if (!options.includes(randomEl.symbol)) {
      options.push(randomEl.symbol);
    }
  }
  
  return shuffleArray(options);
};

const generateNameOptions = (correct: Element, allElements: Element[]): string[] => {
  const options = [correct.name];
  const otherElements = allElements.filter(el => el.id !== correct.id);
  
  while (options.length < 4) {
    const randomEl = otherElements[Math.floor(Math.random() * otherElements.length)];
    if (!options.includes(randomEl.name)) {
      options.push(randomEl.name);
    }
  }
  
  return shuffleArray(options);
};

const generateAtomicNumberOptions = (correct: Element): string[] => {
  const options = [correct.atomicNumber.toString()];
  
  while (options.length < 4) {
    const randomNum = Math.max(1, correct.atomicNumber + Math.floor(Math.random() * 20) - 10);
    if (!options.includes(randomNum.toString())) {
      options.push(randomNum.toString());
    }
  }
  
  return shuffleArray(options);
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