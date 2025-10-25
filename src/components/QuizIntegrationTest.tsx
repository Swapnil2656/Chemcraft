'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/stores/quizStore';
import { getEnhancedQuizMetadata } from '@/lib/enhancedQuizLoader';

interface QuizMetadata {
  total_questions: number;
  difficulty_distribution: { easy: number; medium: number; hard: number };
  types_included: string[];
  factual_accuracy_required: boolean;
  ai_generated: boolean;
  unique_questions_only: boolean;
}

export default function QuizIntegrationTest() {
  const { 
    enhancedQuestions, 
    isEnhancedLoaded, 
    loadEnhancedQuestions, 
    questions: originalQuestions 
  } = useQuizStore();
  
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Load enhanced questions and metadata
    if (!isEnhancedLoaded) {
      loadEnhancedQuestions();
    }
    
    getEnhancedQuizMetadata().then(setMetadata);
  }, [isEnhancedLoaded, loadEnhancedQuestions]);

  useEffect(() => {
    if (isEnhancedLoaded && enhancedQuestions.length > 0) {
      runIntegrationTests();
    }
  }, [isEnhancedLoaded, enhancedQuestions]);

  const runIntegrationTests = () => {
    const results: string[] = [];
    
    // Test 1: Enhanced questions loaded
    results.push(`✅ Enhanced questions loaded: ${enhancedQuestions.length} questions`);
    
    // Test 2: Original questions still available
    results.push(`✅ Original questions available: ${originalQuestions.length} questions`);
    
    // Test 3: Total questions count
    const totalQuestions = originalQuestions.length + enhancedQuestions.length;
    results.push(`✅ Total questions available: ${totalQuestions} questions`);
    
    // Test 4: Question type distribution
    const types = new Set(enhancedQuestions.map(q => q.type));
    results.push(`✅ Question types found: ${Array.from(types).join(', ')}`);
    
    // Test 5: Difficulty distribution
    const difficulties = enhancedQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    results.push(`✅ Difficulty distribution: ${JSON.stringify(difficulties)}`);
    
    // Test 6: Category distribution
    const categories = enhancedQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    results.push(`✅ Category distribution: ${JSON.stringify(categories)}`);
    
    // Test 7: Validate question structure
    const invalidQuestions = enhancedQuestions.filter(q => 
      !q.id || !q.question || !q.correctAnswer || !q.explanation
    );
    if (invalidQuestions.length === 0) {
      results.push(`✅ All questions have valid structure`);
    } else {
      results.push(`❌ Found ${invalidQuestions.length} questions with invalid structure`);
    }
    
    // Test 8: Reaction prediction questions
    const reactionQuestions = enhancedQuestions.filter(q => q.type === 'reaction-prediction');
    results.push(`✅ Reaction prediction questions: ${reactionQuestions.length}`);
    
    setTestResults(results);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100">
        Quiz Integration Test Results
      </h2>
      
      {metadata && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Enhanced Quiz Metadata
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p><strong>Total Questions:</strong> {metadata.total_questions}</p>
            <p><strong>Difficulty Distribution:</strong> Easy: {metadata.difficulty_distribution.easy}, Medium: {metadata.difficulty_distribution.medium}, Hard: {metadata.difficulty_distribution.hard}</p>
            <p><strong>Question Types:</strong> {metadata.types_included.join(', ')}</p>
            <p><strong>AI Generated:</strong> {metadata.ai_generated ? 'Yes' : 'No'}</p>
            <p><strong>Factual Accuracy Required:</strong> {metadata.factual_accuracy_required ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-100">
          Integration Test Results
        </h3>
        {testResults.length === 0 ? (
          <p className="text-gray-600 dark:text-slate-400">Running tests...</p>
        ) : (
          testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${
                result.startsWith('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}
            >
              {result}
            </div>
          ))
        )}
      </div>
      
      {enhancedQuestions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-100">
            Sample Enhanced Questions
          </h3>
          <div className="space-y-3">
            {enhancedQuestions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="p-3 bg-white dark:bg-slate-600 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {question.type} • {question.difficulty} • {question.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {question.points} pts
                  </span>
                </div>
                <p className="text-gray-900 dark:text-slate-100 mb-2">{question.question}</p>
                {question.options && (
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    Options: {question.options.join(', ')}
                  </div>
                )}
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Answer: {question.correctAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}