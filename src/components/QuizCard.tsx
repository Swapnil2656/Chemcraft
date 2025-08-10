'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, HelpCircle } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import { QuizQuestion, QuestionType } from '@/types/quiz';

// Apply progress bar width from data attribute
const applyProgressWidth = () => {
  const progressBars = document.querySelectorAll('.quiz-progress-bar[data-progress]');
  progressBars.forEach((bar) => {
    const htmlBar = bar as HTMLElement;
    const progress = htmlBar.dataset.progress;
    if (progress) {
      htmlBar.style.width = `${progress}%`;
    }
  });
};


interface QuizCardProps {
 question: QuizQuestion;
 currentIndex: number;
 totalQuestions: number;
 timeRemaining?: number;
 onAnswer: (answer: string | number) => void;
 onNext: () => void;
 onPrevious: () => void;
 onHint: () => void;
 canGoPrevious: boolean;
 canGoNext: boolean;
 showHint: boolean;
 hintsUsed: number;
}

export default function QuizCard({
 question,
 currentIndex,
 totalQuestions,
 timeRemaining,
 onAnswer,
 onNext,
 onPrevious,
 onHint,
 canGoPrevious,
 canGoNext,
 showHint,
 hintsUsed
}: QuizCardProps) {
 const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
 const [isAnswered, setIsAnswered] = useState(false);
 const [showExplanation, setShowExplanation] = useState(false);

 useEffect(() => {
   setSelectedAnswer('');
   setIsAnswered(false);
   setShowExplanation(false);
   applyProgressWidth();
 }, [question.id, currentIndex, totalQuestions]);

 const handleAnswerSelect = (answer: string | number) => {
   if (isAnswered) return;
   
   setSelectedAnswer(answer);
   setIsAnswered(true);
   
   onAnswer(answer);
   
   // Show explanation after a short delay
   setTimeout(() => {
     setShowExplanation(true);
   }, 1000);
 };

 const handleNext = () => {
   if (!isAnswered) {
     // Auto-submit empty answer
     handleAnswerSelect('');
   } else {
     onNext();
   }
 };

 const renderQuestionContent = () => {
   switch (question.type) {
     case QuestionType.MULTIPLE_CHOICE:
       return (
         <div className="space-y-3">
           {question.options?.map((option, index) => (
             <button
               key={index}
               onClick={() => handleAnswerSelect(option)}
               disabled={isAnswered}
               className={`w-full p-4 text-left rounded-lg border-2 ${
                 isAnswered
                   ? option === question.correctAnswer
                     ? 'border-green-500 bg-green-50 text-green-700 '
                     : option === selectedAnswer
                     ? 'border-red-500 bg-red-50 text-red-700 '
                     : 'border-gray-200 text-gray-500 '
                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 '
               }`}
             >
               <div className="flex items-center space-x-3">
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                   isAnswered && option === question.correctAnswer
                     ? 'border-green-500 bg-green-500 text-white'
                     : isAnswered && option === selectedAnswer && option !== question.correctAnswer
                     ? 'border-red-500 bg-red-500 text-white'
                     : 'border-gray-300 '
                 }`}>
                   {String.fromCharCode(65 + index)}
                 </div>
                 <span className="flex-1">{option}</span>
               </div>
             </button>
           ))}
         </div>
       );

     case QuestionType.TRUE_FALSE:
       return (
         <div className="space-y-3">
           {['True', 'False'].map((option) => (
             <button
               key={option}
               onClick={() => handleAnswerSelect(option.toLowerCase())}
               disabled={isAnswered}
               className={`w-full p-4 text-left rounded-lg border-2 ${
                 isAnswered
                   ? option.toLowerCase() === question.correctAnswer.toString()
                     ? 'border-green-500 bg-green-50 text-green-700 '
                     : option.toLowerCase() === selectedAnswer
                     ? 'border-red-500 bg-red-50 text-red-700 '
                     : 'border-gray-200 text-gray-500 '
                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 '
               }`}
             >
               {option}
             </button>
           ))}
         </div>
       );

     case QuestionType.FILL_IN_BLANK:
       return (
         <div className="space-y-4">
           <input
             type="text"
             placeholder="Enter your answer..."
             value={selectedAnswer}
             onChange={(e) => setSelectedAnswer(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && !isAnswered && handleAnswerSelect(selectedAnswer)}
             disabled={isAnswered}
             className={`w-full p-4 border-2 rounded-lg ${
               isAnswered
                 ? selectedAnswer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase()
                   ? 'border-green-500 bg-green-50 '
                   : 'border-red-500 bg-red-50 '
                 : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
             } bg-white text-gray-900 `}
           />
           {!isAnswered && (
             <button
               onClick={() => handleAnswerSelect(selectedAnswer)}
               disabled={!selectedAnswer.toString().trim()}
               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg"
             >
               Submit Answer
             </button>
           )}
         </div>
       );

     case QuestionType.NUMERIC:
       return (
         <div className="space-y-4">
           <input
             type="number"
             placeholder="Enter a number..."
             value={selectedAnswer}
             onChange={(e) => setSelectedAnswer(Number(e.target.value))}
             onKeyPress={(e) => e.key === 'Enter' && !isAnswered && handleAnswerSelect(selectedAnswer)}
             disabled={isAnswered}
             className={`w-full p-4 border-2 rounded-lg ${
               isAnswered
                 ? Number(selectedAnswer) === Number(question.correctAnswer)
                   ? 'border-green-500 bg-green-50 '
                   : 'border-red-500 bg-red-50 '
                 : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
             } bg-white text-gray-900 `}
           />
           {!isAnswered && (
             <button
               onClick={() => handleAnswerSelect(selectedAnswer)}
               disabled={selectedAnswer === ''}
               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg"
             >
               Submit Answer
             </button>
           )}
         </div>
       );

     default:
       return <div>Unsupported question type</div>;
   }
 };

 return (
   <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
     {/* Header */}
     <div className="flex items-center justify-between mb-6">
       <div className="flex items-center space-x-4">
         <div className="text-sm text-gray-500">
           Question {currentIndex + 1} of {totalQuestions}
         </div>
         <div className="text-sm text-gray-500">
           {question.difficulty} • {question.points} points
         </div>
       </div>
       
       {timeRemaining !== undefined && (
         <div className="flex items-center space-x-2 text-sm text-gray-600">
           <Clock className="h-4 w-4" />
           <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
         </div>
       )}
     </div>

     {/* Progress Bar */}
     <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
       <div 
         className="bg-blue-600 h-2 rounded-full quiz-progress-bar"
         data-progress={((currentIndex + 1) / totalQuestions) * 100}
       />
     </div>

     {/* Question */}
     <div className="mb-6">
       <h2 className="text-xl font-semibold text-gray-900 mb-4">
         {question.question}
       </h2>
       
       {/* Hint */}
       {showHint && question.hints && (
         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
           <div className="flex items-center space-x-2 mb-2">
             <HelpCircle className="h-4 w-4 text-yellow-600" />
             <span className="text-sm font-medium text-yellow-800">
               Hint {hintsUsed + 1}
             </span>
           </div>
           <p className="text-sm text-yellow-700">
             {question.hints[hintsUsed]}
           </p>
         </div>
       )}

       {renderQuestionContent()}
     </div>

     {/* Explanation */}
     {showExplanation && question.explanation && (
       <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
         <h3 className="font-semibold text-blue-900 mb-2">
           Explanation
         </h3>
         <p className="text-blue-800">
           {question.explanation}
         </p>
       </div>
     )}

     {/* Actions */}
     <div className="flex items-center justify-between">
       <div className="flex items-center space-x-2">
         <button
           onClick={onPrevious}
           disabled={!canGoPrevious}
           className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
         >
           <ChevronLeft className="h-4 w-4" />
           <span>Previous</span>
         </button>
         
         {question.hints && question.hints.length > hintsUsed && !isAnswered && (
           <button
             onClick={onHint}
             className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg"
           >
             <HelpCircle className="h-4 w-4" />
             <span>Hint</span>
           </button>
         )}
       </div>
       
       <button
         onClick={handleNext}
         className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
       >
         <span>{currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
         <ChevronRight className="h-4 w-4" />
       </button>
     </div>
   </div>
 );
}