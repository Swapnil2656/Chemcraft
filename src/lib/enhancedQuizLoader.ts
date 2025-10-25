import { QuizQuestion, QuestionType, Difficulty, QuizCategory } from '@/types/quiz';

interface EnhancedQuizQuestion {
  id: number;
  type: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
  topic: string;
  explanation: string;
  related_elements: string[];
}

interface EnhancedQuizData {
  elements: any[];
  reactions: any[];
  quiz: {
    metadata: {
      total_questions: number;
      difficulty_distribution: { easy: number; medium: number; hard: number };
      types_included: string[];
      factual_accuracy_required: boolean;
      ai_generated: boolean;
      unique_questions_only: boolean;
    };
    questions: EnhancedQuizQuestion[];
    reaction_prediction_subsection: any;
    evaluation_key: any;
  };
}

export async function loadEnhancedQuizData(): Promise<QuizQuestion[]> {
  try {
    const response = await fetch('/data/enhanced-quiz-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
    }
    
    const data: EnhancedQuizData = await response.json();
    
    return data.quiz.questions.map(transformQuestion);
  } catch (error) {
    console.error('Error loading enhanced quiz data:', error);
    return [];
  }
}

function transformQuestion(enhancedQuestion: EnhancedQuizQuestion): QuizQuestion {
  // Map question types
  const typeMapping: Record<string, QuestionType> = {
    'multiple_choice': QuestionType.MULTIPLE_CHOICE,
    'true_false': QuestionType.TRUE_FALSE,
    'fill_in_blank': QuestionType.FILL_IN_BLANK,
    'match_pair': QuestionType.MULTIPLE_CHOICE, // Transform to multiple choice for now
    'reaction_prediction': QuestionType.MULTIPLE_CHOICE
  };

  // Map difficulties
  const difficultyMapping: Record<string, Difficulty> = {
    'easy': Difficulty.EASY,
    'medium': Difficulty.MEDIUM,
    'hard': Difficulty.HARD
  };

  // Map topics to categories
  const categoryMapping: Record<string, QuizCategory> = {
    'atomic_structure': QuizCategory.ATOMIC_STRUCTURE,
    'periodic_properties': QuizCategory.PERIODIC_TABLE,
    'bonding': QuizCategory.CHEMICAL_BONDS,
    'reaction': QuizCategory.REACTIONS,
    'group_trends': QuizCategory.PERIODIC_TABLE,
    'compounds': QuizCategory.COMPOUNDS,
    'stoichiometry': QuizCategory.STOICHIOMETRY,
    'thermodynamics': QuizCategory.THERMODYNAMICS
  };

  // Calculate points based on difficulty
  const pointsMapping: Record<string, number> = {
    'easy': 10,
    'medium': 15,
    'hard': 20
  };

  return {
    id: `enhanced_${enhancedQuestion.id}`,
    type: typeMapping[enhancedQuestion.type] || QuestionType.MULTIPLE_CHOICE,
    difficulty: difficultyMapping[enhancedQuestion.difficulty] || Difficulty.MEDIUM,
    category: categoryMapping[enhancedQuestion.topic] || QuizCategory.GENERAL,
    question: enhancedQuestion.question,
    options: enhancedQuestion.options,
    correctAnswer: enhancedQuestion.answer,
    explanation: enhancedQuestion.explanation,
    points: pointsMapping[enhancedQuestion.difficulty] || 15,
    hints: generateHints(enhancedQuestion)
  };
}

function generateHints(question: EnhancedQuizQuestion): string[] {
  const hints: string[] = [];
  
  // Generate context-based hints
  if (question.related_elements.length > 0) {
    hints.push(`This question relates to: ${question.related_elements.join(', ')}`);
  }
  
  // Topic-specific hints
  switch (question.topic) {
    case 'atomic_structure':
      hints.push('Think about the structure of atoms and their components');
      break;
    case 'periodic_properties':
      hints.push('Consider the trends in the periodic table');
      break;
    case 'bonding':
      hints.push('Think about how atoms connect to form compounds');
      break;
    case 'reaction':
      hints.push('Consider the chemical reaction and what products form');
      break;
    case 'group_trends':
      hints.push('Elements in the same group have similar properties');
      break;
  }
  
  return hints.slice(0, 2); // Limit to 2 hints
}

export async function getEnhancedQuizMetadata() {
  try {
    const response = await fetch('/data/enhanced-quiz-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz metadata: ${response.statusText}`);
    }
    
    const data: EnhancedQuizData = await response.json();
    return data.quiz.metadata;
  } catch (error) {
    console.error('Error loading enhanced quiz metadata:', error);
    return null;
  }
}

export async function getReactionData() {
  try {
    const response = await fetch('/data/enhanced-quiz-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch reaction data: ${response.statusText}`);
    }
    
    const data: EnhancedQuizData = await response.json();
    return data.reactions;
  } catch (error) {
    console.error('Error loading reaction data:', error);
    return [];
  }
}

export async function getElementData() {
  try {
    const response = await fetch('/data/enhanced-quiz-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch element data: ${response.statusText}`);
    }
    
    const data: EnhancedQuizData = await response.json();
    return data.elements;
  } catch (error) {
    console.error('Error loading element data:', error);
    return [];
  }
}