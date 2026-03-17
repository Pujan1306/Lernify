import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { quizService } from '../../../services/quizService';
import { sileo } from 'sileo';

interface QuizTakerProps {
  quizId: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function QuizTaker({ quizId, onComplete, onBack }: QuizTakerProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        if (response.success) {
          setQuiz(response.data);
        }
      } catch (error) {
        sileo.error({title: error instanceof Error ? error.message : 'Failed to fetch quiz'});
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (optionIndex: number) => {
    // The backend expects "01", "02", "03", "04"
    const formattedAnswer = `0${optionIndex + 1}`;
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: formattedAnswer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qIndex, selectedAnswer]) => ({
        questionIndex: parseInt(qIndex),
        selectedAnswer
      }));

      const response = await quizService.submitQuiz(quizId, formattedAnswers);
      if (response.success) {
        onComplete();
      } 
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to submit quiz'});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!quiz) return <div>Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / quiz.totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border font-medium hover:bg-muted transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Quizzes
      </button>
      
      <div className="flex items-center justify-between text-sm font-medium mb-2">
        <span>Question {currentQuestionIndex + 1} of {quiz.totalQuestions}</span>
        <span>{answeredCount} answered</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 mb-8 overflow-hidden">
        <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
        <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-sm font-semibold mb-6">
          Question {currentQuestionIndex + 1}
        </div>
        
        <h2 className="text-xl font-bold mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option: string, index: number) => {
            const optionValue = `0${index + 1}`;
            const isSelected = answers[currentQuestionIndex] === optionValue;
            
            return (
              <div 
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-primary' : 'border-muted-foreground'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className="text-foreground">{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-2">
          {quiz.questions.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-xl font-medium flex items-center justify-center transition-colors ${
                currentQuestionIndex === idx 
                  ? 'bg-primary text-white' 
                  : answers[idx] 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.totalQuestions - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount < quiz.totalQuestions}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.totalQuestions - 1, prev + 1))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}