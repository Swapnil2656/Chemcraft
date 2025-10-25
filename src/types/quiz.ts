export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: QuizCategory;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints?: string[];
  image?: string;
  timeLimit?: number; // in seconds
  points: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
  FILL_IN_BLANK = 'fill-in-blank',
  NUMERIC = 'numeric',
  DRAG_DROP = 'drag-drop',
  ELEMENT_IDENTIFICATION = 'element-identification',
  COMPOUND_FORMATION = 'compound-formation',
  MATCH_PAIR = 'match-pair',
  REACTION_PREDICTION = 'reaction-prediction'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export enum QuizCategory {
  PERIODIC_TABLE = 'periodic-table',
  ATOMIC_STRUCTURE = 'atomic-structure',
  CHEMICAL_BONDS = 'chemical-bonds',
  REACTIONS = 'reactions',
  COMPOUNDS = 'compounds',
  STOICHIOMETRY = 'stoichiometry',
  THERMODYNAMICS = 'thermodynamics',
  GENERAL = 'general'
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
  startTime: Date;
  endTime?: Date;
  timeSpent: number; // in seconds
  completed: boolean;
  settings: QuizSettings;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  points: number;
}

export interface QuizSettings {
  numberOfQuestions: number;
  difficulty: Difficulty[];
  categories: QuizCategory[];
  timeLimit?: number; // in seconds
  hintsEnabled: boolean;
  showExplanations: boolean;
  randomOrder: boolean;
}

export interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  categoryStats: Record<QuizCategory, CategoryStats>;
  difficultyStats: Record<Difficulty, DifficultyStats>;
  streak: number;
  lastPlayedDate: Date;
}

export interface CategoryStats {
  questionsAttempted: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
}

export interface DifficultyStats {
  questionsAttempted: number;
  correctAnswers: number;
  averageScore: number;
  averageTime: number;
}
