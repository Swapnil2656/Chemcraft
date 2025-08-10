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
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to take quizzes</h2>
        <p className="text-gray-600 mb-6">You need to be signed in to take quizzes and track your progress.</p>
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
    <div className="min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Chemistry Quiz
        </h1>
        <p className="text-xl text-gray-600">
          Test your knowledge and master chemistry concepts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Stats
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">Total Quizzes</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.totalQuizzes}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Questions Answered</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.totalQuestions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Average Score</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.averageScore.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">Best Score</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.bestScore.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-700">Current Streak</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.streak}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Start New Quiz
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <BookOpen className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Start
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleStartQuiz}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                >
                  <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900">
                    Standard Quiz
                  </div>
                  <div className="text-sm text-blue-700">
                    {settings.numberOfQuestions} questions • Mixed difficulty
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSettings(prev => ({ ...prev, difficulty: [Difficulty.EASY] }));
                    handleStartQuiz();
                  }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                >
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-900">
                    Easy Quiz
                  </div>
                  <div className="text-sm text-green-700">
                    {settings.numberOfQuestions} questions • Easy only
                  </div>
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quiz Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions: {settings.numberOfQuestions}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={settings.numberOfQuestions}
                      onChange={(e) => updateSettings('numberOfQuestions', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>5</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Levels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(DIFFICULTY_SETTINGS).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => toggleDifficulty(key as Difficulty)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            settings.difficulty.includes(key as Difficulty)
                              ? 'text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(QUIZ_CATEGORIES_INFO).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => toggleCategory(key as QuizCategory)}
                          className={`p-2 rounded-lg text-sm font-medium text-left border ${
                            settings.categories.includes(key as QuizCategory)
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
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
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Enable hints
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.showExplanations}
                        onChange={(e) => updateSettings('showExplanations', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Show explanations after answers
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.randomOrder}
                        onChange={(e) => updateSettings('randomOrder', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
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
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 border border-gray-200 max-w-md w-full text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg">Score: <span className="font-bold text-blue-600">{score.toFixed(1)}%</span></p>
            <p>Correct: {currentSession.answers.filter(a => a.isCorrect).length}/{currentSession.answers.length}</p>
            <p>Total Points: {currentSession.score}</p>
          </div>
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Score: {currentSession.score} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
              style={{ backgroundColor: DIFFICULTY_SETTINGS[currentQuestion.difficulty].color }}
            >
              {DIFFICULTY_SETTINGS[currentQuestion.difficulty].name}
            </span>
            <span className="text-sm text-gray-600">
              {currentQuestion.points} points
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
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
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    selectedAnswer === 'true'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  True
                </button>
                <button
                  onClick={() => setSelectedAnswer('false')}
                  disabled={showExplanation}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    selectedAnswer === 'false'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter your answer..."
              />
            )}
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg mb-4 ${
              selectedAnswer.toString().toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase()
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="font-medium mb-2">
                {selectedAnswer.toString().toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase()
                  ? '✅ Correct!'
                  : `❌ Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
                }
              </p>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              End Quiz
            </button>
            
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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