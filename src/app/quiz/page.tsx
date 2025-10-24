'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Play, Trophy, Clock, BookOpen, Star, Target } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import { QuizSettings, Difficulty, QuizCategory, QuestionType } from '@/types/quiz';
import { DEFAULT_QUIZ_SETTINGS, QUIZ_CATEGORIES_INFO, DIFFICULTY_SETTINGS } from '@/constants/quizData';

export default function QuizPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { currentSession, stats, startQuiz } = useQuizStore();
  const [settings, setSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const handleStartQuiz = () => {
    startQuiz(settings);
  };

  const updateSettings = (key: keyof QuizSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSettings(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty]
    }));
  };

  const toggleCategory = (category: QuizCategory) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-900 dark:text-slate-100 transition-colors duration-300">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100 transition-colors duration-300">Sign in to take quizzes</h2>
        <p className="text-gray-600 dark:text-slate-300 mb-6 transition-colors duration-300">You need to be signed in to take quizzes and track your progress.</p>
        <SignInButton mode="modal">
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  if (currentSession) {
    return <QuizSession />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30 px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16 transition-all duration-300 ease-in-out">
      <div className="text-center mb-8">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-200/20 shadow-lg shadow-black/5 mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-all duration-300 ease-in-out">
            Chemistry Quiz
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out">
            Test your knowledge and master chemistry concepts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 transition-all duration-300 ease-in-out">
              Your Stats
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Total Quizzes</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  {stats.totalQuizzes}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Questions Answered</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  {stats.totalQuestions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Average Score</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  {stats.averageScore.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Best Score</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  {stats.bestScore.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Current Streak</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  {stats.streak}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">
                Start New Quiz
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-gray-900 dark:text-slate-100 transition-colors duration-300"
              >
                <BookOpen className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                Quick Start
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleStartQuiz}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300"
                >
                  <Play className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900 dark:text-blue-100 transition-colors duration-300">
                    Standard Quiz
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-300">
                    {settings.numberOfQuestions} questions • Mixed difficulty
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSettings(prev => ({ ...prev, difficulty: [Difficulty.EASY] }));
                    handleStartQuiz();
                  }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300"
                >
                  <Star className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="font-semibold text-green-900 dark:text-green-100 transition-colors duration-300">
                    Easy Quiz
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 transition-colors duration-300">
                    {settings.numberOfQuestions} questions • Easy only
                  </div>
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-gray-200 dark:border-slate-600 pt-6 transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Quiz Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                      Number of Questions: {settings.numberOfQuestions}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={settings.numberOfQuestions}
                      onChange={(e) => updateSettings('numberOfQuestions', parseInt(e.target.value))}
                      className="w-full accent-blue-600 dark:accent-blue-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">
                      <span>5</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                      Difficulty Levels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(DIFFICULTY_SETTINGS).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => toggleDifficulty(key as Difficulty)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                            settings.difficulty.includes(key as Difficulty)
                              ? 'text-white'
                              : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                          }`}
                          style={{
                            backgroundColor: settings.difficulty.includes(key as Difficulty) 
                              ? info.color 
                              : undefined
                          }}
                        >
                          {info.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(QUIZ_CATEGORIES_INFO).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => toggleCategory(key as QuizCategory)}
                          className={`p-2 rounded-lg text-sm font-medium text-left border transition-colors duration-300 ${
                            settings.categories.includes(key as QuizCategory)
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                              : 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {info.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.hintsEnabled}
                        onChange={(e) => updateSettings('hintsEnabled', e.target.checked)}
                        className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300 transition-colors duration-300">
                        Enable hints
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.showExplanations}
                        onChange={(e) => updateSettings('showExplanations', e.target.checked)}
                        className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300 transition-colors duration-300">
                        Show explanations after answers
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.randomOrder}
                        onChange={(e) => updateSettings('randomOrder', e.target.checked)}
                        className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300 transition-colors duration-300">
                        Random question order
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                <Play className="h-5 w-5" />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizSession() {
  const { currentSession, submitAnswer, nextQuestion, endQuiz, resetQuiz } = useQuizStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showExplanation, setShowExplanation] = useState(false);

  if (!currentSession) return null;

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer.toString().toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase();
    const points = isCorrect ? currentQuestion.points : 0;
    
    const answer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: 30,
      hintsUsed: 0,
      points
    };
    
    submitAnswer(answer);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      endQuiz();
    } else {
      nextQuestion();
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  if (currentSession.completed) {
    const score = (currentSession.answers.filter(a => a.isCorrect).length / currentSession.answers.length) * 100;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30 px-4 transition-all duration-300 ease-in-out">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 max-w-md w-full text-center transition-all duration-300 ease-in-out">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-900 dark:text-slate-100 transition-colors duration-300">Score: <span className="font-bold text-blue-600 dark:text-blue-400">{score.toFixed(1)}%</span></p>
            <p className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Correct: {currentSession.answers.filter(a => a.isCorrect).length}/{currentSession.answers.length}</p>
            <p className="text-gray-700 dark:text-slate-300 transition-colors duration-300">Total Points: {currentSession.score}</p>
          </div>
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30 transition-all duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-200/20 shadow-lg shadow-black/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out">
              Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out">
              Score: {currentSession.score} points
            </span>
          </div>
          <div className="w-full bg-white/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-full h-3 border border-white/30 dark:border-slate-200/30">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 mb-6 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
              style={{ backgroundColor: DIFFICULTY_SETTINGS[currentQuestion.difficulty].color }}
            >
              {DIFFICULTY_SETTINGS[currentQuestion.difficulty].name}
            </span>
            <span className="text-sm text-gray-600 dark:text-slate-300 transition-colors duration-300">
              {currentQuestion.points} points
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 transition-colors duration-300">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 text-gray-900 dark:text-slate-100 transition-colors duration-300 ${
                  selectedAnswer === option
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
            
            {currentQuestion.type === QuestionType.TRUE_FALSE && (
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedAnswer('true')}
                  disabled={showExplanation}
                  className={`flex-1 p-4 rounded-lg border-2 text-gray-900 dark:text-slate-100 transition-colors duration-300 ${
                    selectedAnswer === 'true'
                      ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
                  }`}
                >
                  True
                </button>
                <button
                  onClick={() => setSelectedAnswer('false')}
                  disabled={showExplanation}
                  className={`flex-1 p-4 rounded-lg border-2 text-gray-900 dark:text-slate-100 transition-colors duration-300 ${
                    selectedAnswer === 'false'
                      ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
                  }`}
                >
                  False
                </button>
              </div>
            )}
            
            {(currentQuestion.type === QuestionType.FILL_IN_BLANK || currentQuestion.type === QuestionType.NUMERIC) && (
              <input
                type={currentQuestion.type === QuestionType.NUMERIC ? 'number' : 'text'}
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showExplanation}
                className="w-full p-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
                placeholder="Enter your answer..."
              />
            )}
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
              selectedAnswer.toString().toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase()
                ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}>
              <p className="font-medium mb-2 text-gray-900 dark:text-slate-100 transition-colors duration-300">
                {selectedAnswer.toString().toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase()
                  ? '✅ Correct!'
                  : `❌ Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
                }
              </p>
              <p className="text-sm text-gray-700 dark:text-slate-300 transition-colors duration-300">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors duration-300"
            >
              End Quiz
            </button>
            
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}