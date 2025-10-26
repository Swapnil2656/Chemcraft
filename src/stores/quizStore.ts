import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizQuestion, QuizSession, QuizAnswer, QuizSettings, QuizStats, Difficulty, QuizCategory } from '@/types/quiz';
import { QUIZ_QUESTIONS, DEFAULT_QUIZ_SETTINGS } from '@/constants/quizData';
import { generateQuizQuestionSafe, validateQuizInputs } from '@/lib/quizUtils';
import { ELEMENTS } from '@/constants/elements';
import { loadEnhancedQuizData } from '@/lib/enhancedQuizLoader';

interface QuizState {
  questions: QuizQuestion[];
  enhancedQuestions: QuizQuestion[];
  currentSession: QuizSession | null;
  stats: QuizStats;
  isLoading: boolean;
  isEnhancedLoaded: boolean;
  
  // Actions
  loadEnhancedQuestions: () => Promise<void>;
  startQuiz: (settings: QuizSettings) => void;
  submitAnswer: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  getQuestionsByCategory: (category: QuizCategory) => QuizQuestion[];
  getQuestionsByDifficulty: (difficulty: Difficulty) => QuizQuestion[];
  updateStats: (session: QuizSession) => void;
}

const initialStats: QuizStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  averageScore: 0,
  bestScore: 0,
  categoryStats: {} as Record<QuizCategory, any>,
  difficultyStats: {} as Record<Difficulty, any>,
  streak: 0,
  lastPlayedDate: new Date()
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: QUIZ_QUESTIONS,
      enhancedQuestions: [],
      currentSession: null,
      stats: initialStats,
      isLoading: false,
      isEnhancedLoaded: false,

      loadEnhancedQuestions: async () => {
        try {
          set({ isLoading: true });
          const enhancedQuestions = await loadEnhancedQuizData();
          // Loaded enhanced questions successfully
          set({ 
            enhancedQuestions, 
            isEnhancedLoaded: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('QuizStore: Failed to load enhanced questions:', error);
          set({ isLoading: false });
        }
      },

      startQuiz: (settings: QuizSettings) => {
        try {
          set({ isLoading: true });
          
          // TestSprite Enhancement: Validate inputs before quiz generation
          const validation = validateQuizInputs(ELEMENTS, (settings.difficulty[0] || 'medium') as "easy" | "medium" | "hard");
          if (!validation.isValid) {
            console.error('QuizStore: Invalid quiz settings:', validation.error);
            set({ isLoading: false });
            return;
          }
          
          const { questions, enhancedQuestions } = get();
          
          // Combine original and enhanced questions
          const allQuestions = [...questions, ...enhancedQuestions];
          // Using combined questions for quiz generation
          
          // Enhanced question generation with fallback to dynamic generation
          let filteredQuestions = allQuestions.filter(q => 
            settings.categories.includes(q.category) &&
            settings.difficulty.includes(q.difficulty)
          );
          
          // TestSprite Enhancement: Generate additional questions if needed
          const requiredQuestions = settings.numberOfQuestions;
          if (filteredQuestions.length < requiredQuestions) {
            // Generating additional questions dynamically
            
            for (let i = filteredQuestions.length; i < requiredQuestions; i++) {
              const difficultyLevel = settings.difficulty[i % settings.difficulty.length] as "easy" | "medium" | "hard";
              const generatedQuestion = generateQuizQuestionSafe(ELEMENTS, difficultyLevel);
              
              if (generatedQuestion) {
                filteredQuestions.push(generatedQuestion);
              } else {
                console.warn(`QuizStore: Failed to generate question ${i + 1}`);
                break; // Stop if generation fails
              }
            }
          }
          
          // Shuffle if random order is enabled
          if (settings.randomOrder) {
            filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
          }
          
          // Limit to requested number of questions
          filteredQuestions = filteredQuestions.slice(0, settings.numberOfQuestions);
          
          // TestSprite Enhancement: Ensure we have valid questions
          if (filteredQuestions.length === 0) {
            console.error('QuizStore: No valid questions available for selected settings');
            set({ isLoading: false });
            return;
          }
        
          const session: QuizSession = {
            id: Date.now().toString(),
            questions: filteredQuestions,
            currentQuestionIndex: 0,
            answers: [],
            score: 0,
            startTime: new Date(),
            timeSpent: 0,
            completed: false,
            settings
          };
          
          set({ currentSession: session, isLoading: false });
          // Quiz started successfully
          
        } catch (error) {
          console.error('QuizStore: Error starting quiz:', error);
          set({ isLoading: false, currentSession: null });
          
          // TestSprite Enhancement: Attempt fallback quiz creation
          try {
            // Attempting fallback quiz with minimal settings
            const { questions: fallbackQuestions } = get();
            const fallbackSession: QuizSession = {
              id: `fallback-${Date.now()}`,
              questions: fallbackQuestions.slice(0, Math.min(5, fallbackQuestions.length)), // Use first 5 questions as fallback
              currentQuestionIndex: 0,
              answers: [],
              score: 0,
              startTime: new Date(),
              timeSpent: 0,
              completed: false,
              settings: { ...DEFAULT_QUIZ_SETTINGS, numberOfQuestions: Math.min(5, fallbackQuestions.length) }
            };
            set({ currentSession: fallbackSession });
            // Fallback quiz created successfully
          } catch (fallbackError) {
            console.error('QuizStore: Fallback quiz creation also failed:', fallbackError);
          }
        }
      },

      submitAnswer: (answer: QuizAnswer) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const updatedSession = {
          ...currentSession,
          answers: [...currentSession.answers, answer],
          score: currentSession.score + answer.points
        };
        
        set({ currentSession: updatedSession });
      },

      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const nextIndex = currentSession.currentQuestionIndex + 1;
        const isCompleted = nextIndex >= currentSession.questions.length;
        
        const updatedSession = {
          ...currentSession,
          currentQuestionIndex: nextIndex,
          completed: isCompleted,
          endTime: isCompleted ? new Date() : undefined
        };
        
        set({ currentSession: updatedSession });
        
        if (isCompleted) {
          get().updateStats(updatedSession);
        }
      },

      endQuiz: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const updatedSession = {
          ...currentSession,
          completed: true,
          endTime: new Date()
        };
        
        set({ currentSession: updatedSession });
        get().updateStats(updatedSession);
      },

      resetQuiz: () => {
        set({ currentSession: null });
      },

      getQuestionsByCategory: (category: QuizCategory) => {
        const { questions, enhancedQuestions } = get();
        const allQuestions = [...questions, ...enhancedQuestions];
        return allQuestions.filter(q => q.category === category);
      },

      getQuestionsByDifficulty: (difficulty: Difficulty) => {
        const { questions, enhancedQuestions } = get();
        const allQuestions = [...questions, ...enhancedQuestions];
        return allQuestions.filter(q => q.difficulty === difficulty);
      },

      updateStats: (session: QuizSession) => {
        const { stats } = get();
        const correctAnswers = session.answers.filter(a => a.isCorrect).length;
        const totalQuestions = session.answers.length;
        const sessionScore = (correctAnswers / totalQuestions) * 100;
        
        const updatedStats: QuizStats = {
          ...stats,
          totalQuizzes: stats.totalQuizzes + 1,
          totalQuestions: stats.totalQuestions + totalQuestions,
          correctAnswers: stats.correctAnswers + correctAnswers,
          averageScore: ((stats.averageScore * stats.totalQuizzes) + sessionScore) / (stats.totalQuizzes + 1),
          bestScore: Math.max(stats.bestScore, sessionScore),
          streak: session.answers.every(a => a.isCorrect) ? stats.streak + 1 : 0,
          lastPlayedDate: new Date(),
          categoryStats: stats.categoryStats,
          difficultyStats: stats.difficultyStats
        };
        
        set({ stats: updatedStats });
      }
    }),
    {
      name: 'quiz-store',
      partialize: (state) => ({
        stats: state.stats
      })
    }
  )
);
