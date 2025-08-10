import { QuizQuestion, QuestionType, Difficulty, QuizCategory } from '@/types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.EASY,
    category: QuizCategory.PERIODIC_TABLE,
    question: 'What is the symbol for Hydrogen?',
    options: ['H', 'He', 'Hy', 'Hg'],
    correctAnswer: 'H',
    explanation: 'Hydrogen is the first element on the periodic table and has the symbol H.',
    hints: ['It\'s the first element on the periodic table', 'It starts with H'],
    points: 10
  },
  {
    id: 'q2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.EASY,
    category: QuizCategory.PERIODIC_TABLE,
    question: 'Which element has the atomic number 6?',
    options: ['Boron', 'Carbon', 'Nitrogen', 'Oxygen'],
    correctAnswer: 'Carbon',
    explanation: 'Carbon has 6 protons, giving it the atomic number 6.',
    hints: ['It forms the basis of organic chemistry', 'It\'s essential for life'],
    points: 10
  },
  {
    id: 'q3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.MEDIUM,
    category: QuizCategory.CHEMICAL_BONDS,
    question: 'What type of bond is formed between sodium and chlorine in NaCl?',
    options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
    correctAnswer: 'Ionic',
    explanation: 'Sodium loses an electron to chlorine, forming charged ions that are held together by electrostatic forces.',
    hints: ['One atom gives up electrons', 'Opposite charges attract'],
    points: 15
  },
  {
    id: 'q4',
    type: QuestionType.TRUE_FALSE,
    difficulty: Difficulty.EASY,
    category: QuizCategory.PERIODIC_TABLE,
    question: 'Noble gases are highly reactive.',
    correctAnswer: 'false',
    explanation: 'Noble gases are inert because they have complete outer electron shells.',
    hints: ['Think about their electron configuration', 'They rarely form compounds'],
    points: 10
  },
  {
    id: 'q5',
    type: QuestionType.FILL_IN_BLANK,
    difficulty: Difficulty.MEDIUM,
    category: QuizCategory.ATOMIC_STRUCTURE,
    question: 'The number of protons in an atom determines its _____ number.',
    correctAnswer: 'atomic',
    explanation: 'The atomic number is defined as the number of protons in the nucleus of an atom.',
    hints: ['It\'s what makes each element unique', 'It\'s listed above the symbol'],
    points: 15
  },
  {
    id: 'q6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.HARD,
    category: QuizCategory.REACTIONS,
    question: 'In the reaction 2H₂ + O₂ → 2H₂O, what type of reaction is this?',
    options: ['Decomposition', 'Synthesis', 'Single replacement', 'Double replacement'],
    correctAnswer: 'Synthesis',
    explanation: 'This is a synthesis reaction where two or more reactants combine to form a single product.',
    hints: ['Multiple reactants form one product', 'It\'s the opposite of decomposition'],
    points: 20
  },
  {
    id: 'q7',
    type: QuestionType.NUMERIC,
    difficulty: Difficulty.MEDIUM,
    category: QuizCategory.STOICHIOMETRY,
    question: 'How many electrons does a neutral carbon atom have?',
    correctAnswer: 6,
    explanation: 'A neutral atom has equal numbers of protons and electrons. Carbon has 6 protons, so it has 6 electrons.',
    hints: ['Same as the number of protons', 'Look at the atomic number'],
    points: 15
  },
  {
    id: 'q8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.HARD,
    category: QuizCategory.COMPOUNDS,
    question: 'What is the molecular formula for glucose?',
    options: ['C₆H₁₂O₆', 'C₆H₁₀O₅', 'C₁₂H₂₂O₁₁', 'C₂H₆O'],
    correctAnswer: 'C₆H₁₂O₆',
    explanation: 'Glucose is a simple sugar with the molecular formula C₆H₁₂O₆.',
    hints: ['It\'s a simple sugar', 'Contains 6 carbon atoms'],
    points: 20
  },
  {
    id: 'q9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.EASY,
    category: QuizCategory.PERIODIC_TABLE,
    question: 'Which group contains the alkali metals?',
    options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'],
    correctAnswer: 'Group 1',
    explanation: 'Alkali metals are found in Group 1 of the periodic table.',
    hints: ['They\'re the first group', 'They have one electron in their outer shell'],
    points: 10
  },
  {
    id: 'q10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.MEDIUM,
    category: QuizCategory.ATOMIC_STRUCTURE,
    question: 'What is the electron configuration of sodium (Na)?',
    options: ['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ 3s²', '1s² 2s² 2p⁵', '1s² 2s² 2p⁶'],
    correctAnswer: '1s² 2s² 2p⁶ 3s¹',
    explanation: 'Sodium has 11 electrons, distributed as 1s² 2s² 2p⁶ 3s¹.',
    hints: ['Sodium has 11 electrons', 'It has one electron in its outermost shell'],
    points: 15
  }
];

export const QUIZ_CATEGORIES_INFO = {
  [QuizCategory.PERIODIC_TABLE]: {
    name: 'Periodic Table',
    description: 'Test your knowledge of elements and their properties',
    color: '#3b82f6',
    icon: 'table'
  },
  [QuizCategory.ATOMIC_STRUCTURE]: {
    name: 'Atomic Structure',
    description: 'Learn about atoms, electrons, and electron configurations',
    color: '#8b5cf6',
    icon: 'atom'
  },
  [QuizCategory.CHEMICAL_BONDS]: {
    name: 'Chemical Bonds',
    description: 'Understand how atoms bond together',
    color: '#ef4444',
    icon: 'link'
  },
  [QuizCategory.REACTIONS]: {
    name: 'Chemical Reactions',
    description: 'Test your understanding of chemical reactions',
    color: '#f59e0b',
    icon: 'zap'
  },
  [QuizCategory.COMPOUNDS]: {
    name: 'Compounds',
    description: 'Learn about molecular formulas and compounds',
    color: '#10b981',
    icon: 'molecule'
  },
  [QuizCategory.STOICHIOMETRY]: {
    name: 'Stoichiometry',
    description: 'Calculate quantities in chemical reactions',
    color: '#6366f1',
    icon: 'calculator'
  },
  [QuizCategory.THERMODYNAMICS]: {
    name: 'Thermodynamics',
    description: 'Energy changes in chemical reactions',
    color: '#ec4899',
    icon: 'thermometer'
  },
  [QuizCategory.GENERAL]: {
    name: 'General Chemistry',
    description: 'Mixed questions from all topics',
    color: '#64748b',
    icon: 'flask'
  }
};

export const DIFFICULTY_SETTINGS = {
  [Difficulty.EASY]: {
    name: 'Easy',
    color: '#10b981',
    timeLimit: 30,
    points: 10
  },
  [Difficulty.MEDIUM]: {
    name: 'Medium',
    color: '#f59e0b',
    timeLimit: 45,
    points: 15
  },
  [Difficulty.HARD]: {
    name: 'Hard',
    color: '#ef4444',
    timeLimit: 60,
    points: 20
  },
  [Difficulty.EXPERT]: {
    name: 'Expert',
    color: '#8b5cf6',
    timeLimit: 90,
    points: 25
  }
};

export const DEFAULT_QUIZ_SETTINGS = {
  numberOfQuestions: 10,
  difficulty: [Difficulty.EASY, Difficulty.MEDIUM],
  categories: [QuizCategory.PERIODIC_TABLE, QuizCategory.GENERAL],
  timeLimit: 300, // 5 minutes
  hintsEnabled: true,
  showExplanations: true,
  randomOrder: true
};
