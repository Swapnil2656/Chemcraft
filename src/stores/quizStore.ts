import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizQuestion, QuizSession, QuizAnswer, QuizSettings, QuizStats, Difficulty, QuizCategory } from '@/types/quiz';
import { QUIZ_QUESTIONS, DEFAULT_QUIZ_SETTINGS } from '@/constants/quizData';

interface QuizState {
  questions: QuizQuestion[];
  currentSession: QuizSession | null;
  stats: QuizStats;
  isLoading: boolean;
  
  // Actions
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
      currentSession: null,
      stats: initialStats,
      isLoading: false,

      startQuiz: (settings: QuizSettings) => {
        const { questions } = get();
        
        // Filter questions based on settings
        let filteredQuestions = questions.filter(q => 
          settings.categories.includes(q.category) &&
          settings.difficulty.includes(q.difficulty)
        );
        
        // Shuffle if random order is enabled
        if (settings.randomOrder) {
          filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
        }
        
        // Limit to requested number of questions
        filteredQuestions = filteredQuestions.slice(0, settings.numberOfQuestions);
        
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
        
        set({ currentSession: session });
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
        const { questions } = get();
        return questions.filter(q => q.category === category);
      },

      getQuestionsByDifficulty: (difficulty: Difficulty) => {
        const { questions } = get();
        return questions.filter(q => q.difficulty === difficulty);
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
