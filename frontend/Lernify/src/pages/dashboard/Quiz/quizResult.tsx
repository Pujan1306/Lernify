import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, CheckCircle2, XCircle, BookOpen, Loader2 } from 'lucide-react';
import { quizService } from '../../../services/quizService';

interface QuizResultsProps {
  quizId: string;
  onBack: () => void;
}

export default function QuizResults({ quizId, onBack }: QuizResultsProps) {
  const [resultsData, setResultsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        if (response.success) {
          setResultsData(response);
        }
      } catch (error) {
        console.error("Failed to fetch quiz results", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!resultsData) return <div>Results not found</div>;

  const { data: summary, results } = resultsData;
  const percentage = Math.round(summary.score);
  const incorrectCount = summary.totalQuestions - summary.correctCount;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Document
      </button>

      <h1 className="text-2xl font-bold">Quiz Results</h1>

      {/* Score Card */}
      <div className="bg-card rounded-4xl border border-border/50 p-10 flex flex-col items-center justify-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <div className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-2">Your Score</div>
        <div className="text-6xl font-black text-primary mb-2">{percentage}%</div>
        <div className="text-lg font-medium text-foreground mb-8">
          {percentage >= 90 ? 'Outstanding!' : percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl border border-border bg-muted/30 text-sm font-medium flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            </div>
            {summary.totalQuestions} Total
          </div>
          <div className="px-4 py-2 rounded-xl border border-green-200 dark:border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {summary.correctCount} Correct
          </div>
          <div className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {incorrectCount} Incorrect
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Detailed Review
        </h2>

        {results.map((item: any, idx: number) => (
          <div key={idx} className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="inline-block bg-muted text-muted-foreground px-4 py-1.5 rounded-lg text-sm font-semibold">
                Question {idx + 1}
              </div>
              {item.isCorrect ? (
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold mb-6">{item.question}</h3>

            <div className="space-y-3 mb-6">
              {item.options.map((option: string, optIdx: number) => {
                const optionValue = `0${optIdx + 1}`;
                const isSelected = item.selectedOption === optionValue;
                const isCorrectAnswer = item.correctAnswer === optionValue;
                
                let borderClass = "border-border/50";
                let bgClass = "";
                let textClass = "text-foreground";
                let icon = null;

                if (isCorrectAnswer) {
                  borderClass = "border-green-500 dark:border-green-400";
                  bgClass = "bg-green-50 dark:bg-green-950/30";
                  icon = <div className="flex items-center gap-1 text-green-700 dark:text-green-400 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Correct</div>;
                } else if (isSelected && !item.isCorrect) {
                  borderClass = "border-red-500 dark:border-red-400";
                  bgClass = "bg-red-50 dark:bg-red-950/30";
                  icon = <div className="flex items-center gap-1 text-red-700 dark:text-red-400 text-sm font-medium"><XCircle className="w-4 h-4" /> Incorrect</div>;
                }

                return (
                  <div key={optIdx} className={`p-4 rounded-xl border-2 flex items-center justify-between ${borderClass} ${bgClass}`}>
                    <span className={textClass}>{option}</span>
                    {icon}
                  </div>
                );
              })}
            </div>

            {item.explanation && (
              <div className="bg-muted/50 rounded-xl p-5 border border-border/50 flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-1">Explanation</div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
