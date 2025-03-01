
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "In a team setting, I prefer to:",
    options: ["Take charge and lead", "Collaborate and support", "Work independently", "Adapt to what's needed"]
  },
  {
    id: 2,
    text: "When facing a challenging situation, I typically:",
    options: ["Plan methodically before acting", "Jump in and figure it out as I go", "Consult with others for their input", "Look for creative alternative solutions"]
  },
  {
    id: 3,
    text: "I communicate most effectively by:",
    options: ["Being direct and to the point", "Listening first, then responding thoughtfully", "Using visual aids and examples", "Adapting my style to the audience"]
  },
  {
    id: 4,
    text: "When learning new skills, I prefer to:",
    options: ["Follow established procedures step by step", "Understand the big picture first, then details", "Learn through hands-on practice", "Discuss concepts with others"]
  },
  {
    id: 5,
    text: "Under pressure, I tend to:",
    options: ["Remain calm and methodical", "Become more focused and efficient", "Seek support from others", "Take a moment to step back and reassess"]
  }
];

const PersonalityAssessment = () => {
  const [responses, setResponses] = useState<{[key: number]: string}>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  
  const handleOptionSelect = (questionId: number, option: string) => {
    setResponses({
      ...responses,
      [questionId]: option
    });
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setAssessmentComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    console.log('Personality Assessment Responses:', responses);
    toast({
      title: "Assessment Submitted",
      description: "Your personality assessment has been saved to your profile.",
    });
    // Here you would typically send this data to your backend
  };
  
  const isOptionSelected = (questionId: number, option: string) => {
    return responses[questionId] === option;
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = !!responses[currentQuestion.id];
  const allQuestionsAnswered = questions.every(q => !!responses[q.id]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg 
            className="h-5 w-5 mr-2 text-primary" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Personality Assessment
        </h2>
        
        {!assessmentComplete ? (
          <>
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-sm text-gray-500 text-right">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    className={`p-4 rounded-lg border ${
                      isOptionSelected(currentQuestion.id, option) 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } cursor-pointer transition-colors`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${
                        isOptionSelected(currentQuestion.id, option)
                          ? 'border-primary'
                          : 'border-gray-300'
                      } flex items-center justify-center mr-3`}>
                        {isOptionSelected(currentQuestion.id, option) && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Assessment Complete!</h3>
              <p>You've answered all {questions.length} questions.</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-700">Your responses have been recorded. These insights will help match you with suitable positions that align with your work style and preferences.</p>
              
              <Button
                onClick={handleSubmit}
                className="px-6"
              >
                Save Results to Profile
              </Button>
            </div>
            
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  setAssessmentComplete(false);
                  setCurrentQuestionIndex(0);
                }}
                className="text-primary hover:underline text-sm"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityAssessment;
